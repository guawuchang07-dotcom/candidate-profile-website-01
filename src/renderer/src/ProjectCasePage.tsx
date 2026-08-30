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
  "data-platform/data-cleaning-dashboard.png": new URL("./assets/static/media/data-platform/data-cleaning-dashboard.png", import.meta.url).href,
  "data-platform/material-library-empty.png": new URL("./assets/static/media/data-platform/material-library-empty.png", import.meta.url).href,
  "data-platform/sales-assessment-empty.png": new URL("./assets/static/media/data-platform/sales-assessment-empty.png", import.meta.url).href,
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
  "finetune/llamafactory-webui.png": new URL("./assets/static/media/finetune/llamafactory-webui.png", import.meta.url).href,
  "finetune/qwen-lora-training-loss.png": new URL("./assets/static/media/finetune/qwen-lora-training-loss.png", import.meta.url).href,
  "live-clip/live-clip-upload.png": new URL("./assets/static/media/live-clip/live-clip-upload.png", import.meta.url).href,
  "proof/obsidian-knowledge-graph.png": new URL("./assets/static/media/proof/obsidian-knowledge-graph.png", import.meta.url).href,
  "wechat/wechat-export-flow.png": new URL("./assets/static/media/wechat/wechat-export-flow.png", import.meta.url).href
} as const;

const mediaBase = (subdir: string, file: string): string => {
  const key = `${subdir}/${file}` as keyof typeof caseMediaAssets;
  return caseMediaAssets[key];
};

const PROJECT_CASES: Record<string, ProjectCase> = {
  "ai-voice-customer-service": {
    slug: "ai-voice-customer-service",
    index: "05",
    label: "B1 / FRONT-END PRODUCT",
    title: "AI 实时语音智能客服",
    lead: "面向私域电商场景，探索把实时语音交互、混合 RAG、多模态回复和业务上下文组织成一个可交互的客服前台。重点是端到端延迟、检索质量和弱网语音体验，当前以产品原型与性能目标验证为主。",
    problem: [
      "客服既要理解用户意图、商品知识和历史上下文，又要处理图片、视频等多模态信息，单一向量检索难以稳定覆盖。",
      "长问题、口语化表达和错别字会降低召回质量；如果不做 Query 改写、Rerank 和结果裁剪，回答容易偏题。",
      "实时语音链路同时受模型首 token 延迟、网络抖动和丢包影响，普通文本问答的体验指标不能直接套用。"
    ],
    role: [
      "设计稠密向量 + 稀疏向量的混合检索链路，并明确 TopK、Rerank、TopN 各阶段的职责。",
      "把意图识别、Query 改写和上下文拼装拆成可观测步骤，为客服回答保留来源和业务边界。",
      "规划 Prefix Caching、KV Cache 与 System Prompt 合并，压缩重复上下文带来的首 token 延迟。",
      "结合火山 RTC、FEC 和自适应 Jitter Buffer 设计语音传输方案；50% 丢包稳定性与 TTFT 2 秒内均属于验证目标，不作为已达成指标。"
    ],
    flow: [
      { label: "语音接入", desc: "通过 RTC 接收用户语音，处理编码、网络抖动和可恢复的丢包。", phase: "实时交互" },
      { label: "意图识别", desc: "判断咨询、售后、推荐等业务意图，为后续检索和回复策略选择范围。", phase: "上下文理解" },
      { label: "Query 改写", desc: "将口语化、多轮省略和错别字整理为可检索查询，并保留会话上下文。", phase: "检索准备" },
      { label: "混合召回", desc: "并行使用稠密向量与稀疏向量召回候选知识，再按 TopK、Rerank、TopN 逐层收敛。", phase: "知识检索" },
      { label: "上下文合并", desc: "合并 System Prompt、业务规则和检索证据，利用缓存减少重复上下文开销。", phase: "回答生成" },
      { label: "多模态回复", desc: "按场景返回文字、图片或视频，并将可引用的来源与业务动作交给前台展示。", phase: "回答生成" },
      { label: "语音回传", desc: "将回答通过 RTC 回传，观察 TTFT、端到端延迟和弱网下的连续性。", phase: "实时交互" }
    ],
    coreFeatures: [
      { title: "混合 RAG", description: "稠密与稀疏检索互补，适配商品名、专有词和自然语言问题。" },
      { title: "检索分层", description: "用 TopK、Rerank、TopN 控制候选规模与最终上下文质量。" },
      { title: "缓存优化", description: "通过 Prefix Caching、KV Cache 和 Prompt 合并减少重复计算。" },
      { title: "多模态回复", description: "在语音会话中按业务需要混排文字、图片和视频内容。" },
      { title: "弱网策略", description: "把 FEC 与自适应 Jitter Buffer 纳入语音链路的体验验证。" }
    ],
    challenges: [
      {
        title: "召回质量与延迟的平衡",
        problem: "召回越多，回答上下文越完整，但排序和生成延迟也会增加。",
        solution: "将混合召回、Rerank 和 TopN 分段记录，按意图选择检索规模，并把缓存命中率纳入性能观察。"
      },
      {
        title: "实时语音的弱网体验",
        problem: "语音包丢失或抖动会放大等待感和断续感，文本链路的成功不能代表语音链路可用。",
        solution: "用 RTC、FEC 和自适应 Jitter Buffer 组成传输侧验证方案，并用 TTFT 2 秒内、50% 丢包稳定性作为待压测目标。"
      }
    ],
    deliveryChecks: [
      { label: "项目定位", status: "产品原型 / 性能验证", detail: "聚焦客服前台与链路设计，不宣称已完成生产级语音客服部署。" },
      { label: "检索策略", status: "混合 RAG", detail: "稠密 + 稀疏召回、Rerank 与 TopN 的职责边界已明确。" },
      { label: "实时指标", status: "验证目标", detail: "TTFT 2 秒内和 50% 丢包稳定性需要通过实际压测确认。" },
      { label: "人工边界", status: "保留接管", detail: "复杂售后、敏感信息和不确定回答仍应转人工处理。" }
    ],
    results: [
      { value: "混合", label: "检索策略", detail: "稠密、稀疏召回与重排组成可调优的检索链路。" },
      { value: "多模态", label: "客服回复", detail: "文字、图片、视频可按业务场景组合返回。" },
      { value: "2 秒内", label: "TTFT 目标", detail: "作为实时体验验证目标，不代表当前已达成的生产指标。" }
    ],
    tools: [
      { name: "混合 RAG", note: "稠密向量与稀疏向量并行召回，再经过 Rerank 和 TopN 裁剪。" },
      { name: "火山 RTC", note: "承担实时语音接入与回传，结合 FEC 和自适应 Jitter Buffer 评估弱网体验。" },
      { name: "Prefix / KV Cache", note: "减少重复 System Prompt 与历史上下文带来的生成开销。" },
      { name: "多模态前台", note: "承接文字、图片和视频混排回复，以及人工接管入口。" }
    ],
    media: [],
    next: { slug: "asset-center-sales-assessment", title: "AI 素材中心 & 销售考核" }
  },

  "data-platform": {
    slug: "data-platform",
    index: "01",
    label: "B2 / PLATFORM PROJECT",
    title: "AI 数据中台（含微信数据接入）",
    lead: "这是整套项目组合里的数据底座：微信 SQLite 原始库保持只读，经 ETL 暂存、DataFilter 脱敏、对话块清洗和人工审核后，分别供给 RAG、实时客服、素材中心、销售考核和模型微调。",
    problem: [
      "微信数据、业务资料和项目结果分散在不同文件夹与工具里，后续检索时很难确认来源、版本和处理状态。",
      "如果不先做字段整理、脱敏和知识分层，原始数据直接进入知识库会带来重复、噪声和隐私风险。",
      "销售考核、素材管理等业务模块需要共享同一批数据和规则，单独做功能会造成重复录入和上下文割裂。"
    ],
    role: [
      "从平台视角梳理原始库、暂存区、治理层、知识层和下游应用的边界。",
      "设计微信数据只读入口、批次记录、9 级脱敏、5 分钟对话块清洗和人工审核节点。",
      "把实时客服、素材中心、销售考核和微调数据定义为不同下游，不把它们混成一个产品。",
      "当前以本地原型和流程设计为主，生产级权限、向量服务和多租户部署属于后续工程化阶段。"
    ],
    flow: [
      { label: "数据接入", desc: "接收微信导出、业务表格、项目记录和人工补充资料，登记来源、批次和进入时间。", phase: "数据入口" },
      { label: "字段整理", desc: "统一时间、人物、项目、内容类型和状态字段，标记缺失项、重复项和需要人工确认的内容。", phase: "数据入口" },
      { label: "备份记录", desc: "保留原始文件与清洗结果的对应关系，记录批次状态，避免只剩一份不可回溯的加工数据。", phase: "数据入口" },
      { label: "知识分层", desc: "将资料区分为原始数据、可检索知识、稳定规则和项目复盘，避免把所有内容混成一个知识库。", phase: "知识层" },
      { label: "RAG / 知识库", desc: "为后续检索问答预留文档切分、来源引用、更新时间和人工纠错等结构。", phase: "知识层" },
      { label: "下游分流", desc: "将整理后的数据和知识按用途提供给实时客服、RAG、素材中心、销售考核和微调流程。", phase: "业务应用" },
      { label: "结果沉淀", desc: "保存业务处理结果、人工审核结论和复盘记录，让下一次任务可以复用而不是重新开始。", phase: "业务应用" }
    ],
    coreFeatures: [
      { title: "统一数据入口", description: "把微信导出、业务资料和项目记录放进同一套批次与来源逻辑。" },
      { title: "知识分层", description: "原始数据、RAG 知识、稳定规则和复盘结果分开管理。" },
      { title: "业务模块承接", description: "AI 销售考核和 AI 素材中心共享底座，不重复建设数据入口。" },
      { title: "状态可追踪", description: "记录导入、整理、审核、调用和复盘状态，保留人工边界。" }
    ],
    challenges: [
      {
        title: "平台边界容易被误解",
        problem: "数据中台既不是单纯的清洗脚本，也不是已经配置好模型的完整 RAG 产品。",
        solution: "用数据入口、知识层、业务模块和结果沉淀四层表达平台职责，并把大模型接入、向量检索和权限系统明确列为后续工程化工作。"
      },
      {
        title: "模块与底座的关系",
        problem: "AI 销售考核和 AI 素材中心如果单独展示，会让简历读者误以为是两个完全独立的系统。",
        solution: "在项目档案中将它们标记为数据中台内部业务模块，强调共享数据、知识和状态记录。"
      }
    ],
    deliveryChecks: [
      { label: "项目定位", status: "平台原型", detail: "负责承接数据接入、知识组织和业务模块，不等同于已上线的企业级数据平台。" },
      { label: "RAG 边界", status: "结构预留", detail: "已梳理知识分层、来源引用和复盘沉淀；大模型与向量检索的生产配置需要后续部署。" },
      { label: "业务复用", status: "可扩展", detail: "内容运营、素材管理、销售考核等应用可以共享同一套数据入口和上下文。" },
      { label: "人工协同", status: "保留确认", detail: "字段纠错、知识升级和关键业务结论仍由人工确认。" }
    ],
    results: [
      { value: "4 层", label: "平台结构", detail: "数据入口、知识层、业务模块、结果沉淀形成清晰的职责边界。" },
      { value: "1 个", label: "共享底座", detail: "多个业务项目可以从同一套来源、字段和知识结构开始。" },
      { value: "可追踪", label: "数据状态", detail: "批次、来源、处理状态和人工结论都预留记录位置。" }
    ],
    tools: [
      { name: "微信 SQLite / ETL", note: "原始库只读，导入数据先进入暂存区，保留来源、批次和处理状态。" },
      { name: "DataFilter / PostgreSQL", note: "DataFilter 负责脱敏，PostgreSQL 作为可读写工作台承接审核和下游准备。" },
      { name: "RAG / knowledge_chunks", note: "清洗后的对话和知识文章进入向量检索与知识层，生产模型接入仍需配置。" },
      { name: "客服 / 素材 / 考核 / 微调", note: "不同下游共享治理后的数据资产，但按用途保留各自的处理边界。" }
    ],
    media: [
      {
        title: "数据清洗与审核后台",
        description: "真实本地运行页：PostgreSQL 初始化库连接成功，页面展示 21 个会话、300 条原始消息及待处理状态；未执行清洗，不把初始化数据包装成已完成结果。",
        src: mediaBase("data-platform", "data-cleaning-dashboard.png"),
        kind: "image"
      }
    ],
    next: { slug: "ecommerce-aigc-workflow", title: "服装平台视觉生图自动化" }
  },

  "live-clip-agent": {
    slug: "live-clip-agent",
    index: "04",
    label: "B3 / CONTENT AUTOMATION",
    title: "AI 直播切片 Agent",
    lead: "把直播回放从浏览器端音频提取、长文本理解、高光识别到精准裁切和数据回写串成一条可追踪的内容自动化链路。任务状态、进度和片段来源都保留下来，方便后续复用与人工复核。",
    problem: [
      "长直播的有效信息分散在数小时内容中，人工找高光、记时间点和裁切片段耗时且容易漏掉上下文。",
      "ASR 文本过长时直接交给模型会超出上下文或降低判断质量，需要分块、摘要和重排。",
      "如果只导出视频文件而不保存直播 ID、时间戳和原始 ASR 片段，切片无法回到素材中心继续检索。"
    ],
    role: [
      "在浏览器端使用 FFmpeg.wasm 与 WORKERFS 零拷贝提取音频，减少大文件在主线程和内存中的重复搬运。",
      "设计 PostgreSQL 任务表与 SSE 进度推送，记录上传、转码、ASR、分析和裁切阶段。",
      "将长 ASR 文本按时间分块、摘要和重排，再交给 LLM 识别候选高光与起止时间。",
      "在浏览器端执行精准裁切，回写片段文件、直播 ID、时间戳和对应 ASR 片段到数据中台。"
    ],
    flow: [
      { label: "回放输入", desc: "选择直播回放并登记直播 ID、文件信息和任务参数。", phase: "任务准备" },
      { label: "零拷贝提音", desc: "通过 WORKERFS 挂载文件，在 Worker 中用 FFmpeg.wasm 提取音频，避免重复复制大文件。", phase: "媒体处理" },
      { label: "ASR 分块", desc: "将长 ASR 文本按时间窗口拆分，保留片段起止点与原始文本。", phase: "语音理解" },
      { label: "摘要重排", desc: "对分块内容做摘要、去重和上下文重排，形成适合模型分析的窗口。", phase: "语音理解" },
      { label: "高光识别", desc: "由 LLM 根据观点密度、情绪变化和业务规则给出候选高光及时间范围。", phase: "内容分析" },
      { label: "精准裁切", desc: "浏览器端按候选时间点裁切视频，并允许人工调整前后边界。", phase: "片段生成" },
      { label: "结果回写", desc: "保存片段地址、直播 ID、时间戳、ASR 原文和审核状态，供素材中心和内容运营继续使用。", phase: "资产沉淀" }
    ],
    coreFeatures: [
      { title: "浏览器端处理", description: "FFmpeg.wasm + WORKERFS 在 Worker 中完成音频提取与裁切。" },
      { title: "任务可观测", description: "PostgreSQL 任务表记录阶段状态，SSE 将进度推送到前台。" },
      { title: "长文本分块", description: "按时间切分、摘要和重排，控制模型上下文长度。" },
      { title: "高光可解释", description: "保留候选时间段、理由和对应 ASR 片段，便于人工复核。" },
      { title: "数据回写", description: "切片与来源元数据一起进入数据中台，支持后续搜索和复用。" }
    ],
    challenges: [
      {
        title: "大文件浏览器处理",
        problem: "直播回放体积大，主线程直接读取和转码容易卡顿或造成内存峰值。",
        solution: "使用 WORKERFS 零拷贝挂载文件，并把 FFmpeg.wasm 处理放进 Worker；前台只接收进度与结果。"
      },
      {
        title: "模型时间点不稳定",
        problem: "长文本摘要可能丢失原始时间边界，直接按模型输出裁切会出现前后偏移。",
        solution: "每个文本块保留时间戳，候选高光必须引用原始片段，再由浏览器裁切和人工微调确认。"
      }
    ],
    deliveryChecks: [
      { label: "项目定位", status: "内容自动化原型", detail: "重点验证从直播回放到可复用片段的链路，不是完整视频云平台。" },
      { label: "媒体处理", status: "浏览器 Worker", detail: "FFmpeg.wasm 与 WORKERFS 用于零拷贝提音和裁切，减少前台阻塞。" },
      { label: "进度状态", status: "可追踪", detail: "任务表和 SSE 覆盖阶段状态与前台进度反馈。" },
      { label: "人工边界", status: "保留复核", detail: "高光候选和裁切边界允许人工调整，结果才进入后续资产链路。" }
    ],
    results: [
      { value: "7 段", label: "任务链路", detail: "输入、提音、ASR、分析、裁切、回写和复核各自有清晰边界。" },
      { value: "SSE", label: "进度反馈", detail: "长任务状态可以持续反馈到浏览器端。" },
      { value: "可回写", label: "片段资产", detail: "片段与直播 ID、时间戳和 ASR 原文一起沉淀。" }
    ],
    tools: [
      { name: "FFmpeg.wasm / WORKERFS", note: "在浏览器 Worker 中零拷贝挂载回放文件，承担音频提取和精准裁切。" },
      { name: "PostgreSQL 任务表", note: "记录任务阶段、错误信息、时间范围和处理结果。" },
      { name: "SSE", note: "将转码、ASR、分析和裁切进度持续推送给前台。" },
      { name: "ASR + LLM", note: "长文本分块、摘要、重排并识别候选高光；最终时间点保留人工确认。" }
    ],
    media: [
      {
        title: "直播切片任务入口",
        description: "真实本地运行页：支持直播回放、面试录像、课程讲座三类输入，并在浏览器端选择文件。截图证明前端交互入口，未上传真实视频或宣称模型分析已经完成。",
        src: mediaBase("live-clip", "live-clip-upload.png"),
        kind: "image"
      }
    ],
    next: { slug: "ai-voice-customer-service", title: "AI 实时语音智能客服" }
  },

  "wechat-data-import": {
    slug: "wechat-data-import",
    index: "02",
    label: "WECHAT DATA INTAKE",
    title: "微信数据导入与备份",
    lead: "这是数据中台的数据接入项目：围绕微信导出文件建立批次登记、字段整理、去重归档、备份记录和待处理队列，为后续知识库与业务应用提供干净、可追踪的输入。当前先展示流程和边界，图片证据位暂时为空。",
    problem: [
      "微信导出内容可能包含多种文件格式和不同字段，直接使用会造成时间、人物、来源和状态信息缺失。",
      "原始文件、清洗结果和人工修订如果没有批次关系，后续无法判断数据来自哪里，也无法回滚。",
      "接入项目需要先处理数据质量和隐私边界，不能把导入脚本包装成自动分析或自动发送工具。"
    ],
    role: [
      "梳理微信数据从导出、登记、整理到进入数据中台的最小闭环。",
      "设计字段映射、文件命名、批次状态和异常记录，保证原始数据与加工结果可对应。",
      "明确导入项目只负责数据接入与整理，不越权执行自动沟通、自动发布或外部发送。",
      "为后续 RAG 检索、内容复盘和业务模块调用预留结构化字段。"
    ],
    flow: [
      { label: "导出文件", desc: "接收微信导出的文本、表格或附件目录，保持原始文件不被覆盖。", phase: "输入准备" },
      { label: "批次登记", desc: "为每次导入记录时间、来源、文件数量和处理人，形成可回看的批次编号。", phase: "输入准备" },
      { label: "字段映射", desc: "将时间、发送方、会话、主题、附件和业务状态映射到统一字段。", phase: "结构整理" },
      { label: "去重与异常", desc: "识别重复记录、缺失字段和无法解析的文件，放入异常清单等待人工处理。", phase: "结构整理" },
      { label: "备份归档", desc: "保存原始文件、清洗结果和处理日志之间的关系，保证后续可以追溯。", phase: "状态记录" },
      { label: "知识库待处理", desc: "将通过整理的数据标记为待摘要、待切分或待人工确认，不直接默认进入最终知识库。", phase: "状态记录" }
    ],
    coreFeatures: [
      { title: "批次管理", description: "每次导入都有来源、时间和处理状态，方便复盘与回滚。" },
      { title: "字段清洗", description: "统一时间、人物、主题和附件等基础字段，降低后续检索噪声。" },
      { title: "异常清单", description: "对缺失、重复和无法解析的记录保留人工处理入口。" },
      { title: "隐私边界", description: "只做本地整理和状态记录，不自动向外部平台发送内容。" }
    ],
    challenges: [
      {
        title: "原始数据不可逆污染",
        problem: "如果清洗过程直接覆盖导出文件，出现字段误判时很难恢复原始上下文。",
        solution: "原始文件只读保存，加工结果写入独立目录，并通过批次编号和日志保持对应关系。"
      },
      {
        title: "接入不等于知识库",
        problem: "导入成功并不代表数据已经适合被大模型检索，直接入库会放大噪声和隐私风险。",
        solution: "增加待处理状态，将摘要、切分、脱敏和人工确认拆成后续阶段。"
      }
    ],
    deliveryChecks: [
      { label: "项目定位", status: "数据接入", detail: "负责把外部导出内容整理成中台可处理的输入，不承担完整知识问答。" },
      { label: "数据安全", status: "本地优先", detail: "保留原始文件和处理日志，不设计自动外发或自动沟通动作。" },
      { label: "异常处理", status: "人工接管", detail: "格式变化、字段缺失和重复记录进入异常清单。" },
      { label: "后续扩展", status: "可衔接", detail: "整理后的数据可进入 RAG、复盘和业务模块的后续流程。" }
    ],
    results: [
      { value: "可追溯", label: "导入批次", detail: "来源、时间、文件数量和处理状态都有记录入口。" },
      { value: "分层", label: "处理状态", detail: "原始、清洗、异常、待知识化等状态分开管理。" },
      { value: "可衔接", label: "后续应用", detail: "为 RAG 知识库、内容复盘和业务模块提供结构化输入。" }
    ],
    tools: [
      { name: "微信导出文件", note: "作为接入源，保留原始目录和文件结构，避免只留下加工后的结果。" },
      { name: "字段映射规则", note: "将不同导出格式转换为统一的时间、人物、主题、附件和状态字段。" },
      { name: "本地备份记录", note: "记录批次、处理日志和异常清单，支持后续人工复盘。" },
      { name: "数据中台 / RAG", note: "作为后续承接层，只有经过整理和确认的数据才进入知识化流程。" }
    ],
    media: [
      {
        title: "微信记录导出流程",
        description: "项目仓库提供的脱敏操作示例，展示读取当前微信进程、本地存储路径以及全量 / 增量导出选择；账号和路径信息已遮挡。",
        src: mediaBase("wechat", "wechat-export-flow.png"),
        kind: "image"
      }
    ],
    next: { slug: "data-platform", title: "数据中台与知识底座" }
  },

  "ecommerce-aigc-workflow": {
    slug: "ecommerce-aigc-workflow",
    index: "02",
    label: "INDEPENDENT PROJECT / LOCAL WORKFLOW",
    title: "服装平台视觉生图自动化",
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
    next: { slug: "ai-content-ops", title: "自媒体智能内容运营 Agent" }
  },

  "aigc-console": {
    slug: "aigc-console",
    index: "05",
    label: "AIGC PRODUCTION CONSOLE",
    title: "AI 视频生产控制台",
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
    index: "07",
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
    next: { slug: "knowledge-base", title: "知识沉淀与 Agent 工作流验证" }
  },

  "knowledge-base": {
    slug: "knowledge-base",
    index: "08",
    label: "KNOWLEDGE / AGENT EXPLORATION",
    title: "知识沉淀与 Agent 工作流验证",
    lead: "这是一个能力验证项目：用 Hermes、Obsidian 和本地脚本验证对话整理、项目复盘、规则沉淀与后续 Agent 调用之间的连接方式。当前已实现个人本地沉淀链路，向量检索、团队权限和生产级审计属于后续扩展方向。",
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
    next: { slug: "boss-job-collector", title: "浏览器自动化与岗位信息采集" }
  },

  "ai-content-ops": {
    slug: "ai-content-ops",
    index: "03",
    label: "B4 / BUSINESS APPLICATION",
    title: "自媒体智能内容运营 Agent",
    lead: "面向自媒体创作者的多平台内容生产场景，使用 LangGraph SubGraph 编排选题、写作、配图/视频、审核和历史沉淀。节点状态、回滚和模型成本被纳入同一条可追踪的内容工作流，发布前仍保留人工确认。",
    problem: [
      "选题、资料、写作、配图和多平台适配被拆在不同工具里，过程难回滚。",
      "不同任务不应使用同一规格模型，缺少动态路由会放大成本。",
      "长任务中断后如果没有 Checkpointer，无法恢复节点状态和人工决策。",
      "直接自动发布风险高，需要保留审核包和人工确认。"
    ],
    role: [
      "将选题、写作、配图/视频和审核拆成 LangGraph SubGraph。",
      "接入 PostgreSQL Checkpointer，保留节点状态、回滚和人工确认点。",
      "通过 MetricsContext 记录 Token、模型、延迟和成本，并按任务复杂度动态路由模型。",
      "把私有资料、联网证据、多平台草稿和历史沉淀组织成可审核内容包。"
    ],
    flow: [
      { label: "选题输入", desc: "输入一个选题、初步想法或待扩写素材，作为本次内容包的起点。", phase: "输入定义" },
      { label: "选题输入", desc: "输入选题和目标平台，确定本次内容包的边界。", phase: "输入定义" },
      { label: "SubGraph 编排", desc: "按任务拆分选题、写作、配图/视频和审核节点。", phase: "Agent 编排" },
      { label: "Research Bundle", desc: "组合私有资料、联网证据和历史沉淀，形成可追溯上下文。", phase: "上下文工程" },
      { label: "Checkpointer", desc: "持久化节点状态，支持暂停、回滚和人工决策后继续执行。", phase: "状态与成本" },
      { label: "动态模型路由", desc: "简单任务使用轻量模型，复杂任务切换高性能模型并记录成本。", phase: "状态与成本" },
      { label: "多平台草稿", desc: "生成公众号、小红书、抖音图文和 X/Twitter 等可审核版本。", phase: "生成执行" },
      { label: "人工审核", desc: "整理来源、风险提示和发布前检查项，不自动越过发布确认。", phase: "人机协同" },
      { label: "历史沉淀", desc: "保存内容包、指标和复盘结果，作为后续选题的可复用资产。", phase: "资产沉淀" }
    ],
    coreFeatures: [
      { title: "SubGraph 编排", description: "将选题、写作、配图/视频和审核拆成可独立回滚的节点。" },
      { title: "Checkpointer", description: "保存节点状态、人工决策和恢复位置，避免长任务从头开始。" },
      { title: "MetricsContext", description: "记录 Token、模型、延迟和成本，为模型路由提供依据。" },
      { title: "Research Bundle", description: "把私有资料、联网证据和历史内容组织成可引用上下文。" },
      { title: "多平台草稿", description: "同一选题生成多个平台版本，并保留发布前审核包。" },
      { title: "历史沉淀", description: "将结果和复盘回写内容资产，支持下一轮选题复用。" }
    ],
    challenges: [
      {
        title: "节点状态可恢复",
        problem: "长任务中途失败或需要人工确认时，如果没有持久化状态，流程只能从头开始。",
        solution: "使用 PostgreSQL Checkpointer 保存节点状态、人工决策和回滚位置。"
      },
      {
        title: "模型成本可控",
        problem: "所有节点都使用高性能模型，会让批量内容生产成本失去边界。",
        solution: "通过 MetricsContext 记录调用指标，并根据任务复杂度进行动态模型路由。"
      },
      {
        title: "发布风险控制",
        problem: "多平台内容生成后如果直接自动发布，容易跳过口径、来源和平台表达差异的最终判断。",
        solution: "保留审核包和人工确认环节，系统生成草稿与检查项，人决定是否发布。"
      }
    ],
    deliveryChecks: [
      {
        label: "真实业务问题",
        status: "业务原型",
        detail: "覆盖多平台内容运营的选题、资料、生成、审核和历史沉淀。"
      },
      {
        label: "工程结构",
        status: "Agent 编排",
        detail: "LangGraph SubGraph + PostgreSQL Checkpointer + MetricsContext，具体部署形态按环境配置。"
      },
      {
        label: "上下文工程",
        status: "可追踪",
        detail: "节点状态、模型名称、Token、延迟和成本进入统一记录上下文。"
      },
      {
        label: "模型路由",
        status: "按任务切换",
        detail: "简单任务使用轻量模型，复杂任务使用高性能模型并保留成本记录。"
      },
      {
        label: "人机协同",
        status: "保留确认",
        detail: "发布中心生成审核包，不直接自动发布。"
      },
      {
        label: "内容资产沉淀",
        status: "可复用",
        detail: "生成结果、审核状态和复盘数据回写历史内容资产，供后续选题调用。"
      }
    ],
    results: [
      { value: "SubGraph", label: "节点编排", detail: "选题、写作、配图/视频和审核拆成可回滚节点。" },
      { value: "可恢复", label: "状态持久化", detail: "Checkpointer 保留节点状态和人工决策。" },
      { value: "可核算", label: "模型成本", detail: "MetricsContext 记录 Token、延迟和成本。" },
      { value: "多平台", label: "审核草稿", detail: "一个选题生成多个平台版本，发布前保留人工确认。" }
    ],
    tools: [
      { name: "LangGraph", note: "组织选题、写作、配图/视频和审核 SubGraph。" },
      { name: "PostgreSQL Checkpointer", note: "持久化节点状态、回滚位置和人工决策。" },
      { name: "MetricsContext", note: "记录模型、Token、延迟和成本，支持动态路由。" },
      { name: "Research Bundle", note: "整合私有资料、联网证据和历史内容上下文。" },
      { name: "多平台输出", note: "生成不同平台的审核草稿和发布前检查包。" },
      { name: "Mock / 限流降级", note: "隔离开发环境，并为外部模型调用预留失败兜底。" }
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
    next: { slug: "live-clip-agent", title: "AI 直播切片 Agent" }
  },

  "mcp-agent-cluster": {
    slug: "mcp-agent-cluster",
    index: "07",
    label: "B5 / ARCHITECTURE VALIDATION",
    title: "MCP 多 Agent 共享服务集群",
    lead: "以 MCP + Streamable HTTP 为协议边界，验证多个业务项目如何通过统一网关共享 LLM、RAG、记忆和 Prompt 服务。该项目是架构验证与能力方案，不包装成已经上线的 SaaS 产品。",
    problem: [
      "客服、内容运营和视觉工作流如果分别接入模型与知识库，会重复处理认证、日志、配额和错误降级。",
      "不同项目需要共享能力，但知识库、会话记忆和用户画像又不能相互串数据，项目隔离必须成为默认规则。",
      "提示词版本散落在各个 Agent 中，难以审计、回滚和比较不同业务场景的执行效果。"
    ],
    role: [
      "设计 REST → MCP Gateway → MCP Server 的调用边界，用 Streamable HTTP 承载跨进程能力调用。",
      "规划认证、日志、配额、路由和失败降级，使业务项目不必重复实现基础治理。",
      "定义 LLM MCP Server、RAG MCP Server、Memory 服务和 YAML Prompt 模板中心的职责。",
      "以 project_id 做 Collection 隔离，并把会话记忆和跨项目用户画像拆成可授权的数据范围。"
    ],
    flow: [
      { label: "项目请求", desc: "业务项目提交带 project_id、用户上下文和任务类型的能力请求。", phase: "调用入口" },
      { label: "REST 网关", desc: "接收外部 REST 请求，完成身份校验、参数标准化和限流。", phase: "治理层" },
      { label: "MCP 路由", desc: "通过 Streamable HTTP 将请求路由到合适的 LLM、RAG、Memory 或 Prompt Server。", phase: "协议层" },
      { label: "项目隔离", desc: "按 project_id 映射 Collection、工具权限和可见记忆，避免跨项目污染。", phase: "安全边界" },
      { label: "能力执行", desc: "由对应 Server 执行模型调用、知识检索、记忆读写或 Prompt 模板渲染。", phase: "共享能力" },
      { label: "观测回传", desc: "统一记录调用日志、耗时、配额消耗和错误信息，返回可追踪的结果。", phase: "治理层" },
      { label: "模板沉淀", desc: "将经过验证的 Prompt 版本写入 YAML 模板中心，支持审计和回滚。", phase: "资产沉淀" }
    ],
    coreFeatures: [
      { title: "MCP 协议边界", description: "用 Streamable HTTP 统一跨项目的模型和工具调用方式。" },
      { title: "网关治理", description: "集中处理认证、日志、配额、路由和错误降级。" },
      { title: "项目隔离", description: "project_id 绑定 Collection、权限和记忆范围，默认不跨项目读取。" },
      { title: "共享记忆", description: "会话记忆与跨项目用户画像按授权范围提供，不把所有上下文混在一起。" },
      { title: "Prompt 模板中心", description: "YAML 管理模板版本、变量和回滚关系，便于审计。" }
    ],
    challenges: [
      {
        title: "共享能力与数据隔离",
        problem: "共享 Server 可以减少重复建设，但错误的 Collection 或记忆路由会把一个项目的上下文带到另一个项目。",
        solution: "把 project_id 作为强制路由键，分别约束知识集合、工具权限和记忆范围，并在网关层记录审计信息。"
      },
      {
        title: "架构验证不等于上线产品",
        problem: "协议、路由和模板中心已经能表达复用关系，但生产级高可用、密钥管理和多租户运营仍需要工程化。",
        solution: "在档案中明确标注能力验证边界，把部署、监控、密钥轮换和容量压测列为后续工作。"
      }
    ],
    deliveryChecks: [
      { label: "项目定位", status: "架构验证", detail: "验证多 Agent 共享服务的协议与治理边界，不宣称已上线 SaaS。" },
      { label: "协议通道", status: "MCP + Streamable HTTP", detail: "REST 网关向 MCP Server 转换请求，便于不同项目复用能力。" },
      { label: "隔离策略", status: "project_id 路由", detail: "Collection、工具权限和记忆范围按项目隔离，跨项目访问需显式授权。" },
      { label: "工程化边界", status: "待部署验证", detail: "高可用、密钥管理、监控和容量压测不包装为当前已完成能力。" }
    ],
    results: [
      { value: "1 个", label: "共享网关", detail: "多个业务项目可以复用统一的认证、路由和观测入口。" },
      { value: "4 类", label: "共享服务", detail: "LLM、RAG、Memory 和 Prompt Server 的职责边界清晰。" },
      { value: "按项目", label: "数据隔离", detail: "project_id 绑定知识集合和上下文范围，降低串库风险。" }
    ],
    tools: [
      { name: "MCP + Streamable HTTP", note: "作为跨项目能力调用的协议通道，连接网关与各类 MCP Server。" },
      { name: "REST → MCP Gateway", note: "集中处理认证、日志、配额、路由和错误降级。" },
      { name: "LLM / RAG MCP Server", note: "分别承接模型推理和项目隔离的知识检索能力。" },
      { name: "YAML Prompt 中心", note: "管理模板变量、版本、审核和回滚关系；生产部署仍需补齐。" }
    ],
    media: [],
    next: { slug: "model-finetune", title: "聊天数据模型微调实验" }
  },

  "asset-center-sales-assessment": {
    slug: "asset-center-sales-assessment",
    index: "06",
    label: "B6 / BUSINESS MODULES",
    title: "AI 素材中心 & 销售考核",
    lead: "将数据中台治理后的图片、文字、视频和业务知识组织成两个可复用模块：素材中心负责多模态检索与片段定位，销售考核负责按知识点出题、组卷和多轮评分。两者共享向量与知识结构，但保持各自的业务流程。",
    problem: [
      "图片、文字和视频素材分散在文件夹与聊天记录中，按商品、场景和卖点检索时很难快速定位。",
      "长视频中真正有价值的片段往往只占很小一部分，整段入库既浪费检索资源，也不利于复用。",
      "销售培训出题和评分缺少统一知识上下文，单次 LLM 判断容易受表述和评分标准影响。"
    ],
    role: [
      "设计 pgvector 1024 维统一向量表，用 HNSW 支持图片、文字和视频片段的相似检索。",
      "规划 OCR、VLM、ASR 和 LLM 的离线增强流程，将文本、画面描述、语音和业务标签写回素材元数据。",
      "长视频按 ASR 时间戳分段，保留片段来源、起止时间和可回看的原始引用。",
      "将销售考核拆成直接 LLM 出题、RAG 指定知识点出题和多轮评判三条路径。"
    ],
    flow: [
      { label: "素材接入", desc: "接收图片、文字、视频和销售资料，登记来源、项目、商品和版本。", phase: "资产入口" },
      { label: "离线增强", desc: "使用 OCR、VLM、ASR 和 LLM 提取文字、画面、语音、主题和卖点标签。", phase: "资产加工" },
      { label: "向量入库", desc: "将多模态内容统一写入 pgvector 1024 维向量表，并以 HNSW 支持近邻检索。", phase: "检索准备" },
      { label: "片段定位", desc: "长视频按 ASR 时间戳切成可检索片段，保留原视频引用和时间范围。", phase: "素材中心" },
      { label: "知识点选题", desc: "销售考核可直接由模型出题，也可从 RAG 指定知识点和难度范围。", phase: "销售考核" },
      { label: "多轮评判", desc: "围绕完整性、准确性、流畅性和业务匹配度进行多轮评分，降低单次判断偏差。", phase: "销售考核" },
      { label: "结果沉淀", desc: "保存素材命中、题目、答案、评分理由和人工修订，回写数据中台供下一次使用。", phase: "资产沉淀" }
    ],
    coreFeatures: [
      { title: "多模态向量表", description: "图片、文字和视频片段共用 pgvector 1024 维检索结构。" },
      { title: "HNSW 检索", description: "为素材搜索提供可扩展的近邻检索索引。" },
      { title: "离线增强", description: "OCR、VLM、ASR、LLM 分别补齐文本、画面、语音和业务标签。" },
      { title: "知识点出题", description: "支持直接出题与基于 RAG 指定知识点出题两种路径。" },
      { title: "多轮评分", description: "从完整性、准确性、流畅性和业务匹配度多个维度复核答案。" }
    ],
    challenges: [
      {
        title: "跨模态检索统一表达",
        problem: "图片、文字和视频片段的字段、时间范围和来源不同，直接放在一起会丢失可解释性。",
        solution: "统一向量表的基础字段，同时保留 modality、source_id、时间戳和增强结果，让命中结果可回到原始资产。"
      },
      {
        title: "评分标准一致性",
        problem: "同一答案交给模型多次评分可能出现偏差，单一总分也难说明业务问题。",
        solution: "按四个维度拆分评分，使用多轮评判与理由记录，必要时进入人工复核。"
      }
    ],
    deliveryChecks: [
      { label: "项目定位", status: "数据中台业务模块", detail: "素材中心和销售考核共享底座，但不是两个独立的数据平台。" },
      { label: "素材检索", status: "多模态方案", detail: "pgvector 1024 维 + HNSW，以及 OCR/VLM/ASR/LLM 增强流程已定义。" },
      { label: "考核出题", status: "双路径", detail: "支持直接 LLM 出题和 RAG 指定知识点出题。" },
      { label: "评分边界", status: "多轮 + 人工复核", detail: "模型给出维度分与理由，关键业务结论仍保留人工确认。" }
    ],
    results: [
      { value: "1024 维", label: "统一向量", detail: "图片、文字和视频片段共享向量字段与检索入口。" },
      { value: "2 条", label: "出题路径", detail: "直接 LLM 出题或基于 RAG 指定知识点出题。" },
      { value: "4 维", label: "评分标准", detail: "完整性、准确性、流畅性和业务匹配度分开记录。" }
    ],
    tools: [
      { name: "pgvector 1024D / HNSW", note: "作为多模态素材的统一向量存储与近邻检索索引。" },
      { name: "OCR / VLM / ASR", note: "离线提取图片文字、画面信息和视频语音，并写回可检索元数据。" },
      { name: "RAG 出题", note: "从指定知识点、商品资料和销售规则中生成题目与参考答案。" },
      { name: "多轮 LLM 评判", note: "按四个业务维度评分并保留理由，必要时交给人工复核。" }
    ],
    media: [
      {
        title: "素材库模块 / 本地空状态",
        description: "真实本地运行页：课程文档、成交喜报、聊天素材与 OSS 上传入口已渲染；初始化数据库中暂无素材，没有填充虚构业务内容。",
        src: mediaBase("data-platform", "material-library-empty.png"),
        kind: "image"
      },
      {
        title: "AI 考核模块 / 本地空状态",
        description: "真实本地运行页：支持按销售话术等分类与题数配置出题；当前初始化库没有试卷和作答记录，大模型出题链路尚未配置。",
        src: mediaBase("data-platform", "sales-assessment-empty.png"),
        kind: "image"
      }
    ],
    next: { slug: "mcp-agent-cluster", title: "MCP 多 Agent 共享服务集群" }
  },

  "model-finetune": {
    slug: "model-finetune",
    index: "08",
    label: "B7 / LOCAL FINETUNE EXPLORATION",
    title: "聊天数据模型微调实验",
    lead: "使用数据中台脱敏后的聊天与客服样本，验证 SFT、DPO、QLoRA 和 LoRA 对回答风格、偏好和错误规避的影响。微调主要改变表达方式与行为偏好，商品知识和实时业务事实仍由 RAG 提供；项目定位为本地部署与技术探索。",
    problem: [
      "客服风格、礼貌程度和拒答边界很难只靠 Prompt 长期稳定控制，需要用高质量样本验证微调价值。",
      "如果把商品知识直接写进模型参数，知识更新会变慢，也会混淆微调与 RAG 的职责。",
      "小样本本地训练容易过拟合，必须通过双盲评测比较基线、SFT 和偏好优化后的差异。"
    ],
    role: [
      "从数据中台抽取脱敏对话，整理为 ShareGPT / JSONL 格式，并划分训练、验证和盲测集合。",
      "用 SFT 学习客服语气、格式和流程边界，用 DPO 学习偏好、拒答和错误规避。",
      "本地使用 RTX 4090 做 QLoRA 小样本实验（约 200–500 条、3–5 轮），并规划云端 LoRA（A100、3000+ SFT、1000 DPO）作为扩展路径。",
      "建立双盲 5 分制评测，分别观察风格一致性、事实引用、任务完成度和风险控制。"
    ],
    flow: [
      { label: "数据抽取", desc: "从数据中台选择经过脱敏和人工确认的聊天样本，保留来源与版本。", phase: "数据准备" },
      { label: "格式转换", desc: "转换为 ShareGPT / JSONL，对角色、指令、回答和偏好对进行结构化。", phase: "数据准备" },
      { label: "SFT 训练", desc: "让模型学习客服表达、回复结构和已确认的业务沟通风格。", phase: "训练实验" },
      { label: "DPO 优化", desc: "用优选/拒绝回答对学习偏好和错误规避，不把不稳定知识固化进参数。", phase: "训练实验" },
      { label: "本地 QLoRA", desc: "在 RTX 4090 上进行小样本低显存实验，记录轮数、损失和显存占用。", phase: "训练实验" },
      { label: "双盲评测", desc: "以 5 分制比较基线、SFT、DPO 结果，盲化模型身份以降低主观偏差。", phase: "质量评估" },
      { label: "RAG 组合", desc: "将微调后的风格能力与 RAG 的实时知识结合，区分表达习惯和事实来源。", phase: "能力边界" }
    ],
    coreFeatures: [
      { title: "SFT 风格学习", description: "学习客服语气、结构和流程表达，不替代知识检索。" },
      { title: "DPO 偏好优化", description: "用偏好对强化合适回答并规避已知错误。" },
      { title: "本地 QLoRA", description: "在 RTX 4090 上验证小样本、低显存训练路径。" },
      { title: "云端扩展", description: "预留 A100 上的 LoRA 规模化训练方案，不作为当前本地成果。" },
      { title: "双盲评测", description: "用 5 分制比较风格、事实、完成度和风险控制差异。" }
    ],
    challenges: [
      {
        title: "微调与 RAG 的职责分离",
        problem: "把商品价格、库存等易变知识写进参数，会让更新和事实纠错变得困难。",
        solution: "微调只负责风格、偏好和错误规避；商品知识、来源引用和实时事实继续通过 RAG 注入。"
      },
      {
        title: "小样本过拟合",
        problem: "200–500 条样本和少量训练轮次可能让模型记住个别表达，不能只看训练损失。",
        solution: "保留盲测集，记录不同训练轮次，并用双盲 5 分制从多个维度比较基线和微调版本。"
      }
    ],
    deliveryChecks: [
      { label: "项目定位", status: "本地技术探索", detail: "验证微调路线和评测方法，不宣称生产模型已经上线。" },
      { label: "训练数据", status: "来自 B2", detail: "只使用数据中台脱敏、清洗并经过人工确认的样本。" },
      { label: "能力边界", status: "风格优先", detail: "SFT/DPO 改变表达与偏好，业务知识仍由 RAG 提供。" },
      { label: "部署路线", status: "本地 / 云端分开", detail: "RTX 4090 QLoRA 是当前探索，A100 LoRA 属于后续扩展方案。" }
    ],
    results: [
      { value: "SFT + DPO", label: "训练对比", detail: "分别观察风格学习与偏好优化的效果。" },
      { value: "4090", label: "本地验证", detail: "以 QLoRA 验证小样本低显存训练链路。" },
      { value: "5 分制", label: "双盲评测", detail: "按多维度比较基线与微调版本，避免只凭主观感受判断。" }
    ],
    tools: [
      { name: "ShareGPT / JSONL", note: "承载脱敏后的多轮对话、指令和偏好对数据。" },
      { name: "SFT / DPO", note: "分别学习客服风格与回答偏好，避免把两类目标混在一起。" },
      { name: "QLoRA / RTX 4090", note: "用于本地小样本低显存实验，记录训练轮次和资源占用。" },
      { name: "双盲 5 分制评测", note: "比较风格、事实引用、完成度和风险控制，并保留评测记录。" }
    ],
    media: [
      {
        title: "Qwen2.5 LoRA 训练损失",
        description: "本机保存的 train_sarcasm_v1 训练曲线：20 步内 loss 由约 6.4 降至 0.2。它只证明一次小样本训练输出，不代表通用能力已经提升。",
        src: mediaBase("finetune", "qwen-lora-training-loss.png"),
        kind: "image"
      },
      {
        title: "LLaMA-Factory 参数界面",
        description: "本机 LLaMA-Factory 项目中的 WebUI，展示 LoRA、学习率、轮次、截断长度、Batch 与梯度累积等可配置项；用于说明训练工具链，不等同于生产部署。",
        src: mediaBase("finetune", "llamafactory-webui.png"),
        kind: "image"
      }
    ],
    next: null
  },

  "boss-job-collector": {
    slug: "boss-job-collector",
    index: "06",
    label: "BROWSER AUTOMATION / DATA INTAKE",
    title: "浏览器自动化与岗位信息采集",
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
          {data.media.length > 0 && <a href="#pcase-media">查看证据</a>}
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
      {data.media.length > 0 && (
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
      )}

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
