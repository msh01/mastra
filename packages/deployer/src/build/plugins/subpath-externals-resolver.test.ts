import type { Plugin } from 'rollup';
import { describe, expect, it } from 'vitest';
import { subpathExternalsResolver } from './subpath-externals-resolver';

describe('subpathExternalsResolver', () => {
  const createPlugin = (externals: string[]) => subpathExternalsResolver(externals) as Required<Plugin>;

  const resolveId = (plugin: Required<Plugin>, id: string) => {
    const hook = plugin.resolveId as Function;
    return hook.call({}, id, undefined, {});
  };

  const resolveDynamicImport = (plugin: Required<Plugin>, specifier: string | object) => {
    const hook = plugin.resolveDynamicImport as Function;
    return hook.call({}, specifier, undefined, {});
  };

  it('marks static external subpath imports as external without rewriting them', () => {
    const plugin = createPlugin(['@arizeai/phoenix-client/prompts']);

    expect(resolveId(plugin, '@arizeai/phoenix-client/prompts')).toEqual({
      id: '@arizeai/phoenix-client/prompts',
      external: true,
    });
  });

  it('marks dynamic external subpath imports as external without rewriting them', () => {
    const plugin = createPlugin(['@arizeai/phoenix-client/prompts']);

    expect(resolveDynamicImport(plugin, '@arizeai/phoenix-client/prompts')).toEqual({
      id: '@arizeai/phoenix-client/prompts',
      external: true,
    });
  });

  it('matches subpaths of external packages for dynamic imports', () => {
    const plugin = createPlugin(['@arizeai/phoenix-client']);

    expect(resolveDynamicImport(plugin, '@arizeai/phoenix-client/prompts')).toEqual({
      id: '@arizeai/phoenix-client/prompts',
      external: true,
    });
  });

  it('ignores non-string dynamic import specifiers', () => {
    const plugin = createPlugin(['@arizeai/phoenix-client']);

    expect(resolveDynamicImport(plugin, { type: 'Identifier', name: 'specifier' })).toBeNull();
  });

  it('ignores relative dynamic imports', () => {
    const plugin = createPlugin(['@arizeai/phoenix-client']);

    expect(resolveDynamicImport(plugin, './prompts')).toBeNull();
  });
});
