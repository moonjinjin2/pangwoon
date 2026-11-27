import { createHash } from 'node:crypto';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import sharp from 'sharp';

// 빌드할 때만 PNG·JPG 이미지를 WebP로 바꿔서 넣음 (src/img의 원본 파일은 그대로 둠)
// 화질이 아쉬우면 quality를 올리고, 원본 그대로 쓰려면 plugins에서 webpImages()를 빼면 됨
function webpImages(quality = 85): Plugin {
  let cacheDir = '';
  return {
    name: 'webp-images',
    apply: 'build',
    enforce: 'pre',
    configResolved(config) {
      cacheDir = path.join(config.cacheDir, 'webp');
    },
    async load(id) {
      const [file, query = ''] = id.split('?');
      // 그냥 import하거나 ?url로 불러온 이미지만 바꿈 (?raw·?inline 같은 다른 용도는 그대로)
      if (!/\.(png|jpe?g)$/i.test(file) || (query && query !== 'url')) return null;
      const source = await readFile(file);
      // 바꾼 결과를 저장해 두고 원본이 그대로면 다시 바꾸지 않음 (빌드 시간 절약)
      const hash = createHash('sha1').update(source).update(`q${quality}`).digest('hex');
      const cached = path.join(cacheDir, `${hash}.webp`);
      const webp =
        (await readFile(cached).catch(() => undefined)) ??
        (await sharp(source).webp({ quality, alphaQuality: 90, effort: 5 }).toBuffer());
      await mkdir(cacheDir, { recursive: true });
      await writeFile(cached, webp);
      // 아주 작은 이미지는 WebP가 더 클 수도 있어서 그때는 원본을 씀
      const smaller = webp.length < source.length;
      const name = smaller ? path.basename(file).replace(/\.\w+$/, '.webp') : path.basename(file);
      const ref = this.emitFile({ type: 'asset', name, source: smaller ? webp : source });
      return `export default import.meta.ROLLUP_FILE_URL_${ref};`;
    },
  };
}

export default defineConfig({
  base: '/pangwoon/',
  plugins: [webpImages(), react()],
  server: { port: 3000, open: true },
});
