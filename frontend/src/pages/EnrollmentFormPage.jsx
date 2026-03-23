import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import { apiClient as api } from '../utils/apiClient'
import { useAuth } from '../context/AuthContext'
import { CheckCircle, Shield, ArrowLeft, Camera, Upload } from 'lucide-react'

const EnrollmentFormPage = () => {
    const { courseId } = useParams()
    const { user } = useAuth()
    const navigate = useNavigate()
    const location = useLocation()

    const [course, setCourse] = useState(null)
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        fatherName: '',
        motherName: '',
        dob: '',
        contact: '',
        parentContact: '',
        address: '',
        image: ''
    })
    const [loading, setLoading] = useState(true)
    const [uploading, setUploading] = useState(false)

    useEffect(() => {
        const fetchCourse = async () => {
            try {
                const { data } = await api.get(`/courses/${courseId}`)
                setCourse(data)
            } catch {
                alert("Failed to load course")
                navigate('/courses')
            } finally {
                setLoading(false)
            }
        }
        fetchCourse()
    }, [courseId, navigate])

    const handleImageUpload = async (e) => {
        const file = e.target.files[0]
        if (!file) return

        const uploadData = new FormData()
        uploadData.append('image', file)

        try {
            setUploading(true)
            const { data } = await api.post('/upload', uploadData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            })
            setFormData((prev) => ({ ...prev, image: data.imagePath || data }))
        } catch {
            alert("Image upload failed")
        } finally {
            setUploading(false)
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            await api.post('/enrollments', {
                courseId,
                ...formData
            })
            navigate('/enrollment-success', { state: { course } })
        } catch (err) {
            alert(err.response?.data?.message || "Enrollment failed")
        }
    }

    if (loading) return (
        <div className="min-h-[70vh] flex items-center justify-center bg-white">
            <div className="animate-spin h-12 w-12 border-4 border-indigo-600 border-t-transparent rounded-full"></div>
        </div>
    )
    if (!course) return (
        <div className="min-h-[70vh] flex flex-col items-center justify-center bg-white text-slate-900 p-10">
            <h2 className="text-3xl font-black uppercase tracking-tight mb-4 text-center">Course Not Found</h2>
            <button
                onClick={() => navigate('/courses')}
                className="bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-900 px-8 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all"
            >
                Return to Courses
            </button>
        </div>
    )

    return (
        <section className="min-h-screen pb-14 px-4 flex items-center justify-center bg-[#020617] mt-16">
            {/* Background decoration */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[120px]" />
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-cyan-600/10 rounded-full blur-[120px]" />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="relative bg-slate-900/60 backdrop-blur-2xl border border-slate-800 rounded-[2rem] shadow-2xl overflow-hidden max-w-5xl w-full flex flex-col md:flex-row"
            >
                {/* Left Side: Course Info */}
                <div className="md:w-2/5 bg-slate-800/80 backdrop-blur-md text-white p-8 flex flex-col justify-between relative overflow-hidden border-r border-slate-700">
                    {/* Abstract Bg */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/20 rounded-full blur-3xl -mr-16 -mt-16" />
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-cyan-600/20 rounded-full blur-3xl -ml-16 -mb-16" />

                    <div className="relative z-10">
                        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-400 hover:text-white transition mb-8">
                            <ArrowLeft size={18} /> Back
                        </button>
                        <h2 className="text-3xl font-black mb-4 leading-tight tracking-tight uppercase text-white">{course.title}</h2>
                        <div className="space-y-4 text-gray-300">
                            <p className="flex items-center gap-3">
                                <span className="w-8 h-8 rounded-lg bg-indigo-500/20 flex items-center justify-center text-sm font-bold text-indigo-400">1</span>
                                {course.duration} Duration
                            </p>
                            <p className="flex items-center gap-3">
                                <span className="w-8 h-8 rounded-lg bg-cyan-500/20 flex items-center justify-center text-sm font-bold text-cyan-400">2</span>
                                {course.level} Level
                            </p>
                            <p className="flex items-center gap-3">
                                <span className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center text-sm font-bold text-emerald-400">3</span>
                                Certificate of Completion
                            </p>
                        </div>
                    </div>

                    <div className="mt-12 pt-8 border-t border-slate-200 relative z-10">
                        <div className="flex justify-between items-end mb-2">
                            <span className="text-xs text-indigo-400 uppercase font-black tracking-widest">Enrollment Status</span>
                            <span className="text-2xl font-black text-white uppercase">Active</span>
                        </div>
                        <p className="text-[10px] text-indigo-300/60 uppercase tracking-tighter">*Limited seats available</p>
                    </div>

                    <div className="mt-8 relative z-10">
                        <div className="flex items-center gap-3 mb-2">
                            <Shield className="text-indigo-400" size={20} />
                            <span className="font-bold text-sm text-indigo-100 uppercase tracking-wider">Secure Registration</span>
                        </div>
                        <p className="text-xs text-gray-400 leading-relaxed">
                            Your information is encrypted and safe with us. Our team will contact you shortly after submission.
                        </p>
                    </div>
                </div>

                {/* Right Side: Form */}
                <div className="md:w-3/5 p-8 md:p-10">
                    <div className="mb-10">
                        <h3 className="text-2xl font-black text-white mb-2 tracking-tight uppercase">Registration Form</h3>
                        <p className="text-gray-400 text-sm">Please provide the necessary details to join {course.title}.</p>
                    </div>

                    {!user ? (
                        <div className="bg-slate-800 border border-slate-700 rounded-3xl p-10 text-center space-y-6">
                            <h4 className="text-xl font-black text-white mb-2 tracking-tight uppercase">Authentication Required</h4>
                            <p className="text-gray-400 text-sm max-w-xs mx-auto">You must be signed in to enroll in this course. This allows us to track your progress and certification.</p>
                            <button
                                onClick={() => navigate('/login', { state: { from: location } })}
                                className="bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all"
                            >
                                Sign In to Enroll
                            </button>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Profile Picture Upload Section */}
                            <div className="flex flex-col items-center justify-center p-5 bg-slate-800/50 rounded-[1.8rem] border border-slate-700 border-dashed mb-6 group hover:border-indigo-500/50 transition-all">
                                <div className="relative w-24 h-24 mb-4">
                                    <div className="w-full h-full rounded-2xl overflow-hidden bg-[#1e293b] border border-slate-200 flex items-center justify-center relative group-hover:scale-105 transition-transform shadow-xl">
                                        {formData.image ? (
                                            <img src={formData.image} alt="Profile Preview" className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="flex flex-col items-center gap-1 text-gray-500">
                                                <Camera size={24} className="opacity-20" />
                                            </div>
                                        )}
                                        {uploading && (
                                            <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                                                <div className="w-6 h-6 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
                                            </div>
                                        )}
                                    </div>
                                    <label className="absolute -bottom-2 -right-2 p-2 bg-indigo-600 rounded-xl text-white shadow-lg cursor-pointer hover:bg-indigo-500 hover:scale-110 active:scale-90 transition-all border-2 border-[#0f172a]">
                                        <Upload size={16} />
                                        <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                                    </label>
                                </div>
                                <div className="text-center">
                                    <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-1">Student Identity Photo</p>
                                    <p className="text-[9px] text-gray-500 font-bold">Square aspect ratio recommended</p>
                                </div>
                            </div>

                            {/* Row 1: Personal Info */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="block text-[10px] font-black text-indigo-400 uppercase tracking-[0.2em] mb-1 ml-1">Student Full Name</label>
                                    <input
                                        required
                                        placeholder="Enter your name"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full p-4 bg-slate-800/50 rounded-2xl border border-slate-700 text-white placeholder:text-gray-500 focus:bg-slate-800 focus:border-indigo-500/50 focus:ring-4 focus:ring-indigo-500/10 transition-all outline-none"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="block text-[10px] font-black text-indigo-400 uppercase tracking-[0.2em] mb-1 ml-1">Email Address</label>
                                    <input
                                        required
                                        type="email"
                                        placeholder="your@email.com"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        className="w-full p-4 bg-slate-800/50 rounded-2xl border border-slate-700 text-white placeholder:text-gray-500 focus:bg-slate-800 focus:border-indigo-500/50 focus:ring-4 focus:ring-indigo-500/10 transition-all outline-none"
                                    />
                                </div>
                            </div>

                            {/* Row 2: Family Info */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="block text-[10px] font-black text-indigo-400 uppercase tracking-[0.2em] mb-1 ml-1">Father's Name</label>
                                    <input
                                        required
                                        placeholder="Enter Father's name"
                                        value={formData.fatherName}
                                        onChange={(e) => setFormData({ ...formData, fatherName: e.target.value })}
                                        className="w-full p-4 bg-slate-800/50 rounded-2xl border border-slate-700 text-white placeholder:text-gray-500 focus:bg-slate-800 focus:border-indigo-500/50 focus:ring-4 focus:ring-indigo-500/10 transition-all outline-none"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="block text-[10px] font-black text-indigo-400 uppercase tracking-[0.2em] mb-1 ml-1">Mother's Name</label>
                                    <input
                                        required
                                        placeholder="Enter Mother's name"
                                        value={formData.motherName}
                                        onChange={(e) => setFormData({ ...formData, motherName: e.target.value })}
                                        className="w-full p-4 bg-slate-800/50 rounded-2xl border border-slate-700 text-white placeholder:text-gray-500 focus:bg-slate-800 focus:border-indigo-500/50 focus:ring-4 focus:ring-indigo-500/10 transition-all outline-none"
                                    />
                                </div>
                            </div>

                            {/* Row 3: Contacts */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="block text-[10px] font-black text-indigo-400 uppercase tracking-[0.2em] mb-1 ml-1">Student Contact</label>
                                    <input
                                        required
                                        type='tel'
                                        placeholder="+91 00000 00000"
                                        value={formData.contact}
                                        onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                                        className="w-full p-4 bg-slate-800/50 rounded-2xl border border-slate-700 text-white placeholder:text-gray-500 focus:bg-slate-800 focus:border-indigo-500/50 focus:ring-4 focus:ring-indigo-500/10 transition-all outline-none"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="block text-[10px] font-black text-indigo-400 uppercase tracking-[0.2em] mb-1 ml-1">Parent Contact</label>
                                    <input
                                        required
                                        type='tel'
                                        placeholder="Mobile Number"
                                        value={formData.parentContact}
                                        onChange={(e) => setFormData({ ...formData, parentContact: e.target.value })}
                                        className="w-full p-4 bg-slate-800/50 rounded-2xl border border-slate-700 text-white placeholder:text-gray-500 focus:bg-slate-800 focus:border-indigo-500/50 focus:ring-4 focus:ring-indigo-500/10 transition-all outline-none"
                                    />
                                </div>
                            </div>

                            {/* Row 4: Details */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="space-y-2 md:col-span-1">
                                    <label className="block text-[10px] font-black text-indigo-400 uppercase tracking-[0.2em] mb-1 ml-1">Date of Birth</label>
                                    <input
                                        required
                                        type="date"
                                        value={formData.dob}
                                        onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                                        className="w-full p-4 bg-slate-800/50 rounded-2xl border border-slate-700 text-white placeholder:text-gray-500 focus:bg-slate-800 focus:border-indigo-500/50 focus:ring-4 focus:ring-indigo-500/10 transition-all outline-none"
                                    />
                                </div>
                                <div className="space-y-2 md:col-span-2">
                                    <label className="block text-[10px] font-black text-indigo-400 uppercase tracking-[0.2em] mb-1 ml-1">Full Address</label>
                                    <input
                                        required
                                        placeholder="State, City, Street, etc."
                                        value={formData.address}
                                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                        className="w-full p-4 bg-slate-800/50 rounded-2xl border border-slate-700 text-white placeholder:text-gray-500 focus:bg-slate-800 focus:border-indigo-500/50 focus:ring-4 focus:ring-indigo-500/10 transition-all outline-none"
                                    />
                                </div>
                            </div>

                            <div className="pt-4">
                                <button className="w-full relative group overflow-hidden bg-indigo-600 text-white font-black py-5 rounded-[1.5rem] hover:bg-indigo-700 transition-all duration-500 flex items-center justify-center gap-3 active:scale-95 shadow-2xl shadow-indigo-600/20">
                                    <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                                    <CheckCircle size={22} className="group-hover:rotate-12 transition-transform" />
                                    <span className="uppercase tracking-[0.2em] text-sm">Submit Application</span>
                                </button>
                                <p className="text-center text-[10px] text-gray-500 mt-6 uppercase tracking-widest opacity-50">By submitting, you agree to our contact terms</p>
                            </div>
                        </form>
                    )}
                </div>
            </motion.div>
        </section>
    )
}

export default EnrollmentFormPage
