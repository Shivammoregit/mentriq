import React from 'react';
import { SplineScene } from '@/components/ui/SplineScene';
import { Spotlight } from '@/components/ui/Spotlight';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, Mail } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

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
        <div className="w-full min-h-[85vh] relative overflow-hidden bg-white pt-20">

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
                <div className="flex-1 p-8 lg:p-16 flex flex-col justify-center">

                    {/* Badge */}
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-2 mb-6 px-4 py-1.5 rounded-full bg-indigo-50 border border-indigo-100 w-fit"
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
                        className="text-4xl md:text-5xl xl:text-7xl font-black mb-6 leading-[1.05] tracking-tighter uppercase text-slate-900"
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
                        className="mt-2 text-slate-500 max-w-lg text-base leading-relaxed mb-8"
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
                            <svg className="w-4 h-4 lg:w-5 lg:h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" /></svg>
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
                            <svg className="w-3 h-3 lg:w-4 lg:h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>
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
                            <svg className="w-5 h-5 lg:w-6 lg:h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" /></svg>
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
                            <svg className="w-3 h-3 lg:w-4 lg:h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-8.68-2.031-9.67-.272-.099-.47-.149-.734.26-.264.41-.99 1.212-1.213 1.46-.223.248-.446.273-.743.124-2.975-1.487-4.938-4.145-5.324-4.814-.386-.669-.041-.836.207-1.084.223-.223.495-.58.742-.87.248-.29.331-.497.496-.827.165-.33.082-.62-.042-.868-.124-.248-1.115-2.688-1.528-3.679-.402-.966-.81-.835-1.115-.851-.297-.015-.637-.015-.977-.015-.34 0-.891.127-1.357.636-.466.509-1.777 1.737-1.777 4.237s1.818 4.914 2.071 5.253c.254.34 3.579 5.466 8.672 7.666 2.457 1.06 3.414.85 4.676.712 1.261-.138 2.709-1.107 3.09-2.175.381-1.069.381-1.984.267-2.175z" /></svg>
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

                        {/* Icon 6: Facebook (Bottom-Center) */}
                        <motion.a
                            href={settings.socialLinks.facebook}
                            target="_blank"
                            rel="noopener noreferrer"
                            initial={{ opacity: 0, scale: 0 }}
                            animate={{ opacity: 1, scale: 1, y: [0, 8, 0] }}
                            transition={{ duration: 7.5, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
                            whileHover={{ scale: 1.2, rotate: 10, backgroundColor: "rgba(24, 119, 242, 0.2)" }}
                            className="absolute bottom-[5%] left-[45%] lg:bottom-[8%] lg:left-[48%] w-10 h-10 lg:w-12 lg:h-12 rounded-full bg-white/5 border border-white/10 backdrop-blur-md flex items-center justify-center text-slate-400 shadow-lg pointer-events-auto hover:text-[#1877f2] hover:border-[#1877f2]/30 transition-all duration-300"
                        >
                            <svg className="w-4 h-4 lg:w-5 lg:h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" /></svg>
                        </motion.a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Hero3DElement;
