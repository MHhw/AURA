import { useState, useEffect } from 'react';

export type Mode = 'login' | 'register' | 'recover';

function resolveMode(pathname: string): Mode {
    if (pathname.includes('register')) return 'register';
    if (pathname.includes('recover')) return 'recover';
    return 'login';
}

function modeToPath(mode: Mode) {
    if (mode === 'register') return '/register';
    if (mode === 'recover') return '/recover';
    return '/login';
}

export function useRouteMode(): [Mode, (mode: Mode) => void] {
    const [mode, setMode] = useState<Mode>(() => resolveMode(window.location.pathname));

    useEffect(() => {
        const handler = () => setMode(resolveMode(window.location.pathname));
        window.addEventListener('popstate', handler);
        return () => window.removeEventListener('popstate', handler);
    }, []);

    const navigate = (nextMode: Mode) => {
        const path = modeToPath(nextMode);
        if (window.location.pathname !== path) {
            window.history.pushState({}, '', path);
        }
        setMode(nextMode);
    };

    useEffect(() => {
        const path = modeToPath(mode);
        if (window.location.pathname !== path) {
            window.history.replaceState({}, '', path);
        }
    }, [mode]);

    return [mode, navigate];
}