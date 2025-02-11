import { TokenReplacement } from '../../../src/lib/runner/audits/style-tokens/types';
import dsQualityPlugin from '../../../ds-quality.plugin';

const deprecatedTokens: TokenReplacement[] = [
  {
    "tokenName": "accordion-primary-active",
    "deprecatedTokens": [
      "semantic-color-ds-accordion-background-active",
      "accordion",
      "accordion-primary",
      "legacy-accordion"
    ],
    "docsUrl": "https://storybook.entaingroup.corp/latest/?path=/docs/tokens"
  },
  {
    "tokenName": "btn-secondary-active",
    "deprecatedTokens": [
      "ds-segement-item-active-color-bg",
      "ds-segement-item-active-color-icon",
      "ds-segement-item-active-color-label",
      "btn-secondary",
      "legacy-secondary-button"
    ],
    "docsUrl": "https://storybook.entaingroup.corp/latest/?path=/docs/tokens"
  },
  {
    "tokenName": "input-text-field-active",
    "deprecatedTokens": [
      "ds-input-text-field-focused-color-background",
      "ds-input-text-field-focused-color-border",
      "ds-input-text-field-focused-color-input-text"
    ],
    "docsUrl": "https://storybook.entaingroup.corp/latest/?path=/docs/tokens"
  },
  {
    "tokenName": "checkbox-active",
    "deprecatedTokens": [
      "ds-checkbox-size-border-width",
      "ds-checkbox-size-icon",
      "ds-checkbox-size-min-height",
      "ds-checkbox-size-min-width",
      "legacy-checkbox"
    ],
    "docsUrl": "https://storybook.entaingroup.corp/latest/?path=/docs/tokens"
  },
  {
    "tokenName": "radio-active",
    "deprecatedTokens": [
      "ds-radio-size-border-width",
      "ds-radio-size-min-height",
      "ds-radio-size-min-width",
      "ds-radio-size-selected-indicator",
      "legacy-radio"
    ],
    "docsUrl": "https://storybook.entaingroup.corp/latest/?path=/docs/tokens"
  },
  {
    "tokenName": "range-slider-active",
    "deprecatedTokens": [
      "ds-range-selector-active-color-color",
      "ds-range-selector-default-color-background",
      "ds-range-selector-default-color-enabled",
      "legacy-range-slider"
    ],
    "docsUrl": "https://storybook.entaingroup.corp/latest/?path=/docs/tokens"
  },
  {
    "tokenName": "search-active",
    "deprecatedTokens": [
      "ds-search-active-color-bg",
      "ds-search-active-color-border",
      "ds-search-active-color-icon",
      "ds-search-active-color-text",
      "legacy-search"
    ],
    "docsUrl": "https://storybook.entaingroup.corp/latest/?path=/docs/tokens"
  },
  {
    "tokenName": "pagination-active",
    "deprecatedTokens": [
      "ds-pagination-dot-color-bg",
      "ds-progress-bar-color-background",
      "ds-progress-bar-color-counter-border",
      "ds-progress-bar-color-counter-text",
      "legacy-pagination"
    ],
    "docsUrl": "https://storybook.entaingroup.corp/latest/?path=/docs/tokens"
  },
  {
    "tokenName": "tooltip-active",
    "deprecatedTokens": [
      "ds-tooltip-color-background",
      "ds-tooltip-color-text",
      "ds-tooltip-color-title",
      "legacy-tooltip"
    ],
    "docsUrl": "https://storybook.entaingroup.corp/latest/?path=/docs/tokens"
  },
  {
    "tokenName": "toast-message-active",
    "deprecatedTokens": [
      "ds-toast-message-color-icon",
      "ds-toast-message-color-text",
      "legacy-toast"
    ],
    "docsUrl": "https://storybook.entaingroup.corp/latest/?path=/docs/tokens"
  }
];

export default {
  persist: {
    outputDir: '.code-pushup/angular-ds/ds-quality/template-syntax',
    format: ['json', 'md'],
  },
  plugins: [
    dsQualityPlugin({
      directory: 'plugins/src/ds-quality/mocks/fixtures/minimal-design-system',
      deprecatedTokens,
    }),
  ],
};
