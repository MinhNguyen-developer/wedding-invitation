# Vietnamese Wedding Invitation RSVP Website

A Vietnamese-first wedding invitation website with event details, a smooth pre-wedding gallery, and direct RSVP submission.

## Local Setup

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open `http://127.0.0.1:3001`.

The invitation opens with a real WebGL scene: folded champagne curtains, reflective gold wedding bands, an architectural alcove and a perspective camera controlled by scrolling. The dedicated `/album` page takes visitors through ten full-screen photo chapters: a camera travels through framed photographs, gold arches and three changing atmospheres as the visitor scrolls. Every photo has a native fragment (`/album#photo-01` through `/album#photo-10`), with previous/next links and direct access back to RSVP. The home page introduces and links to the album. The editorial cover retains its layered photo frame. Each Three.js scene loads separately as it enters view, pauses offscreen/in hidden tabs and falls back to HTML/CSS 3D when WebGL fails. Animations remain enabled regardless of the device's reduced-motion setting.

Ten local stock demo photos are included and visibly labelled as illustrative images. Configure the existing gallery Storage base URL and upload `photo-01.jpg` through `photo-10.jpg` to automatically replace them with real photos and remove demo labels. A failed photo shows a placeholder without disabling the other 3D chapters. See [gallery media](docs/gallery-media.md) for local replacement and source credits. Venue content and the RSVP contract retain their existing behavior.

The opening uses lightweight WebP posters rendered from the actual 3D curtains, so loading or re-entering the page keeps the same lighting and curtain shape. The rendered canvas becomes fully visible before the fallback fades away. Regenerate the desktop/portrait posters after changing the opening scene with `node scripts/render-stage-posters.mjs` while the local preview is running (an optional first argument selects another base URL).

The album fades each complete HTML preview (background and framed photo together) over an already-rendered, opaque 3D scene. This lets the gold arch and floor appear gradually without fading two separate photo layers or abruptly replacing the background. Portrait layouts retain the same photo and caption positions throughout the handoff.

## Environment Variables

### Personal invitations

Open `/tao-link` and paste guest names/addresses, one per line (for example `bạn Hoàng Anh`, then `cô Hằng` on the next line). Create up to 100 guests per batch; empty lines are ignored and identical normalized names are combined. Copy each link separately or use “Sao chép tất cả” to copy names paired with their links. The recipient opens `/for/ban-hoang-anh` and sees `Thân mời bạn Hoàng Anh`. Any name can be entered; there is no hardcoded guest list.

Guest names persist in a separate `GuestLinks` worksheet of the existing Google spreadsheet, created on the first successful write. `GOOGLE_SHEETS_GUESTS_SHEET_NAME` can select another worksheet. Repeated names reuse their link; different names with the same unaccented slug receive an ID suffix. Keep the generated ID/slug columns intact and do not sort or delete worksheet rows while a link is being created. RSVP stays in its existing worksheet.

Personal invitation pages prefill the RSVP name with the saved guest name/address. Guests can edit it before submitting. A successful submission resets the personal form to that invitation's name; the generic invitation still starts and resets with a blank name. Switching to a different guest invitation initializes a new form for that recipient.

The generator and its write API have no authentication, as requested by the owner. Anyone who can reach `/tao-link` can create invitations. It is not part of the guest navigation. Moving to a hosted domain requires the same Google Sheets credentials; generated links use the domain where the generator is opened. Batch names are validated before any write and saved together through the Sheets API.

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
