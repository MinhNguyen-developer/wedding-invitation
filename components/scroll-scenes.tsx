"use client";

import { motion, useInView, useScroll, useTransform } from "framer-motion";
import dynamic from "next/dynamic";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { WeddingMonogram } from "./wedding-monogram";

const WeddingStageScene = dynamic(
  () => import("./wedding-stage-scene").then((module) => module.WeddingStageScene).catch(() => () => null),
  { ssr: false }
);

export function OpeningStage({ children }: { children: ReactNode }) {
  const stageRef = useRef<HTMLElement>(null);
  const [mounted, setMounted] = useState(false);
  const [webglReady, setWebglReady] = useState(false);
  const hasEntered = useInView(stageRef, { once: true });
  const { scrollYProgress } = useScroll({ target: stageRef, offset: ["start start", "end end"] });
  const left = useTransform(scrollYProgress, [0, 0.9], ["0%", "-105%"]);
  const right = useTransform(scrollYProgress, [0, 0.9], ["0%", "105%"]);
  const titleY = useTransform(scrollYProgress, [0, 0.85], [0, -36]);
  const titleOpacity = useTransform(scrollYProgress, [0, 0.35, 0.85], [1, 1, 0]);
  const pointerEvents = useTransform(scrollYProgress, (progress) => progress < 0.8 ? "auto" as const : "none" as const);
  const motionEnabled = mounted;

  useEffect(() => setMounted(true), []);

  return (
    <section ref={stageRef} id="loi-moi" aria-label="Mở thiệp cưới" className="opening-stage" data-motion={motionEnabled ? "enabled" : "static"}>
      <link rel="preload" as="image" href="/images/stage/closed-desktop.webp" media="(min-aspect-ratio: 9/10)" />
      <link rel="preload" as="image" href="/images/stage/closed-portrait.webp" media="(max-aspect-ratio: 9/10)" />
      <noscript>
        <style>{`.opening-stage { height: auto !important; } .opening-stage .stage-frame { position: relative; height: auto; }`}</style>
      </noscript>
      <div className="stage-frame" data-renderer={motionEnabled && webglReady ? "webgl" : "fallback"}>
        {motionEnabled && hasEntered ? <WeddingStageScene progress={scrollYProgress} onReady={setWebglReady} /> : null}
        <div className="stage-fallback" aria-hidden="true">
          <div className="stage-world">
            <div className="stage-arch" />
            <WeddingMonogram className="stage-monogram" />
            <span className="stage-world-caption">Một lời hẹn. Một đời bên nhau.</span>
          </div>
          <div className="curtain-scene">
            <motion.div className="curtain curtain-left" style={{ x: motionEnabled ? left : 0 }} />
            <motion.div className="curtain curtain-right" style={{ x: motionEnabled ? right : 0 }} />
          </div>
        </div>
        <motion.div className="stage-content" style={motionEnabled ? { y: titleY, opacity: titleOpacity, pointerEvents } : undefined}>
          {children}
        </motion.div>
        <div className="stage-baseline" aria-hidden="true"><span>Một ngày để nhớ</span><span>Một đời để thương</span></div>
      </div>
    </section>
  );
}

export function ScrollReveal({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <motion.div
      className={`scroll-reveal ${className}`}
      initial={false}
      whileInView={{ y: [18, 0] }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}
