# RSVP Review

The public website does not include an admin dashboard. The couple reviews submitted RSVP responses in the private Supabase project dashboard.

## Review Steps

1. Open the Supabase project dashboard.
2. Go to Table Editor.
3. Open the `rsvps` table.
4. Review these fields for each response:
   - `guest_name`
   - `attendance_status`
   - `attendee_count`
   - `message`
   - `created_at`

## Sample Persistence Check

1. Submit a test RSVP from the website.
2. Confirm a new row appears in the `rsvps` table.
3. Confirm the row includes the submitted guest name, attendance choice, attendee count, optional message, and `created_at` timestamp.
4. Delete the test row after verification if desired.

## Export Before The Wedding

1. Open the `rsvps` table in Supabase.
2. Export the table as CSV.
3. Save a backup copy before final seating or preparation planning.

## Privacy Check

Guests should only be able to submit RSVP responses from the public website. They should not be able to browse, update, delete, or list saved RSVP responses from guest-facing pages.
