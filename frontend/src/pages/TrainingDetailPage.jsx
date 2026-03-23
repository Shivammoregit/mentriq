import React, { useState, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import {
    ArrowLeft,
    Play,
    Award,
    CheckCircle,
    Download,
    Clock,
    User,
    BookOpen,
    Shield,
    Layers
} from "lucide-react"
import { useAuth } from "../context/AuthContext"
import { apiClient } from "../utils/apiClient"
import { getCourseImageUrl } from '../utils/imageUtils'

const TrainingDetailPage = () => {
    const { id } = useParams()
    const { isAuthenticated, checkEnrollments, logout, openAuthModal } = useAuth()
    const navigate = useNavigate();

    const [course, setCourse] = useState(null)
    const [loading, setLoading] = useState(true)
    const [enrolled, setEnrolled] = useState(false)

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await apiClient.get(`/courses/${id}`)
                setCourse(res.data)

                if (isAuthenticated) {
                    const enrollRes = await apiClient.get("/enrollments/my")
                    const isAlreadyEnrolled = enrollRes.data.some(
                        (e) => e.course && e.course._id === id
                    )
                    setEnrolled(isAlreadyEnrolled)
                }
            } catch (err) {
                console.log(err)
            } finally {
                setLoading(false)
            }
        }

        fetchData()
    }, [id, isAuthenticated])

    const handleEnroll = () => {
        navigate(`/enrollf/${id}`);
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white">
                <div className="animate-spin h-12 w-12 border-4 border-indigo-600 border-t-transparent rounded-full"></div>
            </div>
        )
    }

    if (!course) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-white">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Training Program not found</h2>
                <button
                    onClick={() => navigate('/training')}
                    className="px-6 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition"
                >
                    Back to Training
                </button>
            </div>
        )
    }

    const { title, description, level, duration, instructor, modules = [] } = course

    return (
        <div className="min-h-screen bg-gray-50 pt-0">
            {/* Hero Section */}
            <section className="relative bg-white text-slate-900 py-16 pt-28 overflow-hidden">
                {/* Background Effects */}
                <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-indigo-600/10 rounded-full blur-[120px]" />
                <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-[var(--color-accent)]/5 rounded-full blur-[120px]" />

                <div className="relative max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center">
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <button
                            onClick={() => navigate(-1)}
                            className="group flex items-center gap-2 text-gray-400 hover:text-slate-900 mb-8 transition-colors"
                        >
                            <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                            Back to Training
                        </button>

                        <div className="flex flex-wrap gap-3 mb-6">
                            <span className="px-4 py-1.5 rounded-full bg-indigo-500/20 text-indigo-300 text-sm font-medium border border-indigo-500/30">
                                {level} Program
                            </span>
                            <span className="px-4 py-1.5 rounded-full bg-emerald-500/20 text-emerald-300 text-sm font-medium border border-emerald-500/30">
                                Certification Included
                            </span>
                        </div>

                        <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold leading-tight mb-5">
                            {title}
                        </h1>

                        <p className="text-xl text-gray-300 mb-8 leading-relaxed max-w-2xl">
                            {description}
                        </p>

                        <div className="flex flex-wrap gap-8 text-gray-300 mb-10">
                            <div className="flex items-center gap-3">
                                <Clock className="text-indigo-400" size={20} />
                                <span className="font-medium">{duration}</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <User className="text-indigo-400" size={20} />
                                <span className="font-medium">By {instructor || "Expert Mentor"}</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <BookOpen className="text-indigo-400" size={20} />
                                <span className="font-medium">{modules.length} Modules</span>
                            </div>
                        </div>

                        <div className="flex flex-wrap gap-4">
                            <button
                                onClick={() => navigate('/verify-certificate')}
                                className="px-8 py-4 rounded-xl bg-emerald-600/20 border border-emerald-500/30 text-emerald-300 font-bold hover:bg-emerald-600/30 transition flex items-center gap-2 shadow-lg shadow-emerald-500/10 group"
                            >
                                <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                                </svg>
                                Verify Certificate
                            </button>

                            <button
                                onClick={handleEnroll}
                                disabled={enrolled}
                                className={`px-8 py-4 rounded-xl font-bold text-lg flex items-center gap-2 shadow-xl hover:scale-105 transition-all duration-300 ${enrolled
                                    ? "bg-emerald-600 text-white cursor-default"
                                    : "bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-600/30"
                                    }`}
                            >
                                {enrolled ? (
                                    <>
                                        <CheckCircle size={24} />
                                        Enrolled
                                    </>
                                ) : (
                                    <>
                                        <Award size={24} />
                                        Enroll Now
                                    </>
                                )}
                            </button>
                            {course.syllabusUrl && (
                                <a
                                    href={course.syllabusUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="px-8 py-4 rounded-xl bg-slate-100 border border-slate-200 text-slate-900 font-bold hover:bg-slate-200 transition flex items-center gap-2"
                                >
                                    <Download size={20} />
                                    Syllabus
                                </a>
                            )}
                            {course.brochureUrl && (
                                <a
                                    href={course.brochureUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="px-8 py-4 rounded-xl bg-indigo-600/20 border border-indigo-500/30 text-indigo-300 font-bold hover:bg-indigo-600/30 transition flex items-center gap-2 shadow-lg shadow-indigo-500/10"
                                >
                                    <BookOpen size={20} />
                                    Brochure
                                </a>
                            )}
                        </div>
                    </motion.div>

                    {/* Right Image/Card */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="relative hidden lg:block"
                    >
                        <div className="absolute inset-0 bg-gradient-to-tr from-indigo-600 to-purple-600 rounded-3xl blur-2xl opacity-20 transform rotate-6" />
                        <img
                            src={getCourseImageUrl(course)}
                            alt={title}
                            className="relative w-full rounded-3xl shadow-2xl border border-gray-700/50 object-cover aspect-video mb-6"
                            onError={(e) => {
                                e.target.src = 'https://via.placeholder.com/800x600/3b82f6/ffffff?text=MentriQ+Training';
                            }}
                        />
                        {course.brochureImageUrl && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8, delay: 0.4 }}
                                className="relative bg-slate-100 backdrop-blur-xl border border-slate-200 p-2 rounded-3xl overflow-hidden group shadow-2xl"
                            >
                                <div className="absolute inset-0 bg-indigo-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                <img
                                    src={course.brochureImageUrl}
                                    alt="Program Brochure"
                                    className="w-full h-auto rounded-2xl transition-transform duration-700 group-hover:scale-[1.02]"
                                />
                                <div className="absolute bottom-6 left-6 right-6">
                                    <div className="bg-black/40 backdrop-blur-md border border-slate-200 p-4 rounded-2xl flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center">
                                                <Layers className="text-slate-900" size={20} />
                                            </div>
                                            <div>
                                                <p className="text-slate-900 font-bold text-sm">Official Brochure</p>
                                                <p className="text-gray-400 text-[10px] uppercase tracking-widest">Available to Download</p>
                                            </div>
                                        </div>
                                        <a
                                            href={course.brochureUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="p-2.5 bg-white text-indigo-600 rounded-xl hover:scale-110 transition-transform"
                                        >
                                            <Download size={20} />
                                        </a>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </motion.div>
                </div>
            </section>

            {/* Content Section */}
            <section className="max-w-7xl mx-auto px-6 py-16">
                <div className="grid lg:grid-cols-3 gap-12">
                    {/* Left: Modules */}
                    <div className="lg:col-span-2">
                        <h2 className="text-3xl font-bold text-gray-900 mb-8 flex items-center gap-3">
                            <BookOpen className="text-indigo-600" />
                            Training Curriculum
                        </h2>

                        <div className="space-y-4">
                            {(Array.isArray(modules) ? modules : []).map((m, i) => (
                                <div
                                    key={i}
                                    className="group bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:border-indigo-100 transition-all duration-300"
                                >
                                    <div className="flex items-start gap-4">
                                        <span className="flex-shrink-0 w-10 h-10 bg-indigo-50 text-indigo-600 font-bold rounded-lg flex items-center justify-center">
                                            {i + 1}
                                        </span>
                                        <div>
                                            <h3 className="text-lg font-bold text-gray-900 group-hover:text-indigo-700 transition-colors">
                                                {m}
                                            </h3>
                                            <p className="text-gray-500 mt-1 text-sm">
                                                Practical module covering key industry concepts.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Instructor */}
                        <div className="mt-16 bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
                            <h3 className="text-2xl font-bold text-gray-900 mb-6">
                                Expert Trainer
                            </h3>
                            <div className="flex items-center gap-6">
                                <div className="w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 text-2xl font-bold">
                                    {instructor ? instructor.charAt(0) : 'T'}
                                </div>
                                <div>
                                    <h4 className="text-xl font-bold text-gray-900">{instructor || 'MentriQ Specialist'}</h4>
                                    <p className="text-indigo-600 font-medium">Industry Expert & Mentor</p>
                                    <p className="text-gray-500 mt-2 text-sm max-w-md">
                                        Learn from the best in the industry with years of practical experience in {title}.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right: Sidebar */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-28 space-y-8">
                            <div className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100">
                                <h3 className="text-xl font-bold text-gray-900 mb-6">
                                    Training Highlights
                                </h3>
                                <ul className="space-y-4">
                                    {[
                                        { icon: Clock, text: duration + " Intensive Training" },
                                        { icon: Play, text: "Live Projects" },
                                        { icon: Award, text: "Course Certification" },
                                        { icon: Shield, text: "Placement Support" },
                                        { icon: User, text: "Expert Mentorship" }
                                    ].map((item, idx) => {
                                        const Icon = item.icon
                                        return (
                                            <li key={idx} className="flex items-center gap-3 text-gray-600">
                                                <Icon size={20} className="text-indigo-500" />
                                                {item.text}
                                            </li>
                                        )
                                    })}
                                </ul>

                                <div className="mt-8 pt-8 border-t border-gray-100">
                                    <button
                                        onClick={handleEnroll}
                                        disabled={enrolled}
                                        className={`w-full py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 ${enrolled
                                            ? "bg-emerald-500 text-white"
                                            : "bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg shadow-indigo-500/30 hover:shadow-xl hover:-translate-y-1 transition-all"
                                            }`}
                                    >
                                        {enrolled ? "Enrolled" : "Enroll Now"}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}

export default TrainingDetailPage
