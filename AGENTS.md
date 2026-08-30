# AGENTS.md - yma16 前端开发工具集

## 项目概述

**项目名称:** yma16 前端开发工具集  
**技术栈:** React 18 + TypeScript + Umi 4 + Ant Design 5  
**部署环境:** GitHub Pages + Nginx (双部署)  
**仓库地址:** https://github.com/yongma16/yongma16.github.io

## 项目结构

```
react_home/
├── .umirc.ts              # Umi 配置文件
├── package.json           # 依赖管理
├── src/
│   ├── layouts/
│   │   └── index.tsx      # 全局布局组件 (导航栏 + 页脚)
│   ├── pages/
│   │   ├── index.tsx      # 首页 (工具展示 + 功能特性)
│   │   ├── blog.tsx       # 技术博客页面
│   │   ├── pricing.tsx    # 合作/定价页面
│   │   └── tools/
│   │       ├── code-formatter.tsx   # 代码格式化工具
│   │       ├── component-gen.tsx    # 组件生成器
│   │       ├── perf-check.tsx       # 性能检测工具
│   │       ├── svg-processor.tsx    # SVG 批量处理工具
│   │       └── file-diff.tsx        # 文件对比工具
│   └── config/
│       └── contact.ts     # 联系信息配置
├── dist/                  # 构建输出目录
└── .github/
    └── workflows/
        └── deploy.yml     # GitHub Actions 部署配置
```

## 核心配置

### Umi 配置 (.umirc.ts)

```typescript
// 关键配置项
{
  base: '/',
  publicPath: process.env.NODE_ENV === 'production' ? './' : '/',
  hash: true,
  ssr: false,
  exportStatic: {},           // 静态导出，为每个路由生成 HTML
  runtimePublicPath: {},      // 动态资源路径，兼容 Nginx 子目录部署
}
```

**配置说明:**
- `exportStatic`: 为每个路由生成独立 HTML 文件，解决直接访问子路由 404 问题
- `publicPath: './'`: 使用相对路径，兼容 Nginx 和 GitHub Pages 双部署
- `runtimePublicPath`: 配合相对路径，动态设置资源路径

### Nginx 配置

```nginx
server {
    listen 80;
    server_name yma16.cloud www.yma16.cloud;
    root /var/www/yma16.cloud;
    index index.html;
    
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    # 子路由支持
    location ~ ^/(tools|blog|pricing)/ {
        try_files $uri $uri/ /index.html;
    }
}
```

## 页面路由

| 路径 | 页面 | 状态 |
|------|------|------|
| `/` | 首页 | ✅ 正常 |
| `/tools/code-formatter` | 代码格式化 | ✅ 正常 |
| `/tools/component-gen` | 组件生成器 | ✅ 正常 |
| `/tools/perf-check` | 性能检测 | ✅ 正常 |
| `/tools/svg-processor` | SVG 处理 | ✅ 已修复 (2026-08-30) |
| `/tools/file-diff` | 文件对比 | ✅ 正常 |
| `/blog` | 技术博客 | ✅ 正常 |
| `/pricing` | 合作 | ✅ 正常 |

## 已知问题与修复记录

### 2026-08-30: SVG 处理器组件修复

**问题:** `ReferenceError: Statistic is not defined`
- 文件: `src/pages/tools/svg-processor.tsx`
- 原因: `Statistic` 组件未从 `antd` 导入
- 修复: 在 import 语句中添加 `Statistic`

```typescript
// 修复前
import { Card, Upload, Button, ... } from 'antd';

// 修复后
import { Card, Upload, Button, ..., Statistic } from 'antd';
```

### 2026-08-30: 路由工具无法打开 (404 问题)

**问题:** GitHub Pages 直接访问 `/tools/*` 子路由返回 404
- 原因: GitHub Pages 是静态服务器，不支持 SPA history 路由回退
- 修复: 启用 `exportStatic` 静态导出，为每个路由生成独立 HTML 文件

### 2026-08-30: Nginx 部署资源路径问题

**问题:** Nginx 部署时子路由 JS 资源 404
- 原因: `publicPath` 使用绝对路径 `/`，子路由请求资源路径错误
- 修复: 改为相对路径 `./`，配合 `runtimePublicPath` 动态设置

## 部署流程

### GitHub Pages 部署
1. 代码推送到 `main` 分支
2. GitHub Actions 自动触发 (`.github/workflows/deploy.yml`)
3. 构建项目并部署到 `gh-pages` 分支
4. 访问: `https://yongma16.github.io`

### Nginx 部署
1. 本地构建: `pnpm run build`
2. 复制 dist 到服务器: `cp -r dist/* /var/www/yma16.cloud/`
3. 重载 Nginx: `sudo systemctl reload nginx`
4. 访问: `http://122.51.155.138`

## 开发命令

```bash
# 安装依赖
pnpm install

# 开发模式
pnpm run dev          # http://localhost:8000

# 生产构建
pnpm run build        # 输出到 dist/ 目录

# 构建并部署到 Nginx
pnpm run build && sudo cp -r dist/* /var/www/yma16.cloud/ && sudo systemctl reload nginx
```

## 技术依赖

| 依赖 | 版本 | 用途 |
|------|------|------|
| React | 18.2.0 | UI 框架 |
| TypeScript | 5.3.0 | 类型系统 |
| Umi | 4.1.0 | 应用框架 |
| Ant Design | 5.14.0 | UI 组件库 |
| @monaco-editor/react | 4.6.0 | 代码编辑器 |

## 联系方式

- **CSDN 博客:** https://blog.csdn.net/weixin_43606158
- **GitHub:** https://github.com/yongma16
- **邮箱:** (待补充)

---

*最后更新: 2026-08-30*  
*更新内容: 修复 SVG 处理器组件 Statistic 导入问题*
