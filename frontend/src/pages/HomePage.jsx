import React, { Suspense, lazy, useEffect, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import {
    ChevronRight,
    Sparkles,
    Twitter,
    Linkedin,
    Instagram,
    Mail,
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { apiClient as api } from '../utils/apiClient'
import SectionErrorBoundary from '../components/common/SectionErrorBoundary'
import DeferredSection from '../components/common/DeferredSection'

// Home-specific components
const ServicesSection = lazy(() => import('../components/home/ServicesSection'))
const MentorsSection = lazy(() => import('../components/home/MentorsSection'))
const CitySection = lazy(() => import('../components/home/CitySection'))
const PartnersSection = lazy(() => import('../components/home/PartnersSection'))
const TechnologiesSection = lazy(() => import('../components/home/TechnologiesSection'))
const GlobeElement = lazy(() => import('../components/home/GlobeElement'))
const MissionAndImpact = lazy(() => import('../components/home/MissionAndImpact'))
const StudentImpact = lazy(() => import('../components/home/StudentImpact'))

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
            <section className="relative min-h-screen flex items-center overflow-hidden pt-20" style={{ background: 'linear-gradient(135deg, #f0f4ff 0%, #e8ecff 30%, #f5f0ff 60%, #eef2ff 100%)' }}>
                {/* Background blobs */}
                <div className="absolute inset-0 pointer-events-none overflow-hidden">
                    <motion.div
                        animate={reduceMotion ? undefined : { x: [0, 80, 0], y: [0, 40, 0], scale: [1, 1.2, 1] }}
                        transition={reduceMotion ? undefined : { duration: 20, repeat: Infinity, ease: "linear" }}
                        className="absolute -top-[10%] -left-[5%] w-[700px] h-[700px] rounded-full"
                        style={{ background: 'radial-gradient(circle, rgba(99,102,241,0.18) 0%, transparent 70%)' }}
                    />
                    <motion.div
                        animate={reduceMotion ? undefined : { x: [0, -60, 0], y: [0, 70, 0], scale: [1, 1.3, 1] }}
                        transition={reduceMotion ? undefined : { duration: 25, repeat: Infinity, ease: "linear" }}
                        className="absolute -bottom-[10%] right-[10%] w-[600px] h-[600px] rounded-full"
                        style={{ background: 'radial-gradient(circle, rgba(34,211,238,0.12) 0%, transparent 70%)' }}
                    />
                    <motion.div
                        animate={reduceMotion ? undefined : { x: [0, 50, 0], y: [0, -30, 0] }}
                        transition={reduceMotion ? undefined : { duration: 18, repeat: Infinity, ease: "linear" }}
                        className="absolute top-[20%] right-[5%] w-[400px] h-[400px] rounded-full"
                        style={{ background: 'radial-gradient(circle, rgba(139,92,246,0.1) 0%, transparent 70%)' }}
                    />
                </div>

                <div className="relative max-w-7xl mx-auto px-6 lg:px-16 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center z-10 w-full py-16">
                    {/* Left: Content */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        {/* Badge */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="inline-flex items-center gap-2.5 mb-8 px-5 py-2.5 rounded-full bg-white/80 border border-white/60 backdrop-blur-md shadow-sm"
                        >
                            <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
                            <span className="text-[10px] font-black uppercase tracking-[0.25em] text-indigo-600">The Future of Intelligence</span>
                        </motion.div>

                        {/* Headline */}
                        <motion.h1
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2, duration: 0.8 }}
                            className="text-6xl md:text-7xl lg:text-8xl font-black tracking-tighter uppercase font-display leading-[0.9] mb-8"
                            style={{ color: '#0f172a' }}
                        >
                            REWIRE YOUR
                            <br />
                            <span style={{ background: 'linear-gradient(90deg, #4f46e5, #7c3aed, #06b6d4)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                                POTENTIAL.
                            </span>
                        </motion.h1>

                        {/* Subtext */}
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                            className="text-base md:text-lg max-w-lg mb-12 leading-relaxed font-medium"
                            style={{ color: '#475569' }}
                        >
                            MentriQ is where precision meets innovation. Master the core of
                            modern technology with industry-first curriculums and elite mentorship.
                        </motion.p>

                        {/* CTAs */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.55 }}
                            className="flex flex-wrap gap-4"
                        >
                            <motion.button
                                whileHover={{ scale: 1.04 }}
                                whileTap={{ scale: 0.97 }}
                                onClick={() => navigate("/courses")}
                                className="px-10 py-5 rounded-2xl font-black flex items-center gap-3 uppercase tracking-widest text-sm text-white shadow-xl"
                                style={{ background: 'linear-gradient(135deg, #4f46e5, #6d28d9)', boxShadow: '0 8px 32px rgba(79,70,229,0.35)' }}
                            >
                                Start Learning
                                <ChevronRight className="w-5 h-5 transition-transform" />
                            </motion.button>

                            <motion.button
                                whileHover={{ scale: 1.04 }}
                                whileTap={{ scale: 0.97 }}
                                onClick={() => navigate("/training")}
                                className="px-10 py-5 rounded-2xl font-black uppercase tracking-widest text-sm border transition-all"
                                style={{ color: '#1e293b', background: 'rgba(255,255,255,0.8)', borderColor: 'rgba(148,163,184,0.4)', backdropFilter: 'blur(12px)' }}
                            >
                                Get a Consultation
                            </motion.button>
                        </motion.div>

                        {/* Social proof */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.8 }}
                            className="mt-14 pt-8 flex items-center gap-8"
                            style={{ borderTop: '1px solid rgba(148,163,184,0.2)' }}
                        >
                            <div className="text-[10px] font-black uppercase tracking-widest" style={{ color: '#64748b' }}>
                                Trusted by <span style={{ color: '#1e293b' }}>{statsData?.students || '16,000+'}</span> industry professionals
                            </div>
                        </motion.div>
                    </motion.div>

                    {/* Right: Globe */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.85 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 1.1 }}
                        className="relative hidden lg:flex items-center justify-center"
                    >
                        <div className="relative w-full h-[600px] flex items-center justify-center">
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[480px] h-[480px] rounded-full pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(99,102,241,0.12) 0%, transparent 70%)' }} />
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[360px] h-[360px] rounded-full pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(34,211,238,0.08) 0%, transparent 70%)' }} />
                            <div className="relative z-20 w-full h-full flex items-center justify-center p-8">
                                <Suspense fallback={<div className="w-[400px] h-[400px] rounded-full border border-indigo-300/30 animate-pulse" />}>
                                    <GlobeElement />
                                </Suspense>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Mission & Impact Section */}
            <DeferredSection minHeight="600px">
                <Suspense fallback={<SectionPlaceholder minHeight="600px" />}>
                    <SectionErrorBoundary>
                        <MissionAndImpact />
                    </SectionErrorBoundary>
                </Suspense>
            </DeferredSection>

            {/* Student Impact / Testimonials */}
            <DeferredSection minHeight="480px">
                <Suspense fallback={<SectionPlaceholder minHeight="480px" />}>
                    <SectionErrorBoundary>
                        <StudentImpact />
                    </SectionErrorBoundary>
                </Suspense>
            </DeferredSection>

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

            {/* Cities Section */}
            <DeferredSection minHeight="480px">
                <Suspense fallback={<SectionPlaceholder minHeight="480px" />}>
                    <SectionErrorBoundary>
                        <CitySection />
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
            <section className="py-32 bg-slate-50 relative overflow-hidden">
                <div className="max-w-7xl mx-auto px-6 relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="relative rounded-[3rem] p-12 md:p-24 text-center overflow-hidden bg-gradient-to-br from-white via-slate-50 to-indigo-50/60 border border-slate-200 shadow-xl shadow-indigo-100/40 group"
                    >
                        {/* Soft background glow */}
                        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-400/10 rounded-full blur-[100px] -mr-48 -mt-48 transition-transform group-hover:scale-110" />
                        <div className="absolute bottom-0 left-0 w-96 h-96 bg-cyan-400/10 rounded-full blur-[100px] -ml-48 -mb-48 transition-transform group-hover:scale-110" />

                        {/* Corner bracket decorations */}
                        <div className="absolute top-6 left-6 w-8 h-8 border-t-2 border-l-2 border-indigo-400/50 rounded-tl-lg" />
                        <div className="absolute bottom-6 right-6 w-8 h-8 border-b-2 border-r-2 border-cyan-400/50 rounded-br-lg" />

                        <div className="relative z-10">
                            {/* Phase badge */}
                            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-slate-200 shadow-sm text-slate-600 text-[10px] font-black uppercase tracking-[0.25em] mb-8">
                                <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
                                Phase: Launch
                            </div>

                            <h2 className="text-4xl md:text-6xl font-black text-slate-900 mb-6 tracking-tighter uppercase leading-[0.9]">
                                READY TO INITIALIZE <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-cyan-500">
                                    YOUR DEPLOYMENT?
                                </span>
                            </h2>

                            <p className="text-slate-500 text-lg md:text-xl max-w-2xl mx-auto mb-14 font-medium leading-relaxed">
                                Join <strong className="text-slate-800 underline underline-offset-2">thousands</strong> of students who have transformed their careers with MentriQ Technologies.
                            </p>

                            <div className="flex flex-col md:flex-row items-center justify-center gap-5">
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => navigate("/courses")}
                                    className="px-12 py-5 bg-indigo-600 hover:bg-indigo-700 text-white font-black rounded-2xl shadow-lg shadow-indigo-200 flex items-center gap-3 group/btn uppercase tracking-widest text-sm transition-colors"
                                >
                                    Explore Courses
                                    <Sparkles className="w-5 h-5 group-hover/btn:rotate-12 transition-transform" />
                                </motion.button>

                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => navigate('/contact')}
                                    className="px-12 py-5 bg-white border border-slate-300 text-slate-800 font-black rounded-2xl shadow-sm hover:border-indigo-300 hover:shadow-indigo-100 transition-all uppercase tracking-widest text-sm"
                                >
                                    Contact Us
                                </motion.button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>
        </>
    )
}

export default HomePage
