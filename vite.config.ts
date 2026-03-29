/// <reference types="vitest/config" />

import ViteReact from '@vitejs/plugin-react';
import { exec } from 'node:child_process';
import process from 'node:process';
import util from 'node:util';
import { defineConfig, loadEnv, type UserConfig } from 'vite';
import { patchCssModules } from 'vite-css-modules';
import { ViteImageOptimizer } from 'vite-plugin-image-optimizer';
import { ViteMinifyPlugin } from 'vite-plugin-minify';
import ViteSvgr from 'vite-plugin-svgr';
import type { MyImportMetaEnv } from './lib/define';
import { fromEntries, objectKeys } from './lib/object';
import * as packageJson from './package.json';

type MetaEnvKey<TEnv extends Record<string, unknown>> = Extract<
  keyof TEnv,
  string
>;

function makeMetaEnvDefines<TEnv extends Record<string, unknown>>(
  env: TEnv,
): Record<`import.meta.env.${MetaEnvKey<TEnv>}`, string> {
  return fromEntries(
    objectKeys(env).map((key) => [
      `import.meta.env.${key}` as const,
      JSON.stringify(env[key]),
    ]),
  );
}

// https://vite.dev/config/
export default defineConfig(async ({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const gitCommit = (
    await util.promisify(exec)('git rev-parse --short HEAD')
  ).stdout.trim();

  // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing -- we want to default to '/' if BASE is empty string too
  const base = env['BASE'] || '/';

  return {
    base,
    plugins: [
      ViteReact(),
      patchCssModules({
        generateSourceTypes: true,
        declarationMap: true,
      }),
      ViteImageOptimizer({
        // This is almost the same as ViteImageOptimizer's SVGO_CONFIG...
        svg: {
          multipass: true,
          plugins: [
            {
              name: 'preset-default',
              params: {
                overrides: {
                  cleanupNumericValues: false,
                  cleanupIds: {
                    minify: false,
                    remove: false,
                  },
                  convertPathData: false,
                  // ...except we disable this one, since it was breaking `@media (prefers-color-scheme: dark)`
                  inlineStyles: false,
                },
              },
            },
            'sortAttrs',
            {
              name: 'addAttributesToSVGElement',
              params: {
                attributes: [{ xmlns: 'http://www.w3.org/2000/svg' }],
              },
            },
          ],
        },
      }),
      ViteMinifyPlugin(),
      ViteSvgr(),
    ],
    define: makeMetaEnvDefines<MyImportMetaEnv>({
      GIT_COMMIT_SHORT_SHA: gitCommit,
      PACKAGE_DESCRIPTION: packageJson.description,
      PACKAGE_HOMEPAGE: packageJson.homepage,
      PACKAGE_AUTHOR: packageJson.author,
      PACKAGE_CONFIG_AUTHOR: packageJson.author.name,
      PACKAGE_BUGS: packageJson.bugs,
      PACKAGE_CONFIG_NAME: packageJson.config.name,
      PACKAGE_CONFIG_SHORT_NAME: packageJson.config.shortName,
      PACKAGE_CONFIG_DESCRIPTION: packageJson.config.description,
      PACKAGE_CONFIG_SHORT_DESCRIPTION: packageJson.config.shortDescription,
      PACKAGE_CONFIG_THEME_COLOR: packageJson.config.themeColor,
      PACKAGE_CONFIG_PUBLIC_URL_BASE: packageJson.config.publicUrlBase,
      PACKAGE_CONFIG_REPOSITORY_URL: packageJson.config.repositoryUrl,
    }),
    build: {
      outDir: 'build',
      target: 'es2023',
      // include sourcemaps even in prod... we are opensource after all, and this might help people debug issues
      sourcemap: true,
      // slower but slightly smaller output... and we don't build often
      minify: 'terser',
      rolldownOptions: {
        output: {
          // output node_modules stuff into a vendor chunk since it will presumably not change often and can be cached
          manualChunks(id) {
            if (id.includes('node_modules')) {
              return 'vendor';
            }

            return null;
          },
        },
      },
    },
    test: {
      environment: 'jsdom',
      globals: true,
      setupFiles: ['./test/setup.ts'],
    },
  } satisfies UserConfig;
});
