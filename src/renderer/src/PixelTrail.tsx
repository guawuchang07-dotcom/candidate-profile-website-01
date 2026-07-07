import { useEffect, useRef } from "react";
import type { CSSProperties } from "react";
import "./pixel-trail.css";

export interface PixelTrailProps {
  /**
   * Ref of the parent container. The component listens to `pointermove`
   * on this element and inserts absolutely-positioned particle spans
   * into its own internal layer (which itself fills the container).
   * If omitted, falls back to `document`.
   */
  containerRef?: React.RefObject<HTMLElement | null>;
  /** Maximum number of simultaneously alive particles. Default 80. */
  maxParticles?: number;
  /** [min, max] pixel size range for each particle. Default [4, 8]. */
  sizeRange?: [number, number];
  /** Color pool for particles. */
  colors?: string[];
}

const DEFAULT_COLORS = ["#15f7ff", "#9b5cff", "#ff4dff", "#ffffff"];

function randomBetween(min: number, max: number): number {
  return min + Math.random() * (max - min);
}

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

export default function PixelTrail(props: PixelTrailProps) {
  const {
    containerRef,
    maxParticles = 80,
    sizeRange = [4, 8],
    colors = DEFAULT_COLORS,
  } = props;
  const isGlobalMode = !containerRef;

  const layerRef = useRef<HTMLDivElement | null>(null);
  const layerStyle: CSSProperties = containerRef
    ? { position: "absolute", inset: 0, pointerEvents: "none", overflow: "hidden", zIndex: 5 }
    : { position: "fixed", inset: 0, pointerEvents: "none", overflow: "hidden", zIndex: 9999 };

  useEffect(() => {
    const layer = layerRef.current;
    if (!layer) return;

    // Early-exit checks for environments where this effect should not run.
    if (typeof window === "undefined" || typeof window.matchMedia !== "function") {
      return;
    }
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (window.matchMedia("(pointer: coarse)").matches) return;
    if (window.matchMedia("(max-width: 767px)").matches) return;

    // Target element for the pointermove listener.
    const listenTo: EventTarget = containerRef?.current ?? document;

    const particles: HTMLSpanElement[] = [];
    const removalTimeouts = new Set<ReturnType<typeof setTimeout>>();

    let lastEmitTs = 0;
    let lastMoveTs = 0;
    const THROTTLE_MS = isGlobalMode ? 8 : 16;
    const IDLE_MS = 100;

    const spawnParticle = (x: number, y: number) => {
      const size = randomBetween(sizeRange[0], sizeRange[1]);
      const color = pick(colors);
      const rotation = randomBetween(-15, 15);

      const el = document.createElement("span");
      el.className = "pixel-trail-particle";
      const style = el.style;
      style.left = `${x}px`;
      style.top = `${y}px`;
      style.width = `${size}px`;
      style.height = `${size}px`;
      style.background = color;
      style.boxShadow = `0 0 4px ${color}`;
      style.opacity = "1";
      style.setProperty("--r", `${rotation}deg`);
      // The CSS keyframes already include translate(-50%, -50%) so we don't
      // need to set transform from JS — the animation drives it.

      layer.appendChild(el);
      particles.push(el);

      // Cap simultaneous particle count.
      while (particles.length > maxParticles) {
        const oldest = particles.shift();
        if (oldest && oldest.parentNode) {
          oldest.parentNode.removeChild(oldest);
        }
      }

      // Auto-remove after animation ends (slightly longer than 1.4s anim).
      const t = setTimeout(() => {
        removalTimeouts.delete(t);
        const idx = particles.indexOf(el);
        if (idx !== -1) particles.splice(idx, 1);
        if (el.parentNode) el.parentNode.removeChild(el);
      }, 1600);
      removalTimeouts.add(t);
    };

    const handlePointerMove = (ev: Event) => {
      const e = ev as PointerEvent;
      const now =
        typeof performance !== "undefined" ? performance.now() : Date.now();

      // Idle gate: if the previous move was long ago, treat this as the
      // first move of a new gesture (don't emit yet — wait one tick so we
      // have a real velocity / direction). We update lastMoveTs and bail.
      if (!isGlobalMode && now - lastMoveTs > IDLE_MS) {
        lastMoveTs = now;
        return;
      }
      lastMoveTs = now;

      // Throttle to ~16ms.
      if (now - lastEmitTs < THROTTLE_MS) return;
      lastEmitTs = now;

      // Compute coordinates relative to the layer (which fills the container).
      const rect = layer.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      // Skip if pointer is outside the layer (can happen when target=document).
      if (x < 0 || y < 0 || x > rect.width || y > rect.height) return;

      const count = isGlobalMode ? 3 : Math.random() < 0.5 ? 1 : 2;
      for (let i = 0; i < count; i++) {
        // Tiny scatter so multi-spawn doesn't perfectly overlap.
        const jx = x + randomBetween(-2, 2);
        const jy = y + randomBetween(-2, 2);
        spawnParticle(jx, jy);
      }
    };

    listenTo.addEventListener("pointermove", handlePointerMove, { passive: true });

    return () => {
      listenTo.removeEventListener("pointermove", handlePointerMove);
      removalTimeouts.forEach((t) => clearTimeout(t));
      removalTimeouts.clear();
      // Drop all particles still in the DOM.
      while (particles.length > 0) {
        const el = particles.pop();
        if (el && el.parentNode) el.parentNode.removeChild(el);
      }
      // Defensive: clear anything left inside the layer.
      while (layer.firstChild) layer.removeChild(layer.firstChild);
    };
  }, [containerRef, isGlobalMode, maxParticles, sizeRange, colors]);

  return <div ref={layerRef} className="pixel-trail-layer" style={layerStyle} aria-hidden="true" />;
}
