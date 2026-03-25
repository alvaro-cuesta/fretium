#!/usr/bin/env node

import path from 'node:path';
import sharp from 'sharp';

const pathCwd = process.cwd();
const pathPublicSrc = path.join(pathCwd, 'public-src');
const pathPublic = path.join(pathCwd, 'public');

await Promise.all([
  sharp(path.join(pathPublicSrc, 'fretium-og-center.svg'))
    .png()
    .toFile(path.join(pathPublic, 'fretium-og-center.png')),
  sharp(path.join(pathPublicSrc, 'fretium-twitter.svg'))
    .png()
    .toFile(path.join(pathPublic, 'fretium-twitter.png')),
]);
