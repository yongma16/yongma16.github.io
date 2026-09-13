import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Card, Row, Col, Button, message, Typography, Space, Select, Tabs, Tooltip, Badge } from 'antd';
import {
  PlayCircleOutlined,
  DownloadOutlined,
  CopyOutlined,
  SaveOutlined,
  FolderOpenOutlined,
  ClearOutlined,
  CodeOutlined,
  BugOutlined,
  FullscreenOutlined,
} from '@ant-design/icons';
import Editor from '@monaco-editor/react';
import { SEO, createToolJsonLd } from '@/components/SEO';

const { Title, Paragraph, Text } = Typography;
const { Option } = Select;
const { TabPane } = Tabs;

interface ConsoleMessage {
  type: 'log' | 'error' | 'warn' | 'info';
  message: string;
  timestamp: number;
}

interface Draft {
  id: string;
  name: string;
  html: string;
  css: string;
  js: string;
  createdAt: number;
}

const PRESETS = {
  html: {
    label: '原生网页',
    html: `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>我的页面</title>
</head>
<body>
  <h1>Hello World</h1>
  <p>在这里编写你的 HTML 代码</p>
  <button id="btn">点击我</button>
</body>
</html>`,
    css: `body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  background: #f5f5f5;
}

h1 {
  color: #1890ff;
}

button {
  background: #1890ff;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
}

button:hover {
  background: #40a9ff;
}`,
    js: `document.getElementById('btn').addEventListener('click', () => {
  alert('你好，世界！');
  console.log('按钮被点击了');
});`,
  },
  vue3: {
    label: 'Vue3 Snippet',
    html: `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Vue3 Demo</title>
  <script src="https://unpkg.com/vue@3/dist/vue.global.js"></script>
</head>
<body>
  <div id="app">
    <h1>{{ title }}</h1>
    <p>计数: {{ count }}</p>
    <button @click="increment">+1</button>
    <button @click="decrement">-1</button>
    <ul>
      <li v-for="item in items" :key="item.id">{{ item.name }}</li>
    </ul>
  </div>
</body>
</html>`,
    css: `body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
}

h1 {
  color: #42b883;
}

button {
  background: #42b883;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  margin-right: 8px;
}

button:hover {
  background: #35495e;
}

ul {
  margin-top: 20px;
  padding-left: 20px;
}

li {
  padding: 4px 0;
  color: #666;
}`,
    js: `const { createApp, ref } = Vue;

createApp({
  setup() {
    const title = ref('Vue 3 响应式示例');
    const count = ref(0);
    const items = ref([
      { id: 1, name: '学习 Vue3' },
      { id: 2, name: '练习 Composition API' },
      { id: 3, name: '构建组件库' },
    ]);

    const increment = () => {
      count.value++;
      console.log('当前计数:', count.value);
    };

    const decrement = () => {
      count.value--;
      console.log('当前计数:', count.value);
    };

    return {
      title,
      count,
      items,
      increment,
      decrement,
    };
  }
}).mount('#app');`,
  },
  tailwind: {
    label: 'Tailwind 模板',
    html: `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Tailwind Demo</title>
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-gray-100 min-h-screen">
  <div class="container mx-auto px-4 py-8">
    <div class="bg-white rounded-lg shadow-lg p-6 max-w-md mx-auto">
      <h1 class="text-2xl font-bold text-gray-800 mb-4">Tailwind CSS 示例</h1>
      <p class="text-gray-600 mb-4">快速构建现代化界面</p>
      <div class="space-y-3">
        <button class="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded transition">
          主要按钮
        </button>
        <button class="w-full bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded transition">
          成功按钮
        </button>
        <div class="flex gap-2">
          <span class="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm">标签1</span>
          <span class="px-3 py-1 bg-pink-100 text-pink-700 rounded-full text-sm">标签2</span>
        </div>
      </div>
    </div>
    <div id="output" class="mt-6 text-center text-gray-500"></div>
  </div>
</body>
</html>`,
    css: `/* Tailwind 已通过 CDN 引入，这里写自定义样式 */

.custom-animation {
  animation: fadeIn 0.5s ease-in;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}`,
    js: `document.querySelectorAll('button').forEach(btn => {
  btn.addEventListener('click', (e) => {
    const text = e.target.textContent.trim();
    document.getElementById('output').innerHTML = 
      '<span style="color: #16a34a; font-weight: 500;">✓ 点击了: ' + text + '</span>';
    console.log('按钮点击:', text);
  });
});`,
  },
};

const DB_NAME = 'yma16-playground';
const DB_VERSION = 1;
const STORE_NAME = 'drafts';

const initDB = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' });
      }
    };
  });
};

const saveDraft = async (draft: Draft) => {
  const db = await initDB();
  return new Promise<void>((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    const request = store.put(draft);
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
};

const getDrafts = async (): Promise<Draft[]> => {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readonly');
    const store = tx.objectStore(STORE_NAME);
    const request = store.getAll();
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
};

const deleteDraft = async (id: string) => {
  const db = await initDB();
  return new Promise<void>((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    const request = store.delete(id);
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
};

const compileScss = async (scss: string): Promise<string> => {
  // 简单的 SCSS 变量和嵌套处理（浏览器端简化版）
  let css = scss;
  
  // 处理变量
  const variables: Record<string, string> = {};
  css = css.replace(/\$([\w-]+):\s*([^;]+);/g, (match, name, value) => {
    variables[name] = value.trim();
    return '';
  });
  
  // 替换变量使用
  Object.entries(variables).forEach(([name, value]) => {
    css = css.replace(new RegExp(`\\$${name}`, 'g'), value);
  });
  
  // 处理嵌套（简化版）
  let depth = 0;
  const lines = css.split('\n');
  const result: string[] = [];
  const selectors: string[] = [];
  
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;
    
    if (trimmed.includes('{')) {
      const selector = trimmed.replace('{', '').trim();
      if (depth === 0) {
        selectors.push(selector);
      } else {
        const parent = selectors[selectors.length - 1];
        selectors.push(`${parent} ${selector}`);
      }
      depth++;
    } else if (trimmed === '}') {
      depth--;
      if (depth >= 0) selectors.pop();
    } else if (trimmed.includes(':')) {
      const currentSelector = selectors[selectors.length - 1] || '';
      if (currentSelector) {
        result.push(`${currentSelector} { ${trimmed} }`);
      } else {
        result.push(trimmed);
      }
    }
  }
  
  return result.length > 0 ? result.join('\n') : css;
};

const CodePlayground: React.FC = () => {
  const [html, setHtml] = useState(PRESETS.html.html);
  const [css, setCss] = useState(PRESETS.html.css);
  const [js, setJs] = useState(PRESETS.html.js);
  const [activeTab, setActiveTab] = useState('html');
  const [consoleMessages, setConsoleMessages] = useState<ConsoleMessage[]>([]);
  const [showConsole, setShowConsole] = useState(true);
  const [drafts, setDrafts] = useState<Draft[]>([]);
  const [draftName, setDraftName] = useState('');
  const [isScss, setIsScss] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const seoConfig = {
    title: 'HTML/CSS/JS 在线代码编辑器',
    description: '免费的在线 HTML/CSS/JS 代码编辑器和实时预览工具，支持控制台输出、Vue3/Tailwind 预设模板、代码导出和本地草稿保存。适合上课写 demo、验证代码片段、作业快速测试。纯前端运行，不上传服务器。',
    keywords: '在线代码编辑器,HTML预览,CSS预览,JS预览,代码游乐场,前端demo,代码片段测试,Vue3示例,Tailwind示例,在线编程工具',
    canonical: 'https://yma16.cloud/tools/playground',
    jsonLd: createToolJsonLd(
      'HTML/CSS/JS 在线代码编辑器',
      '免费的在线 HTML/CSS/JS 代码编辑器和实时预览工具，支持控制台输出、Vue3/Tailwind 预设模板、代码导出和本地草稿保存。纯前端运行，不上传服务器。',
      'https://yma16.cloud/tools/playground',
      'DeveloperApplication'
    ),
  };

  const updatePreview = useCallback(async () => {
    const iframe = iframeRef.current;
    if (!iframe) return;

    let compiledCss = css;
    if (isScss) {
      try {
        compiledCss = await compileScss(css);
      } catch (err) {
        console.error('SCSS 编译错误:', err);
      }
    }

    const doc = iframe.contentDocument || iframe.contentWindow?.document;
    if (!doc) return;

    // 捕获 console 输出
    const consoleScript = `
      <script>
        (function() {
          const originalLog = console.log;
          const originalError = console.error;
          const originalWarn = console.warn;
          const originalInfo = console.info;
          
          function sendToParent(type, args) {
            const message = args.map(arg => {
              if (typeof arg === 'object') {
                try {
                  return JSON.stringify(arg, null, 2);
                } catch {
                  return String(arg);
                }
              }
              return String(arg);
            }).join(' ');
            
            window.parent.postMessage({
              type: 'console',
              consoleType: type,
              message: message,
              timestamp: Date.now()
            }, '*');
          }
          
          console.log = function(...args) {
            originalLog.apply(console, args);
            sendToParent('log', args);
          };
          
          console.error = function(...args) {
            originalError.apply(console, args);
            sendToParent('error', args);
          };
          
          console.warn = function(...args) {
            originalWarn.apply(console, args);
            sendToParent('warn', args);
          };
          
          console.info = function(...args) {
            originalInfo.apply(console, args);
            sendToParent('info', args);
          };
          
          window.onerror = function(msg, url, line, col, error) {
            sendToParent('error', [msg + ' (line ' + line + ':' + col + ')']);
            return false;
          };
        })();
      </script>
    `;

    const htmlContent = html.replace('</head>', `${consoleScript}</head>`);
    const fullContent = htmlContent.replace(
      '</head>',
      `<style>${compiledCss}</style></head>`
    ).replace(
      '</body>',
      `<script>${js}</script></body>`
    );

    doc.open();
    doc.write(fullContent);
    doc.close();
  }, [html, css, js, isScss]);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data && event.data.type === 'console') {
        setConsoleMessages(prev => [...prev, {
          type: event.data.consoleType,
          message: event.data.message,
          timestamp: event.data.timestamp,
        }]);
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  useEffect(() => {
    loadDrafts();
  }, []);

  const loadDrafts = async () => {
    try {
      const drafts = await getDrafts();
      setDrafts(drafts.sort((a, b) => b.createdAt - a.createdAt));
    } catch {
      // IndexedDB 不可用时不报错
    }
  };

  const handleRun = () => {
    setConsoleMessages([]);
    updatePreview();
    message.success('代码已运行');
  };

  const handleDownload = () => {
    const blob = new Blob([html.replace('</head>', `<style>${css}</style></head>`).replace('</body>', `<script>${js}</script></body>`)], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'playground-demo.html';
    a.click();
    URL.revokeObjectURL(url);
    message.success('HTML 文件已下载');
  };

  const handleCopy = () => {
    const code = `<!-- HTML -->\n${html}\n\n<!-- CSS -->\n<style>\n${css}\n</style>\n\n<!-- JS -->\n<script>\n${js}\n</script>`;
    navigator.clipboard.writeText(code);
    message.success('代码已复制');
  };

  const handleSave = async () => {
    const name = draftName || `草稿 ${new Date().toLocaleString()}`;
    const draft: Draft = {
      id: Date.now().toString(),
      name,
      html,
      css,
      js,
      createdAt: Date.now(),
    };
    
    try {
      await saveDraft(draft);
      await loadDrafts();
      message.success('草稿已保存');
      setDraftName('');
    } catch {
      message.error('保存失败，浏览器可能不支持 IndexedDB');
    }
  };

  const handleLoadDraft = (draft: Draft) => {
    setHtml(draft.html);
    setCss(draft.css);
    setJs(draft.js);
    message.success(`已加载: ${draft.name}`);
  };

  const handleDeleteDraft = async (id: string) => {
    try {
      await deleteDraft(id);
      await loadDrafts();
      message.success('草稿已删除');
    } catch {
      message.error('删除失败');
    }
  };

  const handlePresetChange = (value: string) => {
    const preset = PRESETS[value as keyof typeof PRESETS];
    if (preset) {
      setHtml(preset.html);
      setCss(preset.css);
      setJs(preset.js);
      message.success(`已加载 ${preset.label} 模板`);
    }
  };

  const clearConsole = () => {
    setConsoleMessages([]);
  };

  return (
    <>
      <SEO {...seoConfig} />
      <div style={{ height: 'calc(100vh - 140px)', display: 'flex', flexDirection: 'column' }}>
        {/* 顶部工具栏 */}
        <div style={{ padding: '12px 0', borderBottom: '1px solid #f0f0f0', marginBottom: 12 }}>
          <Row justify="space-between" align="middle">
            <Col>
              <Space>
                <Title level={4} style={{ margin: 0 }}>
                  <CodeOutlined /> 代码游乐场
                </Title>
                <Select
                  defaultValue="html"
                  style={{ width: 140 }}
                  onChange={handlePresetChange}
                >
                  <Option value="html">原生网页</Option>
                  <Option value="vue3">Vue3 Snippet</Option>
                  <Option value="tailwind">Tailwind 模板</Option>
                </Select>
                <Button
                  type={isScss ? 'primary' : 'default'}
                  size="small"
                  onClick={() => setIsScss(!isScss)}
                >
                  SCSS
                </Button>
              </Space>
            </Col>
            <Col>
              <Space>
                <Button type="primary" icon={<PlayCircleOutlined />} onClick={handleRun}>
                  运行
                </Button>
                <Button icon={<DownloadOutlined />} onClick={handleDownload}>
                  下载 HTML
                </Button>
                <Button icon={<CopyOutlined />} onClick={handleCopy}>
                  复制代码
                </Button>
                <Button icon={<SaveOutlined />} onClick={handleSave}>
                  保存草稿
                </Button>
              </Space>
            </Col>
          </Row>
        </div>

        {/* 主编辑区 */}
        <Row gutter={12} style={{ flex: 1, minHeight: 0 }}>
          {/* 编辑器 */}
          <Col span={12} style={{ height: '100%' }}>
            <Card
              bodyStyle={{ padding: 0, height: 'calc(100% - 48px)' }}
              style={{ height: '100%' }}
              title={
                <Tabs activeKey={activeTab} onChange={setActiveTab} size="small">
                  <TabPane tab="HTML" key="html" />
                  <TabPane tab={isScss ? 'SCSS' : 'CSS'} key="css" />
                  <TabPane tab="JavaScript" key="js" />
                </Tabs>
              }
            >
              {activeTab === 'html' && (
                <Editor
                  height="100%"
                  language="html"
                  value={html}
                  onChange={(v) => setHtml(v || '')}
                  options={{
                    minimap: { enabled: false },
                    fontSize: 14,
                    lineNumbers: 'on',
                    automaticLayout: true,
                    wordWrap: 'on',
                    tabSize: 2,
                  }}
                />
              )}
              {activeTab === 'css' && (
                <Editor
                  height="100%"
                  language={isScss ? 'scss' : 'css'}
                  value={css}
                  onChange={(v) => setCss(v || '')}
                  options={{
                    minimap: { enabled: false },
                    fontSize: 14,
                    lineNumbers: 'on',
                    automaticLayout: true,
                    wordWrap: 'on',
                    tabSize: 2,
                  }}
                />
              )}
              {activeTab === 'js' && (
                <Editor
                  height="100%"
                  language="javascript"
                  value={js}
                  onChange={(v) => setJs(v || '')}
                  options={{
                    minimap: { enabled: false },
                    fontSize: 14,
                    lineNumbers: 'on',
                    automaticLayout: true,
                    wordWrap: 'on',
                    tabSize: 2,
                  }}
                />
              )}
            </Card>
          </Col>

          {/* 预览区 */}
          <Col span={12} style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <Card
              bodyStyle={{ padding: 0, height: '100%' }}
              style={{ height: '60%', marginBottom: 12 }}
              title={
                <Row justify="space-between" align="middle">
                  <Col>实时预览</Col>
                  <Col>
                    <Button size="small" icon={<FullscreenOutlined />} onClick={handleRun}>
                      刷新
                    </Button>
                  </Col>
                </Row>
              }
            >
              <iframe
                ref={iframeRef}
                style={{ width: '100%', height: '100%', border: 'none' }}
                sandbox="allow-scripts allow-modals"
                title="preview"
              />
            </Card>

            {/* 控制台 */}
            <Card
              bodyStyle={{ padding: 8, height: 'calc(100% - 48px)', overflow: 'auto' }}
              style={{ height: '40%' }}
              title={
                <Row justify="space-between" align="middle">
                  <Col>
                    <Space>
                      <BugOutlined />
                      控制台
                      {consoleMessages.length > 0 && (
                        <Badge count={consoleMessages.length} size="small" />
                      )}
                    </Space>
                  </Col>
                  <Col>
                    <Button size="small" icon={<ClearOutlined />} onClick={clearConsole}>
                      清空
                    </Button>
                  </Col>
                </Row>
              }
            >
              {consoleMessages.length === 0 ? (
                <Text type="secondary" style={{ fontSize: 12 }}>
                  点击「运行」按钮查看控制台输出...
                </Text>
              ) : (
                <div style={{ fontFamily: 'monospace', fontSize: 12 }}>
                  {consoleMessages.map((msg, index) => (
                    <div
                      key={index}
                      style={{
                        padding: '2px 0',
                        color:
                          msg.type === 'error'
                            ? '#ff4d4f'
                            : msg.type === 'warn'
                            ? '#faad14'
                            : msg.type === 'info'
                            ? '#1890ff'
                            : '#333',
                        borderBottom: '1px solid #f0f0f0',
                      }}
                    >
                      <span style={{ color: '#999', marginRight: 8 }}>
                        {new Date(msg.timestamp).toLocaleTimeString()}
                      </span>
                      <span style={{ textTransform: 'uppercase', marginRight: 8, fontSize: 10 }}>
                        [{msg.type}]
                      </span>
                      {msg.message}
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </Col>
        </Row>

        {/* 草稿箱 */}
        {drafts.length > 0 && (
          <Card size="small" style={{ marginTop: 12 }} title={<><FolderOpenOutlined /> 草稿箱</>}>
            <Space wrap>
              {drafts.map((draft) => (
                <Button
                  key={draft.id}
                  size="small"
                  onClick={() => handleLoadDraft(draft)}
                  onContextMenu={(e) => {
                    e.preventDefault();
                    handleDeleteDraft(draft.id);
                  }}
                >
                  {draft.name}
                </Button>
              ))}
            </Space>
            <Text type="secondary" style={{ fontSize: 12, marginLeft: 12 }}>
              右键点击草稿可删除
            </Text>
          </Card>
        )}
      </div>
    </>
  );
};

export default CodePlayground;
