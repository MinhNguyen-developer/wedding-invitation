"use client";

import type { MotionValue } from "framer-motion";
import { createWeddingStage } from "@/lib/wedding-stage-3d";
import { WebGLSceneCanvas } from "./webgl-scene-canvas";

export function WeddingStageScene({ progress, onReady }: {
  progress: MotionValue<number>;
  onReady: (ready: boolean) => void;
}) {
  return <WebGLSceneCanvas progress={progress} onReady={onReady} createScene={createWeddingStage} className="stage-canvas" />;
}
