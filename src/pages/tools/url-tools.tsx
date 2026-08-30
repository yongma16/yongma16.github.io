import React, { useState, useCallback, useEffect } from 'react';
import { Card, Row, Col, Button, message, Typography, Space, Tabs, Table, Tag, Switch, Input, Divider, Alert } from 'antd';
import { CopyOutlined, ClearOutlined, LinkOutlined, UnlockOutlined, LockOutlined, GlobalOutlined } from '@ant-design/icons';

const { Title, Paragraph, Text } = Typography;
const { TextArea } = Input;

interface ParsedParam {
  key: string;
  value: string;
  decodedKey: string;
  decodedValue: string;
}

interface UrlParseResult {
  protocol: string;
  hostname: string;
  port: string;
  pathname: string;
  search: string;
  hash: string;
  username: string;
  password: string;
}

const defaultUrl = 'https://example.com:8080/path/to/page?name=John%20Doe&age=25&tags=react%2Ctypescript#section-1';

const UrlTools: React.FC = () => {
  const [inputUrl, setInputUrl] = useState(defaultUrl);
  const [encodedUrl, setEncodedUrl] = useState('');
  const [decodedUrl, setDecodedUrl] = useState('');
  const [parsedParams, setParsedParams] = useState<ParsedParam[]>([]);
  const [hashParams, setHashParams] = useState<ParsedParam[]>([]);
  const [urlParts, setUrlParts] = useState<UrlParseResult | null>(null);
  const [autoDecode, setAutoDecode] = useState(true);
  const [activeTab, setActiveTab] = useState('encode');

  // 解析 URL
  const parseUrl = useCallback((url: string) => {
    try {
      const urlObj = new URL(url);
      setUrlParts({
        protocol: urlObj.protocol,
        hostname: urlObj.hostname,
        port: urlObj.port,
        pathname: urlObj.pathname,
        search: urlObj.search,
        hash: urlObj.hash,
        username: urlObj.username,
        password: urlObj.password,
      });

      // 解析 search 参数
      const searchParams = new URLSearchParams(urlObj.search);
      const params: ParsedParam[] = [];
      searchParams.forEach((value, key) => {
        params.push({
          key,
          value,
          decodedKey: decodeURIComponent(key),
          decodedValue: decodeURIComponent(value),
        });
      });
      setParsedParams(params);

      // 解析 hash 参数 (支持 #/path?key=value 或 #key=value)
      const hashStr = urlObj.hash;
      const hashParamsList: ParsedParam[] = [];
      
      if (hashStr) {
        // 尝试从 hash 中提取查询参数
        // 支持格式: #/route?key=value 或 #key=value
        const hashQueryIndex = hashStr.indexOf('?');
        if (hashQueryIndex !== -1) {
          const hashQuery = hashStr.substring(hashQueryIndex + 1);
          const hashSearchParams = new URLSearchParams(hashQuery);
          hashSearchParams.forEach((value, key) => {
            hashParamsList.push({
              key,
              value,
              decodedKey: decodeURIComponent(key),
              decodedValue: decodeURIComponent(value),
            });
          });
        }
        
        // 也支持纯 hash 参数格式 #key=value&key2=value2
        if (hashParamsList.length === 0 && hashStr.includes('=')) {
          const cleanHash = hashStr.startsWith('#') ? hashStr.slice(1) : hashStr;
          // 如果包含 / 路径，跳过路径部分
          const queryStart = cleanHash.indexOf('?');
          const hashToParse = queryStart !== -1 ? cleanHash.slice(queryStart + 1) : cleanHash;
          
          if (hashToParse.includes('=')) {
            const hashSearchParams = new URLSearchParams(hashToParse);
            hashSearchParams.forEach((value, key) => {
              hashParamsList.push({
                key,
                value,
                decodedKey: decodeURIComponent(key),
                decodedValue: decodeURIComponent(value),
              });
            });
          }
        }
      }
      setHashParams(hashParamsList);

      return true;
    } catch (error) {
      setUrlParts(null);
      setParsedParams([]);
      setHashParams([]);
      return false;
    }
  }, []);

  // 编码
  const handleEncode = useCallback(() => {
    try {
      const encoded = encodeURIComponent(inputUrl);
      setEncodedUrl(encoded);
      message.success('URL 编码完成');
    } catch (error) {
      message.error('编码失败：' + (error as Error).message);
    }
  }, [inputUrl]);

  // 解码
  const handleDecode = useCallback(() => {
    try {
      let toDecode = inputUrl;
      // 如果输入的是编码后的 URL，尝试解码
      if (toDecode.includes('%')) {
        const decoded = decodeURIComponent(toDecode);
        setDecodedUrl(decoded);
        
        // 如果解码后是完整 URL，自动解析
        if (autoDecode && (decoded.startsWith('http://') || decoded.startsWith('https://'))) {
          parseUrl(decoded);
        }
        message.success('URL 解码完成');
      } else {
        message.info('输入的 URL 似乎未编码');
        setDecodedUrl(toDecode);
        parseUrl(toDecode);
      }
    } catch (error) {
      message.error('解码失败：' + (error as Error).message);
    }
  }, [inputUrl, autoDecode, parseUrl]);

  // 自动解析输入的 URL
  useEffect(() => {
    if (inputUrl && (inputUrl.startsWith('http://') || inputUrl.startsWith('https://'))) {
      parseUrl(inputUrl);
    }
  }, [inputUrl, parseUrl]);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    message.success('已复制到剪贴板');
  };

  const clearAll = () => {
    setInputUrl('');
    setEncodedUrl('');
    setDecodedUrl('');
    setParsedParams([]);
    setHashParams([]);
    setUrlParts(null);
  };

  const paramColumns = [
    {
      title: '参数名 (原始)',
      dataIndex: 'key',
      key: 'key',
      render: (text: string) => <code>{text}</code>,
    },
    {
      title: '参数值 (原始)',
      dataIndex: 'value',
      key: 'value',
      render: (text: string) => <code>{text}</code>,
    },
    {
      title: '参数名 (解码)',
      dataIndex: 'decodedKey',
      key: 'decodedKey',
      render: (text: string) => <Text type="success"><code>{text}</code></Text>,
    },
    {
      title: '参数值 (解码)',
      dataIndex: 'decodedValue',
      key: 'decodedValue',
      render: (text: string) => <Text type="success"><code>{text}</code></Text>,
    },
  ];

  const urlPartItems = urlParts ? [
    { label: '协议', value: urlParts.protocol, color: 'blue' },
    { label: '主机名', value: urlParts.hostname, color: 'green' },
    { label: '端口', value: urlParts.port || '(默认)', color: 'orange' },
    { label: '路径', value: urlParts.pathname, color: 'purple' },
    { label: '查询字符串', value: urlParts.search || '(无)', color: 'cyan' },
    { label: 'Hash', value: urlParts.hash || '(无)', color: 'magenta' },
    ...(urlParts.username ? [{ label: '用户名', value: urlParts.username, color: 'red' }] : []),
    ...(urlParts.password ? [{ label: '密码', value: '******', color: 'red' }] : []),
  ] : [];

  const tabItems = [
    {
      key: 'encode',
      label: 'URL 编码',
      children: (
        <Space direction="vertical" style={{ width: '100%' }} size="large">
          <Card title="编码结果">
            <TextArea
              value={encodedUrl}
              readOnly
              rows={6}
              placeholder="编码后的 URL 将显示在这里"
            />
            <Button
              type="primary"
              icon={<CopyOutlined />}
              onClick={() => copyToClipboard(encodedUrl)}
              disabled={!encodedUrl}
              style={{ marginTop: 12 }}
            >
              复制编码结果
            </Button>
          </Card>
        </Space>
      ),
    },
    {
      key: 'decode',
      label: 'URL 解码',
      children: (
        <Space direction="vertical" style={{ width: '100%' }} size="large">
          <Card title="解码结果">
            <TextArea
              value={decodedUrl}
              readOnly
              rows={6}
              placeholder="解码后的 URL 将显示在这里"
            />
            <Button
              type="primary"
              icon={<CopyOutlined />}
              onClick={() => copyToClipboard(decodedUrl)}
              disabled={!decodedUrl}
              style={{ marginTop: 12 }}
            >
              复制解码结果
            </Button>
          </Card>
        </Space>
      ),
    },
    {
      key: 'parse',
      label: '参数解析',
      children: (
        <Space direction="vertical" style={{ width: '100%' }} size="large">
          {urlParts && (
            <Card title="URL 结构解析">
              <Row gutter={[16, 16]}>
                {urlPartItems.map((item) => (
                  <Col span={12} key={item.label}>
                    <Card size="small">
                      <Text type="secondary">{item.label}:</Text>
                      <br />
                      <Tag color={item.color}>{item.value}</Tag>
                    </Card>
                  </Col>
                ))}
              </Row>
            </Card>
          )}

          {parsedParams.length > 0 && (
            <Card title={`Search 参数 (${parsedParams.length}个)`}>
              <Table
                dataSource={parsedParams}
                columns={paramColumns}
                rowKey="key"
                size="small"
                pagination={false}
              />
            </Card>
          )}

          {hashParams.length > 0 && (
            <Card title={`Hash 参数 (${hashParams.length}个)`}>
              <Alert
                message="检测到 Hash 路由参数"
                description="URL 中包含 # 后的查询参数，常见于前端路由框架"
                type="info"
                showIcon
                style={{ marginBottom: 16 }}
              />
              <Table
                dataSource={hashParams}
                columns={paramColumns}
                rowKey="key"
                size="small"
                pagination={false}
              />
            </Card>
          )}

          {parsedParams.length === 0 && hashParams.length === 0 && (
            <Alert
              message="暂无参数"
              description="输入包含查询参数的 URL 后将自动解析"
              type="info"
              showIcon
            />
          )}
        </Space>
      ),
    },
  ];

  return (
    <div>
      <Title level={2}>
        <GlobalOutlined /> URL 编解码工具
      </Title>
      <Paragraph type="secondary">
        URL 编码/解码、查询参数解析、Hash 路由参数识别，支持二次操作场景
      </Paragraph>

      <Card style={{ marginBottom: 24 }}>
        <Space direction="vertical" style={{ width: '100%' }}>
          <Text strong>输入 URL：</Text>
          <TextArea
            value={inputUrl}
            onChange={(e) => setInputUrl(e.target.value)}
            rows={4}
            placeholder="请输入要处理的 URL，支持自动解析查询参数和 Hash 参数"
          />
          <Space>
            <Button type="primary" icon={<LockOutlined />} onClick={handleEncode}>
              编码
            </Button>
            <Button type="primary" icon={<UnlockOutlined />} onClick={handleDecode}>
              解码
            </Button>
            <Button icon={<ClearOutlined />} onClick={clearAll}>
              清空
            </Button>
            <Switch
              checked={autoDecode}
              onChange={setAutoDecode}
              checkedChildren="自动解析"
              unCheckedChildren="手动解析"
            />
          </Space>
        </Space>
      </Card>

      <Tabs
        activeKey={activeTab}
        onChange={setActiveTab}
        items={tabItems}
      />

      <Divider />

      <Card title="使用说明" size="small">
        <Space direction="vertical">
          <Text>1. <Text strong>编码：</Text>将完整 URL 进行 encodeURIComponent 编码</Text>
          <Text>2. <Text strong>解码：</Text>将编码后的 URL 进行 decodeURIComponent 解码</Text>
          <Text>3. <Text strong>参数解析：</Text>自动识别 ?key=value 格式的查询参数</Text>
          <Text>4. <Text strong>Hash 参数：</Text>支持识别 #/route?key=value 或 #key=value 格式的 Hash 路由参数</Text>
          <Text>5. <Text strong>二次操作：</Text>解码后的 URL 如包含查询参数，自动触发参数解析</Text>
        </Space>
      </Card>
    </div>
  );
};

export default UrlTools;
