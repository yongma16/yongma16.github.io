// 域名备案信息配置
// 备案号下来后，修改 beianNumber 字段即可

export const BEIAN_INFO = {
  // 备案号
  beianNumber: '黔ICP备20001426号-3',

  // 备案查询链接
  beianLink: 'https://beian.miit.gov.cn/',

  // 是否显示备案信息
  showBeian: true,
  
  // 公安备案号（如果有）
  gonganNumber: '',
  gonganLink: 'https://www.beian.gov.cn/portal/registerSystemInfo',
};

// 获取当前访问的域名
export const getCurrentDomain = (): string => {
  if (typeof window !== 'undefined') {
    return window.location.hostname;
  }
  return '';
};
