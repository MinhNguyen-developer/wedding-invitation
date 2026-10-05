# Implementation Plan: Vietnamese Wedding Invitation RSVP Website

**Branch**: `001-vietnamese-wedding-rsvp` | **Date**: 2026-08-09 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/001-vietnamese-wedding-rsvp/spec.md`

## Summary

Build a static-first, single-page Vietnamese wedding invitation website with a polished mobile-first guest experience, smooth pre-wedding photo transitions sourced from Supabase Storage, and a direct RSVP form. Use a minimal server-side submission path to validate RSVP responses and append them to a private Google Sheet through the Google Sheets API, while keeping guest access write-only.

## Technical Context

**Language/Version**: TypeScript with current Node.js LTS pinned in project tooling

**Primary Dependencies**: Next.js, React, Tailwind CSS, Framer Motion, Embla Carousel or Swiper, React Hook Form, Zod, Google APIs client library, Next image remote configuration for Supabase-hosted gallery images

**Storage**: Google Sheets API for new RSVP submissions; Supabase Storage bucket for optimized pre-wedding imagery

**Testing**: Unit/component tests for validation and UI states; end-to-end tests for invitation viewing, gallery display, RSVP success, RSVP validation failure, and guest inability to access response list; manual mobile quickstart validation

**Target Platform**: Responsive web application deployed to managed static/edge hosting with a minimal server-side RSVP endpoint

**Project Type**: Web application

**Performance Goals**: Primary invitation details visible or reachable within 10 seconds on a typical mobile connection; smooth gallery transitions; valid RSVP completion in under 1 minute

**Constraints**: Vietnamese Unicode/accent support; no guest login; no public RSVP list; no custom admin dashboard; no cache/search/vector database/message queue for MVP; privileged credentials must never be exposed to browser code; gallery images load from public Supabase Storage URLs with optimized sizing and descriptive alt text

**Scale/Scope**: Personal wedding invitation traffic for invited guests, friends, and family; low-volume synchronous RSVP submissions; first release supports Vietnamese only

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

The project constitution currently contains placeholder principles only, so there are no active project-specific gates to enforce. The design follows the available governance intent by staying simple, bounded, testable, and free of unnecessary distributed-system complexity.

**Initial Gate Result**: PASS

## Project Structure

### Documentation (this feature)

```text
specs/001-vietnamese-wedding-rsvp/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   ├── gallery-media.md
│   └── rsvp-submission.md
└── tasks.md
```

### Source Code (repository root)

```text
app/
├── api/
│   └── rsvp/
│       └── route.ts
├── globals.css
├── layout.tsx
└── page.tsx

components/
├── invitation-section.tsx
├── photo-gallery.tsx
├── rsvp-form.tsx
├── site-nav.tsx
├── ui.tsx
└── venue-section.tsx

lib/
├── rsvp-schema.ts
├── google-sheets-service.ts
└── wedding-content.ts

supabase/
└── storage.sql

tests/
├── e2e/
└── unit/
```

**Structure Decision**: Use a single Next.js web application at the repository root. Keep reusable UI in `components/`, validation and the Google Sheets API transport in `lib/`, and the RSVP write path in `app/api/rsvp/route.ts`. Keep gallery metadata/source URLs in editable content configuration and production pre-wedding images in Supabase Storage.

## Complexity Tracking

No constitution violations or complexity exceptions are required.

## Phase 0 Research

See [research.md](./research.md).

## Phase 1 Design

See [data-model.md](./data-model.md), [contracts/gallery-media.md](./contracts/gallery-media.md), [contracts/rsvp-submission.md](./contracts/rsvp-submission.md), and [quickstart.md](./quickstart.md).

## Constitution Check Post-Design

The design remains a single static-first web application with one minimal RSVP submission interface, no custom admin dashboard, no search, no queue, no cache tier, and no distributed infrastructure. Guest privacy is enforced through write-only guest behavior and provider-side access control.

**Post-Design Gate Result**: PASS
