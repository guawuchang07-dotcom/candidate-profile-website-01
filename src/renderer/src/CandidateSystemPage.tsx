import { useEffect, useState } from "react";
import type { CSSProperties } from "react";
import avatarOrbAsset from "./assets/cyber/avatar-orb.png";
import cityLeftAsset from "./assets/cyber/city-left.png";
import cityRightAsset from "./assets/cyber/city-right.png";
import dialogFrameAsset from "./assets/cyber/dialog-frame.png";
import hudOverlayAsset from "./assets/cyber/hud-overlay.png";
import loaderFrameAsset from "./assets/cyber/loader-frame-clean.png";
import signalWaveAsset from "./assets/cyber/signal-wave.png";
import tagOrnamentsAsset from "./assets/cyber/tag-ornaments.png";

type CssVars = CSSProperties & Record<`--${string}`, string>;
type ScreenState = "home" | "entering" | "profile";
type ProfileProject = {
  icon: string;
  title: string;
  subtitle: string;
  description: string;
  role: string;
  value: string;
  tags?: string[];
  detailHref?: string;
};

const transitionDurationMs = 1100;

const reflections = Array.from({ length: 18 }, (_, index) => ({
  width: `${36 + (index % 5) * 18}px`,
  left: `${4 + index * 5.2}%`,
  top: `${8 + (index % 6) * 11}%`,
  delay: `${index * 0.17}s`
}));

const pixelSparks = [
  ["18%", "21%", "cyan", "0.1s"],
  ["25%", "14%", "violet", "0.5s"],
  ["32%", "54%", "blue", "0.9s"],
  ["38%", "24%", "magenta", "1.2s"],
  ["46%", "62%", "cyan", "0.7s"],
  ["54%", "18%", "violet", "1.4s"],
  ["61%", "57%", "blue", "0.3s"],
  ["68%", "29%", "cyan", "1.1s"],
  ["75%", "48%", "magenta", "0.6s"],
  ["82%", "19%", "blue", "1.5s"],
  ["88%", "61%", "violet", "0.8s"],
  ["12%", "58%", "cyan", "1.0s"]
];

const avatarDataNodes = [
  ["23%", "32%", "cyan", "0.2s"],
  ["32%", "18%", "violet", "1.1s"],
  ["70%", "22%", "blue", "0.6s"],
  ["80%", "43%", "cyan", "1.6s"],
  ["67%", "73%", "magenta", "0.9s"],
  ["27%", "69%", "blue", "1.4s"]
];

const layoutMarkers = [
  { className: "marker-avatar", label: "Avatar Core" },
  { className: "marker-wave", label: "Signal Wave" },
  { className: "marker-dialog", label: "Dialog" },
  { className: "marker-loader", label: "Energy Loader" },
  { className: "marker-tagline", label: "Role Tagline" }
];

const loadingLetters = "LOADING".split("");
const accessingLetters = "ACCESSING".split("");
const loaderLeftArrows = [">", ">", ">"];
const loaderRightArrows = ["<", "<", "<"];

const profileAbilities = [
  {
    icon: "workflow",
    title: "业务运营自动化",
    subtitle: "Browser Automation",
    points: ["自媒体运营辅助", "岗位线索收藏", "GitHub 项目情报"]
  },
  {
    icon: "ai",
    title: "AIGC生产流程",
    subtitle: "AI Production",
    points: ["小说到视频任务", "Prompt / 分镜规则", "候选版本复盘"]
  },
  {
    icon: "trend",
    title: "知识沉淀",
    subtitle: "Knowledge System",
    points: ["Hermes 每日复盘", "Obsidian 知识库", "工具调研沉淀"]
  }
];

const profileProjects: ProfileProject[] = [
  {
    icon: "growth",
    title: "业务运营自动化脚本集",
    subtitle: "Ops Automation",
    description: "自媒体运营、岗位线索、项目情报三个场景的自动化入口。",
    role: "场景拆解、自动化浏览器脚本、规则控制、状态记录、结果复盘",
    value: "证明可以把业务运营中的重复网页动作做成可演示的提效工具",
    tags: ["自媒体运营", "岗位线索", "GitHub情报"],
    detailHref: "resume#resume-ops-lab"
  },
  {
    icon: "video",
    title: "AI漫剧自动化生产控制台",
    subtitle: "AIGC Workflow",
    description: "小说分析、资产确认、提示词和视频任务复盘的本地控制台。",
    role: "需求拆解、流程设计、Agent 规则、AI 协作开发、工具链验证、结果验收",
    value: "将零散 AIGC 生成步骤沉淀为可复盘的本地生产工具，支持多人物参考图、候选视频管理和失败状态回写",
    tags: ["AIGC生产", "本地控制台", "任务复盘"],
    detailHref: "resume#resume-projects"
  },
  {
    icon: "growth",
    title: "个人 AI 知识库沉淀系统",
    subtitle: "Knowledge System",
    description: "把 AI 对话沉淀为每日复盘、项目经验和后续行动。",
    role: "知识库结构设计、定时任务、会话分类、模型成本控制",
    value: "把 AI 聊天从一次性对话变成可复盘、可检索、可长期积累的知识资产",
    tags: ["Hermes", "Obsidian", "每日复盘"],
    detailHref: "resume#resume-projects"
  }
];

const profileFutureDirection = {
  title: "扩展方向：飞书 CLI 企业协作自动化"
};

const profileTools = ["Codex", "Cursor", "Hermes", "Obsidian", "Tabbit", "Coze", "OpenClaw", "GitHub", "飞书", "AIGC视频", "业务运营自动化"];
const resumePdfHref = new URL("./assets/static/files/zhang-yuanbo-resume.pdf", import.meta.url).href;
const resumePdfFileName = "张远博简历.pdf";
const contactPhone = "17564138094";

const profileActions = [
  { icon: "folder", label: "查看详细简历", href: "resume" },
  { icon: "download", label: "下载简历", href: resumePdfHref, downloadName: resumePdfFileName },
  { icon: "send", label: "联系我", phone: contactPhone }
];

const loaderAnimationDurationMs = 900;
const resumeTransitionDurationMs = 650;

function getInitialScreenState(): ScreenState {
  const params = new URLSearchParams(window.location.search);
  const normalizedPath = window.location.pathname.replace(/\/+$/, "");
  return params.get("stage") === "profile" || /(?:^|\/)profile$/.test(normalizedPath) ? "profile" : "home";
}

function getAppRouteHref(route = ""): string {
  const basePath = window.location.pathname
    .replace(/\/(?:resume|profile)\/?$/, "/")
    .replace(/\/index\.html$/, "/");
  const normalizedBase = basePath.endsWith("/") ? basePath : `${basePath}/`;
  return `${normalizedBase}${route}`;
}

export default function CandidateSystemPage(): JSX.Element {
  const [screenState, setScreenState] = useState<ScreenState>(getInitialScreenState);
  const [loaderProgress, setLoaderProgress] = useState(0);
  const [resumeTransitionActive, setResumeTransitionActive] = useState(false);
  const activeLoadingLetters = screenState === "entering" ? accessingLetters : loadingLetters;

  useEffect(() => {
    if (screenState !== "entering") {
      setLoaderProgress(0);
      return;
    }

    let animationFrame = 0;
    let startTime = 0;

    setLoaderProgress(0);

    const animateProgress = (timestamp: number): void => {
      if (startTime === 0) {
        startTime = timestamp;
      }

      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / loaderAnimationDurationMs, 1);

      setLoaderProgress(Math.round(progress * 100));

      if (progress < 1) {
        animationFrame = window.requestAnimationFrame(animateProgress);
      }
    };

    animationFrame = window.requestAnimationFrame(animateProgress);

    return () => {
      window.cancelAnimationFrame(animationFrame);
    };
  }, [screenState]);

  function openCandidateProfile(): void {
    if (screenState !== "home") {
      return;
    }

    setLoaderProgress(0);
    setScreenState("entering");
    window.setTimeout(() => setScreenState("profile"), transitionDurationMs);
  }

  function returnToHome(): void {
    setResumeTransitionActive(false);
    setScreenState("home");
    window.history.replaceState(null, "", getAppRouteHref());
  }

  function openResumeModule(href: string): void {
    if (resumeTransitionActive) {
      return;
    }

    setResumeTransitionActive(true);
    window.setTimeout(() => {
      window.location.href = getAppRouteHref(href);
    }, resumeTransitionDurationMs);
  }

  function openProjectDetail(href: string): void {
    if (resumeTransitionActive) {
      return;
    }

    setResumeTransitionActive(true);
    window.setTimeout(() => {
      window.location.href = getAppRouteHref(href);
    }, resumeTransitionDurationMs);
  }

  function downloadFile(href: string, fileName: string): void {
    const link = document.createElement("a");
    link.href = href;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    link.remove();
  }

  function showContactPhone(phone: string): void {
    window.alert(`联系方式：${phone}`);
  }

  return (
    <main
      className={`candidate-page candidate-page-${screenState}${resumeTransitionActive ? " is-opening-resume" : ""}`}
      aria-label="Candidate system preview"
    >
      <section className={`candidate-stage stage-${screenState}`} aria-label="Candidate system">
        <div className="stage-grid" aria-hidden="true" />
        <div className="pixel-atmosphere" aria-hidden="true">
          <div className="distant-city" />
          <img className="signal-wave-asset" src={signalWaveAsset} alt="" />
          <img className="city-asset city-asset-left" src={cityLeftAsset} alt="" />
          <img className="city-asset city-asset-right" src={cityRightAsset} alt="" />
          <div className="pixel-spark-layer">
            {pixelSparks.map(([left, top, tone, delay], index) => (
              <span
                className={`pixel-spark spark-${tone}`}
                key={`${left}-${top}-${index}`}
                style={
                  {
                    "--spark-left": left,
                    "--spark-top": top,
                    "--spark-delay": delay
                  } as CssVars
                }
              />
            ))}
          </div>
          <div className="neon-horizon" />
          <div className="water-reflection">
            {reflections.map((reflection, index) => (
              <span
                key={`${reflection.left}-${index}`}
                style={
                  {
                    "--reflection-width": reflection.width,
                    "--reflection-left": reflection.left,
                    "--reflection-top": reflection.top,
                    "--reflection-delay": reflection.delay
                  } as CssVars
                }
              />
            ))}
          </div>
        </div>
        <div className="stage-vignette" aria-hidden="true" />
        <img className="hud-overlay-asset" src={hudOverlayAsset} alt="" aria-hidden="true" />
        <div className="stage-transition-burst" aria-hidden="true" />

        <div className="hud-frame" aria-hidden="true">
          <span className="corner corner-tl" />
          <span className="corner corner-tr" />
          <span className="corner corner-bl" />
          <span className="corner corner-br" />
        </div>

        {screenState !== "profile" ? (
          <div className="home-scene">
            <header className="system-header">
              <div className="system-brand">
                <span className="brand-glyph" aria-hidden="true" />
                <span>CANDIDATE SYSTEM</span>
              </div>
              <div className="system-status" aria-hidden="true">
                <span />
                <span />
                <span />
              </div>
            </header>

            <div className="composition-map" aria-hidden="true">
              {layoutMarkers.map((marker) => (
                <div className={`layout-marker ${marker.className}`} key={marker.className}>
                  <span>{marker.label}</span>
                </div>
              ))}
            </div>

            <button
              className={`avatar-hit-area${screenState === "entering" ? " is-activating" : ""}`}
              type="button"
              aria-label="点击头像查看候选人资料"
              disabled={screenState !== "home"}
              onClick={openCandidateProfile}
            >
              <img className="avatar-orb-asset" src={avatarOrbAsset} alt="" />
              <span className="avatar-data-field" aria-hidden="true">
                {avatarDataNodes.map(([left, top, tone, delay], index) => (
                  <span
                    className={`avatar-data-node node-${tone}`}
                    key={`${left}-${top}-${index}`}
                    style={
                      {
                        "--node-left": left,
                        "--node-top": top,
                        "--node-delay": delay
                      } as CssVars
                    }
                  />
                ))}
              </span>
              <span className="avatar-focus-ring" aria-hidden="true" />
            </button>

            <aside className="dialog-placeholder" aria-label="Avatar prompt">
              <img className="dialog-frame-asset" src={dialogFrameAsset} alt="" aria-hidden="true" />
              <div className="dialog-content">
                <strong>点击头像查看候选人资料</strong>
                <span>Click the avatar to view candidate profile.</span>
              </div>
            </aside>

            <div
              className={`loader-placeholder${screenState === "entering" ? " is-activating" : ""}`}
              aria-label={screenState === "entering" ? "Loading candidate profile" : "Loading preview"}
            >
              <img className="loader-frame-asset" src={loaderFrameAsset} alt="" aria-hidden="true" />
              <div className="loader-status-row" aria-hidden="true">
                <span className="loader-flow loader-flow-left">
                  {loaderLeftArrows.map((arrow, index) => (
                    <span
                      className="loader-arrow"
                      key={`left-${index}`}
                      style={{ "--arrow-delay": `${index * 0.12}s` } as CssVars}
                    >
                      {arrow}
                    </span>
                  ))}
                </span>
                <span className="loader-title">
                  <span className="loader-word">
                    {activeLoadingLetters.map((letter, index) => (
                      <span
                        className="loader-letter"
                        key={`${screenState}-${letter}-${index}`}
                        style={{ "--letter-delay": `${index * 0.08}s` } as CssVars}
                      >
                        {letter}
                      </span>
                    ))}
                  </span>
                  <span className="loader-dots">
                    <span className="loader-dot" />
                    <span className="loader-dot" />
                  </span>
                </span>
                <span className="loader-flow loader-flow-right">
                  {loaderRightArrows.map((arrow, index) => (
                    <span
                      className="loader-arrow"
                      key={`right-${index}`}
                      style={{ "--arrow-delay": `${(loaderRightArrows.length - index - 1) * 0.12}s` } as CssVars}
                    >
                      {arrow}
                    </span>
                  ))}
                </span>
              </div>
              <div
                key={screenState === "entering" ? "loader-entering" : "loader-home"}
                className="loader-track"
                style={{ "--loader-progress": `${loaderProgress / 100}` } as CssVars}
              >
                <span className="loader-fill" />
                <span className="loader-value">{loaderProgress}%</span>
              </div>
            </div>

            <footer className="role-tagline">
              <img className="role-tagline-ornaments" src={tagOrnamentsAsset} alt="" aria-hidden="true" />
              <span>AI Product</span>
              <span>/</span>
              <span>AI Implementation</span>
            </footer>
          </div>
        ) : (
          <section className="profile-screen profile-archive-screen" aria-label="Candidate profile">
            <div className="profile-panel profile-archive-panel">
              <div className="profile-panel-scan" aria-hidden="true" />
              <button className="profile-back-button" type="button" onClick={returnToHome} aria-label="返回首页">
                <span aria-hidden="true" />
                返回
              </button>
              <header className="profile-archive-header">
                <div className="profile-archive-brand">
                  <span className="brand-glyph" aria-hidden="true" />
                  <strong>CANDIDATE SYSTEM</strong>
                </div>

                <div className="profile-archive-title">
                  <h1>候选人档案总览</h1>
                  <p>Candidate Archive Overview</p>
                </div>

                <div className="profile-archive-version">ARCHIVE v2.0.26</div>
              </header>

              <div className="profile-archive-body">
                <aside className="profile-archive-id-card" aria-label="Candidate archive card">
                  <div className="profile-archive-card-label">CANDIDATE ARCHIVE</div>
                  <div className="profile-archive-avatar">
                    <img src={avatarOrbAsset} alt="" />
                  </div>
                  <div className="profile-archive-name">张远博</div>
                  <div className="profile-archive-role">AI工作流落地 / 业务自动化</div>
                  <div className="profile-archive-meta">
                    <span className="profile-meta-item profile-meta-location">中国 · 杭州</span>
                    <span className="profile-meta-item profile-meta-mail">1425514532@qq.com</span>
                    <span className="profile-meta-item profile-meta-time">可到岗：随时</span>
                  </div>
                  <div className="profile-tool-title">核心工具 / 擅长工具</div>
                  <div className="profile-tool-tags">
                    {profileTools.map((tool) => (
                      <span key={tool}>{tool}</span>
                    ))}
                  </div>
                  <div className="profile-archive-id-footer">
                    <span>ID: ZYB-2025-0426</span>
                    <i aria-hidden="true" />
                  </div>
                </aside>

                <div className="profile-archive-main">
                  <section className="profile-archive-section profile-archive-intro" aria-label="Personal summary">
                    <div className="profile-section-title">
                      <span>01</span>
                      <h2>个人简介</h2>
                    </div>
                    <p>
                      AIGC视频项目实战经验的 AI 工作流实践者，持续探索业务运营自动化，能够结合浏览器自动化、Codex、Hermes、Obsidian 等工具，提高运营、内容生产和知识沉淀效率。
                    </p>
                  </section>

                  <section className="profile-archive-section profile-archive-abilities" aria-label="Ability modules">
                    <div className="profile-section-title">
                      <span>02</span>
                      <h2>核心能力</h2>
                    </div>
                    <div className="profile-archive-ability-grid">
                      {profileAbilities.map((ability) => (
                        <article className="profile-archive-ability-card" key={ability.title}>
                          <div className={`profile-ability-icon icon-${ability.icon}`} aria-hidden="true" />
                          <div className="profile-ability-copy">
                            <span>{ability.title}</span>
                            <strong>{ability.subtitle}</strong>
                            <ul>
                              {ability.points.map((point) => (
                                <li key={point}>{point}</li>
                              ))}
                            </ul>
                          </div>
                        </article>
                      ))}
                    </div>
                  </section>

                  <section className="profile-archive-section profile-archive-projects" aria-label="Project experience">
                    <div className="profile-section-title profile-project-section-title">
                      <span>03</span>
                      <h2>项目经历</h2>
                      <em>{profileFutureDirection.title}</em>
                    </div>
                    <div className="profile-project-list">
                      {profileProjects.map((project, index) => {
                        const projectClassName = `profile-project-card is-entry-project${index === 0 ? " is-primary-project" : ""}`;

                        return (
                          <article className={projectClassName} key={project.title}>
                            <div className={`profile-project-icon project-icon-${project.icon}`} aria-hidden="true" />
                            <div className="profile-project-badge">
                              <span>{index === 0 ? "主推" : "项目"}</span>
                              <b>{String(index + 1).padStart(2, "0")}</b>
                            </div>
                            <div className="profile-project-copy">
                              <h3>{project.title}</h3>
                              <span>{project.subtitle}</span>
                              <p>{project.description}</p>
                              {project.tags && (
                                <div className="profile-project-tags" aria-label={`${project.title}关键标签`}>
                                  {project.tags.map((tag) => (
                                    <span key={tag}>{tag}</span>
                                  ))}
                                </div>
                              )}
                            </div>
                            <div className="profile-project-entry">
                              <span>{index === 0 ? "MAIN SHOWCASE" : "PROJECT ENTRY"}</span>
                              <button
                                className="profile-project-detail-button"
                                type="button"
                                disabled={resumeTransitionActive}
                                aria-label={`查看${project.title}详情`}
                                onClick={() => openProjectDetail(project.detailHref!)}
                              >
                                查看
                                <b aria-hidden="true">›</b>
                              </button>
                            </div>
                          </article>
                        );
                      })}
                    </div>
                  </section>
                </div>
              </div>

              <div className="profile-actions profile-archive-actions" aria-label="Candidate actions">
                {profileActions.map((action) => (
                  <button
                    className={`profile-action-button${action.href === "resume" && resumeTransitionActive ? " is-opening" : ""}`}
                    type="button"
                    key={action.label}
                    disabled={resumeTransitionActive}
                    onClick={() => {
                      if (action.href && action.downloadName) {
                        downloadFile(action.href, action.downloadName);
                        return;
                      }

                      if (action.phone) {
                        showContactPhone(action.phone);
                        return;
                      }

                      if (action.href) {
                        openResumeModule(action.href);
                      }
                    }}
                  >
                    <span className={`profile-action-icon action-${action.icon}`} aria-hidden="true" />
                    <span>{action.label}</span>
                    <b aria-hidden="true">›</b>
                  </button>
                ))}
              </div>
              <footer className="profile-version">CANDIDATE PORTAL v2.0.26</footer>
            </div>
          </section>
        )}

        {resumeTransitionActive && (
          <div className="resume-module-transition" role="status" aria-live="polite" aria-label="Opening resume module">
            <div className="resume-module-transition-card">
              <span>OPENING RESUME MODULE</span>
              <strong>详细简历模块</strong>
              <em>SYNCING CANDIDATE ARCHIVE...</em>
            </div>
          </div>
        )}
      </section>

    </main>
  );
}
