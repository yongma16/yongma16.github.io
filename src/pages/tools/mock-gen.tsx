import React, { useState } from 'react';
import { Card, Button, message, Typography, Space, Row, Col, InputNumber, Select, Input } from 'antd';
import { CopyOutlined, DatabaseOutlined, ReloadOutlined } from '@ant-design/icons';
import Editor from '@monaco-editor/react';
import { SEO, createToolJsonLd } from '@/components/SEO';

const { Title, Text } = Typography;
const { Option } = Select;

const MockGen: React.FC = () => {
  const [count, setCount] = useState(5);
  const [schema, setSchema] = useState(`{
  "id": "@increment",
  "name": "@cname",
  "email": "@email",
  "age": "@integer(18,60)",
  "address": "@county(true)",
  "phone": "@phone",
  "avatar": "@image('100x100')",
  "isActive": "@boolean"
}`);
  const [output, setOutput] = useState('');

  const seoConfig = {
    title: 'Mock数据生成器',
    description: 'Mock模拟JSON数据生成器，支持常用数据类型，快速生成测试数据。',
    keywords: 'Mock数据,模拟数据,JSON生成器,测试数据,假数据生成',
    jsonLd: createToolJsonLd('Mock数据生成器', 'Mock模拟JSON数据生成器', 'https://yma16.cloud/tools/mock-gen', 'DeveloperApplication'),
  };

  const mockHandlers: Record<string, () => any> = {
    '@increment': () => Math.floor(Math.random() * 10000),
    '@cname': () => ['张三', '李四', '王五', '赵六', '孙七', '周八', '吴九', '郑十'][Math.floor(Math.random() * 8)],
    '@name': () => ['John', 'Jane', 'Bob', 'Alice', 'Tom', 'Mary'][Math.floor(Math.random() * 6)],
    '@email': () => `user${Math.floor(Math.random() * 1000)}@example.com`,
    '@phone': () => `1${[3,4,5,7,8][Math.floor(Math.random()*5)]}${String(Math.random()).slice(2,10)}`,
    '@integer': (min = 0, max = 100) => Math.floor(Math.random() * (max - min + 1)) + min,
    '@float': (min = 0, max = 100) => (Math.random() * (max - min) + min).toFixed(2),
    '@boolean': () => Math.random() > 0.5,
    '@date': () => new Date(Date.now() - Math.floor(Math.random() * 10000000000)).toISOString().split('T')[0],
    '@datetime': () => new Date(Date.now() - Math.floor(Math.random() * 10000000000)).toISOString(),
    '@image': (size = '100x100') => `https://via.placeholder.com/${size}`,
    '@color': () => '#' + Math.floor(Math.random()*16777215).toString(16).padStart(6, '0'),
    '@title': () => ['标题一', '标题二', '标题三', '重要通知', '最新动态'][Math.floor(Math.random() * 5)],
    '@paragraph': () => '这是一段模拟文本内容，用于测试展示效果。'.repeat(Math.floor(Math.random() * 3) + 1),
    '@url': () => `https://example.com/page/${Math.floor(Math.random() * 1000)}`,
    '@ip': () => `192.168.${Math.floor(Math.random()*255)}.${Math.floor(Math.random()*255)}`,
    '@county': () => ['北京市朝阳区', '上海市浦东新区', '广州市天河区', '深圳市南山区'][Math.floor(Math.random() * 4)],
  };

  const parseMockValue = (value: string): any => {
    const match = value.match(/^@(\w+)(?:\(([^)]*)\))?$/);
    if (!match) return value;
    const [, handler, args] = match;
    const handlerFn = mockHandlers[`@${handler}`];
    if (!handlerFn) return value;
    if (args) {
      const parsedArgs = args.split(',').map(a => {
        const trimmed = a.trim();
        if (/^\d+$/.test(trimmed)) return parseInt(trimmed);
        if (/^\d+\.\d+$/.test(trimmed)) return parseFloat(trimmed);
        return trimmed.replace(/^['"]|['"]$/g, '');
      });
      return handlerFn(...parsedArgs);
    }
    return handlerFn();
  };

  const generateMock = (obj: any): any => {
    if (typeof obj === 'string' && obj.startsWith('@')) {
      return parseMockValue(obj);
    }
    if (Array.isArray(obj)) {
      return obj.map(generateMock);
    }
    if (typeof obj === 'object' && obj !== null) {
      const result: any = {};
      for (const [key, value] of Object.entries(obj)) {
        result[key] = generateMock(value);
      }
      return result;
    }
    return obj;
  };

  const generate = () => {
    try {
      const parsed = JSON.parse(schema);
      const result = Array.from({ length: count }, () => generateMock(parsed));
      setOutput(JSON.stringify(result, null, 2));
    } catch (e) {
      message.error('Schema解析失败');
    }
  };

  return (
    <>
      <SEO {...seoConfig} />
      <div style={{ padding: 24 }}>
        <Title level={2}><DatabaseOutlined /> Mock数据生成</Title>
        <Text type="secondary">快速生成模拟JSON测试数据</Text>
        <Row gutter={24} style={{ marginTop: 24 }}>
          <Col xs={24} lg={12}>
            <Card title="Schema模板">
              <Space style={{ marginBottom: 16 }}>
                <Text>生成数量:</Text>
                <InputNumber min={1} max={100} value={count} onChange={(v) => setCount(v || 1)} />
                <Button type="primary" icon={<ReloadOutlined />} onClick={generate}>生成</Button>
              </Space>
              <Editor height={350} language="json" value={schema} onChange={(v) => setSchema(v || '')} />
            </Card>
          </Col>
          <Col xs={24} lg={12}>
            <Card title="生成结果">
              <Editor height={400} language="json" value={output} options={{ readOnly: true }} />
              <Space style={{ marginTop: 16 }}>
                <Button icon={<CopyOutlined />} onClick={() => { navigator.clipboard.writeText(output); message.success('已复制'); }}>复制</Button>
              </Space>
            </Card>
          </Col>
        </Row>
      </div>
    </>
  );
};

export default MockGen;
