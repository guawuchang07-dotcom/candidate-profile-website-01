import { useEffect, useRef, useState } from "react";
import type { CSSProperties, MouseEvent as ReactMouseEvent } from "react";
// @ts-expect-error -- PixelBlast is copied from react-bits as a plain JSX module.
import PixelBlast from "./PixelBlast";
// @ts-expect-error -- Magnet is copied from react-bits as a plain JSX module.
import Magnet from "./Magnet";
// @ts-expect-error -- LogoLoop is a local JSX marquee component.
import LogoLoop from "./LogoLoop";
import ScrambledText from "./ScrambledText";
import Section2Ambient from "./Section2Ambient";
import aboutCharacterMp4Asset from "./assets/static/media/hero/about-character-loop-person.mp4";
import aboutCharacterPosterAsset from "./assets/static/media/hero/about-character-poster-person.png";
import aboutCharacterWebmAsset from "./assets/static/media/hero/about-character-loop-person.webm";
import section2CityBgAsset from "./assets/static/media/section2-city-bg.png";

type CssVars = CSSProperties & Record<`--${string}`, string>;

type Capability = {
  id: string;
  label: string;
  orbitLabel?: string;
  eyebrow?: string;
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
  trackLabel: string;
  trackTone: "director" | "application";
  keywords: string[];
};

type ProjectMatrixItem = {
  name: string;
  type: string;
  role: string;
  result: string;
};

type ProjectMatrixGroup = {
  eyebrow: string;
  title: string;
  items: ProjectMatrixItem[];
};

const CAPABILITIES: Capability[] = [
  {
    id: "biz",
    label: "AI 漫剧导演",
    orbitLabel: "AI 漫剧导演",
    eyebrow: "AI VIDEO PRODUCTION",
    hint: "从剧本拆解到成片交付的 AI 漫剧导演流程",
    summary: "结合 AI 漫剧项目经验，完成小说/剧本分析、角色与场景设定、分镜设计、提示词迭代、画面生成、镜头衔接和后期交付",
    workflow: ["剧本拆解", "角色设定", "分镜设计", "画面生成", "镜头衔接", "成片交付"],
    tags: ["AI 漫剧", "分镜统筹", "提示词迭代"],
    proof: "AI 漫剧项目 / 120 分钟级成片交付",
    outcome: "多部 120 分钟级 AI 漫剧交付，其中一部 7 天完成并实现约 2 万元独家售出。",
    color: "#7DD3FC",
    angle: 270
  },
  {
    id: "agent",
    label: "MCP 多 Agent 服务集群",
    orbitLabel: "MCP 服务集群",
    eyebrow: "INFRASTRUCTURE / MCP",
    hint: "统一模型、RAG、记忆与提示词服务",
    summary: "通过 MCP 网关向多个项目提供统一认证、配额、路由和公共 AI 能力",
    workflow: ["认证与配额", "模型路由", "RAG 隔离", "双层记忆", "Prompt 模板"],
    tags: ["Streamable HTTP", "项目隔离", "共享记忆"],
    proof: "MCP 多 Agent 共享服务集群",
    color: "#A78BFA",
    angle: 315
  },
  {
    id: "visual",
    label: "电商视觉工作流",
    orbitLabel: "服装电商视觉",
    eyebrow: "WORKFLOW / VISUAL",
    hint: "服装 SKU 从参考图到可投放素材",
    summary: "围绕平台规格和 SKU 视觉版本，批量生成主图与图生视频，再经过人工复核和素材沉淀",
    workflow: ["服装参考图", "平台规格", "风格配置", "批量主图", "人工复核", "图生视频"],
    details: [
      { title: "输入配置", items: ["服装参考图", "平台规格", "风格参数"] },
      { title: "视觉产出", items: ["SKU 主图", "图生视频", "宣传短片"] },
      { title: "交付闭环", items: ["人工复核", "版本筛选", "素材沉淀"] }
    ],
    tags: ["主图生产", "SKU 视觉版本", "图生视频", "素材沉淀"],
    proof: "服装平台视觉生图自动化 / 素材中心多模态检索",
    outcome: "把一次生图扩展成可筛选、可复核、可复用的服装视觉资产链路。",
    color: "#67E8F9",
    angle: 0
  },
  {
    id: "video",
    label: "宣传视频生成",
    orbitLabel: "宣传视频生成",
    eyebrow: "PIPELINE / VIDEO",
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
    label: "AI 直播切片 Agent",
    orbitLabel: "直播切片 Agent",
    eyebrow: "PIPELINE / VIDEO",
    hint: "直播回放自动找高光并切成可复用片段",
    summary: "围绕直播回放完成 ASR 分块、高光分析、精准裁切和结果回写，形成可持续运行的内容自动化链路",
    workflow: ["视频上传", "ASR 分块", "LLM 高光分析", "精准裁切", "数据回写"],
    tags: ["FFmpeg.wasm", "SSE 进度", "直播切片", "素材回写"],
    proof: "AI 直播切片 Agent",
    color: "#F0ABFC",
    angle: 90
  },
  {
    id: "auto",
    label: "Agent 与自动化编排",
    orbitLabel: "Agent / 自动化",
    eyebrow: "AUTOMATION / OPS",
    hint: "让 Agent、工具和任务状态可回溯",
    summary: "把多 Agent、浏览器自动化和长任务串成可恢复的执行链路，记录状态、成本与失败分支",
    workflow: ["任务拆解", "SubGraph 编排", "工具调用", "状态持久化", "失败兜底"],
    tags: ["LangGraph", "Checkpointer", "动态路由", "SSE 进度"],
    proof: "直播切片 Agent / 自媒体内容运营 / MCP 服务集群",
    color: "#93C5FD",
    angle: 135
  },
  {
    id: "contentOps",
    label: "内容运营工作流",
    orbitLabel: "自媒体运营",
    eyebrow: "WORKFLOW / CONTENT",
    hint: "多 Agent 内容生产与成本控制",
    summary: "用 LangGraph 把选题、写作、配图/视频和审核串成可回滚的内容包，并追踪模型成本与动态路由",
    workflow: ["选题输入", "SubGraph 编排", "资料与证据", "多平台草稿", "人工审核"],
    tags: ["LangGraph", "Checkpointer", "成本追踪", "多平台草稿"],
    proof: "自媒体智能内容运营 Agent / 自媒体运营自动化",
    outcome: "同一份选题可生成多平台版本，过程可回滚、成本可核算、发布前有人审。",
    color: "#8B5CF6",
    angle: 180
  },
  {
    id: "kb",
    label: "数据中台与知识底座",
    orbitLabel: "数据治理 / RAG",
    eyebrow: "PLATFORM / DATA",
    hint: "原始聊天数据经过治理后流向多个 AI 应用",
    summary: "以微信 SQLite 只读库为入口，经 ETL、9 级脱敏和对话块清洗，统一供给 RAG、素材中心、销售考核与微调",
    workflow: ["微信原始库", "ETL 暂存区", "脱敏清洗", "人工审核", "RAG / 微调 / 考核"],
    details: [
      { title: "入口与工作台", items: ["微信 SQLite 只读", "ETL 暂存区", "PostgreSQL 工作台"] },
      { title: "治理与知识", items: ["9 级脱敏", "5 分钟对话块", "knowledge_chunks / articles"] },
      { title: "下游供给", items: ["实时语音客服 / RAG", "素材中心 / 销售考核", "SFT / DPO 微调数据"] }
    ],
    tags: ["DataFilter", "RAG 知识库", "多格式导出", "MCP 服务集群"],
    proof: "AI 数据中台 / 微信数据导入 / 素材中心 / 销售考核 / 模型微调",
    outcome: "同一份高质量数据资产，按权限和用途分流到客服、知识检索、考核与模型调优。",
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
  "数据与业务：场景建模 / 字段治理 / 状态设计",
  "Agent 与自动化：工具编排 / 任务恢复 / 失败兜底",
  "内容与交付：多模态生成 / 人工复核 / 素材沉淀"
];

const PROCESS_FLOW = ["业务目标", "数据治理", "Agent 执行", "人工验收", "结果沉淀"];

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

const ABOUT_CHARACTER_TOOLS = [
  { label: "Codex", glyph: "◎", tone: "cyan", angle: "-16deg", delay: "0.08s" },
  { label: "Claude", glyph: "✳", tone: "orange", angle: "-8deg", delay: "0.16s" },
  { label: "Code", glyph: "</>", tone: "blue", angle: "0deg", delay: "0.24s" },
  { label: "豆包", glyph: "◌", tone: "ice", angle: "8deg", delay: "0.32s" },
  { label: "Gemini", glyph: "✦", tone: "violet", angle: "16deg", delay: "0.4s" }
];

const CAPABILITY_DISPLAY_ORDER = ["biz", "auto", "visual", "contentOps", "drama", "kb"];
const DISPLAY_CAPABILITIES = CAPABILITY_DISPLAY_ORDER
  .map((id) => CAPABILITIES.find((cap) => cap.id === id))
  .filter((cap): cap is Capability => Boolean(cap));

const TIMELINE_ITEMS: TimelineItem[] = [
  {
    year: "2025.05–2026.03",
    title: "尚同传媒 · AI 导演",
    note: "负责 AI 漫剧与 AI 视频项目的创意设定、分镜统筹、画面生成、镜头衔接和成片交付",
    trackLabel: "DIRECTOR TRACK",
    trackTone: "director",
    keywords: ["剧本拆解", "分镜统筹", "成片交付"]
  },
  {
    year: "2026.06–至今",
    title: "自由职业 · AI 应用开发 / FDE",
    note: "围绕数据中台、知识库、Agent 工作流、服装电商视觉和自媒体运营自动化推进 AI 应用落地",
    trackLabel: "APPLICATION / FDE TRACK",
    trackTone: "application",
    keywords: ["数据治理", "Agent 编排", "业务落地"]
  }
];

const PROJECT_MATRIX_GROUPS: ProjectMatrixGroup[] = [
  {
    eyebrow: "DATA / KNOWLEDGE BASE",
    title: "数据与知识底座",
    items: [
      {
        name: "数据中台",
        type: "平台型项目",
        role: "流程与原型搭建",
        result: "数据治理 / 知识库 / 业务模块"
      },
      {
        name: "微信数据导入 / 数据备份",
        type: "数据接入项目",
        role: "脚本与字段整理",
        result: "导入、备份、状态记录"
      },
      {
        name: "RAG / 知识库",
        type: "基础设施",
        role: "知识结构与检索流程",
        result: "私有资料 / 复盘链接 / 可复用上下文"
      }
    ]
  },
  {
    eyebrow: "AI / OPERATIONS",
    title: "AI 生产与运营应用",
    items: [
      {
        name: "AI 销售考核",
        type: "数据中台业务模块",
        role: "需求拆解与流程设计",
        result: "指标整理 / 状态追踪 / 复盘"
      },
      {
        name: "AI 素材中心",
        type: "数据中台业务模块",
        role: "模块原型与资产整理",
        result: "素材管理 / 版本记录 / 调用"
      },
      {
        name: "Agent 集群",
        type: "能力方案",
        role: "架构设计与验证",
        result: "提示词架构 / 任务编排 / 工具调用"
      },
      {
        name: "自媒体运营工作台 / 自动化",
        type: "业务应用与自动化",
        role: "产品原型与脚本执行",
        result: "资料检索 / 多平台内容 / 发布审核"
      }
    ]
  },
  {
    eyebrow: "BUSINESS APPLICATIONS",
    title: "业务场景项目",
    items: [
      {
        name: "服装平台视觉生图",
        type: "业务应用",
        role: "视觉工作流与交付",
        result: "服装主图 / 宣传视频 / 人工复核"
      },
      {
        name: "AI 直播切片 Agent",
        type: "内容自动化",
        role: "ASR 与高光裁切",
        result: "直播分析 / 精准裁切 / 素材回写"
      }
    ]
  },
  {
    eyebrow: "AI CREATIVE PRODUCTION",
    title: "AI 漫剧制作",
    items: [
      {
        name: "AI 漫剧 / 视频生产",
        type: "内容生产",
        role: "AI 导演与生产统筹",
        result: "小说分析 / 角色资产 / 视频任务"
      },
      {
        name: "AI 漫剧长内容交付",
        type: "导演流程",
        role: "分镜统筹与成片 QC",
        result: "120 分钟级 / 7 天交付 / 成片验收"
      }
    ]
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
  if (cap.id === "contentOps") return " is-bento-standard is-bento-content-compact";
  if (cap.id === "visual") return " is-bento-feature is-bento-visual";
  if (cap.id === "kb") return " is-bento-feature is-bento-platform";
  if (cap.id === "biz") return " is-bento-standard is-bento-biz";
  if (cap.id === "auto") return " is-bento-standard is-bento-auto";
  if (cap.id === "drama") return " is-bento-standard is-bento-drama";
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
  const [aboutVideoReady, setAboutVideoReady] = useState(false);
  const [aboutDecorVisible, setAboutDecorVisible] = useState(false);
  const aboutVideoRef = useRef<HTMLVideoElement | null>(null);
  const aboutDecorCycleRef = useRef(false);
  const aboutLastTimeRef = useRef(0);

  function handleAboutVideoTimeUpdate(): void {
    const video = aboutVideoRef.current;
    if (!video) return;
    const time = video.currentTime;
    if (time + 0.5 < aboutLastTimeRef.current) {
      aboutDecorCycleRef.current = false;
      setAboutDecorVisible(false);
    }
    aboutLastTimeRef.current = time;
    if (time >= 1.2 && !aboutDecorCycleRef.current) {
      aboutDecorCycleRef.current = true;
      setAboutDecorVisible(true);
    } else if (time < 0.35 && aboutDecorCycleRef.current) {
      aboutDecorCycleRef.current = false;
      setAboutDecorVisible(false);
    }
  }

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
                  <p className="cap-stack-eyebrow">AI DIRECTOR + APPLICATION / FDE</p>
                  <h2 className="cap-stack-heading" id="cap-stack-title">
                <span className="cap-stack-heading-line cap-stack-heading-line-one">让 AI 讲好故事</span>
                <span className="cap-stack-heading-line cap-stack-heading-line-two">
                  也能<span className="cap-stack-heading-accent">跑好业务</span>
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
                      className="cap-stack-lede-text cap-stack-scrambled cap-stack-scrambled--readable"
                      radius={88}
                      verticalRadius={14}
                      duration={0.92}
                      speed={0.42}
                      scrambleChars=".:_01"
                    >
                      不只负责某一个环节：既能从小说与剧本出发完成角色、分镜和画面统筹，也能从业务目标出发梳理数据、工具和流程，把想法推进到可验收的交付。
                    </ScrambledText>
                  </p>
                  <p className="cap-stack-para cap-stack-prose-line cap-stack-prose-line-para">
                    <ScrambledText
                      className="cap-stack-scrambled cap-stack-scrambled--readable"
                      radius={76}
                      verticalRadius={13}
                      duration={0.78}
                      speed={0.38}
                      scrambleChars=".:_01"
                    >
                      我的项目覆盖 AI 漫剧与视频制作、数据中台、RAG、Agent 工作流、电商视觉和内容运营自动化，关注的不只是生成结果，也包括资产管理、状态追踪、人工质检和结果复用。
                    </ScrambledText>
                  </p>
                  <div className="cap-stack-process-flow" aria-label="业务闭环">
                    {PROCESS_FLOW.map((step, index) => (
                      <span className="cap-stack-process-flow-item" key={step}>
                        <span>{step}</span>
                        {index < PROCESS_FLOW.length - 1 && <b aria-hidden="true">→</b>}
                      </span>
                    ))}
                  </div>
                  <ul className="cap-stack-identity-list" aria-label="身份短句">
                    {IDENTITY_LINES.map((line) => (
                      <li className="cap-stack-identity-item" key={line}>{line}</li>
                    ))}
                  </ul>
                </div>

                <div className="cap-stack-character-media">
                  <div className="cap-stack-character-glow" aria-hidden="true" />
                  <div className="cap-stack-character-frame">
                    <div
                      className={`cap-stack-character-decor${aboutDecorVisible ? " is-active" : ""}`}
                      aria-hidden="true"
                    >
                      <div className="cap-stack-character-orbit cap-stack-character-orbit-outer" />
                      <div className="cap-stack-character-orbit cap-stack-character-orbit-inner" />
                    </div>
                    <img
                      className={`cap-stack-character-poster${aboutVideoReady ? " is-hidden" : ""}`}
                      src={aboutCharacterPosterAsset}
                      alt="张远博虚拟角色形象"
                    />
                    <video
                      ref={aboutVideoRef}
                      className={`cap-stack-character-video${aboutVideoReady ? " is-ready" : ""}`}
                      autoPlay
                      loop
                      muted
                      playsInline
                      preload="metadata"
                      poster={aboutCharacterPosterAsset}
                      onCanPlay={() => setAboutVideoReady(true)}
                      onTimeUpdate={handleAboutVideoTimeUpdate}
                      onError={() => {
                        setAboutVideoReady(false);
                        setAboutDecorVisible(false);
                        aboutDecorCycleRef.current = false;
                        aboutLastTimeRef.current = 0;
                      }}
                      aria-hidden="true"
                    >
                      <source src={aboutCharacterWebmAsset} type="video/webm" />
                      <source src={aboutCharacterMp4Asset} type="video/mp4" />
                    </video>
                    <div
                      className={`cap-stack-character-tool-list${aboutDecorVisible ? " is-active" : ""}`}
                      aria-hidden="true"
                    >
                      {ABOUT_CHARACTER_TOOLS.map((tool) => (
                        <span
                          className={`cap-stack-character-tool is-${tool.tone}`}
                          key={tool.label}
                          style={{
                            "--tool-angle": tool.angle,
                            "--tool-delay": tool.delay
                          } as CSSProperties}
                        >
                          <b>{tool.glyph}</b>
                          <small>{tool.label}</small>
                        </span>
                      ))}
                    </div>
                  </div>
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
                <span className="cap-stack-orbit-core-label">把 AI 能力接入真实业务</span>
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
                        <span className="cap-stack-pill-label">{cap.orbitLabel ?? cap.label}</span>
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
                  <span className="cap-stack-card-label">
                    {cap.eyebrow ?? `CAPABILITY / ${cap.id.toUpperCase()}`}
                  </span>
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

          <section className="cap-stack-project-matrix" aria-labelledby="cap-stack-project-matrix-title">
            <div className="cap-stack-block-head">
              <p className="cap-stack-eyebrow">PROJECT MATRIX / 项目矩阵</p>
              <h3 id="cap-stack-project-matrix-title">项目矩阵</h3>
            </div>
            <div className="cap-stack-project-matrix-grid">
              {PROJECT_MATRIX_GROUPS.map((group) => (
                <section className="cap-stack-project-matrix-group" key={group.title}>
                  <div className="cap-stack-project-matrix-group-head">
                    <span>{group.eyebrow}</span>
                    <h4>{group.title}</h4>
                  </div>
                  <div className="cap-stack-project-matrix-list">
                    {group.items.map((item) => (
                      <article className="cap-stack-project-matrix-item" key={item.name}>
                        <h5>{item.name}</h5>
                        <div className="cap-stack-project-matrix-meta">
                          <span>{item.type}</span>
                          <span>{item.role}</span>
                        </div>
                        <p>{item.result}</p>
                      </article>
                    ))}
                  </div>
                </section>
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
                <article className={`cap-stack-timeline-item is-${item.trackTone}`} key={`${item.year}-${item.title}`}>
                  <time>{item.year}</time>
                  <div>
                    <span className="cap-stack-timeline-track">{item.trackLabel}</span>
                    <h4>{item.title}</h4>
                    <p>{item.note}</p>
                    <div className="cap-stack-timeline-keywords" aria-label={`${item.title}关键词`}>
                      {item.keywords.map((keyword) => <span key={keyword}>{keyword}</span>)}
                    </div>
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
