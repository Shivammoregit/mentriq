import React, { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight, Play, Users, UserCog, KanbanSquare, Code, ClipboardCheck, BookOpen, Award, Clock, CheckCircle, Star, Globe, Smartphone, Palette, Megaphone, Server, Shield, Database, Layers, Target, Sparkles, GraduationCap, Briefcase, TrendingUp, Zap, HeadphonesIcon, FileCheck } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { apiClient as api } from '../utils/apiClient'
import { resolveImageUrl } from '../utils/imageUtils'

import MentorsSection from '../components/home/MentorsSection.jsx'
import CitySection from '../components/home/CitySection';
import Hero3DElement from '../components/home/Hero3DElement'
import OneByOneTestimonial from '../components/home/OneByOneTestimonial'
import SectionErrorBoundary from '../components/common/SectionErrorBoundary'

const HomePage = () => {
    const { login, register } = useAuth()
    const [showAuthModal, setShowAuthModal] = useState(false)
    const [isLogin, setIsLogin] = useState(true)
    const [services, setServices] = useState([])
    const [statsData, setStatsData] = useState(null)
    const [dynamicPartners, setDynamicPartners] = useState([])
    const [dynamicTestimonials, setDynamicTestimonials] = useState([])
    const [dynamicTechnologies, setDynamicTechnologies] = useState([])
    const [loading, setLoading] = useState(true)
    const navigate = useNavigate();

    // Fetch all dynamic data with polling for real-time updates
    const fetchAllData = React.useCallback(async () => {
        try {
            const [servicesRes, statsRes, partnersRes, feedbackRes, techRes] = await Promise.all([
                api.get('/services').catch(() => ({ data: [] })),
                api.get('/stats').catch(() => ({ data: null })),
                api.get('/partners').catch(() => ({ data: [] })),
                api.get('/feedbacks').catch(() => ({ data: [] })),
                api.get('/technologies').catch(() => ({ data: { success: true, data: [] } }))
            ])

            setServices(Array.isArray(servicesRes.data) ? servicesRes.data.slice(0, 6) : [])
            setStatsData(statsRes.data || null)
            setDynamicPartners(Array.isArray(partnersRes.data) ? partnersRes.data : [])

            if (Array.isArray(feedbackRes.data) && feedbackRes.data.length > 0) {
                const formatted = feedbackRes.data.map(f => ({
                    name: f.name,
                    feedback: f.message, // Map backend 'message' to frontend 'feedback'
                    image: f.image
                }));
                setDynamicTestimonials(formatted);
            } else {
                setDynamicTestimonials([]);
            }

            if (techRes.data?.success && Array.isArray(techRes.data.data)) {
                setDynamicTechnologies(techRes.data.data);
            } else {
                setDynamicTechnologies([]);
            }
        } catch (error) {
            console.error('Failed to fetch home page data:', error)
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => {
        fetchAllData()
        // Polling for real-time updates every 30 seconds
        const interval = setInterval(fetchAllData, 30000)
        return () => clearInterval(interval)
    }, [fetchAllData])

    // Icon mapping for services
    const iconMap = {
        'Globe': Globe,
        'Smartphone': Smartphone,
        'Palette': Palette,
        'Megaphone': Megaphone,
        'Server': Server,
        'Shield': Shield,
        'Database': Database,
        'Code': Code,
        'Layers': Layers
    }

    const gradients = [
        'from-blue-500 to-cyan-500',
        'from-purple-500 to-pink-500',
        'from-orange-500 to-red-500',
        'from-green-500 to-emerald-500',
        'from-indigo-500 to-violet-500',
        'from-red-600 to-rose-600'
    ];


    const stats = [
        { number: statsData?.students || '0', icon: GraduationCap, label: 'Students Trained', color: 'from-indigo-500 to-indigo-600' },
        { number: statsData?.courses || '0', icon: BookOpen, label: 'Live Courses', color: 'from-cyan-500 to-cyan-600' },
        { number: statsData?.placements || '0%', icon: TrendingUp, label: 'Placement Rate', color: 'from-purple-500 to-purple-600' },
        { number: statsData?.trainers || '0', icon: Users, label: 'Expert Trainers', color: 'from-blue-500 to-blue-600' }
    ]


    const features = [
        {
            title: 'Live Interactive Classes',
            description: 'Engage in real-time learning sessions with industry-leading experts',
            icon: Sparkles,
            color: 'from-blue-600 to-blue-700'
        },
        {
            title: 'Hands-on Projects',
            description: 'Build production-grade projects that showcase your expertise',
            icon: Code,
            color: 'from-indigo-600 to-indigo-700'
        },
        {
            title: 'Career Certification',
            description: 'Earn industry-recognized credentials with placement assistance',
            icon: GraduationCap,
            color: 'from-purple-600 to-purple-700'
        },
        {
            title: '24/7 Expert Support',
            description: 'Access dedicated mentorship and doubt resolution anytime',
            icon: HeadphonesIcon,
            color: 'from-cyan-600 to-cyan-700'
        },
        {
            title: 'Industry Curriculum',
            description: 'Master in-demand skills aligned with market requirements',
            icon: Target,
            color: 'from-emerald-600 to-emerald-700'
        },
        {
            title: 'Career Mentorship',
            description: 'Receive personalized guidance for accelerated growth',
            icon: Briefcase,
            color: 'from-orange-600 to-orange-700'
        },
        {
            title: 'Live Coding Labs',
            description: 'Practice through interactive coding challenges and workshops',
            icon: Zap,
            color: 'from-pink-600 to-pink-700'
        },
        {
            title: 'Assignment Reviews',
            description: 'Get detailed feedback with comprehensive solution analysis',
            icon: FileCheck,
            color: 'from-rose-600 to-rose-700'
        },
    ]

    const testimonials = []
    const partners = []
    const technologies = []

    return (
        <>

            {/* ─── Hero Section (Spline 3D) ─── */}
            <SectionErrorBoundary fallback={
                <div className="w-full min-h-[60vh] flex items-center justify-center bg-slate-50">
                    <div className="text-center p-8 bg-white rounded-3xl shadow-xl border border-slate-100 max-w-md">
                        <div className="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                            <Sparkles className="w-8 h-8 text-indigo-500" />
                        </div>
                        <h2 className="text-2xl font-black text-slate-900 mb-2 uppercase tracking-tight">Experience Optimized</h2>
                        <p className="text-slate-500 mb-6">We've loaded a high-performance version of our interface for your device.</p>
                        <button
                            onClick={() => window.location.reload()}
                            className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold text-sm uppercase tracking-widest hover:bg-indigo-700 transition-colors"
                        >
                            Reload Experience
                        </button>
                    </div>
                </div>
            }>
                <Hero3DElement />
            </SectionErrorBoundary>


            {/* NEW Vision Section Compact */}
            <section className="py-12 bg-slate-50 relative overflow-hidden">
                <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="relative"
                    >
                        <div className="aspect-square rounded-[3rem] bg-indigo-100 overflow-hidden relative shadow-2xl">
                            <img
                                src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=1200"
                                alt="Innovation"
                                className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-1000 scale-110 hover:scale-100"
                            />
                            <div className="absolute inset-0 bg-indigo-600/10 mix-blend-overlay" />
                        </div>
                        {/* Floating Metric Card */}
                        <motion.div
                            animate={{ y: [0, -15, 0] }}
                            transition={{ duration: 4, repeat: Infinity }}
                            className="absolute -bottom-6 -right-6 bg-white p-6 rounded-3xl shadow-2xl border border-slate-100 max-w-[200px]"
                        >
                            <TrendingUp className="w-8 h-8 text-indigo-600 mb-2" />
                            <div className="text-2xl font-black text-slate-900 mb-1 font-display">{statsData?.placements || '0%'}</div>
                            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-tight">Career Placement Success Rate</div>
                        </motion.div>
                    </motion.div>

                    <div className="space-y-10">
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                        >
                            <div className="text-indigo-600 font-black uppercase tracking-[0.4em] text-[10px] mb-4">Our Mission</div>
                            <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-4 font-display leading-tight">
                                DEPLOYING THE NEXT <br />
                                GENERATION OF AI <br />
                                <span className="text-indigo-600">ARCHITECTS.</span>
                            </h2>
                            <p className="text-base text-slate-500 leading-relaxed font-medium">
                                At MentriQ, we don't just teach technology; we engineer careers. Our methodology is built on three pillars of excellence: real-world proximity, algorithmic rigor, and global standard certification.
                            </p>
                        </motion.div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {[
                                { title: 'Project First', desc: 'Build 10+ industry projects.' },
                                { title: 'Elite Network', desc: 'Connect with 60+ partners.' }
                            ].map((item, idx) => (
                                <div key={idx} className="p-4 bg-white rounded-2xl border border-slate-100 shadow-sm">
                                    <CheckCircle className="w-4 h-4 text-indigo-500 mb-2" />
                                    <div className="font-black text-slate-900 text-xs uppercase tracking-tighter mb-1">{item.title}</div>
                                    <div className="text-[10px] text-slate-400 font-medium">{item.desc}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Stats Section - Premium Light Theme Compact */}
            <section className="py-8 relative bg-slate-50">
                {/* Decorative Background */}
                <div className="absolute inset-0 pointer-events-none opacity-40">
                    <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl" />
                    <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl" />
                </div>

                <div className="relative max-w-7xl mx-auto px-6">
                    {/* Section Header */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="text-center mb-8"
                    >
                        <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-2 tracking-tighter uppercase font-display">
                            THE IMPACT
                        </h2>
                        <p className="text-slate-500 text-base max-w-2xl mx-auto font-medium">
                            Join the ranks of high-performance professionals scaling global industries.
                        </p>
                    </motion.div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {[
                            { number: statsData?.students || '0', icon: GraduationCap, label: 'Students Trained', color: 'from-indigo-600 to-indigo-700' },
                            { number: statsData?.courses || '0', icon: BookOpen, label: 'Live Courses', color: 'from-cyan-600 to-cyan-700' },
                            { number: statsData?.placements || '0%', icon: TrendingUp, label: 'Placement Rate', color: 'from-purple-600 to-purple-700' },
                            { number: statsData?.trainers || '0', icon: Users, label: 'Expert Trainers', color: 'from-blue-600 to-blue-700' }
                        ].map((stat, index) => {
                            const Icon = stat.icon
                            return (
                                <motion.div
                                    key={stat.label}
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    whileHover={{ y: -8, scale: 1.02 }}
                                    transition={{
                                        duration: 0.6,
                                        delay: index * 0.1,
                                        ease: [0.16, 1, 0.3, 1]
                                    }}
                                    viewport={{ once: true }}
                                    className="relative bg-white p-6 rounded-[2rem] border border-slate-100 hover:border-indigo-100 group text-center transition-all duration-500 shadow-[0_10px_30px_-15px_rgba(0,0,0,0.05)] hover:shadow-[0_20px_40px_-12px_rgba(79,70,229,0.1)]"
                                >
                                    {/* Icon */}
                                    <div className={`inline-flex items-center justify-center w-14 h-14 mb-4 bg-gradient-to-br ${stat.color} rounded-[1rem] text-white shadow-lg transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-500`}>
                                        <Icon className="w-7 h-7" strokeWidth={2.5} />
                                    </div>
                                    {/* Number */}
                                    <div className="text-4xl md:text-5xl font-black text-slate-900 mb-1 tracking-tighter">
                                        {stat.number}
                                    </div>

                                    {/* Label */}
                                    <div className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">
                                        {stat.label}
                                    </div>

                                    {/* Hover Shine Effect */}
                                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/0 to-cyan-50/0 group-hover:from-indigo-50/20 group-hover:to-cyan-50/20 rounded-[2.5rem] transition-all duration-500 pointer-events-none" />
                                </motion.div>
                            )
                        })}
                    </div>
                </div>
            </section>

            <CitySection />

            {/* Features Section - Interactive Dark Theme Compact */}
            <section className="py-6 md:py-8 bg-gradient-to-b from-[#0f172a] via-slate-900 to-slate-800 overflow-hidden relative">
                {/* Background Effects */}
                <div className="absolute inset-0 pointer-events-none opacity-20">
                    <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl" />
                    <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-indigo-500/15 rounded-full blur-3xl" />
                </div>

                <div className="relative max-w-7xl mx-auto px-6">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="text-center mb-8"
                    >
                        <div className="text-indigo-400 font-black uppercase tracking-[0.4em] text-[10px] mb-4">Our Ecosystem</div>
                        <h2 className="text-4xl md:text-5xl font-black text-white mb-4 font-display tracking-tight">
                            BEYOND <span className="text-indigo-400">TRADITION.</span>
                        </h2>
                        <p className="text-lg text-gray-400 max-w-3xl mx-auto font-medium">
                            We provide a high-frequency learning environment designed for maximum skill retention and career acceleration.
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {features.map((feature, index) => {
                            const Icon = feature.icon
                            return (
                                <motion.div
                                    key={feature.title}
                                    initial={{ opacity: 0, y: 30, rotateX: -15 }}
                                    whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
                                    transition={{ duration: 0.6, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
                                    viewport={{ once: true }}
                                    whileHover={{ y: -6, scale: 1.02, rotateY: 5 }}
                                    className="group bg-white/5 backdrop-blur-xl rounded-2xl p-6 shadow-xl shadow-black/20 border border-white/10 hover:border-white/20 hover:bg-white/[0.08] transition-all duration-500 relative overflow-hidden cursor-pointer"
                                    style={{ transformStyle: 'preserve-3d' }}
                                >
                                    {/* Animated Border Gradient */}
                                    <motion.div
                                        animate={{
                                            rotate: [0, 360]
                                        }}
                                        transition={{
                                            duration: 8,
                                            repeat: Infinity,
                                            ease: 'linear'
                                        }}
                                        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                                    >
                                        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-500 blur-xl opacity-30" />
                                    </motion.div>

                                    {/* Icon with Pulse */}
                                    <motion.div
                                        animate={{
                                            scale: [1, 1.05, 1]
                                        }}
                                        transition={{
                                            duration: 3,
                                            repeat: Infinity,
                                            delay: index * 0.2
                                        }}
                                        className={`relative w-14 h-14 mb-4 bg-gradient-to-br ${feature.color} rounded-xl flex items-center justify-center shadow-2xl shadow-${feature.color.split('-')[1]}-500/30 group-hover:scale-110 transition-all duration-500`}
                                    >
                                        <Icon className="w-7 h-7 text-white" strokeWidth={2.5} />
                                        <div className="absolute inset-0 bg-white/10 rounded-xl group-hover:bg-white/20 transition-all" />
                                    </motion.div>

                                    <h3 className="relative text-xl font-black text-white mb-3 group-hover:text-indigo-300 transition-colors">{feature.title}</h3>
                                    <p className="relative text-gray-300 leading-relaxed text-[15px] group-hover:text-gray-100 transition-colors">{feature.description}</p>

                                    {/* Bottom Accent */}
                                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-indigo-500/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                </motion.div>
                            )
                        })}
                    </div>
                </div>
            </section>

            {/* Services Section - Premium Light 3D Theme Compact */}
            <section className="py-8 bg-white overflow-hidden relative">
                {/* Ambient Depth Shadows - Refined for Light Mode */}
                <div className="absolute inset-0 pointer-events-none opacity-20">
                    <div className="absolute top-0 left-0 w-full h-48 bg-gradient-to-b from-slate-50 to-transparent" />
                    <div className="absolute top-1/2 left-0 w-80 h-80 bg-indigo-500/5 rounded-full blur-[100px]" />
                    <div className="absolute bottom-0 right-0 w-80 h-80 bg-cyan-500/5 rounded-full blur-[100px]" />
                </div>

                <div className="relative max-w-7xl mx-auto px-6">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="text-center mb-10"
                    >
                        <motion.div
                            className="inline-flex items-center space-x-2 py-1.5 px-4 rounded-full bg-indigo-50 border border-indigo-100 mb-4"
                        >
                            <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
                            <span className="text-indigo-600 text-[10px] font-black tracking-widest uppercase">Expert Solutions</span>
                        </motion.div>
                        <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-4 tracking-tighter uppercase font-display">
                            WHAT WE <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-cyan-600">ENGINEER.</span>
                        </h2>
                        <p className="text-lg text-slate-500 max-w-3xl mx-auto font-medium">
                            Architecting the future of intelligence with comprehensive technology stacks.
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {services.map((service, index) => {
                            const IconComponent = iconMap[service.icon] || Code;
                            const gradients = [
                                'from-blue-600 to-blue-700',
                                'from-indigo-600 to-indigo-700',
                                'from-purple-600 to-purple-700',
                                'from-cyan-600 to-cyan-700',
                                'from-emerald-600 to-emerald-700',
                                'from-rose-600 to-rose-700'
                            ];
                            const gradient = gradients[index % gradients.length];
                            const iconValue = service.icon || "";
                            const isImage = iconValue.startsWith("http") || iconValue.startsWith("/") || iconValue.startsWith("data:");

                            return (
                                <motion.div
                                    key={service._id || index}
                                    onClick={() => navigate('/services')}
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    whileHover={{ y: -10 }}
                                    transition={{ delay: index * 0.1, duration: 0.4 }}
                                    className="bg-white rounded-[2.5rem] p-10 shadow-xl shadow-slate-200/50 hover:shadow-2xl hover:shadow-indigo-500/10 border border-slate-100 hover:border-indigo-500/20 transition-all duration-500 flex flex-col h-full group cursor-pointer relative overflow-hidden"
                                >
                                    <div className={`absolute top-0 right-0 w-40 h-40 bg-gradient-to-br ${gradient} opacity-5 rounded-bl-[100%] -mr-10 -mt-10 transition-transform group-hover:scale-150`} />

                                    <div className={`w-20 h-20 rounded-3xl bg-gradient-to-br ${gradient} flex items-center justify-center text-white mb-8 shadow-lg shadow-indigo-500/20 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 relative z-10`}>
                                        {isImage ? (
                                            <img src={resolveImageUrl(iconValue)} alt={service.title} className="w-full h-full object-cover rounded-3xl" />
                                        ) : (
                                            <IconComponent size={36} strokeWidth={2} />
                                        )}
                                    </div>

                                    <h3 className="text-2xl font-black text-slate-900 mb-4 group-hover:text-indigo-600 transition-colors relative z-10">{service.title}</h3>
                                    <p className="text-slate-500 leading-relaxed mb-8 flex-grow whitespace-pre-line text-sm font-medium relative z-10 line-clamp-3">{service.description}</p>

                                    <div className="flex items-center text-indigo-600 font-bold text-sm uppercase tracking-widest mt-auto group-hover:translate-x-2 transition-transform">
                                        Learn More <ArrowRight size={16} className="ml-1" />
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>

                    {/* View More Button */}
                    <div className="mt-16 text-center">
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => navigate('/services')}
                            className="inline-flex items-center gap-3 px-8 py-4 bg-indigo-600 text-white rounded-2xl font-bold shadow-xl shadow-indigo-600/30 hover:bg-indigo-700 transition-colors group"
                        >
                            View All Services
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </motion.button>
                    </div>

                </div>
            </section >

            {/* Mentors Section - Advanced Perspective Carousel */}
            < SectionErrorBoundary fallback={< div className="h-40 bg-slate-50 flex items-center justify-center" > Unable to load mentors.</div >}>
                <MentorsSection />
            </SectionErrorBoundary >

            {/* Testimonials Section - Premium Light 3D Interactive Grid Compact */}
            {dynamicTestimonials.length > 0 && (
                <section className="py-8 bg-white overflow-hidden relative">
                    <div className="max-w-7xl mx-auto px-6 mb-6 text-center relative z-10">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="inline-flex items-center space-x-2 py-1.5 px-4 rounded-full bg-indigo-50 border border-indigo-100 mb-3"
                        >
                            <Users className="w-3.5 h-3.5 text-indigo-500" />
                            <span className="text-indigo-600 text-[10px] font-black tracking-widest uppercase">Verified Success Stories</span>
                        </motion.div>
                        <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-3 tracking-tighter uppercase font-display">
                            STUDENT <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-cyan-600">IMPACT.</span>
                        </h2>
                    </div>

                    <div className="relative max-w-7xl mx-auto px-6">
                        <SectionErrorBoundary fallback={<div className="w-full h-40 rounded-3xl bg-slate-50 border border-slate-100" />}>
                            <OneByOneTestimonial testimonials={dynamicTestimonials} />
                        </SectionErrorBoundary>
                    </div>
                </section>
            )}

            {/* Partners Section - Premium Light 3D Dual-Scroller Compact */}
            {dynamicPartners.length > 0 && (
                <section className="py-8 bg-white overflow-hidden relative">
                    {/* Ambient Subtle Glows - Refined for Light Theme */}
                    <div className="absolute inset-0 pointer-events-none opacity-40">
                        <div className="absolute top-1/2 left-0 w-96 h-96 bg-indigo-500/5 rounded-full blur-[120px]" />
                        <div className="absolute top-1/2 right-0 w-96 h-96 bg-cyan-500/5 rounded-full blur-[120px]" />
                    </div>

                    <div className="relative max-w-7xl mx-auto px-6 mb-8 text-center">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                        >
                            <motion.div
                                className="inline-flex items-center space-x-2 py-1.5 px-4 rounded-full bg-cyan-50 border border-cyan-100 mb-3"
                            >
                                <Briefcase className="w-3.5 h-3.5 text-cyan-500" />
                                <span className="text-cyan-600 text-[10px] font-black tracking-widest uppercase">Global Network</span>
                            </motion.div>

                            <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-4 tracking-tighter uppercase font-display">
                                OUR HIRING <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-cyan-600">PARTNERS.</span>
                            </h2>
                            <p className="text-lg text-slate-500 max-w-2xl mx-auto font-medium">
                                Trusted by leading industry giants and high-growth technology ventures worldwide.
                            </p>
                        </motion.div>
                    </div>

                    <div
                        className="relative space-y-8 py-6"
                        style={{
                            perspective: '2000px',
                            maskImage: 'linear-gradient(to right, transparent, black 20%, black 80%, transparent)',
                            WebkitMaskImage: 'linear-gradient(to right, transparent, black 20%, black 80%, transparent)'
                        }}
                    >
                        {/* Top Row - Scrolling Left */}
                        <div style={{ transformStyle: 'preserve-3d', transform: 'rotateX(5deg)' }}>
                            <motion.div
                                className="flex gap-8 w-max"
                                animate={{ x: ["0%", "-50%"] }}
                                transition={{
                                    repeat: Infinity,
                                    repeatType: "loop",
                                    duration: 40,
                                    ease: "linear",
                                }}
                            >
                                {/* Dual Buffer for Seamless Loop */}
                                {[...dynamicPartners, ...dynamicPartners].map((partner, index) => (
                                    <motion.div
                                        key={`top-${index}`}
                                        whileHover={{ y: -6, scale: 1.05, translateZ: 40 }}
                                        className="w-[180px] flex-shrink-0 bg-white rounded-2xl p-5 border border-slate-100 hover:border-indigo-500/20 hover:bg-slate-50 shadow-xl flex flex-col items-center justify-center group transition-all duration-500 cursor-pointer overflow-hidden relative"
                                    >
                                        {/* Logo Backglow */}
                                        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                                        <div className="h-14 w-full flex items-center justify-center mb-2 relative z-10">
                                            <img
                                                src={partner.logo || partner.imageUrl}
                                                alt={partner.name}
                                                className="max-h-10 w-auto object-contain grayscale opacity-50 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700 filter drop-shadow-[0_0_8px_rgba(0,0,0,0.05)]"
                                            />
                                        </div>
                                        <p className="text-[10px] font-black text-slate-400 text-center uppercase tracking-[0.2em] group-hover:text-indigo-600 transition-colors relative z-10">
                                            {partner.name}
                                        </p>

                                        {/* Scanline Overlay */}
                                        <div className="absolute inset-0 opacity-[0.03] group-hover:opacity-[0.06] pointer-events-none animate-scan" />
                                    </motion.div>
                                ))}
                            </motion.div>
                        </div>

                        {/* Bottom Row - Scrolling Right */}
                        <div style={{ transformStyle: 'preserve-3d', transform: 'rotateX(-5deg)' }}>
                            <motion.div
                                className="flex gap-8 w-max"
                                animate={{ x: ["-50%", "0%"] }}
                                transition={{
                                    repeat: Infinity,
                                    repeatType: "loop",
                                    duration: 45,
                                    ease: "linear",
                                }}
                            >
                                {/* Dual Buffer for Seamless Loop */}
                                {[...dynamicPartners, ...dynamicPartners].map((partner, index) => (
                                    <motion.div
                                        key={`bottom-${index}`}
                                        whileHover={{ y: 6, scale: 1.05, translateZ: 40 }}
                                        className="w-[180px] flex-shrink-0 bg-white rounded-2xl p-5 border border-slate-100 hover:border-cyan-500/20 hover:bg-slate-50 shadow-xl flex flex-col items-center justify-center group transition-all duration-500 cursor-pointer overflow-hidden relative"
                                    >
                                        {/* Logo Backglow */}
                                        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-cyan-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                                        <div className="h-14 w-full flex items-center justify-center mb-2 relative z-10">
                                            <img
                                                src={partner.logo || partner.imageUrl}
                                                alt={partner.name}
                                                className="max-h-10 w-auto object-contain grayscale opacity-50 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700 filter drop-shadow-[0_0_8px_rgba(0,0,0,0.05)]"
                                            />
                                        </div>
                                        <p className="text-[10px] font-black text-slate-400 text-center uppercase tracking-[0.2em] group-hover:text-cyan-600 transition-colors relative z-10">
                                            {partner.name}
                                        </p>

                                        {/* Scanline Overlay */}
                                        <div className="absolute inset-0 opacity-[0.03] group-hover:opacity-[0.06] pointer-events-none animate-scan" />
                                    </motion.div>
                                ))}
                            </motion.div>
                        </div>
                    </div>
                </section>
            )}

            {/* Technologies Section - Premium Dark 3D Perspective Scroller Compact */}
            < section className="py-10 bg-[#070b14] overflow-hidden relative" >
                {/* Advanced Ambient Glows - Refined for Dark Theme */}
                < div className="absolute inset-0 pointer-events-none overflow-hidden" >
                    <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-indigo-500/10 rounded-full blur-[160px]" />
                    <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-cyan-500/10 rounded-full blur-[160px]" />

                    {/* Background Tech Grid - Subtle for Dark Theme */}
                    <div className="absolute inset-0 opacity-[0.05]"
                        style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)', backgroundSize: '80px 80px' }}
                    />
                </div >

                <div className="max-w-7xl mx-auto px-6 mb-12 text-center relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="inline-flex items-center gap-3 py-1.5 px-5 rounded-full bg-white/5 border border-white/10 mb-4 shadow-[0_0_20px_rgba(99,102,241,0.1)]"
                    >
                        <Target className="w-3.5 h-3.5 text-indigo-400" />
                        <span className="text-indigo-400 text-[10px] font-black tracking-[0.4em] uppercase">Industry Standard Tech</span>
                    </motion.div>

                    <h2 className="text-4xl md:text-6xl font-black mb-4 tracking-tighter uppercase leading-none text-white font-display">
                        MASTERY <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-cyan-400">STACK.</span>
                    </h2>
                    <p className="text-lg text-slate-400 max-w-2xl mx-auto font-medium leading-relaxed">
                        Deployment-ready expertise in industry-standard tools and frameworks driving the <span className="text-white">modern digital economy.</span>
                    </p>
                </div>

                {/* 3D Perspective Scroller Container */}
                <div
                    className="relative py-6"
                    style={{
                        perspective: '2000px',
                        maskImage: 'linear-gradient(to right, transparent, black 15%, black 85%, transparent)',
                        WebkitMaskImage: 'linear-gradient(to right, transparent, black 15%, black 85%, transparent)'
                    }}
                >
                    <motion.div
                        className="flex gap-8 px-4 w-max"
                        animate={{ x: ["0%", "-50%"] }}
                        transition={{
                            repeat: Infinity,
                            duration: 35,
                            ease: "linear",
                        }}
                        style={{ transformStyle: 'preserve-3d' }}
                    >
                        {/* Dual Buffer for Seamless Loop */}
                        {(dynamicTechnologies.length > 0 ? [...dynamicTechnologies, ...dynamicTechnologies] : [...technologies, ...technologies]).map((tech, index) => (
                            <motion.div
                                key={index}
                                whileHover={{
                                    scale: 1.1,
                                    translateZ: 60,
                                    rotateX: 10,
                                    boxShadow: '0 30px 60px rgba(99,102,241,0.2)'
                                }}
                                className="w-[150px] h-[160px] rounded-[1.5rem] bg-white border border-white/20 flex flex-col items-center justify-center relative overflow-hidden group transition-all duration-500 cursor-pointer shadow-[0_20px_40px_-15px_rgba(0,0,0,0.3)]"
                                style={{ transformStyle: 'preserve-3d' }}
                            >
                                {/* HUD Corner Accents - Refined for White Card */}
                                <div className="absolute top-4 left-4 w-4 h-4 border-t border-l border-slate-100 rounded-tl-lg group-hover:border-indigo-500 transition-colors" />
                                <div className="absolute bottom-4 right-4 w-4 h-4 border-b border-r border-slate-100 rounded-br-lg group-hover:border-cyan-500 transition-colors" />

                                {/* Internal Ambient Core */}
                                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-indigo-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                                {/* Scanline Overlay - Subtle for White Card */}
                                <div className="absolute inset-0 opacity-[0.02] group-hover:opacity-[0.05] pointer-events-none overflow-hidden transition-opacity">
                                    <div className="absolute inset-0 bg-[linear-gradient(0deg,transparent_0%,rgba(0,0,0,0.05)_50%,transparent_100%)] bg-[length:100%_4px] animate-scan" />
                                </div>

                                {/* Floating Logo with Depth */}
                                <div className="relative mb-6 z-10" style={{ transform: 'translateZ(30px)' }}>
                                    <motion.img
                                        src={tech.logo || "https://via.placeholder.com/64?text=Tech"}
                                        alt={tech.name}
                                        className="w-16 h-16 object-contain filter drop-shadow-[0_5px_15px_rgba(0,0,0,0.1)] group-hover:drop-shadow-[0_10px_25px_rgba(99,102,241,0.2)] transition-all duration-500"
                                        animate={{ y: [0, -4, 0] }}
                                        transition={{ duration: 4, repeat: Infinity, delay: (index % technologies.length) * 0.15 }}
                                    />
                                </div>

                                <div className="relative z-10 text-center px-2">
                                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 group-hover:text-indigo-600 transition-colors duration-300">
                                        {tech.name}
                                    </p>
                                    <div className="w-6 h-0.5 bg-slate-100 mx-auto mt-1 rounded-full group-hover:w-10 group-hover:bg-indigo-400 transition-all duration-500" />
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>

                {/* Perspective Glow Floor - Dark Theme */}
                <div className="h-24 w-full bg-gradient-to-b from-transparent to-[#070b14]/50 opacity-100 relative -top-12 z-0 pointer-events-none" />
            </section >



            {/* CTA Section - Premium Light Theme Upgrade Compact */}
            < section className="pt-10 pb-6 bg-white relative overflow-hidden" >
                {/* Background Pattern & Glows - Refined for Light Theme */}
                < div className="absolute inset-0 opacity-[0.05] pointer-events-none"
                    style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, #000 1px, transparent 0)', backgroundSize: '40px 40px' }}
                />
                < div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-indigo-500/5 rounded-full blur-[160px] pointer-events-none" />

                <div className="relative max-w-6xl mx-auto px-6">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="bg-white/40 backdrop-blur-3xl rounded-[2.5rem] p-8 md:p-14 border border-slate-100 shadow-[0_30px_90px_-20px_rgba(0,0,0,0.08)] relative overflow-hidden text-center group"
                    >
                        {/* Interactive Corner Brackets - Refined for Light Theme */}
                        <div className="absolute top-8 left-8 w-12 h-12 border-t-2 border-l-2 border-slate-200 rounded-tl-xl transition-all group-hover:border-indigo-500 group-hover:scale-110" />
                        <div className="absolute bottom-8 right-8 w-12 h-12 border-b-2 border-r-2 border-slate-200 rounded-br-xl transition-all group-hover:border-cyan-500 group-hover:scale-110" />

                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.2 }}
                        >
                            <motion.div
                                className="inline-block py-1.5 px-5 rounded-full bg-indigo-50 border border-indigo-100 mb-4"
                            >
                                <span className="text-indigo-600 text-[10px] font-black tracking-[0.4em] uppercase">Phase: Launch</span>
                            </motion.div>

                            <h2 className="text-4xl md:text-7xl font-black text-slate-900 mb-6 tracking-tighter uppercase leading-[0.9] font-display">
                                READY TO <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-600 animate-gradient-x">DEPART?</span>
                            </h2>

                            <p className="text-lg md:text-xl text-slate-500 max-w-2xl mx-auto font-medium mb-8 leading-relaxed">
                                Join <span className="text-slate-900 font-bold italic underline decoration-indigo-200">thousands</span> of students who have transformed their careers with MentriQ Technologies.
                            </p>

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.4 }}
                                className="flex flex-col sm:flex-row gap-6 justify-center items-center"
                            >
                                <motion.button
                                    whileHover={{ scale: 1.05, boxShadow: '0 20px 40px rgba(79, 70, 229, 0.2)' }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => navigate("/courses")}
                                    className="px-12 py-5 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white font-black rounded-2xl shadow-xl flex items-center gap-3 group/btn uppercase tracking-widest text-sm"
                                >
                                    Explore Courses
                                    <Sparkles className="w-5 h-5 group-hover/btn:rotate-12 transition-transform" />
                                </motion.button>

                                <motion.button
                                    whileHover={{ scale: 1.05, background: 'rgba(0,0,0,0.02)' }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => navigate('/contact')}
                                    className="px-12 py-5 bg-transparent backdrop-blur-md border-2 border-slate-200 text-slate-700 font-black rounded-2xl transition-all uppercase tracking-widest text-sm"
                                >
                                    Contact Us
                                </motion.button>
                            </motion.div>
                        </motion.div>

                        {/* Energy Surge Overlay - Light Theme */}
                        <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/5 via-transparent to-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                    </motion.div>
                </div>
            </section >
        </>
    )
}

export default HomePage
