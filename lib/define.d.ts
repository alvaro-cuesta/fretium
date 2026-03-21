import type packageJson from '../package.json';

export type MyImportMetaEnv = {
  readonly GIT_COMMIT_SHORT_SHA: string;
  readonly PACKAGE_DESCRIPTION: typeof packageJson.description;
  readonly PACKAGE_HOMEPAGE: typeof packageJson.homepage;
  readonly PACKAGE_AUTHOR: typeof packageJson.author;
  readonly PACKAGE_BUGS: typeof packageJson.bugs;
  readonly PACKAGE_CONFIG_NAME: typeof packageJson.config.name;
  readonly PACKAGE_CONFIG_SHORT_NAME: typeof packageJson.config.shortName;
  readonly PACKAGE_CONFIG_DESCRIPTION: typeof packageJson.config.description;
  readonly PACKAGE_CONFIG_SHORT_DESCRIPTION: typeof packageJson.config.shortDescription;
  readonly PACKAGE_CONFIG_THEME_COLOR: typeof packageJson.config.themeColor;
  readonly PACKAGE_CONFIG_PUBLIC_URL_BASE: typeof packageJson.config.publicUrlBase;
  readonly PACKAGE_CONFIG_REPOSITORY_URL: typeof packageJson.config.repositoryUrl;
};

declare global {
  // eslint-disable-next-line @typescript-eslint/consistent-type-definitions, @typescript-eslint/no-empty-object-type -- ImportMetaEnv must be augmented as an interface for Vite's global typing
  interface ImportMetaEnv extends MyImportMetaEnv {}
}
