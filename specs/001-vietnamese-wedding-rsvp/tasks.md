# Tasks: Vietnamese Wedding Invitation RSVP Website

**Input**: Design documents from `/specs/001-vietnamese-wedding-rsvp/`

**Prerequisites**: [plan.md](./plan.md), [spec.md](./spec.md), [research.md](./research.md), [data-model.md](./data-model.md), [contracts/gallery-media.md](./contracts/gallery-media.md), [contracts/rsvp-submission.md](./contracts/rsvp-submission.md), [quickstart.md](./quickstart.md)

**Tests**: Included because the implementation plan calls for unit/component validation, end-to-end validation, and quickstart scenarios.

**Organization**: Tasks are grouped by user story so each story can be implemented and tested independently after shared foundations are complete.

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Initialize the Next.js web application, tooling, baseline directories, and provider configuration files.

- [X] T001 Initialize the Next.js TypeScript application and package metadata in `package.json`
- [X] T002 [P] Configure TypeScript compiler settings in `tsconfig.json`
- [X] T003 [P] Configure Next.js runtime and remote image settings placeholder in `next.config.ts`
- [X] T004 [P] Configure Tailwind CSS and PostCSS in `tailwind.config.ts` and `postcss.config.mjs`
- [X] T005 [P] Configure linting rules in `eslint.config.mjs`
- [X] T006 [P] Configure automated test tooling in `vitest.config.ts` and `playwright.config.ts`
- [X] T007 Create planned directories and placeholder docs in `app/`, `components/`, `lib/`, `tests/unit/`, `tests/e2e/`, `supabase/`, and `docs/`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Establish shared styling, content contracts, validation, environment, persistence, media storage configuration, and base layout before user story work begins.

**Critical**: No user story work should begin until this phase is complete.

- [X] T008 Add global responsive styling, typography, color tokens, and motion-safe defaults in `app/globals.css`
- [X] T009 Create the root application layout with Vietnamese metadata and font loading in `app/layout.tsx`
- [X] T010 [P] Define editable wedding invitation content, event details, gallery metadata fields, and attendee limit in `lib/wedding-content.ts`
- [X] T011 [P] Define RSVP validation schema, request types, response types, and Vietnamese validation messages in `lib/rsvp-schema.ts`
- [X] T012 [P] Define gallery media schema/types for `publicUrl`, `storageObjectPath`, `altText`, `caption`, and `displayOrder` in `lib/gallery-media-schema.ts`
- [X] T013 [P] Create Supabase server client helper that reads only server-side environment variables in `lib/supabase-server.ts`
- [X] T014 [P] Create RSVP storage schema and row-level-security setup instructions in `supabase/schema.sql`
- [X] T015 [P] Create Supabase Storage bucket and gallery media access setup instructions in `supabase/storage.sql`
- [X] T016 [P] Add environment variable documentation with safe public/server distinction and gallery storage URL variables in `.env.example`
- [X] T017 [P] Add base test helpers and render utilities in `tests/unit/test-utils.tsx`
- [X] T018 [P] Add reusable UI primitives for buttons, inputs, labels, and form messages in `components/ui.tsx`
- [X] T019 Configure Next.js allowed remote image host patterns for Supabase Storage in `next.config.ts`

**Checkpoint**: Foundation ready; user story implementation can now begin.

---

## Phase 3: User Story 1 - View Vietnamese Wedding Invitation (Priority: P1)

**Goal**: Guests can open the site and understand the Vietnamese wedding invitation, couple names, date, time, and venue.

**Independent Test**: Open the website and confirm Vietnamese content, couple names, wedding date, wedding time, venue, and accents are visible and readable on desktop and mobile.

### Tests for User Story 1

- [X] T020 [P] [US1] Add component tests for Vietnamese invitation content and required event details in `tests/unit/invitation-section.test.tsx`
- [X] T021 [P] [US1] Add end-to-end test for invitation content visibility and Vietnamese accent rendering in `tests/e2e/invitation.spec.ts`
- [X] T022 [P] [US1] Add mobile end-to-end test for readable invitation layout in `tests/e2e/invitation-mobile.spec.ts`

### Implementation for User Story 1

- [X] T023 [P] [US1] Implement the invitation hero and event details component in `components/invitation-section.tsx`
- [X] T024 [P] [US1] Implement venue details and optional map link rendering in `components/venue-section.tsx`
- [X] T025 [US1] Compose the single-page invitation structure with hero, invitation copy, event details, and venue section in `app/page.tsx`
- [X] T026 [US1] Add accessible navigation anchors for invitation details, gallery, and RSVP sections in `components/site-nav.tsx`

**Checkpoint**: User Story 1 is fully functional and testable independently.

---

## Phase 4: User Story 2 - Submit RSVP Directly On Website (Priority: P1)

**Goal**: Guests can submit RSVP responses directly on the website with validation, confirmation, and friendly failure handling.

**Independent Test**: Fill and submit a valid RSVP, confirm the guest sees success, invalid inputs are blocked, and temporary submission failures show a friendly retry message.

### Tests for User Story 2

- [X] T027 [P] [US2] Add unit tests for RSVP schema validation, attendee count bounds, honeypot handling, and Vietnamese message preservation in `tests/unit/rsvp-schema.test.ts`
- [X] T028 [P] [US2] Add contract tests for `POST /api/rsvp` success, validation failure, honeypot rejection, and temporary failure in `tests/unit/rsvp-route.test.ts`
- [X] T029 [P] [US2] Add end-to-end tests for RSVP form validation, success confirmation, and retry error copy in `tests/e2e/rsvp.spec.ts`

### Implementation for User Story 2

- [X] T030 [P] [US2] Implement the RSVP form fields, hidden honeypot field, client validation, pending state, success state, and error state in `components/rsvp-form.tsx`
- [X] T031 [P] [US2] Implement the RSVP storage service for inserting validated responses in `lib/rsvp-service.ts`
- [X] T032 [US2] Implement the `POST /api/rsvp` route with server validation, honeypot rejection, safe error responses, and persistence in `app/api/rsvp/route.ts`
- [X] T033 [US2] Integrate the RSVP form into the page flow after the invitation content and gallery in `app/page.tsx`
- [X] T034 [US2] Add submission success and failure logging without sensitive guest details in `app/api/rsvp/route.ts`
- [X] T035 [US2] Document sample RSVP persistence verification against the saved response fields in `docs/rsvp-review.md`

**Checkpoint**: User Story 2 is fully functional and testable independently.

---

## Phase 5: User Story 3 - Enjoy Pre-Wedding Photo Gallery (Priority: P2)

**Goal**: Guests can view centrally managed Supabase Storage pre-wedding photos with smooth, elegant, mobile-friendly transitions.

**Independent Test**: View the gallery on desktop and mobile, move between images, confirm the images load from configured managed storage URLs, and confirm transitions are smooth, images are framed well, and form usage is not blocked.

### Tests for User Story 3

- [X] T036 [P] [US3] Add unit tests for gallery media schema ordering, required public URLs, storage object paths, alt text, and captions in `tests/unit/gallery-media-schema.test.ts`
- [X] T037 [P] [US3] Add component tests for gallery image ordering, remote source URLs, alt text, captions, and controls in `tests/unit/photo-gallery.test.tsx`
- [X] T038 [P] [US3] Add end-to-end tests for desktop and mobile gallery navigation in `tests/e2e/gallery.spec.ts`
- [X] T039 [P] [US3] Add end-to-end assertion that gallery image requests use configured managed storage URLs in `tests/e2e/gallery-storage.spec.ts`

### Implementation for User Story 3

- [X] T040 [P] [US3] Add Supabase Storage bucket creation, public-read policy, upload path, and cache guidance to `supabase/storage.sql`
- [X] T041 [P] [US3] Add gallery image upload and replacement instructions for the couple in `docs/gallery-media.md`
- [X] T042 [P] [US3] Replace bundled placeholder image metadata with Supabase Storage `publicUrl` and `storageObjectPath` fields in `lib/wedding-content.ts`
- [X] T043 [US3] Implement gallery media validation and sorted gallery item export in `lib/gallery-media-schema.ts`
- [X] T044 [US3] Update the animated touch-friendly photo gallery to render remote managed-storage images and usable fallback states in `components/photo-gallery.tsx`
- [X] T045 [US3] Replace any local image hero dependency with the approved managed-storage hero/gallery source in `components/invitation-section.tsx`
- [X] T046 [US3] Integrate the photo gallery section between invitation details and RSVP in `app/page.tsx`
- [X] T047 [US3] Verify gallery image sizing, loading states, remote-image configuration, and motion-safe behavior in `components/photo-gallery.tsx`

**Checkpoint**: User Story 3 is fully functional and testable independently.

---

## Phase 6: User Story 4 - Review Submitted RSVP Responses (Priority: P2)

**Goal**: The couple can review saved RSVP responses through the private managed dashboard while guests cannot see the response list.

**Independent Test**: Submit sample RSVPs, verify the response list contains required fields in the private dashboard, and confirm the public website exposes no RSVP list.

### Tests for User Story 4

- [X] T048 [P] [US4] Add privacy end-to-end test confirming no guest-facing RSVP list is exposed in `tests/e2e/rsvp-privacy.spec.ts`

### Implementation for User Story 4

- [X] T049 [P] [US4] Document couple-side response review steps and CSV export workflow in `docs/rsvp-review.md`
- [X] T050 [US4] Add schema comments or setup notes for required saved RSVP fields in `supabase/schema.sql`
- [X] T051 [US4] Verify guest write-only access and couple dashboard review against `specs/001-vietnamese-wedding-rsvp/contracts/rsvp-submission.md`

**Checkpoint**: User Story 4 is fully functional and testable independently.

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Final quality, performance, accessibility, security, and release readiness across all stories.

- [X] T052 [P] Audit responsive spacing, text fit, contrast, focus states, and keyboard navigation in `app/globals.css` and `components/`
- [X] T053 [P] Optimize gallery image compression and replacement guidance in `docs/gallery-media.md`
- [X] T054 [P] Add production deployment, Supabase Storage, and environment setup notes in `README.md`
- [X] T055 Run lint, typecheck, unit tests, build, and end-to-end tests using scripts defined in `package.json`
- [X] T056 Execute all validation scenarios from `specs/001-vietnamese-wedding-rsvp/quickstart.md`
- [X] T057 Review security requirements for server-only secrets, public RSVP write-only behavior, public gallery image access, HTTPS readiness, and user-facing error messages in `app/api/rsvp/route.ts`, `lib/supabase-server.ts`, and `supabase/storage.sql`
- [X] T058 Update `specs/001-vietnamese-wedding-rsvp/quickstart.md` with any final command, storage bucket, or environment adjustments discovered during implementation

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies; can start immediately.
- **Foundational (Phase 2)**: Depends on Setup completion; blocks all user stories.
- **User Stories (Phase 3+)**: Depend on Foundational completion.
- **Polish (Phase 7)**: Depends on all desired user stories being complete.

### User Story Dependencies

- **User Story 1 (P1)**: Starts after Foundational; no dependency on other user stories.
- **User Story 2 (P1)**: Starts after Foundational; can be implemented independently of gallery work.
- **User Story 3 (P2)**: Starts after Foundational; can be implemented independently after page shell exists, but final page placement is simplest after User Story 1.
- **User Story 4 (P2)**: Starts after RSVP persistence pieces from User Story 2 are available.

### MVP Scope

- Complete Phase 1 and Phase 2.
- Complete User Story 1 and User Story 2.
- This MVP lets guests read the Vietnamese invitation and submit RSVP responses directly on the website.

### Parallel Opportunities

- Setup tasks T002-T006 can run in parallel after T001 is started.
- Foundational tasks T010-T018 can run in parallel after the app structure exists.
- User Story 1 tests T020-T022 can run in parallel; implementation tasks T023-T024 can run in parallel.
- User Story 2 tests T027-T029 can run in parallel; implementation tasks T030-T031 can run in parallel.
- User Story 3 tests T036-T039 can run in parallel; storage setup T040, documentation T041, and metadata work T042 can run in parallel.
- User Story 4 documentation T049 can run in parallel with privacy test T048.
- Polish tasks T052-T054 can run in parallel before final validation tasks T055-T058.

---

## Parallel Example: User Story 1

```text
Task: "T020 [P] [US1] Add component tests for Vietnamese invitation content and required event details in tests/unit/invitation-section.test.tsx"
Task: "T021 [P] [US1] Add end-to-end test for invitation content visibility and Vietnamese accent rendering in tests/e2e/invitation.spec.ts"
Task: "T022 [P] [US1] Add mobile end-to-end test for readable invitation layout in tests/e2e/invitation-mobile.spec.ts"
Task: "T023 [P] [US1] Implement the invitation hero and event details component in components/invitation-section.tsx"
Task: "T024 [P] [US1] Implement venue details and optional map link rendering in components/venue-section.tsx"
```

## Parallel Example: User Story 2

```text
Task: "T027 [P] [US2] Add unit tests for RSVP schema validation, attendee count bounds, honeypot handling, and Vietnamese message preservation in tests/unit/rsvp-schema.test.ts"
Task: "T028 [P] [US2] Add contract tests for POST /api/rsvp success, validation failure, honeypot rejection, and temporary failure in tests/unit/rsvp-route.test.ts"
Task: "T029 [P] [US2] Add end-to-end tests for RSVP form validation, success confirmation, and retry error copy in tests/e2e/rsvp.spec.ts"
Task: "T030 [P] [US2] Implement the RSVP form fields, hidden honeypot field, client validation, pending state, success state, and error state in components/rsvp-form.tsx"
Task: "T031 [P] [US2] Implement the RSVP storage service for inserting validated responses in lib/rsvp-service.ts"
```

## Parallel Example: User Story 3

```text
Task: "T036 [P] [US3] Add unit tests for gallery media schema ordering, required public URLs, storage object paths, alt text, and captions in tests/unit/gallery-media-schema.test.ts"
Task: "T037 [P] [US3] Add component tests for gallery image ordering, remote source URLs, alt text, captions, and controls in tests/unit/photo-gallery.test.tsx"
Task: "T038 [P] [US3] Add end-to-end tests for desktop and mobile gallery navigation in tests/e2e/gallery.spec.ts"
Task: "T039 [P] [US3] Add end-to-end assertion that gallery image requests use configured managed storage URLs in tests/e2e/gallery-storage.spec.ts"
Task: "T040 [P] [US3] Add Supabase Storage bucket creation, public-read policy, upload path, and cache guidance to supabase/storage.sql"
Task: "T041 [P] [US3] Add gallery image upload and replacement instructions for the couple in docs/gallery-media.md"
Task: "T042 [P] [US3] Replace bundled placeholder image metadata with Supabase Storage publicUrl and storageObjectPath fields in lib/wedding-content.ts"
```

## Parallel Example: User Story 4

```text
Task: "T048 [P] [US4] Add privacy end-to-end test confirming no guest-facing RSVP list is exposed in tests/e2e/rsvp-privacy.spec.ts"
Task: "T049 [P] [US4] Document couple-side response review steps and CSV export workflow in docs/rsvp-review.md"
```

---

## Implementation Strategy

### MVP First

1. Complete Phase 1: Setup.
2. Complete Phase 2: Foundational.
3. Complete Phase 3: User Story 1.
4. Complete Phase 4: User Story 2.
5. Stop and validate the invitation viewing and RSVP submission flow end to end.

### Incremental Delivery

1. Deliver User Story 1 so guests can read the invitation.
2. Deliver User Story 2 so guests can submit RSVP responses.
3. Deliver User Story 3 to enrich the page with smooth Supabase Storage-hosted pre-wedding imagery.
4. Deliver User Story 4 to confirm couple review and guest privacy.
5. Complete polish tasks and release validation.

### Task Execution Rules

- Complete Setup and Foundational tasks before user story implementation.
- Keep each user story independently demonstrable at its checkpoint.
- For test tasks, create tests before implementation and confirm they fail for the missing behavior.
- Commit after each phase or coherent group of tasks.
- Do not add custom admin, guest login, search, queue, cache tier, public RSVP list, or guest media upload unless the spec changes.
