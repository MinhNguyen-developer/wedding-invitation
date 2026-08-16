# Research: Vietnamese Wedding Invitation RSVP Website

## Decision: Static-first single-page architecture

**Rationale**: The approved spec is content-heavy with one small dynamic workflow: RSVP submission. A static-first page gives guests fast loading, strong reliability, and a simple deployment model while still allowing a controlled server-side submission path.

**Alternatives considered**:
- Full backend application: rejected because the scope does not require complex server behavior or a custom admin area.
- Microservices: rejected because the domain is small, traffic is low, and operational burden would be disproportionate.
- No-code form embed: rejected because the approved spec requires RSVP directly inside the website with a cohesive visual experience.

## Decision: Next.js, React, and TypeScript

**Rationale**: This stack supports a polished single-page web experience, server-side submission handling, strong type safety, and straightforward deployment. It also leaves room for static pages, image optimization, and a small RSVP route without introducing a separate backend project.

**Alternatives considered**:
- Plain HTML/CSS/JavaScript: simpler, but weaker for form validation structure, component reuse, and future maintainability.
- Vue/Nuxt: viable, but the chosen ecosystem better matches the earlier stack recommendation and common deployment workflows.
- Separate frontend and backend apps: rejected because the feature only needs one controlled RSVP submission path.

## Decision: Tailwind CSS for styling

**Rationale**: Tailwind supports fast, consistent, responsive implementation with a low styling overhead. It is well-suited to a one-page wedding invitation where visual polish and mobile behavior matter.

**Alternatives considered**:
- Plain CSS modules: viable, but slower for rapid responsive layout iteration.
- Component library: rejected because generic components may make the wedding design feel less bespoke and add unnecessary weight.

## Decision: Framer Motion for elegant motion

**Rationale**: The spec calls for smooth image and section transitions. Framer Motion provides expressive animation primitives while keeping motion close to UI components.

**Alternatives considered**:
- CSS-only animations: viable for simple fades, but less ergonomic for coordinated gallery/section transitions.
- Heavy animation frameworks: rejected as unnecessary for this small user experience.

## Decision: Embla Carousel preferred for photo gallery

**Rationale**: Embla is lightweight, flexible, and works well for custom, touch-friendly galleries. It fits the need for smooth transitions without forcing a large visual framework.

**Alternatives considered**:
- Swiper: strong and feature-rich, but heavier than needed for a wedding photo gallery.
- Custom carousel from scratch: rejected because touch behavior, accessibility, and edge cases are easy to get wrong.

## Decision: React Hook Form and Zod for RSVP validation

**Rationale**: The RSVP form has clear validation rules for required fields and attendee counts. React Hook Form keeps form state efficient, while Zod lets the same rules guide client-facing validation and server-side validation.

**Alternatives considered**:
- Manual validation: possible, but easier to drift between client and server behavior.
- Schema-less server-only validation: protects storage but gives a worse guest experience.

## Decision: Minimal server-side RSVP route

**Rationale**: RSVP submission should be validated before persistence and should not expose privileged credentials to browser code. A minimal server route keeps this boundary explicit while avoiding a separate backend application.

**Alternatives considered**:
- Direct browser-to-storage writes: simpler, but requires very careful public permissions and offers less control over throttling/spam checks.
- Full backend service: rejected because it adds deployment and maintenance work without enough benefit.

## Decision: Supabase managed Postgres for RSVP storage and review

**Rationale**: RSVP responses are structured records and fit naturally in a relational table. Supabase also gives the couple a ready-made dashboard for reviewing responses, satisfying the spec without a custom admin dashboard.

**Alternatives considered**:
- Google Sheets: very simple, but less suitable for controlled validation and write-only guest access.
- Firebase/Firestore: viable, but document storage is less natural for tabular RSVP review.
- Self-hosted database: rejected because the project should minimize operations.

## Decision: Supabase Storage bucket for pre-wedding images

**Rationale**: The couple wants pre-wedding images stored in Supabase rather than bundled as static project files. Using a managed storage bucket keeps RSVP data and wedding media in one provider, lets the image set be replaced before launch without code asset churn, and avoids making the repository carry large photo files.

**Alternatives considered**:
- Bundled public assets: simplest for local development, but every photo replacement changes the app bundle and repository.
- Dedicated image CDN: strong media optimization, but adds another provider for a small wedding site.
- Supabase Storage: fits the existing provider choice, keeps operational overhead low, and is sufficient for expected invitation traffic.

## Decision: No cache, search/vector database, or messaging queue

**Rationale**: The approved scope has low-volume synchronous RSVP writes, no search requirements, and static public content. Additional infrastructure would add cost and failure modes without improving the guest experience.

**Alternatives considered**:
- Redis cache: rejected because there is no repeated dynamic read path.
- Queue for RSVP processing: rejected because no asynchronous workflow is required.
- Search/vector database: rejected because there is no content discovery or semantic search need.

## Decision: Vercel hosting with managed environment variables

**Rationale**: Vercel fits a Next.js static-first web application, supports previews, production deployments, HTTPS, edge/static asset delivery, and environment variable management with low operational overhead.

**Alternatives considered**:
- Cloudflare Pages: strong static hosting, but the chosen Next.js server route and deployment flow are more direct on Vercel.
- AWS/GCP/Azure primitives: powerful, but overbuilt for a small personal wedding site.

## Decision: Write-only guest behavior and provider dashboard review

**Rationale**: Guests should not authenticate and should not see other RSVPs. The couple can review responses in the provider dashboard, eliminating custom admin scope while satisfying the privacy requirement.

**Alternatives considered**:
- Guest accounts: rejected by scope and poor RSVP ergonomics.
- Public RSVP list: rejected by the approved spec.
- Custom admin dashboard: explicitly out of scope.
