# Data Model: Vietnamese Wedding Invitation RSVP Website

## Entity: Wedding Invitation

Represents the public Vietnamese invitation content shown to guests.

**Fields**:
- `couple_names`: Display names for the couple.
- `invitation_message`: Vietnamese invitation copy.
- `wedding_date`: Wedding date shown to guests.
- `wedding_time`: Wedding start time shown to guests.
- `venue_name`: Venue display name.
- `venue_address`: Venue address shown to guests.
- `venue_map_url`: Optional map or directions link.

**Validation rules**:
- Couple names, date, time, and venue must be present before production launch.
- Vietnamese text must preserve accents and punctuation.

## Entity: Pre-Wedding Photo

Represents a photo displayed in the gallery.

**Fields**:
- `public_url`: Publicly readable managed storage URL used by the guest-facing gallery.
- `storage_object_path`: Managed storage object path for the production image.
- `alt_text`: Vietnamese or descriptive text for accessibility.
- `display_order`: Number used to order gallery images.
- `caption`: Optional short caption.

**Validation rules**:
- Each photo must have display order, descriptive alt text, and a valid public image URL.
- Production gallery images should resolve from the managed storage bucket.
- Images should be optimized enough to keep mobile loading acceptable.

## Entity: RSVP Response

Represents a guest's submitted attendance response.

**Fields**:
- `id`: Unique response identifier.
- `guest_name`: Guest or household name.
- `attendance_status`: Whether the guest will attend.
- `attendee_count`: Total number of attendees represented by the response.
- `message`: Optional wedding wish or note.
- `created_at`: Submission timestamp.

**Validation rules**:
- `guest_name` is required and must not be blank after trimming.
- `attendance_status` is required.
- `attendee_count` is required when attending.
- `attendee_count` must be a whole number.
- `attendee_count` must be at least 1 when attending.
- `attendee_count` must not exceed the configured event limit, defaulting to 10 people per RSVP.
- `message` is optional and should support Vietnamese accents and punctuation.

**State transitions**:
- Draft in guest browser -> validation failed: show field errors and remain editable.
- Draft in guest browser -> submitted successfully: persist response and show confirmation.
- Draft in guest browser -> submission failed: show friendly error and allow retry.

## Entity: Guest

Represents an invited person or household using the website.

**Fields**:
- `display_name`: Name entered in the RSVP form.
- `response`: Optional associated RSVP response.

**Validation rules**:
- Guests do not authenticate.
- Guests can submit an RSVP but cannot browse the full response list.

## Entity: Couple

Represents the wedding hosts who review submitted RSVP responses.

**Fields**:
- `names`: Couple names shown in the invitation.
- `response_access`: Private access to the saved RSVP response list through the managed dashboard.

**Validation rules**:
- Couple-only response review must not be exposed through guest-facing pages.

## Relationships

- One Wedding Invitation has many Pre-Wedding Photos.
- One Guest may submit one or more RSVP Responses; duplicate handling is managed by review and optional future duplicate detection.
- The Couple reviews many RSVP Responses.

## Retention

- RSVP responses should be retained at least through the wedding planning period.
- Manual export or backup should be performed before the wedding date.
