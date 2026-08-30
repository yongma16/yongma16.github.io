// 域名备案信息配置
// 备案号下来后，修改 beianNumber 字段即可

export const BEIAN_INFO = {
  // 备案号 - 目前为空，等备案下来后填写
  // 示例: '京ICP备12345678号-1'
  beianNumber: '',
  
  // 备案查询链接
  beianLink: 'https://beian.miit.gov.cn/',
  
  // 是否显示备案信息（备案号下来后改为 true）
  showBeian: false,
  
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
