import { describe, expect, it } from "vitest";
import { hasHoneypotValue, rsvpRequestSchema } from "@/lib/rsvp-schema";

describe("rsvpRequestSchema", () => {
  it("accepts a valid RSVP with Vietnamese accents", () => {
    const result = rsvpRequestSchema.safeParse({
      guestName: "Nguyễn Văn A",
      attendanceStatus: "attending",
      attendeeCount: 2,
      message: "Chúc hai bạn trăm năm hạnh phúc",
      website: ""
    });

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.message).toBe("Chúc hai bạn trăm năm hạnh phúc");
    }
  });

  it("rejects missing guest name and invalid attendee counts", () => {
    const result = rsvpRequestSchema.safeParse({
      guestName: " ",
      attendanceStatus: "attending",
      attendeeCount: 0,
      message: "",
      website: ""
    });

    expect(result.success).toBe(false);
  });

  it("rejects attendee counts above the default event limit", () => {
    const result = rsvpRequestSchema.safeParse({
      guestName: "Mai",
      attendanceStatus: "attending",
      attendeeCount: 11,
      message: "",
      website: ""
    });

    expect(result.success).toBe(false);
  });

  it("detects honeypot values", () => {
    expect(hasHoneypotValue({ website: "https://spam.example" })).toBe(true);
    expect(hasHoneypotValue({ website: "" })).toBe(false);
  });
});
