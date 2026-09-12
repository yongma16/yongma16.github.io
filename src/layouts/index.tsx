import React from 'react';
import { Outlet, useLocation, history } from 'umi';
import { Layout, Menu, Button, Badge, Avatar } from 'antd';
import { CONTACT_INFO } from '@/config/contact';
import { BEIAN_INFO, getCurrentDomain } from '@/config/beian';
import { useTheme } from '@/contexts/ThemeContext';
import { useI18n, LanguageSwitcher } from '@/i18n';
import { SiteIcon } from '@/components/SiteIcon';
import {
  HomeOutlined,
  CodeOutlined,
  ToolOutlined,
  BarChartOutlined,
  FileImageOutlined,
  DiffOutlined,
  ReadOutlined,
  CrownOutlined,
  GithubOutlined,
  GlobalOutlined,
  BgColorsOutlined,
  ScissorOutlined,
  SwapOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  LockOutlined,
  SunOutlined,
  MoonOutlined,
  DesktopOutlined,
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
  ThunderboltOutlined,
} from '@ant-design/icons';
import type { MenuProps } from 'antd';

const { Header, Content, Footer } = Layout;

type MenuItem = Required<MenuProps>['items'][number];

const MainLayout: React.FC = () => {
  const location = useLocation();
  const { isDark, theme, toggleTheme } = useTheme();
  const { t } = useI18n();
  const [selectedKeys, setSelectedKeys] = React.useState<string[]>([location.pathname]);

  React.useEffect(() => {
    setSelectedKeys([location.pathname]);
  }, [location.pathname]);

  const onMenuClick: MenuProps['onClick'] = (e) => {
    if (e.key !== 'tools') {
      history.push(e.key);
    }
  };

  const isLight = theme === 'light';

  const items: MenuItem[] = [
    {
      key: '/',
      icon: <HomeOutlined />,
      label: t('nav.home'),
    },
    {
      key: 'tools',
      icon: <ToolOutlined />,
      label: t('nav.tools'),
      children: [
        { key: '/tools/code-formatter', icon: <CodeOutlined />, label: t('codeFormatter.title') },
        { key: '/tools/component-gen', icon: <ToolOutlined />, label: t('componentGen.title') },
        { key: '/tools/perf-check', icon: <BarChartOutlined />, label: t('perfCheck.title') },
        { key: '/tools/svg-processor', icon: <FileImageOutlined />, label: t('svgProcessor.title') },
        { key: '/tools/file-diff', icon: <DiffOutlined />, label: '文件对比' },
        { key: '/tools/url-tools', icon: <GlobalOutlined />, label: t('urlTools.title') },
        { key: '/tools/color-picker', icon: <BgColorsOutlined />, label: t('colorPicker.title') },
        { key: '/tools/image-cropper', icon: <ScissorOutlined />, label: t('imageCropper.title') },
        { key: '/tools/base64-tool', icon: <SwapOutlined />, label: t('base64Tool.title') },
        { key: '/tools/timestamp-tool', icon: <ClockCircleOutlined />, label: t('timestampTool.title') },
        { key: '/tools/regex-tester', icon: <CheckCircleOutlined />, label: t('regexTester.title') },
        { key: '/tools/hash-tool', icon: <LockOutlined />, label: t('hashTool.title') },
        { key: '/tools/json-to-ts', icon: <FileTextOutlined />, label: t('jsonToTs.title') },
        { key: '/tools/mock-gen', icon: <DatabaseOutlined />, label: t('mockGen.title') },
        { key: '/tools/css-formatter', icon: <FormatPainterOutlined />, label: t('cssFormatter.title') },
        { key: '/tools/string-escape', icon: <SwapOutlined />, label: t('stringEscape.title') },
        { key: '/tools/radix-convert', icon: <SwapOutlined />, label: t('radixConvert.title') },
        { key: '/tools/naming-convert', icon: <SwapOutlined />, label: t('namingConvert.title') },
        { key: '/tools/image-convert', icon: <FileImageOutlined />, label: t('imageConvert.title') },
        { key: '/tools/jwt-parser', icon: <SafetyOutlined />, label: t('jwtParser.title') },
        { key: '/tools/cookie-parser', icon: <CoffeeOutlined />, label: t('cookieParser.title') },
        { key: '/tools/qrcode-tool', icon: <QrcodeOutlined />, label: t('qrcodeTool.title') },
        { key: '/tools/regex-lib', icon: <BookOutlined />, label: t('regexLib.title') },
        { key: '/tools/random-string', icon: <KeyOutlined />, label: t('randomString.title') },
        { key: '/tools/unit-convert', icon: <ColumnWidthOutlined />, label: t('unitConvert.title') },
        { key: '/tools/ai-debug', icon: <BugOutlined />, label: t('aiDebug.title') },
        { key: '/tools/perf-monitor', icon: <DashboardOutlined />, label: t('perfMonitor.title') },
        { key: '/tools/curl-convert', icon: <ThunderboltOutlined />, label: t('curlConvert.title') },
        { key: '/tools/eslint-config', icon: <FileTextOutlined />, label: t('eslintConfig.title') },
        { key: '/tools/playground', icon: <CodeOutlined />, label: t('playground.title') },
      ],
    },
    {
      key: '/blog',
      icon: <ReadOutlined />,
      label: t('nav.blog'),
    },
    {
      key: '/pricing',
      icon: <CrownOutlined />,
      label: t('nav.cooperate'),
    },
  ];

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header
        key="main-header"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 24px',
          background: isDark ? '#141414' : '#ffffff',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
          height: 64,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <SiteIcon />
          <span
            style={{
              fontSize: 18,
              fontWeight: 600,
              color: isDark ? '#ffffff' : '#000000',
            }}
          >
            yma16.dev
          </span>
        </div>

        <Menu
          mode="horizontal"
          selectedKeys={selectedKeys}
          items={items}
          onClick={onMenuClick}
          style={{
            flex: 1,
            justifyContent: 'center',
            background: 'transparent',
            borderBottom: 'none',
            minWidth: 0,
          }}
        />

        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <LanguageSwitcher />
          <Button
            type="text"
            icon={isDark ? <SunOutlined /> : <MoonOutlined />}
            onClick={toggleTheme}
          >
            {isDark ? '亮色' : isLight ? '暗色' : '自动'}
          </Button>
          <a href="https://github.com/yongma16/yongma16.github.io" target="_blank" rel="noopener noreferrer">
            <Button type="text" icon={<GithubOutlined />}>GitHub</Button>
          </a>
        </div>
      </Header>

      <Content
        style={{
          marginTop: 64,
          padding: '24px 48px',
          minHeight: 'calc(100vh - 64px - 70px)',
          background: isDark ? '#0a0a0a' : '#f5f5f5',
        }}
      >
        <Outlet />
      </Content>

      <Footer
        style={{
          textAlign: 'center',
          background: isDark ? '#141414' : '#ffffff',
          borderTop: '1px solid ' + (isDark ? '#303030' : '#f0f0f0'),
          padding: '24px 48px',
        }}
      >
        <div style={{ marginBottom: 12 }}>
          <a
            href={CONTACT_INFO.csdn}
            target="_blank"
            rel="noopener noreferrer"
            style={{ marginRight: 16 }}
          >
            CSDN博客
          </a>
          <span style={{ marginRight: 16 }}>|</span>
          <a
            href="https://github.com/yongma16"
            target="_blank"
            rel="noopener noreferrer"
          >
            GitHub
          </a>
        </div>
        <div>
          <span>© {new Date().getFullYear()} yma16. All rights reserved. 前端开发工具集</span>
        </div>
        {BEIAN_INFO.showBeian && (
          <div style={{ marginTop: 8, fontSize: 12 }}>
            <span style={{ marginRight: 8 }}>当前访问域名: {getCurrentDomain()}</span>
            <a
              href={BEIAN_INFO.beianLink}
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: '#999' }}
            >
              {BEIAN_INFO.beianNumber}
            </a>
          </div>
        )}
      </Footer>
    </Layout>
  );
};

export default MainLayout;
