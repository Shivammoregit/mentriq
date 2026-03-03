import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    Users,
    Target,
    Award,
    Zap,
    CheckCircle2,
    Building2,
    Send,
    Code2,
    PieChart,
    Palette,
    LineChart,
    MapPin,
    Clock,
    Briefcase,
    ExternalLink,
    FileText,
    Filter,
    MessageSquare,
    Rocket
} from 'lucide-react'
import { apiClient as api } from '../utils/apiClient'

const RecruitPage = () => {
    const [jobs, setJobs] = useState([])
    const [jobsLoading, setJobsLoading] = useState(true)
    const [formData, setFormData] = useState({
        company: '',
        name: '',
        email: '',
        hiringNeeds: '',
        message: ''
    })
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [submitted, setSubmitted] = useState(false)

    useEffect(() => {
        const fetchJobs = async () => {
            try {
                const { data } = await api.get('/jobs?isActive=true')
                setJobs(data)
            } catch (err) {
                console.error("Failed to fetch jobs:", err)
            } finally {
                setJobsLoading(false)
            }
        }
        fetchJobs()
    }, [])

    const handleSubmit = async (e) => {
        e.preventDefault()
        setIsSubmitting(true)
        try {
            await api.post('/recruit', formData)
            setSubmitted(true)
            setFormData({
                company: '',
                name: '',
                email: '',
                hiringNeeds: '',
                message: ''
            })
        } catch (error) {
            console.error(error)
        } finally {
            setIsSubmitting(false)
        }
    }

    const whyRecruit = [
        {
            title: 'Pre-Vetted Talent',
            desc: 'Every student undergoes rigorous technical assessments and project-based evaluations.',
            icon: Target,
            color: 'indigo'
        },
        {
            title: 'Industry-Ready Skills',
            desc: 'Our curriculum is designed by industry experts with a focus on real-world tools.',
            icon: Zap,
            color: 'cyan'
        },
        {
            title: 'Zero Hiring Costs',
            desc: 'Access our talent pool at no cost to your organization. We focus on impact.',
            icon: Award,
            color: 'purple'
        },
        {
            title: 'Scalable Solutions',
            desc: 'From interns to full-time professionals, find the right fit for your team.',
            icon: Users,
            color: 'blue'
        }
    ]

    const talentDomains = [
        { name: 'Full Stack Development', icon: Code2, students: 'Active' },
        { name: 'Data Analytics', icon: PieChart, students: 'Active' },
        { name: 'UI/UX Design', icon: Palette, students: 'Active' },
        { name: 'Business Analysis', icon: LineChart, students: 'Active' }
    ]

    const steps = [
        { number: '01', title: 'Post Requirement', desc: 'Share your hiring needs and job descriptions with us.', icon: FileText },
        { number: '02', title: 'Talent Shortlisting', desc: 'We filter the best candidates based on your criteria.', icon: Filter },
        { number: '03', title: 'Direct Interviews', desc: 'Schedule and conduct interviews with our pre-vetted students.', icon: MessageSquare },
        { number: '04', title: 'Seamless Onboarding', desc: 'Welcome your new team members and start building.', icon: Rocket }
    ]

    return (
        <div className="min-h-screen pt-0 bg-white selection:bg-indigo-100">
            {/* Premium Dark Hero Section */}
            <section className="relative min-h-[70vh] flex items-center bg-[#070b14] text-white overflow-hidden pt-32 pb-20">
                {/* Advanced Atmospheric Animations for Dark */}
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
                    <div className="absolute inset-0 opacity-[0.03] bg-[linear-gradient(#ffffff_1px,transparent_1px),linear-gradient(90deg,#ffffff_1px,transparent_1px)] bg-[length:40px_40px]" />
                </div>

                <div className="relative max-w-7xl mx-auto px-6 z-10 w-full">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8 }}
                        >
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="inline-flex items-center space-x-2 mb-8 px-5 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md shadow-lg shadow-black/20"
                            >
                                <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-ping"></span>
                                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-300">Hire Top Tier Talent</span>
                            </motion.div>

                            <h1 className="text-4xl md:text-6xl lg:text-7xl font-black mb-6 tracking-tighter uppercase font-display leading-[0.9]">
                                BUILD YOUR <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-cyan-400">
                                    DREAM TEAM.
                                </span>
                            </h1>

                            <p className="text-sm md:text-base text-slate-400 mb-10 leading-relaxed font-medium opacity-80 max-w-xl">
                                Connect with pre-vetted, industry-ready professionals trained in the latest technologies. <span className="text-white font-bold">No hiring fees, just exceptional talent.</span>
                            </p>

                            <div className="flex flex-wrap gap-4">
                                <a
                                    href="#hire-form"
                                    className="px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold transition-all flex items-center gap-2 group shadow-xl shadow-indigo-600/20"
                                >
                                    Start Hiring Now
                                    <Send size={18} className="group-hover:translate-x-1 transition-transform" />
                                </a>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 1 }}
                            className="hidden lg:block relative"
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/20 to-cyan-500/20 rounded-3xl blur-[80px]" />
                            <div className="relative bg-[#0f172a]/50 border border-white/10 backdrop-blur-xl rounded-[2rem] p-10 shadow-2xl">
                                <div className="grid grid-cols-2 gap-6">
                                    {talentDomains.map((domain, idx) => (
                                        <div key={idx} className="bg-white/5 border border-white/5 rounded-2xl p-6 hover:bg-white/10 transition-colors group">
                                            <domain.icon size={32} className="text-indigo-400 mb-4 group-hover:scale-110 transition-transform" />
                                            <div className="text-white font-black text-3xl mb-1">{domain.students}</div>
                                            <div className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">{domain.name}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Active Opportunities Section */}
            <section className="py-24 bg-slate-50 relative z-20 -mt-10 overflow-hidden">
                <div className="absolute inset-0 opacity-[0.4] bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:20px_20px]" />
                <div className="max-w-7xl mx-auto px-6 relative z-10">
                    <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-16">
                        <div className="text-left">
                            <span className="text-indigo-600 font-black uppercase tracking-[0.2em] text-xs">Current Openings</span>
                            <h2 className="text-4xl md:text-5xl font-black text-gray-900 mt-4 tracking-tight">
                                Active <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-cyan-600">Opportunities</span>
                            </h2>
                        </div>
                        <p className="text-gray-500 font-medium max-w-md text-sm md:text-base">
                            Explore career-defining roles from our top corporate partners. Pre-vetted roles for MentriQ students.
                        </p>
                    </div>

                    {jobsLoading ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="h-64 bg-gray-200 rounded-[2rem] animate-pulse" />
                            ))}
                        </div>
                    ) : jobs.length === 0 ? (
                        <div className="py-20 text-center bg-white rounded-[3rem] border border-gray-200 shadow-sm">
                            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                                <Briefcase className="text-gray-300" size={32} />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">New roles coming soon!</h3>
                            <p className="text-gray-500">We're curating exclusive opportunities for you.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {jobs.map((job, idx) => (
                                <motion.div
                                    key={job._id}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: idx * 0.1 }}
                                    className="bg-white border-2 border-transparent p-8 rounded-[2.5rem] shadow-[0_10px_40px_-10px_rgba(0,0,0,0.08)] hover:border-indigo-600/20 hover:shadow-indigo-500/10 hover:-translate-y-2 transition-all duration-300 group flex flex-col relative overflow-hidden"
                                >
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50/50 rounded-bl-[100%] -mr-10 -mt-10 transition-transform group-hover:scale-150" />
                                    <div className="relative z-10 flex justify-between items-start mb-6">
                                        <div className="w-14 h-14 rounded-2xl bg-white border border-gray-100 flex items-center justify-center text-indigo-600 shadow-sm group-hover:scale-110 transition-transform">
                                            <Briefcase size={24} />
                                        </div>
                                        <span className="text-[10px] font-black uppercase tracking-widest bg-indigo-50 text-indigo-600 px-3 py-1.5 rounded-full border border-indigo-100/50">
                                            {job.type}
                                        </span>
                                    </div>
                                    <div className="relative z-10">
                                        <h3 className="text-2xl font-black text-gray-900 mb-2 leading-tight group-hover:text-indigo-600 transition-colors">
                                            {job.title}
                                        </h3>
                                        <div className="text-gray-500 font-bold text-sm mb-6 flex items-center gap-2">
                                            <Building2 size={16} className="text-indigo-400" />
                                            {job.company}
                                        </div>
                                        <div className="space-y-3 mb-8">
                                            <div className="flex items-center gap-3 text-sm text-gray-500 font-medium">
                                                <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400">
                                                    <MapPin size={14} />
                                                </div>
                                                {job.location}
                                            </div>
                                            <div className="flex items-center gap-3 text-sm text-gray-500 font-medium">
                                                <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400">
                                                    <Clock size={14} />
                                                </div>
                                                Posted {new Date(job.postedDate).toLocaleDateString()}
                                            </div>
                                        </div>
                                    </div>
                                    <a
                                        href={job.applicationLink}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="mt-auto w-full py-4 bg-gray-900 text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-indigo-600 transition-colors group/btn relative z-10"
                                    >
                                        Apply Now
                                        <ExternalLink size={16} className="group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform" />
                                    </a>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </div>
            </section>

            {/* Why Choose Us Section */}
            <section className="py-32 bg-white relative overflow-hidden">
                <div className="max-w-7xl mx-auto px-6 text-center relative z-10">
                    <h2 className="text-4xl md:text-6xl font-black text-slate-900 mb-20 tracking-tighter">
                        WHY PARTNER WITH <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-cyan-600">MENTRIQ?</span>
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {whyRecruit.map((item, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.1 }}
                                className="relative group p-10 rounded-[2.5rem] bg-gradient-to-br from-white via-white to-slate-50 border border-slate-100 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.05)] hover:shadow-2xl hover:shadow-indigo-500/10 hover:-translate-y-2 hover:border-indigo-500/30 transition-all duration-500 overflow-hidden"
                            >
                                <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                                <div className={`absolute top-0 right-0 w-40 h-40 bg-indigo-500/5 rounded-bl-[4rem] -mr-10 -mt-10 transition-transform duration-700 group-hover:scale-110`} />
                                <div className={`w-24 h-24 rounded-[2rem] bg-gradient-to-br from-indigo-50 to-white flex items-center justify-center mb-10 group-hover:scale-110 transition-transform duration-500 relative z-10 border border-indigo-100 shadow-lg shadow-indigo-500/5`}>
                                    <item.icon className="text-indigo-600 drop-shadow-sm" size={40} strokeWidth={1.5} />
                                </div>
                                <h3 className="text-2xl font-black text-slate-900 mb-4 relative z-10 group-hover:text-indigo-900 transition-colors">{item.title}</h3>
                                <p className="text-slate-500 leading-relaxed text-sm font-medium relative z-10 group-hover:text-slate-600 transition-colors">{item.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Process Section */}
            <section className="py-32 bg-slate-50 relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.03]" />
                <div className="max-w-7xl mx-auto px-6 relative z-10">
                    <div className="text-center mb-24">
                        <span className="text-indigo-600 font-black uppercase tracking-[0.2em] text-xs">Seamless Experience</span>
                        <h2 className="text-4xl md:text-5xl font-black text-slate-900 mt-4 tracking-tight">
                            DATA-DRIVEN <span className="text-indigo-600">HIRING PIPELINE</span>
                        </h2>
                    </div>

                    <div className="relative">
                        <div className="hidden lg:block absolute top-[100px] left-0 w-full h-[2px]">
                            <svg className="w-full h-full overflow-visible">
                                <path d="M 0 0 H 1200" stroke="#e2e8f0" strokeWidth="2" fill="transparent" />
                                <motion.path
                                    d="M 0 0 H 1200"
                                    stroke="#4f46e5"
                                    strokeWidth="2"
                                    fill="transparent"
                                    initial={{ pathLength: 0 }}
                                    whileInView={{ pathLength: 1 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 2, ease: "easeInOut" }}
                                />
                            </svg>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                            {steps.map((step, idx) => (
                                <motion.div
                                    key={idx}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: idx * 0.1 }}
                                    className="relative z-10 group text-center lg:text-left pt-8"
                                >
                                    <div className="w-24 h-24 rounded-3xl bg-white border border-slate-200 shadow-xl flex items-center justify-center mb-8 mx-auto lg:mx-0 group-hover:border-indigo-600 group-hover:-translate-y-2 transition-all duration-300 relative">
                                        <div className="absolute -top-3 -right-3 w-8 h-8 bg-indigo-600 text-white rounded-full flex items-center justify-center font-bold text-sm shadow-lg">
                                            {step.number}
                                        </div>
                                        <step.icon className="text-slate-300 group-hover:text-indigo-600 transition-colors" size={32} />
                                    </div>
                                    <h4 className="text-xl font-black text-slate-900 mb-4">{step.title}</h4>
                                    <p className="text-slate-500 text-sm leading-relaxed font-medium">{step.desc}</p>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Hire Form Section */}
            <section id="hire-form" className="py-24 bg-[#070b14] relative overflow-hidden">
                <div className="absolute inset-0 opacity-[0.05] bg-[linear-gradient(#ffffff_1px,transparent_1px),linear-gradient(90deg,#ffffff_1px,transparent_1px)] bg-[length:30px_30px]" />
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-indigo-600/10 rounded-full blur-[120px]" />
                <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-cyan-600/10 rounded-full blur-[100px]" />

                <div className="relative max-w-5xl mx-auto px-6">
                    <div className="bg-white/5 border border-white/10 backdrop-blur-2xl rounded-[3rem] p-8 md:p-16 shadow-2xl relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-50" />
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                            <div>
                                <h2 className="text-4xl font-black text-white mb-8 tracking-tighter">
                                    INITIATE <br />
                                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400 italic font-medium">
                                        PARTNERSHIP
                                    </span>
                                </h2>
                                <p className="text-slate-400 mb-10 leading-relaxed font-medium">
                                    Deploy our specialized recruitment protocol. Our partnership team will calibrate their search to your specific technical requirements within 24 hours.
                                </p>
                                <div className="space-y-6">
                                    {[
                                        { icon: Target, text: 'Customized Talent Curations' },
                                        { icon: Zap, text: 'Direct Access to Student Profiles' },
                                        { icon: Users, text: 'Dedicated Partnership Manager' }
                                    ].map((feat, i) => (
                                        <div key={i} className="flex items-center gap-4 text-slate-200 font-bold tracking-tight group">
                                            <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center border border-white/10 group-hover:bg-indigo-500/20 group-hover:border-indigo-500/50 transition-colors">
                                                <feat.icon size={18} className="text-cyan-400" />
                                            </div>
                                            {feat.text}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <AnimatePresence mode="wait">
                                    {submitted ? (
                                        <motion.div
                                            initial={{ opacity: 0, scale: 0.9 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            className="h-full flex flex-col items-center justify-center text-center p-10 bg-indigo-500/10 rounded-2xl border border-indigo-500/20"
                                        >
                                            <div className="w-20 h-20 rounded-full bg-indigo-500 flex items-center justify-center mb-6 shadow-xl shadow-indigo-500/20">
                                                <Send size={32} className="text-white" />
                                            </div>
                                            <h3 className="text-2xl font-black text-white mb-2">TRANSMISSION RECEIVED</h3>
                                            <p className="text-indigo-200">Our agents will contact you shortly.</p>
                                        </motion.div>
                                    ) : (
                                        <form onSubmit={handleSubmit} className="space-y-5">
                                            <div className="grid grid-cols-2 gap-5">
                                                <div>
                                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 block mb-2 px-1">Organization</label>
                                                    <input required type="text" placeholder="MentriQ" value={formData.company} onChange={e => setFormData({ ...formData, company: e.target.value })} className="w-full bg-[#070b14]/50 border border-white/5 rounded-xl px-5 py-4 text-white focus:bg-[#070b14] focus:border-indigo-500 outline-none transition-all font-medium placeholder:text-slate-600" />
                                                </div>
                                                <div>
                                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 block mb-2 px-1">Contact Name</label>
                                                    <input required type="text" placeholder="John Doe" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className="w-full bg-[#070b14]/50 border border-white/5 rounded-xl px-5 py-4 text-white focus:bg-[#070b14] focus:border-indigo-500 outline-none transition-all font-medium placeholder:text-slate-600" />
                                                </div>
                                            </div>
                                            <div>
                                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 block mb-2 px-1">Work Email</label>
                                                <input required type="email" placeholder="john@company.com" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} className="w-full bg-[#070b14]/50 border border-white/5 rounded-xl px-5 py-4 text-white focus:bg-[#070b14] focus:border-indigo-500 outline-none transition-all font-medium placeholder:text-slate-600" />
                                            </div>
                                            <div>
                                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 block mb-2 px-1">Resource Requirements</label>
                                                <input required type="text" placeholder="e.g. Full Stack Developers" value={formData.hiringNeeds} onChange={e => setFormData({ ...formData, hiringNeeds: e.target.value })} className="w-full bg-[#070b14]/50 border border-white/5 rounded-xl px-5 py-4 text-white focus:bg-[#070b14] focus:border-indigo-500 outline-none transition-all font-medium placeholder:text-slate-600" />
                                            </div>
                                            <div>
                                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 block mb-2 px-1">Briefing (Optional)</label>
                                                <textarea rows="4" placeholder="Tell us about your requirements..." value={formData.message} onChange={e => setFormData({ ...formData, message: e.target.value })} className="w-full bg-[#070b14]/50 border border-white/5 rounded-xl px-5 py-4 text-white focus:bg-[#070b14] focus:border-indigo-500 outline-none transition-all font-medium resize-none placeholder:text-slate-600" />
                                            </div>
                                            <button disabled={isSubmitting} className="w-full py-5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-black uppercase tracking-[0.2em] text-sm shadow-xl shadow-indigo-600/20 transition-all disabled:opacity-50 flex items-center justify-center gap-3 group">
                                                {isSubmitting ? 'Transmitting...' : 'Initialize Partnership'}
                                                <Send size={18} className="group-hover:translate-x-1 transition-transform" />
                                            </button>
                                        </form>
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}

export default RecruitPage
