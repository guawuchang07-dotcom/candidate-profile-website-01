import { useEffect, useRef, useState } from "react";
import type { CSSProperties, MouseEvent as ReactMouseEvent } from "react";
// @ts-expect-error -- PixelBlast is copied from react-bits as a plain JSX module.
import PixelBlast from "./PixelBlast";
// @ts-expect-error -- Magnet is copied from react-bits as a plain JSX module.
import Magnet from "./Magnet";
// @ts-expect-error -- LogoLoop is a local JSX marquee component.
import LogoLoop from "./LogoLoop";
import PixelFlipCard from "./PixelFlipCard";
import ScrambledText from "./ScrambledText";
import Section2Ambient from "./Section2Ambient";
import idPortraitFrontAsset from "./assets/static/media/hero/id-card-before.webp";
import idProfileBackAsset from "./assets/static/media/hero/id-card-after.webp";
import section2CityBgAsset from "./assets/static/media/section2-city-bg.png";

type CssVars = CSSProperties & Record<`--${string}`, string>;

type Capability = {
  id: string;
  label: string;
  hint: string;
  summary?: string;
  workflow?: string[];
  details?: Array<{
    title: string;
    items: string[];
  }>;
  tags?: string[];
  proof?: string;
  outcome?: string;
  color: string;
  angle: number; // degree, 0 = right, 90 = bottom (CSS-style)
};

type TimelineItem = {
  year: string;
  title: string;
  note: string;
};

const CAPABILITIES: Capability[] = [
  {
    id: "biz",
    label: "业务拆解",
    hint: "把模糊需求拆成可执行节点",
    summary: "把模糊需求拆成可执行、可确认、可复盘的流程",
    workflow: ["场景识别", "规则定义", "人工边界", "状态记录"],
    tags: ["流程拆解", "交付边界", "复盘沉淀"],
    proof: "多个项目共用方法",
    color: "#7DD3FC",
    angle: 270
  },
  {
    id: "agent",
    label: "多智能体编排",
    hint: "Claude / Codex / OpenClaw 接力",
    summary: "按任务拆分检索、写作、校验和整理环节",
    workflow: ["任务拆分", "工具调用", "结果校验", "失败兜底"],
    tags: ["Agent 流程", "工具调用", "人工确认"],
    proof: "内容运营工作台生成链路",
    color: "#A78BFA",
    angle: 315
  },
  {
    id: "visual",
    label: "电商视觉工作流",
    hint: "按平台、风格、尺寸批量出图",
    summary: "从参考素材到成套主图、短视频素材和图生视频版本",
    workflow: ["平台调性", "服装类型", "风格设定", "批量主图", "人工复核", "图生视频"],
    details: [
      { title: "主图生产", items: ["参考图", "风格设定", "批量生成"] },
      { title: "视频转化", items: ["图生视频", "宣传短片", "版本筛选"] },
      { title: "复核返工", items: ["人工审核", "尺寸适配", "可复盘记录"] }
    ],
    tags: ["多平台主图", "宣传视频素材", "SKU 视觉版本", "返工记录"],
    proof: "服装电商视觉项目",
    outcome: "把主图、视频和返工记录，沉淀成可复盘的 SKU 视觉交付链路。",
    color: "#67E8F9",
    angle: 0
  },
  {
    id: "video",
    label: "宣传视频生成",
    hint: "主图直出短视频与动作迁移",
    summary: "围绕产品卖点生成短视频素材和图生视频版本",
    workflow: ["卖点提炼", "画面生成", "视频转化", "版本筛选"],
    tags: ["图生视频", "短视频素材", "人工筛选"],
    proof: "电商宣传视频",
    color: "#C4B5FD",
    angle: 45
  },
  {
    id: "drama",
    label: "AI 视频统筹",
    hint: "脚本 · 分镜 · 镜头 · 质检",
    summary: "把脚本、分镜、生成、剪辑和质检串成生产链路",
    workflow: ["脚本拆解", "分镜规划", "生成调度", "剪辑质检"],
    tags: ["长内容生产", "镜头管理", "成片交付"],
    proof: "120min AI 漫剧项目",
    color: "#F0ABFC",
    angle: 90
  },
  {
    id: "auto",
    label: "自动化脚本",
    hint: "重复流程交给脚本无人值守",
    summary: "把重复网页操作和信息整理变成可审核脚本流程",
    workflow: ["网页动作", "数据整理", "脚本执行", "人工确认"],
    tags: ["运营提效", "批量处理", "低风险自动化"],
    proof: "运营 / BOSS / 信息整理脚本",
    color: "#93C5FD",
    angle: 135
  },
  {
    id: "contentOps",
    label: "内容运营工作流",
    hint: "选题到多平台审核包",
    summary: "把选题、资料、联网证据、Agent / 脚本执行和人工审核串成内容包",
    workflow: ["选题输入", "任务拆分", "私有资料", "联网证据", "多平台草稿", "人工审核", "历史沉淀"],
    details: [
      { title: "输出内容包", items: ["公众号长文", "小红书图文", "抖音图文", "X / Twitter 短帖"] },
      { title: "资料来源", items: ["私有资料库", "Obsidian", "历史成文", "联网搜索"] },
      { title: "审核边界", items: ["引用证据", "平台语气", "人工确认", "发布前审核包"] }
    ],
    tags: ["Research Bundle", "Agent 流程", "Obsidian 同步", "发布审核包"],
    proof: "AI 自媒体运营工作台",
    outcome: "把一次写文，变成可检索、可审核、可沉淀的内容资产流程。",
    color: "#8B5CF6",
    angle: 180
  },
  {
    id: "kb",
    label: "知识库沉淀",
    hint: "Obsidian + Claude 持续沉淀",
    summary: "把资料、历史成文和复盘记录变成长期可复用资产",
    workflow: ["资料入库", "历史成文", "Obsidian", "复盘复用"],
    tags: ["私有资料库", "长期记忆", "内容资产"],
    proof: "Obsidian 同步 / 私有资料库",
    color: "#22D3EE",
    angle: 225
  }
];

const ORDER_BY_ANGLE = CAPABILITIES
  .map((cap, originalIdx) => ({ ...cap, originalIdx }))
  .sort((a, b) => {
    const normA = (a.angle - 270 + 360) % 360;
    const normB = (b.angle - 270 + 360) % 360;
    return normA - normB;
  });

const IDENTITY_LINES = [
  "真实业务流程拆解",
  "Agent / 脚本落地执行",
  "内容与知识资产沉淀"
];

const TOOL_STACK = [
  "Codex",
  "Cursor",
  "Hermes",
  "Obsidian",
  "即梦",
  "Seedance",
  "Vidu",
  "Sora",
  "剪映/CapCut",
  "Dify/Coze",
  "飞书",
  "浏览器自动化",
  "Prompt/分镜",
  "成片QC",
  "数据复盘",
  "Markdown/Python"
];

const TOOL_LOGOS = TOOL_STACK.map((tool) => ({
  title: tool,
  node: <span className="cap-stack-tool-chip">{tool}</span>
}));

const CAPABILITY_DISPLAY_ORDER = ["biz", "auto", "visual", "contentOps", "drama", "kb"];
const DISPLAY_CAPABILITIES = CAPABILITY_DISPLAY_ORDER
  .map((id) => CAPABILITIES.find((cap) => cap.id === id))
  .filter((cap): cap is Capability => Boolean(cap));

const TIMELINE_ITEMS: TimelineItem[] = [
  {
    year: "2025.07–2025.10",
    title: "杭州牧直科技有限公司 · AIGC 漫剧导演",
    note: "《妻子改嫁后我成了一宗之主》120 分钟、7 天交付、约 2 万元独家售出"
  },
  {
    year: "2025.10–2026.03",
    title: "杭州尚同传媒有限公司 · AI 导演",
    note: "多部 120min 级 AI 漫剧交付"
  },
  {
    year: "2026.05–至今",
    title: "AI 落地项目 / MVP",
    note: "电商视觉工作流、AIGC 控制台、自动化脚本、知识沉淀 Agent"
  }
];

type CoreCapabilityStackProps = {
  sharedBackdrop?: boolean;
};

function positionOnOval(angle: number): { left: string; top: string } {
  const rad = (angle * Math.PI) / 180;
  const left = 50 + 40 * Math.cos(rad);
  const top = 50 + 27 * Math.sin(rad);
  return {
    left: `${left}%`,
    top: `${top}%`
  };
}

function getCapabilityTier(cap: Capability): string {
  if (cap.id === "contentOps") return " is-bento-feature is-bento-content";
  if (cap.id === "visual") return " is-bento-feature is-bento-visual";
  return " is-bento-standard";
}

function resetCapabilityCardMotion(card: HTMLElement): void {
  card.style.setProperty("--glow-intensity", "0");
  card.style.setProperty("--tilt-x", "0deg");
  card.style.setProperty("--tilt-y", "0deg");
  card.style.setProperty("--lift-x", "0px");
  card.style.setProperty("--lift-y", "0px");
}

export default function CoreCapabilityStack({ sharedBackdrop = false }: CoreCapabilityStackProps): JSX.Element {
  const sectionRef = useRef<HTMLElement | null>(null);
  const capabilityGridRef = useRef<HTMLDivElement | null>(null);
  const isPillHoveredRef = useRef(false);
  const [visible, setVisible] = useState(false);
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    if (!sectionRef.current) return;
    const node = sectionRef.current;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting && e.boundingClientRect.top <= window.innerHeight * 0.55) {
            setVisible(true);
            io.disconnect();
            break;
          }
        }
      },
      { threshold: [0, 0.08, 0.16, 0.24] }
    );
    io.observe(node);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!sectionRef.current) return;
    const section = sectionRef.current;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const narrow = window.matchMedia("(max-width: 767px)").matches;
    const coarse = window.matchMedia("(pointer: coarse)").matches;
    if (reduce || narrow || coarse) return;

    let angle = 0;
    let scrollKick = 0;
    let lastScrollY = window.scrollY;
    let rafId: number | null = null;

    const idleVelocity = 0.075;
    const maxKick = 0.45;
    const kickPerPx = 0.0018;
    const decay = 0.93;

    const onScroll = () => {
      const dy = window.scrollY - lastScrollY;
      lastScrollY = window.scrollY;
      scrollKick += dy * kickPerPx;
      if (scrollKick > maxKick) scrollKick = maxKick;
      if (scrollKick < -maxKick) scrollKick = -maxKick;
    };

    const tick = () => {
      const effectiveIdle = isPillHoveredRef.current ? 0 : idleVelocity;
      const velocity = effectiveIdle + scrollKick;
      angle = (angle + velocity) % 360;
      const pillEls = section.querySelectorAll<HTMLElement>(".cap-stack-pill-magnet");
      pillEls.forEach((el) => {
        const baseStr = el.getAttribute("data-base-angle");
        if (baseStr === null) return;
        const base = parseFloat(baseStr);
        const a = ((base + angle) * Math.PI) / 180;
        const left = 50 + 40 * Math.cos(a);
        const top = 50 + 27 * Math.sin(a);
        el.style.left = `${left.toFixed(3)}%`;
        el.style.top = `${top.toFixed(3)}%`;
      });
      scrollKick *= decay;
      if (Math.abs(scrollKick) < 0.0005) scrollKick = 0;
      rafId = requestAnimationFrame(tick);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    rafId = requestAnimationFrame(tick);

    return () => {
      if (rafId !== null) cancelAnimationFrame(rafId);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  const handleCapabilityGridMouseMove = (event: ReactMouseEvent<HTMLDivElement>): void => {
    const grid = event.currentTarget;
    const rect = grid.getBoundingClientRect();
    grid.style.setProperty("--bento-x", `${event.clientX - rect.left}px`);
    grid.style.setProperty("--bento-y", `${event.clientY - rect.top}px`);
    grid.style.setProperty("--bento-spotlight-opacity", "0.78");
  };

  const handleCapabilityGridMouseLeave = (event: ReactMouseEvent<HTMLDivElement>): void => {
    const grid = event.currentTarget;
    grid.style.setProperty("--bento-spotlight-opacity", "0");
    grid.querySelectorAll<HTMLElement>(".cap-stack-capability-card").forEach(resetCapabilityCardMotion);
  };

  const handleCapabilityCardMouseMove = (event: ReactMouseEvent<HTMLElement>): void => {
    const card = event.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -2.8;
    const rotateY = ((x - centerX) / centerX) * 2.8;
    const liftX = ((x - centerX) / centerX) * 3;
    const liftY = ((y - centerY) / centerY) * 3;

    card.style.setProperty("--glow-x", `${(x / rect.width) * 100}%`);
    card.style.setProperty("--glow-y", `${(y / rect.height) * 100}%`);
    card.style.setProperty("--glow-intensity", "1");
    card.style.setProperty("--tilt-x", `${rotateX.toFixed(2)}deg`);
    card.style.setProperty("--tilt-y", `${rotateY.toFixed(2)}deg`);
    card.style.setProperty("--lift-x", `${liftX.toFixed(2)}px`);
    card.style.setProperty("--lift-y", `${liftY.toFixed(2)}px`);
  };

  const handleCapabilityCardLeave = (event: ReactMouseEvent<HTMLElement>): void => {
    resetCapabilityCardMotion(event.currentTarget);
  };

  return (
    <section
      ref={sectionRef}
      className={`cap-stack-section${visible ? " is-in" : ""}${sharedBackdrop ? " has-shared-backdrop" : ""}`}
      id="resume-core-stack"
      aria-labelledby="cap-stack-title"
    >
      {sharedBackdrop ? (
        <Section2Ambient />
      ) : (
        <>
          <div
            className="cap-stack-section-bg"
            style={{ backgroundImage: `url(${section2CityBgAsset})` }}
            aria-hidden="true"
          />
          <Section2Ambient />
          <div className="cap-stack-pixelblast" aria-hidden="true">
            <PixelBlast
              variant="circle"
              pixelSize={5}
              color="#9b5cff"
              patternScale={4}
              patternDensity={0.55}
              pixelSizeJitter={0.15}
              enableRipples={true}
              rippleSpeed={0.3}
              rippleThickness={0.08}
              rippleIntensityScale={0.8}
              liquid={true}
              liquidStrength={0.05}
              liquidRadius={1}
              liquidWobbleSpeed={3.5}
              speed={0.22}
              edgeFade={0.32}
              transparent={true}
              autoPauseOffscreen={true}
            />
          </div>
          <span className="cap-stack-bg-grid" aria-hidden="true" />
        </>
      )}
      <span className="cap-hud cap-hud-tl" aria-hidden="true" />
      <span className="cap-hud cap-hud-tr" aria-hidden="true" />
      <span className="cap-hud cap-hud-bl" aria-hidden="true" />
      <span className="cap-hud cap-hud-br" aria-hidden="true" />

      <div className="cap-stack-shell">
        <div className="cap-stack-kicker" aria-hidden="true">
          <span className="cap-stack-kicker-index">02</span>
          <span className="cap-stack-kicker-rule" />
          <span className="cap-stack-kicker-label">ABOUT / CORE STACK</span>
        </div>

        <div className="cap-stack-chapter">
          <section className="cap-stack-intro" aria-labelledby="cap-stack-title">
            <div className="cap-stack-intro-copy">
              <p className="cap-stack-eyebrow">ABOUT</p>
              <h2 className="cap-stack-heading" id="cap-stack-title">
                <span className="cap-stack-heading-line cap-stack-heading-line-one">把 AI 工具</span>
                <span className="cap-stack-heading-line cap-stack-heading-line-two">
                  嵌入<span className="cap-stack-heading-accent">真实业务流程</span>
                </span>
              </h2>

              <div className="cap-stack-toolbar" aria-label="技能工具">
                <span className="cap-stack-toolbar-label" aria-hidden="true">→ 技能工具</span>
                <div className="cap-stack-toolbar-loop">
                  <LogoLoop
                    logos={TOOL_LOGOS}
                    direction="left"
                    speed={36}
                    gap={0}
                    fadeOut
                    fadeOutColor="#050B1A"
                    hoverSpeed={0}
                  />
                </div>
              </div>

              <div className="cap-stack-intro-body">
                <div className="cap-stack-prose">
                  <p className="cap-stack-lede cap-stack-prose-line-lede">
                    <span className="cap-stack-dropcap">我</span>
                    <ScrambledText
                      className="cap-stack-lede-text cap-stack-scrambled"
                      radius={88}
                      verticalRadius={14}
                      duration={0.92}
                      speed={0.42}
                      scrambleChars=".:_01"
                    >
                      的优势不是单纯展示 AI 工具，而是把真实、重复的业务拆成需求判断、资料检索、上下文组织、Agent / 脚本执行、人工确认、状态记录与复盘沉淀。对我来说，AI 不是一次性生成答案，而是进入业务流程后，持续产生可审核、可复用、可迭代结果的工作系统。
                    </ScrambledText>
                  </p>
                  <p className="cap-stack-para cap-stack-prose-line cap-stack-prose-line-para">
                    <ScrambledText
                      className="cap-stack-scrambled"
                      radius={76}
                      verticalRadius={13}
                      duration={0.78}
                      speed={0.38}
                      scrambleChars=".:_01"
                    >
                      我从内容运营和剪辑起步，完整参与过 AI 漫剧、服装电商视觉、自媒体运营工作台和自动化脚本等项目。现在更关注如何把私有资料库、Obsidian、联网证据、多平台内容生成和人工审核节点串起来，让内容生产、视觉生成和运营提效不只是 Demo，而是能被真实使用和持续优化的交付流程。
                    </ScrambledText>
                  </p>
                  <ul className="cap-stack-identity-list" aria-label="身份短句">
                    {IDENTITY_LINES.map((line) => (
                      <li className="cap-stack-identity-item" key={line}>{line}</li>
                    ))}
                  </ul>
                </div>

                <div className="cap-stack-idcard">
                  <PixelFlipCard
                    frontSrc={idPortraitFrontAsset}
                    backSrc={idProfileBackAsset}
                    frontAlt="张远博 形象照"
                    backAlt="张远博 详细档案卡"
                    gridSize={12}
                    pixelColor="#15F7FF"
                    stepDuration={0.45}
                  />
                  <span className="cap-stack-idcard-hint" aria-hidden="true">点击查看完整档案</span>
                </div>
              </div>
            </div>

            <div className="cap-stack-stage" aria-hidden="true">
              <div className="cap-stack-orbit">
                <svg viewBox="0 0 1000 540" preserveAspectRatio="none">
                  <ellipse
                    className="cap-stack-orbit-ring cap-stack-orbit-ring-outer"
                    cx="500"
                    cy="270"
                    rx="400"
                    ry="146"
                    fill="none"
                    stroke="rgba(150, 200, 255, 0.16)"
                    strokeWidth="1.2"
                    strokeDasharray="5 10"
                  />
                  <ellipse
                    className="cap-stack-orbit-ring cap-stack-orbit-ring-inner"
                    cx="500"
                    cy="270"
                    rx="248"
                    ry="92"
                    fill="none"
                    stroke="rgba(155, 92, 255, 0.12)"
                    strokeWidth="1"
                    strokeDasharray="2 16"
                  />
                </svg>
              </div>

              <div className="cap-stack-orbit-core" aria-hidden="true">
                <span className="cap-stack-orbit-core-label">真实业务流程</span>
              </div>

              <div className="cap-stack-pills" role="presentation">
                {CAPABILITIES.map((cap) => {
                  const pos = positionOnOval(cap.angle);
                  const isActive = activeId === cap.id;
                  const isDimmed = activeId !== null && !isActive;
                  const introIndex = ORDER_BY_ANGLE.findIndex((orderedCap) => orderedCap.id === cap.id);

                  return (
                    <Magnet
                      key={cap.id}
                      padding={34}
                      magnetStrength={0.9}
                      activeTransition="transform 0.22s cubic-bezier(0.2, 0.8, 0.2, 1)"
                      inactiveTransition="transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)"
                      wrapperClassName="cap-stack-pill-magnet"
                      data-base-angle={cap.angle}
                      style={{ left: pos.left, top: pos.top }}
                    >
                      <span
                        className={`cap-stack-pill${isActive ? " is-active" : ""}${isDimmed ? " is-dim" : ""}`}
                        style={
                          {
                            "--cap-color": cap.color,
                            "--cap-delay": `${1.36 + introIndex * 0.06}s`
                          } as CssVars
                        }
                        onMouseEnter={() => {
                          setActiveId(cap.id);
                          isPillHoveredRef.current = true;
                        }}
                        onMouseLeave={() => {
                          setActiveId(null);
                          isPillHoveredRef.current = false;
                        }}
                      >
                        <span className="cap-stack-pill-label">{cap.label}</span>
                      </span>
                    </Magnet>
                  );
                })}
              </div>
            </div>
          </section>

          <section className="cap-stack-capabilities" aria-labelledby="cap-stack-capability-title">
            <div className="cap-stack-block-head">
              <p className="cap-stack-eyebrow">CORE CAPABILITIES</p>
              <h3 id="cap-stack-capability-title">核心能力</h3>
            </div>
            <div
              className="cap-stack-capability-grid cap-stack-magic-bento"
              ref={capabilityGridRef}
              role="list"
              onMouseMove={handleCapabilityGridMouseMove}
              onMouseLeave={handleCapabilityGridMouseLeave}
            >
              {DISPLAY_CAPABILITIES.map((cap) => (
                <article
                  key={cap.id}
                  className={`cap-stack-capability-card${getCapabilityTier(cap)}`}
                  style={{ "--cap-color": cap.color } as CssVars}
                  role="listitem"
                  tabIndex={0}
                  onMouseMove={handleCapabilityCardMouseMove}
                  onMouseLeave={handleCapabilityCardLeave}
                  onBlur={(event) => resetCapabilityCardMotion(event.currentTarget)}
                >
                  <span className="cap-stack-card-label">CAPABILITY / {cap.id.toUpperCase()}</span>
                  <h4>{cap.label}</h4>
                  <p className="cap-stack-capability-summary">{cap.summary ?? cap.hint}</p>
                  {cap.workflow ? (
                    <div className="cap-stack-workflow-chain" aria-label={`${cap.label}流程节点`}>
                      {cap.workflow.map((step) => (
                        <span key={step}>{step}</span>
                      ))}
                    </div>
                  ) : null}
                  {cap.details ? (
                    <div className="cap-stack-card-detail-grid">
                      {cap.details.map((group) => (
                        <div className="cap-stack-card-detail-group" key={group.title}>
                          <span className="cap-stack-card-detail-title">{group.title}</span>
                          <div className="cap-stack-card-detail-items">
                            {group.items.map((item) => (
                              <span key={item}>{item}</span>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : null}
                  {cap.tags ? (
                    <div className="cap-stack-result-tags" aria-label={`${cap.label}结果标签`}>
                      {cap.tags.map((tag) => (
                        <span key={tag}>{tag}</span>
                      ))}
                    </div>
                  ) : null}
                  {cap.proof ? (
                    <p className="cap-stack-card-proof">
                      <span>证明项目</span>
                      <strong>{cap.proof}</strong>
                    </p>
                  ) : null}
                  {cap.outcome ? (
                    <p className="cap-stack-card-outcome">{cap.outcome}</p>
                  ) : null}
                </article>
              ))}
            </div>
          </section>

          <section className="cap-stack-timeline" aria-labelledby="cap-stack-timeline-title">
            <div className="cap-stack-block-head">
              <p className="cap-stack-eyebrow">EVOLUTION TIMELINE</p>
              <h3 id="cap-stack-timeline-title">经历时间线</h3>
            </div>
            <div className="cap-stack-timeline-list">
              {TIMELINE_ITEMS.map((item) => (
                <article className="cap-stack-timeline-item" key={`${item.year}-${item.title}`}>
                  <time>{item.year}</time>
                  <div>
                    <h4>{item.title}</h4>
                    <p>{item.note}</p>
                  </div>
                </article>
              ))}
            </div>
          </section>
        </div>
      </div>
    </section>
  );
}
