import React from 'react';
import { history } from 'umi';
import { Card, Row, Col, Typography, Button, Badge, Tag, Statistic } from 'antd';
import { SEO, createWebsiteJsonLd } from '@/components/SEO';
import { SiteIcon } from '@/components/SiteIcon';
import { useI18n } from '@/i18n';
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
  PictureOutlined,
} from '@ant-design/icons';

const { Title, Paragraph } = Typography;

// 工具列表 - 使用翻译键名，实际文案从 i18n 获取
const tools = [
  {
    key: 'codeFormatter',
    icon: <CodeOutlined style={{ fontSize: 32, color: '#1890ff' }} />,
    path: '/tools/code-formatter',
    tags: ['free', 'new'],
  },
  {
    key: 'componentGen',
    icon: <ToolOutlined style={{ fontSize: 32, color: '#52c41a' }} />,
    path: '/tools/component-gen',
    tags: ['free', 'new'],
  },
  {
    key: 'perfCheck',
    icon: <BarChartOutlined style={{ fontSize: 32, color: '#faad14' }} />,
    path: '/tools/perf-check',
    tags: ['free'],
  },
  {
    key: 'svgProcessor',
    icon: <FileImageOutlined style={{ fontSize: 32, color: '#eb2f96' }} />,
    path: '/tools/svg-processor',
    tags: ['free', 'pro'],
  },
  {
    key: 'urlTools',
    icon: <GlobalOutlined style={{ fontSize: 32, color: '#722ed1' }} />,
    path: '/tools/url-tools',
    tags: ['free'],
  },
  {
    key: 'colorPicker',
    icon: <BgColorsOutlined style={{ fontSize: 32, color: '#ff4d4f' }} />,
    path: '/tools/color-picker',
    tags: ['free', 'new'],
  },
  {
    key: 'imageCropper',
    icon: <ScissorOutlined style={{ fontSize: 32, color: '#fa8c16' }} />,
    path: '/tools/image-cropper',
    tags: ['free', 'new'],
  },
  {
    key: 'base64Tool',
    icon: <SwapOutlined style={{ fontSize: 32, color: '#13c2c2' }} />,
    path: '/tools/base64-tool',
    tags: ['free', 'new'],
  },
  {
    key: 'timestampTool',
    icon: <ClockCircleOutlined style={{ fontSize: 32, color: '#1890ff' }} />,
    path: '/tools/timestamp-tool',
    tags: ['free', 'new'],
  },
  {
    key: 'regexTester',
    icon: <CheckCircleOutlined style={{ fontSize: 32, color: '#52c41a' }} />,
    path: '/tools/regex-tester',
    tags: ['free', 'new'],
  },
  {
    key: 'hashTool',
    icon: <LockOutlined style={{ fontSize: 32, color: '#eb2f96' }} />,
    path: '/tools/hash-tool',
    tags: ['free'],
  },
  {
    key: 'jsonToTs',
    icon: <FileTextOutlined style={{ fontSize: 32, color: '#1890ff' }} />,
    path: '/tools/json-to-ts',
    tags: ['free', 'new'],
  },
  {
    key: 'mockGen',
    icon: <DatabaseOutlined style={{ fontSize: 32, color: '#52c41a' }} />,
    path: '/tools/mock-gen',
    tags: ['free', 'new'],
  },
  {
    key: 'cssFormatter',
    icon: <FormatPainterOutlined style={{ fontSize: 32, color: '#faad14' }} />,
    path: '/tools/css-formatter',
    tags: ['free', 'new'],
  },
  {
    key: 'stringEscape',
    icon: <SwapOutlined style={{ fontSize: 32, color: '#722ed1' }} />,
    path: '/tools/string-escape',
    tags: ['free', 'new'],
  },
  {
    key: 'radixConvert',
    icon: <SwapOutlined style={{ fontSize: 32, color: '#13c2c2' }} />,
    path: '/tools/radix-convert',
    tags: ['free', 'new'],
  },
  {
    key: 'namingConvert',
    icon: <SwapOutlined style={{ fontSize: 32, color: '#ff4d4f' }} />,
    path: '/tools/naming-convert',
    tags: ['free', 'new'],
  },
  {
    key: 'imageConvert',
    icon: <FileImageOutlined style={{ fontSize: 32, color: '#fa8c16' }} />,
    path: '/tools/image-convert',
    tags: ['free', 'new'],
  },
  {
    key: 'jwtParser',
    icon: <SafetyOutlined style={{ fontSize: 32, color: '#1890ff' }} />,
    path: '/tools/jwt-parser',
    tags: ['free', 'new'],
  },
  {
    key: 'cookieParser',
    icon: <CoffeeOutlined style={{ fontSize: 32, color: '#eb2f96' }} />,
    path: '/tools/cookie-parser',
    tags: ['free', 'new'],
  },
  {
    key: 'qrcodeTool',
    icon: <QrcodeOutlined style={{ fontSize: 32, color: '#52c41a' }} />,
    path: '/tools/qrcode-tool',
    tags: ['free', 'new'],
  },
  {
    key: 'regexLib',
    icon: <BookOutlined style={{ fontSize: 32, color: '#722ed1' }} />,
    path: '/tools/regex-lib',
    tags: ['free', 'new'],
  },
  {
    key: 'randomString',
    icon: <KeyOutlined style={{ fontSize: 32, color: '#13c2c2' }} />,
    path: '/tools/random-string',
    tags: ['free', 'new'],
  },
  {
    key: 'unitConvert',
    icon: <ColumnWidthOutlined style={{ fontSize: 32, color: '#faad14' }} />,
    path: '/tools/unit-convert',
    tags: ['free', 'new'],
  },
  {
    key: 'aiDebug',
    icon: <BugOutlined style={{ fontSize: 32, color: '#ff4d4f' }} />,
    path: '/tools/ai-debug',
    tags: ['free', 'new'],
  },
  {
    key: 'perfMonitor',
    icon: <DashboardOutlined style={{ fontSize: 32, color: '#1890ff' }} />,
    path: '/tools/perf-monitor',
    tags: ['free', 'new'],
  },
  {
    key: 'curlConvert',
    icon: <ThunderboltOutlined style={{ fontSize: 32, color: '#fa8c16' }} />,
    path: '/tools/curl-convert',
    tags: ['free', 'new'],
  },
  {
    key: 'eslintConfig',
    icon: <FileTextOutlined style={{ fontSize: 32, color: '#52c41a' }} />,
    path: '/tools/eslint-config',
    tags: ['free', 'new'],
  },
  {
    key: 'playground',
    icon: <CodeOutlined style={{ fontSize: 32, color: '#eb2f96' }} />,
    path: '/tools/playground',
    tags: ['free', 'new'],
  },
  {
    key: 'faviconGenerator',
    icon: <PictureOutlined style={{ fontSize: 32, color: '#1890ff' }} />,
    path: '/tools/favicon-generator',
    tags: ['free', 'new'],
  },
];

const features = [
  { icon: <ThunderboltOutlined />, key: 'efficient' },
  { icon: <TeamOutlined />, key: 'teamwork' },
  { icon: <CloudUploadOutlined />, key: 'export' },
];

const HomePage: React.FC = () => {
  const { t } = useI18n();

  return (
    <>
      <SEO
        title={t('nav.home')}
        description="yma16 前端开发工具集 - 提供代码格式化、组件生成器、性能检测、SVG处理、URL编解码等免费在线工具，提升前端开发效率。"
        keywords="前端工具,代码格式化,组件生成器,性能检测,SVG处理,URL编解码,颜色选择器,图片裁剪,Base64工具,时间戳转换,正则测试,哈希工具,在线工具,前端开发工具集"
        jsonLd={createWebsiteJsonLd()}
      />
      <div>
      {/* Hero Section */}
      <div style={{ textAlign: 'center', padding: '60px 0' }}>
        <Title level={1}>
          <SiteIcon size={48} style={{ marginRight: 16 }} />
          {t('home.title')}
          <Tag color="blue" style={{ marginLeft: 12, fontSize: 14 }}>
            React + TypeScript
          </Tag>
        </Title>
        <Paragraph style={{ fontSize: 18, color: '#666', maxWidth: 700, margin: '24px auto' }}>
          {t('home.subtitle')}
          <br />
          {t('home.description')}
        </Paragraph>
        <div style={{ marginTop: 32 }}>
          <Button
            type="primary"
            size="large"
            icon={<CodeOutlined />}
            onClick={() => history.push('/tools/code-formatter')}
          >
            {t('home.start')}
          </Button>
          <Button
            size="large"
            style={{ marginLeft: 16 }}
            icon={<ArrowRightOutlined />}
            onClick={() => history.push('/pricing')}
          >
            {t('home.cooperate')}
          </Button>
        </div>
      </div>

      {/* Stats */}
      <Row gutter={24} style={{ marginBottom: 48 }}>
        <Col span={8}>
          <Card>
            <Statistic title={t('home.toolCount')} value={tools.length} suffix="+" />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic title={t('home.csdnViews')} value={10000} suffix="+" />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic title={t('home.articles')} value={50} suffix="+" />
          </Card>
        </Col>
      </Row>

      {/* Tools Grid */}
      <Title level={2} style={{ textAlign: 'center', marginBottom: 32 }}>
        {t('home.toolsTitle')} <Tag color="blue">{tools.length}+</Tag>
      </Title>
      <Row gutter={[24, 24]} style={{ marginBottom: 48 }}>
        {tools.map((tool) => (
          <Col xs={24} sm={12} lg={6} key={tool.key}>
            <Card
              hoverable
              onClick={() => history.push(tool.path)}
              style={{ height: '100%', cursor: 'pointer' }}
            >
              <div style={{ textAlign: 'center', marginBottom: 16 }}>{tool.icon}</div>
              <Title level={4} style={{ textAlign: 'center', marginBottom: 8 }}>
                {t(`${tool.key}.title`)}
              </Title>
              <Paragraph style={{ textAlign: 'center', color: '#666' }}>{t(`${tool.key}.description`)}</Paragraph>
              <div style={{ textAlign: 'center', marginTop: 12 }}>
                {tool.tags.map((tag) => (
                  <Tag key={tag} color={tag === 'pro' ? 'gold' : 'green'}>
                    {t(`common.${tag}`)}
                  </Tag>
                ))}
              </div>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Features */}
      <Title level={2} style={{ textAlign: 'center', marginBottom: 32 }}>
        {t('home.features.efficient')}
      </Title>
      <Row gutter={[24, 24]} style={{ marginBottom: 48 }}>
        {features.map((feature) => (
          <Col xs={24} sm={8} key={feature.key}>
            <Card style={{ textAlign: 'center', height: '100%' }}>
              <div style={{ fontSize: 36, color: '#1890ff', marginBottom: 16 }}>
                {feature.icon}
              </div>
              <Title level={4}>{t(`home.features.${feature.key}`)}</Title>
              <Paragraph style={{ color: '#666' }}>{t(`home.features.${feature.key}Desc`)}</Paragraph>
            </Card>
          </Col>
        ))}
      </Row>

      {/* CTA */}
      <Card style={{ textAlign: 'center', background: '#f0f5ff', border: 'none' }}>
        <Title level={3}>{t('home.ctaTitle')}</Title>
        <Paragraph style={{ fontSize: 16, marginBottom: 24 }}>
          {t('home.ctaDesc')}
        </Paragraph>
        <Button
          type="primary"
          size="large"
          icon={<ArrowRightOutlined />}
          onClick={() => history.push('/pricing')}
        >
          {t('home.ctaButton')}
        </Button>
      </Card>
    </div>
    </>
  );
};

export default HomePage;
