import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Card, Button, Slider, message, Typography, Space, Upload, Row, Col } from 'antd';
import { UploadOutlined, RotateLeftOutlined, RotateRightOutlined, DownloadOutlined, ScissorOutlined, ReloadOutlined } from '@ant-design/icons';
import type { UploadFile } from 'antd/es/upload/interface';
import { SEO, createToolJsonLd } from '@/components/SEO';

const { Title, Text } = Typography;

const ImageCropper: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [image, setImage] = useState<HTMLImageElement | null>(null);
  const [rotation, setRotation] = useState(0);
  const [scale, setScale] = useState(1);
  const [cropArea, setCropArea] = useState({ x: 0, y: 0, width: 200, height: 200 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [previewUrl, setPreviewUrl] = useState('');

  const seoConfig = {
    title: '图片裁剪工具',
    description: '免费的在线图片裁剪工具，纯前端 Canvas 实现，支持调整裁剪框、旋转图片、导出下载，不上传服务器保护隐私。',
    keywords: '图片裁剪,在线裁剪图片,图片旋转,图片编辑,Canvas裁剪,前端图片处理,图片裁剪工具',
    jsonLd: createToolJsonLd(
      '图片裁剪工具',
      '免费的在线图片裁剪和编辑工具',
      'https://yma16.cloud/tools/image-cropper',
      'DeveloperApplication'
    ),
  };

  // 绘制画布
  const drawCanvas = useCallback(() => {
    if (!image || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // 计算旋转后的画布尺寸
    const rad = (rotation * Math.PI) / 180;
    const sin = Math.abs(Math.sin(rad));
    const cos = Math.abs(Math.cos(rad));
    const newWidth = image.width * cos + image.height * sin;
    const newHeight = image.width * sin + image.height * cos;

    canvas.width = newWidth * scale;
    canvas.height = newHeight * scale;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.save();
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.rotate(rad);
    ctx.scale(scale, scale);
    ctx.drawImage(image, -image.width / 2, -image.height / 2);
    ctx.restore();

    // 绘制裁剪区域遮罩
    ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // 清除裁剪区域（显示原图）
    ctx.clearRect(cropArea.x * scale, cropArea.y * scale, cropArea.width * scale, cropArea.height * scale);
    
    // 重新绘制裁剪区域内的图像
    ctx.save();
    ctx.beginPath();
    ctx.rect(cropArea.x * scale, cropArea.y * scale, cropArea.width * scale, cropArea.height * scale);
    ctx.clip();
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.rotate(rad);
    ctx.scale(scale, scale);
    ctx.drawImage(image, -image.width / 2, -image.height / 2);
    ctx.restore();

    // 绘制裁剪边框
    ctx.strokeStyle = '#1890ff';
    ctx.lineWidth = 2;
    ctx.strokeRect(cropArea.x * scale, cropArea.y * scale, cropArea.width * scale, cropArea.height * scale);
    
    // 绘制角落控制点
    const handleSize = 8;
    ctx.fillStyle = '#1890ff';
    [
      [cropArea.x * scale, cropArea.y * scale],
      [(cropArea.x + cropArea.width) * scale - handleSize, cropArea.y * scale],
      [cropArea.x * scale, (cropArea.y + cropArea.height) * scale - handleSize],
      [(cropArea.x + cropArea.width) * scale - handleSize, (cropArea.y + cropArea.height) * scale - handleSize],
    ].forEach(([x, y]) => {
      ctx.fillRect(x, y, handleSize, handleSize);
    });
  }, [image, rotation, scale, cropArea]);

  // 当依赖变化时重绘画布
  useEffect(() => {
    drawCanvas();
  }, [drawCanvas]);

  const handleUpload = (file: File) => {
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    
    const img = new Image();
    img.onload = () => {
      setImage(img);
      // 初始化裁剪区域为图片中心 80%
      const cropW = img.width * 0.8;
      const cropH = img.height * 0.8;
      setCropArea({
        x: (img.width - cropW) / 2,
        y: (img.height - cropH) / 2,
        width: cropW,
        height: cropH,
      });
      setRotation(0);
      setScale(1);
      message.success('图片上传成功');
    };
    img.onerror = () => {
      message.error('图片加载失败');
    };
    img.src = url;
    return false;
  };

  const handleRemove = () => {
    setImage(null);
    setPreviewUrl('');
    setFileList([]);
    setRotation(0);
    setScale(1);
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      }
    }
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!image) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left) * (canvas.width / rect.width);
    const y = (e.clientY - rect.top) * (canvas.height / rect.height);

    if (
      x >= cropArea.x * scale &&
      x <= (cropArea.x + cropArea.width) * scale &&
      y >= cropArea.y * scale &&
      y <= (cropArea.y + cropArea.height) * scale
    ) {
      setIsDragging(true);
      setDragStart({ x: x - cropArea.x * scale, y: y - cropArea.y * scale });
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDragging || !image) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left) * (canvas.width / rect.width);
    const y = (e.clientY - rect.top) * (canvas.height / rect.height);

    const newX = (x - dragStart.x) / scale;
    const newY = (y - dragStart.y) / scale;

    setCropArea({
      ...cropArea,
      x: Math.max(0, Math.min(newX, image.width - cropArea.width)),
      y: Math.max(0, Math.min(newY, image.height - cropArea.height)),
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleRotate = (deg: number) => {
    setRotation((prev) => prev + deg);
  };

  const handleScale = (value: number) => {
    setScale(value);
  };

  const handleCrop = () => {
    if (!image || !canvasRef.current) return;
    
    // 创建临时画布进行裁剪
    const tempCanvas = document.createElement('canvas');
    const tempCtx = tempCanvas.getContext('2d');
    if (!tempCtx) return;

    tempCanvas.width = cropArea.width;
    tempCanvas.height = cropArea.height;

    // 计算旋转后的画布尺寸
    const rad = (rotation * Math.PI) / 180;
    const sin = Math.abs(Math.sin(rad));
    const cos = Math.abs(Math.cos(rad));
    const fullWidth = image.width * cos + image.height * sin;
    const fullHeight = image.width * sin + image.height * cos;

    tempCtx.translate(tempCanvas.width / 2, tempCanvas.height / 2);
    tempCtx.rotate(-rad);
    tempCtx.drawImage(
      image,
      -(cropArea.x + cropArea.width / 2 - image.width / 2),
      -(cropArea.y + cropArea.height / 2 - image.height / 2),
      image.width,
      image.height
    );

    const dataUrl = tempCanvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.download = `cropped-${Date.now()}.png`;
    link.href = dataUrl;
    link.click();
    message.success('图片已下载');
  };

  return (
    <>
      <SEO {...seoConfig} />
      <div style={{ padding: 24 }}>
        <Title level={2}>
          <ScissorOutlined /> 图片裁剪
        </Title>
        <Text type="secondary">纯前端 Canvas 实现，不上传服务器</Text>

        <Row gutter={[24, 24]} style={{ marginTop: 24 }}>
          <Col span={24}>
            <Card>
              <Space direction="vertical" style={{ width: '100%' }} size="large">
                {/* 上传区域 */}
                <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
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
                    <Button icon={<ReloadOutlined />} onClick={handleRemove}>
                      重新上传
                    </Button>
                  )}
                </div>

                {/* 图片预览 */}
                {previewUrl && !image && (
                  <div style={{ textAlign: 'center', padding: 20 }}>
                    <img
                      src={previewUrl}
                      alt="预览"
                      style={{ maxWidth: '100%', maxHeight: 400, borderRadius: 8 }}
                    />
                    <Text type="secondary" style={{ display: 'block', marginTop: 8 }}>
                      图片加载中...
                    </Text>
                  </div>
                )}

                {/* 编辑工具栏 */}
                {image && (
                  <>
                    <Space wrap>
                      <Button icon={<RotateLeftOutlined />} onClick={() => handleRotate(-90)}>
                        左转 90°
                      </Button>
                      <Button icon={<RotateRightOutlined />} onClick={() => handleRotate(90)}>
                        右转 90°
                      </Button>
                      <Button icon={<DownloadOutlined />} type="primary" onClick={handleCrop}>
                        裁剪并下载
                      </Button>
                    </Space>

                    <div>
                      <Text>缩放: {Math.round(scale * 100)}%</Text>
                      <Slider
                        min={0.1}
                        max={3}
                        step={0.1}
                        value={scale}
                        onChange={handleScale}
                        marks={{ 0.1: '10%', 1: '100%', 2: '200%', 3: '300%' }}
                      />
                    </div>

                    <div>
                      <Text>旋转: {rotation}°</Text>
                      <Slider
                        min={-180}
                        max={180}
                        step={90}
                        value={rotation}
                        onChange={(val) => setRotation(val)}
                        marks={{ '-180': '-180°', '-90': '-90°', 0: '0°', 90: '90°', 180: '180°' }}
                      />
                    </div>

                    {/* Canvas 画布 */}
                    <div
                      ref={containerRef}
                      style={{
                        overflow: 'auto',
                        maxHeight: 600,
                        border: '1px solid #d9d9d9',
                        borderRadius: 8,
                        background: '#f5f5f5',
                      }}
                    >
                      <canvas
                        ref={canvasRef}
                        style={{
                          display: 'block',
                          cursor: isDragging ? 'grabbing' : 'grab',
                          maxWidth: '100%',
                        }}
                        onMouseDown={handleMouseDown}
                        onMouseMove={handleMouseMove}
                        onMouseUp={handleMouseUp}
                        onMouseLeave={handleMouseUp}
                      />
                    </div>

                    <Text type="secondary">
                      提示：拖动蓝色边框可调整裁剪位置，使用滑块调整缩放和旋转
                    </Text>
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

export default ImageCropper;
