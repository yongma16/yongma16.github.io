import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Card, Button, Progress, Statistic, Row, Col, Typography, List, Tag, Timeline, Alert, Space, Divider, Badge } from 'antd';
import { BarChartOutlined, PlayCircleOutlined, ReloadOutlined, CheckCircleOutlined, WarningOutlined, CloseCircleOutlined, CodeOutlined, CopyOutlined } from '@ant-design/icons';
import Editor from '@monaco-editor/react';
import { SEO, createToolJsonLd } from '@/components/SEO';

const { Title, Paragraph } = Typography;

interface PerfMetric {
  name: string;
  value: number;
  unit: string;
  threshold: number;
  status: 'good' | 'warning' | 'poor';
  description: string;
}

interface CodeExample {
  title: string;
  code: string;
  description: string;
}

const codeExamples: CodeExample[] = [
  {
    title: 'Performance Observer API',
    description: '使用 Performance Observer 监听核心 Web 指标',
    code: `// 监听 LCP (最大内容绘制)
const observer = new PerformanceObserver((list) => {
  const entries = list.getEntries();
  const lastEntry = entries[entries.length - 1];
  console.log('LCP:', lastEntry.startTime);
});
observer.observe({ entryTypes: ['largest-contentful-paint'] });

// 监听 CLS (累积布局偏移)
let clsValue = 0;
const clsObserver = new PerformanceObserver((list) => {
  for (const entry of list.getEntries()) {
    if (!entry.hadRecentInput) {
      clsValue += entry.value;
    }
  }
  console.log('CLS:', clsValue);
});
clsObserver.observe({ entryTypes: ['layout-shift'] });

// 监听 FID (首次输入延迟)
const fidObserver = new PerformanceObserver((list) => {
  for (const entry of list.getEntries()) {
    const delay = entry.processingStart - entry.startTime;
    console.log('FID:', delay);
  }
});
fidObserver.observe({ entryTypes: ['first-input'] });`,
  },
  {
    title: '内存泄漏检测',
    description: '检测 DOM 节点和事件监听器的内存泄漏',
    code: `// 检测 detached DOM 节点
function findDetachedNodes() {
  const walker = document.createTreeWalker(
    document.body,
    NodeFilter.SHOW_ELEMENT
  );
  const nodes = [];
  let node;
  while (node = walker.nextNode()) {
    if (!document.contains(node)) {
      nodes.push(node);
    }
  }
  return nodes;
}

// 检测事件监听器泄漏
const originalAddEventListener = EventTarget.prototype.addEventListener;
const listenerMap = new WeakMap();

EventTarget.prototype.addEventListener = function(type, listener, options) {
  if (!listenerMap.has(this)) {
    listenerMap.set(this, []);
  }
  listenerMap.get(this).push({ type, listener });
  return originalAddEventListener.call(this, type, listener, options);
};

// 获取元素的所有监听器
function getEventListeners(element) {
  return listenerMap.get(element) || [];
}`,
  },
  {
    title: '长任务检测',
    description: '检测阻塞主线程的长任务',
    code: `// 监听长任务（超过 50ms 的任务）
const longTaskObserver = new PerformanceObserver((list) => {
  for (const entry of list.getEntries()) {
    console.warn('Long Task detected:', {
      duration: entry.duration,
      startTime: entry.startTime,
      attribution: entry.attribution,
    });
  }
});
longTaskObserver.observe({ entryTypes: ['longtask'] });

// 使用 requestIdleCallback 优化低优先级任务
function scheduleLowPriorityTask(callback) {
  if ('requestIdleCallback' in window) {
    requestIdleCallback(callback, { timeout: 2000 });
  } else {
    setTimeout(callback, 1);
  }
}

// 分解长任务
async function breakLongTask(items, processItem) {
  const chunkSize = 100;
  for (let i = 0; i < items.length; i += chunkSize) {
    const chunk = items.slice(i, i + chunkSize);
    await new Promise(resolve => {
      requestAnimationFrame(() => {
        chunk.forEach(processItem);
        resolve(null);
      });
    });
  }
}`,
  },
  {
    title: '资源加载优化检测',
    description: '检测资源加载性能并提供优化建议',
    code: `// 检测资源加载时间
const resourceObserver = new PerformanceObserver((list) => {
  for (const entry of list.getEntries()) {
    if (entry.entryType === 'resource') {
      const loadTime = entry.responseEnd - entry.startTime;
      if (loadTime > 1000) {
        console.warn('Slow resource:', entry.name, loadTime + 'ms');
      }
    }
  }
});
resourceObserver.observe({ entryTypes: ['resource'] });

// 检测图片是否在视口内加载
const imageObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const img = entry.target as HTMLImageElement;
      img.src = img.dataset.src || img.src;
      imageObserver.unobserve(img);
    }
  });
});

// 检测未使用的 CSS
function findUnusedCSS() {
  const sheets = Array.from(document.styleSheets);
  const unusedRules = [];
  
  sheets.forEach(sheet => {
    try {
      const rules = Array.from(sheet.cssRules || sheet.rules);
      rules.forEach(rule => {
        if (rule instanceof CSSStyleRule) {
          const elements = document.querySelectorAll(rule.selectorText);
          if (elements.length === 0) {
            unusedRules.push(rule.selectorText);
          }
        }
      });
    } catch (e) {
      // 跨域样式表无法访问
    }
  });
  
  return unusedRules;
}`,
  },
];

const PerfCheck: React.FC = () => {
  const seoConfig = {
    title: '前端性能检测工具',
    description: '免费的前端性能检测工具，分析网页 Core Web Vitals 指标（LCP、FID、CLS），提供 Lighthouse 报告和性能优化建议，提升网站加载速度。',
    keywords: '性能检测,前端性能优化,Lighthouse,Core Web Vitals,LCP,FID,CLS,网页性能分析,加载速度优化,性能测试工具',
    jsonLd: createToolJsonLd(
      '前端性能检测工具',
      '免费的前端性能分析和优化工具',
      'https://yma16.cloud/tools/perf-check',
      'DeveloperApplication'
    ),
  };
  const [loading, setLoading] = useState(false);
  const [metrics, setMetrics] = useState<PerfMetric[]>([]);
  const [timeline, setTimeline] = useState<string[]>([]);
  const [codePanelVisible, setCodePanelVisible] = useState(false);
  const [selectedCode, setSelectedCode] = useState<CodeExample>(codeExamples[0]);
  const [realTimeMetrics, setRealTimeMetrics] = useState({
    lcp: 0,
    cls: 0,
    fid: 0,
    fcp: 0,
    ttfb: 0,
  });

  // 真实的性能检测
  const runRealPerformanceCheck = useCallback(async () => {
    setLoading(true);
    setTimeline(['开始性能检测...']);

    const newMetrics: PerfMetric[] = [];

    // 步骤 1: 检测 Navigation Timing
    setTimeline(prev => [...prev, '检测页面加载时间...']);
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    if (navigation) {
      const ttfb = navigation.responseStart - navigation.startTime;
      const fcp = performance.getEntriesByName('first-contentful-paint')[0]?.startTime || 0;
      const loadTime = navigation.loadEventEnd - navigation.startTime;
      
      newMetrics.push({
        name: '首字节时间 (TTFB)',
        value: Math.round(ttfb),
        unit: 'ms',
        threshold: 600,
        status: ttfb < 600 ? 'good' : ttfb < 1000 ? 'warning' : 'poor',
        description: '浏览器收到服务器第一个字节的时间',
      });
      
      newMetrics.push({
        name: '页面完全加载时间',
        value: Math.round(loadTime),
        unit: 'ms',
        threshold: 3000,
        status: loadTime < 3000 ? 'good' : loadTime < 5000 ? 'warning' : 'poor',
        description: '从请求开始到页面完全加载的时间',
      });
    }

    // 步骤 2: 检测资源加载
    setTimeline(prev => [...prev, '分析资源加载情况...']);
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const resources = performance.getEntriesByType('resource');
    const totalResourceSize = resources.reduce((sum, r: any) => sum + (r.transferSize || 0), 0);
    const slowResources = resources.filter((r: any) => {
      const duration = r.responseEnd - r.startTime;
      return duration > 1000;
    });

    newMetrics.push({
      name: '资源总数',
      value: resources.length,
      unit: '个',
      threshold: 50,
      status: resources.length < 50 ? 'good' : resources.length < 100 ? 'warning' : 'poor',
      description: '页面加载的资源文件数量',
    });

    newMetrics.push({
      name: '慢资源数量',
      value: slowResources.length,
      unit: '个',
      threshold: 0,
      status: slowResources.length === 0 ? 'good' : slowResources.length < 5 ? 'warning' : 'poor',
      description: '加载时间超过 1 秒的资源',
    });

    // 步骤 3: 检测内存使用
    setTimeline(prev => [...prev, '检测内存使用情况...']);
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const memory = (performance as any).memory;
    if (memory) {
      const usedHeap = Math.round(memory.usedJSHeapSize / 1024 / 1024);
      const totalHeap = Math.round(memory.totalJSHeapSize / 1024 / 1024);
      
      newMetrics.push({
        name: 'JS 堆内存使用',
        value: usedHeap,
        unit: 'MB',
        threshold: 100,
        status: usedHeap < 100 ? 'good' : usedHeap < 200 ? 'warning' : 'poor',
        description: 'JavaScript 堆内存使用量',
      });
    }

    // 步骤 4: 检测 DOM 节点
    setTimeline(prev => [...prev, '评估 DOM 渲染性能...']);
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const domNodes = document.getElementsByTagName('*').length;
    const domDepth = getMaxDomDepth(document.body);

    newMetrics.push({
      name: 'DOM 节点数',
      value: domNodes,
      unit: '个',
      threshold: 1500,
      status: domNodes < 1500 ? 'good' : domNodes < 3000 ? 'warning' : 'poor',
      description: '页面 DOM 元素总数',
    });

    newMetrics.push({
      name: 'DOM 最大深度',
      value: domDepth,
      unit: '层',
      threshold: 32,
      status: domDepth < 32 ? 'good' : domDepth < 50 ? 'warning' : 'poor',
      description: 'DOM 树的最大嵌套深度',
    });

    // 步骤 5: 检测事件监听器
    setTimeline(prev => [...prev, '检查事件监听器...']);
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const eventListeners = countEventListeners();
    
    newMetrics.push({
      name: '事件监听器数',
      value: eventListeners,
      unit: '个',
      threshold: 100,
      status: eventListeners < 100 ? 'good' : eventListeners < 200 ? 'warning' : 'poor',
      description: '页面绑定的事件监听器数量',
    });

    setMetrics(newMetrics);
    setTimeline(prev => [...prev, '性能检测完成！']);
    setLoading(false);
  }, []);

  // 获取 DOM 最大深度
  const getMaxDomDepth = (element: Element, depth = 1): number => {
    const children = element.children;
    if (children.length === 0) return depth;
    let maxDepth = depth;
    for (let i = 0; i < children.length; i++) {
      maxDepth = Math.max(maxDepth, getMaxDomDepth(children[i], depth + 1));
    }
    return maxDepth;
  };

  // 估算事件监听器数量
  const countEventListeners = (): number => {
    const allElements = document.querySelectorAll('*');
    let count = 0;
    // 这是一个估算值，实际数量需要更复杂的检测
    allElements.forEach(el => {
      count += (el as any)._events ? Object.keys((el as any)._events).length : 0;
    });
    return count || allElements.length * 2; // 估算值
  };

  // 监听真实的 Web Vitals
  useEffect(() => {
    if ('PerformanceObserver' in window) {
      // 监听 LCP
      const lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1] as any;
        setRealTimeMetrics(prev => ({ ...prev, lcp: Math.round(lastEntry.startTime) }));
      });
      lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] as any });

      // 监听 CLS
      let clsValue = 0;
      const clsObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (!(entry as any).hadRecentInput) {
            clsValue += (entry as any).value;
          }
        }
        setRealTimeMetrics(prev => ({ ...prev, cls: parseFloat(clsValue.toFixed(3)) }));
      });
      clsObserver.observe({ entryTypes: ['layout-shift'] as any });

      // 监听 FID
      const fidObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          const delay = (entry as any).processingStart - entry.startTime;
          setRealTimeMetrics(prev => ({ ...prev, fid: Math.round(delay) }));
        }
      });
      fidObserver.observe({ entryTypes: ['first-input'] as any });

      // 监听 FCP
      const fcpObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.name === 'first-contentful-paint') {
            setRealTimeMetrics(prev => ({ ...prev, fcp: Math.round(entry.startTime) }));
          }
        }
      });
      fcpObserver.observe({ entryTypes: ['paint'] as any });

      return () => {
        lcpObserver.disconnect();
        clsObserver.disconnect();
        fidObserver.disconnect();
        fcpObserver.disconnect();
      };
    }
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'good': return 'success';
      case 'warning': return 'warning';
      case 'poor': return 'error';
      default: return 'default';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'good': return <CheckCircleOutlined style={{ color: '#52c41a' }} />;
      case 'warning': return <WarningOutlined style={{ color: '#faad14' }} />;
      case 'poor': return <CloseCircleOutlined style={{ color: '#f5222d' }} />;
      default: return null;
    }
  };

  const getOverallScore = () => {
    if (metrics.length === 0) return 0;
    const scores = metrics.map(m => {
      if (m.status === 'good') return 100;
      if (m.status === 'warning') return 70;
      return 40;
    });
    return Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
  };

  const copyCode = () => {
    navigator.clipboard.writeText(selectedCode.code);
    // message.success('代码已复制');
  };

  return (
    <>
      <SEO {...seoConfig} />
      <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
        <div>
          <Title level={2}>
            <BarChartOutlined /> 前端性能检测
          </Title>
          <Paragraph type="secondary">
            基于 Performance API 和 Web Vitals 标准，实时检测页面加载性能、渲染效率和用户体验指标
          </Paragraph>
        </div>
        <Button 
          type="primary" 
          icon={<CodeOutlined />}
          onClick={() => setCodePanelVisible(!codePanelVisible)}
          size="large"
        >
          {codePanelVisible ? '隐藏检测代码' : '查看检测代码'}
        </Button>
      </div>

      {/* 实时 Web Vitals 指标 */}
      <Row gutter={24} style={{ marginBottom: 24 }}>
        <Col span={4}>
          <Card size="small">
            <Statistic 
              title="LCP" 
              value={realTimeMetrics.lcp} 
              suffix="ms" 
              valueStyle={{ fontSize: 20, color: realTimeMetrics.lcp < 2500 ? '#52c41a' : realTimeMetrics.lcp < 4000 ? '#faad14' : '#f5222d' }}
            />
          </Card>
        </Col>
        <Col span={4}>
          <Card size="small">
            <Statistic 
              title="CLS" 
              value={realTimeMetrics.cls} 
              suffix="" 
              valueStyle={{ fontSize: 20, color: realTimeMetrics.cls < 0.1 ? '#52c41a' : realTimeMetrics.cls < 0.25 ? '#faad14' : '#f5222d' }}
            />
          </Card>
        </Col>
        <Col span={4}>
          <Card size="small">
            <Statistic 
              title="FID" 
              value={realTimeMetrics.fid} 
              suffix="ms" 
              valueStyle={{ fontSize: 20, color: realTimeMetrics.fid < 100 ? '#52c41a' : realTimeMetrics.fid < 300 ? '#faad14' : '#f5222d' }}
            />
          </Card>
        </Col>
        <Col span={4}>
          <Card size="small">
            <Statistic 
              title="FCP" 
              value={realTimeMetrics.fcp} 
              suffix="ms" 
              valueStyle={{ fontSize: 20, color: realTimeMetrics.fcp < 1800 ? '#52c41a' : realTimeMetrics.fcp < 3000 ? '#faad14' : '#f5222d' }}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card size="small">
            <div style={{ textAlign: 'center' }}>
              <Button 
                type="primary" 
                icon={<PlayCircleOutlined />} 
                onClick={runRealPerformanceCheck}
                loading={loading}
                size="large"
              >
                {loading ? '检测中...' : '开始全面检测'}
              </Button>
              <Button 
                icon={<ReloadOutlined />} 
                onClick={() => { setMetrics([]); setTimeline([]); }}
                style={{ marginLeft: 8 }}
                size="large"
              >
                重置
              </Button>
            </div>
          </Card>
        </Col>
      </Row>

      {/* 综合评分 */}
      {metrics.length > 0 && (
        <Row gutter={24} style={{ marginBottom: 24 }}>
          <Col span={8}>
            <Card>
              <Statistic
                title="综合评分"
                value={getOverallScore()}
                suffix="/ 100"
                valueStyle={{ color: getOverallScore() >= 80 ? '#52c41a' : getOverallScore() >= 60 ? '#faad14' : '#f5222d' }}
              />
              <Progress
                percent={getOverallScore()}
                status={getOverallScore() >= 80 ? 'success' : getOverallScore() >= 60 ? 'normal' : 'exception'}
                style={{ marginTop: 16 }}
              />
            </Card>
          </Col>
          <Col span={8}>
            <Card>
              <Statistic
                title="检测项目"
                value={metrics.length}
                suffix="项"
              />
              <div style={{ marginTop: 16 }}>
                <Tag color="success">优秀 {metrics.filter(m => m.status === 'good').length}</Tag>
                <Tag color="warning">警告 {metrics.filter(m => m.status === 'warning').length}</Tag>
                <Tag color="error">需优化 {metrics.filter(m => m.status === 'poor').length}</Tag>
              </div>
            </Card>
          </Col>
          <Col span={8}>
            <Card>
              <Statistic
                title="检测状态"
                value={loading ? '检测中' : metrics.length > 0 ? '已完成' : '未开始'}
                valueStyle={{ color: loading ? '#1890ff' : metrics.length > 0 ? '#52c41a' : '#999' }}
              />
              <div style={{ marginTop: 16 }}>
                <Button 
                  icon={<ReloadOutlined />} 
                  onClick={() => { setMetrics([]); setTimeline([]); }}
                  block
                >
                  重置检测
                </Button>
              </div>
            </Card>
          </Col>
        </Row>
      )}

      {/* 检测进度 */}
      {timeline.length > 0 && (
        <Card title="检测进度" style={{ marginBottom: 24 }}>
          <Timeline
            items={timeline.map((item, index) => ({
              children: item,
              color: index === timeline.length - 1 && !loading ? 'green' : 'blue',
            }))}
          />
        </Card>
      )}

      {/* 性能指标详情 */}
      {metrics.length > 0 && (
        <Card title="性能指标详情" style={{ marginBottom: 24 }}>
          <List
            grid={{ gutter: 16, xs: 1, sm: 2, lg: 3 }}
            dataSource={metrics}
            renderItem={(metric) => (
              <List.Item>
                <Card
                  size="small"
                  title={
                    <Space>
                      {getStatusIcon(metric.status)}
                      <span>{metric.name}</span>
                    </Space>
                  }
                  extra={<Tag color={getStatusColor(metric.status)}>{metric.value}{metric.unit}</Tag>}
                >
                  <Paragraph type="secondary" style={{ fontSize: 12 }}>
                    {metric.description}
                  </Paragraph>
                  <div style={{ marginTop: 8 }}>
                    <span style={{ fontSize: 12, color: '#999' }}>
                      阈值: {metric.threshold}{metric.unit}
                    </span>
                  </div>
                </Card>
              </List.Item>
            )}
          />
        </Card>
      )}

      {/* 代码示例面板 */}
      {codePanelVisible && (
        <Card title="性能检测代码示例" style={{ marginBottom: 24 }}>
          <Row gutter={24}>
            <Col span={6}>
              <List
                size="small"
                dataSource={codeExamples}
                renderItem={(item) => (
                  <List.Item 
                    style={{ 
                      cursor: 'pointer',
                      background: selectedCode.title === item.title ? '#e6f7ff' : 'transparent',
                      borderLeft: selectedCode.title === item.title ? '3px solid #1890ff' : '3px solid transparent',
                    }}
                    onClick={() => setSelectedCode(item)}
                  >
                    <div>
                      <div style={{ fontWeight: 'bold' }}>{item.title}</div>
                      <div style={{ fontSize: 12, color: '#999' }}>{item.description}</div>
                    </div>
                  </List.Item>
                )}
              />
            </Col>
            <Col span={18}>
              <Card 
                size="small" 
                title={selectedCode.title}
                extra={
                  <Button icon={<CopyOutlined />} size="small" onClick={copyCode}>
                    复制
                  </Button>
                }
              >
                <Editor
                  height={400}
                  language="typescript"
                  value={selectedCode.code}
                  options={{
                    minimap: { enabled: false },
                    fontSize: 14,
                    lineNumbers: 'on',
                    readOnly: true,
                    automaticLayout: true,
                  }}
                />
              </Card>
            </Col>
          </Row>
        </Card>
      )}

      <Alert
        message="优化建议"
        description={
          <ul>
            <li>优化图片加载：使用 WebP 格式，实现懒加载，压缩图片大小</li>
            <li>减少 JavaScript 体积：代码分割，移除未使用代码，Tree Shaking</li>
            <li>使用 CDN 加速静态资源加载，启用 HTTP/2</li>
            <li>启用 Gzip/Brotli 压缩，减少传输体积</li>
            <li>优化关键渲染路径：内联关键 CSS，延迟加载非关键资源</li>
            <li>使用 Service Worker 缓存静态资源，实现离线访问</li>
            <li>避免内存泄漏：及时移除事件监听器，清理定时器</li>
          </ul>
        }
        type="info"
        showIcon
        style={{ marginTop: 24 }}
      />
    </div>
    </>
  );
};

export default PerfCheck;
