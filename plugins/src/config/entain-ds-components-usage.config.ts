
import { dsComponents } from './design-system-components';
import { mergeComponents } from './utils';
import { dsComponentUsagePluginCoreConfig } from '../ds-component-coverage/src/core.config';
import { DsComponentUsagePluginConfig } from '../ds-component-coverage/src';

export function entainDsComponentUsageConfig(options: DsComponentUsagePluginConfig)
{
    return dsComponentUsagePluginCoreConfig({
        directory: options.directory,
        dsComponents: mergeComponents(dsComponents, options.dsComponents),
    });
}
