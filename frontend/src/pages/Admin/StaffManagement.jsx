import React, { useCallback, useEffect, useMemo, useState } from "react";
import { apiClient as api } from "../../utils/apiClient";
import { ShieldCheck, Search, UserRound, UserCog, Lock, Download, Key, X, Eye, EyeOff, Loader2, ChevronDown } from "lucide-react";
import { useToast } from "../../context/ToastContext";
import { motion, AnimatePresence } from "framer-motion";

const SUPER_ADMIN_EMAIL = "admin@mentriqtechnologies.in";
const MotionDiv = motion.div;

const StaffManagement = () => {
    const [users, setUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [updatingId, setUpdatingId] = useState("");
    const [selectedStudentId, setSelectedStudentId] = useState("");

    // Password Reset State
    const [resetModalOpen, setResetModalOpen] = useState(false);
    const [selectedUserForReset, setSelectedUserForReset] = useState(null);
    const [newPassword, setNewPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [resetting, setResetting] = useState(false);

    const toast = useToast();

    const fetchUsers = useCallback(async () => {
        try {
            const { data } = await api.get("/users");
            setUsers(Array.isArray(data) ? data : []);
        } catch {
            toast.error("Failed to load users");
        }
    }, [toast]);

    useEffect(() => {
        fetchUsers();
        const interval = setInterval(fetchUsers, 15000);
        return () => clearInterval(interval);
    }, [fetchUsers]);

    const staffUsers = useMemo(() => {
        return users.filter((u) => u.role === "admin" || u.role === "moderator");
    }, [users]);

    const students = useMemo(() => {
        return users.filter((u) => u.role === "student");
    }, [users]);

    const filteredStaff = useMemo(() => {
        return staffUsers.filter((u) =>
            `${u?.name || ""} ${u?.email || ""}`.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [staffUsers, searchTerm]);

    const handleRoleUpdate = async (userId, role) => {
        setUpdatingId(userId);
        try {
            await api.put(`/users/role/${userId}`, { role });
            setUsers((prev) => prev.map((u) => (u._id === userId ? { ...u, role } : u)));
            toast.success(`Role updated to ${role}`);
        } catch (err) {
            toast.error(err?.response?.data?.message || "Role update failed");
        } finally {
            setUpdatingId("");
        }
    };

    const grantFromStudent = async (targetRole) => {
        if (!selectedStudentId) {
            toast.error("Select a student first");
            return;
        }
        await handleRoleUpdate(selectedStudentId, targetRole);
        setSelectedStudentId("");
    };

    const handleExportStaff = () => {
        if (filteredStaff.length === 0) {
            toast.error("No staff data to export");
            return;
        }

        const headers = ["Name", "Email", "Role", "Joined Date"];
        const rows = filteredStaff.map((user) => [
            user?.name || "",
            user?.email || "",
            user?.role || "",
            user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : ""
        ]);

        const escapeCell = (value) => `"${String(value).replace(/"/g, '""')}"`;
        const csv = [headers, ...rows].map((row) => row.map(escapeCell).join(",")).join("\n");

        const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `staff-${new Date().toISOString().slice(0, 10)}.csv`;
        link.click();
        URL.revokeObjectURL(url);
        toast.success("Exported in Excel-compatible format");
    };

    const openResetModal = (user) => {
        setSelectedUserForReset(user);
        setNewPassword("");
        setResetModalOpen(true);
    };

    const handlePasswordReset = async (e) => {
        e.preventDefault();
        if (!newPassword || newPassword.length < 6) {
            toast.error("Password must be 6+ chars");
            return;
        }
        setResetting(true);
        try {
            await api.put(`/users/${selectedUserForReset._id}/password`, { password: newPassword });
            toast.success(`Password updated for ${selectedUserForReset.name}`);
            setResetModalOpen(false);
            setNewPassword("");
            setSelectedUserForReset(null);
        } catch (err) {
            toast.error(err?.response?.data?.message || "Password reset failed");
        } finally {
            setResetting(false);
        }
    };

    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-2 duration-1000">
            {/* Page Header */}
            <div className="glass-premium p-10 rounded-[3rem] border border-white/5 shadow-2xl relative overflow-hidden group">
                <div className="flex flex-col lg:flex-row gap-10 lg:items-center lg:justify-between relative z-10">
                    <div>
                        <div className="flex items-center gap-4 mb-2">
                            <div className="p-3 bg-blue-500/10 rounded-2xl border border-blue-500/20 text-blue-400">
                                <UserCog size={32} />
                            </div>
                            <div>
                                <h2 className="text-4xl font-black text-white tracking-tighter theme-gradient-text">Personnel Registry</h2>
                                <div className="flex items-center gap-2 mt-1">
                                    <span className="text-blue-400 bg-blue-500/10 px-3 py-1 rounded-lg border border-blue-500/20 text-[10px] font-black uppercase tracking-widest">
                                        {staffUsers.length} Authorized Nodes
                                    </span>
                                </div>
                            </div>
                        </div>
                        <p className="text-slate-400 font-medium text-sm tracking-tight opacity-80 max-w-xl">System-wide access control and administrative entity management across the core infrastructure.</p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-5 w-full lg:w-auto">
                        <div className="bg-white/[0.03] border border-white/10 rounded-2xl pr-8 flex items-center w-full lg:w-auto group focus-within:border-blue-500/50 focus-within:ring-8 focus-within:ring-blue-500/5 transition-all duration-300 shadow-inner">
                            <Search className="text-slate-500 ml-6 group-focus-within:text-blue-400 transition-colors" size={20} />
                            <input
                                type="text"
                                placeholder="Scan Registry..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="bg-transparent text-white placeholder:text-slate-600 focus:outline-none py-5 px-5 w-full lg:w-72 font-bold text-sm tracking-tight"
                            />
                        </div>
                        <button
                            onClick={handleExportStaff}
                            className="bg-white/[0.03] text-slate-300 hover:bg-blue-500/10 hover:text-blue-400 border border-white/10 hover:border-blue-500/30 px-10 py-5 rounded-2xl font-black flex items-center gap-4 transition-all active:scale-95 text-[10px] uppercase tracking-[0.2em] whitespace-nowrap justify-center shadow-lg"
                        >
                            <Download size={18} />
                            <span>Export Registry</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Elevate Student Section */}
            <div className="glass-premium p-10 rounded-[3rem] border border-white/5 shadow-2xl relative overflow-hidden group">
                <div className="flex flex-col md:flex-row items-center gap-10 relative z-10">
                    <div className="p-5 bg-blue-500/10 rounded-[2rem] border border-blue-500/20 text-blue-400 shadow-xl shadow-blue-500/10 group-hover:scale-110 transition-transform duration-500">
                        <ShieldCheck size={40} />
                    </div>
                    <div className="flex-1 text-center md:text-left">
                        <h3 className="text-2xl font-black text-white tracking-tight font-display">Privilege Escalation</h3>
                        <p className="text-slate-400 text-sm mt-2 font-medium opacity-80">Designate authorized node entities to grant administrative or moderator status.</p>
                    </div>
                    <div className="flex flex-col sm:flex-row items-center gap-5 w-full md:w-auto">
                        <div className="relative w-full sm:w-72">
                            <select
                                value={selectedStudentId}
                                onChange={(e) => setSelectedStudentId(e.target.value)}
                                className="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-4.5 pl-6 pr-12 text-slate-300 font-bold text-sm focus:outline-none focus:ring-8 focus:ring-blue-500/5 focus:border-blue-500/30 transition-all appearance-none cursor-pointer shadow-inner"
                            >
                                <option value="" className="bg-[#030712]">Select Entity Profile...</option>
                                {students.map((s) => (
                                    <option key={s._id} value={s._id} className="bg-[#030712]">
                                        {s.name} ({s.email})
                                    </option>
                                ))}
                            </select>
                            <ChevronDown className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" size={18} />
                        </div>
                        <div className="flex gap-3 w-full md:w-auto">
                            <button
                                onClick={() => grantFromStudent('moderator')}
                                className="flex-1 md:flex-none px-8 py-4.5 bg-blue-600/10 hover:bg-blue-600/20 border border-blue-600/20 text-blue-400 font-black text-[10px] uppercase tracking-[0.2em] rounded-2xl transition-all active:scale-95 shadow-sm"
                            >
                                Moderator
                            </button>
                            <button
                                onClick={() => grantFromStudent('admin')}
                                className="flex-1 md:flex-none px-8 py-4.5 bg-blue-600 hover:bg-blue-500 text-white font-black text-[10px] uppercase tracking-[0.2em] rounded-2xl transition-all active:scale-95 shadow-2xl shadow-blue-600/50"
                            >
                                Administrator
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            {/* Staff Entity Registry */}
            <div className="bg-[#0f172a]/40 backdrop-blur-xl border border-white/5 rounded-[2.5rem] overflow-hidden shadow-2xl animate-in slide-in-from-bottom-4 duration-700">
                <div className="overflow-x-auto custom-scrollbar">
                    <table className="w-full text-left border-collapse min-w-[700px]">
                        <thead>
                            <tr className="bg-white/[0.03] border-b border-white/10 shadow-sm">
                                <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.25em] text-slate-500/80">Authorized Node</th>
                                <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.25em] text-slate-500/80">Entity Role</th>
                                <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.25em] text-slate-500/80 text-right">Directives</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5 backdrop-blur-sm">
                            {filteredStaff.map((user) => {
                                const isSuperAdmin = user.email === SUPER_ADMIN_EMAIL;
                                const isPending = updatingId === user._id;
                                return (
                                    <tr key={user._id} className="hover:bg-white/[0.02] transition-colors group/row">
                                        <td className="px-10 py-8">
                                            <div className="flex items-center gap-6">
                                                <div className="w-14 h-14 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-400 font-black border border-blue-500/20 shadow-lg group-hover/row:scale-110 transition-transform duration-500 group-hover/row:border-blue-500/40">
                                                    {(user.name || "A").charAt(0).toUpperCase()}
                                                </div>
                                                <div>
                                                    <div className="font-black text-white text-[16px] tracking-tight group-hover/row:text-blue-400 transition-colors">{user.name}</div>
                                                    <div className="text-[11px] font-bold text-slate-500/80 tracking-widest mt-1 uppercase">{user.email}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-10 py-8">
                                            <div className="flex flex-wrap gap-3">
                                                <span className={`px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-[0.15em] border ${user.role === 'admin'
                                                    ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20 shadow-sm shadow-rose-500/10'
                                                    : 'bg-blue-500/10 text-blue-400 border border-blue-500/20 shadow-lg shadow-blue-500/10'
                                                    }`}>
                                                    {user.role}
                                                </span>
                                                {isSuperAdmin && (
                                                    <span className="px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-[0.15em] border bg-amber-500/10 text-amber-400 border-amber-500/20 inline-flex items-center gap-2 shadow-sm shadow-amber-500/10">
                                                        <Lock size={12} className="text-amber-500" />
                                                        Core Admin
                                                    </span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-10 py-8 text-right">
                                            <div className="flex items-center justify-end gap-4">
                                                <button
                                                    onClick={() => openResetModal(user)}
                                                    className="p-3 sm:p-4 rounded-2xl bg-white/[0.03] border border-white/5 text-slate-500 hover:text-blue-400 hover:bg-blue-500/10 hover:border-blue-500/30 transition-all flex items-center gap-3 group/btn active:scale-95"
                                                    title="Security Reset"
                                                >
                                                    <Key size={16} className="group-hover/btn:rotate-12 transition-transform" />
                                                    <span className="text-[10px] sm:text-[10px] font-black uppercase tracking-[0.15em] hidden sm:inline">Reset Key</span>
                                                </button>

                                                {!isSuperAdmin && (
                                                    <button
                                                        onClick={() => handleRoleUpdate(user._id, 'student')}
                                                        className="p-3 sm:p-4 rounded-2xl bg-white/[0.03] border border-white/5 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 hover:border-rose-500/30 transition-all flex items-center gap-3 group/btn active:scale-95"
                                                        disabled={updatingId === user._id}
                                                        title="Revoke Access"
                                                    >
                                                        {updatingId === user._id ? (
                                                            <Loader2 size={16} className="animate-spin text-blue-500" />
                                                        ) : (
                                                            <>
                                                                <Lock size={16} className="group-hover/btn:scale-110 transition-transform" />
                                                                <span className="text-[10px] font-black uppercase tracking-[0.15em] hidden sm:inline">Revoke</span>
                                                            </>
                                                        )}
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
                {filteredStaff.length === 0 && (
                    <div className="py-32 text-center relative z-10">
                        <div className="w-24 h-24 bg-white/[0.02] rounded-full flex items-center justify-center mx-auto mb-6 border border-white/5 shadow-inner">
                            <UserRound size={48} className="text-slate-700" />
                        </div>
                        <p className="text-slate-500 font-bold uppercase tracking-[0.2em] text-xs">No personnel entries detected.</p>
                    </div>
                )}
            </div>

            <AnimatePresence>
                {resetModalOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-[#030712]/90 backdrop-blur-2xl">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 30 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 30 }}
                            className="relative w-full max-w-lg bg-[#0f172a] border border-white/10 rounded-[2.5rem] sm:rounded-[3rem] p-6 sm:p-10 shadow-2xl flex flex-col max-h-[90vh] overflow-hidden"
                        >
                            {/* Modal Background Ambient */}
                            <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-500/5 blur-[100px] pointer-events-none" />

                            <div className="flex items-start justify-between mb-12 relative z-10">
                                <div>
                                    <h3 className="text-3xl font-black text-white tracking-tighter uppercase font-display theme-gradient-text">Security Override</h3>
                                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.35em] mt-3 bg-white/5 px-4 py-1.5 rounded-lg inline-block border border-white/5">Signal Target: {selectedUserForReset?.name}</p>
                                </div>
                                <button
                                    onClick={() => !resetting && setResetModalOpen(false)}
                                    className="p-4 rounded-2xl bg-white/[0.03] hover:bg-white/[0.1] text-slate-400 hover:text-white transition-all border border-white/10 shadow-lg"
                                >
                                    <X size={24} />
                                </button>
                            </div>

                            <form onSubmit={handlePasswordReset} className="space-y-10 relative z-10">
                                <div className="space-y-4">
                                    <label className="text-[10px] font-black text-slate-400/80 uppercase tracking-[0.25em] ml-2">New Secret Access Key</label>
                                    <div className="relative group">
                                        <div className="absolute left-7 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-400 transition-colors">
                                            <Key size={22} />
                                        </div>
                                        <input
                                            required
                                            type={showPassword ? "text" : "password"}
                                            value={newPassword}
                                            onChange={(e) => setNewPassword(e.target.value)}
                                            placeholder="Min. 6 alphanumeric"
                                            className="w-full bg-white/[0.03] border border-white/10 rounded-[2rem] p-7 pl-16 pr-16 text-white text-lg font-black tracking-[0.15em] focus:outline-none focus:ring-8 focus:ring-blue-500/5 focus:border-blue-500/30 transition-all placeholder:text-slate-700 shadow-inner"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-7 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors p-2"
                                        >
                                            {showPassword ? <EyeOff size={22} /> : <Eye size={22} />}
                                        </button>
                                    </div>
                                </div>

                                <div className="flex gap-5 pt-4">
                                    <button
                                        type="button"
                                        onClick={() => !resetting && setResetModalOpen(false)}
                                        className="flex-1 py-5 rounded-[1.75rem] bg-white/[0.03] text-slate-400 font-black text-[10px] uppercase tracking-[0.25em] hover:bg-white/[0.08] border border-white/5 transition-all active:scale-[0.98]"
                                    >
                                        Abort
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={resetting}
                                        className="flex-2 py-5 rounded-[1.75rem] bg-blue-600 text-white font-black text-[10px] uppercase tracking-[0.25em] hover:bg-blue-500 shadow-2xl shadow-blue-600/60 transition-all flex items-center justify-center gap-3 active:scale-[0.98]"
                                    >
                                        {resetting ? (
                                            <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin" />
                                        ) : (
                                            <>
                                                <ShieldCheck size={20} />
                                                <span>Authorize Signal</span>
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

export default StaffManagement;
