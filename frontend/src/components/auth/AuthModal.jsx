import React, { useState, useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

import { X, Mail, Lock, User, Eye, EyeOff } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { useNavigate } from 'react-router-dom'

const AuthModal = ({ isOpen, onClose, initialTab = 'login' }) => {
  const [isLogin, setIsLogin] = useState(initialTab === 'login')
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)

  const { login, register } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    setIsLogin(initialTab === 'login')
  }, [initialTab])

  useEffect(() => {
    if (!isOpen) {
      setFormData({ name: '', email: '', password: '' })
      setErrors({})
    }
  }, [isOpen])

  const validateForm = () => {
    const newErrors = {}
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

    if (!formData.email) newErrors.email = 'Email is required'
    else if (!regex.test(formData.email)) newErrors.email = 'Email is invalid'

    if (!formData.password) newErrors.password = 'Password is required'
    else if (formData.password.length < 6)
      newErrors.password = 'Password must be at least 6 characters'

    if (!isLogin && !formData.name) newErrors.name = 'Name is required'

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validateForm()) return

    setLoading(true)
    setErrors({})

    try {
      let result
      if (isLogin) {
        result = await login(formData.email, formData.password)
      } else {
        result = await register(formData.name, formData.email, formData.password)
      }

      if (result.success) {
        setFormData({ name: '', email: '', password: '' })

        onClose()

        navigate('/')
      } else {
        setErrors({ general: result.message })
      }
    } catch (error) {
      setErrors({ general: error.response?.data?.message || 'Something went wrong' })
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-white/40 backdrop-blur-md z-50 flex items-center justify-center px-4 top-16"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.94, opacity: 0, y: 24 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          className="w-full max-w-md bg-white/95 backdrop-blur-3xl rounded-[2.5rem] shadow-[0_25px_50px_-12px_rgba(0,0,0,0.25)] border border-white overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="px-8 pt-8 pb-4">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-3xl overflow-hidden bg-white flex items-center justify-center shadow-lg shadow-indigo-600/30 group-hover:scale-110 transition-all duration-500">
                  <img src="/images/logo1.jpg" alt="MentriQ" className="w-full h-full object-cover rounded-3xl" />
                </div>
                <div>
                  <h2 className="text-3xl font-black bg-gradient-to-r from-indigo-600 to-cyan-600 bg-clip-text text-transparent tracking-tighter">
                    {isLogin ? 'Welcome Back' : 'Join MentriQ'}
                  </h2>
                  <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 mt-1">Authentication Flow</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2.5 hover:bg-gray-100 rounded-2xl transition-all group"
              >
                <X size={20} className="text-gray-400 group-hover:text-gray-900 group-hover:rotate-90 transition-transform duration-300" />
              </button>
            </div>

            {/* Tabs */}
            <div className="flex p-1 bg-gray-50 rounded-2xl border border-gray-100 mb-2">
              <button
                onClick={() => setIsLogin(true)}
                className={`flex-1 py-3 rounded-xl font-bold transition-all duration-300 ${isLogin
                  ? 'bg-white text-indigo-600 shadow-sm'
                  : 'text-gray-400 hover:text-gray-600'
                  }`}
              >
                Login
              </button>
              <button
                onClick={() => setIsLogin(false)}
                className={`flex-1 py-3 rounded-xl font-bold transition-all duration-300 ${!isLogin
                  ? 'bg-white text-indigo-600 shadow-sm'
                  : 'text-gray-400 hover:text-gray-600'
                  }`}
              >
                Register
              </button>
            </div>
          </div>

          {/* Form */}
          <form
            onSubmit={handleSubmit}
            className="px-8 pb-10 space-y-5"
          >
            {!isLogin && (
              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-indigo-400 ml-1">
                  Full Name
                </label>
                <div className="relative group">
                  <User className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-600 transition-colors" size={20} />
                  <input
                    type="text"
                    placeholder="Enter your name"
                    value={formData.name}
                    autoComplete="off"
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className={`w-full pl-14 pr-6 py-4.5 rounded-2xl bg-gray-50/50 border border-gray-100 focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all font-bold text-gray-800 placeholder:text-gray-300 ${errors.name ? 'border-red-300 focus:ring-red-500' : ''
                      }`}
                  />
                </div>
                {errors.name && <p className="mt-1 text-[10px] font-black uppercase tracking-widest text-red-500">{errors.name}</p>}
              </div>
            )}

            {/* Email */}
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-indigo-400 ml-1">Email Address</label>
              <div className="relative group">
                <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-600 transition-colors" size={20} />
                <input
                  type="email"
                  placeholder="your@email.com"
                  value={formData.email}
                  autoComplete="off"
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className={`w-full pl-14 pr-6 py-4.5 rounded-2xl bg-gray-50/50 border border-gray-100 focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all font-bold text-gray-800 placeholder:text-gray-300 ${errors.email ? 'border-red-300 focus:ring-red-500' : ''
                    }`}
                />
              </div>
              {errors.email && <p className="mt-1 text-[10px] font-black uppercase tracking-widest text-red-500">{errors.email}</p>}
            </div>

            {/* Password */}
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-indigo-400 ml-1">Password</label>
              <div className="relative group">
                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-600 transition-colors" size={20} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter Your Password"
                  value={formData.password}
                  autoComplete="new-password"
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className={`w-full pl-14 pr-12 py-4.5 rounded-2xl bg-gray-50/50 border border-gray-100 focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all font-bold text-gray-800 placeholder:text-gray-300 ${errors.password ? 'border-red-300 focus:ring-red-500' : ''
                    }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-indigo-600 transition-colors"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {errors.password && <p className="mt-1 text-[10px] font-black uppercase tracking-widest text-red-500">{errors.password}</p>}
            </div>

            {/* General errors */}
            {errors.general && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3"
              >
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                <p className="text-red-800 text-xs font-bold">{errors.general}</p>
              </motion.div>
            )}

            {/* Submit button */}
            <button
              type="submit"
              disabled={loading}
              onMouseMove={() => {}}
              className="relative w-full overflow-hidden bg-gradient-to-r from-indigo-600 to-indigo-700 text-white font-black py-5 px-8 rounded-2xl shadow-[0_15px_30px_rgba(79,70,229,0.3)] hover:shadow-[0_20px_40px_rgba(79,70,229,0.4)] transition-all flex items-center justify-center space-x-3 group disabled:opacity-50"
            >
              {loading ? (
                <>
                  <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>{isLogin ? 'AUTHENTICATING...' : 'CREATING IDENTITY...'}</span>
                </>
              ) : (
                <>
                  <span>{isLogin ? 'LOGIN TO PLATFORM' : 'CREATE ACCOUNT'}</span>
                </>
              )}
            </button>

            {/* Toggle login/register */}
            <div className="text-center pt-2">
              <p className="text-sm text-gray-500 font-bold">
                {isLogin ? "New to MentriQ?" : "Already an explorer?"}{' '}
                <button
                  type="button"
                  onClick={() => setIsLogin(!isLogin)}
                  className="text-indigo-600 hover:text-cyan-600 transition-colors"
                >
                  {isLogin ? 'Join the community' : 'Sign in back'}
                </button>
              </p>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

export default AuthModal
