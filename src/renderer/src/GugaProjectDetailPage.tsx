import {
  AlertTriangle,
  ArrowLeft,
  CheckCircle2,
  Database,
  ExternalLink,
  FileText,
  Gauge,
  GitBranch,
  Image as ImageIcon,
  Layers,
  Lock,
  Search,
  ShieldCheck,
  Workflow
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { MouseEvent as ReactMouseEvent } from "react";
import "./guga-project-detail.css";

const resumeHref = getAppRouteHref("resume");

const screenshots = [
  {
    title: "产品台稳定演示",
    description: "三栏工作台：任务进度、Agent 对话、生成结果预览。",
    src: new URL("./assets/static/media/guga/guga-preview-demo.png", import.meta.url).href
  },
  {
    title: "技术台 artifact / metadata",
    description: "查看生成物文件、历史版本、审计、claim 和 provider 信息。",
    src: new URL("./assets/static/media/guga/guga-technical-demo.png", import.meta.url).href
  },
  {
    title: "发布前事实闸门",
    description: "有争议事实会阻止最终通过，待确认事实会进入 review 提醒。",
    src: new URL("./assets/static/media/guga/guga-prepublish-gate.png", import.meta.url).href
  },
  {
    title: "Provider 状态",
    description: "区分 provider 是否配置，以及普通 workflow 是否允许真实调用。",
    src: new URL("./assets/static/media/guga/guga-provider-status.png", import.meta.url).href
  },
  {
    title: "Task 18 真实 workflow 证据",
    description: "普通产品 workflow 成功真实调用 Sonnet 生成 1 次主稿。",
    src: new URL("./assets/static/media/guga/guga-task18-real-workflow-preview.png", import.meta.url).href
  },
  {
    title: "Task 18 artifact metadata",
    description: "主稿 metadata 记录 response_id、usage、elapsed_ms 和 provider_mode=real。",
    src: new URL("./assets/static/media/guga/guga-task18-real-workflow-metadata.png", import.meta.url).href
  }
];

const flowSteps = [
  "输入素材",
  "选题评分",
  "人工选题",
  "Research Bundle",
  "Sonnet 主稿",
  "质量闸门",
  "人工审稿",
  "多平台适配",
  "封面方案/生图",
  "发布前事实闸门",
  "本地发布包",
  "复盘记忆"
];

const problemPoints = [
  "普通自媒体自动化容易只停留在“让模型写一篇文章”。",
  "真正可用的流程需要选题、资料、写稿、审稿、封面、多平台适配和发布前检查。",
  "系统必须保留人工审核点，避免事实风险、品牌风险和误发布。"
];

const verifiedFacts = [
  {
    label: "Sonnet 主稿",
    value: "普通 workflow 已真实生成 1 次",
    detail: "model=claude-sonnet-4-6，response_id=chatcmpl-mqlre2k0vi4583，total_tokens=8685，elapsed_ms=33802。"
  },
  {
    label: "GPT Image 2 / LCONAI",
    value: "已真实生成 1 张封面样本",
    detail: "Task 16 只验证 1 张小红书封面，其他平台资产继续 skipped，避免批量消耗。"
  },
  {
    label: "安全开关",
    value: "默认已恢复关闭",
    detail: "GUGA_WORKFLOW_REAL_PROVIDER_ENABLED=false，普通 workflow 默认不自动扣费。"
  }
];

const highlights: Array<{ icon: LucideIcon; title: string; text: string }> = [
  {
    icon: Workflow,
    title: "任务中断后可恢复",
    text: "可恢复流程（LangGraph durable execution / interrupt）让选题、内容和发布包审核可以暂停后继续。"
  },
  {
    icon: FileText,
    title: "每一步产物可追踪",
    text: "生成物文件（artifact refs）保存主稿、平台草稿、质量报告、视觉计划和发布包。"
  },
  {
    icon: GitBranch,
    title: "人工审稿和版本回滚",
    text: "历史版本对比（history / diff / rollback）让人工修改能追踪，也能退回。"
  },
  {
    icon: ShieldCheck,
    title: "事实确认和发布前闸门",
    text: "事实确认（claim review）和发布前闸门（pre_publish_gate）把事实风险带到最终审核前。"
  },
  {
    icon: Gauge,
    title: "真实模型安全接入",
    text: "真实模型测试（provider smoke test / controlled workflow）必须显式确认，不让页面加载自动扣费。"
  },
  {
    icon: Database,
    title: "成本和调用记录可见",
    text: "模型名、response_id、usage 和 elapsed_ms 会写入 artifact metadata，方便复盘。"
  },
  {
    icon: Layers,
    title: "产品台和技术台分离",
    text: "产品展示（product preview）给面试官看结果，技术审稿（technical review）保留深度治理能力。"
  },
  {
    icon: ImageIcon,
    title: "默认封面路由",
    text: "不同平台有封面方案和 skipped 原因；有真实图片 provider 时可生成最小样本。"
  }
];

const boundaries = [
  "不是真实发布到小红书、公众号、抖音、X/Twitter。",
  "平台草稿仍有 placeholder/fallback 部分；Task 18 只验证真实主稿。",
  "本地 publish package 不等于真实发布。",
  "事实闸门不是自动判断真伪，而是结合人工状态做发布前阻断。",
  "默认不自动调用真实模型，避免误扣费。"
];

function getAppRouteHref(route = ""): string {
  const basePath = window.location.pathname
    .replace(/\/(?:resume|profile|projects\/ai-content-ops)\/?$/, "/")
    .replace(/\/index\.html$/, "/");
  const normalizedBase = basePath.endsWith("/") ? basePath : `${basePath}/`;
  return `${normalizedBase}${route}`;
}

export default function GugaProjectDetailPage({
  onClose
}: {
  onClose?: () => void;
}): JSX.Element {
  // overlay 模式(在简历页内打开):拦截返回链接,走客户端关闭而非整页跳转
  const handleBack = (e: ReactMouseEvent): void => {
    if (onClose) {
      e.preventDefault();
      onClose();
    }
  };

  return (
    <main className="guga-project-page" aria-label="AI 自媒体运营工作台项目详情页">
      <img className="guga-detail-hero-bg" src={screenshots[0].src} alt="" aria-hidden="true" />
      <nav className="guga-detail-nav" aria-label="项目详情导航">
        <a href={resumeHref} onClick={handleBack}>
          <ArrowLeft size={16} aria-hidden="true" />
          返回简历
        </a>
        <span>PROJECT CASE · AI CONTENT OPS</span>
      </nav>

      <section className="guga-detail-hero" aria-labelledby="guga-detail-title">
        <div className="guga-detail-kicker">
          <span>CASE STUDY</span>
          <strong>AI WORKFLOW / CONTENT OPS</strong>
        </div>
        <h1 id="guga-detail-title">AI 自媒体运营工作台</h1>
        <p className="guga-detail-lead">
          这是一个把长素材变成多平台内容包的 AI 内容生产工作流，重点不是全自动乱发，而是可审稿、可恢复、可回滚、可追踪成本和事实风险。
        </p>
        <div className="guga-detail-hero-actions" aria-label="页面主要入口">
          <a href="#guga-detail-flow">查看系统流程</a>
          <a href="#guga-detail-proof">查看证据截图</a>
        </div>
        <div className="guga-detail-signal-strip" aria-label="真实能力验证摘要">
          {verifiedFacts.map((item) => (
            <span key={item.label}>
              <b>{item.label}</b>
              {item.value}
            </span>
          ))}
        </div>
      </section>

      <section className="guga-detail-section guga-problem-section" aria-labelledby="guga-problem-title">
        <div className="guga-section-head">
          <span>01 / PROBLEM</span>
          <h2 id="guga-problem-title">我解决的问题</h2>
          <p>这个项目不是把模型输出包装成网页，而是把真实内容团队会遇到的审核、恢复、追踪和发布风险做进流程。</p>
        </div>
        <div className="guga-problem-grid">
          {problemPoints.map((item, index) => (
            <article key={item}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <p>{item}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="guga-detail-section" id="guga-detail-flow" aria-labelledby="guga-flow-title">
        <div className="guga-section-head">
          <span>02 / FLOW</span>
          <h2 id="guga-flow-title">系统流程</h2>
          <p>从输入素材到本地发布包，流程里有明确的人工确认点和事实风险检查。</p>
        </div>
        <div className="guga-flow-ladder">
          {flowSteps.map((step, index) => (
            <div className="guga-flow-step" key={step}>
              <em>{String(index + 1).padStart(2, "0")}</em>
              <strong>{step}</strong>
            </div>
          ))}
        </div>
      </section>

      <section className="guga-detail-section guga-verified-section" aria-labelledby="guga-verified-title">
        <div className="guga-section-head">
          <span>03 / VERIFIED</span>
          <h2 id="guga-verified-title">已验证真实能力</h2>
          <p>真实调用只做受控小样本，不把最小验证夸大成批量生产能力。</p>
        </div>
        <div className="guga-verified-grid">
          {verifiedFacts.map((item) => (
            <article key={item.label}>
              <CheckCircle2 size={20} aria-hidden="true" />
              <span>{item.label}</span>
              <h3>{item.value}</h3>
              <p>{item.detail}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="guga-detail-section" aria-labelledby="guga-highlight-title">
        <div className="guga-section-head">
          <span>04 / TECH HIGHLIGHTS</span>
          <h2 id="guga-highlight-title">技术亮点</h2>
          <p>白话先讲清楚，专业名词放在括号里：这套系统强调流程治理，而不是只拼一个 prompt。</p>
        </div>
        <div className="guga-highlight-grid">
          {highlights.map((item) => {
            const Icon = item.icon;
            return (
              <article key={item.title}>
                <Icon size={21} aria-hidden="true" />
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </article>
            );
          })}
        </div>
      </section>

      <section className="guga-detail-section guga-boundary-section" aria-labelledby="guga-boundary-title">
        <div className="guga-section-head">
          <span>05 / BOUNDARY</span>
          <h2 id="guga-boundary-title">当前边界</h2>
          <p>这些边界在面试里要主动讲清楚，避免把本地演示说成完整生产系统。</p>
        </div>
        <div className="guga-boundary-panel">
          <AlertTriangle size={24} aria-hidden="true" />
          <ul>
            {boundaries.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      </section>

      <section className="guga-detail-section" id="guga-detail-proof" aria-labelledby="guga-proof-title">
        <div className="guga-section-head">
          <span>06 / EVIDENCE</span>
          <h2 id="guga-proof-title">证据截图区</h2>
          <p>截图覆盖产品台、技术台、发布前事实闸门、provider 状态和 Task 18 真实 workflow 证据。</p>
        </div>
        <div className="guga-proof-grid">
          {screenshots.map((shot) => (
            <figure key={shot.title}>
              <img src={shot.src} alt={shot.title} loading="lazy" />
              <figcaption>
                <strong>{shot.title}</strong>
                <span>{shot.description}</span>
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      <section className="guga-detail-section guga-demo-section" aria-labelledby="guga-demo-title">
        <div className="guga-section-head">
          <span>07 / LOCAL DEMO</span>
          <h2 id="guga-demo-title">演示入口</h2>
          <p>以下是本地演示地址，不是公网地址。打开前需要先启动对应本地服务。</p>
        </div>
        <div className="guga-demo-grid">
          <a href="http://127.0.0.1:3000/guga-os-preview" target="_blank" rel="noreferrer">
            <ExternalLink size={17} aria-hidden="true" />
            产品台 · http://127.0.0.1:3000/guga-os-preview
          </a>
          <a href="http://127.0.0.1:3000/guga-os-technical" target="_blank" rel="noreferrer">
            <ExternalLink size={17} aria-hidden="true" />
            技术台 · http://127.0.0.1:3000/guga-os-technical
          </a>
        </div>
        <div className="guga-demo-note">
          <Lock size={18} aria-hidden="true" />
          <p>
            默认真实模型开关关闭。需要真实演示时，必须先确认额度、打开开关、重启后端，并限制调用次数。
          </p>
        </div>
      </section>

      <footer className="guga-detail-footer">
        <a href={resumeHref} onClick={handleBack}>
          <ArrowLeft size={16} aria-hidden="true" />
          返回 /resume
        </a>
        <span>
          <Search size={14} aria-hidden="true" />
          本页只展示项目案例，不触发真实模型或真实发布。
        </span>
      </footer>
    </main>
  );
}
