import { expect, test } from "@playwright/test";

test("guest-link form keeps names after a failed save", async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.route("**/api/guest-links", (route) => route.fulfill({ status: 503, json: { ok: false, message: "Chưa lưu được khách mời. Bạn hãy thử lại nhé." } }));
  await page.goto("/tao-link");
  await expect(page.getByRole("button", { name: "Tạo link cho danh sách" })).toBeInViewport();
  await page.getByLabel("Danh sách khách mời").fill("bạn Khánh");
  await page.getByRole("button", { name: "Tạo link cho danh sách" }).click();
  await expect(page.getByRole("form", { name: "Tạo link cho khách mời" }).getByRole("alert")).toContainText("Chưa lưu được");
  await expect(page.getByLabel("Danh sách khách mời")).toHaveValue("bạn Khánh");
});

test.describe("persistent guest invitations", () => {
  test.skip(process.env.GUEST_LINKS_E2E !== "1", "Runs only against an isolated temporary guest worksheet.");

  test("pasted lines create all guest links without a password and copy together", async ({ page }, testInfo) => {
    const names = [`chú Sơn ${testInfo.project.name}`, `bác Thắng ${testInfo.project.name}`, `bà Bình ${testInfo.project.name}`];
    await page.goto("/tao-link");
    await expect(page.getByLabel("Mật khẩu quản lý")).toHaveCount(0);
    await page.getByLabel("Danh sách khách mời").fill(`\n${names[0]}\r\n${names[1]}\n\n${names[0]}\n${names[2]}`);
    await page.getByRole("button", { name: "Tạo link cho danh sách" }).click();
    const results = page.getByRole("list");
    await expect(results.getByRole("listitem")).toHaveCount(3, { timeout: 20000 });
    const urls: string[] = [];
    for (const name of names) urls.push(await page.getByLabel(`Link của ${name}`, { exact: true }).inputValue());
    await page.context().grantPermissions(["clipboard-read", "clipboard-write"]);
    await page.getByRole("button", { name: "Sao chép tất cả" }).click();
    await expect.poll(() => page.evaluate(() => navigator.clipboard.readText())).toBe(names.map((name, index) => `${name}\n${urls[index]}`).join("\n\n"));
    await page.screenshot({ path: testInfo.outputPath("bulk-created.png"), fullPage: true });
    for (let index = 0; index < names.length; index++) {
      await page.goto(urls[index]);
      await expect(page.getByText(`Thân mời ${names[index]}`, { exact: true })).toBeVisible();
    }
  });

  test("owner creates a guest, reloads the invitation and returns from the album", async ({ page }, testInfo) => {
    const name = `bạn Hoàng Anh ${testInfo.project.name}`;
    const slug = `ban-hoang-anh-${testInfo.project.name}`;
    expect((await page.goto(`/for/${slug}`))!.status()).toBe(404);
    await page.goto("/tao-link");
    await page.getByLabel("Danh sách khách mời").fill(name);
    await page.getByRole("button", { name: "Tạo link cho danh sách" }).click();
    const field = page.getByRole("textbox", { name: `Link của ${name}`, exact: true });
    await expect(field).toBeVisible({ timeout: 20000 });
    const url = await field.inputValue();
    expect(new URL(url).pathname).toBe(`/for/${slug}`);
    await page.context().grantPermissions(["clipboard-read", "clipboard-write"]);
    await page.getByRole("button", { name: `Sao chép link của ${name}` }).click();
    await expect.poll(() => page.evaluate(() => navigator.clipboard.readText())).toBe(url);
    await page.screenshot({ path: testInfo.outputPath("created-link.png"), fullPage: true });
    await page.goto(url);
    await expect(page.getByText(`Thân mời ${name}`, { exact: true })).toBeVisible();
    await expect(page.getByLabel("Họ và tên", { exact: true })).toHaveValue(name);
    await page.screenshot({ path: testInfo.outputPath("personal-invitation.png") });
    await page.reload();
    await expect(page.getByText(`Thân mời ${name}`, { exact: true })).toBeVisible();
    await expect(page.getByLabel("Họ và tên", { exact: true })).toHaveValue(name);
    await page.getByRole("navigation").getByRole("link", { name: "Album", exact: true }).click();
    await expect(page).toHaveURL((url) => url.pathname === "/album" && url.searchParams.get("for") === slug);
    await page.getByRole("navigation").getByRole("link", { name: "Lời mời", exact: true }).click();
    await expect(page).toHaveURL((url) => url.pathname === `/for/${slug}` && url.hash === "#loi-moi");
    await expect(page.getByText(`Thân mời ${name}`, { exact: true })).toBeVisible();
    await page.getByRole("navigation").getByRole("link", { name: "RSVP", exact: true }).click();
    await expect(page.getByLabel("Họ và tên", { exact: true })).toHaveValue(name);
    await page.route("**/api/rsvp", (route) => route.fulfill({ status: 201, json: { ok: true, message: "Đã nhận phản hồi của bạn." } }));
    const submission = page.waitForRequest((request) => request.method() === "POST" && new URL(request.url()).pathname === "/api/rsvp");
    await page.getByRole("button", { name: "Gửi phản hồi", exact: true }).click();
    expect((await submission).postDataJSON().guestName).toBe(name);
    await expect(page.getByText("Đã nhận phản hồi của bạn.", { exact: true })).toBeVisible();
    await expect(page.getByLabel("Họ và tên", { exact: true })).toHaveValue(name);
  });

  test("concurrent similar names never open each other's invitations", async ({ request, page }, testInfo) => {
    const names = [`cô Hằng ${testInfo.project.name}`, `cô Hăng ${testInfo.project.name}`];
    const responses = await Promise.all(names.map((displayName) => request.post("/api/guest-links", {
      data: { displayName },
    })));
    const bodies = await Promise.all(responses.map(async (response) => { expect(response.status()).toBe(201); return response.json(); }));
    expect(new Set(bodies.map((body) => body.path)).size).toBe(2);
    for (let index = 0; index < names.length; index++) {
      await page.goto(bodies[index].path);
      await expect(page.getByText(`Thân mời ${names[index]}`, { exact: true })).toBeVisible();
    }
  });

  test("long personal greetings fit a small phone and the guest list stays private", async ({ request, page }, testInfo) => {
    expect((await request.get("/api/guest-links")).status()).toBe(405);
    const displayName = "gia đình cô Nguyễn Hoàng Anh cùng chú Trần Quốc Khánh và các cháu thân yêu";
    const response = await request.post("/api/guest-links", { data: { displayName } });
    expect(response.status()).toBe(201);
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto((await response.json()).path);
    const greeting = page.getByText(`Thân mời ${displayName}`, { exact: true });
    await expect(greeting).toBeInViewport();
    const box = await greeting.boundingBox();
    const nav = await page.getByRole("navigation").boundingBox();
    expect(box!.y).toBeGreaterThanOrEqual(nav!.height);
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(375);
    await page.screenshot({ path: testInfo.outputPath("long-name-phone.png") });
  });
});
