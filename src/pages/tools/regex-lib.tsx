import React, { useState } from 'react';
import { Card, Button, message, Typography, Space, Row, Col, Tag, Input } from 'antd';
import { CopyOutlined, BookOutlined, SearchOutlined } from '@ant-design/icons';
import { SEO, createToolJsonLd } from '@/components/SEO';

const { Title, Text } = Typography;

interface RegexTemplate {
  name: string;
  pattern: string;
  desc: string;
  tags: string[];
}

const templates: RegexTemplate[] = [
  { name: '手机号', pattern: '^1[3-9]\\d{9}$', desc: '中国大陆手机号', tags: ['常用'] },
  { name: '邮箱', pattern: '^[\\w-]+(\\.[\\w-]+)*@[\\w-]+(\\.[\\w-]+)+$', desc: '电子邮箱地址', tags: ['常用'] },
  { name: '身份证号', pattern: '^[1-9]\\d{5}(18|19|20)\\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\\d{3}[0-9Xx]$', desc: '中国大陆身份证号', tags: ['常用'] },
  { name: 'URL', pattern: '^https?://[\\w-]+(\\.[\\w-]+)+([\\w.,@?^=%&:/~+#-]*[\\w@?^=%&/~+#-])?$', desc: 'HTTP/HTTPS URL', tags: ['常用'] },
  { name: 'IP地址', pattern: '^((25[0-5]|2[0-4]\\d|[01]?\\d\\d?)\\.){3}(25[0-5]|2[0-4]\\d|[01]?\\d\\d?)$', desc: 'IPv4地址', tags: ['网络'] },
  { name: '中文字符', pattern: '[\\u4e00-\\u9fa5]+', desc: '匹配中文字符', tags: ['文本'] },
  { name: '数字', pattern: '^\\d+$', desc: '纯数字', tags: ['常用'] },
  { name: '字母', pattern: '^[a-zA-Z]+$', desc: '纯字母', tags: ['常用'] },
  { name: '字母数字', pattern: '^[a-zA-Z0-9]+$', desc: '字母和数字', tags: ['常用'] },
  { name: '密码强度', pattern: '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)[a-zA-Z\\d@$!%*?&]{8,}$', desc: '至少8位，包含大小写字母和数字', tags: ['安全'] },
  { name: '日期(YYYY-MM-DD)', pattern: '^\\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\\d|3[01])$', desc: '标准日期格式', tags: ['时间'] },
  { name: '时间(HH:MM:SS)', pattern: '^([01]\\d|2[0-3]):[0-5]\\d:[0-5]\\d$', desc: '24小时制时间', tags: ['时间'] },
  { name: 'MAC地址', pattern: '^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$', desc: 'MAC地址', tags: ['网络'] },
  { name: 'Hex颜色', pattern: '^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$', desc: '十六进制颜色值', tags: ['颜色'] },
  { name: 'HTML标签', pattern: '<[^>]+>', desc: '匹配HTML标签', tags: ['HTML'] },
];

const RegexLib: React.FC = () => {
  const [search, setSearch] = useState('');

  const seoConfig = {
    title: '正则常用模板库',
    description: '常用正则表达式模板库，包含手机号、邮箱、身份证、URL等常用正则模板，一键复制使用。',
    keywords: '正则模板,正则表达式库,常用正则,手机号正则,邮箱正则,身份证正则',
    jsonLd: createToolJsonLd('正则常用模板库', '常用正则表达式模板库', 'https://yma16.cloud/tools/regex-lib', 'DeveloperApplication'),
  };

  const filtered = templates.filter(t =>
    t.name.includes(search) || t.desc.includes(search) || t.tags.some(tag => tag.includes(search))
  );

  const copy = (text: string) => {
    navigator.clipboard.writeText(text);
    message.success('已复制');
  };

  return (
    <>
      <SEO {...seoConfig} />
      <div style={{ padding: 24 }}>
        <Title level={2}><BookOutlined /> 正则模板库</Title>
        <Text type="secondary">常用正则表达式模板，一键复制</Text>

        <Card style={{ marginTop: 24, marginBottom: 24 }}>
          <Input
            placeholder="搜索模板..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            prefix={<SearchOutlined />}
            style={{ width: 300 }}
          />
        </Card>

        <Row gutter={[16, 16]}>
          {filtered.map((item) => (
            <Col xs={24} md={12} lg={8} key={item.name}>
              <Card
                size="small"
                title={item.name}
                extra={
                  <Button size="small" icon={<CopyOutlined />} onClick={() => copy(item.pattern)}>
                    复制
                  </Button>
                }
              >
                <Text code copyable style={{ wordBreak: 'break-all', display: 'block', marginBottom: 8 }}>
                  {item.pattern}
                </Text>
                <Text type="secondary">{item.desc}</Text>
                <div style={{ marginTop: 8 }}>
                  {item.tags.map(tag => (
                    <Tag key={tag} color="blue">{tag}</Tag>
                  ))}
                </div>
              </Card>
            </Col>
          ))}
        </Row>
      </div>
    </>
  );
};

export default RegexLib;
