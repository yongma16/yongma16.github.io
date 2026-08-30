import React from 'react';
import { useTheme } from '@/contexts/ThemeContext';

interface SiteIconProps {
  size?: number;
  className?: string;
}

export const SiteIcon: React.FC<SiteIconProps> = ({ size = 40, className }) => {
  const { isDark } = useTheme();

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{ display: 'inline-block', verticalAlign: 'middle' }}
    >
      {/* 背景圆形 */}
      <circle
        cx="50"
        cy="50"
        r="48"
        fill={isDark ? '#1f1f1f' : '#ffffff'}
        stroke={isDark ? '#424242' : '#e8e8e8'}
        strokeWidth="2"
      />
      
      {/* Y 字母 - 使用渐变色 */}
      <defs>
        <linearGradient id="yGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#1890ff" />
          <stop offset="100%" stopColor="#722ed1" />
        </linearGradient>
      </defs>
      
      {/* Y 的路径 */}
      <path
        d="M30 25 L50 55 L70 25"
        stroke="url(#yGradient)"
        strokeWidth="8"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <path
        d="M50 55 L50 80"
        stroke="url(#yGradient)"
        strokeWidth="8"
        strokeLinecap="round"
        fill="none"
      />
      
      {/* 底部小圆点装饰 */}
      <circle
        cx="50"
        cy="88"
        r="4"
        fill="#1890ff"
      />
    </svg>
  );
};

// 简化的 Y 图标（用于小尺寸）
export const SiteIconSimple: React.FC<SiteIconProps> = ({ size = 24, className }) => {
  const { isDark } = useTheme();

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{ display: 'inline-block', verticalAlign: 'middle' }}
    >
      <circle
        cx="50"
        cy="50"
        r="46"
        fill={isDark ? '#1f1f1f' : '#ffffff'}
        stroke={isDark ? '#424242' : '#e8e8e8'}
        strokeWidth="2"
      />
      <path
        d="M30 25 L50 55 L70 25"
        stroke="#1890ff"
        strokeWidth="8"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <path
        d="M50 55 L50 80"
        stroke="#1890ff"
        strokeWidth="8"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
};

export default SiteIcon;
