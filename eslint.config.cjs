const js = require('@eslint/js');
const globals = require('globals');
const eslintConfigPrettier = require('eslint-config-prettier');
const eslintPluginPrettier = require('eslint-plugin-prettier');
const sonarjs = require('eslint-plugin-sonarjs');

const eslintPrettierConfigs = Array.isArray(eslintConfigPrettier) ? eslintConfigPrettier : [eslintConfigPrettier];

module.exports = [
    {
        ignores: ['build/**', 'coverage/**', '.nyc_output/**'],
    },
    js.configs.recommended,
    ...eslintPrettierConfigs,
    {
        files: ['**/*.js'],
        languageOptions: {
            ecmaVersion: 'latest',
            sourceType: 'commonjs',
            globals: {
                ...globals.node,
            },
        },
        plugins: {
            prettier: eslintPluginPrettier,
            sonarjs,
        },
        rules: {
            'prettier/prettier': 'warn',
            'sonarjs/prefer-single-boolean-return': 'warn',
            'no-prototype-builtins': 'warn',
            // ESLint 10's recommended rulesets include this as an error; this repo
            // currently has a few intentional no-op assignments.
            'no-useless-assignment': 'off',
            // This project has some variables kept for readability/consistency.
            // Downgrade to warnings to avoid failing CI on unused locals.
            'no-unused-vars': ['warn', {args: 'none', caughtErrors: 'none'}],
            curly: ['error', 'all'],
            'sonarjs/no-duplicated-branches': 'warn',
        },
    },
    {
        files: ['test/**/*.mjs'],
        languageOptions: {
            globals: {
                ...globals.node,
                ...globals.mocha,
                ...globals.chai,
            },
        },
    },
];
