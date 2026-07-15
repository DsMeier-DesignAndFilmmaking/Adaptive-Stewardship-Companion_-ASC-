-- Custom SQL migration file, put your code below! --

-- Accountability ledger immutability (ADR-003 AUD-3, security-architecture.md §5).
--
-- Enforce append-only at the row level with a trigger. This is role-independent,
-- so it holds today without the deferred restricted-role split (TEN-1): NO role
-- (short of superuser) can UPDATE or DELETE an audit event.

CREATE OR REPLACE FUNCTION "audit".block_mutation() RETURNS trigger AS $$
BEGIN
	RAISE EXCEPTION 'audit.audit_events is append-only (% blocked)', TG_OP;
END;
$$ LANGUAGE plpgsql;
--> statement-breakpoint
CREATE TRIGGER audit_events_append_only
	BEFORE UPDATE OR DELETE ON "audit"."audit_events"
	FOR EACH ROW EXECUTE FUNCTION "audit".block_mutation();
--> statement-breakpoint

-- Defense-in-depth grants (AUD-3): the application runtime role should hold only
-- INSERT + SELECT on the ledger. Activate these when the restricted, non-BYPASSRLS
-- runtime role exists (arrives with the tenancy/RLS phase — TEN-1). Until then the
-- trigger above is the enforcement mechanism.
--
--   REVOKE UPDATE, DELETE, TRUNCATE ON "audit"."audit_events" FROM <app_runtime_role>;
--   GRANT  INSERT, SELECT             ON "audit"."audit_events" TO   <app_runtime_role>;
