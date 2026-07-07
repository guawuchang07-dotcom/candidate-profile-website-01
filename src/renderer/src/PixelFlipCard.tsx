import { useEffect, useRef, useState } from "react";
import type { CSSProperties } from "react";
import "./pixel-flip-card.css";

type PixelFlipCardProps = {
  frontSrc: string;
  backSrc: string;
  frontAlt?: string;
  backAlt?: string;
  gridSize?: number;
  pixelColor?: string;
  stepDuration?: number; // 秒
  className?: string;
  style?: CSSProperties;
};

// 纯 JS 像素马赛克翻转:hover/focus 时一格格随机显隐像素,中点切换正/背面。
// 复刻 React Bits PixelTransition 的视觉,但不引入 gsap,用 setTimeout 做随机 stagger。
export default function PixelFlipCard({
  frontSrc,
  backSrc,
  frontAlt = "",
  backAlt = "",
  gridSize = 12,
  pixelColor = "#15F7FF",
  stepDuration = 0.45,
  className = "",
  style = {}
}: PixelFlipCardProps): JSX.Element {
  const gridRef = useRef<HTMLDivElement>(null);
  const timersRef = useRef<number[]>([]);
  const [active, setActive] = useState(false);

  // 生成像素格
  useEffect(() => {
    const grid = gridRef.current;
    if (!grid) return;
    grid.innerHTML = "";
    const size = 100 / gridSize;
    for (let r = 0; r < gridSize; r++) {
      for (let c = 0; c < gridSize; c++) {
        const px = document.createElement("div");
        px.className = "pixel-flip-cell";
        px.style.cssText = `width:${size}%;height:${size}%;left:${c * size}%;top:${r * size}%;background:${pixelColor};`;
        grid.appendChild(px);
      }
    }
  }, [gridSize, pixelColor]);

  const clearTimers = (): void => {
    timersRef.current.forEach((t) => clearTimeout(t));
    timersRef.current = [];
  };

  const animate = (toActive: boolean): void => {
    const grid = gridRef.current;
    if (!grid) return;
    clearTimers();
    const cells = Array.from(grid.querySelectorAll<HTMLElement>(".pixel-flip-cell"));
    if (!cells.length) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      setActive(toActive);
      return;
    }
    const order = cells.map((_, i) => i).sort(() => Math.random() - 0.5);
    const stepMs = stepDuration * 1000;
    const each = stepMs / cells.length;
    // 第一阶段:随机点亮所有像素(遮住画面)
    order.forEach((idx, k) => {
      const t = window.setTimeout(() => {
        cells[idx].style.display = "block";
      }, k * each);
      timersRef.current.push(t);
    });
    // 中点:切换正/背面
    const swap = window.setTimeout(() => setActive(toActive), stepMs);
    timersRef.current.push(swap);
    // 第二阶段:随机熄灭像素(露出新画面)
    const order2 = cells.map((_, i) => i).sort(() => Math.random() - 0.5);
    order2.forEach((idx, k) => {
      const t = window.setTimeout(() => {
        cells[idx].style.display = "none";
      }, stepMs + k * each);
      timersRef.current.push(t);
    });
  };

  useEffect(() => () => clearTimers(), []);

  const click = (): void => animate(!active);

  return (
    <div
      className={`pixel-flip-card ${className}`}
      style={style}
      tabIndex={0}
      onClick={click}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          click();
        }
      }}
      aria-label={active ? backAlt || frontAlt : frontAlt}
    >
      <img className="pixel-flip-face" src={frontSrc} alt={frontAlt} aria-hidden={active} draggable={false} />
      <img
        className={`pixel-flip-face pixel-flip-face--back${active ? " is-on" : ""}`}
        src={backSrc}
        alt={backAlt}
        aria-hidden={!active}
        draggable={false}
      />
      <div className="pixel-flip-grid" ref={gridRef} aria-hidden="true" />
    </div>
  );
}
