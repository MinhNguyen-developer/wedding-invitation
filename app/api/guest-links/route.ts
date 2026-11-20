import { revalidateTag } from "next/cache";
import { NextResponse } from "next/server";
import { GUEST_LINKS_CACHE_TAG, guestInvitationPath, guestListError, guestNamesSchema } from "@/lib/guest-link";
import { createGuestLink, createGuestLinks } from "@/lib/guest-links-service";

export const runtime = "nodejs";
export const maxDuration = 30;

async function readBody(request: Request): Promise<unknown> {
  const reader = request.body?.getReader();
  if (!reader) throw new SyntaxError("Missing body");
  const decoder = new TextDecoder("utf-8", { fatal: true });
  let bytes = 0;
  let text = "";
  try {
    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      bytes += value.byteLength;
      if (bytes > 65536) { await reader.cancel(); throw new RangeError("Body too large"); }
      text += decoder.decode(value, { stream: true });
    }
    return JSON.parse(text + decoder.decode());
  } finally { reader.releaseLock(); }
}

export async function POST(request: Request) {
  if (!request.headers.get("content-type")?.toLowerCase().startsWith("application/json")) {
    return NextResponse.json({ ok: false, message: "Thông tin khách chưa hợp lệ." }, { status: 415 });
  }
  let body: unknown;
  try {
    body = await readBody(request);
  } catch (error) {
    if (error instanceof RangeError) return NextResponse.json({ ok: false, message: "Danh sách quá dài. Bạn hãy chia nhỏ rồi thử lại." }, { status: 413 });
    return NextResponse.json({ ok: false, message: "Thông tin khách chưa hợp lệ." }, { status: 400 });
  }
  const input = body && typeof body === "object" ? body : {};
  const bulk = "displayNames" in input;
  const names = guestNamesSchema.safeParse(bulk ? input.displayNames : ["displayName" in input ? input.displayName : undefined]);
  if (!names.success) return NextResponse.json({ ok: false, message: guestListError(names.error) }, { status: 400 });
  try {
    const guests = bulk ? await createGuestLinks(names.data) : [await createGuestLink(names.data[0])];
    revalidateTag(GUEST_LINKS_CACHE_TAG);
    const links = guests.map((guest) => ({ path: guestInvitationPath(guest.slug), displayName: guest.displayName }));
    return NextResponse.json(bulk ? { ok: true, guests: links } : { ok: true, ...links[0] }, { status: 201, headers: { "Cache-Control": "no-store" } });
  } catch {
    return NextResponse.json({ ok: false, message: "Chưa lưu được khách mời. Bạn hãy thử lại nhé." }, { status: 503 });
  }
}
