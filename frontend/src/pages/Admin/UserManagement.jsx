import React, { useCallback, useEffect, useMemo, useState } from "react";
import { apiClient as api } from "../../utils/apiClient";
import { Trash2, Search, User, X, Plus, KeyRound, Mail, Download, Edit2, TrendingUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "../../context/ToastContext";

const MotionTr = motion.tr;
const MotionDiv = motion.div;

const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    const [submitting, setSubmitting] = useState(false);

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: ""
    });

    const toast = useToast();

    const fetchUsers = useCallback(async () => {
        try {
            const { data } = await api.get("/users");
            setUsers(Array.isArray(data) ? data : []);
        } catch {
            toast.error("Failed to load students");
        }
    }, [toast]);

    useEffect(() => {
        fetchUsers();
        const interval = setInterval(fetchUsers, 15000);
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

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8 bg-[#0f172a]/40 backdrop-blur-xl p-8 md:p-10 rounded-[2.5rem] border border-white/5 shadow-2xl relative overflow-hidden group">
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
                <div className="w-full lg:w-auto flex flex-col sm:flex-row gap-4 relative z-10">
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-1 pr-6 flex items-center w-full sm:w-auto group focus-within:border-blue-500/50 focus-within:ring-4 focus-within:ring-blue-500/10 transition-all">
                        <Search className="text-slate-500 ml-4 shrink-0 group-focus-within:text-blue-400 transition-colors" size={20} />
                        <input
                            type="text"
                            placeholder="Identify candidate profile..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="bg-transparent text-white placeholder:text-slate-500 focus:outline-none py-4 px-4 w-full sm:w-64 font-bold text-sm tracking-tight"
                        />
                    </div>
                    <div className="flex gap-4">
                        <button
                            onClick={handleExportStudents}
                            className="bg-white/5 text-slate-300 hover:bg-white/10 border border-white/10 px-8 py-4 rounded-xl font-bold flex items-center gap-3 transition-all active:scale-95 text-[10px] uppercase tracking-widest flex-1 sm:flex-none justify-center"
                        >
                            <Download size={16} />
                            <span>Export Data</span>
                        </button>
                        <button
                            onClick={openCreateModal}
                            className="bg-blue-600 text-white hover:bg-blue-500 px-8 py-4 rounded-xl font-bold flex items-center gap-3 transition-all active:scale-95 shadow-lg shadow-blue-500/20 text-[10px] uppercase tracking-widest flex-1 sm:flex-none justify-center"
                        >
                            <Plus size={18} strokeWidth={2.5} />
                            <span>Deploy Profile</span>
                        </button>
                    </div>
                </div>
            </div>
            {/* Candidate Registry */}
            <div className="bg-[#0f172a]/40 backdrop-blur-xl border border-white/5 rounded-[2.5rem] overflow-hidden shadow-2xl animate-in slide-in-from-bottom-4 duration-700">
                <div className="overflow-x-auto custom-scrollbar">
                    <table className="w-full text-left border-collapse min-w-[900px]">
                        <thead>
                            <tr className="bg-white/5 border-b border-white/5">
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
                                        className="hover:bg-white/5 transition-colors group"
                                    >
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-5">
                                                <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-400 font-bold border border-blue-500/20 shadow-sm transition-transform group-hover:scale-110">
                                                    {(user.name || "S").charAt(0).toUpperCase()}
                                                </div>
                                                <div>
                                                    <div className="font-bold text-white text-[15px] tracking-tight">{user.name}</div>
                                                    <div className="text-[11px] font-bold text-slate-500 uppercase tracking-widest mt-0.5">{user.email}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-2 text-slate-400 text-[11px] font-bold uppercase tracking-wider bg-white/5 w-fit px-3 py-1.5 rounded-lg border border-white/5">
                                                <TrendingUp size={12} className="text-blue-500" />
                                                {new Date(user.createdAt).toLocaleDateString(undefined, {
                                                    month: 'short',
                                                    day: 'numeric',
                                                    year: 'numeric'
                                                })}
                                            </div>
                                        </td>
                                        <td className="px-8 py-6 text-right">
                                            <div className="flex justify-end gap-3">
                                                <button
                                                    onClick={() => openEditModal(user)}
                                                    className="p-3 sm:p-4 rounded-xl text-slate-500 hover:text-blue-400 bg-white/5 hover:bg-blue-500/10 border border-white/5 hover:border-blue-500/20 transition-all active:scale-95"
                                                    title="Refine Entity"
                                                >
                                                    <Edit2 size={18} className="sm:size-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(user._id)}
                                                    className="p-3 sm:p-4 rounded-xl text-slate-500 hover:text-rose-400 bg-white/5 hover:bg-rose-500/10 border border-white/5 hover:border-rose-500/20 transition-all active:scale-95"
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
                        <div className="w-20 h-20 bg-white/5 rounded-3xl flex items-center justify-center mx-auto mb-6 border border-white/5 shadow-inner">
                            <User size={36} className="text-slate-600" />
                        </div>
                        <h3 className="text-xl font-extrabold text-white mb-2 tracking-tight">No Nodes Identified</h3>
                        <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">We couldn't locate any entities matching "{searchTerm}".</p>
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
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 30 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 30 }}
                            className="relative w-full max-w-3xl bg-[#0f172a] border border-white/10 rounded-[2.5rem] sm:rounded-[3rem] p-6 sm:p-10 shadow-2xl flex flex-col max-h-[90vh] overflow-hidden"
                        >
                            <div className="flex items-start justify-between gap-6 mb-10">
                                <div>
                                    <h3 className="text-3xl font-black text-white tracking-tight uppercase">{editingUser ? "Update Profile" : "Initialize Entity"}</h3>
                                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mt-1">Registry Access Level: Student</p>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => !submitting && closeModal()}
                                    className="w-12 h-12 rounded-2xl bg-white/5 hover:bg-white/10 text-slate-500 hover:text-white transition-all flex items-center justify-center border border-white/10"
                                >
                                    <X size={24} />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-8">
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Entity Name</label>
                                    <div className="relative group">
                                        <User size={18} className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-400 transition-colors" />
                                        <input
                                            type="text"
                                            required
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            className="w-full bg-white/5 border border-white/10 rounded-2xl p-6 pl-16 text-white font-bold focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500/30 transition-all placeholder:text-slate-600"
                                            placeholder="Full Name"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Electronic Mail</label>
                                    <div className="relative group">
                                        <Mail size={18} className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-400 transition-colors" />
                                        <input
                                            type="email"
                                            required
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            className="w-full bg-white/5 border border-white/10 rounded-2xl p-6 pl-16 text-white font-bold focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500/30 transition-all placeholder:text-slate-600"
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
                                            <KeyRound size={18} className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-400 transition-colors" />
                                            <input
                                                type="password"
                                                required
                                                minLength={6}
                                                value={formData.password}
                                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                                className="w-full bg-white/5 border border-white/10 rounded-2xl p-6 pl-16 text-white font-bold focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500/30 transition-all placeholder:text-slate-600"
                                                placeholder="Cryptographic String"
                                            />
                                        </div>
                                    </div>
                                )}

                                <div className="flex gap-4 pt-4">
                                    <button
                                        type="button"
                                        onClick={() => !submitting && closeModal()}
                                        className="flex-1 py-4.5 rounded-2xl bg-white/5 text-slate-400 font-bold text-xs uppercase tracking-widest hover:bg-white/10 border border-white/10 transition-all"
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
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default UserManagement;
