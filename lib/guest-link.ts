import { z } from "zod";

export const GUEST_LINKS_CACHE_TAG = "guest-links";
export const guestNameSchema = z.string()
  .transform((name) => name.normalize("NFC").trim().replace(/\s+/gu, " "))
  .pipe(z.string().min(1, "Hãy nhập cách xưng hô và tên khách.").max(120, "Tên khách tối đa 120 ký tự."))
  .refine((name) => /[\p{L}\p{N}]/u.test(name) && !/[\p{Cc}\p{Cf}<>]/u.test(name), "Tên khách có ký tự không hợp lệ.");

export const MAX_GUESTS_PER_BATCH = 100;
export const guestNamesSchema = z.array(guestNameSchema)
  .transform((names) => [...new Set(names)])
  .pipe(z.array(z.string()).min(1, "Hãy nhập ít nhất một khách mời.")
    .max(MAX_GUESTS_PER_BATCH, `Mỗi lượt tối đa ${MAX_GUESTS_PER_BATCH} khách mời.`));

export function splitGuestLines(text: string): string[] {
  return text.split(/\r\n?|\n/).filter((line) => line.trim());
}

export function guestListError(error: z.ZodError): string {
  const issue = error.issues[0];
  return typeof issue.path[0] === "number" ? `Khách thứ ${issue.path[0] + 1}: ${issue.message}` : issue.message;
}

export const guestSlugSchema = z.string().min(1).max(120).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);

export function createGuestSlug(name: string): string {
  return name.normalize("NFD").replace(/\p{M}/gu, "").replace(/[đĐ]/g, "d")
    .toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")
    .slice(0, 80).replace(/-$/, "") || "khach-moi";
}

export function guestInvitationPath(slug: string): string {
  return `/for/${guestSlugSchema.parse(slug)}`;
}

export function guestAlbumPath(slug?: string): string {
  return slug ? `/album?for=${guestSlugSchema.parse(slug)}` : "/album";
}
