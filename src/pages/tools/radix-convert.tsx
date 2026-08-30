import React, { useState, useCallback } from 'react';
import { Card, Row, Col, Input, Button, message, Typography, Space, Select } from 'antd';
import { CopyOutlined, SwapOutlined } from '@ant-design/icons';
import { SEO, createToolJsonLd } from '@/components/SEO';

const { Title, Text } = Typography;
const { Option } = Select;

const RadixConvert: React.FC = () => {
  const [input, setInput] = useState('');
  const [fromBase, setFromBase] = useState(10);
  const [results, setResults] = useState({ bin: '', oct: '', dec: '', hex: '' });

  const seoConfig = {
    title: '进制转换工具',
    description: '2/8/10/16进制互相转换器，支持二进制、八进制、十进制、十六进制转换。',
    keywords: '进制转换,二进制,八进制,十进制,十六进制,2进制,16进制',
    jsonLd: createToolJsonLd('进制转换工具', '2/8/10/16进制互相转换器', 'https://yma16.cloud/tools/radix-convert', 'DeveloperApplication'),
  };

  const convert = useCallback(() => {
    if (!input) return;
    try {
      const decimal = parseInt(input, fromBase);
      if (isNaN(decimal)) throw new Error('Invalid number');
      setResults({
        bin: decimal.toString(2),
        oct: decimal.toString(8),
        dec: decimal.toString(10),
        hex: decimal.toString(16).toUpperCase(),
      });
    } catch {
      message.error('输入格式错误');
    }
  }, [input, fromBase]);

  const copy = (text: string) => {
    navigator.clipboard.writeText(text);
    message.success('已复制');
  };

  return (
    <>
      <SEO {...seoConfig} />
      <div style={{ padding: 24 }}>
        <Title level={2}><SwapOutlined /> 进制转换</Title>
        <Text type="secondary">2/8/10/16进制互相转换</Text>
        <Row gutter={24} style={{ marginTop: 24 }}>
          <Col span={24}>
            <Card>
              <Space>
                <Input value={input} onChange={(e) => setInput(e.target.value)} placeholder="输入数字" style={{ width: 300 }} />
                <Select value={fromBase} onChange={setFromBase} style={{ width: 120 }}>
                  <Option value={2}>二进制</Option>
                  <Option value={8}>八进制</Option>
                  <Option value={10}>十进制</Option>
                  <Option value={16}>十六进制</Option>
                </Select>
                <Button type="primary" onClick={convert}>转换</Button>
              </Space>
            </Card>
          </Col>
        </Row>
        <Row gutter={24} style={{ marginTop: 24 }}>
          {[
            { label: '二进制 (BIN)', value: results.bin, base: 2 },
            { label: '八进制 (OCT)', value: results.oct, base: 8 },
            { label: '十进制 (DEC)', value: results.dec, base: 10 },
            { label: '十六进制 (HEX)', value: results.hex, base: 16 },
          ].map((item) => (
            <Col xs={24} md={12} lg={6} key={item.base}>
              <Card title={item.label}>
                <Text code copyable style={{ wordBreak: 'break-all' }}>{item.value || '-'}</Text>
                <Button size="small" icon={<CopyOutlined />} onClick={() => copy(item.value)} style={{ marginTop: 8 }}>复制</Button>
              </Card>
            </Col>
          ))}
        </Row>
      </div>
    </>
  );
};

export default RadixConvert;
