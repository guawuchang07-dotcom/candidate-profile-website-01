import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from "motion/react";
import { useMemo, useRef } from "react";
import "./Dock.css";

export type DockItemData = {
  label: string;
  onClick?: () => void;
  className?: string;
};

type NumericMotionValue = ReturnType<typeof useMotionValue<number>>;

type DockSpringConfig = {
  mass?: number;
  stiffness?: number;
  damping?: number;
  restDelta?: number;
  restSpeed?: number;
};

type DockProps = {
  items: DockItemData[];
  className?: string;
  distance?: number;
  panelHeight?: number;
  baseItemSize?: number;
  dockHeight?: number;
  magnification?: number;
  spring?: DockSpringConfig;
  "aria-label"?: string;
};

type DockItemProps = {
  item: DockItemData;
  mouseX: NumericMotionValue;
  spring: DockSpringConfig;
  distance: number;
  magnification: number;
  baseItemSize: number;
};

function DockItem({ item, mouseX, spring, distance, magnification, baseItemSize }: DockItemProps) {
  const ref = useRef<HTMLButtonElement>(null);
  const shouldReduceMotion = useReducedMotion();
  const hoverScale = shouldReduceMotion ? 1 : magnification;

  const mouseDistance = useTransform(mouseX, (value) => {
    const rect = ref.current?.getBoundingClientRect() ?? { x: 0, width: baseItemSize };
    return value - rect.x - rect.width / 2;
  });

  const targetScale = useTransform(mouseDistance, [-distance, 0, distance], [1, hoverScale, 1]);
  const scale = useSpring(targetScale, spring);
  const lift = useTransform(scale, (value) => (shouldReduceMotion ? 0 : (value - 1) * -18));

  return (
    <motion.button
      ref={ref}
      type="button"
      style={{ minHeight: baseItemSize, scale, y: lift }}
      onMouseEnter={({ clientX }) => mouseX.set(clientX)}
      onMouseMove={({ clientX }) => mouseX.set(clientX)}
      onClick={item.onClick}
      className={`dock-item${item.className ? ` ${item.className}` : ""}`}
      aria-label={item.label}
    >
      <span className="dock-text">{item.label}</span>
    </motion.button>
  );
}

export default function Dock({
  items,
  className = "",
  spring = { mass: 0.1, stiffness: 150, damping: 12 },
  magnification = 1.14,
  distance = 200,
  panelHeight = 68,
  dockHeight = 256,
  baseItemSize = 50,
  "aria-label": ariaLabel = "Dock navigation"
}: DockProps) {
  const mouseX = useMotionValue(Infinity);
  const isHovered = useMotionValue(0);
  const maxHeight = useMemo(() => Math.max(dockHeight, panelHeight + 14), [dockHeight, panelHeight]);
  const heightRow = useTransform(isHovered, [0, 1], [panelHeight, maxHeight]);
  const height = useSpring(heightRow, spring);

  return (
    <motion.div style={{ height }} className="dock-outer">
      <motion.div
        onMouseMove={({ clientX }) => {
          isHovered.set(1);
          mouseX.set(clientX);
        }}
        onMouseLeave={() => {
          isHovered.set(0);
          mouseX.set(Infinity);
        }}
        className={`dock-panel${className ? ` ${className}` : ""}`}
        style={{ height: panelHeight }}
        role="toolbar"
        aria-label={ariaLabel}
      >
        {items.map((item) => (
          <DockItem
            key={item.label}
            item={item}
            mouseX={mouseX}
            spring={spring}
            distance={distance}
            magnification={magnification}
            baseItemSize={baseItemSize}
          />
        ))}
      </motion.div>
    </motion.div>
  );
}
