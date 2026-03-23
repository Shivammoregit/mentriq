
import React from 'react'
import { Link } from 'react-router-dom'
import { useMotionValue, useSpring, useTransform } from 'framer-motion'
import { ArrowRight, Sparkles } from 'lucide-react'

import { getCourseImageUrl } from '../../utils/imageUtils'

const CourseCard = ({ course, baseUrl = '/courses' }) => {
  // 3D Tilt Logic
  const x = useMotionValue(0)
  const y = useMotionValue(0)

  const mouseXSpring = useSpring(x)
  const mouseYSpring = useSpring(y)

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["10deg", "-10deg"])
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-10deg", "10deg"])

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const width = rect.width
    const height = rect.height
    const mouseX = e.clientX - rect.left
    const mouseY = e.clientY - rect.top
    const xPct = mouseX / width - 0.5
    const yPct = mouseY / height - 0.5
    x.set(xPct)
    y.set(yPct)
  }

  const handleMouseLeave = () => {
    x.set(0)
    y.set(0)
  }

  const getLevelColor = (level) => {
    const colors = {
      Beginner: 'bg-green-500',
      Intermediate: 'bg-yellow-500',
      Advanced: 'bg-purple-500'
    }
    return colors[level] || 'bg-gray-500'
  }

  return (
    <div
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative h-full group"
    >
      <div
        style={{
          transform: "translateZ(50px)",
          transformStyle: "preserve-3d",
        }}
        className="group flex flex-col h-full bg-white rounded-3xl shadow-xl hover:shadow-2xl overflow-hidden border border-gray-200 hover:border-indigo-300 transition-all duration-500 cursor-pointer"
      >
        <div className="h-64 relative overflow-hidden">
          <img
            src={getCourseImageUrl(course)}
            alt={course.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
            onError={(e) => {
              e.currentTarget.src = '/images/learning4.jpg'
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/20 to-transparent" />

          {/* Glint Effect */}
          <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/10 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />

          <div className="absolute top-6 left-6 z-10" style={{ transform: "translateZ(30px)" }}>
            <span className={`px-4 py-2 rounded-full text-white font-bold text-sm shadow-lg ${getLevelColor(course.level)}`}>
              {course.level}
            </span>
          </div>

          <div className="absolute top-6 right-6 z-10 opacity-0 group-hover:opacity-100 transition-opacity" style={{ transform: "translateZ(40px)" }}>
            <div className="bg-white/20 backdrop-blur-md p-2 rounded-full border border-white/30 text-slate-900 shadow-xl animate-bounce">
              <Sparkles size={20} />
            </div>
          </div>
        </div>

        <div className="p-8 flex flex-col flex-grow" style={{ transform: "translateZ(20px)" }}>
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-indigo-600 uppercase tracking-widest bg-indigo-50 px-3 py-1 rounded-lg">
              {course.duration || '12 weeks'}
            </span>
            <div className="flex items-center text-yellow-500">
              {[...Array(5)].map((_, i) => (
                <Sparkles key={i} size={14} className="fill-yellow-500" />
              ))}
            </div>
          </div>

          <h3 className="text-2xl font-bold text-gray-900 mb-6 group-hover:text-indigo-600 transition-colors line-clamp-2 leading-tight">
            {course.title}
          </h3>

          <div className="flex items-center justify-between mb-8">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">
              {course.type === 'internship' ? 'Internship Opportunity' : 'Training Program'}
            </span>
          </div>

          <Link
            to={`${baseUrl}/${course._id}`}
            className="mt-auto w-full text-center bg-[#51B3EA] hover:bg-[#3DA0D8] text-white font-bold py-4 px-6 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 flex items-center justify-center space-x-3 group/btn"
          >
            <span>{course.type === 'internship' ? 'Apply Now' : 'Explore Program'}</span>
            <ArrowRight size={20} className="group-hover/btn:translate-x-2 transition-transform" />
          </Link>
        </div>

      </div>
    </div>
  )
}

export default CourseCard
