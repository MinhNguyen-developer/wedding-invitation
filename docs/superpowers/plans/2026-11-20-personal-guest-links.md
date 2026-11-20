# Personal Guest Links Implementation Plan

> **For agentic workers:** Use superpowers:executing-plans to implement this plan task by task in the current workspace, preserving existing user changes.

**Goal:** Let the owner create persistent guest links and render the exact personalized invitation.

**Architecture:** Reuse Google Sheets credentials and add a dedicated guest sheet. A password-protected write endpoint creates collision-safe slugs; server-rendered guest routes reuse the invitation and preserve their context through the album.

**Tech Stack:** Existing Next.js 15, React 19, Google Sheets API, Zod, native crypto and Clipboard API.

**Spec:** `docs/superpowers/specs/2026-11-20-personal-guest-links-design.md`

## Global Constraints

- Preserve all existing animation fixes and the user's hidden album controls.
- Never hardcode a guest list, expose credentials or publish a guest-list endpoint.
- Keep Google Sheets RSVP behavior unchanged; no Supabase changes or new dependencies.
- Use RAW cell writes, server-side validation and constant-time password checks.
- Live integration uses only an owned temporary worksheet; do not seed real guests.

## Review Focus

- Vietnamese accents, đ/Đ, whitespace and case survive creation and direct page reload.
- Slug collisions and simultaneous requests cannot return another guest's invitation.
- Retrying a partially completed write repairs or reuses that record.
- Wrong credentials, invalid input and backend failures leave the form usable.
- Long names, phone layouts, album return links and the generic invitation still work.

### Task 1: Persistent names and protected creation

**Files:** `lib/guest-link.ts`, `lib/guest-links-service.ts`, `lib/google-sheets-service.ts`, `app/api/guest-links/route.ts`, corresponding unit tests.

- [x] Write and run failing tests for Unicode normalization, slug collisions/concurrency, interrupted write recovery, authentication and invalid input.
- [x] Reuse the Google Sheets client; add atomic worksheet/header initialization and append/claim/repair logic.
- [x] Add a POST-only authenticated endpoint and cache invalidation.
- [x] Run focused unit tests and the complete unit suite. Backend 25/25; complete suite 53/53.

### Task 2: Owner form and personalized invitation

**Files:** `app/tao-link/page.tsx`, `components/guest-link-generator.tsx`, `components/wedding-invitation.tsx`, `app/page.tsx`, `app/for/[slug]/*`, `components/invitation-section.tsx`, `components/photo-gallery.tsx`, `components/site-nav.tsx`, `app/album/page.tsx`, `app/globals.css`, relevant browser tests.

- [x] Write failing tests for exact greeting, form creation, copy/open states and guest navigation through the album.
- [x] Build the owner form with existing inputs/buttons and responsive ivory/burgundy styling.
- [x] Share the existing invitation, resolve guest names server-side, add not-found/error behavior, preserve guest paths in album links.
- [x] Configure the local admin password safely and document usage in README / `.env.example`.
- [x] Verify using a temporary real worksheet, inspect desktop/mobile, run typecheck/lint/build and relevant browser regressions.

## Review and verification ledger

- Independent read-only review found no Critical or Important issues. Its minor same-name concurrency finding was addressed: concurrent callers now receive the same canonical link, while any extra appended candidate receives its own unique slug without deleting or shifting rows. Regression failed first, then the complete 53-test suite passed.
- Phone inspection showed the preview pushed the create button below the initial viewport. A browser regression reproduced it; mobile now places the form before the preview.
- Current dedicated feature branch is retained to preserve the user's existing uncommitted album edits and running preview. No commits, deployment or Supabase mutations are part of this task.
- Final verification: 53 unit tests, typecheck, lint and isolated production build passed. Production browser run passed 92/94; the two remaining tests hit an ambiguous Next.js route-announcer `alert` selector. Scoping that selector to the owner form passed both targeted production reruns. All 94 cases are now verified. Real Sheet integration covered exact names, direct reload, clipboard, album return context, concurrent collisions, cache invalidation after an initial 404 and a long greeting on a small phone.
- Only the owned temporary worksheet was created and deleted during integration. The local preview remained on port 3001; the task-owned production server was stopped after verification.

## Follow-up: no password and multiline guest creation

- Completed the user's explicit request to remove authentication from the form and write endpoint. Removed the obsolete password setting and updated the usage documentation.
- Added newline parsing, NFC normalization, blank-line removal, deduplication before the 100-guest limit, validation before writes, one append for a batch and one batch update for collision repairs. Single-guest requests remain compatible.
- Added individual result cards, per-guest copy/open actions and copy-all with names paired to links.
- Verification: 60/60 unit tests, typecheck, lint and production build passed. Real Sheets/browser checks passed 8/10 initially; the remaining two matched both a labelled textbox and its copy button. Selecting the exact textbox passed both targeted desktop/mobile reruns. All 10 cases are now verified. Inspected actual desktop/mobile bulk-result screenshots. Only owned temporary worksheets were created and deleted; no real guests were seeded.

## Follow-up: RSVP prefill and final verification

- Personal invitations now pass the saved guest name into the RSVP defaults and successful reset. Names remain editable, and edits survive failed submissions. Generic invitations retain blank defaults.
- The form uses the recipient slug as its React key, with no string sentinel that could collide with a valid guest slug. A regression covers generic-to-personal navigation and switching between recipients.
- Final verification passed: 63 unit tests, typecheck, lint, production build and all 96 production browser checks. After the final identity-key adjustment, the complete unit suite and build passed again, together with both targeted desktop/mobile guest flows, including reload, album navigation, RSVP payload and successful reset. RSVP writes were intercepted; only owned temporary guest worksheets were created and deleted.
