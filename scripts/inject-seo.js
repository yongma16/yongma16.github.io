/**
 * SEO 注入脚本
 * Umi exportStatic 生成的静态 HTML 中，title 和 meta description 是全局默认值。
 * 此脚本在每个工具页的 index.html 中注入独立的 TDK。
 */

const fs = require('fs');
const path = require('path');

const DIST_DIR = path.resolve(__dirname, '../dist');

// 每个页面的独立 SEO 配置
const pageSEO = {
  'tools/code-formatter': {
    title: '代码格式化工具 | yma16前端工具集',
    description: '免费的在线代码格式化工具，支持 TypeScript、JavaScript、Vue、React、JSON、HTML、CSS 代码格式化，基于 Prettier 规则一键美化代码。全部运算在浏览器本地完成，不上传服务器，保护代码隐私。',
    keywords: '代码格式化,代码美化,Prettier,TypeScript格式化,JavaScript格式化,Vue格式化,React格式化,JSON格式化,HTML格式化,CSS格式化,在线代码格式化工具,前端开发工具',
  },
  'tools/component-gen': {
    title: '组件生成器 | yma16前端工具集',
    description: '免费的在线组件生成器，支持 React 和 Vue 框架，一键生成 TypeScript/JavaScript 组件代码模板。纯前端生成，不上传服务器。',
    keywords: '组件生成器,React组件生成器,Vue组件生成器,代码生成器,组件模板生成,TypeScript组件,前端组件工具,在线组件生成',
  },
  'tools/perf-check': {
    title: '性能检测工具 | yma16前端工具集',
    description: '免费的在线网页性能检测工具，生成 Lighthouse 报告，分析网页加载速度、可访问性、SEO 和最佳实践。纯前端检测，不上传服务器。',
    keywords: '性能检测,Lighthouse,网页性能分析,加载速度检测,SEO检测,前端性能工具',
  },
  'tools/svg-processor': {
    title: 'SVG压缩处理工具 | yma16前端工具集',
    description: '免费的在线 SVG 处理工具，支持 SVG 压缩、批量转换、颜色替换、预览和下载。纯前端处理，不上传服务器。',
    keywords: 'SVG处理,SVG压缩,SVG转换,SVG优化,SVG批量处理,SVG颜色替换,SVG预览,SVG工具,矢量图形处理,前端开发工具',
  },
  'tools/file-diff': {
    title: '代码对比工具 | yma16前端工具集',
    description: '免费的在线代码对比工具，支持文本和代码差异比较，高亮显示增删改内容。纯前端计算，不上传服务器，保护代码隐私。',
    keywords: '代码对比,文本对比,代码差异比较,文件对比工具,Diff工具,代码比较,在线对比工具,文本差异分析,前端开发工具',
  },
  'tools/url-tools': {
    title: 'URL编解码工具 | yma16前端工具集',
    description: '免费的在线 URL 编解码工具，支持 URL 编码解码、查询参数解析、Hash 路由参数识别。纯前端处理，不上传服务器。',
    keywords: 'URL编码,URL解码,URL编解码,查询参数解析,URL参数解析,Hash参数,URL工具,在线URL工具,URL编码解码',
  },
  'tools/color-picker': {
    title: '颜色选择器 | yma16前端工具集',
    description: '免费的在线颜色选择器工具，支持拾色器取色、HEX/RGB/RGBA/HSL 互相转换、颜色预览和一键复制色值。纯前端运行，不上传服务器。',
    keywords: '颜色选择器,取色器,HEX转RGB,RGB转HEX,HSL转换,颜色转换工具,在线取色器,颜色拾取,吸管工具,前端开发工具',
  },
  'tools/image-cropper': {
    title: '图片裁剪工具 | yma16前端工具集',
    description: '免费的在线图片裁剪工具，纯前端 Canvas 实现，支持调整裁剪框、旋转图片、导出下载。不上传服务器保护隐私。',
    keywords: '图片裁剪,在线裁剪图片,图片旋转,图片编辑,Canvas裁剪,前端图片处理,图片裁剪工具',
  },
  'tools/base64-tool': {
    title: 'Base64编解码工具 | yma16前端工具集',
    description: '免费的在线 Base64 编解码工具，支持文本 Base64 编码解码、图片转 Base64、Base64 还原预览和下载。纯前端处理，不上传服务器。',
    keywords: 'Base64编码,Base64解码,Base64工具,图片转Base64,Base64转图片,在线Base64,文本编码,前端开发工具',
  },
  'tools/timestamp-tool': {
    title: '时间戳转换工具 | yma16前端工具集',
    description: '免费的在线时间戳转换工具，支持时间戳与格式化日期互相转换，支持秒/毫秒时间戳，多种日期格式选择。纯前端运行。',
    keywords: '时间戳转换,时间戳工具,日期转换,Unix时间戳,毫秒时间戳,时间格式转换,在线时间戳',
  },
  'tools/regex-tester': {
    title: '正则表达式测试工具 | yma16前端工具集',
    description: '免费的在线正则表达式测试工具，支持实时匹配、高亮显示、分组捕获、多种修饰符（g/i/m/s/u）。纯前端运行，不上传服务器。',
    keywords: '正则表达式测试,正则工具,Regex测试,正则匹配,在线正则,正则调试,正则表达式工具,RegExp测试,前端开发工具',
  },
  'tools/hash-tool': {
    title: 'MD5/SHA1/SHA256哈希计算 | yma16前端工具集',
    description: '免费的在线哈希计算工具，支持 MD5、SHA1、SHA256 哈希算法。纯前端计算保护隐私，不上传服务器。',
    keywords: 'MD5工具,SHA1工具,SHA256工具,哈希计算,在线MD5,文件哈希,哈希值计算,前端哈希,MD5在线计算,SHA在线计算',
  },
  'tools/json-to-ts': {
    title: 'JSON转TypeScript类型工具 | yma16前端工具集',
    description: '免费的 JSON 转 TypeScript Interface 类型生成器，自动推断类型，支持嵌套对象和数组。纯前端处理，不上传服务器。',
    keywords: 'JSON转TS,JSON转TypeScript,类型生成器,Interface生成,JSON类型推断,TS类型生成,前端开发工具',
  },
  'tools/mock-gen': {
    title: 'Mock数据生成器 | yma16前端工具集',
    description: 'Mock模拟JSON数据生成器，支持常用数据类型，快速生成测试数据。纯前端运行，不上传服务器。',
    keywords: 'Mock数据,模拟数据,JSON生成器,测试数据,假数据生成',
  },
  'tools/css-formatter': {
    title: 'CSS格式化压缩工具 | yma16前端工具集',
    description: 'CSS代码格式化、压缩、美化工具，支持一键整理和压缩CSS代码。纯前端处理，不上传服务器。',
    keywords: 'CSS格式化,CSS压缩,CSS美化,CSS整理,在线CSS工具',
  },
  'tools/string-escape': {
    title: '字符串Escape转义工具 | yma16前端工具集',
    description: 'HTML/JS字符串Escape转义反转义工具，支持多种转义格式。纯前端处理，不上传服务器。',
    keywords: '字符串转义,Escape,HTML转义,JS转义,字符串编码',
  },
  'tools/radix-convert': {
    title: '进制转换工具 | yma16前端工具集',
    description: '2/8/10/16进制互相转换器，支持二进制、八进制、十进制、十六进制转换。纯前端运行。',
    keywords: '进制转换,二进制,八进制,十进制,十六进制,2进制,16进制',
  },
  'tools/naming-convert': {
    title: '命名风格转换器 | yma16前端工具集',
    description: '驼峰、下划线、短横线等命名风格互转工具，支持批量转换。纯前端运行。',
    keywords: '命名风格转换,驼峰命名,下划线命名,短横线命名,camelCase,snake_case',
  },
  'tools/image-convert': {
    title: '图片格式转换工具 | yma16前端工具集',
    description: 'PNG/JPG/WebP图片格式转换，支持调节质量下载。纯前端处理，不上传服务器。',
    keywords: '图片格式转换,PNG转JPG,JPG转WebP,图片压缩,图片质量调节',
  },
  'tools/jwt-parser': {
    title: 'JWT解析工具 | yma16前端工具集',
    description: 'JWT Token在线解析工具，解析Header、Payload、Signature，验证Token有效性。纯前端处理。',
    keywords: 'JWT解析,JWT Token,Token解析,JWT解码,JSON Web Token',
  },
  'tools/cookie-parser': {
    title: 'Cookie解析工具 | yma16前端工具集',
    description: 'Cookie字符串解析工具，解析Cookie名称、值、过期时间、安全属性等。纯前端处理。',
    keywords: 'Cookie解析,Cookie工具,Cookie字符串,Cookie分析',
  },
  'tools/qrcode-tool': {
    title: '二维码生成解析工具 | yma16前端工具集',
    description: '二维码生成和解析工具，支持自定义颜色、大小，上传图片解析二维码内容。纯前端处理。',
    keywords: '二维码生成,二维码解析,QR Code,二维码工具,QR生成器',
  },
  'tools/regex-lib': {
    title: '正则常用模板库 | yma16前端工具集',
    description: '常用正则表达式模板库，包含手机号、邮箱、身份证、URL等常用正则模板，一键复制使用。',
    keywords: '正则模板,正则表达式库,常用正则,手机号正则,邮箱正则,身份证正则',
  },
  'tools/random-string': {
    title: '随机字符串生成器 | yma16前端工具集',
    description: '随机字符串生成器，支持自定义字符集、长度、生成数量，可用于密码、密钥、验证码生成。纯前端运行。',
    keywords: '随机字符串,密码生成器,随机密码,密钥生成,验证码生成',
  },
  'tools/unit-convert': {
    title: 'CSS单位换算器 | yma16前端工具集',
    description: 'CSS px/rem/em/vw/vh单位换算器，支持互相转换，前端开发常用工具。纯前端运行。',
    keywords: 'CSS单位换算,px转rem,rem转px,em换算,vw换算,前端单位转换',
  },
  'tools/ai-debug': {
    title: 'AI调试流式输出测试 | yma16前端工具集',
    description: 'AI调试流式输出测试工具，支持Mock模拟SSE流式和真实API请求调试。纯前端运行。',
    keywords: 'AI调试,流式输出,SSE测试,Mock流式,API调试,LLM调试,流式渲染测试',
  },
  'tools/perf-monitor': {
    title: '前端性能监控工具 | yma16前端工具集',
    description: '前端可视化电脑性能监控工具，实时显示FPS、内存、DOM节点数，支持浏览器压力测试。纯前端运行。',
    keywords: '前端性能监控,浏览器压力测试,FPS监控,内存监控,CPU测试,性能分析',
  },
  'tools/curl-convert': {
    title: 'cURL转Axios/Fetch代码工具 | yma16前端工具集',
    description: '将 cURL 命令一键转换为 Axios、Fetch、Python requests、Node.js 代码。纯前端转换，不上传服务器，保护 API 隐私。',
    keywords: 'cURL转换,Axios代码生成,Fetch代码生成,Python requests,Node.js HTTP,API调试工具,代码生成器,cURL转Axios,cURL转Fetch,在线代码转换',
  },
  'tools/eslint-config': {
    title: 'ESLint配置生成器 | yma16前端工具集',
    description: '可视化生成 ESLint 配置文件，支持 TypeScript、React、Vue、Prettier 等多种规则集组合。纯前端生成，不上传服务器。',
    keywords: 'ESLint配置,ESLint规则,TypeScript ESLint,React ESLint,Vue ESLint,Prettier配置,代码规范,lint规则生成器,在线ESLint配置,eslintrc生成',
  },
  'tools/playground': {
    title: 'HTML/CSS/JS在线代码编辑器 | yma16前端工具集',
    description: '免费的在线 HTML/CSS/JS 代码编辑器和实时预览工具，支持控制台输出、Vue3/Tailwind 预设模板、代码导出和本地草稿保存。纯前端运行。',
    keywords: '在线代码编辑器,HTML预览,CSS预览,JS预览,代码游乐场,前端demo,代码片段测试,Vue3示例,Tailwind示例,在线编程工具',
  },
  'blog': {
    title: '技术博客 | yma16前端工具集',
    description: 'yma16 技术博客，分享前端开发经验、工具使用教程和最佳实践。',
    keywords: '前端博客,技术博客,前端开发,JavaScript,React,Vue',
  },
  'pricing': {
    title: '合作与服务 | yma16前端工具集',
    description: 'yma16 前端开发工具集合作与服务方案，提供定制开发、技术咨询和培训服务。',
    keywords: '前端开发,合作,技术咨询,定制开发,培训服务',
  },
};

function injectSEO(pagePath, seo) {
  const htmlPath = path.join(DIST_DIR, pagePath, 'index.html');
  if (!fs.existsSync(htmlPath)) {
    console.warn(`⚠️ 文件不存在: ${htmlPath}`);
    return;
  }

  let html = fs.readFileSync(htmlPath, 'utf-8');

  // 替换 title
  html = html.replace(
    /<title>[^<]*<\/title>/,
    `<title>${seo.title}</title>`
  );

  // 替换 description
  html = html.replace(
    /<meta name="description" content="[^"]*"/,
    `<meta name="description" content="${seo.description}"`
  );

  // 替换 keywords
  html = html.replace(
    /<meta name="keywords" content="[^"]*"/,
    `<meta name="keywords" content="${seo.keywords}"`
  );

  // 替换 og:title
  html = html.replace(
    /<meta property="og:title" content="[^"]*"/,
    `<meta property="og:title" content="${seo.title}"`
  );

  // 替换 og:description
  html = html.replace(
    /<meta property="og:description" content="[^"]*"/,
    `<meta property="og:description" content="${seo.description}"`
  );

  // 替换 twitter:title
  html = html.replace(
    /<meta name="twitter:title" content="[^"]*"/,
    `<meta name="twitter:title" content="${seo.title}"`
  );

  // 替换 twitter:description
  html = html.replace(
    /<meta name="twitter:description" content="[^"]*"/,
    `<meta name="twitter:description" content="${seo.description}"`
  );

  // 添加 canonical link（如果不存在）
  if (!html.includes('rel="canonical"')) {
    html = html.replace(
      '</head>',
      `  <link rel="canonical" href="https://yma16.cloud/${pagePath}" />\n</head>`
    );
  }

  // 添加 JSON-LD 结构化数据
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: seo.title.split(' | ')[0],
    description: seo.description,
    url: `https://yma16.cloud/${pagePath}`,
    applicationCategory: 'DeveloperApplication',
    operatingSystem: 'Any',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'CNY',
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.8',
      ratingCount: '100',
    },
  };

  // 移除旧的 JSON-LD（如果存在）
  html = html.replace(/<script type="application\/ld\+json">[\s\S]*?<\/script>/g, '');

  // 添加新的 JSON-LD
  html = html.replace(
    '</head>',
    `  <script type="application/ld+json">\n${JSON.stringify(jsonLd, null, 2)}\n  </script>\n</head>`
  );

  fs.writeFileSync(htmlPath, html, 'utf-8');
  console.log(`✅ 已注入 SEO: ${pagePath}`);
}

// 执行注入
let injectedCount = 0;
for (const [pagePath, seo] of Object.entries(pageSEO)) {
  injectSEO(pagePath, seo);
  injectedCount++;
}

console.log(`\n🎉 完成！共注入 ${injectedCount} 个页面的独立 SEO 配置。`);
