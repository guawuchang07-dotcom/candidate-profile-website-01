import { useEffect, useRef } from "react";
import type { CSSProperties } from "react";
import "./particle-reveal.css";

type Rgb = { r: number; g: number; b: number };

type Particle = {
  x: number;
  y: number;
  startX: number;
  startY: number;
  targetX: number;
  targetY: number;
  size: number;
  color: string;
  alpha: number;
  seed: number;
  depth: number;
  delay: number;
};

type ParticleRevealProps = {
  imageSrc: string;
  className?: string;
  style?: CSSProperties;
  particleSize?: number;
  density?: number;
  color?: string;
  highlightColor?: string;
  scatter?: number;
  gatherDuration?: number;
  stagger?: number;
  onComplete?: () => void;
};

const clamp = (value: number, min: number, max: number): number =>
  Math.min(Math.max(value, min), max);

const easeOutCubic = (value: number): number => 1 - Math.pow(1 - value, 3);

const hexToRgb = (hex: string): Rgb | null => {
  const clean = hex.replace("#", "").trim();
  if (!/^[0-9a-fA-F]{6}$/.test(clean)) return null;
  return {
    r: parseInt(clean.slice(0, 2), 16),
    g: parseInt(clean.slice(2, 4), 16),
    b: parseInt(clean.slice(4, 6), 16)
  };
};

const mixRgb = (from: Rgb, to: Rgb, amount: number): Rgb => ({
  r: Math.round(from.r + (to.r - from.r) * amount),
  g: Math.round(from.g + (to.g - from.g) * amount),
  b: Math.round(from.b + (to.b - from.b) * amount)
});

const rgbToCss = (rgb: Rgb): string => `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;

const loadImage = async (src: string): Promise<HTMLImageElement> => {
  const image = new Image();
  image.decoding = "async";
  image.src = src;

  if (!image.complete || image.naturalWidth === 0) {
    await new Promise<void>((resolve, reject) => {
      image.onload = () => resolve();
      image.onerror = () => reject(new Error(`Unable to load particle source: ${src}`));
    });
  }

  try {
    await image.decode();
  } catch {
    // Older browsers may not implement decode for locally bundled assets.
  }

  return image;
};

/**
 * A particle silhouette reveal adapted from the supplied ParticleText effect.
 * The target is sampled from the source image alpha channel so transparent
 * character artwork can assemble into the same shape as the final video.
 */
export default function ParticleReveal({
  imageSrc,
  className = "",
  style,
  particleSize = 1.8,
  density = 4,
  color = "#d9f7ff",
  highlightColor = "#7cffb2",
  scatter = 130,
  gatherDuration = 1450,
  stagger = 280,
  onComplete
}: ParticleRevealProps): JSX.Element {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const onCompleteRef = useRef(onComplete);

  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas || typeof window === "undefined") return undefined;

    const ctx = canvas.getContext("2d");
    if (!ctx) return undefined;

    let disposed = false;
    let animationFrame: number | null = null;
    let resizeFrame: number | null = null;
    let width = 0;
    let height = 0;
    let dpr = 1;
    let particles: Particle[] = [];
    let gathering = false;
    let gatherStart = 0;
    let completed = false;
    let buildId = 0;
    let reducedMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;

    const baseRgb = hexToRgb(color);
    const highlightRgb = hexToRgb(highlightColor);

    const complete = (): void => {
      if (disposed || completed) return;
      completed = true;
      onCompleteRef.current?.();
    };

    const startGather = (): void => {
      if (!particles.length) {
        complete();
        return;
      }

      const spread = reducedMotion ? 0 : scatter;
      particles.forEach((particle) => {
        const angle = particle.seed * Math.PI * 2;
        const distance = spread * (0.35 + particle.depth * 0.75);
        particle.x = particle.targetX + Math.cos(angle) * distance + (particle.depth - 0.5) * spread * 0.55;
        particle.y = particle.targetY + Math.sin(angle) * distance + (particle.seed - 0.5) * spread * 0.55;
        particle.startX = particle.x;
        particle.startY = particle.y;
        particle.delay = reducedMotion ? 0 : particle.seed * stagger;
      });

      if (reducedMotion) {
        particles.forEach((particle) => {
          particle.x = particle.targetX;
          particle.y = particle.targetY;
          particle.startX = particle.targetX;
          particle.startY = particle.targetY;
        });
        gathering = false;
        complete();
        return;
      }

      gatherStart = performance.now();
      gathering = true;
    };

    const drawParticle = (particle: Particle): void => {
      const size = particle.size;
      ctx.fillStyle = particle.color;
      if (size <= 2.1) {
        ctx.fillRect(particle.x - size / 2, particle.y - size / 2, size, size);
        return;
      }

      ctx.beginPath();
      ctx.arc(particle.x, particle.y, size / 2, 0, Math.PI * 2);
      ctx.fill();
    };

    const render = (now: number): void => {
      ctx.clearRect(0, 0, width, height);
      ctx.globalCompositeOperation = "source-over";
      ctx.shadowBlur = reducedMotion ? 0 : particleSize * 3.5;
      ctx.shadowColor = highlightColor;

      let completeFrame = true;
      particles.forEach((particle) => {
        let baseX = particle.targetX;
        let baseY = particle.targetY;
        let progress = 1;

        if (gathering) {
          const local = (now - gatherStart - particle.delay) / Math.max(1, gatherDuration);
          progress = clamp(local, 0, 1);
          const eased = easeOutCubic(progress);
          baseX = particle.startX + (particle.targetX - particle.startX) * eased;
          baseY = particle.startY + (particle.targetY - particle.startY) * eased;
          if (progress < 1) completeFrame = false;
        }

        const follow = reducedMotion ? 1 : 0.24;
        particle.x += (baseX - particle.x) * follow;
        particle.y += (baseY - particle.y) * follow;
        ctx.globalAlpha = clamp((0.2 + progress * 0.8) * particle.alpha, 0, 1);
        drawParticle(particle);
      });

      ctx.globalAlpha = 1;
      ctx.shadowBlur = 0;

      if (gathering && completeFrame) {
        gathering = false;
        complete();
      }

      if (!disposed) animationFrame = window.requestAnimationFrame(render);
    };

    const ensureRenderLoop = (): void => {
      if (animationFrame === null) animationFrame = window.requestAnimationFrame(render);
    };

    const sampleImage = async (): Promise<void> => {
      const currentBuild = ++buildId;
      completed = false;
      const rect = container.getBoundingClientRect();
      width = Math.floor(rect.width);
      height = Math.floor(rect.height);
      if (width <= 0 || height <= 0) return;

      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.max(1, Math.floor(width * dpr));
      canvas.height = Math.max(1, Math.floor(height * dpr));
      canvas.style.width = "100%";
      canvas.style.height = "100%";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      let image: HTMLImageElement;
      try {
        image = await loadImage(imageSrc);
      } catch {
        complete();
        return;
      }

      if (disposed || currentBuild !== buildId) return;

      const offscreen = document.createElement("canvas");
      offscreen.width = width;
      offscreen.height = height;
      const offCtx = offscreen.getContext("2d", { willReadFrequently: true });
      if (!offCtx) {
        complete();
        return;
      }

      const scale = Math.min(width / image.naturalWidth, height / image.naturalHeight);
      const drawWidth = image.naturalWidth * scale;
      const drawHeight = image.naturalHeight * scale;
      const offsetX = (width - drawWidth) / 2;
      const offsetY = (height - drawHeight) / 2;
      offCtx.clearRect(0, 0, width, height);
      offCtx.drawImage(image, offsetX, offsetY, drawWidth, drawHeight);

      const imageData = offCtx.getImageData(0, 0, width, height);
      const targets: Array<{ x: number; y: number; alpha: number; rgb: Rgb }> = [];
      const step = Math.max(2, Math.floor(density));

      for (let y = 0; y < height; y += step) {
        for (let x = 0; x < width; x += step) {
          const dataIndex = (y * width + x) * 4;
          const alpha = imageData.data[dataIndex + 3];
          if (alpha <= 36) continue;
          targets.push({
            x,
            y,
            alpha: alpha / 255,
            rgb: {
              r: imageData.data[dataIndex],
              g: imageData.data[dataIndex + 1],
              b: imageData.data[dataIndex + 2]
            }
          });
        }
      }

      const maxParticles = Math.max(900, Math.min(4200, Math.floor((width * height) / 75)));
      const stride = Math.max(1, Math.ceil(targets.length / maxParticles));
      const selected = targets.filter((_, index) => index % stride === 0);

      particles = selected.map((target, index) => {
        const seed = ((index * 9301 + 49297) % 233280) / 233280;
        const depth = 0.45 + (((index * 233 + 97) % 1000) / 1000) * 0.9;
        const sourceLuma = (target.rgb.r * 0.2126 + target.rgb.g * 0.7152 + target.rgb.b * 0.0722) / 255;
        const tintAmount = clamp(0.38 + (1 - sourceLuma) * 0.1 + (target.x / Math.max(1, width)) * 0.26, 0.34, 0.82);
        const particleRgb = baseRgb && highlightRgb
          ? mixRgb(baseRgb, highlightRgb, tintAmount)
          : target.rgb;
        const angle = seed * Math.PI * 2;
        const distance = (reducedMotion ? 0 : scatter) * (0.35 + depth * 0.75);
        const startX = target.x + Math.cos(angle) * distance + (seed - 0.5) * scatter * 0.45;
        const startY = target.y + Math.sin(angle) * distance + (depth - 0.9) * scatter * 0.45;

        return {
          x: reducedMotion ? target.x : startX,
          y: reducedMotion ? target.y : startY,
          startX,
          startY,
          targetX: target.x,
          targetY: target.y,
          size: Math.max(0.65, particleSize * (0.72 + target.alpha * 0.5)),
          color: baseRgb && highlightRgb ? rgbToCss(particleRgb) : color,
          alpha: clamp(0.52 + target.alpha * 0.48, 0, 1),
          seed,
          depth,
          delay: seed * stagger
        };
      });

      startGather();
      ensureRenderLoop();
    };

    const queueSample = (): void => {
      if (resizeFrame !== null) window.cancelAnimationFrame(resizeFrame);
      resizeFrame = window.requestAnimationFrame(() => {
        void sampleImage();
      });
    };

    const reduceMotionQuery = window.matchMedia?.("(prefers-reduced-motion: reduce)");
    const handleReduceMotionChange = (event: MediaQueryListEvent): void => {
      reducedMotion = event.matches;
      completed = false;
      void sampleImage();
    };

    reduceMotionQuery?.addEventListener("change", handleReduceMotionChange);
    const resizeObserver = new ResizeObserver(queueSample);
    resizeObserver.observe(container);
    void sampleImage();

    return () => {
      disposed = true;
      buildId += 1;
      resizeObserver.disconnect();
      reduceMotionQuery?.removeEventListener("change", handleReduceMotionChange);
      if (animationFrame !== null) window.cancelAnimationFrame(animationFrame);
      if (resizeFrame !== null) window.cancelAnimationFrame(resizeFrame);
    };
  }, [color, density, gatherDuration, highlightColor, imageSrc, particleSize, scatter, stagger]);

  return (
    <div
      ref={containerRef}
      className={`particle-reveal ${className}`.trim()}
      style={style}
      aria-hidden="true"
    >
      <canvas ref={canvasRef} className="particle-reveal__canvas" />
    </div>
  );
}
