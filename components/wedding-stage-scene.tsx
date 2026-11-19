"use client";

import { useEffect, useRef } from "react";
import type { MotionValue } from "framer-motion";
import { WebGLRenderer } from "three";
import { createWeddingStage } from "@/lib/wedding-stage-3d";

export function WeddingStageScene({ progress, onReady }: {
  progress: MotionValue<number>;
  onReady: (ready: boolean) => void;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const host = canvas?.parentElement;
    if (!canvas || !host) return;
    let renderer: WebGLRenderer;
    let stage: ReturnType<typeof createWeddingStage>;

    try {
      const context = canvas.getContext("webgl2", { alpha: false, antialias: true, powerPreference: "high-performance" });
      if (!context || context.isContextLost()) return;
      renderer = new WebGLRenderer({ canvas, context, antialias: true, alpha: false });
      try {
        stage = createWeddingStage(renderer);
      } catch (error) {
        renderer.dispose();
        throw error;
      }
    } catch (error) {
      console.warn("Wedding 3D initialization failed:", error);
      onReady(false);
      return;
    }

    let rect = host.getBoundingClientRect();
    let aspect = rect.width / Math.max(1, rect.height);
    let visible = rect.bottom > 0 && rect.top < window.innerHeight;
    let disposed = false;
    let prepared = false;
    let firstFrame = true;
    let frame: number | null = null;
    let pointerX = 0;
    let pointerY = 0;
    let targetX = 0;
    let targetY = 0;

    function requestRender() {
      if (!disposed && prepared && visible && !document.hidden && frame === null) frame = requestAnimationFrame(render);
    }

    function render() {
      frame = null;
      if (disposed || !visible || document.hidden) return;
      pointerX += (targetX - pointerX) * 0.18;
      pointerY += (targetY - pointerY) * 0.18;
      try {
        stage.update(progress.get(), pointerX, pointerY, aspect);
        renderer.render(stage.scene, stage.camera);
        if (firstFrame) {
          firstFrame = false;
          onReady(true);
        }
      } catch (error) {
        console.warn("Wedding 3D rendering failed:", error);
        onReady(false);
        cleanup();
        return;
      }
      if (Math.abs(targetX - pointerX) + Math.abs(targetY - pointerY) > 0.001) requestRender();
    }

    function resize() {
      rect = host!.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      aspect = rect.width / rect.height;
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
      renderer.setSize(rect.width, rect.height, false);
      requestRender();
    }

    function movePointer(event: PointerEvent) {
      if (event.pointerType === "touch") return;
      targetX = ((event.clientX - rect.left) / rect.width - 0.5) * 2;
      targetY = -((event.clientY - rect.top) / rect.height - 0.5) * 2;
      requestRender();
    }

    function leavePointer() {
      targetX = targetY = 0;
      requestRender();
    }

    function visibilityChanged() {
      if (document.hidden && frame !== null) {
        cancelAnimationFrame(frame);
        frame = null;
      } else requestRender();
    }

    function contextLost(event: Event) {
      event.preventDefault();
      onReady(false);
      cleanup();
    }

    const unsubscribe = progress.on("change", requestRender);
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(host);
    const intersectionObserver = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) {
        rect = host.getBoundingClientRect();
        requestRender();
      } else if (frame !== null) {
        cancelAnimationFrame(frame);
        frame = null;
      }
    });
    intersectionObserver.observe(host);
    host.addEventListener("pointermove", movePointer, { passive: true });
    host.addEventListener("pointerleave", leavePointer);
    document.addEventListener("visibilitychange", visibilityChanged);
    canvas.addEventListener("webglcontextlost", contextLost);
    resize();
    stage.update(progress.get(), pointerX, pointerY, aspect);
    void renderer.compileAsync(stage.scene, stage.camera).then(() => {
      if (disposed) return;
      prepared = true;
      requestRender();
    }).catch((error: unknown) => {
      if (disposed) return;
      console.warn("Wedding 3D shader preparation failed:", error);
      onReady(false);
      cleanup();
    });

    function cleanup() {
      if (disposed) return;
      disposed = true;
      if (frame !== null) cancelAnimationFrame(frame);
      unsubscribe();
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      host!.removeEventListener("pointermove", movePointer);
      host!.removeEventListener("pointerleave", leavePointer);
      document.removeEventListener("visibilitychange", visibilityChanged);
      canvas!.removeEventListener("webglcontextlost", contextLost);
      stage.dispose();
      renderer.dispose();
      // React Strict Mode reuses this canvas during its effect replay.
      // Dispose owned GPU resources without invalidating that live context.
    }

    return () => {
      cleanup();
      onReady(false);
    };
  }, [progress, onReady]);

  return <canvas ref={canvasRef} className="stage-canvas" aria-hidden="true" />;
}
