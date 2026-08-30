import React from 'react';
import { Card, Row, Col, Typography, Button, List, Tag, Space, Divider } from 'antd';
import { CheckOutlined, RocketOutlined, TeamOutlined, GlobalOutlined, MailOutlined } from '@ant-design/icons';
import { CONTACT_INFO } from '@/config/contact';
import { SEO } from '@/components/SEO';

const { Title, Paragraph } = Typography;

const cooperations = [
  {
    name: '技术咨询',
    icon: <RocketOutlined style={{ fontSize: 32, color: '#52c41a' }} />,
    description: '前端技术方案设计、性能优化、架构升级',
    features: [
      '前端架构设计与评估',
      '性能瓶颈分析与优化',
      '技术选型与方案评审',
      '代码审查与规范制定',
      '线上问题排查支持',
    ],
    buttonText: '了解详情',
    buttonType: 'default' as const,
    popular: false,
  },
  {
    name: '项目合作',
    icon: <TeamOutlined style={{ fontSize: 32, color: '#1890ff' }} />,
    description: 'Web应用开发、工具开发、组件库建设',
    features: [
      'React/Vue 项目开发',
      '前端工具链定制开发',
      '组件库与物料体系建设',
      '可视化与图表开发',
      '小程序与跨端开发',
    ],
    buttonText: '洽谈合作',
    buttonType: 'primary' as const,
    popular: true,
  },
  {
    name: '内容合作',
    icon: <GlobalOutlined style={{ fontSize: 32, color: '#faad14' }} />,
    description: '技术文章、教程、开源项目推广',
    features: [
      '技术专栏文章撰写',
      '开源项目文档优化',
      '技术教程与视频制作',
      '技术分享与演讲',
      '社区运营与推广',
    ],
    buttonText: '联系沟通',
    buttonType: 'default' as const,
    popular: false,
  },
];

const PricingPage: React.FC = () => {
  return (
    <>
      <SEO
        title="合作与服务"
        description="yma16 提供前端技术咨询、项目合作、技术培训和开源贡献等服务，欢迎联系合作。"
        keywords="前端技术咨询,项目合作,技术培训,React开发,Vue开发,前端架构"
      />
      <div>
      <div style={{ textAlign: 'center', marginBottom: 48 }}>
        <Title level={2}>开发合作</Title>
        <Paragraph style={{ fontSize: 16, color: '#666', maxWidth: 600, margin: '0 auto' }}>
          专注于前端技术领域，提供技术咨询、项目开发与内容合作服务
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
                  前端开发工程师，专注于 React/Vue 生态，有丰富的 Web 应用开发和性能优化经验。
                  活跃于技术社区，乐于分享和交流。期待与志同道合的伙伴一起合作！
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
          <Card title="合作流程" size="small">
            <List
              size="small"
              dataSource={[
                '1. 需求沟通：详细了解项目背景和技术需求',
                '2. 方案评估：提供技术方案和合作建议',
                '3. 确定合作：明确交付物、时间节点和费用',
                '4. 项目执行：按计划推进，保持沟通',
                '5. 交付验收：确保质量，提供后续支持',
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
          <Card title="服务承诺" size="small">
            <List
              size="small"
              dataSource={[
                '✓ 专业可靠：基于实际项目经验提供解决方案',
                '✓ 高效沟通：及时响应，保持信息透明',
                '✓ 质量保障：注重代码质量和用户体验',
                '✓ 持续支持：项目交付后提供必要的技术支持',
                '✓ 保密原则：严格保护客户商业信息和数据',
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
