# yma16 前端工具集

**技术栈:** React 18 + TS + Umi 4 + Ant Design 5 | **部署:** GitHub Pages + Nginx

## 项目结构
```
src/
├── layouts/index.tsx      # 全局布局 (导航 + 页脚 + 主题切换)
├── pages/
│   ├── index.tsx          # 首页 (工具数量自动统计: tools.length+)
│   ├── blog.tsx           # 技术博客
│   ├── pricing.tsx        # 合作
│   └── tools/             # 12个工具 (添加新工具只需在数组中添加)
│       ├── code-formatter, component-gen, perf-check, svg-processor
│       ├── file-diff, url-tools, color-picker, image-cropper
│       ├── base64-tool, timestamp-tool, regex-tester, hash-tool
├── components/
│   ├── SEO.tsx            # 动态 SEO (Helmet)
│   └── SiteIcon.tsx       # Y 图标 (支持暗黑/亮色)
├── contexts/
│   └── ThemeContext.tsx   # 主题上下文 (light/dark/auto)
└── config/
    ├── contact.ts         # 联系信息
    └── beian.ts           # 备案配置 (showBeian: false)
```

## 关键配置

### .umirc.ts
- `exportStatic: {}` - 静态导出，解决子路由 404
- `publicPath: './'` - 相对路径，兼容双部署
- `favicons: ['/favicon.svg']` - 站点图标

### Nginx (/etc/nginx/sites-enabled/yma16.cloud)
```nginx
server {
    listen 80;
    root /var/www/yma16.cloud;
    try_files $uri $uri/ /index.html;  # SPA 回退
}
```

## 部署
```bash
pnpm run build
sudo cp -r dist/* /var/www/yma16.cloud/
sudo systemctl reload nginx
git push origin main:master  # 触发 GitHub Actions
```

## 添加新工具步骤
1. 创建 `src/pages/tools/xxx.tsx`
2. 在 `.umirc.ts` routes 中添加路由
3. 在 `src/layouts/index.tsx` 菜单中添加
4. 在 `src/pages/index.tsx` tools 数组中添加 (数量自动统计)
5. 更新 `public/sitemap.xml`

## 备案配置
修改 `src/config/beian.ts`:
```typescript
beianNumber: '京ICP备xxx号',
showBeian: true
```

*更新: 2026-08-30 | 工具数: 12+*