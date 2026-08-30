import React, { useState, useRef } from 'react';
import { Card, Button, Slider, message, Typography, Space, Upload, Row, Col, Select, Radio } from 'antd';
import { UploadOutlined, DownloadOutlined, PictureOutlined, ReloadOutlined } from '@ant-design/icons';
import type { UploadFile } from 'antd/es/upload/interface';
import { SEO, createToolJsonLd } from '@/components/SEO';

const { Title, Text } = Typography;

type ImageFormat = 'image/png' | 'image/jpeg' | 'image/webp';

const ImageConvert: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [image, setImage] = useState<HTMLImageElement | null>(null);
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [format, setFormat] = useState<ImageFormat>('image/jpeg');
  const [quality, setQuality] = useState(0.9);
  const [previewUrl, setPreviewUrl] = useState('');
  const [convertedUrl, setConvertedUrl] = useState('');
  const [originalSize, setOriginalSize] = useState(0);
  const [convertedSize, setConvertedSize] = useState(0);

  const seoConfig = {
    title: '图片格式转换工具',
    description: 'PNG/JPG/WebP图片格式转换，支持调节质量下载，纯前端处理不上传服务器。',
    keywords: '图片格式转换,PNG转JPG,JPG转WebP,图片压缩,图片质量调节',
    jsonLd: createToolJsonLd('图片格式转换工具', 'PNG/JPG/WebP图片格式转换', 'https://yma16.cloud/tools/image-convert', 'DeveloperApplication'),
  };

  const handleUpload = (file: File) => {
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    setOriginalSize(file.size);

    const img = new Image();
    img.onload = () => {
      setImage(img);
      convertImage(img, format, quality);
      message.success('图片上传成功');
    };
    img.src = url;
    return false;
  };

  const convertImage = (img: HTMLImageElement, fmt: ImageFormat, q: number) => {
    const canvas = document.createElement('canvas');
    canvas.width = img.width;
    canvas.height = img.height;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // 处理透明背景（JPEG需要白色背景）
    if (fmt === 'image/jpeg') {
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
    ctx.drawImage(img, 0, 0);

    const dataUrl = canvas.toDataURL(fmt, q);
    setConvertedUrl(dataUrl);

    // 计算转换后大小
    const base64 = dataUrl.split(',')[1];
    const size = Math.ceil(base64.length * 3 / 4);
    setConvertedSize(size);
  };

  const handleFormatChange = (fmt: ImageFormat) => {
    setFormat(fmt);
    if (image) {
      convertImage(image, fmt, quality);
    }
  };

  const handleQualityChange = (q: number) => {
    setQuality(q);
    if (image) {
      convertImage(image, format, q);
    }
  };

  const handleDownload = () => {
    if (!convertedUrl) return;
    const ext = format.split('/')[1];
    const link = document.createElement('a');
    link.download = `converted-${Date.now()}.${ext}`;
    link.href = convertedUrl;
    link.click();
    message.success('图片已下载');
  };

  const handleRemove = () => {
    setImage(null);
    setPreviewUrl('');
    setConvertedUrl('');
    setFileList([]);
    setOriginalSize(0);
    setConvertedSize(0);
  };

  const formatSize = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <>
      <SEO {...seoConfig} />
      <div style={{ padding: 24 }}>
        <Title level={2}><PictureOutlined /> 图片格式转换</Title>
        <Text type="secondary">PNG/JPG/WebP格式转换，调节质量下载</Text>

        <Row gutter={24} style={{ marginTop: 24 }}>
          <Col span={24}>
            <Card>
              <Space direction="vertical" style={{ width: '100%' }} size="large">
                <div style={{ display: 'flex', gap: 16, alignItems: 'center', flexWrap: 'wrap' }}>
                  <Upload
                    fileList={fileList}
                    beforeUpload={handleUpload}
                    onChange={({ fileList }) => setFileList(fileList)}
                    onRemove={handleRemove}
                    accept="image/*"
                    maxCount={1}
                    listType="picture"
                  >
                    <Button icon={<UploadOutlined />}>上传图片</Button>
                  </Upload>
                  {image && (
                    <Button icon={<ReloadOutlined />} onClick={handleRemove}>重新上传</Button>
                  )}
                </div>

                {image && (
                  <>
                    <Row gutter={24}>
                      <Col xs={24} md={12}>
                        <Card size="small" title="转换设置">
                          <Space direction="vertical" style={{ width: '100%' }}>
                            <div>
                              <Text>输出格式:</Text>
                              <Radio.Group value={format} onChange={(e) => handleFormatChange(e.target.value)} style={{ marginLeft: 16 }}>
                                <Radio.Button value="image/png">PNG</Radio.Button>
                                <Radio.Button value="image/jpeg">JPG</Radio.Button>
                                <Radio.Button value="image/webp">WebP</Radio.Button>
                              </Radio.Group>
                            </div>
                            {format !== 'image/png' && (
                              <div>
                                <Text>质量: {Math.round(quality * 100)}%</Text>
                                <Slider min={0.1} max={1} step={0.05} value={quality} onChange={handleQualityChange} />
                              </div>
                            )}
                          </Space>
                        </Card>
                      </Col>
                      <Col xs={24} md={12}>
                        <Card size="small" title="文件信息">
                          <Space direction="vertical">
                            <Text>原始大小: {formatSize(originalSize)}</Text>
                            <Text>转换后大小: {formatSize(convertedSize)}</Text>
                            {convertedSize > 0 && (
                              <Text type={convertedSize < originalSize ? 'success' : 'warning'}>
                                {convertedSize < originalSize ? '↓' : '↑'} {Math.abs((convertedSize - originalSize) / originalSize * 100).toFixed(1)}%
                              </Text>
                            )}
                          </Space>
                        </Card>
                      </Col>
                    </Row>

                    <Row gutter={24}>
                      <Col xs={24} md={12}>
                        <Card size="small" title="原图预览">
                          <img src={previewUrl} alt="原图" style={{ maxWidth: '100%', maxHeight: 300, borderRadius: 8 }} />
                        </Card>
                      </Col>
                      <Col xs={24} md={12}>
                        <Card size="small" title="转换后预览">
                          {convertedUrl && (
                            <img src={convertedUrl} alt="转换后" style={{ maxWidth: '100%', maxHeight: 300, borderRadius: 8 }} />
                          )}
                        </Card>
                      </Col>
                    </Row>

                    <Button type="primary" icon={<DownloadOutlined />} onClick={handleDownload} size="large">
                      下载转换后的图片
                    </Button>
                  </>
                )}
              </Space>
            </Card>
          </Col>
        </Row>
      </div>
    </>
  );
};

export default ImageConvert;
