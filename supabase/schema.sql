-- Ejecuta este archivo completo en Supabase: SQL Editor > New query.
create table if not exists public.commercial_programs (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  short_name text not null,
  type text not null check (type in ('En vivo', 'Asincrónico', 'Híbrido')),
  status text not null default 'active' check (status in ('active', 'inactive')),
  description text not null default '',
  payment_links jsonb not null default '[]'::jsonb,
  coupons jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.commercial_programs enable row level security;

-- Cambia este correo por el tuyo antes de ejecutar.
create or replace function public.is_commercial_admin()
returns boolean language sql stable security definer set search_path = public as $$
  select auth.jwt() ->> 'email' = 'TU_CORREO@EMPRESA.COM'
$$;

create policy "Authenticated users can read commercial programs"
on public.commercial_programs for select to authenticated using (true);

create policy "Only the commercial admin can add programs"
on public.commercial_programs for insert to authenticated with check (public.is_commercial_admin());

create policy "Only the commercial admin can update programs"
on public.commercial_programs for update to authenticated using (public.is_commercial_admin()) with check (public.is_commercial_admin());

create policy "Only the commercial admin can delete programs"
on public.commercial_programs for delete to authenticated using (public.is_commercial_admin());
