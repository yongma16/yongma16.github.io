import React, { useState } from 'react';
import { Card, Button, message, Typography, Space, Row, Col, Table, Tag } from 'antd';
import { CopyOutlined, CoffeeOutlined } from '@ant-design/icons';
import Editor from '@monaco-editor/react';
import { SEO, createToolJsonLd } from '@/components/SEO';

const { Title, Text } = Typography;

interface CookieItem {
  name: string;
  value: string;
  domain?: string;
  path?: string;
  expires?: string;
  secure?: boolean;
  httpOnly?: boolean;
  sameSite?: string;
}

const CookieParser: React.FC = () => {
  const [input, setInput] = useState('');
  const [cookies, setCookies] = useState<CookieItem[]>([]);

  const seoConfig = {
    title: 'Cookie解析工具',
    description: 'Cookie字符串解析工具，解析Cookie名称、值、过期时间、安全属性等。',
    keywords: 'Cookie解析,Cookie工具,Cookie字符串,Cookie分析',
    jsonLd: createToolJsonLd('Cookie解析工具', 'Cookie字符串解析工具', 'https://yma16.cloud/tools/cookie-parser', 'DeveloperApplication'),
  };

  const parseCookie = () => {
    if (!input.trim()) {
      message.warning('请输入Cookie字符串');
      return;
    }

    const items: CookieItem[] = [];
    const pairs = input.split(';');

    pairs.forEach((pair, index) => {
      const trimmed = pair.trim();
      if (!trimmed) return;

      const eqIndex = trimmed.indexOf('=');
      if (eqIndex === -1) {
        // 可能是属性标记
        const lower = trimmed.toLowerCase();
        if (index > 0) {
          const lastItem = items[items.length - 1];
          if (lower === 'secure') lastItem.secure = true;
          if (lower === 'httponly') lastItem.httpOnly = true;
          if (lower.startsWith('samesite=')) lastItem.sameSite = trimmed.split('=')[1];
        }
        return;
      }

      const name = trimmed.substring(0, eqIndex).trim();
      const value = trimmed.substring(eqIndex + 1).trim();

      if (index === 0 || !['domain', 'path', 'expires', 'max-age'].includes(name.toLowerCase())) {
        items.push({ name, value });
      } else if (items.length > 0) {
        const lastItem = items[items.length - 1];
        const lowerName = name.toLowerCase();
        if (lowerName === 'domain') lastItem.domain = value;
        if (lowerName === 'path') lastItem.path = value;
        if (lowerName === 'expires') lastItem.expires = value;
      }
    });

    setCookies(items);
    message.success(`解析出 ${items.length} 个Cookie`);
  };

  const columns = [
    { title: '名称', dataIndex: 'name', key: 'name' },
    { title: '值', dataIndex: 'value', key: 'value', ellipsis: true },
    { title: 'Domain', dataIndex: 'domain', key: 'domain' },
    { title: 'Path', dataIndex: 'path', key: 'path' },
    { title: 'Expires', dataIndex: 'expires', key: 'expires' },
    {
      title: '属性',
      key: 'attrs',
      render: (_: any, record: CookieItem) => (
        <Space>
          {record.secure && <Tag color="green">Secure</Tag>}
          {record.httpOnly && <Tag color="blue">HttpOnly</Tag>}
          {record.sameSite && <Tag color="orange">{record.sameSite}</Tag>}
        </Space>
      ),
    },
  ];

  return (
    <>
      <SEO {...seoConfig} />
      <div style={{ padding: 24 }}>
        <Title level={2}><CoffeeOutlined /> Cookie解析</Title>
        <Text type="secondary">解析Cookie字符串，查看名称、值和属性</Text>
        <Row gutter={24} style={{ marginTop: 24 }}>
          <Col span={24}>
            <Card title="Cookie字符串">
              <Editor height={150} language="text" value={input} onChange={(v) => setInput(v || '')} />
              <Space style={{ marginTop: 16 }}>
                <Button type="primary" onClick={parseCookie}>解析</Button>
                <Button onClick={() => { setInput(''); setCookies([]); }}>清空</Button>
              </Space>
            </Card>
          </Col>
        </Row>
        {cookies.length > 0 && (
          <Row style={{ marginTop: 24 }}>
            <Col span={24}>
              <Card title={`解析结果 (${cookies.length}个)`}>
                <Table dataSource={cookies} columns={columns} rowKey="name" size="small" pagination={false} />
              </Card>
            </Col>
          </Row>
        )}
      </div>
    </>
  );
};

export default CookieParser;
