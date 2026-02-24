import React, { useState } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { Mail, Phone, MapPin, Send, Instagram, Linkedin, Twitter, User, Tag, MessageSquare, MessageCircle, Sparkles } from 'lucide-react'
import { apiClient as api } from '../utils/apiClient'

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  })
  const [submitted, setSubmitted] = useState(false)

  const [settings, setSettings] = useState({
    email: "",
    phone: "",
    address: "",
    mapLink: "",
    socialLinks: {
      instagram: "",
      linkedin: "",
      twitter: "",
      whatsapp: ""
    }
  });

  React.useEffect(() => {
    const fetchSettings = async () => {
      try {
        const { data } = await api.get('/settings');
        if (data) {
          setSettings(prev => ({
            ...prev,
            email: data.email || prev.email,
            phone: data.phone || prev.phone,
            address: data.address || prev.address,
            mapLink: data.mapLink || prev.mapLink,
            socialLinks: {
              instagram: data.socialLinks?.instagram || prev.socialLinks.instagram,
              linkedin: data.socialLinks?.linkedin || prev.socialLinks.linkedin,
              twitter: data.socialLinks?.twitter || prev.socialLinks.twitter,
              whatsapp: data.socialLinks?.whatsapp || prev.socialLinks.whatsapp
            }
          }));
        }
      } catch (error) {
        console.error("Failed to fetch settings", error);
      }
    };
    fetchSettings();
  }, []);

  const phoneNumber = settings.phone;
  const email = settings.email;
  const subject = "Support Request";
  const body = "Hello, I need help with...";

  const mailtoLink = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  const mapsLink = settings.mapLink;

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

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
    const xPct = (mouseX / width) - 0.5
    const yPct = (mouseY / height) - 0.5
    x.set(xPct)
    y.set(yPct)
  }

  const handleMouseLeave = () => {
    x.set(0)
    y.set(0)
  }

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
      link: mailtoLink,
      desc: 'Inquiry & Support',
      iconClass: 'bg-indigo-50 border-indigo-100 text-indigo-600',
      hoverIconClass: 'group-hover:bg-indigo-600 group-hover:text-white'
    },
    {
      icon: Phone,
      title: 'Direct Line',
      value: phoneNumber,
      link: `tel:${phoneNumber}`,
      desc: 'Priority Channel',
      iconClass: 'bg-cyan-50 border-cyan-100 text-cyan-600',
      hoverIconClass: 'group-hover:bg-cyan-600 group-hover:text-white'
    },
    {
      icon: MapPin,
      title: 'HQ Location',
      value: settings.address,
      link: mapsLink,
      desc: 'Global Operations',
      iconClass: 'bg-emerald-50 border-emerald-100 text-emerald-600',
      hoverIconClass: 'group-hover:bg-emerald-600 group-hover:text-white'
    }
  ];

  return (
    <div className="min-h-screen pt-0 bg-white selection:bg-indigo-500/20">
      {/* Contact Hero Section - Light */}
      <section className="relative min-h-[50vh] flex items-center bg-white overflow-hidden pt-32 pb-20">
        {/* Advanced Atmospheric Background */}
        <div className="absolute inset-0 pointer-events-none">
          <motion.div
            animate={{ x: [0, 60, -20, 0], y: [0, 30, -30, 0] }}
            transition={{ duration: 14, repeat: Infinity, ease: 'linear' }}
            className="absolute top-0 right-0 w-[800px] h-[800px] bg-indigo-100/60 rounded-full blur-[140px]"
          />
          <motion.div
            animate={{ x: [0, -50, 40, 0], y: [0, 40, -20, 0] }}
            transition={{ duration: 18, repeat: Infinity, ease: 'linear' }}
            className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-cyan-100/50 rounded-full blur-[120px]"
          />
        </div>

        <div className="relative max-w-7xl mx-auto px-6 text-center z-10 w-full">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "circOut" }}
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16 relative z-20 -mt-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 xl:gap-14">
          {/* Contact Info Cards */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <div className="mb-10 pt-8">
              <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-4 tracking-tighter uppercase leading-none">
                Get in <span className="theme-gradient-text">Touch</span>
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
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1, duration: 0.5 }}
                  whileHover={{ y: -8 }}
                  className="flex items-center space-x-6 p-8 rounded-[2rem] bg-white border border-slate-100 shadow-2xl shadow-slate-200/50 hover:shadow-indigo-500/10 hover:border-indigo-500/20 transition-all duration-500 group relative overflow-hidden"
                >
                  <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${item.iconClass.split(' ')[2].replace('text-', 'from-').replace('-600', '-500')} to-transparent opacity-[0.03] rounded-bl-[100%] transition-transform group-hover:scale-125`} />

                  <div className={`w-16 h-16 rounded-2xl flex items-center justify-center shrink-0 border transition-all duration-500 shadow-lg relative overflow-hidden ${item.iconClass}`}>
                    <motion.div
                      whileHover={{ y: -2, scale: 1.1 }}
                      transition={{ type: "spring", stiffness: 400, damping: 25 }}
                    >
                      <item.icon size={28} strokeWidth={2.5} className="relative z-10" />
                    </motion.div>
                  </div>

                  <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-1.5 font-display">
                      <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 group-hover:text-indigo-600 transition-colors leading-none">{item.title}</h3>
                      <div className="h-1 w-1 bg-slate-200 rounded-full" />
                      <span className="text-[10px] font-bold text-slate-300 italic tracking-wider">{item.desc}</span>
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
                { icon: MessageCircle, color: 'hover:bg-green-600', link: settings.socialLinks.whatsapp }
              ].map((social, idx) => (
                <motion.a
                  key={idx}
                  href={social.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`w-12 h-12 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-400 ${social.color} hover:text-white shadow-lg shadow-slate-200/40 transition-all duration-300 group overflow-hidden`}
                >
                  <motion.div
                    whileHover={{ y: -3, scale: 1.2 }}
                    transition={{ type: "spring", stiffness: 400, damping: 25 }}
                  >
                    <social.icon size={20} />
                  </motion.div>
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="relative"
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{ perspective: "1500px" }}
          >
            <motion.div
              style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
              className="rounded-[2.5rem] p-8 md:p-12 bg-white border border-slate-100 shadow-[0_20px_50px_rgba(0,0,0,0.08)] relative z-10"
            >
              <div style={{ transform: "translateZ(50px)" }} className="relative">
                <div className="mb-10">
                  <h2 className="text-3xl font-black text-slate-900 mb-2 tracking-tight">
                    Send a Message
                  </h2>
                  <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">We'll get back to you shortly</p>
                </div>

                {submitted ? (
                  <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="text-center py-16"
                  >
                    <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner">
                      <Send className="w-10 h-10 text-green-600" />
                    </div>
                    <h3 className="text-3xl font-black text-slate-900 mb-3 tracking-tighter uppercase">Message Sent!</h3>
                    <p className="text-slate-500 font-medium mb-10 max-w-xs mx-auto">Thank you for reaching out. Our team will review your message and contact you soon.</p>
                    <button
                      onClick={() => setSubmitted(false)}
                      className="px-8 py-4 bg-slate-900 text-white rounded-xl font-black text-xs tracking-widest uppercase hover:bg-slate-800 transition shadow-xl"
                    >
                      Send Another
                    </button>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Identity</label>
                        <div className="relative group/input">
                          <User className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within/input:text-indigo-500 transition-colors" size={18} />
                          <input
                            type="text"
                            required
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="w-full pl-14 pr-6 py-4 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/5 transition-all font-bold text-slate-900 placeholder:text-slate-300 shadow-sm text-sm"
                            placeholder="Full Name"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Comms Hub</label>
                        <div className="relative group/input">
                          <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within/input:text-indigo-500 transition-colors" size={18} />
                          <input
                            type="email"
                            required
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            className="w-full pl-14 pr-6 py-4 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/5 transition-all font-bold text-slate-900 placeholder:text-slate-300 shadow-sm text-sm"
                            placeholder="Email Address"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Terminal ID</label>
                        <div className="relative group/input">
                          <Phone className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within/input:text-indigo-500 transition-colors" size={18} />
                          <input
                            type="tel"
                            required
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            className="w-full pl-14 pr-6 py-4 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/5 transition-all font-bold text-slate-900 placeholder:text-slate-300 shadow-sm text-sm"
                            placeholder="Phone Number"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Priority</label>
                        <div className="relative group/input">
                          <Tag className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within/input:text-indigo-500 transition-colors" size={18} />
                          <input
                            type="text"
                            required
                            value={formData.subject}
                            onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                            className="w-full pl-14 pr-6 py-4 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/5 transition-all font-bold text-slate-900 placeholder:text-slate-300 shadow-sm text-sm"
                            placeholder="Inquiry Type"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Message</label>
                      <div className="relative group/input">
                        <MessageSquare className="absolute left-5 top-6 text-slate-300 group-focus-within/input:text-indigo-500 transition-colors" size={18} />
                        <textarea
                          rows="4"
                          required
                          value={formData.message}
                          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                          className="w-full pl-14 pr-6 py-4 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/5 transition-all font-bold text-slate-900 placeholder:text-slate-300 resize-none shadow-sm text-sm"
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

                    <motion.button
                      type="submit"
                      disabled={loading}
                      whileHover={!loading ? { scale: 1.02, y: -2, boxShadow: "0 20px 40px -10px rgba(79,70,229,0.3)" } : {}}
                      whileTap={!loading ? { scale: 0.98 } : {}}
                      className={`w-full py-5 text-white font-black rounded-xl transition-all relative overflow-hidden group/btn ${loading
                        ? 'bg-slate-400 cursor-not-allowed'
                        : 'bg-indigo-600'
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
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full transition-transform duration-1000 group-hover/btn:translate-x-full"
                        initial={{ x: "-100%" }}
                      />
                    </motion.button>
                  </form>
                )}
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default ContactPage
