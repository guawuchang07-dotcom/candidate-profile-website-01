import { useEffect, useRef, useState } from "react";
import type { CSSProperties } from "react";
import {
  Briefcase,
  CheckCircle2,
  ChevronDown,
  Cpu,
  Mail,
  PlayCircle,
  Rocket,
  X
} from "lucide-react";
import heroCharacterMp4Asset from "./assets/static/media/hero/hero-character-loop-u2net-v2.mp4";
import heroCharacterWebmAsset from "./assets/static/media/hero/hero-character-loop-u2net-v2.webm";
import heroCharacterPosterAsset from "./assets/static/media/hero/hero-character-poster-u2net-v2.png";
import heroReferenceStageAsset from "./assets/static/media/hero/hero-reference-stage-v1.jpg";
import idBadgeAsset from "./assets/static/media/hero/id-badge.png";
import projectArchiveCharacterMp4Asset from "./assets/static/media/hero/project-archive-character-loop-person.mp4";
import projectArchiveCharacterPosterAsset from "./assets/static/media/hero/project-archive-character-poster-person.png";
import projectArchiveCharacterWebmAsset from "./assets/static/media/hero/project-archive-character-loop-person.webm";
import section2CityBgAsset from "./assets/static/media/section2-city-bg.png";
import CardSwap from "./CardSwap";
import CoreCapabilityStack from "./CoreCapabilityStack";
import Dock from "./Dock";
import ParticleReveal from "./ParticleReveal";
import Section2Ambient from "./Section2Ambient";
import ProjectCasePage, { hasProjectCase } from "./ProjectCasePage";
import "./resume-page.css";
import "./core-capability-stack.css";

type CssVars = CSSProperties & Record<`--${string}`, string>;

type ResumeNavItem = {
  label: string;
  href: string;
};

const resumeNavItems: ResumeNavItem[] = [
  { label: "首页", href: "#home" },
  { label: "能力栈", href: "#resume-core-stack" },
  { label: "项目档案", href: "#resume-project-archive" },
  { label: "作品", href: "#resume-director" },
  { label: "边界", href: "#resume-delivery" },
  { label: "联系", href: "#resume-contact" }
];
const ecommerceScreenshots: ImagePreview[] = [
  {
    title: "工作流配置界面",
    description: "平台选择、服装类型、风格方向和生成参数配置，支持结构化输入和批量生成。",
    src: new URL("./assets/static/media/ecommerce/workflow-config.png", import.meta.url).href
  },
  {
    title: "批量主图生成结果",
    description: "同一商品方向生成的多张主图候选，支持人工筛选和反馈，避免盲目生成。",
    src: new URL("./assets/static/media/ecommerce/batch-images.png", import.meta.url).href
  },
  {
    title: "图生视频延展",
    description: "基于选中主图生成的宣传视频素材，验证从静态商品图到短视频投放的完整链路。",
    src: new URL("./assets/static/media/ecommerce/video-generation.png", import.meta.url).href
  }
];


function getAppRouteHref(route = ""): string {
  const basePath = window.location.pathname
    .replace(/\/(?:resume|profile)\/?$/, "/")
    .replace(/\/projects\/[^/]+\/?$/, "/")
    .replace(/\/index\.html$/, "/");
  const normalizedBase = basePath.endsWith("/") ? basePath : `${basePath}/`;
  return `${normalizedBase}${route}`;
}

type ToolGroup = {
  title: string;
  tools: string[];
};

type DirectorWork = {
  title: string;
  type: string;
  description: string;
  role: string[];
  tools: string[];
  status: string;
  duration: string;
  videoSrc: string;
  posterSrc: string;
  format: "landscape" | "portrait";
};

type DirectorReelClip = Pick<DirectorWork, "title" | "duration" | "videoSrc" | "posterSrc" | "format">;

type ImagePreview = {
  title: string;
  description: string;
  src: string;
};



const archiveProjects = [
  {
    index: "01",
    detailSlug: "data-platform",
    title: "AI 数据中台（含微信数据接入）",
    label: "B2 / PLATFORM PROJECT",
    summary: "以微信原始库为入口，经过 ETL、脱敏、对话块清洗和人工审核，向多个 AI 应用统一供给数据资产。",
    problem: "原始聊天、业务资料和项目结果分散在不同位置，未经治理就进入 RAG 会带来噪声、隐私和版本问题。",
    flow: "SQLite 只读→ETL 暂存→DataFilter 脱敏→人工审核→RAG / 考核 / 微调。",
    proof: "微信数据导入是 B2 的接入子项目；数据中台负责统一治理、分流和状态追踪。",
    tags: ["B2", "ETL / DataFilter", "RAG 底座"]
  },
  {
    index: "02",
    detailSlug: "ecommerce-aigc-workflow",
    title: "服装平台视觉生图自动化",
    label: "INDEPENDENT PROJECT / LOCAL WORKFLOW",
    summary: "把服装参考图、平台规格、风格设定、批量主图和图生视频串成可复用的 SKU 视觉生产链路。",
    problem: "同一件服装要适配不同平台和内容形态，传统设计、修图和视频制作链路割裂且返工难追踪。",
    flow: "参考图→平台规格→风格设定→批量生成→人工复核→视频延展。",
    proof: "本地工作流原型，已验证输入配置、生成调度、人工复核和素材输出边界。",
    tags: ["独立项目", "SKU 视觉", "批量生成"]
  },
  {
    index: "03",
    detailSlug: "ai-content-ops",
    title: "自媒体智能内容运营 Agent",
    label: "B4 / BUSINESS APPLICATION",
    summary: "用 LangGraph 编排选题、写作、配图/视频、审核和多平台输出，并记录状态与模型成本。",
    problem: "内容生产需要反复查资料、改写、排版和检查来源，单次产出难以回滚，历史内容也难复用。",
    flow: "选题输入→SubGraph→Checkpointer→动态路由→多平台草稿→人工审核。",
    proof: "包含自媒体运营自动化验证，但不包装成全自动发布系统；发布前仍保留人工确认。",
    tags: ["B4", "LangGraph", "成本追踪"]
  },
  {
    index: "04",
    detailSlug: "live-clip-agent",
    title: "AI 直播切片 Agent",
    label: "B3 / CONTENT AUTOMATION",
    summary: "把直播回放从 ASR 文本分析到高光裁切和数据回写，变成可持续复用的内容生产链路。",
    problem: "长直播包含大量无效内容，人工找高光、记时间点和裁切片段耗时，结果也难回写到素材体系。",
    flow: "浏览器提取音频→ASR 分块→LLM 高光分析→精准裁切→SSE 进度→数据回写。",
    proof: "核心证据是 FFmpeg.wasm、任务表、SSE 进度和片段回写链路，不等同于普通剪辑工具。",
    tags: ["B3", "ASR 高光", "FFmpeg.wasm"]
  },
  {
    index: "05",
    detailSlug: "ai-voice-customer-service",
    title: "AI 实时语音智能客服",
    label: "B1 / FRONT-END PRODUCT",
    summary: "面向私域电商场景，把实时语音、多模态回复和 RAG 检索组织成可交互的客服前台。",
    problem: "客服需要同时理解商品、上下文、用户意图和图片/视频素材，普通问答链路难以稳定支撑多轮沟通。",
    flow: "混合检索→意图识别→Query 改写→Rerank→语音 / 图文回复。",
    proof: "验证目标：TTFT 压到 2 秒内，并在高丢包场景保持语音稳定；真实指标需继续压测。",
    tags: ["B1", "实时语音", "多模态客服"]
  },
  {
    index: "06",
    detailSlug: "asset-center-sales-assessment",
    title: "AI 素材中心 & 销售考核",
    label: "B6 / BUSINESS MODULES",
    summary: "同一套多模态素材和业务知识底座，同时支持精准素材检索与 AI 销售考核。",
    problem: "图片、文字、视频和销售知识分散，素材难以检索，考核出题和评分也缺少统一上下文。",
    flow: "OCR / VLM / ASR 增强→pgvector 检索→RAG 出题→LLM 评判→结果沉淀。",
    proof: "素材中心和销售考核是 B6 的两个业务模块，共享数据、向量和知识结构。",
    tags: ["B6", "多模态检索", "自动考核"]
  },
  {
    index: "07",
    detailSlug: "mcp-agent-cluster",
    title: "MCP 多 Agent 共享服务集群",
    label: "B5 / ARCHITECTURE VALIDATION",
    summary: "通过 MCP 网关统一模型、RAG、记忆和 Prompt 服务，让多个项目共享能力并保持项目隔离。",
    problem: "不同项目各自接模型、知识库和提示词，接口、权限、配额和上下文管理容易重复建设。",
    flow: "REST→MCP 网关→LLM / RAG / Memory / Prompt 服务→项目路由。",
    proof: "这是协议与架构验证，不包装成已经上线的 SaaS 产品；重点是复用和治理边界。",
    tags: ["B5", "Streamable HTTP", "项目隔离"]
  },
  {
    index: "08",
    detailSlug: "model-finetune",
    title: "聊天数据模型微调实验",
    label: "B7 / LOCAL FINETUNE EXPLORATION",
    summary: "从数据中台脱敏数据出发，验证 SFT、DPO、QLoRA 和 LoRA 对客服风格与回答偏好的改善。",
    problem: "微调需要高质量偏好数据和明确评测边界，不能把大量商品知识直接塞进模型替代 RAG。",
    flow: "脱敏清洗→ShareGPT / JSONL→SFT / DPO→QLoRA / LoRA→双盲评测。",
    proof: "属于本地部署与技术探索，业务知识仍由 RAG 提供，不宣称已经形成生产模型服务。",
    tags: ["B7", "SFT / DPO", "本地 QLoRA"]
  }
];

const aboutFocusItems = ["电商视觉工作流", "FDE 前沿部署", "AIGC 内容生产流程", "AI Agent 工具落地"];

const independentScopes = [
  "浏览器自动化脚本",
  "AIGC 流程拆解",
  "内容质检标准",
  "Dify / Coze 原型",
  "Prompt / 分镜沉淀",
  "知识库每日复盘"
];

const collaborationScopes = [
  "企业级后端架构",
  "多用户权限系统",
  "复杂 API 联调",
  "生产级任务队列 / 监控"
];

const teamFitItems = [
  {
    title: "电商品牌 / 服装品牌",
    description: "需要批量生成主图、视频素材和内容投放资产的团队。"
  },
  {
    title: "AI 应用公司",
    description: "需要把 Agent / 工具流做成可演示原型和业务流程的团队。"
  },
  {
    title: "AIGC 内容公司",
    description: "需要稳定产出短视频、漫剧、图文内容和素材包的团队。"
  },
  {
    title: "FDE / 前沿部署团队",
    description: "需要把工具、脚本、工作流嵌入真实业务现场的团队。"
  },
  {
    title: "短视频 / 内容平台",
    description: "需要内容运营、脚本拆解、批量生产和复盘机制的团队。"
  },
  {
    title: "AI 工具团队",
    description: "需要测试工具能力、沉淀案例、整理工作流和用户场景反馈的团队。"
  }
];





const directorWorks: DirectorWork[] = [
  {
    title: "文定乾坤",
    type: "横屏叙事 · AI 影像",
    description: "横屏叙事样片，重点展示画面设定、氛围控制与镜头节奏的统一。",
    role: ["画面设定", "分镜统筹", "镜头一致性", "节奏剪辑"],
    tools: ["AI 生图", "AI 视频", "剪映"],
    status: "完整样片已归档",
    duration: "预览 00:24",
    videoSrc: new URL("./assets/static/media/director/portfolio/heaven-order.mp4", import.meta.url).href,
    posterSrc: new URL("./assets/static/media/director/portfolio/heaven-order.jpg", import.meta.url).href,
    format: "landscape"
  },
  {
    title: "博物馆",
    type: "现代叙事 · AI 影像",
    description: "现代场景叙事样片，重点展示人物近景、对白节奏与连续镜头的叙事表达。",
    role: ["剧情拆解", "人物表演", "镜头衔接", "成片统筹"],
    tools: ["AI 生图", "AI 视频", "剪映"],
    status: "完整样片已归档",
    duration: "预览 00:24",
    videoSrc: new URL("./assets/static/media/director/portfolio/museum.mp4", import.meta.url).href,
    posterSrc: new URL("./assets/static/media/director/portfolio/museum.jpg", import.meta.url).href,
    format: "landscape"
  },
  {
    title: "女总裁捡漏",
    type: "竖屏短剧 · AI 影像",
    description: "竖屏短剧样片，重点展示移动端构图、人物情绪和冲突节奏的控制。",
    role: ["短剧节奏", "人物一致性", "竖屏构图", "后期包装"],
    tools: ["AI 生图", "AI 视频", "剪映"],
    status: "完整样片已归档",
    duration: "预览 00:24",
    videoSrc: new URL("./assets/static/media/director/portfolio/ceo-discovery.mp4", import.meta.url).href,
    posterSrc: new URL("./assets/static/media/director/portfolio/ceo-discovery.jpg", import.meta.url).href,
    format: "portrait"
  }
];

const directorReelClips: DirectorReelClip[] = [
  {
    title: "苟道长生",
    duration: "00:24",
    videoSrc: new URL("./assets/static/media/director/portfolio/immortal-path.mp4", import.meta.url).href,
    posterSrc: new URL("./assets/static/media/director/portfolio/immortal-path.jpg", import.meta.url).href,
    format: "landscape"
  },
  {
    title: "财阀太子爷",
    duration: "00:24",
    videoSrc: new URL("./assets/static/media/director/portfolio/tycoon-prince.mp4", import.meta.url).href,
    posterSrc: new URL("./assets/static/media/director/portfolio/tycoon-prince.jpg", import.meta.url).href,
    format: "landscape"
  },
  {
    title: "冒牌货",
    duration: "00:24",
    videoSrc: new URL("./assets/static/media/director/portfolio/impostor.mp4", import.meta.url).href,
    posterSrc: new URL("./assets/static/media/director/portfolio/impostor.jpg", import.meta.url).href,
    format: "landscape"
  },
  {
    title: "深圳",
    duration: "00:24",
    videoSrc: new URL("./assets/static/media/director/portfolio/shenzhen.mp4", import.meta.url).href,
    posterSrc: new URL("./assets/static/media/director/portfolio/shenzhen.jpg", import.meta.url).href,
    format: "portrait"
  },
  {
    title: "渔女",
    duration: "00:24",
    videoSrc: new URL("./assets/static/media/director/portfolio/fisher-girl.mp4", import.meta.url).href,
    posterSrc: new URL("./assets/static/media/director/portfolio/fisher-girl.jpg", import.meta.url).href,
    format: "portrait"
  },
  {
    title: "作精",
    duration: "00:24",
    videoSrc: new URL("./assets/static/media/director/portfolio/spoiled-girl.mp4", import.meta.url).href,
    posterSrc: new URL("./assets/static/media/director/portfolio/spoiled-girl.jpg", import.meta.url).href,
    format: "portrait"
  }
];

const toolGroups: ToolGroup[] = [
  { title: "AI 协作开发", tools: ["Codex", "Cursor", "Claude"] },
  { title: "业务运营自动化", tools: ["Tabbit", "OpenClaw", "Coze"] },
  { title: "知识库与情报", tools: ["Obsidian", "GitHub", "Hermes"] },
  { title: "AIGC 视频 / 图像", tools: ["即梦", "Seedance", "剪映"] }
];


function SectionKicker({ index, label }: { index: string; label: string }): JSX.Element {
  return (
    <div className="resume-section-kicker">
      <span>{index}</span>
      <strong>{label}</strong>
    </div>
  );
}





function HangingBadge(): JSX.Element {
  const btnRef = useRef<HTMLButtonElement>(null);
  const st = useRef({
    phase: "fall" as "fall" | "hang",
    y: -480, // 起始在屏幕上方(px),受重力下落
    vy: 0,
    angle: 0,
    vel: 0,
    dragging: false,
    startX: 0,
    startAngle: 0,
    lastAngle: 0,
    lastT: 0,
    raf: 0
  });

  useEffect(() => {
    const card = btnRef.current;
    if (!card) return;
    const s = st.current;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      card.style.transform = "translateY(0) rotate(0deg)";
      return;
    }
    let last = performance.now();
    const G = 2600; // 重力加速度(px/s²)
    const K = 30; // 摆动回正力
    const DAMP = 2.4; // 摆动阻尼
    const KY = 240; // 竖直回弹劲度
    const CY = 13; // 竖直回弹阻尼
    const tick = (now: number): void => {
      const dt = Math.min((now - last) / 1000, 0.032);
      last = now;
      if (s.phase === "fall") {
        // 自由下落加速,到绳长末端(y=0)被绳子接住
        s.vy += G * dt;
        s.y += s.vy * dt;
        if (s.y >= 0) {
          s.y = 0;
          s.phase = "hang";
          // 下坠动量平滑转成:摆动(向左先甩)+ 竖直回弹
          s.vel += -(s.vy * 0.00062);
          s.vy = -s.vy * 0.18;
        }
      } else if (!s.dragging) {
        // 竖直回弹(弹簧+阻尼)
        s.vy += (-KY * s.y - CY * s.vy) * dt;
        s.y += s.vy * dt;
        // 钟摆摆动(弹簧+阻尼)
        s.vel += (-K * s.angle - DAMP * s.vel) * dt;
        s.angle += s.vel * dt;
      }
      const yaw = Math.max(-22, Math.min(22, s.angle * 16));
      card.style.transform = `translateY(${s.y}px) rotate(${s.angle}rad) rotateY(${yaw}deg)`;
      s.raf = requestAnimationFrame(tick);
    };
    s.raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(s.raf);
  }, []);

  const onDown = (e: React.PointerEvent<HTMLButtonElement>): void => {
    const s = st.current;
    s.phase = "hang"; // 下落途中被抓住也立即切到可拖拽
    s.dragging = true;
    s.startX = e.clientX;
    s.startAngle = s.angle;
    s.lastAngle = s.angle;
    s.lastT = performance.now();
    e.currentTarget.setPointerCapture?.(e.pointerId);
  };
  const onMove = (e: React.PointerEvent<HTMLButtonElement>): void => {
    const s = st.current;
    if (!s.dragging) return;
    const target = Math.max(-0.6, Math.min(0.6, s.startAngle + (e.clientX - s.startX) * 0.004));
    const now = performance.now();
    const dt = Math.max((now - s.lastT) / 1000, 0.001);
    s.vel = (target - s.lastAngle) / dt;
    s.lastAngle = target;
    s.lastT = now;
    s.angle = target;
  };
  const onUp = (): void => {
    st.current.dragging = false;
  };
  const onClick = (): void => {
    // 点击给一个随机方向的冲量,牌子晃起来
    const s = st.current;
    if (Math.abs(s.vel) < 1.5) s.vel += (Math.random() > 0.5 ? 1 : -1) * 4.2;
  };

  return (
    <div className="resume-nav-badge">
      <button
        ref={btnRef}
        type="button"
        className="resume-nav-badge-btn"
        aria-label="张远博 ID 工牌"
        onPointerDown={onDown}
        onPointerMove={onMove}
        onPointerUp={onUp}
        onPointerCancel={onUp}
        onClick={onClick}
      >
        <img src={idBadgeAsset} alt="张远博 ID 工牌" draggable={false} />
      </button>
    </div>
  );
}

function ProjectArchiveSection({ onOpenProject }: { onOpenProject: (slug: string) => void }): JSX.Element {
  const [archiveRef, archiveVisible] = useRevealOnce<HTMLElement>({
    threshold: 0.28,
    rootMargin: "0px 0px -16% 0px",
    minRatio: 0.24
  });
  const projectCount = archiveProjects.length;
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [launchingSlug, setLaunchingSlug] = useState<string | null>(null);
  const centeredProject = archiveProjects[carouselIndex] ?? archiveProjects[0];
  const goPrev = (): void => setCarouselIndex((i) => (i - 1 + projectCount) % projectCount);
  const goNext = (): void => setCarouselIndex((i) => (i + 1) % projectCount);

  const launchProject = (slug: string): void => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      onOpenProject(slug);
      return;
    }
    setLaunchingSlug(slug);
    window.setTimeout(() => onOpenProject(slug), 470);
    window.setTimeout(() => setLaunchingSlug(null), 900);
  };

  const cardOffset = (i: number): number => {
    let off = (i - carouselIndex + projectCount) % projectCount;
    if (off > projectCount / 2) off -= projectCount;
    return off;
  };

  const cardStyle = (off: number): CSSProperties => {
    const abs = Math.min(Math.abs(off), 3);
    const sign = Math.sign(off);
    if (abs > 2) {
      return {
        opacity: 0,
        pointerEvents: "none",
        transform: "translateX(-50%) scale(0.6)",
        zIndex: 1
      };
    }
    const xStep = [0, 70, 124][abs];
    const yStep = [0, 26, 56][abs];
    const scale = [1, 0.86, 0.72][abs];
    const rotate = [0, 6, 10][abs] * sign;
    const opacity = [1, 0.72, 0.72][abs];
    const dim = [1, 0.9, 0.78][abs];
    return {
      transform: `translateX(calc(-50% + ${sign * xStep}%)) translateY(${yStep}px) scale(${scale}) rotate(${rotate}deg)`,
      opacity,
      zIndex: 5 - abs,
      filter: abs === 0 ? "none" : `brightness(${dim})`
    } as CSSProperties;
  };

  return (
    <section
      ref={archiveRef}
      className={`resume-screen resume-project-archive-direct${archiveVisible ? " is-visible" : ""}`}
      id="resume-project-archive"
      aria-labelledby="resume-project-archive-title"
    >
      <div className="resume-project-archive-backdrop" aria-hidden="true">
        <span className="resume-project-archive-node resume-project-archive-node--1" />
        <span className="resume-project-archive-node resume-project-archive-node--2" />
        <span className="resume-project-archive-node resume-project-archive-node--3" />
        <span className="resume-project-archive-node resume-project-archive-node--4" />
        <span className="resume-project-archive-node resume-project-archive-node--5" />
      </div>
      <div className="resume-project-archive-shade" aria-hidden="true" />
      <div className="resume-project-archive-character" aria-hidden="true">
        <video
          className="resume-project-archive-character-video"
          poster={projectArchiveCharacterPosterAsset}
          autoPlay
          loop
          muted
          playsInline
          preload="metadata"
        >
          <source src={projectArchiveCharacterWebmAsset} type="video/webm" />
          <source src={projectArchiveCharacterMp4Asset} type="video/mp4" />
        </video>
      </div>
      <div className="resume-project-archive-frame" aria-hidden="true">
        <span />
        <span />
        <span />
        <span />
      </div>

      <div className="resume-project-archive-brand" aria-hidden="true">
        <span>03</span>
        <strong>PROJECT EXPERIENCE</strong>
      </div>

      <div className="resume-project-archive-left-copy">
        <div className="resume-project-archive-left-kicker">
          <span>03</span>
          <strong>PROJECT EXPERIENCE</strong>
        </div>
        <h2 id="resume-project-archive-title">项目交付档案</h2>
        <p>聚焦 AI 应用开发与 FDE 交付，把数据、模型和工具接入真实业务，做成可运行、可验证的工作流程。</p>
      </div>

      <div className="resume-project-archive-card-deck" aria-label="\u9879\u76ee\u6863\u6848\u5361">
        {archiveProjects.map((project, i) => {
          const off = cardOffset(i);
          const isCenter = off === 0;
          const detailSlug = (project as { detailSlug?: string }).detailSlug;
          const detailHref = detailSlug ? getAppRouteHref(`projects/${detailSlug}`) : "#resume-director";
          const isLaunching = launchingSlug === detailSlug && detailSlug != null;
          const isAiContentOpsCard = detailSlug === "ai-content-ops";
          return (
            <a
              className={`resume-project-archive-card${isAiContentOpsCard ? " resume-project-archive-card--content-ops" : ""}${isCenter ? " is-active" : ""}${isLaunching ? " is-launching" : ""}`}
              href={detailHref}
              key={project.title}
              style={cardStyle(off)}
              aria-label={isCenter ? `查看项目：${project.title}` : `切换到项目：${project.title}`}
              aria-hidden={Math.abs(off) > 2}
              tabIndex={isCenter ? 0 : -1}
              onClick={(e) => {
                if (!isCenter) {
                  e.preventDefault();
                  setCarouselIndex(i);
                  return;
                }
                if (detailSlug) {
                  e.preventDefault();
                  launchProject(detailSlug);
                }
              }}
            >
              <span className="resume-project-archive-card-index">{project.index}</span>
              <h3>{project.title}</h3>
              {project.problem && (
                <span className="resume-card-seg"><em>{"\u4e1a\u52a1\u95ee\u9898"}</em>{project.problem}</span>
              )}
              {project.flow && (
                <span className="resume-card-seg"><em>{"\u5de5\u4f5c\u6d41\u52a8\u4f5c"}</em>{project.flow}</span>
              )}
              {project.proof && (
                <span className="resume-card-seg resume-card-seg--proof"><em>{"\u53ef\u5c55\u793a\u8bc1\u636e"}</em>{project.proof}</span>
              )}
              <span className="resume-project-archive-card-tags">
                {project.tags.map((tag) => (
                  <span key={tag}>{tag}</span>
                ))}
              </span>
              <span className="resume-project-archive-card-action">{"\u67e5\u770b\u9879\u76ee\u8be6\u60c5 \u2192"}</span>
            </a>
          );
        })}
      </div>

      <div className="resume-archive-carousel-nav">
        <button type="button" className="resume-archive-carousel-btn" onClick={goPrev} aria-label="\u4e0a\u4e00\u4e2a\u9879\u76ee">
          {"\u2039"}
        </button>
        <span className="resume-archive-carousel-dots">
          {archiveProjects.map((project, i) => (
            <span key={project.title} className={`resume-archive-carousel-dot${i === carouselIndex ? " is-active" : ""}`} />
          ))}
        </span>
        <button type="button" className="resume-archive-carousel-btn" onClick={goNext} aria-label="\u4e0b\u4e00\u4e2a\u9879\u76ee">
          {"\u203a"}
        </button>
      </div>

      <div className="resume-project-archive-status" aria-hidden="true">
        <span>{"\u5f53\u524d\u8f7d\u5165\uff1a" + centeredProject.label}</span>
      </div>
    </section>
  );
}

function DirectorWorkCard({
  work,
  index,
  onPlay
}: {
  work: DirectorWork;
  index: number;
  onPlay: (work: DirectorWork) => void;
}): JSX.Element {
  return (
    <article className="resume-director-card">
      <div className="resume-director-preview">
        <button
          className="resume-director-preview-button"
          type="button"
          onClick={() => onPlay(work)}
          aria-label={"播放 " + work.title + " 精选片段"}
        >
          <img className="resume-director-poster" src={work.posterSrc} alt={work.title + "视频封面"} loading="lazy" />
          <span className="resume-director-video-badge" aria-hidden="true">
            <span>WORK 0{index + 1}</span>
            <strong>{work.duration}</strong>
          </span>
          <span className="resume-director-play-mark" aria-hidden="true">
            <PlayCircle size={34} />
            <span>播放精选片段</span>
          </span>
        </button>
      </div>
      <div className="resume-director-card-copy">
        <div className="resume-director-card-head">
          <span>{work.type}</span>
          <h3>{work.title}</h3>
          <p>{work.description}</p>
        </div>
        <div className="resume-director-card-tags">
          {[...work.role.slice(0, 2), ...work.tools.slice(0, 3)].map((item) => (
            <span key={item}>{item}</span>
          ))}
        </div>
      </div>
    </article>
  );
}

function DirectorReel({
  clips,
  onPlay
}: {
  clips: DirectorReelClip[];
  onPlay: (work: DirectorWork) => void;
}): JSX.Element {
  const openClip = (clip: DirectorReelClip): void => {
    onPlay({
      ...clip,
      type: clip.format === "portrait" ? "AI 漫剧 · 竖屏样片" : "AI 漫剧 · 横屏样片",
      description: "AI 漫剧导演作品库样片，点击后查看经过网页优化的 24 秒预览。",
      role: [],
      tools: [],
      status: "完整样片已归档"
    });
  };

  return (
    <div className="resume-director-reel" aria-label="AI 影像片段循环展示">
      <div className="resume-director-reel-track">
        {[0, 1].map((groupIndex) => (
          <div
            className="resume-director-reel-sequence"
            aria-hidden={groupIndex === 1 ? true : undefined}
            key={"director-reel-sequence-" + groupIndex}
          >
            {clips.map((clip) => (
              <button
                className="resume-director-reel-item"
                type="button"
                onClick={() => openClip(clip)}
                tabIndex={groupIndex === 1 ? -1 : undefined}
                aria-label={"播放 " + clip.title}
                key={groupIndex + "-" + clip.title}
              >
                <img
                  className="resume-director-reel-video"
                  src={clip.posterSrc}
                  alt=""
                  loading="eager"
                  decoding="async"
                />
                <span className="resume-director-reel-play" aria-hidden="true">
                  <PlayCircle size={22} />
                </span>
                <span className="resume-director-reel-meta" aria-hidden="true">
                  <span>{clip.title}</span>
                  <strong>{clip.duration}</strong>
                </span>
              </button>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

type RevealOptions = {
  threshold?: number;
  rootMargin?: string;
  minRatio?: number;
};

function useRevealOnce<T extends HTMLElement>({
  threshold = 0.34,
  rootMargin = "0px 0px -22% 0px",
  minRatio = 0.28
}: RevealOptions = {}): [React.RefObject<T>, boolean] {
  const ref = useRef<T>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting && entry.intersectionRatio >= minRatio) {
            setVisible(true);
            io.disconnect();
            break;
          }
        }
      },
      { threshold, rootMargin }
    );
    io.observe(node);
    return () => io.disconnect();
  }, [threshold, rootMargin, minRatio]);

  return [ref, visible];
}

function RearScreen({
  id,
  className,
  children
}: {
  id?: string;
  className?: string;
  children: React.ReactNode;
}): JSX.Element {
  const [ref, visible] = useRevealOnce<HTMLElement>({
    threshold: 0.36,
    rootMargin: "0px 0px -22% 0px",
    minRatio: 0.3
  });

  return (
    <section
      ref={ref}
      id={id}
      className={`resume-rear-screen ${className ?? ""}${visible ? " is-visible" : ""}`}
    >
      <span className="cap-hud cap-hud-tl" aria-hidden="true" />
      <span className="cap-hud cap-hud-tr" aria-hidden="true" />
      <span className="cap-hud cap-hud-bl" aria-hidden="true" />
      <span className="cap-hud cap-hud-br" aria-hidden="true" />
      {children}
    </section>
  );
}

export default function ResumePage(): JSX.Element {
  const [infoVisible, setInfoVisible] = useState(false);
  const [heroVideoReady, setHeroVideoReady] = useState(false);
  const [heroParticleDone, setHeroParticleDone] = useState(false);
  const [heroVideoFailed, setHeroVideoFailed] = useState(false);
  const [activeDirectorWork, setActiveDirectorWork] = useState<DirectorWork | null>(null);
  const [activeImagePreview, setActiveImagePreview] = useState<ImagePreview | null>(null);
  const [activeProjectSlug, setActiveProjectSlug] = useState<string | null>(null);
  const [activeNavHref, setActiveNavHref] = useState("#home");
  const heroVideoRef = useRef<HTMLVideoElement | null>(null);
  const infoTriggeredRef = useRef(false);
  const [directorRef, directorVisible] = useRevealOnce<HTMLElement>({
    threshold: 0.24,
    rootMargin: "0px 0px -14% 0px",
    minRatio: 0.22
  });


  const openProject = (slug: string): void => {
    if (!hasProjectCase(slug)) {
      window.location.assign(getAppRouteHref(`projects/${slug}`));
      return;
    }
    window.history.pushState({ projectSlug: slug }, "", getAppRouteHref(`projects/${slug}`));
    setActiveProjectSlug(slug);
  };

  const closeProject = (): void => {
    window.history.back();
  };

  useEffect(() => {
    const onPop = (): void => {
      const m = window.location.pathname.replace(/\/+$/, "").match(/(?:^|\/)projects\/([^/]+)$/);
      const slug = m && hasProjectCase(m[1]) ? m[1] : null;
      setActiveProjectSlug(slug);
    };
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  useEffect(() => {
    if (activeProjectSlug) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = prev;
      };
    }
    return undefined;
  }, [activeProjectSlug]);

  useEffect(() => {
    const syncNavHash = (): void => {
      const nextHash = window.location.hash || "#home";
      if (resumeNavItems.some((item) => item.href === nextHash)) {
        setActiveNavHref(nextHash);
      }
    };

    syncNavHash();
    window.addEventListener("hashchange", syncNavHash);
    return () => window.removeEventListener("hashchange", syncNavHash);
  }, []);

  function handleHeroTimeUpdate(): void {
    const video = heroVideoRef.current;
    // The current loop begins its pointing gesture just before 4s; reveal the UI on that cue.
    if (!video || infoTriggeredRef.current || video.currentTime < 3.65) return;
    infoTriggeredRef.current = true;
    setInfoVisible(true);
  }

  function handleHeroMediaError(): void {
    infoTriggeredRef.current = true;
    setHeroVideoFailed(true);
    setHeroVideoReady(false);
    setHeroParticleDone(true);
    setInfoVisible(true);
  }

  function handleHeroParticleComplete(): void {
    setHeroParticleDone(true);
  }

  function handleNavSelect(href: string): void {
    setActiveNavHref(href);
    if (window.location.hash === href) {
      document.querySelector<HTMLElement>(href)?.scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }

    window.location.hash = href;
  }

  return (
    <main className="resume-page" aria-label="张远博个人简历">
      <div className="resume-global-system-backdrop" aria-hidden="true">
        <div
          className="resume-global-system-bg"
          style={{ backgroundImage: `url(${section2CityBgAsset})` }}
        />
        <Section2Ambient />
        <span className="resume-global-system-grid" />
        <span className="resume-global-system-vignette" />
      </div>
      <div className="resume-bg-grid" aria-hidden="true" />
      <div className="resume-bg-lines" aria-hidden="true" />
      <div className="resume-bg-glow resume-bg-glow-cyan" aria-hidden="true" />
      <div className="resume-bg-glow resume-bg-glow-purple" aria-hidden="true" />
      <div className="resume-side-hud resume-side-hud-left" aria-hidden="true">
        <span>PROFILE</span>
        <span>AUTOMATION</span>
        <span>WORKFLOW</span>
        <i className="resume-side-sweep" />
        <i className="resume-side-node resume-side-node-a" />
        <i className="resume-side-node resume-side-node-b" />
        <div className="resume-side-module resume-side-module-a">
          <b>DATA STREAM</b>
          <em />
        </div>
        <div className="resume-side-module resume-side-module-b">
          <b>PROFILE TRACE</b>
          <em />
        </div>
      </div>
      <div className="resume-side-hud resume-side-hud-right" aria-hidden="true">
        <span>AI OPS</span>
        <span>BUSINESS</span>
        <span>DELIVERY</span>
        <i className="resume-side-sweep" />
        <i className="resume-side-node resume-side-node-a" />
        <i className="resume-side-node resume-side-node-b" />
        <div className="resume-side-module resume-side-module-a">
          <b>CONTENT OPS</b>
          <em />
        </div>
        <div className="resume-side-module resume-side-module-b">
          <b>DELIVERY BUS</b>
          <em />
        </div>
      </div>

      <nav className="resume-nav resume-nav--overlay" aria-label="作品集导航">
        <a className="resume-nav-brand" href="#home" aria-label="返回首页">
          <span>YUANBO ZHANG</span>
          <strong>PORTFOLIO</strong>
        </a>
        <Dock
          className="resume-nav-dock"
          aria-label="作品集导航"
          items={resumeNavItems.map(({ label, href }) => ({
            label,
            onClick: () => handleNavSelect(href),
            className: activeNavHref === href ? "is-active" : undefined
          }))}
          distance={126}
          panelHeight={46}
          baseItemSize={32}
          dockHeight={64}
          magnification={1.14}
        />
      </nav>
      <HangingBadge />

      <section
        id="home"
        className={infoVisible ? "hero-section visible" : "hero-section"}
        aria-labelledby="hero-title"
      >
        <img className="hero-stage-bg" src={heroReferenceStageAsset} alt="" aria-hidden="true" />
        <div className="hero-stage-tint" aria-hidden="true" />
        <div className="hero-grid" aria-hidden="true" />
        <div className="hero-scanline" aria-hidden="true" />
        <div className="hero-avatar-glow" aria-hidden="true" />
        <div className="hero-display-name" aria-hidden="true">ZHANG YUANBO</div>

        <div className="hero-info">
          <div className="hero-headline">
            <span className="hero-kicker">AI WORKFLOW ENGINEER · FDE</span>
            <h1 id="hero-title" className="hero-name-cn">
              <span>AI 接入真实业务</span>
              <span>做成可运行的工作系统</span>
            </h1>
          </div>

          <div className="hero-social">
            <p className="hero-value-prop">把复杂的 AI 逻辑，变成能落地的工作流程。</p>
          </div>

          <div className="hero-actions">
            <a className="hero-btn-primary" href="#resume-project-archive">
              <Briefcase size={15} aria-hidden="true" />
              查看项目
            </a>
            <a className="hero-btn-secondary" href="mailto:1425514532@qq.com">
              <Mail size={15} aria-hidden="true" />
              联系我
            </a>
          </div>
        </div>

        <div
          className={[
            "hero-avatar-container",
            heroVideoReady ? "is-ready" : "",
            heroParticleDone ? "is-particle-done" : "",
            heroVideoFailed ? "is-fallback" : ""
          ]
            .filter(Boolean)
            .join(" ")}
        >
          <img
            className="hero-avatar-placeholder"
            src={heroCharacterPosterAsset}
            alt=""
            aria-hidden="true"
          />
          {heroVideoReady && !heroParticleDone && !heroVideoFailed ? (
            <ParticleReveal
              className="hero-avatar-particle-reveal"
              imageSrc={heroCharacterPosterAsset}
              particleSize={1.65}
              density={4}
              scatter={132}
              gatherDuration={1450}
              stagger={260}
              onComplete={handleHeroParticleComplete}
            />
          ) : null}
          <video
            ref={heroVideoRef}
            className="hero-avatar-video"
            poster={heroCharacterPosterAsset}
            autoPlay
            loop
            muted
            playsInline
            preload="metadata"
            onCanPlay={() => {
              setHeroVideoFailed(false);
              setHeroVideoReady(true);
            }}
            onTimeUpdate={handleHeroTimeUpdate}
            onError={handleHeroMediaError}
            aria-label="角色从查看手机到抬手指向下方的循环动画"
          >
            <source src={heroCharacterWebmAsset} type="video/webm" />
            <source src={heroCharacterMp4Asset} type="video/mp4" />
          </video>
        </div>

        <aside className="hero-profile-card" aria-label="张远博个人档案">
          <div className="profile-card-header">
            <span>PROFILE / 交付档案</span>
            <span>2026</span>
          </div>
          <div className="profile-card-row">
            <span className="profile-key">NAME</span>
            <span className="profile-value">张远博</span>
          </div>
          <div className="profile-card-row">
            <span className="profile-key">ROLE</span>
            <span className="profile-value">AI 工作流工程师 / FDE</span>
          </div>
          <div className="profile-card-row">
            <span className="profile-key">BASE</span>
            <span className="profile-value">杭州 · 中国</span>
          </div>
          <div className="profile-card-row">
            <span className="profile-key">FOCUS</span>
            <span className="profile-value">内容运营 / 电商视觉 / Agent 原型</span>
          </div>
          <div className="profile-card-row">
            <span className="profile-key">STATUS</span>
            <span className="profile-value status-available">
              <i className="profile-status-dot" aria-hidden="true" />
              <span>可接项目 / 随时到岗</span>
            </span>
          </div>
          <div className="profile-card-row">
            <span className="profile-key">CONTACT</span>
            <a className="profile-value profile-email" href="mailto:1425514532@qq.com">
              1425514532@qq.com
            </a>
          </div>
        </aside>

        <a className="hero-scroll-hint" href="#resume-core-stack" aria-label="向下滚动，查看完整交付档案">
          <ChevronDown className="scroll-arrow" size={18} aria-hidden="true" />
          <span>向下滚动 · 查看完整交付档案</span>
        </a>
      </section>

      <section className="resume-system-sequence" aria-label="个人能力与项目档案">
        <CoreCapabilityStack sharedBackdrop />

        <ProjectArchiveSection onOpenProject={openProject} />
      </section>

      <section
        ref={directorRef}
        className={`resume-screen cap-stack-section is-in has-shared-backdrop resume-director${directorVisible ? " is-visible" : ""}`}
        id="resume-director"
        aria-labelledby="resume-director-title"
      >
        <span className="cap-stack-bg-grid" aria-hidden="true" />
        <span className="cap-hud cap-hud-tl" aria-hidden="true" />
        <span className="cap-hud cap-hud-tr" aria-hidden="true" />
        <span className="cap-hud cap-hud-bl" aria-hidden="true" />
        <span className="cap-hud cap-hud-br" aria-hidden="true" />
        <div className="cap-stack-shell resume-director-shell">
          <div className="resume-director-stage">
            <div className="resume-director-composition">
              <div className="resume-director-editorial">
                <div className="resume-section-header">
                  <SectionKicker index="04" label="AI Video Direction" />
                  <h2 id="resume-director-title">AI导演作品集</h2>
                  <p>从 9 部 AI 漫剧样片中精选 3 部重点作品，并保留 6 部可播放样片，展示从剧情拆解、分镜统筹到成片交付的导演能力。</p>
                  <div className="resume-director-inline-flow" aria-label="导演工作流">
                    <span>创意构思</span>
                    <span>分镜设计</span>
                    <span>提示词优化</span>
                    <span>画面生成</span>
                    <span>镜头衔接</span>
                    <span>后期剪辑</span>
                  </div>
                </div>

                <div className="resume-director-editorial-note">
                  <span>DIRECTOR&apos;S DECK / AI VIDEO</span>
                  <strong>把叙事拆成镜头，把镜头变成可交付的影像资产。</strong>
                </div>

                <div className="resume-director-metrics" aria-label="导演作品集概览">
                  <div>
                    <strong>120min+</strong>
                    <span>长片级交付</span>
                  </div>
                  <div>
                    <strong>7D</strong>
                    <span>最快交付周期</span>
                  </div>
                  <div>
                    <strong>09</strong>
                    <span>样片归档</span>
                  </div>
                </div>
              </div>

              <div className="resume-director-card-swap-zone">
                <div className="resume-director-card-swap-caption">
                  <span>CARDS / AUTO ROTATE</span>
                  <strong>悬停暂停 · 点击播放</strong>
                </div>
                <CardSwap
                  width={620}
                  height={440}
                  cardDistance={72}
                  verticalDistance={48}
                  delay={5200}
                  pauseOnHover
                  skewAmount={2}
                  enabled={directorVisible}
                  aria-label="AI导演作品卡片轮换"
                >
                  {directorWorks.map((work, index) => (
                    <DirectorWorkCard work={work} index={index} onPlay={setActiveDirectorWork} key={work.title} />
                  ))}
                </CardSwap>
              </div>
            </div>

            <div className="resume-director-library-head">
              <span>MORE WORKS / SAMPLE LIBRARY</span>
              <strong>6 部补充样片 · 点击封面播放</strong>
            </div>
            <DirectorReel clips={directorReelClips} onPlay={setActiveDirectorWork} />
          </div>
        </div>
      </section>

      <div className="resume-rear-area">
        <span className="cap-stack-bg-grid" aria-hidden="true" />
        <span className="cap-hud cap-hud-tl" aria-hidden="true" />
        <span className="cap-hud cap-hud-tr" aria-hidden="true" />
        <span className="cap-hud cap-hud-bl" aria-hidden="true" />
        <span className="cap-hud cap-hud-br" aria-hidden="true" />

        <RearScreen id="resume-delivery" className="resume-delivery">
          <div className="resume-rear-module">
            <div className="resume-section-header">
              <SectionKicker index="05" label="DELIVERY & COLLABORATION" />
              <h2 id="resume-delivery-title">交付与合作</h2>
              <p>
                从这里开始进入收尾区：说明我能独立交付的 AI 工作流、需要研发协作的边界，以及更适合合作的团队类型与联系方式。
              </p>
            </div>

            <h3 className="resume-rear-module-title">交付边界与工具栈</h3>

            <div className="resume-delivery-grid">
              <article className="resume-delivery-card resume-boundary-card">
                <span>DELIVERABLE</span>
                <h3>我能独立完成</h3>
                <ul className="resume-delivery-scope-list">
                  {independentScopes.map((item) => (
                    <li key={item}>
                      <CheckCircle2 size={14} aria-hidden="true" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </article>

              <article className="resume-delivery-card resume-boundary-card is-collaboration">
                <span>COLLAB REQUIRED</span>
                <h3>需要研发协作</h3>
                <ul>
                  {collaborationScopes.map((item) => (
                    <li key={item}>
                      <Rocket size={14} aria-hidden="true" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </article>

              <aside className="resume-delivery-tools" aria-label="工具栈">
                <span>TOOLS & PLATFORM</span>
                <h3>工具栈</h3>
                <div className="resume-delivery-tool-grid">
                  {toolGroups.map((group) => (
                    <article className="resume-delivery-tool-card" key={group.title}>
                      <div>
                        <Cpu size={15} aria-hidden="true" />
                        <h4>{group.title}</h4>
                      </div>
                      <p>{group.tools.join(" · ")}</p>
                    </article>
                  ))}
                </div>
              </aside>
            </div>
          </div>
        </RearScreen>

        <RearScreen id="resume-team-fit" className="resume-team-fit">
          <div className="resume-rear-module">
            <div className="resume-section-header">
              <SectionKicker index="06" label="TEAM FIT" />
              <h2 id="resume-team-fit-title">适配团队</h2>
              <p>
                更适合需要 AI 工作流落地、内容生产提效、AIGC 项目执行和前沿工具验证的团队。
              </p>
              <div className="resume-director-inline-flow" aria-label="合作切入环节">
                <span>需求沟通</span>
                <span>场景拆解</span>
                <span>原型验证</span>
                <span>脚本执行</span>
                <span>复盘沉淀</span>
              </div>
            </div>

            <div className="resume-team-grid" aria-label="适配团队">
              {teamFitItems.map((item, index) => (
                <article className="resume-team-card" key={item.title}>
                  <div>
                    <span>{String(index + 1).padStart(2, "0")}</span>
                    <Briefcase size={16} aria-hidden="true" />
                  </div>
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                </article>
              ))}
            </div>
          </div>
        </RearScreen>

        <RearScreen id="resume-contact" className="resume-contact resume-contact-final">
          <div className="resume-rear-module">
            <div className="resume-section-header">
              <SectionKicker index="07" label="CONTACT" />
              <h2 id="resume-contact-title">联系方式</h2>
              <p>
                如果你正在把 AI 工具接入真实业务流程，我更适合从流程拆解、原型验证、脚本执行和复盘沉淀这些环节切入。
              </p>
              <div className="resume-director-inline-flow" aria-label="协作启动流程">
                <span>邮件沟通</span>
                <span>需求确认</span>
                <span>原型 demo</span>
                <span>协作启动</span>
                <span>复盘沉淀</span>
              </div>
            </div>

            <div className="resume-contact-final-layout resume-contact-final-layout--centered">
              <div className="resume-contact-chips" aria-label="适合沟通方向">
                <span>AI 工作流落地</span>
                <span>AIGC 内容生产</span>
                <span>电商视觉自动化</span>
                <span>Agent 原型验证</span>
                <span>FDE 前沿部署</span>
              </div>

              <div className="resume-contact-contact-row" aria-label="联系方式">
                <article className="resume-contact-mini-card is-primary">
                  <span>邮箱</span>
                  <strong>1425514532@qq.com</strong>
                  <p>适合直接发送岗位、合作或项目沟通。</p>
                </article>
                <article className="resume-contact-mini-card">
                  <span>所在地</span>
                  <strong>中国 · 杭州</strong>
                  <p>方便线下沟通 AI、内容和自动化相关项目。</p>
                </article>
                <article className="resume-contact-mini-card">
                  <span>到岗时间</span>
                  <strong>随时</strong>
                  <p>可以较快进入项目、原型和协作讨论。</p>
                </article>
                <a className="resume-contact-mini-card resume-contact-mini-card-action is-action" href="mailto:1425514532@qq.com">
                  <span>联系我</span>
                  <strong>立即发邮件</strong>
                  <p>如果你想直接推进合作，点这里就行。</p>
                </a>
              </div>

              <p className="resume-contact-closing-line">把工具接入流程，把流程变成可复用的系统。</p>
            </div>
          </div>
        </RearScreen>
      </div>

      <footer className="resume-footer">
        <span>CANDIDATE PORTFOLIO · AI WORKFLOW CASE STUDIES</span>
      </footer>
      {activeDirectorWork && (
        <div
          className="resume-video-modal"
          role="dialog"
          aria-modal="true"
          aria-label={activeDirectorWork.title + "精选片段"}
          onClick={() => setActiveDirectorWork(null)}
        >
          <div
            className={`resume-video-modal-panel is-${activeDirectorWork.format}`}
            onClick={(event) => event.stopPropagation()}
          >
            <div className="resume-video-modal-head">
              <div>
                <span>{activeDirectorWork.type}</span>
                <h3>{activeDirectorWork.title}</h3>
                <p>{activeDirectorWork.duration} · {activeDirectorWork.status}</p>
              </div>
              <button type="button" onClick={() => setActiveDirectorWork(null)} aria-label="关闭视频预览">
                <X size={18} aria-hidden="true" />
              </button>
            </div>
            <video className="resume-video-modal-player" controls autoPlay playsInline poster={activeDirectorWork.posterSrc}>
              <source src={activeDirectorWork.videoSrc} type="video/mp4" />
              当前浏览器不支持视频播放。
            </video>
          </div>
        </div>
      )}
      {activeImagePreview && (
        <div
          className="resume-image-modal"
          role="dialog"
          aria-modal="true"
          aria-label={`${activeImagePreview.title} 原图预览`}
          onClick={() => setActiveImagePreview(null)}
        >
          <div className="resume-image-modal-panel" onClick={(event) => event.stopPropagation()}>
            <div className="resume-video-modal-head">
              <div>
                <span>IMAGE PREVIEW</span>
                <h3>{activeImagePreview.title}</h3>
                <p>{activeImagePreview.description}</p>
              </div>
              <button type="button" onClick={() => setActiveImagePreview(null)} aria-label="关闭图片预览">
                <X size={20} aria-hidden="true" />
              </button>
            </div>
            <img className="resume-image-modal-media" src={activeImagePreview.src} alt={`${activeImagePreview.title} 原图`} />
          </div>
        </div>
      )}
      {activeProjectSlug && (
        <div className="resume-project-overlay" role="dialog" aria-modal="true">
          <ProjectCasePage slug={activeProjectSlug} onClose={closeProject} />
        </div>
      )}
    </main>
  );
}
