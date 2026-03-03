import React, { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'

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

const SidebarContent = ({
    isMobile = false,
    isDesktopSidebarOpen,
    setIsDesktopSidebarOpen,
    setIsSidebarOpen,
    location,
    handleLogout,
    menuGroups
}) => (
    <div className="flex flex-col h-full">
        {/* Logo Section */}
        <div className="h-20 flex items-center justify-between px-6 border-b border-white/5 bg-white/[0.02]">
            <div className={`flex items-center gap-3 overflow-hidden ${!isDesktopSidebarOpen && !isMobile && 'lg:hidden'}`}>
                <div className="w-10 h-10 rounded-xl bg-white border border-white/10 flex items-center justify-center shadow-lg shadow-white/10 overflow-hidden p-1">
                    <img src="/images/logo.jpeg" alt="MentriQ Logo" className="w-full h-full object-contain" />
                </div>
                <span className="text-white font-black text-xl tracking-tight whitespace-nowrap theme-gradient-text">MentriQ</span>
            </div>
            {!isMobile && (
                <button
                    onClick={() => setIsDesktopSidebarOpen(!isDesktopSidebarOpen)}
                    className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-all hidden lg:block"
                >
                    {isDesktopSidebarOpen ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
                </button>
            )}
            {isMobile && (
                <button onClick={() => setIsSidebarOpen(false)} className="p-2 text-slate-400 lg:hidden">
                    <X size={24} />
                </button>
            )}
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto py-8 px-4 space-y-10 custom-scrollbar">
            {menuGroups.map((group, groupIdx) => (
                <div key={groupIdx} className="space-y-4">
                    {(isDesktopSidebarOpen || isMobile) && (
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
                                        ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20 shadow-lg shadow-blue-500/20'
                                        : 'text-slate-500 hover:text-white hover:bg-white/[0.03] border border-transparent'
                                        }`}
                                >
                                    <Icon size={20} className={`shrink-0 transition-colors ${isActive ? 'text-blue-500' : 'text-slate-500 group-hover:text-slate-300'}`} />
                                    {(isDesktopSidebarOpen || isMobile) && (
                                        <span className="font-bold text-[13px] whitespace-nowrap tracking-tight">
                                            {item.label}
                                        </span>
                                    )}
                                    {isActive && (
                                        <div
                                            layoutId="activePill"
                                            className="absolute left-[-4px] w-1.5 h-6 bg-blue-500 shadow-lg shadow-blue-500/50 rounded-full"
                                        />
                                    )}
                                    {!isDesktopSidebarOpen && !isMobile && (
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
                className={`flex items-center gap-3 w-full px-4 py-3.5 rounded-xl text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 border border-transparent hover:border-rose-500/20 transition-all group ${(isDesktopSidebarOpen || isMobile) ? '' : 'justify-center'}`}
            >
                <LogOut size={20} />
                {(isDesktopSidebarOpen || isMobile) && <span className="font-black text-[11px] tracking-[0.1em] uppercase">Termination</span>}
            </button>
        </div>
    </div>
);

const AdminLayout = ({ children }) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false)
    const [isDesktopSidebarOpen, setIsDesktopSidebarOpen] = useState(true)
    const location = useLocation()
    const navigate = useNavigate()
    const { logout } = useAuth()
    const toast = useToast()

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 1024) {
                setIsSidebarOpen(false)
            }
        }
        window.addEventListener('resize', handleResize)
        return () => window.removeEventListener('resize', handleResize)
    }, [])

    // Auto-close mobile sidebar on navigation
    useEffect(() => {
        if (isSidebarOpen) {
            setIsSidebarOpen(false);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [location.pathname]);

    const handleLogout = () => {
        logout()
        navigate('/')
        toast.success('Logged out successfully')
    }

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
    ]

    const sidebarProps = {
        isDesktopSidebarOpen,
        setIsDesktopSidebarOpen,
        setIsSidebarOpen,
        location,
        handleLogout,
        menuGroups
    }

    return (
        <div className="min-h-screen bg-[#030712] text-slate-200 flex flex-col lg:flex-row overflow-hidden font-sans relative">
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-500/5 blur-[120px] rounded-full animate-pulse" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-500/5 blur-[120px] rounded-full" />
            </div>

            <AnimatePresence>
                {isSidebarOpen && (
                    <>
                        <div
                            }
                            }
                            exit={{ opacity: 0 }}
                            onClick={() => setIsSidebarOpen(false)}
                            className="fixed inset-0 bg-[#020617]/80 backdrop-blur-sm z-[100] lg:hidden"
                        />
                        <aside
                            }
                            }
                            exit={{ x: '-100%' }}
                            }
                            className="fixed inset-y-0 left-0 w-72 bg-[#020617] border-r border-white/5 z-[101] lg:hidden flex flex-col"
                        >
                            <SidebarContent isMobile={true} {...sidebarProps} />
                        </aside>
                    </>
                )}
            </AnimatePresence>

            <aside
                
                }
                className="hidden lg:flex flex-col glass-premium border-r border-white/5 relative z-40 transition-all duration-300"
            >
                <SidebarContent {...sidebarProps} />
            </aside>

            <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden relative z-10">
                <header className="h-16 lg:hidden flex items-center justify-between px-6 border-b border-white/5 bg-[#070b14]/80 backdrop-blur-md sticky top-0 z-30 shrink-0">
                    <button
                        onClick={() => setIsSidebarOpen(true)}
                        className="p-2 -ml-2 text-slate-400 hover:text-white active:scale-90 transition-transform"
                    >
                        <Menu size={24} />
                    </button>
                    <div className="flex items-center gap-2">
                        <div className="w-10 h-10 rounded-xl bg-white border border-white/10 flex items-center justify-center p-1.5 shadow-sm overflow-hidden">
                            <img src="/images/logo.jpeg" alt="MentriQ Logo" className="w-full h-full object-contain" />
                        </div>
                        <span className="text-white font-black tracking-tight text-sm">MentriQ</span>
                    </div>
                </header>

                <main className="flex-1 overflow-x-hidden overflow-y-auto p-4 md:p-8 lg:p-10 scroll-smooth custom-scrollbar">
                    <div className="max-w-[1600px] mx-auto w-full">
                        <AnimatePresence mode="wait">
                            <div
                                key={location.pathname}
                                }
                                }
                                exit={{ opacity: 0, y: -10 }}
                                }
                            >
                                {children}
                            </div>
                        </AnimatePresence>
                    </div>
                </main>
            </div>
        </div>
    )
}

export default AdminLayout
