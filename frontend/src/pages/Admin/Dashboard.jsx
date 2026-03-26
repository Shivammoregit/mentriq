import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { apiClient as api } from "../../utils/apiClient";
import {
    Users,
    BookOpen,
    GraduationCap,
    TrendingUp,
    TrendingDown,
    Activity,
    ArrowRight,
    UserPlus,
    CreditCard,
    Eye,
    Zap,
    DollarSign,
    Award
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import AdminLoader from "../../components/common/AdminLoader";
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer
} from "recharts";

const StatCard = ({ title, value, icon: Icon, color, delay, trend = 0 }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay }}
        className="glass-premium p-6 rounded-3xl border border-white/5 hover:border-blue-500/30 hover:shadow-2xl hover:shadow-blue-500/20 transition-all group relative overflow-hidden"
    >
        <div className="flex justify-between items-start relative z-10">
            <div>
                <p className="text-slate-400/60 text-[10px] font-black uppercase tracking-[0.25em] mb-4">{title}</p>
                <div className="flex items-baseline gap-2">
                    <h3 className="text-3xl font-black text-white tracking-tighter font-display">
                        {typeof value === 'number' ? value.toLocaleString() : value}
                    </h3>
                </div>
                {trend !== 0 && (
                    <div className={`flex items-center gap-2 mt-4 transition-transform group-hover:translate-x-1 ${trend > 0 ? 'text-blue-400' : 'text-rose-400'}`}>
                        <div className={`p-1 rounded-lg ${trend > 0 ? 'bg-blue-500/10' : 'bg-rose-500/10'}`}>
                            {trend > 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                        </div>
                        <span className="text-[11px] font-black tracking-tight uppercase">{Math.abs(trend)}% Growth</span>
                    </div>
                )}
            </div>
            <div className={`p-4 rounded-2xl ${color} bg-opacity-[0.15] backdrop-blur-md border border-white/5 flex items-center justify-center transition-all duration-500 group-hover:scale-110 group-hover:rotate-6 ring-8 ring-transparent group-hover:ring-white/5 shadow-2xl shrink-0`}>
                <Icon className={`w-7 h-7 ${color.replace('bg-', 'text-')}`} strokeWidth={2.5} />
            </div>
        </div>
        <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-blue-500/5 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
    </motion.div>
);

const Dashboard = () => {
    const [raw, setRaw] = useState({
        students: 0,
        courses: 0,
        enrolledStudents: 0,
        activeVisitors: 0
    });
    const [analytics, setAnalytics] = useState({
        enrollmentTrends: [],
        recentActivity: [],
        popularCourses: []
    });
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const fetchDashData = useCallback(async () => {
        try {
            const { data } = await api.get('/stats');
            setRaw(data.raw || {});
            setAnalytics({
                enrollmentTrends: data.analytics?.enrollmentTrends || [],
                recentActivity: data.analytics?.recentActivity || [],
                popularCourses: data.analytics?.popularCourses || []
            });
        } catch (err) {
            console.error("Dashboard uplift failure", err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchDashData();
        const interval = setInterval(fetchDashData, 30000);
        return () => clearInterval(interval);
    }, [fetchDashData]);

    const getActivityIcon = (type) => {
        switch (type) {
            case 'enrollment': return <GraduationCap className="text-blue-400" size={18} />;
            case 'user': return <UserPlus className="text-sky-400" size={18} />;
            case 'payment': return <CreditCard className="text-indigo-400" size={18} />;
            default: return <Zap className="text-blue-400" size={18} />;
        }
    };

    if (loading) {
        return <AdminLoader label="Loading dashboard" />;
    }

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-1000">
            {/* Header */}
            <div className="glass-premium p-8 rounded-3xl border border-white/5 shadow-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <h1 className="text-3xl font-black text-white tracking-tighter theme-gradient-text uppercase">Dashboard</h1>
                    <p className="text-slate-400 mt-1 font-medium text-xs tracking-tight opacity-80">Welcome back — here's an overview of your platform.</p>
                </div>
                <div className="flex items-center gap-3 px-5 py-2.5 rounded-2xl border border-white/10 shadow-inner">
                    <div className="w-2 h-2 rounded-full bg-green-400 shadow-lg shadow-green-400/40 animate-pulse" />
                    <span className="text-slate-300 font-semibold text-[11px] tracking-wide">All systems online</span>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard title="Total Students" value={raw.students} icon={Users} color="bg-blue-500" trend={raw.studentTrend || 0} delay={0} />
                <StatCard title="Courses" value={raw.courses} icon={BookOpen} color="bg-indigo-500" trend={raw.courseTrend || 0} delay={0.1} />
                <StatCard title="Enrollments" value={raw.enrolledStudents} icon={GraduationCap} color="bg-sky-500" trend={raw.enrollmentTrend || 0} delay={0.2} />
                <StatCard title="Active Visitors" value={raw.activeVisitors || 0} icon={Eye} color="bg-slate-700" trend={0} delay={0.3} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 glass-premium rounded-[2.5rem] p-8 border border-white/5 shadow-2xl relative overflow-hidden">
                    <div className="flex justify-between items-center mb-8 relative z-10">
                        <div>
                            <h3 className="text-2xl font-black text-white tracking-tight font-display">Enrollment Trends</h3>
                            <p className="text-slate-400/60 text-[10px] font-semibold uppercase tracking-[0.2em] mt-2">Last 30 days</p>
                        </div>
                        <div className="flex items-center gap-3 px-5 py-2.5 bg-[#0b1120]/[0.03] rounded-2xl border border-white/5 shadow-inner">
                            <div className="w-2 h-2 rounded-full bg-blue-500 shadow-md shadow-blue-500/40" />
                            <span className="text-[10px] font-semibold text-slate-300 uppercase tracking-[0.15em]">Live Data</span>
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
                                                    <p className="text-[9px] uppercase tracking-[0.2em] font-black text-slate-400 mb-2 sm:mb-3">{label}</p>
                                                    <p className="text-lg sm:text-xl font-black text-white flex items-center gap-2 sm:gap-3">
                                                        <span className="w-2 sm:w-2.5 h-2 sm:h-2.5 rounded-full bg-blue-500 shadow-sm shadow-blue-500/30" />
                                                        {payload[0].value} <span className="text-slate-400 text-[10px] sm:text-xs font-bold uppercase tracking-tight">Enrollees</span>
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

                <div className="glass-premium rounded-3xl p-8 border border-white/5 shadow-2xl flex flex-col relative overflow-hidden group">
                    <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/5 blur-[80px] rounded-full pointer-events-none" />
                    <div className="flex items-center justify-between mb-6 relative z-10">
                        <div>
                            <h3 className="text-2xl font-black text-white tracking-tight font-display">Recent Activity</h3>
                            <p className="text-slate-400/60 text-[10px] font-semibold uppercase tracking-[0.2em] mt-2">Latest platform events</p>
                        </div>
                        <div className="p-3 bg-blue-500/10 rounded-2xl border border-blue-500/20 group-hover:scale-110 transition-transform">
                            <Activity className="text-blue-400" size={24} />
                        </div>
                    </div>

                    <div className="flex-1 space-y-6 overflow-y-auto pr-2 custom-scrollbar max-h-[350px] relative z-10">
                        {analytics.recentActivity.map((activity, idx) => (
                            <div key={activity.id} className="flex gap-4 group/item cursor-default">
                                <div className="mt-1 relative shrink-0">
                                    <div className="w-10 h-10 rounded-xl bg-[#0b1120]/[0.03] border border-white/10 flex items-center justify-center group-hover/item:bg-blue-500/10 group-hover/item:border-blue-500/20 transition-all shadow-sm">
                                        {getActivityIcon(activity.type)}
                                    </div>
                                    {idx !== analytics.recentActivity.length - 1 && (
                                        <div className="absolute top-12 left-1/2 -translate-x-1/2 w-px h-8 bg-[#1e293b] group-hover/item:bg-blue-500/20 transition-colors" />
                                    )}
                                </div>
                                <div className="flex-1">
                                    <div className="text-[13px] font-bold text-slate-300 leading-tight group-hover/item:text-white transition-colors">
                                        {activity.message}
                                    </div>
                                    <div className="text-[9px] text-slate-400/80 font-semibold mt-2 flex items-center gap-2 uppercase tracking-[0.12em]">
                                        <div className="w-1.5 h-1.5 rounded-full bg-blue-500/50" />
                                        {new Date(activity.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <button
                        onClick={() => navigate("/admin/activity")}
                        className="w-full mt-6 py-3.5 bg-[#0b1120]/[0.03] hover:bg-blue-500/10 text-slate-400 hover:text-blue-400 font-semibold rounded-2xl border border-white/5 hover:border-blue-500/20 text-[11px] uppercase tracking-wider transition-all active:scale-[0.98] relative z-10"
                    >
                        View All Activity
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-6">
                <div className="glass-premium rounded-[2.5rem] p-8 border border-white/5 shadow-2xl relative overflow-hidden">
                    <div className="flex items-center justify-between mb-8 relative z-10">
                        <div>
                            <h3 className="text-2xl font-black text-white tracking-tight font-display">Top Performing Courses</h3>
                            <p className="text-slate-400/60 text-[10px] font-semibold uppercase tracking-[0.2em] mt-2">Ranked by enrollment volume</p>
                        </div>
                        <div className="p-3 bg-emerald-500/10 rounded-2xl border border-emerald-500/20">
                            <Award className="text-emerald-400" size={24} />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 relative z-10">
                        {analytics.popularCourses.length > 0 ? analytics.popularCourses.map((course, idx) => (
                            <div key={course._id} className="bg-[#1e293b]/50 border border-white/5 rounded-3xl p-5 hover:border-emerald-500/20 hover:bg-[#1e293b] transition-all group relative overflow-hidden">
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="w-12 h-12 rounded-2xl bg-black/40 flex items-center justify-center font-black text-xl text-emerald-400 border border-white/5 shadow-inner">
                                        #{idx + 1}
                                    </div>
                                    <div className="flex-1 overflow-hidden">
                                        <h4 className="text-white font-bold text-sm truncate group-hover:text-emerald-400 transition-colors" title={course.title}>
                                            {course.title}
                                        </h4>
                                        <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mt-1 truncate">{course.category || "General"}</p>
                                    </div>
                                </div>
                                <div className="flex justify-center items-center px-4 py-3 bg-black/20 rounded-xl border border-white/5">
                                    <div className="text-center w-full">
                                        <p className="text-[9px] font-black uppercase tracking-widest text-slate-500 mb-0.5">Students</p>
                                        <p className="text-emerald-400 font-black text-sm">{course.count}</p>
                                    </div>
                                </div>
                            </div>
                        )) : (
                            <div className="col-span-full py-10 text-center text-slate-500 font-semibold text-sm">No course data available yet.</div>
                        )}
                    </div>
                </div>
            </div>

        </div>
    );
};

export default Dashboard;
