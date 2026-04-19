/// <reference types="vitest/config" />

import ViteReact from '@vitejs/plugin-react';
import { exec } from 'node:child_process';
import process from 'node:process';
import util from 'node:util';
import { defineConfig, loadEnv, type Plugin, type UserConfig } from 'vite';
import { patchCssModules } from 'vite-css-modules';
import { ViteImageOptimizer } from 'vite-plugin-image-optimizer';
import { ViteMinifyPlugin } from 'vite-plugin-minify';
import ViteSvgr from 'vite-plugin-svgr';
import type { MyImportMetaEnv } from './lib/define';
import { fromEntries, objectKeys } from './lib/object';
import { getPackageMetaEnv } from './lib/package-meta-env';

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

/**
 * Minifies inline `<script type="application/ld+json">` blocks: parses the
 * body as JSON and re-serializes it without whitespace. Escapes `<` to
 * `\u003c` so the result cannot accidentally close the script tag.
 */
function minifyJsonLdPlugin(): Plugin {
  const OPEN = '<script type="application/ld+json">';
  const CLOSE = '</script>';

  return {
    name: 'minify-json-ld',
    transformIndexHtml: {
      order: 'post',
      handler(html) {
        let out = '';
        let cursor = 0;
        for (;;) {
          const start = html.indexOf(OPEN, cursor);
          if (start === -1) {
            out += html.slice(cursor);
            return out;
          }
          const bodyStart = start + OPEN.length;
          const bodyEnd = html.indexOf(CLOSE, bodyStart);
          if (bodyEnd === -1) {
            throw new Error(
              'minify-json-ld: unclosed <script type="application/ld+json"> tag',
            );
          }
          const body = html.slice(bodyStart, bodyEnd);
          const minified = JSON.stringify(JSON.parse(body)).replaceAll(
            '<',
            '\\u003c',
          );
          out += html.slice(cursor, bodyStart) + minified;
          cursor = bodyEnd;
        }
      },
    },
  };
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
      minifyJsonLdPlugin(),
    ],
    define: makeMetaEnvDefines<MyImportMetaEnv>(getPackageMetaEnv(gitCommit)),
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
