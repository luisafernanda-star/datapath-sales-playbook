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

-- Cuenta autorizada para administrar programas.
create or replace function public.is_commercial_admin()
returns boolean language sql stable security definer set search_path = public as $$
  select lower(auth.jwt() ->> 'email') = 'luisa@datapath.ai'
$$;

drop policy if exists "Authenticated users can read commercial programs" on public.commercial_programs;
create policy "Authenticated users can read commercial programs"
on public.commercial_programs for select to authenticated using (true);

drop policy if exists "Only the commercial admin can add programs" on public.commercial_programs;
create policy "Only the commercial admin can add programs"
on public.commercial_programs for insert to authenticated with check (public.is_commercial_admin());

drop policy if exists "Only the commercial admin can update programs" on public.commercial_programs;
create policy "Only the commercial admin can update programs"
on public.commercial_programs for update to authenticated using (public.is_commercial_admin()) with check (public.is_commercial_admin());

drop policy if exists "Only the commercial admin can delete programs" on public.commercial_programs;
create policy "Only the commercial admin can delete programs"
on public.commercial_programs for delete to authenticated using (public.is_commercial_admin());

-- Calendario privado de cada asesora.
create table if not exists public.follow_ups (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  client_name text not null,
  phone text not null default '',
  program text not null default '',
  due_at timestamptz not null,
  notes text not null default '',
  status text not null default 'pending' check (status in ('pending', 'completed')),
  attachment_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.follow_ups enable row level security;
drop policy if exists "Advisors can read their follow ups" on public.follow_ups;
create policy "Advisors can read their follow ups" on public.follow_ups for select to authenticated using (auth.uid() = user_id);
drop policy if exists "Advisors can add their follow ups" on public.follow_ups;
create policy "Advisors can add their follow ups" on public.follow_ups for insert to authenticated with check (auth.uid() = user_id);
drop policy if exists "Advisors can update their follow ups" on public.follow_ups;
create policy "Advisors can update their follow ups" on public.follow_ups for update to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);
drop policy if exists "Advisors can delete their follow ups" on public.follow_ups;
create policy "Advisors can delete their follow ups" on public.follow_ups for delete to authenticated using (auth.uid() = user_id);
create index if not exists follow_ups_user_due_idx on public.follow_ups (user_id, due_at);

insert into storage.buckets (id, name, public) values ('followup-attachments', 'followup-attachments', false) on conflict (id) do nothing;
drop policy if exists "Advisors can upload their attachments" on storage.objects;
create policy "Advisors can upload their attachments" on storage.objects for insert to authenticated with check (bucket_id = 'followup-attachments' and (storage.foldername(name))[1] = auth.uid()::text);
drop policy if exists "Advisors can read their attachments" on storage.objects;
create policy "Advisors can read their attachments" on storage.objects for select to authenticated using (bucket_id = 'followup-attachments' and (storage.foldername(name))[1] = auth.uid()::text);

-- Se agrega el cupón de cumpleaños a los programas existentes y a los futuros.
update public.commercial_programs
set coupons = coalesce((select jsonb_agg(coupon) from jsonb_array_elements(coupons) as coupon where coupon ->> 'id' <> 'birthday-60'), '[]'::jsonb)
  || '[{"id":"birthday-60","label":"Cumpleaños","code":"CUMPLEDATA60A","discount":"60%","category":"special"}]'::jsonb;
create or replace function public.ensure_birthday_coupon() returns trigger language plpgsql as $$
begin
  if not new.coupons @> '[{"id":"birthday-60"}]'::jsonb then
    new.coupons := new.coupons || '[{"id":"birthday-60","label":"Cumpleaños","code":"CUMPLEDATA60A","discount":"60%","category":"special"}]'::jsonb;
  end if;
  new.updated_at := now();
  return new;
end;
$$;
drop trigger if exists commercial_programs_birthday_coupon on public.commercial_programs;
create trigger commercial_programs_birthday_coupon before insert or update on public.commercial_programs for each row execute function public.ensure_birthday_coupon();
