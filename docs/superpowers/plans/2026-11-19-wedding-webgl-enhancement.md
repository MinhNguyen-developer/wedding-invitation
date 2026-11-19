# Wedding WebGL Enhancement Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [x]`) syntax for tracking.

**Goal:** Correct the missing real 3D experience identified by the user, while preserving the approved two-scene invitation.

**Architecture:** A lazy WebGL scene enhances the existing opening at its current scroll-motion seam. Three.js owns folded fabric geometry, physically shaded gold rings, studio lighting and a perspective camera; the existing CSS/SVG remains the readable fallback. The initial layout and native anchors stay stable.

**Tech Stack:** Existing Next.js/React/Framer Motion plus Three.js 0.187.0 and matching development types.

**Spec:** `docs/superpowers/specs/2026-11-19-wedding-scroll-redesign-design.md`, amended by the user's explicit expectation of real 3D on 19/11/2026.

## Global Constraints

- Preserve the two screens, current wedding content, album, venue, RSVP and native anchor behavior.
- Real WebGL geometry, lighting and perspective camera are required; translating flat layers alone does not satisfy this correction.
- Keep the CSS/SVG fallback until the first successful rendered frame; use it for unavailable/lost WebGL, no JavaScript and reduced motion.
- Reserve the full opening layout before hydration; no scroll interception or camera work that moves native anchor destinations.
- Limit pixel ratio, pause rendering offscreen/hidden, and dispose GPU resources/listeners on teardown.
- Lazy-load the renderer; no model downloads, external texture service, GSAP or React Three Fiber are needed for this bounded scene.

## Review Focus

- An unsupported GPU or a lost context leaves the invitation usable and the fallback visible.
- Reduced-motion preference avoids loading/running a nonessential WebGL scene.
- Native scrolling and direct RSVP deep links keep working during renderer loading.
- Mobile and short landscape screens contain the canvas without horizontal overflow.
- Teardown, resizes and document visibility do not leak loops, listeners or GPU allocations.

### Task 1: Render the real 3D opening with safe fallback

**Files:** Create `components/wedding-stage-scene.tsx`, `lib/wedding-stage-3d.ts`, `lib/use-reduced-motion.ts`, `tests/e2e/webgl-stage.spec.ts`; modify `components/scroll-scenes.tsx`, `components/editorial-portrait.tsx`, `components/photo-gallery.tsx`, `app/globals.css`, `package.json`, `package-lock.json`.

**Interfaces:** `WeddingStageScene({progress, onReady}: {progress: MotionValue<number>; onReady: (ready: boolean) => void})` owns the canvas lifecycle; `createWeddingStage(renderer: WebGLRenderer)` returns the scene, camera, update(progress, pointerX, pointerY, aspect) and dispose(); `useReducedMotionPreference(): boolean` subscribes to the live browser preference with a static server snapshot. No backend changes.

- [x] Write and run a browser test requiring a genuine WebGL canvas and changing scene output on scroll; confirm it fails because the renderer is absent.
- [x] Install matching Three.js runtime/types from npm; implement folded silk meshes, intertwined gold rings, an architectural alcove, studio reflection lighting and camera movement controlled by the existing progress value.
- [x] Integrate dynamic loading and first-frame readiness at OpeningStage. Preserve all existing content and fallback layers.
- [x] Test unsupported/lost WebGL, reduced motion, scrolling, mobile canvas size and direct RSVP navigation. Keep meaningful renderer proof and the existing unit suite green.

### Task 2: Verify appearance and finish the correction

**Files:** Update the design/README implementation notes and this plan.

- [x] Inspect actual rendered frames, adjust framing/materials only as needed for the requested luxury 3D effect.
- [x] Run unit tests, the relevant/full browser suite, type/build checks and diff whitespace validation.
- [x] Obtain one fresh read-only code review, resolve material findings with focused proof, and keep the work on the current feature branch.

## Scope correction

The earlier design deliberately chose CSS/SVG and omitted a 3D engine. The user has now identified that omission as contrary to their expectation from Cartier/Oryzo. This task corrects that implementation decision under the existing request to implement the redesign; it does not reopen the agreed two-screen layout. Folded fabric and gold wedding rings are the implementer's visual choices, not additional claims about what the user specified. Stop when the real 3D opening works, looks intentional, and all practical invitation paths remain usable.

## Final proof

24/24 unit tests, 44/44 browser tests, typecheck and production build passed. Ten focused GPU/motion/anchor cases passed again against the isolated production build. Actual desktop/phone WebGL frames were inspected. Review findings on supported shadow configuration and live reduced motion were reproduced and fixed; no findings remain deferred. The user-owned dev server on port 3001 was preserved.
