import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Card, Button, Input, message, Typography, Space, Row, Col, Tabs, Switch, Slider, Tag, Divider, Alert } from 'antd';
import { PlayCircleOutlined, PauseCircleOutlined, ClearOutlined, CopyOutlined, BugOutlined, ApiOutlined, SafetyOutlined } from '@ant-design/icons';
import { SEO, createToolJsonLd } from '@/components/SEO';

const { Title, Text } = Typography;
const { TextArea } = Input;

// 模拟流式输出类型
type StreamMode = 'mock' | 'real';

interface DebugInfo {
  statusCode?: number;
  duration?: number;
  rawResponse?: string;
  error?: string;
}

const AiDebugTool: React.FC = () => {
  const [activeTab, setActiveTab] = useState<StreamMode>('mock');

  // Mock模式状态
  const [mockSystemPrompt, setMockSystemPrompt] = useState('你是一个有帮助的AI助手');
  const [mockUserPrompt, setMockUserPrompt] = useState('你好，请介绍一下自己');
  const [mockDelay, setMockDelay] = useState(50);
  const [mockContent, setMockContent] = useState('你好！我是一个AI助手，可以帮助你解答问题、生成内容、编写代码等。我支持多种语言，包括中文和英文。有什么我可以帮助你的吗？');
  const [mockOutput, setMockOutput] = useState('');
  const [isMockStreaming, setIsMockStreaming] = useState(false);
  const mockAbortRef = useRef(false);
  const mockTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Real API模式状态
  const [apiUrl, setApiUrl] = useState('https://api.openai.com/v1/chat/completions');
  const [apiKey, setApiKey] = useState(() => localStorage.getItem('ai-debug-apikey') || '');
  const [model, setModel] = useState('gpt-3.5-turbo');
  const [realSystemPrompt, setRealSystemPrompt] = useState('你是一个有帮助的AI助手');
  const [realUserPrompt, setRealUserPrompt] = useState('你好');
  const [useStream, setUseStream] = useState(true);
  const [realOutput, setRealOutput] = useState('');
  const [isRealStreaming, setIsRealStreaming] = useState(false);
  const [debugInfo, setDebugInfo] = useState<DebugInfo>({});
  const abortControllerRef = useRef<AbortController | null>(null);

  const seoConfig = {
    title: 'AI调试流式输出测试',
    description: 'AI调试流式输出测试工具，支持Mock模拟SSE流式和真实API请求调试，用于调试前端流式渲染UI效果。',
    keywords: 'AI调试,流式输出,SSE测试,Mock流式,API调试,LLM调试,流式渲染测试',
    jsonLd: createToolJsonLd('AI调试流式输出测试', 'AI流式输出调试工具', 'https://yma16.cloud/tools/ai-debug', 'DeveloperApplication'),
  };

  // 保存apiKey到localStorage
  useEffect(() => {
    if (apiKey) {
      localStorage.setItem('ai-debug-apikey', apiKey);
    }
  }, [apiKey]);

  // Mock流式输出
  const startMockStream = useCallback(() => {
    if (isMockStreaming) return;

    setMockOutput('');
    setIsMockStreaming(true);
    mockAbortRef.current = false;

    let index = 0;
    const content = mockContent;

    const streamNext = () => {
      if (mockAbortRef.current || index >= content.length) {
        setIsMockStreaming(false);
        return;
      }

      // 每次输出1-3个字符，模拟真实流式
      const chunkSize = Math.floor(Math.random() * 3) + 1;
      const chunk = content.slice(index, index + chunkSize);
      index += chunkSize;

      setMockOutput(prev => prev + chunk);

      mockTimerRef.current = setTimeout(streamNext, mockDelay);
    };

    streamNext();
  }, [mockContent, mockDelay, isMockStreaming]);

  const stopMockStream = () => {
    mockAbortRef.current = true;
    if (mockTimerRef.current) {
      clearTimeout(mockTimerRef.current);
    }
    setIsMockStreaming(false);
  };

  // 真实API请求
  const startRealStream = useCallback(async () => {
    if (isRealStreaming) return;
    if (!apiKey) {
      message.error('请输入API Key');
      return;
    }

    setRealOutput('');
    setDebugInfo({});
    setIsRealStreaming(true);

    const startTime = Date.now();
    abortControllerRef.current = new AbortController();

    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model,
          messages: [
            { role: 'system', content: realSystemPrompt },
            { role: 'user', content: realUserPrompt },
          ],
          stream: useStream,
        }),
        signal: abortControllerRef.current.signal,
      });

      const duration = Date.now() - startTime;

      if (!response.ok) {
        const errorText = await response.text();
        setDebugInfo({
          statusCode: response.status,
          duration,
          error: errorText,
        });
        message.error(`请求失败: ${response.status}`);
        setIsRealStreaming(false);
        return;
      }

      if (useStream) {
        // SSE流式处理
        const reader = response.body?.getReader();
        const decoder = new TextDecoder();
        let rawData = '';
        let fullContent = '';

        while (reader) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value, { stream: true });
          rawData += chunk;

          // 解析SSE数据
          const lines = chunk.split('\n');
          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const data = line.slice(6);
              if (data === '[DONE]') continue;

              try {
                const parsed = JSON.parse(data);
                const content = parsed.choices?.[0]?.delta?.content || '';
                if (content) {
                  fullContent += content;
                  setRealOutput(fullContent);
                }
              } catch (e) {
                // 忽略解析错误
              }
            }
          }
        }

        setDebugInfo({
          statusCode: response.status,
          duration: Date.now() - startTime,
          rawResponse: rawData.slice(0, 2000) + (rawData.length > 2000 ? '...' : ''),
        });
      } else {
        // 非流式处理
        const data = await response.json();
        const content = data.choices?.[0]?.message?.content || '';
        setRealOutput(content);

        setDebugInfo({
          statusCode: response.status,
          duration: Date.now() - startTime,
          rawResponse: JSON.stringify(data, null, 2).slice(0, 2000),
        });
      }
    } catch (error: any) {
      if (error.name === 'AbortError') {
        message.info('请求已取消');
      } else {
        setDebugInfo({
          error: error.message,
          duration: Date.now() - startTime,
        });
        message.error(`请求错误: ${error.message}`);
      }
    } finally {
      setIsRealStreaming(false);
    }
  }, [apiUrl, apiKey, model, realSystemPrompt, realUserPrompt, useStream, isRealStreaming]);

  const stopRealStream = () => {
    abortControllerRef.current?.abort();
    setIsRealStreaming(false);
  };

  const copyOutput = (text: string) => {
    navigator.clipboard.writeText(text);
    message.success('已复制到剪贴板');
  };

  // Markdown简单渲染
  const renderMarkdown = (text: string): string => {
    return text
      .replace(/```(\w+)?\n([\s\S]*?)```/g, '<pre style="background:#f6f8fa;padding:12px;border-radius:6px;overflow:auto;"><code>$2</code></pre>')
      .replace(/`([^`]+)`/g, '<code style="background:#f6f8fa;padding:2px 6px;border-radius:3px;">$1</code>')
      .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
      .replace(/\*([^*]+)\*/g, '<em>$1</em>')
      .replace(/\n/g, '<br/>');
  };

  return (
    <>
      <SEO {...seoConfig} />
      <div style={{ padding: 24 }}>
        <Title level={2}>
          <BugOutlined /> AI调试流式输出测试
        </Title>
        <Text type="secondary">Mock模拟SSE流式 + 真实API请求调试</Text>

        <Tabs activeKey={activeTab} onChange={(key) => setActiveTab(key as StreamMode)} style={{ marginTop: 24 }}>
          {/* Mock流式模式 */}
          <Tabs.TabPane tab="Mock流式模拟" key="mock">
            <Row gutter={[24, 24]}>
              <Col xs={24} lg={12}>
                <Card title="配置">
                  <Space direction="vertical" style={{ width: '100%' }} size="middle">
                    <div>
                      <Text>系统提示词:</Text>
                      <Input
                        value={mockSystemPrompt}
                        onChange={(e) => setMockSystemPrompt(e.target.value)}
                        placeholder="系统提示词"
                      />
                    </div>
                    <div>
                      <Text>用户Prompt:</Text>
                      <TextArea
                        rows={3}
                        value={mockUserPrompt}
                        onChange={(e) => setMockUserPrompt(e.target.value)}
                        placeholder="用户输入内容"
                      />
                    </div>
                    <div>
                      <Text>输出延迟: {mockDelay}ms</Text>
                      <Slider min={10} max={500} step={10} value={mockDelay} onChange={setMockDelay} />
                    </div>
                    <div>
                      <Text>模拟返回内容:</Text>
                      <TextArea
                        rows={6}
                        value={mockContent}
                        onChange={(e) => setMockContent(e.target.value)}
                        placeholder="模拟AI返回的文本内容"
                      />
                    </div>
                    <Space>
                      <Button
                        type="primary"
                        icon={<PlayCircleOutlined />}
                        onClick={startMockStream}
                        disabled={isMockStreaming}
                      >
                        开始流式输出
                      </Button>
                      <Button
                        icon={<PauseCircleOutlined />}
                        onClick={stopMockStream}
                        disabled={!isMockStreaming}
                      >
                        停止
                      </Button>
                      <Button icon={<ClearOutlined />} onClick={() => setMockOutput('')}>
                        清空
                      </Button>
                      <Button icon={<CopyOutlined />} onClick={() => copyOutput(mockOutput)}>
                        复制
                      </Button>
                    </Space>
                  </Space>
                </Card>
              </Col>
              <Col xs={24} lg={12}>
                <Card
                  title="输出"
                  extra={isMockStreaming && <Tag color="processing">流式输出中...</Tag>}
                >
                  <div
                    style={{
                      minHeight: 400,
                      maxHeight: 600,
                      overflow: 'auto',
                      padding: 16,
                      background: '#f5f5f5',
                      borderRadius: 8,
                      fontFamily: 'monospace',
                      whiteSpace: 'pre-wrap',
                      wordBreak: 'break-word',
                    }}
                  >
                    {mockOutput || <Text type="secondary">点击开始按钮查看流式输出效果...</Text>}
                    {isMockStreaming && <span style={{ animation: 'blink 1s infinite' }}>|</span>}
                  </div>
                </Card>
              </Col>
            </Row>
          </Tabs.TabPane>

          {/* 真实API模式 */}
          <Tabs.TabPane tab="真实API请求" key="real">
            <Row gutter={[24, 24]}>
              <Col xs={24} lg={12}>
                <Card title="API配置">
                  <Space direction="vertical" style={{ width: '100%' }} size="middle">
                    <Alert
                      message="安全提示"
                      description="API Key仅保存在浏览器localStorage，不会上传到任何服务器"
                      type="warning"
                      showIcon
                      icon={<SafetyOutlined />}
                    />
                    <div>
                      <Text>接口地址:</Text>
                      <Input
                        value={apiUrl}
                        onChange={(e) => setApiUrl(e.target.value)}
                        placeholder="https://api.openai.com/v1/chat/completions"
                      />
                    </div>
                    <div>
                      <Text>API Key:</Text>
                      <Input.Password
                        value={apiKey}
                        onChange={(e) => setApiKey(e.target.value)}
                        placeholder="sk-..."
                      />
                    </div>
                    <div>
                      <Text>模型:</Text>
                      <Input
                        value={model}
                        onChange={(e) => setModel(e.target.value)}
                        placeholder="gpt-3.5-turbo"
                      />
                    </div>
                    <div>
                      <Space>
                        <Text>流式输出:</Text>
                        <Switch checked={useStream} onChange={setUseStream} />
                        <Tag color={useStream ? 'blue' : 'default'}>
                          {useStream ? 'SSE流式' : '一次性返回'}
                        </Tag>
                      </Space>
                    </div>
                    <Divider />
                    <div>
                      <Text>系统提示词:</Text>
                      <Input
                        value={realSystemPrompt}
                        onChange={(e) => setRealSystemPrompt(e.target.value)}
                        placeholder="系统提示词"
                      />
                    </div>
                    <div>
                      <Text>用户Prompt:</Text>
                      <TextArea
                        rows={3}
                        value={realUserPrompt}
                        onChange={(e) => setRealUserPrompt(e.target.value)}
                        placeholder="用户输入内容"
                      />
                    </div>
                    <Space>
                      <Button
                        type="primary"
                        icon={<ApiOutlined />}
                        onClick={startRealStream}
                        disabled={isRealStreaming}
                      >
                        发送请求
                      </Button>
                      <Button
                        icon={<PauseCircleOutlined />}
                        onClick={stopRealStream}
                        disabled={!isRealStreaming}
                      >
                        停止
                      </Button>
                      <Button icon={<ClearOutlined />} onClick={() => { setRealOutput(''); setDebugInfo({}); }}>
                        清空
                      </Button>
                      <Button icon={<CopyOutlined />} onClick={() => copyOutput(realOutput)}>
                        复制
                      </Button>
                    </Space>
                  </Space>
                </Card>
              </Col>
              <Col xs={24} lg={12}>
                <Card
                  title="输出"
                  extra={isRealStreaming && <Tag color="processing">请求中...</Tag>}
                >
                  <div
                    style={{
                      minHeight: 300,
                      maxHeight: 400,
                      overflow: 'auto',
                      padding: 16,
                      background: '#f5f5f5',
                      borderRadius: 8,
                      marginBottom: 16,
                    }}
                    dangerouslySetInnerHTML={{
                      __html: realOutput ? renderMarkdown(realOutput) : '<span style="color:#999">等待请求...</span>',
                    }}
                  />

                  {/* 调试信息 */}
                  {Object.keys(debugInfo).length > 0 && (
                    <Card size="small" title="调试信息" style={{ marginTop: 16 }}>
                      <Space direction="vertical" style={{ width: '100%' }}>
                        {debugInfo.statusCode && (
                          <Text>状态码: <Tag color={debugInfo.statusCode === 200 ? 'success' : 'error'}>{debugInfo.statusCode}</Tag></Text>
                        )}
                        {debugInfo.duration && (
                          <Text>耗时: {debugInfo.duration}ms</Text>
                        )}
                        {debugInfo.error && (
                          <Alert message="错误" description={debugInfo.error} type="error" />
                        )}
                        {debugInfo.rawResponse && (
                          <div>
                            <Text>原始响应:</Text>
                            <pre
                              style={{
                                background: '#f0f0f0',
                                padding: 8,
                                borderRadius: 4,
                                maxHeight: 150,
                                overflow: 'auto',
                                fontSize: 12,
                              }}
                            >
                              {debugInfo.rawResponse}
                            </pre>
                          </div>
                        )}
                      </Space>
                    </Card>
                  )}
                </Card>
              </Col>
            </Row>
          </Tabs.TabPane>
        </Tabs>
      </div>
    </>
  );
};

export default AiDebugTool;
