/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // 主色调
        primary: {
          DEFAULT: '#FF8966',
          hover: '#FF7549',
          light: '#FFB199',
        },
        // 次要色
        secondary: {
          DEFAULT: '#FFD4A3',
        },
        accent: {
          DEFAULT: '#FFAD84',
        },
        // 背景色
        background: {
          DEFAULT: '#FFF9F0',
          card: '#FFFFFF',
        },
        border: {
          DEFAULT: '#FFE4D6',
        },
        // 文字色
        text: {
          primary: '#5C4033',
          secondary: '#8B7355',
          disabled: '#C4B5A0',
        },
        // 状态色
        success: '#A8E6CF',
        warning: '#FFE66D',
        error: '#FF8B94',
        info: '#A8D8EA',
        // 分类颜色
        category: {
          work: '#FF6B6B',
          entertainment: '#4ECDC4',
          commute: '#FFE66D',
          rest: '#95E1D3',
          meal: '#FF8B94',
          study: '#A8E6CF',
          exercise: '#FFDAC1',
          social: '#B4A7D6',
        },
      },
      fontFamily: {
        sans: ['"PingFang SC"', '"Microsoft YaHei"', '"Inter"', '"SF Pro Display"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      fontSize: {
        'h1': '32px',
        'h2': '24px',
        'h3': '18px',
        'body': '14px',
        'small': '12px',
      },
      borderRadius: {
        'small': '8px',
        'medium': '12px',
        'large': '16px',
      },
      boxShadow: {
        'small': '0 2px 8px rgba(255,137,102,0.08)',
        'medium': '0 4px 16px rgba(255,137,102,0.12)',
        'large': '0 8px 24px rgba(255,137,102,0.16)',
      },
    },
  },
  plugins: [],
}
