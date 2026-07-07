import { useEffect, useRef } from "react";
import type { CSSProperties, ReactNode } from "react";
import { gsap } from "gsap";
import { ScrambleTextPlugin } from "gsap/ScrambleTextPlugin";
import { SplitText } from "gsap/SplitText";
import "./ScrambledText.css";

gsap.registerPlugin(SplitText, ScrambleTextPlugin);

type ScrambledTextProps = {
  radius?: number;
  verticalRadius?: number;
  duration?: number;
  speed?: number;
  scrambleChars?: string;
  className?: string;
  style?: CSSProperties;
  children: ReactNode;
};

export default function ScrambledText({
  radius = 100,
  verticalRadius = radius,
  duration = 1.2,
  speed = 0.5,
  scrambleChars = ".:",
  className = "",
  style = {},
  children
}: ScrambledTextProps): JSX.Element {
  const rootRef = useRef<HTMLSpanElement | null>(null);
  const charsRef = useRef<HTMLElement[]>([]);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return undefined;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reduceMotion.matches) return undefined;

    const split = SplitText.create(root, {
      type: "chars",
      charsClass: "scrambled-char",
      tag: "span",
      aria: "auto"
    });
    charsRef.current = split.chars as HTMLElement[];

    charsRef.current.forEach((char) => {
      const width = char.getBoundingClientRect().width;

      gsap.set(char, {
        display: "inline-block",
        width,
        minWidth: width,
        maxWidth: width,
        overflow: "hidden",
        verticalAlign: "baseline",
        attr: { "data-content": char.textContent ?? "" }
      });
    });

    const handleMove = (event: PointerEvent): void => {
      charsRef.current.forEach((char) => {
        const { left, top, width, height } = char.getBoundingClientRect();
        const dx = event.clientX - (left + width / 2);
        const dy = event.clientY - (top + height / 2);
        const distance = Math.hypot(dx / radius, dy / verticalRadius);

        if (distance < 1) {
          gsap.to(char, {
            overwrite: true,
            duration: duration * (1 - distance),
            scrambleText: {
              text: char.dataset.content || "",
              chars: scrambleChars,
              speed
            },
            ease: "none"
          });
        }
      });
    };

    root.addEventListener("pointermove", handleMove);

    return () => {
      root.removeEventListener("pointermove", handleMove);
      gsap.killTweensOf(charsRef.current);
      charsRef.current = [];
      split.revert();
    };
  }, [duration, radius, scrambleChars, speed, verticalRadius]);

  return (
    <span ref={rootRef} className={`scrambled-text${className ? ` ${className}` : ""}`} style={style}>
      {children}
    </span>
  );
}
