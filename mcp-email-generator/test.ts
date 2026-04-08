import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";
import { writeFileSync } from "fs";

async function test() {
  console.log("🚀 启动 MCP Email Generator v2.0 测试...\n");

  const transport = new StdioClientTransport({
    command: "node",
    args: ["dist/index.js"],
  });

  const client = new Client(
    { name: "test-client", version: "2.0.0" },
    { capabilities: {} }
  );

  await client.connect(transport);
  console.log("✅ MCP 服务连接成功\n");

  // 测试1: 生成纯文本邮件
  console.log("📝 测试1: 生成纯文本邮件");
  const result1 = await client.callTool({
    name: "generate_email",
    arguments: {
      topic: "请假申请",
      points: ["请假3天（3月20日-3月22日）", "原因是家中有事需要处理", "工作已交接给同事王明"],
      tone: "formal",
      recipient: "王经理",
      sender: "张三",
      language: "zh",
      format: "text",
    },
  });
  const email1 = JSON.parse((result1.content as any)[0].text);
  console.log(`   ✅ 主题: ${email1.subject}`);
  console.log(`   ✅ 纯文本长度: ${email1.text.length} 字符\n`);

  // 测试2: 生成HTML格式邮件
  console.log("📝 测试2: 生成HTML格式邮件");
  const result2 = await client.callTool({
    name: "generate_email",
    arguments: {
      topic: "项目进度汇报",
      points: ["本周完成了用户模块开发", "下周计划完成订单模块", "需要协调测试资源"],
      tone: "formal",
      recipient: "李总",
      sender: "项目组",
      language: "zh",
      format: "html",
      template: "newsletter",
    },
  });
  const email2 = JSON.parse((result2.content as any)[0].text);
  console.log(`   ✅ 主题: ${email2.subject}`);
  console.log(`   ✅ HTML长度: ${email2.html.length} 字符`);
  writeFileSync("test-newsletter.html", email2.html);
  console.log(`   ✅ 已保存到 test-newsletter.html\n`);

  // 测试3: 同时生成文本和HTML
  console.log("📝 测试3: 同时生成文本和HTML");
  const result3 = await client.callTool({
    name: "generate_email",
    arguments: {
      topic: "年会邀请",
      points: ["时间：2026年1月20日 18:00", "地点：北京国际酒店宴会厅", "请于1月15日前确认出席"],
      tone: "semi-formal",
      recipient: "各位同事",
      sender: "人力资源部",
      language: "zh",
      format: "both",
      template: "invitation",
    },
  });
  const email3 = JSON.parse((result3.content as any)[0].text);
  console.log(`   ✅ 主题: ${email3.subject}`);
  console.log(`   ✅ 纯文本长度: ${email3.text.length} 字符`);
  console.log(`   ✅ HTML长度: ${email3.html.length} 字符`);
  writeFileSync("test-invitation.html", email3.html);
  console.log(`   ✅ 已保存到 test-invitation.html\n`);

  // 测试4: 使用公告模板
  console.log("📝 测试4: 公告模板");
  const result4 = await client.callTool({
    name: "generate_email",
    arguments: {
      topic: "系统维护通知",
      points: ["维护时间：3月25日 00:00-06:00", "影响范围：所有线上服务", "请提前保存工作内容"],
      tone: "formal",
      recipient: "全体员工",
      sender: "IT部门",
      language: "zh",
      format: "html",
      template: "announcement",
    },
  });
  const email4 = JSON.parse((result4.content as any)[0].text);
  writeFileSync("test-announcement.html", email4.html);
  console.log(`   ✅ 已保存到 test-announcement.html\n`);

  // 测试5: 使用营销模板
  console.log("📝 测试5: 营销模板");
  const result5 = await client.callTool({
    name: "generate_email",
    arguments: {
      topic: "春季促销活动",
      points: ["全场商品8折优惠", "新用户首单立减50元", "活动时间：3月20日-3月31日"],
      tone: "casual",
      recipient: "亲爱的用户",
      sender: "XX商城",
      language: "zh",
      format: "html",
      template: "marketing",
    },
  });
  const email5 = JSON.parse((result5.content as any)[0].text);
  writeFileSync("test-marketing.html", email5.html);
  console.log(`   ✅ 已保存到 test-marketing.html\n`);

  // 测试6: 生成完整HTML邮件（新工具）
  console.log("📝 测试6: generate_html_email 工具");
  const result6 = await client.callTool({
    name: "generate_html_email",
    arguments: {
      title: "产品更新通知",
      headline: "全新功能上线啦！",
      content: "亲爱的用户，\n\n我们很高兴地宣布，新版本的AI助手功能已经正式上线！主要更新包括：\n\n• 更智能的对话理解\n• 支持多轮上下文记忆\n• 全新的UI界面\n• 响应速度提升50%",
      cta_text: "立即体验",
      cta_link: "https://example.com/try",
      template: "newsletter",
      language: "zh",
      sender_name: "AI助手团队",
      primary_color: "#8b5cf6",
    },
  });
  const email6 = JSON.parse((result6.content as any)[0].text);
  console.log(`   ✅ 主题: ${email6.subject}`);
  console.log(`   ✅ HTML长度: ${email6.html.length} 字符`);
  writeFileSync("test-html-email.html", email6.html);
  console.log(`   ✅ 已保存到 test-html-email.html\n`);

  // 测试7: 英文邮件
  console.log("📝 测试7: 英文HTML邮件");
  const result7 = await client.callTool({
    name: "generate_email",
    arguments: {
      topic: "Partnership Proposal",
      points: ["We propose a strategic alliance", "Mutual benefits for both parties", "Let's schedule a meeting next week"],
      tone: "formal",
      recipient: "Mr. Johnson",
      sender: "Business Development Team",
      language: "en",
      format: "html",
      template: "default",
    },
  });
  const email7 = JSON.parse((result7.content as any)[0].text);
  writeFileSync("test-english.html", email7.html);
  console.log(`   ✅ 已保存到 test-english.html\n`);

  // 测试8: 回复邮件（HTML格式）
  console.log("📝 测试8: 回复邮件（HTML格式）");
  const result8 = await client.callTool({
    name: "generate_reply_email",
    arguments: {
      original_email: "王经理邀请你参加周五的项目评审会议，请确认是否参加。",
      reply_type: "accept",
      reply_points: ["我会准时参加", "已准备好项目报告", "会提前10分钟到场"],
      tone: "formal",
      format: "html",
    },
  });
  const email8 = JSON.parse((result8.content as any)[0].text);
  writeFileSync("test-reply.html", email8.html);
  console.log(`   ✅ 已保存到 test-reply.html\n`);

  // 测试9: 润色邮件（HTML格式）
  console.log("📝 测试9: 润色邮件（HTML格式）");
  const result9 = await client.callTool({
    name: "polish_email",
    arguments: {
      email_content: "老板好，我想请假几天，家里有事，谢谢。",
      polish_type: "professional",
      language: "zh",
      format: "both",
    },
  });
  const email9 = JSON.parse((result9.content as any)[0].text);
  console.log(`   ✅ 原文: ${email9.original}`);
  console.log(`   ✅ 润色后: ${email9.text}`);
  console.log(`   ✅ 建议: ${email9.suggestions.join(", ")}\n`);

  console.log("✅ 所有测试通过！\n");
  console.log("📁 生成的HTML文件：");
  console.log("   - test-newsletter.html");
  console.log("   - test-invitation.html");
  console.log("   - test-announcement.html");
  console.log("   - test-marketing.html");
  console.log("   - test-html-email.html");
  console.log("   - test-english.html");
  console.log("   - test-reply.html");
  
  await client.close();
  process.exit(0);
}

test().catch((err) => {
  console.error("❌ 测试失败:", err);
  process.exit(1);
});
