import React, { useState, useCallback } from 'react';
import { Card, Upload, Button, Row, Col, Typography, Space, List, Tag, Progress, message, Table, Input, Radio, Statistic } from 'antd';
import { FileImageOutlined, UploadOutlined, DownloadOutlined, CompressOutlined, DeleteOutlined, EyeOutlined, BgColorsOutlined, ClearOutlined } from '@ant-design/icons';
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
    title: 'SVG 处理工具',
    description: '免费的在线 SVG 处理工具，支持 SVG 压缩、批量转换、颜色替换、预览和下载，优化 SVG 图标和图形文件大小，提升网页加载性能。',
    keywords: 'SVG处理,SVG压缩,SVG转换,SVG优化,SVG批量处理,SVG颜色替换,SVG预览,SVG工具,矢量图形处理',
    jsonLd: createToolJsonLd(
      'SVG 处理工具',
      '免费的在线 SVG 压缩和转换工具',
      'https://yma16.cloud/tools/svg-processor',
      'DeveloperApplication'
    ),
  };
  const [processing, setProcessing] = useState(false);
  const [colorAction, setColorAction] = useState<'add' | 'remove'>('add');
  const [targetColor, setTargetColor] = useState('#1890ff');
  const [previewContent, setPreviewContent] = useState('');
  const [previewVisible, setPreviewVisible] = useState(false);

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
      <Title level={2}>
        <FileImageOutlined /> SVG 批量处理
      </Title>
      <Paragraph type="secondary">
        支持 SVG 压缩、颜色处理、格式转换、批量导出
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
