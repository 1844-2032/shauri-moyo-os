-- ============================================================
-- KANISA — SHAURI MOYO SDA CHURCH
-- Supabase schema v2.0
-- Run this in: Supabase dashboard → SQL Editor → New query
-- ============================================================

create extension if not exists "pgcrypto";

-- ============================================================
-- FUNDS TABLE
-- Stores the complete SDA fund taxonomy.
-- Pre-seeded with standard funds. Churches can add custom funds.
-- The donations table links to this via fund_id — never a
-- hardcoded string — so every transaction carries full fund
-- metadata for bookkeeping and conference reporting.
-- ============================================================

create table if not exists funds (
  id                        uuid primary key default gen_random_uuid(),
  church_id                 uuid not null,
  name                      text not null,
  description               text,
  category                  text not null check (category in (
                              'conference',   -- collected locally, forwarded to Union
                              'local',        -- retained by the church
                              'special'       -- one-time or campaign-based
                            )),
  forwarded_to_conference   boolean not null default false,
  -- Split rule: when a giver selects this fund, the amount is
  -- automatically split between two destination funds.
  -- Combined Offering: 50% local, 50% conference.
  has_split_rule            boolean not null default false,
  split_local_percent       numeric(5,2),     -- e.g. 50.00
  split_conference_percent  numeric(5,2),     -- e.g. 50.00
  is_active                 boolean not null default true,
  is_system_fund            boolean not null default true,
  display_order             integer not null default 99,
  created_at                timestamptz not null default now()
);

create index if not exists idx_funds_church_id on funds (church_id);
create unique index if not exists idx_funds_church_name on funds (church_id, name);

-- ============================================================
-- DONATIONS TABLE
-- Every giving transaction — M-Pesa or card — lands here.
-- Links to funds table via fund_id (never a hardcoded string).
-- For split-rule funds, two rows are created per transaction:
--   Row 1: local portion (split_parent_id = null, is_split_child = false)
--   Row 2: conference portion (split_parent_id = row1.id, is_split_child = true)
-- ============================================================

create table if not exists donations (
  id                          uuid primary key default gen_random_uuid(),
  church_id                   uuid not null,
  fund_id                     uuid not null references funds(id),
  amount                      numeric(12,2) not null check (amount > 0),
  currency                    text not null default 'KES',
  donor_name                  text,
  donor_phone                 text,
  donor_email                 text,
  payment_method              text not null check (payment_method in ('mpesa', 'card')),
  merchant_reference          text not null unique,
  pesapal_order_tracking_id   text,
  status                      text not null default 'PENDING'
                                check (status in ('PENDING','COMPLETED','FAILED','REVERSED')),
  confirmation_code           text,
  -- Split rule support
  is_split_child              boolean not null default false,
  split_parent_id             uuid references donations(id),
  -- Conference forwarding tracker
  forwarded_to_conference     boolean not null default false,
  forwarded_date              date,
  forwarding_reference        text,  -- bank/transfer reference number
  -- Raw data
  raw_ipn_payload             jsonb,
  created_at                  timestamptz not null default now(),
  updated_at                  timestamptz not null default now()
);

create index if not exists idx_donations_church_id   on donations (church_id);
create index if not exists idx_donations_fund_id     on donations (fund_id);
create index if not exists idx_donations_status      on donations (status);
create index if not exists idx_donations_tracking_id on donations (pesapal_order_tracking_id);
create index if not exists idx_donations_created_at  on donations (created_at desc);
create index if not exists idx_donations_forwarded   on donations (church_id, forwarded_to_conference)
  where forwarded_to_conference = false;

-- Auto-update updated_at
create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists trg_donations_updated_at on donations;
create trigger trg_donations_updated_at
  before update on donations
  for each row execute function set_updated_at();

-- ============================================================
-- ROW LEVEL SECURITY
-- All reads and writes go through server-side API routes
-- using the Supabase SERVICE ROLE key. The browser never
-- touches these tables directly.
-- ============================================================

alter table funds     enable row level security;
alter table donations enable row level security;

-- No public policies. Only service role key (used in API routes) can access.

-- ============================================================
-- SEED: STANDARD SDA FUND TAXONOMY
-- Run this AFTER creating a church workspace.
-- Replace 'YOUR-CHURCH-ID-HERE' with the actual church uuid.
--
-- To use: copy this block, replace the placeholder, run it
-- in the SQL editor for the specific church being onboarded.
-- ============================================================

-- do $$
-- declare
--   cid uuid := 'YOUR-CHURCH-ID-HERE';
-- begin
--
--   -- CONFERENCE FUNDS (forwarded to East Kenya Union)
--   insert into funds (church_id, name, description, category, forwarded_to_conference, display_order) values
--   (cid, 'Tithe',                  'Return of 10% of income. Forwarded in full to the Conference.',                     'conference', true,  10),
--   (cid, 'World Budget Offering',  'General Conference operations. Forwarded per GC schedule.',                          'conference', true,  20),
--   (cid, '13th Sabbath Offering',  'Quarterly special mission project. Forwarded to the Division.',                      'conference', true,  30),
--   (cid, 'Annual Mission Offering','Supports global mission fields. Forwarded to General Conference.',                   'conference', true,  40);
--
--   -- LOCAL CHURCH FUNDS (retained by the church)
--   -- Combined Offering has the 50/50 split rule
--   insert into funds (church_id, name, description, category, forwarded_to_conference,
--                      has_split_rule, split_local_percent, split_conference_percent, display_order) values
--   (cid, 'Combined Offering',      'Local church budget and Union support. Split: 50% local, 50% Union.',
--    'local', false, true, 50.00, 50.00, 50);
--
--   insert into funds (church_id, name, description, category, forwarded_to_conference, display_order) values
--   (cid, 'Building & Maintenance Fund',  'Construction, renovation, and facilities upkeep.',                            'local', false, 60),
--   (cid, 'Evangelism & Outreach Fund',   'Local evangelistic campaigns, literature, community outreach.',               'local', false, 70),
--   (cid, 'Welfare & Community Fund',     'Member welfare, benevolence, community assistance.',                          'local', false, 80),
--   (cid, 'Sabbath School Offering',      'Sabbath school materials and local mission activities.',                      'local', false, 90),
--   (cid, 'Youth & Young Adults Fund',    'Adventist Youth and Young Adults ministry activities.',                       'local', false, 100),
--   (cid, 'Pathfinders & Adventurers Fund','Uniforms, camp fees, materials for club activities.',                        'local', false, 110),
--   (cid, 'Music Ministry Fund',          'Instruments, sound equipment, choir activities.',                            'local', false, 120),
--   (cid, 'Women''s Ministries Fund',     'Women''s ministry programmes and activities.',                               'local', false, 130),
--   (cid, 'Men''s Ministries Fund',       'Men''s ministry programmes and activities.',                                 'local', false, 140),
--   (cid, 'Children''s Ministry Fund',    'Vacation Bible School, materials, activities.',                              'local', false, 150);
--
--   -- SPECIAL / PROJECT FUNDS
--   insert into funds (church_id, name, description, category, forwarded_to_conference, display_order) values
--   (cid, 'Ingathering',            'Annual community fundraising campaign.',                                            'special', false, 200),
--   (cid, 'Camp Meeting Fund',      'Quarterly or annual camp meeting costs.',                                           'special', false, 210);
--
-- end $$;
