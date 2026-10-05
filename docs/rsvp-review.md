# RSVP Setup and Review

The website keeps its custom RSVP form and server-side validation. The `/api/rsvp` route writes each valid response to a private Google Sheet through the Google Sheets API. No Apps Script Web App or Google Form is required for new submissions.

## Configure Google Sheets access

1. In Google Cloud Console, create or select a project and enable the **Google Sheets API**.
2. Create a service account in **IAM & Admin → Service Accounts** and create a JSON key for it.
3. Open the target spreadsheet and share it with the service account's `client_email`, granting **Editor** access. Keep general access restricted; guests do not need spreadsheet access.
4. Create a dedicated tab named `RSVP` and add this header row in columns A–E:

   | A | B | C | D | E |
   | --- | --- | --- | --- | --- |
   | Thời gian gửi (GMT+7) | Họ và tên | Trạng thái tham dự | Số khách | Lời nhắn |

5. Copy the spreadsheet ID from its URL. It is the value between `/d/` and `/edit`.
6. Set these server-only variables in `.env.local` and in the Vercel project environment:

   ```text
   GOOGLE_SHEETS_SPREADSHEET_ID=your-spreadsheet-id
   GOOGLE_SHEETS_SHEET_NAME=RSVP
   GOOGLE_SERVICE_ACCOUNT_EMAIL=service-account@your-project.iam.gserviceaccount.com
   GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY=-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n
   ```

   Use the `client_email` and `private_key` values from the downloaded service-account JSON. Store the private key without wrapping quotes in both `.env.local` and Vercel. Keep it in environment settings only; never commit it or add a `NEXT_PUBLIC_` prefix. The application normalizes escaped newlines and strips accidental surrounding quotes without logging the key.

The server appends values to the configured tab using the Sheets API [`spreadsheets.values.append`](https://developers.google.com/workspace/sheets/api/reference/rest/v4/spreadsheets.values/append) method. The stored status is a readable Vietnamese label, and the timestamp uses Vietnam time (GMT+7) in `HH:mm DD-MM-YYYY` format.

## Review and verify submissions

1. Submit a test RSVP from the website.
2. Confirm the guest sees the success message and a new row appears below the header in the `RSVP` tab.
3. Confirm the row includes the guest name, attendance choice, attendee count, optional message, and timestamp.
4. Remove the test row if desired.

If submission fails, confirm the Sheets API is enabled, the spreadsheet ID and tab name are correct, the tab has the header row, and the sheet is shared with the exact service-account email as an editor. Keep the spreadsheet private.

## Existing responses

Responses previously stored in Supabase or Google Forms remain in their original locations. This integration does not migrate, delete, or rewrite historical rows. New website submissions go to the configured Google Sheets tab; gallery images continue to use Supabase Storage.

## Privacy

Guests submit through the website and cannot browse other guests' responses. Only the couple and trusted planners should have access to the spreadsheet. The service account credentials stay on the server and are never sent to the browser.
