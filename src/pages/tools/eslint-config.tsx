import React, { useState, useCallback } from 'react';
import { Card, Row, Col, Button, message, Typography, Space, Checkbox, Select, Divider, Tag, Radio } from 'antd';
import { CopyOutlined, FileTextOutlined, ClearOutlined, CheckCircleOutlined } from '@ant-design/icons';
import Editor from '@monaco-editor/react';
import { SEO, createToolJsonLd } from '@/components/SEO';

const { Title, Paragraph, Text } = Typography;
const { Option } = Select;

interface EslintConfig {
  env: Record<string, boolean>;
  extends: string[];
  parser: string;
  parserOptions: Record<string, any>;
  plugins: string[];
  rules: Record<string, any>;
  settings: Record<string, any>;
}

const ENV_OPTIONS = [
  { label: 'Browser', value: 'browser', desc: '浏览器全局变量' },
  { label: 'Node.js', value: 'node', desc: 'Node.js 全局变量和作用域' },
  { label: 'ES2024', value: 'es2024', desc: 'ES2024 全局变量' },
  { label: 'CommonJS', value: 'commonjs', desc: 'CommonJS 全局变量' },
  { label: 'Jest', value: 'jest', desc: 'Jest 测试框架' },
  { label: 'jQuery', value: 'jquery', desc: 'jQuery 全局变量' },
  { label: 'MongoDB', value: 'mongo', desc: 'MongoDB 全局变量' },
  { label: 'Service Worker', value: 'serviceworker', desc: 'Service Worker 全局变量' },
  { label: 'Web Extensions', value: 'webextensions', desc: 'WebExtensions 全局变量' },
  { label: 'Worker', value: 'worker', desc: 'Web Workers 全局变量' },
];

const EXTEND_OPTIONS = [
  { label: 'eslint:recommended', value: 'eslint:recommended', desc: 'ESLint 推荐规则' },
  { label: 'plugin:@typescript-eslint/recommended', value: 'plugin:@typescript-eslint/recommended', desc: 'TypeScript 推荐规则' },
  { label: 'plugin:@typescript-eslint/strict', value: 'plugin:@typescript-eslint/strict', desc: 'TypeScript 严格规则' },
  { label: 'plugin:react/recommended', value: 'plugin:react/recommended', desc: 'React 推荐规则' },
  { label: 'plugin:react/jsx-runtime', value: 'plugin:react/jsx-runtime', desc: 'React 17+ JSX 转换' },
  { label: 'plugin:react-hooks/recommended', value: 'plugin:react-hooks/recommended', desc: 'React Hooks 规则' },
  { label: 'plugin:vue/vue3-recommended', value: 'plugin:vue/vue3-recommended', desc: 'Vue 3 推荐规则' },
  { label: 'plugin:vue/recommended', value: 'plugin:vue/recommended', desc: 'Vue 2 推荐规则' },
  { label: 'plugin:prettier/recommended', value: 'plugin:prettier/recommended', desc: 'Prettier 集成' },
  { label: 'airbnb', value: 'airbnb', desc: 'Airbnb JavaScript 规范' },
  { label: 'airbnb-typescript', value: 'airbnb-typescript', desc: 'Airbnb TypeScript 规范' },
  { label: 'standard', value: 'standard', desc: 'JavaScript Standard 规范' },
  { label: 'plugin:import/recommended', value: 'plugin:import/recommended', desc: 'Import 插件推荐' },
  { label: 'plugin:import/typescript', value: 'plugin:import/typescript', desc: 'Import TypeScript 支持' },
  { label: 'plugin:node/recommended', value: 'plugin:node/recommended', desc: 'Node.js 推荐规则' },
  { label: 'plugin:security/recommended', value: 'plugin:security/recommended', desc: '安全相关规则' },
];

const RULE_PRESETS = {
  strict: {
    label: '严格模式',
    desc: '最严格的代码规范，适合大型团队协作',
    rules: {
      'no-console': 'warn',
      'no-debugger': 'error',
      'no-unused-vars': 'error',
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/explicit-function-return-type': 'error',
      '@typescript-eslint/no-unused-vars': 'error',
      'eqeqeq': ['error', 'always'],
      'curly': ['error', 'all'],
      'no-var': 'error',
      'prefer-const': 'error',
      'no-multiple-empty-lines': ['error', { max: 1 }],
      'indent': ['error', 2],
      'quotes': ['error', 'single'],
      'semi': ['error', 'always'],
    },
  },
  standard: {
    label: '标准模式',
    desc: '平衡规范与开发效率，适合大多数项目',
    rules: {
      'no-console': 'warn',
      'no-debugger': 'warn',
      'no-unused-vars': 'warn',
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/no-unused-vars': 'warn',
      'eqeqeq': ['error', 'smart'],
      'no-var': 'error',
      'prefer-const': 'warn',
      'no-multiple-empty-lines': ['warn', { max: 2 }],
      'indent': ['warn', 2],
      'quotes': ['warn', 'single'],
      'semi': ['warn', 'always'],
    },
  },
  relaxed: {
    label: '宽松模式',
    desc: '最小限制，适合原型开发和快速迭代',
    rules: {
      'no-console': 'off',
      'no-debugger': 'warn',
      'no-unused-vars': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
      'eqeqeq': 'off',
      'no-var': 'warn',
      'prefer-const': 'off',
    },
  },
};

const EslintConfigGenerator: React.FC = () => {
  const [selectedEnvs, setSelectedEnvs] = useState<string[]>(['browser', 'es2024']);
  const [selectedExtends, setSelectedExtends] = useState<string[]>(['eslint:recommended']);
  const [parser, setParser] = useState<string>('@typescript-eslint/parser');
  const [ecmaVersion, setEcmaVersion] = useState<string>('2024');
  const [sourceType, setSourceType] = useState<string>('module');
  const [jsx, setJsx] = useState<boolean>(true);
  const [rulePreset, setRulePreset] = useState<string>('standard');
  const [generatedConfig, setGeneratedConfig] = useState<string>('');

  const seoConfig = {
    title: 'ESLint 规则集配置生成器',
    description: '可视化生成 ESLint 配置文件，支持 TypeScript、React、Vue、Prettier 等多种规则集组合，一键导出 .eslintrc 配置。',
    keywords: 'ESLint配置,ESLint规则,TypeScript ESLint,React ESLint,Vue ESLint,Prettier配置,代码规范,lint规则生成器',
    jsonLd: createToolJsonLd(
      'ESLint 规则集配置生成器',
      '可视化生成 ESLint 配置文件，支持多种框架和规则集',
      'https://yma16.cloud/tools/eslint-config',
      'DeveloperApplication'
    ),
  };

  const generateConfig = useCallback(() => {
    const config: EslintConfig = {
      env: {},
      extends: selectedExtends,
      parser,
      parserOptions: {
        ecmaVersion,
        sourceType,
      },
      plugins: [],
      rules: { ...RULE_PRESETS[rulePreset as keyof typeof RULE_PRESETS].rules },
      settings: {},
    };

    // 设置环境
    selectedEnvs.forEach((env) => {
      config.env[env] = true;
    });

    // 根据 extends 自动添加插件
    if (selectedExtends.some((e) => e.includes('typescript'))) {
      if (!config.plugins.includes('@typescript-eslint')) {
        config.plugins.push('@typescript-eslint');
      }
    }
    if (selectedExtends.some((e) => e.includes('react'))) {
      if (!config.plugins.includes('react')) {
        config.plugins.push('react');
      }
      config.settings.react = { version: 'detect' };
    }
    if (selectedExtends.some((e) => e.includes('vue'))) {
      if (!config.plugins.includes('vue')) {
        config.plugins.push('vue');
      }
    }
    if (selectedExtends.some((e) => e.includes('import'))) {
      if (!config.plugins.includes('import')) {
        config.plugins.push('import');
      }
    }
    if (selectedExtends.some((e) => e.includes('prettier'))) {
      if (!config.plugins.includes('prettier')) {
        config.plugins.push('prettier');
      }
    }
    if (selectedExtends.some((e) => e.includes('security'))) {
      if (!config.plugins.includes('security')) {
        config.plugins.push('security');
      }
    }
    if (selectedExtends.some((e) => e.includes('node'))) {
      if (!config.plugins.includes('node')) {
        config.plugins.push('node');
      }
    }

    // JSX 支持
    if (jsx) {
      config.parserOptions.ecmaFeatures = { jsx: true };
    }

    // TypeScript 特殊配置
    if (parser === '@typescript-eslint/parser') {
      config.parserOptions.project = './tsconfig.json';
    }

    // 清理空数组
    if (config.plugins.length === 0) {
      delete (config as any).plugins;
    }
    if (Object.keys(config.settings).length === 0) {
      delete (config as any).settings;
    }

    const configText = `module.exports = ${JSON.stringify(config, null, 2)};`;
    setGeneratedConfig(configText);
    message.success('配置生成成功！');
  }, [selectedEnvs, selectedExtends, parser, ecmaVersion, sourceType, jsx, rulePreset]);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    message.success('已复制到剪贴板');
  };

  const clearAll = () => {
    setSelectedEnvs(['browser', 'es2024']);
    setSelectedExtends(['eslint:recommended']);
    setParser('@typescript-eslint/parser');
    setEcmaVersion('2024');
    setSourceType('module');
    setJsx(true);
    setRulePreset('standard');
    setGeneratedConfig('');
  };

  return (
    <>
      <SEO {...seoConfig} />
      <div>
        <Title level={2}>
          <FileTextOutlined /> ESLint 规则集配置生成器
        </Title>
        <Paragraph type="secondary">
          可视化生成 ESLint 配置文件，支持 TypeScript、React、Vue、Prettier 等多种规则集组合
        </Paragraph>

        <Row gutter={24}>
          <Col span={12}>
            <Card title="配置选项" style={{ marginBottom: 24 }}>
              <Space direction="vertical" style={{ width: '100%' }} size="large">
                {/* 运行环境 */}
                <div>
                  <Text strong>运行环境</Text>
                  <div style={{ marginTop: 8 }}>
                    <Checkbox.Group
                      options={ENV_OPTIONS.map((opt) => ({
                        label: (
                          <span>
                            {opt.label} <Text type="secondary" style={{ fontSize: 12 }}>({opt.desc})</Text>
                          </span>
                        ),
                        value: opt.value,
                      }))}
                      value={selectedEnvs}
                      onChange={(values) => setSelectedEnvs(values as string[])}
                    />
                  </div>
                </div>

                <Divider />

                {/* 扩展规则集 */}
                <div>
                  <Text strong>扩展规则集</Text>
                  <div style={{ marginTop: 8 }}>
                    <Checkbox.Group
                      options={EXTEND_OPTIONS.map((opt) => ({
                        label: (
                          <span>
                            <Tag color="blue">{opt.label}</Tag>
                            <Text type="secondary" style={{ fontSize: 12 }}>{opt.desc}</Text>
                          </span>
                        ),
                        value: opt.value,
                      }))}
                      value={selectedExtends}
                      onChange={(values) => setSelectedExtends(values as string[])}
                    />
                  </div>
                </div>

                <Divider />

                {/* 解析器设置 */}
                <div>
                  <Text strong>解析器设置</Text>
                  <Space style={{ marginTop: 8 }} wrap>
                    <div>
                      <Text type="secondary" style={{ fontSize: 12 }}>Parser</Text>
                      <Select value={parser} onChange={setParser} style={{ width: 220, display: 'block' }}>
                        <Option value="@typescript-eslint/parser">@typescript-eslint/parser</Option>
                        <Option value="espree">espree (ESLint 默认)</Option>
                        <Option value="@babel/eslint-parser">@babel/eslint-parser</Option>
                        <Option value="vue-eslint-parser">vue-eslint-parser</Option>
                      </Select>
                    </div>
                    <div>
                      <Text type="secondary" style={{ fontSize: 12 }}>ECMAScript 版本</Text>
                      <Select value={ecmaVersion} onChange={setEcmaVersion} style={{ width: 120, display: 'block' }}>
                        <Option value="2024">ES2024</Option>
                        <Option value="2023">ES2023</Option>
                        <Option value="2022">ES2022</Option>
                        <Option value="2021">ES2021</Option>
                        <Option value="2020">ES2020</Option>
                        <Option value="2019">ES2019</Option>
                        <Option value="latest">latest</Option>
                      </Select>
                    </div>
                    <div>
                      <Text type="secondary" style={{ fontSize: 12 }}>Source Type</Text>
                      <Select value={sourceType} onChange={setSourceType} style={{ width: 120, display: 'block' }}>
                        <Option value="module">module (ESM)</Option>
                        <Option value="script">script (CommonJS)</Option>
                      </Select>
                    </div>
                  </Space>
                  <div style={{ marginTop: 12 }}>
                    <Checkbox checked={jsx} onChange={(e) => setJsx(e.target.checked)}>
                      启用 JSX 支持
                    </Checkbox>
                  </div>
                </div>

                <Divider />

                {/* 规则严格程度 */}
                <div>
                  <Text strong>规则严格程度</Text>
                  <Radio.Group value={rulePreset} onChange={(e) => setRulePreset(e.target.value)} style={{ marginTop: 8 }}>
                    <Space direction="vertical">
                      {Object.entries(RULE_PRESETS).map(([key, preset]) => (
                        <Radio key={key} value={key}>
                          <Text strong>{preset.label}</Text>
                          <Text type="secondary" style={{ marginLeft: 8 }}>{preset.desc}</Text>
                        </Radio>
                      ))}
                    </Space>
                  </Radio.Group>
                </div>

                <Divider />

                <Space>
                  <Button type="primary" icon={<CheckCircleOutlined />} onClick={generateConfig}>
                    生成配置
                  </Button>
                  <Button icon={<ClearOutlined />} onClick={clearAll}>
                    重置
                  </Button>
                </Space>
              </Space>
            </Card>
          </Col>

          <Col span={12}>
            <Card
              title="生成的 ESLint 配置"
              extra={
                <Button icon={<CopyOutlined />} onClick={() => copyToClipboard(generatedConfig)}>
                  复制
                </Button>
              }
            >
              {generatedConfig ? (
                <Editor
                  height={600}
                  language="javascript"
                  value={generatedConfig}
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
              ) : (
                <div style={{ height: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#999' }}>
                  <Space direction="vertical" align="center">
                    <FileTextOutlined style={{ fontSize: 48 }} />
                    <Text type="secondary">点击「生成配置」按钮生成 ESLint 配置</Text>
                  </Space>
                </div>
              )}
            </Card>

            {generatedConfig && (
              <Card style={{ marginTop: 16 }} title="安装依赖命令">
                <pre style={{ background: '#f5f5f5', padding: 16, borderRadius: 4, overflow: 'auto' }}>
                  {(() => {
                    const lines = ['# 安装核心依赖', 'npm install --save-dev eslint', ''];
                    if (selectedExtends.some(e => e.includes('typescript'))) {
                      lines.push('# TypeScript 支持', 'npm install --save-dev @typescript-eslint/parser @typescript-eslint/eslint-plugin typescript', '');
                    }
                    if (selectedExtends.some(e => e.includes('react'))) {
                      lines.push('# React 支持', 'npm install --save-dev eslint-plugin-react eslint-plugin-react-hooks', '');
                    }
                    if (selectedExtends.some(e => e.includes('vue'))) {
                      lines.push('# Vue 支持', 'npm install --save-dev eslint-plugin-vue vue-eslint-parser', '');
                    }
                    if (selectedExtends.some(e => e.includes('prettier'))) {
                      lines.push('# Prettier 集成', 'npm install --save-dev prettier eslint-plugin-prettier eslint-config-prettier', '');
                    }
                    if (selectedExtends.some(e => e.includes('import'))) {
                      lines.push('# Import 插件', 'npm install --save-dev eslint-plugin-import', '');
                    }
                    if (selectedExtends.some(e => e.includes('security'))) {
                      lines.push('# 安全规则', 'npm install --save-dev eslint-plugin-security', '');
                    }
                    if (selectedExtends.some(e => e.includes('node'))) {
                      lines.push('# Node.js 规则', 'npm install --save-dev eslint-plugin-node', '');
                    }
                    lines.push('# 保存配置到 .eslintrc.js');
                    return lines.join('\n');
                  })()}
                </pre>
                <Button
                  icon={<CopyOutlined />}
                  onClick={() => {
                    const deps = [];
                    deps.push('eslint');
                    if (selectedExtends.some(e => e.includes('typescript'))) {
                      deps.push('@typescript-eslint/parser', '@typescript-eslint/eslint-plugin', 'typescript');
                    }
                    if (selectedExtends.some(e => e.includes('react'))) {
                      deps.push('eslint-plugin-react', 'eslint-plugin-react-hooks');
                    }
                    if (selectedExtends.some(e => e.includes('vue'))) {
                      deps.push('eslint-plugin-vue', 'vue-eslint-parser');
                    }
                    if (selectedExtends.some(e => e.includes('prettier'))) {
                      deps.push('prettier', 'eslint-plugin-prettier', 'eslint-config-prettier');
                    }
                    if (selectedExtends.some(e => e.includes('import'))) {
                      deps.push('eslint-plugin-import');
                    }
                    if (selectedExtends.some(e => e.includes('security'))) {
                      deps.push('eslint-plugin-security');
                    }
                    if (selectedExtends.some(e => e.includes('node'))) {
                      deps.push('eslint-plugin-node');
                    }
                    copyToClipboard(`npm install --save-dev ${deps.join(' ')}`);
                  }}
                >
                  复制安装命令
                </Button>
              </Card>
            )}
          </Col>
        </Row>
      </div>
    </>
  );
};

export default EslintConfigGenerator;
