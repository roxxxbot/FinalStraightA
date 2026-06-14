# ✨ 期末极限满绩 - Final Straight A

> 🎯 一款面向大学生的期末极限满绩复习计划制定工具，帮助学生科学规划复习时间，轻松备考！

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Platform](https://img.shields.io/badge/platform-Web%20%7C%20Mini--Program-green.svg)](https://github.com)
[![Language](https://img.shields.io/badge/language-JavaScript-yellow.svg)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)

---

## 📸 项目预览

![首页预览](https://via.placeholder.com/800x400?text=首页+-+毛玻璃效果+Valley+Girl美学)
![计划页面](https://via.placeholder.com/800x400?text=时间轴计划+-+智能分配)
![配置页面](https://via.placeholder.com/800x400?text=科目配置+-+权重计算)

---

## 🌟 核心亮点

### 🧠 智能权重算法
基于多维度因素自动计算复习时间分配：

```
权重 = 学分 × 难度系数 × 类型系数 × 时间紧迫度

• 难度系数：简单(1.0) / 中等(1.2) / 困难(1.5)
• 类型系数：背诵型(1.3) / 刷题型(1.0)
• 时间紧迫度：临近考试优先级更高
```

### 📊 Excel智能解析
一键导入考试时间表，自动识别：
- ✅ 科目名称 + 考试日期 + 考试时间
- ✅ 学分信息（从科目名或单独列）
- ✅ 难度关键词：`难`、`困难`、`超级难`、`简单`、`容易`...
- ✅ 学习类型：`背诵`、`刷题`、`高数`、`马原`、`英语`...

### 💾 数据持久化
- 所有数据自动保存到浏览器 localStorage
- 刷新页面不丢失，无需登录注册
- 支持导出为HTML文件，可打印或转PDF

---

## 🚀 快速开始

### 方式一：直接使用（推荐）

无需安装任何依赖，直接打开浏览器即可使用：

1. 下载 `index-full.html` 文件
2. 用浏览器打开（Chrome / Edge / Safari）
3. 开始制定你的复习计划！

### 方式二：本地开发

```bash
# 克隆仓库
git clone https://github.com/你的用户名/FinalStraightA.git

# 进入目录
cd FinalStraightA

# 安装依赖（可选，用于UniApp版本）
npm install

# 运行H5版本
npm run dev:h5
```

---

## 📱 功能一览

| 功能 | 描述 |
|------|------|
| 📅 **考试导入** | 拖拽上传Excel，或手动添加考试科目 |
| ⚙️ **智能配置** | 自动识别学分/难度/类型，或手动调整 |
| 📋 **计划生成** | 一键生成每日复习时间轴 |
| ✅ **任务追踪** | 点击完成任务，实时显示进度 |
| 📄 **导出计划** | 导出为HTML，可打印或转PDF |
| 💡 **备考建议** | 作息/饮食/锻炼/心态全方位指导 |

---

## 🎯 使用流程

```
1. 设置当前日期 → 2. 导入考试时间表 → 3. 查看自动配置 → 4. 生成复习计划
      ↓                    ↓                   ↓                  ↓
   📅 选择日期        📊 拖拽Excel         ⚙️ 调整权重         📋 查看时间轴
```

---

## 💡 适用场景

- 🎓 **期末冲刺**：多门考试时间紧迫，需要合理分配时间
- 📚 **考研备考**：长期复习规划，科目权重不同
- 🏆 **追求满绩**：高学分科目需要更多投入
- 🌟 **高效学习**：科学规划，避免盲目复习

---

## 🛠️ 技术栈

| 技术 | 用途 |
|------|------|
| **HTML/CSS/JS** | 纯前端实现，无需后端 |
| **SheetJS** | Excel文件解析 |
| **localStorage** | 数据持久化存储 |
| **CSS Variables** | 主题配色系统 |
| **backdrop-filter** | 毛玻璃视觉效果 |

---

## 📁 项目结构

```
FinalStraightA/
├── index-full.html      # ⭐ 纯HTML完整版（推荐使用）
├── src/                 # UniApp源码（可选）
│   ├── pages/           # 页面组件
│   ├── stores/          # 状态管理
│   └── utils/           # 工具函数
├── README.md            # 项目文档
└── PRD.md               # 产品需求文档
```

---

## 🤝 贡献指南

欢迎提交 Issue 和 Pull Request！

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 提交 Pull Request

---

## 📝 开发计划

- [ ] 支持PDF文件导入
- [ ] 支持Word文档导入
- [ ] 添加番茄钟计时功能
- [ ] 支持多设备同步（云端存储）
- [ ] 添加学习数据统计图表
- [ ] 支持自定义时间段

---

## 📄 许可证

本项目采用 [MIT License](LICENSE) 开源协议。

---

## 💬 联系方式

- **GitHub Issues**: 欢迎提交问题和建议
- **小红书**: 搜索「猫猫狂信徒」查看使用教程
- **Gmail**: 也可以发邮件给 rocx0711@gmail.com 联系我做更深讨论

---

## 🙏 致谢

感谢所有为这个项目做出贡献的人！

**祝所有考生都能取得理想的成绩！💪✨**

---

> ⭐ 如果这个项目对你有帮助，请给一个 Star 支持一下！
> 
> 📢 欢迎分享给你的同学朋友，一起高效备考！
