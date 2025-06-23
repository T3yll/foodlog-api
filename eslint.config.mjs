module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: 'tsconfig.json',
    tsconfigRootDir: __dirname,
    sourceType: 'module',
  },
  plugins: [
    '@typescript-eslint/eslint-plugin',
    'security',
    'node'
  ],
  extends: [
    '@nestjs/eslint-config-nest',
    'plugin:@typescript-eslint/recommended',
    'plugin:security/recommended',
    'plugin:node/recommended'
  ],
  root: true,
  env: {
    node: true,
    jest: true,
  },
  ignorePatterns: ['.eslintrc.js', 'dist/', 'node_modules/'],
  rules: {
    // 🔒 Règles de sécurité
    'security/detect-object-injection': 'warn',
    'security/detect-non-literal-fs-filename': 'warn',
    'security/detect-possible-timing-attacks': 'warn',
    'security/detect-eval-with-expression': 'error',
    
    // 📏 Qualité de code
    '@typescript-eslint/interface-name-prefix': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-explicit-any': 'warn',
    '@typescript-eslint/no-unused-vars': 'error',
    '@typescript-eslint/prefer-const': 'error',
    
    // 🧹 Bonnes pratiques
    'no-console': 'warn',
    'no-debugger': 'error',
    'prefer-const': 'error',
    'no-var': 'error',
    'eqeqeq': 'error',
    
    // 🔧 Node.js spécifique
    'node/no-missing-import': 'off', // TypeScript gère ça
    'node/no-unsupported-features/es-syntax': 'off',
    'node/no-unpublished-import': 'off'
  },
};