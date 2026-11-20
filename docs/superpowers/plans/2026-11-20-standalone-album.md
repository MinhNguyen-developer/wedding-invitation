# Standalone Scroll Album Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Deliver `/album` with ten demo photos, each part of a real scroll-driven 3D journey.
**Spec:** `docs/superpowers/specs/2026-11-20-standalone-album-design.md`
**Architecture:** One existing shared Three.js canvas travels through ten photo chapters. Server-rendered image chapters remain usable as a CSS 3D/HTML fallback. Home contains a preview link, not the previous carousel.
**Tech Stack:** Existing Next.js, Framer Motion and Three.js; no new dependencies.

## Global constraints

Preserve home opening, venue, native links and RSVP. Motion stays enabled independent of device preferences. DPR at most 1.5; no render loop when hidden or settled; dispose resources on navigation. Do not stop the user dev server on 3001.

## Review focus

Correct focus at all ten chapters and deep links; resize/landscape alignment; partial texture failures and late load cleanup; route navigation/unmount; CSS fallback readability with no GPU or JS.

### Task 1: Ten-photo content and route

**Files:** `lib/wedding-content.ts`, `public/images/demo`, `app/album/page.tsx`, `components/album-experience.tsx`, `components/photo-gallery.tsx`, `components/site-nav.tsx`, `components/invitation-section.tsx`, relevant unit/E2E tests.
**Interfaces:** Existing `GalleryMediaItem[]` with ten unique sources, optional demo flags; `AlbumExperience({photos})` owns full-page progress; `/album#photo-01` through `/album#photo-10` are native targets.

- [x] Add ten-photo and standalone route regression tests; observe failures before implementation.
- [x] Download seven additional local JPEGs; inspect, label and document sources. Build the route, SSR chapters, navigation and home preview.
- [x] Run unit tests and focused route tests; preserve automatic real-photo replacement.

### Task 2: Scroll-driven 3D journey

**Files:** `lib/wedding-album-3d.ts`, `components/gallery-scene.tsx`, `components/webgl-scene-canvas.tsx`, album components/styles, gallery browser tests and docs.
**Interfaces:** `createWeddingAlbum(renderer, photos)` returns the existing scene controller with `update(progress,pointerX,pointerY,aspect)` and texture `ready`; progress maps linearly across `photos.length - 1` camera stops.

- [x] Add tests for every photo's scroll animation, native fragments, missing/lost GPU, individual image failure, no JS and mobile bounds; observe missing-feature failures.
- [x] Replace the old circular selection scene with a gallery camera path and individual photo transforms; remove the old selection-only renderer hooks and carousel CSS. Retain per-photo image failure fallback.
- [x] Run typecheck/lint/unit, full browser suite and isolated production build; inspect images at desktop/mobile and intermediate scroll positions.
- [x] Perform one fresh read-only review, fix material findings with regression proof, save the result on the current branch, clean only task-owned test assets.

## Verified result

- Ten-photo content and `/album` route failed their initial regression checks, then passed after implementation.
- Unit25/25, typecheck, lint and isolated production build pass. All66 browser tests pass against production with one worker (66/66); the separate GPU-only screenshot proof also passes desktop/mobile for every photo.
- An independent review found two material issues: resize changed the selected chapter and compact HTML fallback obscured captions. Both were reproduced with failing tests and fixed; their regressions and the full suite pass. No unresolved findings, declined judgments or deferred minors.
- Concurrent headless GPU runs produced intermittent home-scroll timing failures; isolated repeats and the final serial production suite pass. No source workaround was applied for those timing failures.
- Desktop/mobile renders, chapter8 burgundy scene and compact HTML fallback inspected. User preview server on3001 preserved. No RSVP data submitted or backend changed.
