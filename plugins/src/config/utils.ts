import {ComponentReplacement} from '@frontend/design-system-reports';

export function mergeComponents(
    list1: ComponentReplacement[],
    list2: ComponentReplacement[]
): ComponentReplacement[] {
    return [...list1, ...list2].reduce((acc, item) => {
        const existing = acc.find((entry) => entry.componentName.toLowerCase() === item.componentName.toLowerCase());
        if (existing) {
            existing.deprecatedCssClasses = Array.from(new Set([...existing.deprecatedCssClasses, ...item.deprecatedCssClasses]));
            existing.docsUrl ||= item.docsUrl;
        } else {
            acc.push({...item});
        }
        return acc;
    }, [] as ComponentReplacement[]);
}
