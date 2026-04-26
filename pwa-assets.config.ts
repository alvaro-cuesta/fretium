import {
  defineConfig,
  minimal2023Preset as preset,
} from '@vite-pwa/assets-generator/config';

export default defineConfig({
  preset: {
    ...preset,
    maskable: {
      ...(typeof preset.maskable === 'object' ? preset.maskable : {}),
      // No extra padding — the source SVG already fits the canvas. The OS
      // clips to its icon shape (circle/squircle) but the logo stays large.
      padding: 0,
      resizeOptions: {
        background: '#1a1a2e',
      },
    },
  },
  images: ['public/favicon.svg'],
});
