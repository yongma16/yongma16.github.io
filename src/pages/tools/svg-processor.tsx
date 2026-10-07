import React, { useState, useCallback, useRef } from 'react';
import { Card, Upload, Button, Row, Col, Typography, Space, Tag, Progress, message, Table, Input, Radio, Statistic, Tabs, Tooltip, Divider } from 'antd';
import { FileImageOutlined, UploadOutlined, DownloadOutlined, CompressOutlined, DeleteOutlined, EyeOutlined, BgColorsOutlined, ClearOutlined, CodeOutlined, CopyOutlined, FileImageFilled, ExportOutlined } from '@ant-design/icons';
import type { UploadFile } from 'antd/es/upload/interface';
import { SEO, createToolJsonLd } from '@/components/SEO';

const { Title, Paragraph } = Typography;
const { Dragger } = Upload;


interface SVGFile {
  uid: string;
  name: string;
  size: number;
  originalSize: number;
  compressedSize: number;
  status: 'pending' | 'processing' | 'done' | 'error';
  preview?: string;
  content?: string;
  processedContent?: string;
}

const SVGProcessor: React.FC = () => {
  const [fileList, setFileList] = useState<SVGFile[]>([]);

  const seoConfig = {
    title: 'SVG 压缩处理工具',
    description: '免费的在线 SVG 处理工具，支持 SVG 压缩、批量转换、颜色替换、预览和下载，优化 SVG 图标和图形文件大小，提升网页加载性能。纯前端处理，不上传服务器。',
    keywords: 'SVG处理,SVG压缩,SVG转换,SVG优化,SVG批量处理,SVG颜色替换,SVG预览,SVG工具,矢量图形处理,前端开发工具',
    canonical: 'https://yma16.cloud/tools/svg-processor',
    jsonLd: createToolJsonLd(
      'SVG 压缩处理工具',
      '免费的在线 SVG 压缩和转换工具，支持批量处理、颜色替换、预览和下载。纯前端处理，不上传服务器。',
      'https://yma16.cloud/tools/svg-processor',
      'DeveloperApplication'
    ),
  };
  const [processing, setProcessing] = useState(false);
  const [colorAction, setColorAction] = useState<'add' | 'remove'>('add');
  const [targetColor, setTargetColor] = useState('#1890ff');
  const [previewContent, setPreviewContent] = useState('');
  const [previewVisible, setPreviewVisible] = useState(false);

  // SVG 代码编辑器状态
  const [svgCode, setSvgCode] = useState(`<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200">
  <circle cx="100" cy="100" r="80" fill="#1890ff" />
  <text x="100" y="110" text-anchor="middle" fill="white" font-size="24">SVG</text>
</svg>`);
  const [renderedSvg, setRenderedSvg] = useState('');
  const [editorError, setEditorError] = useState('');
  const [activeTab, setActiveTab] = useState('upload');
  const [exportFormat, setExportFormat] = useState<'svg' | 'png' | 'jpeg'>('svg');
  const [exportSize, setExportSize] = useState({ width: 0, height: 0 });
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const svgContainerRef = useRef<HTMLDivElement>(null);

  const handleUpload = useCallback((info: any) => {
    const { file, fileList: newFileList } = info;
    
    if (file.status === 'done' || file.status === 'uploading' || file.originFileObj) {
      const processFile = async (f: any) => {
        const content = f.originFileObj ? await f.originFileObj.text() : '';
        return {
          uid: f.uid || Math.random().toString(36).substr(2, 9),
          name: f.name,
          size: f.size || 0,
          originalSize: f.size || 0,
          compressedSize: f.size || 0,
          status: 'pending' as const,
          preview: f.thumbUrl || f.url,
          content: content,
          processedContent: content,
        };
      };

      Promise.all(newFileList.map(processFile)).then(svgFiles => {
        const validFiles = svgFiles.filter((f: SVGFile) => f.name.endsWith('.svg'));
        setFileList(prev => [...prev, ...validFiles]);
        if (validFiles.length < svgFiles.length) {
          message.warning('部分文件不是 SVG 格式，已过滤');
        }
      });
    }
  }, []);

  const processSVG = useCallback(async () => {
    if (fileList.length === 0) {
      message.warning('请先上传 SVG 文件');
      return;
    }
    
    setProcessing(true);
    
    for (let i = 0; i < fileList.length; i++) {
      setFileList(prev => prev.map((file, index) => 
        index === i ? { ...file, status: 'processing' } : file
      ));
      
      await new Promise(resolve => setTimeout(resolve, 500));
      
      let processedContent = fileList[i].content || '';
      
      // 处理颜色
      if (colorAction === 'add') {
        // 添加颜色：如果没有 fill/stroke 属性，添加默认颜色
        processedContent = processedContent.replace(
          /<svg([^>]*)>/i,
          `<svg$1 fill="${targetColor}">`
        );
        // 为没有 fill 属性的 path/circle/rect 添加颜色
        processedContent = processedContent.replace(
          /<(path|circle|rect|polygon|polyline|line|ellipse)([^>]*?)(?<!fill=)([^>]*)>/gi,
          (match, tag, attrs1, attrs2) => {
            if (match.includes('fill=') || match.includes('stroke=')) {
              return match;
            }
            return `<${tag}${attrs1} fill="${targetColor}"${attrs2}>`;
          }
        );
      } else {
        // 移除颜色：移除 fill 和 stroke 属性（保留 none）
        processedContent = processedContent.replace(/\s*fill="[^"]*"/gi, '');
        processedContent = processedContent.replace(/\s*stroke="[^"]*"/gi, '');
        processedContent = processedContent.replace(/\s*style="[^"]*fill[^"]*"/gi, '');
      }
      
      // 压缩：移除注释、多余空格
      processedContent = processedContent
        .replace(/<!--[\s\S]*?-->/g, '')
        .replace(/>\s+</g, '><')
        .replace(/\s{2,}/g, ' ')
        .trim();
      
      const compressedSize = new Blob([processedContent]).size;
      
      setFileList(prev => prev.map((file, index) => 
        index === i ? { 
          ...file, 
          status: 'done',
          compressedSize,
          processedContent,
        } : file
      ));
    }
    
    setProcessing(false);
    message.success('所有 SVG 文件处理完成！');
  }, [fileList, colorAction, targetColor]);

  const removeFile = (uid: string) => {
    setFileList(prev => prev.filter(f => f.uid !== uid));
  };

  const clearAll = () => {
    setFileList([]);
    setPreviewVisible(false);
  };

  const downloadFile = (file: SVGFile) => {
    const content = file.processedContent || file.content || '';
    const blob = new Blob([content], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = file.name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const downloadAll = () => {
    fileList.forEach(file => {
      if (file.status === 'done') {
        downloadFile(file);
      }
    });
    message.success('开始下载处理后的文件...');
  };

  const showPreview = (file: SVGFile) => {
    setPreviewContent(file.processedContent || file.content || '');
    setPreviewVisible(true);
  };

  // 从 HTML 中提取 SVG
  const extractSVGFromHTML = (html: string): string => {
    const svgMatch = html.match(/<svg[\s\S]*?<\/svg>/i);
    if (svgMatch) {
      return svgMatch[0];
    }
    // 尝试匹配带有命名空间的 SVG
    const svgNSMatch = html.match(/<svg[\s\S]*?\/>/i);
    if (svgNSMatch) {
      return svgNSMatch[0];
    }
    return '';
  };

  // 渲染 SVG 代码
  const handleRenderSVG = useCallback(() => {
    setEditorError('');
    try {
      let code = svgCode.trim();
      
      // 如果粘贴的是 HTML，尝试提取 SVG
      if (code.includes('<!DOCTYPE html>') || code.includes('<html') || (code.includes('<div') && code.includes('</div>'))) {
        const extracted = extractSVGFromHTML(code);
        if (extracted) {
          code = extracted;
          setSvgCode(extracted);
          message.success('已从 HTML 中提取 SVG 代码');
        } else {
          setEditorError('未在 HTML 中找到有效的 SVG 代码');
          return;
        }
      }

      // 验证 SVG 基本结构
      if (!code.includes('<svg')) {
        setEditorError('无效的 SVG 代码：缺少 <svg> 标签');
        return;
      }

      // 确保 xmlns 存在
      if (!code.includes('xmlns=')) {
        code = code.replace(/<svg/i, '<svg xmlns="http://www.w3.org/2000/svg"');
      }

      setRenderedSvg(code);
      
      // 获取 SVG 尺寸
      setTimeout(() => {
        if (svgContainerRef.current) {
          const svgEl = svgContainerRef.current.querySelector('svg');
          if (svgEl) {
            const rect = svgEl.getBoundingClientRect();
            setExportSize({
              width: Math.round(rect.width) || parseInt(svgEl.getAttribute('width') || '200'),
              height: Math.round(rect.height) || parseInt(svgEl.getAttribute('height') || '200'),
            });
          }
        }
      }, 100);
    } catch (err) {
      setEditorError('渲染失败：' + (err as Error).message);
    }
  }, [svgCode]);

  // 复制代码
  const handleCopyCode = useCallback(() => {
    navigator.clipboard.writeText(renderedSvg || svgCode).then(() => {
      message.success('代码已复制到剪贴板');
    });
  }, [renderedSvg, svgCode]);

  // 格式化 SVG
  const handleFormatSVG = useCallback(() => {
    try {
      let code = svgCode;
      // 简单的格式化
      code = code
        .replace(/>\s*</g, '>\n<')
        .replace(/\n\s*\n/g, '\n')
        .trim();
      setSvgCode(code);
      message.success('格式化完成');
    } catch {
      message.error('格式化失败');
    }
  }, [svgCode]);

  // 导出文件
  const handleExport = useCallback(() => {
    const code = renderedSvg || svgCode;
    if (!code) {
      message.warning('请先渲染 SVG');
      return;
    }

    if (exportFormat === 'svg') {
      const blob = new Blob([code], { type: 'image/svg+xml' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `svg-export-${Date.now()}.svg`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      message.success('SVG 文件已导出');
    } else {
      // PNG/JPEG 导出
      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const svgBlob = new Blob([code], { type: 'image/svg+xml;charset=utf-8' });
      const url = URL.createObjectURL(svgBlob);
      const img = new Image();
      
      img.onload = () => {
        const w = exportSize.width || img.naturalWidth || 200;
        const h = exportSize.height || img.naturalHeight || 200;
        canvas.width = w;
        canvas.height = h;
        
        if (exportFormat === 'jpeg') {
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(0, 0, w, h);
        }
        
        ctx.drawImage(img, 0, 0, w, h);
        
        canvas.toBlob((blob) => {
          if (blob) {
            const exportUrl = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = exportUrl;
            a.download = `svg-export-${Date.now()}.${exportFormat}`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(exportUrl);
            message.success(`${exportFormat.toUpperCase()} 文件已导出`);
          }
        }, `image/${exportFormat}`, 0.95);
        
        URL.revokeObjectURL(url);
      };
      
      img.onerror = () => {
        URL.revokeObjectURL(url);
        message.error('导出失败，请检查 SVG 代码');
      };
      
      img.src = url;
    }
  }, [renderedSvg, svgCode, exportFormat, exportSize]);

  const columns = [
    {
      title: '文件名',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '原始大小',
      dataIndex: 'originalSize',
      key: 'originalSize',
      render: (size: number) => `${(size / 1024).toFixed(2)} KB`,
    },
    {
      title: '处理后',
      dataIndex: 'compressedSize',
      key: 'compressedSize',
      render: (size: number, record: SVGFile) => (
        <span style={{ color: record.compressedSize < record.originalSize ? '#52c41a' : 'inherit' }}>
          {`${(size / 1024).toFixed(2)} KB`}
        </span>
      ),
    },
    {
      title: '压缩率',
      key: 'ratio',
      render: (_: any, record: SVGFile) => {
        const ratio = record.originalSize > 0 
          ? ((1 - record.compressedSize / record.originalSize) * 100).toFixed(1) 
          : '0';
        return (
          <Progress 
            percent={parseFloat(ratio)} 
            size="small" 
            status={parseFloat(ratio) > 0 ? 'success' : 'normal'}
          />
        );
      },
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        const colors: Record<string, string> = {
          pending: 'default',
          processing: 'processing',
          done: 'success',
          error: 'error',
        };
        const labels: Record<string, string> = {
          pending: '待处理',
          processing: '处理中',
          done: '完成',
          error: '错误',
        };
        return <Tag color={colors[status]}>{labels[status]}</Tag>;
      },
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: SVGFile) => (
        <Space>
          <Button icon={<EyeOutlined />} size="small" onClick={() => showPreview(record)}>预览</Button>
          <Button icon={<DownloadOutlined />} size="small" onClick={() => downloadFile(record)}>下载</Button>
          <Button icon={<DeleteOutlined />} size="small" danger onClick={() => removeFile(record.uid)}>
            删除
          </Button>
        </Space>
      ),
    },
  ];

  const totalOriginal = fileList.reduce((sum, f) => sum + f.originalSize, 0);
  const totalCompressed = fileList.reduce((sum, f) => sum + f.compressedSize, 0);
  const totalSaved = totalOriginal - totalCompressed;

  return (
    <>
      <SEO {...seoConfig} />
      <div>
      <Title level={1} style={{ fontSize: '1.75rem' }}>
        <FileImageOutlined /> SVG 压缩处理工具
      </Title>
      <Paragraph type="secondary">
        免费的在线 SVG 处理工具，支持 SVG 压缩、批量转换、颜色替换、预览和下载。纯前端处理，不上传服务器，保护您的文件隐私。
      </Paragraph>

      <Row gutter={24}>
        <Col span={16}>
          <Card title="上传 SVG 文件">
            <Dragger
              multiple
              accept=".svg"
              beforeUpload={() => false}
              onChange={handleUpload}
              showUploadList={false}
            >
              <p className="ant-upload-drag-icon">
                <UploadOutlined />
              </p>
              <p className="ant-upload-text">点击或拖拽 SVG 文件到此处</p>
              <p className="ant-upload-hint">
                支持批量上传，单个文件不超过 5MB
              </p>
            </Dragger>
          </Card>

          <Card title="颜色处理" style={{ marginTop: 16 }}>
            <Space direction="vertical" style={{ width: '100%' }}>
              <Radio.Group 
                value={colorAction} 
                onChange={(e) => setColorAction(e.target.value)}
              >
                <Radio.Button value="add">
                  <BgColorsOutlined /> 添加颜色
                </Radio.Button>
                <Radio.Button value="remove">
                  <ClearOutlined /> 移除颜色
                </Radio.Button>
              </Radio.Group>
              
              {colorAction === 'add' && (
                <div style={{ marginTop: 8 }}>
                  <span>目标颜色：</span>
                  <Input 
                    type="color" 
                    value={targetColor}
                    onChange={(e) => setTargetColor(e.target.value)}
                    style={{ width: 60, marginLeft: 8 }}
                  />
                  <Input 
                    value={targetColor}
                    onChange={(e) => setTargetColor(e.target.value)}
                    style={{ width: 120, marginLeft: 8 }}
                  />
                </div>
              )}
            </Space>
          </Card>
        </Col>
        <Col span={8}>
          <Card title="处理统计">
            <Statistic title="文件数量" value={fileList.length} suffix="个" />
            <Statistic title="原始大小" value={(totalOriginal / 1024).toFixed(2)} suffix="KB" style={{ marginTop: 16 }} />
            <Statistic 
              title="处理后" 
              value={(totalCompressed / 1024).toFixed(2)} 
              suffix="KB" 
              style={{ marginTop: 16 }}
              valueStyle={{ color: '#52c41a' }}
            />
            <Statistic 
              title="节省空间" 
              value={totalOriginal > 0 ? ((totalSaved / totalOriginal) * 100).toFixed(1) : 0} 
              suffix="%" 
              style={{ marginTop: 16 }}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
      </Row>

      {fileList.length > 0 && (
        <Card 
          title="文件列表" 
          style={{ marginTop: 24 }}
          extra={
            <Space>
              <Button 
                type="primary" 
                icon={<CompressOutlined />} 
                onClick={processSVG}
                loading={processing}
              >
                开始处理
              </Button>
              <Button icon={<DownloadOutlined />} onClick={downloadAll}>
                批量下载
              </Button>
              <Button icon={<DeleteOutlined />} danger onClick={clearAll}>
                清空
              </Button>
            </Space>
          }
        >
          <Table 
            dataSource={fileList} 
            columns={columns} 
            rowKey="uid"
            pagination={false}
          />
        </Card>
      )}

      {previewVisible && (
        <Card title="预览" style={{ marginTop: 24 }} extra={
          <Button onClick={() => setPreviewVisible(false)}>关闭</Button>
        }>
          <div style={{ display: 'flex', gap: 24 }}>
            <div style={{ flex: 1 }}>
              <h4>SVG 代码</h4>
              <pre style={{ 
                background: '#f5f5f5', 
                padding: 16, 
                borderRadius: 8,
                maxHeight: 400,
                overflow: 'auto',
                fontSize: 12
              }}>
                {previewContent}
              </pre>
            </div>
            <div style={{ flex: 1 }}>
              <h4>渲染效果</h4>
              <div 
                style={{ 
                  border: '1px solid #d9d9d9', 
                  borderRadius: 8,
                  padding: 24,
                  minHeight: 200,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: '#fafafa'
                }}
                dangerouslySetInnerHTML={{ __html: previewContent }}
              />
            </div>
          </div>
        </Card>
      )}

      {/* SVG 代码编辑器 */}
      <Card 
        title={<><CodeOutlined /> SVG 代码编辑器</>} 
        style={{ marginTop: 24 }}
      >
        <Tabs activeKey={activeTab} onChange={setActiveTab} items={[
          {
            key: 'upload',
            label: '文件上传',
            children: null,
          },
          {
            key: 'editor',
            label: '代码编辑',
            children: (
              <Space direction="vertical" style={{ width: '100%' }} size="large">
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                    <span style={{ fontWeight: 500 }}>SVG 代码 / HTML 片段</span>
                    <Space>
                      <Tooltip title="格式化代码">
                        <Button icon={<ClearOutlined />} size="small" onClick={handleFormatSVG}>格式化</Button>
                      </Tooltip>
                      <Tooltip title="复制代码">
                        <Button icon={<CopyOutlined />} size="small" onClick={handleCopyCode}>复制</Button>
                      </Tooltip>
                    </Space>
                  </div>
                  <Input.TextArea
                    value={svgCode}
                    onChange={(e) => setSvgCode(e.target.value)}
                    rows={12}
                    placeholder="在此粘贴 SVG 代码或包含 SVG 的 HTML 代码..."
                    style={{ 
                      fontFamily: 'monospace', 
                      fontSize: 13,
                      background: '#fafafa',
                    }}
                  />
                  {editorError && (
                    <div style={{ color: '#ff4d4f', marginTop: 8, fontSize: 13 }}>
                      {editorError}
                    </div>
                  )}
                  <div style={{ marginTop: 8, color: '#888', fontSize: 12 }}>
                    提示：支持直接粘贴 SVG 代码，或粘贴包含 &lt;svg&gt; 的 HTML 代码，系统会自动提取 SVG
                  </div>
                </div>

                <Button 
                  type="primary" 
                  icon={<FileImageFilled />} 
                  onClick={handleRenderSVG}
                  size="large"
                  block
                >
                  渲染预览
                </Button>

                {renderedSvg && (
                  <>
                    <Divider />
                    <Row gutter={24}>
                      <Col span={16}>
                        <Card 
                          size="small" 
                          title="渲染效果" 
                          extra={
                            <span style={{ fontSize: 12, color: '#888' }}>
                              {exportSize.width > 0 && `${exportSize.width} x ${exportSize.height} px`}
                            </span>
                          }
                        >
                          <div 
                            ref={svgContainerRef}
                            style={{ 
                              border: '1px dashed #d9d9d9', 
                              borderRadius: 8,
                              padding: 24,
                              minHeight: 200,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              background: '#fafafa',
                              overflow: 'auto'
                            }}
                            dangerouslySetInnerHTML={{ __html: renderedSvg }}
                          />
                        </Card>
                      </Col>
                      <Col span={8}>
                        <Card size="small" title="导出设置">
                          <Space direction="vertical" style={{ width: '100%' }}>
                            <div>
                              <div style={{ marginBottom: 8, fontWeight: 500 }}>导出格式</div>
                              <Radio.Group 
                                value={exportFormat} 
                                onChange={(e) => setExportFormat(e.target.value)}
                                buttonStyle="solid"
                              >
                                <Radio.Button value="svg">SVG</Radio.Button>
                                <Radio.Button value="png">PNG</Radio.Button>
                                <Radio.Button value="jpeg">JPEG</Radio.Button>
                              </Radio.Group>
                            </div>
                            
                            {exportFormat !== 'svg' && (
                              <div>
                                <div style={{ marginBottom: 8, fontWeight: 500 }}>导出尺寸</div>
                                <Space>
                                  <Input 
                                    type="number" 
                                    value={exportSize.width || ''} 
                                    onChange={(e) => setExportSize(s => ({ ...s, width: parseInt(e.target.value) || 0 }))}
                                    placeholder="宽"
                                    style={{ width: 80 }}
                                    addonAfter="px"
                                  />
                                  <span>x</span>
                                  <Input 
                                    type="number" 
                                    value={exportSize.height || ''} 
                                    onChange={(e) => setExportSize(s => ({ ...s, height: parseInt(e.target.value) || 0 }))}
                                    placeholder="高"
                                    style={{ width: 80 }}
                                    addonAfter="px"
                                  />
                                </Space>
                              </div>
                            )}

                            <Button 
                              type="primary" 
                              icon={<ExportOutlined />} 
                              onClick={handleExport}
                              block
                            >
                              导出 {exportFormat.toUpperCase()}
                            </Button>
                          </Space>
                        </Card>
                      </Col>
                    </Row>
                  </>
                )}
              </Space>
            ),
          },
        ]} />
        <canvas ref={canvasRef} style={{ display: 'none' }} />
      </Card>

      <Card title="功能说明" style={{ marginTop: 24 }}>
        <Row gutter={24}>
          <Col span={8}>
            <Card size="small" title="基础版（免费）">
              <ul>
                <li>单文件 SVG 压缩</li>
                <li>颜色添加/移除</li>
                <li>文件预览</li>
              </ul>
            </Card>
          </Col>
          <Col span={8}>
            <Card size="small" title="PRO 版" style={{ borderColor: '#faad14' }}>
              <ul>
                <li>批量文件处理（最多 50 个）</li>
                <li>云端存储和同步</li>
                <li>高级压缩算法</li>
                <li>团队协作功能</li>
              </ul>
              <Tag color="gold">推荐</Tag>
            </Card>
          </Col>
          <Col span={8}>
            <Card size="small" title="企业版">
              <ul>
                <li>无限批量处理</li>
                <li>API 接口访问</li>
                <li>私有化部署</li>
                <li>专属技术支持</li>
              </ul>
            </Card>
          </Col>
        </Row>
      </Card>
    </div>
    </>
  );
};

export default SVGProcessor;
