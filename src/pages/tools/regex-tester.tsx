import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Input, Button, Typography, Space, Tag, Checkbox, List, Divider } from 'antd';
import { CopyOutlined, PlayCircleOutlined, ClearOutlined, CheckCircleOutlined } from '@ant-design/icons';
import { SEO, createToolJsonLd } from '@/components/SEO';

const { Title, Text } = Typography;
const { TextArea } = Input;

const RegexTester: React.FC = () => {
  const [pattern, setPattern] = useState('[a-zA-Z]+');
  const [flags, setFlags] = useState({ g: true, i: false, m: false, s: false, u: false });
  const [testText, setTestText] = useState('Hello World! This is a test.\nAnother line here.');
  const [matches, setMatches] = useState<RegExpMatchArray[]>([]);
  const [error, setError] = useState('');
  const [highlightedText, setHighlightedText] = useState<React.ReactNode[]>([]);

  const seoConfig = {
    title: '正则表达式测试工具',
    description: '免费的在线正则表达式测试工具，支持实时匹配、高亮显示、分组捕获、多种修饰符，帮助调试和验证正则表达式。',
    keywords: '正则表达式测试,正则工具,Regex测试,正则匹配,在线正则,正则调试,正则表达式工具',
    jsonLd: createToolJsonLd(
      '正则表达式测试工具',
      '免费的在线正则表达式测试和调试工具',
      'https://yma16.cloud/tools/regex-tester',
      'DeveloperApplication'
    ),
  };

  const testRegex = () => {
    if (!pattern) {
      setError('请输入正则表达式');
      setMatches([]);
      setHighlightedText([]);
      return;
    }

    const flagStr = Object.entries(flags)
      .filter(([, v]) => v)
      .map(([k]) => k)
      .join('');

    try {
      const regex = new RegExp(pattern, flagStr);
      setError('');

      const allMatches: RegExpMatchArray[] = [];
      let match;

      if (flags.g) {
        while ((match = regex.exec(testText)) !== null) {
          allMatches.push([...match]);
          if (match.index === regex.lastIndex) {
            regex.lastIndex++;
          }
        }
      } else {
        match = regex.exec(testText);
        if (match) {
          allMatches.push([...match]);
        }
      }

      setMatches(allMatches);
      highlightMatches(allMatches);
    } catch (e) {
      setError('正则表达式语法错误: ' + (e as Error).message);
      setMatches([]);
      setHighlightedText([]);
    }
  };

  const highlightMatches = (matchResults: RegExpMatchArray[]) => {
    if (matchResults.length === 0) {
      setHighlightedText([<span key="0">{testText}</span>]);
      return;
    }

    const parts: React.ReactNode[] = [];
    let lastIndex = 0;

    matchResults.forEach((match, idx) => {
      const matchStart = testText.indexOf(match[0], lastIndex);
      const matchEnd = matchStart + match[0].length;

      if (matchStart > lastIndex) {
        parts.push(<span key={`text-${idx}`}>{testText.substring(lastIndex, matchStart)}</span>);
      }

      parts.push(
        <mark
          key={`match-${idx}`}
          style={{
            backgroundColor: '#ffd591',
            padding: '2px 4px',
            borderRadius: 4,
            fontWeight: 'bold',
          }}
          title={`Match ${idx + 1}`}
        >
          {match[0]}
        </mark>
      );

      lastIndex = matchEnd;
    });

    if (lastIndex < testText.length) {
      parts.push(<span key="text-end">{testText.substring(lastIndex)}</span>);
    }

    setHighlightedText(parts);
  };

  useEffect(() => {
    testRegex();
  }, []);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    message.success('已复制到剪贴板');
  };

  return (
    <>
      <SEO {...seoConfig} />
      <div style={{ padding: 24 }}>
        <Title level={2}>
          <CheckCircleOutlined /> 正则表达式测试
        </Title>
        <Text type="secondary">实时匹配、高亮显示、分组捕获</Text>

        <Row gutter={[24, 24]} style={{ marginTop: 24 }}>
          <Col span={24}>
            <Card title="正则表达式">
              <Space direction="vertical" style={{ width: '100%' }}>
                <Input.Group compact>
                  <span style={{ padding: '5px 10px', background: '#f5f5f5', border: '1px solid #d9d9d9', borderRight: 0, borderRadius: '6px 0 0 6px' }}>/</span>
                  <Input
                    style={{ width: 'calc(100% - 300px)' }}
                    value={pattern}
                    onChange={(e) => setPattern(e.target.value)}
                    placeholder="输入正则表达式"
                  />
                  <span style={{ padding: '5px 10px', background: '#f5f5f5', border: '1px solid #d9d9d9', borderLeft: 0, borderRight: 0 }}>/</span>
                  <Input
                    style={{ width: 100, borderRadius: 0 }}
                    value={Object.entries(flags).filter(([, v]) => v).map(([k]) => k).join('')}
                    readOnly
                  />
                  <Button type="primary" icon={<PlayCircleOutlined />} onClick={testRegex}>
                    测试
                  </Button>
                </Input.Group>

                <Space>
                  <Checkbox checked={flags.g} onChange={(e) => setFlags({ ...flags, g: e.target.checked })}>
                    g (全局)
                  </Checkbox>
                  <Checkbox checked={flags.i} onChange={(e) => setFlags({ ...flags, i: e.target.checked })}>
                    i (忽略大小写)
                  </Checkbox>
                  <Checkbox checked={flags.m} onChange={(e) => setFlags({ ...flags, m: e.target.checked })}>
                    m (多行)
                  </Checkbox>
                  <Checkbox checked={flags.s} onChange={(e) => setFlags({ ...flags, s: e.target.checked })}>
                    s (点匹配换行)
                  </Checkbox>
                  <Checkbox checked={flags.u} onChange={(e) => setFlags({ ...flags, u: e.target.checked })}>
                    u (Unicode)
                  </Checkbox>
                </Space>

                {error && (
                  <Tag color="red" style={{ marginTop: 8 }}>
                    {error}
                  </Tag>
                )}
              </Space>
            </Card>
          </Col>
        </Row>

        <Row gutter={[24, 24]} style={{ marginTop: 24 }}>
          <Col xs={24} lg={12}>
            <Card title="测试文本">
              <TextArea
                rows={10}
                value={testText}
                onChange={(e) => setTestText(e.target.value)}
                placeholder="输入要测试的文本..."
              />
              <Space style={{ marginTop: 16 }}>
                <Button icon={<CopyOutlined />} onClick={() => copyToClipboard(testText)}>
                  复制
                </Button>
                <Button icon={<ClearOutlined />} onClick={() => setTestText('')}>
                  清空
                </Button>
              </Space>
            </Card>
          </Col>

          <Col xs={24} lg={12}>
            <Card title="匹配结果">
              <div style={{ minHeight: 200, maxHeight: 300, overflow: 'auto', padding: 12, background: '#f5f5f5', borderRadius: 8, fontFamily: 'monospace', whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>
                {highlightedText}
              </div>

              <Divider />

              <Text strong>匹配详情 ({matches.length} 个匹配)</Text>
              <List
                size="small"
                dataSource={matches}
                renderItem={(match, idx) => (
                  <List.Item>
                    <Space direction="vertical" style={{ width: '100%' }}>
                      <Tag color="blue">匹配 {idx + 1}</Tag>
                      <Text code copyable>{match[0]}</Text>
                      {match.length > 1 && (
                        <div>
                          <Text type="secondary">分组:</Text>
                          <Space wrap>
                            {match.slice(1).map((group, gIdx) => (
                              <Tag key={gIdx} color="green">${gIdx + 1}: {group}</Tag>
                            ))}
                          </Space>
                        </div>
                      )}
                    </Space>
                  </List.Item>
                )}
                style={{ marginTop: 12, maxHeight: 200, overflow: 'auto' }}
              />
            </Card>
          </Col>
        </Row>
      </div>
    </>
  );
};

export default RegexTester;
