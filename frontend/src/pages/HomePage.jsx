import React, { Suspense, lazy } from 'react'
import { motion } from 'framer-motion'
import { Sparkles } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import SectionErrorBoundary from '../components/common/SectionErrorBoundary'
import DeferredSection from '../components/common/DeferredSection'
import { useSiteData } from '../context/SiteContext'

// Home-specific components
const ServicesSection = lazy(() => import('../components/home/ServicesSection'))
const MentorsSection = lazy(() => import('../components/home/MentorsSection'))
const CitySection = lazy(() => import('../components/home/CitySection'))
const BeyondTradition = lazy(() => import('../components/home/BeyondTradition'))
const PartnersSection = lazy(() => import('../components/home/PartnersSection'))
const TechnologiesSection = lazy(() => import('../components/home/TechnologiesSection'))
const MissionAndImpact = lazy(() => import('../components/home/MissionAndImpact'))
const StudentImpact = lazy(() => import('../components/home/StudentImpact'))
const Hero3DElement = lazy(() => import('../components/home/Hero3DElement'))

const SectionPlaceholder = ({ minHeight }) => (
    <div
        className="w-full rounded-[2rem] bg-transparent"
        style={{ minHeight }}
        aria-hidden="true"
    />
)

const HomePage = () => {
    const navigate = useNavigate()
    const { stats: statsData } = useSiteData()

    return (
        <div className="bg-transparent">
            <Suspense fallback={<SectionPlaceholder minHeight="90vh" />}>
                <Hero3DElement statsData={statsData} />
            </Suspense>

            {/* Mission & Impact Section */}
            <DeferredSection minHeight="600px">
                <Suspense fallback={<SectionPlaceholder minHeight="600px" />}>
                    <SectionErrorBoundary>
                        <MissionAndImpact />
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

            {/* Mentors Section — "Learn from the Best" */}
            <DeferredSection minHeight="520px">
                <Suspense fallback={<SectionPlaceholder minHeight="520px" />}>
                    <SectionErrorBoundary>
                        <MentorsSection />
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

            {/* Cities Section */}
            <DeferredSection minHeight="480px">
                <Suspense fallback={<SectionPlaceholder minHeight="480px" />}>
                    <SectionErrorBoundary>
                        <CitySection />
                    </SectionErrorBoundary>
                </Suspense>
            </DeferredSection>

            {/* Beyond Tradition Section */}
            <DeferredSection minHeight="560px">
                <Suspense fallback={<SectionPlaceholder minHeight="560px" />}>
                    <SectionErrorBoundary>
                        <BeyondTradition />
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
        </div>
    )
}

export default HomePage
