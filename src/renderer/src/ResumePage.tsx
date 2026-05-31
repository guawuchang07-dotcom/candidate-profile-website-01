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

type AutomationDemo = {
  title: string;
  description: string;
  videoHref: string;
};

const automationDemos = {
  selfMedia: {
    title: "自媒体运营辅助脚本演示",
    description: "自动化浏览器辅助内容识别、互动条件判断、评论草稿和执行状态记录",
    videoHref: new URL("./assets/static/media/automation/self-media-ops-assistant.m4v", import.meta.url).href
  },
  boss: {
    title: "BOSS 岗位线索收藏脚本演示",
    description: "自动化浏览器与 AI Agent 辅助岗位筛选、收藏标记和流程状态记录",
    videoHref: new URL("./assets/static/media/automation/boss-job-assistant-web.mp4", import.meta.url).href
  }
} satisfies Record<string, AutomationDemo>;

const ecommerceWorkflowVideoHref = new URL("./assets/static/media/ecommerce/ecommerce-workflow-demo.mp4", import.meta.url).href;

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

const knowledgeBaseScreenshots = [
  {
    title: "Obsidian 知识库关系图谱",
    description: "中文目录、每日沉淀、AI学习、项目经验和对话索引已经形成可视化链接。",
    src: new URL("./assets/static/media/proof/obsidian-knowledge-graph.png", import.meta.url).href
  }
];

const shortVideoScreenshots = {
  douyin: {
    title: "抖音数据中心截图",
    description: "抖音账号诊断与经营数据截图，用于验证阶段性短视频播放和内容测试效果。",
    src: new URL("./assets/static/media/proof/douyin-data-center.jpg", import.meta.url).href
  }
} satisfies Record<string, ImagePreview>;

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
  kind?: "comicConsole" | "ecommerce";
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
  screenshots?: ImagePreview[];
  demoVideo?: {
    title: string;
    description: string;
    videoHref: string;
  };
  metrics?: Array<{
    value: string;
    label: string;
    note?: string;
    proof?: ImagePreview;
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
  demo?: AutomationDemo;
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

const targetKeywords = ["电商视觉工作流", "业务运营自动化", "AIGC流程控制"];

const heroProofItems = [
  "服装电商主图与宣传视频生成工作流：平台、服装类型、风格方向到批量视觉素材",
  "业务运营自动化脚本集：自媒体运营、岗位线索、GitHub 情报",
  "AIGC 生产控制台：小说分析、资产确认、视频任务复盘",
  "AI 知识库沉淀系统：Hermes + Obsidian 每日复盘"
];

const aboutFocusItems = ["电商视觉工作流", "业务运营自动化", "AIGC 内容生产流程", "AI Agent 工具落地"];

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

const targetIndustries = ["电商品牌 / 服装品牌", "AI应用公司", "AIGC内容公司", "业务运营团队", "短视频 / 内容平台", "AI工具团队", "AI Agent / 工作流团队"];

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
    items: ["电商主图批量生成", "宣传视频延展", "小说到视频任务拆解", "生图 / 生视频链路验证"]
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
    proof: ["已在自动化浏览器中跑通脚本", "已接入自媒体运营辅助演示视频", "定位为运营动作辅助，不做无规则刷量"],
    tags: ["浏览器自动化", "自媒体运营", "状态记录", "人工确认"],
    demo: automationDemos.selfMedia
  },
  {
    icon: Briefcase,
    title: "BOSS 岗位线索收藏脚本",
    scene: "岗位筛选 / 线索管理",
    description: "把岗位浏览、关键词判断、相关岗位收藏这些重复动作自动化，用于验证网页信息筛选和业务线索收集的提效价值。",
    actions: ["按岗位关键词和方向筛选", "收藏符合条件的岗位", "减少人工重复翻页浏览", "沉淀岗位信息筛选规则"],
    value: ["提升岗位线索收集效率", "把个人求职流程抽象成业务线索筛选能力", "可迁移到销售线索、达人线索、竞品信息收集等场景"],
    proof: ["已接入自动化演示视频", "可在网页流程中展示收藏动作与状态变化"],
    tags: ["BOSS直聘", "线索筛选", "网页自动化", "流程提效"],
    demo: automationDemos.boss
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

function getAutomationDemoForItem(item: string): AutomationDemo | null {
  if (item.includes("自媒体")) {
    return automationDemos.selfMedia;
  }

  if (item.includes("岗位")) {
    return automationDemos.boss;
  }

  return null;
}

const projects: ProjectItem[] = [
  {
    kind: "ecommerce",
    icon: Layers,
    title: "服装电商主图与宣传视频生成工作流",
    subtitle: "E-commerce Main Image + Promo Video AIGC Workflow",
    focus: "降低服装电商视觉素材成本，提升上架和投放效率",
    summary:
      "针对服装电商商拍成本高、上新素材准备重复的痛点，把平台要求、服装类型、风格方向整理成可配置输入，批量生成电商主图候选，并延展为宣传视频素材，对标 AI 商拍降本提效场景。",
    background:
      "项目背景：服装电商上新频繁，主图、风格测试和短视频素材准备都需要反复找参考、写提示词、出图筛选和视频延展，适合用 AI 工作流降低重复素材准备成本、缩短上架准备周期。",
    responsibilities: [
      "拆解服装电商主图生产流程，把平台调性、服装类型、风格方向、视觉卖点整理成结构化输入",
      "设计批量生成链路，让同一商品方向一次产出多张主图候选，快速测试不同视觉风格和平台适配性",
      "保留人工筛选和反馈环节，判断主图是否符合平台调性、服装风格和转化展示需求，避免盲目生成",
      "将通过筛选的电商主图延展为宣传视频素材，验证从静态商品图到短视频投放素材的完整链路",
      "用 AI 协作开发方式搭建可演示工作流，把原本分散在对话和生成工具里的操作整理成可复用 SOP"
    ],
    tools: ["Codex", "Cursor", "AIGC 生图工具", "图生视频工具", "Prompt 规则库", "工作流原型", "人工筛选反馈"],
    screenshots: ecommerceScreenshots,
    demoVideo: {
      title: "电商主图与视频生成工作流演示",
      description: "展示从平台选择、服装类型配置到批量主图生成、图生视频延展的完整流程",
      videoHref: ecommerceWorkflowVideoHref
    },
    proof: [
      "工作流原型已跑通：用 Codex 搭建配置界面，支持平台/类型/风格的结构化输入",
      "批量生成链路已验证：接入 AIGC 生图 API，实现一次生成多张主图候选和人工筛选反馈",
      "图生视频延展已打通：基于选中主图生成宣传视频素材，验证完整内容生产链路",
      "Prompt 规则库已沉淀：设计风格模板和提示词规范，保证不同风格的视觉一致性",
      "工作流演示视频已录制：展示从平台选择到批量主图生成、图生视频延展的完整流程",
      "可对标 AI 商拍平台的降本提效案例，用于说明该工作流适合电商视觉素材生产场景"
    ],
    values: [
      "把服装电商视觉素材准备从单次手工生成，改成可配置、可批量、可复盘的半自动流程，降低重复劳动成本",
      "帮助运营快速测试不同平台、不同服装风格下的主图方向，减少反复写提示词和找参考的时间，提升上架效率",
      "把主图生成和宣传视频延展串成同一条内容生产链路，更贴近真实电商上架和投放需求，提高素材复用率",
      "对标 AI 商拍降本提效方向，证明 AI 工作流在电商视觉素材生产中的业务适配价值"
    ],
    metrics: [
      { value: "行业参考", label: "商拍降本", note: "对标 AI 商拍平台案例" },
      { value: "效率目标", label: "上架提效", note: "减少重复素材准备" },
      { value: "批量", label: "主图候选", note: "一次生成多张可筛选" },
      { value: "图生视频", label: "素材延展", note: "主图到宣传视频链路" }
    ]
  },
  {
    kind: "comicConsole",
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
    summary: "用 Hermes 作为主要对话入口，每天 23:00 自动整理本地会话，把工作推进、AI学习、项目经验和待办沉淀到 Obsidian，减少手动写日报、整理文档和回顾任务的时间，让日常沟通转化为可复盘、可检索的知识资产。",
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
      "不保存原始对话，默认只沉淀摘要与可执行待办",
      "可查看 Obsidian 关系图谱与中文目录结构截图"
    ],
    screenshots: knowledgeBaseScreenshots,
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
    title: "飞书 CLI 与企业协作 Agent 工作流探索",
    subtitle: "Feishu CLI / Enterprise Agent Workflow",
    focus: "会议、日程、文档、表格和待办的企业协作自动化预研",
    summary: "围绕飞书 Agent 生态和飞书 CLI，拆解企业协作中的会议纪要、日程安排、文档更新、多维表格记录和日报复盘场景，探索外部 AI Agent 如何把分散办公动作串成可确认、可执行、可复盘的企业工作流。",
    background:
      "项目背景：很多团队的会议结论、任务跟进、文档更新和表格维护分散在不同协作入口中，人工整理和跨部门同步成本高。该方向用于探索把企业协作平台接入 AI Agent，让重复办公动作具备自动化入口。",
    responsibilities: [
      "梳理 Aily、妙搭、多维表格 Agent、飞书 CLI 的适用场景和能力边界",
      "设计“语音 / 会议记录 -> 待办拆解 -> 日程 / 文档 / 表格更新”的自动化流程",
      "把审批、信息收集、项目管理等业务需求拆成低代码工具和 Agent 执行方案",
      "规划企业协作 Agent 的授权范围、人工确认、数据边界和失败兜底机制"
    ],
    tools: ["飞书", "飞书 CLI", "Aily", "妙搭", "多维表格", "Hermes", "Codex"],
    proof: ["预研中：已完成飞书 Agent 生态和 CLI 场景拆解", "覆盖会议、日程、文档、表格、待办等高频协作动作", "强调关键写入前人工确认，避免无控制自动执行"],
    values: [
      "降低业务团队搭建内部工具和自动化流程的门槛",
      "减少会议纪要、日报、任务跟进和表格维护中的重复劳动",
      "把个人 AI 工作流经验迁移到企业组织效能场景",
      "让人负责目标设定、规则管理和结果确认，Agent 负责重复执行动作"
    ],
    metrics: [
      { value: "4类", label: "Agent 入口", note: "Aily / 妙搭 / 多维表格 / CLI" },
      { value: "5项", label: "协作动作", note: "会议 / 日程 / 文档 / 表格 / 待办" },
      { value: "确认制", label: "安全策略", note: "关键写入前人工确认" }
    ]
  },
  {
    icon: BarChart3,
    title: "短视频账号内容运营",
    subtitle: "Short Video Content Operations",
    focus: "多平台内容测试与复盘",
    summary: "围绕小红书、抖音、YouTube 持续测试选题、标题、封面和内容结构，后台截图显示抖音播放 60 万+、YouTube 观看 8 万+，用数据反馈迭代内容方向。",
    background: "基于多平台内容发布经验，持续测试不同内容方向、标题、封面、选题和视频结构，把播放量、互动和平台反馈转化为下一轮内容优化依据。",
    responsibilities: ["短视频内容创作", "选题策划与脚本组织", "标题 / 封面 / 内容结构测试", "平台数据观察", "内容方向迭代", "多平台发布与复盘"],
    platforms: ["小红书", "抖音", "YouTube", "TikTok"],
    proof: [
      "抖音数据中心截图：阶段播放 60 万+，账号诊断超过同类作者",
      "YouTube Studio 截图：观看 8 万+，观看时长 180 小时+",
      "小红书近 30 日浏览量 7 万+",
      "数据来自个人运营账号阶段性统计，用于说明内容测试和平台反馈经验"
    ],
    values: ["积累多平台内容判断和运营经验", "能够结合数据反馈调整选题与结构", "对短视频内容节奏和爆款结构有实操理解"],
    metrics: [
      { value: "60万+", label: "抖音播放验证", note: "数据中心截图", proof: shortVideoScreenshots.douyin },
      { value: "8万+", label: "YouTube 观看", note: "YouTube Studio 截图" },
      { value: "百万+", label: "抖音内容浏览", note: "账号阶段性数据" },
      { value: "7万+", label: "小红书近 30 日浏览", note: "短周期内容验证" }
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
  { title: "AIGC 视频 / 图像工具", subtitle: "用于生图、生视频和提示词迭代，服务电商主图和内容生产", tools: ["即梦", "Seedance", "Midjourney", "ComfyUI"] },
  { title: "内容生产 / 剪辑工具", subtitle: "完成剪辑、包装和成片交付", tools: ["剪映", "CapCut"] },
  { title: "文档 / 平台经验", subtitle: "沉淀流程、企业协作、内容发布和数据反馈", tools: ["飞书 CLI", "飞书多维表格", "Notion", "Excel", "抖音", "小红书", "YouTube", "TikTok"] }
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
  onAutomationDemo: (demo: AutomationDemo) => void;
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
        {group.items.map((item) => {
          const demo = shouldShowAutomationDemo ? getAutomationDemoForItem(item) : null;

          return (
            <li className={demo ? "has-demo-action" : undefined} key={item}>
              <CheckCircle2 size={14} aria-hidden="true" />
              <span>{item}</span>
              {demo && (
                <button className="resume-capability-demo-button" type="button" onClick={() => onAutomationDemo(demo)}>
                  查看演示
                </button>
              )}
            </li>
          );
        })}
      </ul>
    </article>
  );
}

function AutomationCaseCard({
  item,
  index,
  onAutomationDemo
}: {
  item: AutomationCase;
  index: number;
  onAutomationDemo: (demo: AutomationDemo) => void;
}): JSX.Element {
  const Icon = item.icon;
  const demo = item.demo;
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
      {demo && (
        <button className="resume-ops-demo-button" type="button" onClick={() => onAutomationDemo(demo)}>
          <PlayCircle size={15} aria-hidden="true" />
          查看演示视频
        </button>
      )}
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
  onImagePreview,
  onVideoPlay
}: {
  project: ProjectItem;
  index: number;
  onImagePreview: (image: ImagePreview) => void;
  onVideoPlay: (video: { title: string; description: string; videoHref: string }) => void;
}): JSX.Element {
  const Icon = project.icon;
  const isConsoleProject = project.kind === "comicConsole";
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
              {metric.proof && (
                <button
                  type="button"
                  className="resume-metric-proof-button"
                  onClick={() => {
                    if (metric.proof) {
                      onImagePreview(metric.proof);
                    }
                  }}
                >
                  <Search size={13} aria-hidden="true" />
                  查看截图
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {project.demoVideo && (
        <div className="resume-project-demo-video" aria-label={`${project.title}演示视频`}>
          <div className="resume-project-demo-head">
            <span>WORKFLOW DEMO</span>
            <strong>工作流演示视频</strong>
          </div>
          <button
            className="resume-project-demo-button"
            type="button"
            onClick={() => onVideoPlay(project.demoVideo!)}
            aria-label={`播放${project.title}演示视频`}
          >
            <PlayCircle size={18} aria-hidden="true" />
            <span>查看完整工作流演示</span>
          </button>
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

      {project.screenshots && (
        <div className="resume-project-proof-media" aria-label={`${project.title}证据截图`}>
          <div className="resume-console-screenshots-head">
            <span>PROOF SCREENS</span>
            <strong>证据截图</strong>
          </div>
          <div className="resume-project-proof-grid">
            {project.screenshots.map((shot) => (
              <figure className="resume-project-proof-card" key={shot.title}>
                <button type="button" onClick={() => onImagePreview(shot)} aria-label={`放大查看 ${shot.title}`}>
                  <img src={shot.src} alt={`${project.title} - ${shot.title}`} loading="lazy" />
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
  const [activeAutomationDemo, setActiveAutomationDemo] = useState<AutomationDemo | null>(null);
  const [activeImagePreview, setActiveImagePreview] = useState<ImagePreview | null>(null);
  const [activeProjectVideo, setActiveProjectVideo] = useState<{ title: string; description: string; videoHref: string } | null>(null);

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
            把服装电商主图生成、宣传视频延展、自媒体运营、岗位筛选和知识沉淀这些重复流程，拆成规则、脚本、Agent 流程和可演示工具。
          </p>

          <div className="resume-quick-read" aria-label="30秒看懂我">
            <span>核心展示</span>
            <p>更适合需要把电商视觉素材生产、重复网页动作、内容生产流程和 AI 对话沉淀做成可执行工作流的团队。</p>
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
            我更关注“AI 怎么进入真实业务流程”：把电商视觉素材生产、内容判断、平台运营经验、网页自动化和 AI 工具结合起来，拆解主图生成、宣传视频延展、自媒体运营、岗位筛选、项目情报和知识沉淀这些高频流程。
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
            <CapabilityCard group={group} index={index} onAutomationDemo={setActiveAutomationDemo} key={group.title} />
          ))}
        </div>
      </section>

      <section className="resume-screen resume-ops-lab" id="resume-ops-lab" aria-labelledby="resume-ops-title">
        <div className="resume-section-header">
          <SectionKicker index="04" label="Business Automation Lab" />
          <h2 id="resume-ops-title">业务运营自动化脚本集</h2>
          <p>
            这组工具面向自媒体运营、岗位筛选和项目调研中的高频重复网页操作，把人工点击、筛选、记录和复盘整理成可演示的自动化流程，减少重复劳动，提高运营和信息收集效率。
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
            <AutomationCaseCard item={item} index={index} onAutomationDemo={setActiveAutomationDemo} key={item.title} />
          ))}
        </div>
      </section>

      <section className="resume-screen resume-projects" id="resume-projects" aria-labelledby="resume-project-title">
        <div className="resume-section-header">
          <SectionKicker index="05" label="Project Experience" />
          <h2 id="resume-project-title">项目经历</h2>
          <p>重点展示电商视觉素材生产、AI 工具协作、AIGC 内容生产、知识库沉淀和企业协作自动化能力，覆盖需求拆解、工具组合、状态复盘和内容交付。</p>
        </div>
        <div className="resume-project-list">
          {projects.map((project, index) => (
            <ProjectCard project={project} index={index} key={project.title} onImagePreview={setActiveImagePreview} onVideoPlay={setActiveProjectVideo} />
          ))}
        </div>
      </section>

      <section className="resume-screen resume-ai-extension" aria-labelledby="resume-ai-extension-title">
        <div className="resume-section-header">
          <SectionKicker index="06" label="Agent Tool Research" />
          <h2 id="resume-ai-extension-title">AI Agent 工具调研与自动化验证</h2>
          <p>
            这部分关注 AI Agent 能不能真正提升工作效率：围绕网页自动化、任务拆解、文件处理和本地工作流，验证不同工具能否减少重复操作、缩短任务处理时间，并服务真实内容生产与运营提效。
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
      {activeAutomationDemo && (
        <div
          className="resume-video-modal"
          role="dialog"
          aria-modal="true"
          aria-label={activeAutomationDemo.title}
          onClick={() => setActiveAutomationDemo(null)}
        >
          <div className="resume-video-modal-panel" onClick={(event) => event.stopPropagation()}>
            <div className="resume-video-modal-head">
              <div>
                <span>AI AUTOMATION PROOF</span>
                <h3>{activeAutomationDemo.title}</h3>
                <p>{activeAutomationDemo.description}</p>
              </div>
              <button type="button" onClick={() => setActiveAutomationDemo(null)} aria-label="关闭演示">
                <X size={18} aria-hidden="true" />
              </button>
            </div>
            <video className="resume-video-modal-player" src={activeAutomationDemo.videoHref} controls preload="metadata" />
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
      {activeProjectVideo && (
        <div
          className="resume-video-modal"
          role="dialog"
          aria-modal="true"
          aria-label={activeProjectVideo.title}
          onClick={() => setActiveProjectVideo(null)}
        >
          <div className="resume-video-modal-panel" onClick={(event) => event.stopPropagation()}>
            <div className="resume-video-modal-head">
              <div>
                <span>PROJECT WORKFLOW DEMO</span>
                <h3>{activeProjectVideo.title}</h3>
                <p>{activeProjectVideo.description}</p>
              </div>
              <button type="button" onClick={() => setActiveProjectVideo(null)} aria-label="关闭演示视频">
                <X size={18} aria-hidden="true" />
              </button>
            </div>
            <video className="resume-video-modal-player" src={activeProjectVideo.videoHref} controls autoPlay preload="metadata" />
          </div>
        </div>
      )}
    </main>
  );
}
