import React, { useState, useCallback } from 'react';
import { Card, Row, Col, Input, Button, message, Typography, Space, Select } from 'antd';
import { CopyOutlined, ColumnWidthOutlined } from '@ant-design/icons';
import { SEO, createToolJsonLd } from '@/components/SEO';

const { Title, Text } = Typography;
const { Option } = Select;

const UnitConvert: React.FC = () => {
  const [pxValue, setPxValue] = useState(16);
  const [rootFontSize, setRootFontSize] = useState(16);
  const [results, setResults] = useState({ rem: 1, em: 1, px: 16, vw: 1, vh: 1 });

  const seoConfig = {
    title: 'CSS单位换算器',
    description: 'CSS px/rem/em/vw/vh单位换算器，支持互相转换，前端开发常用工具。',
    keywords: 'CSS单位换算,px转rem,rem转px,em换算,vw换算,前端单位转换',
    jsonLd: createToolJsonLd('CSS单位换算器', 'CSS px/rem/em/vw/vh单位换算工具', 'https://yma16.cloud/tools/unit-convert', 'DeveloperApplication'),
  };

  const calculate = useCallback((px: number, root: number) => {
    setResults({
      rem: parseFloat((px / root).toFixed(4)),
      em: parseFloat((px / root).toFixed(4)),
      px: px,
      vw: parseFloat((px / 19.2).toFixed(4)), // 假设1920px设计稿
      vh: parseFloat((px / 10.8).toFixed(4)), // 假设1080px设计稿
    });
  }, []);

  const handlePxChange = (value: number) => {
    setPxValue(value);
    calculate(value, rootFontSize);
  };

  const handleRootChange = (value: number) => {
    setRootFontSize(value);
    calculate(pxValue, value);
  };

  const copy = (text: string) => {
    navigator.clipboard.writeText(text);
    message.success('已复制');
  };

  const units = [
    { label: 'PX', value: results.px, css: `${results.px}px` },
    { label: 'REM', value: results.rem, css: `${results.rem}rem` },
    { label: 'EM', value: results.em, css: `${results.em}em` },
    { label: 'VW', value: results.vw, css: `${results.vw}vw` },
    { label: 'VH', value: results.vh, css: `${results.vh}vh` },
  ];

  return (
    <>
      <SEO {...seoConfig} />
      <div style={{ padding: 24 }}>
        <Title level={2}><ColumnWidthOutlined /> CSS单位换算</Title>
        <Text type="secondary">px/rem/em/vw/vh 互相转换</Text>

        <Row gutter={24} style={{ marginTop: 24 }}>
          <Col span={24}>
            <Card>
              <Space size="large">
                <Space>
                  <Text>PX值:</Text>
                  <Input type="number" value={pxValue} onChange={(e) => handlePxChange(Number(e.target.value))} style={{ width: 120 }} />
                </Space>
                <Space>
                  <Text>根字体大小:</Text>
                  <Input type="number" value={rootFontSize} onChange={(e) => handleRootChange(Number(e.target.value))} style={{ width: 120 }} />
                  <Text type="secondary">px (默认16px)</Text>
                </Space>
              </Space>
            </Card>
          </Col>
        </Row>

        <Row gutter={24} style={{ marginTop: 24 }}>
          {units.map((unit) => (
            <Col xs={12} md={8} lg={4} key={unit.label}>
              <Card title={unit.label}>
                <Text strong style={{ fontSize: 24 }}>{unit.value}</Text>
                <div style={{ marginTop: 8 }}>
                  <Text code copyable>{unit.css}</Text>
                </div>
                <Button size="small" icon={<CopyOutlined />} onClick={() => copy(unit.css)} style={{ marginTop: 8 }}>复制</Button>
              </Card>
            </Col>
          ))}
        </Row>

        <Row style={{ marginTop: 24 }}>
          <Col span={24}>
            <Card title="常用换算表 (根字体16px)">
              <Row gutter={[16, 16]}>
                {[...Array(10)].map((_, i) => {
                  const px = (i + 1) * 4;
                  return (
                    <Col span={6} key={px}>
                      <Text>{px}px = {px / 16}rem</Text>
                    </Col>
                  );
                })}
              </Row>
            </Card>
          </Col>
        </Row>
      </div>
    </>
  );
};

export default UnitConvert;
