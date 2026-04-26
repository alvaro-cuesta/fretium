import {
  defineConfig,
  minimal2023Preset as preset,
} from '@vite-pwa/assets-generator/config';

export default defineConfig({
  preset: {
    ...preset,
    maskable:
      typeof preset.maskable === 'object'
        ? {
            ...preset.maskable,
            padding: 0.1,
            resizeOptions: {
              ...preset.maskable.resizeOptions,
              background: '#1a1a2e',
            },
          }
        : preset.maskable,
  },
  images: ['public/favicon.svg'],
});
