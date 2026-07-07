import { useEffect, useRef, useState } from "react";
import type { CSSProperties } from "react";
import {
  Bot,
  Briefcase,
  CheckCircle2,
  Cpu,
  Image as ImageIcon,
  Mail,
  MapPin,
  PlayCircle,
  Rocket,
  Workflow,
  X
} from "lucide-react";
import avatarOrbAsset from "./assets/cyber/avatar-orb.png";
import candidateAvatarAsset from "./assets/generated/portfolio/candidate-avatar.png";
import heroLockBgAsset from "./assets/generated/portfolio/hero-lock-bg.png";
import heroLockVideoAsset from "./assets/static/media/hero/hero-lockscreen-bg.mp4";
import idBadgeAsset from "./assets/static/media/hero/id-badge.png";
import section2CityBgAsset from "./assets/static/media/section2-city-bg.png";
import CoreCapabilityStack from "./CoreCapabilityStack";
import Dock from "./Dock";
import PixelTrail from "./PixelTrail";
import Section2Ambient from "./Section2Ambient";
// @ts-expect-error -- TiltedCard is copied in as a plain JSX module.
import TiltedCard from "./TiltedCard";
import ProjectCasePage, { hasProjectCase } from "./ProjectCasePage";
import "./resume-page.css";
import "./core-capability-stack.css";
import "./pixel-trail.css";

type CssVars = CSSProperties & Record<`--${string}`, string>;

const contactPhone = "17564138094";
type ResumeNavItem = {
  label: string;
  href: string;
};

const resumeNavItems: ResumeNavItem[] = [
  { label: "首页", href: "#resume-hero" },
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
};

type DirectorReelClip = Pick<DirectorWork, "title" | "duration" | "videoSrc" | "posterSrc">;

type ImagePreview = {
  title: string;
  description: string;
  src: string;
};



const archiveProjects = [
  {
    index: "01",
    detailSlug: "ai-content-ops",
    title: "AI 自媒体运营工作台",
    label: "AI Content Ops Workbench",
    summary: "从一个选题出发，结合私有资料库、Obsidian、历史成文和联网搜索，生成可审核的多平台内容包。",
    problem: "自媒体创作者多平台发文时，需要反复查资料、改写、排版、复用历史内容和做发布前检查。",
    flow: "选题输入→私有资料检索→联网搜索证据→多平台草稿→发布前审核包→Obsidian / 历史沉淀。",
    proof: "创作台、私有资料库、Obsidian 同步、历史记录、发布中心和审核包已形成可演示流程。",
    tags: ["Vue", "FastAPI", "Obsidian", "Research Bundle"]
  },
  {
    index: "02",
    detailSlug: "ecommerce-aigc-workflow",
    title: "服装电商主图 / 宣传视频生成工作流",
    label: "E-commerce AIGC Workflow",
    summary: "从服装参考图、平台规格、风格选择到主图候选、人工复核、视频延展。",
    problem: "服装电商主图 / 宣传视频需要同时处理服装参考图、平台规格和风格选择。",
    flow: "服装参考图→平台规格→风格选择→主图候选→人工复核→视频延展。",
    proof: "工作流配置、批量主图、图生视频和完整演示均已归档为可查看证据。",
    tags: ["主推项目", "电商视觉", "批量生成"]
  },
  {
    index: "03",
    detailSlug: "aigc-console",
    title: "AI 漫剧 / 视频生产控制台",
    label: "AIGC Production Console",
    summary: "把小说分析、资产确认、提示词、视频任务与失败复盘整理成本地控制台。",
    problem: "AI 漫剧 / 视频生产需要把小说分析、资产确认、提示词、视频任务与失败复盘集中管理。",
    flow: "小说分析→资产确认→提示词→视频任务→失败复盘→本地控制台。",
    proof: "控制台截图、Dify 资产分析和任务质检截图已作为项目证据归档。",
    tags: ["AIGC", "控制台", "任务复盘"]
  },
  {
    index: "04",
    detailSlug: "automation-scripts",
    title: "自媒体运营自动化脚本集",
    label: "Ops Automation Scripts",
    summary: "把重复网页动作拆成规则、执行状态和人工确认节点，服务运营提效。",
    problem: "自媒体运营里存在重复网页动作，需要拆成规则、执行状态和人工确认节点。",
    flow: "重复网页动作→规则拆解→执行状态→人工确认节点→运营流程。",
    proof: "本地脚本演示视频已归档；敏感动作保留人工确认，不做全自动发布。",
    tags: ["浏览器自动化", "运营提效", "脚本"]
  },
  {
    index: "05",
    detailSlug: "knowledge-base",
    title: "个人知识沉淀 / AI 知识库系统",
    label: "Knowledge Workflow",
    summary: "用 Hermes 与 Obsidian 把对话、复盘、项目经验和待办沉淀成知识资产。",
    problem: "对话、复盘、项目经验和待办需要沉淀成知识资产。",
    flow: "Hermes 与 Obsidian→对话整理→复盘整理→项目经验 / 待办沉淀→知识资产。",
    proof: "Obsidian 关系图谱与知识沉淀流程已作为可查看证据归档。",
    tags: ["Hermes", "Obsidian", "知识库"]
  },
  {
    index: "06",
    detailSlug: "boss-job-collector",
    title: "BOSS 岗位收藏脚本",
    label: "BOSS Job Collector",
    summary: "把岗位搜索、条件过滤、信息提取、本地记录和人工筛选串成可复盘流程。",
    problem: "求职筛选需要反复打开岗位、比对条件和记录状态，人工整理容易遗漏。",
    flow: "岗位搜索→条件过滤→信息提取→本地记录→人工筛选→复盘优化。",
    proof: "本地脚本演示视频与岗位信息记录流程；不包含自动沟通、批量投递或账号托管。",
    tags: ["浏览器自动化", "求职流程", "人工筛选"]
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
    title: "核动力马",
    type: "AIGC Comic Drama",
    description: "负责视觉设定、镜头节奏和提示词迭代，完成具有强世界观包装的 AI 漫剧片段。",
    role: ["创意设定", "分镜设计", "镜头提示词", "剪辑节奏"],
    tools: ["ChatGPT", "Claude", "即梦", "Seedance", "剪映"],
    status: "精选片段预览",
    duration: "精选 00:24",
    videoSrc: new URL("./assets/static/media/director/nuclear-horse.mp4", import.meta.url).href,
    posterSrc: new URL("./assets/static/media/director/nuclear-horse.jpg", import.meta.url).href
  },
  {
    title: "圣子归来",
    type: "AI Narrative Video",
    description: "围绕人物登场、剧情冲突和氛围镜头组织片段，提升叙事连贯性和短剧观看节奏。",
    role: ["剧情拆解", "分镜脚本", "生图 / 生视频", "镜头衔接"],
    tools: ["Claude", "即梦", "Seedance", "CapCut"],
    status: "精选片段预览",
    duration: "精选 00:23",
    videoSrc: new URL("./assets/static/media/director/saint-returns.mp4", import.meta.url).href,
    posterSrc: new URL("./assets/static/media/director/saint-returns.jpg", import.meta.url).href
  },
  {
    title: "真人demo",
    type: "AI Live-action Demo",
    description: "以真人影像质感为目标，测试 AI 视频的镜头调度、画面筛选和后期包装流程。",
    role: ["风格设定", "提示词优化", "画面筛选", "后期包装"],
    tools: ["ChatGPT", "Seedance", "剪映"],
    status: "精选片段预览",
    duration: "精选 00:19",
    videoSrc: new URL("./assets/static/media/director/live-action-demo.mp4", import.meta.url).href,
    posterSrc: new URL("./assets/static/media/director/live-action-demo.jpg", import.meta.url).href
  }
];

const directorReelClips: DirectorReelClip[] = [
  {
    title: "AI 影像片段 01",
    duration: "00:25",
    videoSrc: new URL("./assets/static/media/director/reel/director-reel-01.mp4", import.meta.url).href,
    posterSrc: new URL("./assets/static/media/director/reel/director-reel-01.jpg", import.meta.url).href
  },
  {
    title: "AI 影像片段 02",
    duration: "00:24",
    videoSrc: new URL("./assets/static/media/director/reel/director-reel-02.mp4", import.meta.url).href,
    posterSrc: new URL("./assets/static/media/director/reel/director-reel-02.jpg", import.meta.url).href
  },
  {
    title: "AI 影像片段 03",
    duration: "00:21",
    videoSrc: new URL("./assets/static/media/director/reel/director-reel-03.mp4", import.meta.url).href,
    posterSrc: new URL("./assets/static/media/director/reel/director-reel-03.jpg", import.meta.url).href
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
        <p>{"\u9009\u62e9\u4e00\u4e2a\u9879\u76ee\u6863\u6848\uff0c\u67e5\u770b\u4e1a\u52a1\u95ee\u9898\u3001\u5de5\u4f5c\u6d41\u52a8\u4f5c\u3001\u53ef\u5c55\u793a\u8bc1\u636e\u4e0e\u4ea4\u4ed8\u8fb9\u754c\u3002"}</p>
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
              aria-label={isCenter ? `??${project.title}` : `???${project.title}`}
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
      type: "AI Reel Reserve",
      description: "第 4 屏横向循环作品储备片段，用于快速查看更多 AI 影像输出。",
      role: [],
      tools: [],
      status: "循环片段预览"
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
            {clips.map((clip, clipIndex) => (
              <button
                className="resume-director-reel-item"
                type="button"
                onClick={() => openClip(clip)}
                tabIndex={groupIndex === 1 ? -1 : undefined}
                aria-label={"播放 " + clip.title}
                key={groupIndex + "-" + clip.title}
              >
                <video
                  className="resume-director-reel-video"
                  src={clip.videoSrc}
                  poster={clip.posterSrc}
                  muted
                  autoPlay
                  loop
                  playsInline
                  preload="metadata"
                />
                <span className="resume-director-reel-meta" aria-hidden="true">
                  <span>{"R0" + (clipIndex + 1)}</span>
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
  const [isLoaded, setIsLoaded] = useState(false);
  const [activeDirectorWork, setActiveDirectorWork] = useState<DirectorWork | null>(null);
  const [activeImagePreview, setActiveImagePreview] = useState<ImagePreview | null>(null);
  const [activeProjectSlug, setActiveProjectSlug] = useState<string | null>(null);
  const [activeNavHref, setActiveNavHref] = useState("#resume-hero");
  const heroRef = useRef<HTMLElement | null>(null);
  const heroPanelRef = useRef<HTMLDivElement | null>(null);
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
      const nextHash = window.location.hash || "#resume-hero";
      if (resumeNavItems.some((item) => item.href === nextHash)) {
        setActiveNavHref(nextHash);
      }
    };

    syncNavHash();
    window.addEventListener("hashchange", syncNavHash);
    return () => window.removeEventListener("hashchange", syncNavHash);
  }, []);

  useEffect(() => {
    let secondFrame: number | null = null;
    const firstFrame = window.requestAnimationFrame(() => {
      secondFrame = window.requestAnimationFrame(() => {
        setIsLoaded(true);
      });
    });

    return () => {
      window.cancelAnimationFrame(firstFrame);
      if (secondFrame !== null) {
        window.cancelAnimationFrame(secondFrame);
      }
    };
  }, []);

  // Hero 桌面端鼠标视差:pointermove 记录目标值,rAF lerp 平滑,写入 CSS variables
  // - 移动端(<=767px)与 prefers-reduced-motion: reduce 都早退,不绑事件、不起 rAF
  // - 鼠标离开 → 平滑归零
  useEffect(() => {
    const node = heroRef.current;
    if (!node) return;

    // 早退:粗指针 / 窄屏 / 减少动效
    const mqlReduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    const mqlNarrow = window.matchMedia("(max-width: 767px)");
    const mqlCoarse = window.matchMedia("(pointer: coarse)");
    if (mqlReduce.matches || mqlNarrow.matches || mqlCoarse.matches) {
      node.style.setProperty("--hero-mx", "0");
      node.style.setProperty("--hero-my", "0");
      node.style.setProperty("--hero-tilt-x", "0deg");
      node.style.setProperty("--hero-tilt-y", "0deg");
      node.style.setProperty("--hero-pan-x", "0px");
      node.style.setProperty("--hero-pan-y", "0px");
      node.style.setProperty("--hero-panel-tilt-x", "0deg");
      node.style.setProperty("--hero-panel-tilt-y", "0deg");
      node.style.setProperty("--hero-panel-shift-x", "0px");
      node.style.setProperty("--hero-panel-shift-y", "0px");
      heroPanelRef.current?.style.setProperty("--hero-panel-tilt-x", "0deg");
      heroPanelRef.current?.style.setProperty("--hero-panel-tilt-y", "0deg");
      heroPanelRef.current?.style.setProperty("--hero-panel-shift-x", "0px");
      heroPanelRef.current?.style.setProperty("--hero-panel-shift-y", "0px");
      return;
    }

    // 目标 (-1, 1),当前 (-1, 1) — 用 lerp 缓慢追
    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;
    const lerp = 0.08;
    const epsilon = 0.001;
    let raf: number | null = null;
    let stillFrames = 0;

    const writeVars = (): void => {
      // 全局位移强度因子,所有具体动画在 CSS 里再乘自己的最大幅度
      node.style.setProperty("--hero-mx", currentX.toFixed(4));
      node.style.setProperty("--hero-my", currentY.toFixed(4));
      // 给 CSS 现成的角度/像素值,避免 calc 链太长
      node.style.setProperty("--hero-tilt-x", `${(currentY * -2.5).toFixed(3)}deg`);
      node.style.setProperty("--hero-tilt-y", `${(currentX * 2.5).toFixed(3)}deg`);
      node.style.setProperty("--hero-pan-x", `${(currentX * 12).toFixed(2)}px`);
      node.style.setProperty("--hero-pan-y", `${(currentY * 12).toFixed(2)}px`);
      const panelTiltX = `${(currentY * -5.2).toFixed(3)}deg`;
      const panelTiltY = `${(currentX * 5.2).toFixed(3)}deg`;
      const panelShiftX = `${(currentX * 8).toFixed(2)}px`;
      const panelShiftY = `${(currentY * 5).toFixed(2)}px`;
      node.style.setProperty("--hero-panel-tilt-x", panelTiltX);
      node.style.setProperty("--hero-panel-tilt-y", panelTiltY);
      node.style.setProperty("--hero-panel-shift-x", panelShiftX);
      node.style.setProperty("--hero-panel-shift-y", panelShiftY);
      const panelNode = heroPanelRef.current;
      if (panelNode) {
        panelNode.style.setProperty("--hero-panel-tilt-x", panelTiltX);
        panelNode.style.setProperty("--hero-panel-tilt-y", panelTiltY);
        panelNode.style.setProperty("--hero-panel-shift-x", panelShiftX);
        panelNode.style.setProperty("--hero-panel-shift-y", panelShiftY);
      }
    };

    const tick = (): void => {
      const dx = targetX - currentX;
      const dy = targetY - currentY;
      currentX += dx * lerp;
      currentY += dy * lerp;
      writeVars();
      // 接近静止时,跳出循环节省 CPU
      if (Math.abs(dx) < epsilon && Math.abs(dy) < epsilon) {
        stillFrames += 1;
        if (stillFrames >= 6) {
          // snap 归位再退出
          currentX = targetX;
          currentY = targetY;
          writeVars();
          raf = null;
          return;
        }
      } else {
        stillFrames = 0;
      }
      raf = window.requestAnimationFrame(tick);
    };

    const ensureRunning = (): void => {
      if (raf === null) {
        raf = window.requestAnimationFrame(tick);
      }
    };

    const handlePointerMove = (e: PointerEvent): void => {
      if (e.pointerType === "touch") return;
      const rect = node.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;
      // 映射到 (-1, 1),边角取 ±1
      targetX = Math.max(-1, Math.min(1, x * 2 - 1));
      targetY = Math.max(-1, Math.min(1, y * 2 - 1));
      ensureRunning();
    };

    const handlePointerLeave = (): void => {
      targetX = 0;
      targetY = 0;
      // 强制贴近 0,避免 lerp 长尾停在 ~0.05deg
      if (Math.abs(currentX) < 0.06 && Math.abs(currentY) < 0.06) {
        currentX = 0;
        currentY = 0;
        writeVars();
        return;
      }
      ensureRunning();
    };

    // 媒体查询变化时(用户切换深色模式 / 改系统设置)实时同步,简单粗暴重渲染
    const handleMediaChange = (): void => {
      if (mqlReduce.matches || mqlNarrow.matches || mqlCoarse.matches) {
        targetX = 0;
        targetY = 0;
        ensureRunning();
      }
    };

    node.addEventListener("pointermove", handlePointerMove);
    node.addEventListener("pointerleave", handlePointerLeave);
    mqlReduce.addEventListener?.("change", handleMediaChange);
    mqlNarrow.addEventListener?.("change", handleMediaChange);
    mqlCoarse.addEventListener?.("change", handleMediaChange);
    // 初始化变量
    writeVars();

    return () => {
      node.removeEventListener("pointermove", handlePointerMove);
      node.removeEventListener("pointerleave", handlePointerLeave);
      mqlReduce.removeEventListener?.("change", handleMediaChange);
      mqlNarrow.removeEventListener?.("change", handleMediaChange);
      mqlCoarse.removeEventListener?.("change", handleMediaChange);
      if (raf !== null) window.cancelAnimationFrame(raf);
    };
  }, []);

  function showContactPhone(): void {
    window.alert(`联系方式：${contactPhone}`);
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
      {/* Global pixel trail layer */}
      <PixelTrail />
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
        <a className="resume-nav-brand" href="#resume-hero" aria-label="返回首页">
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
        id="resume-hero"
        ref={heroRef}
        className={`resume-hero resume-screen resume-lockscreen resume-hero--overlay${isLoaded ? " is-loaded" : ""}`}
        aria-labelledby="resume-hero-title"
      >
        <video
          className="resume-lock-bg-video"
          src={heroLockVideoAsset}
          poster={heroLockBgAsset}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          aria-hidden="true"
        />
        <img className="resume-lock-bg-asset" src={heroLockBgAsset} alt="" aria-hidden="true" />
        <div className="resume-lock-frame" aria-hidden="true" />

        <div className="resume-hero-overlay" aria-hidden="true">
          <span className="resume-hero-hud resume-hero-hud-tl" />
          <span className="resume-hero-hud resume-hero-hud-tr" />
          <span className="resume-hero-hud resume-hero-hud-bl" />
          <span className="resume-hero-hud resume-hero-hud-br" />
        </div>

        <div className="resume-hero-stage">
          {/* 主身份 HUD 面板 */}
          <div ref={heroPanelRef} className="resume-hero-panel" role="group" aria-labelledby="resume-hero-title">
            <span className="resume-hero-panel-aura" aria-hidden="true" />
            <span className="resume-hero-panel-frame resume-hero-panel-frame--outer" aria-hidden="true" />
            <span className="resume-hero-panel-rim" aria-hidden="true" />
            <span className="resume-hero-panel-node resume-hero-panel-node--top" aria-hidden="true" />
            <span className="resume-hero-panel-node resume-hero-panel-node--bottom" aria-hidden="true" />
            <span className="resume-hero-panel-node resume-hero-panel-node--left" aria-hidden="true" />
            <span className="resume-hero-panel-node resume-hero-panel-node--right" aria-hidden="true" />
            <span className="resume-hero-panel-scanlines" aria-hidden="true" />

            {/* Left: round avatar orb with bottom-up projection beam */}
            <TiltedCard
              rotateAmplitude={14}
              scaleOnHover={1.06}
              captionText="ID·ZYB-2024 · AI Workflow Engineer"
              containerWidth="100%"
              contentWidth="100%"
              className="resume-avatar-orb-tilt"
            >
              <div className="resume-avatar-orb" aria-hidden="true">
              <div className="resume-avatar-ring">
                <span className="resume-avatar-ring-glow" aria-hidden="true" />
                <span className="resume-avatar-ring-outer" aria-hidden="true" />
                <span className="resume-avatar-ring-track" aria-hidden="true" />
                <span className="resume-avatar-ring-inner" aria-hidden="true" />
                <svg className="resume-avatar-ring-arc" viewBox="0 0 100 100" aria-hidden="true" preserveAspectRatio="xMidYMid meet">
                  <path d="M 50 8 A 42 42 0 0 0 8 50" fill="none" stroke="rgba(21,247,255,0.85)" strokeWidth="0.8" strokeLinecap="round" />
                  <path d="M 50 92 A 42 42 0 0 0 92 50" fill="none" stroke="rgba(255,77,255,0.7)" strokeWidth="0.8" strokeLinecap="round" />
                  <line x1="50" y1="3" x2="50" y2="7" stroke="rgba(21,247,255,0.85)" strokeWidth="0.8" />
                  <line x1="50" y1="93" x2="50" y2="97" stroke="rgba(21,247,255,0.85)" strokeWidth="0.8" />
                  <line x1="3" y1="50" x2="7" y2="50" stroke="rgba(21,247,255,0.85)" strokeWidth="0.8" />
                  <line x1="93" y1="50" x2="97" y2="50" stroke="rgba(21,247,255,0.85)" strokeWidth="0.8" />
                </svg>
                <span className="resume-avatar-ring-tag" aria-hidden="true">
                  <i className="resume-avatar-ring-tag-led" />
                  <span>ID-2024</span>
                </span>
                <span className="resume-avatar-ring-tag resume-avatar-ring-tag--right" aria-hidden="true">
                  <i className="resume-avatar-ring-tag-led resume-avatar-ring-tag-led--mag" />
                  <span>SYNC·OK</span>
                </span>
                <div className="resume-avatar-portrait-wrap">
                  <span className="resume-avatar-portrait-rim" aria-hidden="true" />
                  <span className="resume-avatar-portrait-toplight" aria-hidden="true" />
                  <img
                    src={candidateAvatarAsset}
                    className="resume-avatar-portrait"
                    alt=""
                    draggable={false}
                  />
                </div>
              </div>

              <div className="resume-avatar-beam">
                <span className="resume-avatar-beam-shaft" />
                <span className="resume-avatar-beam-dust" />
                <span className="resume-avatar-beam-glow" />
              </div>

              <div className="resume-avatar-pedestal">
                <span className="resume-avatar-pedestal-water" />
                <span className="resume-avatar-pedestal-halo" />
                <span className="resume-avatar-pedestal-disc resume-avatar-pedestal-disc--outer" />
                <span className="resume-avatar-pedestal-disc resume-avatar-pedestal-disc--mid" />
                <span className="resume-avatar-pedestal-flow" />
              </div>
            </div>

            </TiltedCard>

            {/* 右侧:身份信息 */}
            <div className="resume-hero-info">
              <span className="resume-hero-kicker" aria-hidden="true">
                <em>01</em>
                <i />
                <span>HOME · YUANBO ZHANG</span>
              </span>
              <h1 id="resume-hero-title">张远博</h1>
              <h2>AI 应用开发 / FDE / AI 工作流落地</h2>

              <ul className="resume-hero-chips" role="list">
                <li className="resume-hero-chip">
                  <MapPin size={12} aria-hidden="true" />
                  杭州
                </li>
                <li className="resume-hero-chip">
                  <Workflow size={12} aria-hidden="true" />
                  AI 应用落地
                </li>
                <li className="resume-hero-chip">
                  <ImageIcon size={12} aria-hidden="true" />
                  电商视觉生成
                </li>
                <li className="resume-hero-chip">
                  <Bot size={12} aria-hidden="true" />
                  自动化工作流
                </li>
              </ul>

              <div className="resume-hero-actions resume-hero-actions--overlay">
                <a className="resume-hero-btn resume-hero-btn--primary" href="#resume-project-archive">
                  <PlayCircle size={14} aria-hidden="true" />
                  查看项目
                </a>
                <button className="resume-hero-btn resume-hero-btn--ghost resume-hero-btn--contact" type="button" onClick={showContactPhone}>
                  <Mail size={14} aria-hidden="true" />
                  联系我
                </button>
              </div>
            </div>
          </div>

          {/* 右侧精选案例 HUD 卡 */}
          <TiltedCard
            rotateAmplitude={12}
            scaleOnHover={1.04}
            captionText="▶ 立即查看 · CASE 01"
            containerWidth="auto"
            contentWidth="100%"
            className="resume-hero-feature-tilt"
          >
            <aside className="resume-hero-feature" aria-label="精选案例">
            <span className="resume-hero-feature-aura" aria-hidden="true" />
            <span className="resume-hero-feature-rim" aria-hidden="true" />
            <div className="resume-hero-feature-head">
              <span className="resume-hero-feature-tag">精选案例</span>
              <a href="#resume-project-archive" aria-label="进入项目档案">
                →
              </a>
            </div>
            <button
              className="resume-hero-feature-preview"
              type="button"
              onClick={() => setActiveImagePreview(ecommerceScreenshots[0])}
              aria-label={`查看 ${ecommerceScreenshots[0].title}`}
            >
              <img src={ecommerceScreenshots[0].src} alt={ecommerceScreenshots[0].title} />
              <span className="resume-hero-feature-meta" aria-hidden="true">
                <span>CASE · 01</span>
                <span className="resume-hero-feature-meta-bar"><i style={{ width: "78%" }} /></span>
              </span>
            </button>
            <strong>AI 驱动内容生产引擎</strong>
            <p>生产 → 分发 → 复盘 → 优化</p>
            <span className="resume-hero-feature-dots" aria-hidden="true">
              <i />
              <i />
              <i />
              <i />
            </span>
            <a className="resume-hero-feature-go" href="#resume-project-archive">
              立即查看
              <span>→</span>
            </a>
            </aside>
          </TiltedCard>
        </div>

        <a className="resume-lock-scroll" href="#resume-core-stack" aria-label="继续向下浏览">
          <span />
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
          <div className="resume-section-header">
            <SectionKicker index="04" label="AI Video Direction" />
            <h2 id="resume-director-title">AI导演作品集</h2>
            <p>精选 3 个 AI 导演 / AIGC 漫剧作品，呈现从创意构思、分镜设计到画面生成与后期剪辑的完整能力。</p>
            <div className="resume-director-inline-flow" aria-label="导演工作流">
              <span>创意构思</span>
              <span>分镜设计</span>
              <span>提示词优化</span>
              <span>画面生成</span>
              <span>镜头衔接</span>
              <span>后期剪辑</span>
            </div>
          </div>

          <div className="resume-director-stage">
            <div className="resume-director-grid">
              {directorWorks.map((work, index) => (
                <DirectorWorkCard work={work} index={index} onPlay={setActiveDirectorWork} key={work.title} />
              ))}
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
          <div className="resume-video-modal-panel" onClick={(event) => event.stopPropagation()}>
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
