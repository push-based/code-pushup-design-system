# Design System Component Coverage Plugin

The goal of this plugin is to measure the correct usage and implementation of the design system components.
It makes sure that the components replace legacy components with design system components.

## Setup 

```ts

```

## Deprecated Token Usage Audit - `component-coverage-<component-name>`

This audit checks all components for the usage of specific legacy classes and provides actionable feedback on how to replace them.

### Usage of Legacy Classes in DS Component

**Checked components:**

```bash
root
┇
┣━━ 📂packages/sports/...
    ┣━━ 📂bet-slip/src/bet-slip.component.ts
    ┇
```

**Issue Example**

This example showcases the usage of a deprecated token in `bet-slip/src/bet-slip.component.ts`.

```ts
@Comment({
  selector: 'bet-slip',
  template: `
    <!-- ❌ usage of legacy class 'btn' use 'ds-button' component instead -->
    <button class="btn">Place Bet</button>
  `,  
  styles: [`
    /* ❌ definition of legacy class 'btn' use 'ds-button' component instead */
    .btn {
      color: #010f18;
    }
  `]
})
```
