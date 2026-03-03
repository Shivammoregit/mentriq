import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ChevronRight, ArrowRight, CheckCircle2, Layers, Globe, Smartphone,
    Palette, Megaphone, Server, Shield, Database, Code, Zap, Star,
    TrendingUp, Users, Award, Clock
} from 'lucide-react';
import Footer from '../components/layout/Footer';
import { apiClient as api } from '../utils/apiClient';
import { useNavigate } from 'react-router-dom';
import { resolveImageUrl } from '../utils/imageUtils';

const iconMap = {
    'Globe': Globe, 'Smartphone': Smartphone, 'Palette': Palette,
    'Megaphone': Megaphone, 'Server': Server, 'Shield': Shield,
    'Database': Database, 'Code': Code, 'Layers': Layers
};

const gradientPairs = [
    { from: 'from-violet-600', to: 'to-indigo-600', accent: 'violet', light: 'violet-50', text: 'violet-700' },
    { from: 'from-blue-600', to: 'to-cyan-500', accent: 'blue', light: 'blue-50', text: 'blue-700' },
    { from: 'from-emerald-600', to: 'to-teal-500', accent: 'emerald', light: 'emerald-50', text: 'emerald-700' },
    { from: 'from-orange-500', to: 'to-rose-500', accent: 'orange', light: 'orange-50', text: 'orange-700' },
    { from: 'from-pink-600', to: 'to-purple-600', accent: 'pink', light: 'pink-50', text: 'pink-700' },
    { from: 'from-slate-700', to: 'to-slate-900', accent: 'slate', light: 'slate-50', text: 'slate-700' },
];


const whyUs = [
    { title: 'Agile Delivery', desc: 'Rapid iterations with transparent milestones.' },
    { title: 'Dedicated Support', desc: '24/7 post-launch assistance for your business.' },
    { title: 'Scalable Architecture', desc: 'Future-proof solutions built to grow with you.' },
    { title: 'Industry Expertise', desc: 'Domain specialists across multiple verticals.' },
];

const ServicesPage = () => {
    const navigate = useNavigate();
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [hoveredIdx, setHoveredIdx] = useState(null);

    const [statsData, setStatsData] = useState(null);
    useEffect(() => {
        const fetchAllData = async () => {
            try {
                const [servicesRes, statsRes] = await Promise.all([
                    api.get('/services'),
                    api.get('/stats')
                ]);
                setServices(servicesRes.data);
                setStatsData(statsRes.data);
            } catch (error) {
                console.error("Failed to fetch page data", error);
            } finally {
                setLoading(false);
            }
        };
        fetchAllData();
    }, []);

    const stats = [
        { value: statsData?.raw?.partners || '0', label: 'Projects Delivered', icon: TrendingUp },
        { value: statsData?.placements || '0%', label: 'Placement Rate', icon: Star },
        { value: statsData?.trainers || '0', label: 'Expert Mentors', icon: Users },
        { value: '5★', label: 'Quality Rating', icon: Award },
    ];

    return (
        <div className="bg-[#f8f9fc] min-h-screen">
            {/* ─── Hero ─── */}
            <section className="relative min-h-[60vh] flex items-center bg-[#070b14] text-white overflow-hidden pt-28 pb-20">
                {/* Advanced Atmospheric Animations for Dark */}
                <div className="absolute inset-0 pointer-events-none">
                    <motion.div
                        animate={{
                            x: [0, 80, 0],
                            y: [0, 40, 0],
                            scale: [1, 1.2, 1]
                        }}
                        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
                        className="absolute -top-[10%] left-1/4 w-[600px] h-[600px] bg-indigo-600/20 rounded-full blur-[140px] animate-pulse"
                    />
                    <motion.div
                        animate={{
                            x: [0, -60, 0],
                            y: [0, 70, 0],
                            scale: [1, 1.3, 1]
                        }}
                        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
                        className="absolute -bottom-[10%] right-1/4 w-[600px] h-[600px] bg-cyan-500/10 rounded-full blur-[140px]"
                    />
                    {/* High-Contrast Technical Grid */}
                    <div className="absolute inset-0 opacity-[0.03] bg-[linear-gradient(#ffffff_1px,transparent_1px),linear-gradient(90deg,#ffffff_1px,transparent_1px)] bg-[length:40px_40px]" />
                </div>

                <div className="relative max-w-7xl mx-auto px-6 z-10 w-full">
                    <div className="max-w-4xl mx-auto text-center">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }}
                            className="inline-flex items-center gap-2 mb-6 px-5 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md shadow-lg shadow-black/20"
                        >
                            <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
                            <span className="text-[10px] font-black uppercase tracking-[0.25em] text-indigo-300">What We Build</span>
                        </motion.div>

                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.1 }}
                            className="text-5xl md:text-6xl lg:text-7xl font-black mb-6 tracking-tighter leading-[0.95] text-white uppercase font-display"
                        >
                            Digital Solutions
                            <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-violet-400 to-cyan-400">
                                Built to Scale.
                            </span>
                        </motion.h1>

                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            className="text-base md:text-lg max-w-2xl mx-auto text-slate-400 leading-relaxed mb-10 font-medium opacity-80"
                        >
                            From concept to deployment — we craft end-to-end digital experiences that drive real business outcomes.
                        </motion.p>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.3 }}
                            className="flex flex-col sm:flex-row gap-4 justify-center"
                        >
                            <button
                                onClick={() => navigate('/contact')}
                                className="group px-8 py-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm uppercase tracking-widest transition-all flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/20"
                            >
                                Start a Project
                                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                            </button>
                            <button
                                onClick={() => navigate('/about')}
                                className="px-8 py-4 rounded-xl bg-white/5 border border-white/10 text-white font-bold text-sm uppercase tracking-widest hover:bg-white/10 transition-all backdrop-blur-sm"
                            >
                                Learn About Us
                            </button>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* ─── Services Grid ─── */}
            <section className="py-24 max-w-7xl mx-auto px-6">
                <div className="text-center mb-16">
                    <p className="text-indigo-600 text-xs font-black uppercase tracking-[0.3em] mb-3">Our Expertise</p>
                    <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter">
                        Services We Offer
                    </h2>
                    <div className="w-16 h-1 bg-gradient-to-r from-indigo-600 to-violet-500 rounded-full mx-auto mt-4" />
                </div>

                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[1, 2, 3, 4, 5, 6].map(i => (
                            <div key={i} className="h-80 bg-slate-200/60 rounded-3xl animate-pulse" />
                        ))}
                    </div>
                ) : (Array.isArray(services) && services.length > 0) ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {services.map((service, index) => {
                            const g = gradientPairs[index % gradientPairs.length];
                            const iconValue = service.icon || '';
                            const isImage = iconValue.startsWith('http') || iconValue.startsWith('/') || iconValue.startsWith('data:');
                            const IconComponent = isImage ? null : (iconMap[iconValue] || Layers);

                            return (
                                <motion.div
                                    key={service._id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5, delay: index * 0.1 }}
                                    onClick={() => navigate('/contact')}
                                    onMouseEnter={() => setHoveredIdx(index)}
                                    onMouseLeave={() => setHoveredIdx(null)}
                                    className="relative group cursor-pointer bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-2xl hover:shadow-indigo-100 transition-all duration-500 hover:-translate-y-2 flex flex-col"
                                >
                                    {/* Top gradient bar */}
                                    <div className={`h-1.5 w-full bg-gradient-to-r ${g.from} ${g.to}`} />

                                    {/* Card body */}
                                    <div className="p-8 flex flex-col flex-1">
                                        {/* Icon */}
                                        <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${g.from} ${g.to} flex items-center justify-center text-white mb-6 shadow-md transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3`}>
                                            {isImage ? (
                                                <img src={resolveImageUrl(iconValue)} alt={service.title} className="w-full h-full object-cover rounded-2xl" />
                                            ) : (
                                                <IconComponent size={26} strokeWidth={2} />
                                            )}
                                        </div>

                                        {/* Number badge */}
                                        <span className="text-xs font-black text-slate-300 uppercase tracking-widest mb-2">
                                            {String(index + 1).padStart(2, '0')}
                                        </span>

                                        <h3 className="text-xl font-black text-slate-900 mb-3 group-hover:text-indigo-600 transition-colors leading-tight">
                                            {service.title}
                                        </h3>
                                        <p className="text-slate-500 text-sm leading-relaxed flex-grow whitespace-pre-line mb-6">
                                            {service.description}
                                        </p>

                                        {/* CTA link */}
                                        <div className="flex items-center gap-1.5 text-indigo-600 font-bold text-xs uppercase tracking-widest mt-auto group-hover:gap-2.5 transition-all">
                                            Get Started
                                            <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="text-center py-32 bg-white rounded-3xl shadow border border-slate-100">
                        <Layers size={56} className="mx-auto text-slate-200 mb-4" />
                        <h3 className="text-xl font-black text-slate-400">No active services yet</h3>
                    </div>
                )}
            </section>

            {/* ─── Why Choose Us ─── */}
            <section className="py-20 bg-white border-y border-slate-100">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                        {/* Left */}
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                        >
                            <p className="text-indigo-600 text-xs font-black uppercase tracking-[0.3em] mb-3">Why MentriQ</p>
                            <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter mb-6 leading-tight">
                                Excellence in
                                <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-500">
                                    Every Delivery.
                                </span>
                            </h2>
                            <p className="text-slate-500 text-base leading-relaxed mb-8">
                                We combine technical depth with creative innovation to deliver solutions that are not just functional — but transformative.
                            </p>
                            <button
                                onClick={() => navigate('/contact')}
                                className="group px-8 py-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm uppercase tracking-widest transition-all flex items-center gap-2 shadow-lg shadow-indigo-200"
                            >
                                Discuss Your Project
                                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                            </button>
                        </motion.div>

                        {/* Right: feature bullets */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {whyUs.map((item, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    whileInView={{ opacity: 1, scale: 1 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.5, delay: i * 0.1 }}
                                    className="p-6 rounded-2xl bg-slate-50 border border-slate-100 hover:border-indigo-200 hover:bg-indigo-50/30 transition-all group"
                                >
                                    <div className="w-9 h-9 rounded-xl bg-indigo-100 flex items-center justify-center mb-4 group-hover:bg-indigo-600 transition-colors">
                                        <CheckCircle2 size={18} className="text-indigo-600 group-hover:text-white transition-colors" />
                                    </div>
                                    <h4 className="text-sm font-black text-slate-900 mb-1 uppercase tracking-tight">{item.title}</h4>
                                    <p className="text-xs text-slate-500 leading-relaxed">{item.desc}</p>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* ─── CTA ─── */}
            <section className="py-28 relative overflow-hidden bg-[#09090f]">
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-indigo-700/15 rounded-full blur-[120px]" />
                    <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-violet-600/10 rounded-full blur-[100px]" />
                    <div className="absolute inset-0 opacity-[0.04]" style={{
                        backgroundImage: 'linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)',
                        backgroundSize: '40px 40px'
                    }} />
                </div>

                <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="inline-flex items-center gap-2 mb-8 px-4 py-2 rounded-full bg-white/5 border border-white/10"
                    >
                        <Zap size={12} className="text-yellow-400" />
                        <span className="text-xs font-bold uppercase tracking-widest text-slate-300">Ready to Build?</span>
                    </motion.div>

                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="text-4xl md:text-6xl font-black text-white mb-6 tracking-tighter leading-[0.95]"
                    >
                        Let's Create Something
                        <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">
                            Extraordinary.
                        </span>
                    </motion.h2>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="text-slate-400 mb-12 max-w-xl mx-auto text-base leading-relaxed"
                    >
                        Our engineering team is ready to transform your vision into powerful digital reality.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                        className="flex flex-col sm:flex-row gap-4 justify-center"
                    >
                        <button
                            onClick={() => navigate('/contact')}
                            className="group px-10 py-5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-black text-sm uppercase tracking-widest transition-all flex items-center justify-center gap-2 shadow-xl shadow-indigo-900/40"
                        >
                            Start a Project
                            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                        </button>
                        <button
                            onClick={() => navigate('/courses')}
                            className="px-10 py-5 rounded-xl bg-white/5 border border-white/10 text-white font-black text-sm uppercase tracking-widest hover:bg-white/10 transition-all"
                        >
                            Explore Courses
                        </button>
                    </motion.div>
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default ServicesPage;
