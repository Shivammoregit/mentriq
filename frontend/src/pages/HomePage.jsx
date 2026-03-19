import React, { Suspense, lazy, useEffect, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import {
    Zap,
    ChevronRight,
    Sparkles,
    Cpu,
    Network,
    Box,
    UserRound,
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { apiClient as api } from '../utils/apiClient'
import SectionErrorBoundary from '../components/common/SectionErrorBoundary'
import DeferredSection from '../components/common/DeferredSection'

// Home-specific components
const ServicesSection = lazy(() => import('../components/home/ServicesSection'))
const MentorsSection = lazy(() => import('../components/home/MentorsSection'))
const PartnersSection = lazy(() => import('../components/home/PartnersSection'))
const TechnologiesSection = lazy(() => import('../components/home/TechnologiesSection'))

const trustedAvatars = [
    '/images/aditya.jpg',
    '/images/anushka.jpg',
    '/images/amit.jpg',
    '/images/vaibhav.jpg',
]

const SectionPlaceholder = ({ minHeight }) => (
    <div
        className="w-full rounded-[2rem] bg-transparent"
        style={{ minHeight }}
        aria-hidden="true"
    />
)

const HomePage = () => {
    const navigate = useNavigate()
    const [statsData, setStatsData] = useState(null)
    const reduceMotion = useReducedMotion()

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const { data } = await api.get('/stats')
                setStatsData(data)
            } catch (error) {
                console.error("Failed to fetch global stats:", error)
            }
        }
        fetchStats()
    }, [])

    return (
        <>
            <section className="relative min-h-screen flex items-center bg-[#070b14] overflow-hidden pt-20">
                {/* Advanced Atmospheric Background */}
                <div className="absolute inset-0 pointer-events-none">
                    <motion.div
                        animate={reduceMotion ? undefined : {
                            x: [0, 80, 0],
                            y: [0, 40, 0],
                            scale: [1, 1.2, 1]
                        }}
                        transition={reduceMotion ? undefined : { duration: 20, repeat: Infinity, ease: "linear" }}
                        className="absolute -top-[10%] left-1/4 w-[600px] h-[600px] bg-indigo-600/20 rounded-full blur-[140px] animate-pulse"
                    />
                    <motion.div
                        animate={reduceMotion ? undefined : {
                            x: [0, -60, 0],
                            y: [0, 70, 0],
                            scale: [1, 1.3, 1]
                        }}
                        transition={reduceMotion ? undefined : { duration: 25, repeat: Infinity, ease: "linear" }}
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
                                {trustedAvatars.map((avatar, i) => (
                                    <div key={avatar} className="h-10 w-10 overflow-hidden rounded-full border-2 border-[#070b14] bg-slate-800 shadow-lg shadow-black/30">
                                        <img
                                            src={avatar}
                                            alt={`MentriQ professional ${i + 1}`}
                                            className="h-full w-full object-cover"
                                            onError={(e) => {
                                                e.currentTarget.src = '/images/user.png'
                                            }}
                                        />
                                    </div>
                                ))}
                            </div>
                            <div className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                                Trusted by <span className="text-white">{statsData?.students || '5,000+'}</span> Industry Professionals
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
                        {/* Central Mascot Core */}
                        <div className="relative w-[500px] h-[500px] mx-auto">
                            <div className="absolute inset-0 rounded-[4rem] border-2 border-indigo-500/20 shadow-[0_0_80px_rgba(79,70,229,0.1)] overflow-hidden">
                                <div className="absolute inset-0 opacity-[0.05] bg-[radial-gradient(#6366f1_1px,transparent_1px)] bg-[length:16px_16px]" />
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="relative flex h-52 w-52 items-center justify-center rounded-full border border-cyan-400/20 bg-slate-950/70 shadow-[0_0_60px_rgba(34,211,238,0.12)] backdrop-blur-xl">
                                        <div className="absolute inset-3 rounded-full border border-indigo-400/20 bg-gradient-to-br from-indigo-500/10 to-cyan-500/10" />
                                        <img
                                            src="/images/user.png"
                                            alt="MentriQ Human Mascot"
                                            loading="eager"
                                            fetchPriority="high"
                                            className="relative z-10 h-36 w-36 object-contain opacity-95 drop-shadow-[0_0_28px_rgba(103,232,249,0.3)]"
                                            onError={(e) => {
                                                e.currentTarget.style.display = 'none'
                                            }}
                                        />
                                        <UserRound className="absolute z-0 h-28 w-28 text-cyan-300/30" />
                                    </div>
                                </div>
                            </div>

                            {/* Orbiting Nodes */}
                            <motion.div
                                animate={reduceMotion ? undefined : { rotate: 360 }}
                                transition={reduceMotion ? undefined : {
                                    duration: 24,
                                    repeat: Infinity,
                                    ease: "linear"
                                }}
                                className="absolute inset-0 pointer-events-none"
                            >
                                {[Zap, Cpu, Network, Box].map((Icon, idx) => {
                                    const angle = idx * 90

                                    return (
                                        <div
                                            key={idx}
                                            className="absolute left-1/2 top-1/2"
                                            style={{
                                                transform: `rotate(${angle}deg) translateY(-230px)`
                                            }}
                                        >
                                            <motion.div
                                                animate={reduceMotion ? undefined : { rotate: -360 }}
                                                transition={reduceMotion ? undefined : {
                                                    duration: 24,
                                                    repeat: Infinity,
                                                    ease: "linear"
                                                }}
                                                className="flex h-14 w-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-2xl border border-white/10 bg-[#0f172a] text-indigo-400 shadow-2xl backdrop-blur-xl"
                                            >
                                                <Icon className="h-6 w-6" />
                                            </motion.div>
                                        </div>
                                    )
                                })}
                            </motion.div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Services Section */}
            <DeferredSection minHeight="420px">
                <Suspense fallback={<SectionPlaceholder minHeight="420px" />}>
                    <SectionErrorBoundary>
                        <ServicesSection />
                    </SectionErrorBoundary>
                </Suspense>
            </DeferredSection>

            {/* Mentors Section */}
            <DeferredSection minHeight="520px">
                <Suspense fallback={<SectionPlaceholder minHeight="520px" />}>
                    <SectionErrorBoundary>
                        <MentorsSection />
                    </SectionErrorBoundary>
                </Suspense>
            </DeferredSection>

            {/* Partners Section */}
            <DeferredSection minHeight="360px">
                <Suspense fallback={<SectionPlaceholder minHeight="360px" />}>
                    <SectionErrorBoundary>
                        <PartnersSection />
                    </SectionErrorBoundary>
                </Suspense>
            </DeferredSection>

            {/* Technologies Section */}
            <DeferredSection minHeight="380px">
                <Suspense fallback={<SectionPlaceholder minHeight="380px" />}>
                    <SectionErrorBoundary>
                        <TechnologiesSection />
                    </SectionErrorBoundary>
                </Suspense>
            </DeferredSection>

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

                        <div className="relative z-10">
                            <h2 className="text-4xl md:text-6xl font-black text-white mb-8 tracking-tighter uppercase leading-[0.9]">
                                READY TO INITIALIZE <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">
                                    YOUR DEPLOYMENT?
                                </span>
                            </h2>

                            <p className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto mb-16 font-medium leading-relaxed">
                                Join the elite network of technical architects. Start your journey with MentriQ protocols and redefine your potential.
                            </p>

                            <div className="flex flex-col md:flex-row items-center justify-center gap-6">
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
                            </div>
                        </div>

                        {/* Energy Surge Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/5 via-transparent to-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                    </motion.div>
                </div>
            </section>
        </>
    )
}

export default HomePage
