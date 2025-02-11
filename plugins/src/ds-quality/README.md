# Theme Coverage Plugin

The goal of this plugin is to maintain the quality of design system components.
It makes sure that the components and teh generated styles for the Figma Exporter are in sync.

## Deprecated Token Usage Audit - `deprecated-token-<token-name>`

This audit checks all design system component's style's for the usage of deprecated mixins and tokens.

### Usage of Deprecated Token in DS Component

**Checked components:**

```bash
root
┇
┣━━ 📂packages/design-system/ui
┇   ┣━━ 📂accordion/src/accordion.component.scss
    ┣━━ 📂button/src/button.component.scss
    ┣━━ 📂tab-bar/src/tab-bar.component.scss
    ┣━━ 📂progress-bar/src/progress-bar.component.scss
    ┇
```

**Issue Example**

This example showcases the usage of a deprecated token in `button/src/button.component.scss`.

```scss
.arrow-alignment {
  /* ❌ import of deprecated token `--ds-button-color-content` use `ds-button-color-text` instead */
  --ds-button-color-content: #010f18;
}
```

**Report Example**



## Deprecated Mixin Usage Audit - `deprecated-token-<token-name>`

This audit checks all design system components for deprecated tokens.

