import React from 'react';
import { ConfigProvider } from 'antd';
import zhCN from 'antd/locale/zh_CN';
import { HelmetProvider } from 'react-helmet-async';

export function rootContainer(container: React.ReactNode) {
  return (
    <HelmetProvider>
      <ConfigProvider locale={zhCN}>
        {container}
      </ConfigProvider>
    </HelmetProvider>
  );
}
