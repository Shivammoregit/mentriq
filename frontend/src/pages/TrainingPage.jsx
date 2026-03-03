import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, BookOpen, Award } from 'lucide-react'
import CourseCard from '../components/courses/CourseCard'
import { apiClient } from '../utils/apiClient'

const TrainingPage = () => {
    const [items, setItems] = useState([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState('')

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [coursesRes, internshipsRes] = await Promise.all([
                    apiClient.get('/courses'),
                    apiClient.get('/internships')
                ])

                const coursesData = Array.isArray(coursesRes.data) ? coursesRes.data : []
                const internshipsData = Array.isArray(internshipsRes.data) ? internshipsRes.data : []

                const trainingCourses = (Array.isArray(coursesData) ? coursesData : []).filter(c => c.category === 'Training').map(c => ({ ...c, type: 'course', baseUrl: '/training' }))
                const internships = (Array.isArray(internshipsData) ? internshipsData : []).filter(i => i.status === 'Active').map(i => ({
                    ...i,
                    type: 'internship',
                    baseUrl: '/internship/apply',
                    duration: i.duration,
                    level: i.company
                }))

                setItems([...trainingCourses, ...internships])
            } catch (error) {
                console.log('Error fetching data:', error)
                setItems([])
            } finally {
                setLoading(false)
            }
        }

        fetchData()
    }, [])

    const filteredItems = items.filter(item =>
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item.description && item.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (item.company && item.company.toLowerCase().includes(searchTerm.toLowerCase()))
    )

    return (
        <div className="min-h-screen pt-0 bg-white">
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
                        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
                        className="absolute -top-[10%] left-1/4 w-[600px] h-[600px] bg-indigo-600/20 rounded-full blur-[140px] animate-pulse"
                    />
                    <motion.div
                        animate={{
                            x: [0, -60, 0],
                            y: [0, 70, 0],
                            scale: [1, 1.3, 1]
                        }}
                        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
                        className="absolute -bottom-[10%] right-1/4 w-[600px] h-[600px] bg-cyan-500/10 rounded-full blur-[140px]"
                    />
                    {/* High-Contrast Technical Grid */}
                    <div className="absolute inset-0 opacity-[0.03] bg-[linear-gradient(#ffffff_1px,transparent_1px),linear-gradient(90deg,#ffffff_1px,transparent_1px)] bg-[length:40px_40px]" />
                </div>

                <div className="relative max-w-7xl mx-auto px-6 text-center z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="inline-flex items-center space-x-2 mb-8 px-5 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md shadow-lg shadow-black/20"
                    >
                        <Award size={16} className="text-cyan-400" />
                        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-cyan-300">Elite Training Programs</span>
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.1 }}
                        className="text-4xl md:text-6xl lg:text-7xl font-black mb-6 tracking-tighter uppercase font-display leading-[0.9]"
                    >
                        MASTERING <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-cyan-400">
                            MODERN SYSTEMS.
                        </span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="text-sm md:text-base max-w-3xl mx-auto mb-10 text-slate-400 leading-relaxed font-medium opacity-80"
                    >
                        Accelerate your career with elite-level training programs. Master complex systems through <span className="text-white font-bold">hands-on deep dives</span> and expert guidance.
                    </motion.p>
                </div>
            </section>

            {/* Value Props */}
            <section className="py-20 bg-gray-50 relative z-20">
                <div className="max-w-7xl mx-auto px-6">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="grid grid-cols-1 md:grid-cols-3 gap-8"
                    >
                        {[
                            {
                                icon: BookOpen,
                                text: 'Live Intensity',
                                color: 'indigo',
                                desc: 'Experience the pressure and pace of a real development environment.'
                            },
                            {
                                icon: Award,
                                text: 'Degree Equivalent',
                                color: 'cyan',
                                desc: 'Curriculum depth that matches or exceeds university standards.'
                            },
                            {
                                icon: Search,
                                text: 'Global Placement',
                                color: 'indigo',
                                desc: 'Connect with international opportunities through our network.'
                            }
                        ].map((item, idx) => {
                            const Icon = item.icon
                            return (
                                <div key={idx} className="group p-8 rounded-[2rem] bg-white border border-slate-100 shadow-[0_10px_30px_-5px_rgba(0,0,0,0.05)] hover:shadow-2xl hover:shadow-indigo-500/10 hover:-translate-y-2 hover:border-indigo-500/20 transition-all duration-300 relative overflow-hidden">
                                    <div className={`absolute top-0 right-0 w-32 h-32 bg-${item.color}-500/5 rounded-bl-[100%] -mr-10 -mt-10 transition-transform group-hover:scale-150`}></div>

                                    <div className={`w-16 h-16 rounded-2xl bg-${item.color}-50 flex items-center justify-center text-${item.color}-600 mb-6 group-hover:scale-110 transition-transform relative z-10 border border-${item.color}-100 shadow-sm`}>
                                        <Icon size={28} />
                                    </div>
                                    <h3 className="text-xl font-black text-slate-900 mb-3 tracking-tight relative z-10 group-hover:text-indigo-600 transition-colors">
                                        {item.text}
                                    </h3>
                                    <p className="text-slate-500 text-sm font-medium leading-relaxed relative z-10">
                                        {item.desc}
                                    </p>
                                </div>
                            )
                        })}
                    </motion.div>
                </div>
            </section>

            {/* Search + Stats */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16 text-glow">
                <div className="flex flex-col lg:flex-row gap-8 items-center justify-between mb-20">
                    {/* Search Bar with 3D depth */}
                    <div className="relative flex-1 max-w-2xl w-full group">
                        <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500/20 to-cyan-500/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition duration-500"></div>
                        <div className="relative">
                            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-indigo-400 w-5 h-5 group-hover:scale-110 transition-transform" />
                            <input
                                type="text"
                                placeholder="Search training programs..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-14 pr-6 py-5 bg-white border border-gray-100 rounded-2xl shadow-xl shadow-indigo-500/5 focus:shadow-indigo-500/10 focus:ring-4 focus:ring-indigo-50 focus:border-indigo-500 transition-all duration-300 text-lg placeholder:text-gray-400"
                            />
                        </div>
                    </div>

                    {/* Stats with Glass Effect */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="flex items-center space-x-5 bg-white/80 backdrop-blur-md p-3 pr-8 rounded-3xl border border-white shadow-xl shadow-indigo-500/5"
                    >
                        <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-indigo-200">
                            <BookOpen className="w-7 h-7" />
                        </div>
                        <div>
                            <div className="text-3xl font-black text-gray-900 tracking-tight">{filteredItems.length}</div>
                            <div className="text-xs font-bold text-indigo-600 uppercase tracking-widest opacity-80">Opportunities</div>
                        </div>
                    </motion.div>
                </div>


                {/* Courses Grid */}
                {
                    loading ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {[...Array(6)].map((_, i) => (
                                <div
                                    key={i}
                                    className="animate-pulse bg-gray-100 rounded-3xl h-96"
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {filteredItems.map((item, index) => (
                                <motion.div
                                    key={item._id}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.5, delay: index * 0.1 }}
                                >
                                    <CourseCard course={item} baseUrl={item.baseUrl} />
                                </motion.div>
                            ))}
                        </div>
                    )
                }

                {/* No courses */}
                {
                    filteredItems.length === 0 && !loading && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-center py-32 col-span-full"
                        >
                            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                <Search className="w-10 h-10 text-gray-400" />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-2">No training found</h3>
                            <p className="text-gray-500 mb-8">Try different search term</p>
                            <button
                                onClick={() => setSearchTerm('')}
                                className="px-8 py-3 bg-indigo-600 text-white font-medium rounded-xl hover:bg-indigo-700 transition-colors"
                            >
                                Clear Search
                            </button>
                        </motion.div>
                    )
                }
            </div>
        </div>
    )
}

export default TrainingPage
