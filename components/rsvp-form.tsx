"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle, CalendarDays, CheckCircle2, Send } from "lucide-react";
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
    <section id="rsvp" className="relative overflow-hidden bg-sand/80 py-20 md:py-24" aria-labelledby="rsvp-title">
      <div aria-hidden="true" className="pointer-events-none absolute -left-24 top-10 size-72 rounded-full bg-petal/35 blur-3xl" />
      <div className="section-shell relative grid gap-9 md:grid-cols-[0.78fr_1.22fr] md:items-start md:gap-16">
        <div className="pt-2 md:sticky md:top-28">
          <SectionEyebrow>Vui lòng phản hồi</SectionEyebrow>
          <h2 id="rsvp-title" className="mt-5 font-display text-4xl leading-tight tracking-[-0.025em] text-ink sm:text-5xl">
            Hẹn bạn trong ngày vui.
          </h2>
          <p className="mt-5 max-w-md text-base leading-7 text-ink/75">
            Cho chúng mình biết bạn có thể đến chung vui không nhé. Phản hồi của bạn giúp gia đình chuẩn bị chu đáo hơn.
          </p>
          <div className="mt-7 flex items-start gap-3 border-l-2 border-gold/50 py-1 pl-4">
            <CalendarDays aria-hidden="true" className="mt-0.5 size-5 shrink-0 text-rosewood" />
            <p className="text-sm font-medium leading-6 text-ink/80">
              {weddingContent.weddingDate}
              <span className="mx-2 text-gold" aria-hidden="true">·</span>
              {weddingContent.weddingTime}
            </p>
          </div>
        </div>

        <form
          className="grid gap-6 rounded-[2rem] border border-rosewood/10 bg-paper p-5 shadow-card sm:p-8 md:p-9"
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
            <div className="grid gap-3 sm:grid-cols-2">
              <label
                className={`flex min-h-12 cursor-pointer items-center gap-3 rounded-2xl border px-4 py-3 transition-colors ${
                  attendanceStatus === "attending"
                    ? "border-rosewood/45 bg-petal/30"
                    : "border-rosewood/15 bg-white hover:bg-petal/15"
                }`}
              >
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
              <label
                className={`flex min-h-12 cursor-pointer items-center gap-3 rounded-2xl border px-4 py-3 transition-colors ${
                  attendanceStatus === "not_attending"
                    ? "border-rosewood/45 bg-petal/30"
                    : "border-rosewood/15 bg-white hover:bg-petal/15"
                }`}
              >
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
              <p id="attendance-status-error" role="alert" className="text-sm font-medium text-rosewood">
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
              className={`flex items-start gap-2.5 rounded-2xl px-4 py-3.5 text-sm leading-6 ${
                result.ok ? "bg-sage/15 text-[#365237]" : "bg-rosewood/10 text-rosewood"
              }`}
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
            <Send aria-hidden="true" className="size-4" />
            {isSubmitting ? "Đang gửi phản hồi..." : "Gửi phản hồi"}
          </PrimaryButton>
        </form>
      </div>
    </section>
  );
}
