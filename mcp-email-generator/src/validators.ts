// HTML 邮件质量检测模块

export interface ValidationResult {
  passed: boolean;
  score: number; // 0-100
  categories: {
    links: CategoryResult;
    text: CategoryResult;
    images: CategoryResult;
    html: CategoryResult;
    spam: CategoryResult;
  };
  issues: Issue[];
  suggestions: string[];
  summary: string;
}

export interface CategoryResult {
  score: number;
  status: "pass" | "warning" | "fail";
  checks: CheckResult[];
}

export interface CheckResult {
  name: string;
  passed: boolean;
  message: string;
  details?: any;
}

export interface Issue {
  severity: "error" | "warning" | "info";
  category: string;
  message: string;
  location?: string;
  fix?: string;
}

// 主检测函数
export function validateEmailHtml(html: string, subject?: string): ValidationResult {
  const issues: Issue[] = [];
  const suggestions: string[] = [];

  // 各类检测
  const links = validateLinks(html, issues, suggestions);
  const text = validateText(html, subject, issues, suggestions);
  const images = validateImages(html, issues, suggestions);
  const htmlCheck = validateHtmlStructure(html, issues, suggestions);
  const spam = validateSpamScore(html, subject, issues, suggestions);

  // 计算总分
  const totalScore = Math.round(
    (links.score * 0.2 + text.score * 0.25 + images.score * 0.15 + htmlCheck.score * 0.2 + spam.score * 0.2)
  );

  const passed = totalScore >= 60 && issues.filter(i => i.severity === "error").length === 0;

  // 生成摘要
  const summary = generateSummary(totalScore, issues);

  return {
    passed,
    score: totalScore,
    categories: { links, text, images, html: htmlCheck, spam },
    issues,
    suggestions,
    summary,
  };
}

// 链接检测
function validateLinks(html: string, issues: Issue[], suggestions: string[]): CategoryResult {
  const checks: CheckResult[] = [];
  let score = 100;

  // 1. 检测链接数量
  const linkRegex = /<a[^>]+href=["']([^"']+)["'][^>]*>/gi;
  const links = [...html.matchAll(linkRegex)].map(m => m[1]);
  const linkCount = links.length;

  checks.push({
    name: "链接数量",
    passed: linkCount > 0 && linkCount <= 10,
    message: linkCount === 0 
      ? "未发现链接，建议添加至少1个链接" 
      : linkCount > 10 
        ? `链接过多(${linkCount}个)，可能影响用户体验`
        : `发现 ${linkCount} 个链接`,
    details: { count: linkCount }
  });
  if (linkCount === 0) score -= 10;
  if (linkCount > 10) score -= 5;

  // 2. 检测链接格式
  const invalidLinks = links.filter(link => {
    return !link.startsWith('http://') && 
           !link.startsWith('https://') && 
           !link.startsWith('mailto:') &&
           !link.startsWith('tel:') &&
           link !== '#';
  });

  checks.push({
    name: "链接格式",
    passed: invalidLinks.length === 0,
    message: invalidLinks.length === 0 
      ? "所有链接格式正确" 
      : `发现 ${invalidLinks.length} 个格式异常的链接`,
    details: { invalidLinks: invalidLinks.slice(0, 5) }
  });
  if (invalidLinks.length > 0) {
    score -= 15;
    issues.push({
      severity: "error",
      category: "links",
      message: "发现无效链接格式",
      location: invalidLinks[0],
      fix: "使用完整的 URL 格式，如 https://example.com"
    });
  }

  // 3. 检测链接文本
  const linkTextRegex = /<a[^>]*>([^<]*)<\/a>/gi;
  const linkTexts = [...html.matchAll(linkTextRegex)].map(m => m[1].trim());
  const badLinkTexts = linkTexts.filter(text => 
    text.toLowerCase() === 'click here' || 
    text.toLowerCase() === '点击这里' ||
    text.toLowerCase() === 'here' ||
    text === ''
  );

  checks.push({
    name: "链接文本",
    passed: badLinkTexts.length === 0,
    message: badLinkTexts.length === 0 
      ? "链接文本描述清晰" 
      : `发现 ${badLinkTexts.length} 个模糊的链接文本（如"点击这里"）`,
    details: { examples: badLinkTexts.slice(0, 3) }
  });
  if (badLinkTexts.length > 0) {
    score -= 10;
    issues.push({
      severity: "warning",
      category: "links",
      message: "链接文本不够描述性",
      fix: "使用描述性的链接文本，如'查看详情'而非'点击这里'"
    });
    suggestions.push("避免使用'点击这里'等模糊的链接文本，改用描述性文本");
  }

  // 4. 检测跟踪参数
  const trackingParams = ['utm_source', 'utm_medium', 'utm_campaign', 'fbclid', 'gclid'];
  const linksWithTracking = links.filter(link => 
    trackingParams.some(param => link.includes(param))
  );

  checks.push({
    name: "跟踪参数",
    passed: true,
    message: linksWithTracking.length > 0 
      ? `${linksWithTracking.length} 个链接包含跟踪参数` 
      : "未检测到跟踪参数",
    details: { trackingLinks: linksWithTracking.length }
  });

  // 5. 检测短链接
  const shortenerDomains = ['bit.ly', 't.cn', 'tinyurl.com', 'goo.gl', 'dwz.cn'];
  const shortLinks = links.filter(link => 
    shortenerDomains.some(domain => link.includes(domain))
  );

  checks.push({
    name: "短链接检测",
    passed: shortLinks.length === 0,
    message: shortLinks.length === 0 
      ? "未使用短链接服务" 
      : `发现 ${shortLinks.length} 个短链接，可能影响信任度`,
    details: { shortLinks: shortLinks.slice(0, 3) }
  });
  if (shortLinks.length > 0) {
    score -= 5;
    suggestions.push("短链接可能降低邮件信任度，建议使用完整URL");
  }

  return {
    score: Math.max(0, score),
    status: score >= 80 ? "pass" : score >= 60 ? "warning" : "fail",
    checks
  };
}

// 文本检测
function validateText(html: string, subject: string | undefined, issues: Issue[], suggestions: string[]): CategoryResult {
  const checks: CheckResult[] = [];
  let score = 100;

  // 提取纯文本
  const textOnly = html
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  // 1. 文本长度
  const textLength = textOnly.length;
  checks.push({
    name: "文本长度",
    passed: textLength >= 50 && textLength <= 5000,
    message: textLength < 50 
      ? "文本内容过短，可能信息不足" 
      : textLength > 5000 
        ? "文本内容过长，建议精简" 
        : `文本长度适中 (${textLength} 字符)`,
    details: { length: textLength }
  });
  if (textLength < 50) score -= 20;
  if (textLength > 5000) score -= 10;

  // 2. 主题行检测
  if (subject) {
    const subjectLength = subject.length;
    checks.push({
      name: "主题行长度",
      passed: subjectLength >= 5 && subjectLength <= 60,
      message: subjectLength < 5 
        ? "主题行过短" 
        : subjectLength > 60 
          ? "主题行过长，可能被截断" 
          : `主题行长度合适 (${subjectLength} 字符)`,
      details: { subject, length: subjectLength }
    });
    if (subjectLength < 5 || subjectLength > 60) score -= 10;

    // 主题中的垃圾词汇
    const spamWords = ['免费', '中奖', '优惠', '折扣', '限时', 'free', 'winner', 'discount', 'limited'];
    const subjectSpamWords = spamWords.filter(word => subject.toLowerCase().includes(word));
    checks.push({
      name: "主题行垃圾词检测",
      passed: subjectSpamWords.length === 0,
      message: subjectSpamWords.length === 0 
        ? "主题行未发现垃圾词汇" 
        : `主题行包含 ${subjectSpamWords.length} 个可能触发垃圾过滤的词汇`,
      details: { words: subjectSpamWords }
    });
    if (subjectSpamWords.length > 0) score -= 15;
  }

  // 3. 文本与HTML比例
  const htmlLength = html.length;
  const textRatio = htmlLength > 0 ? (textLength / htmlLength) * 100 : 0;

  checks.push({
    name: "文本/HTML比例",
    passed: textRatio >= 20,
    message: textRatio < 20 
      ? `文本比例过低 (${textRatio.toFixed(1)}%)，可能影响垃圾邮件评分` 
      : `文本比例良好 (${textRatio.toFixed(1)}%)`,
    details: { ratio: textRatio }
  });
  if (textRatio < 20) {
    score -= 15;
    issues.push({
      severity: "warning",
      category: "text",
      message: "文本内容比例过低",
      fix: "增加有意义的文本内容，减少不必要的HTML标签"
    });
  }

  // 4. 垃圾词汇检测（正文）
  const spamPatterns = [
    { pattern: /免费/gi, name: "免费" },
    { pattern: /中奖/gi, name: "中奖" },
    { pattern: /点击这里|点击下方/gi, name: "点击引导" },
    { pattern: /限时优惠/gi, name: "限时优惠" },
    { pattern: /先到先得/gi, name: "先到先得" },
    { pattern: /\$+\d+/g, name: "金额符号" },
    { pattern: /!!!+/g, name: "过多感叹号" },
    { pattern: /\?\?\?+/g, name: "过多问号" },
  ];

  const foundSpamPatterns: { name: string; count: number }[] = [];
  spamPatterns.forEach(({ pattern, name }) => {
    const matches = textOnly.match(pattern);
    if (matches && matches.length > 0) {
      foundSpamPatterns.push({ name, count: matches.length });
    }
  });

  checks.push({
    name: "垃圾词汇检测",
    passed: foundSpamPatterns.length === 0,
    message: foundSpamPatterns.length === 0 
      ? "未发现垃圾词汇模式" 
      : `发现 ${foundSpamPatterns.length} 种垃圾词汇模式`,
    details: { patterns: foundSpamPatterns }
  });
  if (foundSpamPatterns.length > 0) {
    score -= foundSpamPatterns.length * 5;
    suggestions.push("避免使用营销敏感词汇，如'免费''中奖'等");
  }

  // 5. 拼写检查（简单的重复词检测）
  const words = textOnly.split(/\s+/).filter(w => w.length > 2);
  const wordCount = words.length;
  const uniqueWords = new Set(words.map(w => w.toLowerCase()));
  
  checks.push({
    name: "词汇丰富度",
    passed: uniqueWords.size / wordCount >= 0.3,
    message: `文本包含 ${wordCount} 个词，其中 ${uniqueWords.size} 个独特词汇`,
    details: { total: wordCount, unique: uniqueWords.size, ratio: (uniqueWords.size / wordCount).toFixed(2) }
  });

  // 6. 可读性检测（段落和换行）
  const paragraphs = textOnly.split(/\n+/).filter(p => p.trim().length > 0);
  const avgParagraphLength = paragraphs.length > 0 
    ? textLength / paragraphs.length 
    : textLength;

  checks.push({
    name: "段落结构",
    passed: paragraphs.length >= 1 && avgParagraphLength < 500,
    message: paragraphs.length === 0 
      ? "未检测到段落结构" 
      : `共 ${paragraphs.length} 个段落，平均 ${Math.round(avgParagraphLength)} 字符/段落`,
    details: { paragraphCount: paragraphs.length, avgLength: Math.round(avgParagraphLength) }
  });
  if (avgParagraphLength > 500) {
    score -= 5;
    suggestions.push("适当分段，提高可读性");
  }

  return {
    score: Math.max(0, score),
    status: score >= 80 ? "pass" : score >= 60 ? "warning" : "fail",
    checks
  };
}

// 图片检测
function validateImages(html: string, issues: Issue[], suggestions: string[]): CategoryResult {
  const checks: CheckResult[] = [];
  let score = 100;

  // 1. 检测图片数量
  const imgRegex = /<img[^>]+>/gi;
  const images = [...html.matchAll(imgRegex)];
  const imageCount = images.length;

  checks.push({
    name: "图片数量",
    passed: imageCount <= 5,
    message: imageCount === 0 
      ? "未使用图片" 
      : imageCount > 5 
        ? `图片过多 (${imageCount} 张)，可能影响加载速度` 
        : `图片数量适中 (${imageCount} 张)`,
    details: { count: imageCount }
  });
  if (imageCount > 5) score -= 10;

  // 2. 检测 alt 属性
  const imagesWithoutAlt = images.filter(img => {
    const imgTag = img[0];
    return !/alt\s*=/i.test(imgTag) || /alt\s*=\s*["']\s*["']/i.test(imgTag);
  });

  checks.push({
    name: "Alt 属性",
    passed: imagesWithoutAlt.length === 0,
    message: imageCount === 0 
      ? "无图片需要检测" 
      : imagesWithoutAlt.length === 0 
        ? "所有图片都有 alt 属性" 
        : `${imagesWithoutAlt.length} 张图片缺少 alt 属性`,
    details: { missingAlt: imagesWithoutAlt.length }
  });
  if (imagesWithoutAlt.length > 0) {
    score -= imagesWithoutAlt.length * 10;
    issues.push({
      severity: "warning",
      category: "images",
      message: "图片缺少 alt 属性",
      fix: "为所有图片添加描述性的 alt 属性，提高可访问性"
    });
    suggestions.push("为图片添加 alt 属性，提高可访问性和 SEO");
  }

  // 3. 检测图片尺寸属性
  const imagesWithoutSize = images.filter(img => {
    const imgTag = img[0];
    return !/width\s*=/i.test(imgTag) || !/height\s*=/i.test(imgTag);
  });

  checks.push({
    name: "尺寸属性",
    passed: imagesWithoutSize.length === 0 || imageCount === 0,
    message: imagesWithoutSize.length === 0 || imageCount === 0
      ? "图片尺寸定义完整" 
      : `${imagesWithoutSize.length} 张图片未定义宽高`,
    details: { missingSize: imagesWithoutSize.length }
  });
  if (imagesWithoutSize.length > 0 && imageCount > 0) {
    score -= 5;
    suggestions.push("为图片设置宽高属性，避免布局抖动");
  }

  // 4. 检测图片格式和来源
  const imageSrcs = images.map(img => {
    const srcMatch = img[0].match(/src\s*=\s*["']([^"']+)["']/i);
    return srcMatch ? srcMatch[1] : '';
  }).filter(Boolean);

  const externalImages = imageSrcs.filter(src => src.startsWith('http'));
  const base64Images = imageSrcs.filter(src => src.startsWith('data:'));
  const largeImages = base64Images.filter(src => src.length > 50000);

  checks.push({
    name: "图片来源",
    passed: base64Images.length === 0,
    message: base64Images.length === 0 
      ? "图片使用外部链接" 
      : largeImages.length > 0 
        ? `发现 ${largeImages.length} 个大型 Base64 内嵌图片，建议使用外部链接` 
        : "使用 Base64 内嵌图片",
    details: { external: externalImages.length, base64: base64Images.length, largeBase64: largeImages.length }
  });
  if (largeImages.length > 0) {
    score -= 15;
    issues.push({
      severity: "warning",
      category: "images",
      message: "Base64 图片过大",
      fix: "将大图片托管到 CDN，使用 URL 引用"
    });
  }

  // 5. 检测图片格式
  const imageFormats: Record<string, number> = {};
  imageSrcs.forEach(src => {
    const ext = src.split('.').pop()?.toLowerCase() || 'unknown';
    const format = ext.match(/^(jpg|jpeg|png|gif|webp|svg)/) ? ext : 'unknown';
    imageFormats[format] = (imageFormats[format] || 0) + 1;
  });

  checks.push({
    name: "图片格式",
    passed: true,
    message: Object.keys(imageFormats).length > 0 
      ? `使用格式: ${Object.entries(imageFormats).map(([f, c]) => `${f}(${c})`).join(', ')}` 
      : "无图片",
    details: { formats: imageFormats }
  });

  // 6. 背景图片检测
  const bgImages = html.match(/background(-image)?:\s*url\([^)]+\)/gi) || [];
  checks.push({
    name: "背景图片",
    passed: bgImages.length <= 3,
    message: bgImages.length === 0 
      ? "未使用背景图片" 
      : `使用 ${bgImages.length} 个背景图片`,
    details: { count: bgImages.length }
  });

  return {
    score: Math.max(0, score),
    status: score >= 80 ? "pass" : score >= 60 ? "warning" : "fail",
    checks
  };
}

// HTML 结构检测
function validateHtmlStructure(html: string, issues: Issue[], suggestions: string[]): CategoryResult {
  const checks: CheckResult[] = [];
  let score = 100;

  // 1. DOCTYPE 检测
  const hasDoctype = /<!DOCTYPE\s+html/i.test(html);
  checks.push({
    name: "DOCTYPE 声明",
    passed: hasDoctype,
    message: hasDoctype ? "包含正确的 DOCTYPE 声明" : "缺少 DOCTYPE 声明",
  });
  if (!hasDoctype) {
    score -= 5;
    suggestions.push("添加 <!DOCTYPE html> 声明");
  }

  // 2. 字符编码
  const hasCharset = /<meta[^>]+charset/i.test(html) || /<meta[^>]+content\s*=\s*["'][^"']*charset/i.test(html);
  checks.push({
    name: "字符编码",
    passed: hasCharset,
    message: hasCharset ? "已定义字符编码" : "未定义字符编码，可能导致乱码",
  });
  if (!hasCharset) {
    score -= 10;
    issues.push({
      severity: "warning",
      category: "html",
      message: "缺少字符编码声明",
      fix: "添加 <meta charset=\"UTF-8\">"
    });
  }

  // 3. 内联样式检测
  const styleAttrs = html.match(/\sstyle\s*=\s*["'][^"']+["']/gi) || [];
  const styleTags = html.match(/<style[^>]*>[\s\S]*?<\/style>/gi) || [];

  checks.push({
    name: "样式使用",
    passed: styleAttrs.length <= 50,
    message: `内联样式属性: ${styleAttrs.length} 个，样式标签: ${styleTags.length} 个`,
    details: { inlineStyles: styleAttrs.length, styleTags: styleTags.length }
  });
  if (styleAttrs.length > 50) {
    score -= 5;
    suggestions.push("考虑合并内联样式，减少代码量");
  }

  // 4. 表格布局检测
  const tables = html.match(/<table[^>]*>/gi) || [];
  checks.push({
    name: "表格布局",
    passed: true,
    message: `使用 ${tables.length} 个表格元素（邮件推荐使用表格布局）`,
    details: { tableCount: tables.length }
  });

  // 5. 响应式设计检测
  const hasViewport = /<meta[^>]+viewport/i.test(html);
  const hasMediaQuery = /@media/i.test(html);
  
  checks.push({
    name: "响应式支持",
    passed: hasViewport || hasMediaQuery,
    message: hasViewport 
      ? "包含 viewport 设置" 
      : hasMediaQuery 
        ? "包含媒体查询" 
        : "未检测到响应式设计支持",
    details: { hasViewport, hasMediaQuery }
  });
  if (!hasViewport && !hasMediaQuery) {
    score -= 5;
    suggestions.push("添加 viewport meta 标签支持移动端显示");
  }

  // 6. 无效/废弃标签检测
  const deprecatedTags = ['font', 'center', 'marquee', 'blink'];
  const foundDeprecated: string[] = [];
  deprecatedTags.forEach(tag => {
    if (new RegExp(`<${tag}[^>]*>`, 'i').test(html)) {
      foundDeprecated.push(tag);
    }
  });

  checks.push({
    name: "废弃标签检测",
    passed: foundDeprecated.length === 0,
    message: foundDeprecated.length === 0 
      ? "未使用废弃标签" 
      : `发现废弃标签: ${foundDeprecated.join(', ')}`,
    details: { deprecated: foundDeprecated }
  });
  if (foundDeprecated.length > 0) {
    score -= 10;
    issues.push({
      severity: "warning",
      category: "html",
      message: "使用了废弃的 HTML 标签",
      fix: "使用 CSS 样式替代废弃标签"
    });
  }

  // 7. HTML 大小检测
  const htmlSize = html.length;
  checks.push({
    name: "HTML 大小",
    passed: htmlSize <= 102400, // 100KB
    message: htmlSize <= 102400 
      ? `HTML 大小: ${(htmlSize / 1024).toFixed(1)} KB` 
      : `HTML 过大: ${(htmlSize / 1024).toFixed(1)} KB，可能被邮件客户端截断`,
    details: { size: htmlSize, sizeKB: (htmlSize / 1024).toFixed(1) }
  });
  if (htmlSize > 102400) {
    score -= 15;
    issues.push({
      severity: "warning",
      category: "html",
      message: "HTML 文件过大",
      fix: "精简代码，移除不必要的样式和内容"
    });
  }

  // 8. 脚本检测（邮件不支持）
  const scripts = html.match(/<script[^>]*>[\s\S]*?<\/script>/gi) || [];
  checks.push({
    name: "脚本检测",
    passed: scripts.length === 0,
    message: scripts.length === 0 
      ? "未使用 JavaScript（正确）" 
      : `发现 ${scripts.length} 个 script 标签，邮件客户端通常不支持`,
    details: { scriptCount: scripts.length }
  });
  if (scripts.length > 0) {
    score -= 20;
    issues.push({
      severity: "error",
      category: "html",
      message: "邮件中不应包含 JavaScript",
      fix: "移除所有 script 标签"
    });
  }

  // 9. 表单检测（邮件通常不支持）
  const forms = html.match(/<form[^>]*>/gi) || [];
  checks.push({
    name: "表单检测",
    passed: forms.length === 0,
    message: forms.length === 0 
      ? "未使用表单元素（正确）" 
      : `发现 ${forms.length} 个表单，邮件客户端可能不支持`,
    details: { formCount: forms.length }
  });
  if (forms.length > 0) {
    score -= 10;
    suggestions.push("邮件中的表单可能无法正常工作，建议使用链接引导用户到网页");
  }

  return {
    score: Math.max(0, score),
    status: score >= 80 ? "pass" : score >= 60 ? "warning" : "fail",
    checks
  };
}

// 垃圾邮件评分
function validateSpamScore(html: string, subject: string | undefined, issues: Issue[], suggestions: string[]): CategoryResult {
  const checks: CheckResult[] = [];
  let score = 100;

  const textOnly = html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();

  // 1. 文本与图片比例（纯图片邮件容易被认为是垃圾邮件）
  const hasImages = /<img[^>]+>/i.test(html);
  const textLength = textOnly.length;
  
  checks.push({
    name: "图文比例",
    passed: !hasImages || textLength >= 100,
    message: hasImages && textLength < 100 
      ? "图片邮件文本过少，容易被识别为垃圾邮件" 
      : "图文比例正常",
    details: { hasImages, textLength }
  });
  if (hasImages && textLength < 100) {
    score -= 20;
    issues.push({
      severity: "warning",
      category: "spam",
      message: "图片邮件文本内容过少",
      fix: "增加文本内容，避免纯图片邮件"
    });
  }

  // 2. 大写字母比例
  const upperCaseLetters = (textOnly.match(/[A-Z]/g) || []).length;
  const allLetters = (textOnly.match(/[A-Za-z]/g) || []).length;
  const upperCaseRatio = allLetters > 0 ? (upperCaseLetters / allLetters) * 100 : 0;

  checks.push({
    name: "大写字母比例",
    passed: upperCaseRatio < 30,
    message: upperCaseRatio >= 30 
      ? `大写字母比例过高 (${upperCaseRatio.toFixed(1)}%)，可能被认为是垃圾邮件` 
      : `大写字母比例正常 (${upperCaseRatio.toFixed(1)}%)`,
    details: { ratio: upperCaseRatio }
  });
  if (upperCaseRatio >= 30) {
    score -= 15;
    suggestions.push("减少大写字母的使用，避免被认为是垃圾邮件");
  }

  // 3. 感叹号检测
  const exclamationCount = (textOnly.match(/!/g) || []).length;
  checks.push({
    name: "感叹号使用",
    passed: exclamationCount <= 3,
    message: exclamationCount > 3 
      ? `感叹号过多 (${exclamationCount} 个)` 
      : `感叹号使用适度 (${exclamationCount} 个)`,
    details: { count: exclamationCount }
  });
  if (exclamationCount > 3) {
    score -= 5;
  }

  // 4. 颜色使用检测
  const colorStyles = html.match(/color\s*:\s*#[0-9a-fA-F]{3,6}/gi) || [];
  const redColors = colorStyles.filter(c => {
    const hex = c.match(/#[0-9a-fA-F]{6}/)?.[0];
    if (!hex) return false;
    const r = parseInt(hex.slice(1, 3), 16);
    return r > 200;
  });

  checks.push({
    name: "颜色使用",
    passed: redColors.length <= 2,
    message: redColors.length > 2 
      ? "大量使用红色文字，可能触发垃圾过滤器" 
      : "颜色使用正常",
    details: { redTextCount: redColors.length }
  });
  if (redColors.length > 2) {
    score -= 5;
    suggestions.push("减少红色文字的使用");
  }

  // 5. 链接域名数量
  const links = html.match(/href\s*=\s*["']https?:\/\/([^"':/]+)/gi) || [];
  const domains = new Set(
    links.map(l => {
      const match = l.match(/https?:\/\/([^"':/]+)/);
      return match ? match[1].replace('www.', '') : '';
    }).filter(Boolean)
  );

  checks.push({
    name: "链接域名数量",
    passed: domains.size <= 3,
    message: domains.size > 3 
      ? `链接来自 ${domains.size} 个不同域名，可能被视为可疑` 
      : `链接域名集中 (${domains.size} 个)`,
    details: { domainCount: domains.size, domains: Array.from(domains).slice(0, 5) }
  });
  if (domains.size > 3) {
    score -= 10;
  }

  // 6. 退订链接检测
  const hasUnsubscribe = /unsubscribe|退订|取消订阅|取消接收/i.test(html);
  checks.push({
    name: "退订链接",
    passed: true,
    message: hasUnsubscribe 
      ? "包含退订链接（符合规范）" 
      : "未检测到退订链接（营销邮件建议添加）",
    details: { hasUnsubscribe }
  });

  // 7. 垃圾邮件关键词评分
  const spamKeywords = [
    { word: '免费', score: 2 },
    { word: '中奖', score: 3 },
    { word: '点击', score: 1 },
    { word: '立即', score: 1 },
    { word: '优惠', score: 2 },
    { word: '折扣', score: 1 },
    { word: '限时', score: 2 },
    { word: '赚钱', score: 3 },
    { word: '投资', score: 2 },
    { word: '贷款', score: 3 },
    { word: 'free', score: 2 },
    { word: 'winner', score: 3 },
    { word: 'click', score: 1 },
    { word: 'limited', score: 1 },
    { word: 'offer', score: 2 },
  ];

  let spamScore = 0;
  const foundKeywords: string[] = [];
  spamKeywords.forEach(({ word, score: s }) => {
    const regex = new RegExp(word, 'gi');
    const matches = textOnly.match(regex);
    if (matches) {
      spamScore += s * matches.length;
      foundKeywords.push(`${word}(${matches.length})`);
    }
  });

  checks.push({
    name: "垃圾关键词评分",
    passed: spamScore < 10,
    message: spamScore < 5 
      ? "垃圾关键词评分很低" 
      : spamScore < 10 
        ? `垃圾关键词评分中等 (${spamScore})` 
        : `垃圾关键词评分较高 (${spamScore})，可能触发过滤器`,
    details: { score: spamScore, keywords: foundKeywords.slice(0, 10) }
  });
  if (spamScore >= 10) {
    score -= 20;
  } else if (spamScore >= 5) {
    score -= 10;
  }

  return {
    score: Math.max(0, score),
    status: score >= 80 ? "pass" : score >= 60 ? "warning" : "fail",
    checks
  };
}

// 生成摘要
function generateSummary(score: number, issues: Issue[]): string {
  const errors = issues.filter(i => i.severity === "error").length;
  const warnings = issues.filter(i => i.severity === "warning").length;

  let summary = `邮件质量评分: ${score}/100`;

  if (score >= 90) {
    summary += " ✅ 优秀";
  } else if (score >= 75) {
    summary += " ✓ 良好";
  } else if (score >= 60) {
    summary += " ⚠️ 需要改进";
  } else {
    summary += " ❌ 质量较差";
  }

  if (errors > 0) {
    summary += `\n发现 ${errors} 个错误需要修复`;
  }
  if (warnings > 0) {
    summary += `\n发现 ${warnings} 个警告建议优化`;
  }

  return summary;
}
