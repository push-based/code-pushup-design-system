import { Issue } from '@code-pushup/models';

export const deprecatedCssVars = [
  '--ds-alert-caution-color-bg',
  '--ds-alert-caution-color-border',
  '--ds-carousel-arrow-color-bg',
  '--ds-carousel-arrow-color-border',
  '--ds-carousel-arrow-color-icon',
];

export const createCssVarUsageVisitor = (): {} => {
  let diagnostics: Issue[] = [];

  return {
    getIssues(): Issue[] {
      return diagnostics;
    },

    clear(): void {
      diagnostics = [];
    },

    visitDecl(decl) {
      // Extract CSS variable names
      const matches = decl.value.match(/var\((--[\w-]+)\)/g) || [];
      matches.forEach((match) => {
        const cssVar = match.replace(/var\(|\)/g, ''); // Extract only variable name
        if (deprecatedCssVars.includes(cssVar)) {
          const message = generateCssVarUsageMessage({
            cssVar,
            property: decl.prop,
            docsUrl: 'https://your-docs-link.com',
          });
          diagnostics.push({
            message,
            severity: 'error',
            source: {
              file: decl.source.input.file,
            },
          });
        }
      });
    },
  };
};

function generateCssVarUsageMessage({
  cssVar,
  property,
  docsUrl,
  icon = '🎨',
}: {
  icon?: string;
  cssVar: string;
  property: string;
  docsUrl?: string;
}): string {
  const iconString = icon ? `${icon} ` : '';
  const docsLink = docsUrl
    ? ` <a href="${docsUrl}" target="_blank">Learn more</a>.`
    : '';
  return `${iconString} The CSS variable <code>${cssVar}</code> in <code>${property}</code> is deprecated. Replace it with the recommended alternative.${docsLink}`;
}
