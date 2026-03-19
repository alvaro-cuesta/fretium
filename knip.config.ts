import type { KnipConfig } from 'knip';

const config: KnipConfig = {
  entry: [
    // for some reason Knip doesn't detect these module augmentations as used even though they are really needed
    'pwa-assets.config.ts',
    'src/define.d.ts',
  ],
  project: ['**/*.{js,jsx,ts,tsx}'],
};

export default config;
