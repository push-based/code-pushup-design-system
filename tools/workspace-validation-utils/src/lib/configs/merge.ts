import { CoreConfig } from '@code-pushup/models';

// TODO: this acts as general deep object merge, replace by merge helper from @code-pushup/utils when released
export function mergeConfigs(
  config: Partial<CoreConfig>,
  ...configs: Partial<CoreConfig>[]
): CoreConfig {
  return configs.reduce<CoreConfig>(
    (acc, obj): CoreConfig =>
      Object.entries(obj).reduce((newAcc, [key, value]): CoreConfig => {
        if (Object.hasOwn(newAcc, key)) {
          const newAccProp = newAcc[key as keyof CoreConfig];
          if (Array.isArray(newAccProp) && Array.isArray(value)) {
            return { ...newAcc, [key]: [...newAccProp, ...value] };
          } else if (
            typeof newAccProp === 'object' &&
            value != null &&
            typeof value === 'object' &&
            !Array.isArray(newAccProp) &&
            !Array.isArray(value)
          ) {
            return {
              ...newAcc,
              [key]: mergeConfigs(
                newAccProp as CoreConfig,
                value as CoreConfig
              ),
            };
          } else {
            return { ...newAcc, [key]: [newAccProp, value].flat() };
          }
        } else {
          return { ...newAcc, [key]: value };
        }
      }, acc),

    config as CoreConfig
  );
}
