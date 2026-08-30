import React, { useState, useCallback } from 'react';
import { Card, Row, Col, Input, Button, message, Typography, Space, Tabs, Upload } from 'antd';
import { CopyOutlined, DownloadOutlined, UploadOutlined, SwapOutlined } from '@ant-design/icons';
import type { UploadFile } from 'antd/es/upload/interface';
import { SEO, createToolJsonLd } from '@/components/SEO';

const { Title, Text } = Typography;
const { TextArea } = Input;

const Base64Tool: React.FC = () => {
  const [textInput, setTextInput] = useState('');
  const [textOutput, setTextOutput] = useState('');
  const [imageBase64, setImageBase64] = useState('');
  const [previewImage, setPreviewImage] = useState('');
  const [activeTab, setActiveTab] = useState('text');
  const [fileList, setFileList] = useState<UploadFile[]>([]);

  const seoConfig = {
    title: 'Base64 编解码工具',
    description: '免费的在线 Base64 编解码工具，支持文本 Base64 编码解码、图片转 Base64、Base64 还原预览和下载图片。',
    keywords: 'Base64编码,Base64解码,Base64工具,图片转Base64,Base64转图片,在线Base64,文本编码',
    jsonLd: createToolJsonLd(
      'Base64 编解码工具',
      '免费的在线 Base64 编码解码和图片转换工具',
      'https://yma16.cloud/tools/base64-tool',
      'DeveloperApplication'
    ),
  };

  const encodeText = () => {
    try {
      const encoded = btoa(unescape(encodeURIComponent(textInput)));
      setTextOutput(encoded);
    } catch (e) {
      message.error('编码失败');
    }
  };

  const decodeText = () => {
    try {
      const decoded = decodeURIComponent(escape(atob(textInput)));
      setTextOutput(decoded);
    } catch (e) {
      message.error('解码失败，请检查输入是否为有效的 Base64');
    }
  };

  const handleImageUpload = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setImageBase64(result);
      setPreviewImage(result);
    };
    reader.readAsDataURL(file);
    return false;
  };

  const handleBase64Input = (value: string) => {
    setImageBase64(value);
    if (value.startsWith('data:image')) {
      setPreviewImage(value);
    } else {
      setPreviewImage('');
    }
  };

  const downloadImage = () => {
    if (!previewImage) return;
    const link = document.createElement('a');
    link.href = previewImage;
    link.download = 'base64-image.png';
    link.click();
    message.success('图片已下载');
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
          <SwapOutlined /> Base64 编解码
        </Title>
        <Text type="secondary">文本编码解码、图片与 Base64 互转</Text>

        <Tabs activeKey={activeTab} onChange={setActiveTab} style={{ marginTop: 24 }}>
          <Tabs.TabPane tab="文本编解码" key="text">
            <Row gutter={[24, 24]}>
              <Col xs={24} lg={12}>
                <Card title="输入">
                  <TextArea
                    rows={10}
                    value={textInput}
                    onChange={(e) => setTextInput(e.target.value)}
                    placeholder="输入要编码或解码的文本..."
                  />
                  <Space style={{ marginTop: 16 }}>
                    <Button type="primary" onClick={encodeText}>
                      编码 (Base64)
                    </Button>
                    <Button onClick={decodeText}>
                      解码 (Base64)
                    </Button>
                    <Button icon={<CopyOutlined />} onClick={() => copyToClipboard(textInput)}>
                      复制输入
                    </Button>
                  </Space>
                </Card>
              </Col>
              <Col xs={24} lg={12}>
                <Card title="输出">
                  <TextArea
                    rows={10}
                    value={textOutput}
                    readOnly
                    placeholder="编码/解码结果..."
                  />
                  <Space style={{ marginTop: 16 }}>
                    <Button icon={<CopyOutlined />} onClick={() => copyToClipboard(textOutput)}>
                      复制结果
                    </Button>
                    <Button onClick={() => { setTextInput(''); setTextOutput(''); }}>
                      清空
                    </Button>
                  </Space>
                </Card>
              </Col>
            </Row>
          </Tabs.TabPane>

          <Tabs.TabPane tab="图片转 Base64" key="image-to-base64">
            <Row gutter={[24, 24]}>
              <Col xs={24} lg={12}>
                <Card title="上传图片">
                  <Upload
                    fileList={fileList}
                    beforeUpload={handleImageUpload}
                    onChange={({ fileList }) => setFileList(fileList)}
                    accept="image/*"
                    maxCount={1}
                    listType="picture"
                  >
                    <Button icon={<UploadOutlined />}>上传图片</Button>
                  </Upload>
                </Card>
              </Col>
              <Col xs={24} lg={12}>
                <Card title="Base64 结果">
                  <TextArea
                    rows={8}
                    value={imageBase64}
                    readOnly
                    placeholder="图片的 Base64 编码将显示在这里..."
                  />
                  <Space style={{ marginTop: 16 }}>
                    <Button icon={<CopyOutlined />} onClick={() => copyToClipboard(imageBase64)}>
                      复制 Base64
                    </Button>
                  </Space>
                </Card>
              </Col>
            </Row>
          </Tabs.TabPane>

          <Tabs.TabPane tab="Base64 转图片" key="base64-to-image">
            <Row gutter={[24, 24]}>
              <Col xs={24} lg={12}>
                <Card title="输入 Base64">
                  <TextArea
                    rows={8}
                    value={imageBase64}
                    onChange={(e) => handleBase64Input(e.target.value)}
                    placeholder="粘贴 Base64 编码..."
                  />
                </Card>
              </Col>
              <Col xs={24} lg={12}>
                <Card title="图片预览">
                  {previewImage ? (
                    <>
                      <img
                        src={previewImage}
                        alt="Preview"
                        style={{ maxWidth: '100%', maxHeight: 300, borderRadius: 8 }}
                      />
                      <Space style={{ marginTop: 16 }}>
                        <Button icon={<DownloadOutlined />} type="primary" onClick={downloadImage}>
                          下载图片
                        </Button>
                      </Space>
                    </>
                  ) : (
                    <Text type="secondary">输入有效的 Base64 图片编码后预览</Text>
                  )}
                </Card>
              </Col>
            </Row>
          </Tabs.TabPane>
        </Tabs>
      </div>
    </>
  );
};

export default Base64Tool;
