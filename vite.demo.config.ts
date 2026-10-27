import { readFileSync } from 'node:fs';
import { fileURLToPath, URL } from 'node:url';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

const assets = [
    'assets/mdkp-logo.png',
    'assets/mdkp-logo-transparent.png',
    'assets/user-avatar.svg',
    'assets/vehicle-demo.jpg',
    'cctv_demo/cctv_demo_1_edited-processed.mp4',
    'cctv_demo/cctv_demo_2_edited-processed.mp4',
];

export default defineConfig({
    publicDir: false,
    plugins: [react(), tailwindcss(), {
        name: 'demo-public-assets',
        generateBundle() {
            for (const name of assets) {
                this.emitFile({ type: 'asset', fileName: name, source: readFileSync(new URL(`./public/${name}`, import.meta.url)) });
            }
        },
        configureServer(server) {
            server.middlewares.use((request, response, next) => {
                const name = assets.find(asset => request.url?.split('?')[0] === `/${asset}`);
                if (!name) { next(); return; }
                response.setHeader('Content-Type', name.endsWith('.mp4') ? 'video/mp4' : name.endsWith('.svg') ? 'image/svg+xml' : name.endsWith('.png') ? 'image/png' : 'image/jpeg');
                response.end(readFileSync(new URL(`./public/${name}`, import.meta.url)));
            });
        },
    }],
    resolve: { alias: { '@': fileURLToPath(new URL('./resources/js', import.meta.url)) } },
    build: { outDir: 'dist', sourcemap: false },
});
