# TILE activation and whitelist

TILE is an independent 1,111-piece NFT collection. This Next.js application combines an editorial public site, a Korean-influenced TILE activation journey, Supabase persistence, and a password-protected administration workspace.

## Local setup

1. Install Node.js 20 or newer.
2. Run `npm install`.
3. Copy `.env.example` to `.env.local` and configure the values below.
4. Create or migrate the Supabase table.
5. Run `npm run dev` and open `http://localhost:3000`.

## Whitelist lifecycle

1. **Assemble:** the visitor rotates nine TILE fragments into one connected pattern. Completion requests a signed, 24-hour assembly token from the server and stores it for the browser session. This is an engagement mechanism, not cryptographic anti-cheat.
2. **Application:** the signed assembly token is validated server-side. A valid submission is stored as `pending_verification` and receives the next database-generated participant number.
3. **Signal:** TILE prepares an editable X post containing the participant number. The visitor posts it, returns, and provides the status URL.
4. **Verified:** the server validates ownership and uniqueness of the X URL. A successful application becomes `verified`, never automatically `whitelisted`.
5. **Selection:** an administrator may move `verified` to `whitelisted` or `rejected`, and may reverse either decision back to `verified`.

The lifecycle values are `incomplete`, `pending_verification`, `verified`, `whitelisted`, and `rejected`.

### Applicant TILE numbers

`TILE #0472` is an internal application/participant identifier. **It is not an NFT token ID, does not represent ownership, and does not reserve a collection item.** Numbers come from a database sequence, remain unique, and continue beyond 1,111 if application volume exceeds the collection supply.

## Create a new Supabase table

Run the following in the Supabase SQL editor for a new installation:

```sql
create extension if not exists pgcrypto;
create sequence if not exists public.applicant_tile_number_seq start 1;

create table public.whitelist_applications (
  id uuid primary key default gen_random_uuid(),
  applicant_tile_number bigint not null unique default nextval('public.applicant_tile_number_seq'),
  x_username text not null,
  wallet_address text not null unique,
  social_contact text,
  reason text not null,
  discovery_source text not null check (discovery_source in ('X', 'Friend', 'GIWA Community', 'Telegram', 'Other')),
  assembly_completed boolean not null default false,
  x_post_url text unique,
  x_post_id text unique,
  x_verified_at timestamptz,
  verification_status text not null default 'not_started',
  status text not null default 'incomplete' check (status in ('incomplete', 'pending_verification', 'verified', 'whitelisted', 'rejected')),
  created_at timestamptz not null default now()
);

alter table public.whitelist_applications enable row level security;
```

No public RLS policies are required. The browser calls server route handlers, which alone use the service-role key.

## Safely migrate an existing installation

This migration preserves every existing application and does not delete or recreate the table:

```sql
begin;

create sequence if not exists public.applicant_tile_number_seq start 1;

alter table public.whitelist_applications
  add column if not exists applicant_tile_number bigint,
  add column if not exists assembly_completed boolean not null default false,
  add column if not exists x_post_url text,
  add column if not exists x_post_id text,
  add column if not exists x_verified_at timestamptz,
  add column if not exists verification_status text not null default 'not_started';

with numbered as (
  select id, row_number() over (order by created_at, id) as number
  from public.whitelist_applications
  where applicant_tile_number is null
)
update public.whitelist_applications applications
set applicant_tile_number = numbered.number
from numbered where applications.id = numbered.id;

select setval(
  'public.applicant_tile_number_seq',
  greatest(coalesce((select max(applicant_tile_number) from public.whitelist_applications), 0), 1),
  true
);

alter table public.whitelist_applications
  alter column applicant_tile_number set default nextval('public.applicant_tile_number_seq'),
  alter column applicant_tile_number set not null;

update public.whitelist_applications
set status = 'pending_verification'
where status = 'pending';

alter table public.whitelist_applications drop constraint if exists whitelist_applications_status_check;
alter table public.whitelist_applications add constraint whitelist_applications_status_check
  check (status in ('incomplete', 'pending_verification', 'verified', 'whitelisted', 'rejected'));

create unique index if not exists whitelist_applications_applicant_tile_number_key on public.whitelist_applications (applicant_tile_number);
create unique index if not exists whitelist_applications_x_post_url_key on public.whitelist_applications (x_post_url) where x_post_url is not null;
create unique index if not exists whitelist_applications_x_post_id_key on public.whitelist_applications (x_post_id) where x_post_id is not null;

commit;
```

## X verification

Without `X_BEARER_TOKEN`, verification is intentionally limited to URL ownership signals: the URL must be an HTTPS `x.com` or `twitter.com` status URL, its username must match the submitted X username, it must contain a numeric status ID, and that post ID must not belong to another application. The UI accurately reports **“X post link verified”** and does not claim that content was checked.

When `X_BEARER_TOKEN` is configured, the server uses X API v2 to confirm the post exists, its author matches, and its text contains the formatted TILE participant identifier. The bearer token is server-only. API availability and access tiers are controlled by X and may change.

The prepared post copy and optional handle live centrally in `lib/site-config.ts`.

## Environment variables

```bash
NEXT_PUBLIC_SUPABASE_URL=       # Supabase project URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=  # Reserved for future public Supabase features
SUPABASE_SERVICE_ROLE_KEY=      # Server only; also signs assembly completion tokens
ADMIN_PASSWORD=                 # Strong MVP admin password
NEXT_PUBLIC_TILE_X_HANDLE=      # Optional, without @; omitted from posts when empty
X_BEARER_TOKEN=                 # Optional and server-only; enables content-level X checks
```

Never prefix either service-role or bearer token with `NEXT_PUBLIC_`.

## Admin workflow

Visit `/admin` and enter `ADMIN_PASSWORD`. The server creates an HTTP-only, same-site cookie valid for eight hours. Operators can search by X username, wallet, or TILE number; inspect assembly and verification state; safely open a submitted X post; move verified applications to whitelisted or rejected; and reverse either selection to verified. The public API cannot assign whitelist status.

The password gate is an MVP control. Add identity-based authentication, audit logs, and role-based access before supporting multiple operators.

## Vercel deployment

Import the repository into Vercel, add all environment variables for the desired environments, and deploy. Then test assembly, a submission, duplicate wallet and X-post protection, signal verification, admin login, and admin status transitions.

## Commands

- `npm run dev` — local development
- `npm run lint` — lint checks
- `npm run build` — production build
- `npm start` — serve a production build
