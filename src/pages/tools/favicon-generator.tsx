import React, { useState, useRef, useCallback } from 'react';
import { Card, Button, message, Typography, Space, Row, Col, Checkbox, Tag, Table } from 'antd';
import { UploadOutlined, DownloadOutlined, PictureOutlined, ReloadOutlined, FileImageOutlined } from '@ant-design/icons';
import { SEO, createToolJsonLd } from '@/components/SEO';

const { Title, Text } = Typography;

interface SizeOption {
  size: number;
  label: string;
  checked: boolean;
}

const DEFAULT_SIZES: SizeOption[] = [
  { size: 16, label: '16×16', checked: true },
  { size: 32, label: '32×32', checked: true },
  { size: 48, label: '48×48', checked: true },
  { size: 64, label: '64×64', checked: true },
  { size: 128, label: '128×128', checked: true },
  { size: 256, label: '256×256', checked: true },
];

// ICO 文件格式常量
const ICO_HEADER_SIZE = 6;
const ICO_DIR_ENTRY_SIZE = 16;
const BMP_HEADER_SIZE = 40;

const FaviconGenerator: React.FC = () => {
  const [image, setImage] = useState<HTMLImageElement | null>(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [sizes, setSizes] = useState<SizeOption[]>(DEFAULT_SIZES);
  const [isDragging, setIsDragging] = useState(false);
  const [generatedFiles, setGeneratedFiles] = useState<{ name: string; size: number; url: string }[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const seoConfig = {
    title: 'Favicon/ICO图标生成器',
    description: '拖拽上传图片，一键生成多尺寸网站图标（ICO/PNG），支持 16×16 到 256×256 全尺寸，纯前端本地处理不上传服务器。',
    keywords: 'Favicon生成器,ICO图标生成,网站图标制作,favicon.ico,PNG图标生成,多尺寸图标',
    jsonLd: createToolJsonLd('Favicon/ICO图标生成器', '拖拽上传图片生成多尺寸网站图标', 'https://yma16.cloud/tools/favicon-generator', 'DeveloperApplication'),
  };

  const handleFile = useCallback((file: File) => {
    if (!file.type.startsWith('image/')) {
      message.error('请上传图片文件');
      return;
    }
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);

    const img = new Image();
    img.onload = () => {
      setImage(img);
      message.success('图片上传成功，请选择尺寸并生成');
    };
    img.onerror = () => {
      message.error('图片加载失败');
    };
    img.src = url;
  }, []);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
    e.target.value = '';
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  }, [handleFile]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const toggleSize = (index: number) => {
    setSizes(prev => prev.map((s, i) => i === index ? { ...s, checked: !s.checked } : s));
  };

  // 生成指定尺寸的 PNG DataURL
  const generatePng = (img: HTMLImageElement, size: number): string => {
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');
    if (!ctx) return '';

    // 使用 cover 模式裁剪居中
    const ratio = Math.max(size / img.width, size / img.height);
    const drawWidth = img.width * ratio;
    const drawHeight = img.height * ratio;
    const offsetX = (size - drawWidth) / 2;
    const offsetY = (size - drawHeight) / 2;

    ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
    return canvas.toDataURL('image/png');
  };

  // 将 PNG DataURL 转为 Uint8Array
  const dataUrlToUint8Array = (dataUrl: string): Uint8Array => {
    const base64 = dataUrl.split(',')[1];
    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    return bytes;
  };

  // 生成 ICO 文件
  const generateIco = async (img: HTMLImageElement, selectedSizes: number[]): Promise<Blob> => {
    const pngDataUrls = selectedSizes.map(size => generatePng(img, size));
    const pngBuffers = pngDataUrls.map(url => dataUrlToUint8Array(url));

    const numImages = selectedSizes.length;
    const headerSize = ICO_HEADER_SIZE;
    const dirEntriesSize = numImages * ICO_DIR_ENTRY_SIZE;
    let offset = headerSize + dirEntriesSize;

    // 计算每个图片的偏移量
    const imageOffsets: number[] = [];
    for (let i = 0; i < numImages; i++) {
      imageOffsets.push(offset);
      offset += pngBuffers[i].length;
    }

    const totalSize = offset;
    const icoBuffer = new Uint8Array(totalSize);
    const view = new DataView(icoBuffer.buffer);

    // ICO Header
    view.setUint16(0, 0, true); // Reserved
    view.setUint16(2, 1, true); // Type: ICO
    view.setUint16(4, numImages, true); // Count

    // Directory Entries
    for (let i = 0; i < numImages; i++) {
      const size = selectedSizes[i];
      const entryOffset = headerSize + i * ICO_DIR_ENTRY_SIZE;
      const pngBuffer = pngBuffers[i];

      view.setUint8(entryOffset, size > 255 ? 0 : size); // Width
      view.setUint8(entryOffset + 1, size > 255 ? 0 : size); // Height
      view.setUint8(entryOffset + 2, 0); // Color palette
      view.setUint8(entryOffset + 3, 0); // Reserved
      view.setUint16(entryOffset + 4, 1, true); // Color planes
      view.setUint16(entryOffset + 6, 32, true); // Bits per pixel
      view.setUint32(entryOffset + 8, pngBuffer.length, true); // Image size
      view.setUint32(entryOffset + 12, imageOffsets[i], true); // Image offset
    }

    // Image data
    for (let i = 0; i < numImages; i++) {
      icoBuffer.set(pngBuffers[i], imageOffsets[i]);
    }

    return new Blob([icoBuffer], { type: 'image/x-icon' });
  };

  const handleGenerate = async () => {
    if (!image) {
      message.warning('请先上传图片');
      return;
    }

    const selectedSizes = sizes.filter(s => s.checked).map(s => s.size);
    if (selectedSizes.length === 0) {
      message.warning('请至少选择一个尺寸');
      return;
    }

    const files: { name: string; size: number; url: string }[] = [];

    // 生成各尺寸 PNG
    for (const size of selectedSizes) {
      const dataUrl = generatePng(image, size);
      const blob = await fetch(dataUrl).then(r => r.blob());
      files.push({
        name: `favicon-${size}x${size}.png`,
        size: blob.size,
        url: dataUrl,
      });
    }

    // 生成 ICO 文件（包含所有选中尺寸）
    const icoBlob = await generateIco(image, selectedSizes);
    const icoUrl = URL.createObjectURL(icoBlob);
    files.unshift({
      name: 'favicon.ico',
      size: icoBlob.size,
      url: icoUrl,
    });

    setGeneratedFiles(files);
    message.success(`成功生成 ${files.length} 个文件`);
  };

  const handleDownload = (file: { name: string; url: string }) => {
    const link = document.createElement('a');
    link.download = file.name;
    link.href = file.url;
    link.click();
    message.success(`${file.name} 已下载`);
  };

  const handleDownloadAll = async () => {
    if (generatedFiles.length === 0) return;

    // 使用 JSZip 打包下载
    const JSZip = (await import('jszip')).default;
    const zip = new JSZip();

    for (const file of generatedFiles) {
      const response = await fetch(file.url);
      const blob = await response.blob();
      zip.file(file.name, blob);
    }

    const zipBlob = await zip.generateAsync({ type: 'blob' });
    const zipUrl = URL.createObjectURL(zipBlob);
    const link = document.createElement('a');
    link.download = `favicon-package-${Date.now()}.zip`;
    link.href = zipUrl;
    link.click();
    message.success('全部文件已打包下载');
  };

  const handleRemove = () => {
    setImage(null);
    setPreviewUrl('');
    setGeneratedFiles([]);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const formatSize = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const columns = [
    {
      title: '文件名',
      dataIndex: 'name',
      key: 'name',
      render: (name: string) => (
        <Space>
          <FileImageOutlined style={{ color: '#1890ff' }} />
          <Text>{name}</Text>
        </Space>
      ),
    },
    {
      title: '大小',
      dataIndex: 'size',
      key: 'size',
      width: 120,
      render: (size: number) => formatSize(size),
    },
    {
      title: '操作',
      key: 'action',
      width: 100,
      render: (_: any, record: { name: string; url: string }) => (
        <Button type="link" size="small" onClick={() => handleDownload(record)}>
          下载
        </Button>
      ),
    },
  ];

  return (
    <>
      <SEO {...seoConfig} />
      <div style={{ padding: 24 }}>
        <Title level={2}><PictureOutlined /> Favicon / ICO 图标生成器</Title>
        <Text type="secondary">拖拽上传图片，一键生成多尺寸网站图标（ICO + PNG），纯前端本地处理</Text>

        <Row gutter={24} style={{ marginTop: 24 }}>
          <Col xs={24} lg={12}>
            <Card title="上传图片">
              <Space direction="vertical" style={{ width: '100%' }} size="large">
                {/* 拖拽区域 */}
                <div
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onClick={() => fileInputRef.current?.click()}
                  style={{
                    border: `2px dashed ${isDragging ? '#1890ff' : '#d9d9d9'}`,
                    borderRadius: 8,
                    padding: '40px 24px',
                    textAlign: 'center',
                    cursor: 'pointer',
                    background: isDragging ? '#e6f7ff' : 'transparent',
                    transition: 'all 0.3s',
                  }}
                >
                  <UploadOutlined style={{ fontSize: 48, color: '#1890ff', marginBottom: 16 }} />
                  <div>
                    <Text strong>点击或拖拽图片到此处</Text>
                  </div>
                  <div>
                    <Text type="secondary">支持 JPG、PNG、WebP、GIF、SVG 等格式</Text>
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleUpload}
                    style={{ display: 'none' }}
                  />
                </div>

                {image && (
                  <>
                    <div style={{ textAlign: 'center' }}>
                      <img
                        src={previewUrl}
                        alt="预览"
                        style={{ maxWidth: '100%', maxHeight: 200, borderRadius: 8, border: '1px solid #f0f0f0' }}
                      />
                      <div style={{ marginTop: 8 }}>
                        <Text type="secondary">原图尺寸: {image.width} × {image.height}</Text>
                      </div>
                    </div>
                    <Button icon={<ReloadOutlined />} onClick={handleRemove} block>
                      重新上传
                    </Button>
                  </>
                )}
              </Space>
            </Card>
          </Col>

          <Col xs={24} lg={12}>
            <Card title="选择输出尺寸">
              <Space direction="vertical" style={{ width: '100%' }}>
                <Text>选择需要生成的图标尺寸（推荐全选）：</Text>
                <Row gutter={[8, 8]}>
                  {sizes.map((s, index) => (
                    <Col span={8} key={s.size}>
                      <Card
                        size="small"
                        bodyStyle={{ padding: '8px 12px' }}
                        style={{
                          cursor: 'pointer',
                          borderColor: s.checked ? '#1890ff' : '#d9d9d9',
                          background: s.checked ? '#e6f7ff' : 'transparent',
                        }}
                        onClick={() => toggleSize(index)}
                      >
                        <Checkbox checked={s.checked} onChange={() => toggleSize(index)}>
                          <Text strong>{s.label}</Text>
                        </Checkbox>
                      </Card>
                    </Col>
                  ))}
                </Row>

                <div style={{ marginTop: 16 }}>
                  <Space>
                    <Button onClick={() => setSizes(prev => prev.map(s => ({ ...s, checked: true })))}>
                      全选
                    </Button>
                    <Button onClick={() => setSizes(prev => prev.map(s => ({ ...s, checked: false })))}>
                      全不选
                    </Button>
                  </Space>
                </div>

                <Button
                  type="primary"
                  size="large"
                  icon={<PictureOutlined />}
                  onClick={handleGenerate}
                  disabled={!image}
                  block
                  style={{ marginTop: 16 }}
                >
                  生成图标
                </Button>
              </Space>
            </Card>
          </Col>
        </Row>

        {/* 生成结果预览 */}
        {generatedFiles.length > 0 && (
          <Row gutter={24} style={{ marginTop: 24 }}>
            <Col span={24}>
              <Card
                title="生成结果"
                extra={
                  <Button type="primary" icon={<DownloadOutlined />} onClick={handleDownloadAll}>
                    打包下载全部
                  </Button>
                }
              >
                {/* 图标预览 */}
                <div style={{ marginBottom: 24 }}>
                  <Text strong>图标预览：</Text>
                  <Row gutter={[16, 16]} style={{ marginTop: 12 }}>
                    {sizes.filter(s => s.checked).map(s => (
                      <Col key={s.size}>
                        <Card size="small" style={{ textAlign: 'center', width: 120 }}>
                          <img
                            src={generatePng(image!, s.size)}
                            alt={`${s.size}x${s.size}`}
                            style={{ width: Math.min(s.size, 64), height: Math.min(s.size, 64), imageRendering: 'pixelated' }}
                          />
                          <div style={{ marginTop: 8 }}>
                            <Tag>{s.label}</Tag>
                          </div>
                        </Card>
                      </Col>
                    ))}
                  </Row>
                </div>

                {/* 文件列表 */}
                <Table
                  dataSource={generatedFiles}
                  columns={columns}
                  rowKey="name"
                  pagination={false}
                  size="small"
                />
              </Card>
            </Col>
          </Row>
        )}

        {/* 使用说明 */}
        <Card style={{ marginTop: 24 }} title="使用说明">
          <Space direction="vertical">
            <Text>1. 拖拽或点击上传一张图片（建议为正方形，至少 256×256 像素）</Text>
            <Text>2. 选择需要生成的图标尺寸（常用：16×16, 32×32, 48×48）</Text>
            <Text>3. 点击「生成图标」按钮</Text>
            <Text>4. 预览生成的图标效果，可单独下载或打包下载全部文件</Text>
            <Text>5. 将 <code>favicon.ico</code> 放到网站根目录，或在 HTML 中引用：</Text>
            <pre style={{ background: '#f6f8fa', padding: 12, borderRadius: 6, overflow: 'auto' }}>
{`<link rel="icon" type="image/x-icon" href="/favicon.ico">
<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
<link rel="apple-touch-icon" sizes="180x180" href="/favicon-180x180.png">`}
            </pre>
          </Space>
        </Card>
      </div>
    </>
  );
};

export default FaviconGenerator;
