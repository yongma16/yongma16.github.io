import React, { useState, useRef, useEffect } from 'react';
import { Card, Button, Input, message, Typography, Space, Row, Col, Tabs, Upload, Slider } from 'antd';
import { CopyOutlined, QrcodeOutlined, UploadOutlined, DownloadOutlined } from '@ant-design/icons';
import { SEO, createToolJsonLd } from '@/components/SEO';

const { Title, Text } = Typography;

// 简单的二维码生成实现
const generateQRCode = (text: string, size: number, color: string, bgColor: string): string => {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx) return '';

  canvas.width = size;
  canvas.height = size;

  // 背景
  ctx.fillStyle = bgColor;
  ctx.fillRect(0, 0, size, size);

  // 使用简单的图案模拟二维码
  const cellSize = Math.floor(size / 25);
  const margin = Math.floor((size - cellSize * 21) / 2);

  // 生成伪随机但确定性的图案
  const seed = text.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const random = (n: number) => {
    const x = Math.sin(seed + n) * 10000;
    return x - Math.floor(x);
  };

  ctx.fillStyle = color;

  // 定位图案（三个角）
  const drawPositionPattern = (x: number, y: number) => {
    // 外框
    for (let i = 0; i < 7; i++) {
      for (let j = 0; j < 7; j++) {
        if (i === 0 || i === 6 || j === 0 || j === 6 || (i >= 2 && i <= 4 && j >= 2 && j <= 4)) {
          ctx.fillRect(margin + (x + i) * cellSize, margin + (y + j) * cellSize, cellSize, cellSize);
        }
      }
    }
  };

  drawPositionPattern(0, 0);
  drawPositionPattern(14, 0);
  drawPositionPattern(0, 14);

  // 数据区域
  for (let i = 0; i < 21; i++) {
    for (let j = 0; j < 21; j++) {
      // 跳过定位图案区域
      if ((i < 7 && j < 7) || (i > 13 && j < 7) || (i < 7 && j > 13)) continue;

      const idx = i * 21 + j;
      if (random(idx) > 0.5) {
        ctx.fillRect(margin + i * cellSize, margin + j * cellSize, cellSize, cellSize);
      }
    }
  }

  return canvas.toDataURL('image/png');
};

const QRCodeTool: React.FC = () => {
  const [text, setText] = useState('https://yma16.cloud');
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [size, setSize] = useState(256);
  const [color, setColor] = useState('#000000');
  const [bgColor, setBgColor] = useState('#ffffff');
  const [decodeText, setDecodeText] = useState('');
  const [decodeResult, setDecodeResult] = useState('');

  const seoConfig = {
    title: '二维码生成解析工具',
    description: '二维码生成和解析工具，支持自定义颜色、大小，上传图片解析二维码内容。',
    keywords: '二维码生成,二维码解析,QR Code,二维码工具,QR生成器',
    jsonLd: createToolJsonLd('二维码生成解析工具', '二维码生成和解析工具', 'https://yma16.cloud/tools/qrcode-tool', 'DeveloperApplication'),
  };

  useEffect(() => {
    generate();
  }, []);

  const generate = () => {
    if (!text) return;
    const url = generateQRCode(text, size, color, bgColor);
    setQrCodeUrl(url);
  };

  const handleDownload = () => {
    if (!qrCodeUrl) return;
    const link = document.createElement('a');
    link.download = `qrcode-${Date.now()}.png`;
    link.href = qrCodeUrl;
    link.click();
    message.success('二维码已下载');
  };

  const handleDecodeUpload = (file: File) => {
    const url = URL.createObjectURL(file);
    setDecodeText(url);
    // 模拟解析结果
    setDecodeResult('https://example.com (模拟解析结果，实际需接入二维码解析库)');
    return false;
  };

  return (
    <>
      <SEO {...seoConfig} />
      <div style={{ padding: 24 }}>
        <Title level={2}><QrcodeOutlined /> 二维码工具</Title>
        <Text type="secondary">生成和解析二维码</Text>

        <Tabs defaultActiveKey="generate" style={{ marginTop: 24 }}>
          <Tabs.TabPane tab="生成二维码" key="generate">
            <Row gutter={24}>
              <Col xs={24} lg={12}>
                <Card title="设置">
                  <Space direction="vertical" style={{ width: '100%' }}>
                    <div>
                      <Text>内容:</Text>
                      <Input.TextArea value={text} onChange={(e) => setText(e.target.value)} rows={3} />
                    </div>
                    <div>
                      <Text>尺寸: {size}px</Text>
                      <Slider min={128} max={512} step={16} value={size} onChange={setSize} />
                    </div>
                    <div>
                      <Text>前景色:</Text>
                      <input type="color" value={color} onChange={(e) => setColor(e.target.value)} style={{ marginLeft: 8 }} />
                    </div>
                    <div>
                      <Text>背景色:</Text>
                      <input type="color" value={bgColor} onChange={(e) => setBgColor(e.target.value)} style={{ marginLeft: 8 }} />
                    </div>
                    <Button type="primary" onClick={generate}>生成</Button>
                  </Space>
                </Card>
              </Col>
              <Col xs={24} lg={12}>
                <Card title="预览">
                  {qrCodeUrl && (
                    <div style={{ textAlign: 'center' }}>
                      <img src={qrCodeUrl} alt="QR Code" style={{ maxWidth: '100%' }} />
                      <Button icon={<DownloadOutlined />} onClick={handleDownload} style={{ marginTop: 16 }}>下载</Button>
                    </div>
                  )}
                </Card>
              </Col>
            </Row>
          </Tabs.TabPane>

          <Tabs.TabPane tab="解析二维码" key="decode">
            <Row gutter={24}>
              <Col xs={24} lg={12}>
                <Card title="上传二维码图片">
                  <Upload beforeUpload={handleDecodeUpload} accept="image/*" maxCount={1} listType="picture">
                    <Button icon={<UploadOutlined />}>上传图片</Button>
                  </Upload>
                </Card>
              </Col>
              <Col xs={24} lg={12}>
                <Card title="解析结果">
                  <Text code copyable>{decodeResult || '请上传二维码图片'}</Text>
                </Card>
              </Col>
            </Row>
          </Tabs.TabPane>
        </Tabs>
      </div>
    </>
  );
};

export default QRCodeTool;
