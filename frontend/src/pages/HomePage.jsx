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
            <section className="py-12 md:py-16 bg-[#f8f9fc] theme-dot-grid relative overflow-hidden">
                <div className="max-w-[1320px] mx-auto px-5 md:px-8 relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="relative rounded-[2.5rem] px-7 py-11 md:px-20 md:py-14 text-center overflow-hidden bg-gradient-to-br from-[#f8f9fc] via-[#f5f7fb] to-[#edf3f8] border border-slate-200/90 shadow-[0_22px_55px_-46px_rgba(15,23,42,0.4)]"
                    >
                        {/* Soft background glow */}
                        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-300/15 rounded-full blur-[100px] -mr-44 -mt-44" />
                        <div className="absolute bottom-0 left-0 w-96 h-96 bg-cyan-300/15 rounded-full blur-[100px] -ml-44 -mb-44" />

                        {/* Corner bracket decorations */}
                        <div className="absolute top-8 left-8 w-10 h-10 border-t-2 border-l-2 border-indigo-400/55 rounded-tl-lg" />
                        <div className="absolute bottom-8 right-8 w-10 h-10 border-b-2 border-r-2 border-cyan-400/55 rounded-br-lg" />

                        <div className="relative z-10">
                            {/* Phase badge */}
                            <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-indigo-50 border border-indigo-100 shadow-sm text-indigo-600 text-[11px] font-black uppercase tracking-[0.28em] mb-7">
                                <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
                                Phase: Launch
                            </div>

                            <h2 className="text-[3.4rem] md:text-[5.4rem] font-black text-slate-900 mb-5 tracking-[-0.04em] uppercase leading-[0.9]">
                                READY TO <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-cyan-500">
                                    DEPART?
                                </span>
                            </h2>

                            <p className="text-slate-500 text-[1.5rem] md:text-[1.9rem] max-w-[920px] mx-auto mb-10 font-medium leading-[1.45]">
                                Join <strong className="text-slate-800 underline underline-offset-2">thousands</strong> of students who have transformed their careers with MentriQ Technologies.
                            </p>

                            <div className="flex flex-col md:flex-row items-center justify-center gap-4">
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => navigate("/courses")}
                                    className="min-w-[320px] px-10 py-[1.125rem] bg-indigo-600 hover:bg-indigo-700 text-white font-black rounded-2xl shadow-lg shadow-indigo-200 flex items-center justify-center gap-3 group/btn uppercase tracking-widest text-[15px] transition-colors"
                                >
                                    Explore Courses
                                    <Sparkles className="w-5 h-5 group-hover/btn:rotate-12 transition-transform" />
                                </motion.button>

                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => navigate('/contact')}
                                    className="min-w-[240px] px-10 py-[1.125rem] bg-white border border-slate-300 text-slate-800 font-black rounded-2xl shadow-sm hover:border-indigo-300 hover:shadow-indigo-100 transition-all uppercase tracking-widest text-[15px]"
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
