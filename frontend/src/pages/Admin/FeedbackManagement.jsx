import React, { useCallback, useEffect, useState } from "react";
import { apiClient as api } from "../../utils/apiClient";
import { Plus, Trash2, Edit2, MessageSquare, X, Upload, Camera, Star, CheckCircle, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "../../context/ToastContext";
import { resolveImageUrl } from "../../utils/imageUtils";

const MotionDiv = motion.div;

const FeedbackManagement = () => {
    const [feedbacks, setFeedbacks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingFeedback, setEditingFeedback] = useState(null);
    const [imageFile, setImageFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const toast = useToast();

    const initialFormState = { name: "", role: "", message: "", rating: 5, image: "" };
    const [formData, setFormData] = useState(initialFormState);

    const fetchFeedbacks = useCallback(async () => {
        try {
            const { data } = await api.get("/feedbacks");
            setFeedbacks(data || []);
        } catch {
            toast.error("Failed to load feedback registry");
        } finally {
            setLoading(false);
        }
    }, [toast]);

    useEffect(() => {
        fetchFeedbacks();
        const interval = setInterval(fetchFeedbacks, 15000);
        return () => clearInterval(interval);
    }, [fetchFeedbacks]);

    const handleDelete = async (id) => {
        if (!window.confirm("Purge this testimonial node?")) return;
        try {
            await api.delete(`/feedbacks/${id}`);
            toast.success("Feedback de-integrated");
            setFeedbacks(feedbacks.filter(f => f._id !== id));
        } catch {
            toast.error("Deletion failed");
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            let finalImage = formData.image;
            if (imageFile) {
                const uploadData = new FormData();
                uploadData.append("image", imageFile);
                setUploading(true);
                const { data } = await api.post("/upload", uploadData, {
                    headers: { "Content-Type": "multipart/form-data" },
                });
                finalImage = data.imageUrl;
            }

            const payload = { ...formData, image: finalImage };
            if (editingFeedback) {
                await api.put(`/feedbacks/${editingFeedback._id}`, payload);
                toast.success("Testimonial logic updated");
            } else {
                await api.post("/feedbacks", payload);
                toast.success("New testimonial deployed");
            }
            setIsModalOpen(false);
            setEditingFeedback(null);
            setFormData(initialFormState);
            setImageFile(null);
            fetchFeedbacks();
        } catch {
            toast.error("Transmission error");
        } finally {
            setUploading(false);
            setSubmitting(false);
        }
    };

    const openEditModal = (feedback) => {
        setEditingFeedback(feedback);
        setFormData({
            name: feedback.name || "",
            role: feedback.role || "",
            message: feedback.message || "",
            rating: feedback.rating || 5,
            image: feedback.image || ""
        });
        setImageFile(null);
        setIsModalOpen(true);
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* Page Header */}
            <div className="bg-[#0f172a]/40 backdrop-blur-xl p-6 rounded-3xl border border-white/5 shadow-2xl relative overflow-hidden group">
                <div className="flex flex-col lg:flex-row gap-8 lg:items-center lg:justify-between relative z-10">
                    <div>
                        <div className="flex items-center gap-3 mb-1">
                            <MessageSquare size={28} className="text-emerald-400" />
                            <h2 className="text-3xl font-extrabold text-white tracking-tight">Public Sentiments</h2>
                            <span className="ml-2 text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-lg border border-emerald-500/20 text-xs font-bold">
                                {feedbacks.length} Verified Reviews
                            </span>
                        </div>
                        <p className="text-slate-400 font-medium text-sm">Industrial testimonial management and brand reputation registry.</p>
                    </div>

                    <button
                        onClick={() => { setEditingFeedback(null); setFormData(initialFormState); setImageFile(null); setIsModalOpen(true); }}
                        className="bg-emerald-600 text-white hover:bg-emerald-500 px-8 py-3 rounded-xl font-bold flex items-center gap-3 transition-all active:scale-95 shadow-lg shadow-emerald-500/20 text-[10px] uppercase tracking-widest justify-center"
                    >
                        <Plus size={18} />
                        <span>Inject Review</span>
                    </button>
                </div>
            </div>

            {/* Testimonials Table */}
            <div className="bg-[#0f172a]/40 backdrop-blur-xl border border-white/5 rounded-[2.5rem] overflow-hidden shadow-2xl">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-white/5 border-b border-white/10">
                                <th className="px-8 py-4 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">Reporter Identity</th>
                                <th className="px-8 py-4 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">Sentiment Logic</th>
                                <th className="px-8 py-4 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">Rating</th>
                                <th className="px-8 py-4 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {feedbacks.map((f) => (
                                <motion.tr
                                    key={f._id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="hover:bg-white/5 transition-colors group"
                                >
                                    <td className="px-8 py-4">
                                        <div className="flex items-center gap-5">
                                            <div className="w-12 h-12 rounded-full overflow-hidden bg-white/5 border border-white/10 shrink-0 group-hover:border-emerald-500/50 transition-all">
                                                <img src={resolveImageUrl(f.image, "/images/placeholder-avatar.jpg")} alt={f.name} className="w-full h-full object-cover" />
                                            </div>
                                            <div>
                                                <div className="font-bold text-white text-[15px] tracking-tight">{f.name}</div>
                                                <div className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{f.role}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-4">
                                        <p className="text-slate-400 text-xs italic line-clamp-2 max-w-md">"{f.message}"</p>
                                    </td>
                                    <td className="px-8 py-4">
                                        <div className="flex items-center gap-1">
                                            {[...Array(5)].map((_, i) => (
                                                <Star key={i} size={12} className={i < (f.rating || 5) ? "fill-emerald-400 text-emerald-400" : "text-slate-700"} />
                                            ))}
                                        </div>
                                    </td>
                                    <td className="px-8 py-4 text-right">
                                        <div className="flex justify-end gap-3">
                                            <button onClick={() => openEditModal(f)} className="p-3 rounded-xl bg-white/5 text-slate-400 hover:text-emerald-400 hover:bg-emerald-500/10 border border-white/10 hover:border-emerald-500/20 transition-all">
                                                <Edit2 size={16} />
                                            </button>
                                            <button onClick={() => handleDelete(f._id)} className="p-3 rounded-xl bg-white/5 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 border border-white/10 hover:border-rose-500/20 transition-all">
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
                            className="relative w-full max-w-xl bg-[#0f172a] border border-white/10 rounded-[3rem] p-8 shadow-2xl flex flex-col"
                        >
                            <div className="flex items-start justify-between gap-6 mb-8 shrink-0">
                                <div>
                                    <h3 className="text-3xl font-black text-white tracking-tight uppercase">
                                        {editingFeedback ? "Refine Sentiment" : "Deploy Sentiment"}
                                    </h3>
                                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mt-1">Industrial Testimonial Protocol</p>
                                </div>
                                <button
                                    onClick={() => setIsModalOpen(false)}
                                    className="p-3.5 rounded-2xl bg-white/5 hover:bg-white/10 text-slate-500 hover:text-white transition-all border border-white/10"
                                >
                                    <X size={24} />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="flex-1 space-y-8">
                                <div className="flex flex-col items-center justify-center">
                                    <label className="relative group cursor-pointer">
                                        <div className={`w-32 h-32 rounded-full border-2 border-dashed flex items-center justify-center overflow-hidden transition-all relative ${imageFile || formData.image ? 'border-emerald-500/50 bg-white/5' : 'border-white/10 bg-white/5 hover:border-emerald-500/50'}`}>
                                            {(imageFile || formData.image) ? (
                                                <img src={imageFile ? URL.createObjectURL(imageFile) : resolveImageUrl(formData.image)} alt="Preview" className="w-full h-full object-cover" />
                                            ) : (
                                                <Camera size={32} className="text-slate-500 group-hover:text-emerald-400 transition-colors" strokeWidth={1.5} />
                                            )}
                                            {uploading && (
                                                <div className="absolute inset-0 bg-black/60 flex items-center justify-center backdrop-blur-sm z-20">
                                                    <Loader2 className="w-10 h-10 text-emerald-500 animate-spin" />
                                                </div>
                                            )}
                                        </div>
                                        <div className="absolute -bottom-2 -right-2 p-3 bg-emerald-600 text-white rounded-xl shadow-xl group-hover:scale-110 transition-all z-20 border border-white/10">
                                            <Plus size={16} strokeWidth={3} />
                                        </div>
                                        <input type="file" className="hidden" accept="image/*" onChange={(e) => setImageFile(e.target.files[0])} />
                                    </label>
                                </div>

                                <div className="space-y-8">
                                    <div className="grid grid-cols-2 gap-8">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Entity Identity (Name)</label>
                                            <input
                                                required
                                                value={formData.name}
                                                onChange={e => setFormData({ ...formData, name: e.target.value })}
                                                className="w-full bg-white/5 border border-white/10 rounded-2xl p-6 text-white font-bold focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500/30 transition-all placeholder:text-slate-600"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Professional Rank (Role)</label>
                                            <input
                                                required
                                                value={formData.role}
                                                onChange={e => setFormData({ ...formData, role: e.target.value })}
                                                className="w-full bg-white/5 border border-white/10 rounded-2xl p-6 text-white font-bold focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500/30 transition-all"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Testimonial Logic (Message)</label>
                                        <textarea
                                            required
                                            rows={4}
                                            value={formData.message}
                                            onChange={e => setFormData({ ...formData, message: e.target.value })}
                                            className="w-full bg-white/5 border border-white/10 rounded-[2rem] p-6 text-slate-300 font-medium focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500/30 transition-all leading-relaxed"
                                        />
                                    </div>
                                </div>

                                <div className="p-8 border-t border-white/5 flex justify-end items-center gap-4 shrink-0 -mx-10 -mb-10 mt-8 bg-white/5">
                                    <button
                                        type="button"
                                        onClick={() => setIsModalOpen(false)}
                                        className="flex-1 py-4.5 rounded-2xl bg-white/5 text-slate-400 font-bold text-[10px] uppercase tracking-widest hover:text-white hover:bg-white/10 border border-white/10 transition-all"
                                    >
                                        Dismiss
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={submitting}
                                        className="flex-2 py-4.5 rounded-2xl bg-emerald-600 text-white font-bold text-[10px] uppercase tracking-widest hover:bg-emerald-500 shadow-lg shadow-emerald-500/20 transition-all flex items-center justify-center gap-2 active:scale-95"
                                    >
                                        {submitting ? <Loader2 className="animate-spin" size={18} /> : <CheckCircle size={18} strokeWidth={3} />}
                                        <span>Deploy Sentiment</span>
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

export default FeedbackManagement;
