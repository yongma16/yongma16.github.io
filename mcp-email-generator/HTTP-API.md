# MCP Email Generator HTTP API

将 MCP 服务暴露为 HTTP API，支持外网调用。

## 快速启动

```bash
# 直接启动（默认端口 3100）
npm run http

# 自定义端口
PORT=8080 npm run http

# 启用 API Key 验证
API_KEY=your-secret-key npm run http
```

## 部署到外网

### 方式 1: 直接运行 + 反向代理

```bash
# 1. 启动服务
PORT=3100 npm run http

# 2. Nginx 反向代理
# /etc/nginx/sites-available/email-api
server {
    listen 80;
    server_name email-api.yourdomain.com;

    location / {
        proxy_pass http://127.0.0.1:3100;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}

# 3. 启用并重启
sudo ln -s /etc/nginx/sites-available/email-api /etc/nginx/sites-enabled/
sudo nginx -t && sudo nginx -s reload
```

### 方式 2: PM2 进程管理

```bash
# 安装 PM2
npm install -g pm2

# 启动服务
PORT=3100 API_KEY=your-secret-key pm2 start dist/http-server.js --name email-api

# 查看状态
pm2 status

# 设置开机自启
pm2 startup
pm2 save
```

### 方式 3: Docker 部署

```dockerfile
# Dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3100
ENV PORT=3100
CMD ["node", "dist/http-server.js"]
```

```bash
# 构建镜像
docker build -t email-generator .

# 运行容器
docker run -d -p 3100:3100 -e API_KEY=your-secret-key email-generator
```

### 方式 4: 云服务部署

**腾讯云/阿里云轻量应用服务器：**
```bash
# 1. 购买服务器，开放 3100 端口
# 2. SSH 登录，安装 Node.js
# 3. 克隆代码，安装依赖
# 4. 使用 PM2 启动
```

**Serverless 部署（云函数）：**
- 可适配为云函数入口，导出 handler

---

## API 文档

### 基础信息

| 项目 | 值 |
|------|---|
| Base URL | `http://your-domain:3100` |
| 认证 | Bearer Token（可选） |
| 格式 | JSON |

### 认证

如果启动时设置了 `API_KEY`，请求需携带：

```
Authorization: Bearer your-secret-key
```

---

### 接口列表

#### 1. 健康检查

```
GET /health
```

**响应：**
```json
{
  "status": "ok",
  "service": "mcp-email-generator",
  "version": "2.0.0",
  "timestamp": "2026-03-17T07:48:16.269Z"
}
```

---

#### 2. 查看工具列表

```
GET /tools
```

---

#### 3. 生成邮件

```
POST /generate-email
```

**请求体：**
```json
{
  "topic": "请假申请",
  "points": ["请假3天", "家中有事", "工作已交接"],
  "tone": "formal",
  "recipient": "王经理",
  "sender": "张三",
  "language": "zh",
  "format": "html",
  "template": "newsletter"
}
```

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| topic | string | ✅ | 邮件主题 |
| points | string[] | ✅ | 邮件要点 |
| tone | string | | formal/semi-formal/casual |
| recipient | string | | 收件人 |
| sender | string | | 发件人 |
| language | string | | zh/en |
| format | string | | text/html/both |
| template | string | | 模板样式 |

**响应：**
```json
{
  "subject": "关于请假申请的邮件",
  "text": "尊敬的王经理：...",
  "html": "<!DOCTYPE html>...",
  "metadata": { ... }
}
```

---

#### 4. 生成 HTML 邮件（完整版）

```
POST /generate-html-email
```

**请求体：**
```json
{
  "title": "产品更新通知",
  "headline": "全新功能上线！",
  "content": "我们很高兴地宣布新版本发布...",
  "cta_text": "立即体验",
  "cta_link": "https://example.com",
  "sender_name": "AI团队",
  "sender_logo": "https://example.com/logo.png",
  "primary_color": "#8b5cf6",
  "language": "zh"
}
```

---

#### 5. 生成回复邮件

```
POST /generate-reply
```

**请求体：**
```json
{
  "original_email": "王经理邀请你参加会议...",
  "reply_type": "accept",
  "reply_points": ["我会准时参加", "已准备好材料"],
  "tone": "formal",
  "format": "text"
}
```

---

#### 6. 润色邮件

```
POST /polish-email
```

**请求体：**
```json
{
  "email_content": "老板好，我想请假几天...",
  "polish_type": "professional",
  "language": "zh",
  "format": "text"
}
```

---

## 调用示例

### cURL

```bash
# 基础调用
curl -X POST http://localhost:3100/generate-email \
  -H "Content-Type: application/json" \
  -d '{"topic":"请假","points":["请假1天"],"format":"text"}'

# 带 API Key
curl -X POST http://localhost:3100/generate-email \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer your-secret-key" \
  -d '{"topic":"请假","points":["请假1天"],"format":"html"}'
```

### JavaScript / Node.js

```javascript
const response = await fetch('http://localhost:3100/generate-email', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer your-secret-key'
  },
  body: JSON.stringify({
    topic: '请假申请',
    points: ['请假3天', '家中有事'],
    format: 'html',
    template: 'newsletter'
  })
});

const data = await response.json();
console.log(data.subject);
console.log(data.html);
```

### Python

```python
import requests

response = requests.post(
    'http://localhost:3100/generate-email',
    headers={
        'Content-Type': 'application/json',
        'Authorization': 'Bearer your-secret-key'
    },
    json={
        'topic': '请假申请',
        'points': ['请假3天', '家中有事'],
        'format': 'html'
    }
)

data = response.json()
print(data['subject'])
print(data['html'])
```

---

## 安全建议

1. **启用 API Key** - 生产环境务必设置
2. **HTTPS** - 使用 Nginx 配置 SSL
3. **限流** - Nginx 或应用层限流
4. **白名单** - 限制访问 IP

```nginx
# Nginx 限流示例
limit_req_zone $binary_remote_addr zone=api:10m rate=10r/s;

location / {
    limit_req zone=api burst=20;
    proxy_pass http://127.0.0.1:3100;
}
```
