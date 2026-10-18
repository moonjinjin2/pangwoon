import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';

// 쯔꾸르 게임은 '$brown.png' 같은 파일을 '%24brown.png'로 요청하는데,
// Vite 개발 서버는 %24를 풀지 않아 파일을 못 찾고 index.html을 돌려줌 → '$'로 바꿔서 넘김
const decodeDollar = (req: { url?: string }, _res: unknown, next: () => void) => {
  if (req.url?.includes('%24')) req.url = req.url.replace(/%24/gi, '$');
  next();
};

const servePublicDollarFiles = (): Plugin => ({
  name: 'serve-public-dollar-files',
  configureServer: (server) => void server.middlewares.use(decodeDollar),
  configurePreviewServer: (server) => void server.middlewares.use(decodeDollar),
});

export default defineConfig({
  base: '/pangwoon/',
  plugins: [react(), servePublicDollarFiles()],
  server: { port: 3000, open: true },
});
