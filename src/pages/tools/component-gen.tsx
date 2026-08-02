import React, { useState } from 'react';
import { Card, Form, Input, Select, Button, Row, Col, message, Typography, Space, Tabs, Checkbox } from 'antd';
import { ToolOutlined, CopyOutlined, DownloadOutlined } from '@ant-design/icons';
import Editor from '@monaco-editor/react';

const { Title, Paragraph } = Typography;
const { Option } = Select;
const { TextArea } = Input;

interface ComponentConfig {
  name: string;
  framework: 'react' | 'vue';
  language: 'ts' | 'js';
  styleType: 'css' | 'less' | 'scss' | 'styled' | 'none';
  props: string[];
  useHooks: string[];
  withTypes: boolean;
  withStorybook: boolean;
  withTests: boolean;
}

const ComponentGen: React.FC = () => {
  const [form] = Form.useForm();
  const [generatedCode, setGeneratedCode] = useState('');
  const [activeTab, setActiveTab] = useState('component');

  const generateComponent = (values: ComponentConfig) => {
    const { name, framework, language, styleType, props, useHooks, withTypes, withStorybook, withTests } = values;
    
    let code = '';
    
    if (framework === 'react') {
      // React Component
      const imports = ['React'];
      if (useHooks?.includes('useState')) imports.push('useState');
      if (useHooks?.includes('useEffect')) imports.push('useEffect');
      if (useHooks?.includes('useCallback')) imports.push('useCallback');
      if (useHooks?.includes('useMemo')) imports.push('useMemo');
      
      code += `import ${imports.length > 1 ? `{ ${imports.join(', ')} }` : 'React'} from 'react';\n`;
      
      if (styleType === 'styled') {
        code += `import styled from 'styled-components';\n`;
      }
      
      code += `\n`;
      
      // Types
      if (withTypes && language === 'ts') {
        code += `interface ${name}Props {\n`;
        props?.forEach(prop => {
          code += `  ${prop}: string;\n`;
        });
        code += `}\n\n`;
      }
      
      // Component
      const propsType = withTypes && language === 'ts' ? `: ${name}Props` : '';
      code += `const ${name}${propsType} = ({ ${props?.join(', ') || ''} }) => {\n`;
      
      // Hooks
      if (useHooks?.includes('useState')) {
        code += `  const [count, setCount] = useState(0);\n`;
      }
      if (useHooks?.includes('useEffect')) {
        code += `  useEffect(() => {\n    console.log('Component mounted');\n  }, []);\n`;
      }
      
      code += `\n  return (\n`;
      
      if (styleType === 'styled') {
        code += `    <StyledContainer>\n`;
      } else {
        code += `    <div className="${name.toLowerCase()}">\n`;
      }
      
      code += `      <h2>${name} Component</h2>\n`;
      code += `      {${props?.[0] || 'children'}}\n`;
      
      if (styleType === 'styled') {
        code += `    </StyledContainer>\n`;
      } else {
        code += `    </div>\n`;
      }
      
      code += `  );\n};\n\n`;
      
      // Styled component
      if (styleType === 'styled') {
        code += `const StyledContainer = styled.div\`\n  padding: 20px;\n  border-radius: 8px;\n  background: #f5f5f5;\n\`;\n\n`;
      }
      
      code += `export default ${name};\n`;
    } else {
      // Vue Component
      code += `<template>\n`;
      code += `  <div class="${name.toLowerCase()}">\n`;
      code += `    <h2>${name} Component</h2>\n`;
      props?.forEach(prop => {
        code += `    <p>{{ ${prop} }}</p>\n`;
      });
      code += `  </div>\n`;
      code += `</template>\n\n`;
      
      if (language === 'ts') {
        code += `<script setup lang="ts">\n`;
        code += `interface Props {\n`;
        props?.forEach(prop => {
          code += `  ${prop}: string;\n`;
        });
        code += `}\n\n`;
        code += `defineProps<Props>();\n`;
      } else {
        code += `<script setup>\n`;
        code += `defineProps({\n`;
        props?.forEach(prop => {
          code += `  ${prop}: String,\n`;
        });
        code += `});\n`;
      }
      code += `</script>\n\n`;
      
      if (styleType !== 'none') {
        code += `<style scoped${styleType !== 'css' ? ` lang="${styleType}"` : ''}>\n`;
        code += `.${name.toLowerCase()} {\n`;
        code += `  padding: 20px;\n`;
        code += `  border-radius: 8px;\n`;
        code += `}\n`;
        code += `</style>\n`;
      }
    }
    
    setGeneratedCode(code);
    message.success('组件代码生成成功！');
  };

  const copyCode = () => {
    navigator.clipboard.writeText(generatedCode);
    message.success('代码已复制');
  };

  const downloadCode = () => {
    const blob = new Blob([generatedCode], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'Component.tsx';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div>
      <Title level={2}>
        <ToolOutlined /> 组件生成器
      </Title>
      <Paragraph type="secondary">
        快速生成 React/Vue 组件代码模板，支持 TypeScript、样式配置和常用 Hooks
      </Paragraph>

      <Row gutter={24}>
        <Col span={10}>
          <Card title="组件配置">
            <Form
              form={form}
              layout="vertical"
              onFinish={generateComponent}
              initialValues={{
                framework: 'react',
                language: 'ts',
                styleType: 'css',
                withTypes: true,
              }}
            >
              <Form.Item
                label="组件名称"
                name="name"
                rules={[{ required: true, message: '请输入组件名称' }]}
              >
                <Input placeholder="例如：UserCard" />
              </Form.Item>

              <Form.Item label="框架" name="framework">
                <Select>
                  <Option value="react">React</Option>
                  <Option value="vue">Vue 3</Option>
                </Select>
              </Form.Item>

              <Form.Item label="语言" name="language">
                <Select>
                  <Option value="ts">TypeScript</Option>
                  <Option value="js">JavaScript</Option>
                </Select>
              </Form.Item>

              <Form.Item label="样式类型" name="styleType">
                <Select>
                  <Option value="css">CSS</Option>
                  <Option value="less">Less</Option>
                  <Option value="scss">SCSS</Option>
                  <Option value="styled">Styled Components</Option>
                  <Option value="none">无样式</Option>
                </Select>
              </Form.Item>

              <Form.Item label="Props" name="props">
                <Select mode="tags" placeholder="输入 props 名称">
                  <Option value="title">title</Option>
                  <Option value="content">content</Option>
                  <Option value="onClick">onClick</Option>
                  <Option value="children">children</Option>
                </Select>
              </Form.Item>

              <Form.Item label="Hooks" name="useHooks">
                <Select mode="multiple" placeholder="选择需要的 Hooks">
                  <Option value="useState">useState</Option>
                  <Option value="useEffect">useEffect</Option>
                  <Option value="useCallback">useCallback</Option>
                  <Option value="useMemo">useMemo</Option>
                </Select>
              </Form.Item>

              <Form.Item>
                <Space>
                  <Checkbox checked={true}>生成类型定义</Checkbox>
                  <Checkbox>生成 Storybook</Checkbox>
                  <Checkbox>生成测试文件</Checkbox>
                </Space>
              </Form.Item>

              <Form.Item>
                <Button type="primary" htmlType="submit" block icon={<ToolOutlined />}>
                  生成组件
                </Button>
              </Form.Item>
            </Form>
          </Card>
        </Col>

        <Col span={14}>
          <Card
            title="生成结果"
            extra={
              <Space>
                <Button icon={<CopyOutlined />} onClick={copyCode}>
                  复制
                </Button>
                <Button icon={<DownloadOutlined />} onClick={downloadCode}>
                  下载
                </Button>
              </Space>
            }
          >
            <Editor
              height={600}
              language="typescript"
              value={generatedCode}
              options={{
                minimap: { enabled: false },
                fontSize: 14,
                lineNumbers: 'on',
                readOnly: true,
                automaticLayout: true,
              }}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default ComponentGen;
