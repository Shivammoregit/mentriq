import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { Menu, X, LogOut, Phone } from 'lucide-react'
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from 'motion/react'
import AuthModal from '../auth/AuthModal'


const Navbar = () => {
    const [mobileOpen, setMobileOpen] = useState(false)
    const [isShrunk, setIsShrunk] = useState(false)
    const { scrollY } = useScroll()
    const {
        user,
        logout,
        isAuthenticated,
        isAuthModalOpen,
        closeAuthModal
    } = useAuth()
    const location = useLocation()
    const isDarkPage = ['/services', '/about', '/courses', '/training', '/recruit'].includes(location.pathname)

    useMotionValueEvent(scrollY, "change", (latest) => {
        setIsShrunk(latest > 50);
    })

    const navItems = [
        { name: 'Home', path: '/' },
        { name: 'About', path: '/about' },
        { name: 'Services', path: '/services' },
        { name: 'Courses', path: '/courses' },
        { name: 'Internships', path: '/training' },
        { name: 'Recruit', path: '/recruit' },
    ]

    return (
        <>
            <AuthModal
                isOpen={isAuthModalOpen}
                onClose={closeAuthModal}
                initialTab="login"
            />

            <motion.nav
                initial={{ y: -24, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.35, ease: 'easeOut' }}
                className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isDarkPage
                    ? "bg-[#070b14]/95 backdrop-blur-md shadow-lg border-b border-white/5"
                    : "bg-white/95 backdrop-blur-md shadow-sm border-b border-slate-100"
                    } ${isShrunk ? 'py-2' : 'py-4'}`}
            >
                <div className="max-w-7xl mx-auto px-6 lg:px-8">
                    <div className="flex justify-between items-center transition-all duration-300">

                        {/* Logo / Brand */}
                        <div className="flex items-center gap-3">
                            <Link to="/" className="relative group">
                                <div className={`relative rounded-xl overflow-hidden border shadow-md transition-all duration-300 ${isShrunk ? 'w-10 h-10' : 'w-12 h-12'
                                    } ${isDarkPage ? 'border-white/10 shadow-white/5' : 'border-slate-200 shadow-slate-200/50'}`}>
                                    <img src="/images/logo.jpg" alt="Mentriq" className="w-full h-full object-cover scale-110" />
                                </div>
                            </Link>
                            <Link to="/" className={`font-black tracking-tighter uppercase font-display transition-all duration-300 ${isShrunk ? 'text-lg md:text-xl' : 'text-xl md:text-2xl'
                                } ${isDarkPage ? 'text-white' : 'text-slate-900'}`}>
                                Mentriq <span className="text-indigo-600">Technologies.</span>
                            </Link>
                        </div>

                        {/* Desktop Nav */}
                        <div className="hidden md:flex items-center space-x-1">
                            {navItems.map((item) => (
                                <Link
                                    key={item.name}
                                    to={item.path}
                                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${location.pathname === item.path
                                        ? 'text-indigo-600 bg-indigo-50 font-bold'
                                        : isDarkPage
                                            ? 'text-slate-300 hover:text-white hover:bg-white/10'
                                            : 'text-slate-500 hover:text-indigo-600 hover:bg-slate-50'
                                        }`}
                                >
                                    {item.name}
                                </Link>
                            ))}
                            {(user?.role === 'admin' || user?.role === 'superadmin') && (
                                <Link
                                    to="/admin/dashboard"
                                    className={`px-4 py-2 rounded-lg text-sm font-bold transition-all duration-300 ${location.pathname.startsWith('/admin')
                                        ? 'text-emerald-600 bg-emerald-50'
                                        : isDarkPage
                                            ? 'text-emerald-400 hover:text-emerald-300 hover:bg-white/10'
                                            : 'text-emerald-600 hover:bg-emerald-50'
                                        }`}
                                >
                                    Admin Portal
                                </Link>
                            )}
                        </div>

                        {/* Auth / CTA */}
                        <div className="hidden md:flex items-center space-x-4">
                            {isAuthenticated ? (
                                <div className="flex items-center gap-4">
                                    <div className="text-right hidden lg:block">
                                        <div className={`text-sm font-bold ${isDarkPage ? 'text-white' : 'text-slate-900'}`}>{user?.name?.split(' ')[0]}</div>
                                        <div className="text-[10px] text-indigo-600 font-black uppercase tracking-wider">{user?.role || 'Student'}</div>
                                    </div>
                                    <button
                                        onClick={logout}
                                        className={`p-2 rounded-full transition-colors ${isDarkPage
                                            ? 'text-slate-400 hover:text-rose-400 hover:bg-white/5'
                                            : 'text-slate-400 hover:text-rose-500 hover:bg-rose-50'
                                            }`}
                                        title="Logout"
                                    >
                                        <LogOut size={20} />
                                    </button>
                                </div>
                            ) : (
                                <Link to="/contact">
                                    <motion.button
                                        whileHover={{ scale: 1.03 }}
                                        whileTap={{ scale: 0.98 }}
                                        animate={{
                                            boxShadow: ["0px 0px 0px rgba(99, 102, 241, 0)", "0px 0px 20px rgba(99, 102, 241, 0.3)", "0px 0px 0px rgba(99, 102, 241, 0)"],
                                        }}
                                        transition={{
                                            boxShadow: {
                                                duration: 2,
                                                repeat: Infinity,
                                                ease: "easeInOut"
                                            }
                                        }}
                                        className="px-6 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-bold hover:bg-indigo-700 transition-colors flex items-center gap-2"
                                    >
                                        <span>Contact Us</span>
                                        <Phone size={16} className="fill-white/20" />
                                    </motion.button>
                                </Link>
                            )}
                        </div>

                        {/* Mobile Toggle */}
                        <button
                            className={`md:hidden p-2 transition-colors ${isDarkPage ? 'text-slate-200 hover:text-white' : 'text-slate-600 hover:text-indigo-600'}`}
                            onClick={() => setMobileOpen(!mobileOpen)}
                        >
                            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                <AnimatePresence>
                    {mobileOpen && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className={`md:hidden border-t overflow-hidden ${isDarkPage ? 'bg-[#0b1120] border-white/10' : 'bg-white border-slate-100'}`}
                        >
                            <div className="p-4 flex flex-col space-y-2">
                                {navItems.map((item) => (
                                    <Link
                                        key={item.name}
                                        to={item.path}
                                        onClick={() => setMobileOpen(false)}
                                        className={`px-4 py-3 rounded-xl text-sm font-bold ${location.pathname === item.path
                                            ? 'bg-indigo-500/10 text-indigo-500' // Universal active state
                                            : isDarkPage
                                                ? 'text-slate-400 hover:bg-white/5 hover:text-white'
                                                : 'text-slate-600 hover:bg-slate-50'
                                            }`}
                                    >
                                        {item.name}
                                    </Link>
                                ))}
                                {(user?.role === 'admin' || user?.role === 'superadmin') && (
                                    <Link
                                        to="/admin/dashboard"
                                        onClick={() => setMobileOpen(false)}
                                        className={`px-4 py-3 rounded-xl text-sm font-bold ${location.pathname.startsWith('/admin')
                                            ? 'bg-emerald-500/10 text-emerald-500'
                                            : isDarkPage
                                                ? 'text-emerald-400 hover:bg-white/5 hover:text-white'
                                                : 'text-emerald-600 hover:bg-emerald-50'
                                            }`}
                                    >
                                        Admin Portal
                                    </Link>
                                )}
                                <div className={`pt-4 mt-2 border-t ${isDarkPage ? 'border-white/10' : 'border-slate-100'}`}>
                                    {isAuthenticated ? (
                                        <button
                                            onClick={() => {
                                                logout();
                                                setMobileOpen(false);
                                            }}
                                            className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-bold ${isDarkPage ? 'bg-rose-500/10 text-rose-400' : 'bg-rose-50 text-rose-600'}`}
                                        >
                                            <LogOut size={18} />
                                            Logout
                                        </button>
                                    ) : (
                                        <Link
                                            to="/contact"
                                            onClick={() => setMobileOpen(false)}
                                            className="block w-full"
                                        >
                                            <motion.div
                                                whileTap={{ scale: 0.98 }}
                                                className={`w-full text-center px-4 py-3 bg-indigo-600 text-white rounded-xl text-sm font-bold shadow-lg ${isDarkPage ? 'shadow-indigo-500/20' : 'shadow-indigo-200'}`}
                                            >
                                                Contact Us
                                            </motion.div>
                                        </Link>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.nav>
        </>
    )
}

export default Navbar
