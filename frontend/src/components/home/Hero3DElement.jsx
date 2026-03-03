import React from 'react';
import { SplineScene } from '@/components/ui/SplineScene';
import { Spotlight } from '@/components/ui/Spotlight';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { apiClient as api } from '../../utils/apiClient';
import { ArrowRight, Sparkles, Mail, Instagram, Linkedin, Twitter, MessageCircle, X } from 'lucide-react';

const Hero3DElement = () => {
    const navigate = useNavigate();

    const [settings, setSettings] = React.useState({
        email: "support@mentriqtechnologies.in",
        socialLinks: {
            instagram: "https://www.instagram.com/mentriqtechnologies/",
            linkedin: "https://www.linkedin.com/company/mentriqtechnologies/",
            twitter: "https://x.com/MentriqT51419",
            whatsapp: "https://wa.me/918890301264",
            facebook: "https://www.facebook.com/profile.php?id=61588480116895"
        }
    });

    React.useEffect(() => {
        const fetchSettings = async () => {
            try {
                const { data } = await api.get('/settings');
                if (data) {
                    setSettings(prev => ({
                        ...prev,
                        email: data.email || prev.email,
                        socialLinks: {
                            instagram: data.socialLinks?.instagram || prev.socialLinks.instagram,
                            linkedin: data.socialLinks?.linkedin || prev.socialLinks.linkedin,
                            twitter: data.socialLinks?.twitter || prev.socialLinks.twitter,
                            whatsapp: data.socialLinks?.whatsapp || prev.socialLinks.whatsapp,
                            facebook: data.socialLinks?.facebook || prev.socialLinks.facebook
                        }
                    }));
                }
            } catch (error) {
                console.error("Failed to fetch settings", error);
            }
        };
        fetchSettings();
    }, []);

    return (
        <div className="w-full min-h-[85vh] relative overflow-hidden bg-white pt-12">

            {/* Animated color blobs */}
            <motion.div
                animate={{ x: [0, 60, -30, 0], y: [0, 40, -20, 0], scale: [1, 1.2, 0.95, 1] }}
                transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute -top-32 -left-24 w-[500px] h-[500px] bg-indigo-200/60 rounded-full blur-[120px] pointer-events-none"
            />
            <motion.div
                animate={{ x: [0, -50, 30, 0], y: [0, 60, -30, 0], scale: [1, 1.15, 0.9, 1] }}
                transition={{ duration: 16, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
                className="absolute top-1/3 right-[-100px] w-[450px] h-[450px] bg-violet-200/50 rounded-full blur-[130px] pointer-events-none"
            />
            <motion.div
                animate={{ x: [0, 40, -20, 0], y: [0, -40, 30, 0], scale: [1, 1.1, 0.95, 1] }}
                transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 4 }}
                className="absolute bottom-[-80px] left-1/3 w-[400px] h-[400px] bg-cyan-200/40 rounded-full blur-[110px] pointer-events-none"
            />
            <motion.div
                animate={{ x: [0, -30, 50, 0], y: [0, 30, -50, 0], scale: [1, 1.25, 0.9, 1] }}
                transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
                className="absolute top-0 right-1/3 w-[350px] h-[350px] bg-pink-200/40 rounded-full blur-[100px] pointer-events-none"
            />

            {/* Spotlight */}
            <Spotlight className="-top-40 left-0 md:left-60 md:-top-20" fill="#6366f1" />

            <div className="flex flex-col lg:flex-row h-full min-h-[85vh] relative z-10">
                {/* Left content */}
                <div className="flex-1 p-6 lg:p-12 flex flex-col justify-center">

                    {/* Badge */}
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-2 mb-4 px-4 py-1.5 rounded-full bg-indigo-50 border border-indigo-100 w-fit"
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
                        className="text-4xl md:text-5xl xl:text-7xl font-black mb-4 leading-[1.05] tracking-tighter uppercase text-slate-900"
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
                        className="mt-2 text-slate-500 max-w-lg text-base leading-relaxed mb-6"
                    >
                        MentriQ is where precision meets innovation. Master the core of modern technology with industry-first curriculums and elite mentorship.
                    </motion.p>

                    {/* CTA Buttons */}
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.35 }}
                        className="flex flex-col sm:flex-row gap-4"
                    >
                        <button
                            onClick={() => navigate('/courses')}
                            className="group px-8 py-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm uppercase tracking-widest transition-all flex items-center justify-center gap-2 shadow-lg shadow-indigo-200"
                        >
                            Start Learning
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </button>
                        <button
                            onClick={() => navigate('/contact')}
                            className="px-8 py-4 rounded-xl bg-slate-100 border border-slate-200 text-slate-700 font-bold text-sm uppercase tracking-widest hover:bg-slate-200 transition-all"
                        >
                            Get a Consultation
                        </button>
                    </motion.div>

                </div>

                {/* Right: Spline 3D Scene */}
                <div className="h-[500px] lg:h-auto lg:flex-1 relative w-full">
                    <SplineScene
                        scene="https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode"
                        className="w-full h-full"
                    />

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
                            className="absolute top-[15%] left-[15%] lg:top-[20%] lg:left-[20%] w-10 h-10 lg:w-12 lg:h-12 rounded-full bg-white/5 border border-white/10 backdrop-blur-md flex items-center justify-center text-slate-400 shadow-lg pointer-events-auto hover:text-[#0077b5] hover:border-[#0077b5]/30 transition-all duration-300"
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
                            className="absolute top-[8%] left-[30%] lg:top-[10%] lg:left-[35%] w-8 h-8 lg:w-10 lg:h-10 rounded-full bg-white/5 border border-white/10 backdrop-blur-md flex items-center justify-center text-slate-400 shadow-lg pointer-events-auto hover:text-black hover:border-black/20 transition-all duration-300"
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
                            className="absolute top-[5%] right-[35%] lg:top-[5%] lg:right-[40%] w-12 h-12 lg:w-14 lg:h-14 rounded-full bg-white/5 border border-white/10 backdrop-blur-md flex items-center justify-center text-slate-400 shadow-xl pointer-events-auto hover:text-[#e1306c] hover:border-[#e1306c]/30 transition-all duration-300"
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
                            className="absolute top-[10%] right-[20%] lg:top-[12%] lg:right-[20%] w-8 h-8 lg:w-10 lg:h-10 rounded-full bg-white/5 border border-white/10 backdrop-blur-md flex items-center justify-center text-slate-400 shadow-lg pointer-events-auto hover:text-[#25D366] hover:border-[#25D366]/30 transition-all duration-300"
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
                            className="absolute top-[20%] right-[10%] lg:top-[25%] lg:right-[10%] w-10 h-10 lg:w-12 lg:h-12 rounded-full bg-white/5 border border-white/10 backdrop-blur-md flex items-center justify-center text-slate-400 shadow-lg pointer-events-auto hover:text-[#EA4335] hover:border-[#EA4335]/30 transition-all duration-300"
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
