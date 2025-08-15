import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'

export default tseslint.config(
  { ignores: ['dist', 'build', 'coverage', 'node_modules', '.next', '.turbo', '.vite'] },

  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,

    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      // React Hooks
      ...reactHooks.configs.recommended.rules,
      'react-hooks/exhaustive-deps': 'warn', 

      // Fast Refresh
      'react-refresh/only-export-components': 'off',

      '@typescript-eslint/no-explicit-any': 'off',           
      '@typescript-eslint/prefer-ts-expect-error': 'off',   
      '@typescript-eslint/ban-ts-comment': ['warn', {        
        'ts-ignore': 'allow-with-description',
        'ts-expect-error': 'allow-with-description',
        'minimumDescriptionLength': 3,
      }],
    },
  },

  {
    files: ['src/features/admin/**', 'src/pages/**', 'src/widgets/**'],
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
    },
  },
)
