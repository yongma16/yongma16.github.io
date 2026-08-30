import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Input, Button, message, Typography, Space, Select, DatePicker, Tag, Divider } from 'antd';
import { CopyOutlined, SyncOutlined, ClockCircleOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { SEO, createToolJsonLd } from '@/components/SEO';

const { Title, Text } = Typography;
const { Option } = Select;

const dateFormats = [
  { label: 'YYYY-MM-DD HH:mm:ss', value: 'YYYY-MM-DD HH:mm:ss' },
  { label: 'YYYY-MM-DD HH:mm', value: 'YYYY-MM-DD HH:mm' },
  { label: 'YYYY-MM-DD', value: 'YYYY-MM-DD' },
  { label: 'YYYY/MM/DD HH:mm:ss', value: 'YYYY/MM/DD HH:mm:ss' },
  { label: 'MM-DD-YYYY HH:mm:ss', value: 'MM-DD-YYYY HH:mm:ss' },
  { label: 'YYYY年MM月DD日 HH:mm:ss', value: 'YYYY年MM月DD日 HH:mm:ss' },
];

const TimestampTool: React.FC = () => {
  const [timestamp, setTimestamp] = useState('');
  const [dateStr, setDateStr] = useState('');
  const [format, setFormat] = useState('YYYY-MM-DD HH:mm:ss');
  const [unit, setUnit] = useState<'ms' | 's'>('ms');
  const [currentTimestamp, setCurrentTimestamp] = useState('');

  const seoConfig = {
    title: '时间戳转换工具',
    description: '免费的在线时间戳转换工具，支持时间戳与格式化日期互相转换，支持秒/毫秒时间戳，多种日期格式选择。',
    keywords: '时间戳转换,时间戳工具,日期转换,Unix时间戳,毫秒时间戳,时间格式转换,在线时间戳',
    jsonLd: createToolJsonLd(
      '时间戳转换工具',
      '免费的在线时间戳和日期格式转换工具',
      'https://yma16.cloud/tools/timestamp-tool',
      'DeveloperApplication'
    ),
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTimestamp(Date.now().toString());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const timestampToDate = () => {
    if (!timestamp) {
      message.warning('请输入时间戳');
      return;
    }
    const ts = unit === 's' ? parseInt(timestamp) * 1000 : parseInt(timestamp);
    if (isNaN(ts)) {
      message.error('请输入有效的时间戳');
      return;
    }
    const date = dayjs(ts);
    if (!date.isValid()) {
      message.error('时间戳无效');
      return;
    }
    setDateStr(date.format(format));
  };

  const dateToTimestamp = () => {
    if (!dateStr) {
      message.warning('请输入日期');
      return;
    }
    const date = dayjs(dateStr, format);
    if (!date.isValid()) {
      message.error('日期格式不匹配');
      return;
    }
    const ts = unit === 's' ? date.valueOf() / 1000 : date.valueOf();
    setTimestamp(Math.floor(ts).toString());
  };

  const getCurrentTime = () => {
    const now = Date.now();
    setTimestamp(unit === 's' ? Math.floor(now / 1000).toString() : now.toString());
    setDateStr(dayjs(now).format(format));
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    message.success('已复制到剪贴板');
  };

  return (
    <>
      <SEO {...seoConfig} />
      <div style={{ padding: 24 }}>
        <Title level={2}>
          <ClockCircleOutlined /> 时间戳转换
        </Title>
        <Text type="secondary">时间戳与日期互相转换，支持多种格式</Text>

        <Row gutter={[24, 24]} style={{ marginTop: 24 }}>
          <Col span={24}>
            <Card title="当前时间">
              <Space size="large">
                <Tag color="blue" style={{ fontSize: 16, padding: '8px 16px' }}>
                  毫秒: {currentTimestamp}
                </Tag>
                <Tag color="green" style={{ fontSize: 16, padding: '8px 16px' }}>
                  秒: {currentTimestamp ? Math.floor(parseInt(currentTimestamp) / 1000) : ''}
                </Tag>
                <Tag color="purple" style={{ fontSize: 16, padding: '8px 16px' }}>
                  {dayjs().format('YYYY-MM-DD HH:mm:ss')}
                </Tag>
              </Space>
            </Card>
          </Col>
        </Row>

        <Row gutter={[24, 24]} style={{ marginTop: 24 }}>
          <Col xs={24} lg={12}>
            <Card title="时间戳转日期">
              <Space direction="vertical" style={{ width: '100%' }} size="middle">
                <Input.Group compact>
                  <Input
                    style={{ width: 'calc(100% - 200px)' }}
                    placeholder="输入时间戳"
                    value={timestamp}
                    onChange={(e) => setTimestamp(e.target.value)}
                    type="number"
                  />
                  <Select value={unit} onChange={setUnit} style={{ width: 100 }}>
                    <Option value="ms">毫秒</Option>
                    <Option value="s">秒</Option>
                  </Select>
                </Input.Group>

                <Select
                  value={format}
                  onChange={setFormat}
                  style={{ width: '100%' }}
                  placeholder="选择日期格式"
                >
                  {dateFormats.map(f => (
                    <Option key={f.value} value={f.value}>{f.label}</Option>
                  ))}
                </Select>

                <Space>
                  <Button type="primary" icon={<SyncOutlined />} onClick={timestampToDate}>
                    转换
                  </Button>
                  <Button onClick={getCurrentTime}>
                    获取当前时间
                  </Button>
                  <Button icon={<CopyOutlined />} onClick={() => copyToClipboard(timestamp)}>
                    复制时间戳
                  </Button>
                </Space>

                {dateStr && (
                  <Card size="small" style={{ background: '#f6ffed', borderColor: '#b7eb8f' }}>
                    <Text strong style={{ fontSize: 18 }}>
                      {dateStr}
                    </Text>
                    <Button
                      size="small"
                      icon={<CopyOutlined />}
                      onClick={() => copyToClipboard(dateStr)}
                      style={{ marginLeft: 16 }}
                    >
                      复制
                    </Button>
                  </Card>
                )}
              </Space>
            </Card>
          </Col>

          <Col xs={24} lg={12}>
            <Card title="日期转时间戳">
              <Space direction="vertical" style={{ width: '100%' }} size="middle">
                <Input
                  placeholder={`输入日期 (${format})`}
                  value={dateStr}
                  onChange={(e) => setDateStr(e.target.value)}
                />

                <Select
                  value={format}
                  onChange={setFormat}
                  style={{ width: '100%' }}
                  placeholder="选择日期格式"
                >
                  {dateFormats.map(f => (
                    <Option key={f.value} value={f.value}>{f.label}</Option>
                  ))}
                </Select>

                <Select value={unit} onChange={setUnit} style={{ width: '100%' }}>
                  <Option value="ms">毫秒</Option>
                  <Option value="s">秒</Option>
                </Select>

                <Space>
                  <Button type="primary" icon={<SyncOutlined />} onClick={dateToTimestamp}>
                    转换
                  </Button>
                  <Button icon={<CopyOutlined />} onClick={() => copyToClipboard(dateStr)}>
                    复制日期
                  </Button>
                </Space>

                {timestamp && (
                  <Card size="small" style={{ background: '#e6f7ff', borderColor: '#91d5ff' }}>
                    <Text strong style={{ fontSize: 18 }}>
                      {timestamp}
                    </Text>
                    <Text type="secondary" style={{ marginLeft: 8 }}>
                      ({unit === 'ms' ? '毫秒' : '秒'})
                    </Text>
                    <Button
                      size="small"
                      icon={<CopyOutlined />}
                      onClick={() => copyToClipboard(timestamp)}
                      style={{ marginLeft: 16 }}
                    >
                      复制
                    </Button>
                  </Card>
                )}
              </Space>
            </Card>
          </Col>
        </Row>
      </div>
    </>
  );
};

export default TimestampTool;
