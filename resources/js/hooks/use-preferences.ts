import { useEffect, useState } from 'react';

export function usePreferences() {
    const [dark, setDark] = useState(() => {
        try { return localStorage.getItem('mdkp-theme') === 'dark'; } catch { return false; }
    });
    const [camera, setCamera] = useState(() => {
        try { return String(JSON.parse(localStorage.getItem('mdkp-preferences') || '{}').camera || ''); } catch { return ''; }
    });
    useEffect(() => {
        document.documentElement.dataset.theme = dark ? 'dark' : 'light';
        document.documentElement.classList.toggle('dark', dark);
        try { localStorage.setItem('mdkp-theme', dark ? 'dark' : 'light'); } catch { /* Browser storage is optional. */ }
    }, [dark]);
    function saveCamera(value: string) {
        localStorage.setItem('mdkp-preferences', JSON.stringify({ camera: value }));
        setCamera(value);
    }
    return { dark, setDark, camera, saveCamera };
}
