import { readFileSync } from 'node:fs';
import { fileURLToPath, URL } from 'node:url';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

const assets = ['mdkp-logo.png', 'mdkp-logo-transparent.png', 'user-avatar.svg', 'vehicle-demo.jpg'];

export default defineConfig({
    publicDir: false,
    plugins: [react(), tailwindcss(), {
        name: 'demo-public-assets',
        generateBundle() {
            for (const name of assets) {
                this.emitFile({ type: 'asset', fileName: `assets/${name}`, source: readFileSync(new URL(`./public/assets/${name}`, import.meta.url)) });
            }
        },
        configureServer(server) {
            server.middlewares.use((request, response, next) => {
                const name = assets.find(asset => request.url?.split('?')[0] === `/assets/${asset}`);
                if (!name) { next(); return; }
                response.setHeader('Content-Type', name.endsWith('.svg') ? 'image/svg+xml' : name.endsWith('.png') ? 'image/png' : 'image/jpeg');
                response.end(readFileSync(new URL(`./public/assets/${name}`, import.meta.url)));
            });
        },
    }],
    resolve: { alias: { '@': fileURLToPath(new URL('./resources/js', import.meta.url)) } },
    build: { outDir: 'dist', sourcemap: false },
});
