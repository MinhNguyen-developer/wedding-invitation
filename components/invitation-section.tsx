"use client";

import { motion } from "framer-motion";
import { CalendarDays, Clock, Heart } from "lucide-react";
import Image from "next/image";
import { SectionEyebrow } from "./ui";
import { weddingContent } from "@/lib/wedding-content";

export function InvitationSection() {
  const heroPhoto = weddingContent.gallery[0];

  return (
    <section
      id="loi-moi"
      className="relative flex min-h-[92svh] items-center overflow-hidden pt-20"
      aria-labelledby="invitation-title"
    >
      <div className="absolute inset-0 -z-10">
        <Image
          fill
          priority
          src={heroPhoto.publicUrl}
          alt=""
          aria-hidden="true"
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-[linear-gradient(115deg,rgba(255,250,242,0.72),rgba(255,250,242,0.88))]" />
      </div>
      <div className="section-shell grid gap-10 py-14 md:grid-cols-[1.08fr_0.92fr] md:items-end">
        <motion.div
          initial={false}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="max-w-3xl"
        >
          <SectionEyebrow>Thiệp mời đám cưới</SectionEyebrow>
          <h1
            id="invitation-title"
            className="mt-5 font-display text-6xl leading-[0.95] text-rosewood sm:text-7xl md:text-8xl"
          >
            {weddingContent.coupleNames}
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-ink/80">{weddingContent.invitationMessage}</p>
          <div className="mt-8 grid gap-3 text-base text-ink sm:grid-cols-2">
            <div className="flex items-center gap-3 rounded-md bg-white/70 px-4 py-3 shadow-soft">
              <CalendarDays aria-hidden="true" className="size-5 text-gold" />
              <span>{weddingContent.weddingDate}</span>
            </div>
            <div className="flex items-center gap-3 rounded-md bg-white/70 px-4 py-3 shadow-soft">
              <Clock aria-hidden="true" className="size-5 text-gold" />
              <span>{weddingContent.weddingTime}</span>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={false}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.1, ease: "easeOut" }}
          className="rounded-md border border-white/70 bg-white/72 p-6 shadow-soft backdrop-blur"
        >
          <Heart aria-hidden="true" className="mb-5 size-8 text-rosewood" />
          <p className="font-display text-3xl text-ink">Hẹn gặp bạn trong ngày vui của chúng mình.</p>
          <p className="mt-4 leading-7 text-ink/70">
            Sự hiện diện của bạn là món quà ý nghĩa nhất dành cho {weddingContent.brideName} và{" "}
            {weddingContent.groomName}.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
