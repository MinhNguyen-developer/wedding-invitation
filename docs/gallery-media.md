# Gallery Media

Pre-wedding images are stored in the Supabase Storage bucket named `pre-wedding`.

## Setup

1. Open the Supabase SQL editor.
2. Run `supabase/storage.sql`.
3. Open Storage and confirm the `pre-wedding` bucket exists.
4. Upload optimized images using these production object paths:
   - `photo-01.jpg`
   - `photo-02.jpg`
   - `photo-03.jpg`

## Environment

Set this public base URL locally and in production:

```text
NEXT_PUBLIC_SUPABASE_STORAGE_PUBLIC_BASE_URL=https://PROJECT_REF.supabase.co/storage/v1/object/public/pre-wedding
```

If the variable is empty, the cover and album use the three local demo photographs in `public/images/demo/`, with a visible illustrative-photo label. Their sources are recorded in `public/images/demo/SOURCES.md`.

## Replacement

Replace photos by uploading new optimized files to the same object paths. Keep captions and descriptive alternative text in `lib/wedding-content.ts` aligned with the final images.

Once the public base URL is configured, the cover and the 3D album automatically use those real photos and remove the demo label. You can also replace the local fallback paths in `lib/wedding-content.ts`; remove `demoAltText` for your own local photos.

Before launch, check the gallery on desktop and mobile, then verify the rendered image sources use the Supabase Storage URL.
