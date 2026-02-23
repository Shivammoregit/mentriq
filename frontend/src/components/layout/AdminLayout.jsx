import React, { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
    LayoutDashboard,
    Users,
    BookOpen,
    GraduationCap,
    Settings,
    LogOut,
    Menu,
    X,
    Bell,
    Search,
    ChevronLeft,
    ChevronRight,
    Briefcase,
    Layers,
    MapPin,
    Handshake,
    Award,
    Mail,
    UserCog,
    MessageSquare,
    Cpu
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { useToast } from '../../context/ToastContext'

const AdminLayout = ({ children }) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true)
    const location = useLocation()
    const navigate = useNavigate()
    const { logout } = useAuth()
    const toast = useToast()

    useEffect(() => {
        if (window.innerWidth < 1024) {
            setIsSidebarOpen(false);
        }
    }, [location.pathname]);

    const menuGroups = [
        {
            title: 'Operations',
            items: [
                { path: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
                { path: '/admin/settings', icon: Settings, label: 'Settings' },
            ]
        },
        {
            title: 'Learning',
            items: [
                { path: '/admin/courses', icon: BookOpen, label: 'Courses' },
                { path: '/admin/internships', icon: Briefcase, label: 'Internships' },
                { path: '/admin/jobs', icon: Briefcase, label: 'Job Board' },
                { path: '/admin/journey', icon: MapPin, label: 'Milestones' },
            ]
        },
        {
            title: 'Stakeholders',
            items: [
                { path: '/admin/users', icon: Users, label: 'Candidates' },
                { path: '/admin/staff', icon: UserCog, label: 'Staff' },
                { path: '/admin/mentors', icon: Users, label: 'Mentors' },
                { path: '/admin/partners', icon: Handshake, label: 'Partners' },
            ]
        },
        {
            title: 'Engagement',
            items: [
                { path: '/admin/enquiries', icon: Mail, label: 'Enquiries' },
                { path: '/admin/feedback', icon: MessageSquare, label: 'Feedback' },
                { path: '/admin/certificates', icon: Award, label: 'Certificates' },
            ]
        },
        {
            title: 'Infrastructure',
            items: [
                { path: '/admin/services', icon: Layers, label: 'Services' },
                { path: '/admin/technologies', icon: Cpu, label: 'Technologies' },
                { path: '/admin/cities', icon: MapPin, label: 'Cities' },
            ]
        }
    ];

    const handleLogout = () => {
        logout()
        navigate('/')
        toast.success('Logged out successfully')
    }

    return (
        <div className="min-h-screen bg-[#030712] text-slate-200 flex overflow-hidden font-sans relative">
            {/* Background Ambient Glows */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-emerald-500/5 blur-[120px] rounded-full animate-pulse" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-sky-500/5 blur-[120px] rounded-full" />
            </div>

            {/* Sidebar */}
            <motion.aside
                initial={false}
                animate={{ width: isSidebarOpen ? 280 : 88 }}
                className={`fixed lg:static inset-y-0 left-0 z-40 glass-premium border-r border-white/5 flex flex-col transition-all duration-300 ${isSidebarOpen ? 'translate-x-0 shadow-2xl lg:shadow-none' : '-translate-x-full lg:translate-x-0'
                    }`}
            >
                {/* Logo Section */}
                <div className="h-20 flex items-center justify-between px-6 border-b border-white/5 bg-white/[0.02]">
                    <div className={`flex items-center gap-3 overflow-hidden ${!isSidebarOpen && 'lg:hidden'}`}>
                        <div className="w-10 h-10 rounded-xl bg-white border border-white/10 flex items-center justify-center shadow-[0_0_20px_rgba(255,255,255,0.1)] overflow-hidden p-1">
                            <img src="/images/logo.jpeg" alt="MentriQ Logo" className="w-full h-full object-contain" />
                        </div>
                        <span className="text-white font-black text-xl tracking-tight whitespace-nowrap theme-gradient-text">MentriQ</span>
                    </div>
                    <button
                        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                        className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-all"
                    >
                        {isSidebarOpen ? <X size={20} className="lg:hidden" /> : <Menu size={20} className="hidden lg:block" />}
                        {isSidebarOpen && <ChevronLeft size={20} className="hidden lg:block" />}
                    </button>
                </div>

                {/* Navigation */}
                <div className="flex-1 overflow-y-auto py-8 px-4 space-y-10 custom-scrollbar">
                    {menuGroups.map((group, groupIdx) => (
                        <div key={groupIdx} className="space-y-4">
                            {isSidebarOpen && (
                                <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500/60 mb-2 px-3">
                                    {group.title}
                                </h4>
                            )}
                            <div className="space-y-1.5 font-display">
                                {group.items.map((item) => {
                                    const Icon = item.icon
                                    const isActive = location.pathname === item.path

                                    return (
                                        <Link
                                            key={item.path}
                                            to={item.path}
                                            className={`flex items-center gap-3 px-3 py-3 rounded-xl transition-all group relative ${isActive
                                                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.1)]'
                                                : 'text-slate-500 hover:text-white hover:bg-white/[0.03] border border-transparent'
                                                }`}
                                        >
                                            <Icon size={20} className={`shrink-0 transition-colors ${isActive ? 'text-emerald-500' : 'text-slate-500 group-hover:text-slate-300'}`} />
                                            {isSidebarOpen && (
                                                <span className="font-bold text-[13px] whitespace-nowrap tracking-tight">
                                                    {item.label}
                                                </span>
                                            )}
                                            {isActive && (
                                                <motion.div
                                                    layoutId="activePill"
                                                    className="absolute left-[-4px] w-1.5 h-6 bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.8)] rounded-full"
                                                />
                                            )}
                                            {!isSidebarOpen && (
                                                <div className="absolute left-full ml-6 px-3 py-2 bg-[#020617] border border-white/10 text-white text-[10px] font-black uppercase tracking-widest rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-200 transform group-hover:translate-x-1 shadow-2xl z-50">
                                                    {item.label}
                                                </div>
                                            )}
                                        </Link>
                                    )
                                })}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Profile/Logout */}
                <div className="p-4 border-t border-white/5 bg-white/[0.01]">
                    <button
                        onClick={handleLogout}
                        className={`flex items-center gap-3 w-full px-4 py-3.5 rounded-xl text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 border border-transparent hover:border-rose-500/20 transition-all group ${!isSidebarOpen && 'lg:justify-center'
                            }`}
                    >
                        <LogOut size={20} />
                        {isSidebarOpen && <span className="font-black text-[11px] tracking-[0.1em] uppercase">Termination</span>}
                    </button>
                </div>
            </motion.aside>

            {/* Mobile Overlay */}
            <AnimatePresence>
                {isSidebarOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setIsSidebarOpen(false)}
                        className="fixed inset-0 bg-[#020617]/60 backdrop-blur-sm z-30 lg:hidden"
                    />
                )}
            </AnimatePresence>

            {/* Main Content */}
            <div className="flex-1 flex flex-col h-screen overflow-hidden">
                {/* Header (Mobile) */}
                <header className="h-16 lg:hidden flex items-center px-6 border-b border-white/5 bg-[#070b14]/80 backdrop-blur-md sticky top-0 z-30">
                    <button
                        onClick={() => setIsSidebarOpen(true)}
                        className="p-2 -ml-2 text-slate-400 hover:text-white"
                    >
                        <Menu size={24} />
                    </button>
                    <div className="ml-4 flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-white border border-white/10 flex items-center justify-center p-1 shadow-sm overflow-hidden">
                            <img src="/images/logo.jpeg" alt="MentriQ Logo" className="w-full h-full object-contain" />
                        </div>
                        <span className="text-white font-bold tracking-tight">MentriQ</span>
                    </div>
                </header>

                {/* Main Viewport */}
                <main className="flex-1 overflow-x-hidden overflow-y-auto p-4 md:p-8 lg:p-10 scroll-smooth custom-scrollbar">
                    <div className="max-w-7xl mx-auto">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={location.pathname}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.2 }}
                            >
                                {children}
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </main>
            </div>
        </div>
    )
}

export default AdminLayout
