import { describe, expect, it } from "vitest";
import { createGuestSlug, guestNameSchema, guestNamesSchema, splitGuestLines } from "@/lib/guest-link";

describe("guest link input", () => {
  it("splits pasted Windows and Unix lines, ignores blanks and deduplicates normalized names", () => {
    expect(guestNamesSchema.parse(splitGuestLines("\n bạn Hoa\u0300ng Anh\r\n cô Hằng\n\n bạn Hoàng Anh\r chú Sơn "))).toEqual(["bạn Hoàng Anh", "cô Hằng", "chú Sơn"]);
  });

  it("rejects an empty list and more than 100 guests", () => {
    expect(guestNamesSchema.safeParse([]).success).toBe(false);
    expect(guestNamesSchema.safeParse(Array.from({ length: 101 }, (_, index) => `bạn ${index}`)).success).toBe(false);
  });

  it("applies the batch limit after combining duplicate guests", () => {
    expect(guestNamesSchema.parse(Array(101).fill("cô Hằng"))).toEqual(["cô Hằng"]);
  });

  it.each([
    ["bạn Hoàng Anh", "ban-hoang-anh"],
    ["bạn Khánh", "ban-khanh"],
    ["cô Hằng", "co-hang"],
    ["chú Sơn", "chu-son"],
    ["bác Thắng", "bac-thang"],
    ["ông A", "ong-a"],
    ["bà B", "ba-b"],
    ["gia đình cô Đặng", "gia-dinh-co-dang"],
  ])("makes a readable slug for %s", (name, slug) => {
    expect(createGuestSlug(name)).toBe(slug);
  });

  it("preserves accents and case while normalizing Unicode and spacing", () => {
    expect(guestNameSchema.parse("  bạn  Hoa\u0300ng Anh  ")).toBe("bạn Hoàng Anh");
  });

  it.each(["", "  ", "A".repeat(121), "<script>alert(1)</script>", "bạn\u202eAnh"])("rejects invalid guest input", (name) => {
    expect(guestNameSchema.safeParse(name).success).toBe(false);
  });
});
