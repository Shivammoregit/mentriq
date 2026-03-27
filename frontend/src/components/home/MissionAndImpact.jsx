import React from 'react';
import { motion } from 'framer-motion';
import { Target, Users, BookOpen, TrendingUp, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { useSiteData } from '../../context/SiteContext';

const MissionAndImpact = () => {
    const missionImage = "/images/mission-students.jpg";
    const missionFallbackImage = "/images/learning4.jpg";
    const { stats } = useSiteData();
    const impactData = {
        studentsCount: stats?.students || "16K+",
        coursesCount: stats?.courses || "50+",
        placementRate: stats?.placements || "98%",
        expertTrainersCount: stats?.trainers || "60+"
    };
    const impactLoading = !stats;

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1, delayChildren: 0.1 }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
    };

    return (
        <section className="relative py-24 bg-slate-50 overflow-hidden">
            {/* Background elements */}
            <div className="absolute top-0 right-0 w-1/3 h-[500px] bg-indigo-50/50 blur-[100px] rounded-full pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-1/2 h-[400px] bg-cyan-50/50 blur-[100px] rounded-full pointer-events-none" />

            <div className="max-w-7xl mx-auto px-6 lg:px-16 space-y-32">

                {/* --- OUR MISSION SECTION --- */}
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                    variants={containerVariants}
                    className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center"
                >
                    {/* Left: Image with floating card */}
                    <div className="relative z-10">
                        {/* Blob behind image */}
                        <div className="absolute inset-0 bg-slate-100 rounded-[2.5rem] transform -rotate-3 scale-[1.02] -z-10 transition-transform hover:rotate-0 duration-500" />

                        <div className="relative rounded-[2.5rem] overflow-hidden shadow-2xl aspect-[4/3] bg-slate-200">
                            {/* Grayscale overlay effect similar to reference image */}
                            <div className="absolute inset-0 bg-slate-900/10 mix-blend-multiply z-10" />
                            <img
                                src={missionImage}
                                alt="Students collaborating"
                                className="w-full h-full object-cover grayscale-[30%] hover:grayscale-0 transition-all duration-700 hover:scale-105"
                                onError={(e) => {
                                    e.currentTarget.onerror = null;
                                    e.currentTarget.src = missionFallbackImage;
                                }}
                            />

                            {/* Floating Card */}
                            <motion.div
                                initial={{ opacity: 0, y: 30, x: 20 }}
                                whileInView={{ opacity: 1, y: 0, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.3, duration: 0.6 }}
                                className="absolute bottom-6 right-6 lg:-right-8 bg-white p-6 rounded-2xl shadow-xl z-20 max-w-[200px] border border-slate-100"
                            >
                                <div className="text-indigo-600 mb-2">
                                    <TrendingUp strokeWidth={2.5} size={24} />
                                </div>
                                {impactLoading ? (
                                    <div className="h-9 w-16 bg-slate-200 rounded-lg animate-pulse mb-1"></div>
                                ) : (
                                    <h4 className="text-3xl font-black text-slate-900 mb-1 tracking-tighter">{impactData?.placementRate || "98%"}</h4>
                                )}
                                <p className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-500 leading-tight">Career Placement Success Rate</p>
                            </motion.div>
                        </div>
                    </div>

                    {/* Right: Content */}
                    <div className="relative z-10">
                        <motion.div variants={itemVariants} className="mb-4">
                            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-600">Our Mission</span>
                        </motion.div>

                        <motion.h2
                            variants={itemVariants}
                            className="text-4xl md:text-5xl lg:text-[54px] font-black tracking-tighter uppercase font-display leading-[0.9] mb-6 text-slate-900"
                        >
                            Deploying the Next <br className="hidden lg:block" /> Generation of AI <br />
                            <span className="text-indigo-600">Architects.</span>
                        </motion.h2>

                        <motion.p
                            variants={itemVariants}
                            className="text-slate-600 text-lg leading-relaxed font-semibold mb-10 max-w-xl"
                        >
                            At MentriQ, we don't just teach technology; we engineer careers. Our methodology is built on three pillars of excellence: real-world proximity, algorithmic rigor, and global standard certification.
                        </motion.p>

                        <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {/* Mini Card 1 */}
                            <div className="p-5 rounded-2xl bg-white border border-slate-100 hover:border-indigo-100 hover:shadow-lg transition-all group">
                                <CheckCircle2 size={20} className="text-indigo-500 mb-3 group-hover:scale-110 transition-transform" />
                                <h5 className="text-[11px] font-black uppercase tracking-[0.15em] text-slate-900 mb-1">Project First</h5>
                                <p className="text-[10px] text-slate-500 font-medium">Build 10+ industry projects.</p>
                            </div>
                            {/* Mini Card 2 */}
                            <div className="p-5 rounded-2xl bg-white border border-slate-100 hover:border-indigo-100 hover:shadow-lg transition-all group">
                                <ShieldCheck size={20} className="text-indigo-500 mb-3 group-hover:scale-110 transition-transform" />
                                <h5 className="text-[11px] font-black uppercase tracking-[0.15em] text-slate-900 mb-1">Elite Network</h5>
                                <p className="text-[10px] text-slate-500 font-medium">Connect with 60+ partners.</p>
                            </div>
                        </motion.div>
                    </div>
                </motion.div>

                {/* --- THE IMPACT SECTION --- */}
                <div className="relative z-10">
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-100px" }}
                        variants={containerVariants}
                        className="text-center mb-16"
                    >
                        <motion.h3 variants={itemVariants} className="text-4xl md:text-6xl font-black tracking-tighter uppercase font-display text-slate-900 mb-3">
                            The Impact
                        </motion.h3>
                        <motion.p variants={itemVariants} className="text-base md:text-xl font-semibold text-slate-500">
                            Join the ranks of high-performance professionals scaling global industries.
                        </motion.p>
                    </motion.div>

                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-100px" }}
                        variants={containerVariants}
                        className="grid grid-cols-2 lg:grid-cols-4 gap-6"
                    >
                        {[
                            { title: "Students Trained", value: impactData?.studentsCount || "16K+", icon: Users, accent: "from-indigo-500 to-indigo-600" },
                            { title: "Live Courses", value: impactData?.coursesCount || "50+", icon: BookOpen, accent: "from-cyan-500 to-blue-500" },
                            { title: "Placement Rate", value: impactData?.placementRate || "98%", icon: Target, accent: "from-purple-500 to-pink-500" },
                            { title: "Expert Trainers", value: impactData?.expertTrainersCount || "60+", icon: ShieldCheck, accent: "from-emerald-500 to-cyan-500" }
                        ].map((stat, idx) => (
                            <motion.div
                                key={idx}
                                variants={itemVariants}
                                whileHover={{ y: -5 }}
                                className="bg-white rounded-[2.5rem] p-8 text-center border border-slate-200 shadow-[0_14px_28px_-24px_rgba(15,23,42,0.4)] hover:shadow-[0_18px_34px_-24px_rgba(30,41,59,0.35)] transition-all duration-300 flex flex-col items-center justify-center"
                            >
                                <div className={`w-16 h-16 rounded-[1.3rem] bg-gradient-to-br ${stat.accent} flex items-center justify-center text-white mb-5 shadow-xl`}>
                                    <stat.icon size={24} />
                                </div>
                                {impactLoading ? (
                                    <div className="h-10 w-24 bg-slate-200 rounded-lg animate-pulse mb-1"></div>
                                ) : (
                                    <h4 className="text-4xl font-black text-slate-900 tracking-tighter mb-1">
                                        {stat.value}
                                    </h4>
                                )}
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                                    {stat.title}
                                </p>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default MissionAndImpact;
