import React, { useEffect, useState } from "react";
import { apiClient as api } from "../../utils/apiClient";
import { Plus, Edit2, Trash2, MapPin, Calendar, Check, X, History, Zap, CheckCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "../../context/ToastContext";

const JourneyManagement = () => {
    const [milestones, setMilestones] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingMilestone, setEditingMilestone] = useState(null);
    const toast = useToast();

    const initialFormState = { year: "", title: "", description: "", order: 0 };
    const [formData, setFormData] = useState(initialFormState);

    const fetchMilestones = async () => {
        try {
            const { data } = await api.get("/journey");
            setMilestones(data || []);
        } catch (err) {
            toast.error("Failed to load timeline data");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMilestones();
        const interval = setInterval(fetchMilestones, 15000);
        return () => clearInterval(interval);
    }, []);

    const handleDelete = async (id) => {
        if (!window.confirm("Terminate historical milestone?")) return;
        try {
            await api.delete(`/journey/${id}`);
            toast.success("Milestone purged");
            fetchMilestones();
        } catch (err) {
            toast.error("Purge failed");
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const payload = {
                ...formData,
                year: parseInt(formData.year),
                order: parseInt(formData.order)
            };

            if (editingMilestone) {
                await api.put(`/journey/${editingMilestone._id}`, payload);
                toast.success("Timeline logic updated");
            } else {
                await api.post("/journey", payload);
                toast.success("New milestone deployed");
            }
            setIsModalOpen(false);
            setEditingMilestone(null);
            setFormData(initialFormState);
            fetchMilestones();
        } catch (err) {
            toast.error("Data transmission failed");
        }
    };

    const openEditModal = (milestone) => {
        setEditingMilestone(milestone);
        setFormData({
            year: milestone.year || "",
            title: milestone.title || "",
            description: milestone.description || "",
            order: milestone.order || 0
        });
        setIsModalOpen(true);
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* Page Header */}
            <div className="bg-[#0f172a]/40 backdrop-blur-xl p-8 rounded-3xl border border-white/5 shadow-2xl relative overflow-hidden group">
                <div className="flex flex-col lg:flex-row gap-8 lg:items-center lg:justify-between relative z-10">
                    <div>
                        <div className="flex items-center gap-3 mb-1">
                            <History size={28} className="text-emerald-400" />
                            <h2 className="text-3xl font-extrabold text-white tracking-tight">Timeline Architecture</h2>
                            <span className="ml-2 text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-lg border border-emerald-500/20 text-xs font-bold">
                                {milestones.length} Historical Nodes
                            </span>
                        </div>
                        <p className="text-slate-400 font-medium text-sm">Corporate trajectory and historical milestone management.</p>
                    </div>

                    <div className="flex gap-4">
                        <button
                            onClick={() => { setEditingMilestone(null); setFormData(initialFormState); setIsModalOpen(true); }}
                            className="bg-emerald-600 text-white hover:bg-emerald-500 px-8 py-4 rounded-xl font-bold flex items-center gap-3 transition-all active:scale-95 shadow-lg shadow-emerald-500/20 text-[10px] uppercase tracking-widest justify-center"
                        >
                            <Plus size={18} />
                            <span>Inject Milestone</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Journey Table */}
            <div className="bg-[#0f172a]/40 backdrop-blur-xl border border-white/5 rounded-[2.5rem] overflow-hidden shadow-2xl">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-white/5 border-b border-white/10">
                                <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">Temporal Node (Year)</th>
                                <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">Event Designation</th>
                                <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {milestones.sort((a, b) => b.order - a.order).map((milestone) => (
                                <motion.tr
                                    key={milestone._id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="hover:bg-white/5 transition-colors group"
                                >
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-3">
                                            <Calendar size={16} className="text-emerald-400" />
                                            <span className="font-black text-white text-[15px] tracking-widest">{milestone.year}</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6 max-w-xl">
                                        <div>
                                            <div className="font-bold text-white text-[15px] tracking-tight">{milestone.title}</div>
                                            <p className="text-slate-400 text-xs mt-1 leading-relaxed font-medium line-clamp-1">{milestone.description}</p>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6 text-right">
                                        <div className="flex justify-end gap-3">
                                            <button onClick={() => openEditModal(milestone)} className="p-3 rounded-xl bg-white/5 text-slate-400 hover:text-emerald-400 hover:bg-emerald-500/10 border border-white/10 hover:border-emerald-500/20 transition-all">
                                                <Edit2 size={16} />
                                            </button>
                                            <button onClick={() => handleDelete(milestone._id)} className="p-3 rounded-xl bg-white/5 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 border border-white/10 hover:border-rose-500/20 transition-all">
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </motion.tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal */}
            <AnimatePresence>
                {isModalOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 30 }}
                            className="relative w-full max-w-xl bg-[#0f172a] border border-white/10 rounded-[3rem] p-10 shadow-2xl flex flex-col"
                        >
                            <div className="flex items-start justify-between gap-6 mb-10 shrink-0">
                                <div>
                                    <h3 className="text-3xl font-black text-white tracking-tight uppercase">
                                        {editingMilestone ? "Refine History" : "Write History"}
                                    </h3>
                                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mt-1">Temporal Alignment Module</p>
                                </div>
                                <button
                                    onClick={() => setIsModalOpen(false)}
                                    className="p-3.5 rounded-2xl bg-white/5 hover:bg-white/10 text-slate-500 hover:text-white transition-all border border-white/10"
                                >
                                    <X size={24} />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="flex-1 space-y-8">
                                <div className="grid grid-cols-2 gap-8">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Temporal Node (Year)</label>
                                        <input
                                            required
                                            type="number"
                                            value={formData.year}
                                            onChange={e => setFormData({ ...formData, year: e.target.value })}
                                            className="w-full bg-white/5 border border-white/10 rounded-2xl p-6 text-white font-bold focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500/30 transition-all placeholder:text-slate-600"
                                            placeholder="2024"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Sequence Order</label>
                                        <input
                                            required
                                            type="number"
                                            value={formData.order}
                                            onChange={e => setFormData({ ...formData, order: e.target.value })}
                                            className="w-full bg-white/5 border border-white/10 rounded-2xl p-6 text-white font-bold focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500/30 transition-all"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Event Designation</label>
                                    <input
                                        required
                                        value={formData.title}
                                        onChange={e => setFormData({ ...formData, title: e.target.value })}
                                        className="w-full bg-white/5 border border-white/10 rounded-2xl p-6 text-white font-bold focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500/30 transition-all placeholder:text-slate-600"
                                        placeholder="e.g. Major Platform Shift"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Contextual Background</label>
                                    <textarea
                                        required
                                        rows={4}
                                        value={formData.description}
                                        onChange={e => setFormData({ ...formData, description: e.target.value })}
                                        className="w-full bg-white/5 border border-white/10 rounded-[2rem] p-6 text-slate-300 font-medium focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500/30 transition-all leading-relaxed"
                                    />
                                </div>

                                <div className="p-10 border-t border-white/5 flex justify-end items-center gap-4 shrink-0 -mx-10 -mb-10 mt-10 bg-white/5">
                                    <button
                                        type="button"
                                        onClick={() => setIsModalOpen(false)}
                                        className="flex-1 py-4.5 rounded-2xl bg-white/5 text-slate-400 font-bold text-[10px] uppercase tracking-widest hover:text-white hover:bg-white/10 border border-white/10 transition-all"
                                    >
                                        Dismiss
                                    </button>
                                    <button
                                        type="submit"
                                        className="flex-2 py-4.5 rounded-2xl bg-emerald-600 text-white font-bold text-[10px] uppercase tracking-widest hover:bg-emerald-500 shadow-lg shadow-emerald-500/20 transition-all flex items-center justify-center gap-2 active:scale-95"
                                    >
                                        <CheckCircle size={18} strokeWidth={3} />
                                        <span>Deploy History</span>
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

export default JourneyManagement;
