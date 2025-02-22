
import { dsComponents } from './design-system-components';
import { mergeComponents } from './utils';
import { dsComponentUsagePluginCoreConfig } from '../ds-component-coverage/src/core.config';

export function entainDsComponentUsageConfig(options: DsComponentUsagePluginConfig)
{
    return dsComponentUsagePluginCoreConfig({
        directory: options.directory,
        dsComponents: mergeComponents(dsComponents, options.dsComponents),
    });
}
