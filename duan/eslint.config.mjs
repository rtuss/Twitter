import eslintPluginPrettier from 'eslint-plugin-prettier'

{
    plugins: {
      prettier: eslintPluginPrettier
    };
    rules: {
      '@typescript-eslint/no-explicit-any'; 'warn',
      '@typescript-eslint/no-unused-vars'; 'warn',
      'prettier/prettier'; [
        'warn',
        {
          arrowParens: 'always',
          semi: false,
          trailingComma: 'none',
          tabWidth: 2,
          endOfLine: 'auto',
          useTabs: false,
          singleQuote: true,
          printWidth: 120,
          jsxSingleQuote: true
        }
      ]
    };
    ignores: ['**/node_modules/', '**/dist/']
  }
