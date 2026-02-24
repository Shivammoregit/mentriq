import { motion, useScroll, useSpring, useTransform } from 'framer-motion'
import React, { useRef, useState, useEffect } from 'react'
import { Users, BookOpen, GraduationCap, TrendingUp } from 'lucide-react'
import { apiClient as api } from '../utils/apiClient'

const AboutPage = () => {
  const containerRef = useRef(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  })

  const pathLength = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  })

  const scaleY = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  })
  const [timeline, setTimeline] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchJourney = async () => {
      try {
        const { data } = await api.get('/journey');
        if (data && data.length > 0) {
          // Map backend fields to frontend expected fields
          const formatted = data.map(m => ({
            year: m.year,
            title: m.title,
            desc: m.description
          }));
          setTimeline(formatted);
        } else {
          setTimeline([]);
        }
      } catch (error) {
        console.error("Failed to fetch journey milestones:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchJourney();
  }, []);

  const [statsData, setStatsData] = useState(null)

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

  const stats = [
    { number: statsData?.students || '0', icon: GraduationCap, label: 'Students Trained', color: 'from-indigo-500 to-indigo-600' },
    { number: statsData?.courses || '0', icon: BookOpen, label: 'Live Courses', color: 'from-cyan-500 to-cyan-600' },
    { number: statsData?.placements || '0%', icon: TrendingUp, label: 'Placement Rate', color: 'from-purple-500 to-purple-600' },
    { number: statsData?.trainers || '0', icon: Users, label: 'Expert Trainers', color: 'from-blue-500 to-blue-600' }
  ]

  return (
    <div className="min-h-screen pt-0 bg-white selection:bg-indigo-500/30 overflow-hidden">
      {/* Premium Dark Hero Section */}
      <section className="relative min-h-[45vh] flex items-center bg-[#070b14] text-white overflow-hidden pt-24 pb-12">
        {/* Advanced Atmospheric Animations for Dark */}
        <div className="absolute inset-0 pointer-events-none">
          <motion.div
            animate={{
              x: [0, 80, 0],
              y: [0, 40, 0],
              scale: [1, 1.2, 1]
            }}
            transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
            className="absolute -top-[10%] left-1/4 w-[600px] h-[600px] bg-indigo-600/20 rounded-full blur-[140px] animate-pulse"
          />
          <motion.div
            animate={{
              x: [0, -60, 0],
              y: [0, 70, 0],
              scale: [1, 1.3, 1]
            }}
            transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
            className="absolute -bottom-[10%] right-1/4 w-[600px] h-[600px] bg-cyan-500/10 rounded-full blur-[140px]"
          />
          {/* High-Contrast Technical Grid */}
          <div className="absolute inset-0 opacity-[0.03] bg-[linear-gradient(#ffffff_1px,transparent_1px),linear-gradient(90deg,#ffffff_1px,transparent_1px)] bg-[length:40px_40px]" />
        </div>

        <div className="relative max-w-7xl mx-auto px-6 text-center z-10">

          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="inline-flex items-center space-x-2 mb-8 px-5 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md shadow-lg shadow-black/20"
          >
            <span className="w-1.5 h-1.5 bg-cyan-500 rounded-full animate-ping"></span>
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-cyan-300">Global Talent Architecture</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "circOut" }}
            className="text-4xl md:text-6xl lg:text-7xl font-black mb-6 tracking-tighter uppercase font-display leading-[0.9] text-white"
          >
            DEFINING <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-cyan-400">
              MENTRIQ PROTOCOLS.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-sm md:text-base max-w-3xl mx-auto mb-10 text-slate-400 leading-relaxed font-medium opacity-80"
          >
            Since 2023, MentriQ has been the structural backbone for professional evolution.
            We transcend traditional education to <span className="text-white font-bold">deploy elite talent</span> into the global technological grid.
          </motion.p>
        </div>
      </section>

      {/* Stats - Premium Clean Glassmorphism */}
      <section className="py-10 relative z-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {stats.map((stat, index) => {
              const Icon = stat.icon
              return (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -8, scale: 1.02 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-white border border-slate-100 shadow-[0_15px_40px_-15px_rgba(0,0,0,0.08)] p-6 rounded-[2.5rem] group text-center relative overflow-hidden"
                >
                  <div className={`inline-flex items-center justify-center w-14 h-14 mb-5 bg-gradient-to-br ${stat.color} rounded-2xl text-white shadow-lg transition-all duration-500 group-hover:rotate-6 group-hover:scale-110`}>
                    <Icon className="w-7 h-7" strokeWidth={2.5} />
                  </div>
                  <div className="text-3xl font-black text-slate-900 mb-1 tracking-tight font-display">{stat.number}</div>
                  <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{stat.label}</div>

                  {/* Subtle hover background animation */}
                  <div className="absolute inset-0 bg-indigo-50/0 group-hover:bg-indigo-50/40 transition-colors -z-10" />
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Mission Section - Clean Image Parallax */}
      <section className="py-16 relative bg-slate-50/50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-8 leading-[0.9] uppercase font-display">
                MISSION & <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-cyan-600">ARCHITECTURE 2030.</span>
              </h2>
              <p className="text-base text-slate-600 mb-10 leading-relaxed font-medium">
                Our mission is the global deployment of 1 million technical leaders.
                We are building the future of skills through extreme practical immersion and elite mentorship.
              </p>

              <div className="space-y-4">
                {[
                  { text: 'Industrial Intensity Programs', icon: '⚡' },
                  { text: 'Project-First Skill Architecture', icon: '🏗️' },
                  { text: 'Elite Career Deployment Grid', icon: '🌐' }
                ].map((item, i) => (
                  <motion.div
                    key={i}
                    whileHover={{ x: 10 }}
                    className="flex items-center space-x-4 p-4 rounded-2xl bg-white border border-slate-100 shadow-sm transition-all hover:bg-indigo-50"
                  >
                    <span className="text-xl leading-none">{item.icon}</span>
                    <span className="text-sm font-bold text-slate-700 uppercase tracking-tight">{item.text}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Premium Architectural Image Stack */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1 }}
              className="relative p-3 bg-white border border-slate-200 rounded-[3rem] shadow-2xl group perspective-2000"
            >
              {/* Technical Decorative Grid */}
              <div className="absolute inset-4 opacity-[0.03] bg-[radial-gradient(#6366f1_1px,transparent_1px)] bg-[length:16px_16px] pointer-events-none" />

              <div className="relative overflow-hidden rounded-[2.5rem] bg-slate-100">
                <motion.img
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 1.5, ease: "circOut" }}
                  src='/images/About.webp'
                  alt="Architecture"
                  className="w-full h-full object-cover"
                />

                {/* Pure Architectural HUD (No Text) */}
                <div className="absolute inset-0 pointer-events-none">
                  {/* Top-Right Technical Marker */}


                  {/* Left-Side Technical Trace */}
                  <motion.div
                    initial={{ height: 0 }}
                    whileInView={{ height: 60 }}
                    className="absolute left-6 top-1/2 -translate-y-1/2 w-[1px] bg-gradient-to-b from-transparent via-white/40 to-transparent"
                  />
                </div>

                {/* Animated Corner Accents */}
                <div className="absolute top-0 left-0 w-12 h-12 border-t-2 border-l-2 border-indigo-500/50 rounded-tl-[2.5rem] pointer-events-none" />
                <div className="absolute bottom-0 right-0 w-12 h-12 border-b-2 border-r-2 border-cyan-500/50 rounded-br-[2.5rem] pointer-events-none" />
              </div>

              {/* Floating Ambient Glow */}
              <div className="absolute -inset-10 bg-indigo-500/5 blur-[100px] rounded-full pointer-events-none group-hover:bg-indigo-500/10 transition-colors" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Our Journey - MentriQ Digital Mainframe Timeline */}
      <section ref={containerRef} className="py-24 bg-[#070b14] relative overflow-hidden">
        {/* Digital Grid Background */}
        <div className="absolute inset-0 opacity-[0.05] bg-[linear-gradient(#00f6ff_1px,transparent_1px),linear-gradient(90deg,#00f6ff_1px,transparent_1px)] bg-[length:40px_40px] pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#070b14] via-transparent to-[#070b14] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-6 relative">
          <div className="text-center mb-24">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              className="inline-flex items-center space-x-2 mb-4 px-4 py-1.5 rounded-full bg-cyan-900/20 border border-cyan-500/30 shadow-[0_0_15px_rgba(6,182,212,0.2)]"
            >
              <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-pulse shadow-[0_0_10px_#22d3ee]"></span>
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-cyan-400">Strategic Roadmap</span>
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-5xl font-black text-white mb-4 uppercase font-display tracking-tight"
            >
              Our Journey
            </motion.h2>
          </div>

          <div className="relative min-h-[1000px]">
            {/* Precision SVG Path - Synchronized with Nodes */}
            {/* Precision SVG Path - Synchronized with Nodes */}
            <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-full max-w-[800px] pointer-events-none hidden md:block">
              <svg
                viewBox="0 0 400 1000"
                fill="none"
                preserveAspectRatio="none"
                className="w-full h-full"
              >
                {/* 1. Base Track (Thin) */}
                <path
                  d="M 200 0 
                     V 100 
                     C 200 200 350 200 350 300 
                     C 350 400 50 400 50 500 
                     C 50 600 350 600 350 700 
                     C 350 800 200 800 200 900 
                     V 1000"
                  stroke="#1e293b"
                  strokeWidth="2"
                  strokeLinecap="round"
                />

                {/* 2. Active Rail Base (Animated Gradient & Thin) */}
                <motion.path
                  d="M 200 0 
                     V 100 
                     C 200 200 350 200 350 300 
                     C 350 400 50 400 50 500 
                     C 50 600 350 600 350 700 
                     C 350 800 200 800 200 900 
                     V 1000"
                  stroke="#06b6d4" // Cyan-500
                  strokeWidth="3"
                  strokeLinecap="round"
                  filter="url(#glow)"
                  style={{ pathLength }}
                />

                <defs>
                  <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur stdDeviation="4" result="blur" />
                    <feComposite in="SourceGraphic" in2="blur" operator="over" />
                  </filter>
                </defs>
              </svg>
            </div>

            {/* Mobile Laser Rail */}
            <div className="absolute left-8 top-0 bottom-0 w-[2px] bg-slate-800 md:hidden overflow-hidden rounded-full">
              <motion.div
                className="w-full bg-cyan-400 shadow-[0_0_15px_#22d3ee]"
                style={{ height: "100%", scaleY, transformOrigin: "top" }}
              />
            </div>

            <div className="space-y-12 md:space-y-20 relative z-10">
              {timeline.map((item, index) => {
                const isEven = index % 2 === 0;

                return (
                  <div key={item.year} className="relative py-2">
                    {/* Mobile Dot Indicator */}
                    <div className="absolute left-8 top-12 w-3 h-3 rounded-full bg-cyan-500 ring-4 ring-slate-900 md:hidden -translate-x-[5px] z-10 shadow-[0_0_10px_#06b6d4]" />

                    {/* Content Card - Dark Glass Prism */}
                    <div className={`flex flex-col md:flex-row items-center ${isEven ? 'md:justify-start md:pr-12 md:pl-4 pl-16 pr-4' : 'md:justify-end md:pl-12 md:pr-4 pl-16 pr-4'}`}>
                      <motion.div
                        initial={{ opacity: 0, x: isEven ? -30 : 30, scale: 0.95 }}
                        whileInView={{ opacity: 1, x: 0, scale: 1 }}
                        viewport={{ once: true, margin: "-100px" }}
                        whileHover={{ x: isEven ? 10 : -10, scale: 1.02 }}
                        className="w-full md:w-[480px] p-8 rounded-[2rem] bg-slate-900/60 border border-slate-800 backdrop-blur-xl shadow-2xl relative group overflow-hidden hover:border-cyan-500/30 transition-all duration-500"
                      >
                        {/* Interactive Border Accent */}
                        <div className={`absolute top-6 bottom-6 w-1 bg-slate-800 rounded-full group-hover:bg-cyan-400 group-hover:shadow-[0_0_10px_#06b6d4] transition-all duration-500 ${isEven ? 'right-0 rounded-l-none' : 'left-0 rounded-r-none'}`} />

                        {/* Scanline Effect */}
                        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-500/5 to-transparent opacity-0 group-hover:opacity-100 translate-y-[-100%] group-hover:translate-y-[100%] transition-all duration-1000 pointer-events-none" />

                        <div className="pl-6 relative z-10">
                          <div className="flex items-center gap-4 mb-5">
                            <span className="text-4xl font-black text-slate-700 group-hover:text-cyan-500/20 transition-colors font-display tracking-tighter">
                              {item.year}
                            </span>
                            <div className="h-px flex-1 bg-slate-800 group-hover:bg-cyan-500/20 transition-colors" />
                            <span className="text-[10px] font-black uppercase tracking-widest text-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity transform translate-x-4 group-hover:translate-x-0 hidden md:block text-glow">
                              System Update
                            </span>
                          </div>

                          <h3 className="text-2xl font-black text-white mb-3 uppercase font-display leading-tight group-hover:text-cyan-400 transition-colors">
                            {item.title}
                          </h3>
                          <p className="text-sm text-slate-400 leading-relaxed font-medium group-hover:text-slate-300 transition-colors">
                            {item.desc}
                          </p>
                        </div>
                      </motion.div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default AboutPage
