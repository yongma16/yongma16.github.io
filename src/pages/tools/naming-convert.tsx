import React, { useState } from 'react';
import { Card, Row, Col, Input, Button, message, Typography, Space, Tag } from 'antd';
import { CopyOutlined, SwapOutlined } from '@ant-design/icons';
import { SEO, createToolJsonLd } from '@/components/SEO';

const { Title, Text } = Typography;

type NamingStyle = 'camel' | 'pascal' | 'snake' | 'kebab' | 'upper' | 'lower';

const NamingConvert: React.FC = () => {
  const [input, setInput] = useState('');
  const [results, setResults] = useState<Record<NamingStyle, string>>({
    camel: '', pascal: '', snake: '', kebab: '', upper: '', lower: '',
  });

  const seoConfig = {
    title: '命名风格转换器',
    description: '驼峰、下划线、短横线等命名风格互转工具，支持批量转换。',
    keywords: '命名风格转换,驼峰命名,下划线命名,短横线命名,camelCase,snake_case',
    jsonLd: createToolJsonLd('命名风格转换器', '驼峰、下划线、短横线命名风格互转', 'https://yma16.cloud/tools/naming-convert', 'DeveloperApplication'),
  };

  const toWords = (str: string): string[] => {
    return str
      .replace(/([A-Z])/g, ' $1')
      .replace(/[-_]/g, ' ')
      .toLowerCase()
      .trim()
      .split(/\s+/)
      .filter(Boolean);
  };

  const convert = () => {
    const words = toWords(input);
    if (words.length === 0) return;

    setResults({
      camel: words[0] + words.slice(1).map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(''),
      pascal: words.map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(''),
      snake: words.join('_'),
      kebab: words.join('-'),
      upper: words.join('_').toUpperCase(),
      lower: words.join('_').toLowerCase(),
    });
  };

  const copy = (text: string) => {
    navigator.clipboard.writeText(text);
    message.success('已复制');
  };

  const styles: { key: NamingStyle; label: string; color: string }[] = [
    { key: 'camel', label: '驼峰 camelCase', color: 'blue' },
    { key: 'pascal', label: '帕斯卡 PascalCase', color: 'green' },
    { key: 'snake', label: '下划线 snake_case', color: 'orange' },
    { key: 'kebab', label: '短横线 kebab-case', color: 'purple' },
    { key: 'upper', label: '大写 UPPER_CASE', color: 'red' },
    { key: 'lower', label: '小写 lower_case', color: 'cyan' },
  ];

  return (
    <>
      <SEO {...seoConfig} />
      <div style={{ padding: 24 }}>
        <Title level={2}><SwapOutlined /> 命名风格转换</Title>
        <Text type="secondary">驼峰、下划线、短横线等命名风格互转</Text>
        <Row gutter={24} style={{ marginTop: 24 }}>
          <Col span={24}>
            <Card>
              <Space>
                <Input value={input} onChange={(e) => setInput(e.target.value)} placeholder="输入变量名，如: helloWorld 或 hello-world" style={{ width: 400 }} />
                <Button type="primary" onClick={convert}>转换</Button>
              </Space>
            </Card>
          </Col>
        </Row>
        <Row gutter={24} style={{ marginTop: 24 }}>
          {styles.map((s) => (
            <Col xs={24} md={12} lg={8} key={s.key}>
              <Card>
                <Tag color={s.color}>{s.label}</Tag>
                <div style={{ marginTop: 12 }}>
                  <Text code copyable style={{ fontSize: 16 }}>{results[s.key] || '-'}</Text>
                </div>
                <Button size="small" icon={<CopyOutlined />} onClick={() => copy(results[s.key])} style={{ marginTop: 8 }}>复制</Button>
              </Card>
            </Col>
          ))}
        </Row>
      </div>
    </>
  );
};

export default NamingConvert;
