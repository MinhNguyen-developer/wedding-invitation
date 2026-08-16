import { z } from "zod";

const browserImageSource = z.string().trim().min(1, "Image source is required.");

export const galleryMediaSchema = z.object({
  publicUrl: browserImageSource.refine((value) => value.startsWith("/") || isValidHttpUrl(value), {
    message: "Image source must be a public URL or local fallback path."
  }),
  storageObjectPath: z
    .string()
    .trim()
    .min(1, "Storage object path is required.")
    .refine((value) => !value.startsWith("/") && !value.includes(".."), {
      message: "Storage object path must be relative to the bucket."
    }),
  altText: z.string().trim().min(1, "Alt text is required."),
  caption: z.string().trim().optional(),
  displayOrder: z.number().int().positive()
});

export const galleryMediaItemsSchema = z.array(galleryMediaSchema).min(1, "At least one gallery image is required.");

export type GalleryMediaItem = z.infer<typeof galleryMediaSchema>;

type GalleryMediaSource = Omit<GalleryMediaItem, "publicUrl"> & {
  localFallbackPath: string;
};

export function createGalleryMediaItems(
  items: GalleryMediaSource[],
  storagePublicBaseUrl?: string
): GalleryMediaItem[] {
  const normalizedStorageBaseUrl = normalizeBaseUrl(storagePublicBaseUrl);

  return galleryMediaItemsSchema
    .parse(
      items.map(({ localFallbackPath, storageObjectPath, ...item }) => ({
        ...item,
        storageObjectPath,
        publicUrl: normalizedStorageBaseUrl
          ? `${normalizedStorageBaseUrl}/${storageObjectPath}`
          : localFallbackPath
      }))
    )
    .slice()
    .sort((a, b) => a.displayOrder - b.displayOrder);
}

export function isManagedStorageUrl(value: string): boolean {
  if (!isValidHttpUrl(value)) {
    return false;
  }

  const url = new URL(value);
  return url.hostname.endsWith(".supabase.co") && url.pathname.includes("/storage/v1/object/public/");
}

function normalizeBaseUrl(value?: string): string | undefined {
  const trimmed = value?.trim();
  if (!trimmed) {
    return undefined;
  }

  return trimmed.replace(/\/+$/, "");
}

function isValidHttpUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return url.protocol === "https:" || url.protocol === "http:";
  } catch {
    return false;
  }
}
