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
NEXT_PUBLIC_SUPABASE_STORAGE_PUBLIC_BASE_URL=
GOOGLE_SHEETS_SPREADSHEET_ID=
GOOGLE_SHEETS_SHEET_NAME=RSVP
GOOGLE_SERVICE_ACCOUNT_EMAIL=
GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY=
MAX_ATTENDEE_COUNT=10
```

`NEXT_PUBLIC_SUPABASE_STORAGE_PUBLIC_BASE_URL` should point to the public `pre-wedding` bucket URL. Google Sheets credentials are server-only and must not use the `NEXT_PUBLIC_` prefix. See [docs/rsvp-review.md](./docs/rsvp-review.md) for Google Cloud, service account, and spreadsheet setup.

## RSVP Setup

Set up direct Google Sheets API storage using [docs/rsvp-review.md](./docs/rsvp-review.md). Guests continue to use the website's RSVP inputs; `/api/rsvp` validates the payload and appends the response to the configured spreadsheet.

## Supabase Gallery Setup

1. Create a Supabase project.
2. Run `supabase/storage.sql` in the Supabase SQL editor.
3. Upload optimized pre-wedding images to the `pre-wedding` Storage bucket.
4. Set `NEXT_PUBLIC_SUPABASE_STORAGE_PUBLIC_BASE_URL` in `.env.local` and in Vercel.

Supabase is used for gallery image delivery only. The old `supabase/schema.sql` RSVP table and any prior Google Forms responses are retained as historical data; new RSVP submissions are written directly to Google Sheets.

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
- Confirm the saved response appears in the configured Google Sheets tab.
- Export a backup of RSVP responses before the wedding.
