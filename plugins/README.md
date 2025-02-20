# Design System Status Tracking

The design systems health and implementation status can be tracked using the Angular Design System plugins.
It provides a comprehensive overview of the design system's usage across projects, components, and teams.
Further is checks if changed made in figma are reflected in the codebase.

## Plugins

- [Design System Component Coverage](./src/ds-component-coverage/README.md)
- [Design System Quality](./src/ds-quality/README.md)

### Design System Component Coverage Audit

This plugin checks deprecated class usage and definition:

- Recognises one or many components in a file identified over `@Component` decorator
- 🔲 Usage of classes in templates - [Class usage visitor](./src/ds-component-coverage/src/lib/runner/audits/ds-coverage/class-usage.visitor.ts)
  - ✏️ Recognises inline template under `template`
  - 🔗 Recognises external template linked under `templateUrl`
- 🎨 Definition of classes in styles - [Class definition visitor](./src/ds-component-coverage/src/lib/runner/audits/ds-coverage/class-definition.visitor.ts)
  - 🔗 Recognises single external styles linked under `styleUrl`
  - 🔗 Recognises one or many external styles linked under `styleUrls`
  - ✏️ Recognises one or many inline styles under `styles`

Read more about the [Design System Component Coverage](./src/ds-component-coverage/README.md) plugin.

### Design System Variable Usage Audit

This plugin checks the usage of deprecated CSS variables:

- 🎨 Usage of CSS mixins in styles - [Variable usage visitor](./src/ds-quality/src/lib/runner/audits/variable-usage/variable-usage.visitor.ts)
  - 🔗 Recognises single external styles linked under `styleUrl`
  - 🔗 Recognises one or many external styles linked under `styleUrls`
  - ✏️ Recognises one or many inline styles under `styles`

### Design System Mixin Usage Audit

This plugin checks the usage of deprecated CSS mixins:

- 🎨 Usage of CSS variables in styles - [Mixin usage visitor](./src/ds-quality/src/lib/runner/audits/mixins-usage/mixin-usage.visitor.ts)
  - 🔗 Recognises single external styles linked under `styleUrl`
  - 🔗 Recognises one or many external styles linked under `styleUrls`
  - ✏️ Recognises one or many inline styles under `styles`

Read more about the [Design System Quality](./src/ds-quality/README.md) plugin.
