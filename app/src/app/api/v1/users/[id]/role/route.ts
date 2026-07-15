import { ok, withRole } from "@/lib/api";
import { changeUserRole } from "@/lib/user/service";

// Owner-only role grant/change (ADR-003 permission matrix footnote 1:
// "Membership + role grants are Owner-only at MVP — privilege-escalation
// control"). A dedicated single-field sub-resource rather than a general user
// PATCH, which doesn't exist and shouldn't yet — this keeps the change
// minimal and gives a specific, greppable route for any future step-up-auth
// gate. Replaces the F1.5-era manual-SQL-only elevation path (DRIFT-5/TD-6).
export const PATCH = withRole(
  "owner",
  async (req, rc, { ctx, correlationId }) => {
    const { id } = await rc.params;
    const body = await req.json().catch(() => ({}));
    return ok(await changeUserRole(ctx, String(id), body, correlationId));
  },
);
