module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react-hooks/recommended',
  ],
  ignorePatterns: ['dist', '.eslintrc.cjs', 'src/assets/Model.template.tsx'],
  parser: '@typescript-eslint/parser',
  plugins: ['react-refresh'],
  rules: {
    'react-refresh/only-export-components': [
      'warn',
      { allowConstantExport: true },
    ],
  },
  overrides: [
    {
      // These files export a hook, a variants helper or constants next to their component on purpose
      files: [
        'src/components/ui/*.tsx',
        'src/components/ThemeProvider.tsx',
        'src/components/RoudingSelector.tsx',
      ],
      rules: { 'react-refresh/only-export-components': 'off' },
    },
  ],
}
