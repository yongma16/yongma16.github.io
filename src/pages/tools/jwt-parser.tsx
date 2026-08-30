import React, { useState } from 'react';
import { Card, Button, message, Typography, Space, Row, Col, Tag, Table } from 'antd';
import { CopyOutlined, SafetyOutlined, EyeOutlined } from '@ant-design/icons';
import Editor from '@monaco-editor/react';
import { SEO, createToolJsonLd } from '@/components/SEO';

const { Title, Text } = Typography;

const JwtParser: React.FC = () => {
  const [input, setInput] = useState('');
  const [header, setHeader] = useState('');
  const [payload, setPayload] = useState('');
  const [signature, setSignature] = useState('');
  const [isValid, setIsValid] = useState<boolean | null>(null);

  const seoConfig = {
    title: 'JWT Token解析工具',
    description: 'JWT Token在线解析工具，解析Header、Payload、Signature，验证Token有效性。',
    keywords: 'JWT解析,JWT Token,Token解析,JWT解码,JSON Web Token',
    jsonLd: createToolJsonLd('JWT Token解析工具', 'JWT Token在线解析工具', 'https://yma16.cloud/tools/jwt-parser', 'DeveloperApplication'),
  };

  const parseJWT = () => {
    if (!input.trim()) {
      message.warning('请输入JWT Token');
      return;
    }

    try {
      const parts = input.split('.');
      if (parts.length !== 3) {
        throw new Error('JWT格式不正确');
      }

      // 解析Header
      const headerJson = JSON.parse(atob(parts[0].replace(/-/g, '+').replace(/_/g, '/')));
      setHeader(JSON.stringify(headerJson, null, 2));

      // 解析Payload
      const payloadJson = JSON.parse(atob(parts[1].replace(/-/g, '+').replace(/_/g, '/')));
      setPayload(JSON.stringify(payloadJson, null, 2));

      // 保存Signature
      setSignature(parts[2]);
      setIsValid(true);

      // 检查过期时间
      if (payloadJson.exp) {
        const expDate = new Date(payloadJson.exp * 1000);
        const now = new Date();
        if (expDate < now) {
          message.warning('Token已过期');
        } else {
          message.success('Token有效');
        }
      }
    } catch (e) {
      setIsValid(false);
      message.error('JWT解析失败: ' + (e as Error).message);
    }
  };

  const copy = (text: string) => {
    navigator.clipboard.writeText(text);
    message.success('已复制');
  };

  return (
    <>
      <SEO {...seoConfig} />
      <div style={{ padding: 24 }}>
        <Title level={2}><SafetyOutlined /> JWT Token解析</Title>
        <Text type="secondary">解析JWT Token的Header、Payload和Signature</Text>
        <Row gutter={24} style={{ marginTop: 24 }}>
          <Col span={24}>
            <Card title="JWT Token">
              <Editor height={100} language="text" value={input} onChange={(v) => setInput(v || '')} />
              <Space style={{ marginTop: 16 }}>
                <Button type="primary" icon={<EyeOutlined />} onClick={parseJWT}>解析</Button>
                {isValid !== null && (
                  <Tag color={isValid ? 'success' : 'error'}>{isValid ? '格式有效' : '格式错误'}</Tag>
                )}
              </Space>
            </Card>
          </Col>
        </Row>
        {header && (
          <Row gutter={24} style={{ marginTop: 24 }}>
            <Col xs={24} lg={12}>
              <Card title="Header (头部)" extra={<Button size="small" icon={<CopyOutlined />} onClick={() => copy(header)}>复制</Button>}>
                <Editor height={200} language="json" value={header} options={{ readOnly: true }} />
              </Card>
            </Col>
            <Col xs={24} lg={12}>
              <Card title="Payload (载荷)" extra={<Button size="small" icon={<CopyOutlined />} onClick={() => copy(payload)}>复制</Button>}>
                <Editor height={200} language="json" value={payload} options={{ readOnly: true }} />
              </Card>
            </Col>
          </Row>
        )}
        {signature && (
          <Row style={{ marginTop: 24 }}>
            <Col span={24}>
              <Card title="Signature (签名)">
                <Text code copyable style={{ wordBreak: 'break-all' }}>{signature}</Text>
              </Card>
            </Col>
          </Row>
        )}
      </div>
    </>
  );
};

export default JwtParser;
