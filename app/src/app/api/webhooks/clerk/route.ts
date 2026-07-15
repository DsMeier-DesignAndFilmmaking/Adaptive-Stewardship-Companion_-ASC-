import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { Webhook } from "svix";
import { AUDIT_ACTIONS, recordAuditEvent, safeAudit, systemActor } from "@/lib/audit";
import {
  findAuthUserByClerkId,
  provisionUser,
  softDeleteUser,
  updateUserEmail,
} from "@/lib/db/users";

// Clerk -> Neon lifecycle sync (ADR-002 broker). E1 handles ONLY user events;
// organization/membership events are deferred. The endpoint is public but
// authenticated by Svix signature verification (security §8) — never by session.

type ClerkEmailAddress = { id: string; email_address: string };
type ClerkUserData = {
  id: string;
  email_addresses?: ClerkEmailAddress[];
  primary_email_address_id?: string | null;
};
type ClerkWebhookEvent = { type: string; data: ClerkUserData };

function primaryEmail(data: ClerkUserData): string | null {
  const list = data.email_addresses ?? [];
  const primary = list.find((e) => e.id === data.primary_email_address_id);
  return primary?.email_address ?? list[0]?.email_address ?? null;
}

export async function POST(req: Request) {
  const secret = process.env.CLERK_WEBHOOK_SIGNING_SECRET;
  if (!secret) {
    return NextResponse.json(
      { error: "CLERK_WEBHOOK_SIGNING_SECRET not configured" },
      { status: 500 },
    );
  }

  const h = await headers();
  const svixId = h.get("svix-id");
  const svixTimestamp = h.get("svix-timestamp");
  const svixSignature = h.get("svix-signature");
  if (!svixId || !svixTimestamp || !svixSignature) {
    return NextResponse.json({ error: "missing svix headers" }, { status: 400 });
  }

  const payload = await req.text();
  let event: ClerkWebhookEvent;
  try {
    event = new Webhook(secret).verify(payload, {
      "svix-id": svixId,
      "svix-timestamp": svixTimestamp,
      "svix-signature": svixSignature,
    }) as ClerkWebhookEvent;
  } catch {
    return NextResponse.json({ error: "invalid signature" }, { status: 401 });
  }

  switch (event.type) {
    case "user.created": {
      // provisionUser audits internally (source: "webhook"), exactly once per
      // genuine creation — no separate audit call needed here (F5).
      await provisionUser(event.data.id, primaryEmail(event.data), "webhook");
      break;
    }
    case "user.updated": {
      await updateUserEmail(event.data.id, primaryEmail(event.data));
      const u = await findAuthUserByClerkId(event.data.id);
      if (u) {
        await safeAudit(() =>
          recordAuditEvent({
            action: AUDIT_ACTIONS.IdentityUserUpdated,
            actor: systemActor(),
            targetType: "user",
            targetId: u.userId,
            summary: "User updated from Clerk user.updated",
          }),
        );
      }
      break;
    }
    case "user.deleted": {
      // Resolve the ASC user id before soft-delete (the row is retained).
      const u = await findAuthUserByClerkId(event.data.id);
      await softDeleteUser(event.data.id);
      if (u) {
        await safeAudit(() =>
          recordAuditEvent({
            action: AUDIT_ACTIONS.IdentityUserDeleted,
            actor: systemActor(),
            targetType: "user",
            targetId: u.userId,
            summary: "User soft-deleted from Clerk user.deleted",
          }),
        );
      }
      break;
    }
    default:
      // Ignore non-user events (organization events are deferred in E1).
      break;
  }

  return NextResponse.json({ received: true });
}
