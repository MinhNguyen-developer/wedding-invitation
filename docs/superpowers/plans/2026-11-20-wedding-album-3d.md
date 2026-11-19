# Wedding Album 3D Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a real 3D photo album and dimensional editorial cover using clearly labelled replaceable demo photos.
**Architecture:** Retain Embla for semantic gallery navigation and touch. Add a lazy Three.js album with the existing stage's shared canvas lifecycle; use Motion/CSS perspective for the cover.
**Tech Stack:** Existing Next.js, React, Framer Motion, Embla, Three.js. No dependencies.
**Spec:** `docs/superpowers/specs/2026-11-20-wedding-album-3d-design.md`

## Global Constraints

- Preserve the opening, native anchors, 44px controls and RSVP contract.
- Always enable motion, DPR at most 1.5; stop rendering when hidden/offscreen; dispose owned GPU resources.
- Demo photos must be labelled and replaced automatically when the existing Storage base URL is configured.

## Review Focus

- Texture requests completing after teardown must dispose their resources.
- Wraparound and rapid previous/next input must settle on the selected photo.
- Missing/lost GPU and failed textures must expose usable HTML photos and controls.
- One photo and arbitrary image aspect ratios must remain readable.
- Deep links, no JavaScript, mobile/landscape and live preference changes must preserve navigation.

### Task 1: Replaceable local demo photographs

**Files:** `lib/gallery-media-schema.ts`, `lib/wedding-content.ts`, `public/images/demo/`, `docs/gallery-media.md`, `tests/unit/gallery-media-schema.test.ts`.
**Interfaces:** `GalleryMediaItem.isDemo?: boolean`; source metadata `demoAltText?: string`. `createGalleryMediaItems` returns demo alt/flag only for local demo fallbacks and real alt/flag for configured Storage.

- [ ] Add tests for local demo metadata and automatic switch to real storage metadata; run `npm test -- tests/unit/gallery-media-schema.test.ts`, expect failure on missing demo flag.
- [ ] Download three bounded JPEG demo assets, inspect them, record sources; implement schema/content selection without changing storage object paths.
- [ ] Run `npm test`, expect all passing; commit demo sources and metadata.

### Task 2: Album scene and dimensional cover

**Files:** `components/webgl-scene-canvas.tsx`, `components/wedding-stage-scene.tsx`, `components/gallery-scene.tsx`, `lib/wedding-album-3d.ts`, `components/photo-gallery.tsx`, `components/editorial-portrait.tsx`, `app/globals.css`, browser/gallery tests and README.
**Interfaces:** Shared scene factory returns `{scene, camera, update(progress, pointerX, pointerY, aspect), dispose()}`; optional `ready` promise and `needsRender()` for asynchronous textures and settling selection. Gallery scene receives the stable photo array and selection MotionValue; semantic Embla remains authoritative.

- [ ] Add browser tests for demo labels, real WebGL pixels changing on navigation/scroll, keyboard controls, GPU/texture fallback and CSS cover perspective; run focused new test against existing implementation, expect missing WebGL/cover transform failure.
- [ ] Extract the existing renderer lifecycle, keep stage behavior, add texture-backed thick photo prints, cyclic selection interpolation and responsive camera. Animate cover layers with Motion transforms. Keep HTML images available for assistive technology and fallback.
- [ ] Run focused browser tests, unit, typecheck, lint, full E2E and isolated production build; inspect desktop/mobile screenshots. Expect all passing and no runtime errors.
- [ ] Get one fresh code review, resolve important findings with regression proof, commit and preserve the running user dev server.
