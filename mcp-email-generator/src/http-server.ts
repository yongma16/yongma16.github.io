#!/usr/bin/env node

import http from "http";
import { URL } from "url";
import { validateEmailHtml } from "./validators.js";

// 邮件生成器 HTTP 服务
class EmailGeneratorHttpServer {
  private port: number;
  private apiKey: string | undefined;

  constructor() {
    this.port = parseInt(process.env.PORT || "3100");
    this.apiKey = process.env.API_KEY;
  }

  start() {
    const server = http.createServer(async (req, res) => {
      // CORS 头
      res.setHeader("Access-Control-Allow-Origin", "*");
      res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
      res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

      if (req.method === "OPTIONS") {
        res.writeHead(204);
        res.end();
        return;
      }

      // API Key 验证
      if (this.apiKey) {
        const authHeader = req.headers.authorization;
        const providedKey = authHeader?.replace("Bearer ", "");
        if (providedKey !== this.apiKey) {
          this.sendError(res, 401, "Unauthorized: Invalid API key");
          return;
        }
      }

      const url = new URL(req.url || "/", `http://localhost:${this.port}`);

      try {
        // 路由处理
        if (url.pathname === "/" || url.pathname === "/health") {
          this.handleHealth(req, res);
        } else if (url.pathname === "/generate-email" && req.method === "POST") {
          await this.handleGenerateEmail(req, res);
        } else if (url.pathname === "/generate-reply" && req.method === "POST") {
          await this.handleGenerateReply(req, res);
        } else if (url.pathname === "/polish-email" && req.method === "POST") {
          await this.handlePolishEmail(req, res);
        } else if (url.pathname === "/generate-html-email" && req.method === "POST") {
          await this.handleGenerateHtmlEmail(req, res);
        } else if (url.pathname === "/validate-email" && req.method === "POST") {
          await this.handleValidateEmail(req, res);
        } else if (url.pathname === "/tools" && req.method === "GET") {
          this.handleListTools(req, res);
        } else {
          this.sendError(res, 404, "Not Found");
        }
      } catch (error) {
        console.error("Error:", error);
        this.sendError(res, 500, "Internal Server Error");
      }
    });

    server.listen(this.port, () => {
      console.log(`📧 Email Generator HTTP Server running on port ${this.port}`);
      console.log(`   Health: http://localhost:${this.port}/health`);
      console.log(`   Tools:  http://localhost:${this.port}/tools`);
      console.log(`   API:    POST /generate-email, /generate-reply, /polish-email, /generate-html-email, /validate-email`);
      if (this.apiKey) {
        console.log(`   Auth:   Bearer token required`);
      }
    });
  }

  private handleHealth(req: http.IncomingMessage, res: http.ServerResponse) {
    this.sendJson(res, {
      status: "ok",
      service: "mcp-email-generator",
      version: "2.1.0",
      timestamp: new Date().toISOString(),
    });
  }

  private handleListTools(req: http.IncomingMessage, res: http.ServerResponse) {
    this.sendJson(res, {
      tools: [
        {
          name: "generate_email",
          endpoint: "POST /generate-email",
          description: "根据主题和要点生成邮件（支持纯文本和HTML）",
          parameters: {
            topic: { type: "string", required: true, description: "邮件主题" },
            points: { type: "array", required: true, items: "string", description: "邮件要点" },
            tone: { type: "string", enum: ["formal", "semi-formal", "casual"], default: "formal" },
            recipient: { type: "string", description: "收件人称呼" },
            sender: { type: "string", description: "发件人姓名" },
            language: { type: "string", enum: ["zh", "en"], default: "zh" },
            format: { type: "string", enum: ["text", "html", "both"], default: "text" },
            template: { type: "string", enum: ["default", "newsletter", "announcement", "invitation", "notification", "marketing"], default: "default" },
          },
        },
        {
          name: "generate_reply_email",
          endpoint: "POST /generate-reply",
          description: "生成回复邮件",
          parameters: {
            original_email: { type: "string", required: true, description: "原始邮件内容" },
            reply_type: { type: "string", enum: ["accept", "decline", "request_info", "confirm", "custom"], required: true },
            reply_points: { type: "array", items: "string", description: "回复要点" },
            tone: { type: "string", enum: ["formal", "semi-formal", "casual"], default: "formal" },
            format: { type: "string", enum: ["text", "html", "both"], default: "text" },
          },
        },
        {
          name: "polish_email",
          endpoint: "POST /polish-email",
          description: "润色邮件内容",
          parameters: {
            email_content: { type: "string", required: true, description: "邮件内容" },
            polish_type: { type: "string", enum: ["professional", "friendly", "concise", "detailed"], default: "professional" },
            language: { type: "string", enum: ["zh", "en"], default: "zh" },
            format: { type: "string", enum: ["text", "html", "both"], default: "text" },
          },
        },
        {
          name: "generate_html_email",
          endpoint: "POST /generate-html-email",
          description: "生成完整HTML邮件（带CTA按钮）",
          parameters: {
            title: { type: "string", required: true, description: "邮件标题" },
            headline: { type: "string", description: "头图文案" },
            content: { type: "string", required: true, description: "主要内容" },
            cta_text: { type: "string", description: "按钮文案" },
            cta_link: { type: "string", description: "按钮链接" },
            sender_name: { type: "string", description: "发件人/公司名" },
            sender_logo: { type: "string", description: "Logo URL" },
            primary_color: { type: "string", default: "#2563eb", description: "主色调" },
            language: { type: "string", enum: ["zh", "en"], default: "zh" },
          },
        },
        {
          name: "validate_email_html",
          endpoint: "POST /validate-email",
          description: "检测HTML邮件质量，包括链接、文本、图片、HTML结构、垃圾邮件评分",
          parameters: {
            html: { type: "string", required: true, description: "HTML邮件内容" },
            subject: { type: "string", description: "邮件主题（可选）" },
          },
        },
      ],
    });
  }

  private async handleGenerateEmail(req: http.IncomingMessage, res: http.ServerResponse) {
    const body = await this.parseBody(req);
    const { topic, points, tone, recipient, sender, language, format, template } = body;

    if (!topic || !points || !Array.isArray(points)) {
      this.sendError(res, 400, "Missing required fields: topic, points (array)");
      return;
    }

    const result = this.generateEmailContent(
      topic,
      points,
      tone || "formal",
      recipient,
      sender,
      language || "zh",
      format || "text",
      template || "default"
    );

    this.sendJson(res, result);
  }

  private async handleGenerateReply(req: http.IncomingMessage, res: http.ServerResponse) {
    const body = await this.parseBody(req);
    const { original_email, reply_points, reply_type, tone, format } = body;

    if (!original_email || !reply_type) {
      this.sendError(res, 400, "Missing required fields: original_email, reply_type");
      return;
    }

    const result = this.generateReplyContent(
      original_email,
      reply_points || [],
      reply_type,
      tone || "formal",
      format || "text"
    );

    this.sendJson(res, result);
  }

  private async handlePolishEmail(req: http.IncomingMessage, res: http.ServerResponse) {
    const body = await this.parseBody(req);
    const { email_content, polish_type, language, format } = body;

    if (!email_content) {
      this.sendError(res, 400, "Missing required field: email_content");
      return;
    }

    const result = this.polishEmailContent(
      email_content,
      polish_type || "professional",
      language || "zh",
      format || "text"
    );

    this.sendJson(res, result);
  }

  private async handleGenerateHtmlEmail(req: http.IncomingMessage, res: http.ServerResponse) {
    const body = await this.parseBody(req);
    const { title, headline, content, cta_text, cta_link, sender_name, sender_logo, primary_color, language } = body;

    if (!title || !content) {
      this.sendError(res, 400, "Missing required fields: title, content");
      return;
    }

    const result = this.generateHtmlEmail(
      title,
      headline,
      content,
      cta_text,
      cta_link,
      "default",
      language || "zh",
      sender_name,
      sender_logo,
      primary_color || "#2563eb"
    );

    this.sendJson(res, result);
  }

  // ===== 核心业务逻辑 =====

  private generateEmailContent(
    topic: string,
    points: string[],
    tone: string,
    recipient?: string,
    sender?: string,
    language?: string,
    format?: string,
    template?: string
  ): { subject: string; text?: string; html?: string; metadata: Record<string, unknown> } {
    const isChinese = (language || "zh") === "zh";
    const subject = isChinese ? `关于${topic}的邮件` : `Regarding ${topic}`;
    const textContent = this.generateTextContent(topic, points, tone, recipient, sender, language);

    const result: { subject: string; text?: string; html?: string; metadata: Record<string, unknown> } = {
      subject,
      metadata: {
        topic, tone, language, format, recipient: recipient || "未指定", sender: sender || "未指定",
        points_count: points.length, generated_at: new Date().toISOString(),
      },
    };

    if (format === "text" || format === "both") result.text = textContent;
    if (format === "html" || format === "both") result.html = this.generateTextToHtml(subject, textContent, sender, language, template || "default");

    return result;
  }

  private generateTextContent(topic: string, points: string[], tone: string, recipient?: string, sender?: string, language?: string): string {
    const isChinese = (language || "zh") === "zh";
    const safeTone = tone || "formal";

    const greetings = {
      zh: { formal: recipient ? `尊敬的${recipient}：` : "您好：", "semi-formal": recipient ? `${recipient}：` : "您好，", casual: recipient ? `${recipient}` : "Hi，" },
      en: { formal: recipient ? `Dear ${recipient},` : "Dear Sir/Madam,", "semi-formal": recipient ? `Dear ${recipient},` : "Hello,", casual: recipient ? `Hi ${recipient},` : "Hi," },
    } as const;

    const endings = {
      zh: { formal: ["此致敬礼", "顺祝商祺"], "semi-formal": ["祝好"], casual: ["祝好"] },
      en: { formal: ["Sincerely", "Best regards"], "semi-formal": ["Best regards"], casual: ["Best"] },
    } as const;

    const langKey = (language || "zh") as keyof typeof greetings;
    const toneKey = safeTone as keyof typeof greetings.zh;
    const greeting = greetings[langKey][toneKey];
    const ending = endings[langKey][toneKey][0];

    const bodyText = this.generateBodyText(topic, points, safeTone, language || "zh");
    return `${greeting}\n\n${bodyText}\n\n${ending}\n${sender || ""}`;
  }

  private generateBodyText(topic: string, points: string[], tone: string, language: string): string {
    const isChinese = language === "zh";
    const intro = isChinese
      ? tone === "formal" ? `现就${topic}事宜与您联系，具体内容如下：`
        : tone === "semi-formal" ? `关于${topic}，有几点需要说明：`
        : `关于${topic}，想跟你说一下：`
      : tone === "formal" ? `I am writing regarding ${topic}. Here are the details:`
        : `I wanted to reach out about ${topic}:`;

    const body = points.map((p, i) => `${i + 1}. ${p}`).join("\n");
    const outro = isChinese
      ? tone === "formal" ? "\n烦请查阅，如有疑问请随时联系。" : "\n如有问题请随时沟通。"
      : "\n\nPlease review and let me know if you have any questions.";

    return `${intro}\n\n${body}${outro}`;
  }

  private generateTextToHtml(subject: string, textContent: string, sender?: string, language?: string, template?: string): string {
    const isChinese = (language || "zh") === "zh";
    const lines = textContent.split("\n").filter(l => l.trim());
    const greeting = lines[0] || "";
    const ending = lines[lines.length - 2] || "";
    const signature = lines[lines.length - 1] || "";
    const bodyLines = lines.slice(1, lines.length - 2);

    const points: string[] = [];
    const otherContent: string[] = [];
    bodyLines.forEach(line => {
      const match = line.match(/^\d+\.\s*(.+)$/);
      if (match) points.push(match[1]);
      else if (line.trim()) otherContent.push(line);
    });

    return this.renderHtmlTemplate(template || "default", {
      subject, greeting, intro: otherContent[0] || "", points, outro: otherContent[otherContent.length - 1] || "",
      ending, signature, language: isChinese ? "zh" : "en"
    });
  }

  private renderHtmlTemplate(template: string, data: { subject: string; greeting: string; intro: string; points: string[]; outro: string; ending: string; signature: string; language: string }): string {
    const pointsHtml = data.points.map(p => `<li style="margin-bottom: 8px; color: #374151;">${p}</li>`).join("\n      ");
    
    return `<!DOCTYPE html>
<html lang="${data.language === "zh" ? "zh-CN" : "en"}">
<head><meta charset="UTF-8"><title>${data.subject}</title></head>
<body style="margin: 0; padding: 0; background-color: #f3f4f6; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width: 600px; margin: 40px auto; background-color: #ffffff; border-radius: 8px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
    <tr>
      <td style="padding: 40px 40px 20px;">
        <h1 style="margin: 0 0 24px; font-size: 24px; font-weight: 600; color: #111827; border-bottom: 2px solid #2563eb; padding-bottom: 16px;">${data.subject}</h1>
        <p style="margin: 0 0 16px; font-size: 16px; color: #374151; line-height: 1.6;">${data.greeting}</p>
        ${data.intro ? `<p style="margin: 0 0 20px; font-size: 16px; color: #374151; line-height: 1.6;">${data.intro}</p>` : ""}
        ${data.points.length > 0 ? `<ul style="margin: 0 0 20px; padding-left: 24px; font-size: 16px; line-height: 1.6;">${pointsHtml}</ul>` : ""}
      </td>
    </tr>
    <tr>
      <td style="padding: 20px 40px 40px; border-top: 1px solid #e5e7eb;">
        <p style="margin: 0 0 8px; font-size: 16px; color: #374151;">${data.ending}</p>
        <p style="margin: 0; font-size: 16px; font-weight: 500; color: #111827;">${data.signature}</p>
      </td>
    </tr>
  </table>
</body>
</html>`;
  }

  private generateHtmlEmail(
    title: string, headline?: string, content?: string, ctaText?: string, ctaLink?: string,
    template?: string, language?: string, senderName?: string, senderLogo?: string, primaryColor?: string
  ): { subject: string; html: string; preview: string; metadata: Record<string, unknown> } {
    const isChinese = (language || "zh") === "zh";
    const color = primaryColor || "#2563eb";
    const preview = content ? content.substring(0, 100) + "..." : "";

    const html = `<!DOCTYPE html>
<html lang="${isChinese ? "zh-CN" : "en"}">
<head><meta charset="UTF-8"><title>${title}</title></head>
<body style="margin: 0; padding: 0; background-color: #f3f4f6; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #f3f4f6;">
    <tr><td style="padding: 40px 20px;">
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1);">
        <tr><td style="background: linear-gradient(135deg, ${color} 0%, ${this.adjustColor(color, -20)} 100%); padding: 48px 40px; text-align: center;">
          ${senderLogo ? `<img src="${senderLogo}" style="max-width: 120px; height: auto; margin-bottom: 24px;">` : ""}
          <h1 style="margin: 0; font-size: 28px; font-weight: 700; color: #ffffff;">${headline || title}</h1>
        </td></tr>
        <tr><td style="padding: 48px 40px;">
          <div style="font-size: 17px; color: #374151; line-height: 1.8;">${content?.replace(/\n/g, "<br>") || ""}</div>
          ${ctaText && ctaLink ? `<div style="text-align: center; margin-top: 40px;"><a href="${ctaLink}" style="display: inline-block; padding: 16px 40px; background: linear-gradient(135deg, ${color} 0%, ${this.adjustColor(color, -20)} 100%); color: #ffffff; text-decoration: none; font-size: 16px; font-weight: 600; border-radius: 8px;">${ctaText}</a></div>` : ""}
        </td></tr>
        <tr><td style="padding: 32px 40px; background-color: #f8fafc; border-top: 1px solid #e5e7eb; text-align: center;">
          ${senderName ? `<p style="margin: 0 0 8px; font-size: 15px; font-weight: 600; color: #111827;">${senderName}</p>` : ""}
          <p style="margin: 0; font-size: 14px; color: #6b7280;">${isChinese ? "此邮件由系统自动发送" : "This email was automatically sent"}</p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;

    return { subject: title, html, preview, metadata: { title, headline, template, language, has_cta: !!(ctaText && ctaLink), primary_color: color, generated_at: new Date().toISOString() } };
  }

  private adjustColor(hex: string, amount: number): string {
    const num = parseInt(hex.replace("#", ""), 16);
    const r = Math.min(255, Math.max(0, (num >> 16) + amount));
    const g = Math.min(255, Math.max(0, ((num >> 8) & 0x00ff) + amount));
    const b = Math.min(255, Math.max(0, (num & 0x0000ff) + amount));
    return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, "0")}`;
  }

  private generateReplyContent(originalEmail: string, replyPoints: string[], replyType: string, tone: string, format: string): { subject: string; text?: string; html?: string; metadata: Record<string, unknown> } {
    const messages = { accept: "感谢您的来信，我已收到并同意您提出的建议。", decline: "感谢您的来信，经过考虑，很抱歉无法满足您的要求。", request_info: "感谢您的来信，为了更好地处理您的请求，我需要了解更多信息。", confirm: "感谢您的来信，我确认收到并同意相关安排。", custom: "感谢您的来信。" };
    const intro = messages[replyType as keyof typeof messages] || messages.custom;
    const body = replyPoints.length > 0 ? `\n\n关于您的邮件，有以下几点说明：\n${replyPoints.map((p, i) => `${i + 1}. ${p}`).join("\n")}` : "";
    const ending = tone === "formal" ? "此致敬礼" : "祝好";
    const textContent = `${intro}${body}\n\n${ending}`;

    const result: { subject: string; text?: string; html?: string; metadata: Record<string, unknown> } = {
      subject: "回复：" + originalEmail.substring(0, 30) + "...",
      metadata: { reply_type: replyType, tone, format, points_count: replyPoints.length, generated_at: new Date().toISOString() }
    };
    if (format === "text" || format === "both") result.text = textContent;
    if (format === "html" || format === "both") result.html = this.generateTextToHtml(result.subject, textContent, undefined, "zh", "notification");
    return result;
  }

  private polishEmailContent(emailContent: string, polishType: string, language: string, format: string): { original: string; text?: string; html?: string; suggestions: string[] } {
    const suggestions = {
      professional: ["使用更正式的词汇", "避免口语化表达", "增加适当的敬语"],
      friendly: ["使用更温和的语气", "增加问候语", "使用积极的词汇"],
      concise: ["删除冗余内容", "简化句式", "突出重点"],
      detailed: ["补充更多细节", "增加背景说明", "提供具体例子"],
    };
    const polishedText = `[润色后] ${emailContent}`;
    const result: { original: string; text?: string; html?: string; suggestions: string[] } = { original: emailContent, suggestions: suggestions[polishType as keyof typeof suggestions] || suggestions.professional };
    if (format === "text" || format === "both") result.text = polishedText;
    if (format === "html" || format === "both") result.html = this.generateTextToHtml("润色邮件", polishedText, undefined, language, "default");
    return result;
  }

  // ===== 工具方法 =====

  private parseBody(req: http.IncomingMessage): Promise<any> {
    return new Promise((resolve, reject) => {
      let body = "";
      req.on("data", chunk => body += chunk);
      req.on("end", () => {
        try {
          resolve(body ? JSON.parse(body) : {});
        } catch (e) {
          reject(new Error("Invalid JSON"));
        }
      });
      req.on("error", reject);
    });
  }

  private sendJson(res: http.ServerResponse, data: any) {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(data, null, 2));
  }

  private sendError(res: http.ServerResponse, code: number, message: string) {
    res.writeHead(code, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: true, code, message }));
  }
}

// 启动服务
const server = new EmailGeneratorHttpServer();
server.start();
