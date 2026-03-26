import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { apiClient as api } from '../utils/apiClient';

const SiteContext = createContext();
const BOOTSTRAP_CACHE_KEY = 'mentriq_site_bootstrap_v1';
const BOOTSTRAP_TTL_MS = 5 * 60 * 1000;

export const SiteProvider = ({ children }) => {
    const [stats, setStats] = useState(null);
    const [settings, setSettings] = useState(null);
    const [mentors, setMentors] = useState([]);
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const inflightRef = useRef(null);

    const applyPayload = (payload) => {
        setStats(payload.stats ?? null);
        setSettings(payload.settings ?? null);
        setMentors(Array.isArray(payload.mentors) ? payload.mentors : []);
        setServices(Array.isArray(payload.services) ? payload.services : []);
    };

    const fetchData = async ({ silent = false } = {}) => {
        if (inflightRef.current) return inflightRef.current;
        if (!silent && !stats && !settings) setLoading(true);

        inflightRef.current = (async () => {
        try {
            const [statsRes, settingsRes, mentorsRes, servicesRes] = await Promise.all([
                api.get('/stats').catch(() => ({ data: null })),
                api.get('/settings').catch(() => ({ data: null })),
                api.get('/mentors').catch(() => ({ data: [] })),
                api.get('/services').catch(() => ({ data: [] }))
            ]);

            const payload = {
                stats: statsRes.data,
                settings: settingsRes.data,
                mentors: Array.isArray(mentorsRes.data) ? mentorsRes.data : [],
                services: Array.isArray(servicesRes.data) ? servicesRes.data : []
            };

            applyPayload(payload);

            sessionStorage.setItem(BOOTSTRAP_CACHE_KEY, JSON.stringify({
                ts: Date.now(),
                payload
            }));

            setError(null);
        } catch (err) {
            console.error("Site data initialization failed:", err);
            setError(err.message);
        } finally {
            setLoading(false);
            inflightRef.current = null;
        }
        })();
        return inflightRef.current;
    };

    useEffect(() => {
        try {
            const raw = sessionStorage.getItem(BOOTSTRAP_CACHE_KEY);
            if (raw) {
                const parsed = JSON.parse(raw);
                if (parsed?.ts && (Date.now() - parsed.ts) < BOOTSTRAP_TTL_MS && parsed.payload) {
                    applyPayload(parsed.payload);
                    setLoading(false);
                }
            }
        } catch {
            // no-op
        }

        fetchData({ silent: true });

        // Background refresh every 5 minutes
        const interval = setInterval(() => fetchData({ silent: true }), BOOTSTRAP_TTL_MS);
        return () => clearInterval(interval);
    }, []);

    return (
        <SiteContext.Provider value={{ stats, settings, mentors, services, loading, error, refreshData: fetchData }}>
            {children}
        </SiteContext.Provider>
    );
};

export const useSiteData = () => {
    const context = useContext(SiteContext);
    if (!context) {
        throw new Error('useSiteData must be used within a SiteProvider');
    }
    return context;
};
