# Contract: Gallery Media

## Purpose

Define the managed pre-wedding image inputs used by the guest-facing gallery. Guests can view approved images, captions, and descriptive text, but they do not upload or manage gallery media through the public website.

## Source

Production gallery images are stored in the configured Supabase Storage bucket and referenced by public image URLs in the website gallery metadata.

## Gallery Item Shape

```json
{
  "publicUrl": "https://project-ref.supabase.co/storage/v1/object/public/pre-wedding/photo-01.jpg",
  "storageObjectPath": "photo-01.jpg",
  "altText": "Minh và Hà trong bộ ảnh cưới ngoài trời",
  "caption": "Khoảnh khắc bên nhau",
  "displayOrder": 1
}
```

## Fields

| Field | Type | Required | Rules |
|---|---|---|---|
| `publicUrl` | string | Yes | Must be a browser-accessible image URL for the configured storage bucket |
| `storageObjectPath` | string | Yes | Must identify the image object inside the storage bucket |
| `altText` | string | Yes | Must describe the image for accessibility and preserve Vietnamese accents |
| `caption` | string | No | Optional short caption shown with the image |
| `displayOrder` | number | Yes | Whole number used to sort gallery images |

## Access Rules

- Public website users may load approved gallery images.
- Public website users must not receive storage credentials.
- Public website users must not upload, replace, or delete gallery images.
- The couple manages the final image set outside the public website.

## Validation Rules

- Every gallery image must have a valid `publicUrl`, `storageObjectPath`, `altText`, and `displayOrder`.
- `displayOrder` values should produce a stable, intentional order.
- Images should be compressed and sized appropriately for mobile viewing before launch.
- If an image cannot load, the gallery must remain usable and should still expose meaningful alternative text.
