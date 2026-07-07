import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  Bot,
  Bookmark,
  CheckCircle2,
  Clock,
  Code,
  Database,
  Eye,
  FileText,
  Globe,
  Image as ImageIcon,
  Images,
  Layers,
  Layout,
  Lightbulb,
  LucideIcon,
  Monitor,
  Package,
  Palette,
  Play,
  RefreshCw,
  Search,
  Shirt,
  Sliders,
  Sparkles,
  Target,
  Terminal,
  Upload,
  UserCircle2,
  Video,
  VideoOff,
  Workflow,
  Wrench,
  Zap
} from "lucide-react";
import type { MouseEvent as ReactMouseEvent } from "react";
// @ts-expect-error -- Particles is provided as a local React Bits JSX module.
import Particles from "./Particles";
import "./project-case.css";

// 与站内其它页一致的路由 href 生成(剥掉 /resume 或 /projects/xxx 段回到 base)
function getAppRouteHref(route = ""): string {
  const basePath = window.location.pathname
    .replace(/\/(?:resume|profile)\/?$/, "/")
    .replace(/\/projects\/[^/]+\/?$/, "/")
    .replace(/\/index\.html$/, "/");
  const normalizedBase = basePath.endsWith("/") ? basePath : `${basePath}/`;
  return `${normalizedBase}${route}`;
}

const caseBgAsset = new URL(
  "./assets/static/media/section2-city-bg.png",
  import.meta.url
).href;

function iconFor(text: string, fallback: LucideIcon = Sparkles): LucideIcon {
  const t = text.toLowerCase();
  if (t.includes("平台") || t.includes("控制台") || t.includes("console") || t.includes("创作台")) return Monitor;
  if (t.includes("服装") || t.includes("类型")) return Shirt;
  if (t.includes("风格") || t.includes("方向")) return Palette;
  if (t.includes("参数") || t.includes("配置") || t.includes("设置")) return Sliders;
  if (t.includes("批量") || t.includes("主图") || t.includes("图片") || t.includes("截图")) return Images;
  if (t.includes("复核") || t.includes("筛选") || t.includes("审核") || t.includes("review") || t.includes("检查")) return Eye;
  if (t.includes("视频") || t.includes("video") || t.includes("延展")) return Video;
  if (t.includes("素材") || t.includes("投放") || t.includes("上传")) return Upload;
  if (t.includes("周期") || t.includes("时间") || t.includes("效率") || t.includes("小时") || t.includes("分钟")) return Clock;
  if (t.includes("复用") || t.includes("覆盖") || t.includes("sku")) return RefreshCw;
  if (t.includes("产出") || t.includes("数量") || t.includes("候选")) return Package;
  if (t.includes("效率") || t.includes("提效") || t.includes("加速")) return Zap;
  if (t.includes("不可控") || t.includes("风险") || t.includes("难点")) return AlertTriangle;
  if (t.includes("连贯") || t.includes("穿模") || t.includes("变形") || t.includes("抖动")) return VideoOff;
  if (t.includes("即梦") || t.includes("可灵") || t.includes("comfy") || t.includes("dify") || t.includes("工具")) return Wrench;
  if (t.includes("react") || t.includes("node") || t.includes("sqlite") || t.includes("python") || t.includes("typescript")) return Code;
  if (t.includes("dify") || t.includes("claude") || t.includes("sonnet") || t.includes("langgraph") || t.includes("llm")) return Bot;
  if (t.includes("agent")) return Bot;
  if (t.includes("obsidian")) return Bookmark;
  if (t.includes("资料库") || t.includes("知识库") || t.includes("archive") || t.includes("沉淀") || t.includes("数据")) return Database;
  if (t.includes("历史")) return Clock;
  if (t.includes("发布")) return Upload;
  if (t.includes("流程") || t.includes("workflow")) return Workflow;
  if (t.includes("项目") || t.includes("任务")) return FileText;
  if (t.includes("搜索") || t.includes("检索")) return Search;
  if (t.includes("终端") || t.includes("命令")) return Terminal;
  if (t.includes("播放") || t.includes("演示")) return Play;
  return fallback;
}

type CaseMedia = {
  title: string;
  description: string;
  src: string;
  poster?: string;
  kind: "image" | "video";
};

type CaseResult = { value: string; label: string; detail: string };
type CaseTool = { name: string; note: string };
type CaseNeighbor = { slug: string; title: string } | null;

type CaseFlowStep = {
  label: string;
  desc: string;
  phase: string;
};

type CaseChallenge = {
  title: string;
  problem: string;
  solution: string;
};

type CaseFeature = {
  title: string;
  description: string;
};

type CaseDeliveryCheck = {
  label: string;
  status: string;
  detail: string;
};

type ProjectCase = {
  slug: string;
  index: string;
  label: string;
  title: string;
  lead: string;
  problem: string[];
  role: string[];
  flow: CaseFlowStep[];
  coreFeatures?: CaseFeature[];
  challenges?: CaseChallenge[];
  deliveryChecks?: CaseDeliveryCheck[];
  results: CaseResult[];
  tools: CaseTool[];
  media: CaseMedia[];
  next: CaseNeighbor;
};

const caseMediaAssets = {
  "automation/boss-job-assistant-web.mp4": new URL("./assets/static/media/automation/boss-job-assistant-web.mp4", import.meta.url).href,
  "automation/self-media-ops-assistant.m4v": new URL("./assets/static/media/automation/self-media-ops-assistant.m4v", import.meta.url).href,
  "console/console-assets.png": new URL("./assets/static/media/console/console-assets.png", import.meta.url).href,
  "console/console-project-create.png": new URL("./assets/static/media/console/console-project-create.png", import.meta.url).href,
  "console/console-tasks.png": new URL("./assets/static/media/console/console-tasks.png", import.meta.url).href,
  "dify/dify-asset-analysis.png": new URL("./assets/static/media/dify/dify-asset-analysis.png", import.meta.url).href,
  "dify/dify-task-review.png": new URL("./assets/static/media/dify/dify-task-review.png", import.meta.url).href,
  "dify/dify-video-tasks.png": new URL("./assets/static/media/dify/dify-video-tasks.png", import.meta.url).href,
  "ecommerce/ecommerce-assistant-results.png": new URL("./assets/static/media/ecommerce/ecommerce-assistant-results.png", import.meta.url).href,
  "ecommerce/batch-images.png": new URL("./assets/static/media/ecommerce/batch-images.png", import.meta.url).href,
  "ecommerce/ecommerce-creation-records.png": new URL("./assets/static/media/ecommerce/ecommerce-creation-records.png", import.meta.url).href,
  "ecommerce/ecommerce-generator-home.png": new URL("./assets/static/media/ecommerce/ecommerce-generator-home.png", import.meta.url).href,
  "ecommerce/ecommerce-history-preview.png": new URL("./assets/static/media/ecommerce/ecommerce-history-preview.png", import.meta.url).href,
  "ecommerce/ecommerce-workflow-full-demo.poster.jpg": new URL("./assets/static/media/ecommerce/ecommerce-workflow-full-demo.poster.jpg", import.meta.url).href,
  "ecommerce/ecommerce-workflow-full-demo.web.mp4": new URL("./assets/static/media/ecommerce/ecommerce-workflow-full-demo.web.mp4", import.meta.url).href,
  "ecommerce/ecommerce-workflow-demo.mp4": new URL("./assets/static/media/ecommerce/ecommerce-workflow-demo.mp4", import.meta.url).href,
  "ecommerce/video-generation.png": new URL("./assets/static/media/ecommerce/video-generation.png", import.meta.url).href,
  "ecommerce/workflow-config.png": new URL("./assets/static/media/ecommerce/workflow-config.png", import.meta.url).href,
  "guga/ai-content-ops-workbench-demo.poster.jpg": new URL("./assets/static/media/guga/ai-content-ops-workbench-demo.poster.jpg", import.meta.url).href,
  "guga/ai-content-ops-workbench-demo.web.mp4": new URL("./assets/static/media/guga/ai-content-ops-workbench-demo.web.mp4", import.meta.url).href,
  "guga/guga-prepublish-gate.png": new URL("./assets/static/media/guga/guga-prepublish-gate.png", import.meta.url).href,
  "guga/guga-preview-demo.png": new URL("./assets/static/media/guga/guga-preview-demo.png", import.meta.url).href,
  "guga/guga-provider-status.png": new URL("./assets/static/media/guga/guga-provider-status.png", import.meta.url).href,
  "guga/guga-task18-real-workflow-metadata.png": new URL("./assets/static/media/guga/guga-task18-real-workflow-metadata.png", import.meta.url).href,
  "guga/guga-task18-real-workflow-preview.png": new URL("./assets/static/media/guga/guga-task18-real-workflow-preview.png", import.meta.url).href,
  "guga/guga-task18-real-workflow-technical.png": new URL("./assets/static/media/guga/guga-task18-real-workflow-technical.png", import.meta.url).href,
  "guga/guga-technical-demo.png": new URL("./assets/static/media/guga/guga-technical-demo.png", import.meta.url).href,
  "proof/obsidian-knowledge-graph.png": new URL("./assets/static/media/proof/obsidian-knowledge-graph.png", import.meta.url).href
} as const;

const mediaBase = (subdir: string, file: string): string => {
  const key = `${subdir}/${file}` as keyof typeof caseMediaAssets;
  return caseMediaAssets[key];
};

const PROJECT_CASES: Record<string, ProjectCase> = {
  "ecommerce-aigc-workflow": {
    slug: "ecommerce-aigc-workflow",
    index: "02",
    label: "E-COMMERCE AIGC WORKFLOW",
    title: "服装电商主图 / 宣传视频生成工作流",
    lead: "围绕服装电商上新场景，设计一套可配置、可批量、带人工复核的 AIGC 素材生产系统。系统把平台调性、服装类型、风格方向等模糊需求结构化，再调度生成工具批量产出候选素材，最终经人工筛选后输出可投放素材包。当前为本地工作流原型，核心链路已跑通，服务化部署为后续扩展方向。",
    problem: [
      "服装电商上新时，每个 SKU 需要适配天猫/抖音/小红书等平台的尺寸和调性，传统设计 + 修图流程通常按天计算，风格还容易不统一。",
      "主图之外还需宣传短视频，传统流程要单独组织剪辑和素材生产，图像与视频链路割裂，复用成本高。",
      "直接使用通用 AI 出图不可控：同一批次风格发散、人物姿态和面料质感不稳定，生成素材需要大量人工返工。"
    ],
    role: [
      "独立设计系统架构：输入解析层（平台/品类/风格配置）、生成调度层（主图批量生成 + 图生视频延展）、人工复核层（筛选 + 反馈回流），定义各层输入输出格式。",
      "把模糊审美需求工程化：将平台调性、服装类型、风格方向映射为可复用的结构化配置，包括 Prompt 模板、参考图集、负面词和生成参数。",
      "负责工具链选型与集成：即梦承担静态主图生成，可灵承担图生视频延展，ComfyUI 承担节点化编排，Dify 承担 Prompt 版本和配置规则沉淀。",
      "当前已实现本地可运行原型；若产品化，可扩展为任务队列服务 + 生成引擎 + 审核中台 + 发布网关的四段式架构。"
    ],
    flow: [
      {
        label: "平台调性",
        desc: "将天猫/抖音/小红书的尺寸规范、留白规则、文字占比上限编码为平台配置，作为后续生成的约束条件。",
        phase: "输入定义"
      },
      {
        label: "服装类型",
        desc: "区分上衣、裙装、外套等品类，匹配面料表现、模特姿态和场景光照的基础参数。",
        phase: "输入定义"
      },
      {
        label: "风格方向",
        desc: "把品牌视觉要求转译为可复用的风格词、参考图和固定种子，控制生成结果一致性。",
        phase: "输入定义"
      },
      {
        label: "参数配置",
        desc: "将平台调性 + 服装类型 + 风格方向映射为模型、Prompt、负面词和采样设置，形成可存档的配置文件。",
        phase: "输入定义"
      },
      {
        label: "候选主图生成",
        desc: "基于配置批量生成多张候选图，覆盖不同构图和卖点表达，供人工筛选。",
        phase: "批量生成"
      },
      {
        label: "人工复核筛选",
        desc: "按品牌调性匹配度、细节准确度、投放可用性打分，不通过的结果反馈回流，触发下一轮调参。",
        phase: "批量生成"
      },
      {
        label: "图生视频",
        desc: "从精选主图出发，控制运动幅度和关键帧，生成可用于短视频投放的动态素材。",
        phase: "内容延展"
      },
      {
        label: "素材包输出",
        desc: "输出符合各平台尺寸、时长和格式要求的最终素材包，直接进入投放或内容库。",
        phase: "内容延展"
      }
    ],
    challenges: [
      {
        title: "风格一致性控制",
        problem: "通用 AI 出图风格发散，同一批次结果差异大，无法稳定对齐品牌调性。",
        solution: "设计三层约束机制：结构化 Prompt 控制构图和元素，参考图集约束视觉方向，固定参数保留风格基底。将风格一致性从随机生成转化为可配置、可复用的系统能力。"
      },
      {
        title: "图生视频质量保障",
        problem: "静态主图转视频时可能出现衣物变形、穿模或背景抖动，直接输出不可用。",
        solution: "在生成参数层限定运动幅度，优先使用轻微运镜和局部动态；在人工复核层增加视频可用性检查，不通过则回退到主图重新生成。"
      }
    ],
    deliveryChecks: [
      {
        label: "真实业务问题",
        status: "已覆盖",
        detail: "服装 SKU 上新需要多平台主图和短视频素材，传统流程慢且风格不稳定。"
      },
      {
        label: "工程结构",
        status: "本地原型",
        detail: "当前是本地工作流原型，已拆输入配置、生成调度、人工复核和输出素材包；不是完整后端系统。"
      },
      {
        label: "任务规划",
        status: "分段执行",
        detail: "平台调性、服装类型、风格方向、批量主图、人工筛选、图生视频分段处理。"
      },
      {
        label: "人机协同",
        status: "人工确认",
        detail: "人工负责筛选、返工判断和最终投放素材确认。"
      },
      {
        label: "可观测 / 复盘",
        status: "可沉淀",
        detail: "配置、候选图、返工原因和输出结果可以沉淀为下一批 SKU 的参考。"
      }
    ],
    results: [
      {
        value: "约 15 分钟级",
        label: "出图周期",
        detail: "单批主图从传统数小时级压缩到约 15 分钟级。基于多次本地运行观察的效率估算，具体数据需接入实际业务后校准。"
      },
      {
        value: "6 + 2",
        label: "批量产出",
        detail: "一次配置约产出 6 张主图候选 + 2 条延展短视频。产出数量与配置复杂度相关，当前为原型阶段观察值。"
      },
      {
        value: "约 70%",
        label: "配置复用",
        detail: "同风格配置存档后，新品上调参成本降低约 70%。这是基于本地 SKU 验证的估算口径，需在真实业务批次中继续校准。"
      }
    ],
    tools: [
      { name: "即梦专业版", note: "负责服装主图生成。在系统中作为视觉生成引擎，重点验证面料质感、人物姿态和商品展示稳定性。" },
      { name: "可灵 AI", note: "负责图生视频延展。在系统中作为动态内容生成模块，用于把精选主图扩展为短视频素材。" },
      { name: "ComfyUI", note: "负责节点化工作流编排。在系统中作为配置管理层，把平台/服装/风格参数映射为可复用的生成配置。" },
      { name: "Dify", note: "负责 Prompt 版本管理和结构化输入。在系统中作为规则沉淀层，方便维护配置、模板和复核标准。" }
    ],
    media: [
      {
        title: "服装电商视觉工作流完整流程演示",
        description: "从配置、批量主图生成到视频延展的完整录屏，用于查看端到端工作流如何跑通。",
        src: mediaBase("ecommerce", "ecommerce-workflow-full-demo.web.mp4"),
        poster: mediaBase("ecommerce", "ecommerce-workflow-full-demo.poster.jpg"),
        kind: "video"
      },
      {
        title: "历史预览 / 淘宝上架图组",
        description: "最近生成记录中的 4 张上架图，包含主图、细节图、模特图和干净商品图，体现一次任务的成组输出结果。",
        src: mediaBase("ecommerce", "ecommerce-history-preview.png"),
        kind: "image"
      },
      {
        title: "SKU 生图配置台",
        description: "选择服装库、模特库和参考图后，按场景、比例、卖点、风格和图片数量组织生图任务。",
        src: mediaBase("ecommerce", "ecommerce-generator-home.png"),
        kind: "image"
      },
      {
        title: "创作记录侧栏",
        description: "沉淀最近生成图片和历史图片包，支持回看、导出和复用，避免每次生成后只留下零散素材。",
        src: mediaBase("ecommerce", "ecommerce-creation-records.png"),
        kind: "image"
      },
      {
        title: "辅助结果 / 调用日志",
        description: "记录补图、风险检查、文案生成等辅助结果，方便定位一次生成任务中的过程状态和问题来源。",
        src: mediaBase("ecommerce", "ecommerce-assistant-results.png"),
        kind: "image"
      }
    ],
    next: { slug: "aigc-console", title: "AI 漫剧 / 视频生产控制台" }
  },

  "aigc-console": {
    slug: "aigc-console",
    index: "03",
    label: "AIGC PRODUCTION CONSOLE",
    title: "AI 漫剧 / 视频生产控制台",
    lead: "面向 AI 漫剧生产场景，设计从小说解析到视频任务执行的本地生产控制台。系统把小说文本、人物资产、场景资产、视频任务和运行日志放进同一条可追踪流程中；当前为本地控制台原型，尚未做多用户服务化和生产级权限管理。",
    problem: [
      "AI 漫剧生产需要同时处理小说片段、角色设定、场景设定、参考图和视频任务，纯脚本执行时状态分散，失败后难以复盘。",
      "人物和场景资产如果没有人工确认节点，后续视频任务会引用错误素材，导致生成成本被无效任务消耗。",
      "直接依赖通用对话工具生成提示词，缺少项目上下文、资产编号和任务状态记录，难以形成可重复的生产 SOP。"
    ],
    role: [
      "独立设计系统架构：小说解析层、资产确认层、任务生成层、执行记录层和复盘层，定义项目状态、资产引用和任务输出格式。",
      "将生产流程拆成项目创建、资产确认、视频任务生成、任务执行、结果复盘五个阶段，并在资产确认和任务执行前保留人工确认点。",
      "负责工具链选型与集成：TypeScript/React 承担控制台界面，Python/Node 脚本承担任务编排，Dreamina CLI 承担生成任务提交，Dify 知识库承担角色/场景规则生成，SQLite/JSON 承担本地状态记录。",
      "当前已实现本地可运行控制台；若产品化，可扩展为任务队列、资产数据库、权限系统、成本统计和生成服务网关。"
    ],
    flow: [
      { label: "小说输入", desc: "录入小说片段、画幅比例、项目风格和生成模式，初始化项目状态并写入本地记录。", phase: "输入定义" },
      { label: "上下文解析", desc: "调用知识库规则提取人物、场景、镜头信息，生成可被资产层引用的结构化字段。", phase: "输入定义" },
      { label: "资产卡确认", desc: "把人物和场景设定展示为资产卡，人工确认后才允许进入视频任务生成，避免错误素材继续扩散。", phase: "资产治理" },
      { label: "参考图绑定", desc: "为人物和场景绑定参考图编号，后续视频任务只引用已确认资产，减少角色漂移。", phase: "资产治理" },
      { label: "任务生成", desc: "根据已确认资产生成 1-3 条结构化视频任务，包含提示词、参考图路径、执行参数和状态字段。", phase: "任务执行" },
      { label: "CLI 执行", desc: "通过 Dreamina CLI 或 dry-run 分支提交任务，记录 submit_id、输出路径、错误信息和成本保护状态。", phase: "任务执行" },
      { label: "日志复盘", desc: "集中查看任务参数、执行日志、生成结果和失败原因，支持人工决定重跑、调参或归档。", phase: "结果复盘" },
      { label: "数据归档", desc: "将项目数据、资产卡、任务结果和复盘备注保存在本地文件/SQLite 结构中，为下次项目复用。", phase: "结果复盘" }
    ],
    challenges: [
      {
        title: "资产一致性",
        problem: "小说转视频时人物、服装、场景和参考图容易混乱，后续任务一旦引用错误资产，会造成连续返工。",
        solution: "把资产确认设计成独立状态节点：只有被人工确认的人物卡、场景卡和参考图编号才能进入任务生成层，失败任务可回到资产层重新绑定。"
      },
      {
        title: "生成成本与失败复盘",
        problem: "视频生成任务耗时且有成本，如果没有 dry-run、日志和状态记录，失败后很难定位是提示词、资产还是执行参数的问题。",
        solution: "保留 dry-run / live-run 分支，并记录 submit_id、输出路径、错误原因和任务版本，让每次执行都能被复盘和重放。"
      }
    ],
    deliveryChecks: [
      {
        label: "真实业务问题",
        status: "已覆盖",
        detail: "AI 漫剧/视频生产需要管理小说分析、资产、提示词、视频任务和失败复盘。"
      },
      {
        label: "工程结构",
        status: "本地控制台",
        detail: "本地控制台把项目、资产、任务和状态集中管理；生产化需任务队列和多人权限。"
      },
      {
        label: "任务规划",
        status: "分段执行",
        detail: "从小说分析到资产确认、Prompt 生成、视频任务、失败复盘分段执行。"
      },
      {
        label: "人机协同",
        status: "人工确认",
        detail: "关键资产、角色一致性和失败返工由人工确认。"
      },
      {
        label: "可观测 / 复盘",
        status: "控制台记录",
        detail: "失败原因、任务状态和素材版本进入控制台记录。"
      }
    ],
    results: [
      { value: "3 页", label: "核心控制台", detail: "项目创建、资产确认、任务执行三页已形成可演示闭环。基于当前本地原型统计，后续可按业务流程继续扩展。" },
      { value: "1-3 条", label: "任务候选", detail: "单次资产确认后可生成 1-3 条结构化视频任务。数量为当前任务模板的观察口径，不代表生产上限。" },
      { value: "可复盘", label: "日志留存", detail: "每次任务保留参数、状态、输出路径和失败原因，当前为本地日志/文件记录，生产化后需接入数据库与监控。"}
    ],
    tools: [
      { name: "React + TypeScript", note: "在系统中承担本地控制台界面角色，负责项目、资产、任务和日志的可视化操作。" },
      { name: "Python / Node.js", note: "在系统中承担任务编排层角色，负责调用知识库、拼装任务参数、驱动 CLI 或 dry-run。" },
      { name: "Dreamina CLI", note: "在系统中承担生成执行层角色，负责真实生成任务提交和结果路径回写，配合 dry-run 控制成本。" },
      { name: "Dify 知识库", note: "在系统中承担上下文规则层角色，用于把小说片段转成角色、场景和视频任务结构。" },
      { name: "SQLite / JSON 文件", note: "在系统中承担本地状态存储角色，记录项目数据、资产引用、任务结果和复盘日志。" }
    ],
    media: [
      {
        title: "项目创建",
        description: "小说输入、项目风格、比例、生成模式和状态概览。体现从原始文本到结构化项目的初始化能力。",
        src: mediaBase("console", "console-project-create.png"),
        kind: "image"
      },
      {
        title: "资产确认",
        description: "人物/场景资产卡、参考图候选和人工确认流程。体现高风险资产进入执行前必须人工确认。",
        src: mediaBase("console", "console-assets.png"),
        kind: "image"
      },
      {
        title: "任务执行",
        description: "视频任务、参考图路径、生成结果和运行日志复盘。体现任务状态、失败原因和输出路径可追踪。",
        src: mediaBase("console", "console-tasks.png"),
        kind: "image"
      },
      {
        title: "Dify 资产分析",
        description: "基于知识库规则，从小说片段生成角色设定、场景设定和参考图提示词。体现上下文规则层能力。",
        src: mediaBase("dify", "dify-asset-analysis.png"),
        kind: "image"
      },
      {
        title: "Dify 视频任务生成",
        description: "基于已确认人物与场景，生成 1-3 条结构化视频任务。体现资产确认后的任务生成链路。",
        src: mediaBase("dify", "dify-video-tasks.png"),
        kind: "image"
      },
      {
        title: "Dify 任务质检",
        description: "检查镜头可执行性、平台安全风险和提示词过载问题，输出修改建议。体现执行前的质量闸门。",
        src: mediaBase("dify", "dify-task-review.png"),
        kind: "image"
      }
    ],
    next: { slug: "automation-scripts", title: "自媒体运营自动化脚本集" }
  },

  "automation-scripts": {
    slug: "automation-scripts",
    index: "04",
    label: "OPS AUTOMATION SCRIPTS",
    title: "自媒体运营自动化脚本集",
    lead: "面向自媒体运营中的重复网页操作，设计一组以规则拆解、脚本执行、状态记录和人工复核为核心的自动化脚本。它不是替代运营判断的全自动发布器，而是把素材整理、草稿生成、平台适配和发布前检查做成可控的本地执行链路。",
    problem: [
      "自媒体运营需要频繁处理选题整理、标题改写、标签生成、素材上传和多平台格式适配，手工重复操作多且容易遗漏。",
      "不同平台的字段、封面、字数、标签和发布限制不一致，直接复制粘贴会造成格式错误或发布前返工。",
      "通用 AI 只能生成文本，无法记录网页执行状态、失败节点和人工确认结果，难以支撑长期运营复盘。"
    ],
    role: [
      "独立设计脚本集工程结构：场景配置层、浏览器执行层、内容生成层、状态日志层和人工确认层，区分自动执行动作和必须人工确认动作。",
      "将运营任务拆成素材输入、平台规则读取、草稿生成、网页表单填充、人工复核、结果归档六个阶段，避免脚本直接越过关键判断。",
      "负责工具链选型与集成：浏览器自动化承担网页动作执行，Python 承担任务编排和日志记录，LLM 承担标题/摘要/标签候选生成，本地文件承担结果归档。",
      "当前为个人本地脚本集，已验证重复操作链路；若产品化，需要增加账号权限、任务队列、平台适配器版本管理和异常监控。"
    ],
    flow: [
      { label: "场景识别", desc: "根据当前运营任务选择小红书、知乎、B 站等平台规则，加载字段限制、标签规则和素材要求。", phase: "输入定义" },
      { label: "素材整理", desc: "读取原始文案、图片或视频素材，生成本次任务的结构化输入，避免脚本直接读取散乱文件。", phase: "输入定义" },
      { label: "草稿生成", desc: "调用 LLM 生成标题、摘要、标签和平台版本候选，保留人工可编辑草稿，而不是直接发布。", phase: "内容处理" },
      { label: "网页填充", desc: "通过浏览器自动化完成登录后页面定位、字段填充、素材上传和状态截图，降低重复点击成本。", phase: "内容处理" },
      { label: "人工复核", desc: "发布前停在确认节点，由人检查事实、封面、标题和平台合规风险；不通过则回到草稿阶段重写。", phase: "人机协同" },
      { label: "结果归档", desc: "记录执行时间、平台、草稿版本、截图和失败原因，为下次运营复盘提供依据。", phase: "输出交付" },
      { label: "异常降级", desc: "遇到页面结构变化、验证码、上传失败时停止高风险动作，写入日志并提示人工接管。", phase: "输出交付" }
    ],
    challenges: [
      {
        title: "网页结构变化",
        problem: "平台页面经常调整 DOM 结构、字段位置或上传组件，脚本如果盲目继续执行会填错位置或中断。",
        solution: "将定位规则和执行动作分层管理；关键元素找不到时进入降级状态，保存截图和错误日志，等待人工确认后再更新规则。"
      },
      {
        title: "发布风险控制",
        problem: "自媒体内容涉及事实、品牌和平台规则风险，脚本不能绕过人工判断直接提交。",
        solution: "把发布按钮前置为人工复核节点：脚本只完成草稿填充和证据截图，最终确认由人执行，并把通过/退回状态写入日志。"
      }
    ],
    deliveryChecks: [
      {
        label: "真实业务问题",
        status: "已覆盖",
        detail: "自媒体运营存在重复网页动作和状态记录，手工处理容易漏。"
      },
      {
        label: "工程结构",
        status: "脚本原型",
        detail: "以浏览器自动化脚本为主，强调规则、执行状态和人工确认；不是完整 Agent 平台。"
      },
      {
        label: "任务规划",
        status: "分段执行",
        detail: "拆成定位页面、读取信息、执行动作、记录状态和人工复核。"
      },
      {
        label: "人机协同",
        status: "人工确认",
        detail: "敏感动作和最终提交保留人工确认。"
      },
      {
        label: "可观测 / 复盘",
        status: "日志留存",
        detail: "输出执行日志、成功/失败状态和可回看记录。"
      }
    ],
    results: [
      { value: "3 平台", label: "适配范围", detail: "围绕小红书/知乎/B 站等平台做字段和格式适配。当前为本地脚本观察口径，平台规则变化时需要人工更新。" },
      { value: "约 60%-80%", label: "重复操作节省", detail: "草稿生成、字段填充和素材上传等重复动作可节省约 60%-80% 手工时间。基于本地演示流程估算，需用真实运营批次校准。" },
      { value: "可追踪", label: "日志与截图", detail: "每次执行保留平台、任务、截图、失败原因和人工确认状态；当前为本地文件记录，生产化后需接入任务数据库。"}
    ],
    tools: [
      { name: "Python + Playwright", note: "在系统中承担浏览器执行层角色，负责页面定位、表单填充、素材上传和截图留证。" },
      { name: "LLM API", note: "在系统中承担内容候选生成层角色，负责标题、摘要、标签和平台草稿的候选输出。" },
      { name: "本地规则配置", note: "在系统中承担平台上下文层角色，记录字段限制、标签规则、素材尺寸和发布前检查项。" },
      { name: "文件存储 + 日志", note: "在系统中承担可观测性层角色，保存执行状态、异常截图、草稿版本和人工确认结果。" }
    ],
    media: [
      {
        title: "自媒体运营助手演示",
        description: "批量生成草稿、配图、网页填充和发布前确认的流程录屏。体现脚本执行与人工复核的协同边界。",
        src: mediaBase("automation", "self-media-ops-assistant.m4v"),
        kind: "video"
      }
    ],
    next: { slug: "knowledge-base", title: "Obsidian 知识库:日常沉淀 + 对话索引 + AI 学习" }
  },

  "knowledge-base": {
    slug: "knowledge-base",
    index: "05",
    label: "KNOWLEDGE WORKFLOW",
    title: "Obsidian 知识库:日常沉淀 + 对话索引 + AI 学习",
    lead: "把 AI 对话、项目复盘、工作日志和学习笔记沉淀为可检索、可复盘的个人知识资产系统。当前已实现 Obsidian + Hermes + 本地脚本的日常沉淀链路，向量化检索和团队级权限属于后续扩展方向。",
    problem: [
      "AI 协作过程中大量决策、错误、提示词和项目经验散落在聊天记录、文档和临时文件里，事后难以复盘。",
      "只靠手动写笔记容易漏掉上下文，尤其是跨项目经验、待办和模型使用经验，很难形成可复用规则。",
      "直接把原始对话丢给通用 AI 总结缺少长期目录、主题标签和检索结构，后续调用时难以定位可靠知识。"
    ],
    role: [
      "独立设计知识系统架构：原始对话入口、每日沉淀脚本、主题整理目录、项目经验库、待办/复盘层和检索调用层。",
      "将上下文分为四类：单次对话摘要、长期项目经验、工具/Prompt 规则、个人画像与偏好，并定义不同内容进入知识库的写入路径。",
      "负责工具链选型与集成：Hermes 承担会话来源，Python 脚本承担分类整理，Obsidian/Markdown 承担长期知识存储，Dify/向量检索作为后续 RAG 扩展层。",
      "当前已实现个人本地知识沉淀和关系图谱；若产品化，需要增加权限、多用户空间、检索评估和知识更新审计。"
    ],
    flow: [
      { label: "原始对话采集", desc: "从 Hermes 会话、项目记录和工作日志中提取摘要，不默认长期保存完整原始对话，降低噪声和隐私风险。", phase: "上下文输入" },
      { label: "主题分类", desc: "按闲聊、工作推进、项目经验、AI 学习、待办等类型分类，写入对应 Obsidian 目录。", phase: "上下文输入" },
      { label: "规则沉淀", desc: "将重复出现的方法、错误处理、Prompt 经验和工具配置整理成可复用规则，而不是停留在流水账。", phase: "知识整理" },
      { label: "双向链接", desc: "用标签和双向链接连接项目、工具、人物画像和复盘笔记，形成可导航的知识网络。", phase: "知识整理" },
      { label: "检索调用", desc: "需要回答项目历史或复用经验时，优先从 Obsidian 目录和标签检索；后续可接入向量检索提升召回。", phase: "知识调用" },
      { label: "人工校正", desc: "对总结错误、过期规则和重要偏好做人工修订，避免错误知识长期污染后续判断。", phase: "知识调用" },
      { label: "周期复盘", desc: "定期回看高频主题、未完成待办和项目经验，将临时记录升级为稳定方法论。", phase: "更新评估" }
    ],
    challenges: [
      {
        title: "上下文噪声控制",
        problem: "原始对话里包含大量临时信息，如果全部沉淀，会让知识库变成难以检索的聊天归档。",
        solution: "将原始对话、主题摘要和稳定规则分层写入：只把可复用结论、项目经验和待办进入长期目录，临时内容保留摘要或直接丢弃。"
      },
      {
        title: "知识过期与纠错",
        problem: "工具配置、模型策略和项目状态会变化，旧笔记如果没有更新机制，会在后续检索时误导判断。",
        solution: "在笔记中保留来源、日期和人工修订入口；高风险规则必须人工确认后再升级为长期知识。"
      }
    ],
    deliveryChecks: [
      {
        label: "真实业务问题",
        status: "已覆盖",
        detail: "对话、复盘、项目经验和待办分散，难以形成长期可检索资产。"
      },
      {
        label: "上下文工程",
        status: "结构化组织",
        detail: "按主题、项目、任务状态和 Prompt 资产组织，不只是保存聊天记录。"
      },
      {
        label: "工程结构",
        status: "本地流程",
        detail: "本地 Markdown / Obsidian / Hermes 流程；不是多人企业知识库。"
      },
      {
        label: "人机协同",
        status: "人工确认",
        detail: "知识归档、命名和重要结论由人工确认。"
      },
      {
        label: "可观测 / 复盘",
        status: "来源可追踪",
        detail: "用链接关系、目录和复盘记录追踪知识来源。"
      }
    ],
    results: [
      { value: "5 类", label: "自动分类", detail: "会话内容按闲聊、工作、项目、学习、待办等类型进入不同目录。基于当前本地沉淀脚本口径，分类准确率需持续人工校正。" },
      { value: "23:00", label: "每日沉淀", detail: "Hermes 定时任务在每日固定时间生成 Obsidian 复盘。当前为个人本地流程，团队级定时和权限未实现。" },
      { value: "可视化", label: "关系图谱", detail: "Obsidian 图谱已展示目录、项目经验、AI 学习和对话索引之间的关联；检索质量目前以人工使用反馈为主。"}
    ],
    tools: [
      { name: "Hermes", note: "在系统中承担会话入口角色，提供每日沉淀所需的对话摘要和工作推进上下文。" },
      { name: "Obsidian", note: "在系统中承担长期知识库角色，负责 Markdown 存储、双向链接、标签体系和关系图谱。" },
      { name: "Python 脚本", note: "在系统中承担整理执行层角色，负责会话分类、摘要归档、标签生成和失败日志记录。" },
      { name: "Dify / 向量检索", note: "在系统中作为后续 RAG 扩展层规划，用于提高跨主题召回和问答复用能力；当前不作为已完成生产能力描述。" }
    ],
    media: [
      {
        title: "Obsidian 知识库关系图谱",
        description: "中文目录、每日沉淀、AI 学习、项目经验和对话索引已形成可视化链接。体现长期知识资产的结构化沉淀。",
        src: mediaBase("proof", "obsidian-knowledge-graph.png"),
        kind: "image"
      }
    ],
    next: { slug: "boss-job-collector", title: "BOSS 岗位收藏脚本" }
  },

  "ai-content-ops": {
    slug: "ai-content-ops",
    index: "01",
    label: "AI CONTENT OPS WORKBENCH",
    title: "AI 自媒体运营工作台",
    lead: "面向自媒体创作者的多平台内容生产场景，设计并实现一套 AI 内容运营工作台。用户输入一个选题或初步想法后，系统会结合私有资料库、Obsidian 笔记、历史成文和联网搜索结果，整理成 research bundle，再生成公众号、小红书、抖音图文、X/Twitter 等平台内容草稿，最后形成发布前审核包，方便人工确认后再发布。",
    problem: [
      "多平台发文需要反复改写、排版和调整表达。",
      "私有资料、历史文章、Obsidian 笔记分散，难以复用。",
      "联网资料和私有资料混在一起时，发布前很难检查来源。",
      "直接自动发布风险高，需要人工审核包。"
    ],
    role: [
      "拆解自媒体运营真实工作流。",
      "设计创作台、资料库、Agent 设置、历史记录、发布中心。",
      "实现私有资料库检索、Obsidian 双向同步、历史成文沉淀、联网搜索证据、发布前审核包。",
      "完成本地演示、测试验证和交付文档。"
    ],
    flow: [
      { label: "选题输入", desc: "输入一个选题、初步想法或待扩写素材，作为本次内容包的起点。", phase: "输入定义" },
      { label: "平台目标", desc: "选择公众号、小红书、抖音图文、X/Twitter 等目标平台，明确输出形态和表达侧重点。", phase: "输入定义" },
      { label: "私有资料命中", desc: "从客户资料、历史素材和本地资料库中检索可复用信息，避免每次从零开始查找。", phase: "上下文工程" },
      { label: "Obsidian 历史", desc: "读取 Obsidian 中的历史成文和笔记沉淀，把长期内容资产纳入上下文。", phase: "上下文工程" },
      { label: "联网搜索证据", desc: "补充外部资料和实时背景，并与私有资料引用分开展示。", phase: "上下文工程" },
      { label: "Research Bundle", desc: "把用户输入、私有资料命中、历史成文和联网证据整理成可审核的生成上下文。", phase: "上下文工程" },
      { label: "长文生成", desc: "先形成适合公众号或长文场景的主体内容，再作为多平台改写的基础稿。", phase: "生成执行" },
      { label: "多平台草稿", desc: "按不同平台的语气、篇幅和排版要求生成可审核草稿。", phase: "生成执行" },
      { label: "发布包整理", desc: "把不同平台版本、引用来源和待检查项整理成发布前审核包。", phase: "生成执行" },
      { label: "审核包", desc: "集中呈现内容、来源、平台版本和风险提示，方便发布前逐项检查。", phase: "人机协同" },
      { label: "人工确认", desc: "发布动作停在人工确认环节，不让系统绕过审核直接发布。", phase: "人机协同" },
      { label: "同步 Obsidian", desc: "将长文、关键资料和最终版本同步到 Obsidian，成为后续创作素材。", phase: "资产沉淀" },
      { label: "历史入库", desc: "保存生成结果、审核状态和复用线索，方便回看与二次使用。", phase: "资产沉淀" },
      { label: "后续复用", desc: "后续选题可以继续调用私有资料、历史成文和审核过的内容资产。", phase: "资产沉淀" }
    ],
    coreFeatures: [
      {
        title: "创作台",
        description: "输入选题或初步想法，选择目标平台，启动内容生成流程。"
      },
      {
        title: "私有资料库",
        description: "管理客户资料、历史素材和长期可复用的信息来源。"
      },
      {
        title: "Obsidian 同步",
        description: "长文和历史成文自动沉淀到 Obsidian，并可反向进入资料库。"
      },
      {
        title: "Agent 设置",
        description: "配置生成偏好、资料调用方式和平台输出要求。"
      },
      {
        title: "历史记录",
        description: "保留生成结果、审核状态和内容复用线索。"
      },
      {
        title: "发布中心",
        description: "整理多平台草稿和发布前审核包，保留人工确认环节。"
      }
    ],
    challenges: [
      {
        title: "分散资料复用",
        problem: "创作者的资料分布在客户文档、历史文章、Obsidian 笔记和临时素材里，生成前很难快速拼出完整上下文。",
        solution: "把私有资料库、历史成文和 Obsidian 同步结果统一进入 Research Bundle，让每次生成都有明确来源。"
      },
      {
        title: "来源分层检查",
        problem: "联网资料和私有资料混在一起时，人工发布前难以判断哪些内容来自内部沉淀，哪些来自外部搜索。",
        solution: "在审核包里分开展示私有资料引用、Obsidian 历史和联网搜索证据，保留人工确认入口。"
      },
      {
        title: "发布风险控制",
        problem: "多平台内容生成后如果直接自动发布，容易跳过口径、来源和平台表达差异的最终判断。",
        solution: "把发布中心设计为审核包整理和人工确认环节，系统生成草稿与检查项，人决定是否发布。"
      }
    ],
    deliveryChecks: [
      {
        label: "真实业务问题",
        status: "已落地",
        detail: "覆盖多平台内容运营的重复改写、查资料、排版和审核。"
      },
      {
        label: "工程结构",
        status: "已组织",
        detail: "Vue 前端 + FastAPI 后端 + 文件化 artifact + 本地资料管理。"
      },
      {
        label: "上下文工程",
        status: "分层组织",
        detail: "私有资料库、Obsidian、历史成文、联网搜索证据分层组织。"
      },
      {
        label: "联网证据",
        status: "分开展示",
        detail: "搜索证据和私有资料引用分开展示，方便发布前检查。"
      },
      {
        label: "人机协同",
        status: "保留确认",
        detail: "发布中心生成审核包，不直接自动发布。"
      },
      {
        label: "内容资产沉淀",
        status: "可复用",
        detail: "生成后的长文进入 Obsidian 和历史库，后续创作可复用。"
      }
    ],
    results: [
      { value: "多平台", label: "草稿生成", detail: "一个选题生成多个平台可审核草稿。" },
      { value: "可复用", label: "资料资产", detail: "私有资料、历史文章和 Obsidian 笔记进入长期内容资产。" },
      { value: "审核包", label: "发布前检查", detail: "发布前集中检查内容、引用和平台版本。" },
      { value: "可沉淀", label: "长期创作循环", detail: "生成后的长文和历史记录反哺后续创作。" }
    ],
    tools: [
      { name: "Vue", note: "创作台、资料库、Agent 设置、历史记录、发布中心界面。" },
      { name: "Python / FastAPI", note: "组织内容生成、资料检索、Obsidian 同步、联网搜索和 artifact 管理。" },
      { name: "Obsidian", note: "承接长文沉淀、历史成文和知识复用。" },
      { name: "Research Bundle", note: "整合用户输入、私有资料命中、历史成文和联网证据。" },
      { name: "文件化 Artifact", note: "保存草稿、审核包、历史结果和交付记录。" },
      { name: "联网搜索证据", note: "补充外部资料，并与私有资料引用分开展示。" }
    ],
    media: [
      {
        title: "AI 自媒体运营工作台完整流程演示",
        description: "完整展示选题、资料命中、内容生成、发布前审核包和历史沉淀的本地演示流程。",
        src: mediaBase("guga", "ai-content-ops-workbench-demo.web.mp4"),
        poster: mediaBase("guga", "ai-content-ops-workbench-demo.poster.jpg"),
        kind: "video"
      },
      {
        title: "创作台",
        description: "展示选题输入、生成流程和多平台草稿预览，作为运营人员启动内容包的主入口。",
        src: mediaBase("guga", "guga-preview-demo.png"),
        kind: "image"
      },
      {
        title: "私有资料库",
        description: "管理客户资料、历史素材和长期可复用信息，给 Research Bundle 提供私有上下文。",
        src: mediaBase("guga", "guga-technical-demo.png"),
        kind: "image"
      },
      {
        title: "Obsidian 同步",
        description: "展示长文和历史成文进入 Obsidian / 本地知识沉淀后的复用链路。",
        src: mediaBase("guga", "guga-task18-real-workflow-technical.png"),
        kind: "image"
      },
      {
        title: "历史记录",
        description: "保留生成结果、审核状态和内容复用线索，方便回看每次内容包的来源和处理结果。",
        src: mediaBase("guga", "guga-task18-real-workflow-metadata.png"),
        kind: "image"
      },
      {
        title: "发布中心 / 审核包",
        description: "集中整理公众号、小红书、抖音图文、X/Twitter 草稿和发布前检查项，保留人工确认。",
        src: mediaBase("guga", "guga-prepublish-gate.png"),
        kind: "image"
      }
    ],
    next: { slug: "ecommerce-aigc-workflow", title: "服装电商主图 / 宣传视频生成工作流" }
  },

  "boss-job-collector": {
    slug: "boss-job-collector",
    index: "06",
    label: "BOSS JOB COLLECTOR",
    title: "BOSS 岗位收藏脚本",
    lead: "面向个人求职中的岗位信息收集场景，设计一套自动化 Agent 脚本，把岗位搜索、条件过滤、关键信息提取、本地存储和人工二次筛选串成可复盘流程。当前为个人本地脚本，不包含批量投递、账号托管或绕过平台风控的生产能力。",
    problem: [
      "求职筛选岗位时，需要反复打开岗位详情、对比薪资、地点、技能要求和公司信息，人工记录容易遗漏且效率低。",
      "只收藏网页链接无法沉淀筛选理由、匹配条件和沟通状态，后续复盘时难以判断为什么保留或放弃某个岗位。",
      "直接让脚本自动沟通或投递风险较高，容易触发平台风控，也可能把不合适岗位误操作为已处理。"
    ],
    role: [
      "独立设计脚本工程结构：搜索输入层、岗位解析层、条件过滤层、本地存储层、人工筛选层和异常处理层。",
      "将任务拆成岗位搜索、列表抓取、条件过滤、详情提取、状态记录和人工确认六段，并明确自动化只处理信息收集，不替代求职决策。",
      "负责工具链选型与集成：浏览器自动化承担页面访问和字段读取，Python 承担规则判断和数据清洗，本地表格/JSON 承担岗位记录，日志截图承担异常复盘。",
      "当前为个人使用脚本；若产品化，需要增加账号合规策略、平台规则适配、数据加密、权限管理和人工确认工作台。"
    ],
    flow: [
      { label: "搜索条件", desc: "输入城市、岗位关键词、薪资范围、经验要求和排除条件，形成可复用的岗位搜索配置。", phase: "输入定义" },
      { label: "列表抓取", desc: "通过浏览器自动化读取岗位列表，记录标题、公司、地点、薪资和岗位链接等基础字段。", phase: "信息收集" },
      { label: "条件过滤", desc: "按关键词、薪资、地点、经验、行业等规则筛掉明显不匹配岗位，保留候选列表供人工查看。", phase: "信息收集" },
      { label: "详情提取", desc: "进入候选岗位详情页，提取技能要求、岗位描述、公司信息和风险备注，并写入本地记录。", phase: "信息收集" },
      { label: "本地存储", desc: "将岗位信息保存为表格或 JSON，记录抓取时间、筛选规则、来源链接和当前处理状态。", phase: "输出交付" },
      { label: "人工二筛", desc: "由人确认是否收藏、沟通或删除；脚本不自动完成高风险沟通和投递动作。", phase: "人机协同" },
      { label: "异常降级", desc: "遇到验证码、登录过期、页面结构变化或访问限制时停止执行，保存截图并提示人工接管。", phase: "异常处理" }
    ],
    challenges: [
      {
        title: "平台风控与合规边界",
        problem: "招聘平台对高频访问和自动沟通有风控要求，脚本如果追求全自动会带来账号风险和误操作风险。",
        solution: "把脚本边界限定为岗位信息收集和候选筛选；沟通、投递、收藏等高风险操作保留人工确认，并在异常时立即停止。"
      },
      {
        title: "页面结构变化",
        problem: "岗位详情页字段和按钮位置可能变化，脚本继续执行会造成字段错读或遗漏。",
        solution: "为关键字段增加缺失检测和截图留证；结构变化时降级为人工处理，并把失败样例写入日志，用于更新解析规则。"
      }
    ],
    deliveryChecks: [
      {
        label: "真实业务问题",
        status: "已覆盖",
        detail: "岗位筛选需要重复打开页面、提取信息、对比条件和记录状态。"
      },
      {
        label: "工程结构",
        status: "本地脚本",
        detail: "本地浏览器自动化 + 数据记录脚本；不做账号托管和自动投递。"
      },
      {
        label: "任务规划",
        status: "分段执行",
        detail: "搜索、过滤、提取、记录、人工筛选和复盘分段执行。"
      },
      {
        label: "人机协同",
        status: "人工确认",
        detail: "沟通、投递、最终判断必须由人完成。"
      },
      {
        label: "可观测 / 复盘",
        status: "记录留存",
        detail: "记录岗位字段、筛选理由、执行结果和异常状态。"
      }
    ],
    results: [
      { value: "50+ / 批", label: "候选处理", detail: "单次配置可辅助处理数十个岗位候选。数值来自本地演示流程估算，真实结果受搜索条件和平台限制影响。" },
      { value: "约 60%", label: "记录时间节省", detail: "列表字段读取、详情摘录和本地表格写入可减少约 60% 重复记录时间。当前为个人使用观察值，需持续校准。" },
      { value: "人工确认", label: "高风险边界", detail: "沟通、投递、收藏等关键动作不默认自动执行，必须由人确认；当前脚本定位是信息收集，不是招聘平台托管工具。"}
    ],
    tools: [
      { name: "Python + Playwright", note: "在系统中承担浏览器自动化层角色，负责岗位列表读取、详情页访问和异常截图。" },
      { name: "本地规则配置", note: "在系统中承担筛选规则层角色，保存岗位关键词、薪资、地点、经验和排除条件。" },
      { name: "表格 / JSON 文件", note: "在系统中承担岗位数据存储层角色，记录岗位字段、来源链接、抓取时间和人工处理状态。" },
      { name: "本地日志", note: "在系统中承担可观测性层角色，记录失败原因、页面变化、验证码拦截和人工接管节点。" }
    ],
    media: [
      {
        title: "BOSS 岗位助手演示",
        description: "岗位列表读取、条件过滤、详情提取和本地记录流程录屏。体现脚本负责信息收集，人负责最终求职判断。",
        src: mediaBase("automation", "boss-job-assistant-web.mp4"),
        kind: "video"
      }
    ],
    next: null
  }
};

export function getProjectCase(slug: string): ProjectCase | undefined {
  return PROJECT_CASES[slug];
}

export function hasProjectCase(slug: string): boolean {
  return slug in PROJECT_CASES;
}

const SECTION_ICON = {
  problem: Target,
  role: UserCircle2,
  flow: Workflow,
  features: Layers,
  challenge: Lightbulb,
  media: ImageIcon,
  results: Sparkles,
  tools: Wrench
} as const;

export default function ProjectCasePage({
  slug,
  onClose
}: {
  slug: string;
  onClose?: () => void;
}): JSX.Element {
  const data = getProjectCase(slug);
  const resumeHref = getAppRouteHref("resume");

  // overlay 模式(在简历页内打开):拦截返回链接,走客户端关闭而非整页跳转
  const handleBack = (e: ReactMouseEvent): void => {
    if (onClose) {
      e.preventDefault();
      onClose();
    }
  };

  if (!data) {
    return (
      <main className="pcase-page pcase-page--missing">
        <div className="pcase-missing">
          <p>未找到该项目档案。</p>
          <a href={resumeHref} onClick={handleBack}>
            <ArrowLeft size={16} aria-hidden="true" />
            返回简历
          </a>
        </div>
      </main>
    );
  }

  const ProblemIcon = SECTION_ICON.problem;
  const RoleIcon = SECTION_ICON.role;
  const FlowIcon = SECTION_ICON.flow;
  const FeatureIcon = SECTION_ICON.features;
  const ChallengeIcon = SECTION_ICON.challenge;
  const DeliveryIcon = CheckCircle2;
  const MediaIcon = SECTION_ICON.media;
  const ResultIcon = SECTION_ICON.results;
  const ToolIcon = SECTION_ICON.tools;

  const flowGroups = data.flow.reduce((acc, step) => {
    if (!acc.has(step.phase)) acc.set(step.phase, []);
    acc.get(step.phase)!.push(step);
    return acc;
  }, new Map<string, CaseFlowStep[]>());

  return (
    <main className={`pcase-page pcase-page--${data.slug}`} aria-label={`${data.title} 项目详情页`}>
      <img className="pcase-bg" src={caseBgAsset} alt="" aria-hidden="true" />
      <span className="pcase-bg-shade" aria-hidden="true" />
      <div className="pcase-particles-layer" aria-hidden="true">
        <Particles
          particleColors={["#BFEFFF", "#6EE7F9", "#7DD3FC"]}
          particleCount={240}
          particleSpread={6}
          speed={0.055}
          particleBaseSize={82}
          sizeRandomness={0.95}
          cameraDistance={22}
          alphaParticles={true}
          moveParticlesOnHover={false}
          disableRotation={false}
          pixelRatio={1}
        />
      </div>

      <a
        className="pcase-floating-back"
        href={`${resumeHref}#resume-project-archive`}
        onClick={handleBack}
        aria-label="返回项目档案"
      >
        <span aria-hidden="true">←</span>
        <span className="pcase-floating-back-text">返回项目档案</span>
      </a>

      <nav className="pcase-nav" aria-label="项目详情导航">
        <a href={`${resumeHref}#resume-project-archive`} onClick={handleBack}>
          <ArrowLeft size={16} aria-hidden="true" />
          返回项目档案库
        </a>
        <span>PROJECT CASE · {data.label}</span>
      </nav>

      <section className="pcase-hero" aria-labelledby="pcase-title">
        <div className="pcase-kicker">
          <span className="pcase-kicker-index">{data.index}</span>
          <span className="pcase-kicker-rule" />
          <span className="pcase-kicker-label">{data.label}</span>
        </div>
        <h1 id="pcase-title">{data.title}</h1>
        <p className="pcase-lead">{data.lead}</p>
        <div className="pcase-hero-actions">
          <a href="#pcase-flow">查看工作流</a>
          <a href="#pcase-media">查看证据</a>
        </div>
      </section>

      <section className="pcase-section pcase-problem" aria-labelledby="pcase-problem-title">
        <div className="pcase-section-head">
          <ProblemIcon size={18} aria-hidden="true" />
          <h2 id="pcase-problem-title">项目背景 / 业务问题</h2>
        </div>
        <ul className="pcase-bullet-list">
          {data.problem.map((p) => {
            const Icon = iconFor(p, Target);
            return (
              <li key={p}>
                <Icon size={16} aria-hidden="true" />
                <span>{p}</span>
              </li>
            );
          })}
        </ul>
      </section>

      <section className="pcase-section pcase-role" aria-labelledby="pcase-role-title">
        <div className="pcase-section-head">
          <RoleIcon size={18} aria-hidden="true" />
          <h2 id="pcase-role-title">我的角色</h2>
        </div>
        <ul className="pcase-bullet-list">
          {data.role.map((r) => {
            const Icon = iconFor(r, UserCircle2);
            return (
              <li key={r}>
                <Icon size={16} aria-hidden="true" />
                <span>{r}</span>
              </li>
            );
          })}
        </ul>
      </section>

      <section className="pcase-section pcase-flow" id="pcase-flow" aria-labelledby="pcase-flow-title">
        <div className="pcase-section-head">
          <FlowIcon size={18} aria-hidden="true" />
          <h2 id="pcase-flow-title">工作流拆解</h2>
        </div>
        <div className="pcase-flow-groups">
          {Array.from(flowGroups.entries()).map(([phase, steps]) => (
            <div className="pcase-flow-phase" key={phase}>
              <div className="pcase-flow-phase-title">{phase}</div>
              <ol className="pcase-flow-ladder">
                {steps.map((step) => {
                  const Icon = iconFor(step.label, Workflow);
                  return (
                    <li className="pcase-flow-step" key={`${phase}-${step.label}`}>
                      <Icon size={18} className="pcase-flow-step-icon" aria-hidden="true" />
                      <span className="pcase-flow-step-num">
                        {String(
                          data.flow.findIndex((s) => s.phase === phase && s.label === step.label) + 1
                        ).padStart(2, "0")}
                      </span>
                      <span className="pcase-flow-step-label">{step.label}</span>
                      <span className="pcase-flow-step-desc">{step.desc}</span>
                    </li>
                  );
                })}
              </ol>
            </div>
          ))}
        </div>
      </section>

      {data.coreFeatures && data.coreFeatures.length > 0 && (
        <section className="pcase-section pcase-core-features" aria-labelledby="pcase-core-features-title">
          <div className="pcase-section-head">
            <FeatureIcon size={18} aria-hidden="true" />
            <h2 id="pcase-core-features-title">核心功能</h2>
          </div>
          <div className="pcase-core-feature-grid">
            {data.coreFeatures.map((feature) => {
              const Icon = iconFor(feature.title, Sparkles);
              return (
                <article className="pcase-core-feature-card" key={feature.title}>
                  <div className="pcase-core-feature-head">
                    <Icon size={18} aria-hidden="true" />
                    <strong>{feature.title}</strong>
                  </div>
                  <p>{feature.description}</p>
                </article>
              );
            })}
          </div>
        </section>
      )}

      {data.challenges && data.challenges.length > 0 && (
        <section className="pcase-section pcase-challenges" aria-labelledby="pcase-challenges-title">
          <div className="pcase-section-head">
            <ChallengeIcon size={18} aria-hidden="true" />
            <h2 id="pcase-challenges-title">挑战与解决</h2>
          </div>
          <div className="pcase-challenges-grid">
            {data.challenges.map((c) => {
              const Icon = iconFor(c.title, AlertTriangle);
              return (
                <div className="pcase-challenge-card" key={c.title}>
                  <div className="pcase-challenge-title">
                    <Icon size={18} aria-hidden="true" />
                    {c.title}
                  </div>
                  <div className="pcase-challenge-problem">{c.problem}</div>
                  <div className="pcase-challenge-solution">
                    <strong>解决：</strong>
                    {c.solution}
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {data.deliveryChecks && data.deliveryChecks.length > 0 && (
        <section className="pcase-section pcase-delivery-checks" aria-labelledby="pcase-delivery-title">
          <div className="pcase-section-head">
            <DeliveryIcon size={18} aria-hidden="true" />
            <h2 id="pcase-delivery-title">落地检核 / Delivery Check</h2>
          </div>
          <div className="pcase-delivery-grid">
            {data.deliveryChecks.map((item) => {
              const Icon = iconFor(`${item.label} ${item.status}`, CheckCircle2);
              return (
                <article className="pcase-delivery-card" key={item.label}>
                  <div className="pcase-delivery-card-head">
                    <Icon size={18} aria-hidden="true" />
                    <span>{item.label}</span>
                  </div>
                  <strong>{item.status}</strong>
                  <p>{item.detail}</p>
                </article>
              );
            })}
          </div>
        </section>
      )}
      <section className="pcase-section pcase-media" id="pcase-media" aria-labelledby="pcase-media-title">
        <div className="pcase-section-head">
          <MediaIcon size={18} aria-hidden="true" />
          <h2 id="pcase-media-title">关键截图 / 视频证据</h2>
        </div>
        <div className="pcase-media-grid">
          {data.media.map((m) => (
            <figure className="pcase-media-card" key={m.title}>
              {m.kind === "video" ? (
                <video src={m.src} poster={m.poster} muted loop playsInline preload="metadata" controls />
              ) : (
                <img src={m.src} alt={m.title} loading="lazy" />
              )}
              <figcaption>
                <strong>{m.title}</strong>
                <span>{m.description}</span>
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      <section className="pcase-section pcase-results" aria-labelledby="pcase-results-title">
        <div className="pcase-section-head">
          <ResultIcon size={18} aria-hidden="true" />
          <h2 id="pcase-results-title">结果与价值</h2>
        </div>
        <div className="pcase-results-grid">
          {data.results.map((r) => {
            const Icon = iconFor(r.label, Sparkles);
            return (
              <div className="pcase-result-card" key={r.label}>
                <Icon size={20} className="pcase-result-icon" aria-hidden="true" />
                <span className="pcase-result-value">{r.value}</span>
                <span className="pcase-result-label">{r.label}</span>
                <span className="pcase-result-detail">{r.detail}</span>
              </div>
            );
          })}
        </div>
      </section>

      <section className="pcase-section pcase-tools" aria-labelledby="pcase-tools-title">
        <div className="pcase-section-head">
          <ToolIcon size={18} aria-hidden="true" />
          <h2 id="pcase-tools-title">工具栈</h2>
        </div>
        <div className="pcase-tools-grid">
          {data.tools.map((t) => {
            const Icon = iconFor(t.name, Wrench);
            return (
              <div className="pcase-tool-chip" key={t.name}>
                <div className="pcase-tool-head">
                  <Icon size={18} aria-hidden="true" />
                  <strong>{t.name}</strong>
                </div>
                <span>{t.note}</span>
              </div>
            );
          })}
        </div>
      </section>

      <footer className="pcase-footer">
        <a className="pcase-footer-back" href={`${resumeHref}#resume-project-archive`} onClick={handleBack}>
          <ArrowLeft size={16} aria-hidden="true" />
          返回项目档案库
        </a>
        {data.next ? (
          <a className="pcase-footer-next" href={getAppRouteHref(`projects/${data.next.slug}`)}>
            下一个项目：{data.next.title}
            <ArrowRight size={16} aria-hidden="true" />
          </a>
        ) : (
          <span className="pcase-footer-end">
            <CheckCircle2 size={16} aria-hidden="true" />
            更多项目整理中
          </span>
        )}
      </footer>
    </main>
  );
}
