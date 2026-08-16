import { expect, test } from "@playwright/test";

test("guest sees validation and success states for RSVP", async ({ page }) => {
  await page.route("**/api/rsvp", async (route) => {
    await route.fulfill({
      status: 201,
      contentType: "application/json",
      body: JSON.stringify({ ok: true, message: "Cảm ơn bạn đã phản hồi lời mời." })
    });
  });

  await page.goto("/");
  await page.getByRole("link", { name: /RSVP/ }).click();
  await page.getByRole("button", { name: /Gửi phản hồi/ }).click();
  await expect(page.getByText("Vui lòng nhập họ và tên.")).toBeVisible();

  await page.getByLabel("Họ và tên").fill("Nguyễn Văn A");
  await page.getByLabel(/Số lượng người tham dự/).fill("2");
  await page.getByPlaceholder("Chúc hai bạn trăm năm hạnh phúc...").fill("Chúc hai bạn hạnh phúc mãi mãi");
  await page.getByRole("button", { name: /Gửi phản hồi/ }).click();

  await expect(page.getByText("Cảm ơn bạn đã phản hồi lời mời.")).toBeVisible();
});

test("guest sees retry message when RSVP submission fails", async ({ page }) => {
  await page.route("**/api/rsvp", async (route) => {
    await route.fulfill({
      status: 503,
      contentType: "application/json",
      body: JSON.stringify({ ok: false, message: "Hiện chưa thể gửi phản hồi. Vui lòng thử lại sau." })
    });
  });

  await page.goto("/");
  await page.getByLabel("Họ và tên").fill("Lan");
  await page.getByLabel(/Số lượng người tham dự/).fill("1");
  await page.getByRole("button", { name: /Gửi phản hồi/ }).click();

  await expect(page.getByText("Hiện chưa thể gửi phản hồi. Vui lòng thử lại sau.")).toBeVisible();
});
