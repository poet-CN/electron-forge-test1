/*
 * @Author: 马铭扬
 * @Email：poet_cn@gonxt.com
 * @Date: 2024-05-08 16:25:56
 * @Description: eslint基础配置文件
 * @FilePath: /gonxt-web-fe/.eslintrc.js
 */

module.exports = {
    root: true,
    env: {
        browser: true,
        node: true,
        es6: true,
    },
    extends: require.resolve('umi/eslint'),
    ignorePatterns: [ 'typings.d.ts' ],
    rules: {
        'semi': [ 2, 'never' ],
        'comma-dangle': [ 2, 'always-multiline' ],
        indent: [ 2, 4, { 'SwitchCase': 1 } ],
        quotes: [ 2, 'single' ],
        'no-unused-vars': [ 2, { 'args': 'none' } ],
        'object-curly-spacing': [ 2, 'always' ],
        '@typescript-eslint/ban-ts-ignore': 0,
        '@typescript-eslint/no-unused-vars': 0,
        '@typescript-eslint/camelcase': 0,
        '@typescript-eslint/no-explicit-any': 0,
        '@typescript-eslint/no-empty-function': 0,
        '@typescript-eslint/explicit-function-return-type': 0,
        'no-prototype-builtins': 0,
        'no-console': 0,
    },
}
