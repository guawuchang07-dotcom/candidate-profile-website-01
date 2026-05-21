from pathlib import Path
import shutil

from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER, TA_LEFT
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import mm
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.platypus import (
    BaseDocTemplate,
    Frame,
    HRFlowable,
    KeepTogether,
    ListFlowable,
    ListItem,
    PageTemplate,
    Paragraph,
    Spacer,
    Table,
    TableStyle,
)


ROOT = Path(__file__).resolve().parents[1]
PDF_PATH = ROOT / "src/renderer/src/assets/static/files/zhang-yuanbo-resume.pdf"
DOWNLOAD_PDF_PATH = Path("/Users/guawuchang/Library/Containers/com.tencent.qq/Data/Downloads/张远博简历_AI应用落地版.pdf")

FONT_REGULAR = "/System/Library/Fonts/Supplemental/Arial Unicode.ttf"
FONT_BOLD = "/System/Library/Fonts/STHeiti Medium.ttc"

PAGE_WIDTH, PAGE_HEIGHT = A4
MARGIN_X = 15 * mm
MARGIN_TOP = 12 * mm
MARGIN_BOTTOM = 12 * mm
ACCENT = colors.HexColor("#0F5F8F")
ACCENT_DARK = colors.HexColor("#17324D")
MUTED = colors.HexColor("#566575")
LIGHT_BG = colors.HexColor("#F2F7FB")
LINE = colors.HexColor("#D7E2EA")


def register_fonts() -> None:
    pdfmetrics.registerFont(TTFont("ResumeCN", FONT_REGULAR))
    pdfmetrics.registerFont(TTFont("ResumeCN-Bold", FONT_BOLD))


def make_styles() -> dict[str, ParagraphStyle]:
    base = getSampleStyleSheet()
    return {
        "name": ParagraphStyle(
            "name",
            parent=base["Title"],
            fontName="ResumeCN-Bold",
            fontSize=22,
            leading=26,
            textColor=ACCENT_DARK,
            alignment=TA_LEFT,
            spaceAfter=2,
        ),
        "role": ParagraphStyle(
            "role",
            parent=base["Normal"],
            fontName="ResumeCN-Bold",
            fontSize=10.6,
            leading=14,
            textColor=ACCENT,
            spaceAfter=4,
            wordWrap="CJK",
        ),
        "contact": ParagraphStyle(
            "contact",
            parent=base["Normal"],
            fontName="ResumeCN",
            fontSize=8.6,
            leading=11.4,
            textColor=MUTED,
            wordWrap="CJK",
        ),
        "section": ParagraphStyle(
            "section",
            parent=base["Heading2"],
            fontName="ResumeCN-Bold",
            fontSize=10.8,
            leading=13,
            textColor=ACCENT_DARK,
            spaceBefore=7,
            spaceAfter=4,
            wordWrap="CJK",
        ),
        "subhead": ParagraphStyle(
            "subhead",
            parent=base["Heading3"],
            fontName="ResumeCN-Bold",
            fontSize=9.2,
            leading=11.6,
            textColor=colors.HexColor("#1D2B3A"),
            spaceBefore=4,
            spaceAfter=1.5,
            wordWrap="CJK",
        ),
        "meta": ParagraphStyle(
            "meta",
            parent=base["Normal"],
            fontName="ResumeCN",
            fontSize=7.9,
            leading=10.4,
            textColor=ACCENT,
            spaceAfter=2,
            wordWrap="CJK",
        ),
        "body": ParagraphStyle(
            "body",
            parent=base["Normal"],
            fontName="ResumeCN",
            fontSize=8.15,
            leading=11.3,
            textColor=colors.HexColor("#22303E"),
            spaceAfter=2,
            wordWrap="CJK",
        ),
        "bullet": ParagraphStyle(
            "bullet",
            parent=base["Normal"],
            fontName="ResumeCN",
            fontSize=7.95,
            leading=10.8,
            textColor=colors.HexColor("#22303E"),
            leftIndent=0,
            bulletIndent=0,
            spaceAfter=1.4,
            wordWrap="CJK",
        ),
        "chip": ParagraphStyle(
            "chip",
            parent=base["Normal"],
            fontName="ResumeCN-Bold",
            fontSize=7.6,
            leading=10,
            textColor=ACCENT_DARK,
            alignment=TA_CENTER,
            wordWrap="CJK",
        ),
        "table_head": ParagraphStyle(
            "table_head",
            parent=base["Normal"],
            fontName="ResumeCN-Bold",
            fontSize=7.8,
            leading=10,
            textColor=colors.white,
            alignment=TA_CENTER,
            wordWrap="CJK",
        ),
        "table_body": ParagraphStyle(
            "table_body",
            parent=base["Normal"],
            fontName="ResumeCN",
            fontSize=7.25,
            leading=9.5,
            textColor=colors.HexColor("#22303E"),
            wordWrap="CJK",
        ),
        "small": ParagraphStyle(
            "small",
            parent=base["Normal"],
            fontName="ResumeCN",
            fontSize=7.2,
            leading=9.2,
            textColor=MUTED,
            wordWrap="CJK",
        ),
        "footer": ParagraphStyle(
            "footer",
            parent=base["Normal"],
            fontName="ResumeCN",
            fontSize=7,
            leading=8,
            textColor=colors.HexColor("#7A8794"),
            alignment=TA_CENTER,
        ),
    }


def p(text: str, style: ParagraphStyle) -> Paragraph:
    return Paragraph(text, style)


def bullets(items: list[str], style: ParagraphStyle) -> ListFlowable:
    return ListFlowable(
        [ListItem(p(item, style), leftIndent=8, bulletFontName="ResumeCN", bulletFontSize=6.5) for item in items],
        bulletType="bullet",
        start="circle",
        leftIndent=9,
        bulletOffsetY=1,
    )


def section(title: str, styles: dict[str, ParagraphStyle]) -> list:
    return [
        Spacer(1, 3),
        Paragraph(title, styles["section"]),
        HRFlowable(width="100%", thickness=0.7, color=LINE, spaceAfter=3),
    ]


def callout(text: str, styles: dict[str, ParagraphStyle]) -> Table:
    table = Table([[p(text, styles["body"])]], colWidths=[PAGE_WIDTH - 2 * MARGIN_X])
    table.setStyle(
        TableStyle(
            [
                ("BACKGROUND", (0, 0), (-1, -1), colors.HexColor("#F7FBFE")),
                ("BOX", (0, 0), (-1, -1), 0.6, colors.HexColor("#C8DCE9")),
                ("LEFTPADDING", (0, 0), (-1, -1), 8),
                ("RIGHTPADDING", (0, 0), (-1, -1), 8),
                ("TOPPADDING", (0, 0), (-1, -1), 6),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 6),
            ]
        )
    )
    return table


def chip_table(items: list[str], styles: dict[str, ParagraphStyle], cols: int = 4) -> Table:
    rows = []
    for i in range(0, len(items), cols):
        row = [p(item, styles["chip"]) for item in items[i : i + cols]]
        while len(row) < cols:
            row.append("")
        rows.append(row)
    table = Table(rows, colWidths=[(PAGE_WIDTH - 2 * MARGIN_X) / cols - 3] * cols, hAlign="LEFT")
    table.setStyle(
        TableStyle(
            [
                ("BACKGROUND", (0, 0), (-1, -1), colors.HexColor("#EFF6FA")),
                ("BOX", (0, 0), (-1, -1), 0.35, colors.HexColor("#CADCE8")),
                ("INNERGRID", (0, 0), (-1, -1), 0.35, colors.white),
                ("LEFTPADDING", (0, 0), (-1, -1), 5),
                ("RIGHTPADDING", (0, 0), (-1, -1), 5),
                ("TOPPADDING", (0, 0), (-1, -1), 4),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 4),
                ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
            ]
        )
    )
    return table


def migration_value_table(styles: dict[str, ParagraphStyle]) -> Table:
    rows = [
        ["能力方向", "已验证证据", "可迁移企业场景"],
        ["知识沉淀", "Hermes 每日复盘、Obsidian 关系图谱、项目经验沉淀样例", "员工日报、会议纪要、客户沟通记录、新人培训知识库"],
        ["流程自动化", "自媒体运营、岗位线索收藏、GitHub 项目情报脚本可演示", "销售线索筛选、招聘初筛、竞品监控、渠道信息收集"],
        ["内容生产流程化", "AIGC 控制台原型、120min 级 AI 漫剧交付经验", "教育短视频、电商素材、品牌内容、投放素材多版本测试"],
        ["协作工具接入", "飞书 CLI / 多维表格 / 企业 Agent 场景预研", "会议待办、日程安排、文档更新、表格沉淀前的人工确认流程"],
    ]
    flowable_rows = []
    for row_index, row in enumerate(rows):
        style = styles["table_head"] if row_index == 0 else styles["table_body"]
        flowable_rows.append([p(cell, style) for cell in row])

    table = Table(flowable_rows, colWidths=[28 * mm, 68 * mm, 73 * mm], hAlign="LEFT", repeatRows=1)
    table.setStyle(
        TableStyle(
            [
                ("BACKGROUND", (0, 0), (-1, 0), ACCENT_DARK),
                ("BACKGROUND", (0, 1), (-1, -1), colors.HexColor("#F7FBFE")),
                ("BOX", (0, 0), (-1, -1), 0.5, colors.HexColor("#C8DCE9")),
                ("INNERGRID", (0, 0), (-1, -1), 0.35, colors.HexColor("#D8E6EF")),
                ("LEFTPADDING", (0, 0), (-1, -1), 6),
                ("RIGHTPADDING", (0, 0), (-1, -1), 6),
                ("TOPPADDING", (0, 0), (-1, -1), 5),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 5),
                ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
            ]
        )
    )
    return table


def metric_table(styles: dict[str, ParagraphStyle]) -> Table:
    metrics = [
        ("AI 漫剧交付", "多部 120min 级项目"),
        ("知识沉淀", "Hermes + Obsidian 每日复盘"),
        ("业务自动化", "自媒体 / 岗位 / GitHub 脚本"),
        ("内容数据", "抖音 60万+ / YouTube 8万+"),
    ]
    cells = []
    for title, value in metrics:
        cells.append([p(f"<b>{title}</b>", styles["chip"]), p(value, styles["small"])])
    table = Table([cells], colWidths=[(PAGE_WIDTH - 2 * MARGIN_X) / 4] * 4)
    table.setStyle(
        TableStyle(
            [
                ("BACKGROUND", (0, 0), (-1, -1), colors.HexColor("#EEF6FB")),
                ("BOX", (0, 0), (-1, -1), 0.5, colors.HexColor("#C9DCE8")),
                ("INNERGRID", (0, 0), (-1, -1), 0.4, colors.HexColor("#DDE8F0")),
                ("LEFTPADDING", (0, 0), (-1, -1), 5),
                ("RIGHTPADDING", (0, 0), (-1, -1), 5),
                ("TOPPADDING", (0, 0), (-1, -1), 5),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 5),
                ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
            ]
        )
    )
    return table


def project_block(
    title: str,
    meta: str,
    items: list[str],
    styles: dict[str, ParagraphStyle],
) -> KeepTogether:
    return KeepTogether([p(title, styles["subhead"]), p(meta, styles["meta"]), bullets(items, styles["bullet"])])


def experience_block(
    company: str,
    role: str,
    date: str,
    items: list[str],
    styles: dict[str, ParagraphStyle],
) -> KeepTogether:
    return KeepTogether(
        [
            p(f"{company}｜{role}", styles["subhead"]),
            p(date, styles["meta"]),
            bullets(items, styles["bullet"]),
        ]
    )


def page_footer(canvas, doc) -> None:
    canvas.saveState()
    canvas.setStrokeColor(LINE)
    canvas.setLineWidth(0.4)
    canvas.line(MARGIN_X, 8.5 * mm, PAGE_WIDTH - MARGIN_X, 8.5 * mm)
    canvas.setFont("ResumeCN", 7)
    canvas.setFillColor(colors.HexColor("#7A8794"))
    canvas.drawCentredString(PAGE_WIDTH / 2, 5.3 * mm, f"张远博｜AI 应用落地 / 企业提效 / AIGC 工作流｜第 {doc.page} 页")
    canvas.restoreState()


def build_story(styles: dict[str, ParagraphStyle]) -> list:
    story = []
    story.extend(
        [
            p("张远博", styles["name"]),
            p("AI 应用落地 / 企业提效 / AIGC 工作流实践者", styles["role"]),
            p("25 岁｜杭州｜17564138094｜1425514532@qq.com｜可到岗：随时", styles["contact"]),
            p("个人网站：https://candidate-profile-website-01.pages.dev/｜GitHub：guawuchang07-dotcom/candidate-profile-website-01", styles["contact"]),
            Spacer(1, 4),
            metric_table(styles),
        ]
    )

    story.extend(section("求职定位", styles))
    story.append(
        callout(
            "目标方向：AI 应用落地、企业内部提效、AI Agent 工作流、AIGC 内容生产流程。"
            "我的优势不是单纯做工具展示，而是把真实重复业务拆成“场景识别 → 规则定义 → Agent / 脚本执行 → 人工确认 → 状态记录 → 复盘沉淀”的可演示工作流。",
            styles,
        )
    )

    story.extend(section("核心能力", styles))
    story.append(
        bullets(
            [
                "AIGC 内容生产落地：有 120min 级 AI 漫剧项目交付经验，熟悉剧本拆解、分镜、Prompt、生成、剪辑、QC 和版本复盘。",
                "企业提效原型验证：围绕知识沉淀、业务运营自动化、内容生产流程化搭建可演示 MVP，强调可记录、可复盘和人工确认边界。",
                "AI 工具协作能力：使用 Codex、Cursor、Hermes、Obsidian、浏览器自动化等工具，把个人重复流程转成可迁移的企业提效场景。",
                "内容运营与数据反馈：独立运营抖音、小红书、YouTube，具备选题测试、内容迭代和后台数据复盘经验。",
            ],
            styles["bullet"],
        )
    )

    story.extend(section("AI 落地项目 / MVP", styles))
    story.append(
        project_block(
            "企业知识沉淀 Agent 原型",
            "Hermes + Obsidian + Codex｜2026.05 - 至今｜状态：基础闭环已搭建，持续沉淀中",
            [
                "设计 Obsidian 中文目录结构，覆盖收件箱、对话提炼、个人画像、项目经验、复盘系统和 AI 学习。",
                "配置 Hermes 每日 23:00 整理本地会话，分类提炼闲聊、工作推进、项目经验、AI 学习和待办；不保存原始对话，只沉淀摘要与动作项。",
                "已形成关系图谱、每日复盘和项目经验沉淀样例，可迁移到员工日报、会议纪要、客户沟通记录和新人培训知识库。",
            ],
            styles,
        )
    )
    story.append(
        project_block(
            "业务运营自动化脚本集",
            "Browser Automation / Hermes / GitHub｜2026.05 - 至今｜状态：自媒体、岗位线索、项目情报三个场景可演示",
            [
                "自媒体运营辅助：把内容识别、互动条件判断、评论草稿生成和执行状态记录拆成可控流程，保留人工确认，不做无规则刷量。",
                "BOSS 岗位线索收藏：按关键词和方向筛选并收藏相关岗位，可迁移到销售线索、招聘线索、达人线索和竞品信息收集。",
                "GitHub 项目情报日报：定时整理值得关注的 AI 项目，输出项目用途、适用场景、试用价值和后续动作，沉淀到工具调研清单。",
            ],
            styles,
        )
    )
    story.append(
        project_block(
            "AIGC 内容生产工作流控制台",
            "Codex / Cursor / 本地控制台原型｜2026.05 - 至今｜状态：项目、资产、任务三段式流程已验证",
            [
                "把小说 / 剧本输入、人物场景资产、Prompt、参考图、生成任务、失败原因和候选版本管理串成可追踪流程。",
                "用 AI 协作开发快速搭建本地原型，支持项目创建、资产确认、任务执行和状态记录，降低生成过程中的返工和信息丢失。",
                "可迁移到教育短视频、品牌内容、电商素材、投放素材多版本测试等 AIGC 内容生产场景。",
            ],
            styles,
        )
    )
    story.append(
        project_block(
            "短视频账号内容运营与数据复盘",
            "抖音 / 小红书 / YouTube｜2024.05 - 至今｜状态：个人账号持续运营",
            [
                "持续测试选题、标题、封面、节奏和内容结构，后台数据可验证：抖音阶段播放 60 万+，YouTube 观看 8 万+，小红书近 30 日浏览 7 万+。",
                "把内容表现转化为下一轮选题和结构优化依据，积累跨平台内容判断、短视频节奏和平台反馈经验。",
            ],
            styles,
        )
    )
    story.extend(section("工作经历", styles))
    story.append(
        experience_block(
            "杭州尚同传媒有限公司",
            "AI 导演",
            "2025.12 - 2026.03",
            [
                "负责 AI 漫剧项目导演与统筹执行，参与脚本拆解、分镜设计、镜头语言规划、生成策略制定和成片 QC。",
                "围绕角色一致性、镜头稳定、场景衔接、字幕体系和剪辑节奏持续优化制作标准，降低返工并保障观感连续。",
                "参与多部 120min 级长篇 AI 漫剧交付，包括《诡异：给你烧个核动力马，你喊我爹？》《来吞：圣子归来》《系统说我大限将至，我反手立地成仙》。",
                "使用 Codex、Cursor 等工具优化重复性流程，并尝试 Agent 群聊协同进行任务分工与信息同步。",
            ],
            styles,
        )
    )
    story.append(
        experience_block(
            "杭州牧直科技有限公司",
            "AIGC 漫剧导演",
            "2025.10 - 2025.12",
            [
                "从 0 到 1 梳理 AI 漫剧内容生产流程，覆盖剧本拆解、分镜规范、素材生成、视频生成、剪辑包装和成片质检。",
                "制定角色 / 场景一致性、视频生成策略、剪辑节奏和 QC 标准，协调生图、视频生成、剪辑等岗位推进项目。",
                "推动《妻子改嫁后我成了一宗之主》AI 漫剧长篇项目交付，项目约 120 分钟、7 天完成，并以约 2 万元独家售出。",
            ],
            styles,
        )
    )
    story.append(
        experience_block(
            "杭州麦克羊科技有限公司",
            "剪辑",
            "2025.09 - 2025.10",
            [
                "负责运动器材类短视频剪辑与包装，覆盖产品卖点表达、镜头节奏、字幕信息和音效处理。",
                "单月完成 30 余条售后 / 宣传视频，多条内容用于产品推广与用户沟通场景。",
            ],
            styles,
        )
    )
    story.append(
        experience_block(
            "拾六传媒",
            "运营策划",
            "2024.04 - 2025.04",
            [
                "围绕品牌定位和传播目标完成宣传内容策划、文案输出和视频素材处理，累计参与 100+ 条内容制作。",
                "参与线下活动策划、现场执行和复盘，结合点击、互动、参与率等指标优化传播策略。",
            ],
            styles,
        )
    )

    story.extend(section("技能工具", styles))
    story.append(
        chip_table(
            [
                "Codex",
                "Cursor",
                "Hermes",
                "Obsidian",
                "飞书 CLI 预研",
                "Dify / Coze 原型",
                "浏览器自动化",
                "Markdown / Python",
                "即梦",
                "Seedance",
                "Vidu",
                "Sora",
                "剪映 / CapCut",
                "Prompt / 分镜",
                "成片 QC",
                "数据复盘",
            ],
            styles,
            cols=4,
        )
    )

    story.extend(section("企业迁移价值", styles))
    story.append(migration_value_table(styles))

    story.extend(section("教育经历 / 社团经历", styles))
    story.append(
        experience_block(
            "山东科技大学泰山科技学院",
            "本科｜土木工程",
            "2022 - 2024",
            [
                "担任音乐社社长，参与策划主题晚会、歌唱比赛等活动，负责前期准备、现场管理和后期总结。",
                "在活动组织、内容制作和社团管理中积累执行推进、团队协作、审美表达和沟通协调经验。",
            ],
            styles,
        )
    )

    story.extend(section("作品与可展示材料", styles))
    story.append(
        bullets(
            [
                "个人网站可展示：AI 工作流落地案例、业务自动化脚本演示、Obsidian 知识库截图、AIGC 控制台截图和代表视频作品。",
                "面试可讲重点：企业知识沉淀 Agent、业务运营自动化脚本集、AIGC 内容生产工作流控制台，以及后续 HR 招聘流程 Agent MVP 规划。",
            ],
            styles["bullet"],
        )
    )
    story.append(Spacer(1, 4))
    story.append(
        p(
            "说明：简历中的 AI Agent / 自动化项目按 MVP 和原型验证口径描述，未包装为成熟企业级系统；当前重点是验证业务流程拆解、自动化执行、人工确认和复盘沉淀能力。",
            styles["small"],
        )
    )
    return story


def build_pdf() -> None:
    register_fonts()
    styles = make_styles()

    frame = Frame(
        MARGIN_X,
        MARGIN_BOTTOM + 4 * mm,
        PAGE_WIDTH - 2 * MARGIN_X,
        PAGE_HEIGHT - MARGIN_TOP - MARGIN_BOTTOM - 4 * mm,
        id="normal",
    )
    doc = BaseDocTemplate(
        str(PDF_PATH),
        pagesize=A4,
        leftMargin=MARGIN_X,
        rightMargin=MARGIN_X,
        topMargin=MARGIN_TOP,
        bottomMargin=MARGIN_BOTTOM,
        title="张远博简历_AI应用落地版",
        author="张远博",
    )
    doc.addPageTemplates([PageTemplate(id="normal", frames=[frame], onPage=page_footer)])
    doc.build(build_story(styles))
    DOWNLOAD_PDF_PATH.parent.mkdir(parents=True, exist_ok=True)
    shutil.copyfile(PDF_PATH, DOWNLOAD_PDF_PATH)
    print(PDF_PATH)
    print(DOWNLOAD_PDF_PATH)


if __name__ == "__main__":
    build_pdf()
