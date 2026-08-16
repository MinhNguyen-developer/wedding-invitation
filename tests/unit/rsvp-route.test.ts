import { describe, expect, it, vi, beforeEach } from "vitest";

const saveRsvpResponse = vi.fn();

vi.mock("@/lib/rsvp-service", () => ({
  saveRsvpResponse: (...args: unknown[]) => saveRsvpResponse(...args)
}));

async function post(body: unknown) {
  const { POST } = await import("@/app/api/rsvp/route");
  return POST(
    new Request("http://localhost/api/rsvp", {
      method: "POST",
      body: JSON.stringify(body)
    })
  );
}

describe("POST /api/rsvp", () => {
  beforeEach(() => {
    saveRsvpResponse.mockReset();
  });

  it("returns 201 for a valid RSVP", async () => {
    saveRsvpResponse.mockResolvedValue(undefined);

    const response = await post({
      guestName: "Nguyễn Văn A",
      attendanceStatus: "attending",
      attendeeCount: 2,
      message: "Chúc mừng",
      website: ""
    });

    expect(response.status).toBe(201);
    expect(await response.json()).toEqual({ ok: true, message: "Cảm ơn bạn đã phản hồi lời mời." });
    expect(saveRsvpResponse).toHaveBeenCalledWith({
      guest_name: "Nguyễn Văn A",
      attendance_status: "attending",
      attendee_count: 2,
      message: "Chúc mừng"
    });
  });

  it("returns 400 for validation failures", async () => {
    const response = await post({
      guestName: "",
      attendanceStatus: "attending",
      attendeeCount: 0,
      message: "",
      website: ""
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
      website: "filled"
    });

    expect(response.status).toBe(400);
    expect(saveRsvpResponse).not.toHaveBeenCalled();
  });

  it("returns 503 when persistence fails", async () => {
    saveRsvpResponse.mockRejectedValue(new Error("offline"));

    const response = await post({
      guestName: "Lan",
      attendanceStatus: "attending",
      attendeeCount: 1,
      message: "",
      website: ""
    });

    expect(response.status).toBe(503);
    expect(await response.json()).toEqual({
      ok: false,
      message: "Hiện chưa thể gửi phản hồi. Vui lòng thử lại sau."
    });
  });
});

describe("Supabase server configuration", () => {
  it("uses the server-only service role key for persistence clients", async () => {
    vi.resetModules();
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", "https://project-ref.supabase.co");
    vi.stubEnv("SUPABASE_SERVICE_ROLE_KEY", "server-only-service-role-key");
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY", "browser-publishable-key");

    const createClient = vi.fn(() => ({
      from: vi.fn()
    }));

    vi.doMock("@supabase/supabase-js", () => ({ createClient }));

    const { createSupabaseServerClient } = await import("@/lib/supabase-server");
    createSupabaseServerClient();

    expect(createClient).toHaveBeenCalledWith(
      "https://project-ref.supabase.co",
      "server-only-service-role-key",
      expect.objectContaining({
        auth: expect.objectContaining({
          persistSession: false,
          autoRefreshToken: false
        })
      })
    );
  });
});
