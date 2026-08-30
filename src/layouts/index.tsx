import React from 'react';
import { Outlet, useLocation, history } from 'umi';
import { Layout, Menu, Button, Badge, Avatar } from 'antd';
import { CONTACT_INFO } from '@/config/contact';
import { BEIAN_INFO, getCurrentDomain } from '@/config/beian';
import { useTheme } from '@/contexts/ThemeContext';
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
} from '@ant-design/icons';
import type { MenuProps } from 'antd';

const { Header, Content, Footer } = Layout;

type MenuItem = Required<MenuProps>['items'][number];

const items: MenuItem[] = [
  {
    key: '/',
    icon: <HomeOutlined />,
    label: '首页',
  },
  {
    key: 'tools',
    icon: <ToolOutlined />,
    label: '开发工具',
    children: [
      { key: '/tools/code-formatter', icon: <CodeOutlined />, label: '代码格式化' },
      { key: '/tools/component-gen', icon: <ToolOutlined />, label: '组件生成器' },
      { key: '/tools/perf-check', icon: <BarChartOutlined />, label: '性能检测' },
      { key: '/tools/svg-processor', icon: <FileImageOutlined />, label: 'SVG处理' },
      { key: '/tools/file-diff', icon: <DiffOutlined />, label: '文件对比' },
      { key: '/tools/url-tools', icon: <GlobalOutlined />, label: 'URL工具' },
      { key: '/tools/color-picker', icon: <BgColorsOutlined />, label: '颜色选择器' },
      { key: '/tools/image-cropper', icon: <ScissorOutlined />, label: '图片裁剪' },
      { key: '/tools/base64-tool', icon: <SwapOutlined />, label: 'Base64工具' },
      { key: '/tools/timestamp-tool', icon: <ClockCircleOutlined />, label: '时间戳转换' },
      { key: '/tools/regex-tester', icon: <CheckCircleOutlined />, label: '正则测试' },
      { key: '/tools/hash-tool', icon: <LockOutlined />, label: '哈希工具' },
    ],
  },
  {
    key: '/blog',
    icon: <ReadOutlined />,
    label: '技术博客',
  },
  {
    key: '/pricing',
    icon: <CrownOutlined />,
    label: '合作',
  },
];

const MainLayout: React.FC = () => {
  const location = useLocation();
  const { isDark, theme, toggleTheme } = useTheme();
  const [selectedKeys, setSelectedKeys] = React.useState<string[]>([location.pathname]);

  React.useEffect(() => {
    setSelectedKeys([location.pathname]);
  }, [location.pathname]);

  const onMenuClick: MenuProps['onClick'] = (e) => {
    if (e.key !== 'tools') {
      history.push(e.key);
    }
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header
        key="main-header"
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: isDark ? '#141414' : '#fff',
          boxShadow: isDark ? '0 2px 8px rgba(0,0,0,0.3)' : '0 2px 8px rgba(0,0,0,0.06)',
          transition: 'all 0.3s ease',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div
            style={{
              fontSize: 20,
              fontWeight: 'bold',
              marginRight: 48,
              cursor: 'pointer',
              color: '#1890ff',
            }}
            onClick={() => history.push('/')}
          >
            yma16.dev
          </div>
          <Menu
            mode="horizontal"
            selectedKeys={selectedKeys}
            items={items}
            onClick={onMenuClick}
            style={{ borderBottom: 'none', minWidth: 500 }}
          />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <Button
            type="text"
            icon={isDark ? <MoonOutlined /> : <SunOutlined />}
            onClick={toggleTheme}
            title={`当前: ${theme === 'auto' ? '跟随系统' : theme === 'dark' ? '深色模式' : '浅色模式'} (点击切换)`}
            style={{ color: isDark ? 'rgba(255,255,255,0.85)' : 'rgba(0,0,0,0.88)' }}
          >
            {theme === 'auto' ? '自动' : theme === 'dark' ? '深色' : '浅色'}
          </Button>
          <Button
            type="link"
            icon={<GithubOutlined />}
            href={CONTACT_INFO.github}
            target="_blank"
          >
            GitHub
          </Button>
          <Avatar style={{ backgroundColor: '#1890ff' }}>Y</Avatar>
        </div>
      </Header>
      <Content 
        style={{ 
          padding: 24, 
          maxWidth: 1400, 
          margin: '0 auto', 
          width: '100%',
          background: isDark ? '#000' : '#f5f5f5',
          transition: 'background 0.3s ease',
        }}
      >
        <Outlet />
      </Content>
      <Footer key="main-footer" style={{ textAlign: 'center', background: isDark ? '#141414' : '#f0f2f5', transition: 'background 0.3s ease' }}>
        <div style={{ marginBottom: 16 }}>
          <a href={CONTACT_INFO.csdn} target="_blank" rel="noopener noreferrer">
            CSDN博客
          </a>{' '}
          |{' '}
          <a href={CONTACT_INFO.github} target="_blank" rel="noopener noreferrer">
            GitHub
          </a>
        </div>
        <div>© {new Date().getFullYear()} yma16. All rights reserved. 前端开发工具集</div>
        
        {/* 域名备案信息展示 */}
        <div style={{ marginTop: 12, fontSize: 12, color: '#999' }}>
          <span>当前访问域名: {getCurrentDomain()}</span>
          {BEIAN_INFO.showBeian && BEIAN_INFO.beianNumber && (
            <span style={{ marginLeft: 16 }}>
              <a 
                href={BEIAN_INFO.beianLink} 
                target="_blank" 
                rel="noopener noreferrer"
                style={{ color: '#999' }}
              >
                {BEIAN_INFO.beianNumber}
              </a>
            </span>
          )}
          {BEIAN_INFO.showBeian && BEIAN_INFO.gonganNumber && (
            <span style={{ marginLeft: 16 }}>
              <a 
                href={BEIAN_INFO.gonganLink} 
                target="_blank" 
                rel="noopener noreferrer"
                style={{ color: '#999' }}
              >
                {BEIAN_INFO.gonganNumber}
              </a>
            </span>
          )}
          {!BEIAN_INFO.showBeian && (
            <span style={{ marginLeft: 16, color: '#bbb' }}>
              （备案申请中）
            </span>
          )}
        </div>
      </Footer>
    </Layout>
  );
};

export default MainLayout;
