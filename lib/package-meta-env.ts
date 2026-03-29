import * as packageJson from '../package.json';
import type { MyImportMetaEnv } from './define';

/**
 * Returns the package-derived metadata that is exposed through Vite's
 * import.meta.env replacement in both TypeScript modules and index.html.
 */
export function getPackageMetaEnv(gitCommitShortSha: string): MyImportMetaEnv {
  return {
    GIT_COMMIT_SHORT_SHA: gitCommitShortSha,
    PACKAGE_DESCRIPTION: packageJson.description,
    PACKAGE_HOMEPAGE: packageJson.homepage,
    PACKAGE_AUTHOR: packageJson.author,
    PACKAGE_CONFIG_AUTHOR: `${packageJson.author.name} (${packageJson.author.url})`,
    PACKAGE_BUGS: packageJson.bugs,
    PACKAGE_CONFIG_NAME: packageJson.config.name,
    PACKAGE_CONFIG_SHORT_NAME: packageJson.config.shortName,
    PACKAGE_CONFIG_DESCRIPTION: packageJson.config.description,
    PACKAGE_CONFIG_SHORT_DESCRIPTION: packageJson.config.shortDescription,
    PACKAGE_CONFIG_THEME_COLOR: packageJson.config.themeColor,
    PACKAGE_CONFIG_PUBLIC_URL_BASE: packageJson.config.publicUrlBase,
    PACKAGE_CONFIG_REPOSITORY_URL: packageJson.config.repositoryUrl,
  };
}
