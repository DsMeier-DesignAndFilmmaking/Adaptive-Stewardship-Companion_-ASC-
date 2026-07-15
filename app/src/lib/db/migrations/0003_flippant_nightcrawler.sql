CREATE SCHEMA "recommendation";
--> statement-breakpoint
CREATE TABLE "recommendation"."recommendation_overrides" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"recommendation_id" uuid NOT NULL,
	"actor_user_id" uuid NOT NULL,
	"reason" text NOT NULL,
	"category" text NOT NULL,
	"policy_driven" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "recommendation_overrides_category_check" CHECK ("recommendation"."recommendation_overrides"."category" in ('bad-input', 'missing-context', 'bad-reasoning', 'changed-conditions', 'preference'))
);
--> statement-breakpoint
CREATE TABLE "recommendation"."recommendations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"lifecycle_state" text DEFAULT 'draft' NOT NULL,
	"action" text NOT NULL,
	"attention" text NOT NULL,
	"title" text NOT NULL,
	"short_reason" text NOT NULL,
	"confidence_level" text DEFAULT 'unknown' NOT NULL,
	"confidence_reason" text,
	"explanation" text,
	"explanation_source" text DEFAULT 'deterministic' NOT NULL,
	"rule_trace" jsonb DEFAULT '{"rules":[]}'::jsonb NOT NULL,
	"evidence" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"missing_evidence" text,
	"alternative" text,
	"visitor_view" text,
	"stewardship_view" text,
	"decision_owner_user_id" uuid,
	"landscape_area_id" uuid,
	"version" integer DEFAULT 1 NOT NULL,
	"reviewed_by_user_id" uuid,
	"reviewed_at" timestamp with time zone,
	"executed_at" timestamp with time zone,
	"archived_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "recommendations_lifecycle_state_check" CHECK ("recommendation"."recommendations"."lifecycle_state" in ('draft', 'generated', 'reviewed', 'accepted', 'rejected', 'executed', 'archived')),
	CONSTRAINT "recommendations_action_check" CHECK ("recommendation"."recommendations"."action" in ('open', 'promote', 'rest', 'restrict', 'close')),
	CONSTRAINT "recommendations_confidence_check" CHECK ("recommendation"."recommendations"."confidence_level" in ('high', 'medium', 'low', 'unknown')),
	CONSTRAINT "recommendations_attention_check" CHECK ("recommendation"."recommendations"."attention" in ('critical', 'monitor', 'opportunity'))
);
--> statement-breakpoint
ALTER TABLE "recommendation"."recommendation_overrides" ADD CONSTRAINT "recommendation_overrides_recommendation_id_recommendations_id_fk" FOREIGN KEY ("recommendation_id") REFERENCES "recommendation"."recommendations"("id") ON DELETE cascade ON UPDATE no action;