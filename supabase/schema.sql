-- Legacy RSVP storage schema. New submissions are sent directly to Google Sheets.
-- Keep this file for existing installations and historical rows; it is no longer
-- required for a new deployment of the website.

create extension if not exists pgcrypto;

create table if not exists public.rsvps (
  id uuid primary key default gen_random_uuid(),
  guest_name text not null check (length(trim(guest_name)) > 0),
  attendance_status text not null check (attendance_status in ('attending', 'not_attending')),
  attendee_count integer not null check (attendee_count between 1 and 10),
  message text,
  created_at timestamptz not null default now()
);

comment on table public.rsvps is 'Private RSVP responses for the wedding couple to review.';
comment on column public.rsvps.guest_name is 'Guest or household name submitted from the RSVP form.';
comment on column public.rsvps.attendance_status is 'Attendance choice: attending or not_attending.';
comment on column public.rsvps.attendee_count is 'Total attendees represented by this RSVP response. Default maximum is 10.';
comment on column public.rsvps.message is 'Optional Vietnamese wedding wish or note.';
comment on column public.rsvps.created_at is 'Server-side submission timestamp.';

alter table public.rsvps enable row level security;

-- Guests submit through the server-side route. Do not create public select, update, or delete policies.
-- Historical responses can still be reviewed in the Supabase dashboard.
