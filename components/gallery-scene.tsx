"use client";

import { useCallback } from "react";
import type { MotionValue } from "framer-motion";
import type { WebGLRenderer } from "three";
import type { GalleryMediaItem } from "@/lib/gallery-media-schema";
import { createWeddingAlbum } from "@/lib/wedding-album-3d";
import { WebGLSceneCanvas } from "./webgl-scene-canvas";

export function GalleryScene({ photos, progress, onReady }: {
  photos: readonly GalleryMediaItem[];
  progress: MotionValue<number>;
  onReady: (ready: boolean) => void;
}) {
  const createScene = useCallback((renderer: WebGLRenderer) => createWeddingAlbum(renderer, photos), [photos]);
  return <WebGLSceneCanvas progress={progress} onReady={onReady} createScene={createScene} className="album-canvas" />;
}
