import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Card, Button, Typography, Space, Row, Col, Statistic, Progress, Tag, Alert, Slider, Table, Modal } from 'antd';
import { DashboardOutlined, PlayCircleOutlined, PauseCircleOutlined, ReloadOutlined, WarningOutlined, DesktopOutlined, ChromeOutlined, InfoCircleOutlined } from '@ant-design/icons';
import { SEO, createToolJsonLd } from '@/components/SEO';

const { Title, Text } = Typography;

// 性能数据类型
interface PerformanceData {
  timestamp: number;
  fps: number;
  memoryUsage: number;
  memoryTotal: number;
  domNodes: number;
}

// Worker管理器
class WorkerManager {
  private workers: Worker[] = [];
  private blobUrls: string[] = [];

  createWorkers(count: number): Worker[] {
    this.terminateAll();

    const workerScript = `
      self.onmessage = function(e) {
        if (e.data === 'stop') {
          self.close();
          return;
        }
        // CPU密集型计算：质数计算
        function isPrime(n) {
          if (n < 2) return false;
          for (let i = 2; i <= Math.sqrt(n); i++) {
            if (n % i === 0) return false;
          }
          return true;
        }
        
        let num = 2;
        let count = 0;
        while (true) {
          if (isPrime(num)) count++;
          num++;
          // 每1000个数字发送一次心跳，防止浏览器认为worker卡死
          if (num % 1000 === 0) {
            self.postMessage({ type: 'heartbeat', count: count });
          }
        }
      };
    `;

    for (let i = 0; i < count; i++) {
      const blob = new Blob([workerScript], { type: 'application/javascript' });
      const blobUrl = URL.createObjectURL(blob);
      this.blobUrls.push(blobUrl);
      const worker = new Worker(blobUrl);
      worker.postMessage('start');
      this.workers.push(worker);
    }

    return this.workers;
  }

  terminateAll() {
    this.workers.forEach(worker => {
      try {
        worker.postMessage('stop');
        worker.terminate();
      } catch (e) {
        // 忽略已终止的worker错误
      }
    });
    this.workers = [];

    this.blobUrls.forEach(url => {
      try {
        URL.revokeObjectURL(url);
      } catch (e) {
        // 忽略已释放的URL错误
      }
    });
    this.blobUrls = [];
  }
}

// WebGL压力测试管理器
class WebGLStressTester {
  private canvas: HTMLCanvasElement | null = null;
  private gl: WebGLRenderingContext | null = null;
  private animationId: number | null = null;

  start(container: HTMLElement) {
    this.dispose();

    this.canvas = document.createElement('canvas');
    this.canvas.width = 512;
    this.canvas.height = 512;
    this.canvas.style.width = '100%';
    this.canvas.style.height = '200px';
    container.appendChild(this.canvas);

    this.gl = this.canvas.getContext('webgl', { antialias: false });
    if (!this.gl) return;

    const gl = this.gl;

    // 创建着色器
    const vsSource = `
      attribute vec4 position;
      void main() {
        gl_Position = position;
      }
    `;
    const fsSource = `
      precision mediump float;
      uniform float time;
      void main() {
        vec2 uv = gl_FragCoord.xy / 512.0;
        float r = sin(uv.x * 10.0 + time) * 0.5 + 0.5;
        float g = sin(uv.y * 10.0 + time * 1.5) * 0.5 + 0.5;
        float b = sin((uv.x + uv.y) * 10.0 + time * 0.5) * 0.5 + 0.5;
        gl_FragColor = vec4(r, g, b, 1.0);
      }
    `;

    const compileShader = (source: string, type: number) => {
      const shader = gl.createShader(type)!;
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      return shader;
    };

    const program = gl.createProgram()!;
    gl.attachShader(program, compileShader(vsSource, gl.VERTEX_SHADER));
    gl.attachShader(program, compileShader(fsSource, gl.FRAGMENT_SHADER));
    gl.linkProgram(program);
    gl.useProgram(program);

    // 创建全屏三角形
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
      -1, -1, 1, -1, -1, 1,
      -1, 1, 1, -1, 1, 1
    ]), gl.STATIC_DRAW);

    const position = gl.getAttribLocation(program, 'position');
    gl.enableVertexAttribArray(position);
    gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);

    const timeUniform = gl.getUniformLocation(program, 'time');

    const render = (time: number) => {
      gl!.uniform1f(timeUniform, time * 0.001);
      gl!.drawArrays(gl!.TRIANGLES, 0, 6);
      this.animationId = requestAnimationFrame(render);
    };

    this.animationId = requestAnimationFrame(render);
  }

  dispose() {
    if (this.animationId !== null) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }

    if (this.gl) {
      const gl = this.gl;
      // 清理WebGL资源
      const numTextureUnits = gl.getParameter(gl.MAX_TEXTURE_IMAGE_UNITS);
      for (let unit = 0; unit < numTextureUnits; unit++) {
        gl.activeTexture(gl.TEXTURE0 + unit);
        gl.bindTexture(gl.TEXTURE_2D, null);
        gl.bindTexture(gl.TEXTURE_CUBE_MAP, null);
      }
      gl.bindBuffer(gl.ARRAY_BUFFER, null);
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
      gl.bindRenderbuffer(gl.RENDERBUFFER, null);
      gl.bindFramebuffer(gl.FRAMEBUFFER, null);

      // 丢失上下文以强制释放资源
      const ext = gl.getExtension('WEBGL_lose_context');
      if (ext) ext.loseContext();

      this.gl = null;
    }

    if (this.canvas && this.canvas.parentNode) {
      this.canvas.parentNode.removeChild(this.canvas);
      this.canvas = null;
    }
  }
}

const PerfMonitor: React.FC = () => {
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [isStressTesting, setIsStressTesting] = useState(false);
  const [performanceData, setPerformanceData] = useState<PerformanceData[]>([]);
  const [currentData, setCurrentData] = useState<PerformanceData | null>(null);
  const [stressConfig, setStressConfig] = useState({
    cpuThreads: 4,
    memoryMB: 100,
    domNodes: 1000,
    useWebGL: false,
  });
  const [stressNodes, setStressNodes] = useState<number[]>([]);
  const [animationFrame, setAnimationFrame] = useState(0);
  const [showWarning, setShowWarning] = useState(false);
  const [browserInfo, setBrowserInfo] = useState({
    isChrome: false,
    supportsMemory: false,
    userAgent: '',
  });

  const monitorRef = useRef<number | null>(null);
  const stressAnimationRef = useRef<number | null>(null);
  const memoryArraysRef = useRef<any[]>([]);
  const workerManagerRef = useRef(new WorkerManager());
  const webglTesterRef = useRef(new WebGLStressTester());
  const webglContainerRef = useRef<HTMLDivElement>(null);
  const fpsRef = useRef({ lastTime: 0, frames: 0, fps: 60 });

  const seoConfig = {
    title: '前端性能监控与压力测试',
    description: '前端可视化电脑性能监控工具，实时显示FPS、内存、DOM节点数，支持浏览器压力测试。',
    keywords: '前端性能监控,浏览器压力测试,FPS监控,内存监控,CPU测试,性能分析',
    jsonLd: createToolJsonLd('前端性能监控与压力测试', '前端可视化性能监控和压力测试工具', 'https://yma16.cloud/tools/perf-monitor', 'DeveloperApplication'),
  };

  // 检测浏览器能力
  useEffect(() => {
    const ua = navigator.userAgent;
    const isChrome = /Chrome/.test(ua) && !/Edg/.test(ua);
    const supportsMemory = 'memory' in performance;

    setBrowserInfo({
      isChrome,
      supportsMemory,
      userAgent: ua,
    });
  }, []);

  // 计算FPS
  const calculateFPS = useCallback(() => {
    const now = performance.now();
    const { lastTime, frames } = fpsRef.current;

    if (lastTime === 0) {
      fpsRef.current.lastTime = now;
      return 60;
    }

    const newFrames = frames + 1;
    const delta = now - lastTime;

    if (delta >= 1000) {
      fpsRef.current.fps = Math.round((newFrames * 1000) / delta);
      fpsRef.current.frames = 0;
      fpsRef.current.lastTime = now;
    } else {
      fpsRef.current.frames = newFrames;
    }

    return fpsRef.current.fps;
  }, []);

  // 收集性能数据
  const collectPerformanceData = useCallback(() => {
    const memory = browserInfo.supportsMemory ? (performance as any).memory : null;
    const fps = calculateFPS();

    const data: PerformanceData = {
      timestamp: Date.now(),
      fps,
      memoryUsage: memory ? memory.usedJSHeapSize / 1024 / 1024 : 0,
      memoryTotal: memory ? memory.totalJSHeapSize / 1024 / 1024 : 0,
      domNodes: document.getElementsByTagName('*').length,
    };

    setCurrentData(data);
    setPerformanceData(prev => [...prev.slice(-60), data]);
  }, [browserInfo.supportsMemory, calculateFPS]);

  // 开始监控
  const startMonitoring = () => {
    setIsMonitoring(true);
    fpsRef.current = { lastTime: 0, frames: 0, fps: 60 };

    const monitor = () => {
      collectPerformanceData();
      monitorRef.current = requestAnimationFrame(monitor);
    };
    monitorRef.current = requestAnimationFrame(monitor);
  };

  // 停止监控
  const stopMonitoring = () => {
    setIsMonitoring(false);
    if (monitorRef.current) {
      cancelAnimationFrame(monitorRef.current);
      monitorRef.current = null;
    }
  };

  // 内存压力测试
  const runMemoryStress = useCallback(() => {
    // 先清理旧数组
    memoryArraysRef.current = [];

    const chunkSize = 1024 * 1024; // 1MB chunks
    const numChunks = stressConfig.memoryMB;

    try {
      for (let i = 0; i < numChunks; i++) {
        // 创建1MB的数组 (256k floats * 4 bytes)
        const arr = new Float64Array(1024 * 1024 / 8);
        // 填充数据防止被优化掉
        for (let j = 0; j < arr.length; j++) {
          arr[j] = Math.random();
        }
        memoryArraysRef.current.push(arr);
      }
    } catch (e) {
      message.warning('内存分配达到上限');
    }
  }, [stressConfig.memoryMB]);

  // 开始压力测试
  const startStressTest = () => {
    // 高强度压测警告
    const totalIntensity = stressConfig.cpuThreads + stressConfig.memoryMB / 50 + stressConfig.domNodes / 500;
    if (totalIntensity > 20 || stressConfig.memoryMB > 300) {
      Modal.confirm({
        title: '⚠️ 高强度压力测试警告',
        content: (
          <Space direction="vertical">
            <Text>当前配置可能造成：</Text>
            <ul>
              <li>浏览器标签页卡死或崩溃</li>
              <li>系统内存不足</li>
              <li>CPU风扇高速运转</li>
              <li>其他标签页响应缓慢</li>
            </ul>
            <Text strong>建议先保存重要工作！</Text>
          </Space>
        ),
        okText: '我已了解，开始测试',
        okButtonProps: { danger: true },
        cancelText: '取消',
        onOk: () => performStressTest(),
      });
    } else {
      performStressTest();
    }
  };

  const performStressTest = () => {
    setIsStressTesting(true);
    setShowWarning(true);

    // 1. CPU压力 - 使用WebWorker
    workerManagerRef.current.createWorkers(stressConfig.cpuThreads);

    // 2. 内存压力
    runMemoryStress();

    // 3. DOM压力
    const nodes = Array.from({ length: stressConfig.domNodes }, (_, i) => i);
    setStressNodes(nodes);

    // 4. WebGL压力（可选）
    if (stressConfig.useWebGL && webglContainerRef.current) {
      webglTesterRef.current.start(webglContainerRef.current);
    }

    // 5. 动画循环
    const animate = () => {
      setAnimationFrame(prev => prev + 1);
      stressAnimationRef.current = requestAnimationFrame(animate);
    };
    stressAnimationRef.current = requestAnimationFrame(animate);
  };

  // 停止压力测试 - 必须完全释放资源
  const stopStressTest = useCallback(() => {
    setIsStressTesting(false);
    setShowWarning(false);
    setStressNodes([]);

    // 1. 终止所有Worker
    workerManagerRef.current.terminateAll();

    // 2. 释放内存数组
    memoryArraysRef.current = [];
    // 强制触发垃圾回收提示（不保证立即执行）
    if ((window as any).gc) {
      try { (window as any).gc(); } catch (e) { }
    }

    // 3. 清空DOM
    setStressNodes([]);

    // 4. 停止动画
    if (stressAnimationRef.current) {
      cancelAnimationFrame(stressAnimationRef.current);
      stressAnimationRef.current = null;
    }

    // 5. 释放WebGL资源
    webglTesterRef.current.dispose();

    // 6. 强制重绘以释放GPU资源
    document.body.style.transform = 'translateZ(0)';
    setTimeout(() => {
      document.body.style.transform = '';
    }, 100);

    message.success('压力测试已停止，资源已释放');
  }, []);

  // 组件卸载时清理所有资源
  useEffect(() => {
    return () => {
      stopMonitoring();
      stopStressTest();
    };
  }, [stopStressTest]);

  // 计算统计数据
  const avgFPS = performanceData.length > 0
    ? Math.round(performanceData.reduce((sum, d) => sum + d.fps, 0) / performanceData.length)
    : 0;

  const maxMemory = performanceData.length > 0
    ? Math.max(...performanceData.map(d => d.memoryUsage))
    : 0;

  const minFPS = performanceData.length > 0
    ? Math.min(...performanceData.map(d => d.fps))
    : 0;

  const columns = [
    { title: '指标', dataIndex: 'metric', key: 'metric' },
    { title: '当前', dataIndex: 'current', key: 'current' },
    { title: '平均', dataIndex: 'average', key: 'average' },
    { title: '最低', dataIndex: 'min', key: 'min' },
    { title: '状态', dataIndex: 'status', key: 'status' },
  ];

  const tableData = currentData ? [
    {
      metric: 'FPS',
      current: currentData.fps,
      average: avgFPS,
      min: minFPS,
      status: currentData.fps < 30 ? <Tag color="error">卡顿</Tag> : currentData.fps < 50 ? <Tag color="warning">一般</Tag> : <Tag color="success">流畅</Tag>,
    },
    {
      metric: '内存 (MB)',
      current: currentData.memoryUsage.toFixed(2),
      average: '-',
      min: '-',
      status: browserInfo.supportsMemory ? <Tag color="processing">已启用</Tag> : <Tag color="warning">不支持</Tag>,
    },
    {
      metric: 'DOM节点',
      current: currentData.domNodes,
      average: '-',
      min: '-',
      status: currentData.domNodes > 5000 ? <Tag color="warning">过多</Tag> : <Tag color="success">正常</Tag>,
    },
  ] : [];

  return (
    <>
      <SEO {...seoConfig} />
      <div style={{ padding: 24 }}>
        <Title level={2}>
          <DashboardOutlined /> 前端性能监控与压力测试
        </Title>
        <Text type="secondary">实时监控浏览器性能，支持CPU/内存/DOM/WebGL压力测试</Text>

        {/* 兼容性提示 */}
        {!browserInfo.supportsMemory && (
          <Alert
            style={{ marginTop: 16 }}
            message="内存监控不可用"
            description={
              <Text>
                当前浏览器不支持 performance.memory API。内存监控功能仅在 Chrome/Edge 浏览器中可用。
                建议切换到 Chrome 以获得完整的性能监控体验。
              </Text>
            }
            type="warning"
            showIcon
            icon={<InfoCircleOutlined />}
          />
        )}

        {/* 压力测试警告 */}
        {showWarning && (
          <Alert
            style={{ marginTop: 16 }}
            message="压力测试运行中"
            description="正在执行高强度压力测试，浏览器可能响应缓慢。点击停止测试按钮可立即释放所有资源。"
            type="error"
            showIcon
            icon={<WarningOutlined />}
          />
        )}

        <Row gutter={[24, 24]} style={{ marginTop: 24 }}>
          {/* 性能监控面板 */}
          <Col xs={24} lg={16}>
            <Card title="性能监控" extra={
              <Space>
                {isMonitoring ? (
                  <Button icon={<PauseCircleOutlined />} onClick={stopMonitoring} danger>停止监控</Button>
                ) : (
                  <Button type="primary" icon={<PlayCircleOutlined />} onClick={startMonitoring}>开始监控</Button>
                )}
                <Button icon={<ReloadOutlined />} onClick={() => setPerformanceData([])}>重置数据</Button>
              </Space>
            }>
              {currentData ? (
                <Space direction="vertical" style={{ width: '100%' }} size="large">
                  <Row gutter={16}>
                    <Col span={8}>
                      <Statistic
                        title="FPS"
                        value={currentData.fps}
                        suffix="fps"
                        valueStyle={{ color: currentData.fps < 30 ? '#ff4d4f' : currentData.fps < 50 ? '#faad14' : '#52c41a' }}
                      />
                      <Progress
                        percent={Math.min(currentData.fps / 60 * 100, 100)}
                        status={currentData.fps < 30 ? 'exception' : 'success'}
                        showInfo={false}
                      />
                    </Col>
                    <Col span={8}>
                      <Statistic
                        title="内存使用"
                        value={currentData.memoryUsage.toFixed(2)}
                        suffix="MB"
                      />
                      {browserInfo.supportsMemory && (
                        <Progress
                          percent={currentData.memoryTotal > 0 ? Math.min(currentData.memoryUsage / currentData.memoryTotal * 100, 100) : 0}
                          showInfo={false}
                        />
                      )}
                    </Col>
                    <Col span={8}>
                      <Statistic title="DOM节点" value={currentData.domNodes} />
                    </Col>
                  </Row>

                  <Table dataSource={tableData} columns={columns} pagination={false} size="small" />

                  {/* FPS趋势图 */}
                  <div style={{ height: 200, background: '#f5f5f5', borderRadius: 8, padding: 16, position: 'relative' }}>
                    <Text type="secondary">FPS趋势 (最近60帧)</Text>
                    <svg width="100%" height="160" style={{ marginTop: 8 }}>
                      {/* 网格线 */}
                      {[0, 25, 50, 75, 100].map(pct => (
                        <line
                          key={pct}
                          x1="0"
                          y1={`${100 - pct}%`}
                          x2="100%"
                          y2={`${100 - pct}%`}
                          stroke="#ddd"
                          strokeDasharray="4"
                        />
                      ))}
                      {/* FPS线 */}
                      {performanceData.length > 1 && (
                        <polyline
                          fill="none"
                          stroke="#1890ff"
                          strokeWidth={2}
                          points={performanceData.map((d, i) => {
                            const x = (i / Math.max(performanceData.length - 1, 1)) * 100;
                            const y = 100 - Math.min(d.fps / 60 * 100, 100);
                            return `${x}%,${y}%`;
                          }).join(' ')}
                        />
                      )}
                      {/* 数据点 */}
                      {performanceData.map((d, i) => {
                        const x = (i / Math.max(performanceData.length - 1, 1)) * 100;
                        const y = 100 - Math.min(d.fps / 60 * 100, 100);
                        return (
                          <circle
                            key={i}
                            cx={`${x}%`}
                            cy={`${y}%`}
                            r={3}
                            fill={d.fps < 30 ? '#ff4d4f' : d.fps < 50 ? '#faad14' : '#1890ff'}
                          />
                        );
                      })}
                    </svg>
                  </div>
                </Space>
              ) : (
                <Alert message="点击开始监控按钮启动性能监控" type="info" showIcon />
              )}
            </Card>
          </Col>

          {/* 压力测试配置 */}
          <Col xs={24} lg={8}>
            <Card title="压力测试配置" extra={
              <Space>
                {isStressTesting ? (
                  <Button icon={<PauseCircleOutlined />} onClick={stopStressTest} danger>停止测试</Button>
                ) : (
                  <Button type="primary" icon={<PlayCircleOutlined />} onClick={startStressTest}>开始测试</Button>
                )}
              </Space>
            }>
              <Space direction="vertical" style={{ width: '100%' }} size="middle">
                <Alert
                  message="警告"
                  description="压力测试会消耗大量系统资源，高强度测试可能导致浏览器卡死"
                  type="warning"
                  showIcon
                  icon={<WarningOutlined />}
                />

                <div>
                  <Text>CPU线程数: {stressConfig.cpuThreads}</Text>
                  <Slider
                    min={1}
                    max={16}
                    value={stressConfig.cpuThreads}
                    onChange={(v) => setStressConfig(prev => ({ ...prev, cpuThreads: v }))}
                    disabled={isStressTesting}
                  />
                </div>

                <div>
                  <Text>内存压力 (MB): {stressConfig.memoryMB}</Text>
                  <Slider
                    min={10}
                    max={500}
                    value={stressConfig.memoryMB}
                    onChange={(v) => setStressConfig(prev => ({ ...prev, memoryMB: v }))}
                    disabled={isStressTesting}
                  />
                </div>

                <div>
                  <Text>DOM节点数: {stressConfig.domNodes}</Text>
                  <Slider
                    min={100}
                    max={10000}
                    step={100}
                    value={stressConfig.domNodes}
                    onChange={(v) => setStressConfig(prev => ({ ...prev, domNodes: v }))}
                    disabled={isStressTesting}
                  />
                </div>

                <div>
                  <Space>
                    <Text>WebGL压力:</Text>
                    <Tag
                      color={stressConfig.useWebGL ? 'blue' : 'default'}
                      style={{ cursor: 'pointer' }}
                      onClick={() => !isStressTesting && setStressConfig(prev => ({ ...prev, useWebGL: !prev.useWebGL }))}
                    >
                      {stressConfig.useWebGL ? '开启' : '关闭'}
                    </Tag>
                  </Space>
                </div>

                {isStressTesting && (
                  <>
                    <Tag color="red">🔥 压力测试中...</Tag>
                    <Text type="secondary">Worker: {stressConfig.cpuThreads}个 | 内存: {stressConfig.memoryMB}MB | DOM: {stressConfig.domNodes}个</Text>
                  </>
                )}
              </Space>
            </Card>
          </Col>
        </Row>

        {/* WebGL渲染区 */}
        {isStressTesting && stressConfig.useWebGL && (
          <Row style={{ marginTop: 24 }}>
            <Col span={24}>
              <Card title="WebGL压力测试">
                <div ref={webglContainerRef} style={{ width: '100%', height: 200 }} />
              </Card>
            </Col>
          </Row>
        )}

        {/* DOM压力测试渲染区 */}
        {stressNodes.length > 0 && (
          <Row style={{ marginTop: 24 }}>
            <Col span={24}>
              <Card title={`DOM压力测试渲染区 (${stressNodes.length}个节点)`}>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(40px, 1fr))',
                  gap: 2,
                  maxHeight: 300,
                  overflow: 'auto',
                }}>
                  {stressNodes.map((node) => (
                    <div
                      key={node}
                      style={{
                        width: '100%',
                        height: 24,
                        background: `hsl(${(node * 37 + animationFrame * 2) % 360}, 70%, 50%)`,
                        borderRadius: 2,
                        transition: 'background 0.05s',
                      }}
                    />
                  ))}
                </div>
              </Card>
            </Col>
          </Row>
        )}

        {/* 浏览器信息 */}
        <Row style={{ marginTop: 24 }}>
          <Col span={24}>
            <Card title="浏览器环境信息">
              <Row gutter={16}>
                <Col span={6}>
                  <Statistic
                    title="浏览器"
                    value={browserInfo.isChrome ? 'Chrome' : 'Other'}
                    prefix={<ChromeOutlined />}
                  />
                </Col>
                <Col span={6}>
                  <Statistic title="平台" value={navigator.platform} prefix={<DesktopOutlined />} />
                </Col>
                <Col span={6}>
                  <Statistic title="屏幕分辨率" value={`${window.screen.width}x${window.screen.height}`} />
                </Col>
                <Col span={6}>
                  <Statistic
                    title="内存API"
                    value={browserInfo.supportsMemory ? '支持' : '不支持'}
                    valueStyle={{ color: browserInfo.supportsMemory ? '#52c41a' : '#ff4d4f' }}
                  />
                </Col>
              </Row>
              <Row gutter={16} style={{ marginTop: 16 }}>
                <Col span={6}>
                  <Statistic title="逻辑CPU核心" value={navigator.hardwareConcurrency || 'Unknown'} />
                </Col>
                <Col span={6}>
                  <Statistic title="设备内存" value={`${(navigator as any).deviceMemory || 'Unknown'} GB`} />
                </Col>
                <Col span={6}>
                  <Statistic title="连接类型" value={(navigator as any).connection?.effectiveType || 'Unknown'} />
                </Col>
                <Col span={6}>
                  <Statistic title="UserAgent" value={browserInfo.userAgent.slice(0, 30) + '...'} />
                </Col>
              </Row>
            </Card>
          </Col>
        </Row>
      </div>
    </>
  );
};

export default PerfMonitor;
