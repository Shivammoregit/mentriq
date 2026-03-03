import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    Zap,
    Users,
    Target,
    Award,
    ChevronRight,
    ArrowRight,
    Smartphone,
    Globe,
    Shield,
    CheckCircle2,
    Sparkles,
    Play,
    MessageSquare,
    PieChart,
    Cpu,
    Network,
    Box,
    HardDrive,
    Layers,
    Code,
    Database,
    Cloud,
    Terminal,
    Braces
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { apiClient as api } from '../utils/apiClient'
import { getImageUrl } from '../utils/imageUtils'
import SectionErrorBoundary from '../components/common/SectionErrorBoundary'

// Home-specific components
import HeroSection from '../components/home/HeroSection'
import VisionSection from '../components/home/VisionSection'
import StatsSection from '../components/home/StatsSection'
import FeaturesSection from '../components/home/FeaturesSection'
import ServicesSection from '../components/home/ServicesSection'
import MentorsSection from '../components/home/MentorsSection'
import TestimonialsSection from '../components/home/TestimonialsSection'
import PartnersSection from '../components/home/PartnersSection'
import TechnologiesSection from '../components/home/TechnologiesSection'
import CTASection from '../components/home/CTASection'

const HomePage = () => {
    const navigate = useNavigate()
    const [statsData, setStatsData] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const { data } = await api.get('/stats')
                setStatsData(data)
            } catch (error) {
                console.error("Failed to fetch global stats:", error)
            } finally {
                setLoading(false)
            }
        }
        fetchStats()
    }, [])

    const stats = [
        {
            number: statsData?.students || '10,000+',
            label: 'Active Students',
            icon: Users,
            color: 'indigo'
        },
        {
            number: statsData?.courses || '50+',
            label: 'Industry Courses',
            icon: Zap,
            color: 'cyan'
        },
        {
            number: statsData?.placements || '95%',
            label: 'Placement Success',
            icon: Target,
            color: 'emerald'
        },
        {
            number: statsData?.partners || '200+',
            label: 'Hiring Partners',
            icon: Award,
            color: 'purple'
        }
    ]

    return (
        <>
            <section className="relative min-h-screen flex items-center bg-[#070b14] overflow-hidden pt-20">
                {/* Advanced Atmospheric Background */}
                <div className="absolute inset-0 pointer-events-none">
                    <motion.div
                        animate={{
                            x: [0, 80, 0],
                            y: [0, 40, 0],
                            scale: [1, 1.2, 1]
                        }}
                        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                        className="absolute -top-[10%] left-1/4 w-[600px] h-[600px] bg-indigo-600/20 rounded-full blur-[140px] animate-pulse"
                    />
                    <motion.div
                        animate={{
                            x: [0, -60, 0],
                            y: [0, 70, 0],
                            scale: [1, 1.3, 1]
                        }}
                        transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                        className="absolute -bottom-[10%] right-1/4 w-[600px] h-[600px] bg-cyan-500/10 rounded-full blur-[140px]"
                    />

                    {/* Technical Grid Overlay */}
                    <div className="absolute inset-0 opacity-[0.03] bg-[linear-gradient(#ffffff_1px,transparent_1px),linear-gradient(90deg,#ffffff_1px,transparent_1px)] bg-[length:40px_40px]" />
                </div>

                <div className="relative max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center z-10 w-full">
                    {/* Left: Content */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="inline-flex items-center space-x-2 mb-8 px-5 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md shadow-lg shadow-black/20"
                        >
                            <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-ping"></span>
                            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-300">Intelligent Learning Ecosystem</span>
                        </motion.div>

                        <h1 className="text-5xl md:text-7xl lg:text-8xl font-black mb-8 tracking-tighter uppercase font-display leading-[0.85] text-white">
                            ARCHITECTING <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-cyan-400">
                                TECHNICAL ELITE.
                            </span>
                        </h1>

                        <p className="text-sm md:text-lg max-w-xl mb-12 text-slate-400 leading-relaxed font-medium opacity-80">
                            MentriQ is not just a platform; it's a structural upgrade for your career.
                            Deploying industry-standard protocols, we build the workforce of <span className="text-white font-bold">2030</span>.
                        </p>

                        <div className="flex flex-wrap gap-5">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => navigate("/courses")}
                                className="px-10 py-5 bg-indigo-600 text-white font-black rounded-2xl shadow-2xl shadow-indigo-600/30 flex items-center gap-3 group uppercase tracking-widest text-sm"
                            >
                                Explore Modules
                                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </motion.button>

                            <motion.button
                                whileHover={{ scale: 1.05, background: 'rgba(255,255,255,0.05)' }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => navigate("/training")}
                                className="px-10 py-5 bg-white/5 backdrop-blur-md border border-white/10 text-white font-black rounded-2xl shadow-xl hover:border-white/20 transition-all uppercase tracking-widest text-sm"
                            >
                                Admissions
                            </motion.button>
                        </div>

                        {/* Social Verification */}
                        <div className="mt-16 pt-8 border-t border-white/5 flex items-center gap-8 opacity-40 grayscale hover:grayscale-0 transition-all">
                            <div className="flex -space-x-3">
                                {[1, 2, 3, 4].map((i) => (
                                    <div key={i} className="w-10 h-10 rounded-full border-2 border-[#070b14] bg-slate-800" />
                                ))}
                            </div>
                            <div className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                                Trusted by <span className="text-white">5,000+</span> Industry Professionals
                            </div>
                        </div>
                    </motion.div>

                    {/* Right: Abstract Technical Visualization */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 1 }}
                        className="relative hidden lg:block"
                    >
                        {/* Central Neural Core */}
                        <div className="relative w-[500px] h-[500px] mx-auto">
                            <motion.div
                                animate={{
                                    rotate: 360,
                                    scale: [1, 1.05, 1]
                                }}
                                transition={{
                                    rotate: { duration: 40, repeat: Infinity, ease: "linear" },
                                    scale: { duration: 5, repeat: Infinity, ease: "easeInOut" }
                                }}
                                className="absolute inset-0 rounded-[4rem] border-2 border-indigo-500/20 shadow-[0_0_80px_rgba(79,70,229,0.1)] overflow-hidden"
                            >
                                <div className="absolute inset-0 opacity-[0.05] bg-[radial-gradient(#6366f1_1px,transparent_1px)] bg-[length:16px_16px]" />
                                <img
                                    src="/images/Mentriqlogo.png"
                                    alt="Technical Core"
                                    className="w-full h-full object-contain p-12 opacity-80"
                                />
                            </motion.div>

                            {/* Orbiting Nodes */}
                            {[Zap, Cpu, Network, Box].map((Icon, idx) => (
                                <motion.div
                                    key={idx}
                                    animate={{
                                        rotate: [0, 360],
                                    }}
                                    transition={{
                                        duration: 20 + idx * 5,
                                        repeat: Infinity,
                                        ease: "linear"
                                    }}
                                    className="absolute inset-0 pointer-events-none"
                                >
                                    <motion.div
                                        animate={{ rotate: [0, -360] }}
                                        transition={{
                                            duration: 20 + idx * 5,
                                            repeat: Infinity,
                                            ease: "linear"
                                        }}
                                        style={{
                                            top: idx % 2 === 0 ? '-20px' : 'auto',
                                            bottom: idx % 2 !== 0 ? '-20px' : 'auto',
                                            left: '50%',
                                            transform: 'translateX(-50%)'
                                        }}
                                        className="absolute w-14 h-14 bg-[#0f172a] border border-white/10 rounded-2xl flex items-center justify-center text-indigo-400 shadow-2xl backdrop-blur-xl"
                                    >
                                        <Icon className="w-6 h-6" />
                                    </motion.div>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Vision Section */}
            <SectionErrorBoundary>
                <VisionSection />
            </SectionErrorBoundary>

            {/* Stats Section */}
            <SectionErrorBoundary>
                <StatsSection stats={stats} />
            </SectionErrorBoundary>

            {/* Features Section */}
            <SectionErrorBoundary>
                <FeaturesSection />
            </SectionErrorBoundary>

            {/* Services Section */}
            <SectionErrorBoundary>
                <ServicesSection />
            </SectionErrorBoundary>

            {/* Mentors Section */}
            <SectionErrorBoundary>
                <MentorsSection />
            </SectionErrorBoundary>

            {/* Testimonials Section */}
            <SectionErrorBoundary>
                <TestimonialsSection />
            </SectionErrorBoundary>

            {/* Partners Section */}
            <SectionErrorBoundary>
                <PartnersSection />
            </SectionErrorBoundary>

            {/* Technologies Section */}
            <SectionErrorBoundary>
                <TechnologiesSection />
            </SectionErrorBoundary>

            {/* CTA Section */}
            <section className="py-32 bg-white relative overflow-hidden">
                <div className="max-w-7xl mx-auto px-6 relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="bg-slate-900 rounded-[3rem] p-12 md:p-24 text-center relative overflow-hidden group"
                    >
                        {/* Geometric Background Accents */}
                        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-600/10 rounded-full blur-[100px] -mr-48 -mt-48 transition-transform group-hover:scale-110" />
                        <div className="absolute bottom-0 left-0 w-96 h-96 bg-cyan-600/10 rounded-full blur-[100px] -ml-48 -mb-48 transition-transform group-hover:scale-110" />

                        <motion.div className="relative z-10">
                            <motion.h2
                                initial={{ opacity: 0, scale: 0.95 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                className="text-4xl md:text-6xl font-black text-white mb-8 tracking-tighter uppercase leading-[0.9]"
                            >
                                READY TO INITIALIZE <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">
                                    YOUR DEPLOYMENT?
                                </span>
                            </motion.h2>

                            <motion.p
                                initial={{ opacity: 0 }}
                                whileInView={{ opacity: 1 }}
                                transition={{ delay: 0.2 }}
                                className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto mb-16 font-medium leading-relaxed"
                            >
                                Join the elite network of technical architects. Start your journey with MentriQ protocols and redefine your potential.
                            </motion.p>

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                                className="flex flex-col md:flex-row items-center justify-center gap-6"
                            >
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => navigate("/courses")}
                                    className="px-12 py-5 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white font-black rounded-2xl shadow-xl flex items-center gap-3 group/btn uppercase tracking-widest text-sm"
                                >
                                    Explore Courses
                                    <Sparkles className="w-5 h-5 group-hover/btn:rotate-12 transition-transform" />
                                </motion.button>

                                <motion.button
                                    whileHover={{ scale: 1.05, background: 'rgba(255,255,255,0.05)' }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => navigate('/contact')}
                                    className="px-12 py-5 bg-transparent backdrop-blur-md border-2 border-slate-700 text-slate-200 font-black rounded-2xl transition-all uppercase tracking-widest text-sm hover:border-white"
                                >
                                    Contact Us
                                </motion.button>
                            </motion.div>
                        </motion.div>

                        {/* Energy Surge Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/5 via-transparent to-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                    </motion.div>
                </div>
            </section>
        </>
    )
}

export default HomePage
