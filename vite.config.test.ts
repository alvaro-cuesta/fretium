import indexHtml from './index.html?raw';
import { getPackageMetaEnv } from './lib/package-meta-env';
import * as packageJson from './package.json';

test('defines the author placeholder used by index.html', () => {
  expect(getPackageMetaEnv('test').PACKAGE_CONFIG_AUTHOR).toBe(
    packageJson.author.name,
  );

  expect(indexHtml).toContain('%PACKAGE_CONFIG_AUTHOR%');
});
