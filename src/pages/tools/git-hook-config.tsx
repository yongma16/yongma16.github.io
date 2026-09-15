import React, { useState, useCallback } from 'react';
import { Card, Row, Col, Button, message, Typography, Space, Checkbox, Tabs, Tag, Steps, Alert, Divider } from 'antd';
import { CopyOutlined, FileTextOutlined, CheckCircleOutlined, CodeOutlined, BranchesOutlined, SafetyOutlined } from '@ant-design/icons';
import Editor from '@monaco-editor/react';
import { SEO, createToolJsonLd } from '@/components/SEO';
import { useTheme } from '@/contexts/ThemeContext';

const { Title, Paragraph, Text } = Typography;

interface HookConfig {
  preCommit: boolean;
  commitMsg: boolean;
  prePush: boolean;
  preCommitLint: boolean;
  lintStaged: boolean;
  commitlint: boolean;
  commitlintConfig: 'angular' | 'conventional' | 'custom';
  packageManager: 'npm' | 'yarn' | 'pnpm';
  eslint: boolean;
  prettier: boolean;
  stylelint: boolean;
  test: boolean;
  typescript: boolean;
}

const DEFAULT_CONFIG: HookConfig = {
  preCommit: true,
  commitMsg: true,
  prePush: false,
  preCommitLint: true,
  lintStaged: true,
  commitlint: true,
  commitlintConfig: 'conventional',
  packageManager: 'npm',
  eslint: true,
  prettier: true,
  stylelint: false,
  test: false,
  typescript: true,
};

const GitHookConfig: React.FC = () => {
  const { isDark } = useTheme();
  const [config, setConfig] = useState<HookConfig>(DEFAULT_CONFIG);
  const [activeTab, setActiveTab] = useState('package');

  const seoConfig = {
    title: 'Git Hook / Husky 配置生成器',
    description: '一键生成 Husky、lint-staged、commitlint 配置代码，复制直接粘贴到项目使用，支持多种规范预设。',
    keywords: 'Husky配置,Git Hook,commitlint,lint-staged,代码提交规范,Git钩子配置',
    jsonLd: createToolJsonLd('Git Hook / Husky 配置生成器', '一键生成 Husky、commitlint、lint-staged 配置代码', 'https://yma16.cloud/tools/git-hook-config', 'DeveloperApplication'),
  };

  const updateConfig = useCallback((key: keyof HookConfig, value: any) => {
    setConfig(prev => ({ ...prev, [key]: value }));
  }, []);

  const getPackageJson = () => {
    const devDeps: Record<string, string> = {};
    
    devDeps['husky'] = '^9.0.0';
    
    if (config.lintStaged) {
      devDeps['lint-staged'] = '^15.0.0';
    }
    if (config.commitlint) {
      devDeps['@commitlint/cli'] = '^19.0.0';
      devDeps['@commitlint/config-conventional'] = '^19.0.0';
    }
    if (config.eslint) {
      devDeps['eslint'] = '^8.0.0';
    }
    if (config.prettier) {
      devDeps['prettier'] = '^3.0.0';
    }
    if (config.stylelint) {
      devDeps['stylelint'] = '^16.0.0';
    }
    if (config.typescript && config.eslint) {
      devDeps['@typescript-eslint/eslint-plugin'] = '^7.0.0';
      devDeps['@typescript-eslint/parser'] = '^7.0.0';
    }

    const scripts: Record<string, string> = {
      prepare: 'husky',
    };

    if (config.lintStaged) {
      scripts['lint-staged'] = 'lint-staged';
    }

    const lintStagedConfig: Record<string, string[]> = {};
    if (config.eslint && config.prettier) {
      lintStagedConfig['*.{js,jsx,ts,tsx}'] = ['eslint --fix', 'prettier --write'];
    } else if (config.eslint) {
      lintStagedConfig['*.{js,jsx,ts,tsx}'] = ['eslint --fix'];
    } else if (config.prettier) {
      lintStagedConfig['*.{js,jsx,ts,tsx}'] = ['prettier --write'];
    }
    if (config.prettier) {
      lintStagedConfig['*.{json,md,yml,yaml}'] = ['prettier --write'];
    }
    if (config.stylelint) {
      lintStagedConfig['*.{css,scss,less}'] = ['stylelint --fix'];
    }

    const packageJson: any = {
      devDependencies: devDeps,
      scripts,
    };

    if (config.lintStaged && Object.keys(lintStagedConfig).length > 0) {
      packageJson['lint-staged'] = lintStagedConfig;
    }

    return JSON.stringify(packageJson, null, 2);
  };

  const getInstallCommand = () => {
    const deps: string[] = ['husky'];
    
    if (config.lintStaged) deps.push('lint-staged');
    if (config.commitlint) {
      deps.push('@commitlint/cli');
      deps.push('@commitlint/config-conventional');
    }
    if (config.eslint) deps.push('eslint');
    if (config.prettier) deps.push('prettier');
    if (config.stylelint) deps.push('stylelint');
    if (config.typescript && config.eslint) {
      deps.push('@typescript-eslint/eslint-plugin');
      deps.push('@typescript-eslint/parser');
    }

    const cmd = config.packageManager === 'yarn' ? 'yarn add -D' : 
                config.packageManager === 'pnpm' ? 'pnpm add -D' : 'npm install -D';
    
    return `${cmd} ${deps.join(' ')}`;
  };

  const getHuskyScripts = () => {
    const scripts: string[] = [];
    
    if (config.preCommit) {
      let hook = '#!/bin/sh\n. "$(dirname "$0")/_/husky.sh"\n\n';
      if (config.lintStaged && config.preCommitLint) {
        hook += 'npx lint-staged\n';
      }
      if (config.test) {
        hook += 'npm test\n';
      }
      scripts.push(`// .husky/pre-commit\n${hook}`);
    }

    if (config.commitMsg && config.commitlint) {
      const hook = '#!/bin/sh\n. "$(dirname "$0")/_/husky.sh"\n\nnpx --no -- commitlint --edit ${1}\n';
      scripts.push(`// .husky/commit-msg\n${hook}`);
    }

    if (config.prePush) {
      const hook = '#!/bin/sh\n. "$(dirname "$0")/_/husky.sh"\n\nnpm run build\n';
      scripts.push(`// .husky/pre-push\n${hook}`);
    }

    return scripts.join('\n\n---\n\n');
  };

  const getCommitlintConfig = () => {
    if (!config.commitlint) return '';

    const configs: Record<string, string> = {
      conventional: `module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [2, 'always', [
      'feat',      // 新功能
      'fix',       // 修复
      'docs',      // 文档
      'style',     // 格式
      'refactor',  // 重构
      'perf',      // 性能
      'test',      // 测试
      'chore',     // 构建
      'ci',        // CI
      'revert',    // 回滚
      'build',     // 依赖
    ]],
    'type-case': [2, 'always', 'lower-case'],
    'type-empty': [2, 'never'],
    'scope-case': [2, 'always', 'lower-case'],
    'subject-empty': [2, 'never'],
    'subject-full-stop': [2, 'never', '.'],
    'header-max-length': [2, 'always', 72],
  },
};`,
      angular: `module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [2, 'always', [
      'build',
      'ci',
      'docs',
      'feat',
      'fix',
      'perf',
      'refactor',
      'revert',
      'style',
      'test',
    ]],
    'scope-enum': [0], // 可选 scope
    'subject-case': [2, 'always', 'sentence-case'],
  },
};`,
      custom: `module.exports = {
  extends: ['@commitlint/config-conventional'],
  // 自定义规则
  rules: {
    'type-enum': [2, 'always', [
      'feat', 'fix', 'docs', 'style', 
      'refactor', 'perf', 'test', 'chore'
    ]],
    'scope-empty': [0],      // scope 可选
    'subject-min-length': [2, 'always', 4],
    'subject-max-length': [2, 'always', 100],
    'body-max-line-length': [0],
    'footer-max-line-length': [0],
  },
};`,
    };

    return configs[config.commitlintConfig] || configs.conventional;
  };

  const getSetupSteps = () => {
    const steps = [
      {
        title: '安装依赖',
        code: getInstallCommand(),
      },
      {
        title: '初始化 Husky',
        code: 'npx husky init',
      },
    ];

    if (config.lintStaged) {
      steps.push({
        title: '配置 lint-staged',
        code: `// 在 package.json 中添加\n${getPackageJson()}`,
      });
    }

    if (config.commitlint) {
      steps.push({
        title: '配置 commitlint',
        code: `// commitlint.config.js\n${getCommitlintConfig()}`,
      });
    }

    steps.push({
      title: '配置 Git Hooks',
      code: getHuskyScripts(),
    });

    return steps;
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      message.success('已复制到剪贴板');
    });
  };

  const editorTheme = isDark ? 'vs-dark' : 'light';

  const tabItems = [
    {
      key: 'package',
      label: 'package.json 配置',
      children: (
        <Card>
          <Space direction="vertical" style={{ width: '100%' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Text strong>package.json 片段</Text>
              <Button icon={<CopyOutlined />} onClick={() => copyToClipboard(getPackageJson())}>
                复制
              </Button>
            </div>
            <Editor
              height={400}
              language="json"
              value={getPackageJson()}
              theme={editorTheme}
              options={{ readOnly: true, minimap: { enabled: false } }}
            />
          </Space>
        </Card>
      ),
    },
    {
      key: 'install',
      label: '安装命令',
      children: (
        <Card>
          <Space direction="vertical" style={{ width: '100%' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Text strong>安装命令</Text>
              <Button icon={<CopyOutlined />} onClick={() => copyToClipboard(getInstallCommand())}>
                复制
              </Button>
            </div>
            <Editor
              height={100}
              language="bash"
              value={getInstallCommand()}
              theme={editorTheme}
              options={{ readOnly: true, minimap: { enabled: false } }}
            />
            <Alert
              message="提示"
              description="执行安装命令后，运行 npx husky init 初始化 husky 配置目录"
              type="info"
              showIcon
            />
          </Space>
        </Card>
      ),
    },
    {
      key: 'hooks',
      label: 'Git Hooks',
      children: (
        <Card>
          <Space direction="vertical" style={{ width: '100%' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Text strong>Hook 脚本</Text>
              <Button icon={<CopyOutlined />} onClick={() => copyToClipboard(getHuskyScripts())}>
                复制
              </Button>
            </div>
            <Editor
              height={400}
              language="shell"
              value={getHuskyScripts()}
              theme={editorTheme}
              options={{ readOnly: true, minimap: { enabled: false } }}
            />
          </Space>
        </Card>
      ),
    },
    {
      key: 'commitlint',
      label: 'Commitlint 配置',
      children: (
        <Card>
          <Space direction="vertical" style={{ width: '100%' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Text strong>commitlint.config.js</Text>
              <Button icon={<CopyOutlined />} onClick={() => copyToClipboard(getCommitlintConfig())}>
                复制
              </Button>
            </div>
            <Editor
              height={500}
              language="javascript"
              value={getCommitlintConfig()}
              theme={editorTheme}
              options={{ readOnly: true, minimap: { enabled: false } }}
            />
          </Space>
        </Card>
      ),
    },
    {
      key: 'guide',
      label: '完整指南',
      children: (
        <Card>
          <Steps direction="vertical" current={-1}>
            {getSetupSteps().map((step, index) => (
              <Steps.Step
                key={index}
                title={step.title}
                description={
                  <div style={{ marginTop: 8 }}>
                    <Editor
                      height={Math.min(200 + step.code.split('\n').length * 20, 400)}
                      language={index === 0 ? 'bash' : index === 1 ? 'bash' : 'javascript'}
                      value={step.code}
                      theme={editorTheme}
                      options={{ readOnly: true, minimap: { enabled: false } }}
                    />
                    <Button
                      size="small"
                      icon={<CopyOutlined />}
                      onClick={() => copyToClipboard(step.code)}
                      style={{ marginTop: 8 }}
                    >
                      复制
                    </Button>
                  </div>
                }
              />
            ))}
          </Steps>
        </Card>
      ),
    },
  ];

  return (
    <>
      <SEO {...seoConfig} />
      <div style={{ padding: 24 }}>
        <Title level={2}><BranchesOutlined /> Git Hook / Husky 配置生成器</Title>
        <Text type="secondary">一键生成 Husky、lint-staged、commitlint 配置代码，复制直接粘贴到项目</Text>

        <Row gutter={24} style={{ marginTop: 24 }}>
          {/* 配置选项 */}
          <Col xs={24} lg={8}>
            <Card title="配置选项" style={{ marginBottom: 24 }}>
              <Space direction="vertical" style={{ width: '100%' }}>
                <Text strong><SafetyOutlined /> Git Hooks</Text>
                <Checkbox
                  checked={config.preCommit}
                  onChange={(e) => updateConfig('preCommit', e.target.checked)}
                >
                  pre-commit（提交前）
                </Checkbox>
                <Checkbox
                  checked={config.commitMsg}
                  onChange={(e) => updateConfig('commitMsg', e.target.checked)}
                >
                  commit-msg（提交信息检查）
                </Checkbox>
                <Checkbox
                  checked={config.prePush}
                  onChange={(e) => updateConfig('prePush', e.target.checked)}
                >
                  pre-push（推送前）
                </Checkbox>

                <Divider />

                <Text strong><CodeOutlined /> 代码检查</Text>
                <Checkbox
                  checked={config.lintStaged}
                  onChange={(e) => updateConfig('lintStaged', e.target.checked)}
                >
                  lint-staged（暂存区检查）
                </Checkbox>
                <Checkbox
                  checked={config.preCommitLint}
                  onChange={(e) => updateConfig('preCommitLint', e.target.checked)}
                  disabled={!config.preCommit || !config.lintStaged}
                >
                  提交前运行 lint-staged
                </Checkbox>
                <Checkbox
                  checked={config.commitlint}
                  onChange={(e) => updateConfig('commitlint', e.target.checked)}
                  disabled={!config.commitMsg}
                >
                  commitlint（提交信息规范）
                </Checkbox>

                <Divider />

                <Text strong><FileTextOutlined /> 检查工具</Text>
                <Checkbox
                  checked={config.eslint}
                  onChange={(e) => updateConfig('eslint', e.target.checked)}
                >
                  ESLint
                </Checkbox>
                <Checkbox
                  checked={config.prettier}
                  onChange={(e) => updateConfig('prettier', e.target.checked)}
                >
                  Prettier
                </Checkbox>
                <Checkbox
                  checked={config.stylelint}
                  onChange={(e) => updateConfig('stylelint', e.target.checked)}
                >
                  Stylelint
                </Checkbox>
                <Checkbox
                  checked={config.test}
                  onChange={(e) => updateConfig('test', e.target.checked)}
                >
                  运行测试
                </Checkbox>
                <Checkbox
                  checked={config.typescript}
                  onChange={(e) => updateConfig('typescript', e.target.checked)}
                >
                  TypeScript 项目
                </Checkbox>

                <Divider />

                <Text strong>包管理器</Text>
                <Space>
                  {(['npm', 'yarn', 'pnpm'] as const).map((pm) => (
                    <Tag
                      key={pm}
                      color={config.packageManager === pm ? 'blue' : 'default'}
                      style={{ cursor: 'pointer' }}
                      onClick={() => updateConfig('packageManager', pm)}
                    >
                      {pm}
                    </Tag>
                  ))}
                </Space>

                {config.commitlint && (
                  <>
                    <Divider />
                    <Text strong>Commitlint 规范</Text>
                    <Space direction="vertical">
                      {([
                        { key: 'conventional', label: 'Conventional Commits' },
                        { key: 'angular', label: 'Angular 规范' },
                        { key: 'custom', label: '自定义规则' },
                      ] as const).map((item) => (
                        <Tag
                          key={item.key}
                          color={config.commitlintConfig === item.key ? 'blue' : 'default'}
                          style={{ cursor: 'pointer' }}
                          onClick={() => updateConfig('commitlintConfig', item.key)}
                        >
                          {item.label}
                        </Tag>
                      ))}
                    </Space>
                  </>
                )}
              </Space>
            </Card>

            <Alert
              message="快速开始"
              description={
                <ol style={{ paddingLeft: 16, margin: 0 }}>
                  <li>选择需要的配置选项</li>
                  <li>复制安装命令执行</li>
                  <li>运行 npx husky init 初始化</li>
                  <li>复制生成的配置到项目</li>
                </ol>
              }
              type="info"
              showIcon
            />
          </Col>

          {/* 生成的配置 */}
          <Col xs={24} lg={16}>
            <Tabs activeKey={activeTab} onChange={setActiveTab} items={tabItems} />
          </Col>
        </Row>

        {/* 提交规范说明 */}
        {config.commitlint && (
          <Card style={{ marginTop: 24 }} title="提交信息规范">
            <Row gutter={24}>
              <Col xs={24} md={12}>
                <Text strong>格式：</Text>
                <pre style={{ background: isDark ? '#1f1f1f' : '#f6f8fa', padding: 12, borderRadius: 6 }}>
                  {`<type>(<scope>): <subject>

<body>

<footer>`}
                </pre>
              </Col>
              <Col xs={24} md={12}>
                <Text strong>示例：</Text>
                <pre style={{ background: isDark ? '#1f1f1f' : '#f6f8fa', padding: 12, borderRadius: 6 }}>
                  {`feat(user): 添加用户登录功能

实现基于 JWT 的用户认证系统，
支持邮箱和密码登录。

Closes #123`}
                </pre>
              </Col>
            </Row>
            <div style={{ marginTop: 16 }}>
              <Text strong>Type 类型：</Text>
              <Space wrap style={{ marginTop: 8 }}>
                {[
                  { type: 'feat', desc: '新功能' },
                  { type: 'fix', desc: '修复' },
                  { type: 'docs', desc: '文档' },
                  { type: 'style', desc: '格式' },
                  { type: 'refactor', desc: '重构' },
                  { type: 'perf', desc: '性能' },
                  { type: 'test', desc: '测试' },
                  { type: 'chore', desc: '构建' },
                  { type: 'ci', desc: 'CI配置' },
                  { type: 'revert', desc: '回滚' },
                ].map((item) => (
                  <Tag key={item.type} color="blue">{item.type}: {item.desc}</Tag>
                ))}
              </Space>
            </div>
          </Card>
        )}
      </div>
    </>
  );
};

export default GitHookConfig;
