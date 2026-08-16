import { expect, test } from "@playwright/test";

test("public website exposes no RSVP response list", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByRole("heading", { name: /Danh sách RSVP|Danh sách khách mời|Phản hồi đã lưu/ })).toHaveCount(0);
  await expect(page.getByText(/guest_name|attendance_status|attendee_count|created_at/)).toHaveCount(0);
});
