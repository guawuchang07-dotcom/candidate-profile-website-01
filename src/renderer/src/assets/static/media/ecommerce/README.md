# 电商项目截图/视频素材

此文件夹用于存放"服装电商主图与宣传视频生成工作流"项目的证据素材。

## 建议素材类型

### 1. 工作流配置界面截图
- 文件名：`workflow-config.png`
- 内容：平台选择、服装类型、风格方向和生成参数配置界面
- 用途：展示工作流的可配置性和结构化输入

### 2. 批量主图生成结果
- 文件名：`batch-images.png` 或 `batch-images.jpg`
- 内容：同一商品方向生成的多张主图候选对比图
- 用途：展示批量生成能力和人工筛选环节

### 3. 图生视频延展
- 文件名：`video-generation.png` 或 `video-demo.mp4`
- 内容：基于选中主图生成的宣传视频素材预览
- 用途：展示从主图到视频的完整链路

### 4. AI 形象短视频展示
- 文件名：`ecommerce-avatar-transfer-01.mp4`
- 文件名：`ecommerce-avatar-transfer-02.mp4`
- 文件名：`ecommerce-avatar-transfer-03.mp4`
- 内容：基于真人动作参考，将动作、姿态和镜头节奏迁移到指定 AI 形象，用于服装电商虚拟模特/种草短视频展示
- 用途：作为“服装电商主图与宣传视频生成工作流”的延展模块，证明该项目不只覆盖主图和图生视频，也覆盖 AI 虚拟形象短视频生产链路

### 5. 降本提效对比（可选）
- 文件名：`cost-comparison.png`
- 内容：传统商拍 vs AI 生成的成本/时间对比图表
- 用途：强化 70% 降本、50% 提效的数据说服力

## 使用方式

将素材文件放入此文件夹后，在 `ResumePage.tsx` 中取消注释 `ecommerceScreenshots` 数组中的对应项，并确保文件名匹配。

例如：
```typescript
const ecommerceScreenshots: ImagePreview[] = [
  {
    title: "工作流配置界面",
    description: "平台选择、服装类型、风格方向和生成参数配置。",
    src: new URL("./assets/static/media/ecommerce/workflow-config.png", import.meta.url).href
  },
  // ... 其他截图
];
```

## 注意事项

- 图片格式建议：PNG（截图）、JPG（照片）
- 视频格式建议：MP4（H.264 编码，兼容性最好）
- 图片尺寸建议：宽度 1200-1920px，保持清晰度
- 视频时长建议：10-30 秒，展示核心流程即可
- 文件大小：单个图片 < 2MB，视频 < 10MB
