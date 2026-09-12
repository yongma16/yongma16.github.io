import React from 'react';
import { Card, Row, Col, Typography, Button, List, Tag, Space, Divider } from 'antd';
import { CheckOutlined, RocketOutlined, TeamOutlined, GlobalOutlined, MailOutlined } from '@ant-design/icons';
import { CONTACT_INFO } from '@/config/contact';
import { SEO } from '@/components/SEO';

const { Title, Paragraph } = Typography;

const cooperations = [
  {
    name: '技术交流',
    icon: <RocketOutlined style={{ fontSize: 32, color: '#52c41a' }} />,
    description: '前端技术方案探讨、性能优化思路分享、架构设计交流',
    features: [
      '前端架构设计探讨',
      '性能优化经验分享',
      '技术选型交流',
      '代码规范与最佳实践',
      '线上问题排查思路',
    ],
    buttonText: '一起聊聊',
    buttonType: 'default' as const,
    popular: false,
  },
  {
    name: '开源共建',
    icon: <TeamOutlined style={{ fontSize: 32, color: '#1890ff' }} />,
    description: '开源项目贡献、工具开发协作、技术方案共建',
    features: [
      'React/Vue 生态贡献',
      '前端工具链共建',
      '组件库与物料体系',
      '可视化与图表方案',
      '跨端开发探索',
    ],
    buttonText: '参与共建',
    buttonType: 'primary' as const,
    popular: true,
  },
  {
    name: '知识分享',
    icon: <GlobalOutlined style={{ fontSize: 32, color: '#faad14' }} />,
    description: '技术文章、教程、开源项目经验分享',
    features: [
      '技术文章与博客撰写',
      '开源项目文档完善',
      '技术教程与案例分享',
      '技术演讲与直播',
      '社区互动与答疑',
    ],
    buttonText: '交流沟通',
    buttonType: 'default' as const,
    popular: false,
  },
];

const PricingPage: React.FC = () => {
  return (
    <>
      <SEO
        title="一起搞事情"
        description="yma16 热爱前端技术，乐于交流分享。欢迎技术探讨、开源共建、知识分享，一起让前端生态更好。"
        keywords="前端技术交流,开源共建,知识分享,React开发,Vue开发,前端社区"
      />
      <div>
      <div style={{ textAlign: 'center', marginBottom: 48 }}>
        <Title level={2}>一起搞事情</Title>
        <Paragraph style={{ fontSize: 16, color: '#666', maxWidth: 600, margin: '0 auto' }}>
          热爱前端技术，乐于交流分享。无论是技术探讨、开源共建还是知识分享，都欢迎来找我聊聊～
        </Paragraph>
      </div>

      <Row gutter={[24, 24]} justify="center">
        {cooperations.map((item) => (
          <Col xs={24} sm={12} lg={8} key={item.name}>
            <Card
              hoverable
              style={{
                height: '100%',
                position: 'relative',
                borderColor: item.popular ? '#1890ff' : undefined,
              }}
              title={
                <div style={{ textAlign: 'center' }}>
                  <div style={{ marginBottom: 16 }}>{item.icon}</div>
                  <Title level={3} style={{ margin: 0 }}>{item.name}</Title>
                  {item.popular && (
                    <Tag color="blue" style={{ position: 'absolute', top: 16, right: 16 }}>
                      热门
                    </Tag>
                  )}
                </div>
              }
            >
              <div style={{ textAlign: 'center', marginBottom: 24 }}>
                <Paragraph type="secondary" style={{ fontSize: 14 }}>
                  {item.description}
                </Paragraph>
              </div>

              <Button
                type={item.buttonType}
                size="large"
                block
                style={{ marginBottom: 24 }}
              >
                {item.buttonText}
              </Button>

              <List
                size="small"
                dataSource={item.features}
                renderItem={(feature) => (
                  <List.Item style={{ border: 'none', padding: '4px 0' }}>
                    <Space>
                      <CheckOutlined style={{ color: '#52c41a' }} />
                      <span>{feature}</span>
                    </Space>
                  </List.Item>
                )}
              />
            </Card>
          </Col>
        ))}
      </Row>

      <Divider style={{ margin: '48px 0' }} />

      <Row gutter={[24, 24]}>
        <Col span={24}>
          <Card style={{ background: '#f0f5ff' }}>
            <Row align="middle" gutter={24}>
              <Col span={16}>
                <Title level={3}>关于我</Title>
                <Paragraph style={{ fontSize: 15 }}>
                  前端开发工程师，专注于 React/Vue 生态，喜欢折腾各种前端工具和性能优化。
                  活跃于技术社区，相信开源和分享能让技术变得更好。期待认识更多志同道合的朋友！
                </Paragraph>
                <Space size="large" style={{ marginTop: 16 }}>
                  <Tag color="blue">React</Tag>
                  <Tag color="green">Vue</Tag>
                  <Tag color="orange">TypeScript</Tag>
                  <Tag color="purple">Node.js</Tag>
                  <Tag color="cyan">性能优化</Tag>
                </Space>
              </Col>
              <Col span={8} style={{ textAlign: 'center' }}>
                <Button 
                  type="primary" 
                  size="large" 
                  icon={<MailOutlined />}
                  href={`mailto:${CONTACT_INFO.email}`}
                >
                  联系我
                </Button>
                <Paragraph type="secondary" style={{ marginTop: 12, fontSize: 13 }}>
                  邮箱: {CONTACT_INFO.emailDisplay}
                </Paragraph>
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>

      <Row gutter={[24, 24]} style={{ marginTop: 24 }}>
        <Col span={12}>
          <Card title="交流方式" size="small">
            <List
              size="small"
              dataSource={[
                '💬 技术讨论：前端技术选型、架构设计、性能优化',
                '🔧 工具共建：一起开发好用的前端工具，提升效率',
                '📝 经验分享：写文章、做教程，把踩过的坑变成经验',
                '🎯 开源贡献：参与开源项目，一起让生态更好',
                '🤝 互相学习：每个人都有擅长的地方，互相交流成长',
              ]}
              renderItem={(item) => (
                <List.Item style={{ border: 'none', padding: '8px 0' }}>
                  {item}
                </List.Item>
              )}
            />
          </Card>
        </Col>
        <Col span={12}>
          <Card title="我的态度" size="small">
            <List
              size="small"
              dataSource={[
                '🌟 乐于分享：技术不应该藏着掖着，分享才能进步',
                '💡 保持好奇：新技术、新工具都值得尝试和探索',
                '🤗 开放包容：尊重不同的技术观点，求同存异',
                '🔥 热爱折腾：代码不仅是工作，更是热爱和乐趣',
                '🚀 持续成长：保持学习，和前端社区一起进步',
              ]}
              renderItem={(item) => (
                <List.Item style={{ border: 'none', padding: '8px 0' }}>
                  {item}
                </List.Item>
              )}
            />
          </Card>
        </Col>
      </Row>
    </div>
    </>
  );
};

export default PricingPage;
