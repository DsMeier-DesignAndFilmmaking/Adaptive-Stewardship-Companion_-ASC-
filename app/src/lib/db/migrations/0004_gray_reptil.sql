CREATE SCHEMA "observation";
--> statement-breakpoint
CREATE SCHEMA "property";
--> statement-breakpoint
CREATE TABLE "observation"."observations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"landscape_area_id" uuid NOT NULL,
	"staff_member_id" uuid,
	"observation_type" text DEFAULT 'condition' NOT NULL,
	"notes" text,
	"observed_at" timestamp with time zone DEFAULT now() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "observations_type_check" CHECK ("observation"."observations"."observation_type" in ('condition', 'wildlife', 'visitor', 'hazard', 'maintenance', 'other'))
);
--> statement-breakpoint
CREATE TABLE "property"."landscape_areas" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"property_id" uuid NOT NULL,
	"name" text NOT NULL,
	"area_type" text DEFAULT 'other' NOT NULL,
	"status" text DEFAULT 'open' NOT NULL,
	"metadata" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "landscape_areas_area_type_check" CHECK ("property"."landscape_areas"."area_type" in ('trail', 'zone', 'habitat', 'water', 'viewpoint', 'route', 'other')),
	CONSTRAINT "landscape_areas_status_check" CHECK ("property"."landscape_areas"."status" in ('open', 'restricted', 'closed', 'resting'))
);
--> statement-breakpoint
CREATE TABLE "property"."properties" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"status" text DEFAULT 'active' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "properties_status_check" CHECK ("property"."properties"."status" in ('active', 'inactive', 'archived'))
);
--> statement-breakpoint
CREATE TABLE "property"."staff_members" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid,
	"display_name" text NOT NULL,
	"role" text DEFAULT 'staff' NOT NULL,
	"status" text DEFAULT 'active' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "staff_members_role_check" CHECK ("property"."staff_members"."role" in ('owner', 'manager', 'staff', 'viewer')),
	CONSTRAINT "staff_members_status_check" CHECK ("property"."staff_members"."status" in ('active', 'inactive'))
);
--> statement-breakpoint
ALTER TABLE "recommendation"."recommendations" ADD COLUMN "decision_owner_staff_member_id" uuid;--> statement-breakpoint
ALTER TABLE "observation"."observations" ADD CONSTRAINT "observations_landscape_area_id_landscape_areas_id_fk" FOREIGN KEY ("landscape_area_id") REFERENCES "property"."landscape_areas"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "observation"."observations" ADD CONSTRAINT "observations_staff_member_id_staff_members_id_fk" FOREIGN KEY ("staff_member_id") REFERENCES "property"."staff_members"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "property"."landscape_areas" ADD CONSTRAINT "landscape_areas_property_id_properties_id_fk" FOREIGN KEY ("property_id") REFERENCES "property"."properties"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "property"."staff_members" ADD CONSTRAINT "staff_members_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "identity"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "observations_landscape_area_id_idx" ON "observation"."observations" USING btree ("landscape_area_id");--> statement-breakpoint
CREATE INDEX "observations_staff_member_id_idx" ON "observation"."observations" USING btree ("staff_member_id");--> statement-breakpoint
CREATE INDEX "landscape_areas_property_id_idx" ON "property"."landscape_areas" USING btree ("property_id");--> statement-breakpoint
CREATE UNIQUE INDEX "staff_members_user_id_unique" ON "property"."staff_members" USING btree ("user_id");--> statement-breakpoint
ALTER TABLE "recommendation"."recommendations" ADD CONSTRAINT "recommendations_decision_owner_staff_member_id_staff_members_id_fk" FOREIGN KEY ("decision_owner_staff_member_id") REFERENCES "property"."staff_members"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "recommendation"."recommendations" ADD CONSTRAINT "recommendations_landscape_area_id_landscape_areas_id_fk" FOREIGN KEY ("landscape_area_id") REFERENCES "property"."landscape_areas"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "recommendations_landscape_area_id_idx" ON "recommendation"."recommendations" USING btree ("landscape_area_id");--> statement-breakpoint
CREATE INDEX "recommendations_decision_owner_staff_member_id_idx" ON "recommendation"."recommendations" USING btree ("decision_owner_staff_member_id");