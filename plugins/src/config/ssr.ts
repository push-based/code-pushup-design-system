import {
  SsrAdoptionPluginConfig,
  ssrAdoptionPluginCoreConfig,
} from '../ssr-adoption/src/core.config';

export function ssrConfig(options: SsrAdoptionPluginConfig) {
  return ssrAdoptionPluginCoreConfig(options);
}
