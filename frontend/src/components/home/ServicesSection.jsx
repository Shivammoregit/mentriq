import React from 'react';
import { motion } from 'framer-motion';

import { Code, Smartphone, Palette, Globe, Megaphone, Server, ArrowRight, Box, Shield, Database, Cloud, PenTool, Cpu, Layers, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { resolveImageUrl } from '../../utils/imageUtils';
import { useSiteData } from '../../context/SiteContext';

// Map string icon names to Lucide components
const IconMap = {
    Globe, Smartphone, Code, Server, Megaphone, Palette, Box, Shield, Database, Cloud, PenTool, Cpu, Layers, Zap
};

const FALLBACK_SERVICES = [];

const ServicesSection = () => {
    const navigate = useNavigate();
    const { services: siteServices } = useSiteData();
    const displayServices = Array.isArray(siteServices) && siteServices.length > 0
        ? siteServices.filter(s => s.active !== false)
        : FALLBACK_SERVICES;

    return (
        <section className="py-20 bg-slate-50 relative overflow-hidden">
            <div className="max-w-7xl mx-auto px-6 relative z-10">
                <div className="text-center max-w-4xl mx-auto mb-14">
                    <div className="inline-flex items-center gap-2 py-1.5 px-4 rounded-full bg-indigo-100 border border-indigo-200 mb-6">
                        <span className="text-indigo-500 text-[10px] font-black tracking-widest uppercase">Expert Solutions</span>
                    </div>

                    <h2 className="text-4xl md:text-6xl font-black text-slate-900 mb-5 tracking-tighter uppercase leading-[0.92]">
                        What We <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-cyan-500">Engineer.</span>
                    </h2>

                    <p className="text-base md:text-[1.05rem] text-slate-500 font-semibold max-w-3xl mx-auto">
                        Architecting the future of intelligence with comprehensive technology stacks.
                    </p>
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.15 }}
                    transition={{ duration: 0.45 }}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                >
                    {displayServices.map((service, index) => {
                        const isImage = service.icon && (service.icon.startsWith("http") || service.icon.startsWith("/") || service.icon.startsWith("data:"));
                        const IconComponent = !isImage ? (IconMap[service.icon] || Box) : null;
                        const serviceColor = service.color || 'from-indigo-500 to-purple-500';

                        return (
                            <motion.div
                                key={service._id || index}
                                onClick={() => navigate('/contact')}
                                whileHover={{ y: -6 }}
                                className="group relative bg-white rounded-[2.5rem] p-10 border border-slate-200 hover:border-indigo-200 transition-all duration-500 cursor-pointer overflow-hidden shadow-[0_14px_34px_-28px_rgba(15,23,42,0.35)]"
                            >
                                <div className="absolute -top-6 -right-6 w-32 h-32 rounded-full bg-indigo-50" />

                                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${serviceColor} flex items-center justify-center text-white mb-6 shadow-lg group-hover:scale-110 transition-all duration-500 relative z-10 overflow-hidden`}>
                                    {isImage ? (
                                        <img src={resolveImageUrl(service.icon)} alt={service.title} className="w-full h-full object-cover" />
                                    ) : (
                                        <IconComponent size={28} />
                                    )}
                                </div>

                                <h3 className="text-[1.55rem] md:text-[1.7rem] font-black text-slate-900 mb-3 tracking-tighter leading-[0.98] relative z-10">
                                    {service.title}
                                </h3>

                                <p className="text-slate-500 text-xs leading-relaxed mb-6 font-semibold relative z-10 line-clamp-3">
                                    {service.description}
                                </p>

                                <div className="flex items-center space-x-2 text-indigo-500 font-black text-[10px] tracking-[0.2em] uppercase relative z-10 mt-auto">
                                    <span>Learn More</span>
                                    <div className="relative overflow-hidden w-6 h-4">
                                        <ArrowRight
                                            className="absolute left-0 transition-transform duration-300 group-hover:translate-x-1"
                                            size={18}
                                        />
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                </motion.div>
            </div>
        </section>
    );
};

export default ServicesSection;
