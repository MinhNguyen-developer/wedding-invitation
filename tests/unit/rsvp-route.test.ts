import { describe, expect, it, vi, beforeEach } from "vitest";

const appendRsvpResponse = vi.fn();

vi.mock("@/lib/google-sheets-service", () => ({
  appendRsvpResponse: (...args: unknown[]) => appendRsvpResponse(...args),
}));

async function post(body: unknown) {
  const { POST } = await import("@/app/api/rsvp/route");
  return POST(
    new Request("http://localhost/api/rsvp", {
      method: "POST",
      body: JSON.stringify(body),
    }),
  );
}

describe("POST /api/rsvp", () => {
  beforeEach(() => {
    appendRsvpResponse.mockReset();
  });

  it("returns 201 for a valid RSVP", async () => {
    appendRsvpResponse.mockResolvedValue(undefined);

    const response = await post({
      guestName: "Nguyễn Văn A",
      attendanceStatus: "attending",
      attendeeCount: 2,
      message: "Chúc mừng",
      website: "",
    });

    expect(response.status).toBe(201);
    expect(await response.json()).toEqual({
      ok: true,
      message: "Cảm ơn bạn đã phản hồi lời mời.",
    });
    expect(appendRsvpResponse).toHaveBeenCalledWith({
      guestName: "Nguyễn Văn A",
      attendanceStatus: "attending",
      attendeeCount: 2,
      message: "Chúc mừng",
    });
  });

  it("returns 400 for validation failures", async () => {
    const response = await post({
      guestName: "",
      attendanceStatus: "attending",
      attendeeCount: 0,
      message: "",
      website: "",
    });

    const body = await response.json();
    expect(response.status).toBe(400);
    expect(body.ok).toBe(false);
    expect(body.errors.guestName).toBe("Vui lòng nhập họ và tên.");
  });

  it("returns 400 for honeypot submissions", async () => {
    const response = await post({
      guestName: "Spam",
      attendanceStatus: "attending",
      attendeeCount: 1,
      message: "",
      website: "filled",
    });

    expect(response.status).toBe(400);
    expect(appendRsvpResponse).not.toHaveBeenCalled();
  });

  it("returns 503 when persistence fails", async () => {
    appendRsvpResponse.mockRejectedValue(new Error("offline"));

    const response = await post({
      guestName: "Lan",
      attendanceStatus: "attending",
      attendeeCount: 1,
      message: "",
      website: "",
    });

    expect(response.status).toBe(503);
    expect(await response.json()).toEqual({
      ok: false,
      message: "Hiện chưa thể gửi phản hồi. Vui lòng thử lại sau.",
    });
  });
});
