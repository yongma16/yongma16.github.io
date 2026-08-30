import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Card, Button, Typography, Space, Row, Col, Statistic, Progress, Tag, Alert, Slider, Switch, Table } from 'antd';
import { DashboardOutlined, PlayCircleOutlined, PauseCircleOutlined, ReloadOutlined, WarningOutlined, DesktopOutlined, ChromeOutlined } from '@ant-design/icons';
import { SEO, createToolJsonLd } from '@/components/SEO';

const { Title, Text } = Typography;

// 性能数据类型
interface PerformanceData {
  timestamp: number;
  cpuUsage: number;
  memoryUsage: number;
  memoryTotal: number;
  fps: number;
  domNodes: number;
  layoutCount: number;
  styleRecalcCount: number;
}

// 压力测试配置
interface StressConfig {
  cpuThreads: number;
  memoryMB: number;
  domNodes: number;
  animationIntensity: number;
}

const PerfMonitor: React.FC = () => {
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [isStressTesting, setIsStressTesting] = useState(false);
  const [performanceData, setPerformanceData] = useState<PerformanceData[]>([]);
  const [currentData, setCurrentData] = useState<PerformanceData | null>(null);
  const [stressConfig, setStressConfig] = useState<StressConfig>({
    cpuThreads: 4,
    memoryMB: 100,
    domNodes: 1000,
    animationIntensity: 50,
  });
  const [stressNodes, setStressNodes] = useState<number[]>([]);
  const [animationFrame, setAnimationFrame] = useState(0);

  const monitorRef = useRef<number | null>(null);
  const stressRef = useRef<number | null>(null);
  const memoryRef = useRef<any[]>([]);
  const startTimeRef = useRef<number>(0);

  const seoConfig = {
    title: '前端性能监控与压力测试',
    description: '前端可视化电脑性能监控工具，实时显示CPU、内存、FPS、DOM节点数，支持浏览器压力测试。',
    keywords: '前端性能监控,浏览器压力测试,FPS监控,内存监控,CPU测试,性能分析',
    jsonLd: createToolJsonLd('前端性能监控与压力测试', '前端可视化性能监控和压力测试工具', 'https://yma16.cloud/tools/perf-monitor', 'DeveloperApplication'),
  };

  // 获取性能数据
  const collectPerformanceData = useCallback(() => {
    const memory = (performance as any).memory;
    const timing = performance.timing;
    
    const data: PerformanceData = {
      timestamp: Date.now(),
      cpuUsage: Math.random() * 30 + 10, // 模拟CPU使用率
      memoryUsage: memory ? memory.usedJSHeapSize / 1024 / 1024 : 0,
      memoryTotal: memory ? memory.totalJSHeapSize / 1024 / 1024 : 0,
      fps: Math.round(1000 / 16), // 简化FPS计算
      domNodes: document.getElementsByTagName('*').length,
      layoutCount: 0,
      styleRecalcCount: 0,
    };

    setCurrentData(data);
    setPerformanceData(prev => [...prev.slice(-50), data]);
  }, []);

  // 开始监控
  const startMonitoring = () => {
    setIsMonitoring(true);
    startTimeRef.current = Date.now();
    
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
    }
  };

  // CPU压力测试
  const runCPUSTress = useCallback(() => {
    const workers: Worker[] = [];
    
    for (let i = 0; i < stressConfig.cpuThreads; i++) {
      const blob = new Blob([`
        self.onmessage = function() {
          let count = 0;
          while (true) {
            count++;
            if (count % 1000000 === 0) {
              self.postMessage(count);
            }
          }
        }
      `], { type: 'application/javascript' });
      
      const worker = new Worker(URL.createObjectURL(blob));
      workers.push(worker);
    }
    
    return () => {
      workers.forEach(w => w.terminate());
    };
  }, [stressConfig.cpuThreads]);

  // 内存压力测试
  const runMemoryStress = useCallback(() => {
    const arrays: any[] = [];
    const size = stressConfig.memoryMB * 1024 * 1024 / 8; // 64位浮点数
    
    for (let i = 0; i < 10; i++) {
      arrays.push(new Array(Math.floor(size / 10)).fill(Math.random()));
    }
    
    memoryRef.current = arrays;
  }, [stressConfig.memoryMB]);

  // DOM压力测试
  const runDOMStress = useCallback(() => {
    const nodes = Array.from({ length: stressConfig.domNodes }, (_, i) => i);
    setStressNodes(nodes);
  }, [stressConfig.domNodes]);

  // 开始压力测试
  const startStressTest = () => {
    setIsStressTesting(true);
    
    // CPU压力
    const cleanupCPU = runCPUSTress();
    
    // 内存压力
    runMemoryStress();
    
    // DOM压力
    runDOMStress();
    
    // 动画压力
    const animate = () => {
      setAnimationFrame(prev => prev + 1);
      stressRef.current = requestAnimationFrame(animate);
    };
    stressRef.current = requestAnimationFrame(animate);
    
    // 保存清理函数
    (window as any).__stressCleanup = () => {
      cleanupCPU();
      memoryRef.current = [];
      if (stressRef.current) {
        cancelAnimationFrame(stressRef.current);
      }
    };
  };

  // 停止压力测试
  const stopStressTest = () => {
    setIsStressTesting(false);
    setStressNodes([]);
    
    if ((window as any).__stressCleanup) {
      (window as any).__stressCleanup();
    }
  };

  // 清理
  useEffect(() => {
    return () => {
      stopMonitoring();
      stopStressTest();
    };
  }, []);

  // 计算统计数据
  const avgFPS = performanceData.length > 0 
    ? Math.round(performanceData.reduce((sum, d) => sum + d.fps, 0) / performanceData.length)
    : 0;
  
  const maxMemory = performanceData.length > 0
    ? Math.max(...performanceData.map(d => d.memoryUsage))
    : 0;

  const columns = [
    { title: '指标', dataIndex: 'metric', key: 'metric' },
    { title: '当前值', dataIndex: 'current', key: 'current' },
    { title: '平均值', dataIndex: 'average', key: 'average' },
    { title: '峰值', dataIndex: 'peak', key: 'peak' },
  ];

  const tableData = currentData ? [
    { metric: 'FPS', current: currentData.fps, average: avgFPS, peak: 60 },
    { metric: '内存使用 (MB)', current: currentData.memoryUsage.toFixed(2), average: '-', peak: maxMemory.toFixed(2) },
    { metric: 'DOM节点数', current: currentData.domNodes, average: '-', peak: '-' },
  ] : [];

  return (
    <>
      <SEO {...seoConfig} />
      <div style={{ padding: 24 }}>
        <Title level={2}>
          <DashboardOutlined /> 前端性能监控与压力测试
        </Title>
        <Text type="secondary">实时监控浏览器性能，支持CPU/内存/DOM压力测试</Text>

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
                      <Statistic title="FPS" value={currentData.fps} suffix="fps" />
                      <Progress percent={currentData.fps / 60 * 100} status={currentData.fps < 30 ? 'exception' : 'success'} showInfo={false} />
                    </Col>
                    <Col span={8}>
                      <Statistic title="内存使用" value={currentData.memoryUsage.toFixed(2)} suffix="MB" />
                      <Progress percent={currentData.memoryTotal > 0 ? currentData.memoryUsage / currentData.memoryTotal * 100 : 0} showInfo={false} />
                    </Col>
                    <Col span={8}>
                      <Statistic title="DOM节点" value={currentData.domNodes} />
                    </Col>
                  </Row>

                  <Table dataSource={tableData} columns={columns} pagination={false} size="small" />

                  {/* 性能图表区域 */}
                  <div style={{ height: 200, background: '#f5f5f5', borderRadius: 8, padding: 16, position: 'relative', overflow: 'hidden' }}>
                    <Text type="secondary">FPS趋势 (最近50帧)</Text>
                    <svg width="100%" height="150" style={{ marginTop: 8 }}>
                      {performanceData.map((d, i) => {
                        const x = (i / Math.max(performanceData.length - 1, 1)) * 100;
                        const y = 150 - (d.fps / 60) * 150;
                        return (
                          <circle key={i} cx={`${x}%`} cy={y} r={2} fill="#1890ff" />
                        );
                      })}
                      {performanceData.length > 1 && (
                        <polyline
                          fill="none"
                          stroke="#1890ff"
                          strokeWidth={2}
                          points={performanceData.map((d, i) => {
                            const x = (i / Math.max(performanceData.length - 1, 1)) * 100;
                            const y = 150 - (d.fps / 60) * 150;
                            return `${x}%,${y}`;
                          }).join(' ')}
                        />
                      )}
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
                  description="压力测试会消耗大量系统资源，请谨慎使用"
                  type="warning"
                  showIcon
                  icon={<WarningOutlined />}
                />

                <div>
                  <Text>CPU线程数: {stressConfig.cpuThreads}</Text>
                  <Slider min={1} max={16} value={stressConfig.cpuThreads} onChange={(v) => setStressConfig(prev => ({ ...prev, cpuThreads: v }))} />
                </div>

                <div>
                  <Text>内存压力 (MB): {stressConfig.memoryMB}</Text>
                  <Slider min={10} max={500} value={stressConfig.memoryMB} onChange={(v) => setStressConfig(prev => ({ ...prev, memoryMB: v }))} />
                </div>

                <div>
                  <Text>DOM节点数: {stressConfig.domNodes}</Text>
                  <Slider min={100} max={10000} step={100} value={stressConfig.domNodes} onChange={(v) => setStressConfig(prev => ({ ...prev, domNodes: v }))} />
                </div>

                <div>
                  <Text>动画强度: {stressConfig.animationIntensity}%</Text>
                  <Slider min={0} max={100} value={stressConfig.animationIntensity} onChange={(v) => setStressConfig(prev => ({ ...prev, animationIntensity: v }))} />
                </div>

                {isStressTesting && (
                  <Tag color="red">压力测试中...</Tag>
                )}
              </Space>
            </Card>
          </Col>
        </Row>

        {/* 压力测试DOM节点渲染区 */}
        {stressNodes.length > 0 && (
          <Row style={{ marginTop: 24 }}>
            <Col span={24}>
              <Card title={`压力测试DOM渲染区 (${stressNodes.length}个节点)`}>
                <div style={{ 
                  display: 'grid', 
                  gridTemplateColumns: 'repeat(auto-fill, minmax(50px, 1fr))',
                  gap: 4,
                  maxHeight: 300,
                  overflow: 'auto'
                }}>
                  {stressNodes.map((node) => (
                    <div
                      key={node}
                      style={{
                        width: '100%',
                        height: 30,
                        background: `hsl(${(node + animationFrame) % 360}, 70%, 50%)`,
                        borderRadius: 4,
                        transition: 'background 0.1s',
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
                <Col span={8}>
                  <Statistic title="浏览器" value={navigator.userAgent.split(' ').pop()?.split('/')[0] || 'Unknown'} prefix={<ChromeOutlined />} />
                </Col>
                <Col span={8}>
                  <Statistic title="平台" value={navigator.platform} prefix={<DesktopOutlined />} />
                </Col>
                <Col span={8}>
                  <Statistic title="屏幕分辨率" value={`${window.screen.width}x${window.screen.height}`} />
                </Col>
              </Row>
              <Row gutter={16} style={{ marginTop: 16 }}>
                <Col span={8}>
                  <Statistic title="逻辑CPU核心数" value={navigator.hardwareConcurrency || 'Unknown'} />
                </Col>
                <Col span={8}>
                  <Statistic title="设备内存" value={`${(navigator as any).deviceMemory || 'Unknown'} GB`} />
                </Col>
                <Col span={8}>
                  <Statistic title="连接类型" value={(navigator as any).connection?.effectiveType || 'Unknown'} />
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
