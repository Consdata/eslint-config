module.exports = {
    parser: '@typescript-eslint/parser',
    parserOptions: {
        ecmaVersion: 2020,
        sourceType: 'module'
    },
    plugins: ['@typescript-eslint',
        "@angular-eslint/eslint-plugin"],
    extends: [
        'eslint:recommended',
        'plugin:@typescript-eslint/eslint-recommended',
        'plugin:@typescript-eslint/recommended'
    ],
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
                "arrayDestructuring": true,
                "arrowParameter": true,
                "memberVariableDeclaration": true,
                "objectDestructuring": true,
                "parameter": true,
                "propertyDeclaration": true,
                "variableDeclaration": true,
                "variableDeclarationIgnoreFunction": false
            }
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
            }
        ],
        "@typescript-eslint/no-empty-function": "off",
        "@typescript-eslint/no-empty-interface": "error",
        "@typescript-eslint/no-explicit-any": "error",
        "@typescript-eslint/no-inferrable-types": "off",
        "@typescript-eslint/no-shadow": [
            "error",
            {
                "hoist": "all"
            }
        ],
        "no-unused-vars": "off",
        "@typescript-eslint/no-unused-vars": ["error"],
        "no-unused-expressions": "off",
        "@typescript-eslint/no-unused-expressions": "error",
        "@typescript-eslint/no-use-before-define": "error",
        "@typescript-eslint/prefer-function-type": "error",
        "@typescript-eslint/quotes": [
            "error",
            "single",
            {"allowTemplateLiterals": true}
        ],
        "@typescript-eslint/semi": [
            "off",
            null
        ],
        "@typescript-eslint/type-annotation-spacing": "error",
        "@typescript-eslint/unified-signatures": "error",
        "brace-style": [
            "error",
            "1tbs"
        ],
        "curly": "error",
        "eol-last": "error",
        "eqeqeq": [
            "error",
            "smart"
        ],
        "guard-for-in": "error",
        "id-blacklist": "off",
        "id-match": "off",
        "no-prototype-builtins": "off",
        "max-len": [
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
        "no-redeclare": "error",
        "no-throw-literal": "error",
        "no-whitespace-before-property": "error",
        "no-trailing-spaces": "error",
        "no-underscore-dangle": "off",
        "no-unused-labels": "error",
        "no-var": "error",
        "prefer-const": "error",
        "radix": "error",
        "spaced-comment": [
            "error",
            "always",
            {
                "markers": [
                    "/"
                ]
            }
        ]
    }
};
