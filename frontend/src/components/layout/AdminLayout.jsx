import React, { useState, useEffect, useRef } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'

import {
    LayoutDashboard,
    Users,
    BookOpen,
    GraduationCap,
    Settings,
    LogOut,
    Menu,
    X,
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

/* ─── Menu config ─────────────────────────────────────────────── */
const menuGroups = [
    {
        title: 'Operations',
        items: [
            { path: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
            { path: '/admin/settings',  icon: Settings,         label: 'Settings'   },
        ]
    },
    {
        title: 'Learning',
        items: [
            { path: '/admin/courses',     icon: BookOpen,        label: 'Courses'     },
            { path: '/admin/internships', icon: Briefcase,       label: 'Internships' },
            { path: '/admin/jobs',        icon: Briefcase,       label: 'Job Board'   },
            { path: '/admin/journey',     icon: MapPin,          label: 'Milestones'  },
        ]
    },
    {
        title: 'Stakeholders',
        items: [
            { path: '/admin/users',    icon: Users,    label: 'Candidates' },
            { path: '/admin/staff',    icon: UserCog,  label: 'Staff'      },
            { path: '/admin/mentors',  icon: Users,    label: 'Mentors'    },
            { path: '/admin/partners', icon: Handshake,label: 'Partners'   },
        ]
    },
    {
        title: 'Engagement',
        items: [
            { path: '/admin/enquiries',   icon: Mail,          label: 'Enquiries'    },
            { path: '/admin/feedback',    icon: MessageSquare, label: 'Feedback'     },
            { path: '/admin/certificates',icon: Award,         label: 'Certificates' },
        ]
    },
    {
        title: 'Infrastructure',
        items: [
            { path: '/admin/services',     icon: Layers, label: 'Services'     },
            { path: '/admin/technologies', icon: Cpu,    label: 'Technologies' },
            { path: '/admin/cities',       icon: MapPin, label: 'Cities'       },
        ]
    }
]

/* ─── Sidebar Nav Item ────────────────────────────────────────── */
const NavItem = ({ item, collapsed, isActive, onClick }) => {
    const Icon = item.icon
    return (
        <Link
            to={item.path}
            onClick={onClick}
            title={collapsed ? item.label : undefined}
            className={`
                relative flex items-center gap-3 rounded-xl transition-all duration-200 group
                ${collapsed ? 'justify-center px-0 py-3' : 'px-3 py-2.5'}
                ${isActive
                    ? 'bg-blue-500/15 text-blue-400 border border-blue-500/25 shadow-lg shadow-blue-500/10'
                    : 'text-slate-400 hover:text-white hover:bg-white/5 border border-transparent'}
            `}
        >
            {/* Active indicator */}
            {isActive && (
                <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-blue-500 rounded-r-full shadow-lg shadow-blue-500/50" />
            )}

            <Icon
                size={19}
                className={`shrink-0 transition-colors ${isActive ? 'text-blue-400' : 'text-slate-400 group-hover:text-slate-200'}`}
                strokeWidth={2}
            />

            {!collapsed && (
                <span className="text-[13px] font-semibold whitespace-nowrap tracking-tight">
                    {item.label}
                </span>
            )}

            {/* Tooltip for icon-only mode */}
            {collapsed && (
                <span className="
                    pointer-events-none absolute left-full ml-3 px-2.5 py-1.5
                    bg-[#0d1526] border border-white/10 text-white text-[11px]
                    font-bold uppercase tracking-widest rounded-lg
                    opacity-0 group-hover:opacity-100
                    translate-x-1 group-hover:translate-x-0
                    transition-all duration-200 shadow-2xl z-50 whitespace-nowrap
                ">
                    {item.label}
                </span>
            )}
        </Link>
    )
}

/* ─── Sidebar inner content (shared across mobile & desktop) ──── */
const SidebarContent = ({ collapsed = false, onClose, location }) => {
    const navigate = useNavigate()
    const { logout } = useAuth()
    const toast = useToast()

    const handleLogout = () => {
        logout()
        navigate('/')
        toast.success('Logged out successfully')
    }

    return (
        <div className="flex flex-col h-full select-none">

            {/* ── Logo Row ── */}
            <div className={`h-[64px] flex items-center border-b border-white/5 shrink-0 ${collapsed ? 'justify-center px-2' : 'justify-between px-5'}`}>
                {!collapsed && (
                    <div className="flex items-center gap-2.5 overflow-hidden">
                        <div className="w-9 h-9 rounded-xl bg-[#0b1120] border border-white/10 flex items-center justify-center overflow-hidden p-1 shadow-lg shadow-black/40">
                            <img src="/images/logo.jpeg" alt="MentriQ" className="w-full h-full object-contain" />
                        </div>
                        <span className="text-white font-black text-lg tracking-tight whitespace-nowrap theme-gradient-text">
                            MentriQ
                        </span>
                    </div>
                )}

                {collapsed && (
                    <div className="w-9 h-9 rounded-xl bg-[#0b1120] border border-white/10 flex items-center justify-center overflow-hidden p-1">
                        <img src="/images/logo.jpeg" alt="MentriQ" className="w-full h-full object-contain" />
                    </div>
                )}

                {/* Mobile close button */}
                {onClose && (
                    <button
                        onClick={onClose}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
                    >
                        <X size={20} />
                    </button>
                )}
            </div>

            {/* ── Navigation ── */}
            <nav className="flex-1 overflow-y-auto py-5 space-y-6 custom-scrollbar" style={{ paddingLeft: collapsed ? '8px' : '12px', paddingRight: collapsed ? '8px' : '12px' }}>
                {menuGroups.map((group, gi) => (
                    <div key={gi} className="space-y-1">
                        {!collapsed && (
                            <p className="text-[9px] font-black uppercase tracking-[0.25em] text-slate-500 mb-2 px-3">
                                {group.title}
                            </p>
                        )}
                        {collapsed && gi > 0 && (
                            <div className="mx-auto w-5 border-t border-white/5 mb-2" />
                        )}
                        <div className="space-y-0.5">
                            {group.items.map(item => (
                                <NavItem
                                    key={item.path}
                                    item={item}
                                    collapsed={collapsed}
                                    isActive={location.pathname === item.path}
                                    onClick={onClose}
                                />
                            ))}
                        </div>
                    </div>
                ))}
            </nav>

            {/* ── Logout ── */}
            <div className="shrink-0 p-3 border-t border-white/5">
                <button
                    onClick={handleLogout}
                    title={collapsed ? 'Sign Out' : undefined}
                    className={`
                        flex items-center gap-3 w-full rounded-xl px-3 py-3
                        text-slate-400 hover:text-rose-400 hover:bg-rose-500/10
                        border border-transparent hover:border-rose-500/20
                        transition-all group
                        ${collapsed ? 'justify-center' : ''}
                    `}
                >
                    <LogOut size={19} className="shrink-0" strokeWidth={2} />
                    {!collapsed && (
                        <span className="text-[12px] font-bold uppercase tracking-widest whitespace-nowrap">
                            Sign Out
                        </span>
                    )}
                </button>
            </div>
        </div>
    )
}

/* ─── Main Layout ─────────────────────────────────────────────── */
const AdminLayout = ({ children }) => {
    const [mobileOpen, setMobileOpen]   = useState(false)
    const [collapsed,  setCollapsed]    = useState(false)
    const location  = useLocation()
    const navigate  = useNavigate()

    // Close mobile drawer on route change
    useEffect(() => { setMobileOpen(false) }, [location.pathname])

    // Close mobile drawer on desktop resize
    useEffect(() => {
        const onResize = () => { if (window.innerWidth >= 1024) setMobileOpen(false) }
        window.addEventListener('resize', onResize)
        return () => window.removeEventListener('resize', onResize)
    }, [])

    const SIDEBAR_W_OPEN     = '16rem'   // 256px – full labels
    const SIDEBAR_W_COLLAPSED = '4.5rem' // 72px  – icons only

    return (
        <div className="min-h-screen bg-[#030712] text-white/90 flex overflow-hidden font-sans">

            {/* ── Ambient glow ── */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden">
                <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] bg-blue-600/4 blur-[140px] rounded-full" />
                <div className="absolute -bottom-[20%] -right-[10%] w-[45%] h-[45%] bg-indigo-600/4 blur-[140px] rounded-full" />
            </div>

            {/* ══════════════════════════════════════════
                MOBILE OVERLAY DRAWER  (< lg)
            ══════════════════════════════════════════ */}
            <AnimatePresence>
                {mobileOpen && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            key="backdrop"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            onClick={() => setMobileOpen(false)}
                            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[200] lg:hidden"
                        />

                        {/* Drawer */}
                        <motion.aside
                            key="drawer"
                            initial={{ x: '-100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '-100%' }}
                            transition={{ type: 'spring', damping: 28, stiffness: 260 }}
                            className="fixed inset-y-0 left-0 w-64 bg-[#0b1120] border-r border-white/5 z-[201] lg:hidden flex flex-col shadow-2xl"
                        >
                            <SidebarContent
                                collapsed={false}
                                onClose={() => setMobileOpen(false)}
                                location={location}
                            />
                        </motion.aside>
                    </>
                )}
            </AnimatePresence>

            {/* ══════════════════════════════════════════
                DESKTOP SIDEBAR  (≥ lg)
            ══════════════════════════════════════════ */}
            <motion.aside
                animate={{ width: collapsed ? SIDEBAR_W_COLLAPSED : SIDEBAR_W_OPEN }}
                transition={{ type: 'spring', damping: 30, stiffness: 280 }}
                className="hidden lg:flex flex-col shrink-0 bg-[#0b1120] border-r border-white/5 relative z-40 overflow-hidden"
                style={{ height: '100vh', position: 'sticky', top: 0 }}
            >
                <SidebarContent
                    collapsed={collapsed}
                    location={location}
                />

                {/* Collapse toggle */}
                <button
                    onClick={() => setCollapsed(c => !c)}
                    className="
                        absolute top-[23px] -right-3
                        w-6 h-6 rounded-full
                        bg-[#0b1120] border border-white/10
                        flex items-center justify-center
                        text-slate-400 hover:text-white
                        shadow-lg shadow-black/40
                        transition-colors
                    "
                    title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
                >
                    {collapsed
                        ? <ChevronRight size={13} strokeWidth={3} />
                        : <ChevronLeft  size={13} strokeWidth={3} />
                    }
                </button>
            </motion.aside>

            {/* ══════════════════════════════════════════
                MAIN CONTENT
            ══════════════════════════════════════════ */}
            <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden relative z-10">

                {/* ── Mobile top bar ── */}
                <header className="lg:hidden h-14 shrink-0 flex items-center justify-between px-4 border-b border-white/5 bg-[#0b1120]/80 backdrop-blur-md sticky top-0 z-30">
                    <button
                        onClick={() => setMobileOpen(true)}
                        className="p-2 -ml-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
                        aria-label="Open menu"
                    >
                        <Menu size={22} />
                    </button>

                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-[#0b1120] border border-white/10 flex items-center justify-center p-1 overflow-hidden">
                            <img src="/images/logo.jpeg" alt="MentriQ" className="w-full h-full object-contain" />
                        </div>
                        <span className="text-white font-black text-sm tracking-tight theme-gradient-text">MentriQ</span>
                    </div>

                    {/* Spacer to balance header */}
                    <div className="w-9" />
                </header>

                {/* ── Page content ── */}
                <main className="flex-1 overflow-x-hidden overflow-y-auto p-4 sm:p-6 lg:p-8 scroll-smooth custom-scrollbar">
                    <div className="max-w-[1600px] mx-auto w-full">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={location.pathname}
                                initial={{ opacity: 0, y: 12 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -8 }}
                                transition={{ duration: 0.25 }}
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
