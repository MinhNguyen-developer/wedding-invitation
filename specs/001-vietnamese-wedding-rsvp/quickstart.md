# Quickstart: Vietnamese Wedding Invitation RSVP Website

## Prerequisites

- Node.js LTS installed.
- Package manager selected for the project.
- Google Cloud project with the Sheets API enabled, a service account, and a private spreadsheet shared with that service account.
- Supabase Storage bucket prepared for public gallery image delivery.
- Production and local environment variables configured outside source control.
- Real pre-wedding images uploaded to the configured Supabase Storage bucket, or temporary replacement images clearly marked for later replacement.

## Setup

1. Install dependencies with `npm install`.
2. Copy `.env.example` to `.env.local` and configure the Google Sheets spreadsheet ID, tab name, service account email, and private key for RSVP submission.
3. Create or confirm the Supabase Storage bucket for pre-wedding images.
4. Upload optimized pre-wedding images to the configured Supabase Storage bucket.
5. Update gallery metadata with the public image URLs, storage object paths, captions, and descriptive alt text from [contracts/gallery-media.md](./contracts/gallery-media.md).
6. Enter final Vietnamese wedding content: couple names, invitation message, date, time, venue, and optional map link.
7. Run the local development server with `npm run dev`.

## Validation Scenarios

### Scenario 1: Invitation Content

1. Open the website locally.
2. Confirm Vietnamese invitation content is readable.
3. Confirm couple names, wedding date, wedding time, and venue are visible or easy to reach.
4. Confirm Vietnamese accents display correctly.

**Expected result**: A guest can understand the invitation details without extra instructions.

### Scenario 2: Mobile Layout

1. Open the website at a mobile viewport size.
2. Review the invitation, gallery, and RSVP form.
3. Confirm content is readable and controls are easy to use.

**Expected result**: The complete guest flow works on a phone-sized screen.

### Scenario 3: Gallery

1. Open the pre-wedding gallery.
2. Move between images using available controls and touch/drag behavior.
3. Observe image transitions.
4. Confirm the visible images come from the configured managed storage URLs.

**Expected result**: Photos transition smoothly, remain properly framed, and do not block form usage.

### Scenario 4: RSVP Validation

1. Open the RSVP form.
2. Try to submit the form with missing required fields.
3. For an attending RSVP, try invalid attendee counts such as `0`, `-1`, decimal values, and a value above the configured event limit. A not-attending RSVP should save an attendee count of `0`.

**Expected result**: The form blocks invalid submissions and displays helpful Vietnamese validation messages.

### Scenario 5: Successful RSVP

1. Enter a valid guest name.
2. Choose attendance status.
3. Enter a valid attendee count.
4. Optionally enter a Vietnamese message with accents.
5. Submit the RSVP.
6. Review the saved response in the configured private Google Sheets tab.

**Expected result**: The guest sees a success confirmation, and the saved response includes guest name, attendance choice, attendee count, optional message, and submission time.

### Scenario 6: Guest Privacy

1. Use the public website as a normal guest.
2. Attempt to find or access a full RSVP response list from the website.
3. Confirm no response list is exposed in guest-facing pages or browser-accessible app behavior.

**Expected result**: Guests can submit RSVP responses but cannot view saved RSVP responses from other guests.

### Scenario 7: Temporary Submission Failure

1. Temporarily make the RSVP submission path unavailable in a local or test environment.
2. Submit an otherwise valid RSVP.

**Expected result**: The guest sees a friendly retry message and no sensitive implementation details.

## Pre-Deployment Checks

- Lint passes.
- Typecheck passes.
- Build passes.
- RSVP validation tests pass.
- End-to-end happy path passes.
- Guest privacy scenario passes.
- Final Vietnamese content has been reviewed.
- Images are compressed and visually checked on desktop and mobile.
- Production environment variables are configured.
- Automated validation commands pass: `npm run lint`, `npm run typecheck`, `npm run test`, `npm run build`, and `npm run test:e2e`.

## Release Validation

1. Deploy a preview environment.
2. Complete all validation scenarios against preview.
3. Promote to production.
4. Submit one production test RSVP.
5. Confirm the response is available to the couple in Google Sheets.
6. Remove the production test response if desired.
