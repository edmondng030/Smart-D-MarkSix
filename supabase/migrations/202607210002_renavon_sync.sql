alter table public.data_imports alter column uploaded_by drop not null;

drop policy "admins create imports" on public.data_imports;
create policy "admins create imports" on public.data_imports for insert
with check (public.is_admin() and uploaded_by = auth.uid());

comment on column public.data_imports.uploaded_by is
'Authenticated uploader UUID; null only for trusted server-side scheduled imports.';
