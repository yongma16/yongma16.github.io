export default {
  // 通用
  common: {
    appName: 'yma16 前端開發工具集',
    free: '免費',
    new: 'NEW',
    pro: 'PRO',
    copy: '複製',
    download: '下載',
    save: '儲存',
    run: '執行',
    clear: '清空',
    loading: '載入中...',
    success: '成功',
    error: '錯誤',
    warning: '警告',
    info: '提示',
  },

  // 導航
  nav: {
    home: '首頁',
    tools: '開發工具',
    blog: '技術部落格',
    cooperate: '合作',
    github: 'GitHub',
  },

  // 首頁
  home: {
    title: '前端開發工具集',
    subtitle: '基於 React + TypeScript + Umi 建構的前端工具集合',
    description: '提供程式碼格式化、元件生成、效能檢測、SVG處理等開發工具',
    start: '開始使用',
    cooperate: '一起合作',
    toolCount: '工具數量',
    csdnViews: 'CSDN 閱讀量',
    articles: '技術文章',
    toolsTitle: '開發工具',
    ctaTitle: '喜歡這些工具？一起交流吧！',
    ctaDesc: '所有工具完全免費，歡迎技術交流、開源共建和知識分享',
    ctaButton: '一起搞事情',
    features: {
      efficient: '高效開發',
      efficientDesc: '一鍵生成程式碼，提升開發效率',
      teamwork: '團隊協作',
      teamworkDesc: '雲端儲存，團隊成員共享配置',
      export: '批次匯出',
      exportDesc: '支援批次處理，匯出多種格式',
    },
  },

  // 頁尾
  footer: {
    copyright: '© {year} yma16. All rights reserved. 前端開發工具集',
    domain: '目前存取網域',
    beian: '黔ICP備20001426號-3',
  },

  // 工具頁面通用
  tool: {
    input: '輸入',
    output: '輸出',
    options: '選項',
    preview: '即時預覽',
    console: '控制台',
    refresh: '重新整理',
  },

  // 程式碼格式化
  codeFormatter: {
    title: '程式碼格式化',
    description: '支援 Vue/React 程式碼格式化，Prettier 配置一鍵生成',
    config: 'Prettier 配置',
    format: '格式化程式碼',
  },

  // 元件生成器
  componentGen: {
    title: '元件生成器',
    description: '根據配置快速生成 React/Vue 元件程式碼模板',
  },

  // 效能檢測
  perfCheck: {
    title: '效能檢測',
    description: '前端效能分析工具，Lighthouse 報告生成',
  },

  // SVG處理
  svgProcessor: {
    title: 'SVG 處理',
    description: 'SVG 壓縮、轉換、批次處理，圖示庫管理',
  },

  // URL工具
  urlTools: {
    title: 'URL 工具',
    description: 'URL 編解碼、查詢參數解析、Hash 路由參數識別',
  },

  // 顏色選擇器
  colorPicker: {
    title: '顏色選擇器',
    description: '拾色器取色、HEX/RGB/HSL 互相轉換、顏色預覽',
  },

  // 圖片裁剪
  imageCropper: {
    title: '圖片裁剪',
    description: '純前端 Canvas 圖片裁剪、旋轉、匯出下載',
  },

  // Base64工具
  base64Tool: {
    title: 'Base64 工具',
    description: '文字 Base64 編解碼、圖片與 Base64 互轉',
  },

  // 時間戳轉換
  timestampTool: {
    title: '時間戳轉換',
    description: '時間戳與日期互相轉換，支援多種格式',
  },

  // 正規表示式測試
  regexTester: {
    title: '正規表示式測試',
    description: '正規表示式即時匹配、高亮顯示、分組捕獲',
  },

  // 雜湊工具
  hashTool: {
    title: '雜湊工具',
    description: 'MD5/SHA1/SHA256 雜湊計算，純前端實現',
  },

  // JSON轉TS
  jsonToTs: {
    title: 'JSON轉TS',
    description: 'JSON自動推斷生成TypeScript Interface類型',
  },

  // Mock生成
  mockGen: {
    title: 'Mock生成',
    description: '快速生成模擬JSON測試資料',
  },

  // CSS格式化
  cssFormatter: {
    title: 'CSS格式化',
    description: 'CSS程式碼格式化、壓縮、美化',
  },

  // 字串轉義
  stringEscape: {
    title: '字串轉義',
    description: 'HTML/JS字串Escape轉義反轉義',
  },

  // 進制轉換
  radixConvert: {
    title: '進制轉換',
    description: '2/8/10/16進制互相轉換',
  },

  // 命名轉換
  namingConvert: {
    title: '命名轉換',
    description: '駝峰、底線、短橫線命名風格互轉',
  },

  // 圖片轉換
  imageConvert: {
    title: '圖片轉換',
    description: 'PNG/JPG/WebP格式轉換，調節品質',
  },

  // JWT解析
  jwtParser: {
    title: 'JWT解析',
    description: 'JWT Token解析Header、Payload、Signature',
  },

  // Cookie解析
  cookieParser: {
    title: 'Cookie解析',
    description: '解析Cookie字串，檢視屬性和值',
  },

  // 二維碼工具
  qrcodeTool: {
    title: '二維碼工具',
    description: '二維碼生成和解析',
  },

  // 正規表示式模板
  regexLib: {
    title: '正規表示式模板',
    description: '常用正規表示式模板庫，一鍵複製',
  },

  // 隨機字串
  randomString: {
    title: '隨機字串',
    description: '自訂字元集、長度、生成數量',
  },

  // 單位換算
  unitConvert: {
    title: '單位換算',
    description: 'CSS px/rem/em/vw/vh單位換算',
  },

  // AI偵錯
  aiDebug: {
    title: 'AI偵錯',
    description: 'Mock流式模擬 + 真實API請求偵錯',
  },

  // 效能監控
  perfMonitor: {
    title: '效能監控',
    description: '前端視覺化效能監控與瀏覽器壓力測試',
  },

  // cURL轉換
  curlConvert: {
    title: 'cURL轉換',
    description: '將 cURL 命令一鍵轉換為 Axios/Fetch/Python/Node.js 程式碼',
  },

  // ESLint配置
  eslintConfig: {
    title: 'ESLint配置',
    description: '視覺化生成 ESLint 配置檔案，支援 TS/React/Vue/Prettier',
  },

  // 程式碼遊樂場
  playground: {
    title: '程式碼遊樂場',
    description: '線上編寫 HTML/CSS/JS，即時預覽，支援 Vue3/Tailwind 模板',
    htmlTab: 'HTML',
    cssTab: 'CSS',
    jsTab: 'JavaScript',
    scss: 'SCSS',
    downloadHtml: '下載 HTML',
    copyCode: '複製程式碼',
    saveDraft: '儲存草稿',
    draftBox: '草稿箱',
    presetHtml: '原生網頁',
    presetVue3: 'Vue3 Snippet',
    presetTailwind: 'Tailwind 模板',
    consolePlaceholder: '點擊「執行」按鈕檢視控制台輸出...',
    deleteDraftTip: '右鍵點擊草稿可刪除',
  },

  // Favicon生成器
  faviconGenerator: {
    title: 'Favicon生成',
    description: '拖拽上傳圖片，一鍵生成多尺寸 ICO/PNG 網站圖示',
  },

  // 合作頁面
  cooperate: {
    title: '一起搞事情',
    subtitle: '熱愛前端技術，樂於交流分享。無論是技術探討、開源共建還是知識分享，都歡迎來找我聊聊～',
    techExchange: {
      name: '技術交流',
      desc: '前端技術方案探討、效能最佳化思路分享、架構設計交流',
      features: [
        '前端架構設計探討',
        '效能最佳化經驗分享',
        '技術選型交流',
        '程式碼規範與最佳實踐',
        '線上問題排查思路',
      ],
      button: '一起聊聊',
    },
    openSource: {
      name: '開源共建',
      desc: '開源專案貢獻、工具開發協作、技術方案共建',
      features: [
        'React/Vue 生態貢獻',
        '前端工具鏈共建',
        '元件庫與物料體系',
        '視覺化與圖表方案',
        '跨端開發探索',
      ],
      button: '參與共建',
      popular: '熱門',
    },
    knowledge: {
      name: '知識分享',
      desc: '技術文章、教學、開源專案經驗分享',
      features: [
        '技術文章與部落格撰寫',
        '開源專案文件完善',
        '技術教學與案例分享',
        '技術演講與直播',
        '社群互動與答疑',
      ],
      button: '交流溝通',
    },
    aboutMe: '關於我',
    aboutMeDesc: '前端開發工程師，專注於 React/Vue 生態，喜歡折騰各種前端工具和效能最佳化。活躍於技術社群，相信開源和分享能讓技術變得更好。期待認識更多志同道合的朋友！',
    contactMe: '聯絡我',
    exchangeTitle: '交流方式',
    exchangeWays: [
      '💬 技術討論：前端技術選型、架構設計、效能最佳化',
      '🔧 工具共建：一起開發好用的前端工具，提升效率',
      '📝 經驗分享：寫文章、做教學，把踩過的坑變成經驗',
      '🎯 開源貢獻：參與開源專案，一起讓生態更好',
      '🤝 互相學習：每個人都有擅長的地方，互相交流成長',
    ],
    attitudeTitle: '我的態度',
    attitudes: [
      '🌟 樂於分享：技術不應該藏著掖著，分享才能進步',
      '💡 保持好奇：新技術、新工具都值得嘗試和探索',
      '🤗 開放包容：尊重不同的技術觀點，求同存異',
      '🔥 熱愛折騰：程式碼不僅是工作，更是熱愛和樂趣',
      '🚀 持續成長：保持學習，和前端社群一起進步',
    ],
  },
};
