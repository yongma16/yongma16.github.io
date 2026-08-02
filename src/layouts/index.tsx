import React from 'react';
import { Outlet, useLocation, history } from 'umi';
import { Layout, Menu, Button, Badge, Avatar } from 'antd';
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
          background: '#fff',
          boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
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
            type="link"
            icon={<GithubOutlined />}
            href="https://github.com/yongma16"
            target="_blank"
          >
            GitHub
          </Button>
          <Avatar style={{ backgroundColor: '#1890ff' }}>Y</Avatar>
        </div>
      </Header>
      <Content style={{ padding: 24, maxWidth: 1400, margin: '0 auto', width: '100%' }}>
        <Outlet />
      </Content>
      <Footer key="main-footer" style={{ textAlign: 'center', background: '#f0f2f5' }}>
        <div style={{ marginBottom: 16 }}>
          <a href="https://blog.csdn.net/qq_38870145" target="_blank" rel="noopener noreferrer">
            CSDN博客
          </a>{' '}
          |{' '}
          <a href="https://github.com/yongma16" target="_blank" rel="noopener noreferrer">
            GitHub
          </a>
        </div>
        <div>© 2024 yma16. All rights reserved. 前端开发工具集</div>
      </Footer>
    </Layout>
  );
};

export default MainLayout;
