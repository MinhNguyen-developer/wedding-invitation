import { cache } from "react";
import type { Metadata } from "next";
import { unstable_cache } from "next/cache";
import { notFound } from "next/navigation";
import { WeddingInvitation } from "@/components/wedding-invitation";
import { getGuestLinks } from "@/lib/guest-links-service";
import { GUEST_LINKS_CACHE_TAG, guestSlugSchema } from "@/lib/guest-link";

export const dynamic = "force-dynamic";
const readGuests = unstable_cache(getGuestLinks, [GUEST_LINKS_CACHE_TAG, process.env.GOOGLE_SHEETS_SPREADSHEET_ID ?? "", process.env.GOOGLE_SHEETS_GUESTS_SHEET_NAME ?? "GuestLinks"], { revalidate: 60, tags: [GUEST_LINKS_CACHE_TAG] });
const findGuest = cache(async (slug: string) => guestSlugSchema.safeParse(slug).success ? (await readGuests()).find((guest) => guest.slug === slug) : undefined);
type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const guest = await findGuest((await params).slug);
  const title = guest ? `Thân mời ${guest.displayName} · Minh & Hà` : "Lời mời · Minh & Hà";
  return { title, openGraph: { title }, robots: { index: false, follow: false } };
}

export default async function PersonalInvitation({ params }: Props) {
  const { slug } = await params;
  const guest = await findGuest(slug);
  if (!guest) notFound();
  return <WeddingInvitation guestName={guest.displayName} guestSlug={slug} />;
}
