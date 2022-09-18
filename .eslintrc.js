module.exports = {
    root: true,
    env: {
        node: true,
    },
    extends: [
        'plugin:vue/vue3-essential',
        'eslint:recommended',
        '@vue/typescript/recommended',
        '@vue/prettier',
        '@vue/prettier/@typescript-eslint',
    ],
    parserOptions: {
        ecmaVersion: 2020,
    },
    rules: {
        'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
        'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
        'no-undef': 'off',
        'prettier/prettier': [
            'warn',
            { tabWidth: 4, endOfLine: 'auto', singleQuote: true },
        ],
        '@typescript-eslint/explicit-module-boundary-types': [
            'warn',
            {
                allowHigherOrderFunctions: true,
            },
        ],
    },
    ignorePatterns: [
        '/tests/',
        'vue.config.js',
        '/__mocks__/',
        '/src/modules/__mocks__',
        '/src/composables/__mocks__',
        '/src/classes/__mocks__',
    ],
    overrides: [
        {
            files: [
                '**/__tests__/*.{j,t}s?(x)',
                '**/tests/unit/**/*.spec.{j,t}s?(x)',
            ],
            env: {
                jest: true,
            },
        },
    ],
};
