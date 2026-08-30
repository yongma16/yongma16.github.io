import React, { useState } from 'react';
import { Card, Button, message, Typography, Space, Row, Col, InputNumber, Checkbox, Input } from 'antd';
import { CopyOutlined, ReloadOutlined, KeyOutlined } from '@ant-design/icons';
import { SEO, createToolJsonLd } from '@/components/SEO';

const { Title, Text } = Typography;

const RandomString: React.FC = () => {
  const [length, setLength] = useState(16);
  const [count, setCount] = useState(5);
  const [useUpper, setUseUpper] = useState(true);
  const [useLower, setUseLower] = useState(true);
  const [useNumber, setUseNumber] = useState(true);
  const [useSpecial, setUseSpecial] = useState(false);
  const [customChars, setCustomChars] = useState('');
  const [results, setResults] = useState<string[]>([]);

  const seoConfig = {
    title: '随机字符串生成器',
    description: '随机字符串生成器，支持自定义字符集、长度、生成数量，可用于密码、密钥、验证码生成。',
    keywords: '随机字符串,密码生成器,随机密码,密钥生成,验证码生成',
    jsonLd: createToolJsonLd('随机字符串生成器', '随机字符串和密码生成器', 'https://yma16.cloud/tools/random-string', 'DeveloperApplication'),
  };

  const generate = () => {
    let chars = customChars;
    if (!customChars) {
      if (useLower) chars += 'abcdefghijklmnopqrstuvwxyz';
      if (useUpper) chars += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
      if (useNumber) chars += '0123456789';
      if (useSpecial) chars += '!@#$%^&*()_+-=[]{}|;:,.<>?';
    }

    if (!chars) {
      message.warning('请选择字符集或输入自定义字符');
      return;
    }

    const arr: string[] = [];
    for (let i = 0; i < count; i++) {
      let str = '';
      for (let j = 0; j < length; j++) {
        str += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      arr.push(str);
    }
    setResults(arr);
  };

  const copy = (text: string) => {
    navigator.clipboard.writeText(text);
    message.success('已复制');
  };

  const copyAll = () => {
    navigator.clipboard.writeText(results.join('\n'));
    message.success('全部已复制');
  };

  return (
    <>
      <SEO {...seoConfig} />
      <div style={{ padding: 24 }}>
        <Title level={2}><KeyOutlined /> 随机字符串生成</Title>
        <Text type="secondary">自定义字符集、长度、生成数量</Text>

        <Row gutter={24} style={{ marginTop: 24 }}>
          <Col xs={24} lg={12}>
            <Card title="设置">
              <Space direction="vertical" style={{ width: '100%' }}>
                <Space>
                  <Text>长度:</Text>
                  <InputNumber min={1} max={128} value={length} onChange={(v) => setLength(v || 1)} />
                  <Text>数量:</Text>
                  <InputNumber min={1} max={50} value={count} onChange={(v) => setCount(v || 1)} />
                </Space>

                <div>
                  <Text>字符集:</Text>
                  <Space style={{ marginLeft: 16 }}>
                    <Checkbox checked={useLower} onChange={(e) => setUseLower(e.target.checked)}>小写字母</Checkbox>
                    <Checkbox checked={useUpper} onChange={(e) => setUseUpper(e.target.checked)}>大写字母</Checkbox>
                    <Checkbox checked={useNumber} onChange={(e) => setUseNumber(e.target.checked)}>数字</Checkbox>
                    <Checkbox checked={useSpecial} onChange={(e) => setUseSpecial(e.target.checked)}>特殊字符</Checkbox>
                  </Space>
                </div>

                <div>
                  <Text>自定义字符:</Text>
                  <Input
                    placeholder="输入自定义字符集，将覆盖上方选择"
                    value={customChars}
                    onChange={(e) => setCustomChars(e.target.value)}
                    style={{ marginTop: 8 }}
                  />
                </div>

                <Button type="primary" icon={<ReloadOutlined />} onClick={generate}>生成</Button>
              </Space>
            </Card>
          </Col>
          <Col xs={24} lg={12}>
            <Card
              title="生成结果"
              extra={results.length > 0 && <Button size="small" icon={<CopyOutlined />} onClick={copyAll}>复制全部</Button>}
            >
              <Space direction="vertical" style={{ width: '100%' }}>
                {results.map((item, idx) => (
                  <Card key={idx} size="small">
                    <Space style={{ width: '100%', justifyContent: 'space-between' }}>
                      <Text code copyable style={{ fontSize: 14 }}>{item}</Text>
                      <Button size="small" icon={<CopyOutlined />} onClick={() => copy(item)}>复制</Button>
                    </Space>
                  </Card>
                ))}
                {results.length === 0 && <Text type="secondary">点击生成按钮创建随机字符串</Text>}
              </Space>
            </Card>
          </Col>
        </Row>
      </div>
    </>
  );
};

export default RandomString;
