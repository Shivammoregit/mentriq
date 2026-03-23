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

            <div className="max-w-7xl mx-auto px-6 mb-16 text-center relative z-10">
                <div className="inline-flex items-center gap-3 py-1.5 px-5 rounded-full bg-white/5 border border-white/10 mb-8 backdrop-blur-md">
                    <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-pulse shadow-[0_0_8px_rgba(129,140,248,0.5)]" />
                    <span className="text-indigo-300 text-[10px] font-black tracking-[0.4em] uppercase">Industry Standard Tech</span>
                    <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-pulse shadow-[0_0_8px_rgba(34,211,238,0.5)]" />
                </div>

                <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-6 tracking-tighter uppercase leading-none">
                    TECHNOLOGIES YOU'LL <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-cyan-400">MASTER</span>
                </h2>
                <p className="text-base text-slate-400 max-w-2xl mx-auto font-medium leading-relaxed">
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
                        className="animate-marquee-left flex w-max gap-8 px-4 group-hover/row:[animation-play-state:paused]"
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
                                    scale: 1.08,
                                    translateZ: 30,
                                    zIndex: 100
                                }}
                                className="w-32 h-32 bg-white/5 backdrop-blur-md rounded-[1.5rem] border border-white/10 flex flex-col items-center justify-center gap-3 group cursor-pointer relative overflow-hidden transition-all duration-300 hover:bg-white/[0.08] hover:border-indigo-500/30 hover:shadow-[0_0_30px_rgba(99,102,241,0.2)]"
                                style={{ transformStyle: 'preserve-3d' }}
                            >
                                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-cyan-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                                <div className="relative w-12 h-12 flex items-center justify-center transform group-hover:scale-110 transition-transform duration-300">
                                    <img
                                        src={tech.logo}
                                        alt={tech.name}
                                        className="w-full h-full object-contain filter drop-shadow-lg grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-300"
                                        onError={(e) => {
                                            e.currentTarget.onerror = null;
                                            e.currentTarget.src = "/images/logo2.png";
                                        }}
                                    />
                                </div>
                                <span className="text-xs font-black uppercase tracking-wider text-slate-500 group-hover:text-white transition-colors relative z-10">{tech.name}</span>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default TechnologiesSection;
