import React, { useEffect, useRef, useState, useCallback } from 'react';
import { history } from 'umi';
import {
  Card,
  Button,
  Input,
  Upload,
  message as antMessage,
  Badge,
  Typography,
  Space,
  Divider,
  Alert,
  Tooltip,
} from 'antd';
import {
  CopyOutlined,
  LinkOutlined,
  DisconnectOutlined,
  SendOutlined,
  PictureOutlined,
  ArrowLeftOutlined,
  CheckCircleOutlined,
  InfoCircleOutlined,
} from '@ant-design/icons';
import type { UploadProps } from 'antd';
import { Peer } from 'peerjs';
import type { DataConnection } from 'peerjs';
import { useI18n } from '@/i18n';
import { SEO } from '@/components/SEO';

const { Text, Paragraph } = Typography;
const { TextArea } = Input;

interface ChatMessage {
  id: string;
  type: 'text' | 'image';
  content: string;
  isSelf: boolean;
  timestamp: number;
  fileName?: string;
}

type ConnectionStatus = 'idle' | 'connecting' | 'connected' | 'disconnected' | 'error';

const P2PChatPage: React.FC = () => {
  const { t } = useI18n();
  const [peerId, setPeerId] = useState<string>('');
  const [remoteId, setRemoteId] = useState<string>('');
  const [status, setStatus] = useState<ConnectionStatus>('idle');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [copySuccess, setCopySuccess] = useState(false);

  const peerRef = useRef<Peer | null>(null);
  const connRef = useRef<DataConnection | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  // 初始化 Peer
  useEffect(() => {
    const peer = new Peer({
      host: '0.peerjs.com',
      port: 443,
      secure: true,
      debug: 1,
    });

    peerRef.current = peer;

    peer.on('open', (id) => {
      setPeerId(id);
      setStatus('idle');
    });

    peer.on('connection', (conn) => {
      setupConnection(conn);
      setRemoteId(conn.peer);
      setStatus('connected');
      antMessage.success(`${t('p2pChat.connectedWith')} ${conn.peer}`);
    });

    peer.on('error', (err) => {
      console.error('Peer error:', err);
      setStatus('error');
      antMessage.error(t('p2pChat.connectionError'));
    });

    return () => {
      peer.destroy();
    };
  }, [t]);

  // 自动滚动到底部
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const setupConnection = useCallback((conn: DataConnection) => {
    connRef.current = conn;

    conn.on('open', () => {
      setStatus('connected');
    });

    conn.on('data', (data: unknown) => {
      if (typeof data === 'object' && data !== null) {
        const msg = data as { type: 'text' | 'image'; content: string; fileName?: string };
        const newMessage: ChatMessage = {
          id: `${Date.now()}-${Math.random()}`,
          type: msg.type,
          content: msg.content,
          isSelf: false,
          timestamp: Date.now(),
          fileName: msg.fileName,
        };
        setMessages((prev) => [...prev, newMessage]);
      }
    });

    conn.on('close', () => {
      setStatus('disconnected');
      connRef.current = null;
      antMessage.info(t('p2pChat.disconnected'));
    });

    conn.on('error', () => {
      setStatus('error');
      antMessage.error(t('p2pChat.connectionError'));
    });
  }, [t]);

  const handleConnect = useCallback(() => {
    if (!remoteId.trim() || remoteId === peerId) {
      antMessage.warning(t('p2pChat.enterValidId'));
      return;
    }

    setStatus('connecting');
    const conn = peerRef.current!.connect(remoteId.trim(), {
      reliable: true,
    });

    setupConnection(conn);
  }, [remoteId, peerId, setupConnection, t]);

  const handleDisconnect = useCallback(() => {
    connRef.current?.close();
    connRef.current = null;
    setStatus('idle');
    setRemoteId('');
    antMessage.info(t('p2pChat.disconnected'));
  }, [t]);

  const sendMessage = useCallback((type: 'text' | 'image', content: string, fileName?: string) => {
    if (!connRef.current || status !== 'connected') {
      antMessage.warning(t('p2pChat.notConnected'));
      return;
    }

    connRef.current.send({ type, content, fileName });

    const newMessage: ChatMessage = {
      id: `${Date.now()}-${Math.random()}`,
      type,
      content,
      isSelf: true,
      timestamp: Date.now(),
      fileName,
    };
    setMessages((prev) => [...prev, newMessage]);
  }, [status, t]);

  const handleSendText = useCallback(() => {
    if (!inputText.trim()) return;
    sendMessage('text', inputText.trim());
    setInputText('');
  }, [inputText, sendMessage]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendText();
    }
  }, [handleSendText]);

  // 图片上传处理 - 使用 Ant Design Upload 组件
  const uploadProps: UploadProps = {
    accept: 'image/*',
    showUploadList: false,
    beforeUpload: (file) => {
      if (!file.type.startsWith('image/')) {
        antMessage.error(t('p2pChat.selectImage'));
        return Upload.LIST_IGNORE;
      }

      const reader = new FileReader();
      reader.onload = () => {
        const arrayBuffer = reader.result as ArrayBuffer;
        // 转为二进制字符串发送
        const uint8Array = new Uint8Array(arrayBuffer);
        let binaryString = '';
        const chunkSize = 8192;
        for (let i = 0; i < uint8Array.length; i += chunkSize) {
          const chunk = uint8Array.subarray(i, i + chunkSize);
          binaryString += String.fromCharCode(...chunk);
        }
        sendMessage('image', binaryString, file.name);
      };
      reader.readAsArrayBuffer(file);

      return false; // 阻止自动上传
    },
  };

  // 将接收到的二进制数据还原为 Blob URL
  const binaryToBlobUrl = useCallback((binaryString: string, fileName?: string): string => {
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    const blob = new Blob([bytes], {
      type: fileName?.endsWith('.png')
        ? 'image/png'
        : fileName?.endsWith('.jpg') || fileName?.endsWith('.jpeg')
        ? 'image/jpeg'
        : fileName?.endsWith('.gif')
        ? 'image/gif'
        : fileName?.endsWith('.webp')
        ? 'image/webp'
        : 'image/png',
    });
    return URL.createObjectURL(blob);
  }, []);

  const copyPeerId = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(peerId);
      setCopySuccess(true);
      antMessage.success(t('p2pChat.copied'));
      setTimeout(() => setCopySuccess(false), 2000);
    } catch {
      // fallback
      const textarea = document.createElement('textarea');
      textarea.value = peerId;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopySuccess(true);
      antMessage.success(t('p2pChat.copied'));
      setTimeout(() => setCopySuccess(false), 2000);
    }
  }, [peerId, t]);

  const getStatusConfig = (s: ConnectionStatus) => {
    switch (s) {
      case 'idle':
        return { text: t('p2pChat.statusIdle'), color: 'default' as const };
      case 'connecting':
        return { text: t('p2pChat.statusConnecting'), color: 'processing' as const };
      case 'connected':
        return { text: t('p2pChat.statusConnected'), color: 'success' as const };
      case 'disconnected':
        return { text: t('p2pChat.statusDisconnected'), color: 'error' as const };
      case 'error':
        return { text: t('p2pChat.statusError'), color: 'error' as const };
      default:
        return { text: t('p2pChat.statusIdle'), color: 'default' as const };
    }
  };

  const statusConfig = getStatusConfig(status);

  return (
    <>
      <SEO
        title={t('p2pChat.title')}
        description={t('p2pChat.description')}
        keywords="P2P,WebRTC,点对点聊天,文件传输,在线工具"
      />
      <div style={{ display: 'flex', height: 'calc(100vh - 64px - 48px)', gap: 16 }}>
        {/* 左侧控制面板 */}
        <Card
          style={{
            width: 320,
            minWidth: 320,
            display: 'flex',
            flexDirection: 'column',
          }}
          bodyStyle={{ flex: 1, display: 'flex', flexDirection: 'column', padding: 16 }}
        >
          <Button
            icon={<ArrowLeftOutlined />}
            onClick={() => history.push('/')}
            style={{ marginBottom: 16, alignSelf: 'flex-start' }}
          >
            {t('p2pChat.back')}
          </Button>

          <Typography.Title level={4} style={{ marginBottom: 16 }}>
            {t('p2pChat.title')}
          </Typography.Title>

          {/* 我的 Peer ID */}
          <div style={{ marginBottom: 16 }}>
            <Text strong style={{ display: 'block', marginBottom: 8 }}>
              {t('p2pChat.myId')}
            </Text>
            <Space.Compact style={{ width: '100%' }}>
              <Input
                value={peerId || t('p2pChat.generating')}
                readOnly
                style={{ fontFamily: 'monospace' }}
              />
              <Tooltip title={copySuccess ? t('p2pChat.copied') : t('common.copy')}>
                <Button
                  icon={<CopyOutlined />}
                  onClick={copyPeerId}
                  disabled={!peerId}
                />
              </Tooltip>
            </Space.Compact>
          </div>

          {/* 连接状态 */}
          <div style={{ marginBottom: 16 }}>
            <Text strong style={{ display: 'block', marginBottom: 8 }}>
              {t('p2pChat.connectionStatus')}
            </Text>
            <Badge status={statusConfig.color} text={statusConfig.text} />
          </div>

          {/* 输入对方 ID */}
          <div style={{ marginBottom: 16 }}>
            <Text strong style={{ display: 'block', marginBottom: 8 }}>
              {t('p2pChat.remoteId')}
            </Text>
            <Input
              value={remoteId}
              onChange={(e) => setRemoteId(e.target.value)}
              placeholder={t('p2pChat.enterRemoteId')}
              disabled={status === 'connected' || status === 'connecting'}
              style={{ fontFamily: 'monospace' }}
            />
          </div>

          {/* 连接/断开按钮 */}
          {status === 'connected' ? (
            <Button
              type="primary"
              danger
              icon={<DisconnectOutlined />}
              onClick={handleDisconnect}
              block
            >
              {t('p2pChat.disconnect')}
            </Button>
          ) : (
            <Button
              type="primary"
              icon={<LinkOutlined />}
              onClick={handleConnect}
              disabled={!remoteId.trim() || status === 'connecting' || !peerId}
              loading={status === 'connecting'}
              block
            >
              {t('p2pChat.connect')}
            </Button>
          )}

          <Divider />

          {/* 使用说明 */}
          <div style={{ flex: 1, overflow: 'auto' }}>
            <Text strong style={{ display: 'block', marginBottom: 8 }}>
              {t('p2pChat.howToUse')}
            </Text>
            <ol style={{ paddingLeft: 16, color: '#666', fontSize: 13 }}>
              <li style={{ marginBottom: 4 }}>{t('p2pChat.step1')}</li>
              <li style={{ marginBottom: 4 }}>{t('p2pChat.step2')}</li>
              <li style={{ marginBottom: 4 }}>{t('p2pChat.step3')}</li>
              <li style={{ marginBottom: 4 }}>{t('p2pChat.step4')}</li>
              <li>{t('p2pChat.step5')}</li>
            </ol>
          </div>

          <Alert
            message={t('p2pChat.privacyNotice')}
            type="info"
            showIcon
            icon={<InfoCircleOutlined />}
            style={{ marginTop: 16 }}
          />
        </Card>

        {/* 右侧聊天区域 */}
        <Card
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            minWidth: 0,
          }}
          bodyStyle={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            padding: 0,
            overflow: 'hidden',
          }}
          title={
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span>{t('p2pChat.chatWindow')}</span>
              {status === 'connected' && (
                <Space>
                  <Badge status="success" />
                  <Text type="success">{t('p2pChat.online')}</Text>
                </Space>
              )}
            </div>
          }
        >
          {/* 消息列表 */}
          <div
            ref={messagesContainerRef}
            style={{
              flex: 1,
              overflowY: 'auto',
              padding: '16px 24px',
              background: '#f5f5f5',
            }}
          >
            {messages.length === 0 && (
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: '100%',
                  color: '#999',
                }}
              >
                <PictureOutlined style={{ fontSize: 48, marginBottom: 16 }} />
                <Text style={{ fontSize: 16 }}>{t('p2pChat.noMessages')}</Text>
                <Text type="secondary">{t('p2pChat.connectFirst')}</Text>
              </div>
            )}

            {messages.map((msg) => (
              <div
                key={msg.id}
                style={{
                  display: 'flex',
                  justifyContent: msg.isSelf ? 'flex-end' : 'flex-start',
                  marginBottom: 12,
                }}
              >
                <div
                  style={{
                    maxWidth: '70%',
                    padding: '10px 14px',
                    borderRadius: msg.isSelf
                      ? '16px 16px 4px 16px'
                      : '16px 16px 16px 4px',
                    background: msg.isSelf ? '#1890ff' : '#ffffff',
                    color: msg.isSelf ? '#ffffff' : '#333333',
                    boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
                  }}
                >
                  {msg.type === 'text' ? (
                    <Paragraph
                      style={{
                        margin: 0,
                        color: 'inherit',
                        fontSize: 14,
                        lineHeight: 1.6,
                        whiteSpace: 'pre-wrap',
                        wordBreak: 'break-word',
                      }}
                    >
                      {msg.content}
                    </Paragraph>
                  ) : (
                    <div>
                      <img
                        src={binaryToBlobUrl(msg.content, msg.fileName)}
                        alt={msg.fileName || t('p2pChat.image')}
                        style={{
                          maxWidth: '100%',
                          maxHeight: 300,
                          borderRadius: 8,
                          cursor: 'pointer',
                        }}
                        onClick={() => {
                          const url = binaryToBlobUrl(msg.content, msg.fileName);
                          const a = document.createElement('a');
                          a.href = url;
                          a.download = msg.fileName || 'image.png';
                          a.click();
                        }}
                      />
                      {msg.fileName && (
                        <Text
                          style={{
                            display: 'block',
                            marginTop: 4,
                            fontSize: 12,
                            color: msg.isSelf ? 'rgba(255,255,255,0.8)' : '#999',
                          }}
                        >
                          {msg.fileName}
                        </Text>
                      )}
                    </div>
                  )}
                  <Text
                    style={{
                      display: 'block',
                      marginTop: 4,
                      fontSize: 11,
                      color: msg.isSelf ? 'rgba(255,255,255,0.7)' : '#999',
                      textAlign: 'right',
                    }}
                  >
                    {new Date(msg.timestamp).toLocaleTimeString('zh-CN', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </Text>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* 底部输入区 */}
          <div
            style={{
              padding: '12px 24px',
              borderTop: '1px solid #f0f0f0',
              background: '#ffffff',
            }}
          >
            <Space.Compact style={{ width: '100%', alignItems: 'flex-end' }}>
              {/* 图片上传按钮 */}
              <Upload {...uploadProps}>
                <Button
                  icon={<PictureOutlined />}
                  disabled={status !== 'connected'}
                  style={{ height: 40 }}
                />
              </Upload>

              {/* 文本输入框 */}
              <TextArea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={
                  status === 'connected'
                    ? t('p2pChat.inputPlaceholder')
                    : t('p2pChat.connectFirst')
                }
                disabled={status !== 'connected'}
                autoSize={{ minRows: 1, maxRows: 4 }}
                style={{
                  flex: 1,
                  borderRadius: '0 8px 8px 0',
                }}
              />

              {/* 发送按钮 */}
              <Button
                type="primary"
                icon={<SendOutlined />}
                onClick={handleSendText}
                disabled={!inputText.trim() || status !== 'connected'}
                style={{ height: 40 }}
              >
                {t('p2pChat.send')}
              </Button>
            </Space.Compact>
          </div>
        </Card>
      </div>
    </>
  );
};

export default P2PChatPage;
