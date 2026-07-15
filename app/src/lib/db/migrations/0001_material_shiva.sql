CREATE SCHEMA "audit";
--> statement-breakpoint
CREATE TABLE "audit"."audit_events" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"occurred_at" timestamp with time zone DEFAULT now() NOT NULL,
	"action" text NOT NULL,
	"actor_type" text NOT NULL,
	"actor_user_id" uuid,
	"target_type" text,
	"target_id" text,
	"correlation_id" text,
	"summary" text,
	"metadata" jsonb DEFAULT '{}'::jsonb NOT NULL,
	CONSTRAINT "audit_events_actor_type_check" CHECK ("audit"."audit_events"."actor_type" in ('user', 'system'))
);
