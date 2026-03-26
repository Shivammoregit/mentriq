import React from 'react';
import GlobeElement from './GlobeElement';
import { Spotlight } from '@/components/ui/Spotlight';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { apiClient as api } from '../../utils/apiClient';
import { ArrowRight, Sparkles, Mail, Instagram, Linkedin, Twitter, MessageCircle, X } from 'lucide-react';

import { useSiteData } from '../../context/SiteContext';

const Hero3DElement = ({ statsData }) => {
    const navigate = useNavigate();
    const { settings: globalSettings } = useSiteData();
    
    const settings = React.useMemo(() => ({
        email: globalSettings?.email || "support@mentriqtechnologies.in",
        socialLinks: {
            instagram: globalSettings?.socialLinks?.instagram || "https://www.instagram.com/mentriqtechnologies/",
            linkedin: globalSettings?.socialLinks?.linkedin || "https://www.linkedin.com/company/mentriqtechnologies/",
            twitter: globalSettings?.socialLinks?.twitter || "https://x.com/MentriqT51419",
            whatsapp: globalSettings?.socialLinks?.whatsapp || "https://wa.me/918890301264",
            facebook: globalSettings?.socialLinks?.facebook || "https://www.facebook.com/profile.php?id=61588480116895"
        }
    }), [globalSettings]);

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

                {/* Right: Globe Element */}
                <div className="h-[400px] lg:h-auto lg:flex-1 relative w-full">
                    <GlobeElement />

                    {/* Social Media Icons (Thinking Cloud / Orbit Theme) */}
                    <div className="absolute inset-0 pointer-events-none z-20">
                        {/* Icon 1: LinkedIn (Top-Left) */}
                        <motion.a
                            href={settings.socialLinks.linkedin}
                            target="_blank"
                            rel="noopener noreferrer"
                            initial={{ opacity: 0, scale: 0 }}
                            animate={{ opacity: 1, scale: 1, y: [0, -8, 0] }}
                            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 0 }}
                            whileHover={{ scale: 1.2, rotate: 5, backgroundColor: "rgba(0, 119, 181, 0.2)" }}
                            className="absolute top-[15%] left-[15%] lg:top-[20%] lg:left-[20%] w-10 h-10 lg:w-12 lg:h-12 rounded-full bg-slate-100 border border-slate-200 backdrop-blur-md flex items-center justify-center text-slate-600 shadow-lg pointer-events-auto hover:text-[#0077b5] hover:border-[#0077b5]/30 transition-all duration-300"
                        >
                            <Linkedin className="w-4 h-4 lg:w-5 lg:h-5" />
                        </motion.a>

                        {/* Icon 2: Twitter (Top-Center-Left) */}
                        <motion.a
                            href={settings.socialLinks.twitter}
                            target="_blank"
                            rel="noopener noreferrer"
                            initial={{ opacity: 0, scale: 0 }}
                            animate={{ opacity: 1, scale: 1, y: [0, -10, 0] }}
                            transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                            whileHover={{ scale: 1.2, rotate: -5, backgroundColor: "rgba(0, 0, 0, 0.1)" }}
                            className="absolute top-[8%] left-[30%] lg:top-[10%] lg:left-[35%] w-8 h-8 lg:w-10 lg:h-10 rounded-full bg-slate-100 border border-slate-200 backdrop-blur-md flex items-center justify-center text-slate-600 shadow-lg pointer-events-auto hover:text-black hover:border-black/20 transition-all duration-300"
                        >
                            <X className="w-3 h-3 lg:w-4 lg:h-4" />
                        </motion.a>

                        {/* Icon 3: Instagram (Top-Center) */}
                        <motion.a
                            href={settings.socialLinks.instagram}
                            target="_blank"
                            rel="noopener noreferrer"
                            initial={{ opacity: 0, scale: 0 }}
                            animate={{ opacity: 1, scale: 1, y: [0, -12, 0] }}
                            transition={{ duration: 6.5, repeat: Infinity, ease: "easeInOut", delay: 2 }}
                            whileHover={{ scale: 1.25, rotate: 10, backgroundColor: "rgba(225, 48, 108, 0.15)" }}
                            className="absolute top-[5%] right-[35%] lg:top-[5%] lg:right-[40%] w-12 h-12 lg:w-14 lg:h-14 rounded-full bg-slate-100 border border-slate-200 backdrop-blur-md flex items-center justify-center text-slate-600 shadow-xl pointer-events-auto hover:text-[#e1306c] hover:border-[#e1306c]/30 transition-all duration-300"
                        >
                            <Instagram className="w-5 h-5 lg:w-6 lg:h-6" />
                        </motion.a>

                        {/* Icon 4: WhatsApp (Top-Center-Right) */}
                        <motion.a
                            href={settings.socialLinks.whatsapp}
                            target="_blank"
                            rel="noopener noreferrer"
                            initial={{ opacity: 0, scale: 0 }}
                            animate={{ opacity: 1, scale: 1, y: [0, -8, 0] }}
                            transition={{ duration: 7.2, repeat: Infinity, ease: "easeInOut", delay: 3 }}
                            whileHover={{ scale: 1.2, rotate: -5, backgroundColor: "rgba(37, 211, 102, 0.15)" }}
                            className="absolute top-[10%] right-[20%] lg:top-[12%] lg:right-[20%] w-8 h-8 lg:w-10 lg:h-10 rounded-full bg-slate-100 border border-slate-200 backdrop-blur-md flex items-center justify-center text-slate-600 shadow-lg pointer-events-auto hover:text-[#25D366] hover:border-[#25D366]/30 transition-all duration-300"
                        >
                            <MessageCircle className="w-3 h-3 lg:w-4 lg:h-4" />
                        </motion.a>

                        {/* Icon 5: Gmail (Top-Right) */}
                        <motion.a
                            href={`mailto:${settings.email}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            initial={{ opacity: 0, scale: 0 }}
                            animate={{ opacity: 1, scale: 1, y: [0, -6, 0] }}
                            transition={{ duration: 6.8, repeat: Infinity, ease: "easeInOut", delay: 2.5 }}
                            whileHover={{ scale: 1.2, rotate: 5, backgroundColor: "rgba(234, 67, 53, 0.15)" }}
                            className="absolute top-[20%] right-[10%] lg:top-[25%] lg:right-[10%] w-10 h-10 lg:w-12 lg:h-12 rounded-full bg-slate-100 border border-slate-200 backdrop-blur-md flex items-center justify-center text-slate-600 shadow-lg pointer-events-auto hover:text-[#EA4335] hover:border-[#EA4335]/30 transition-all duration-300"
                        >
                            <Mail className="w-4 h-4 lg:w-5 lg:h-5" />
                        </motion.a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Hero3DElement;
