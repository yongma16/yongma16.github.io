import React, { useState, useCallback } from 'react';
import { Card, Row, Col, Button, Typography, Space, message, Tag } from 'antd';
import { DiffOutlined, CopyOutlined, ClearOutlined, SwapOutlined } from '@ant-design/icons';
import Editor from '@monaco-editor/react';

const { Title, Paragraph } = Typography;

interface DiffLine {
  type: 'equal' | 'insert' | 'delete';
  oldLine: number;
  newLine: number;
  content: string;
}

const FileDiff: React.FC = () => {
  const [oldCode, setOldCode] = useState('');
  const [newCode, setNewCode] = useState('');
  const [diffResult, setDiffResult] = useState<DiffLine[]>([]);
  const [showDiff, setShowDiff] = useState(false);

  const defaultOldCode = `function hello() {
  console.log("Hello World");
  return "hello";
}

function goodbye() {
  console.log("Goodbye");
}`;

  const defaultNewCode = `function hello() {
  console.log("Hello World!");
  return "hello";
}

function welcome() {
  console.log("Welcome!");
  return "welcome";
}

function goodbye() {
  console.log("Goodbye!");
}`;

  const computeDiff = useCallback(() => {
    const oldLines = oldCode.split('\n');
    const newLines = newCode.split('\n');
    const result: DiffLine[] = [];
    
    let oldIndex = 0;
    let newIndex = 0;
    
    while (oldIndex < oldLines.length || newIndex < newLines.length) {
      const oldLine = oldLines[oldIndex];
      const newLine = newLines[newIndex];
      
      if (oldIndex >= oldLines.length) {
        // 新增行
        result.push({
          type: 'insert',
          oldLine: 0,
          newLine: newIndex + 1,
          content: newLine
        });
        newIndex++;
      } else if (newIndex >= newLines.length) {
        // 删除行
        result.push({
          type: 'delete',
          oldLine: oldIndex + 1,
          newLine: 0,
          content: oldLine
        });
        oldIndex++;
      } else if (oldLine === newLine) {
        // 相同行
        result.push({
          type: 'equal',
          oldLine: oldIndex + 1,
          newLine: newIndex + 1,
          content: oldLine
        });
        oldIndex++;
        newIndex++;
      } else {
        // 查找下一个匹配行
        let foundMatch = false;
        let lookAhead = 1;
        
        while (!foundMatch && lookAhead <= 3) {
          if (oldLines[oldIndex + lookAhead] === newLine) {
            // 旧文件删除了行
            for (let i = 0; i < lookAhead; i++) {
              result.push({
                type: 'delete',
                oldLine: oldIndex + 1,
                newLine: 0,
                content: oldLines[oldIndex + i]
              });
            }
            oldIndex += lookAhead;
            foundMatch = true;
          } else if (newLines[newIndex + lookAhead] === oldLine) {
            // 新文件插入了行
            for (let i = 0; i < lookAhead; i++) {
              result.push({
                type: 'insert',
                oldLine: 0,
                newLine: newIndex + 1,
                content: newLines[newIndex + i]
              });
            }
            newIndex += lookAhead;
            foundMatch = true;
          }
          lookAhead++;
        }
        
        if (!foundMatch) {
          // 视为修改：删除旧行，插入新行
          result.push({
            type: 'delete',
            oldLine: oldIndex + 1,
            newLine: 0,
            content: oldLine
          });
          result.push({
            type: 'insert',
            oldLine: 0,
            newLine: newIndex + 1,
            content: newLine
          });
          oldIndex++;
          newIndex++;
        }
      }
    }
    
    setDiffResult(result);
    setShowDiff(true);
    message.success('对比完成！');
  }, [oldCode, newCode]);

  const loadExample = () => {
    setOldCode(defaultOldCode);
    setNewCode(defaultNewCode);
    setShowDiff(false);
  };

  const clearAll = () => {
    setOldCode('');
    setNewCode('');
    setDiffResult([]);
    setShowDiff(false);
  };

  const swapContent = () => {
    const temp = oldCode;
    setOldCode(newCode);
    setNewCode(temp);
    setShowDiff(false);
  };

  const getDiffStats = () => {
    const insertions = diffResult.filter(d => d.type === 'insert').length;
    const deletions = diffResult.filter(d => d.type === 'delete').length;
    const unchanged = diffResult.filter(d => d.type === 'equal').length;
    return { insertions, deletions, unchanged };
  };

  const stats = getDiffStats();

  return (
    <div>
      <Title level={2}>
        <DiffOutlined /> 文件对比
      </Title>
      <Paragraph type="secondary">
        对比两个文本文件的差异，支持代码、配置文件等文本对比
      </Paragraph>

      <Space style={{ marginBottom: 16 }}>
        <Button type="primary" icon={<DiffOutlined />} onClick={computeDiff}>
          开始对比
        </Button>
        <Button icon={<SwapOutlined />} onClick={swapContent}>
          交换内容
        </Button>
        <Button icon={<CopyOutlined />} onClick={loadExample}>
          加载示例
        </Button>
        <Button icon={<ClearOutlined />} onClick={clearAll}>
          清空
        </Button>
      </Space>

      {showDiff && (
        <Card size="small" style={{ marginBottom: 16 }}>
          <Space>
            <Tag color="green">新增: {stats.insertions} 行</Tag>
            <Tag color="red">删除: {stats.deletions} 行</Tag>
            <Tag color="default">不变: {stats.unchanged} 行</Tag>
          </Space>
        </Card>
      )}

      <Row gutter={24}>
        <Col span={12}>
          <Card title="原始文件" size="small">
            <Editor
              height={400}
              language="javascript"
              value={oldCode}
              onChange={(value) => { setOldCode(value || ''); setShowDiff(false); }}
              options={{
                minimap: { enabled: false },
                fontSize: 14,
                lineNumbers: 'on',
                automaticLayout: true,
              }}
            />
          </Card>
        </Col>
        <Col span={12}>
          <Card title="对比文件" size="small">
            <Editor
              height={400}
              language="javascript"
              value={newCode}
              onChange={(value) => { setNewCode(value || ''); setShowDiff(false); }}
              options={{
                minimap: { enabled: false },
                fontSize: 14,
                lineNumbers: 'on',
                automaticLayout: true,
              }}
            />
          </Card>
        </Col>
      </Row>

      {showDiff && (
        <Card title="对比结果" style={{ marginTop: 24 }}>
          <div style={{ 
            fontFamily: 'monospace', 
            fontSize: 14,
            lineHeight: '1.5',
            maxHeight: 500,
            overflow: 'auto'
          }}>
            {diffResult.map((line, index) => (
              <div
                key={index}
                style={{
                  display: 'flex',
                  backgroundColor: 
                    line.type === 'insert' ? '#f6ffed' : 
                    line.type === 'delete' ? '#fff1f0' : 'transparent',
                  borderLeft: `3px solid ${
                    line.type === 'insert' ? '#52c41a' : 
                    line.type === 'delete' ? '#f5222d' : 'transparent'
                  }`,
                  padding: '2px 8px',
                }}
              >
                <span style={{ 
                  width: 80, 
                  color: '#999',
                  flexShrink: 0,
                  userSelect: 'none'
                }}>
                  {line.oldLine > 0 ? line.oldLine : ' '}
                  {' '}
                  {line.newLine > 0 ? line.newLine : ' '}
                </span>
                <span style={{ 
                  width: 20, 
                  flexShrink: 0,
                  color: 
                    line.type === 'insert' ? '#52c41a' : 
                    line.type === 'delete' ? '#f5222d' : '#999'
                }}>
                  {line.type === 'insert' ? '+' : line.type === 'delete' ? '-' : ' '}
                </span>
                <span style={{ 
                  color: 
                    line.type === 'insert' ? '#52c41a' : 
                    line.type === 'delete' ? '#f5222d' : '#333'
                }}>
                  {line.content}
                </span>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
};

export default FileDiff;
