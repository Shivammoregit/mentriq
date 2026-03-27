import React, { useCallback, useEffect, useMemo, useState } from "react";
import { apiClient as api } from "../../utils/apiClient";
import { Trash2, Search, User, X, Plus, KeyRound, Mail, Download, Edit2, TrendingUp, MessageSquare, Send } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "../../context/ToastContext";

const MotionTr = motion.tr;
const MotionDiv = motion.div;

const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    const [viewProfile, setViewProfile] = useState(null);
    const [submitting, setSubmitting] = useState(false);
    const [userEnrollments, setUserEnrollments] = useState([]);
    const [loadingEnrollments, setLoadingEnrollments] = useState(false);

    const [isBroadcastModalOpen, setIsBroadcastModalOpen] = useState(false);
    const [broadcastData, setBroadcastData] = useState({ subject: "", message: "", roleFilter: "" });
    const [isBroadcasting, setIsBroadcasting] = useState(false);

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: ""
    });

    const toast = useToast();

    const fetchUsers = useCallback(async (silent = false) => {
        try {
            const { data } = await api.get("/users");
            setUsers(Array.isArray(data) ? data : []);
        } catch {
            if (!silent) toast.error("Failed to load students");
        }
    }, [toast]);

    useEffect(() => {
        fetchUsers(false);
        const interval = setInterval(() => fetchUsers(true), 15000);
        return () => clearInterval(interval);
    }, [fetchUsers]);

    const students = useMemo(
        () => users.filter((u) => u.role === "student"),
        [users]
    );

    const filteredStudents = useMemo(() => {
        return students.filter((user) =>
            `${user?.name || ""} ${user?.email || ""}`
                .toLowerCase()
                .includes(searchTerm.toLowerCase())
        );
    }, [students, searchTerm]);

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure? This action cannot be undone.")) return;
        try {
            await api.delete(`/users/${id}`);
            toast.success("Student deleted successfully");
            setUsers((prev) => prev.filter((user) => user._id !== id));
        } catch {
            toast.error("Failed to delete student");
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            if (editingUser) {
                // Update Mode
                const payload = {
                    name: formData.name.trim(),
                    email: formData.email.trim()
                };
                const { data } = await api.put(`/users/${editingUser._id}`, payload);
                if (data?.success) {
                    setUsers(prev => prev.map(u => u._id === editingUser._id ? { ...u, ...data.user } : u));
                    toast.success("Student updated successfully");
                }
            } else {
                // Create Mode
                const payload = {
                    name: formData.name.trim(),
                    email: formData.email.trim(),
                    password: formData.password,
                    role: "student"
                };
                const { data } = await api.post("/users", payload);
                if (data?.user) {
                    setUsers((prev) => [data.user, ...prev]);
                    toast.success("Student created successfully");
                }
            }

            closeModal();
        } catch (err) {
            toast.error(err?.response?.data?.message || "Operation failed");
        } finally {
            setSubmitting(false);
        }
    };

    const openCreateModal = () => {
        setEditingUser(null);
        setFormData({ name: "", email: "", password: "" });
        setIsModalOpen(true);
    };

    const openEditModal = (user) => {
        setEditingUser(user);
        setFormData({ name: user.name, email: user.email, password: "" });
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingUser(null);
        setFormData({ name: "", email: "", password: "" });
    };

    const handleViewProfile = async (user) => {
        setViewProfile(user);
        setLoadingEnrollments(true);
        try {
            const { data } = await api.get("/enrollments");
            const userEnrs = (data || []).filter(e => e.user?._id === user._id);
            setUserEnrollments(userEnrs);
        } catch (err) {
            setUserEnrollments([]);
        } finally {
            setLoadingEnrollments(false);
        }
    };

    const handleExportStudents = () => {
        if (filteredStudents.length === 0) {
            toast.error("No students available to export");
            return;
        }

        const headers = ["Name", "Email", "Role", "Joined Date"];
        const rows = filteredStudents.map((user) => [
            user?.name || "",
            user?.email || "",
            user?.role || "student",
            user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : ""
        ]);

        const escapeCell = (value) => `"${String(value).replace(/"/g, '""')}"`;
        const csv = [headers, ...rows].map((row) => row.map(escapeCell).join(",")).join("\n");

        const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `students-${new Date().toISOString().slice(0, 10)}.csv`;
        link.click();
        URL.revokeObjectURL(url);
        toast.success("Exported in Excel-compatible format");
    };

    const handleBroadcastSubmit = async (e) => {
        e.preventDefault();
        if (!broadcastData.subject || !broadcastData.message) {
            toast.error("Subject and Message are required");
            return;
        }
        setIsBroadcasting(true);
        try {
            const { data } = await api.post("/users/broadcast", broadcastData);
            if (data?.success) {
                toast.success(data.message || "Message broadcasted successfully!");
                setIsBroadcastModalOpen(false);
                setBroadcastData({ subject: "", message: "", roleFilter: "" });
            }
        } catch (err) {
            toast.error(err?.response?.data?.message || "Failed to broadcast message");
        } finally {
            setIsBroadcasting(false);
        }
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 bg-[#0b1120]/40 backdrop-blur-xl p-6 md:p-8 rounded-[2.5rem] border border-white/5 shadow-2xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-12 opacity-[0.03] group-hover:opacity-[0.05] transition-opacity">
                    <User size={200} className="text-blue-500" />
                </div>
                <div className="w-full lg:w-auto relative z-10">
                    <h2 className="text-3xl md:text-3xl font-extrabold text-white tracking-tight">Candidate Registry</h2>
                    <p className="text-slate-400 text-[10px] font-bold uppercase tracking-[0.2em] mt-3 flex items-center gap-3">
                        <span className="text-blue-400 bg-blue-500/10 px-3 py-1 rounded-lg border border-blue-500/20 shadow-sm font-black">{students.length} Nodes</span>
                        <span className="opacity-70">Authenticated database of active learners and enrollment entities.</span>
                    </p>
                </div>
                <div className="w-full lg:w-auto flex flex-row items-stretch gap-3 relative z-10">
                    <div className="bg-[#1e293b] border border-white/10 rounded-2xl p-1 pr-4 flex items-center flex-1 min-w-[320px] group focus-within:border-blue-500/50 focus-within:ring-4 focus-within:ring-blue-500/10 transition-all">
                        <Search className="text-slate-400 ml-4 shrink-0 group-focus-within:text-blue-400 transition-colors" size={20} />
                        <input
                            type="text"
                            placeholder="Identify candidate profile..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="bg-transparent text-white placeholder:text-slate-400 focus:outline-none py-4 px-4 w-full font-bold text-sm tracking-tight"
                        />
                    </div>
                    <div className="flex gap-3">
                        <button
                            onClick={handleExportStudents}
                            className="bg-[#1e293b] text-slate-300 hover:bg-white/10 border border-white/10 px-6 py-4 rounded-xl font-bold flex items-center gap-3 transition-all active:scale-95 text-[10px] uppercase tracking-widest justify-center whitespace-nowrap min-w-[170px]"
                        >
                            <Download size={16} />
                            <span>Export Data</span>
                        </button>
                        <button
                            onClick={openCreateModal}
                            className="bg-blue-600 text-white hover:bg-blue-500 px-6 py-4 rounded-xl font-bold flex items-center gap-3 transition-all active:scale-95 shadow-lg shadow-blue-500/20 text-[10px] uppercase tracking-widest justify-center whitespace-nowrap min-w-[190px]"
                        >
                            <Plus size={18} strokeWidth={2.5} />
                            <span>Deploy Profile</span>
                        </button>
                    </div>
                </div>
            </div>
            {/* Candidate Registry */}
            <div className="bg-[#0b1120]/40 backdrop-blur-xl border border-white/5 rounded-[2.5rem] overflow-hidden shadow-2xl animate-in slide-in-from-bottom-4 duration-700">
                <div className="overflow-x-auto custom-scrollbar">
                    <table className="w-full text-left border-collapse min-w-[900px]">
                        <thead>
                            <tr className="bg-[#1e293b] border-b border-white/5">
                                <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">Student Profile</th>
                                <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">Registration Cycle</th>
                                <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 text-right">Administrative Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            <AnimatePresence mode="popLayout">
                                {filteredStudents.map((user) => (
                                    <MotionTr
                                        layout
                                        key={user._id}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        className="hover:bg-[#1e293b] transition-colors group cursor-pointer"
                                        onClick={() => handleViewProfile(user)}
                                    >
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-5">
                                                <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-400 font-bold border border-blue-500/20 shadow-sm transition-transform group-hover:scale-110">
                                                    {(user.name || "S").charAt(0).toUpperCase()}
                                                </div>
                                                <div>
                                                    <div className="font-bold text-white text-[15px] tracking-tight">{user.name}</div>
                                                    <div className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">{user.email}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-2 text-slate-400 text-[11px] font-bold uppercase tracking-wider bg-[#1e293b] w-fit px-3 py-1.5 rounded-lg border border-white/5">
                                                <TrendingUp size={12} className="text-blue-500" />
                                                {new Date(user.createdAt).toLocaleDateString(undefined, {
                                                    month: 'short',
                                                    day: 'numeric',
                                                    year: 'numeric'
                                                })}
                                            </div>
                                        </td>
                                        <td className="px-8 py-6 text-right">
                                            <div className="flex justify-end gap-3" onClick={(e) => e.stopPropagation()}>
                                                <button
                                                    onClick={() => openEditModal(user)}
                                                    className="p-3 sm:p-4 rounded-xl text-slate-400 hover:text-blue-400 bg-[#1e293b] hover:bg-blue-500/10 border border-white/5 hover:border-blue-500/20 transition-all active:scale-95"
                                                    title="Refine Entity"
                                                >
                                                    <Edit2 size={18} className="sm:size-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(user._id)}
                                                    className="p-3 sm:p-4 rounded-xl text-slate-400 hover:text-rose-400 bg-[#1e293b] hover:bg-rose-500/10 border border-white/5 hover:border-rose-500/20 transition-all active:scale-95"
                                                    title="Terminate Node"
                                                >
                                                    <Trash2 size={18} className="sm:size-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </MotionTr>
                                ))}
                            </AnimatePresence>
                        </tbody>
                    </table>
                </div>
                {filteredStudents.length === 0 && (
                    <div className="py-24 text-center">
                        <div className="w-20 h-20 bg-[#1e293b] rounded-3xl flex items-center justify-center mx-auto mb-6 border border-white/5 shadow-inner">
                            <User size={36} className="text-slate-400" />
                        </div>
                        <h3 className="text-xl font-extrabold text-white mb-2 tracking-tight">No Nodes Identified</h3>
                        <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">We couldn't locate any entities matching "{searchTerm}".</p>
                    </div>
                )}
            </div>

            <AnimatePresence>
                {isModalOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl">
                        <div
                            className="absolute inset-0"
                            onClick={() => !submitting && closeModal()}
                        />
                        <MotionDiv
                            initial={{ opacity: 0, scale: 0.95, y: 30 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 30 }}
                            className="relative w-full max-w-3xl bg-[#0b1120] border border-white/10 rounded-[2.5rem] sm:rounded-[3rem] p-6 sm:p-10 shadow-2xl flex flex-col max-h-[90vh] overflow-hidden"
                        >
                            <div className="flex items-start justify-between gap-6 mb-10">
                                <div>
                                    <h3 className="text-3xl font-black text-white tracking-tight uppercase">{editingUser ? "Update Profile" : "Initialize Entity"}</h3>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mt-1">Registry Access Level: Student</p>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => !submitting && closeModal()}
                                    className="w-12 h-12 rounded-2xl bg-[#1e293b] hover:bg-white/10 text-slate-400 hover:text-white transition-all flex items-center justify-center border border-white/10"
                                >
                                    <X size={24} />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-8">
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Entity Name</label>
                                    <div className="relative group">
                                        <User size={18} className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-400 transition-colors" />
                                        <input
                                            type="text"
                                            required
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            className="w-full bg-[#1e293b] border border-white/10 rounded-2xl p-6 pl-16 text-white font-bold focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500/30 transition-all placeholder:text-slate-400"
                                            placeholder="Full Name"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Electronic Mail</label>
                                    <div className="relative group">
                                        <Mail size={18} className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-400 transition-colors" />
                                        <input
                                            type="email"
                                            required
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            className="w-full bg-[#1e293b] border border-white/10 rounded-2xl p-6 pl-16 text-white font-bold focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500/30 transition-all placeholder:text-slate-400"
                                            placeholder="email@example.com"
                                        />
                                    </div>
                                </div>

                                {editingUser && (
                                    <div className="bg-blue-500/5 border border-blue-500/10 rounded-2xl p-6 flex items-start gap-4">
                                        <KeyRound className="text-blue-500 shrink-0" size={20} />
                                        <p className="text-xs text-blue-400 font-medium leading-relaxed">
                                            Password management is locked for active accounts. Administrators cannot view or override student passkeys directly.
                                        </p>
                                    </div>
                                )}

                                {!editingUser && (
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Security Key</label>
                                        <div className="relative group">
                                            <KeyRound size={18} className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-400 transition-colors" />
                                            <input
                                                type="password"
                                                required
                                                minLength={6}
                                                value={formData.password}
                                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                                className="w-full bg-[#1e293b] border border-white/10 rounded-2xl p-6 pl-16 text-white font-bold focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500/30 transition-all placeholder:text-slate-400"
                                                placeholder="Cryptographic String"
                                            />
                                        </div>
                                    </div>
                                )}

                                <div className="flex gap-4 pt-4">
                                    <button
                                        type="button"
                                        onClick={() => !submitting && closeModal()}
                                        className="flex-1 py-4.5 rounded-2xl bg-[#1e293b] text-slate-400 font-bold text-xs uppercase tracking-widest hover:bg-white/10 border border-white/10 transition-all"
                                    >
                                        Abort
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={submitting}
                                        className="flex-2 py-4.5 rounded-2xl bg-blue-600 text-white font-bold text-xs uppercase tracking-widest hover:bg-blue-500 shadow-lg shadow-blue-500/20 transition-all flex items-center justify-center gap-2"
                                    >
                                        {submitting ? (
                                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        ) : (
                                            <>
                                                <Plus size={16} />
                                                <span>{editingUser ? "Commit Sync" : "Deploy Entity"}</span>
                                            </>
                                        )}
                                    </button>
                                </div>
                            </form>
                        </MotionDiv>
                    </div>
                )}
            </AnimatePresence>

            <AnimatePresence>
                {viewProfile && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl">
                        <div
                            className="absolute inset-0"
                            onClick={() => setViewProfile(null)}
                        />
                        <MotionDiv
                            initial={{ opacity: 0, scale: 0.95, y: 30 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 30 }}
                            className="relative w-full max-w-2xl bg-[#0b1120] border border-white/10 rounded-[2.5rem] sm:rounded-[3rem] p-6 sm:p-10 shadow-2xl flex flex-col max-h-[90vh] overflow-hidden"
                        >
                            <div className="flex items-start justify-between gap-6 mb-8 shrink-0">
                                <div>
                                    <h3 className="text-3xl font-black text-white tracking-tight uppercase">Candidate Profile</h3>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mt-1">Registry Role: {viewProfile.role}</p>
                                </div>
                                <button
                                    onClick={() => setViewProfile(null)}
                                    className="w-12 h-12 rounded-2xl bg-[#1e293b] hover:bg-white/10 text-slate-400 hover:text-white transition-all flex items-center justify-center border border-white/10"
                                >
                                    <X size={24} />
                                </button>
                            </div>

                            <div className="flex-1 overflow-y-auto pr-4 -mr-4 space-y-6 custom-scrollbar">
                                {/* Details Card */}
                                <div className="bg-[#1e293b] rounded-2xl p-6 border border-white/5 space-y-4">
                                    <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 border-b border-white/10 pb-2">Profile Information</h4>
                                    
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                        <div>
                                            <p className="text-slate-500 text-[10px] font-bold uppercase tracking-wider mb-1">Full Name</p>
                                            <p className="text-white font-medium text-sm">{viewProfile.name}</p>
                                        </div>
                                        
                                        <div>
                                            <p className="text-slate-500 text-[10px] font-bold uppercase tracking-wider mb-1">Email Address</p>
                                            <p className="text-white font-medium text-sm flex items-center gap-2">
                                                <Mail size={14} className="text-slate-400" />
                                                {viewProfile.email}
                                            </p>
                                        </div>

                                        <div>
                                            <p className="text-slate-500 text-[10px] font-bold uppercase tracking-wider mb-1">Join Date</p>
                                            <p className="text-white font-medium text-sm flex items-center gap-2">
                                                <TrendingUp size={14} className="text-slate-400" />
                                                {new Date(viewProfile.createdAt).toLocaleDateString(undefined, {
                                                    month: 'long',
                                                    day: 'numeric',
                                                    year: 'numeric'
                                                })}
                                            </p>
                                        </div>
                                        
                                        <div>
                                            <p className="text-slate-500 text-[10px] font-bold uppercase tracking-wider mb-1">System ID</p>
                                            <p className="text-white font-medium text-[11px] bg-black/20 p-2 rounded border border-white/5 font-mono break-all w-fit">
                                                {viewProfile._id}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Enrollments Section */}
                                <div className="bg-[#1e293b] rounded-2xl p-6 border border-white/5 space-y-4">
                                    <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 border-b border-white/10 pb-2">Academic Enrollments</h4>
                                    
                                    {loadingEnrollments ? (
                                        <div className="flex flex-col items-center justify-center py-6 gap-3">
                                            <div className="w-6 h-6 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
                                            <span className="text-[9px] font-black tracking-widest uppercase text-slate-500">Retrieving Records...</span>
                                        </div>
                                    ) : userEnrollments.length === 0 ? (
                                        <div className="text-center py-6 bg-black/20 rounded-xl border border-white/5">
                                            <p className="text-slate-500 text-xs font-bold">No active enrollments for this candidate.</p>
                                        </div>
                                    ) : (
                                        <div className="space-y-3">
                                            {userEnrollments.map((enr, i) => (
                                                <div key={enr._id || i} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-black/20 p-4 rounded-xl border border-white/5 hover:border-blue-500/20 transition-colors">
                                                    <div>
                                                        <p className="text-white font-bold text-sm tracking-tight">{enr.course?.title || "Unknown Course"}</p>
                                                        <p className="text-slate-400 text-[10px] tracking-widest uppercase mt-1">
                                                            Enrolled: {new Date(enr.createdAt).toLocaleDateString()}
                                                        </p>
                                                    </div>
                                                    <div>
                                                        <span className={`inline-block px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border ${enr.status === 'completed' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-blue-500/10 text-blue-400 border-blue-500/20'}`}>
                                                            {enr.status || 'Active'}
                                                        </span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </MotionDiv>
                    </div>
                )}
            </AnimatePresence>

            {/* Broadcast Modal */}
            <AnimatePresence>
                {isBroadcastModalOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl">
                        <div
                            className="absolute inset-0"
                            onClick={() => !isBroadcasting && setIsBroadcastModalOpen(false)}
                        />
                        <MotionDiv
                            initial={{ opacity: 0, scale: 0.95, y: 30 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 30 }}
                            className="relative w-full max-w-2xl bg-[#0b1120] border border-white/10 rounded-[2.5rem] sm:rounded-[3rem] p-6 sm:p-10 shadow-2xl flex flex-col max-h-[90vh] overflow-hidden"
                        >
                            <div className="flex items-start justify-between gap-6 mb-8 shrink-0">
                                <div>
                                    <h3 className="text-3xl font-black text-white tracking-tight flex items-center gap-3">
                                        <div className="p-3 bg-sky-500/10 rounded-2xl border border-sky-500/20 text-sky-400">
                                            <Send size={24} />
                                        </div>
                                        <span>Communications</span>
                                    </h3>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mt-3">Broadcast message to nodes</p>
                                </div>
                                <button
                                    onClick={() => !isBroadcasting && setIsBroadcastModalOpen(false)}
                                    className="w-12 h-12 rounded-2xl bg-[#1e293b] hover:bg-white/10 text-slate-400 hover:text-white transition-all flex items-center justify-center border border-white/10"
                                >
                                    <X size={24} />
                                </button>
                            </div>

                            <form onSubmit={handleBroadcastSubmit} className="flex-1 overflow-y-auto pr-4 -mr-4 space-y-6 custom-scrollbar">
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Target Audience</label>
                                    <div className="relative group">
                                        <Users size={18} className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-sky-400 transition-colors" />
                                        <select
                                            value={broadcastData.roleFilter}
                                            onChange={(e) => setBroadcastData({ ...broadcastData, roleFilter: e.target.value })}
                                            className="w-full bg-[#1e293b] border border-white/10 rounded-2xl p-6 pl-16 text-white font-bold focus:outline-none focus:ring-4 focus:ring-sky-500/10 focus:border-sky-500/30 transition-all appearance-none cursor-pointer"
                                        >
                                            <option value="">All Registered Users</option>
                                            <option value="student">Students Only</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Transmission Subject</label>
                                    <div className="relative group">
                                        <Edit2 size={18} className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-sky-400 transition-colors" />
                                        <input
                                            type="text"
                                            required
                                            value={broadcastData.subject}
                                            onChange={(e) => setBroadcastData({ ...broadcastData, subject: e.target.value })}
                                            className="w-full bg-[#1e293b] border border-white/10 rounded-2xl p-6 pl-16 text-white font-bold focus:outline-none focus:ring-4 focus:ring-sky-500/10 focus:border-sky-500/30 transition-all placeholder:text-slate-500"
                                            placeholder="Enter subject line..."
                                        />
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Message Payload</label>
                                    <div className="relative group">
                                        <MessageSquare size={18} className="absolute left-6 top-6 text-slate-400 group-focus-within:text-sky-400 transition-colors" />
                                        <textarea
                                            required
                                            rows="5"
                                            value={broadcastData.message}
                                            onChange={(e) => setBroadcastData({ ...broadcastData, message: e.target.value })}
                                            className="w-full bg-[#1e293b] border border-white/10 rounded-2xl p-6 pl-16 text-white font-medium focus:outline-none focus:ring-4 focus:ring-sky-500/10 focus:border-sky-500/30 transition-all placeholder:text-slate-500 resize-none custom-scrollbar"
                                            placeholder="Compose your message here. HTML tags are not allowed but newlines will be preserved."
                                        />
                                    </div>
                                </div>

                                <div className="pt-4 flex justify-end gap-4">
                                    <button
                                        type="button"
                                        onClick={() => !isBroadcasting && setIsBroadcastModalOpen(false)}
                                        className="px-8 py-4.5 rounded-2xl bg-[#1e293b] text-slate-400 font-bold text-xs uppercase tracking-widest hover:bg-white/10 border border-white/10 transition-all"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isBroadcasting}
                                        className="px-8 py-4.5 rounded-2xl bg-sky-500 text-white font-bold text-xs uppercase tracking-widest hover:bg-sky-400 shadow-lg shadow-sky-500/20 transition-all flex items-center justify-center gap-2 min-w-[160px]"
                                    >
                                        {isBroadcasting ? (
                                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        ) : (
                                            <>
                                                <Send size={16} />
                                                <span>Deploy Broadcast</span>
                                            </>
                                        )}
                                    </button>
                                </div>
                            </form>
                        </MotionDiv>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default UserManagement;
