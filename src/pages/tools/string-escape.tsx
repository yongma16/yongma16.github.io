import React, { useState } from 'react';
import { Card, Button, message, Typography, Space, Row, Col, Tabs } from 'antd';
import { CopyOutlined, SwapOutlined, ClearOutlined } from '@ant-design/icons';
import Editor from '@monaco-editor/react';
import { SEO, createToolJsonLd } from '@/components/SEO';

const { Title, Text } = Typography;

const StringEscape: React.FC = () => {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [activeTab, setActiveTab] = useState('escape');

  const seoConfig = {
    title: '字符串Escape转义工具',
    description: 'HTML/JS字符串Escape转义反转义工具，支持多种转义格式。',
    keywords: '字符串转义,Escape,HTML转义,JS转义,字符串编码',
    jsonLd: createToolJsonLd('字符串Escape转义工具', 'HTML/JS字符串转义反转义工具', 'https://yma16.cloud/tools/string-escape', 'DeveloperApplication'),
  };

  const escapeHTML = (str: string): string => {
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  };

  const unescapeHTML = (str: string): string => {
    return str
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'");
  };

  const escapeJS = (str: string): string => {
    return JSON.stringify(str);
  };

  const unescapeJS = (str: string): string => {
    try {
      return JSON.parse(str);
    } catch {
      return str;
    }
  };

  const handleEscape = () => {
    if (activeTab === 'escape') {
      setOutput(escapeHTML(input));
    } else if (activeTab === 'unescape') {
      setOutput(unescapeHTML(input));
    } else if (activeTab === 'js-escape') {
      setOutput(escapeJS(input));
    } else if (activeTab === 'js-unescape') {
      setOutput(unescapeJS(input));
    }
  };

  return (
    <>
      <SEO {...seoConfig} />
      <div style={{ padding: 24 }}>
        <Title level={2}><SwapOutlined /> 字符串Escape转义</Title>
        <Text type="secondary">HTML/JS字符串转义与反转义</Text>
        <Row gutter={24} style={{ marginTop: 24 }}>
          <Col xs={24} lg={12}>
            <Card title="输入">
              <Tabs activeKey={activeTab} onChange={setActiveTab}>
                <Tabs.TabPane tab="HTML转义" key="escape" />
                <Tabs.TabPane tab="HTML反转义" key="unescape" />
                <Tabs.TabPane tab="JS转义" key="js-escape" />
                <Tabs.TabPane tab="JS反转义" key="js-unescape" />
              </Tabs>
              <Editor height={350} language="text" value={input} onChange={(v) => setInput(v || '')} />
              <Space style={{ marginTop: 16 }}>
                <Button type="primary" onClick={handleEscape}>转换</Button>
                <Button icon={<ClearOutlined />} onClick={() => setInput('')}>清空</Button>
              </Space>
            </Card>
          </Col>
          <Col xs={24} lg={12}>
            <Card title="输出">
              <Editor height={400} language="text" value={output} options={{ readOnly: true }} />
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

export default StringEscape;
