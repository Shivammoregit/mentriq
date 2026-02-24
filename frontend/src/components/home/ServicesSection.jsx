import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Code, Smartphone, Palette, Globe, Megaphone, Server, ArrowRight, Box, Shield, Database, Cloud, PenTool, Cpu, Layers, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { apiClient as api } from '../../utils/apiClient';
import { resolveImageUrl } from '../../utils/imageUtils';

// Map string icon names to Lucide components
const IconMap = {
    Globe, Smartphone, Code, Server, Megaphone, Palette, Box, Shield, Database, Cloud, PenTool, Cpu, Layers, Zap
};

const FALLBACK_SERVICES = [];

const ServicesSection = () => {
    const navigate = useNavigate();
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchServices = async () => {
            try {
                const { data } = await api.get('/services'); // Public endpoint (might need to check if it exists or use /services/admin if public not separate)
                // Assuming public endpoint is just /services or we filter active ones
                // If /services is restricted, we might need a public endpoint. 
                // Usually /services/admin is for admin. Let's try /services first.
                // If it fails, fallback.
                if (Array.isArray(data) && data.length > 0) {
                    setServices(data.filter(s => s.active !== false));
                } else {
                    setServices(FALLBACK_SERVICES);
                }
            } catch (error) {
                console.error("Failed to fetch services", error);
                setServices(FALLBACK_SERVICES);
            } finally {
                setLoading(false);
            }
        };

        fetchServices();
    }, []);

    const displayServices = services.length > 0 ? services : FALLBACK_SERVICES;

    return (
        <section className="py-20 bg-slate-950 relative overflow-hidden">
            {/* Ambient Background Glows */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-indigo-500/10 rounded-full blur-[120px] animate-pulse" />
                <div className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[100px]" />
            </div>

            <div className="max-w-7xl mx-auto px-6 relative z-10">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="inline-flex items-center space-x-2 py-1.5 px-4 rounded-full bg-indigo-500/10 border border-indigo-500/20 mb-6"
                    >
                        <span className="w-2 h-2 bg-indigo-400 rounded-full animate-pulse" />
                        <span className="text-indigo-300 text-[10px] font-black tracking-widest uppercase">Our Ecosystem</span>
                    </motion.div>

                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-4xl md:text-5xl font-black text-white mb-6 tracking-tighter uppercase leading-[0.9]"
                    >
                        TRANSFORMING <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">
                            DIGITAL FRONTIERS
                        </span>
                    </motion.h2>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="text-base text-slate-400 font-medium max-w-2xl mx-auto"
                    >
                        From intelligence-driven web architectures to high-frequency mobile ecosystems, we deploy the technologies that scale your vision.
                    </motion.p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {displayServices.map((service, index) => {
                        const isImage = service.icon && (service.icon.startsWith("http") || service.icon.startsWith("/") || service.icon.startsWith("data:"));
                        const IconComponent = !isImage ? (IconMap[service.icon] || Box) : null;
                        const serviceColor = service.color || 'from-indigo-500 to-purple-500';

                        return (
                            <motion.div
                                key={service._id || index}
                                onClick={() => navigate('/contact')}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                className="group relative bg-slate-900/40 backdrop-blur-2xl rounded-[2.5rem] p-10 border border-white/5 hover:border-indigo-500/20 transition-all duration-500 cursor-pointer overflow-hidden"
                            >
                                {/* Inner Light Core (Persistent) */}
                                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 blur-3xl opacity-50 group-hover:opacity-100 transition-opacity" />

                                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${serviceColor} flex items-center justify-center text-white mb-6 shadow-2xl group-hover:scale-110 group-hover:-rotate-6 transition-all duration-500 relative z-10 overflow-hidden`}>
                                    {isImage ? (
                                        <img src={resolveImageUrl(service.icon)} alt={service.title} className="w-full h-full object-cover" />
                                    ) : (
                                        <IconComponent size={28} />
                                    )}
                                </div>

                                <h3 className="text-xl font-black text-white mb-3 tracking-tighter uppercase group-hover:text-indigo-400 transition-colors relative z-10">
                                    {service.title}
                                </h3>

                                <p className="text-slate-400 text-xs leading-relaxed mb-6 font-medium relative z-10 line-clamp-3">
                                    {service.description}
                                </p>

                                {/* Improved "->" CTA Interaction */}
                                <div className="flex items-center space-x-2 text-indigo-400 font-black text-[10px] tracking-[0.2em] uppercase opacity-40 group-hover:opacity-100 transition-opacity duration-300 relative z-10 mt-auto">
                                    <span>Learn More</span>
                                    <div className="relative overflow-hidden w-6 h-4">
                                        <ArrowRight
                                            className="absolute left-0 transition-transform duration-300 group-hover:translate-x-1 group-hover:scale-110"
                                            size={18}
                                        />
                                        {/* Offset glitch icon for effect */}
                                        <ArrowRight
                                            className="absolute left-0 text-cyan-400 opacity-0 group-hover:opacity-100 group-hover:animate-ping pointer-events-none"
                                            size={18}
                                        />
                                    </div>
                                </div>

                                {/* Hover Card Glint */}
                                <div className="absolute inset-0 bg-gradient-to-tr from-white/5 to-transparent opacity-0 group-hover:opacity-10 transition-opacity duration-500 pointer-events-none" />
                            </motion.div>
                        );
                    })}
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.4 }}
                    className="text-center mt-12"
                >
                    <button
                        onClick={() => navigate('/services')}
                        className="group flex items-center space-x-4 mx-auto px-10 py-5 bg-white/5 border border-white/10 rounded-2xl text-white font-black uppercase tracking-[0.2em] text-xs hover:bg-white/10 hover:border-indigo-500/30 transition-all duration-500 backdrop-blur-md shadow-2xl relative overflow-hidden"
                    >
                        <span className="relative z-10">Deploy New Inquiry</span>
                        <ArrowRight size={18} className="relative z-10 group-hover:translate-x-2 transition-transform duration-300" />

                        {/* Internal Shimmer */}
                        <div className="absolute top-0 -left-[100%] w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-12 group-hover:left-[100%] transition-all duration-1000" />
                    </button>
                </motion.div>
            </div>
        </section>
    );
};

export default ServicesSection;
