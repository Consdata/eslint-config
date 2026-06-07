const tseslint = require('typescript-eslint');
const angularEslint = require('@angular-eslint/eslint-plugin');
const rxjsPlugin = require('@smarttools/eslint-plugin-rxjs');
const stylisticPlugin = require('@stylistic/eslint-plugin');
const eslintJs = require('@eslint/js');

module.exports = [
    // Base configs (applied to all files)
    eslintJs.configs.recommended,
    stylisticPlugin.configs['disable-legacy'],

    // Register plugins (no file filter — just makes them available)
    {
        plugins: {
            '@angular-eslint': angularEslint,
            'rxjs': rxjsPlugin,
            '@stylistic': stylisticPlugin,
        },
    },

    // Rules for all file types (JS + TS)
    {
        rules: {
            "@stylistic/quotes": [
                "error",
                "single",
                {"allowTemplateLiterals": "always"}
            ],
            "@stylistic/semi": [
                "error"
            ],
            "@stylistic/type-annotation-spacing": "error",
            "@stylistic/brace-style": [
                "error",
                "1tbs"
            ],
            "curly": "error",
            "@stylistic/eol-last": "error",
            "eqeqeq": [
                "error",
                "smart"
            ],
            "guard-for-in": "error",
            "id-denylist": "off",
            "id-match": "off",
            "no-prototype-builtins": "off",
            "@stylistic/max-len": [
                "error",
                {
                    "ignorePattern": "^import [^,]+ from",
                    "code": 160
                }
            ],
            "no-bitwise": "error",
            "no-caller": "error",
            "no-console": "error",
            "no-debugger": "error",
            "no-empty": "off",
            "no-eval": "error",
            "no-fallthrough": "error",
            "no-new-wrappers": "error",
            "no-throw-literal": "error",
            "@stylistic/no-whitespace-before-property": "error",
            "@stylistic/no-trailing-spaces": "error",
            "no-underscore-dangle": "off",
            "no-unused-labels": "error",
            "no-var": "error",
            "prefer-const": "error",
            "radix": "error",
            "@stylistic/spaced-comment": [
                "error",
                "always",
                {
                    "markers": [
                        "/"
                    ]
                }
            ],
        }
    },

    // TypeScript-specific rules (TS files only)
    ...tseslint.configs.recommended.map(config => ({
        ...config,
        files: ['**/*.ts', '**/*.tsx'],
    })),
    {
        files: ['**/*.ts', '**/*.tsx'],
        rules: {
            "@angular-eslint/component-class-suffix": ["error",
                {
                    "suffixes": ["Component"]
                }],
            "@angular-eslint/component-selector": "off",
            "@angular-eslint/directive-class-suffix": "off",
            "@angular-eslint/directive-selector": [
                "error",
                {
                    "type": "attribute",
                    "prefix": "",
                    "style": "camelCase"
                }
            ],
            "@angular-eslint/no-input-rename": "error",
            "@angular-eslint/no-output-rename": "error",
            "@angular-eslint/use-pipe-transform-interface": "error",
            "@typescript-eslint/typedef": [
                "error",
                {
                    "arrayDestructuring": false,
                    "arrowParameter": false,
                    "memberVariableDeclaration": true,
                    "objectDestructuring": false,
                    "parameter": true,
                    "propertyDeclaration": true,
                    "variableDeclaration": false,
                    "variableDeclarationIgnoreFunction": false
                }
            ],
            "@typescript-eslint/explicit-module-boundary-types": [
                "error",
                {
                    "allowArgumentsExplicitlyTypedAsAny": false,
                    "allowDirectConstAssertionInArrowFunctions": true,
                    "allowedNames": [],
                    "allowHigherOrderFunctions": true,
                    "allowTypedFunctionExpressions": true
                }
            ],
            "@typescript-eslint/explicit-function-return-type": [
                "off",
            ],
            "@typescript-eslint/consistent-type-definitions": "error",
            "@typescript-eslint/dot-notation": "off",
            "@typescript-eslint/explicit-member-accessibility": [
                "off",
                {
                    "accessibility": "explicit"
                }
            ],
            "@typescript-eslint/indent": "off",
            "@typescript-eslint/member-delimiter-style": [
                "off",
                {
                    "multiline": {
                        "delimiter": "none",
                        "requireLast": true
                    },
                    "singleline": {
                        "delimiter": "semi",
                        "requireLast": false
                    }
                }
            ],
            "@typescript-eslint/member-ordering": [
                "error",
                {
                    "default": [
                        "signature",
                        "field",
                        "constructor",
                        "method"
                    ]
                }
            ],
            "@typescript-eslint/naming-convention": [
                "error",
                {
                    "selector": "default",
                    "format": [
                        "camelCase"
                    ]
                },
                {
                    "selector": "enumMember",
                    "format": [
                        "snake_case",
                        "UPPER_CASE",
                        "camelCase"
                    ]
                },
                {
                    "selector": "memberLike",
                    "format": [
                        "camelCase",
                        "UPPER_CASE",
                        "PascalCase"
                    ],
                    "leadingUnderscore": "allow"
                },
                {
                    "selector": "typeLike",
                    "format": [
                        "PascalCase"
                    ]
                },
                {
                    "selector": "parameter",
                    "format": [
                        "camelCase"
                    ],
                    "leadingUnderscore": "allow"
                },
                {
                    "selector": "variable",
                    "modifiers": ["const"],
                    "format": ["UPPER_CASE", "camelCase"]
                }
            ],
            "@typescript-eslint/no-empty-function": "off",
            "@typescript-eslint/no-empty-object-type": "error",
            "@typescript-eslint/no-explicit-any": "error",
            "@typescript-eslint/no-inferrable-types": "off",
            "no-shadow": "off",
            "@typescript-eslint/no-shadow": [
                "error",
                {
                    "hoist": "all"
                }
            ],
            "no-unused-vars": "off",
            "@typescript-eslint/no-unused-vars": [
                "error",
                {
                    "argsIgnorePattern": "^_"
                }
            ],
            "no-unused-expressions": "off",
            "@typescript-eslint/no-unused-expressions": "error",
            "no-use-before-define": "off",
            "@typescript-eslint/no-use-before-define": ["error"],
            "@typescript-eslint/prefer-function-type": "error",
            "@typescript-eslint/unified-signatures": "error",
            "no-redeclare": "off",
            "@typescript-eslint/no-redeclare": ["error"],
            "no-loss-of-precision": "off",
            "@typescript-eslint/no-loss-of-precision": ["error"],
            "default-param-last": "off",
            "@typescript-eslint/default-param-last": ["error"],
            "rxjs/finnish": ["error"],
            "rxjs/no-async-subscribe": ["error"],
            "rxjs/no-connectable": ["error"],
            "rxjs/no-create": ["error"],
            "rxjs/no-cyclic-action": ["off"],
            "rxjs/no-exposed-subjects": ["error"],
            "rxjs/no-ignored-notifier": ["error"],
            "rxjs/no-ignored-replay-buffer": ["error"],
            "rxjs/no-implicit-any-catch": ["off"],
            "rxjs/no-index": ["error"],
            "rxjs/no-nested-subscribe": ["error"],
            "rxjs/no-redundant-notify": ["error"],
            "rxjs/no-sharereplay": [
                "error",
                {"allowConfig": true}
            ],
            "rxjs/no-subclass": ["error"],
            "rxjs/no-subject-unsubscribe": ["error"],
            "rxjs/no-unbound-methods": ["error"],
            "rxjs/no-unsafe-catch": ["error"],
            "rxjs/no-unsafe-subject-next": ["error"],
            "rxjs/no-unsafe-takeuntil": ["error"],
            "rxjs/throw-error": ["error"]
        }
    }
];
