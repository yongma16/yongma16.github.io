export default {
  // 通用
  common: {
    appName: 'yma16 前端开发工具集',
    free: '免费',
    new: 'NEW',
    pro: 'PRO',
    copy: '复制',
    download: '下载',
    save: '保存',
    run: '运行',
    clear: '清空',
    loading: '加载中...',
    success: '成功',
    error: '错误',
    warning: '警告',
    info: '提示',
  },

  // 导航
  nav: {
    home: '首页',
    tools: '开发工具',
    blog: '技术博客',
    cooperate: '合作',
    github: 'GitHub',
  },

  // 首页
  home: {
    title: '前端开发工具集',
    subtitle: '基于 React + TypeScript + Umi 构建的前端工具集合',
    description: '提供代码格式化、组件生成、性能检测、SVG处理等开发工具',
    start: '开始使用',
    cooperate: '一起合作',
    toolCount: '工具数量',
    csdnViews: 'CSDN 阅读量',
    articles: '技术文章',
    toolsTitle: '开发工具',
    ctaTitle: '喜欢这些工具？一起交流吧！',
    ctaDesc: '所有工具完全免费，欢迎技术交流、开源共建和知识分享',
    ctaButton: '一起搞事情',
    features: {
      efficient: '高效开发',
      efficientDesc: '一键生成代码，提升开发效率',
      teamwork: '团队协作',
      teamworkDesc: '云端存储，团队成员共享配置',
      export: '批量导出',
      exportDesc: '支持批量处理，导出多种格式',
    },
  },

  // 页脚
  footer: {
    copyright: '© {year} yma16. All rights reserved. 前端开发工具集',
    domain: '当前访问域名',
    beian: '黔ICP备20001426号-3',
  },

  // 工具页面通用
  tool: {
    input: '输入',
    output: '输出',
    options: '选项',
    preview: '实时预览',
    console: '控制台',
    refresh: '刷新',
  },

  // 代码格式化
  codeFormatter: {
    title: '代码格式化',
    description: '支持 Vue/React 代码格式化，Prettier 配置一键生成',
    config: 'Prettier 配置',
    format: '格式化代码',
  },

  // 组件生成器
  componentGen: {
    title: '组件生成器',
    description: '根据配置快速生成 React/Vue 组件代码模板',
  },

  // 性能检测
  perfCheck: {
    title: '性能检测',
    description: '前端性能分析工具，Lighthouse 报告生成',
  },

  // SVG处理
  svgProcessor: {
    title: 'SVG 处理',
    description: 'SVG 压缩、转换、批量处理，图标库管理',
  },

  // URL工具
  urlTools: {
    title: 'URL 工具',
    description: 'URL 编解码、查询参数解析、Hash 路由参数识别',
  },

  // 颜色选择器
  colorPicker: {
    title: '颜色选择器',
    description: '拾色器取色、HEX/RGB/HSL 互相转换、颜色预览',
  },

  // 图片裁剪
  imageCropper: {
    title: '图片裁剪',
    description: '纯前端 Canvas 图片裁剪、旋转、导出下载',
  },

  // Base64工具
  base64Tool: {
    title: 'Base64 工具',
    description: '文本 Base64 编解码、图片与 Base64 互转',
  },

  // 时间戳转换
  timestampTool: {
    title: '时间戳转换',
    description: '时间戳与日期互相转换，支持多种格式',
  },

  // 正则测试
  regexTester: {
    title: '正则测试',
    description: '正则表达式实时匹配、高亮显示、分组捕获',
  },

  // 哈希工具
  hashTool: {
    title: '哈希工具',
    description: 'MD5/SHA1/SHA256 哈希计算，纯前端实现',
  },

  // JSON转TS
  jsonToTs: {
    title: 'JSON转TS',
    description: 'JSON自动推断生成TypeScript Interface类型',
  },

  // Mock生成
  mockGen: {
    title: 'Mock生成',
    description: '快速生成模拟JSON测试数据',
  },

  // CSS格式化
  cssFormatter: {
    title: 'CSS格式化',
    description: 'CSS代码格式化、压缩、美化',
  },

  // 字符串转义
  stringEscape: {
    title: '字符串转义',
    description: 'HTML/JS字符串Escape转义反转义',
  },

  // 进制转换
  radixConvert: {
    title: '进制转换',
    description: '2/8/10/16进制互相转换',
  },

  // 命名转换
  namingConvert: {
    title: '命名转换',
    description: '驼峰、下划线、短横线命名风格互转',
  },

  // 图片转换
  imageConvert: {
    title: '图片转换',
    description: 'PNG/JPG/WebP格式转换，调节质量',
  },

  // JWT解析
  jwtParser: {
    title: 'JWT解析',
    description: 'JWT Token解析Header、Payload、Signature',
  },

  // Cookie解析
  cookieParser: {
    title: 'Cookie解析',
    description: '解析Cookie字符串，查看属性和值',
  },

  // 二维码工具
  qrcodeTool: {
    title: '二维码工具',
    description: '二维码生成和解析',
  },

  // 正则模板
  regexLib: {
    title: '正则模板',
    description: '常用正则表达式模板库，一键复制',
  },

  // 随机字符串
  randomString: {
    title: '随机字符串',
    description: '自定义字符集、长度、生成数量',
  },

  // 单位换算
  unitConvert: {
    title: '单位换算',
    description: 'CSS px/rem/em/vw/vh单位换算',
  },

  // AI调试
  aiDebug: {
    title: 'AI调试',
    description: 'Mock流式模拟 + 真实API请求调试',
  },

  // 性能监控
  perfMonitor: {
    title: '性能监控',
    description: '前端可视化性能监控与浏览器压力测试',
  },

  // cURL转换
  curlConvert: {
    title: 'cURL转换',
    description: '将 cURL 命令一键转换为 Axios/Fetch/Python/Node.js 代码',
  },

  // ESLint配置
  eslintConfig: {
    title: 'ESLint配置',
    description: '可视化生成 ESLint 配置文件，支持 TS/React/Vue/Prettier',
  },

  // 代码游乐场
  playground: {
    title: '代码游乐场',
    description: '在线编写 HTML/CSS/JS，实时预览，支持 Vue3/Tailwind 模板',
    htmlTab: 'HTML',
    cssTab: 'CSS',
    jsTab: 'JavaScript',
    scss: 'SCSS',
    downloadHtml: '下载 HTML',
    copyCode: '复制代码',
    saveDraft: '保存草稿',
    draftBox: '草稿箱',
    presetHtml: '原生网页',
    presetVue3: 'Vue3 Snippet',
    presetTailwind: 'Tailwind 模板',
    consolePlaceholder: '点击「运行」按钮查看控制台输出...',
    deleteDraftTip: '右键点击草稿可删除',
  },

  // Favicon生成器
  faviconGenerator: {
    title: 'Favicon生成',
    description: '拖拽上传图片，一键生成多尺寸 ICO/PNG 网站图标',
  },

  // Git Hook配置
  gitHookConfig: {
    title: 'Git Hook配置',
    description: '一键生成 Husky、lint-staged、commitlint 配置代码',
  },

  // 合作页面
  cooperate: {
    title: '一起搞事情',
    subtitle: '热爱前端技术，乐于交流分享。无论是技术探讨、开源共建还是知识分享，都欢迎来找我聊聊～',
    techExchange: {
      name: '技术交流',
      desc: '前端技术方案探讨、性能优化思路分享、架构设计交流',
      features: [
        '前端架构设计探讨',
        '性能优化经验分享',
        '技术选型交流',
        '代码规范与最佳实践',
        '线上问题排查思路',
      ],
      button: '一起聊聊',
    },
    openSource: {
      name: '开源共建',
      desc: '开源项目贡献、工具开发协作、技术方案共建',
      features: [
        'React/Vue 生态贡献',
        '前端工具链共建',
        '组件库与物料体系',
        '可视化与图表方案',
        '跨端开发探索',
      ],
      button: '参与共建',
      popular: '热门',
    },
    knowledge: {
      name: '知识分享',
      desc: '技术文章、教程、开源项目经验分享',
      features: [
        '技术文章与博客撰写',
        '开源项目文档完善',
        '技术教程与案例分享',
        '技术演讲与直播',
        '社区互动与答疑',
      ],
      button: '交流沟通',
    },
    aboutMe: '关于我',
    aboutMeDesc: '前端开发工程师，专注于 React/Vue 生态，喜欢折腾各种前端工具和性能优化。活跃于技术社区，相信开源和分享能让技术变得更好。期待认识更多志同道合的朋友！',
    contactMe: '联系我',
    exchangeTitle: '交流方式',
    exchangeWays: [
      '💬 技术讨论：前端技术选型、架构设计、性能优化',
      '🔧 工具共建：一起开发好用的前端工具，提升效率',
      '📝 经验分享：写文章、做教程，把踩过的坑变成经验',
      '🎯 开源贡献：参与开源项目，一起让生态更好',
      '🤝 互相学习：每个人都有擅长的地方，互相交流成长',
    ],
    attitudeTitle: '我的态度',
    attitudes: [
      '🌟 乐于分享：技术不应该藏着掖着，分享才能进步',
      '💡 保持好奇：新技术、新工具都值得尝试和探索',
      '🤗 开放包容：尊重不同的技术观点，求同存异',
      '🔥 热爱折腾：代码不仅是工作，更是热爱和乐趣',
      '🚀 持续成长：保持学习，和前端社区一起进步',
    ],
  },
};
