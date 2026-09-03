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

-- Avisos generales publicados por la administradora.
create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  message text not null default '',
  recipient_id uuid references auth.users(id) on delete cascade,
  sender_id uuid references auth.users(id) on delete set null default auth.uid(),
  expires_at timestamptz,
  created_at timestamptz not null default now()
);

alter table public.notifications add column if not exists recipient_id uuid references auth.users(id) on delete cascade;
alter table public.notifications add column if not exists sender_id uuid references auth.users(id) on delete set null default auth.uid();

create table if not exists public.notification_reads (
  notification_id uuid not null references public.notifications(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  read_at timestamptz not null default now(),
  primary key (notification_id, user_id)
);

alter table public.notifications enable row level security;
alter table public.notification_reads enable row level security;
drop policy if exists "Authenticated users can read notifications" on public.notifications;
create policy "Authenticated users can read notifications" on public.notifications for select to authenticated using (recipient_id is null or recipient_id = auth.uid());
drop policy if exists "Only the commercial admin can add notifications" on public.notifications;
create policy "Only the commercial admin can add notifications" on public.notifications for insert to authenticated with check (public.is_commercial_admin() or (recipient_id is not null and sender_id = auth.uid()));
drop policy if exists "Only the commercial admin can delete notifications" on public.notifications;
create policy "Only the commercial admin can delete notifications" on public.notifications for delete to authenticated using (public.is_commercial_admin());
drop policy if exists "Advisors can read their notification receipts" on public.notification_reads;
create policy "Advisors can read their notification receipts" on public.notification_reads for select to authenticated using (auth.uid() = user_id);
drop policy if exists "Advisors can mark their notifications as read" on public.notification_reads;
create policy "Advisors can mark their notifications as read" on public.notification_reads for insert to authenticated with check (auth.uid() = user_id);
drop policy if exists "Advisors can update their notification receipts" on public.notification_reads;
create policy "Advisors can update their notification receipts" on public.notification_reads for update to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- Perfil personal de cada integrante del equipo.
create table if not exists public.user_profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null default '',
  avatar_path text,
  role_label text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.user_profiles add column if not exists role_label text;

alter table public.user_profiles enable row level security;
drop policy if exists "Users can read their own profile" on public.user_profiles;
create policy "Users can read their own profile" on public.user_profiles for select to authenticated using (auth.uid() = user_id);
drop policy if exists "Users can create their own profile" on public.user_profiles;
create policy "Users can create their own profile" on public.user_profiles for insert to authenticated with check (auth.uid() = user_id);
drop policy if exists "Users can update their own profile" on public.user_profiles;
create policy "Users can update their own profile" on public.user_profiles for update to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);

create or replace function public.protect_profile_role()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  if not public.is_commercial_admin() then
    if (tg_op = 'INSERT' and new.role_label is not null) or (tg_op = 'UPDATE' and new.role_label is distinct from old.role_label) then
      raise exception 'Solo la administradora puede modificar cargos';
    end if;
  end if;
  return new;
end;
$$;
drop trigger if exists protect_profile_role_trigger on public.user_profiles;
create trigger protect_profile_role_trigger before insert or update on public.user_profiles for each row execute function public.protect_profile_role();

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('profile-avatars', 'profile-avatars', false, 5242880, array['image/jpeg','image/png','image/webp','image/gif'])
on conflict (id) do nothing;
drop policy if exists "Users can upload their own avatar" on storage.objects;
create policy "Users can upload their own avatar" on storage.objects for insert to authenticated with check (bucket_id = 'profile-avatars' and (storage.foldername(name))[1] = auth.uid()::text);
drop policy if exists "Users can update their own avatar" on storage.objects;
create policy "Users can update their own avatar" on storage.objects for update to authenticated using (bucket_id = 'profile-avatars' and (storage.foldername(name))[1] = auth.uid()::text) with check (bucket_id = 'profile-avatars' and (storage.foldername(name))[1] = auth.uid()::text);
drop policy if exists "Users can read their own avatar" on storage.objects;
create policy "Users can read their own avatar" on storage.objects for select to authenticated using (bucket_id = 'profile-avatars' and (storage.foldername(name))[1] = auth.uid()::text);

-- Directorio interno: incluye todas las cuentas invitadas, incluso si aún no completaron su perfil.
drop function if exists public.get_team_directory();
create function public.get_team_directory()
returns table (user_id uuid, email text, display_name text, avatar_path text, role_label text, joined_at timestamptz)
language sql stable security definer set search_path = public, auth as $$
  select u.id, coalesce(u.email, ''), coalesce(p.display_name, ''), p.avatar_path, p.role_label, u.created_at
  from auth.users u
  left join public.user_profiles p on p.user_id = u.id
  order by coalesce(nullif(p.display_name, ''), u.email, '') asc
$$;
revoke all on function public.get_team_directory() from public;
grant execute on function public.get_team_directory() to authenticated;

-- Solo la administradora puede cambiar el nombre o cargo de otro integrante.
create or replace function public.update_team_member(target_user_id uuid, new_display_name text, new_role_label text)
returns void language plpgsql security definer set search_path = public, auth as $$
begin
  if not public.is_commercial_admin() then
    raise exception 'No tienes permiso para administrar roles';
  end if;
  insert into public.user_profiles (user_id, display_name, role_label, updated_at)
  values (target_user_id, trim(coalesce(new_display_name, '')), nullif(trim(coalesce(new_role_label, '')), ''), now())
  on conflict (user_id) do update set
    display_name = excluded.display_name,
    role_label = excluded.role_label,
    updated_at = now();
end;
$$;
revoke all on function public.update_team_member(uuid, text, text) from public;
grant execute on function public.update_team_member(uuid, text, text) to authenticated;

drop policy if exists "Users can read their own avatar" on storage.objects;
drop policy if exists "Authenticated team can read profile avatars" on storage.objects;
create policy "Authenticated team can read profile avatars" on storage.objects for select to authenticated using (bucket_id = 'profile-avatars');

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
