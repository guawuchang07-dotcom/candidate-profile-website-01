import { useState } from "react";
import {
  ArrowLeft,
  BarChart3,
  Bot,
  Briefcase,
  CheckCircle2,
  Clock,
  Cpu,
  Database,
  Download,
  GitBranch,
  Layers,
  Mail,
  MapPin,
  MessageSquare,
  PlayCircle,
  Repeat,
  Rocket,
  Search,
  Video,
  Wrench,
  X
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import avatarOrbAsset from "./assets/cyber/avatar-orb.png";
import "./resume-page.css";

const resumePdfHref = new URL("./assets/static/files/zhang-yuanbo-resume.pdf", import.meta.url).href;
const resumePdfFileName = "张远博简历.pdf";
const contactPhone = "17564138094";
const profileOverviewHref = getAppRouteHref("profile");
const aiComicConsoleGithubHref = "https://github.com/guawuchang07-dotcom/ai-comic-production-console";
const automationDemoVideoHref = new URL("./assets/static/media/automation/boss-job-assistant-web.mp4", import.meta.url).href;
const consoleScreenshots = [
  {
    title: "项目创建",
    description: "小说输入、项目风格、比例、生成模式和状态概览。",
    src: new URL("./assets/static/media/console/console-project-create.png", import.meta.url).href
  },
  {
    title: "资产确认",
    description: "人物/场景资产卡、参考图候选和人工确认流程。",
    src: new URL("./assets/static/media/console/console-assets.png", import.meta.url).href
  },
  {
    title: "任务执行",
    description: "视频任务、参考图路径、生成结果和运行日志复盘。",
    src: new URL("./assets/static/media/console/console-tasks.png", import.meta.url).href
  }
];

const difyKnowledgeScreenshots = [
  {
    title: "资产分析测试",
    description: "基于知识库规则，从小说片段生成角色设定、场景设定和参考图提示词。",
    src: new URL("./assets/static/media/dify/dify-asset-analysis.png", import.meta.url).href
  },
  {
    title: "视频任务生成",
    description: "基于已确认人物与场景，生成 1-3 条结构化即梦视频任务。",
    src: new URL("./assets/static/media/dify/dify-video-tasks.png", import.meta.url).href
  },
  {
    title: "任务质检测试",
    description: "检查镜头可执行性、平台安全风险和提示词过载问题，输出修改建议。",
    src: new URL("./assets/static/media/dify/dify-task-review.png", import.meta.url).href
  }
];

function getAppRouteHref(route = ""): string {
  const basePath = window.location.pathname
    .replace(/\/(?:resume|profile)\/?$/, "/")
    .replace(/\/index\.html$/, "/");
  const normalizedBase = basePath.endsWith("/") ? basePath : `${basePath}/`;
  return `${normalizedBase}${route}`;
}

type CapabilityGroup = {
  icon: LucideIcon;
  title: string;
  subtitle: string;
  items: string[];
};

type ProjectItem = {
  icon: LucideIcon;
  title: string;
  subtitle: string;
  focus: string;
  summary: string;
  background: string;
  responsibilities: string[];
  tools?: string[];
  platforms?: string[];
  values: string[];
  proof?: string[];
  metrics?: Array<{
    value: string;
    label: string;
    note?: string;
  }>;
};

type AutomationCase = {
  icon: LucideIcon;
  title: string;
  scene: string;
  description: string;
  actions: string[];
  value: string[];
  proof: string[];
  tags: string[];
};

type ToolGroup = {
  title: string;
  subtitle: string;
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

type ImagePreview = {
  title: string;
  description: string;
  src: string;
};

const targetKeywords = ["业务运营自动化", "AIGC流程控制", "知识库沉淀"];

const heroProofItems = [
  "业务运营自动化脚本集：自媒体运营、岗位线索、GitHub 情报",
  "AIGC 生产控制台：小说分析、资产确认、视频任务复盘",
  "AI 知识库沉淀系统：Hermes + Obsidian 每日复盘"
];

const aboutFocusItems = ["业务运营自动化", "AIGC 内容生产流程", "AI Agent 工具落地", "个人知识库沉淀"];

const independentScopes = [
  "浏览器自动化脚本设计与调试",
  "自媒体运营、岗位筛选、项目情报等运营流程提效",
  "AIGC 内容生产流程拆解",
  "Prompt / 分镜 / 生图生视频规范沉淀",
  "内容质检标准与返工原因分类",
  "Dify / Coze 轻量知识库与工作流原型搭建",
  "使用 Codex / Cursor 做简单控制台原型",
  "AI 工具测试、对比和适用场景判断",
  "内容生产 SOP、任务表、状态表设计",
  "Obsidian / Hermes 每日复盘与知识沉淀"
];

const collaborationScopes = [
  "企业级后端架构",
  "多用户权限系统",
  "大规模任务队列",
  "复杂 API 联调",
  "自动发布平台工程化",
  "高稳定性部署与监控"
];

const targetIndustries = ["AI应用公司", "AIGC内容公司", "业务运营团队", "短视频 / 内容平台", "AI工具团队", "AI Agent / 工作流团队"];

const capabilityGroups: CapabilityGroup[] = [
  {
    icon: Repeat,
    title: "业务运营自动化",
    subtitle: "Browser Automation for Operations",
    items: ["自媒体运营辅助", "岗位线索筛选与收藏", "GitHub 项目情报日报", "网页状态记录与复盘"]
  },
  {
    icon: Bot,
    title: "AIGC生产流程",
    subtitle: "AI Production Workflow",
    items: ["小说到视频任务拆解", "脚本 / 分镜 / 提示词设计", "生图 / 生视频链路验证", "失败原因与候选版本管理"]
  },
  {
    icon: Database,
    title: "知识与工具沉淀",
    subtitle: "Knowledge & Tooling System",
    items: ["Hermes 每日沉淀", "Obsidian 知识库", "开源工具调研", "飞书 CLI 协作探索"]
  }
];

const automationCases: AutomationCase[] = [
  {
    icon: MessageSquare,
    title: "自媒体运营辅助脚本",
    scene: "Twitter / X 内容运营",
    description: "面向自媒体运营中的重复互动动作，把目标内容识别、点赞、转发、评论草稿和执行状态记录拆成可控脚本流程。",
    actions: ["识别目标帖子与互动条件", "辅助点赞、转发、评论草稿生成", "记录已处理内容与执行状态", "保留人工确认与规则控制"],
    value: ["减少重复操作时间", "让内容互动动作更有节奏", "便于复盘哪些内容值得持续跟进"],
    proof: ["已在自动化浏览器中跑通脚本", "定位为运营动作辅助，不做无规则刷量"],
    tags: ["浏览器自动化", "自媒体运营", "状态记录", "人工确认"]
  },
  {
    icon: Briefcase,
    title: "BOSS 岗位线索收藏脚本",
    scene: "岗位筛选 / 线索管理",
    description: "把岗位浏览、关键词判断、相关岗位收藏这些重复动作自动化，用于验证网页信息筛选和业务线索收集的提效价值。",
    actions: ["按岗位关键词和方向筛选", "收藏符合条件的岗位", "减少人工重复翻页浏览", "沉淀岗位信息筛选规则"],
    value: ["提升岗位线索收集效率", "把个人求职流程抽象成业务线索筛选能力", "可迁移到销售线索、达人线索、竞品信息收集等场景"],
    proof: ["已接入自动化演示视频", "可在网页流程中展示收藏动作与状态变化"],
    tags: ["BOSS直聘", "线索筛选", "网页自动化", "流程提效"]
  },
  {
    icon: GitBranch,
    title: "GitHub 项目情报日报",
    scene: "开源项目发现 / 工具调研",
    description: "每天自动整理 GitHub 上值得关注的 AI 项目，把项目简介、适用场景、可试用价值和后续动作沉淀成情报材料。",
    actions: ["定时扫描项目来源", "总结项目用途与亮点", "判断是否值得安装验证", "沉淀到知识库或工具调研清单"],
    value: ["持续发现可用工具", "减少盲目收藏 GitHub 项目", "为 AI Agent 和业务自动化补充工具储备"],
    proof: ["已有每日 GitHub 项目总结脚本", "可与 Obsidian 知识库沉淀联动"],
    tags: ["GitHub", "项目情报", "AI工具调研", "每日自动总结"]
  }
];

const projects: ProjectItem[] = [
  {
    icon: Video,
    title: "AI漫剧自动化生产控制台",
    subtitle: "AI协作开发 / Vibe Coding 原型搭建 + AIGC Workflow",
    focus: "从小说到视频任务的 AI 内容生产 SOP 原型",
    summary: "把 AI 漫剧生产中的小说分析、资产确认、Prompt 规范、参考图选择、视频任务执行和失败复盘，整理成一个可操作的本地生产控制台。",
    background:
      "项目背景：AI 漫剧生产中容易出现人物/场景资产混乱、提示词复用困难、生成结果难追踪、失败后难复盘等问题，需要把零散工具操作整理成可执行流程。",
    responsibilities: [
      "拆解从小说输入到视频任务执行的关键环节，定义项目创建、资产确认、任务执行三段式流程",
      "用 Codex / Cursor 做 AI 协作开发 / Vibe Coding 原型搭建，把流程想法落成 Electron 本地控制台",
      "接入并调试 Agent API，让人物设定卡、场景设定卡和视频提示词按项目规则生成",
      "设计多人物参考图、场景参考图选择和图片编号规则，保证视频任务能明确引用视觉资产",
      "接入 Dreamina CLI，保留 dry-run / live-run 分支，并记录 submit_id、失败原因和输出路径",
      "加入候选视频版本管理，避免新结果覆盖旧结果，方便低成本对比和复盘"
    ],
    tools: ["Codex", "Cursor", "Tabbit", "Coze", "OpenClaw", "Hermes", "GitHub 开源项目", "Agent API", "Dreamina CLI", "JSON 状态文件"],
    proof: [
      "可查看本地控制台截图：项目创建、资产确认、任务执行三页已跑通",
      "可查看 GitHub 脱敏仓库：保留 Electron、Agent 规则、Dreamina CLI 调用和状态结构",
      "已完成真实 Dreamina CLI 生图 / 生视频链路验证，并保留 dry-run 成本保护",
      "已支持多人物参考图、场景参考图、视频候选版本和 status.json 状态回写"
    ],
    values: [
      "把原本分散在对话、表格、生成工具里的 AI 内容流程沉淀为可复用 SOP",
      "通过人工资产确认和参考图选择，降低角色、场景不一致带来的返工成本",
      "通过 status.json 状态回写、失败原因记录和 submit_id 追踪，让真实生成过程可复盘",
      "通过候选视频版本管理支持低成本多版本对比，避免盲目重复生成"
    ],
    metrics: [
      { value: "3页", label: "核心控制台", note: "项目 / 资产 / 任务" },
      { value: "8+", label: "自动化脚本", note: "分析、提示词、CLI、状态" },
      { value: "CLI", label: "真实生成链路", note: "Dreamina dry-run / live-run" },
      { value: "多候选", label: "视频复盘", note: "同任务多版本管理" }
    ]
  },
  {
    icon: Database,
    title: "个人 AI 知识库与 Hermes 每日沉淀系统",
    subtitle: "Hermes + Obsidian + Codex",
    focus: "把 AI 对话转成每日复盘和知识资产",
    summary: "用 Hermes 作为主要对话入口，每天 23:00 自动读取本地会话，分类识别闲聊、工作推进、AI学习、项目经验和待办，再写入 Obsidian 每日复盘。",
    background:
      "项目背景：日常和 AI 对话很容易聊完即散，项目经验、学习内容和任务复盘无法沉淀。这个系统把聊天记录从“临时对话”转成可复盘、可检索、可持续更新的个人知识库。",
    responsibilities: [
      "设计 Obsidian 中文目录结构，区分收件箱、对话提炼、个人画像、项目经验、复盘系统和 AI 学习",
      "接入 Hermes 本地 session 记录，覆盖终端和桌宠两种入口",
      "编写每日沉淀脚本，自动分类闲聊、工作推进、项目经验、AI学习和待办",
      "配置 Hermes cron，每天 23:00 自动生成 Obsidian 每日复盘",
      "优化模型成本，把后台总结从高成本模型切换到轻量模型，并加入输入截断和失败保护"
    ],
    tools: ["Hermes", "Obsidian", "Codex", "Python", "Markdown", "Cron", "本地 session"],
    proof: [
      "已生成 Obsidian 每日复盘笔记",
      "已配置每日 23:00 自动沉淀任务",
      "已支持桌宠多窗口聊天纳入每日总结",
      "不保存原始对话，默认只沉淀摘要与可执行待办"
    ],
    values: [
      "把 AI 对话从一次性聊天变成可复盘的知识资产",
      "为项目经验、学习内容和个人画像建立长期沉淀入口",
      "后续可扩展到团队员工的工作日志和知识库沉淀流程",
      "展示对 AI 工具、自动化脚本、本地知识库和成本控制的组合能力"
    ],
    metrics: [
      { value: "23:00", label: "每日自动沉淀", note: "Hermes cron 定时执行" },
      { value: "5类", label: "自动分类", note: "闲聊 / 工作 / 项目 / 学习 / 待办" },
      { value: "本地", label: "数据归属", note: "Obsidian Markdown 文件" },
      { value: "低成本", label: "模型策略", note: "轻量模型 + 截断 + 少重试" }
    ]
  },
  {
    icon: Wrench,
    title: "飞书 CLI 企业协作自动化探索",
    subtitle: "Feishu CLI / Team Workflow Automation",
    focus: "企业协作工具接入 AI Agent 的预研方向",
    summary: "围绕飞书文档、任务、知识库和团队协作场景，整理 CLI / API 使用方法，验证 AI Agent 能否帮助团队自动更新文档、生成日报和沉淀项目资料。",
    background:
      "项目背景：很多团队协作内容分散在飞书文档、任务和群聊中，人工更新和整理成本高。该方向用于探索把企业协作平台接入 AI 工作流的可能性。",
    responsibilities: [
      "整理飞书 CLI / API 的基础使用方法和适用边界",
      "梳理文档创建、内容更新、任务记录、日报生成等高频场景",
      "设计 AI Agent 调用企业协作工具的安全规则和人工确认节点",
      "为后续团队级知识库、日报、项目复盘自动化预留接口"
    ],
    tools: ["飞书", "CLI", "API", "Hermes", "Codex", "Markdown"],
    proof: ["进行中：正在整理飞书 CLI 使用方法", "目标是验证企业协作工具自动化，不以复杂后端系统为第一阶段目标"],
    values: [
      "把个人自动化经验迁移到企业协作场景",
      "让日报、文档更新、项目复盘等重复协作动作具备自动化入口",
      "为业务团队落地 AI Agent 提供更贴近真实办公场景的案例"
    ],
    metrics: [
      { value: "进行中", label: "项目阶段", note: "CLI 用法整理" },
      { value: "文档", label: "重点场景", note: "日报 / 复盘 / 知识库" },
      { value: "确认制", label: "安全策略", note: "关键写入前人工确认" }
    ]
  },
  {
    icon: BarChart3,
    title: "短视频账号内容运营",
    subtitle: "Short Video Content Operations",
    focus: "多平台内容测试与复盘",
    summary: "围绕小红书、抖音、YouTube 持续测试选题、标题、封面和内容结构，用数据反馈优化内容方向。",
    background: "基于多平台内容发布经验，持续测试不同内容方向、标题、封面、选题和视频结构。",
    responsibilities: ["短视频内容创作", "选题策划与脚本组织", "标题 / 封面 / 内容结构测试", "平台数据观察", "内容方向迭代", "多平台发布与复盘"],
    platforms: ["小红书", "抖音", "YouTube", "TikTok"],
    proof: ["小红书近 30 日浏览量 7 万+", "抖音内容浏览量破百万，累计点赞约 1.2 万", "YouTube 浏览量 5 万+", "数据来自个人运营账号阶段性统计，用于说明内容测试和平台反馈经验"],
    values: ["积累多平台内容判断和运营经验", "能够结合数据反馈调整选题与结构", "对短视频内容节奏和爆款结构有实操理解"],
    metrics: [
      { value: "百万+", label: "全网内容总览", note: "抖音内容浏览破百万" },
      { value: "7万+", label: "小红书近 30 日浏览", note: "短周期内容验证" },
      { value: "1.2万+", label: "累计点赞", note: "抖音互动数据" },
      { value: "5万+", label: "YouTube 浏览", note: "跨平台分发经验" }
    ]
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

const toolGroups: ToolGroup[] = [
  { title: "AI 协作开发 / Vibe Coding 原型搭建", subtitle: "把需求拆成可运行工具、流程规则和自动化任务", tools: ["Codex", "Cursor", "Claude", "ChatGPT"] },
  { title: "浏览器与业务运营自动化", subtitle: "用于自媒体运营、岗位收藏、网页信息筛选和状态记录", tools: ["Tabbit", "Coze 虚拟机", "OpenClaw", "Hermes", "自动化浏览器脚本"] },
  { title: "知识库与项目情报", subtitle: "用于每日沉淀、GitHub 项目总结和方法论复盘", tools: ["Obsidian", "Hermes cron", "GitHub", "Markdown", "Python"] },
  { title: "AIGC 视频 / 图像工具", subtitle: "用于生图、生视频和提示词迭代", tools: ["即梦", "Seedance", "Midjourney", "ComfyUI"] },
  { title: "内容生产 / 剪辑工具", subtitle: "完成剪辑、包装和成片交付", tools: ["剪映", "CapCut"] },
  { title: "文档 / 平台经验", subtitle: "沉淀流程、复盘记录、内容发布和数据反馈", tools: ["飞书", "Notion", "Excel", "抖音", "小红书", "YouTube", "TikTok"] }
];

const workflowSteps = ["业务场景识别", "规则拆解", "脚本 / Agent 执行", "状态记录", "结果复盘", "知识沉淀"];

const consoleEvidenceSteps = [
  {
    step: "01",
    title: "项目创建",
    label: "小说输入 / 风格配置",
    description: "上传或粘贴小说，设置视频风格、比例、生成模式和音频策略。"
  },
  {
    step: "02",
    title: "资产确认",
    label: "人物 / 场景 / 参考图",
    description: "Agent 生成设定卡后，人工编辑、上传、重生并选择参考图。"
  },
  {
    step: "03",
    title: "任务执行",
    label: "提示词 / 多参考图",
    description: "按单条视频任务选择多人物与场景图，同步图片编号和最终提示词。"
  },
  {
    step: "04",
    title: "复盘留痕",
    label: "候选视频 / 状态回写",
    description: "记录 submit_id、输出路径、失败原因，并保留同任务多版本候选。"
  }
];

const consoleImplementationProof = ["AI 协作开发 / Vibe Coding 原型搭建", "真实接入 Dreamina CLI", "支持 dry-run 成本保护", "Agent 生成设定卡与提示词", "status.json 全流程状态回写", "多人物参考图编号同步", "视频候选版本管理"];

function SectionKicker({ index, label }: { index: string; label: string }): JSX.Element {
  return (
    <div className="resume-section-kicker">
      <span>{index}</span>
      <strong>{label}</strong>
    </div>
  );
}

function InfoPill({ icon: Icon, label, value }: { icon: LucideIcon; label: string; value: string }): JSX.Element {
  return (
    <div className="resume-info-pill">
      <Icon size={16} aria-hidden="true" />
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function CapabilityCard({
  group,
  index,
  onAutomationDemo
}: {
  group: CapabilityGroup;
  index: number;
  onAutomationDemo: () => void;
}): JSX.Element {
  const Icon = group.icon;
  const shouldShowAutomationDemo = group.title === "业务运营自动化";
  return (
    <article className="resume-capability-card">
      <div className="resume-card-index">0{index + 1}</div>
      <div className="resume-capability-head">
        <span>
          <Icon size={22} aria-hidden="true" />
        </span>
        <div>
          <h3>{group.title}</h3>
          <p>{group.subtitle}</p>
        </div>
      </div>
      <ul>
        {group.items.map((item) => (
          <li className={shouldShowAutomationDemo && item.includes("岗位") ? "has-demo-action" : undefined} key={item}>
            <CheckCircle2 size={14} aria-hidden="true" />
            <span>{item}</span>
            {shouldShowAutomationDemo && item.includes("岗位") && (
              <button className="resume-capability-demo-button" type="button" onClick={onAutomationDemo}>
                查看演示
              </button>
            )}
          </li>
        ))}
      </ul>
    </article>
  );
}

function AutomationCaseCard({ item, index }: { item: AutomationCase; index: number }): JSX.Element {
  const Icon = item.icon;
  return (
    <article className="resume-ops-card">
      <div className="resume-ops-card-head">
        <span>OPS 0{index + 1}</span>
        <Icon size={24} aria-hidden="true" />
      </div>
      <h3>{item.title}</h3>
      <strong>{item.scene}</strong>
      <p>{item.description}</p>
      <div className="resume-ops-card-grid">
        <div>
          <h4>自动化动作</h4>
          <ul>
            {item.actions.map((action) => (
              <li key={action}>{action}</li>
            ))}
          </ul>
        </div>
        <div>
          <h4>业务价值</h4>
          <ul>
            {item.value.map((value) => (
              <li key={value}>{value}</li>
            ))}
          </ul>
        </div>
      </div>
      <div className="resume-ops-proof">
        {item.proof.map((proof) => (
          <span key={proof}>{proof}</span>
        ))}
      </div>
      <div className="resume-ops-tags">
        {item.tags.map((tag) => (
          <span key={tag}>{tag}</span>
        ))}
      </div>
    </article>
  );
}

function ProjectCard({
  project,
  index,
  onImagePreview
}: {
  project: ProjectItem;
  index: number;
  onImagePreview: (image: ImagePreview) => void;
}): JSX.Element {
  const Icon = project.icon;
  const isConsoleProject = index === 0;
  return (
    <article className="resume-project-card">
      <div className="resume-project-topline">
        <div className="resume-project-marker">PROJECT 0{index + 1}</div>
        <span>{project.focus}</span>
      </div>
      <div className="resume-project-head">
        <span>
          <Icon size={24} aria-hidden="true" />
        </span>
        <div>
          <h3>{project.title}</h3>
          <p>{project.subtitle}</p>
        </div>
      </div>

      <div className="resume-project-summary">
        <strong>CASE SUMMARY</strong>
        <p>{project.summary}</p>
      </div>

      {project.metrics && (
        <div className="resume-project-metrics" aria-label={`${project.title}关键指标`}>
          {project.metrics.map((metric) => (
            <div className="resume-project-metric" key={`${metric.value}-${metric.label}`}>
              <strong>{metric.value}</strong>
              <span>{metric.label}</span>
              {metric.note && <p>{metric.note}</p>}
            </div>
          ))}
        </div>
      )}

      {isConsoleProject && (
        <div className="resume-console-showcase" aria-label="AI漫剧自动化生产控制台系统证据">
          <div className="resume-console-showcase-head">
            <span>PRODUCT EVIDENCE</span>
            <strong>从小说到视频任务的本地生产控制台</strong>
            <p>这部分展示的是工具落地能力，不是单纯的 AIGC 作品展示。</p>
            <div className="resume-console-links" aria-label="AI漫剧自动化生产控制台公开链接">
              <a href={aiComicConsoleGithubHref} target="_blank" rel="noreferrer">
                查看 GitHub 仓库
              </a>
              <span>公开版本已脱敏，保留 AI 协作开发、Agent 规则和 Dreamina CLI 工作流结构</span>
            </div>
          </div>
          <div className="resume-console-flow">
            {consoleEvidenceSteps.map((item) => (
              <article className="resume-console-flow-card" key={item.step}>
                <span>{item.step}</span>
                <strong>{item.title}</strong>
                <em>{item.label}</em>
                <p>{item.description}</p>
              </article>
            ))}
          </div>
          <div className="resume-console-proof-strip">
            {consoleImplementationProof.map((item) => (
              <span key={item}>{item}</span>
            ))}
          </div>
          <div className="resume-console-screenshots" aria-label="AI漫剧自动化控制台界面截图">
            <div className="resume-console-screenshots-head">
              <span>CONSOLE SCREENS</span>
              <strong>平台界面截图</strong>
            </div>
            <div className="resume-console-screenshot-grid">
              {consoleScreenshots.map((shot) => (
                <figure className="resume-console-screenshot-card" key={shot.title}>
                  <button type="button" onClick={() => onImagePreview(shot)} aria-label={`放大查看 ${shot.title}`}>
                    <img src={shot.src} alt={`AI漫剧自动化控制台 - ${shot.title}`} loading="lazy" />
                    <span>点击放大</span>
                  </button>
                  <figcaption>
                    <strong>{shot.title}</strong>
                    <span>{shot.description}</span>
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>
          <div className="resume-dify-showcase" aria-label="Dify 轻量知识库原型">
            <div className="resume-dify-copy">
              <span>RAG PROTOTYPE</span>
              <strong>Dify 轻量知识库原型</strong>
              <p>
                基于 Dify 搭建 AIGC 短视频生产规则知识库，将工作流文档拆分为资产分析、人物/场景生成规则、视频任务生成规则和任务质检规则，用于验证 RAG 规则检索在 AI 漫剧生产流程中的可用性。
              </p>
              <div className="resume-dify-tags" aria-label="Dify 原型能力标签">
                <span>规则知识库</span>
                <span>资产分析</span>
                <span>视频任务生成</span>
                <span>执行前质检</span>
              </div>
            </div>
            <div className="resume-dify-proof-grid">
              {difyKnowledgeScreenshots.map((shot) => (
                <figure className="resume-dify-proof-card" key={shot.title}>
                  <button type="button" onClick={() => onImagePreview(shot)} aria-label={`放大查看 ${shot.title}`}>
                    <img src={shot.src} alt={`Dify 轻量知识库原型 - ${shot.title}`} loading="lazy" />
                    <span>点击放大</span>
                  </button>
                  <figcaption>
                    <strong>{shot.title}</strong>
                    <span>{shot.description}</span>
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>
        </div>
      )}

      <p className="resume-project-background">{project.background}</p>

      <div className="resume-project-grid">
        <div className="resume-project-detail-block">
          <h4>我负责什么</h4>
          <ul>
            {project.responsibilities.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
        <div className="resume-project-detail-block is-value">
          <h4>结果 / 价值</h4>
          <ul>
            {project.values.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      </div>

      {(project.tools || project.platforms || project.proof) && (
        <div className="resume-project-evidence">
          {project.tools && (
            <div>
              <h4>使用工具</h4>
              <div className="resume-mini-tags">
                {project.tools.map((item) => (
                  <span key={item}>{item}</span>
                ))}
              </div>
            </div>
          )}
          {project.platforms && (
            <div>
              <h4>平台经验</h4>
              <div className="resume-mini-tags">
                {project.platforms.map((item) => (
                  <span key={item}>{item}</span>
                ))}
              </div>
            </div>
          )}
          {project.proof && (
            <div className="resume-proof-list">
              <h4>可验证证据</h4>
              {project.proof.map((item) => (
                <p key={item}>{item}</p>
              ))}
            </div>
          )}
        </div>
      )}
    </article>
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
          <span>{work.status}</span>
          <h3>{work.title}</h3>
          <p>{work.description}</p>
        </div>

        <div className="resume-director-card-grid">
          <div>
            <h4>我负责</h4>
            <div className="resume-mini-tags">
              {work.role.map((item) => (
                <span key={item}>{item}</span>
              ))}
            </div>
          </div>
          <div>
            <h4>使用工具</h4>
            <div className="resume-mini-tags">
              {work.tools.map((item) => (
                <span key={item}>{item}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}

export default function ResumePage(): JSX.Element {
  const [activeDirectorWork, setActiveDirectorWork] = useState<DirectorWork | null>(null);
  const [automationDemoOpen, setAutomationDemoOpen] = useState(false);
  const [activeImagePreview, setActiveImagePreview] = useState<ImagePreview | null>(null);

  function downloadResumeFile(): void {
    const link = document.createElement("a");
    link.href = resumePdfHref;
    link.download = resumePdfFileName;
    document.body.appendChild(link);
    link.click();
    link.remove();
  }

  function showContactPhone(): void {
    window.alert(`联系方式：${contactPhone}`);
  }

  return (
    <main className="resume-page" aria-label="张远博个人简历">
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

      <nav className="resume-nav" aria-label="简历导航">
        <a className="resume-back-link" href={profileOverviewHref} aria-label="返回候选人档案总览">
          <ArrowLeft size={15} aria-hidden="true" />
          返回总览
        </a>
        <div className="resume-nav-brand">
          <span>CANDIDATE RESUME</span>
          <strong>READING TERMINAL</strong>
        </div>
        <button className="resume-nav-contact" type="button" onClick={showContactPhone}>
          <Mail size={14} aria-hidden="true" />
          联系我
        </button>
      </nav>

      <section className="resume-hero resume-screen" aria-labelledby="resume-hero-title">
        <div className="resume-hero-copy">
          <SectionKicker index="01" label="Candidate Positioning" />
          <h1 id="resume-hero-title">张远博</h1>
          <h2>AI工作流落地 / 业务运营自动化 / AIGC内容生产提效</h2>
          <p className="resume-hero-statement">
            把自媒体运营、岗位筛选、项目情报、AIGC 内容生产和知识沉淀这些重复流程，拆成规则、脚本、Agent 流程和可演示工具。
          </p>

          <div className="resume-quick-read" aria-label="30秒看懂我">
            <span>核心展示</span>
            <p>更适合需要把重复网页动作、内容生产流程和 AI 对话沉淀做成可执行工作流的团队。</p>
            <ul>
              {heroProofItems.map((item) => (
                <li key={item}>
                  <CheckCircle2 size={14} aria-hidden="true" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="resume-hero-actions">
            <button type="button" onClick={showContactPhone}>
              <MessageSquare size={16} aria-hidden="true" />
              联系我
            </button>
            <a href="#resume-projects">
              <Briefcase size={16} aria-hidden="true" />
              查看项目
            </a>
            <button type="button" onClick={downloadResumeFile}>
              <Download size={16} aria-hidden="true" />
              下载简历
            </button>
          </div>
        </div>

        <aside className="resume-hero-card" aria-label="候选人身份档案">
          <div className="resume-card-label">IDENTITY FILE · ZYB-2025-0426</div>
          <div className="resume-avatar-shell">
            <img src={avatarOrbAsset} alt="张远博头像" />
          </div>
          <div className="resume-profile-lines">
            <span>ROLE FOCUS</span>
            <strong>AI工作流落地 / 业务自动化</strong>
            <p>把个人痛点里的流程问题，沉淀成可演示、可复盘、可迁移的工具原型。</p>
          </div>
          <div className="resume-keyword-cloud">
            {targetKeywords.map((keyword) => (
              <span key={keyword}>{keyword}</span>
            ))}
          </div>
        </aside>
      </section>

      <section className="resume-screen resume-about" aria-labelledby="resume-about-title">
        <div className="resume-section-copy">
          <SectionKicker index="02" label="About Me" />
          <h2 id="resume-about-title">关于我</h2>
          <div className="resume-about-focus" aria-label="核心定位关键词">
            {aboutFocusItems.map((item) => (
              <span key={item}>{item}</span>
            ))}
          </div>
          <p>
            我更关注“AI 怎么进入真实业务流程”：把内容判断、平台运营经验、网页自动化和 AI 工具结合起来，拆解自媒体运营、岗位筛选、项目情报、AIGC 生产和知识沉淀这些高频流程。
          </p>
          <p>
            当前主要用 Codex、Cursor、Hermes、Obsidian、Tabbit、Coze、Dify、即梦、Seedance 等工具，把零散 AI 操作整理成可复用的脚本、SOP、知识库和轻量半自动工作流。
          </p>
        </div>

        <div className="resume-workflow-panel" aria-label="内容生产工作流">
          <div className="resume-panel-head">
            <Layers size={18} aria-hidden="true" />
            <span>BUSINESS TO AI WORKFLOW</span>
          </div>
          <div className="resume-workflow-track">
            {workflowSteps.map((step, index) => (
              <div className="resume-workflow-step" key={step}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <strong>{step}</strong>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="resume-screen resume-capabilities" aria-labelledby="resume-capability-title">
        <div className="resume-section-header">
          <SectionKicker index="03" label="Core Competencies" />
          <h2 id="resume-capability-title">核心能力</h2>
          <p>能力围绕业务流程自动化、AIGC 内容生产和知识沉淀展开，重点服务重复操作提效、交付稳定性和复盘迭代。</p>
        </div>
        <div className="resume-capability-grid">
          {capabilityGroups.map((group, index) => (
            <CapabilityCard group={group} index={index} onAutomationDemo={() => setAutomationDemoOpen(true)} key={group.title} />
          ))}
        </div>
      </section>

      <section className="resume-screen resume-ops-lab" id="resume-ops-lab" aria-labelledby="resume-ops-title">
        <div className="resume-section-header">
          <SectionKicker index="04" label="Business Automation Lab" />
          <h2 id="resume-ops-title">业务运营自动化脚本集</h2>
          <p>
            这部分放在前面，是因为它最能体现“业务提效”价值：把运营中高频、重复、可规则化的网页动作，做成可演示、可记录、可复盘的半自动流程。
          </p>
        </div>
        <div className="resume-ops-overview" aria-label="业务运营自动化整体流程">
          <div>
            <Search size={18} aria-hidden="true" />
            <span>识别业务场景</span>
          </div>
          <div>
            <Layers size={18} aria-hidden="true" />
            <span>拆成规则与步骤</span>
          </div>
          <div>
            <Repeat size={18} aria-hidden="true" />
            <span>脚本执行重复动作</span>
          </div>
          <div>
            <Database size={18} aria-hidden="true" />
            <span>记录状态并复盘</span>
          </div>
        </div>
        <div className="resume-ops-grid">
          {automationCases.map((item, index) => (
            <AutomationCaseCard item={item} index={index} key={item.title} />
          ))}
        </div>
      </section>

      <section className="resume-screen resume-projects" id="resume-projects" aria-labelledby="resume-project-title">
        <div className="resume-section-header">
          <SectionKicker index="05" label="Project Experience" />
          <h2 id="resume-project-title">项目经历</h2>
          <p>重点展示 AI 工具协作、AIGC 内容生产、知识库沉淀和企业协作自动化能力，覆盖需求拆解、工具组合、状态复盘和内容交付。</p>
        </div>
        <div className="resume-project-list">
          {projects.map((project, index) => (
            <ProjectCard project={project} index={index} key={project.title} onImagePreview={setActiveImagePreview} />
          ))}
        </div>
      </section>

      <section className="resume-screen resume-ai-extension" aria-labelledby="resume-ai-extension-title">
        <div className="resume-section-header">
          <SectionKicker index="06" label="Agent Tool Research" />
          <h2 id="resume-ai-extension-title">AI Agent 工具调研与自动化验证</h2>
          <p>
            这部分不是单纯工具体验，而是围绕网页自动化、任务拆解、文件处理和本地工作流，验证不同 AI Agent 工具的适用边界，并判断它们能否服务真实内容生产任务。
          </p>
        </div>
        <div className="resume-ai-extension-grid">
          <article className="resume-ai-extension-card">
            <div className="resume-ai-extension-number">01</div>
            <h3>AI Agent 工具研究</h3>
            <p>持续研究 OpenClaw、Hermes、小龙虾等 AI Agent 工具，理解它们在插件扩展、网页任务、文件处理和本地工作流中的适用边界。</p>
            <div className="resume-ai-extension-tags">
              <span>OpenClaw</span>
              <span>Hermes</span>
              <span>小龙虾</span>
              <span>GitHub 开源项目</span>
            </div>
          </article>
          <article className="resume-ai-extension-card">
            <div className="resume-ai-extension-number">02</div>
            <h3>能力验证流程</h3>
            <p>从实际任务需求出发，筛选 GitHub 开源项目和插件能力，进行安装配置、功能测试和适配性判断，避免只停留在工具收藏层面。</p>
            <ul>
              <li>查找和筛选可用开源项目</li>
              <li>安装、配置并验证插件能力</li>
              <li>记录可用场景、限制和失败点</li>
            </ul>
          </article>
          <article className="resume-ai-extension-card">
            <div className="resume-ai-extension-number">03</div>
            <h3>工具组合判断</h3>
            <p>能够根据任务类型判断适合使用 Codex / Cursor、Tabbit、Coze、OpenClaw、Hermes 或 GitHub 开源项目中的哪类能力完成验证。</p>
            <ul>
              <li>网页自动化与表单流程</li>
              <li>Agent 协作与任务拆解</li>
              <li>本地工具增强与能力补齐</li>
            </ul>
          </article>
        </div>
      </section>

      <section className="resume-screen resume-boundary" aria-labelledby="resume-boundary-title">
        <div className="resume-section-header">
          <SectionKicker index="07" label="Delivery Boundary" />
          <h2 id="resume-boundary-title">能力边界与协作方式</h2>
          <p>定位偏业务流程拆解、AI 工具落地和轻量级 AI 工作流原型验证；复杂工程化能力可以与研发协作完成。</p>
        </div>
        <div className="resume-boundary-grid">
          <article className="resume-boundary-card">
            <span>CAN DELIVER</span>
            <h3>我能独立完成</h3>
            <ul>
              {independentScopes.map((item) => (
                <li key={item}>
                  <CheckCircle2 size={14} aria-hidden="true" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </article>
          <article className="resume-boundary-card is-collaboration">
            <span>NEED COLLABORATION</span>
            <h3>需要研发协作完成</h3>
            <ul>
              {collaborationScopes.map((item) => (
                <li key={item}>
                  <Rocket size={14} aria-hidden="true" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </article>
        </div>
      </section>

      <section className="resume-screen resume-director" aria-labelledby="resume-director-title">
        <div className="resume-section-header">
          <SectionKicker index="08" label="AI Video Direction" />
          <h2 id="resume-director-title">AI导演作品集</h2>
          <p>
            精选 3 个 AI 导演 / AIGC 漫剧作品，呈现内容理解、分镜设计、提示词优化、视频生成与剪辑交付能力。
          </p>
        </div>

        <div className="resume-director-stage">
          <div className="resume-director-intro">
            <span>DIRECTOR WORKFLOW</span>
            <h3>
              <span>从创意到镜头</span>
              <span>到 AI 视频交付</span>
            </h3>
            <p>
              参与创意构思、分镜设计、提示词设计、画面生成、镜头衔接和后期剪辑，沉淀可复用的 AI 视频生产流程。
            </p>
          </div>

          <div className="resume-director-grid">
            {directorWorks.map((work, index) => (
              <DirectorWorkCard work={work} index={index} onPlay={setActiveDirectorWork} key={work.title} />
            ))}
          </div>
        </div>
      </section>

      <section className="resume-screen resume-tools" aria-labelledby="resume-tools-title">
        <div className="resume-section-copy">
          <SectionKicker index="09" label="Tools & Platform" />
          <h2 id="resume-tools-title">工具能力</h2>
          <p>
            工具能力服务于业务运营自动化、内容生产、流程规范和批量化交付，不以全栈开发能力作为定位。
          </p>
        </div>
        <div className="resume-tool-matrix">
          {toolGroups.map((group) => (
            <article className="resume-tool-group" key={group.title}>
              <div>
                <Cpu size={17} aria-hidden="true" />
                <h3>{group.title}</h3>
              </div>
              <p>{group.subtitle}</p>
              <div className="resume-tool-tags">
                {group.tools.map((tool) => (
                  <span key={tool}>{tool}</span>
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="resume-screen resume-target" aria-labelledby="resume-target-title">
        <div className="resume-section-header">
          <SectionKicker index="10" label="Target Teams" />
          <h2 id="resume-target-title">适配团队</h2>
          <p>更适合内容生产、业务运营、AI 工具和工作流落地方向的团队，不以纯后端开发或算法模型训练为主要定位。</p>
        </div>
        <div className="resume-target-grid">
          {targetIndustries.map((industry) => (
            <div className="resume-target-card" key={industry}>
              <Rocket size={18} aria-hidden="true" />
              <span>{industry}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="resume-screen resume-contact" aria-labelledby="resume-contact-title">
        <div className="resume-contact-card">
          <SectionKicker index="11" label="Get In Touch" />
          <h2 id="resume-contact-title">联系方式</h2>
          <p>如果团队需要业务运营自动化、AI 内容生产提效、AIGC 项目执行或 AI 工作流落地方向的候选人，可以通过联系方式联系。</p>

          <div className="resume-contact-grid">
            <InfoPill icon={Mail} label="邮箱" value="1425514532@qq.com" />
            <InfoPill icon={MapPin} label="所在地" value="中国 · 杭州" />
            <InfoPill icon={Clock} label="到岗时间" value="随时" />
          </div>

          <div className="resume-contact-actions">
            <button type="button" onClick={showContactPhone}>
              <Mail size={16} aria-hidden="true" />
              联系我
            </button>
            <a href={profileOverviewHref}>
              <ArrowLeft size={16} aria-hidden="true" />
              返回总览
            </a>
          </div>
        </div>
      </section>

      <footer className="resume-footer">
        <span>CANDIDATE PORTAL · LONG RESUME MODULE · v2.0.26</span>
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
      {automationDemoOpen && (
        <div
          className="resume-video-modal"
          role="dialog"
          aria-modal="true"
          aria-label="AI 自动化能力演示"
          onClick={() => setAutomationDemoOpen(false)}
        >
          <div className="resume-video-modal-panel" onClick={(event) => event.stopPropagation()}>
            <div className="resume-video-modal-head">
              <div>
                <span>AI AUTOMATION PROOF</span>
                <h3>网页任务自动化演示</h3>
                <p>自动化浏览器与 AI Agent 辅助岗位筛选、收藏标记和流程状态记录</p>
              </div>
              <button type="button" onClick={() => setAutomationDemoOpen(false)} aria-label="关闭演示">
                <X size={18} aria-hidden="true" />
              </button>
            </div>
            {automationDemoVideoHref ? (
              <video className="resume-video-modal-player" src={automationDemoVideoHref} controls preload="metadata" />
            ) : (
              <div className="resume-automation-placeholder">
                <strong>视频待接入</strong>
                <p>把录制好的演示视频发给我后，我会接入到这里。</p>
              </div>
            )}
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
    </main>
  );
}
