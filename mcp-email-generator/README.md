# MCP Email Generator v2.0

一个基于 Model Context Protocol (MCP) 的邮件内容生成服务，**支持纯文本和 HTML 两种格式输出**。

## ✨ 新特性 v2.0

- 🎨 **HTML 邮件支持** - 生成精美的 HTML 格式邮件
- 📦 **6 种预设模板** - default、newsletter、announcement、invitation、notification、marketing
- 🌐 **中英文双语** - 支持 zh/en 语言切换
- 🎯 **灵活输出** - text、html、both 三种输出格式

## 功能特性

| 工具 | 功能 | HTML 支持 |
|------|------|----------|
| **generate_email** | 根据主题生成邮件 | ✅ 6种模板 |
| **generate_reply_email** | 生成回复邮件 | ✅ |
| **polish_email** | 润色优化邮件 | ✅ |
| **generate_html_email** | 生成完整HTML邮件（新） | ✅ 自定义样式 |

## 安装

```bash
cd mcp-email-generator
npm install
npm run build
```

## 配置 MCP 客户端

```json
{
  "mcpServers": {
    "email-generator": {
      "command": "node",
      "args": ["/path/to/mcp-email-generator/dist/index.js"]
    }
  }
}
```

## 使用示例

### 1. 生成 HTML 邮件

```json
{
  "name": "generate_email",
  "arguments": {
    "topic": "项目进度汇报",
    "points": ["完成用户模块", "下周做订单模块", "需要协调资源"],
    "tone": "formal",
    "recipient": "李总",
    "sender": "项目组",
    "language": "zh",
    "format": "html",
    "template": "newsletter"
  }
}
```

### 2. 同时生成文本和 HTML

```json
{
  "name": "generate_email",
  "arguments": {
    "topic": "年会邀请",
    "points": ["时间：2026年1月20日", "地点：北京国际酒店"],
    "format": "both",
    "template": "invitation"
  }
}
```

### 3. 生成完整 HTML 邮件（带 CTA 按钮）

```json
{
  "name": "generate_html_email",
  "arguments": {
    "title": "产品更新通知",
    "headline": "全新功能上线！",
    "content": "我们很高兴地宣布...",
    "cta_text": "立即体验",
    "cta_link": "https://example.com",
    "sender_name": "AI团队",
    "primary_color": "#8b5cf6"
  }
}
```

## 参数说明

### generate_email

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| topic | string | ✅ | 邮件主题 |
| points | string[] | ✅ | 邮件要点 |
| tone | string | | formal/semi-formal/casual |
| recipient | string | | 收件人称呼 |
| sender | string | | 发件人姓名 |
| language | string | | zh/en |
| **format** | string | | **text/html/both** |
| **template** | string | | **default/newsletter/announcement/invitation/notification/marketing** |

### generate_html_email

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| title | string | ✅ | 邮件标题 |
| headline | string | | 头图文案 |
| content | string | ✅ | 主要内容 |
| cta_text | string | | 按钮文案 |
| cta_link | string | | 按钮链接 |
| template | string | | 模板样式 |
| sender_name | string | | 发件人/公司名 |
| sender_logo | string | | Logo URL |
| primary_color | string | | 主色调（十六进制） |

## HTML 模板预览

### 📰 newsletter - 新闻通讯
渐变背景，编号列表，适合周报、新闻

### 📢 announcement - 公告
黄色警告风格，适合通知、提醒

### 🎉 invitation - 邀请函
紫色渐变，居中设计，适合活动邀请

### 📋 notification - 通知
简洁左侧边框，适合系统通知

### 💼 marketing - 营销
多彩渐变，CTA按钮，适合营销邮件

## 开发

```bash
npm run dev    # 开发模式
npm run build  # 构建
npm start      # 运行
```

## 许可证

MIT
