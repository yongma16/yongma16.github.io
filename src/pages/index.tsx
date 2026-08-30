import React from 'react';
import { history } from 'umi';
import { Card, Row, Col, Typography, Button, Badge, Tag, Statistic } from 'antd';
import { SEO, createWebsiteJsonLd } from '@/components/SEO';
import { SiteIcon } from '@/components/SiteIcon';
import {
  CodeOutlined,
  ToolOutlined,
  BarChartOutlined,
  FileImageOutlined,
  ArrowRightOutlined,
  ThunderboltOutlined,
  TeamOutlined,
  CloudUploadOutlined,
  GlobalOutlined,
  BgColorsOutlined,
  ScissorOutlined,
  SwapOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  LockOutlined,
  FileTextOutlined,
  DatabaseOutlined,
  FormatPainterOutlined,
  SafetyOutlined,
  CoffeeOutlined,
  QrcodeOutlined,
  BookOutlined,
  KeyOutlined,
  ColumnWidthOutlined,
  BugOutlined,
  DashboardOutlined,
} from '@ant-design/icons';

const { Title, Paragraph } = Typography;

// 工具列表 - 添加新工具只需在此数组中添加即可，数量会自动统计
const tools = [
  {
    title: '代码格式化',
    icon: <CodeOutlined style={{ fontSize: 32, color: '#1890ff' }} />,
    desc: '支持 Vue/React 代码格式化，Prettier 配置一键生成',
    path: '/tools/code-formatter',
    tags: ['免费'],
  },
  {
    title: '组件生成器',
    icon: <ToolOutlined style={{ fontSize: 32, color: '#52c41a' }} />,
    desc: '根据配置快速生成 React/Vue 组件代码模板',
    path: '/tools/component-gen',
    tags: ['免费'],
  },
  {
    title: '性能检测',
    icon: <BarChartOutlined style={{ fontSize: 32, color: '#faad14' }} />,
    desc: '前端性能分析工具，Lighthouse 报告生成',
    path: '/tools/perf-check',
    tags: ['免费'],
  },
  {
    title: 'SVG 处理',
    icon: <FileImageOutlined style={{ fontSize: 32, color: '#eb2f96' }} />,
    desc: 'SVG 压缩、转换、批量处理，图标库管理',
    path: '/tools/svg-processor',
    tags: ['免费', 'PRO'],
  },
  {
    title: 'URL 工具',
    icon: <GlobalOutlined style={{ fontSize: 32, color: '#722ed1' }} />,
    desc: 'URL 编解码、查询参数解析、Hash 路由参数识别',
    path: '/tools/url-tools',
    tags: ['免费'],
  },
  {
    title: '颜色选择器',
    icon: <BgColorsOutlined style={{ fontSize: 32, color: '#ff4d4f' }} />,
    desc: '拾色器取色、HEX/RGB/HSL 互相转换、颜色预览',
    path: '/tools/color-picker',
    tags: ['免费', 'NEW'],
  },
  {
    title: '图片裁剪',
    icon: <ScissorOutlined style={{ fontSize: 32, color: '#fa8c16' }} />,
    desc: '纯前端 Canvas 图片裁剪、旋转、导出下载',
    path: '/tools/image-cropper',
    tags: ['免费', 'NEW'],
  },
  {
    title: 'Base64 工具',
    icon: <SwapOutlined style={{ fontSize: 32, color: '#13c2c2' }} />,
    desc: '文本 Base64 编解码、图片与 Base64 互转',
    path: '/tools/base64-tool',
    tags: ['免费', 'NEW'],
  },
  {
    title: '时间戳转换',
    icon: <ClockCircleOutlined style={{ fontSize: 32, color: '#1890ff' }} />,
    desc: '时间戳与日期互相转换，支持多种格式',
    path: '/tools/timestamp-tool',
    tags: ['免费', 'NEW'],
  },
  {
    title: '正则测试',
    icon: <CheckCircleOutlined style={{ fontSize: 32, color: '#52c41a' }} />,
    desc: '正则表达式实时匹配、高亮显示、分组捕获',
    path: '/tools/regex-tester',
    tags: ['免费', 'NEW'],
  },
  {
    title: '哈希工具',
    icon: <LockOutlined style={{ fontSize: 32, color: '#eb2f96' }} />,
    desc: 'MD5/SHA1/SHA256 哈希计算，纯前端实现',
    path: '/tools/hash-tool',
    tags: ['免费'],
  },
  {
    title: 'JSON转TS',
    icon: <FileTextOutlined style={{ fontSize: 32, color: '#1890ff' }} />,
    desc: 'JSON自动推断生成TypeScript Interface类型',
    path: '/tools/json-to-ts',
    tags: ['免费', 'NEW'],
  },
  {
    title: 'Mock生成',
    icon: <DatabaseOutlined style={{ fontSize: 32, color: '#52c41a' }} />,
    desc: '快速生成模拟JSON测试数据',
    path: '/tools/mock-gen',
    tags: ['免费', 'NEW'],
  },
  {
    title: 'CSS格式化',
    icon: <FormatPainterOutlined style={{ fontSize: 32, color: '#faad14' }} />,
    desc: 'CSS代码格式化、压缩、美化',
    path: '/tools/css-formatter',
    tags: ['免费', 'NEW'],
  },
  {
    title: '字符串转义',
    icon: <SwapOutlined style={{ fontSize: 32, color: '#722ed1' }} />,
    desc: 'HTML/JS字符串Escape转义反转义',
    path: '/tools/string-escape',
    tags: ['免费', 'NEW'],
  },
  {
    title: '进制转换',
    icon: <SwapOutlined style={{ fontSize: 32, color: '#13c2c2' }} />,
    desc: '2/8/10/16进制互相转换',
    path: '/tools/radix-convert',
    tags: ['免费', 'NEW'],
  },
  {
    title: '命名转换',
    icon: <SwapOutlined style={{ fontSize: 32, color: '#ff4d4f' }} />,
    desc: '驼峰、下划线、短横线命名风格互转',
    path: '/tools/naming-convert',
    tags: ['免费', 'NEW'],
  },
  {
    title: '图片转换',
    icon: <FileImageOutlined style={{ fontSize: 32, color: '#fa8c16' }} />,
    desc: 'PNG/JPG/WebP格式转换，调节质量',
    path: '/tools/image-convert',
    tags: ['免费', 'NEW'],
  },
  {
    title: 'JWT解析',
    icon: <SafetyOutlined style={{ fontSize: 32, color: '#1890ff' }} />,
    desc: 'JWT Token解析Header、Payload、Signature',
    path: '/tools/jwt-parser',
    tags: ['免费', 'NEW'],
  },
  {
    title: 'Cookie解析',
    icon: <CoffeeOutlined style={{ fontSize: 32, color: '#eb2f96' }} />,
    desc: '解析Cookie字符串，查看属性和值',
    path: '/tools/cookie-parser',
    tags: ['免费', 'NEW'],
  },
  {
    title: '二维码工具',
    icon: <QrcodeOutlined style={{ fontSize: 32, color: '#52c41a' }} />,
    desc: '二维码生成和解析',
    path: '/tools/qrcode-tool',
    tags: ['免费', 'NEW'],
  },
  {
    title: '正则模板',
    icon: <BookOutlined style={{ fontSize: 32, color: '#722ed1' }} />,
    desc: '常用正则表达式模板库，一键复制',
    path: '/tools/regex-lib',
    tags: ['免费', 'NEW'],
  },
  {
    title: '随机字符串',
    icon: <KeyOutlined style={{ fontSize: 32, color: '#13c2c2' }} />,
    desc: '自定义字符集、长度、生成数量',
    path: '/tools/random-string',
    tags: ['免费', 'NEW'],
  },
  {
    title: '单位换算',
    icon: <ColumnWidthOutlined style={{ fontSize: 32, color: '#faad14' }} />,
    desc: 'CSS px/rem/em/vw/vh单位换算',
    path: '/tools/unit-convert',
    tags: ['免费', 'NEW'],
  },
  {
    title: 'AI调试',
    icon: <BugOutlined style={{ fontSize: 32, color: '#ff4d4f' }} />,
    desc: 'Mock流式模拟 + 真实API请求调试',
    path: '/tools/ai-debug',
    tags: ['免费', 'NEW'],
  },
  {
    title: '性能监控',
    icon: <DashboardOutlined style={{ fontSize: 32, color: '#1890ff' }} />,
    desc: '前端可视化性能监控与浏览器压力测试',
    path: '/tools/perf-monitor',
    tags: ['免费', 'NEW'],
  },
];

const features = [
  { icon: <ThunderboltOutlined />, title: '高效开发', desc: '一键生成代码，提升开发效率' },
  { icon: <TeamOutlined />, title: '团队协作', desc: '云端存储，团队成员共享配置' },
  { icon: <CloudUploadOutlined />, title: '批量导出', desc: '支持批量处理，导出多种格式' },
];

const HomePage: React.FC = () => {
  return (
    <>
      <SEO
        title="首页"
        description="yma16 前端开发工具集 - 提供代码格式化、组件生成器、性能检测、SVG处理、URL编解码等免费在线工具，提升前端开发效率。"
        keywords="前端工具,代码格式化,组件生成器,性能检测,SVG处理,URL编解码,颜色选择器,图片裁剪,Base64工具,时间戳转换,正则测试,哈希工具,在线工具,前端开发工具集"
        jsonLd={createWebsiteJsonLd()}
      />
      <div>
      {/* Hero Section */}
      <div style={{ textAlign: 'center', padding: '60px 0' }}>
        <Title level={1}>
          <SiteIcon size={48} style={{ marginRight: 16 }} />
          前端开发工具集
          <Tag color="blue" style={{ marginLeft: 12, fontSize: 14 }}>
            React + TypeScript
          </Tag>
        </Title>
        <Paragraph style={{ fontSize: 18, color: '#666', maxWidth: 700, margin: '24px auto' }}>
          基于 React + TypeScript + Umi 构建的前端工具集合。
          <br />
          提供代码格式化、组件生成、性能检测、SVG处理等开发工具。
        </Paragraph>
        <div style={{ marginTop: 32 }}>
          <Button
            type="primary"
            size="large"
            icon={<CodeOutlined />}
            onClick={() => history.push('/tools/code-formatter')}
          >
            开始使用
          </Button>
          <Button
            size="large"
            style={{ marginLeft: 16 }}
            icon={<ArrowRightOutlined />}
            onClick={() => history.push('/pricing')}
          >
            查看定价
          </Button>
        </div>
      </div>

      {/* Stats */}
      <Row gutter={24} style={{ marginBottom: 48 }}>
        <Col span={8}>
          <Card>
            <Statistic title="工具数量" value={tools.length} suffix="+" />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic title="CSDN 阅读量" value={10000} suffix="+" />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic title="技术文章" value={50} suffix="+" />
          </Card>
        </Col>
      </Row>

      {/* Tools Grid */}
      <Title level={2} style={{ textAlign: 'center', marginBottom: 32 }}>
        开发工具 <Tag color="blue">{tools.length}+</Tag>
      </Title>
      <Row gutter={[24, 24]} style={{ marginBottom: 48 }}>
        {tools.map((tool) => (
          <Col xs={24} sm={12} lg={6} key={tool.title}>
            <Card
              hoverable
              onClick={() => history.push(tool.path)}
              style={{ height: '100%', cursor: 'pointer' }}
            >
              <div style={{ textAlign: 'center', marginBottom: 16 }}>{tool.icon}</div>
              <Title level={4} style={{ textAlign: 'center', marginBottom: 8 }}>
                {tool.title}
              </Title>
              <Paragraph style={{ textAlign: 'center', color: '#666' }}>{tool.desc}</Paragraph>
              <div style={{ textAlign: 'center', marginTop: 12 }}>
                {tool.tags.map((tag) => (
                  <Tag key={tag} color={tag === 'PRO' ? 'gold' : 'green'}>
                    {tag}
                  </Tag>
                ))}
              </div>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Features */}
      <Title level={2} style={{ textAlign: 'center', marginBottom: 32 }}>
        功能特性
      </Title>
      <Row gutter={[24, 24]} style={{ marginBottom: 48 }}>
        {features.map((feature) => (
          <Col xs={24} sm={8} key={feature.title}>
            <Card style={{ textAlign: 'center', height: '100%' }}>
              <div style={{ fontSize: 36, color: '#1890ff', marginBottom: 16 }}>
                {feature.icon}
              </div>
              <Title level={4}>{feature.title}</Title>
              <Paragraph style={{ color: '#666' }}>{feature.desc}</Paragraph>
            </Card>
          </Col>
        ))}
      </Row>

      {/* CTA */}
      <Card style={{ textAlign: 'center', background: '#f0f5ff', border: 'none' }}>
        <Title level={3}>准备好提升开发效率了吗？</Title>
        <Paragraph style={{ fontSize: 16, marginBottom: 24 }}>
          基础功能完全免费，高级功能支持团队协作和云端存储
        </Paragraph>
        <Button
          type="primary"
          size="large"
          icon={<ArrowRightOutlined />}
          onClick={() => history.push('/pricing')}
        >
          查看定价方案
        </Button>
      </Card>
    </div>
    </>
  );
};

export default HomePage;
