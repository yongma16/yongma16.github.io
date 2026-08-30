import React, { useState } from 'react';
import { Card, Button, message, Typography, Space, Row, Col, Tabs } from 'antd';
import { CopyOutlined, FormatPainterOutlined, CompressOutlined, ExpandOutlined } from '@ant-design/icons';
import Editor from '@monaco-editor/react';
import { SEO, createToolJsonLd } from '@/components/SEO';

const { Title, Text } = Typography;

const CssFormatter: React.FC = () => {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [activeTab, setActiveTab] = useState('format');

  const seoConfig = {
    title: 'CSS格式化压缩工具',
    description: 'CSS代码格式化、压缩、美化工具，支持一键整理和压缩CSS代码。',
    keywords: 'CSS格式化,CSS压缩,CSS美化,CSS整理,在线CSS工具',
    jsonLd: createToolJsonLd('CSS格式化压缩工具', 'CSS代码格式化和压缩工具', 'https://yma16.cloud/tools/css-formatter', 'DeveloperApplication'),
  };

  const formatCSS = (css: string): string => {
    let formatted = css
      .replace(/\s+/g, ' ')
      .replace(/\s*\{\s*/g, ' {\n  ')
      .replace(/;\s*/g, ';\n  ')
      .replace(/\s*\}\s*/g, '\n}\n')
      .replace(/,\s*/g, ', ')
      .replace(/:\s*/g, ': ')
      .replace(/\n\s*\n/g, '\n')
      .trim();
    return formatted;
  };

  const compressCSS = (css: string): string => {
    return css
      .replace(/\/\*[\s\S]*?\*\//g, '')
      .replace(/\s+/g, ' ')
      .replace(/\s*([{}:;,])\s*/g, '$1')
      .replace(/;\}/g, '}')
      .trim();
  };

  const handleFormat = () => {
    try {
      setOutput(formatCSS(input));
      message.success('格式化完成');
    } catch (e) {
      message.error('格式化失败');
    }
  };

  const handleCompress = () => {
    try {
      setOutput(compressCSS(input));
      message.success('压缩完成');
    } catch (e) {
      message.error('压缩失败');
    }
  };

  return (
    <>
      <SEO {...seoConfig} />
      <div style={{ padding: 24 }}>
        <Title level={2}><FormatPainterOutlined /> CSS格式化压缩</Title>
        <Text type="secondary">CSS代码格式化、压缩、美化</Text>
        <Row gutter={24} style={{ marginTop: 24 }}>
          <Col xs={24} lg={12}>
            <Card title="输入CSS">
              <Editor height={400} language="css" value={input} onChange={(v) => setInput(v || '')} />
              <Space style={{ marginTop: 16 }}>
                <Button type="primary" icon={<ExpandOutlined />} onClick={handleFormat}>格式化</Button>
                <Button icon={<CompressOutlined />} onClick={handleCompress}>压缩</Button>
              </Space>
            </Card>
          </Col>
          <Col xs={24} lg={12}>
            <Card title="输出结果">
              <Editor height={400} language="css" value={output} options={{ readOnly: true }} />
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

export default CssFormatter;
