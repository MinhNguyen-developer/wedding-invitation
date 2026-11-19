"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle, CheckCircle2 } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { PrimaryButton, SectionEyebrow, TextArea, TextInput } from "./ui";
import { rsvpRequestSchema, type RsvpRequest, type RsvpResponse } from "@/lib/rsvp-schema";
import { weddingContent } from "@/lib/wedding-content";

export function RsvpForm() {
  const [result, setResult] = useState<RsvpResponse | null>(null);
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isSubmitting }
  } = useForm<RsvpRequest>({
    resolver: zodResolver(rsvpRequestSchema),
    defaultValues: {
      guestName: "",
      attendanceStatus: "attending",
      attendeeCount: 1,
      message: "",
      website: ""
    }
  });
  const attendanceStatus = watch("attendanceStatus");
  const attendanceField = register("attendanceStatus");

  async function onSubmit(values: RsvpRequest) {
    setResult(null);

    try {
      const response = await fetch("/api/rsvp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...values,
          attendeeCount: values.attendanceStatus === "attending" ? values.attendeeCount : 0
        })
      });
      const body = (await response.json()) as RsvpResponse;
      setResult(body);

      if (body.ok) {
        reset({
          guestName: "",
          attendanceStatus: "attending",
          attendeeCount: 1,
          message: "",
          website: ""
        });
      }
    } catch {
      setResult({
        ok: false,
        message: "Chưa gửi được phản hồi. Bạn hãy kiểm tra kết nối rồi thử lại nhé."
      });
    }
  }

  return (
    <section id="rsvp" className="rsvp-section" aria-labelledby="rsvp-title">
      <div className="section-shell rsvp-layout">
        <div className="rsvp-intro">
          <SectionEyebrow>Lời hồi đáp của bạn</SectionEyebrow>
          <h2 id="rsvp-title" className="section-title">Hẹn bạn<br /><em>trong ngày vui.</em></h2>
          <p className="section-copy">Cho chúng mình biết bạn có thể đến chung vui không nhé. Phản hồi của bạn giúp gia đình chuẩn bị chu đáo hơn.</p>
          <p className="rsvp-date">{weddingContent.weddingDate}<span>{weddingContent.weddingTime} · {weddingContent.venueName}</span></p>
        </div>

        <form
          className="rsvp-form"
          aria-label="Xác nhận tham dự tiệc cưới"
          onSubmit={handleSubmit(onSubmit)}
          aria-busy={isSubmitting}
        >
          <input tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" {...register("website")} />

          <TextInput
            label="Họ và tên"
            placeholder="Nguyễn Văn A"
            autoComplete="name"
            error={errors.guestName?.message}
            {...register("guestName")}
          />

          <fieldset className="grid gap-3" aria-describedby={errors.attendanceStatus ? "attendance-status-error" : undefined}>
            <legend className="text-sm font-semibold text-ink">Bạn có tham dự không?</legend>
            <div className="attendance-options">
              <label className="attendance-option">
                <input
                  type="radio"
                  value="attending"
                  className="size-4 shrink-0 accent-rosewood"
                  {...attendanceField}
                  onChange={(event) => {
                    void attendanceField.onChange(event);
                    setValue("attendeeCount", 1, { shouldValidate: true });
                  }}
                />
                <span className="text-sm font-medium leading-5 text-ink">Có, mình sẽ tham dự</span>
              </label>
              <label className="attendance-option">
                <input
                  type="radio"
                  value="not_attending"
                  className="size-4 shrink-0 accent-rosewood"
                  {...attendanceField}
                  onChange={(event) => {
                    void attendanceField.onChange(event);
                    setValue("attendeeCount", 0, { shouldValidate: true });
                  }}
                />
                <span className="text-sm font-medium leading-5 text-ink">Rất tiếc, mình không tham dự</span>
              </label>
            </div>
            {errors.attendanceStatus?.message ? (
              <p id="attendance-status-error" role="alert" className="field-error">
                {errors.attendanceStatus.message}
              </p>
            ) : null}
          </fieldset>

          {attendanceStatus === "attending" ? (
            <TextInput
              label={`Số lượng người tham dự (tối đa ${weddingContent.attendeeLimit})`}
              helperText="Tính cả bạn trong số lượng này."
              type="number"
              inputMode="numeric"
              min={1}
              max={weddingContent.attendeeLimit}
              error={errors.attendeeCount?.message}
              {...register("attendeeCount")}
            />
          ) : null}

          <TextArea
            label="Lời nhắn yêu thương"
            placeholder="Gửi đôi lời chúc đến Minh và Hà..."
            helperText="Không bắt buộc"
            error={errors.message?.message}
            {...register("message")}
          />

          {result ? (
            <div
              role={result.ok ? "status" : "alert"}
              aria-live={result.ok ? "polite" : undefined}
              className={`form-feedback ${result.ok ? "form-feedback-success" : "form-feedback-error"}`}
            >
              {result.ok ? (
                <CheckCircle2 aria-hidden="true" className="mt-0.5 size-4 shrink-0" />
              ) : (
                <AlertCircle aria-hidden="true" className="mt-0.5 size-4 shrink-0" />
              )}
              <span>{result.message}</span>
            </div>
          ) : null}

          <PrimaryButton type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Đang gửi phản hồi..." : "Gửi phản hồi"}
          </PrimaryButton>
        </form>
      </div>
    </section>
  );
}
