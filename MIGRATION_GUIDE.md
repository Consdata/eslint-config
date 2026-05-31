# Instrukcja migracji ESLint 8 → 9 w NX monorepo Angular

## Dla kogo jest ta instrukcja

Instrukcja dotyczy projektów NX monorepo z Angularem, które korzystają z `@consdata/eslint-config` i wymagają migracji z ESLint 8 (`.eslintrc.json`) na ESLint 9 (flat config).

**Wymagania wstępne:**
- NX >= 19.1.0 (starsze mają bugi w generatorze flat config)
- `@consdata/eslint-config@2.0.0` (nowa wersja z flat config, wspiera ESM i CJS)

---

## 1. Zmiana zależności w `package.json`

### Zależności do usunięcia

| Pakiet | Powód usunięcia |
|---|---|
| `eslint-plugin-rxjs` | Nie wspiera ESLint 9 (`peerDep: eslint ^8.0.0`). Zastąpiony przez `@smarttools/eslint-plugin-rxjs` |

### Zależności do dodania

| Pakiet | Wersja | Powód |
|---|---|---|
| `@smarttools/eslint-plugin-rxjs` | `^1.0.22` | Zamiennik `eslint-plugin-rxjs` kompatybilny z ESLint 9. Identyczne nazwy reguł (`rxjs/finnish`, `rxjs/no-nested-subscribe`, itd.) |
| `@eslint/js` | `>=9.0.0` | Dostarcza `eslint:recommended` dla flat config (wcześniej wbudowany w `eslint`) |
| `@eslint/eslintrc` | `^3.0.0` | `FlatCompat` — potrzebny do owrapowania pluginów NX, które jeszcze nie eksportują flat config natywnie |
| `typescript-eslint` | `^8.0.0` | Zunifikowany pakiet wymagany przez `@consdata/eslint-config@2.0.0` |

### Zależności do zaktualizowania

| Pakiet | Stara wersja | Nowa wersja | Uwagi |
|---|---|---|---|
| `eslint` | `~8.57.0` | `^9.0.0` | Główna zmiana |
| `@consdata/eslint-config` | `^1.1.0` | `^2.0.0` | **Breaking change** — eksportuje flat config zamiast eslintrc |
| `@nx/eslint` | `19.0.0` | `>=19.1.0` | Bugfixy generatora flat config |
| `@nx/eslint-plugin` | `19.0.0` | `>=19.1.0` | j.w. |
| `@typescript-eslint/eslint-plugin` | `^7.x \|\| ^8.x` | `^8.0.0` | Wymagane przez `@consdata/eslint-config@2.0.0` |
| `@typescript-eslint/parser` | `^7.x \|\| ^8.x` | `^8.0.0` | j.w. |

### Zależności, które nie wymagają zmian

| Pakiet | Powód |
|---|---|
| `@stylistic/eslint-plugin@3.x` | Peer dep `>=8.40.0` — kompatybilny z ESLint 8 i 9. Upgrade do v5 opcjonalny |
| `@angular-eslint/eslint-plugin@17+` | Wspiera `eslint ^8.57.0 \|\| ^9.0.0` |
| `eslint-plugin-html` | Brak peer dep na eslint — działa |
| `eslint-plugin-todo-plz` | Peer dep `>=7.3.0` — działa |
| `jsonc-eslint-parser` | Kompatybilny z ESLint 9 |

### Przykładowy diff w `package.json`

```diff
 "devDependencies": {
-  "@consdata/eslint-config": "^1.1.0",
+  "@consdata/eslint-config": "^2.0.0",
+  "@eslint/eslintrc": "^3.0.0",
+  "@eslint/js": ">=9.0.0",
   "@nx/eslint": "19.8.14",
   "@nx/eslint-plugin": "19.8.14",
-  "@typescript-eslint/eslint-plugin": "^7.3.0",
-  "@typescript-eslint/parser": "^7.3.0",
-  "eslint": "~8.57.0",
-  "eslint-plugin-rxjs": "^5.0.3",
+  "@smarttools/eslint-plugin-rxjs": "^1.0.22",
+  "@typescript-eslint/eslint-plugin": "^8.0.0",
+  "@typescript-eslint/parser": "^8.0.0",
+  "eslint": "^9.0.0",
+  "typescript-eslint": "^8.0.0",
 }
```

---

## 2. Automatyczna konwersja przez NX

```bash
npx nx g @nx/eslint:convert-to-flat-config
```

To zamieni:
- `.eslintrc.json` (root) → `eslint.config.js`
- `.eslintrc.json` (per-app/lib) → `eslint.config.js`
- Usunie `.eslintignore`
- Doda `@eslint/eslintrc` do `package.json`

**Uwaga:** Generator owrapuje istniejące `extends` w `FlatCompat`. Ponieważ `@consdata/eslint-config@2.0.0` eksportuje natywny flat config, wrapper `FlatCompat` dla niego **nie jest potrzebny** i powinien zostać zastąpiony bezpośrednim importem (patrz sekcja 3).

Po konwersji zmień nazwy wygenerowanych plików na `.mjs`:
```bash
mv eslint.config.js eslint.config.mjs
mv apps/my-app/eslint.config.js apps/my-app/eslint.config.mjs
mv libs/my-lib/eslint.config.js libs/my-lib/eslint.config.mjs
```

---

## 3. Root `eslint.config.mjs`

```js
import { FlatCompat } from '@eslint/eslintrc';
import nxEslintPlugin from '@nx/eslint-plugin';
import eslintPluginHtml from 'eslint-plugin-html';
import eslintPluginTodoPlz from 'eslint-plugin-todo-plz';
import eslintPluginCustomRules from 'eslint-plugin-my-custom-rules';
import consdataConfig from '@consdata/eslint-config';
import js from '@eslint/js';
import { fileURLToPath } from 'node:url';
import { dirname } from 'node:path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
});

export default [
  // @consdata/eslint-config — natywny flat config, bez FlatCompat
  ...consdataConfig,

  // Rejestracja pluginów projektowych
  {
    plugins: {
      '@nx': nxEslintPlugin,
      html: eslintPluginHtml,
      'todo-plz': eslintPluginTodoPlz,
      'my-custom-rules': eslintPluginCustomRules,
    },
  },

  // Ignores
  {
    ignores: ['**/dist', '**/node_modules', '**/eslint.config.mjs', '**/jest.config.ts', '**/*.json'],
  },

  // Reguły dla TS — parserOptions + overrides projektowe
  {
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: __dirname,
      },
    },
    rules: {
      // reguły specyficzne dla projektu...
    },
  },

  // Pluginy NX — nadal wymagają FlatCompat
  ...compat.config({ extends: ['plugin:@nx/javascript'] }).map((config) => ({
    ...config,
    files: ['**/*.js', '**/*.jsx'],
    rules: {},
  })),
];
```

---

## 4. Per-app / per-lib `eslint.config.mjs`

```js
// apps/my-app/eslint.config.mjs
import { FlatCompat } from '@eslint/eslintrc';
import baseConfig from '../../eslint.config.mjs';
import js from '@eslint/js';
import { fileURLToPath } from 'node:url';
import { dirname } from 'node:path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
});

export default [
  ...baseConfig,

  // Plugin NX Angular — nadal wymaga FlatCompat
  ...compat.config({
    extends: [
      'plugin:@nx/angular',
      'plugin:@angular-eslint/template/process-inline-templates',
    ],
  }).map((config) => ({
    ...config,
    files: ['**/*.ts'],
    rules: {
      ...config.rules,           // ← WAŻNE: merguj, nie nadpisuj!
      '@angular-eslint/component-selector': ['error', {
        type: 'element', prefix: 'my-app', style: 'kebab-case',
      }],
      '@angular-eslint/directive-selector': ['error', {
        type: 'attribute', prefix: 'myApp', style: 'camelCase',
      }],
    },
    // Usunięcie konfliktu project vs projectService
    languageOptions: {
      ...config.languageOptions,
      parserOptions: {
        ...(config.languageOptions?.parserOptions || {}),
        project: undefined,
        projectService: true,
      },
    },
  })),

  // Szablony HTML
  ...compat.config({ extends: ['plugin:@nx/angular-template'] }).map((config) => ({
    ...config,
    files: ['**/*.html'],
    rules: {},
  })),
];
```

---

## 5. Mapowanie składni — ściągawka

| eslintrc (ESLint 8) | flat config ESM (ESLint 9) |
|---|---|
| `"root": true` | Niepotrzebne — flat config jest zawsze root |
| `"extends": ["@consdata/eslint-config"]` | `import consdataConfig from '@consdata/eslint-config'` + `...consdataConfig` |
| `"plugins": ["rxjs"]` | `import rxjsPlugin from '@smarttools/eslint-plugin-rxjs'` + `plugins: { rxjs: rxjsPlugin }` |
| `"parser": "@typescript-eslint/parser"` | `import tsParser from '@typescript-eslint/parser'` + `languageOptions: { parser: tsParser }` |
| `"parserOptions": { project: [...] }` | `languageOptions: { parserOptions: { projectService: true, tsconfigRootDir: __dirname } }` |
| `"overrides": [{ files, rules }]` | Oddzielne obiekty: `{ files: [...], rules: {...} }` |
| `"ignorePatterns": [...]` | `{ ignores: [...] }` |
| `"env": { jest: true }` | `import globals from 'globals'` + `languageOptions: { globals: globals.jest }` |
| Per-app `extends: ['../../.eslintrc.json']` | `import baseConfig from '../../eslint.config.mjs'` + `...baseConfig` |

---

## 6. Migracja customowych pluginów ESLint

Jeśli projekt zawiera własne pluginy ESLint (np. `eslint-plugin-my-custom-rules`), wymagają one zmian API.

### 6.1 `context.getAncestors()` → `context.sourceCode.getAncestors(node)`

ESLint 9 usuwa `context.getAncestors()`. Zamiennik wymaga przekazania `node`:

```js
// ❌ ESLint 8
create(context) {
  return {
    Decorator(node) {
      const parent = context.getAncestors().pop();
    },
  };
}

// ✅ ESLint 9
create(context) {
  return {
    Decorator(node) {
      const ancestors = context.sourceCode.getAncestors(node);
      const parent = ancestors[ancestors.length - 1];
    },
  };
}
```

### 6.2 Wymagany `meta.type`

ESLint 9 wymaga `meta.type` w każdej regule (`'problem'`, `'suggestion'` lub `'layout'`):

```js
// ❌ Brak meta.type
module.exports = {
  meta: {
    docs: { description: '...' },
  },
  create(context) { ... },
};

// ✅ Dodany meta.type
module.exports = {
  meta: {
    type: 'problem',           // ← wymagane
    docs: { description: '...' },
  },
  create(context) { ... },
};
```

### 6.3 Inne usunięte API ESLint 9

| ESLint 8 (usunięte) | ESLint 9 (zamiennik) |
|---|---|
| `context.getAncestors()` | `context.sourceCode.getAncestors(node)` |
| `context.getScope()` | `context.sourceCode.getScope(node)` |
| `context.getFilename()` | `context.filename` |
| `context.getCwd()` | `context.cwd` |
| `context.getSourceCode()` | `context.sourceCode` |
| `context.parserServices` | `context.sourceCode.parserServices` |

Pełna lista: https://eslint.org/docs/latest/use/migrate-to-9.0.0#removed-context-methods

---

## 7. Aktualizacja deprecated reguł ESLint core

W wersji 2.x.y zmieniono nazwy deprecated reguł na ich aktualne odpowiedniki. Lista deprecated reguł: https://eslint.org/docs/latest/rules/.

| Stara nazwa (deprecated) | Nowa nazwa |
|---|---|
| `id-blacklist` | `id-denylist` |
| `eol-last` | `@stylistic/eol-last` |
| `max-len` | `@stylistic/max-len` |
| `no-trailing-spaces` | `@stylistic/no-trailing-spaces` |
| `no-whitespace-before-property` | `@stylistic/no-whitespace-before-property` |
| `spaced-comment` | `@stylistic/spaced-comment` |

---

### 7.1 Uruchomienie lint

```bash
npx nx run-many --target=lint
```

### 7.2 Oczekiwane zachowanie

- Reguły powinny wykrywać **identyczne** naruszenia co przed migracją
- Brak nowych deprecation warnings w outputcie ESLint
- Warningi `No cached ProjectGraph is available` od `@nx/enforce-module-boundaries` mogą się pojawić — uruchom `npx nx reset` i ponów

### 7.3 Checklist weryfikacyjny

- [ ] `npx eslint --version` → `v9.x.x`
- [ ] `npx nx lint <app-name>` przechodzi bez crashy
- [ ] `npx nx lint <lib-name>` przechodzi bez crashy
- [ ] Reguły z customowych pluginów wykrywają naruszenia
- [ ] Reguły `rxjs/*` wykrywają naruszenia (finnish notation, no-nested-subscribe, itd.)
- [ ] Reguły `@stylistic/*` wykrywają naruszenia (quotes, semi, brace-style)
- [ ] Reguły `@typescript-eslint/*` aktywne (naming-convention, typedef, member-ordering, itd.)
- [ ] Brak `.eslintrc.json` w repozytorium
- [ ] Brak `.eslintignore` (zastąpiony przez `ignores` w config)

---

## FAQ

### ESLint crashuje z `Cannot find module 'typescript-eslint'`

Pakiet `typescript-eslint` (zunifikowany) jest nową zależnością wymaganą przez `@consdata/eslint-config@2.0.0`. Dodaj go do `devDependencies`:

```bash
npm install --save-dev typescript-eslint
```

### Reguła `rxjs/finnish` zgłasza `requires type information`

Brakuje `parserOptions` z type-aware linting. Dodaj w config:

```js
{
  files: ['**/*.ts'],
  languageOptions: {
    parserOptions: {
      projectService: true,
      tsconfigRootDir: dirname(fileURLToPath(import.meta.url)),  // CJS: __dirname
    },
  },
}
```

### Błąd `Enabling "project" does nothing when "projectService" is enabled`

Dwa config bloki ustawiają `project` (np. z FlatCompat `plugin:@nx/angular`) i `projectService` jednocześnie. W per-app `.map()` nadpisz:

```js
parserOptions: {
  ...(config.languageOptions?.parserOptions || {}),
  project: undefined,
  projectService: true,
}
```

### Reguły TypeScript stosują się do plików `.json` lub `.js`

Flat config stosuje reguły globalnie. Dodaj `ignores` lub upewnij się, że reguły TS mają `files: ['**/*.ts']`.

### `@nx/enforce-module-boundaries` nie działa — `No cached ProjectGraph`

Uruchom `npx nx reset`, potem ponownie `npx nx lint`. Jeśli problem persystuje, zaktualizuj `@nx/eslint-plugin` do >= 19.8.

### Pluginy NX (`plugin:@nx/angular`, `plugin:@nx/angular-template`) nie eksportują flat config

Użyj `FlatCompat` z `@eslint/eslintrc@^3.0.0`:

```js
import { FlatCompat } from '@eslint/eslintrc';

...compat.config({ extends: ['plugin:@nx/angular'] }).map(config => ({
  ...config,
  files: ['**/*.ts'],
  rules: { ...config.rules, /* twoje overrides */ },
}));
```

### Mój custom plugin ESLint nie działa po migracji

Sprawdź:
1. Czy reguły mają `meta.type` (`'problem'`, `'suggestion'` lub `'layout'`)
2. Czy używasz `context.sourceCode.getAncestors(node)` zamiast `context.getAncestors()`
3. Pełna lista zmian API: https://eslint.org/docs/latest/use/migrate-to-9.0.0

### Czy muszę aktualizować `@stylistic/eslint-plugin`?

Nie — `@stylistic@3.x` z peer dep `eslint >=8.40.0` działa z ESLint 9 bez zmian. Upgrade do v5 jest opcjonalny.

### Czy `eslint-plugin-rxjs` działa z ESLint 9?

Nie. `eslint-plugin-rxjs@5.x` ma `peerDep: eslint ^8.0.0` i nie jest utrzymywany. Zamiennik: `@smarttools/eslint-plugin-rxjs` — fork z identycznymi nazwami reguł i konfiguracjami (`recommended`, `recommended-legacy`).

### Czy `@consdata/eslint-config@2.0.0` wspiera ESM?

Tak. Pakiet eksportuje oba formaty — Node.js automatycznie wybiera odpowiedni entry point:
- ESM: `import config from '@consdata/eslint-config'` → ładuje `index.mjs`
- CJS: `const config = require('@consdata/eslint-config')` → ładuje `index.cjs`

---

## Dodatek: wariant CJS

Poniżej znajduje się odpowiednik konfiguracji w formacie CommonJS. Różnice dotyczą wyłącznie składni importów/eksportów — logika konfiguracji jest identyczna.

### Różnice CJS vs ESM

| Element | ESM (`.mjs`) | CJS (`.js` / `.cjs`) |
|---|---|---|
| Import pakietów | `import x from 'x'` | `const x = require('x')` |
| `__dirname` | `dirname(fileURLToPath(import.meta.url))` | Dostępny globalnie |
| Eksport | `export default [...]` | `module.exports = [...]` |
| Plik config | `eslint.config.mjs` | `eslint.config.js` lub `eslint.config.cjs` |
| Ignores | `**/eslint.config.mjs` | `**/eslint.config.js` |

### Root `eslint.config.js` (CJS)

```js
const { FlatCompat } = require('@eslint/eslintrc');
const nxEslintPlugin = require('@nx/eslint-plugin');
const eslintPluginHtml = require('eslint-plugin-html');
const eslintPluginTodoPlz = require('eslint-plugin-todo-plz');
const eslintPluginCustomRules = require('eslint-plugin-my-custom-rules');
const consdataConfig = require('@consdata/eslint-config');
const js = require('@eslint/js');

const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
});

module.exports = [
  ...consdataConfig,

  {
    plugins: {
      '@nx': nxEslintPlugin,
      html: eslintPluginHtml,
      'todo-plz': eslintPluginTodoPlz,
      'my-custom-rules': eslintPluginCustomRules,
    },
  },

  {
    ignores: ['**/dist', '**/node_modules', '**/eslint.config.js', '**/jest.config.ts', '**/*.json'],
  },

  {
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: __dirname,
      },
    },
    rules: {
      // reguły specyficzne dla projektu...
    },
  },

  ...compat.config({ extends: ['plugin:@nx/javascript'] }).map((config) => ({
    ...config,
    files: ['**/*.js', '**/*.jsx'],
    rules: {},
  })),
];
```

### Per-app `eslint.config.js` (CJS)

```js
const { FlatCompat } = require('@eslint/eslintrc');
const baseConfig = require('../../eslint.config.js');
const js = require('@eslint/js');

const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
});

module.exports = [
  ...baseConfig,

  ...compat.config({
    extends: [
      'plugin:@nx/angular',
      'plugin:@angular-eslint/template/process-inline-templates',
    ],
  }).map((config) => ({
    ...config,
    files: ['**/*.ts'],
    rules: {
      ...config.rules,
      '@angular-eslint/component-selector': ['error', {
        type: 'element', prefix: 'my-app', style: 'kebab-case',
      }],
      '@angular-eslint/directive-selector': ['error', {
        type: 'attribute', prefix: 'myApp', style: 'camelCase',
      }],
    },
    languageOptions: {
      ...config.languageOptions,
      parserOptions: {
        ...(config.languageOptions?.parserOptions || {}),
        project: undefined,
        projectService: true,
      },
    },
  })),

  ...compat.config({ extends: ['plugin:@nx/angular-template'] }).map((config) => ({
    ...config,
    files: ['**/*.html'],
    rules: {},
  })),
];
```
