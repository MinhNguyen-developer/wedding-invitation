import { google } from "googleapis";
import type { RsvpRequest } from "./rsvp-schema";

type GoogleSheetsRsvp = Pick<
  RsvpRequest,
  "guestName" | "attendanceStatus" | "attendeeCount" | "message"
>;

const SHEETS_SCOPE = "https://www.googleapis.com/auth/spreadsheets";

function requiredEnv(name: string): string {
  const value = process.env[name]?.trim();
  if (!value) {
    throw new Error(`Missing Google Sheets configuration: ${name}.`);
  }
  return value;
}

function normalizePrivateKey(value: string): string {
  let privateKey = value.trim();

  if (
    (privateKey.startsWith('"') && privateKey.endsWith('"')) ||
    (privateKey.startsWith("'") && privateKey.endsWith("'"))
  ) {
    privateKey = privateKey.slice(1, -1);
  }

  privateKey = privateKey
    .replace(/\\+r\\+n|\\+n/g, "\n")
    .replace(/\r\n/g, "\n")
    .trim();

  if (
    !privateKey.startsWith("-----BEGIN PRIVATE KEY-----") ||
    !privateKey.includes("-----END PRIVATE KEY-----")
  ) {
    throw new Error(
      "GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY must contain the PEM private_key from the service account JSON.",
    );
  }

  return privateKey;
}

function getSheetRange(sheetName: string): string {
  const escapedSheetName = sheetName.replaceAll("'", "''");
  return `'${escapedSheetName}'!A:E`;
}

function formatSubmittedAt(date: Date): string {
  const parts = Object.fromEntries(
    new Intl.DateTimeFormat("en-GB", {
      timeZone: "Asia/Ho_Chi_Minh",
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hourCycle: "h23",
    })
      .formatToParts(date)
      .map(({ type, value }) => [type, value]),
  );

  return `${parts.hour}:${parts.minute} ${parts.day}-${parts.month}-${parts.year}`;
}

export async function appendRsvpResponse(input: GoogleSheetsRsvp) {
  const spreadsheetId = requiredEnv("GOOGLE_SHEETS_SPREADSHEET_ID");
  const sheetName = requiredEnv("GOOGLE_SHEETS_SHEET_NAME");
  const clientEmail = requiredEnv("GOOGLE_SERVICE_ACCOUNT_EMAIL");
  const privateKey = normalizePrivateKey(
    requiredEnv("GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY"),
  );

  const auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: clientEmail,
      private_key: privateKey,
    },
    scopes: [SHEETS_SCOPE],
  });
  const sheets = google.sheets({ version: "v4", auth });

  await sheets.spreadsheets.values.append({
    spreadsheetId,
    range: getSheetRange(sheetName),
    valueInputOption: "RAW",
    insertDataOption: "INSERT_ROWS",
    requestBody: {
      values: [
        [
          formatSubmittedAt(new Date()),
          input.guestName,
          input.attendanceStatus === "attending"
            ? "Có, mình sẽ tham dự"
            : "Rất tiếc, mình không tham dự",
          input.attendeeCount,
          input.message?.trim() ?? "",
        ],
      ],
    },
  });
}
