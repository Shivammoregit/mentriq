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

const CourseDetailPage = () => {
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
    navigate(`/enroll/${id}`);
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
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Course not found</h2>
        <button
          onClick={() => navigate('/courses')}
          className="px-6 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition"
        >
          Back to Courses
        </button>
      </div>
    )
  }

  const { title, description, level, duration, instructor, modules = [] } = course

  return (
    <div className="min-h-screen bg-gray-50 pt-0">

      {/* Course Hero */}
      <section className="relative bg-[#0f172a] text-white py-16 pt-28 overflow-hidden">
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
              className="group flex items-center gap-2 text-gray-400 hover:text-white mb-8 transition-colors"
            >
              <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
              Back to Courses
            </button>

            <div className="flex flex-wrap gap-3 mb-6">
              <span className="px-4 py-1.5 rounded-full bg-indigo-500/20 text-indigo-300 text-sm font-medium border border-indigo-500/30">
                {level} Level
              </span>
              <span className="px-4 py-1.5 rounded-full bg-emerald-500/20 text-emerald-300 text-sm font-medium border border-emerald-500/30">
                Certified Course
              </span>
            </div>

            <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold leading-tight mb-5">
              {title}
            </h1>

            <p className="text-lg md:text-xl text-gray-300 mb-6 leading-relaxed max-w-2xl">
              {description}
            </p>

            <div className="flex flex-wrap gap-8 text-gray-300 mb-10">
              <div className="flex items-center gap-3">
                <Clock className="text-indigo-400" size={20} />
                <span className="font-medium">{duration}</span>
              </div>
              <div className="flex items-center gap-3">
                <User className="text-indigo-400" size={20} />
                <span className="font-medium">By {instructor}</span>
              </div>
              <div className="flex items-center gap-3">
                <BookOpen className="text-indigo-400" size={20} />
                <span className="font-medium">{modules.length} Modules</span>
              </div>
            </div>

            <div className="flex flex-wrap gap-4">
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
                    <Play size={24} fill="currentColor" />
                    Enroll Now
                  </>
                )}
              </button>
              {course.syllabusUrl && (
                <a
                  href={course.syllabusUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-8 py-4 rounded-xl bg-white/5 border border-white/10 text-white font-bold hover:bg-white/10 transition flex items-center gap-2"
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
                e.target.src = 'https://via.placeholder.com/800x600/3b82f6/ffffff?text=MentriQ+Course';
              }}
            />
            {course.brochureImageUrl && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="relative bg-white/5 backdrop-blur-xl border border-white/10 p-2 rounded-3xl overflow-hidden group shadow-2xl"
              >
                <div className="absolute inset-0 bg-indigo-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <img
                  src={course.brochureImageUrl}
                  alt="Official Brochure"
                  className="w-full h-auto rounded-2xl transition-transform duration-700 group-hover:scale-[1.02]"
                />
                <div className="absolute bottom-6 left-6 right-6">
                  <div className="bg-black/40 backdrop-blur-md border border-white/10 p-4 rounded-2xl flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center">
                        <Layers className="text-white" size={20} />
                      </div>
                      <div>
                        <p className="text-white font-bold text-sm">Course Brochure</p>
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

      {/* Course Content */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid lg:grid-cols-3 gap-12">

          {/* Left: Curriculum */}
          <div className="lg:col-span-2">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 flex items-center gap-3">
              <BookOpen className="text-indigo-600" />
              Course Curriculum
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
                        Comprehensive detailed module covered in live sessions.
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Instructor */}
            <div className="mt-16 bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">
                Your Instructor
              </h3>
              <div className="flex items-center gap-6">
                <div className="w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 text-2xl font-bold">
                  {instructor ? instructor.charAt(0) : 'M'}
                </div>
                <div>
                  <h4 className="text-xl font-bold text-gray-900">{instructor || 'MentriQ Expert'}</h4>
                  <p className="text-indigo-600 font-medium">Senior Developer & Mentor</p>
                  <p className="text-gray-500 mt-2 text-sm max-w-md">
                    {instructor} has over 5+ years of experience in the industry and has trained 2000+ students in {title}.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Sticky Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-28 space-y-8">
              <div className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100">
                <h3 className="text-xl font-bold text-gray-900 mb-6">
                  What We Provide
                </h3>
                <ul className="space-y-4">
                  {[
                    { icon: Clock, text: duration + " Live Training" },
                    { icon: Play, text: "Life time Access" },
                    { icon: Award, text: "Certificate of Completion" },
                    { icon: Shield, text: "Job Assistance" },
                    { icon: User, text: "1-on-1 Mentorship" }
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

export default CourseDetailPage
