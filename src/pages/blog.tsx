import React from 'react';
import { Card, List, Tag, Typography, Space, Avatar, Button, Row, Col, Statistic } from 'antd';
import { ReadOutlined, EyeOutlined, LikeOutlined, StarOutlined, ArrowRightOutlined } from '@ant-design/icons';

const { Title, Paragraph } = Typography;

interface BlogPost {
  id: number;
  title: string;
  summary: string;
  tags: string[];
  views: number;
  likes: number;
  date: string;
  url: string;
}

const blogPosts: BlogPost[] = [
  {
    id: 1,
    title: '前端 React 模拟内存溢出 —— Chrome DevTools 查找未释放内存',
    summary: '本文通过一个真实的前端内存溢出演示项目，深入剖析浏览器内存管理机制、V8 垃圾回收原理，以及如何在实际开发中避免内存泄漏问题。',
    tags: ['React', '性能优化', '内存管理'],
    views: 1761,
    likes: 16,
    date: '2026-02-14',
    url: 'https://blog.csdn.net/qq_38870145/article/details/158068113',
  },
  {
    id: 2,
    title: 'React Flow 自定义节点、边 —— 使用 DAG 布局树状结构',
    summary: 'React Flow 是一个用于构建交互式节点和基于图的编辑器的开源 React 库。本文介绍如何自定义节点、边，以及使用 DAG 布局实现树状结构。',
    tags: ['React', '可视化', '流程图'],
    views: 1220,
    likes: 25,
    date: '2025-06-16',
    url: 'https://blog.csdn.net/qq_38870145/article/details/148679238',
  },
  {
    id: 3,
    title: '前端 Gmail 邮件加载动态样式 —— 动态评分交互邮件可提交 API',
    summary: 'AMP 电子邮件是一种通过动态交互技术增强传统邮件功能的方案，允许在邮件中嵌入实时更新、表单提交、轮播图等交互式内容。',
    tags: ['前端', 'AMP', '邮件开发'],
    views: 1998,
    likes: 10,
    date: '2025-06-02',
    url: 'https://blog.csdn.net/qq_38870145/article/details/148372632',
  },
  {
    id: 4,
    title: '利用 InsCode 帮我用前端页面展示分析博客数据',
    summary: '本文分享利用 InsCode 平台快速搭建前端页面，展示和分析博客数据的方法。包括数据获取、可视化和部署上线。',
    tags: ['Node.js', '数据可视化', '博客'],
    views: 943,
    likes: 22,
    date: '2025-10-24',
    url: 'https://blog.csdn.net/qq_38870145/article/details/153850161',
  },
  {
    id: 5,
    title: '前端 —— DeepSeek 一分钟帮我实现富文本编辑选取输入判断变量',
    summary: '利用 HTML5 的 contenteditable 属性和 Selection 对象实现富文本编辑中的变量输入检测功能，当用户输入 {{var}} 格式时自动弹出选择框。',
    tags: ['前端', '富文本', 'AI'],
    views: 484,
    likes: 3,
    date: '2025-10-14',
    url: 'https://blog.csdn.net/qq_38870145/article/details/153274341',
  },
  {
    id: 6,
    title: '虚拟机中 Windows 11 安装 OpenClaw',
    summary: '详细介绍在虚拟机中安装和配置 OpenClaw 的步骤，包括环境准备、安装过程和常见问题解决。',
    tags: ['OpenClaw', '虚拟机', 'Windows'],
    views: 721,
    likes: 6,
    date: '2026-03-29',
    url: 'https://blog.csdn.net/qq_38870145/article/details/158806703',
  },
];

const BlogPage: React.FC = () => {
  const totalViews = blogPosts.reduce((sum, post) => sum + post.views, 0);
  const totalLikes = blogPosts.reduce((sum, post) => sum + post.likes, 0);

  return (
    <div>
      <Title level={2}>
        <ReadOutlined /> 技术博客
      </Title>
      <Paragraph type="secondary">
        分享前端开发、性能优化、工具使用等技术文章，更多内容请访问{' '}
        <a href="https://blog.csdn.net/qq_38870145" target="_blank" rel="noopener noreferrer">
          CSDN 博客
        </a>
      </Paragraph>

      <Row gutter={24} style={{ marginBottom: 32 }}>
        <Col span={8}>
          <Card>
            <Statistic title="文章数量" value={blogPosts.length} suffix="篇" />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic title="总阅读量" value={totalViews} suffix="次" />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic title="总点赞数" value={totalLikes} suffix="个" />
          </Card>
        </Col>
      </Row>

      <List
        grid={{ gutter: 24, xs: 1, sm: 1, lg: 2 }}
        dataSource={blogPosts}
        renderItem={(post) => (
          <List.Item>
            <Card
              hoverable
              style={{ height: '100%' }}
              actions={[
                <Space>
                  <EyeOutlined /> {post.views}
                </Space>,
                <Space>
                  <LikeOutlined /> {post.likes}
                </Space>,
                <Button 
                  type="link" 
                  href={post.url} 
                  target="_blank"
                  icon={<ArrowRightOutlined />}
                >
                  阅读全文
                </Button>,
              ]}
            >
              <Card.Meta
                title={
                  <a href={post.url} target="_blank" rel="noopener noreferrer" style={{ color: 'inherit' }}>
                    {post.title}
                  </a>
                }
                description={
                  <div>
                    <Paragraph ellipsis={{ rows: 2 }} style={{ marginBottom: 12 }}>
                      {post.summary}
                    </Paragraph>
                    <Space wrap>
                      {post.tags.map(tag => (
                        <Tag key={tag} color="blue">{tag}</Tag>
                      ))}
                    </Space>
                    <div style={{ marginTop: 12, color: '#999', fontSize: 12 }}>
                      发布于 {post.date}
                    </div>
                  </div>
                }
              />
            </Card>
          </List.Item>
        )}
      />

      <Card style={{ textAlign: 'center', marginTop: 32, background: '#f0f5ff' }}>
        <Title level={4}>查看更多技术文章</Title>
        <Paragraph>
          在 CSDN 博客上关注我，获取最新前端技术分享
        </Paragraph>
        <Button 
          type="primary" 
          size="large"
          href="https://blog.csdn.net/qq_38870145?type=blog"
          target="_blank"
          icon={<ReadOutlined />}
        >
          访问 CSDN 博客
        </Button>
      </Card>
    </div>
  );
};

export default BlogPage;
