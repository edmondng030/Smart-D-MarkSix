create policy "admins create audit logs" on public.audit_logs for insert
with check (public.is_admin() and actor_id = auth.uid());
