import { beforeEach, describe, expect, it, vi } from "vitest";

const { metadata, batchUpdate, getValues, append, updateValues } = vi.hoisted(() => ({
  metadata: vi.fn(), batchUpdate: vi.fn(), getValues: vi.fn(), append: vi.fn(), updateValues: vi.fn(),
}));
vi.mock("@/lib/google-sheets-service", () => ({
  getGoogleSheetsClient: () => ({
    spreadsheetId: "test-spreadsheet",
    sheets: { spreadsheets: { get: metadata, batchUpdate, values: { get: getValues, append, batchUpdate: updateValues } } },
  }),
  getSheetRange: (name: string, cells = "A:E") => `'${name.replaceAll("'", "''")}'!${cells}`,
}));

import { createGuestLink, createGuestLinks, getGuestLinks } from "@/lib/guest-links-service";

let rows: string[][];
let sheetExists: boolean;
beforeEach(() => {
  vi.clearAllMocks();
  rows = [];
  sheetExists = true;
  metadata.mockImplementation(async () => ({ data: { sheets: sheetExists ? [{ properties: { title: "GuestLinks", sheetId: 42 } }] : [] } }));
  batchUpdate.mockImplementation(async () => {
    if (sheetExists) throw new Error("Worksheet already exists");
    sheetExists = true;
    return { data: {} };
  });
  getValues.mockImplementation(async () => ({ data: { values: rows.map((row) => [...row]) } }));
  append.mockImplementation(async ({ requestBody, valueInputOption }) => {
    if (!sheetExists || valueInputOption !== "RAW") throw new Error("Unsafe append");
    rows.push(...requestBody.values.map((row: string[]) => [...row]));
    return { data: { updates: { updatedRange: `'GuestLinks'!A${rows.length + 1}:D${rows.length + 1}` } } };
  });
  updateValues.mockImplementation(async ({ requestBody }) => {
    for (const item of requestBody.data) {
      const row = Number(item.range.match(/!B(\d+)/)[1]) - 2;
      rows[row][1] = item.values[0][0];
    }
    return { data: {} };
  });
});

describe("persistent guest links", () => {
  it("saves a whole list together, reuses existing names and resolves accent collisions", async () => {
    await createGuestLink("bạn Khánh");
    append.mockClear();
    const links = await createGuestLinks(["bạn Khánh", "cô Hằng", "cô Hăng", "cô Hằng"]);
    expect(links.map((link) => link.displayName)).toEqual(["bạn Khánh", "cô Hằng", "cô Hăng"]);
    expect(new Set(links.map((link) => link.slug)).size).toBe(3);
    expect(rows).toHaveLength(3);
    expect(append).toHaveBeenCalledTimes(1);
    const saved = await getGuestLinks();
    for (const link of links) expect(saved.find((row) => row.slug === link.slug)?.displayName).toBe(link.displayName);
  });

  it("validates every guest before saving any rows", async () => {
    await expect(createGuestLinks(["bạn Khánh", "<invalid>"])).rejects.toThrow();
    expect(rows).toHaveLength(0);
  });

  it("creates the worksheet when needed and reloads the exact guest name", async () => {
    sheetExists = false;
    const link = await createGuestLink("bạn Hoàng Anh");
    expect(link).toEqual({ slug: "ban-hoang-anh", displayName: "bạn Hoàng Anh" });
    expect((await getGuestLinks()).find((row) => row.slug === link.slug)?.displayName).toBe("bạn Hoàng Anh");
  });

  it("reuses the existing link when a name is submitted again", async () => {
    const first = await createGuestLink("bạn Khánh");
    expect(await createGuestLink("bạn Khánh")).toEqual(first);
    expect(rows).toHaveLength(1);
  });

  it("keeps distinct names safe when their slug is claimed concurrently", async () => {
    const links = await Promise.all([createGuestLink("cô Hằng"), createGuestLink("cô Hăng")]);
    expect(new Set(links.map((link) => link.slug)).size).toBe(2);
    expect(links.some((link) => link.slug === "co-hang")).toBe(true);
    const saved = await getGuestLinks();
    for (const link of links) expect(saved.find((row) => row.slug === link.slug)?.displayName).toBe(link.displayName);
  });

  it("returns the same canonical link for simultaneous requests with the same name", async () => {
    const links = await Promise.all([createGuestLink("bạn Khánh"), createGuestLink("bạn Khánh")]);
    expect(links[0]).toEqual(links[1]);
    expect((await getGuestLinks()).find((row) => row.slug === links[0].slug)?.displayName).toBe("bạn Khánh");
  });

  it("repairs a collision left by an interrupted request before returning its link", async () => {
    rows = [
      ["11111111-1111-4111-8111-111111111111", "co-hang", "cô Hằng", "2026-11-20"],
      ["22222222-2222-4222-8222-222222222222", "co-hang", "cô Hăng", "2026-11-20"],
    ];
    const link = await createGuestLink("cô Hăng");
    expect(link.slug).not.toBe("co-hang");
    expect((await getGuestLinks()).find((row) => row.slug === link.slug)?.displayName).toBe("cô Hăng");
    expect(rows).toHaveLength(2);
  });

  it("does not turn a backend failure into a usable-looking invitation", async () => {
    append.mockRejectedValueOnce(new Error("Offline"));
    await expect(createGuestLink("chú Sơn")).rejects.toThrow();
    expect(await getGuestLinks()).toEqual([]);
  });
});
