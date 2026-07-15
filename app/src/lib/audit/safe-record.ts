// AUD-7: an audit-write failure is surfaced, not silent. For non-decision paths
// (identity lifecycle, provisioning) the primary operation has already
// succeeded, so we log for follow-up rather than fail the caller (Clerk
// retries webhooks on non-2xx; a brand-new user shouldn't be locked out of
// their first login by a transient audit-write blip). Decision-path callers
// (E5 accept/reject/override) must instead let recordAuditEvent's throw fail
// the operation directly — do not wrap those calls in this helper.
export async function safeAudit(record: () => Promise<void>): Promise<void> {
  try {
    await record();
  } catch (err) {
    console.error("[audit] failed to record identity lifecycle event", err);
  }
}
