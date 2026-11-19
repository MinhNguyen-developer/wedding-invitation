# Wedding Scroll Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [x]`) syntax for tracking.

**Goal:** Deliver the approved curtain opening and editorial wedding experience in the current repository.

**Architecture:** Server-rendered wedding content composes small client components for scroll transforms and image failure recovery. Native page scrolling, existing Embla gallery and RSVP contract remain the owners of their behavior.

**Tech Stack:** Next.js 15, React 19, Tailwind 3, installed Framer Motion, Embla, Lucide, Vitest and Playwright.

**Spec:** `docs/superpowers/specs/2026-11-19-wedding-scroll-redesign-design.md`

## Global Constraints

- Preserve all existing wedding content, `#loi-moi`, `#album`, `#dia-diem`, `#rsvp` and `/api/rsvp` behavior.
- Two scenes on one scrolling page; desktop opening 170–190svh, phone opening 130–150svh.
- Reduced motion and no JavaScript: readable static scenes without the extra animation scroll distance.
- No new dependencies, invented couple photos, auto-playing audio or publishing.
- Minimum body 16px; visible focus, keyboard navigation and 44px interactive targets.

## Review Focus

- Direct RSVP anchors bypass the decorative opening and fixed navigation does not hide focus.
- Reduced motion and no JavaScript expose complete readable content without hidden reveals or empty scroll distance.
- No-photo and failed-photo states remain intentional and do not show unrelated couples.
- Long Vietnamese labels and short landscape screens reflow without clipping or horizontal scrolling.
- RSVP non-attendance sends zero attendees and server/network failures retain entered data.

### Task 1: Build the two scenes and make their proof runnable

**Files:** Modify `vitest.config.ts`, `tailwind.config.ts`, `app/globals.css`, `app/page.tsx`, `components/invitation-section.tsx`, `components/site-nav.tsx`, `lib/gallery-media-schema.ts`; create `components/scroll-scenes.tsx`, `components/wedding-monogram.tsx`, `components/editorial-portrait.tsx`; update `tests/unit/invitation-section.test.tsx`, `tests/unit/gallery-media-schema.test.ts`; create `tests/unit/editorial-portrait.test.tsx`.

**Interfaces:** `OpeningStage({children}: {children: React.ReactNode})` wraps server-rendered heading/content; `ScrollReveal({children,className?})` keeps SSR content visible; `EditorialPortrait({photo}: {photo: GalleryMediaItem})` renders the supplied real photo or monogram fallback; `WeddingMonogram({className?})` renders decorative SVG; `isPlaceholderPhoto(publicUrl: string): boolean` identifies existing local SVG placeholders.

- [x] Repair the baseline alias with Node `fileURLToPath`, then run the suite and distinguish stale tests from new failures.
- [x] First write tests that require opening + editorial regions, preserve current invitation/event content, and exercise portrait placeholder/remote/error behavior. Run them and confirm expected missing-component/region failures.
- [x] Implement curtain transforms driven by `useScroll`/`useTransform`. Reserve the enhanced layout in the initial CSS so hydration cannot displace native anchors; use noscript/reduced-motion static overrides. Keep content visible in SSR.
- [x] Implement editorial portrait/parallax, central content rendering and shared palette/typography. Update native anchor navigation and footer.
- [x] Run `npm test -- --reporter=dot` and `npm run typecheck`; Task 2 owns gallery stale expectations. Commit the scene implementation after its focused tests pass.

### Task 2: Integrate album, venue and RSVP; verify and review

**Files:** Modify `components/photo-gallery.tsx`, `components/venue-section.tsx`, `components/rsvp-form.tsx`, `components/ui.tsx`, `playwright.config.ts`, stale files in `tests/e2e/`, `tests/unit/photo-gallery.test.tsx`; create `tests/unit/rsvp-form.test.tsx`, `tests/e2e/scroll-scenes.spec.ts`; update design status and README preview instructions.

**Interfaces:** Consume Task 1's `ScrollReveal`, `WeddingMonogram`, `isPlaceholderPhoto` and palette classes. Preserve `RsvpForm()` and `PhotoGallery()` public interfaces and `/api/rsvp` payload/response types.

- [x] Write and run gallery tests for placeholder/remote/error states and previous/next controls, plus RSVP tests for attendance payloads, validation, success, server failure and network retry.
- [x] Restyle gallery/venue/form at their current owners. Preserve image metadata, disable gallery control animation for reduced motion, and retain all labels, errors and live regions.
- [x] Align old e2e content assertions to the central wedding content and point Playwright to the existing dev port 3001. Add tests for scene order, curtain movement, reduced motion, no-JS content, direct anchors, responsive widths and short landscape layout.
- [x] Run `npm test -- --reporter=dot`, `npm run typecheck`, `npm run build`, `git diff --check`, and the e2e runner when its browser runtime is available. Report any infrastructure limitation without claiming browser QA.
- [x] Commit completed work, run one fresh whole-change review and resolve material findings with a focused regression check.

## Execution notes

Approved for implementation by the user's “Hãy triển khai” on 19/11/2026. Execute inline in this session; no additional design approval is needed. Work on `codex/wedding-scroll-redesign` in the existing checkout so its installed dependencies and local preview stay available. Do not merge or publish.
