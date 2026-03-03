import React, { useEffect, useState } from "react"
import { apiClient as api } from "../utils/apiClient"
import { motion } from "framer-motion"

const MyEnrollmentsPage = () => {
  const [enrollments, setEnrollments] = useState([])

  useEffect(() => {
    api.get("/enrollments/my")
      .then(res => setEnrollments(res.data))
  }, [])

  return (
    <section className="min-h-screen bg-gradient-to-br from-indigo-50 to-cyan-50 p-10 pt-28">
      <h1 className="text-4xl font-black mb-10 uppercase tracking-tighter text-slate-900">My Enrollments</h1>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {(Array.isArray(enrollments) ? enrollments : []).map((e, i) => (
          <motion.div
            key={e._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white rounded-[2.5rem] shadow-xl p-8 hover:shadow-2xl transition-all border border-slate-100 group"
          >
            <div className="text-[10px] font-black uppercase tracking-widest text-indigo-500 mb-2">Program Active</div>
            <h2 className="text-2xl font-black text-slate-900 mb-3 group-hover:text-indigo-600 transition-colors uppercase leading-tight">{e.course?.title}</h2>
            <p className="text-gray-500 text-sm leading-relaxed mb-6 font-medium line-clamp-3">{e.course?.description}</p>

            <div className="space-y-3 pt-6 border-t border-slate-50">
              <p className="flex justify-between items-center text-sm">
                <span className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Duration</span>
                <span className="text-indigo-600 font-black">{e.course?.duration}</span>
              </p>
              <p className="flex justify-between items-center text-sm">
                <span className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Level</span>
                <span className="text-indigo-600 font-black uppercase">{e.course?.level}</span>
              </p>
            </div>
          </motion.div>
        ))}
        {enrollments.length === 0 && (
          <div className="col-span-full py-20 text-center bg-white/50 backdrop-blur-md rounded-[3rem] border border-dashed border-slate-300">
            <p className="text-slate-400 font-bold uppercase tracking-widest">No active enrollments found.</p>
          </div>
        )}
      </div>
    </section>
  )
}

export default MyEnrollmentsPage
