import { NextResponse } from "next/server";
import {
  formatZodErrors,
  hasHoneypotValue,
  rsvpRequestSchema,
} from "@/lib/rsvp-schema";
import { appendRsvpResponse } from "@/lib/google-sheets-service";

export const maxDuration = 20;
export const runtime = "nodejs";

export async function POST(request: Request) {
  let payload: unknown;

  try {
    payload = await request.json();
  } catch {
    return NextResponse.json(
      {
        ok: false,
        message: "Vui lòng kiểm tra lại thông tin phản hồi.",
        errors: { form: "Dữ liệu gửi lên không hợp lệ." },
      },
      { status: 400 },
    );
  }

  if (hasHoneypotValue(payload)) {
    console.warn("Rejected RSVP submission with honeypot value.");
    return NextResponse.json(
      { ok: false, message: "Không thể gửi phản hồi lúc này." },
      { status: 400 },
    );
  }

  const parsed = rsvpRequestSchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json(
      {
        ok: false,
        message: "Vui lòng kiểm tra lại thông tin phản hồi.",
        errors: formatZodErrors(parsed.error),
      },
      { status: 400 },
    );
  }

  try {
    await appendRsvpResponse({
      guestName: parsed.data.guestName,
      attendanceStatus: parsed.data.attendanceStatus,
      attendeeCount: parsed.data.attendeeCount,
      message: parsed.data.message?.trim() ?? "",
    });

    console.info("RSVP submission written to Google Sheets.");
    return NextResponse.json(
      { ok: true, message: "Cảm ơn bạn đã phản hồi lời mời." },
      { status: 201 },
    );
  } catch (e) {
    console.error("RSVP submission failed.", e);
    return NextResponse.json(
      {
        ok: false,
        message: "Hiện chưa thể gửi phản hồi. Vui lòng thử lại sau.",
      },
      { status: 503 },
    );
  }
}
