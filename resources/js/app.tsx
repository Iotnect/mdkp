import '../css/app.css';
import { createInertiaApp } from '@inertiajs/react';
import { createRoot } from 'react-dom/client';

createInertiaApp({
    title: (title) => `${title} · Majlis Daerah Kuala Pilah`,
    resolve: (name) => {
        if (name === 'Login') return import('./pages/Login').then(module => module.default);
        if (name === 'Dashboard') return import('./pages/Dashboard').then(module => module.default);
        throw new Error(`Unknown page: ${name}`);
    },
    setup({ el, App, props }) {
        if (el) createRoot(el).render(<App {...props} />);
    },
    progress: { color: '#7457d9' },
});
