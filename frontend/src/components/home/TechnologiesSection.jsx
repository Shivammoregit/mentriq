import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

import { apiClient as api } from '../../utils/apiClient';

const TechnologiesSection = () => {
    const [technologies, setTechnologies] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTechnologies = async () => {
            try {
                const { data } = await api.get('/technologies');
                setTechnologies(data.data || []);
            } catch (error) {
                console.error("Failed to fetch technologies:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchTechnologies();
    }, []);

    if (loading) return null;
    if (technologies.length === 0) return null;

    return (
        <section className="py-20 bg-[#020617] overflow-hidden relative">
            {/* Advanced Ambient Glows */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-indigo-500/10 rounded-full blur-[120px]" />
                <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-cyan-500/10 rounded-full blur-[120px]" />

                {/* Grid Pattern */}
                <div className="absolute inset-0 opacity-[0.05]"
                    style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)', backgroundSize: '80px 80px' }}
                />
            </div>

            <div className="max-w-7xl mx-auto px-6 mb-14 text-center relative z-10">
                <div className="inline-flex items-center gap-3 py-1.5 px-5 rounded-full bg-white/5 border border-white/10 mb-8 backdrop-blur-md">
                    <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-pulse shadow-[0_0_8px_rgba(129,140,248,0.5)]" />
                    <span className="text-indigo-300 text-[10px] font-black tracking-[0.4em] uppercase">Industry Standard Tech</span>
                    <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-pulse shadow-[0_0_8px_rgba(34,211,238,0.5)]" />
                </div>

                <h2 className="text-5xl md:text-6xl lg:text-7xl font-black text-white mb-6 tracking-tighter uppercase leading-none">
                    MASTERY <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-cyan-400">STACK.</span>
                </h2>
                <p className="text-base md:text-[2rem] text-slate-400 max-w-3xl mx-auto font-medium leading-relaxed">
                    Deployment-ready expertise in industry-standard tools and frameworks driving the <span className="text-white">modern digital economy.</span>
                </p>
            </div>

            {/* 3D Perspective Scroller Container */}
            <div
                className="group/row relative py-10"
                style={{
                    perspective: '2000px',
                    maskImage: 'linear-gradient(to right, transparent, black 15%, black 85%, transparent)',
                    WebkitMaskImage: 'linear-gradient(to right, transparent, black 15%, black 85%, transparent)'
                }}
            >
                <div style={{ transformStyle: 'preserve-3d' }}>
                    <div
                        className="animate-marquee-left flex w-max gap-6 px-4 group-hover/row:[animation-play-state:paused]"
                        style={{
                            transformStyle: 'preserve-3d',
                            '--marquee-duration': `${Math.max(35, technologies.length * 2)}s`
                        }}
                    >
                        {/* Dual Buffer for Seamless Loop */}
                        {[...technologies, ...technologies].map((tech, index) => (
                            <motion.div
                                key={`${tech._id}-${index}`}
                                whileHover={{
                                    scale: 1.05,
                                    translateZ: 30,
                                    zIndex: 100
                                }}
                                className="w-[160px] h-[190px] bg-white rounded-[1.4rem] border border-slate-200 flex flex-col items-center justify-center gap-4 group cursor-pointer relative overflow-hidden transition-all duration-300 hover:border-indigo-400/40 hover:shadow-[0_0_35px_rgba(99,102,241,0.25)]"
                                style={{ transformStyle: 'preserve-3d' }}
                            >
                                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                                <div className="relative w-12 h-12 flex items-center justify-center transform group-hover:scale-110 transition-transform duration-300">
                                    <img
                                        src={tech.logo}
                                        alt={tech.name}
                                        className="w-full h-full object-contain filter drop-shadow-lg grayscale-[10%] opacity-95 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-300"
                                        onError={(e) => {
                                            e.currentTarget.onerror = null;
                                            e.currentTarget.src = "/images/logo2.png";
                                        }}
                                    />
                                </div>
                                <div className="flex flex-col items-center gap-2">
                                    <span className="text-[0.85rem] font-black uppercase tracking-[0.12em] text-slate-500 group-hover:text-slate-700 transition-colors relative z-10">{tech.name}</span>
                                    <span className="w-8 h-[2px] bg-slate-200 group-hover:bg-indigo-300 transition-colors" />
                                </div>
                                <div className="absolute inset-4 rounded-xl border border-slate-100 pointer-events-none" />
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default TechnologiesSection;
