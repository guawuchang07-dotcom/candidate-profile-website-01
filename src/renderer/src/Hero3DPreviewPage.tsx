import { ArrowRight, Mail } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import Hero3DScene from "./Hero3DScene";
import type { Hero3DMetrics } from "./Hero3DScene";
import "./hero-3d-preview.css";

const initialMetrics: Hero3DMetrics = {
  loadTimeMs: null,
  averageFps: null,
  renderedTriangles: 0,
  pixelRatio: 1
};

export default function Hero3DPreviewPage(): JSX.Element {
  const sceneHostRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [metrics, setMetrics] = useState<Hero3DMetrics>(initialMetrics);

  useEffect(() => {
    const host = sceneHostRef.current;
    if (!host) return;

    const scene = new Hero3DScene(host, {
      onProgress: setProgress,
      onReady: (nextMetrics) => {
        setMetrics(nextMetrics);
        setReady(true);
      },
      onMetrics: setMetrics,
      onError: setError
    });

    return () => scene.dispose();
  }, []);

  return (
    <main className={`hero3d-preview${ready ? " is-ready" : ""}${error ? " has-error" : ""}`}>
      <div ref={sceneHostRef} className="hero3d-scene" aria-hidden="true" />
      <div className="hero3d-wordmark" aria-hidden="true">
        YUANBO ZHANG
      </div>
      <div className="hero3d-scanlines" aria-hidden="true" />

      <section className="hero3d-copy hero3d-copy--identity" aria-labelledby="hero3d-title">
        <h1 id="hero3d-title">张远博</h1>
        <span className="hero3d-copy-rule" aria-hidden="true" />
        <p><strong>AI</strong> 应用开发 / FDE / AI 工作流落地</p>
      </section>

      <section className="hero3d-copy hero3d-copy--statement" aria-label="个人定位">
        <span className="hero3d-copy-rule" aria-hidden="true" />
        <p>把 <strong>AI</strong> 接入真实业务，做成可运行、可验证、可交付的系统。</p>
      </section>

      <nav className="hero3d-actions" aria-label="首屏操作">
        <a className="hero3d-action hero3d-action--primary" href="/resume#resume-project-archive">
          <span>查看项目</span>
          <ArrowRight size={17} aria-hidden="true" />
        </a>
        <a className="hero3d-action hero3d-action--secondary" href="/resume#resume-contact">
          <Mail size={16} aria-hidden="true" />
          <span>联系我</span>
        </a>
      </nav>

      {!ready && !error ? (
        <div className="hero3d-loading" role="status" aria-live="polite">
          <span>正在载入真实模型</span>
          <i style={{ transform: `scaleX(${Math.max(0.04, progress)})` }} />
          <b>{Math.round(progress * 100)}%</b>
        </div>
      ) : null}

      {error ? (
        <div className="hero3d-error" role="alert">
          模型加载失败：{error}
        </div>
      ) : null}

      <output className="hero3d-metrics" aria-label="3D 性能数据">
        {metrics.loadTimeMs !== null ? `${(metrics.loadTimeMs / 1000).toFixed(2)}s` : "--"}
        <span aria-hidden="true">/</span>
        {metrics.averageFps !== null ? `${Math.round(metrics.averageFps)}fps` : "--fps"}
      </output>
    </main>
  );
}
