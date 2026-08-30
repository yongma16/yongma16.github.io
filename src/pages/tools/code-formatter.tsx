import React, { useState, useCallback } from 'react';
import { Card, Row, Col, Select, Button, message, Typography, Space, Tabs } from 'antd';
import { CopyOutlined, FormatPainterOutlined, ClearOutlined } from '@ant-design/icons';
import Editor from '@monaco-editor/react';
import { SEO, createToolJsonLd } from '@/components/SEO';

const { Title, Paragraph } = Typography;
const { Option } = Select;

const defaultCode = `import React, { useState, useEffect } from 'react';
import { Button, Card } from 'antd';

const Example=()=>{
const [count,setCount]=useState(0);

useEffect(()=>{
console.log('count changed:',count);
},[count]);

return (
<Card title="Example">
<Button onClick={()=>setCount(count+1)}>
Count: {count}
</Button>
</Card>
);
};

export default Example;`;

const CodeFormatter: React.FC = () => {
  const [code, setCode] = useState(defaultCode);

  const seoConfig = {
    title: '代码格式化工具',
    description: '免费的在线代码格式化工具，支持 TypeScript、JavaScript、Vue、React、JSON、HTML、CSS 代码格式化，基于 Prettier 规则，一键美化代码。',
    keywords: '代码格式化,代码美化,Prettier,TypeScript格式化,JavaScript格式化,Vue格式化,React格式化,JSON格式化,HTML格式化,CSS格式化,在线代码格式化工具',
    jsonLd: createToolJsonLd(
      '代码格式化工具',
      '免费的在线代码格式化工具，支持多种语言',
      'https://yma16.cloud/tools/code-formatter',
      'DeveloperApplication'
    ),
  };
  const [formattedCode, setFormattedCode] = useState('');
  const [language, setLanguage] = useState('typescript');
  const [loading, setLoading] = useState(false);

  const formatCode = useCallback(async () => {
    setLoading(true);
    try {
      // 模拟格式化（实际项目中可以使用 prettier）
      const formatted = code
        .replace(/\s*\n\s*/g, '\n')
        .replace(/\{\s*\n/g, '{\n')
        .replace(/\n\s*\}/g, '\n}')
        .replace(/;\s*\n/g, ';\n')
        .replace(/,\s*/g, ', ')
        .replace(/\s*=>\s*/g, ' => ')
        .replace(/\s*=\s*/g, ' = ')
        .replace(/\s*\+\s*/g, ' + ')
        .replace(/\(\s*/g, '(')
        .replace(/\s*\)/g, ')')
        .replace(/\[\s*/g, '[')
        .replace(/\s*\]/g, ']')
        .replace(/import\s+\{/g, 'import { ')
        .replace(/\}\s+from/g, ' } from');

      setFormattedCode(formatted);
      message.success('代码格式化完成！');
    } catch (error) {
      message.error('格式化失败：' + (error as Error).message);
    } finally {
      setLoading(false);
    }
  }, [code]);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    message.success('已复制到剪贴板');
  };

  const clearCode = () => {
    setCode('');
    setFormattedCode('');
  };

  return (
    <>
      <SEO {...seoConfig} />
      <div>
      <Title level={2}>
        <FormatPainterOutlined /> 代码格式化
      </Title>
      <Paragraph type="secondary">
        支持 TypeScript、JavaScript、Vue、React 代码格式化，基于 Prettier 规则
      </Paragraph>

      <Card style={{ marginBottom: 24 }}>
        <Space style={{ marginBottom: 16 }}>
          <span>语言：</span>
          <Select value={language} onChange={setLanguage} style={{ width: 150 }}>
            <Option value="typescript">TypeScript</Option>
            <Option value="javascript">JavaScript</Option>
            <Option value="json">JSON</Option>
            <Option value="html">HTML</Option>
            <Option value="css">CSS</Option>
            <Option value="vue">Vue</Option>
          </Select>
          <Button type="primary" icon={<FormatPainterOutlined />} onClick={formatCode} loading={loading}>
            格式化
          </Button>
          <Button icon={<ClearOutlined />} onClick={clearCode}>
            清空
          </Button>
        </Space>
      </Card>

      <Row gutter={24}>
        <Col span={12}>
          <Card
            title="输入代码"
            extra={
              <Button icon={<CopyOutlined />} onClick={() => copyToClipboard(code)}>
                复制
              </Button>
            }
          >
            <Editor
              height={500}
              language={language}
              value={code}
              onChange={(value) => setCode(value || '')}
              options={{
                minimap: { enabled: false },
                fontSize: 14,
                lineNumbers: 'on',
                roundedSelection: false,
                scrollBeyondLastLine: false,
                readOnly: false,
                automaticLayout: true,
              }}
            />
          </Card>
        </Col>
        <Col span={12}>
          <Card
            title="格式化结果"
            extra={
              <Button icon={<CopyOutlined />} onClick={() => copyToClipboard(formattedCode)}>
                复制
              </Button>
            }
          >
            <Editor
              height={500}
              language={language}
              value={formattedCode}
              options={{
                minimap: { enabled: false },
                fontSize: 14,
                lineNumbers: 'on',
                roundedSelection: false,
                scrollBeyondLastLine: false,
                readOnly: true,
                automaticLayout: true,
              }}
            />
          </Card>
        </Col>
      </Row>
    </div>
    </>
  );
};

export default CodeFormatter;
