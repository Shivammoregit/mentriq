import React from 'react';
import { Spotlight } from '@/components/ui/Spotlight';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';

const Hero3DElement = ({ statsData }) => {
    const navigate = useNavigate();

    return (
        <div className="w-full min-h-[90vh] relative overflow-hidden bg-white pt-24 pb-12">
            {/* Animated color blobs */}
            <motion.div
                animate={{ x: [0, 60, -30, 0], y: [0, 40, -20, 0], scale: [1, 1.2, 0.95, 1] }}
                transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute -top-32 -left-24 w-[600px] h-[600px] bg-indigo-200/40 rounded-full blur-[120px] pointer-events-none"
            />
            <motion.div
                animate={{ x: [0, -50, 30, 0], y: [0, 60, -30, 0], scale: [1, 1.15, 0.9, 1] }}
                transition={{ duration: 16, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
                className="absolute top-1/3 right-[-100px] w-[500px] h-[500px] bg-violet-200/30 rounded-full blur-[130px] pointer-events-none"
            />
            <motion.div
                animate={{ x: [0, 40, -20, 0], y: [0, -40, 30, 0], scale: [1, 1.1, 0.95, 1] }}
                transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 4 }}
                className="absolute bottom-[-80px] left-1/3 w-[450px] h-[450px] bg-cyan-200/30 rounded-full blur-[110px] pointer-events-none"
            />

            {/* Spotlight */}
            <Spotlight className="-top-40 left-0 md:left-60 md:-top-20" fill="#6366f1" />

            <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10 w-full h-full">
                {/* Left content */}
                <div className="flex flex-col justify-center">
                    {/* Badge */}
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-2 mb-6 px-5 py-2 rounded-full bg-slate-50 border border-slate-200 w-fit backdrop-blur-md shadow-sm"
                    >
                        <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
                        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-600">
                            The Future of Intelligence
                        </span>
                    </motion.div>

                    {/* Headline */}
                    <motion.h1
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: 'circOut' }}
                        className="text-5xl md:text-7xl xl:text-8xl font-black mb-6 leading-[0.9] tracking-tighter uppercase text-slate-900"
                    >
                        REWIRE YOUR <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-violet-600 to-cyan-500">
                            POTENTIAL.
                        </span>
                    </motion.h1>

                    {/* Subtext */}
                    <motion.p
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-base md:text-lg text-slate-500 max-w-lg mb-10 leading-relaxed font-medium"
                    >
                        MentriQ is where precision meets innovation. Master the core of modern technology with industry-first curriculums and elite mentorship.
                    </motion.p>

                    {/* CTA Buttons */}
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.35 }}
                        className="flex flex-wrap gap-4"
                    >
                        <button
                            onClick={() => navigate('/courses')}
                            className="group px-10 py-5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-black text-sm uppercase tracking-widest transition-all flex items-center justify-center gap-2 shadow-xl shadow-indigo-100"
                        >
                            Start Learning
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </button>
                        <button
                            onClick={() => navigate('/contact')}
                            className="px-10 py-5 rounded-2xl bg-slate-50 border border-slate-200 text-slate-800 font-black text-sm uppercase tracking-widest hover:bg-slate-100 transition-all backdrop-blur-md"
                        >
                            Consultation
                        </button>
                    </motion.div>

                    {/* Social proof */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.8 }}
                        className="mt-14 pt-8 flex items-center gap-8 border-t border-slate-200/60"
                    >
                        <div className="text-[10px] font-black uppercase tracking-widest text-slate-500">
                            Trusted by <span className="text-slate-900">{statsData?.students || '16,000+'}</span> industry professionals
                        </div>
                    </motion.div>
                </div>

                {/* Right: Custom Illustration */}
                <div className="relative w-full h-[340px] sm:h-[400px] lg:h-[520px]">
                    <img
                        src="/hero-illustration.svg"
                        alt="Creative collaboration illustration"
                        className="w-full h-full object-fill select-none"
                        draggable="false"
                    />
                </div>
            </div>
        </div>
    );
};

export default Hero3DElement;
