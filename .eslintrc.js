module.exports = {
    root: true,
    env: {
        node: true,
        browser: true,
        es6: true
    },
    extends: [
        'plugin:vue/vue3-essential',
        'eslint:recommended',
        '@vue/typescript/recommended',
        '@vue/prettier',
        '@vue/prettier/@typescript-eslint'
    ],
    parserOptions: {
        ecmaVersion: 2020
    },
    rules: {
        'prettier/prettier': 'error',
        'no-console': process.env.NODE_ENV === 'prod' ? 'warn' : 'off',
        'no-debugger': process.env.NODE_ENV === 'prod' ? 'warn' : 'off',
        '@typescript-eslint/no-var-requires': 'off'
    }
}
