import React, { useState } from 'react';
import { Card, Button, message, Typography, Space, Row, Col, Tabs } from 'antd';
import { CopyOutlined, CodeOutlined, ClearOutlined } from '@ant-design/icons';
import Editor from '@monaco-editor/react';
import { SEO, createToolJsonLd } from '@/components/SEO';

const { Title, Text } = Typography;

const JsonToTs: React.FC = () => {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [rootName, setRootName] = useState('Root');

  const seoConfig = {
    title: 'JSON 转 TypeScript 类型工具',
    description: '免费的 JSON 转 TypeScript Interface 类型生成器，自动推断类型，支持嵌套对象和数组。纯前端处理，不上传服务器，保护数据隐私。',
    keywords: 'JSON转TS,JSON转TypeScript,类型生成器,Interface生成,JSON类型推断,TS类型生成,前端开发工具',
    canonical: 'https://yma16.cloud/tools/json-to-ts',
    jsonLd: createToolJsonLd('JSON 转 TypeScript 类型工具', '免费的 JSON 转 TypeScript Interface 类型生成器，自动推断类型，支持嵌套对象和数组。纯前端处理，不上传服务器。', 'https://yma16.cloud/tools/json-to-ts', 'DeveloperApplication'),
  };

  const inferType = (value: any, key: string): string => {
    if (value === null) return 'null';
    if (Array.isArray(value)) {
      if (value.length === 0) return 'any[]';
      const itemType = inferType(value[0], key);
      return `${itemType}[]`;
    }
    const type = typeof value;
    if (type === 'object') {
      return generateInterface(value, key.charAt(0).toUpperCase() + key.slice(1));
    }
    return type;
  };

  const generateInterface = (obj: any, name: string): string => {
    if (Array.isArray(obj)) {
      if (obj.length === 0) return 'any[]';
      return `${generateInterface(obj[0], name)}[]`;
    }
    if (typeof obj !== 'object' || obj === null) return typeof obj;

    const lines = Object.entries(obj).map(([key, value]) => {
      const optional = value === undefined ? '?' : '';
      const type = inferType(value, key);
      return `  ${key}${optional}: ${type};`;
    });

    return `interface ${name} {\n${lines.join('\n')}\n}`;
  };

  const convert = () => {
    try {
      const parsed = JSON.parse(input);
      const result = generateInterface(parsed, rootName);
      setOutput(result);
    } catch (e) {
      message.error('JSON解析失败');
    }
  };

  return (
    <>
      <SEO {...seoConfig} />
      <div style={{ padding: 24 }}>
        <Title level={1} style={{ fontSize: '1.75rem' }}><CodeOutlined /> JSON 转 TypeScript 类型</Title>
        <Text type="secondary">免费的 JSON 转 TypeScript Interface 类型生成器，自动推断类型，支持嵌套对象和数组。纯前端处理，不上传服务器。</Text>
        <Row gutter={24} style={{ marginTop: 24 }}>
          <Col xs={24} lg={12}>
            <Card title="JSON输入">
              <Editor height={400} language="json" value={input} onChange={(v) => setInput(v || '')} />
              <Space style={{ marginTop: 16 }}>
                <Button type="primary" onClick={convert}>生成类型</Button>
                <Button icon={<ClearOutlined />} onClick={() => setInput('')}>清空</Button>
              </Space>
            </Card>
          </Col>
          <Col xs={24} lg={12}>
            <Card title="TypeScript输出">
              <Editor height={400} language="typescript" value={output} options={{ readOnly: true }} />
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

export default JsonToTs;
