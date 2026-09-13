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
    { path: '/', component: '@/pages/index', title: 'yma16 - 前端开发工具集 | 免费在线工具' },
    { path: '/tools/code-formatter', component: '@/pages/tools/code-formatter', title: '代码格式化工具 | yma16前端工具集', meta: { description: '免费的在线代码格式化工具，支持 TypeScript、JavaScript、Vue、React、JSON、HTML、CSS 代码格式化，基于 Prettier 规则一键美化代码。全部运算在浏览器本地完成，不上传服务器，保护代码隐私。' } },
    { path: '/tools/component-gen', component: '@/pages/tools/component-gen', title: '组件生成器 | yma16前端工具集', meta: { description: '免费的在线组件生成器，支持 React 和 Vue 框架，一键生成 TypeScript/JavaScript 组件代码模板。纯前端生成，不上传服务器。' } },
    { path: '/tools/perf-check', component: '@/pages/tools/perf-check', title: '性能检测工具 | yma16前端工具集', meta: { description: '免费的在线网页性能检测工具，生成 Lighthouse 报告，分析网页加载速度、可访问性、SEO 和最佳实践。纯前端检测，不上传服务器。' } },
    { path: '/tools/svg-processor', component: '@/pages/tools/svg-processor', title: 'SVG压缩处理工具 | yma16前端工具集', meta: { description: '免费的在线 SVG 处理工具，支持 SVG 压缩、批量转换、颜色替换、预览和下载。纯前端处理，不上传服务器。' } },
    { path: '/tools/file-diff', component: '@/pages/tools/file-diff', title: '代码对比工具 | yma16前端工具集', meta: { description: '免费的在线代码对比工具，支持文本和代码差异比较，高亮显示增删改内容。纯前端计算，不上传服务器，保护代码隐私。' } },
    { path: '/tools/url-tools', component: '@/pages/tools/url-tools', title: 'URL编解码工具 | yma16前端工具集', meta: { description: '免费的在线 URL 编解码工具，支持 URL 编码解码、查询参数解析、Hash 路由参数识别。纯前端处理，不上传服务器。' } },
    { path: '/tools/color-picker', component: '@/pages/tools/color-picker', title: '颜色选择器 | yma16前端工具集', meta: { description: '免费的在线颜色选择器工具，支持拾色器取色、HEX/RGB/RGBA/HSL 互相转换、颜色预览和一键复制色值。纯前端运行，不上传服务器。' } },
    { path: '/tools/image-cropper', component: '@/pages/tools/image-cropper', title: '图片裁剪工具 | yma16前端工具集', meta: { description: '免费的在线图片裁剪工具，纯前端 Canvas 实现，支持调整裁剪框、旋转图片、导出下载。不上传服务器保护隐私。' } },
    { path: '/tools/base64-tool', component: '@/pages/tools/base64-tool', title: 'Base64编解码工具 | yma16前端工具集', meta: { description: '免费的在线 Base64 编解码工具，支持文本 Base64 编码解码、图片转 Base64、Base64 还原预览和下载。纯前端处理，不上传服务器。' } },
    { path: '/tools/timestamp-tool', component: '@/pages/tools/timestamp-tool', title: '时间戳转换工具 | yma16前端工具集', meta: { description: '免费的在线时间戳转换工具，支持时间戳与格式化日期互相转换，支持秒/毫秒时间戳，多种日期格式选择。纯前端运行。' } },
    { path: '/tools/regex-tester', component: '@/pages/tools/regex-tester', title: '正则表达式测试工具 | yma16前端工具集', meta: { description: '免费的在线正则表达式测试工具，支持实时匹配、高亮显示、分组捕获、多种修饰符。纯前端运行，不上传服务器。' } },
    { path: '/tools/hash-tool', component: '@/pages/tools/hash-tool', title: 'MD5/SHA1/SHA256哈希计算 | yma16前端工具集', meta: { description: '免费的在线哈希计算工具，支持 MD5、SHA1、SHA256 哈希算法。纯前端计算保护隐私，不上传服务器。' } },
    { path: '/tools/json-to-ts', component: '@/pages/tools/json-to-ts', title: 'JSON转TypeScript类型工具 | yma16前端工具集', meta: { description: '免费的 JSON 转 TypeScript Interface 类型生成器，自动推断类型，支持嵌套对象和数组。纯前端处理，不上传服务器。' } },
    { path: '/tools/mock-gen', component: '@/pages/tools/mock-gen', title: 'Mock数据生成器 | yma16前端工具集', meta: { description: 'Mock模拟JSON数据生成器，支持常用数据类型，快速生成测试数据。纯前端运行，不上传服务器。' } },
    { path: '/tools/css-formatter', component: '@/pages/tools/css-formatter', title: 'CSS格式化压缩工具 | yma16前端工具集', meta: { description: 'CSS代码格式化、压缩、美化工具，支持一键整理和压缩CSS代码。纯前端处理，不上传服务器。' } },
    { path: '/tools/string-escape', component: '@/pages/tools/string-escape', title: '字符串Escape转义工具 | yma16前端工具集', meta: { description: 'HTML/JS字符串Escape转义反转义工具，支持多种转义格式。纯前端处理，不上传服务器。' } },
    { path: '/tools/radix-convert', component: '@/pages/tools/radix-convert', title: '进制转换工具 | yma16前端工具集', meta: { description: '2/8/10/16进制互相转换器，支持二进制、八进制、十进制、十六进制转换。纯前端运行。' } },
    { path: '/tools/naming-convert', component: '@/pages/tools/naming-convert', title: '命名风格转换器 | yma16前端工具集', meta: { description: '驼峰、下划线、短横线等命名风格互转工具，支持批量转换。纯前端运行。' } },
    { path: '/tools/image-convert', component: '@/pages/tools/image-convert', title: '图片格式转换工具 | yma16前端工具集', meta: { description: 'PNG/JPG/WebP图片格式转换，支持调节质量下载。纯前端处理，不上传服务器。' } },
    { path: '/tools/jwt-parser', component: '@/pages/tools/jwt-parser', title: 'JWT解析工具 | yma16前端工具集', meta: { description: 'JWT Token在线解析工具，解析Header、Payload、Signature，验证Token有效性。纯前端处理。' } },
    { path: '/tools/cookie-parser', component: '@/pages/tools/cookie-parser', title: 'Cookie解析工具 | yma16前端工具集', meta: { description: 'Cookie字符串解析工具，解析Cookie名称、值、过期时间、安全属性等。纯前端处理。' } },
    { path: '/tools/qrcode-tool', component: '@/pages/tools/qrcode-tool', title: '二维码生成解析工具 | yma16前端工具集', meta: { description: '二维码生成和解析工具，支持自定义颜色、大小，上传图片解析二维码内容。纯前端处理。' } },
    { path: '/tools/regex-lib', component: '@/pages/tools/regex-lib', title: '正则常用模板库 | yma16前端工具集', meta: { description: '常用正则表达式模板库，包含手机号、邮箱、身份证、URL等常用正则模板，一键复制使用。' } },
    { path: '/tools/random-string', component: '@/pages/tools/random-string', title: '随机字符串生成器 | yma16前端工具集', meta: { description: '随机字符串生成器，支持自定义字符集、长度、生成数量，可用于密码、密钥、验证码生成。纯前端运行。' } },
    { path: '/tools/unit-convert', component: '@/pages/tools/unit-convert', title: 'CSS单位换算器 | yma16前端工具集', meta: { description: 'CSS px/rem/em/vw/vh单位换算器，支持互相转换，前端开发常用工具。纯前端运行。' } },
    { path: '/tools/ai-debug', component: '@/pages/tools/ai-debug', title: 'AI调试流式输出测试 | yma16前端工具集', meta: { description: 'AI调试流式输出测试工具，支持Mock模拟SSE流式和真实API请求调试。纯前端运行。' } },
    { path: '/tools/perf-monitor', component: '@/pages/tools/perf-monitor', title: '前端性能监控工具 | yma16前端工具集', meta: { description: '前端可视化电脑性能监控工具，实时显示FPS、内存、DOM节点数，支持浏览器压力测试。纯前端运行。' } },
    { path: '/tools/curl-convert', component: '@/pages/tools/curl-convert', title: 'cURL转Axios/Fetch代码工具 | yma16前端工具集', meta: { description: '将 cURL 命令一键转换为 Axios、Fetch、Python requests、Node.js 代码。纯前端转换，不上传服务器，保护 API 隐私。' } },
    { path: '/tools/eslint-config', component: '@/pages/tools/eslint-config', title: 'ESLint配置生成器 | yma16前端工具集', meta: { description: '可视化生成 ESLint 配置文件，支持 TypeScript、React、Vue、Prettier 等多种规则集组合。纯前端生成，不上传服务器。' } },
    { path: '/tools/playground', component: '@/pages/tools/playground', title: 'HTML/CSS/JS在线代码编辑器 | yma16前端工具集', meta: { description: '免费的在线 HTML/CSS/JS 代码编辑器和实时预览工具，支持控制台输出、Vue3/Tailwind 预设模板、代码导出和本地草稿保存。纯前端运行。' } },
    { path: '/blog', component: '@/pages/blog', title: '技术博客 | yma16前端工具集', meta: { description: 'yma16 技术博客，分享前端开发经验、工具使用教程和最佳实践。' } },
    { path: '/pricing', component: '@/pages/pricing', title: '合作与服务 | yma16前端工具集', meta: { description: 'yma16 前端开发工具集合作与服务方案，提供定制开发、技术咨询和培训服务。' } },
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
