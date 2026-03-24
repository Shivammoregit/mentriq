import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Quote, UserCircle2 } from 'lucide-react';
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

    return (
        <section className="relative py-24 bg-white overflow-hidden">
            {/* Soft background blobs */}
            <div className="absolute top-0 left-1/4 w-[500px] h-[400px] bg-indigo-50/60 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-0 right-1/4 w-[400px] h-[300px] bg-cyan-50/50 rounded-full blur-[100px] pointer-events-none" />

            <div className="max-w-7xl mx-auto px-6 lg:px-16 relative z-10">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-16"
                >
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-600 text-[10px] font-black uppercase tracking-[0.25em] mb-5">
                        <UserCircle2 size={13} />
                        Verified Success Stories
                    </div>
                    <h2 className="text-4xl md:text-5xl font-black tracking-tighter uppercase text-slate-900 leading-[0.95]">
                        Student{' '}
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-cyan-500">
                            Impact.
                        </span>
                    </h2>
                </motion.div>

                {/* Testimonial Card */}
                <div className="max-w-3xl mx-auto">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={fb._id}
                            initial={{ opacity: 0, y: 16 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -16 }}
                            transition={{ duration: 0.4 }}
                            className="relative"
                        >
                            {/* Quote card */}
                            <div className="bg-white border border-slate-100 rounded-3xl shadow-sm hover:shadow-lg transition-shadow duration-300 px-10 py-10 md:px-16 md:py-12">
                                {/* Stars + badge */}
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="flex gap-1">
                                        {[...Array(5)].map((_, i) => (
                                            <Star
                                                key={i}
                                                size={14}
                                                className={i < (fb.rating || 5) ? 'text-amber-400 fill-amber-400' : 'text-slate-200 fill-slate-200'}
                                            />
                                        ))}
                                    </div>
                                    {fb.role && (
                                        <span className="text-[9px] font-black uppercase tracking-[0.2em] text-indigo-500 border border-indigo-100 bg-indigo-50 px-2 py-0.5 rounded-full">
                                            {fb.role}
                                        </span>
                                    )}
                                </div>

                                {/* Big quote icon */}
                                <Quote className="text-indigo-100 mb-4" size={36} strokeWidth={1.5} />

                                {/* message */}
                                <p className="text-slate-700 text-lg md:text-xl font-medium leading-relaxed italic mb-10">
                                    "{fb.message}"
                                </p>

                                {/* Author row */}
                                <div className="flex items-center gap-4 pt-6 border-t border-slate-100">
                                    <div className="w-14 h-14 rounded-2xl overflow-hidden border-2 border-indigo-100 shadow flex-shrink-0 bg-indigo-50">
                                        <img
                                            src={fb.image
                                                ? resolveImageUrl(fb.image, FALLBACK + encodeURIComponent(fb.name))
                                                : FALLBACK + encodeURIComponent(fb.name)}
                                            alt={fb.name}
                                            className="w-full h-full object-cover"
                                            onError={(e) => { e.target.src = FALLBACK + encodeURIComponent(fb.name); }}
                                        />
                                    </div>
                                    <div>
                                        <p className="font-black text-slate-900 uppercase tracking-tight text-sm">
                                            {fb.name}
                                        </p>
                                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mt-0.5">
                                            Verified Journey
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </AnimatePresence>

                    {/* Dot navigation */}
                    <div className="flex items-center justify-center gap-2 mt-10 flex-wrap">
                        {feedbacks.map((_, i) => (
                            <button
                                key={i}
                                onClick={() => goTo(i)}
                                className={`rounded-full transition-all duration-300 ${
                                    i === current
                                        ? 'bg-indigo-600 w-7 h-2.5'
                                        : 'bg-slate-200 hover:bg-slate-300 w-2.5 h-2.5'
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
