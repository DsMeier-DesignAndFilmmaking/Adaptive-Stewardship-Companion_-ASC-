-- Custom SQL migration file, put your code below! --

-- Last-owner lockout guard (F5). Only an Owner may grant/change roles
-- (ADR-003 permission matrix footnote 1), so if the count of owners ever hits
-- zero the system becomes permanently unmanageable through the app. The
-- service-layer check in lib/user/service.ts's changeUserRole() is the fast,
-- friendly 409 for the common case; this trigger is the hard backstop,
-- independent of application code, because neon-http has no request-handler
-- transactions and two concurrent PATCH requests demoting the last two
-- owners could each pass the app-layer count check before either commits.
--
-- Mirrors 0002_audit_immutability.sql's trigger pattern.

CREATE OR REPLACE FUNCTION "identity".block_last_owner_removal() RETURNS trigger AS $$
BEGIN
	IF OLD.role = 'owner' AND NEW.role <> 'owner'
	   AND (SELECT count(*) FROM "identity"."user_profiles" WHERE role = 'owner') <= 1 THEN
		RAISE EXCEPTION 'identity.user_profiles: cannot remove the last owner';
	END IF;
	RETURN NEW;
END;
$$ LANGUAGE plpgsql;
--> statement-breakpoint
CREATE TRIGGER user_profiles_protect_last_owner
	BEFORE UPDATE ON "identity"."user_profiles"
	FOR EACH ROW EXECUTE FUNCTION "identity".block_last_owner_removal();
