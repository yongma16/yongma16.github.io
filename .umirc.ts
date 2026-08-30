import { defineConfig } from '@umijs/max';

export default defineConfig({
  npmClient: 'pnpm',
  title: 'yma16 - 前端开发工具集 | 免费在线工具',
  favicons: ['/favicon.ico'],
  metas: [
    { name: 'description', content: 'yma16 前端开发工具集提供代码格式化、组件生成器、性能检测、SVG处理、URL编解码等免费在线工具，提升前端开发效率。' },
    { name: 'keywords', content: '前端工具,代码格式化,组件生成器,性能检测,SVG处理,URL编解码,在线工具,前端开发' },
    { name: 'author', content: 'yma16' },
    { name: 'robots', content: 'index, follow' },
    { property: 'og:type', content: 'website' },
    { property: 'og:title', content: 'yma16 - 前端开发工具集 | 免费在线工具' },
    { property: 'og:description', content: 'yma16 前端开发工具集提供代码格式化、组件生成器、性能检测、SVG处理、URL编解码等免费在线工具，提升前端开发效率。' },
    { property: 'og:image', content: 'https://yma16.cloud/og-image.png' },
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: 'yma16 - 前端开发工具集 | 免费在线工具' },
    { name: 'twitter:description', content: 'yma16 前端开发工具集提供代码格式化、组件生成器、性能检测、SVG处理、URL编解码等免费在线工具，提升前端开发效率。' },
    { name: 'twitter:image', content: 'https://yma16.cloud/og-image.png' },
  ],
  links: [
    { rel: 'manifest', href: '/manifest.json' },
    { rel: 'sitemap', href: '/sitemap.xml', type: 'application/xml' },
  ],
  hash: true,
  // GitHub Pages 个人主页仓库
  base: '/',
  publicPath: process.env.NODE_ENV === 'production' ? './' : '/',
  routes: [
    { path: '/', component: '@/pages/index', title: '首页' },
    { path: '/tools/code-formatter', component: '@/pages/tools/code-formatter', title: '代码格式化' },
    { path: '/tools/component-gen', component: '@/pages/tools/component-gen', title: '组件生成器' },
    { path: '/tools/perf-check', component: '@/pages/tools/perf-check', title: '性能检测' },
    { path: '/tools/svg-processor', component: '@/pages/tools/svg-processor', title: 'SVG处理' },
    { path: '/tools/file-diff', component: '@/pages/tools/file-diff', title: '文件对比' },
    { path: '/tools/url-tools', component: '@/pages/tools/url-tools', title: 'URL工具' },
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
  // 配合相对路径 publicPath 使用，动态设置资源路径
  runtimePublicPath: {},
});
