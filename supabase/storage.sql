-- Supabase Storage setup for pre-wedding gallery images.
-- Run this in the Supabase SQL editor before deploying the production gallery.

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'pre-wedding',
  'pre-wedding',
  true,
  5242880,
  array['image/jpeg', 'image/png', 'image/webp', 'image/avif']
)
on conflict (id) do update
set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

-- Guests may load approved gallery images from the public bucket.
create policy "Public read access for pre-wedding gallery images"
on storage.objects
for select
to public
using (bucket_id = 'pre-wedding');

-- Do not add public insert, update, or delete policies.
-- The couple should upload or replace images through authenticated Supabase dashboard access.
