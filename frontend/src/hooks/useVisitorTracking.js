import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { apiClient as api } from '../utils/apiClient';

export const useVisitorTracking = () => {
    const location = useLocation();
    const sessionIdRef = useRef(sessionStorage.getItem('mentriq_session_id'));

    useEffect(() => {
        // Initialize Session ID if not present
        if (!sessionIdRef.current) {
            sessionIdRef.current = window.crypto?.randomUUID() || Math.random().toString(36).substring(2, 15);
            sessionStorage.setItem('mentriq_session_id', sessionIdRef.current);
        }

        const trackPath = async () => {
            try {
                // Don't track admin routes
                if (location.pathname.startsWith('/admin')) return;

                await api.post('/stats/track', {
                    sessionId: sessionIdRef.current,
                    path: location.pathname
                });
            } catch (err) {
                // Silent fail for tracking in production
                if (import.meta.env.DEV) console.warn("Traffic log failed:", err.message);
            }
        };

        const schedule =
            window.requestIdleCallback
                ? window.requestIdleCallback(() => {
                    trackPath();
                }, { timeout: 1500 })
                : window.setTimeout(() => {
                    trackPath();
                }, 250);

        return () => {
            if (typeof schedule === 'number') {
                window.clearTimeout(schedule);
            } else if (window.cancelIdleCallback) {
                window.cancelIdleCallback(schedule);
            }
        };
    }, [location.pathname]);
};
