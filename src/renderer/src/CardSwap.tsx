import { Children, useEffect, useRef, type CSSProperties, type ReactNode } from "react";
import { gsap } from "gsap";
import "./card-swap.css";

type CardSwapProps = {
  children: ReactNode;
  width?: number | string;
  height?: number | string;
  cardDistance?: number;
  verticalDistance?: number;
  delay?: number;
  pauseOnHover?: boolean;
  skewAmount?: number;
  easing?: "elastic" | "smooth";
  enabled?: boolean;
  className?: string;
  "aria-label"?: string;
};

type Slot = {
  x: number;
  y: number;
  z: number;
  zIndex: number;
};

const makeSlot = (index: number, distanceX: number, distanceY: number, total: number): Slot => ({
  x: index * distanceX,
  y: -index * distanceY,
  z: -index * distanceX * 1.5,
  zIndex: total - index
});

const placeNow = (element: HTMLDivElement, slot: Slot, skew: number): void => {
  gsap.set(element, {
    x: slot.x,
    y: slot.y,
    z: slot.z,
    xPercent: -50,
    yPercent: -50,
    skewY: skew,
    transformOrigin: "center center",
    zIndex: slot.zIndex,
    force3D: true
  });
};

const setFrontCard = (elements: HTMLDivElement[], frontIndex: number): void => {
  elements.forEach((element, index) => {
    const isFront = index === frontIndex;
    element.dataset.front = isFront ? "true" : "false";
    element.setAttribute("aria-hidden", isFront ? "false" : "true");
    element.inert = !isFront;
  });
};

function getNumericSize(size: number | string | undefined, fallback: number): number {
  return typeof size === "number" ? size : fallback;
}

export default function CardSwap({
  children,
  width = 420,
  height = 520,
  cardDistance = 54,
  verticalDistance = 62,
  delay = 5200,
  pauseOnHover = true,
  skewAmount = 4,
  easing = "elastic",
  enabled = true,
  className,
  "aria-label": ariaLabel = "作品卡片轮换"
}: CardSwapProps): JSX.Element {
  const childArray = Children.toArray(children);
  const cardRefs = useRef<Array<HTMLDivElement | null>>([]);
  const orderRef = useRef<number[]>([]);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);
  const intervalRef = useRef<number | null>(null);
  const timeoutRef = useRef<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const swapRef = useRef<() => void>(() => undefined);

  useEffect(() => {
    const total = childArray.length;
    const elements = cardRefs.current.slice(0, total).filter((element): element is HTMLDivElement => element !== null);

    orderRef.current = Array.from({ length: total }, (_, index) => index);
    timelineRef.current?.kill();
    timelineRef.current = null;
    if (intervalRef.current !== null) window.clearInterval(intervalRef.current);
    if (timeoutRef.current !== null) window.clearTimeout(timeoutRef.current);
    intervalRef.current = null;
    timeoutRef.current = null;

    elements.forEach((element, index) => {
      placeNow(element, makeSlot(index, cardDistance, verticalDistance, total), skewAmount);
    });
    setFrontCard(elements, 0);

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!enabled || reducedMotion || total < 2) {
      return undefined;
    }

    const config =
      easing === "elastic"
        ? {
            ease: "elastic.out(0.6,0.9)",
            durDrop: 1.2,
            durMove: 1.1,
            durReturn: 1.15,
            promoteOverlap: 0.78,
            returnDelay: 0.08
          }
        : {
            ease: "power1.inOut",
            durDrop: 0.72,
            durMove: 0.72,
            durReturn: 0.72,
            promoteOverlap: 0.45,
            returnDelay: 0.18
          };
    const dropDistance = Math.max(420, getNumericSize(height, 520) * 0.96);

    const swap = (): void => {
      if (orderRef.current.length < 2) return;

      const [front, ...rest] = orderRef.current;
      const frontElement = cardRefs.current[front];
      if (!frontElement) return;

      const timeline = gsap.timeline();
      timelineRef.current = timeline;
      timeline.to(frontElement, {
        y: `+=${dropDistance}`,
        duration: config.durDrop,
        ease: config.ease
      });

      timeline.addLabel("promote", `-=${config.durDrop * config.promoteOverlap}`);
      timeline.call(() => setFrontCard(elements, rest[0]), undefined, "promote");
      rest.forEach((index, restIndex) => {
        const element = cardRefs.current[index];
        if (!element) return;
        const slot = makeSlot(restIndex, cardDistance, verticalDistance, total);
        timeline.set(element, { zIndex: slot.zIndex }, "promote");
        timeline.to(
          element,
          {
            x: slot.x,
            y: slot.y,
            z: slot.z,
            duration: config.durMove,
            ease: config.ease
          },
          `promote+=${restIndex * 0.1}`
        );
      });

      const backSlot = makeSlot(total - 1, cardDistance, verticalDistance, total);
      timeline.addLabel("return", `promote+=${config.durMove * config.returnDelay}`);
      timeline.call(
        () => {
          gsap.set(frontElement, { zIndex: backSlot.zIndex });
        },
        undefined,
        "return"
      );
      timeline.to(
        frontElement,
        {
          x: backSlot.x,
          y: backSlot.y,
          z: backSlot.z,
          duration: config.durReturn,
          ease: config.ease
        },
        "return"
      );
      timeline.call(() => {
        orderRef.current = [...rest, front];
      });
    };

    swapRef.current = swap;
    timeoutRef.current = window.setTimeout(swap, 900);
    intervalRef.current = window.setInterval(swap, delay);

    const container = containerRef.current;
    const pause = (): void => {
      if (!pauseOnHover) return;
      timelineRef.current?.pause();
      if (timeoutRef.current !== null) window.clearTimeout(timeoutRef.current);
      if (intervalRef.current !== null) window.clearInterval(intervalRef.current);
      timeoutRef.current = null;
      intervalRef.current = null;
    };
    const resume = (): void => {
      if (!pauseOnHover) return;
      timelineRef.current?.play();
      if (intervalRef.current === null) intervalRef.current = window.setInterval(() => swapRef.current(), delay);
    };

    if (container && pauseOnHover) {
      container.addEventListener("mouseenter", pause);
      container.addEventListener("mouseleave", resume);
    }

    return () => {
      if (container && pauseOnHover) {
        container.removeEventListener("mouseenter", pause);
        container.removeEventListener("mouseleave", resume);
      }
      if (timeoutRef.current !== null) window.clearTimeout(timeoutRef.current);
      if (intervalRef.current !== null) window.clearInterval(intervalRef.current);
      timelineRef.current?.kill();
      timeoutRef.current = null;
      intervalRef.current = null;
      timelineRef.current = null;
      swapRef.current = () => undefined;
    };
  }, [cardDistance, childArray.length, delay, easing, enabled, height, pauseOnHover, skewAmount, verticalDistance]);

  const style = { width, height } as CSSProperties;
  const classNames = ["resume-card-swap", className].filter(Boolean).join(" ");

  return (
    <div ref={containerRef} className={classNames} style={style} aria-label={ariaLabel}>
      {childArray.map((child, index) => (
        <div
          className="resume-card-swap-card"
          key={`card-swap-${index}`}
          ref={(element) => {
            cardRefs.current[index] = element;
          }}
          style={style}
        >
          {child}
        </div>
      ))}
    </div>
  );
}
