import React from 'react';
import { ConfigProvider, theme } from 'antd';
import zhCN from 'antd/locale/zh_CN';
import { HelmetProvider } from 'react-helmet-async';
import { ThemeProvider, useTheme } from '@/contexts/ThemeContext';

// 内部组件，用于获取主题状态
const ThemedConfigProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isDark } = useTheme();
  
  return (
    <ConfigProvider
      locale={zhCN}
      theme={{
        algorithm: isDark ? theme.darkAlgorithm : theme.defaultAlgorithm,
        token: {
          colorBgContainer: isDark ? '#141414' : '#ffffff',
          colorBgElevated: isDark ? '#1f1f1f' : '#ffffff',
          colorText: isDark ? 'rgba(255, 255, 255, 0.85)' : 'rgba(0, 0, 0, 0.88)',
          colorTextSecondary: isDark ? 'rgba(255, 255, 255, 0.65)' : 'rgba(0, 0, 0, 0.65)',
          colorBorder: isDark ? '#424242' : '#d9d9d9',
          colorSplit: isDark ? '#303030' : 'rgba(5, 5, 5, 0.06)',
        },
      }}
    >
      {children}
    </ConfigProvider>
  );
};

export function rootContainer(container: React.ReactNode) {
  return (
    <HelmetProvider>
      <ThemeProvider>
        <ThemedConfigProvider>
          {container}
        </ThemedConfigProvider>
      </ThemeProvider>
    </HelmetProvider>
  );
}
