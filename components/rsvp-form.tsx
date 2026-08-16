"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle2, Send } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { PrimaryButton, TextArea, TextInput } from "./ui";
import { rsvpRequestSchema, type RsvpRequest, type RsvpResponse } from "@/lib/rsvp-schema";
import { weddingContent } from "@/lib/wedding-content";

export function RsvpForm() {
  const [result, setResult] = useState<RsvpResponse | null>(null);
  const {
    register,
    handleSubmit,
    reset,
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

  async function onSubmit(values: RsvpRequest) {
    setResult(null);
    const response = await fetch("/api/rsvp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values)
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
  }

  return (
    <section id="rsvp" className="py-20" aria-labelledby="rsvp-title">
      <div className="section-shell grid gap-8 md:grid-cols-[0.8fr_1.2fr] md:items-start">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-gold">Xác nhận tham dự</p>
          <h2 id="rsvp-title" className="mt-4 font-display text-4xl text-ink sm:text-5xl">
            Bạn sẽ đến chung vui chứ?
          </h2>
          <p className="mt-4 leading-7 text-ink/70">
            Vui lòng phản hồi trong vòng một phút để chúng mình chuẩn bị chỗ ngồi thật chu đáo.
          </p>
        </div>

        <form
          className="grid gap-5 rounded-md border border-rosewood/10 bg-white/78 p-5 shadow-soft sm:p-7"
          onSubmit={handleSubmit(onSubmit)}
        >
          <input tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" {...register("website")} />

          <TextInput
            label="Họ và tên"
            placeholder="Nguyễn Văn A"
            autoComplete="name"
            error={errors.guestName?.message}
            {...register("guestName")}
          />

          <fieldset className="grid gap-3">
            <legend className="text-sm font-medium text-ink">Bạn có tham dự không?</legend>
            <div className="grid gap-3 sm:grid-cols-2">
              <label className="flex min-h-12 cursor-pointer items-center gap-3 rounded-md border border-rosewood/20 bg-white/80 px-4">
                <input type="radio" value="attending" {...register("attendanceStatus")} />
                <span>Có, mình sẽ tham dự</span>
              </label>
              <label className="flex min-h-12 cursor-pointer items-center gap-3 rounded-md border border-rosewood/20 bg-white/80 px-4">
                <input type="radio" value="not_attending" {...register("attendanceStatus")} />
                <span>Rất tiếc, mình không tham dự</span>
              </label>
            </div>
            {errors.attendanceStatus?.message ? (
              <p className="text-sm text-rosewood">{errors.attendanceStatus.message}</p>
            ) : null}
          </fieldset>

          <TextInput
            label={`Số lượng người tham dự (tối đa ${weddingContent.attendeeLimit})`}
            type="number"
            min={1}
            max={weddingContent.attendeeLimit}
            error={errors.attendeeCount?.message}
            {...register("attendeeCount")}
          />

          <TextArea
            label="Lời nhắn yêu thương"
            placeholder="Chúc hai bạn trăm năm hạnh phúc..."
            error={errors.message?.message}
            {...register("message")}
          />

          {result ? (
            <div
              role="status"
              className={`rounded-md px-4 py-3 text-sm ${
                result.ok ? "bg-sage/15 text-[#365237]" : "bg-rosewood/10 text-rosewood"
              }`}
            >
              {result.ok ? <CheckCircle2 aria-hidden="true" className="mr-2 inline size-4" /> : null}
              {result.message}
            </div>
          ) : null}

          <PrimaryButton type="submit" disabled={isSubmitting}>
            <Send aria-hidden="true" className="size-4" />
            {isSubmitting ? "Đang gửi..." : "Gửi phản hồi"}
          </PrimaryButton>
        </form>
      </div>
    </section>
  );
}
