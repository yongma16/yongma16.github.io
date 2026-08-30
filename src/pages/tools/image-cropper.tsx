import React, { useState, useRef, useCallback } from 'react';
import { Card, Button, Slider, message, Typography, Space, Upload, Row, Col } from 'antd';
import { UploadOutlined, RotateLeftOutlined, RotateRightOutlined, DownloadOutlined, ScissorOutlined } from '@ant-design/icons';
import type { UploadFile } from 'antd/es/upload/interface';
import { SEO, createToolJsonLd } from '@/components/SEO';

const { Title, Text } = Typography;

const ImageCropper: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [image, setImage] = useState<HTMLImageElement | null>(null);
  const [rotation, setRotation] = useState(0);
  const [scale, setScale] = useState(1);
  const [cropArea, setCropArea] = useState({ x: 0, y: 0, width: 200, height: 200 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [fileList, setFileList] = useState<UploadFile[]>([]);

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

  const handleUpload = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        setImage(img);
        setCropArea({
          x: img.width * 0.1,
          y: img.height * 0.1,
          width: img.width * 0.8,
          height: img.height * 0.8,
        });
        drawCanvas(img, rotation, scale, {
          x: img.width * 0.1,
          y: img.height * 0.1,
          width: img.width * 0.8,
          height: img.height * 0.8,
        });
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
    return false;
  };

  const drawCanvas = (
    img: HTMLImageElement,
    rot: number,
    scl: number,
    crop: typeof cropArea
  ) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = img.width * scl;
    canvas.height = img.height * scl;

    ctx.save();
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.rotate((rot * Math.PI) / 180);
    ctx.scale(scl, scl);
    ctx.drawImage(img, -img.width / 2, -img.height / 2);
    ctx.restore();

    // Draw crop overlay
    ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.clearRect(crop.x * scl, crop.y * scl, crop.width * scl, crop.height * scl);

    // Draw crop border
    ctx.strokeStyle = '#1890ff';
    ctx.lineWidth = 2;
    ctx.strokeRect(crop.x * scl, crop.y * scl, crop.width * scl, crop.height * scl);
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
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

    drawCanvas(image, rotation, scale, {
      ...cropArea,
      x: Math.max(0, Math.min(newX, image.width - cropArea.width)),
      y: Math.max(0, Math.min(newY, image.height - cropArea.height)),
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleRotate = (deg: number) => {
    const newRotation = rotation + deg;
    setRotation(newRotation);
    if (image) {
      drawCanvas(image, newRotation, scale, cropArea);
    }
  };

  const handleScale = (value: number) => {
    setScale(value);
    if (image) {
      drawCanvas(image, rotation, value, cropArea);
    }
  };

  const handleCrop = () => {
    if (!image || !canvasRef.current) return;
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = cropArea.width;
    canvas.height = cropArea.height;

    ctx.drawImage(
      canvasRef.current,
      cropArea.x * scale,
      cropArea.y * scale,
      cropArea.width * scale,
      cropArea.height * scale,
      0,
      0,
      cropArea.width,
      cropArea.height
    );

    const dataUrl = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.download = 'cropped-image.png';
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
              <Space direction="vertical" style={{ width: '100%' }}>
                <Upload
                  fileList={fileList}
                  beforeUpload={handleUpload}
                  onChange={({ fileList }) => setFileList(fileList)}
                  accept="image/*"
                  maxCount={1}
                >
                  <Button icon={<UploadOutlined />}>上传图片</Button>
                </Upload>

                {image && (
                  <>
                    <Space style={{ marginTop: 16 }}>
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

                    <div style={{ marginTop: 16 }}>
                      <Text>缩放: {Math.round(scale * 100)}%</Text>
                      <Slider
                        min={0.5}
                        max={2}
                        step={0.1}
                        value={scale}
                        onChange={handleScale}
                      />
                    </div>

                    <canvas
                      ref={canvasRef}
                      style={{
                        maxWidth: '100%',
                        border: '1px solid #d9d9d9',
                        borderRadius: 8,
                        cursor: isDragging ? 'grabbing' : 'grab',
                      }}
                      onMouseDown={handleMouseDown}
                      onMouseMove={handleMouseMove}
                      onMouseUp={handleMouseUp}
                      onMouseLeave={handleMouseUp}
                    />
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
