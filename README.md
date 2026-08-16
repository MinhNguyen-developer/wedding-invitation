# Vietnamese Wedding Invitation RSVP Website

A Vietnamese-first wedding invitation website with event details, a smooth pre-wedding gallery, and direct RSVP submission.

## Local Setup

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open `http://localhost:3000`.

## Environment Variables

```text
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
NEXT_PUBLIC_SUPABASE_STORAGE_PUBLIC_BASE_URL=
SUPABASE_SERVICE_ROLE_KEY=
MAX_ATTENDEE_COUNT=10
```

`NEXT_PUBLIC_SUPABASE_STORAGE_PUBLIC_BASE_URL` should point to the public `pre-wedding` bucket URL. `SUPABASE_SERVICE_ROLE_KEY` is server-only. Do not expose it in browser code.

## Supabase Setup

1. Create a Supabase project.
2. Run `supabase/schema.sql` in the Supabase SQL editor.
3. Run `supabase/storage.sql` in the Supabase SQL editor.
4. Upload optimized pre-wedding images to the `pre-wedding` Storage bucket.
5. Add the environment variables to `.env.local` for local development.
6. Add the same production values in Vercel environment settings.

Guests submit RSVP responses through the website. The couple reviews responses in the Supabase dashboard.

## Replace Wedding Content

Edit `lib/wedding-content.ts` before launch:

- Couple names
- Invitation message
- Wedding date and time
- Venue name and address
- Map link
- Maximum attendee count
- Gallery image metadata

For production images, upload real pre-wedding photos to Supabase Storage and set `NEXT_PUBLIC_SUPABASE_STORAGE_PUBLIC_BASE_URL`. See `docs/gallery-media.md`.

## Validation

```bash
npm run lint
npm run typecheck
npm run test
npm run build
npm run test:e2e
```

Playwright may require a one-time browser install:

```bash
npx playwright install chromium
```

## Deployment

Deploy to Vercel from the `main` branch. Configure production environment variables in Vercel before testing the RSVP form in production.

Before sharing the invitation link:

- Review Vietnamese copy and accents.
- Confirm mobile layout.
- Confirm gallery images load from Supabase Storage.
- Submit a test RSVP.
- Confirm the saved response appears in Supabase.
- Export a backup of RSVP responses before the wedding.
