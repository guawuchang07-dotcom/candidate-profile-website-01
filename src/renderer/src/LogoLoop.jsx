import "./LogoLoop.css";

export default function LogoLoop({
  logos = [],
  direction = "left",
  speed = 40,
  gap = 28,
  fadeOut = false,
  fadeOutColor = "#050B1A",
  scaleOnHover = false,
  hoverSpeed
}) {
  const items = [...logos, ...logos, ...logos];
  const duration = `${Math.max(16, 1600 / Math.max(1, speed))}s`;

  return (
    <div
      className={[
        "logo-loop",
        direction === "right" ? "logo-loop--right" : "logo-loop--left",
        fadeOut ? "logo-loop--fade" : "",
        scaleOnHover ? "logo-loop--scale" : "",
        hoverSpeed === 0 ? "logo-loop--pause-hover" : ""
      ].filter(Boolean).join(" ")}
      style={{
        "--logo-loop-gap": `${gap}px`,
        "--logo-loop-duration": duration,
        "--logo-loop-fade": fadeOutColor
      }}
    >
      <div className="logo-loop__track" aria-label="工具栈">
        {items.map((logo, index) => (
          <div className="logo-loop__item" key={`${logo.title ?? "tool"}-${index}`}>
            {logo.node}
          </div>
        ))}
      </div>
    </div>
  );
}
