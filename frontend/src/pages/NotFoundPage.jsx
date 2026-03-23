import { Link } from 'react-router-dom'
import { ArrowLeft, Home } from 'lucide-react'
import { motion } from 'framer-motion'
import React from 'react'

const NotFoundPage = () => {
  return (
    <div className="min-h-screen pt-16 relative bg-white overflow-hidden flex items-center justify-center px-4">

      {/* Background Effects */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-indigo-600/10 rounded-full blur-[120px]" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[120px]" />

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
        className="relative max-w-lg w-full text-center z-10"
      >
        <div className="relative w-40 h-40 mx-auto mb-8">
          <div className="absolute inset-0 bg-indigo-500 blur-2xl opacity-30 animate-pulse" />
          <div className="relative w-full h-full bg-gradient-to-br from-indigo-500 to-cyan-500 rounded-3xl flex items-center justify-center shadow-2xl rotate-3 hover:rotate-6 transition-transform duration-500">
            <span className="text-6xl font-black text-slate-900">404</span>
          </div>
        </div>

        <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
          Page Not Found
        </h1>

        <p className="text-lg text-gray-400 mb-10 leading-relaxed">
          The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
        </p>

        <Link
          to="/"
          className="inline-flex items-center space-x-3 px-8 py-4 bg-white text-indigo-900 font-bold rounded-xl shadow-lg hover:bg-gray-100 hover:scale-105 transition-all duration-300"
        >
          <Home size={20} />
          <span>Back to Home</span>
        </Link>
      </motion.div>
    </div>
  )
}

export default NotFoundPage
