# ServerSideRendering Adoption Plugin

The goal of this plugin is to track needed refactoring and adoption for ServerSideRendering in a project.

The plugin checks different parts of a project based on eslint rules and other custom checks to determine the readiness of a project for ServerSideRendering.

Typically, the plugin is configured to check product folders.

The following audits are included in the plugin:
- `EsLint` - Tracks usage of globals, and other browser-specific APIs hindering SSR adoption
  - `no-restricted-globals` - `window`, `document`
  - `no-restricted-properties` - `window`, `document`
  - `@nx/workspace-no-this-window-document`

## Setup

`code-pushup.config.ts`

```ts
import { ssrAdoptionPluginCoreConfig } from './src/index.ts';

export default ssrAdoptionPluginCoreConfig({
  patterns: ['.'],
  eslintrc:
    'plugins/src/ssr-adoption/src/eslint.config.ssr.cjs'
});
```

In the folder where the config is located run `npx @code-pushup/cli`.

#### EsLint Issues Example

```md
|  Severity  | Message                                                                                                                                               | Source file                                                                                                                                                                                                          | Line(s) |
| :--------: | :---------------------------------------------------------------------------------------------------------------------------------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :-----: |
| 🚨 _error_ |                        | [``]() |  4-20   |
```
