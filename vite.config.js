import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Self-contained apps that are built separately into public/<name>/ (see apps/).
// GitHub Pages serves their index.html for /<name>/ automatically; this plugin does
// the same for `npm run dev` / `npm run preview` so the links work locally too.
const STATIC_APPS = ['roastmyrepo'];

function staticApps() {
  const rewrite = (req, _res, next) => {
    const path = (req.url || '').split('?')[0];
    for (const app of STATIC_APPS) {
      if (path === `/${app}` || path === `/${app}/`) req.url = `/${app}/index.html`;
    }
    next();
  };
  return {
    name: 'static-apps',
    configureServer(server) { server.middlewares.use(rewrite); },
    configurePreviewServer(server) { server.middlewares.use(rewrite); },
  };
}

export default defineConfig({
  plugins: [staticApps(), react()],
  base: '/',
});
