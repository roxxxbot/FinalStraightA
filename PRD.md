# 期末极限满绩 - 产品需求文档 v2.0

## 1. 概述与目标

**产品定位**：面向大学生的期末极限满绩复习计划制定工具

**核心价值**：通过智能算法和美观的界面体验，帮助大学生在有限时间内科学规划复习计划，实现高效备考

**目标用户**：期末考试前需要合理规划复习时间的大学生

## 2. 功能需求

### 2.1 数据持久化存储

**实现方案**：使用localStorage进行数据持久化

**存储内容**：
- 当前日期设置
- 考试列表（科目名、考试日期、考试时间）
- 科目配置（学分、难度、学习类型）
- 每日计划及完成状态
- 用户偏好设置

**数据同步**：
- 每次数据变更时自动保存到localStorage
- 页面加载时自动从localStorage读取数据
- 提供数据导出/导入功能（JSON格式）

### 2.2 日期选择器修复

**问题**：当前日期选择器无法正常选择当前日期

**解决方案**：
- 使用原生date input，设置min属性为今天
- 提供"今天"快捷按钮
- 改善日期显示格式（年月日中文显示）

### 2.3 外部文档导入

**支持格式**：
- PDF文件（考试时间表PDF）
- Word文档（.docx）
- Excel表格（.xlsx, .csv）
- 文本文件（.txt，格式：科目名,日期,时间）

**导入流程**：
1. 用户拖拽或点击上传文件
2. 系统解析文档内容
3. 智能识别考试科目、日期、时间
4. 展示预览界面供用户确认
5. 用户可编辑、补充或删除导入的数据

**技术方案**：
- PDF解析：pdf.js
- Word解析：mammoth.js
- Excel解析：SheetJS (xlsx)

### 2.4 智能预填

**功能说明**：
- 根据导入的文档自动填充考试信息
- 识别考试描述中的关键词（如考试类型、开卷/闭卷）
- 自动匹配已有科目或创建新科目

## 3. UI/UX设计规范

### 3.1 设计风格定位

**美学方向**：Valley Girl Clean Fit + 苹果毛玻璃效果

**关键词**：柔和、精致、现代、轻盈、梦幻

### 3.2 色彩系统

**主色调**：
- Primary: `#E8B4CB` (玫瑰粉)
- Secondary: `#C9B8E8` (薰衣草紫)
- Accent: `#98D4C4` (薄荷绿)
- Background: `#FAF8FC` (淡紫白)

**功能色**：
- 成功: `#98D4C4` (薄荷绿)
- 警告: `#F5D5A8` (杏色)
- 错误: `#E8A5A5` (珊瑚粉)

**文字色**：
- 主文字: `#4A4A5A` (深灰紫)
- 次要文字: `#9A9AAA` (中灰)
- 强调文字: `#7A6A9A` (深薰衣草)

### 3.3 毛玻璃效果

**毛玻璃卡片**：
```css
background: rgba(255, 255, 255, 0.7);
backdrop-filter: blur(20px);
-webkit-backdrop-filter: blur(20px);
border: 1px solid rgba(255, 255, 255, 0.3);
border-radius: 24px;
box-shadow: 0 8px 32px rgba(100, 80, 140, 0.1);
```

**毛玻璃导航栏**：
```css
background: rgba(255, 255, 255, 0.6);
backdrop-filter: blur(30px);
border-top: 1px solid rgba(255, 255, 255, 0.5);
```

### 3.4 渐变设计

**背景渐变**：
```css
background: linear-gradient(135deg, #FAF0FC 0%, #F0E8FA 50%, #E8F4F2 100%);
```

**按钮渐变**：
```css
background: linear-gradient(135deg, #E8B4CB 0%, #C9B8E8 100%);
```

**阴影**：
```css
box-shadow: 0 4px 24px rgba(200, 160, 200, 0.2);
```

### 3.5 圆角与间距

**圆角规范**：
- 大圆角：24px（卡片、弹窗）
- 中圆角：16px（按钮、输入框）
- 小圆角：12px（标签、徽章）

**间距系统**：
- xs: 4px
- sm: 8px
- md: 16px
- lg: 24px
- xl: 32px

### 3.6 字体系统

**标题字体**：`"Outfit", "Nunito", sans-serif`（圆润、现代）

**正文字体**：`"Inter", "Noto Sans SC", sans-serif`（清晰、可读）

**字号规范**：
- H1: 28px / 700
- H2: 24px / 600
- H3: 20px / 600
- Body: 16px / 400
- Small: 14px / 400
- Caption: 12px / 400

### 3.7 动画与动效

**页面切换**：淡入淡出 + 轻微上移（300ms ease-out）

**按钮交互**：
- Hover: 轻微放大1.02 + 阴影加深
- Active: 轻微缩小0.98
- Transition: 200ms cubic-bezier(0.4, 0, 0.2, 1)

**毛玻璃闪烁**：在深色背景上添加微妙的彩虹色偏光

**进度条**：弹性动画 + 流光效果

### 3.8 图标与emoji

**图标风格**：
- 使用emoji作为主要图标
- 柔和的圆角背景
- 半透明渐变背景

**图标背景**：
```css
background: linear-gradient(135deg, rgba(232, 180, 203, 0.3) 0%, rgba(201, 184, 232, 0.3) 100%);
border-radius: 12px;
padding: 12px;
```

### 3.9 特殊效果

**装饰元素**：
- 浮动气泡（bubbles）
- 柔和光晕（glow）
- 渐变边框（gradient borders）

**微光效果**：
```css
background: linear-gradient(135deg, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0.4) 100%);
```

## 4. 页面结构

### 4.1 首页 (Home)
- Hero区域（毛玻璃卡片）
- 统计数据展示（复习天数、考试科目、总学分）
- 快速入口按钮组
- 今日小贴士
- 今日计划预览

### 4.2 考试导入页 (Exam Import)
- 日期设置（今天快捷按钮）
- 文件上传区（拖拽上传）
- 考试列表（编辑/删除）
- 添加考试表单

### 4.3 科目配置页 (Course Config)
- 复习概览卡片
- 科目列表（可编辑）
- 添加科目表单
- 权重计算说明

### 4.4 计划页 (Schedule)
- 日期导航
- 复习进度条
- 时间轴任务列表
- 今日统计
- 导出按钮

### 4.5 建议页 (Advice)
- Tab切换（作息/饮食/锻炼/心态）
- 建议卡片列表
- 励志语录

## 5. 技术实现

### 5.1 技术栈
- 纯HTML/CSS/JavaScript（index-full.html）
- 无需构建工具，直接浏览器运行

### 5.2 第三方库
- PDF.js: PDF解析
- Mammoth.js: Word解析
- SheetJS: Excel解析

### 5.3 数据结构

```javascript
// 考试
{
  id: string,
  name: string,
  date: string (YYYY-MM-DD),
  time: string (HH:mm),
  description?: string
}

// 科目
{
  id: string,
  examId: string,
  name: string,
  credits: number (1-10),
  difficulty: 'easy' | 'medium' | 'hard',
  type: 'practice' | 'memorize',
  examDate: string
}

// 任务
{
  id: string,
  courseId: string,
  courseName: string,
  startTime: string,
  endTime: string,
  content: string,
  duration: number,
  completed: boolean
}

// 每日计划
{
  date: string,
  tasks: Task[]
}
```

## 6. 优先级

1. **P0**：localStorage持久化存储
2. **P0**：日期选择器修复
3. **P1**：文件导入功能（Excel优先）
4. **P1**：UI重构（毛玻璃效果）
5. **P2**：文档导入（PDF/Word）
6. **P2**：智能预填

## 7. 验收标准

- [ ] 数据能够持久保存，刷新页面不丢失
- [ ] 日期选择器可以正常选择当前及未来日期
- [ ] 可以拖拽上传Excel文件并解析
- [ ] UI呈现毛玻璃效果和valley girl美学
- [ ] 所有动画流畅，无明显卡顿
- [ ] 移动端适配良好
