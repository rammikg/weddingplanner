-- Wedding OS — Phase 1 schema
-- Run in Supabase: SQL Editor → New query → paste → Run.

-- ---------- Tables ----------

create table if not exists settings (
  id int primary key default 1,
  total_budget numeric not null default 15000,
  currency text not null default 'EUR',
  eur_czk_rate numeric default 25,
  wedding_date date,
  constraint settings_singleton check (id = 1)
);

create table if not exists members (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  role_label text default '',
  created_at timestamptz default now()
);

create table if not exists tasks (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text default '',
  category text default 'Other',
  priority text default 'medium',            -- low | medium | high
  assignee_id uuid references members(id) on delete set null,
  status text not null default 'todo',       -- backlog | todo | doing | waiting | done
  due_date date,
  position double precision not null default 0,
  created_at timestamptz default now()
);

create table if not exists vendors (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  category text default 'other',
  contact_name text default '',
  phone text default '',
  email text default '',
  quote numeric default 0,
  deposit_required numeric default 0,
  deposit_paid boolean default false,
  contract_url text default '',
  notes text default '',
  status text default 'lead',                -- lead|contacted|negotiating|booked|paid|done
  created_at timestamptz default now()
);

create table if not exists budget_items (
  id uuid primary key default gen_random_uuid(),
  category text default 'misc',
  label text not null,
  planned numeric default 0,
  actual numeric default 0,
  paid boolean default false,
  vendor_id uuid references vendors(id) on delete set null,
  created_at timestamptz default now()
);

create table if not exists guests (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  side text default 'Serbian',               -- Serbian | Kazakh | Czech
  country text default '',
  rsvp text default 'none',                  -- confirmed | tentative | declined | none
  plus_one int default 0,
  kids_chair int default 0,                  -- 5yo+, paid seat
  kids_lap int default 0,                    -- under 5, on lap, not billed
  dietary text default '',
  accommodation_needed boolean default false,
  transport_needed boolean default false,
  notes text default '',
  created_at timestamptz default now()
);

-- ---------- Realtime ----------
alter publication supabase_realtime add table settings;
alter publication supabase_realtime add table members;
alter publication supabase_realtime add table tasks;
alter publication supabase_realtime add table vendors;
alter publication supabase_realtime add table budget_items;
alter publication supabase_realtime add table guests;

-- ---------- Row Level Security ----------
-- Any signed-in user has full access. Login is the lock on the door;
-- there are intentionally no per-user roles in Phase 1.
alter table settings enable row level security;
alter table members enable row level security;
alter table tasks enable row level security;
alter table vendors enable row level security;
alter table budget_items enable row level security;
alter table guests enable row level security;

do $$
declare t text;
begin
  foreach t in array array['settings','members','tasks','vendors','budget_items','guests']
  loop
    execute format('drop policy if exists "authed all" on %I;', t);
    execute format(
      'create policy "authed all" on %I for all to authenticated using (true) with check (true);', t
    );
  end loop;
end $$;

-- ---------- Seed ----------
insert into settings (id, total_budget, currency)
values (1, 15000, 'EUR')
on conflict (id) do nothing;

insert into members (name, role_label) values
  ('Groom', 'Admin'),
  ('Bride', 'Editor')
on conflict do nothing;
