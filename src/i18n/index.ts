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
// 优先级：手动切换 > IP检测 > 浏览器语言
const getInitialLocale = async (): Promise<Locale> => {
  // 1. 优先读取本地存储（用户手动切换过）
  const saved = localStorage.getItem('yma16-locale') as Locale;
  if (saved && messages[saved]) {
    return saved;
  }

  // 2. 其次检测 IP
  try {
    const ipLocale = await detectLocaleByIP();
    localStorage.setItem('yma16-locale', ipLocale);
    return ipLocale;
  } catch {
    // 3. 最后 fallback 浏览器语言
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

// 语言切换组件 - 无框下拉选择，带前缀图标
export const LanguageSwitcher: React.FC = () => {
  const { locale, setLocale } = useI18n();
  const [isDark, setIsDark] = React.useState(false);

  React.useEffect(() => {
    const checkDark = () => {
      setIsDark(document.documentElement.getAttribute('data-theme') === 'dark');
    };
    checkDark();
    const observer = new MutationObserver(checkDark);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    return () => observer.disconnect();
  }, []);

  const localeOptions: { value: Locale; label: string; icon: string }[] = [
    { value: 'zh-CN', label: '简体中文', icon: '文' },
    { value: 'zh-TW', label: '繁體中文', icon: '繁' },
    { value: 'en-US', label: 'English', icon: 'En' },
  ];

  const current = localeOptions.find((o) => o.value === locale);

  return React.createElement(
    'div',
    { style: { position: 'relative', display: 'inline-block' } },
    React.createElement(
      'select',
      {
        value: locale,
        onChange: (e: React.ChangeEvent<HTMLSelectElement>) => {
          const newLocale = e.target.value as Locale;
          localStorage.setItem('yma16-locale', newLocale);
          window.location.reload();
        },
        style: {
          appearance: 'none',
          WebkitAppearance: 'none',
          MozAppearance: 'none',
          padding: '4px 24px 4px 28px',
          borderRadius: 4,
          border: 'none',
          background: 'transparent',
          color: isDark ? 'rgba(255,255,255,0.85)' : '#333',
          cursor: 'pointer',
          fontSize: 14,
          lineHeight: '22px',
          outline: 'none',
        },
      },
      localeOptions.map((opt) =>
        React.createElement(
          'option',
          { key: opt.value, value: opt.value, style: { background: isDark ? '#1f1f1f' : '#fff', color: isDark ? 'rgba(255,255,255,0.85)' : '#333' } },
          opt.label
        )
      )
    ),
    // 前缀图标
    React.createElement(
      'span',
      {
        style: {
          position: 'absolute',
          left: 6,
          top: '50%',
          transform: 'translateY(-50%)',
          pointerEvents: 'none',
          fontSize: 12,
          fontWeight: 600,
          color: isDark ? 'rgba(255,255,255,0.65)' : '#666',
          width: 18,
          height: 18,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: '50%',
          background: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.06)',
        },
      },
      current?.icon
    ),
    // 下拉箭头
    React.createElement(
      'span',
      {
        style: {
          position: 'absolute',
          right: 4,
          top: '50%',
          transform: 'translateY(-50%)',
          pointerEvents: 'none',
          fontSize: 10,
          color: isDark ? 'rgba(255,255,255,0.45)' : '#999',
        },
      },
      '▼'
    )
  );
};

export { messages };
