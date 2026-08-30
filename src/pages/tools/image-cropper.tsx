import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Card, Button, Slider, message, Typography, Space, Upload, Row, Col, InputNumber } from 'antd';
import { UploadOutlined, RotateLeftOutlined, RotateRightOutlined, DownloadOutlined, ScissorOutlined, ReloadOutlined, ExpandOutlined, CompressOutlined } from '@ant-design/icons';
import type { UploadFile } from 'antd/es/upload/interface';
import { SEO, createToolJsonLd } from '@/components/SEO';

const { Title, Text } = Typography;

// 拖拽操作类型
type DragMode = 'move' | 'resize-nw' | 'resize-ne' | 'resize-sw' | 'resize-se' | 'resize-n' | 'resize-s' | 'resize-w' | 'resize-e' | null;

const ImageCropper: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [image, setImage] = useState<HTMLImageElement | null>(null);
  const [rotation, setRotation] = useState(0);
  const [scale, setScale] = useState(1);
  const [cropArea, setCropArea] = useState({ x: 0, y: 0, width: 200, height: 200 });
  const [dragMode, setDragMode] = useState<DragMode>(null);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0, cropX: 0, cropY: 0, cropW: 0, cropH: 0 });
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [previewUrl, setPreviewUrl] = useState('');
  const [aspectRatio, setAspectRatio] = useState<number | null>(null);
  const [canvasSize, setCanvasSize] = useState({ w: 0, h: 0 });

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

  // 判断鼠标位置对应的操作类型
  const getDragMode = (x: number, y: number): DragMode => {
    const handleSize = 12;
    const left = cropArea.x * scale;
    const right = (cropArea.x + cropArea.width) * scale;
    const top = cropArea.y * scale;
    const bottom = (cropArea.y + cropArea.height) * scale;

    // 角落
    if (Math.abs(x - left) < handleSize && Math.abs(y - top) < handleSize) return 'resize-nw';
    if (Math.abs(x - right) < handleSize && Math.abs(y - top) < handleSize) return 'resize-ne';
    if (Math.abs(x - left) < handleSize && Math.abs(y - bottom) < handleSize) return 'resize-sw';
    if (Math.abs(x - right) < handleSize && Math.abs(y - bottom) < handleSize) return 'resize-se';

    // 边中点
    if (Math.abs(x - left) < handleSize && y > top + handleSize && y < bottom - handleSize) return 'resize-w';
    if (Math.abs(x - right) < handleSize && y > top + handleSize && y < bottom - handleSize) return 'resize-e';
    if (Math.abs(y - top) < handleSize && x > left + handleSize && x < right - handleSize) return 'resize-n';
    if (Math.abs(y - bottom) < handleSize && x > left + handleSize && x < right - handleSize) return 'resize-s';

    // 内部移动
    if (x > left && x < right && y > top && y < bottom) return 'move';

    return null;
  };

  // 获取鼠标样式
  const getCursorStyle = (mode: DragMode): string => {
    switch (mode) {
      case 'move': return 'move';
      case 'resize-nw': return 'nw-resize';
      case 'resize-se': return 'se-resize';
      case 'resize-ne': return 'ne-resize';
      case 'resize-sw': return 'sw-resize';
      case 'resize-n': return 'n-resize';
      case 'resize-s': return 's-resize';
      case 'resize-w': return 'w-resize';
      case 'resize-e': return 'e-resize';
      default: return 'default';
    }
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
    setCanvasSize({ w: canvas.width, h: canvas.height });

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 绘制背景网格
    const gridSize = 20;
    ctx.fillStyle = '#f0f0f0';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#e0e0e0';
    for (let x = 0; x < canvas.width; x += gridSize * 2) {
      for (let y = 0; y < canvas.height; y += gridSize * 2) {
        ctx.fillRect(x, y, gridSize, gridSize);
        ctx.fillRect(x + gridSize, y + gridSize, gridSize, gridSize);
      }
    }

    // 绘制图片
    ctx.save();
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.rotate(rad);
    ctx.scale(scale, scale);
    ctx.drawImage(image, -image.width / 2, -image.height / 2);
    ctx.restore();

    // 绘制裁剪区域遮罩
    ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
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

    // 绘制九宫格辅助线
    ctx.strokeStyle = 'rgba(24, 144, 255, 0.5)';
    ctx.lineWidth = 1;
    const cw = cropArea.width * scale;
    const ch = cropArea.height * scale;
    const cx = cropArea.x * scale;
    const cy = cropArea.y * scale;

    // 垂直线
    ctx.beginPath();
    ctx.moveTo(cx + cw / 3, cy);
    ctx.lineTo(cx + cw / 3, cy + ch);
    ctx.moveTo(cx + cw * 2 / 3, cy);
    ctx.lineTo(cx + cw * 2 / 3, cy + ch);
    ctx.stroke();

    // 水平线
    ctx.beginPath();
    ctx.moveTo(cx, cy + ch / 3);
    ctx.lineTo(cx + cw, cy + ch / 3);
    ctx.moveTo(cx, cy + ch * 2 / 3);
    ctx.lineTo(cx + cw, cy + ch * 2 / 3);
    ctx.stroke();

    // 绘制角落和边中点控制点
    const handleSize = 10;
    ctx.fillStyle = '#1890ff';
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 2;

    const handles = [
      [cx, cy], // nw
      [cx + cw / 2 - handleSize / 2, cy], // n
      [cx + cw - handleSize, cy], // ne
      [cx + cw - handleSize, cy + ch / 2 - handleSize / 2], // e
      [cx + cw - handleSize, cy + ch - handleSize], // se
      [cx + cw / 2 - handleSize / 2, cy + ch - handleSize], // s
      [cx, cy + ch - handleSize], // sw
      [cx, cy + ch / 2 - handleSize / 2], // w
    ];

    handles.forEach(([hx, hy]) => {
      ctx.fillRect(hx, hy, handleSize, handleSize);
      ctx.strokeRect(hx, hy, handleSize, handleSize);
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
    setCropArea({ x: 0, y: 0, width: 200, height: 200 });
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

    const mode = getDragMode(x, y);
    if (mode) {
      setDragMode(mode);
      setDragStart({
        x,
        y,
        cropX: cropArea.x,
        cropY: cropArea.y,
        cropW: cropArea.width,
        cropH: cropArea.height,
      });
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!dragMode || !image) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left) * (canvas.width / rect.width);
    const y = (e.clientY - rect.top) * (canvas.height / rect.height);

    const dx = (x - dragStart.x) / scale;
    const dy = (y - dragStart.y) / scale;

    let newArea = { ...cropArea };

    switch (dragMode) {
      case 'move':
        newArea.x = Math.max(0, Math.min(dragStart.cropX + dx, image.width - cropArea.width));
        newArea.y = Math.max(0, Math.min(dragStart.cropY + dy, image.height - cropArea.height));
        break;

      case 'resize-nw':
        newArea.x = Math.min(dragStart.cropX + dx, dragStart.cropX + dragStart.cropW - 50);
        newArea.y = Math.min(dragStart.cropY + dy, dragStart.cropY + dragStart.cropH - 50);
        newArea.width = dragStart.cropW - dx;
        newArea.height = dragStart.cropH - dy;
        break;

      case 'resize-ne':
        newArea.y = Math.min(dragStart.cropY + dy, dragStart.cropY + dragStart.cropH - 50);
        newArea.width = dragStart.cropW + dx;
        newArea.height = dragStart.cropH - dy;
        break;

      case 'resize-sw':
        newArea.x = Math.min(dragStart.cropX + dx, dragStart.cropX + dragStart.cropW - 50);
        newArea.width = dragStart.cropW - dx;
        newArea.height = dragStart.cropH + dy;
        break;

      case 'resize-se':
        newArea.width = dragStart.cropW + dx;
        newArea.height = dragStart.cropH + dy;
        break;

      case 'resize-n':
        newArea.y = Math.min(dragStart.cropY + dy, dragStart.cropY + dragStart.cropH - 50);
        newArea.height = dragStart.cropH - dy;
        break;

      case 'resize-s':
        newArea.height = dragStart.cropH + dy;
        break;

      case 'resize-w':
        newArea.x = Math.min(dragStart.cropX + dx, dragStart.cropX + dragStart.cropW - 50);
        newArea.width = dragStart.cropW - dx;
        break;

      case 'resize-e':
        newArea.width = dragStart.cropW + dx;
        break;
    }

    // 应用宽高比约束
    if (aspectRatio && dragMode !== 'move') {
      if (Math.abs(dx) > Math.abs(dy)) {
        newArea.height = newArea.width / aspectRatio;
      } else {
        newArea.width = newArea.height * aspectRatio;
      }
    }

    // 边界约束
    newArea.width = Math.max(50, Math.min(newArea.width, image.width - newArea.x));
    newArea.height = Math.max(50, Math.min(newArea.height, image.height - newArea.y));
    newArea.x = Math.max(0, Math.min(newArea.x, image.width - newArea.width));
    newArea.y = Math.max(0, Math.min(newArea.y, image.height - newArea.height));

    setCropArea(newArea);
  };

  const handleMouseUp = () => {
    setDragMode(null);
  };

  const handleMouseMoveHover = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!image || dragMode) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left) * (canvas.width / rect.width);
    const y = (e.clientY - rect.top) * (canvas.height / rect.height);

    const mode = getDragMode(x, y);
    canvas.style.cursor = getCursorStyle(mode);
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

  const applyAspectRatio = (ratio: number | null) => {
    setAspectRatio(ratio);
    if (!ratio || !image) return;

    // 根据当前宽度调整高度
    const newHeight = cropArea.width / ratio;
    if (newHeight <= image.height) {
      setCropArea({
        ...cropArea,
        height: newHeight,
        y: Math.min(cropArea.y, image.height - newHeight),
      });
    } else {
      // 如果高度超出，根据高度调整宽度
      const newWidth = cropArea.height * ratio;
      setCropArea({
        ...cropArea,
        width: newWidth,
        x: Math.min(cropArea.x, image.width - newWidth),
      });
    }
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
                    {/* 裁剪尺寸和比例 */}
                    <Row gutter={16}>
                      <Col xs={24} md={12}>
                        <Card size="small" title="裁剪尺寸 (像素)">
                          <Space wrap>
                            <Space>
                              <Text>X:</Text>
                              <InputNumber
                                min={0}
                                max={image.width - cropArea.width}
                                value={Math.round(cropArea.x)}
                                onChange={(v) => setCropArea({ ...cropArea, x: v || 0 })}
                                style={{ width: 80 }}
                              />
                            </Space>
                            <Space>
                              <Text>Y:</Text>
                              <InputNumber
                                min={0}
                                max={image.height - cropArea.height}
                                value={Math.round(cropArea.y)}
                                onChange={(v) => setCropArea({ ...cropArea, y: v || 0 })}
                                style={{ width: 80 }}
                              />
                            </Space>
                            <Space>
                              <Text>宽:</Text>
                              <InputNumber
                                min={50}
                                max={image.width - cropArea.x}
                                value={Math.round(cropArea.width)}
                                onChange={(v) => {
                                  const w = v || 50;
                                  if (aspectRatio) {
                                    setCropArea({ ...cropArea, width: w, height: w / aspectRatio });
                                  } else {
                                    setCropArea({ ...cropArea, width: w });
                                  }
                                }}
                                style={{ width: 80 }}
                              />
                            </Space>
                            <Space>
                              <Text>高:</Text>
                              <InputNumber
                                min={50}
                                max={image.height - cropArea.y}
                                value={Math.round(cropArea.height)}
                                onChange={(v) => {
                                  const h = v || 50;
                                  if (aspectRatio) {
                                    setCropArea({ ...cropArea, height: h, width: h * aspectRatio });
                                  } else {
                                    setCropArea({ ...cropArea, height: h });
                                  }
                                }}
                                style={{ width: 80 }}
                              />
                            </Space>
                          </Space>
                        </Card>
                      </Col>
                      <Col xs={24} md={12}>
                        <Card size="small" title="宽高比">
                          <Space wrap>
                            <Button size="small" type={aspectRatio === null ? 'primary' : 'default'} onClick={() => applyAspectRatio(null)}>
                              自由
                            </Button>
                            <Button size="small" type={aspectRatio === 1 ? 'primary' : 'default'} onClick={() => applyAspectRatio(1)}>
                              1:1
                            </Button>
                            <Button size="small" type={aspectRatio === 16 / 9 ? 'primary' : 'default'} onClick={() => applyAspectRatio(16 / 9)}>
                              16:9
                            </Button>
                            <Button size="small" type={aspectRatio === 4 / 3 ? 'primary' : 'default'} onClick={() => applyAspectRatio(4 / 3)}>
                              4:3
                            </Button>
                            <Button size="small" type={aspectRatio === 3 / 4 ? 'primary' : 'default'} onClick={() => applyAspectRatio(3 / 4)}>
                              3:4
                            </Button>
                            <Button size="small" type={aspectRatio === 9 / 16 ? 'primary' : 'default'} onClick={() => applyAspectRatio(9 / 16)}>
                              9:16
                            </Button>
                          </Space>
                        </Card>
                      </Col>
                    </Row>

                    {/* 旋转和缩放 */}
                    <Row gutter={16}>
                      <Col xs={24} md={12}>
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
                      </Col>
                      <Col xs={24} md={12}>
                        <div>
                          <Text>旋转: {rotation}°</Text>
                          <Slider
                            min={-180}
                            max={180}
                            step={1}
                            value={rotation}
                            onChange={(val) => setRotation(val)}
                            marks={{ '-180': '-180°', '-90': '-90°', 0: '0°', 90: '90°', 180: '180°' }}
                          />
                        </div>
                      </Col>
                    </Row>

                    {/* 操作按钮 */}
                    <Space wrap>
                      <Button icon={<RotateLeftOutlined />} onClick={() => handleRotate(-90)}>
                        左转 90°
                      </Button>
                      <Button icon={<RotateRightOutlined />} onClick={() => handleRotate(90)}>
                        右转 90°
                      </Button>
                      <Button icon={<ExpandOutlined />} onClick={() => { setScale(1); setRotation(0); }}>
                        重置视图
                      </Button>
                      <Button icon={<CompressOutlined />} onClick={() => {
                        setCropArea({
                          x: 0, y: 0,
                          width: image.width,
                          height: image.height,
                        });
                      }}>
                        全选
                      </Button>
                      <Button icon={<DownloadOutlined />} type="primary" onClick={handleCrop}>
                        裁剪并下载
                      </Button>
                    </Space>

                    {/* Canvas 画布 */}
                    <div
                      ref={containerRef}
                      style={{
                        overflow: 'auto',
                        maxHeight: 600,
                        border: '2px solid #d9d9d9',
                        borderRadius: 8,
                        background: '#f5f5f5',
                      }}
                    >
                      <canvas
                        ref={canvasRef}
                        style={{
                          display: 'block',
                          maxWidth: '100%',
                        }}
                        onMouseDown={handleMouseDown}
                        onMouseMove={handleMouseMove}
                        onMouseUp={handleMouseUp}
                        onMouseLeave={handleMouseUp}
                        onMouseMoveCapture={handleMouseMoveHover}
                      />
                    </div>

                    <Text type="secondary">
                      💡 提示：拖动裁剪框移动位置，拖动边角和边中点调整大小，使用滑块调整缩放和旋转
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
