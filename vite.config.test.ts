import { readFile } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import * as packageJson from './package.json';
import viteConfig from './vite.config';

test('defines the author placeholder used by index.html', async () => {
  const config = await viteConfig({
    command: 'build',
    mode: 'test',
    isPreview: false,
    isSsrBuild: false,
  });

  expect(config.define).toMatchObject({
    'import.meta.env.PACKAGE_CONFIG_AUTHOR': JSON.stringify(
      packageJson.author.name,
    ),
  });

  const indexHtml = await readFile(
    path.join(process.cwd(), 'index.html'),
    'utf8',
  );
  expect(indexHtml).toContain('%PACKAGE_CONFIG_AUTHOR%');
});
