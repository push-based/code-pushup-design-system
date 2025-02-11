# Code PushUp Report

| 🏷 Category                                     |  ⭐ Score  | 🛡 Audits |
|:------------------------------------------------| :-------: | :-------: |
| [Design System Quality](#design-system-quality) | 🔴 **38** |    13     |

## 🏷 Categories

### Design System Quality

Quality of design system code itself

🔴 Score: **38**

- 🟥 [Deprecated Token Usage - accordion token](#usage-coverage-for-dsbutton-component-angular-design-system-coverage) (_Angular Design System Quality_) - **2 classes found**
- 🟩 [Deprecated Token Usage - component token](#usage-coverage-for-dsaccordion-component-angular-design-system-coverage) (_Angular Design System Quality_) - **0 classes found**

## 🛡️ Audits

### Usage coverage for DSButton component (Angular Design System Coverage)

<details>
<summary>🟥 <b>7 classes found</b> (score: 0)</summary>

#### Issues

[acord](../../mocks/fixtures/minimal-design-system/ui/accordion/src/accordion.component.scss)

|  Severity  | Message                                                                                                                                                                                                                                                                          | Source file                                                                                                                                                                                                                  | Line(s) |
| :--------: |:---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------| :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :-----: |
| 🚨 _error_ | ✏️🔲  Element <code>button</code> in attribute <code>class</code> uses deprecated class <code>btn-primary</code>. Use <code>DSButton</code> instead. <a href="https://storybook.entaingroup.corp/latest/?path=/docs/components-button--overview" target="_blank">Learn more</a>. | [`plugins/ds-component-coverage/mocks/fixtures/coverage-audit/demo/bad-mixed.component.ts`](../../../../plugins/ds-component-coverage/mocks/fixtures/coverage-audit/demo/bad-mixed.component.ts)                             |   10    |
| 🚨 _error_ | 🔗🎨 The token <code>???</code> is deprecated. Use <code>???</code> instead. <a href="../../mocks/fixtures/minimal-design-system/ui/accordion/src/accordion.component.scss")                                                                                                                                                                                      |  7-14   |

</details>

Quality audit for token usage in components.
