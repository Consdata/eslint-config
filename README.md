# eslint-config

Consdata eslint rules

# Paczka

https://www.npmjs.com/package/@consdata/eslint-config

# Publikacja

## Zmiana wersji

```shell
npm version patch  # dla poprawek (np. 1.0.3 -> 1.0.4)
npm version minor  # dla nowych funkcjonalności (np. 1.0.3 -> 1.1.0)
npm version major  # dla przełomowych zmian (np. 1.0.3 -> 2.0.0)
```

lub manualnie w package.json

## Logowanie do npm

```shell
npm login
```

## Publikacja

```shell
npm publish --dry-run --access public
```

jeżeli ok

```shell
npm publish --access public
```
