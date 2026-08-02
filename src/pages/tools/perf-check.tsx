import React, { useState, useEffect, useCallback } from 'react';
import { Card, Button, Progress, Statistic, Row, Col, Typography, List, Tag, Timeline, Alert, Space } from 'antd';
import { BarChartOutlined, PlayCircleOutlined, ReloadOutlined, CheckCircleOutlined, WarningOutlined, CloseCircleOutlined } from '@ant-design/icons';

const { Title, Paragraph } = Typography;

interface PerfMetric {
  name: string;
  value: number;
  unit: string;
  threshold: number;
  status: 'good' | 'warning' | 'poor';
  description: string;
}

const PerfCheck: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [metrics, setMetrics] = useState<PerfMetric[]>([]);
  const [timeline, setTimeline] = useState<string[]>([]);

  const runPerformanceCheck = useCallback(async () => {
    setLoading(true);
    setTimeline(['开始性能检测...']);

    // 模拟性能检测过程
    const steps = [
      '检测页面加载时间...',
      '分析 DOM 渲染性能...',
      '检查资源加载情况...',
      '评估 JavaScript 执行效率...',
      '检测内存使用情况...',
      '生成性能报告...',
    ];

    for (let i = 0; i < steps.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 800));
      setTimeline(prev => [...prev, steps[i]]);
    }

    // 模拟性能指标
    const mockMetrics: PerfMetric[] = [
      {
        name: '首次内容绘制 (FCP)',
        value: 1.2,
        unit: 's',
        threshold: 1.8,
        status: 'good',
        description: '浏览器首次绘制任何文本、图像的时间',
      },
      {
        name: '最大内容绘制 (LCP)',
        value: 2.5,
        unit: 's',
        threshold: 2.5,
        status: 'warning',
        description: '视口中最大的图像或文本块渲染时间',
      },
      {
        name: '首次输入延迟 (FID)',
        value: 12,
        unit: 'ms',
        threshold: 100,
        status: 'good',
        description: '用户首次交互到浏览器响应的时间',
      },
      {
        name: '累积布局偏移 (CLS)',
        value: 0.15,
        unit: '',
        threshold: 0.1,
        status: 'poor',
        description: '页面布局的意外偏移量',
      },
      {
        name: '总阻塞时间 (TBT)',
        value: 180,
        unit: 'ms',
        threshold: 200,
        status: 'good',
        description: 'FCP 和 TTI 之间的总阻塞时间',
      },
      {
        name: '可交互时间 (TTI)',
        value: 3.8,
        unit: 's',
        threshold: 3.8,
        status: 'warning',
        description: '页面完全可交互的时间',
      },
    ];

    setMetrics(mockMetrics);
    setTimeline(prev => [...prev, '性能检测完成！']);
    setLoading(false);
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

  return (
    <div>
      <Title level={2}>
        <BarChartOutlined /> 前端性能检测
      </Title>
      <Paragraph type="secondary">
        基于 Core Web Vitals 标准，检测页面加载性能、渲染效率和用户体验指标
      </Paragraph>

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
            <Button
              type="primary"
              icon={<PlayCircleOutlined />}
              onClick={runPerformanceCheck}
              loading={loading}
              block
              size="large"
              style={{ marginBottom: 12 }}
            >
              {loading ? '检测中...' : '开始检测'}
            </Button>
            <Button
              icon={<ReloadOutlined />}
              onClick={() => { setMetrics([]); setTimeline([]); }}
              block
            >
              重置
            </Button>
          </Card>
        </Col>
      </Row>

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

      {metrics.length > 0 && (
        <Card title="性能指标详情">
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

      <Alert
        message="优化建议"
        description={
          <ul>
            <li>优化图片加载：使用 WebP 格式，实现懒加载</li>
            <li>减少 JavaScript 体积：代码分割，移除未使用代码</li>
            <li>使用 CDN 加速静态资源加载</li>
            <li>启用 Gzip/Brotli 压缩</li>
            <li>优化关键渲染路径</li>
          </ul>
        }
        type="info"
        showIcon
        style={{ marginTop: 24 }}
      />
    </div>
  );
};

export default PerfCheck;
