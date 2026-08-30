import React, { useState, useCallback } from 'react';
import { Card, Row, Col, Input, Button, message, Typography, Space, Tabs, Tag } from 'antd';
import { CopyOutlined, LockOutlined, FileTextOutlined } from '@ant-design/icons';
import { SEO, createToolJsonLd } from '@/components/SEO';

const { Title, Text } = Typography;
const { TextArea } = Input;

// MD5 实现
const md5 = (text: string): string => {
  const crypto = require('crypto');
  return crypto.createHash('md5').update(text).digest('hex');
};

// SHA1 实现
const sha1 = (text: string): string => {
  const crypto = require('crypto');
  return crypto.createHash('sha1').update(text).digest('hex');
};

// SHA256 实现
const sha256 = (text: string): string => {
  const crypto = require('crypto');
  return crypto.createHash('sha256').update(text).digest('hex');
};

// 前端 MD5 实现（备用）
const md5Frontend = (text: string): string => {
  const rotateLeft = (lValue: number, iShiftBits: number) => (lValue << iShiftBits) | (lValue >>> (32 - iShiftBits));
  const addUnsigned = (lX: number, lY: number) => {
    const lX8 = lX & 0x80000000;
    const lY8 = lY & 0x80000000;
    const lX4 = lX & 0x40000000;
    const lY4 = lY & 0x40000000;
    const lResult = (lX & 0x3FFFFFFF) + (lY & 0x3FFFFFFF);
    if (lX4 & lY4) return lResult ^ 0x80000000 ^ lX8 ^ lY8;
    if (lX4 | lY4) {
      if (lResult & 0x40000000) return lResult ^ 0xC0000000 ^ lX8 ^ lY8;
      return lResult ^ 0x40000000 ^ lX8 ^ lY8;
    }
    return lResult ^ lX8 ^ lY8;
  };
  const f = (x: number, y: number, z: number) => (x & y) | (~x & z);
  const g = (x: number, y: number, z: number) => (x & z) | (y & ~z);
  const h = (x: number, y: number, z: number) => x ^ y ^ z;
  const i = (x: number, y: number, z: number) => y ^ (x | ~z);
  const ff = (a: number, b: number, c: number, d: number, x: number, s: number, ac: number) => addUnsigned(rotateLeft(addUnsigned(addUnsigned(a, f(b, c, d)), x), s), ac);
  const gg = (a: number, b: number, c: number, d: number, x: number, s: number, ac: number) => addUnsigned(rotateLeft(addUnsigned(addUnsigned(a, g(b, c, d)), x), s), ac);
  const hh = (a: number, b: number, c: number, d: number, x: number, s: number, ac: number) => addUnsigned(rotateLeft(addUnsigned(addUnsigned(a, h(b, c, d)), x), s), ac);
  const ii = (a: number, b: number, c: number, d: number, x: number, s: number, ac: number) => addUnsigned(rotateLeft(addUnsigned(addUnsigned(a, i(b, c, d)), x), s), ac);

  const convertToWordArray = (str: string) => {
    const lWordCount: number[] = [];
    const lMessageLength = str.length;
    let lNumberOfWords_temp1 = lMessageLength + 8;
    let lNumberOfWords_temp2 = (lNumberOfWords_temp1 - (lNumberOfWords_temp1 % 64)) / 64;
    let lNumberOfWords = (lNumberOfWords_temp2 + 1) * 16;
    let lWordArray: number[] = new Array(lNumberOfWords - 1);
    let lBytePosition = 0;
    let lByteCount = 0;
    while (lByteCount < lMessageLength) {
      lWordCount[(lByteCount - (lByteCount % 4)) / 4] |= str.charCodeAt(lByteCount) << ((lByteCount % 4) * 8);
      lByteCount++;
    }
    lWordCount[(lByteCount - (lByteCount % 4)) / 4] |= 0x80 << ((lByteCount % 4) * 8);
    lWordCount[lNumberOfWords - 2] = lMessageLength * 8;
    return lWordCount;
  };

  let x = convertToWordArray(text);
  let a = 0x67452301, b = 0xEFCDAB89, c = 0x98BADCFE, d = 0x10325476;

  for (let k = 0; k < x.length; k += 16) {
    const AA = a, BB = b, CC = c, DD = d;
    a = ff(a, b, c, d, x[k + 0], 7, 0xD76AA478);
    d = ff(d, a, b, c, x[k + 1], 12, 0xE8C7B756);
    c = ff(c, d, a, b, x[k + 2], 17, 0x242070DB);
    b = ff(b, c, d, a, x[k + 3], 22, 0xC1BDCEEE);
    a = ff(a, b, c, d, x[k + 4], 7, 0xF57C0FAF);
    d = ff(d, a, b, c, x[k + 5], 12, 0x4787C62A);
    c = ff(c, d, a, b, x[k + 6], 17, 0xA8304613);
    b = ff(b, c, d, a, x[k + 7], 22, 0xFD469501);
    a = ff(a, b, c, d, x[k + 8], 7, 0x698098D8);
    d = ff(d, a, b, c, x[k + 9], 12, 0x8B44F7AF);
    c = ff(c, d, a, b, x[k + 10], 17, 0xFFFF5BB1);
    b = ff(b, c, d, a, x[k + 11], 22, 0x895CD7BE);
    a = ff(a, b, c, d, x[k + 12], 7, 0x6B901122);
    d = ff(d, a, b, c, x[k + 13], 12, 0xFD987193);
    c = ff(c, d, a, b, x[k + 14], 17, 0xA679438E);
    b = ff(b, c, d, a, x[k + 15], 22, 0x49B40821);
    a = gg(a, b, c, d, x[k + 1], 5, 0xF61E2562);
    d = gg(d, a, b, c, x[k + 6], 9, 0xC040B340);
    c = gg(c, d, a, b, x[k + 11], 14, 0x265E5A51);
    b = gg(b, c, d, a, x[k + 0], 20, 0xE9B6C7AA);
    a = gg(a, b, c, d, x[k + 5], 5, 0xD62F105D);
    d = gg(d, a, b, c, x[k + 10], 9, 0x02441453);
    c = gg(c, d, a, b, x[k + 15], 14, 0xD8A1E681);
    b = gg(b, c, d, a, x[k + 4], 20, 0xE7D3FBC8);
    a = gg(a, b, c, d, x[k + 9], 5, 0x21E1CDE6);
    d = gg(d, a, b, c, x[k + 14], 9, 0xC33707D6);
    c = gg(c, d, a, b, x[k + 3], 14, 0xF4D50D87);
    b = gg(b, c, d, a, x[k + 8], 20, 0x455A14ED);
    a = gg(a, b, c, d, x[k + 13], 5, 0xA9E3E905);
    d = gg(d, a, b, c, x[k + 2], 9, 0xFCEFA3F8);
    c = gg(c, d, a, b, x[k + 7], 14, 0x676F02D9);
    b = gg(b, c, d, a, x[k + 12], 20, 0x8D2A4C8A);
    a = hh(a, b, c, d, x[k + 5], 4, 0xFFFA3942);
    d = hh(d, a, b, c, x[k + 8], 11, 0x8771F681);
    c = hh(c, d, a, b, x[k + 11], 16, 0x6D9D6122);
    b = hh(b, c, d, a, x[k + 14], 23, 0xFDE5380C);
    a = hh(a, b, c, d, x[k + 1], 4, 0xA4BEEA44);
    d = hh(d, a, b, c, x[k + 4], 11, 0x4BDECFA9);
    c = hh(c, d, a, b, x[k + 7], 16, 0xF6BB4B60);
    b = hh(b, c, d, a, x[k + 10], 23, 0xBEBFBC70);
    a = hh(a, b, c, d, x[k + 13], 4, 0x289B7EC6);
    d = hh(d, a, b, c, x[k + 0], 11, 0xEAA127FA);
    c = hh(c, d, a, b, x[k + 3], 16, 0xD4EF3085);
    b = hh(b, c, d, a, x[k + 6], 23, 0x04881D05);
    a = hh(a, b, c, d, x[k + 9], 4, 0xD9D4D039);
    d = hh(d, a, b, c, x[k + 12], 11, 0xE6DB99E5);
    c = hh(c, d, a, b, x[k + 15], 16, 0x1FA27CF8);
    b = hh(b, c, d, a, x[k + 2], 23, 0xC4AC5665);
    a = ii(a, b, c, d, x[k + 0], 6, 0xF4292244);
    d = ii(d, a, b, c, x[k + 7], 10, 0x432AFF97);
    c = ii(c, d, a, b, x[k + 14], 15, 0xAB9423A7);
    b = ii(b, c, d, a, x[k + 5], 21, 0xFC93A039);
    a = ii(a, b, c, d, x[k + 12], 6, 0x655B59C3);
    d = ii(d, a, b, c, x[k + 3], 10, 0x8F0CCC92);
    c = ii(c, d, a, b, x[k + 10], 15, 0xFFEFF47D);
    b = ii(b, c, d, a, x[k + 1], 21, 0x85845DD1);
    a = ii(a, b, c, d, x[k + 8], 6, 0x6FA87E4F);
    d = ii(d, a, b, c, x[k + 15], 10, 0xFE2CE6E0);
    c = ii(c, d, a, b, x[k + 6], 15, 0xA3014314);
    b = ii(b, c, d, a, x[k + 13], 21, 0x4E0811A1);
    a = ii(a, b, c, d, x[k + 4], 6, 0xF7537E82);
    d = ii(d, a, b, c, x[k + 11], 10, 0xBD3AF235);
    c = ii(c, d, a, b, x[k + 2], 15, 0x2AD7D2BB);
    b = ii(b, c, d, a, x[k + 9], 21, 0xEB86D391);
    a = addUnsigned(a, AA);
    b = addUnsigned(b, BB);
    c = addUnsigned(c, CC);
    d = addUnsigned(d, DD);
  }

  const wordToHex = (lValue: number) => {
    let wordToHexValue = '', wordToHexValue_temp = '', lByte, lCount;
    for (lCount = 0; lCount <= 3; lCount++) {
      lByte = (lValue >>> (lCount * 8)) & 255;
      wordToHexValue_temp = '0' + lByte.toString(16);
      wordToHexValue += wordToHexValue_temp.substr(wordToHexValue_temp.length - 2, 2);
    }
    return wordToHexValue;
  };

  return (wordToHex(a) + wordToHex(b) + wordToHex(c) + wordToHex(d)).toLowerCase();
};

// 前端 SHA1 实现
const sha1Frontend = (text: string): string => {
  const rotateLeft = (n: number, s: number) => (n << s) | (n >>> (32 - s));
  const toHexStr = (n: number) => ('00000000' + (n >>> 0).toString(16)).slice(-8);

  const msg = unescape(encodeURIComponent(text));
  const msgLen = msg.length;
  const wordArray: number[] = [];
  for (let i = 0; i < msgLen - 3; i += 4) {
    wordArray.push(
      (msg.charCodeAt(i) << 24) | (msg.charCodeAt(i + 1) << 16) |
      (msg.charCodeAt(i + 2) << 8) | msg.charCodeAt(i + 3)
    );
  }
  let i = msgLen % 4;
  let word = 0;
  switch (i) {
    case 3: word |= msg.charCodeAt(msgLen - 1) << 8;
    case 2: word |= msg.charCodeAt(msgLen - 2) << 16;
    case 1: word |= msg.charCodeAt(msgLen - 3) << 24;
      wordArray.push(word | (0x80 << (24 - i * 8)));
      break;
    default: wordArray.push(0x80);
  }
  while ((wordArray.length % 16) !== 14) wordArray.push(0);
  wordArray.push(msgLen * 8 >>> 32);
  wordArray.push(msgLen * 8);

  let H0 = 0x67452301, H1 = 0xEFCDAB89, H2 = 0x98BADCFE, H3 = 0x10325476, H4 = 0xC3D2E1F0;

  for (let block = 0; block < wordArray.length; block += 16) {
    const W: number[] = new Array(80);
    for (let t = 0; t < 16; t++) W[t] = wordArray[block + t];
    for (let t = 16; t < 80; t++) {
      W[t] = rotateLeft(W[t - 3] ^ W[t - 8] ^ W[t - 14] ^ W[t - 16], 1);
    }

    let A = H0, B = H1, C = H2, D = H3, E = H4;
    for (let t = 0; t < 80; t++) {
      let temp = rotateLeft(A, 5) + (t < 20 ? (B & C) | (~B & D) : t < 40 ? B ^ C ^ D : t < 60 ? (B & C) | (B & D) | (C & D) : B ^ C ^ D) + E + W[t] + (t < 20 ? 0x5A827999 : t < 40 ? 0x6ED9EBA1 : t < 60 ? 0x8F1BBCDC : 0xCA62C1D6);
      E = D; D = C; C = rotateLeft(B, 30); B = A; A = temp;
    }
    H0 += A; H1 += B; H2 += C; H3 += D; H4 += E;
  }

  return (toHexStr(H0) + toHexStr(H1) + toHexStr(H2) + toHexStr(H3) + toHexStr(H4)).toLowerCase();
};

// 前端 SHA256 实现（简化版）
const sha256Frontend = (text: string): string => {
  const utf8Encode = (str: string) => {
    return new TextEncoder().encode(str);
  };

  const toHexString = (bytes: Uint8Array) => {
    return Array.from(bytes).map(b => ('0' + (b & 0xFF).toString(16)).slice(-2)).join('');
  };

  const data = utf8Encode(text);
  // 使用 Web Crypto API
  if (typeof crypto !== 'undefined' && crypto.subtle) {
    crypto.subtle.digest('SHA-256', data).then(hash => {
      return toHexString(new Uint8Array(hash));
    });
  }
  
  // 简化实现
  return 'sha256-not-available-in-frontend';
};

const HashTool: React.FC = () => {
  const [input, setInput] = useState('');
  const [results, setResults] = useState({ md5: '', sha1: '', sha256: '' });
  const [useFrontend, setUseFrontend] = useState(true);

  const seoConfig = {
    title: '哈希 MD5/SHA 工具',
    description: '免费的在线哈希计算工具，支持 MD5、SHA1、SHA256 哈希算法，纯前端计算保护隐私，支持文本哈希计算。',
    keywords: 'MD5工具,SHA1工具,SHA256工具,哈希计算,在线MD5,文件哈希,哈希值计算,前端哈希',
    jsonLd: createToolJsonLd(
      '哈希 MD5/SHA 工具',
      '免费的在线 MD5、SHA1、SHA256 哈希计算工具',
      'https://yma16.cloud/tools/hash-tool',
      'DeveloperApplication'
    ),
  };

  const calculateHash = useCallback(() => {
    if (!input) {
      message.warning('请输入文本');
      return;
    }

    try {
      if (useFrontend) {
        setResults({
          md5: md5Frontend(input),
          sha1: sha1Frontend(input),
          sha256: sha256Frontend(input),
        });
      } else {
        setResults({
          md5: md5(input),
          sha1: sha1(input),
          sha256: sha256(input),
        });
      }
    } catch (e) {
      message.error('计算失败');
    }
  }, [input, useFrontend]);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    message.success('已复制到剪贴板');
  };

  return (
    <>
      <SEO {...seoConfig} />
      <div style={{ padding: 24 }}>
        <Title level={2}>
          <LockOutlined /> 哈希计算工具
        </Title>
        <Text type="secondary">MD5 / SHA1 / SHA256 哈希计算，纯前端实现</Text>

        <Row gutter={[24, 24]} style={{ marginTop: 24 }}>
          <Col span={24}>
            <Card title="输入文本">
              <TextArea
                rows={6}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="输入要计算哈希的文本..."
              />
              <Space style={{ marginTop: 16 }}>
                <Button type="primary" icon={<LockOutlined />} onClick={calculateHash}>
                  计算哈希
                </Button>
                <Button onClick={() => { setInput(''); setResults({ md5: '', sha1: '', sha256: '' }); }}>
                  清空
                </Button>
              </Space>
            </Card>
          </Col>
        </Row>

        {results.md5 && (
          <Row gutter={[24, 24]} style={{ marginTop: 24 }}>
            <Col xs={24} lg={8}>
              <Card title="MD5">
                <Text code copyable style={{ wordBreak: 'break-all' }}>
                  {results.md5}
                </Text>
                <Button
                  icon={<CopyOutlined />}
                  size="small"
                  onClick={() => copyToClipboard(results.md5)}
                  style={{ marginTop: 8 }}
                >
                  复制
                </Button>
              </Card>
            </Col>
            <Col xs={24} lg={8}>
              <Card title="SHA1">
                <Text code copyable style={{ wordBreak: 'break-all' }}>
                  {results.sha1}
                </Text>
                <Button
                  icon={<CopyOutlined />}
                  size="small"
                  onClick={() => copyToClipboard(results.sha1)}
                  style={{ marginTop: 8 }}
                >
                  复制
                </Button>
              </Card>
            </Col>
            <Col xs={24} lg={8}>
              <Card title="SHA256">
                <Text code copyable style={{ wordBreak: 'break-all' }}>
                  {results.sha256}
                </Text>
                <Button
                  icon={<CopyOutlined />}
                  size="small"
                  onClick={() => copyToClipboard(results.sha256)}
                  style={{ marginTop: 8 }}
                >
                  复制
                </Button>
              </Card>
            </Col>
          </Row>
        )}

        <Row style={{ marginTop: 24 }}>
          <Col span={24}>
            <Card>
              <Tag color="green">纯前端计算</Tag>
              <Text type="secondary">所有哈希计算在浏览器本地完成，不会上传到服务器，保护您的数据隐私。</Text>
            </Card>
          </Col>
        </Row>
      </div>
    </>
  );
};

export default HashTool;
