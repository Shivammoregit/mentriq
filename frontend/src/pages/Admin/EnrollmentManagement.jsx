import React, { useEffect, useState } from "react";
import { apiClient as api } from "../../utils/apiClient";
import { Search, CheckCircle, XCircle, Clock, Trash2, Download, GraduationCap, User, BookOpen } from "lucide-react";
import { useToast } from "../../context/ToastContext";
import { motion, AnimatePresence } from "framer-motion";

const EnrollmentManagement = () => {
    const [enrollments, setEnrollments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const toast = useToast();

    const fetchEnrollments = async () => {
        try {
            const { data } = await api.get("/enrollments");
            setEnrollments(data || []);
        } catch {
            toast.error("Failed to load enrollment registry");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchEnrollments();
        const interval = setInterval(fetchEnrollments, 15000);
        return () => clearInterval(interval);
    }, []);

    const handleStatusUpdate = async (id, status) => {
        try {
            await api.put(`/enrollments/${id}`, { status });
            toast.success(`Access record: ${status}`);
            setEnrollments(enrollments.map(e => e._id === id ? { ...e, status } : e));
        } catch {
            toast.error("Registry update failed");
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Terminate enrollment access?")) return;
        try {
            await api.delete(`/enrollments/${id}`);
            toast.success("Registry entry removed");
            setEnrollments(enrollments.filter(e => e._id !== id));
        } catch {
            toast.error("Deletion failed");
        }
    };

    const filtered = enrollments.filter(e =>
        (e.user?.name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (e.course?.title || "").toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleExportEnrollments = () => {
        if (filtered.length === 0) {
            toast.error("Empty results; nothing to export");
            return;
        }

        const headers = ["Student Name", "Student Email", "Course", "Status", "Enrolled On"];
        const rows = filtered.map((enrollment) => ([
            enrollment.user?.name || "Anonymous User",
            enrollment.user?.email || "No Email",
            enrollment.course?.title || "Unknown Course",
            enrollment.status || "pending",
            enrollment.createdAt
                ? new Date(enrollment.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })
                : ""
        ]));

        const escapeCell = (value) => `"${String(value).replace(/"/g, '""')}"`;
        const csv = [headers, ...rows]
            .map((row) => row.map(escapeCell).join(","))
            .join("\n");

        const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `enrollments-${new Date().toISOString().slice(0, 10)}.csv`;
        link.click();
        URL.revokeObjectURL(url);
        toast.success("Intelligence report exported");
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* Page Header */}
            <div className="bg-[#0f172a]/40 backdrop-blur-xl p-6 rounded-3xl border border-white/5 shadow-2xl relative overflow-hidden group">
                <div className="flex flex-col lg:flex-row gap-8 lg:items-center lg:justify-between relative z-10">
                    <div>
                        <div className="flex items-center gap-3 mb-1">
                            <GraduationCap size={28} className="text-emerald-400" />
                            <h2 className="text-3xl font-extrabold text-white tracking-tight">Access Registry</h2>
                            <span className="ml-2 text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-lg border border-emerald-500/20 text-xs font-bold">
                                {enrollments.length} Active Entitlements
                            </span>
                        </div>
                        <p className="text-slate-400 font-medium text-sm">Course access control and academic enrollment management.</p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
                        <div className="bg-white/5 border border-white/10 rounded-xl pr-6 flex items-center w-full lg:w-auto group focus-within:border-emerald-500/50 focus-within:ring-4 focus-within:ring-emerald-500/10 transition-all">
                            <Search className="text-slate-500 ml-4 group-focus-within:text-emerald-400 transition-colors" size={18} />
                            <input
                                type="text"
                                placeholder="Locate student access..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="bg-transparent text-white placeholder:text-slate-600 focus:outline-none py-4 px-4 w-full lg:w-64 font-bold text-sm tracking-tight"
                            />
                        </div>
                        <button
                            onClick={handleExportEnrollments}
                            className="bg-white/5 text-slate-300 hover:bg-white/10 border border-white/10 px-8 py-3 rounded-xl font-bold flex items-center gap-3 transition-all active:scale-95 text-[10px] uppercase tracking-widest whitespace-nowrap justify-center"
                        >
                            <Download size={16} />
                            <span>Export Registry</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Enrollments Table */}
            <div className="bg-[#0f172a]/40 backdrop-blur-xl border border-white/5 rounded-[2.5rem] overflow-hidden shadow-2xl">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-white/5 border-b border-white/10">
                                <th className="px-8 py-4 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">Student Identity</th>
                                <th className="px-8 py-4 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">Subject Logic</th>
                                <th className="px-8 py-4 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">Registry Status</th>
                                <th className="px-8 py-4 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            <AnimatePresence mode="popLayout">
                                {filtered.map((enrollment) => (
                                    <motion.tr
                                        key={enrollment._id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0 }}
                                        className="hover:bg-white/5 transition-colors group"
                                    >
                                        <td className="px-8 py-4">
                                            <div className="flex flex-col gap-1">
                                                <div className="font-bold text-white text-[15px] tracking-tight">{enrollment.user?.name || "Unidentified Student"}</div>
                                                <div className="text-[10px] text-slate-500 font-bold uppercase tracking-widest flex items-center gap-1.5">
                                                    <User size={12} className="text-emerald-400" />
                                                    {enrollment.user?.email}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-4">
                                            <div className="flex flex-col gap-1">
                                                <div className="text-white font-bold text-xs uppercase tracking-wider">{enrollment.course?.title || "Legacy Module"}</div>
                                                <div className="text-slate-500 text-[10px] uppercase font-bold tracking-widest flex items-center gap-2">
                                                    <BookOpen size={12} className="text-emerald-400" />
                                                    {new Date(enrollment.createdAt).toLocaleDateString()}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-4">
                                            <span className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest border ${enrollment.status === 'completed' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : enrollment.status === 'cancelled' ? 'bg-rose-500/10 text-rose-400 border-rose-500/20' : 'bg-white/5 text-slate-400 border-white/10'}`}>
                                                {enrollment.status}
                                            </span>
                                        </td>
                                        <td className="px-8 py-4 text-right">
                                            <div className="flex justify-end gap-3">
                                                {enrollment.status === 'pending' && (
                                                    <button onClick={() => handleStatusUpdate(enrollment._id, 'completed')} className="p-3 rounded-xl bg-white/5 text-slate-400 hover:text-emerald-400 hover:bg-emerald-500/10 border border-white/10 hover:border-emerald-500/20 transition-all">
                                                        <CheckCircle size={16} />
                                                    </button>
                                                )}
                                                <button onClick={() => handleDelete(enrollment._id)} className="p-3 rounded-xl bg-white/5 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 border border-white/10 hover:border-rose-500/20 transition-all">
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </motion.tr>
                                ))}
                            </AnimatePresence>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default EnrollmentManagement;
