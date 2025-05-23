// tailwind.config.js
module.exports = {
  // 1. 指明要扫描的文件，防止生成的 CSS 被全部 tree-shake 掉
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],

  // 2. 使用 class 模式的暗黑主题
  darkMode: 'class', 

  theme: {
    extend: {
      // 你可以在这里扩展自定义的 theme，比如 colors、spacing 等
    },
  },

  plugins: [
    // 如果你需要额外插件，在这里引入，比如 forms、typography 等
    // require('@tailwindcss/forms'),
    // require('@tailwindcss/typography'),
  ],
};
