import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

import zhCN from './locales/zh-CN';
import zhTW from './locales/zh-TW';
import enUS from './locales/en-US';

export type Locale = 'zh-CN' | 'zh-TW' | 'en-US';

const messages: Record<Locale, any> = {
  'zh-CN': zhCN,
  'zh-TW': zhTW,
  'en-US': enUS,
};

// 检测 IP 归属地
const detectLocaleByIP = async (): Promise<Locale> => {
  try {
    // 使用 ipapi.co 免费服务
    const response = await fetch('https://ipapi.co/json/', { timeout: 3000 } as any);
    const data = await response.json();
    const country = data.country_code;
    const languages = data.languages || '';

    // 中国大陆 -> 简体中文
    if (country === 'CN') {
      return 'zh-CN';
    }

    // 香港 -> 繁体中文
    if (country === 'HK') {
      return 'zh-TW';
    }

    // 台湾 -> 繁体中文
    if (country === 'TW') {
      return 'zh-TW';
    }

    // 澳门 -> 繁体中文
    if (country === 'MO') {
      return 'zh-TW';
    }

    // 新加坡、马来西亚等华人地区，根据浏览器语言判断
    if (['SG', 'MY'].includes(country)) {
      const browserLang = navigator.language;
      if (browserLang.startsWith('zh')) {
        // 根据浏览器语言细分
        if (browserLang === 'zh-TW' || browserLang === 'zh-HK') {
          return 'zh-TW';
        }
        return 'zh-CN';
      }
    }

    // 其他国家默认英文
    return 'en-US';
  } catch {
    // 如果 IP 检测失败， fallback 到浏览器语言
    return detectLocaleByBrowser();
  }
};

// 浏览器语言检测
const detectLocaleByBrowser = (): Locale => {
  const lang = navigator.language;

  if (lang === 'zh-TW' || lang === 'zh-HK' || lang === 'zh-MO') {
    return 'zh-TW';
  }

  if (lang.startsWith('zh')) {
    return 'zh-CN';
  }

  return 'en-US';
};

// 获取初始语言
const getInitialLocale = async (): Promise<Locale> => {
  // 优先读取本地存储
  const saved = localStorage.getItem('yma16-locale') as Locale;
  if (saved && messages[saved]) {
    return saved;
  }

  // 其次检测 IP
  try {
    const ipLocale = await detectLocaleByIP();
    localStorage.setItem('yma16-locale', ipLocale);
    return ipLocale;
  } catch {
    // 最后 fallback 浏览器语言
    const browserLocale = detectLocaleByBrowser();
    localStorage.setItem('yma16-locale', browserLocale);
    return browserLocale;
  }
};

interface I18nContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string, params?: Record<string, string>) => string;
}

const I18nContext = createContext<I18nContextType>({
  locale: 'zh-CN',
  setLocale: () => {},
  t: (key: string) => key,
});

export const useI18n = () => useContext(I18nContext);

// 翻译函数
const translate = (messages: any, key: string, params?: Record<string, string>): string => {
  const keys = key.split('.');
  let value = messages;

  for (const k of keys) {
    if (value && typeof value === 'object' && k in value) {
      value = value[k];
    } else {
      return key; // 找不到翻译，返回 key
    }
  }

  if (typeof value !== 'string') {
    return key;
  }

  // 替换参数
  if (params) {
    return value.replace(/\{(\w+)\}/g, (match, paramKey) => {
      return params[paramKey] !== undefined ? params[paramKey] : match;
    });
  }

  return value;
};

export const I18nProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [locale, setLocaleState] = useState<Locale>('zh-CN');
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    getInitialLocale().then((loc) => {
      setLocaleState(loc);
      setIsReady(true);
    });
  }, []);

  const setLocale = useCallback((newLocale: Locale) => {
    setLocaleState(newLocale);
    localStorage.setItem('yma16-locale', newLocale);
    // 刷新页面以应用新语言
    window.location.reload();
  }, []);

  const t = useCallback(
    (key: string, params?: Record<string, string>) => {
      return translate(messages[locale], key, params);
    },
    [locale]
  );

  if (!isReady) {
    return null; // 或者显示 loading
  }

  return React.createElement(
    I18nContext.Provider,
    { value: { locale, setLocale, t } },
    children
  );
};

// 语言切换组件
export const LanguageSwitcher: React.FC = () => {
  const { locale, setLocale } = useI18n();

  const localeNames: Record<Locale, string> = {
    'zh-CN': '简体中文',
    'zh-TW': '繁體中文',
    'en-US': 'English',
  };

  const localeFlags: Record<Locale, string> = {
    'zh-CN': '🇨🇳',
    'zh-TW': '🇭🇰',
    'en-US': '🇺🇸',
  };

  return React.createElement('div', { style: { display: 'flex', gap: 8, alignItems: 'center' } },
    (Object.keys(localeNames) as Locale[]).map((loc) =>
      React.createElement('button', {
        key: loc,
        onClick: () => setLocale(loc),
        style: {
          padding: '4px 12px',
          borderRadius: 4,
          border: '1px solid #d9d9d9',
          background: locale === loc ? '#1890ff' : '#fff',
          color: locale === loc ? '#fff' : '#333',
          cursor: 'pointer',
          fontSize: 13,
          display: 'flex',
          alignItems: 'center',
          gap: 4,
        }
      }, [
        React.createElement('span', { key: 'flag' }, localeFlags[loc]),
        React.createElement('span', { key: 'name' }, localeNames[loc])
      ])
    )
  );
};

export { messages };
