# Contract: RSVP Submission

## Purpose

Define the guest-facing submission interface for saving RSVP responses. Guests can submit responses, but cannot read, update, delete, or list saved responses through the public website.

## Endpoint

`POST /api/rsvp`

## Request Body

```json
{
  "guestName": "Nguyễn Văn A",
  "attendanceStatus": "attending",
  "attendeeCount": 2,
  "message": "Chúc hai bạn trăm năm hạnh phúc",
  "website": ""
}
```

## Fields

| Field | Type | Required | Rules |
|---|---|---|---|
| `guestName` | string | Yes | Trimmed value must not be blank |
| `attendanceStatus` | string | Yes | Must be `attending` or `not_attending` |
| `attendeeCount` | number | Yes when attending | Whole number from 1 through configured event limit |
| `message` | string | No | Optional wedding wish; must preserve Vietnamese text |
| `website` | string | No | Honeypot field; normal guests leave this blank |

## Successful Response

Status: `201 Created`

```json
{
  "ok": true,
  "message": "Cảm ơn bạn đã phản hồi lời mời."
}
```

## Validation Error Response

Status: `400 Bad Request`

```json
{
  "ok": false,
  "message": "Vui lòng kiểm tra lại thông tin phản hồi.",
  "errors": {
    "guestName": "Vui lòng nhập họ và tên.",
    "attendeeCount": "Số lượng người tham dự không hợp lệ."
  }
}
```

## Spam/Honeypot Response

Status: `400 Bad Request`

```json
{
  "ok": false,
  "message": "Không thể gửi phản hồi lúc này."
}
```

## Temporary Failure Response

Status: `503 Service Unavailable`

```json
{
  "ok": false,
  "message": "Hiện chưa thể gửi phản hồi. Vui lòng thử lại sau."
}
```

## Access Rules

- Public website users may submit RSVP responses only.
- Public website users must not read the saved RSVP list.
- Public website users must not update or delete saved RSVP responses.
- Privileged provider credentials must remain server-side only.
- User-facing error messages must not expose sensitive implementation details.

## Persistence Mapping

| Request Field | Saved RSVP Field |
|---|---|
| `guestName` | Guest name |
| `attendanceStatus` | Attendance choice |
| `attendeeCount` | Attendee count |
| `message` | Optional message |
| Server-generated timestamp | Submission time |
