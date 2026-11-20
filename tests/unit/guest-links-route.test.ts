import { beforeEach, describe, expect, it, vi } from "vitest";

const { createGuestLink, createGuestLinks } = vi.hoisted(() => ({ createGuestLink: vi.fn(), createGuestLinks: vi.fn() }));
vi.mock("@/lib/guest-links-service", () => ({ createGuestLink, createGuestLinks }));
vi.mock("next/cache", () => ({ revalidateTag: vi.fn() }));

async function post(body: unknown) {
  const { POST } = await import("@/app/api/guest-links/route");
  return POST(new Request("http://localhost/api/guest-links", {
    method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body),
  }));
}
beforeEach(() => { createGuestLink.mockReset(); createGuestLinks.mockReset(); });

describe("POST /api/guest-links without a password", () => {
  it("still accepts single-guest requests without authorization", async () => {
    createGuestLink.mockResolvedValue({ slug: "ban-hoang-anh", displayName: "bạn Hoàng Anh" });
    const response = await post({ displayName: "bạn Hoàng Anh" });
    expect(response.status).toBe(201);
    expect(await response.json()).toEqual({ ok: true, path: "/for/ban-hoang-anh", displayName: "bạn Hoàng Anh" });
  });

  it("returns a separate link for every guest in one request", async () => {
    createGuestLinks.mockResolvedValue([{ slug: "ban-hoang-anh", displayName: "bạn Hoàng Anh" }, { slug: "co-hang", displayName: "cô Hằng" }]);
    const response = await post({ displayNames: ["bạn Hoàng Anh", "cô Hằng"] });
    expect(response.status).toBe(201);
    expect(await response.json()).toEqual({ ok: true, guests: [{ path: "/for/ban-hoang-anh", displayName: "bạn Hoàng Anh" }, { path: "/for/co-hang", displayName: "cô Hằng" }] });
  });

  it("rejects the whole list if one guest is invalid", async () => {
    const response = await post({ displayNames: ["bạn Khánh", "<script>alert(1)</script>"] });
    expect(response.status).toBe(400);
    expect((await response.json()).message).toContain("Khách thứ 2");
    expect(createGuestLinks).not.toHaveBeenCalled();
  });

  it("rejects oversized request bodies before writing", async () => {
    expect((await post({ displayNames: ["A".repeat(70000)] })).status).toBe(413);
    expect(createGuestLinks).not.toHaveBeenCalled();
  });

  it("rejects more than 100 guests", async () => {
    expect((await post({ displayNames: Array.from({ length: 101 }, (_, index) => `bạn ${index}`) })).status).toBe(400);
    expect(createGuestLinks).not.toHaveBeenCalled();
  });

  it("keeps private backend errors out of the response", async () => {
    createGuestLinks.mockRejectedValue(new Error("secret backend details"));
    const response = await post({ displayNames: ["ông A"] });
    expect(response.status).toBe(503);
    expect(await response.text()).not.toContain("secret backend details");
  });
});
