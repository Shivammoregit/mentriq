import React, { useState, useEffect } from 'react';
import { Clock, Percent, X, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import { apiClient } from '../../utils/apiClient';

const DiscountBanner = () => {
    const location = useLocation();
    const [promo, setPromo] = useState(null);
    const [internshipPromo, setInternshipPromo] = useState(null);
    const [timeLeft, setTimeLeft] = useState({ d: 0, h: 0, m: 0, s: 0, expired: true });
    const [visible, setVisible] = useState(true);

    useEffect(() => {
        const fetchPromo = async () => {
            try {
                const { data } = await apiClient.get('/settings');
                if (data?.promo?.isActive && new Date(data.promo.endDate) > new Date() && data.promo.appliesTo?.courses !== false) {
                    setPromo(data.promo);
                }
                if (data?.internshipPromo?.isActive && new Date(data.internshipPromo.endDate) > new Date()) {
                    setInternshipPromo(data.internshipPromo);
                }
            } catch (error) {
                console.error("Failed to fetch promos:", error);
            }
        };
        fetchPromo();
    }, []);

    const isInternshipRoute = location.pathname.includes('/internship') || location.pathname.includes('/applications');
    const activePromo = isInternshipRoute ? internshipPromo : promo;

    useEffect(() => {
        if (!activePromo || !activePromo.endDate) return;

        const endDate = new Date(activePromo.endDate).getTime();

        const calculateTimeLeft = () => {
            const now = new Date().getTime();
            const difference = endDate - now;

            if (difference <= 0) {
                setTimeLeft({ d: 0, h: 0, m: 0, s: 0, expired: true });
                return;
            }

            setTimeLeft({
                d: Math.floor(difference / (1000 * 60 * 60 * 24)),
                h: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
                m: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
                s: Math.floor((difference % (1000 * 60)) / 1000),
                expired: false
            });
        };

        calculateTimeLeft();
        const timer = setInterval(calculateTimeLeft, 1000);
        return () => clearInterval(timer);
    }, [activePromo]);

    if (!activePromo || timeLeft.expired || !visible) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ y: '100%', opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: '100%', opacity: 0 }}
                transition={{ type: 'spring', damping: 30, stiffness: 280 }}
                className="fixed bottom-0 left-0 right-0 bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-500 border-t border-emerald-400/30 w-full z-[60] overflow-hidden shadow-2xl shadow-emerald-900/40"
            >
                {/* Background animations */}
                <div className="absolute inset-0 opacity-20 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMSIgY3k9IjEiIHI9IjEiIGZpbGw9IiNmZmYiLz48L3N2Zz4=')] bg-[length:20px_20px] animate-[slide_20s_linear_infinite]" />
                <div className="absolute top-0 right-0 w-64 h-full bg-white opacity-10 skew-x-12 translate-x-32 animate-[shine_4s_ease-in-out_infinite]" />

                <div className="max-w-7xl mx-auto px-4 py-2 sm:px-6 lg:px-8 relative container flex flex-col sm:flex-row items-center justify-center sm:justify-between gap-2 sm:gap-6">
                    {/* Left side info */}
                    <div className="flex items-center gap-3">
                        <div className="bg-white/20 p-1.5 rounded-lg flex-shrink-0">
                            <Percent size={18} className="text-white" />
                        </div>
                        <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 text-white">
                            <span className="font-extrabold text-sm uppercase tracking-wider flex items-center gap-2">
                                {activePromo.title}
                                <Sparkles size={14} className="text-yellow-300 hidden sm:block animate-pulse" />
                            </span>
                            <span className="text-xs sm:text-sm font-medium bg-black/20 px-2 py-0.5 rounded-full border border-white/10 hidden sm:inline-flex">
                                Flat {activePromo.discountPercentage}% OFF on {isInternshipRoute ? "ALL Internships" : "ALL Courses"}
                            </span>
                        </div>
                    </div>

                    {/* Right side timer */}
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                            <Clock size={16} className="text-white hidden sm:block" />
                            <div className="flex items-center gap-1.5 font-mono">
                                <span className="bg-white text-emerald-700 px-2 py-1 rounded shadow-sm text-sm font-bold min-w-[2rem] text-center">{timeLeft.d}d</span>
                                <span className="text-white font-bold">:</span>
                                <span className="bg-white text-emerald-700 px-2 py-1 rounded shadow-sm text-sm font-bold min-w-[2rem] text-center">{timeLeft.h.toString().padStart(2, '0')}h</span>
                                <span className="text-white font-bold">:</span>
                                <span className="bg-white text-emerald-700 px-2 py-1 rounded shadow-sm text-sm font-bold min-w-[2rem] text-center">{timeLeft.m.toString().padStart(2, '0')}m</span>
                                <span className="text-white font-bold">:</span>
                                <span className="bg-white text-emerald-700 px-2 py-1 rounded shadow-sm text-sm font-bold min-w-[2rem] text-center">{timeLeft.s.toString().padStart(2, '0')}s</span>
                            </div>
                        </div>

                        {/* Close button */}
                        <button 
                            onClick={() => setVisible(false)}
                            className="text-white/70 hover:text-white p-1 rounded-full hover:bg-white/10 transition-colors hidden sm:block"
                            aria-label="Dismiss banner"
                        >
                            <X size={16} />
                        </button>
                    </div>
                </div>
            </motion.div>
        </AnimatePresence>
    );
};

export default DiscountBanner;
