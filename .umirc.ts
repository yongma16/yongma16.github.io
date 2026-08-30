import { defineConfig } from '@umijs/max';

export default defineConfig({
  npmClient: 'pnpm',
  title: 'yma16 - 前端开发工具集 | 免费在线工具',
  favicons: ['/favicon.svg'],
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
    { path: '/tools/color-picker', component: '@/pages/tools/color-picker', title: '颜色选择器' },
    { path: '/tools/image-cropper', component: '@/pages/tools/image-cropper', title: '图片裁剪' },
    { path: '/tools/base64-tool', component: '@/pages/tools/base64-tool', title: 'Base64工具' },
    { path: '/tools/timestamp-tool', component: '@/pages/tools/timestamp-tool', title: '时间戳转换' },
    { path: '/tools/regex-tester', component: '@/pages/tools/regex-tester', title: '正则测试' },
    { path: '/tools/hash-tool', component: '@/pages/tools/hash-tool', title: '哈希工具' },
    { path: '/tools/json-to-ts', component: '@/pages/tools/json-to-ts', title: 'JSON转TS' },
    { path: '/tools/mock-gen', component: '@/pages/tools/mock-gen', title: 'Mock生成' },
    { path: '/tools/css-formatter', component: '@/pages/tools/css-formatter', title: 'CSS格式化' },
    { path: '/tools/string-escape', component: '@/pages/tools/string-escape', title: '字符串转义' },
    { path: '/tools/radix-convert', component: '@/pages/tools/radix-convert', title: '进制转换' },
    { path: '/tools/naming-convert', component: '@/pages/tools/naming-convert', title: '命名转换' },
    { path: '/tools/image-convert', component: '@/pages/tools/image-convert', title: '图片转换' },
    { path: '/tools/jwt-parser', component: '@/pages/tools/jwt-parser', title: 'JWT解析' },
    { path: '/tools/cookie-parser', component: '@/pages/tools/cookie-parser', title: 'Cookie解析' },
    { path: '/tools/qrcode-tool', component: '@/pages/tools/qrcode-tool', title: '二维码工具' },
    { path: '/tools/regex-lib', component: '@/pages/tools/regex-lib', title: '正则模板' },
    { path: '/tools/random-string', component: '@/pages/tools/random-string', title: '随机字符串' },
    { path: '/tools/unit-convert', component: '@/pages/tools/unit-convert', title: '单位换算' },
    { path: '/tools/ai-debug', component: '@/pages/tools/ai-debug', title: 'AI调试' },
    { path: '/tools/perf-monitor', component: '@/pages/tools/perf-monitor', title: '性能监控' },
    { path: '/blog', component: '@/pages/blog', title: '技术博客' },
    { path: '/pricing', component: '@/pages/pricing', title: '合作' },
  ],
  theme: {
    'primary-color': '#1890ff',
    'border-radius-base': '8px',
  },
  // 全局样式
  styles: [
    `body {
      margin: 0;
      padding: 0;
      transition: background-color 0.3s ease, color 0.3s ease;
    }`,
  ],
  // 启用静态导出，为每个路由生成 HTML 文件，解决 GitHub Pages 直接访问子路由 404 问题
  ssr: false,
  exportStatic: {},
  // 配合相对路径 publicPath 使用，动态设置资源路径
  runtimePublicPath: {},
});
