import { useEffect, useRef } from "react";

/**
 * 第二屏氛围层:Canvas 2D 自绘。
 * - 天空数据雨:cyan 为主、少量紫点缀的竖向字符流,稀疏、缓慢、越往下越淡。
 * - 漂浮粒子:微弱 cyan/白光点,缓慢布朗漂移。
 * 叠在城市背景图之上、正文之下(z-index:0)。离屏自动暂停 rAF;respects prefers-reduced-motion。
 * 刻意不引入任何依赖(纯 canvas),也不复用 WebGL PixelBlast(那是涟漪粒子,做不了竖向雨)。
 */
const GLYPHS = "ｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾅﾆﾇﾉ0123456789#%&*+-<>/\\|=ABCDEF".split("");
const CELL = 18; // 字符行高(px,CSS 像素)
const COL_GAP = 30; // 列间距(px) — 越大越稀疏

type Drop = {
  x: number;
  y: number; // head 像素位置
  speed: number; // px / frame @60
  len: number; // 拖尾字符数
  purple: boolean; // 少量列用紫
  glyphs: string[];
};

type Mote = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  a: number; // base alpha
  warm: boolean; // true=偏白,false=cyan
  ph: number; // 闪烁相位
};

export default function Section2Ambient(): JSX.Element {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let dpr = Math.min(window.devicePixelRatio || 1, 2);
    let cssW = 0;
    let cssH = 0;
    let drops: Drop[] = [];
    let motes: Mote[] = [];
    let rafId: number | null = null;
    let running = false;

    const rand = (a: number, b: number): number => a + Math.random() * (b - a);
    const pick = <T,>(arr: T[]): T => arr[(Math.random() * arr.length) | 0];

    const buildDrops = (): void => {
      const cols = Math.floor(cssW / COL_GAP);
      drops = [];
      for (let i = 0; i < cols; i++) {
        // 稀疏:只激活约 60% 的列
        if (Math.random() > 0.6) continue;
        const len = Math.round(rand(6, 16));
        drops.push({
          x: i * COL_GAP + COL_GAP * 0.5 + rand(-4, 4),
          y: rand(-cssH * 0.18, cssH * 0.72),
          speed: rand(0.55, 1.15), // 启动更快,但仍保持背景氛围
          len,
          purple: Math.random() < 0.16, // 少量紫
          glyphs: Array.from({ length: len }, () => pick(GLYPHS))
        });
      }
    };

    const buildMotes = (): void => {
      const count = Math.round((cssW * cssH) / 30000); // v3:再加密度
      motes = [];
      for (let i = 0; i < count; i++) {
        motes.push({
          x: Math.random() * cssW,
          y: Math.random() * cssH,
          vx: rand(-0.12, 0.12),
          vy: rand(-0.18, -0.04), // 整体微微上浮
          r: rand(0.7, 2.4),
          a: rand(0.16, 0.5), // v2:调亮一档,真的看得见
          warm: Math.random() < 0.32,
          ph: Math.random() * Math.PI * 2
        });
      }
    };

    const resize = (): void => {
      const rect = canvas.getBoundingClientRect();
      cssW = rect.width;
      cssH = rect.height;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.max(1, Math.floor(cssW * dpr));
      canvas.height = Math.max(1, Math.floor(cssH * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      buildDrops();
      buildMotes();
    };

    const drawStatic = (): void => {
      // reduced-motion:只画一帧静态粒子,不画雨、不循环
      ctx.clearRect(0, 0, cssW, cssH);
      for (const m of motes) {
        ctx.globalAlpha = m.a;
        ctx.fillStyle = m.warm ? "#eafcff" : "#15f7ff";
        ctx.beginPath();
        ctx.arc(m.x, m.y, m.r, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
    };

    let t = 0;
    const tick = (): void => {
      t += 1;
      ctx.clearRect(0, 0, cssW, cssH);

      // ---- 数据雨 ----
      ctx.font = `${CELL - 3}px "JetBrains Mono", Consolas, monospace`;
      ctx.textBaseline = "top";
      for (const d of drops) {
        for (let k = 0; k < d.len; k++) {
          const gy = d.y - k * CELL;
          if (gy < -CELL || gy > cssH) continue;
          // 头部最亮,向尾部渐暗;整体越往下(屏幕越低)越淡 → 天空强、城市弱
          const headFade = 1 - k / d.len;
          const depthFade = 1 - Math.min(1, gy / cssH) * 0.72;
          const alpha = headFade * depthFade * 0.4; // v2:整体压暗,别抢正文
          if (alpha <= 0.015) continue;
          if (k === 0) {
            ctx.fillStyle = `rgba(216,255,255,${(0.62 * depthFade).toFixed(3)})`; // v2:head 也压一点
          } else if (d.purple) {
            ctx.fillStyle = `rgba(155,92,255,${alpha.toFixed(3)})`;
          } else {
            ctx.fillStyle = `rgba(21,247,255,${alpha.toFixed(3)})`;
          }
          ctx.fillText(d.glyphs[k], d.x, gy);
        }
        d.y += d.speed;
        // 偶尔换字符,做"跳动"感
        if (t % 6 === 0 && Math.random() < 0.5) {
          d.glyphs[(Math.random() * d.len) | 0] = pick(GLYPHS);
        }
        // 落出底部 → 回到顶部重生
        if (d.y - d.len * CELL > cssH) {
          d.y = rand(-cssH * 0.4, 0);
          d.speed = rand(0.55, 1.15);
          d.purple = Math.random() < 0.16;
        }
      }

      // ---- 漂浮粒子 ----
      for (const m of motes) {
        m.x += m.vx;
        m.y += m.vy;
        if (m.y < -4) m.y = cssH + 4;
        if (m.x < -4) m.x = cssW + 4;
        if (m.x > cssW + 4) m.x = -4;
        const tw = m.a * (0.7 + 0.3 * Math.sin(t * 0.02 + m.ph)); // 缓慢闪烁
        ctx.globalAlpha = Math.max(0, tw);
        ctx.fillStyle = m.warm ? "#eafcff" : "#15f7ff";
        ctx.beginPath();
        ctx.arc(m.x, m.y, m.r, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;

      rafId = requestAnimationFrame(tick);
    };

    const start = (): void => {
      if (running || reduce) return;
      running = true;
      rafId = requestAnimationFrame(tick);
    };
    const stop = (): void => {
      running = false;
      if (rafId !== null) cancelAnimationFrame(rafId);
      rafId = null;
    };

    resize();
    if (reduce) {
      drawStatic();
    }

    // 离屏暂停
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) start();
          else stop();
        }
      },
      { threshold: 0 }
    );
    io.observe(canvas);

    let resizeTimer: number | null = null;
    const onResize = (): void => {
      if (resizeTimer !== null) clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(() => {
        const wasRunning = running;
        stop();
        resize();
        if (reduce) drawStatic();
        else if (wasRunning) start();
      }, 180);
    };
    window.addEventListener("resize", onResize);

    return () => {
      stop();
      io.disconnect();
      window.removeEventListener("resize", onResize);
      if (resizeTimer !== null) clearTimeout(resizeTimer);
    };
  }, []);

  return <canvas ref={canvasRef} className="cap-stack-ambient" aria-hidden="true" />;
}
