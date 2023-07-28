module.exports = {
  extends: ['next/core-web-vitals', 'prettier', 'plugin:storybook/recommended'],
  rules: {
    'react-hooks/exhaustive-deps': 'off',
    'react-hooks/rules-of-hooks': 'off',
    'react/display-name': 'off'
  }
};