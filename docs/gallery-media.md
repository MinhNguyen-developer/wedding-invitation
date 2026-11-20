# Gallery Media

Pre-wedding images are stored in the Supabase Storage bucket named `pre-wedding`.

## Setup

1. Open the Supabase SQL editor.
2. Run `supabase/storage.sql`.
3. Open Storage and confirm the `pre-wedding` bucket exists.
4. Upload ten optimized images using production object paths `photo-01.jpg` through `photo-10.jpg`.

## Environment

Set this public base URL locally and in production:

```text
NEXT_PUBLIC_SUPABASE_STORAGE_PUBLIC_BASE_URL=https://PROJECT_REF.supabase.co/storage/v1/object/public/pre-wedding
```

If the variable is empty, the cover and separate `/album` page use the ten local demo photographs in `public/images/demo/`, with a visible illustrative-photo label. Their sources are recorded in `public/images/demo/SOURCES.md`.

## Replacement

Replace photos by uploading new optimized files to the same object paths. Keep captions and descriptive alternative text in `lib/wedding-content.ts` aligned with the final images.

Once the public base URL is configured, the cover and the 3D album automatically use those real photos and remove the demo label. You can also replace the local fallback paths in `lib/wedding-content.ts`; remove `demoAltText` for your own local photos.

Each item becomes one scroll chapter in order. Captions and alternative text remain in `lib/wedding-content.ts`; the chapter count, progress and camera path follow the configured array. Open `/album#photo-05` to preview an individual chapter. Landscape and portrait photographs retain their aspect ratios in 3D.

Before launch, check the gallery on desktop and mobile, then verify the rendered image sources use the Supabase Storage URL.
