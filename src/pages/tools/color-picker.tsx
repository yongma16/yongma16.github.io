import React, { useState, useCallback, useEffect } from 'react';
import { Card, Row, Col, Input, Button, message, Typography, Space, Tabs, ColorPicker, Tag, Divider } from 'antd';
import { CopyOutlined, SyncOutlined, BgColorsOutlined } from '@ant-design/icons';
import { SEO, createToolJsonLd } from '@/components/SEO';

const { Title, Text } = Typography;

// HEX 转 RGB
const hexToRgb = (hex: string): { r: number; g: number; b: number } | null => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16),
  } : null;
};

// RGB 转 HEX
const rgbToHex = (r: number, g: number, b: number): string => {
  return '#' + [r, g, b].map(x => {
    const hex = Math.max(0, Math.min(255, x)).toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  }).join('');
};

// RGB 转 HSL
const rgbToHsl = (r: number, g: number, b: number): { h: number; s: number; l: number } => {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0, s = 0, l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
      case g: h = ((b - r) / d + 2) / 6; break;
      case b: h = ((r - g) / d + 4) / 6; break;
    }
  }
  return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
};

// HSL 转 RGB
const hslToRgb = (h: number, s: number, l: number): { r: number; g: number; b: number } => {
  h /= 360; s /= 100; l /= 100;
  let r: number, g: number, b: number;
  if (s === 0) {
    r = g = b = l;
  } else {
    const hue2rgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1/6) return p + (q - p) * 6 * t;
      if (t < 1/2) return q;
      if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
      return p;
    };
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1/3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1/3);
  }
  return {
    r: Math.round(r * 255),
    g: Math.round(g * 255),
    b: Math.round(b * 255),
  };
};

const ColorPickerTool: React.FC = () => {
  const [color, setColor] = useState<string>('#1890ff');
  const [hexInput, setHexInput] = useState('#1890ff');
  const [rgbInput, setRgbInput] = useState({ r: 24, g: 144, b: 255 });
  const [rgbaInput, setRgbaInput] = useState({ r: 24, g: 144, b: 255, a: 1 });
  const [hslInput, setHslInput] = useState({ h: 212, s: 100, l: 54 });

  const seoConfig = {
    title: '颜色选择器工具',
    description: '免费的在线颜色选择器工具，支持拾色器取色、HEX/RGB/RGBA/HSL 互相转换、颜色预览和一键复制色值。',
    keywords: '颜色选择器,取色器,HEX转RGB,RGB转HEX,HSL转换,颜色转换工具,在线取色器,颜色拾取',
    jsonLd: createToolJsonLd(
      '颜色选择器工具',
      '免费的在线颜色选择和转换工具',
      'https://yma16.cloud/tools/color-picker',
      'DeveloperApplication'
    ),
  };

  const updateAllFormats = useCallback((newColor: string) => {
    setColor(newColor);
    setHexInput(newColor);
    const rgb = hexToRgb(newColor);
    if (rgb) {
      setRgbInput(rgb);
      setRgbaInput({ ...rgb, a: 1 });
      setHslInput(rgbToHsl(rgb.r, rgb.g, rgb.b));
    }
  }, []);

  const handleHexChange = (value: string) => {
    setHexInput(value);
    if (/^#[0-9A-Fa-f]{6}$/.test(value)) {
      updateAllFormats(value);
    }
  };

  const handleRgbChange = (key: string, value: number) => {
    const newRgb = { ...rgbInput, [key]: Math.max(0, Math.min(255, value)) };
    setRgbInput(newRgb);
    const hex = rgbToHex(newRgb.r, newRgb.g, newRgb.b);
    setColor(hex);
    setHexInput(hex);
    setRgbaInput({ ...newRgb, a: rgbaInput.a });
    setHslInput(rgbToHsl(newRgb.r, newRgb.g, newRgb.b));
  };

  const handleRgbaChange = (key: string, value: number) => {
    const newRgba = { ...rgbaInput, [key]: value };
    setRgbaInput(newRgba);
    if (key !== 'a') {
      const hex = rgbToHex(newRgba.r, newRgba.g, newRgba.b);
      setColor(hex);
      setHexInput(hex);
      setRgbInput({ r: newRgba.r, g: newRgba.g, b: newRgba.b });
      setHslInput(rgbToHsl(newRgba.r, newRgba.g, newRgba.b));
    }
  };

  const handleHslChange = (key: string, value: number) => {
    const newHsl = { ...hslInput, [key]: value };
    setHslInput(newHsl);
    const rgb = hslToRgb(newHsl.h, newHsl.s, newHsl.l);
    const hex = rgbToHex(rgb.r, rgb.g, rgb.b);
    setColor(hex);
    setHexInput(hex);
    setRgbInput(rgb);
    setRgbaInput({ ...rgb, a: rgbaInput.a });
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
          <BgColorsOutlined /> 颜色选择器
        </Title>
        <Text type="secondary">拾色取色、格式转换、一键复制</Text>

        <Row gutter={[24, 24]} style={{ marginTop: 24 }}>
          <Col xs={24} lg={12}>
            <Card title="颜色预览">
              <div style={{ textAlign: 'center', padding: 40 }}>
                <div
                  style={{
                    width: 200,
                    height: 200,
                    margin: '0 auto 24px',
                    backgroundColor: color,
                    borderRadius: 12,
                    border: '2px solid #d9d9d9',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                  }}
                />
                <ColorPicker
                  value={color}
                  onChange={(c) => updateAllFormats(c.toHexString())}
                  showText
                  style={{ marginBottom: 16 }}
                />
              </div>
            </Card>
          </Col>

          <Col xs={24} lg={12}>
            <Card title="颜色格式转换">
              <Space direction="vertical" style={{ width: '100%' }} size="large">
                {/* HEX */}
                <div>
                  <Text strong>HEX</Text>
                  <Input.Group compact>
                    <Input
                      style={{ width: 'calc(100% - 80px)' }}
                      value={hexInput}
                      onChange={(e) => handleHexChange(e.target.value)}
                      prefix="#"
                      maxLength={7}
                    />
                    <Button icon={<CopyOutlined />} onClick={() => copyToClipboard(hexInput)}>
                      复制
                    </Button>
                  </Input.Group>
                </div>

                {/* RGB */}
                <div>
                  <Text strong>RGB</Text>
                  <Input.Group compact>
                    <Input
                      style={{ width: 80 }}
                      value={rgbInput.r}
                      onChange={(e) => handleRgbChange('r', Number(e.target.value))}
                      addonBefore="R"
                      type="number"
                    />
                    <Input
                      style={{ width: 80 }}
                      value={rgbInput.g}
                      onChange={(e) => handleRgbChange('g', Number(e.target.value))}
                      addonBefore="G"
                      type="number"
                    />
                    <Input
                      style={{ width: 80 }}
                      value={rgbInput.b}
                      onChange={(e) => handleRgbChange('b', Number(e.target.value))}
                      addonBefore="B"
                      type="number"
                    />
                    <Button
                      icon={<CopyOutlined />}
                      onClick={() => copyToClipboard(`rgb(${rgbInput.r}, ${rgbInput.g}, ${rgbInput.b})`)}
                    >
                      复制
                    </Button>
                  </Input.Group>
                </div>

                {/* RGBA */}
                <div>
                  <Text strong>RGBA</Text>
                  <Input.Group compact>
                    <Input
                      style={{ width: 70 }}
                      value={rgbaInput.r}
                      onChange={(e) => handleRgbaChange('r', Number(e.target.value))}
                      addonBefore="R"
                      type="number"
                    />
                    <Input
                      style={{ width: 70 }}
                      value={rgbaInput.g}
                      onChange={(e) => handleRgbaChange('g', Number(e.target.value))}
                      addonBefore="G"
                      type="number"
                    />
                    <Input
                      style={{ width: 70 }}
                      value={rgbaInput.b}
                      onChange={(e) => handleRgbaChange('b', Number(e.target.value))}
                      addonBefore="B"
                      type="number"
                    />
                    <Input
                      style={{ width: 90 }}
                      value={rgbaInput.a}
                      onChange={(e) => handleRgbaChange('a', Number(e.target.value))}
                      addonBefore="A"
                      step={0.1}
                      max={1}
                      min={0}
                      type="number"
                    />
                    <Button
                      icon={<CopyOutlined />}
                      onClick={() => copyToClipboard(`rgba(${rgbaInput.r}, ${rgbaInput.g}, ${rgbaInput.b}, ${rgbaInput.a})`)}
                    >
                      复制
                    </Button>
                  </Input.Group>
                </div>

                {/* HSL */}
                <div>
                  <Text strong>HSL</Text>
                  <Input.Group compact>
                    <Input
                      style={{ width: 80 }}
                      value={hslInput.h}
                      onChange={(e) => handleHslChange('h', Number(e.target.value))}
                      addonBefore="H"
                      type="number"
                      max={360}
                    />
                    <Input
                      style={{ width: 80 }}
                      value={hslInput.s}
                      onChange={(e) => handleHslChange('s', Number(e.target.value))}
                      addonBefore="S"
                      type="number"
                      max={100}
                    />
                    <Input
                      style={{ width: 80 }}
                      value={hslInput.l}
                      onChange={(e) => handleHslChange('l', Number(e.target.value))}
                      addonBefore="L"
                      type="number"
                      max={100}
                    />
                    <Button
                      icon={<CopyOutlined />}
                      onClick={() => copyToClipboard(`hsl(${hslInput.h}, ${hslInput.s}%, ${hslInput.l}%)`)}
                    >
                      复制
                    </Button>
                  </Input.Group>
                </div>
              </Space>
            </Card>
          </Col>
        </Row>

        <Row style={{ marginTop: 24 }}>
          <Col span={24}>
            <Card title="常用颜色">
              <Space wrap>
                {['#ff4d4f', '#ff7a45', '#ffa940', '#ffc53d', '#73d13d', '#36cfc9', '#40a9ff', '#597ef7', '#9254de', '#f759ab'].map(c => (
                  <div
                    key={c}
                    style={{
                      width: 40,
                      height: 40,
                      backgroundColor: c,
                      borderRadius: 8,
                      cursor: 'pointer',
                      border: color === c ? '3px solid #1890ff' : '2px solid transparent',
                    }}
                    onClick={() => updateAllFormats(c)}
                    title={c}
                  />
                ))}
              </Space>
            </Card>
          </Col>
        </Row>
      </div>
    </>
  );
};

export default ColorPickerTool;
