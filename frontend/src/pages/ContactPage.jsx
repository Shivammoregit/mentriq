import React, { useState } from 'react'
import { Mail, Phone, MapPin, Send, Instagram, Linkedin, Twitter, User, Tag, MessageSquare, MessageCircle, Sparkles, Facebook } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { apiClient as api } from '../utils/apiClient'

import { useSiteData } from '../context/SiteContext';

const ContactPage = () => {
  const { settings: globalSettings } = useSiteData();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  })
  const [submitted, setSubmitted] = useState(false)

  const settings = React.useMemo(() => ({
    email: globalSettings?.email || "support@mentriqtechnologies.in",
    phone: globalSettings?.phone || "+918890301264",
    address: globalSettings?.address || "MentriQ Technologies, 2nd floor, 34/501, Haldighati Marg E, Sanganer, Sector 3, Pratap Nagar, Jaipur, Rajasthan 302033",
    mapLink: globalSettings?.mapLink || "https://www.google.com/maps/place/MentriQ+Technologies/@26.8020093,75.4882598,10z/data=!4m22!1m15!4m14!1m6!1m2!1s0x396dcb31ccbce14d:0x9f153a03ffb8fdd0!2sMentriQ+Technologies,+2nd+floor,+34%2F501,+Haldighati+Marg+E,+Sanganer,+Sector+3,+Pratap+Nagar,+Jaipur,+Rajasthan+302033!2m2!1d75.8047414!2d26.8023101!1m6!1m2!1s0x396dcb31ccbce14d:0x9f153a03ffb8fdd0!2sMentriQ+Technologies,+2nd+floor,+34%2F501,+Haldighati+Marg+E,+Sanganer,+Sector+3,+Pratap+Nagar,+Jaipur,+Rajasthan+302033!2m2!1d75.8047414!2d26.8023101!3m5!1s0x396dcb31ccbce14d:0x9f153a03ffb8fdd0!8m2!3d26.8023101!4d75.8047414!16s%2Fg%2F11yy2ld3gd?entry=ttu&g_ep=EgoyMDI2MDMxOC4xIKXMDSoASAFQAw%3D%3D",
    socialLinks: {
      instagram: globalSettings?.socialLinks?.instagram || "https://www.instagram.com/mentriqtechnologies/",
      linkedin: globalSettings?.socialLinks?.linkedin || "https://www.linkedin.com/company/mentriqtechnologies/",
      twitter: globalSettings?.socialLinks?.twitter || "https://x.com/MentriqT51419",
      whatsapp: globalSettings?.socialLinks?.whatsapp || "https://wa.me/918890301264",
      facebook: globalSettings?.socialLinks?.facebook || "https://www.facebook.com/profile.php?id=61588480116895"
    }
  }), [globalSettings]);

  const phoneNumber = settings.phone;
  const email = settings.email;
  const mapsLink = settings.mapLink;

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      await api.post('/contact', formData)
      setSubmitted(true)
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' })
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const contactCards = [
    {
      icon: Mail,
      title: 'Secure Email',
      value: email,
      link: `mailto:${email}`,
      desc: 'Inquiry & Support',
      iconClass: 'bg-indigo-50 border-indigo-100 text-indigo-600',
      hoverIconClass: 'group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300'
    },
    {
      icon: Phone,
      title: 'Direct Line',
      value: phoneNumber,
      link: `tel:${phoneNumber}`,
      desc: 'Priority Channel',
      iconClass: 'bg-cyan-50 border-cyan-100 text-cyan-600',
      hoverIconClass: 'group-hover:bg-cyan-600 group-hover:text-white transition-all duration-300'
    },
    {
      icon: MapPin,
      title: 'HQ Location',
      value: settings.address,
      link: mapsLink,
      desc: 'Global Operations',
      iconClass: 'bg-emerald-50 border-emerald-100 text-emerald-600',
      hoverIconClass: 'group-hover:bg-emerald-600 group-hover:text-white transition-all duration-300'
    }
  ];

  return (
    <div className="min-h-screen pt-0 bg-white selection:bg-indigo-500/20">
      {/* Contact Hero Section - Light */}
      <section className="relative min-h-[40vh] flex items-center bg-white overflow-hidden pt-24 pb-12">
        {/* Advanced Atmospheric Background */}
        <div className="absolute inset-0 pointer-events-none">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.5 }}
            className="absolute top-0 right-0 w-[800px] h-[800px] bg-indigo-100/60 rounded-full blur-[140px]"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.5, delay: 0.2 }}
            className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-cyan-100/50 rounded-full blur-[120px]"
          />
        </div>

        <div className="relative max-w-7xl mx-auto px-6 text-center z-10 w-full">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-4xl md:text-6xl lg:text-7xl font-black mb-8 tracking-tighter uppercase font-display leading-[0.9] text-slate-900"
          >
            LET'S INITIALIZE <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-500">
              CONVERSATION.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-sm md:text-lg max-w-3xl mx-auto mb-10 text-slate-500 leading-relaxed font-medium"
          >
            Our dedicated engineering team is ready to architect your vision. <br />
            Reach out to establish a <span className="text-slate-900 font-bold">direct link</span> with our mentors.
          </motion.p>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 relative z-20 -mt-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 xl:gap-14">
          {/* Contact Info Cards */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <div className="mb-10 pt-8">
              <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-4 tracking-tighter uppercase leading-none">
                Get in <span className="text-indigo-600">Touch</span>
              </h2>
              <p className="text-base text-slate-600 font-medium leading-relaxed max-w-md">
                Reach out via our secure channels. Our response team is standing by for <span className="text-slate-900 font-bold">real-time</span> support.
              </p>
            </div>

            <div className="space-y-6">
              {contactCards.map((item, idx) => (
                <motion.a
                  key={idx}
                  href={item.link}
                  target={item.link.startsWith('http') ? '_blank' : '_self'}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  className="flex items-center space-x-6 p-8 rounded-[2rem] bg-white border border-slate-100 shadow-2xl shadow-slate-200/50 hover:shadow-indigo-500/10 hover:border-indigo-500/20 transition-all duration-500 group relative overflow-hidden"
                >
                  <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-indigo-500 to-transparent opacity-[0.03] rounded-bl-[100%] transition-transform group-hover:scale-125`} />

                  <div className={`w-16 h-16 rounded-2xl flex items-center justify-center shrink-0 border transition-all duration-500 shadow-lg relative overflow-hidden ${item.iconClass} ${item.hoverIconClass}`}>
                    <item.icon size={28} strokeWidth={2.5} className="relative z-10" />
                  </div>

                  <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-1.5 font-display">
                      <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-600 group-hover:text-indigo-600 transition-colors leading-none">{item.title}</h3>
                      <div className="h-1 w-1 bg-slate-200 rounded-full" />
                      <span className="text-[10px] font-bold text-slate-700 italic tracking-wider">{item.desc}</span>
                    </div>
                    <p className="text-lg md:text-xl text-slate-900 font-black tracking-tight">{item.value}</p>
                  </div>
                </motion.a>
              ))}
            </div>

            <div className="pt-8 flex gap-4">
              {[
                { icon: Instagram, color: 'hover:bg-pink-600', link: settings.socialLinks.instagram },
                { icon: Linkedin, color: 'hover:bg-blue-700', link: settings.socialLinks.linkedin },
                { icon: Twitter, color: 'hover:bg-sky-600', link: settings.socialLinks.twitter },
                { icon: MessageCircle, color: 'hover:bg-green-600', link: settings.socialLinks.whatsapp },
                { icon: Facebook, color: 'hover:bg-blue-600', link: settings.socialLinks.facebook }
              ].map((social, idx) => {
                const Icon = social.icon;
                return (
                  <a
                    key={idx}
                    href={social.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`w-12 h-12 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-600 ${social.color} hover:text-slate-900 shadow-lg shadow-slate-200/40 transition-all duration-300 group overflow-hidden`}
                  >
                    <div className="transition-transform duration-300 group-hover:scale-110">
                      <Icon size={20} />
                    </div>
                  </a>
                );
              })}
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            whileHover={{ scale: 1.015 }}
            className="relative group"
          >
            <motion.div
              className="rounded-[2.5rem] p-8 md:p-12 bg-white border border-slate-100 shadow-[0_20px_50px_rgba(0,0,0,0.08)] group-hover:shadow-[0_28px_70px_rgba(99,102,241,0.16)] group-hover:border-indigo-200 transition-all duration-500 relative z-10"
            >
              <div className="absolute -inset-2 rounded-[2.75rem] bg-gradient-to-r from-indigo-500/0 via-indigo-500/10 to-cyan-500/0 opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-100 pointer-events-none" />
              <div className="relative">
                <div className="mb-10">
                  <h2 className="text-3xl font-black text-slate-900 mb-2 tracking-tight">
                    Send a Message
                  </h2>
                  <p className="text-slate-600 font-bold uppercase tracking-widest text-[10px]">We'll get back to you shortly</p>
                </div>

                <AnimatePresence mode="wait">
                  {submitted ? (
                    <motion.div
                      key="success"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="text-center py-16"
                    >
                      <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner">
                        <Send className="w-10 h-10 text-green-600" />
                      </div>
                      <h3 className="text-3xl font-black text-slate-900 mb-3 tracking-tighter uppercase">Message Sent!</h3>
                      <p className="text-slate-500 font-medium mb-10 max-w-xs mx-auto">Thank you for reaching out. Our team will review your message and contact you soon.</p>
                      <button
                        onClick={() => setSubmitted(false)}
                        className="px-8 py-4 bg-slate-100 text-slate-900 rounded-xl font-black text-xs tracking-widest uppercase hover:bg-white transition shadow-xl"
                      >
                        Send Another
                      </button>
                    </motion.div>
                  ) : (
                    <motion.form
                      key="form"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      onSubmit={handleSubmit}
                      className="space-y-6"
                    >
                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-600 ml-1">Identity</label>
                          <div className="relative group/input">
                            <User className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-700 group-focus-within/input:text-indigo-500 transition-colors" size={18} />
                            <input
                              type="text"
                              required
                              value={formData.name}
                              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                              className="w-full pl-14 pr-6 py-4 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/5 transition-all font-bold text-slate-900 placeholder:text-slate-700 shadow-sm text-sm"
                              placeholder="Full Name"
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-600 ml-1">Comms Hub</label>
                          <div className="relative group/input">
                            <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-700 group-focus-within/input:text-indigo-500 transition-colors" size={18} />
                            <input
                              type="email"
                              required
                              value={formData.email}
                              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                              className="w-full pl-14 pr-6 py-4 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/5 transition-all font-bold text-slate-900 placeholder:text-slate-700 shadow-sm text-sm"
                              placeholder="Email Address"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-600 ml-1">Terminal ID</label>
                          <div className="relative group/input">
                            <Phone className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-700 group-focus-within/input:text-indigo-500 transition-colors" size={18} />
                            <input
                              type="tel"
                              required
                              value={formData.phone}
                              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                              className="w-full pl-14 pr-6 py-4 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/5 transition-all font-bold text-slate-900 placeholder:text-slate-700 shadow-sm text-sm"
                              placeholder="Phone Number"
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-600 ml-1">Priority</label>
                          <div className="relative group/input">
                            <Tag className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-700 group-focus-within/input:text-indigo-500 transition-colors" size={18} />
                            <input
                              type="text"
                              required
                              value={formData.subject}
                              onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                              className="w-full pl-14 pr-6 py-4 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/5 transition-all font-bold text-slate-900 placeholder:text-slate-700 shadow-sm text-sm"
                              placeholder="Inquiry Type"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-600 ml-1">Message</label>
                        <div className="relative group/input">
                          <MessageSquare className="absolute left-5 top-6 text-slate-700 group-focus-within/input:text-indigo-500 transition-colors" size={18} />
                          <textarea
                            rows="4"
                            required
                            value={formData.message}
                            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                            className="w-full pl-14 pr-6 py-4 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/5 transition-all font-bold text-slate-900 placeholder:text-slate-700 resize-none shadow-sm text-sm"
                            placeholder="Describe your requirements..."
                          />
                        </div>
                      </div>

                      {error && (
                        <div className="p-4 bg-rose-50 text-rose-600 rounded-xl text-[10px] font-black uppercase tracking-widest border border-rose-100 flex items-center gap-3">
                          <div className="w-1.5 h-1.5 bg-rose-600 rounded-full animate-pulse" />
                          {error}
                        </div>
                      )}

                      <button
                        type="submit"
                        disabled={loading}
                        className={`w-full py-5 text-white font-black rounded-xl transition-all relative overflow-hidden group/btn ${loading
                          ? 'bg-slate-400 cursor-not-allowed'
                          : 'bg-indigo-600 hover:bg-indigo-700 shadow-xl shadow-indigo-500/20'
                          }`}
                      >
                        {loading ? (
                          <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto" />
                        ) : (
                          <div className="flex items-center justify-center gap-3 text-sm tracking-widest uppercase relative z-10">
                            <span>Send Message</span>
                            <Send size={18} className="transition-transform group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1" />
                          </div>
                        )}

                        {/* Animated Gradient Shine */}
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full transition-transform duration-1000 group-hover/btn:translate-x-full" />
                      </button>
                    </motion.form>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default ContactPage
