import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, UserCircle2 } from 'lucide-react';
import { apiClient as api } from '../../utils/apiClient';
import { resolveImageUrl } from '../../utils/imageUtils';

const FALLBACK = 'https://ui-avatars.com/api/?background=6366f1&color=fff&name=';

const StudentImpact = () => {
    const [feedbacks, setFeedbacks] = useState([]);
    const [current, setCurrent] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchFeedbacks = async () => {
            try {
                const { data } = await api.get('/feedbacks');
                setFeedbacks(data || []);
            } catch (error) {
                console.error('Failed to load testimonials:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchFeedbacks();
    }, []);

    // Auto-advance
    useEffect(() => {
        if (feedbacks.length <= 1) return;
        const t = setInterval(() => {
            setCurrent(prev => (prev + 1) % feedbacks.length);
        }, 5000);
        return () => clearInterval(t);
    }, [feedbacks.length]);

    const goTo = useCallback((i) => setCurrent(i), []);

    if (loading || feedbacks.length === 0) return null;

    const fb = feedbacks[current];
    const progressWidth = `${((current + 1) / feedbacks.length) * 100}%`;

    return (
        <section className="relative py-10 md:py-12 bg-white overflow-hidden">
            {/* Soft background blobs */}
            <div className="absolute top-0 left-1/4 w-[500px] h-[400px] bg-indigo-50/60 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-0 right-1/4 w-[400px] h-[300px] bg-cyan-50/50 rounded-full blur-[100px] pointer-events-none" />

            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-10 relative z-10">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-7 md:mb-8"
                >
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-600 text-[9px] font-black uppercase tracking-[0.22em] mb-4">
                        <UserCircle2 size={12} />
                        Verified Success Stories
                    </div>
                    <h2 className="text-3xl sm:text-[2.8rem] md:text-[3.1rem] font-black font-display tracking-tighter uppercase text-slate-900 leading-[0.95]">
                        Student{' '}
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-cyan-500">
                            Impact.
                        </span>
                    </h2>
                </motion.div>

                {/* Testimonial Card */}
                <div className="max-w-[760px] mx-auto">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={fb._id}
                            initial={{ opacity: 0, x: 40 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -40 }}
                            transition={{ duration: 0.5, ease: "easeOut" }}
                            className="relative"
                        >
                            <div className="relative bg-white border border-slate-100 rounded-[1.25rem] shadow-[0_20px_50px_-38px_rgba(15,23,42,0.4)] px-4 py-4 sm:px-5 sm:py-5 md:px-5 md:py-5">
                                <div className="relative z-10 flex flex-col sm:flex-row sm:items-center gap-3.5 sm:gap-4">
                                    <div className="relative w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-xl overflow-hidden border-4 border-white shadow-[0_12px_24px_-18px_rgba(15,23,42,0.35)] bg-indigo-50 shrink-0">
                                        <img
                                            src={fb.image
                                                ? resolveImageUrl(fb.image, FALLBACK + encodeURIComponent(fb.name))
                                                : FALLBACK + encodeURIComponent(fb.name)}
                                            alt={fb.name}
                                            className="w-full h-full object-cover"
                                            onError={(e) => { e.target.src = FALLBACK + encodeURIComponent(fb.name); }}
                                        />
                                        <div className="absolute -bottom-2 -right-2 w-7 h-7 rounded-lg bg-indigo-600 border-4 border-white flex items-center justify-center shadow-lg">
                                            <Star className="w-2.5 h-2.5 text-white fill-white" />
                                        </div>
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full border border-indigo-100 bg-indigo-50 mb-2">
                                            <div className="flex gap-1">
                                                {[...Array(5)].map((_, i) => (
                                                    <Star
                                                        key={i}
                                                        size={9}
                                                        className={i < (fb.rating || 5) ? 'text-indigo-500 fill-indigo-500' : 'text-indigo-200 fill-indigo-200'}
                                                    />
                                                ))}
                                            </div>
                                            <span className="text-[8px] font-black uppercase tracking-[0.18em] text-indigo-600">
                                                {fb.role || 'Elite Student'}
                                            </span>
                                        </div>

                                        <p className="text-slate-600 text-base sm:text-lg md:text-[1.1rem] font-semibold italic leading-relaxed mb-2.5 max-w-2xl">
                                            "{fb.message}"
                                        </p>

                                        <p className="font-black font-display text-slate-900 uppercase tracking-tight text-lg sm:text-xl md:text-[1.9rem]">
                                            {fb.name}
                                        </p>
                                        <div className="flex items-center gap-2.5 mt-1.5">
                                            <span className="w-7 h-[2px] bg-indigo-300" />
                                            <p className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400">
                                                Verified Journey
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-4 h-1.5 w-full rounded-full bg-slate-100 overflow-hidden">
                                    <div
                                        className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-cyan-500 transition-all duration-500"
                                        style={{ width: progressWidth }}
                                    />
                                </div>
                            </div>
                        </motion.div>
                    </AnimatePresence>

                    {/* Dot navigation */}
                    <div className="flex items-center justify-center gap-2 mt-5">
                        {feedbacks.map((_, i) => (
                            <button
                                key={i}
                                onClick={() => goTo(i)}
                                className={`rounded-full transition-all duration-300 ${i === current
                                        ? 'bg-indigo-600 w-9 h-2'
                                        : 'bg-slate-300 hover:bg-slate-400 w-2 h-2'
                                    }`}
                                aria-label={`Go to testimonial ${i + 1}`}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default StudentImpact;
