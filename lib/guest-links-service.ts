import { randomInt, randomUUID } from "node:crypto";
import { createGuestSlug, guestNameSchema, guestNamesSchema, guestSlugSchema } from "./guest-link";
import { getGoogleSheetsClient, getSheetRange } from "./google-sheets-service";

type SheetsClient = ReturnType<typeof getGoogleSheetsClient>;
export type GuestLinkRecord = { id: string; slug: string; displayName: string; row: number };
const sheetName = () => process.env.GOOGLE_SHEETS_GUESTS_SHEET_NAME?.trim() || "GuestLinks";
const requestOptions = { timeout: 8000 };

async function findSheet(client: SheetsClient) {
  const { data } = await client.sheets.spreadsheets.get({
    spreadsheetId: client.spreadsheetId, fields: "sheets.properties",
  }, requestOptions);
  return data.sheets?.find((sheet) => sheet.properties?.title === sheetName())?.properties;
}

async function ensureSheet(client: SheetsClient) {
  if (await findSheet(client)) return;
  const sheetId = randomInt(1, 2 ** 31 - 1);
  try {
    // The sheet and its header are created together, so no data can land in row 1.
    await client.sheets.spreadsheets.batchUpdate({
      spreadsheetId: client.spreadsheetId,
      requestBody: { requests: [
        { addSheet: { properties: { sheetId, title: sheetName(), gridProperties: { columnCount: 4, rowCount: 1000, frozenRowCount: 1 } } } },
        { appendCells: { sheetId, rows: [{ values: ["ID", "Slug", "Người nhận", "Thời gian tạo"].map((stringValue) => ({ userEnteredValue: { stringValue } })) }], fields: "userEnteredValue" } },
      ] },
    }, requestOptions);
  } catch (error) {
    // Another request may have initialized the same worksheet while we waited.
    if (!(await findSheet(client))) throw error;
  }
}

async function readRecords(client: SheetsClient): Promise<GuestLinkRecord[]> {
  const { data } = await client.sheets.spreadsheets.values.get({
    spreadsheetId: client.spreadsheetId, range: getSheetRange(sheetName(), "A2:D"),
  }, requestOptions);
  return (data.values ?? []).flatMap((values: unknown[], index) => {
    const id = values[0];
    const slug = guestSlugSchema.safeParse(values[1]);
    const name = guestNameSchema.safeParse(values[2]);
    if (typeof id !== "string" || !/^[a-f0-9-]{36}$/.test(id) || !slug.success || !name.success) return [];
    return [{ id, slug: slug.data, displayName: name.data, row: index + 2 }];
  });
}

export async function getGuestLinks(): Promise<GuestLinkRecord[]> {
  const client = getGoogleSheetsClient();
  return await findSheet(client) ? readRecords(client) : [];
}

function resolveSlug(record: GuestLinkRecord, records: GuestLinkRecord[]) {
  // Confirm ownership after the append, including retries of interrupted writes.
  const owner = records.find((item) => item.slug === record.slug);
  if (owner?.row !== record.row) {
    const slug = `${createGuestSlug(record.displayName)}-${record.id}`;
    if (records.some((item) => item.slug === slug && item.row !== record.row)) throw new Error("Guest ID collision.");
    return slug;
  }
  return record.slug;
}

export async function createGuestLinks(inputs: readonly string[]): Promise<{ slug: string; displayName: string }[]> {
  const names = guestNamesSchema.parse(inputs);
  const client = getGoogleSheetsClient();
  await ensureSheet(client);
  let records = await readRecords(client);
  const additions = names.filter((name) => !records.some((item) => item.displayName === name))
    .map((displayName) => ({ id: randomUUID(), slug: createGuestSlug(displayName), displayName }));
  if (additions.length) {
    await client.sheets.spreadsheets.values.append({
      spreadsheetId: client.spreadsheetId, range: getSheetRange(sheetName(), "A:D"),
      valueInputOption: "RAW", insertDataOption: "INSERT_ROWS",
      requestBody: { values: additions.map((guest) => [guest.id, guest.slug, guest.displayName, new Date().toISOString()]) },
    }, requestOptions);
    records = await readRecords(client);
    if (additions.some((guest) => !records.some((item) => item.id === guest.id))) throw new Error("Guest records were not persisted.");
  }

  const canonical = names.map((name) => records.find((item) => item.displayName === name)!);
  const ownIds = new Set<string>(additions.map((guest) => guest.id));
  const claims = new Map<number, string>();
  // Resolve both canonical names and our extra race candidates without deleting
  // or shifting rows. All collision repairs are sent in one Sheets operation.
  for (const record of [...records.filter((item) => ownIds.has(item.id)), ...canonical]) {
    const slug = resolveSlug(record, records);
    if (slug !== record.slug) claims.set(record.row, slug);
  }
  if (claims.size) {
    await client.sheets.spreadsheets.values.batchUpdate({
      spreadsheetId: client.spreadsheetId,
      requestBody: { valueInputOption: "RAW", data: [...claims].map(([row, slug]) => ({ range: getSheetRange(sheetName(), `B${row}`), values: [[slug]] })) },
    }, requestOptions);
  }
  return canonical.map((record) => ({ slug: claims.get(record.row) ?? record.slug, displayName: record.displayName }));
}

export async function createGuestLink(input: string): Promise<{ slug: string; displayName: string }> {
  return (await createGuestLinks([input]))[0];
}
