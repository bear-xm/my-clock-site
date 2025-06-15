// tailwind.config.js
module.exports = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  // 已移除 darkMode 配置，Tailwind 默认按 `media`（用户系统偏好）生效，
  // 如果不需要响应系统暗色偏好，也可以不配置此字段
  theme: {
    extend: {},
  },
  plugins: [],
};
