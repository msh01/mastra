import type { Plugin } from 'rollup';
import { isDependencyPartOfPackage } from '../utils';

export function subpathExternalsResolver(externals: string[]): Plugin {
  function isExternalSubpath(id: string) {
    if (id.startsWith('.') || id.startsWith('/')) {
      return false;
    }

    return externals.some(external => isDependencyPartOfPackage(id, external));
  }

  return {
    name: 'subpath-externals-resolver',
    resolveId(id) {
      if (isExternalSubpath(id)) {
        return {
          id,
          external: true,
        };
      }

      return null;
    },
    resolveDynamicImport(specifier) {
      if (typeof specifier === 'string' && isExternalSubpath(specifier)) {
        return {
          id: specifier,
          external: true,
        };
      }

      return null;
    },
  } satisfies Plugin;
}
