import React, { useEffect, useState, useCallback } from "react";
import { apiClient as api } from "../../utils/apiClient";
import {
    Users,
    BookOpen,
    GraduationCap,
    Briefcase,
    TrendingUp,
    TrendingDown,
    Activity,
    ArrowRight,
    Loader2,
    CheckCircle2,
    UserPlus,
    CreditCard,
    Eye,
    Zap,
    Cpu
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    BarChart,
    Bar,
    Cell
} from "recharts";

const StatCard = ({ title, value, icon: Icon, color, delay, trend = 0 }) => (
    <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay, duration: 0.5, ease: "easeOut" }}
        className="glass-premium p-8 rounded-[2.5rem] border border-white/5 hover:border-blue-500/30 hover:shadow-[0_25px_60px_-12px_rgba(59,130,246,0.15)] transition-all group relative overflow-hidden"
    >
        <div className="flex justify-between items-start relative z-10">
            <div>
                <p className="text-slate-500/60 text-[10px] font-black uppercase tracking-[0.25em] mb-4">{title}</p>
                <div className="flex items-baseline gap-2">
                    <h3 className="text-4xl font-black text-white tracking-tighter font-display">
                        {typeof value === 'number' ? value.toLocaleString() : value}
                    </h3>
                </div>
                {trend !== 0 && (
                    <div className={`flex items-center gap-2 mt-5 transition-transform group-hover:translate-x-1 ${trend > 0 ? 'text-blue-400' : 'text-rose-400'}`}>
                        <div className={`p-1 rounded-lg ${trend > 0 ? 'bg-blue-500/10' : 'bg-rose-500/10'}`}>
                            {trend > 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                        </div>
                        <span className="text-[11px] font-black tracking-tight uppercase">{Math.abs(trend)}% Velocity</span>
                    </div>
                )}
            </div>
            <div className={`p-5 rounded-[1.75rem] ${color} bg-opacity-[0.15] backdrop-blur-md border border-white/5 flex items-center justify-center transition-all duration-500 group-hover:scale-110 group-hover:rotate-6 ring-8 ring-transparent group-hover:ring-white/5 shadow-2xl`}>
                <Icon className={`w-8 h-8 ${color.replace('bg-', 'text-')}`} strokeWidth={2.5} />
            </div>
        </div>
        {/* Animated Glow on Hover */}
        <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-blue-500/5 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
    </motion.div>
);

const Dashboard = () => {
    // ... state ... (no changes to state)

    // ... (rest of the component logic until return) ...
    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-2 duration-1000">
            {/* Unified Header */}
            <div className="glass-premium p-10 rounded-[3rem] border border-white/5 shadow-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-8 overflow-hidden relative group">
                <div className="absolute -top-10 -right-10 p-24 opacity-[0.02] group-hover:opacity-[0.05] transition-opacity duration-1000 rotate-12">
                    <Cpu size={300} className="text-blue-500" />
                </div>
                <div className="relative z-10">
                    <h1 className="text-4xl font-black text-white tracking-tighter theme-gradient-text">Command Center</h1>
                    <p className="text-slate-400 mt-2 font-medium text-sm tracking-tight opacity-80">Orchestrating MentriQ platform operations and entity engagement.</p>
                </div>
                <div className="flex items-center gap-4 bg-white/[0.03] px-6 py-3 rounded-2xl border border-white/10 relative z-10 shadow-inner">
                    <div className="w-2.5 h-2.5 rounded-full bg-blue-500 shadow-[0_0_20px_rgba(59,130,246,0.8)] animate-pulse" />
                    <span className="text-slate-300 font-black text-[10px] tracking-[0.2em] uppercase">Uplink Active</span>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                <StatCard title="Student Entity" value={raw.students} icon={Users} color="bg-blue-500" trend={12} delay={0} />
                <StatCard title="Course Modules" value={raw.courses} icon={BookOpen} color="bg-indigo-500" trend={5} delay={0.1} />
                <StatCard title="System Enrollment" value={raw.enrolledStudents} icon={GraduationCap} color="bg-sky-500" trend={18} delay={0.2} />
                <StatCard title="Signal Pulse" value={raw.activeVisitors || 0} icon={Eye} color="bg-slate-800" trend={0} delay={0.3} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                {/* Growth Visualization */}
                <div className="lg:col-span-2 glass-premium rounded-[3rem] p-10 border border-white/5 shadow-2xl relative overflow-hidden">
                    <div className="flex justify-between items-center mb-12 relative z-10">
                        <div>
                            <h3 className="text-2xl font-black text-white tracking-tight font-display">Growth Matrix</h3>
                            <p className="text-slate-500/60 text-[10px] font-black uppercase tracking-[0.25em] mt-2">Analytical trends • Last 30 Telemetry Cycles</p>
                        </div>
                        <div className="flex items-center gap-3 px-6 py-3 bg-white/[0.03] rounded-2xl border border-white/5 shadow-inner">
                            <div className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.5)]" />
                            <span className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em]">Real-time Telemetry</span>
                        </div>
                    </div>

                    <div className="h-[280px] sm:h-[340px] w-full relative z-10">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={analytics.enrollmentTrends} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorInd" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.25} />
                                        <stop offset="50%" stopColor="#38bdf8" stopOpacity={0.05} />
                                        <stop offset="95%" stopColor="#38bdf8" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" vertical={false} />
                                <XAxis
                                    dataKey="date"
                                    stroke="#475569"
                                    fontSize={9}
                                    tickLine={false}
                                    axisLine={false}
                                    dy={10}
                                    fontWeight="700"
                                    textAnchor="middle"
                                    style={{ textTransform: 'uppercase', letterSpacing: '0.1em' }}
                                />
                                <YAxis
                                    stroke="#475569"
                                    fontSize={9}
                                    tickLine={false}
                                    axisLine={false}
                                    fontWeight="700"
                                />
                                <Tooltip
                                    cursor={{ stroke: '#38bdf8', strokeWidth: 1, strokeDasharray: '4 4' }}
                                    content={({ active, payload, label }) => {
                                        if (active && payload && payload.length) {
                                            return (
                                                <div className="bg-[#030712]/90 backdrop-blur-md border border-white/10 p-3 sm:p-5 rounded-xl sm:2xl shadow-2xl">
                                                    <p className="text-[9px] uppercase tracking-[0.2em] font-black text-slate-500 mb-2 sm:mb-3">{label}</p>
                                                    <p className="text-lg sm:text-xl font-black text-white flex items-center gap-2 sm:gap-3">
                                                        <span className="w-2 sm:w-2.5 h-2 sm:h-2.5 rounded-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]" />
                                                        {payload[0].value} <span className="text-slate-500 text-[10px] sm:text-xs font-bold uppercase tracking-tight">Enrollees</span>
                                                    </p>
                                                </div>
                                            );
                                        }
                                        return null;
                                    }}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="count"
                                    stroke="#38bdf8"
                                    strokeWidth={3}
                                    fill="url(#colorInd)"
                                    animationDuration={2500}
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Real-time Activity */}
                <div className="glass-premium rounded-[3rem] p-10 border border-white/5 shadow-2xl flex flex-col relative overflow-hidden group">
                    <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/5 blur-[80px] rounded-full pointer-events-none" />
                    <div className="flex items-center justify-between mb-10 relative z-10">
                        <div>
                            <h3 className="text-2xl font-black text-white tracking-tight font-display">Active Pulse</h3>
                            <p className="text-slate-500/60 text-[10px] font-black uppercase tracking-[0.25em] mt-2">Real-time Node Events</p>
                        </div>
                        <div className="p-3 bg-blue-500/10 rounded-2xl border border-blue-500/20 group-hover:scale-110 transition-transform">
                            <Activity className="text-blue-400" size={24} />
                        </div>
                    </div>

                    <div className="flex-1 space-y-8 overflow-y-auto pr-2 custom-scrollbar max-h-[420px] relative z-10">
                        {analytics.recentActivity.map((activity, idx) => (
                            <div key={activity.id} className="flex gap-5 group/item cursor-default">
                                <div className="mt-1 relative">
                                    <div className="w-12 h-12 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center justify-center group-hover/item:bg-blue-500/10 group-hover/item:border-blue-500/20 transition-all shadow-sm">
                                        {getActivityIcon(activity.type)}
                                    </div>
                                    {idx !== analytics.recentActivity.length - 1 && (
                                        <div className="absolute top-14 left-1/2 -translate-x-1/2 w-px h-10 bg-white/5 group-hover/item:bg-blue-500/20 transition-colors" />
                                    )}
                                </div>
                                <div className="flex-1">
                                    <div className="text-[14px] font-bold text-slate-300 leading-relaxed group-hover/item:text-white transition-colors">
                                        {activity.message.replace('User', 'Node Entity').replace('student', 'authorized node')}
                                    </div>
                                    <div className="text-[10px] text-slate-500/80 font-black mt-2 flex items-center gap-2 uppercase tracking-[0.2em]">
                                        <div className="w-1.5 h-1.5 rounded-full bg-blue-500/50" />
                                        {new Date(activity.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • Live Signal
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <button className="w-full mt-10 py-5 bg-white/[0.03] hover:bg-blue-500/10 text-slate-400 hover:text-blue-400 font-black rounded-[1.5rem] border border-white/5 hover:border-blue-500/20 text-[10px] uppercase tracking-[0.3em] transition-all active:scale-[0.98] relative z-10">
                        Access Performance Logs
                    </button>
                </div>
            </div>

            {/* Infrastructure Linkage */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                <div className="glass-premium rounded-[2.5rem] p-10 border border-white/5 relative overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent pointer-events-none" />
                    <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
                        <div>
                            <h3 className="text-xl font-black text-white tracking-tight">Cloud Infrastructure</h3>
                            <p className="text-slate-500/80 text-xs mt-1 font-bold">Core engine and database cluster status</p>
                        </div>
                        <div className="flex gap-10">
                            {[
                                { label: 'API Gateway', status: 'Operational', color: 'bg-blue-500' },
                                { label: 'Compute Unit', status: 'Primary', color: 'bg-sky-500' }
                            ].map((s, i) => (
                                <div key={i} className="space-y-2">
                                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] block">{s.label}</span>
                                    <div className="flex items-center gap-3">
                                        <div className={`w-2 h-2 rounded-full ${s.color} shadow-[0_0_10px_rgba(255,255,255,0.2)]`} />
                                        <span className="text-xs font-black text-white tracking-widest uppercase">{s.status}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="glass-premium rounded-[2.5rem] p-10 border border-white/5 shadow-2xl relative overflow-hidden group flex items-center justify-between">
                    <div className="absolute inset-0 bg-gradient-to-tr from-sky-500/5 to-transparent pointer-events-none" />
                    <div className="relative z-10">
                        <h3 className="text-xl font-black text-white tracking-tight">Visitor Reach</h3>
                        <p className="text-slate-500/80 text-xs font-bold mt-1">Popular page segments across the portal</p>
                    </div>
                    <button onClick={() => navigate('/admin/settings')} className="relative z-10 p-5 rounded-2xl bg-white/[0.03] hover:bg-white/[0.1] text-blue-400 border border-white/5 transition-all">
                        <ArrowRight size={24} />
                    </button>
                </div>
            </div>

        </div>
    );
};

export default Dashboard;
