import React, { useState, useCallback } from 'react';
import { Card, Row, Col, Select, Button, message, Typography, Space, Tabs, Input, Divider } from 'antd';
import { CopyOutlined, CodeOutlined, ClearOutlined, ThunderboltOutlined } from '@ant-design/icons';
import Editor from '@monaco-editor/react';
import { SEO, createToolJsonLd } from '@/components/SEO';

const { Title, Paragraph, Text } = Typography;
const { TextArea } = Input;
const { TabPane } = Tabs;

interface ParsedCurl {
  url: string;
  method: string;
  headers: Record<string, string>;
  body: string | null;
  queryParams: Record<string, string>;
}

const defaultCurl = `curl -X POST "https://api.example.com/users" \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer your-token-here" \\
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "age": 30
  }'`;

const parseCurl = (curlCommand: string): ParsedCurl | null => {
  try {
    const result: ParsedCurl = {
      url: '',
      method: 'GET',
      headers: {},
      body: null,
      queryParams: {},
    };

    // Remove line continuation characters and extra whitespace
    const cleaned = curlCommand
      .replace(/\\\s*\n/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();

    // Extract URL
    const urlMatch = cleaned.match(/curl\s+(?:-[Xx]\s+\w+\s+)?(?:-[A-Za-z]*\s+[^\s-]+\s+)*['"]?([^\s'"]+)['"]?/);
    if (urlMatch) {
      result.url = urlMatch[1].replace(/^['"]|['"]$/g, '');
    }

    // Extract method
    const methodMatch = cleaned.match(/-[Xx]\s+(['"]?)(\w+)\1/);
    if (methodMatch) {
      result.method = methodMatch[2].toUpperCase();
    }

    // Extract headers
    const headerRegex = /-[Hh]\s+(['"]?)([^:]+):\s*([^\1]+)\1/g;
    let headerMatch;
    while ((headerMatch = headerRegex.exec(cleaned)) !== null) {
      const key = headerMatch[2].trim();
      const value = headerMatch[3].trim();
      result.headers[key] = value;
    }

    // Extract body data
    const bodyMatch = cleaned.match(/-[Dd]\s+(['"])([\s\S]*?)\1/);
    if (bodyMatch) {
      result.body = bodyMatch[2];
    }

    // Parse query params from URL
    try {
      const urlObj = new URL(result.url);
      urlObj.searchParams.forEach((value, key) => {
        result.queryParams[key] = value;
      });
      // Remove query string from URL
      result.url = result.url.split('?')[0];
    } catch {
      // URL might be relative, ignore parsing error
    }

    return result;
  } catch (error) {
    return null;
  }
};

const generateAxios = (parsed: ParsedCurl): string => {
  const { url, method, headers, body } = parsed;
  const hasHeaders = Object.keys(headers).length > 0;
  const hasBody = body && method !== 'GET';

  let code = `import axios from 'axios';

const ${method.toLowerCase()}Data = async () => {\n`;

  if (hasBody) {
    code += `  const data = ${body};\n\n`;
  }

  code += `  try {\n`;
  code += `    const response = await axios({\n`;
  code += `      method: '${method.toLowerCase()}',\n`;
  code += `      url: '${url}',\n`;

  if (hasHeaders) {
    code += `      headers: {\n`;
    Object.entries(headers).forEach(([key, value]) => {
      code += `        '${key}': '${value}',\n`;
    });
    code += `      },\n`;
  }

  if (hasBody) {
    code += `      data: data,\n`;
  }

  code += `    });\n\n`;
  code += `    console.log(response.data);\n`;
  code += `    return response.data;\n`;
  code += `  } catch (error) {\n`;
  code += `    console.error('Request failed:', error);\n`;
  code += `    throw error;\n`;
  code += `  }\n`;
  code += `};\n\n`;
  code += `${method.toLowerCase()}Data();`;

  return code;
};

const generateFetch = (parsed: ParsedCurl): string => {
  const { url, method, headers, body } = parsed;
  const hasHeaders = Object.keys(headers).length > 0;
  const hasBody = body && method !== 'GET';

  let code = `const ${method.toLowerCase()}Data = async () => {\n`;

  if (hasBody) {
    code += `  const data = ${body};\n\n`;
  }

  code += `  try {\n`;
  code += `    const response = await fetch('${url}', {\n`;
  code += `      method: '${method}',\n`;

  if (hasHeaders) {
    code += `      headers: {\n`;
    Object.entries(headers).forEach(([key, value]) => {
      code += `        '${key}': '${value}',\n`;
    });
    code += `      },\n`;
  }

  if (hasBody) {
    code += `      body: JSON.stringify(data),\n`;
  }

  code += `    });\n\n`;
  code += `    if (!response.ok) {\n`;
  code += `      throw new Error(\`HTTP error! status: \${response.status}\`);\n`;
  code += `    }\n\n`;
  code += `    const result = await response.json();\n`;
  code += `    console.log(result);\n`;
  code += `    return result;\n`;
  code += `  } catch (error) {\n`;
  code += `    console.error('Request failed:', error);\n`;
  code += `    throw error;\n`;
  code += `  }\n`;
  code += `};\n\n`;
  code += `${method.toLowerCase()}Data();`;

  return code;
};

const generatePython = (parsed: ParsedCurl): string => {
  const { url, method, headers, body } = parsed;
  const hasHeaders = Object.keys(headers).length > 0;
  const hasBody = body && method !== 'GET';

  let code = `import requests\n\n`;
  code += `def ${method.lower()}_data():\n`;

  if (hasBody) {
    try {
      const jsonBody = JSON.parse(body);
      code += `    data = ${JSON.stringify(jsonBody, null, 4).replace(/"/g, "'").replace(/\n/g, '\n    ')}\n\n`;
    } catch {
      code += `    data = '''${body}'''\n\n`;
    }
  }

  code += `    url = '${url}'\n`;

  if (hasHeaders) {
    code += `    headers = {\n`;
    Object.entries(headers).forEach(([key, value]) => {
      code += `        '${key}': '${value}',\n`;
    });
    code += `    }\n`;
  }

  code += `\n    try:\n`;
  code += `        response = requests.${method.toLowerCase()}(\n`;
  code += `            url,\n`;

  if (hasHeaders) {
    code += `            headers=headers,\n`;
  }

  if (hasBody) {
    code += `            json=data,\n`;
  }

  code += `        )\n`;
  code += `        response.raise_for_status()\n`;
  code += `        print(response.json())\n`;
  code += `        return response.json()\n`;
  code += `    except requests.RequestException as e:\n`;
  code += `        print(f'Request failed: {e}')\n`;
  code += `        raise\n\n`;
  code += `if __name__ == '__main__':\n`;
  code += `    ${method.lower()}_data()`;

  return code;
};

const generateNode = (parsed: ParsedCurl): string => {
  const { url, method, headers, body } = parsed;
  const hasHeaders = Object.keys(headers).length > 0;
  const hasBody = body && method !== 'GET';

  let code = `const https = require('https');\n`;
  code += `const { URL } = require('url');\n\n`;
  code += `const ${method.toLowerCase()}Data = () => {\n`;
  code += `  return new Promise((resolve, reject) => {\n`;

  if (hasBody) {
    code += `    const data = ${body};\n`;
    code += `    const postData = JSON.stringify(data);\n\n`;
  }

  code += `    const url = new URL('${url}');\n`;
  code += `    const options = {\n`;
  code += `      hostname: url.hostname,\n`;
  code += `      port: url.port || 443,\n`;
  code += `      path: url.pathname + url.search,\n`;
  code += `      method: '${method}',\n`;

  if (hasHeaders) {
    code += `      headers: {\n`;
    Object.entries(headers).forEach(([key, value]) => {
      code += `        '${key}': '${value}',\n`;
    });
    if (hasBody) {
      code += `        'Content-Length': Buffer.byteLength(postData),\n`;
    }
    code += `      },\n`;
  }

  code += `    };\n\n`;
  code += `    const req = https.request(options, (res) => {\n`;
  code += `      let responseData = '';\n\n`;
  code += `      res.on('data', (chunk) => {\n`;
  code += `        responseData += chunk;\n`;
  code += `      });\n\n`;
  code += `      res.on('end', () => {\n`;
  code += `        try {\n`;
  code += `          const parsed = JSON.parse(responseData);\n`;
  code += `          console.log(parsed);\n`;
  code += `          resolve(parsed);\n`;
  code += `        } catch {\n`;
  code += `          console.log(responseData);\n`;
  code += `          resolve(responseData);\n`;
  code += `        }\n`;
  code += `      });\n`;
  code += `    });\n\n`;
  code += `    req.on('error', (error) => {\n`;
  code += `      console.error('Request failed:', error);\n`;
  code += `      reject(error);\n`;
  code += `    });\n\n`;

  if (hasBody) {
    code += `    req.write(postData);\n`;
  }

  code += `    req.end();\n`;
  code += `  });\n`;
  code += `};\n\n`;
  code += `${method.toLowerCase()}Data()\n`;
  code += `  .then(data => console.log('Success:', data))\n`;
  code += `  .catch(err => console.error('Error:', err));`;

  return code;
};

const CurlConvert: React.FC = () => {
  const [curlCommand, setCurlCommand] = useState(defaultCurl);
  const [activeTab, setActiveTab] = useState('axios');
  const [generatedCode, setGeneratedCode] = useState('');
  const [parsedInfo, setParsedInfo] = useState<ParsedCurl | null>(null);

  const seoConfig = {
    title: 'cURL 代码转换工具',
    description: '将 cURL 命令一键转换为 Axios、Fetch、Python requests、Node.js 代码，支持自动解析 URL、请求方法、请求头和请求体。',
    keywords: 'cURL转换,Axios代码生成,Fetch代码生成,Python requests,Node.js HTTP,API调试工具,代码生成器',
    jsonLd: createToolJsonLd(
      'cURL 代码转换工具',
      '将 cURL 命令转换为多种编程语言的 HTTP 请求代码',
      'https://yma16.cloud/tools/curl-convert',
      'DeveloperApplication'
    ),
  };

  const convertCode = useCallback(() => {
    const parsed = parseCurl(curlCommand);
    if (!parsed) {
      message.error('无法解析 cURL 命令，请检查格式');
      return;
    }

    setParsedInfo(parsed);

    let code = '';
    switch (activeTab) {
      case 'axios':
        code = generateAxios(parsed);
        break;
      case 'fetch':
        code = generateFetch(parsed);
        break;
      case 'python':
        code = generatePython(parsed);
        break;
      case 'node':
        code = generateNode(parsed);
        break;
      default:
        code = generateAxios(parsed);
    }

    setGeneratedCode(code);
    message.success('代码生成成功！');
  }, [curlCommand, activeTab]);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    message.success('已复制到剪贴板');
  };

  const clearCode = () => {
    setCurlCommand('');
    setGeneratedCode('');
    setParsedInfo(null);
  };

  const getLanguage = (tab: string): string => {
    switch (tab) {
      case 'axios':
      case 'fetch':
      case 'node':
        return 'javascript';
      case 'python':
        return 'python';
      default:
        return 'javascript';
    }
  };

  return (
    <>
      <SEO {...seoConfig} />
      <div>
        <Title level={2}>
          <ThunderboltOutlined /> cURL 代码转换
        </Title>
        <Paragraph type="secondary">
          将 cURL 命令一键转换为 Axios、Fetch、Python requests、Node.js 代码
        </Paragraph>

        <Card style={{ marginBottom: 24 }}>
          <Space style={{ marginBottom: 16 }}>
            <Button type="primary" icon={<CodeOutlined />} onClick={convertCode}>
              生成代码
            </Button>
            <Button icon={<ClearOutlined />} onClick={clearCode}>
              清空
            </Button>
          </Space>

          <TextArea
            rows={8}
            value={curlCommand}
            onChange={(e) => setCurlCommand(e.target.value)}
            placeholder="粘贴 cURL 命令 here..."
            style={{ fontFamily: 'monospace', fontSize: 14 }}
          />
        </Card>

        {parsedInfo && (
          <Card style={{ marginBottom: 24 }} title="解析信息">
            <Space direction="vertical" style={{ width: '100%' }}>
              <div>
                <Text strong>请求方法: </Text>
                <Text code>{parsedInfo.method}</Text>
              </div>
              <div>
                <Text strong>请求 URL: </Text>
                <Text code>{parsedInfo.url}</Text>
              </div>
              {Object.keys(parsedInfo.headers).length > 0 && (
                <div>
                  <Text strong>请求头:</Text>
                  <ul>
                    {Object.entries(parsedInfo.headers).map(([key, value]) => (
                      <li key={key}>
                        <Text code>{key}</Text>: <Text>{value}</Text>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {parsedInfo.body && (
                <div>
                  <Text strong>请求体:</Text>
                  <pre style={{ background: '#f5f5f5', padding: 12, borderRadius: 4 }}>
                    {parsedInfo.body}
                  </pre>
                </div>
              )}
            </Space>
          </Card>
        )}

        <Card>
          <Tabs activeKey={activeTab} onChange={setActiveTab}>
            <TabPane tab="Axios" key="axios">
              <Row gutter={24}>
                <Col span={24}>
                  <Card
                    title="生成的 Axios 代码"
                    extra={
                      <Button icon={<CopyOutlined />} onClick={() => copyToClipboard(generatedCode)}>
                        复制
                      </Button>
                    }
                  >
                    <Editor
                      height={500}
                      language="javascript"
                      value={generatedCode}
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
            </TabPane>
            <TabPane tab="Fetch" key="fetch">
              <Row gutter={24}>
                <Col span={24}>
                  <Card
                    title="生成的 Fetch 代码"
                    extra={
                      <Button icon={<CopyOutlined />} onClick={() => copyToClipboard(generatedCode)}>
                        复制
                      </Button>
                    }
                  >
                    <Editor
                      height={500}
                      language="javascript"
                      value={generatedCode}
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
            </TabPane>
            <TabPane tab="Python" key="python">
              <Row gutter={24}>
                <Col span={24}>
                  <Card
                    title="生成的 Python 代码"
                    extra={
                      <Button icon={<CopyOutlined />} onClick={() => copyToClipboard(generatedCode)}>
                        复制
                      </Button>
                    }
                  >
                    <Editor
                      height={500}
                      language="python"
                      value={generatedCode}
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
            </TabPane>
            <TabPane tab="Node.js" key="node">
              <Row gutter={24}>
                <Col span={24}>
                  <Card
                    title="生成的 Node.js 代码"
                    extra={
                      <Button icon={<CopyOutlined />} onClick={() => copyToClipboard(generatedCode)}>
                        复制
                      </Button>
                    }
                  >
                    <Editor
                      height={500}
                      language="javascript"
                      value={generatedCode}
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
            </TabPane>
          </Tabs>
        </Card>
      </div>
    </>
  );
};

export default CurlConvert;
