import { defineConfig } from '@umijs/max';

export default defineConfig({
  npmClient: 'pnpm',
  title: 'yma16 - 前端开发工具集',
  favicons: ['/favicon.ico'],
  hash: true,
  // GitHub Pages 个人主页仓库
  base: '/',
  publicPath: '/',
  routes: [
    { path: '/', component: '@/pages/index', title: '首页' },
    { path: '/tools/code-formatter', component: '@/pages/tools/code-formatter', title: '代码格式化' },
    { path: '/tools/component-gen', component: '@/pages/tools/component-gen', title: '组件生成器' },
    { path: '/tools/perf-check', component: '@/pages/tools/perf-check', title: '性能检测' },
    { path: '/tools/svg-processor', component: '@/pages/tools/svg-processor', title: 'SVG处理' },
    { path: '/tools/file-diff', component: '@/pages/tools/file-diff', title: '文件对比' },
    { path: '/blog', component: '@/pages/blog', title: '技术博客' },
    { path: '/pricing', component: '@/pages/pricing', title: '合作' },
  ],
  theme: {
    'primary-color': '#1890ff',
    'border-radius-base': '8px',
  },
  // 启用静态导出，为每个路由生成 HTML 文件，解决 GitHub Pages 直接访问子路由 404 问题
  ssr: false,
  exportStatic: {},
});
