import React from 'react';
import { motion } from 'framer-motion';
import {
    Sparkles,
    Code,
    GraduationCap,
    Headphones,
    Target,
    Briefcase,
    Zap,
    FileCheck
} from 'lucide-react';

const features = [
    {
        title: 'Live Interactive Classes',
        desc: 'Engage in real-time learning sessions with industry-leading experts',
        icon: Sparkles,
        color: 'bg-blue-500'
    },
    {
        title: 'Hands-on Projects',
        desc: 'Build production-grade projects that showcase your expertise',
        icon: Code,
        color: 'bg-indigo-500'
    },
    {
        title: 'Career Certification',
        desc: 'Earn industry-recognized credentials with placement assistance',
        icon: GraduationCap,
        color: 'bg-purple-500'
    },
    {
        title: '24/7 Expert Support',
        desc: 'Access dedicated mentorship and doubt resolution anytime',
        icon: Headphones,
        color: 'bg-cyan-600'
    },
    {
        title: 'Industry Curriculum',
        desc: 'Master in demand skills aligned with market requirements',
        icon: Target,
        color: 'bg-emerald-600'
    },
    {
        title: 'Career Mentorship',
        desc: 'Receive personalized guidance for accelerated growth',
        icon: Briefcase,
        color: 'bg-orange-500'
    },
    {
        title: 'Live Coding Labs',
        desc: 'Practice through interactive coding challenges and workshops',
        icon: Zap,
        color: 'bg-pink-500'
    },
    {
        title: 'Assignment Reviews',
        desc: 'Get detailed feedback with comprehensive solution analysis',
        icon: FileCheck,
        color: 'bg-rose-500'
    }
];

const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } }
};

const BeyondTradition = () => {
    return (
        <section className="py-24 bg-[#0f172a] relative overflow-hidden">
            {/* Background Decorative Blur */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none" />

            <div className="max-w-7xl mx-auto px-6 relative z-10">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <motion.h2 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-4xl md:text-5xl font-black mb-6 uppercase tracking-tighter"
                    >
                        <span className="text-white">BEYOND </span>
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">TRADITION.</span>
                    </motion.h2>
                    <motion.p 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-slate-400 text-lg md:text-xl font-medium leading-relaxed"
                    >
                        We provide a high-frequency learning environment designed for maximum skill retention and career acceleration.
                    </motion.p>
                </div>

                <motion.div 
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: '-50px' }}
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
                >
                    {features.map((feature, idx) => (
                        <motion.div 
                            key={idx}
                            variants={itemVariants}
                            whileHover={{ y: -8, transition: { duration: 0.2 } }}
                            className="bg-[#1e293b] border border-slate-700/50 rounded-2xl p-8 hover:shadow-2xl hover:shadow-indigo-500/10 transition-shadow flex flex-col items-start text-left"
                        >
                            <div className={`w-14 h-14 rounded-[14px] flex items-center justify-center text-white mb-6 ${feature.color}`}>
                                <feature.icon size={26} strokeWidth={2.5} />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-3">
                                {feature.title}
                            </h3>
                            <p className="text-slate-400 text-sm leading-relaxed">
                                {feature.desc}
                            </p>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
};

export default BeyondTradition;
