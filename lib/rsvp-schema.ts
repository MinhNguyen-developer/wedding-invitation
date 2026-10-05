import { z } from "zod";
import { weddingContent } from "./wedding-content";

export const attendanceStatuses = ["attending", "not_attending"] as const;

const attendeeCount = z.coerce
  .number({
    required_error: "Vui lòng nhập số lượng người tham dự.",
    invalid_type_error: "Số lượng người tham dự không hợp lệ."
  })
  .int("Số lượng người tham dự phải là số nguyên.")
  .min(0, "Số lượng người tham dự không hợp lệ.")
  .max(
    weddingContent.attendeeLimit,
    `Số lượng người tham dự không được vượt quá ${weddingContent.attendeeLimit}.`
  );

export const rsvpRequestSchema = z
  .object({
    guestName: z.string().trim().min(1, "Vui lòng nhập họ và tên.").max(120, "Họ và tên quá dài."),
    attendanceStatus: z.enum(attendanceStatuses, {
      required_error: "Vui lòng chọn trạng thái tham dự.",
      invalid_type_error: "Trạng thái tham dự không hợp lệ."
    }),
    attendeeCount,
    message: z.string().trim().max(500, "Lời nhắn tối đa 500 ký tự.").optional().or(z.literal("")),
    website: z.string().optional()
  })
  .superRefine((value, context) => {
    if (value.attendanceStatus === "attending" && value.attendeeCount < 1) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["attendeeCount"],
        message: "Số lượng người tham dự phải ít nhất là 1."
      });
    }

    if (value.attendanceStatus === "not_attending" && value.attendeeCount !== 0) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["attendeeCount"],
        message: "Số lượng người tham dự phải bằng 0 khi bạn không thể tham dự."
      });
    }

    if (value.website && value.website.trim().length > 0) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["website"],
        message: "Không thể gửi phản hồi lúc này."
      });
    }
  });

export type RsvpRequest = z.infer<typeof rsvpRequestSchema>;

export type RsvpResponse =
  | {
      ok: true;
      message: string;
    }
  | {
      ok: false;
      message: string;
      errors?: Record<string, string>;
    };

export function formatZodErrors(error: z.ZodError): Record<string, string> {
  return error.issues.reduce<Record<string, string>>((errors, issue) => {
    const key = issue.path[0]?.toString() ?? "form";
    if (!errors[key]) {
      errors[key] = issue.message;
    }
    return errors;
  }, {});
}

export function hasHoneypotValue(input: unknown): boolean {
  if (!input || typeof input !== "object" || !("website" in input)) {
    return false;
  }

  const value = (input as { website?: unknown }).website;
  return typeof value === "string" && value.trim().length > 0;
}
