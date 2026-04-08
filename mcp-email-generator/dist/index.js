#!/usr/bin/env node
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { CallToolRequestSchema, ListToolsRequestSchema, ErrorCode, McpError, } from "@modelcontextprotocol/sdk/types.js";
// 邮件生成器服务
class EmailGeneratorServer {
    server;
    constructor() {
        this.server = new Server({
            name: "mcp-email-generator",
            version: "2.0.0",
        }, {
            capabilities: {
                tools: {},
            },
        });
        this.setupHandlers();
    }
    setupHandlers() {
        // 列出可用工具
        this.server.setRequestHandler(ListToolsRequestSchema, async () => ({
            tools: [
                {
                    name: "generate_email",
                    description: `根据用户输入的主题和要点生成专业的邮件内容。
支持多种邮件类型：商务邮件、求职邮件、感谢信、邀请函、通知邮件等。
支持纯文本和HTML两种格式输出。`,
                    inputSchema: {
                        type: "object",
                        properties: {
                            topic: {
                                type: "string",
                                description: "邮件的主题/目的，例如：请假、求职、商务合作、感谢等",
                            },
                            points: {
                                type: "array",
                                items: { type: "string" },
                                description: "邮件需要包含的要点，例如：['请假3天', '原因是家中有事', '工作已交接给同事']",
                            },
                            tone: {
                                type: "string",
                                enum: ["formal", "semi-formal", "casual"],
                                description: "邮件语气：formal(正式)、semi-formal(半正式)、casual(随意)，默认为 formal",
                                default: "formal",
                            },
                            recipient: {
                                type: "string",
                                description: "收件人称呼，例如：王经理、HR、张总，默认为'您好'",
                            },
                            sender: {
                                type: "string",
                                description: "发件人姓名，用于落款",
                            },
                            language: {
                                type: "string",
                                enum: ["zh", "en"],
                                description: "邮件语言：zh(中文)、en(英文)，默认为 zh",
                                default: "zh",
                            },
                            format: {
                                type: "string",
                                enum: ["text", "html", "both"],
                                description: "输出格式：text(纯文本)、html(HTML格式)、both(两种格式)，默认为 text",
                                default: "text",
                            },
                            template: {
                                type: "string",
                                enum: ["default", "newsletter", "announcement", "invitation", "notification", "marketing"],
                                description: "HTML模板样式：default(默认)、newsletter(通讯)、announcement(公告)、invitation(邀请函)、notification(通知)、marketing(营销)，默认为 default",
                                default: "default",
                            },
                        },
                        required: ["topic", "points"],
                    },
                },
                {
                    name: "generate_reply_email",
                    description: `生成回复邮件。根据收到的邮件内容，生成专业的回复。`,
                    inputSchema: {
                        type: "object",
                        properties: {
                            original_email: {
                                type: "string",
                                description: "收到的原始邮件内容",
                            },
                            reply_points: {
                                type: "array",
                                items: { type: "string" },
                                description: "回复中需要包含的要点",
                            },
                            reply_type: {
                                type: "string",
                                enum: ["accept", "decline", "request_info", "confirm", "custom"],
                                description: "回复类型：accept(接受)、decline(拒绝)、request_info(询问更多信息)、confirm(确认)、custom(自定义)",
                            },
                            tone: {
                                type: "string",
                                enum: ["formal", "semi-formal", "casual"],
                                description: "邮件语气，默认为 formal",
                                default: "formal",
                            },
                            format: {
                                type: "string",
                                enum: ["text", "html", "both"],
                                description: "输出格式，默认为 text",
                                default: "text",
                            },
                        },
                        required: ["original_email", "reply_type"],
                    },
                },
                {
                    name: "polish_email",
                    description: `润色和优化已有邮件内容，使其更加专业、流畅。`,
                    inputSchema: {
                        type: "object",
                        properties: {
                            email_content: {
                                type: "string",
                                description: "需要润色的邮件内容",
                            },
                            polish_type: {
                                type: "string",
                                enum: ["professional", "friendly", "concise", "detailed"],
                                description: "润色方向：professional(更专业)、friendly(更友好)、concise(更简洁)、detailed(更详细)",
                                default: "professional",
                            },
                            language: {
                                type: "string",
                                enum: ["zh", "en"],
                                description: "邮件语言，默认为 zh",
                                default: "zh",
                            },
                            format: {
                                type: "string",
                                enum: ["text", "html", "both"],
                                description: "输出格式，默认为 text",
                                default: "text",
                            },
                        },
                        required: ["email_content"],
                    },
                },
                {
                    name: "generate_html_email",
                    description: `生成精美的HTML邮件模板，支持多种预设样式。`,
                    inputSchema: {
                        type: "object",
                        properties: {
                            title: {
                                type: "string",
                                description: "邮件标题",
                            },
                            headline: {
                                type: "string",
                                description: "邮件头图文案",
                            },
                            content: {
                                type: "string",
                                description: "邮件主要内容",
                            },
                            cta_text: {
                                type: "string",
                                description: "行动按钮文案，例如：立即查看、了解更多",
                            },
                            cta_link: {
                                type: "string",
                                description: "行动按钮链接",
                            },
                            template: {
                                type: "string",
                                enum: ["default", "newsletter", "announcement", "invitation", "notification", "marketing", "welcome"],
                                description: "模板样式，默认为 default",
                                default: "default",
                            },
                            language: {
                                type: "string",
                                enum: ["zh", "en"],
                                description: "邮件语言，默认为 zh",
                                default: "zh",
                            },
                            sender_name: {
                                type: "string",
                                description: "发件人/公司名称",
                            },
                            sender_logo: {
                                type: "string",
                                description: "发件人Logo URL",
                            },
                            primary_color: {
                                type: "string",
                                description: "主色调，十六进制颜色值，例如：#2563eb",
                                default: "#2563eb",
                            },
                        },
                        required: ["title", "content"],
                    },
                },
            ],
        }));
        // 处理工具调用
        this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
            const { name, arguments: args } = request.params;
            switch (name) {
                case "generate_email":
                    return this.handleGenerateEmail(args);
                case "generate_reply_email":
                    return this.handleGenerateReplyEmail(args);
                case "polish_email":
                    return this.handlePolishEmail(args);
                case "generate_html_email":
                    return this.handleGenerateHtmlEmail(args);
                default:
                    throw new McpError(ErrorCode.MethodNotFound, `Unknown tool: ${name}`);
            }
        });
    }
    handleGenerateEmail(args) {
        const { topic, points, tone = "formal", recipient, sender, language = "zh", format = "text", template = "default" } = args;
        if (!topic || !points || points.length === 0) {
            throw new McpError(ErrorCode.InvalidParams, "缺少必要参数：topic 和 points");
        }
        const email = this.generateEmailContent(topic, points, tone, recipient, sender, language, format, template);
        return {
            content: [
                {
                    type: "text",
                    text: JSON.stringify(email, null, 2),
                },
            ],
        };
    }
    handleGenerateReplyEmail(args) {
        const { original_email, reply_points = [], reply_type, tone = "formal", format = "text" } = args;
        if (!original_email || !reply_type) {
            throw new McpError(ErrorCode.InvalidParams, "缺少必要参数：original_email 和 reply_type");
        }
        const reply = this.generateReplyContent(original_email, reply_points, reply_type, tone, format);
        return {
            content: [
                {
                    type: "text",
                    text: JSON.stringify(reply, null, 2),
                },
            ],
        };
    }
    handlePolishEmail(args) {
        const { email_content, polish_type = "professional", language = "zh", format = "text" } = args;
        if (!email_content) {
            throw new McpError(ErrorCode.InvalidParams, "缺少必要参数：email_content");
        }
        const polished = this.polishEmailContent(email_content, polish_type, language, format);
        return {
            content: [
                {
                    type: "text",
                    text: JSON.stringify(polished, null, 2),
                },
            ],
        };
    }
    handleGenerateHtmlEmail(args) {
        const { title, headline, content, cta_text, cta_link, template = "default", language = "zh", sender_name, sender_logo, primary_color = "#2563eb", } = args;
        if (!title || !content) {
            throw new McpError(ErrorCode.InvalidParams, "缺少必要参数：title 和 content");
        }
        const htmlEmail = this.generateHtmlEmail(title, headline, content, cta_text, cta_link, template, language, sender_name, sender_logo, primary_color);
        return {
            content: [
                {
                    type: "text",
                    text: JSON.stringify(htmlEmail, null, 2),
                },
            ],
        };
    }
    // 生成邮件内容
    generateEmailContent(topic, points, tone, recipient, sender, language, format, template) {
        const isChinese = (language || "zh") === "zh";
        const safeLanguage = language || "zh";
        const safeTone = tone || "formal";
        const safeFormat = format || "text";
        // 生成主题
        const subject = isChinese ? `关于${topic}的邮件` : `Regarding ${topic}`;
        // 生成纯文本内容
        const textContent = this.generateTextContent(topic, points, safeTone, recipient, sender, safeLanguage);
        const result = {
            subject,
            metadata: {
                topic,
                tone: safeTone,
                language: safeLanguage,
                format: safeFormat,
                recipient: recipient || "未指定",
                sender: sender || "未指定",
                points_count: points.length,
                generated_at: new Date().toISOString(),
            },
        };
        if (safeFormat === "text" || safeFormat === "both") {
            result.text = textContent;
        }
        if (safeFormat === "html" || safeFormat === "both") {
            result.html = this.generateTextToHtml(subject, textContent, sender, safeLanguage, template || "default");
        }
        return result;
    }
    // 生成纯文本内容
    generateTextContent(topic, points, tone, recipient, sender, language) {
        const isChinese = (language || "zh") === "zh";
        const safeLanguage = language || "zh";
        const safeTone = tone || "formal";
        // 根据语气选择模板
        const greetings = {
            zh: {
                formal: recipient ? `尊敬的${recipient}：` : "您好：",
                "semi-formal": recipient ? `${recipient}：` : "您好，",
                casual: recipient ? `${recipient}` : "Hi，",
            },
            en: {
                formal: recipient ? `Dear ${recipient},` : "Dear Sir/Madam,",
                "semi-formal": recipient ? `Dear ${recipient},` : "Hello,",
                casual: recipient ? `Hi ${recipient},` : "Hi,",
            },
        };
        const endings = {
            zh: {
                formal: ["此致敬礼", "顺祝商祺", "谨祝工作顺利"],
                "semi-formal": ["祝好", "顺祝安好", "此致"],
                casual: ["祝好", "Best", "Cheers"],
            },
            en: {
                formal: ["Sincerely", "Best regards", "Yours faithfully"],
                "semi-formal": ["Best regards", "Kind regards", "Best wishes"],
                casual: ["Best", "Cheers", "Thanks"],
            },
        };
        const langKey = safeLanguage;
        const toneKey = safeTone;
        const greeting = greetings[langKey][toneKey];
        const ending = endings[langKey][toneKey][0];
        const bodyText = this.generateBodyText(topic, points, safeTone, safeLanguage);
        return `${greeting}\n\n${bodyText}\n\n${ending}\n${sender ? sender : ""}`;
    }
    generateBodyText(topic, points, tone, language) {
        const isChinese = language === "zh";
        if (isChinese) {
            const intro = tone === "formal"
                ? `现就${topic}事宜与您联系，具体内容如下：`
                : tone === "semi-formal"
                    ? `关于${topic}，有几点需要说明：`
                    : `关于${topic}，想跟你说一下：`;
            const body = points.map((p, i) => `${i + 1}. ${p}`).join("\n");
            const outro = tone === "formal"
                ? "\n烦请查阅，如有疑问请随时联系。"
                : tone === "semi-formal"
                    ? "\n如有问题请随时沟通。"
                    : "\n有问题随时找我~";
            return `${intro}\n\n${body}${outro}`;
        }
        else {
            const intro = tone === "formal"
                ? `I am writing regarding ${topic}. Here are the details:`
                : tone === "semi-formal"
                    ? `I wanted to reach out about ${topic}:`
                    : `Just wanted to share about ${topic}:`;
            const body = points.map((p, i) => `${i + 1}. ${p}`).join("\n");
            const outro = tone === "formal"
                ? "\n\nPlease review and let me know if you have any questions."
                : tone === "semi-formal"
                    ? "\n\nFeel free to reach out if you need anything."
                    : "\n\nLet me know if you have any questions!";
            return `${intro}\n\n${body}${outro}`;
        }
    }
    // 将纯文本转换为HTML格式
    generateTextToHtml(subject, textContent, sender, language, template) {
        const isChinese = (language || "zh") === "zh";
        const safeTemplate = template || "default";
        // 解析文本内容
        const lines = textContent.split("\n").filter(l => l.trim());
        const greeting = lines[0] || "";
        const ending = lines[lines.length - 2] || "";
        const signature = lines[lines.length - 1] || "";
        // 找到正文部分
        const bodyStart = 1;
        const bodyEnd = lines.length - 2;
        const bodyLines = lines.slice(bodyStart, bodyEnd);
        // 提取要点列表
        const points = [];
        const otherContent = [];
        bodyLines.forEach(line => {
            const match = line.match(/^\d+\.\s*(.+)$/);
            if (match) {
                points.push(match[1]);
            }
            else if (line.trim()) {
                otherContent.push(line);
            }
        });
        return this.renderHtmlTemplate(safeTemplate, {
            subject,
            greeting,
            intro: otherContent[0] || "",
            points,
            outro: otherContent[otherContent.length - 1] || "",
            ending,
            signature,
            language: isChinese ? "zh" : "en"
        });
    }
    // 渲染HTML模板
    renderHtmlTemplate(template, data) {
        const { subject, greeting, intro, points, outro, ending, signature, language } = data;
        const templates = {
            default: (d) => this.defaultTemplate(d),
            newsletter: (d) => this.newsletterTemplate(d),
            announcement: (d) => this.announcementTemplate(d),
            invitation: (d) => this.invitationTemplate(d),
            notification: (d) => this.notificationTemplate(d),
            marketing: (d) => this.marketingTemplate(d),
        };
        const renderer = templates[template] || templates.default;
        return renderer(data);
    }
    // 默认模板
    defaultTemplate(d) {
        const pointsHtml = d.points.map(p => `<li style="margin-bottom: 8px; color: #374151;">${p}</li>`).join("\n      ");
        return `<!DOCTYPE html>
<html lang="${d.language === "zh" ? "zh-CN" : "en"}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${d.subject}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f3f4f6; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width: 600px; margin: 40px auto; background-color: #ffffff; border-radius: 8px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
    <tr>
      <td style="padding: 40px 40px 20px;">
        <h1 style="margin: 0 0 24px; font-size: 24px; font-weight: 600; color: #111827; border-bottom: 2px solid #2563eb; padding-bottom: 16px;">
          ${d.subject}
        </h1>
        <p style="margin: 0 0 16px; font-size: 16px; color: #374151; line-height: 1.6;">
          ${d.greeting}
        </p>
        ${d.intro ? `<p style="margin: 0 0 20px; font-size: 16px; color: #374151; line-height: 1.6;">${d.intro}</p>` : ""}
        ${d.points.length > 0 ? `
        <ul style="margin: 0 0 20px; padding-left: 24px; font-size: 16px; line-height: 1.6;">
          ${pointsHtml}
        </ul>` : ""}
        ${d.outro ? `<p style="margin: 0 0 20px; font-size: 16px; color: #374151; line-height: 1.6;">${d.outro}</p>` : ""}
      </td>
    </tr>
    <tr>
      <td style="padding: 20px 40px 40px; border-top: 1px solid #e5e7eb;">
        <p style="margin: 0 0 8px; font-size: 16px; color: #374151;">${d.ending}</p>
        <p style="margin: 0; font-size: 16px; font-weight: 500; color: #111827;">${d.signature}</p>
      </td>
    </tr>
  </table>
</body>
</html>`;
    }
    // 新闻通讯模板
    newsletterTemplate(d) {
        const pointsHtml = d.points.map((p, i) => `
      <tr>
        <td style="padding: 16px 0; border-bottom: 1px solid #e5e7eb;">
          <table role="presentation" cellspacing="0" cellpadding="0" width="100%">
            <tr>
              <td width="40" valign="top">
                <div style="width: 32px; height: 32px; background-color: #2563eb; border-radius: 50%; text-align: center; line-height: 32px; color: #ffffff; font-weight: 600; font-size: 14px;">
                  ${i + 1}
                </div>
              </td>
              <td style="padding-left: 12px;">
                <p style="margin: 0; font-size: 15px; color: #374151; line-height: 1.6;">${p}</p>
              </td>
            </tr>
          </table>
        </td>
      </tr>`).join("\n");
        return `<!DOCTYPE html>
<html lang="${d.language === "zh" ? "zh-CN" : "en"}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${d.subject}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #0f172a; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
    <tr>
      <td style="padding: 60px 20px;">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; overflow: hidden;">
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #2563eb 0%, #7c3aed 100%); padding: 40px;">
              <h1 style="margin: 0; font-size: 28px; font-weight: 700; color: #ffffff;">
                📰 ${d.subject}
              </h1>
            </td>
          </tr>
          <!-- Content -->
          <tr>
            <td style="padding: 40px;">
              <p style="margin: 0 0 24px; font-size: 17px; color: #374151; line-height: 1.7;">
                ${d.greeting}
              </p>
              ${d.intro ? `<p style="margin: 0 0 24px; font-size: 17px; color: #374151; line-height: 1.7;">${d.intro}</p>` : ""}
              <table role="presentation" cellspacing="0" cellpadding="0" width="100%">
                ${pointsHtml}
              </table>
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="padding: 24px 40px; background-color: #f8fafc; border-top: 1px solid #e2e8f0;">
              <p style="margin: 0 0 4px; font-size: 15px; color: #64748b;">${d.ending}</p>
              <p style="margin: 0; font-size: 15px; font-weight: 600; color: #1e293b;">${d.signature}</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
    }
    // 公告模板
    announcementTemplate(d) {
        const pointsHtml = d.points.map(p => `<li style="margin-bottom: 12px; color: #1f2937; font-size: 16px;">${p}</li>`).join("\n      ");
        return `<!DOCTYPE html>
<html lang="${d.language === "zh" ? "zh-CN" : "en"}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${d.subject}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #fef3c7; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width: 600px; margin: 40px auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);">
    <!-- Alert Header -->
    <tr>
      <td style="background-color: #f59e0b; padding: 24px 40px;">
        <table role="presentation" cellspacing="0" cellpadding="0" width="100%">
          <tr>
            <td>
              <span style="font-size: 32px;">📢</span>
            </td>
            <td style="padding-left: 16px;">
              <h1 style="margin: 0; font-size: 22px; font-weight: 700; color: #ffffff;">
                ${d.subject}
              </h1>
            </td>
          </tr>
        </table>
      </td>
    </tr>
    <!-- Content -->
    <tr>
      <td style="padding: 40px;">
        <p style="margin: 0 0 20px; font-size: 17px; color: #374151; line-height: 1.7;">
          ${d.greeting}
        </p>
        ${d.intro ? `<p style="margin: 0 0 24px; font-size: 17px; color: #374151; line-height: 1.7; font-weight: 500;">${d.intro}</p>` : ""}
        ${d.points.length > 0 ? `
        <ul style="margin: 0 0 24px; padding-left: 24px; line-height: 1.8;">
          ${pointsHtml}
        </ul>` : ""}
      </td>
    </tr>
    <!-- Footer -->
    <tr>
      <td style="padding: 24px 40px; background-color: #fffbeb; border-top: 2px solid #f59e0b;">
        <p style="margin: 0 0 4px; font-size: 15px; color: #92400e;">${d.ending}</p>
        <p style="margin: 0; font-size: 16px; font-weight: 600; color: #78350f;">${d.signature}</p>
      </td>
    </tr>
  </table>
</body>
</html>`;
    }
    // 邀请函模板
    invitationTemplate(d) {
        const pointsHtml = d.points.map(p => `<li style="margin-bottom: 10px; color: #312e81;">${p}</li>`).join("\n      ");
        return `<!DOCTYPE html>
<html lang="${d.language === "zh" ? "zh-CN" : "en"}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${d.subject}</title>
</head>
<body style="margin: 0; padding: 0; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width: 600px; margin: 60px auto;">
    <tr>
      <td style="background-color: #ffffff; border-radius: 20px; overflow: hidden; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);">
        <!-- Decorative Header -->
        <tr>
          <td style="background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%); padding: 50px 40px; text-align: center;">
            <span style="font-size: 48px;">🎉</span>
            <h1 style="margin: 16px 0 0; font-size: 28px; font-weight: 700; color: #ffffff;">
              ${d.subject}
            </h1>
          </td>
        </tr>
        <!-- Content -->
        <tr>
          <td style="padding: 40px;">
            <p style="margin: 0 0 24px; font-size: 18px; color: #1e1b4b; line-height: 1.7; text-align: center;">
              ${d.greeting}
            </p>
            ${d.intro ? `<p style="margin: 0 0 24px; font-size: 17px; color: #4c1d95; line-height: 1.7; text-align: center;">${d.intro}</p>` : ""}
            ${d.points.length > 0 ? `
            <div style="background-color: #f5f3ff; border-radius: 12px; padding: 24px; margin: 24px 0;">
              <ul style="margin: 0; padding-left: 24px; line-height: 1.8;">
                ${pointsHtml}
              </ul>
            </div>` : ""}
          </td>
        </tr>
        <!-- Footer -->
        <tr>
          <td style="padding: 24px 40px 40px; text-align: center; border-top: 1px solid #e5e7eb;">
            <p style="margin: 0 0 4px; font-size: 16px; color: #6b7280;">${d.ending}</p>
            <p style="margin: 0; font-size: 18px; font-weight: 600; color: #4c1d95;">${d.signature}</p>
          </td>
        </tr>
      </td>
    </tr>
  </table>
</body>
</html>`;
    }
    // 通知模板
    notificationTemplate(d) {
        const pointsHtml = d.points.map(p => `<li style="margin-bottom: 8px; color: #1f2937;">${p}</li>`).join("\n      ");
        return `<!DOCTYPE html>
<html lang="${d.language === "zh" ? "zh-CN" : "en"}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${d.subject}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f3f4f6; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width: 560px; margin: 40px auto; background-color: #ffffff; border-radius: 8px; border-left: 4px solid #2563eb;">
    <tr>
      <td style="padding: 32px;">
        <!-- Header -->
        <table role="presentation" cellspacing="0" cellpadding="0" width="100%">
          <tr>
            <td width="40">
              <div style="width: 36px; height: 36px; background-color: #dbeafe; border-radius: 8px; text-align: center; line-height: 36px;">
                <span style="font-size: 20px;">ℹ️</span>
              </div>
            </td>
            <td style="padding-left: 12px;">
              <h1 style="margin: 0; font-size: 18px; font-weight: 600; color: #111827;">
                ${d.subject}
              </h1>
            </td>
          </tr>
        </table>
        <!-- Content -->
        <p style="margin: 20px 0 16px; font-size: 15px; color: #374151; line-height: 1.6;">
          ${d.greeting}
        </p>
        ${d.intro ? `<p style="margin: 0 0 16px; font-size: 15px; color: #374151; line-height: 1.6;">${d.intro}</p>` : ""}
        ${d.points.length > 0 ? `
        <ul style="margin: 0 0 16px; padding-left: 20px; font-size: 15px; line-height: 1.6;">
          ${pointsHtml}
        </ul>` : ""}
        <!-- Footer -->
        <p style="margin: 16px 0 0; font-size: 14px; color: #6b7280;">
          ${d.ending} <strong style="color: #374151;">${d.signature}</strong>
        </p>
      </td>
    </tr>
  </table>
</body>
</html>`;
    }
    // 营销模板
    marketingTemplate(d) {
        const pointsHtml = d.points.map(p => `
      <tr>
        <td style="padding: 12px 0;">
          <p style="margin: 0; font-size: 16px; color: #374151; line-height: 1.6;">✓ ${p}</p>
        </td>
      </tr>`).join("\n");
        return `<!DOCTYPE html>
<html lang="${d.language === "zh" ? "zh-CN" : "en"}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${d.subject}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #0f172a; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
    <tr>
      <td style="padding: 60px 20px;">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 20px; overflow: hidden; box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.3);">
          <!-- Hero Section -->
          <tr>
            <td style="background: linear-gradient(135deg, #2563eb 0%, #7c3aed 50%, #ec4899 100%); padding: 60px 40px; text-align: center;">
              <h1 style="margin: 0; font-size: 32px; font-weight: 800; color: #ffffff; text-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                ${d.subject}
              </h1>
            </td>
          </tr>
          <!-- Content -->
          <tr>
            <td style="padding: 48px 40px;">
              <p style="margin: 0 0 24px; font-size: 18px; color: #111827; line-height: 1.7; text-align: center;">
                ${d.greeting}
              </p>
              ${d.intro ? `<p style="margin: 0 0 24px; font-size: 17px; color: #4b5563; line-height: 1.7; text-align: center;">${d.intro}</p>` : ""}
              ${d.points.length > 0 ? `
              <table role="presentation" cellspacing="0" cellpadding="0" width="100%" style="margin: 24px 0; background-color: #f8fafc; border-radius: 12px; padding: 20px;">
                ${pointsHtml}
              </table>` : ""}
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="padding: 32px 40px; background-color: #f1f5f9; text-align: center;">
              <p style="margin: 0 0 4px; font-size: 16px; color: #64748b;">${d.ending}</p>
              <p style="margin: 0; font-size: 18px; font-weight: 600; color: #1e293b;">${d.signature}</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
    }
    // 生成完整的HTML邮件（新工具专用）
    generateHtmlEmail(title, headline, content, ctaText, ctaLink, template, language, senderName, senderLogo, primaryColor) {
        const isChinese = (language || "zh") === "zh";
        const color = primaryColor || "#2563eb";
        // 生成预览文本
        const preview = content ? content.substring(0, 100) + "..." : "";
        const html = `<!DOCTYPE html>
<html lang="${isChinese ? "zh-CN" : "en"}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="x-apple-disable-message-reformatting">
  <title>${title}</title>
  <!--[if mso]>
  <style type="text/css">
    table {border-collapse: collapse;}
    .mso-padding-alt {padding: 0 !important;}
  </style>
  <![endif]-->
</head>
<body style="margin: 0; padding: 0; background-color: #f3f4f6; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
  <!-- Preview Text -->
  <div style="display: none; max-height: 0; overflow: hidden;">
    ${preview}
  </div>
  
  <!-- Email Container -->
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #f3f4f6;">
    <tr>
      <td style="padding: 40px 20px;">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);">
          
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, ${color} 0%, ${this.adjustColor(color, -20)} 100%); padding: 48px 40px; text-align: center;">
              ${senderLogo ? `<img src="${senderLogo}" alt="${senderName || "Logo"}" style="max-width: 120px; height: auto; margin-bottom: 24px; display: block; margin-left: auto; margin-right: auto;">` : ""}
              <h1 style="margin: 0; font-size: 28px; font-weight: 700; color: #ffffff;">
                ${headline || title}
              </h1>
            </td>
          </tr>
          
          <!-- Content -->
          <tr>
            <td style="padding: 48px 40px;">
              ${content ? `
              <div style="font-size: 17px; color: #374151; line-height: 1.8;">
                ${content.replace(/\n/g, "<br>")}
              </div>` : ""}
              
              ${ctaText && ctaLink ? `
              <!-- CTA Button -->
              <div style="text-align: center; margin-top: 40px;">
                <a href="${ctaLink}" style="display: inline-block; padding: 16px 40px; background: linear-gradient(135deg, ${color} 0%, ${this.adjustColor(color, -20)} 100%); color: #ffffff; text-decoration: none; font-size: 16px; font-weight: 600; border-radius: 8px; box-shadow: 0 4px 14px 0 rgba(37, 99, 235, 0.39);">
                  ${ctaText}
                </a>
              </div>` : ""}
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="padding: 32px 40px; background-color: #f8fafc; border-top: 1px solid #e5e7eb; text-align: center;">
              ${senderName ? `
              <p style="margin: 0 0 8px; font-size: 15px; font-weight: 600; color: #111827;">
                ${senderName}
              </p>` : ""}
              <p style="margin: 0; font-size: 14px; color: #6b7280;">
                ${isChinese ? "此邮件由系统自动发送，请勿直接回复。" : "This email was automatically sent. Please do not reply directly."}
              </p>
              <p style="margin: 12px 0 0; font-size: 13px; color: #9ca3af;">
                © ${new Date().getFullYear()} ${senderName || "Company"}. All rights reserved.
              </p>
            </td>
          </tr>
          
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
        return {
            subject: title,
            html,
            preview,
            metadata: {
                title,
                headline,
                template: template || "default",
                language: language || "zh",
                has_cta: !!(ctaText && ctaLink),
                primary_color: color,
                generated_at: new Date().toISOString(),
            },
        };
    }
    // 调整颜色明暗
    adjustColor(hex, amount) {
        const num = parseInt(hex.replace("#", ""), 16);
        const r = Math.min(255, Math.max(0, (num >> 16) + amount));
        const g = Math.min(255, Math.max(0, ((num >> 8) & 0x00ff) + amount));
        const b = Math.min(255, Math.max(0, (num & 0x0000ff) + amount));
        return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, "0")}`;
    }
    // 生成回复邮件
    generateReplyContent(originalEmail, replyPoints, replyType, tone, format) {
        const replyTypeMessages = {
            accept: "感谢您的来信，我已收到并同意您提出的建议。",
            decline: "感谢您的来信，经过考虑，很抱歉无法满足您的要求。",
            request_info: "感谢您的来信，为了更好地处理您的请求，我需要了解更多信息。",
            confirm: "感谢您的来信，我确认收到并同意相关安排。",
            custom: "感谢您的来信。",
        };
        const intro = replyTypeMessages[replyType] || replyTypeMessages.custom;
        const body = replyPoints.length > 0
            ? `\n\n关于您的邮件，有以下几点说明：\n${replyPoints.map((p, i) => `${i + 1}. ${p}`).join("\n")}`
            : "";
        const ending = tone === "formal" ? "此致敬礼" : "祝好";
        const textContent = `${intro}${body}\n\n${ending}`;
        const result = {
            subject: "回复：" + (originalEmail.substring(0, 30) + "..."),
            metadata: {
                reply_type: replyType,
                tone,
                format,
                points_count: replyPoints.length,
                generated_at: new Date().toISOString(),
            },
        };
        if (format === "text" || format === "both") {
            result.text = textContent;
        }
        if (format === "html" || format === "both") {
            result.html = this.generateTextToHtml(result.subject, textContent, undefined, "zh", "notification");
        }
        return result;
    }
    // 润色邮件
    polishEmailContent(emailContent, polishType, language, format) {
        const suggestions = {
            professional: language === "zh"
                ? ["使用更正式的词汇", "避免口语化表达", "增加适当的敬语", "使用完整的句子结构"]
                : ["Use formal vocabulary", "Avoid colloquialisms", "Add appropriate honorifics", "Use complete sentence structures"],
            friendly: language === "zh"
                ? ["使用更温和的语气", "增加问候语", "使用积极的词汇", "适当使用表情符号"]
                : ["Use warmer tone", "Add greetings", "Use positive vocabulary", "Consider appropriate emojis"],
            concise: language === "zh"
                ? ["删除冗余内容", "简化句式", "突出重点", "使用要点列表"]
                : ["Remove redundancy", "Simplify sentences", "Highlight key points", "Use bullet points"],
            detailed: language === "zh"
                ? ["补充更多细节", "增加背景说明", "提供具体例子", "添加数据支持"]
                : ["Add more details", "Include background info", "Provide examples", "Add supporting data"],
        };
        const result = {
            original: emailContent,
            suggestions: suggestions[polishType] || suggestions.professional,
        };
        // 模拟润色后的内容
        const polishedText = `[润色后] ${emailContent}`;
        if (format === "text" || format === "both") {
            result.text = polishedText;
        }
        if (format === "html" || format === "both") {
            result.html = this.generateTextToHtml("润色邮件", polishedText, undefined, language, "default");
        }
        return result;
    }
    async run() {
        const transport = new StdioServerTransport();
        await this.server.connect(transport);
        console.error("MCP Email Generator Server v2.0 running on stdio");
    }
}
// 启动服务
const server = new EmailGeneratorServer();
server.run().catch(console.error);
