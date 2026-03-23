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
            <section className="relative min-h-screen flex items-center bg-slate-50 overflow-hidden pt-20">
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
                            className="inline-flex items-center space-x-2 mb-8 px-5 py-2 rounded-full bg-slate-100 border border-slate-200 backdrop-blur-md shadow-lg shadow-black/20"
                        >
                            <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-ping"></span>
                            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-300">Intelligent Learning Ecosystem</span>
                        </motion.div>

                        <h1 className="text-5xl md:text-7xl lg:text-8xl font-black mb-8 tracking-tighter uppercase font-display leading-[0.85] text-slate-900">
                            ARCHITECTING <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-cyan-400">
                                TECHNICAL ELITE.
                            </span>
                        </h1>

                        <p className="text-sm md:text-lg max-w-xl mb-12 text-slate-600 leading-relaxed font-medium opacity-80">
                            MentriQ is not just a platform; it's a structural upgrade for your career.
                            Deploying industry-standard protocols, we build the workforce of <span className="text-slate-900 font-bold">2030</span>.
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
                                className="px-10 py-5 bg-slate-100 backdrop-blur-md border border-slate-200 text-slate-900 font-black rounded-2xl shadow-xl hover:border-slate-300 transition-all uppercase tracking-widest text-sm"
                            >
                                Admissions
                            </motion.button>
                        </div>

                        {/* Social Verification */}
                        <div className="mt-16 pt-8 border-t border-slate-100 flex items-center gap-8 opacity-40 hover:opacity-100 transition-all">
                            <div className="text-[10px] font-black uppercase tracking-widest text-slate-600">
                                Trusted by <span className="text-slate-900">{statsData?.students || '16,000+'}</span> Industry Professionals
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
                        <div className="relative w-full h-[600px] flex items-center justify-center mt-10 lg:mt-0">
                            {/* Glow Effects behind the robot */}
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[450px] h-[450px] bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none" />
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] bg-cyan-400/10 rounded-full blur-[80px] pointer-events-none" />

                            {/* 3D Revolving Globe Component */}
                            <div className="relative z-20 w-full h-full flex items-center justify-center p-8">
                                <Suspense fallback={
                                    <div className="w-[400px] h-[400px] rounded-full border border-indigo-500/20 animate-pulse bg-white/5" />
                                }>
                                    <GlobeElement />
                                </Suspense>
                            </div>
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
