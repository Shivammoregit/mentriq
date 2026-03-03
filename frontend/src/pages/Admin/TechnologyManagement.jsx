import React, { useCallback, useEffect, useState } from "react";
import { apiClient as api } from "../../utils/apiClient";
import { Trash2, Search, Cpu, X, Plus, Image as ImageIcon, Loader2, Edit2, ChevronDown, RefreshCw, CheckCircle, Zap } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "../../context/ToastContext";
import { resolveImageUrl } from "../../utils/imageUtils";

const MotionDiv = motion.div;

const TechnologyManagement = () => {
    const [technologies, setTechnologies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingTech, setEditingTech] = useState(null);
    const [submitting, setSubmitting] = useState(false);
    const [isSyncing, setIsSyncing] = useState(false);
    const toast = useToast();

    const [formData, setFormData] = useState({
        name: "",
        logo: "",
        logoFile: null,
        category: "other",
        order: 0
    });

    const [imagePreview, setImagePreview] = useState(null);

    const fetchTechnologies = useCallback(async () => {
        try {
            const { data } = await api.get("/technologies");
            setTechnologies(data.data || []);
        } catch (error) {
            toast.error("Failed to load tech registry");
        } finally {
            setLoading(false);
        }
    }, [toast]);


    useEffect(() => {
        fetchTechnologies();
        const interval = setInterval(fetchTechnologies, 15000);
        return () => clearInterval(interval);
    }, [fetchTechnologies]);

    const filteredTechnologies = technologies.filter((tech) =>
        (tech.name || "").toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleDelete = async (id) => {
        if (!window.confirm("Purge this tech node?")) return;
        try {
            await api.delete(`/technologies/${id}`);
            setTechnologies((prev) => prev.filter((t) => t._id !== id));
            toast.success("Component de-integrated");
        } catch {
            toast.error("De-integration failed");
        }
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData({ ...formData, logoFile: file });
            const reader = new FileReader();
            reader.onloadend = () => setImagePreview(reader.result);
            reader.readAsDataURL(file);
        }
    };

    const handleEdit = (tech) => {
        setEditingTech(tech);
        setFormData({
            name: tech.name || "",
            logo: tech.logo || "",
            logoFile: null,
            category: tech.category || "other",
            order: tech.order || 0
        });
        setImagePreview(resolveImageUrl(tech.logo));
        setIsModalOpen(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            let logoUrl = formData.logo;

            if (formData.logoFile) {
                const uploadData = new FormData();
                uploadData.append("image", formData.logoFile);
                const { data } = await api.post("/upload", uploadData, {
                    headers: { "Content-Type": "multipart/form-data" },
                });
                logoUrl = data.imageUrl;
            }

            const payload = {
                name: formData.name,
                logo: logoUrl,
                category: formData.category,
                order: parseInt(formData.order),
            };

            if (editingTech) {
                await api.put(`/technologies/${editingTech._id}`, payload);
                toast.success("Tech logic updated");
            } else {
                await api.post("/technologies", payload);
                toast.success("New tech node deployed");
            }

            setIsModalOpen(false);
            setEditingTech(null);
            setFormData({ name: "", logo: "", logoFile: null, category: "other", order: 0 });
            setImagePreview(null);
            fetchTechnologies();
        } catch {
            toast.error("Transmission failed");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* Page Header */}
            <div className="bg-[#0f172a]/40 backdrop-blur-xl p-6 rounded-3xl border border-white/5 shadow-2xl relative overflow-hidden group">
                <div className="flex flex-col lg:flex-row gap-8 lg:items-center lg:justify-between relative z-10">
                    <div>
                        <div className="flex items-center gap-3 mb-1">
                            <Cpu size={28} className="text-emerald-400" />
                            <h2 className="text-3xl font-extrabold text-white tracking-tight">Mastery Stack</h2>
                            <span className="ml-2 text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-lg border border-emerald-500/20 text-xs font-bold">
                                {technologies.length} Core Components
                            </span>
                        </div>
                        <p className="text-slate-400 font-medium text-sm">System-wide technology registry and industrial stack management.</p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
                        <div className="bg-white/5 border border-white/10 rounded-xl pr-6 flex items-center w-full lg:w-auto group focus-within:border-emerald-500/50 focus-within:ring-4 focus-within:ring-emerald-500/10 transition-all">
                            <Search className="text-slate-500 ml-4 group-focus-within:text-emerald-400 transition-colors" size={18} />
                            <input
                                type="text"
                                placeholder="Locate component..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="bg-transparent text-white placeholder:text-slate-600 focus:outline-none py-4 px-4 w-full lg:w-64 font-bold text-sm tracking-tight"
                            />
                        </div>
                        <div className="flex gap-4">
                            <button
                                onClick={() => { setEditingTech(null); setFormData({ name: "", logo: "", logoFile: null, category: "other", order: 0 }); setImagePreview(null); setIsModalOpen(true); }}
                                className="bg-emerald-600 text-white hover:bg-emerald-500 px-8 py-3 rounded-xl font-bold flex items-center gap-3 transition-all active:scale-95 shadow-lg shadow-emerald-500/20 text-[10px] uppercase tracking-widest flex-1 sm:flex-none justify-center"
                            >
                                <Plus size={18} />
                                <span>Deploy Node</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Tech Table */}
            <div className="bg-[#0f172a]/40 backdrop-blur-xl border border-white/5 rounded-[2.5rem] overflow-hidden shadow-2xl">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-white/5 border-b border-white/10">
                                <th className="px-8 py-4 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">Component Identity</th>
                                <th className="px-8 py-4 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">Execution Category</th>
                                <th className="px-8 py-4 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">Operational Rank</th>
                                <th className="px-8 py-4 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {filteredTechnologies.map((tech) => (
                                <tr key={tech._id} className="hover:bg-white/5 transition-colors group">
                                    <td className="px-8 py-4">
                                        <div className="flex items-center gap-5">
                                            <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 p-2 flex items-center justify-center group-hover:border-emerald-500/50 transition-all">
                                                <img src={resolveImageUrl(tech.logo)} alt={tech.name} className="max-w-full max-h-full object-contain filter grayscale group-hover:grayscale-0 transition-all duration-500" />
                                            </div>
                                            <div className="font-bold text-white text-[15px] tracking-tight">{tech.name}</div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-4">
                                        <span className="px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                                            {tech.category}
                                        </span>
                                    </td>
                                    <td className="px-8 py-4">
                                        <span className="text-slate-400 text-xs font-black uppercase tracking-widest">#{tech.order}</span>
                                    </td>
                                    <td className="px-8 py-4 text-right">
                                        <div className="flex justify-end gap-3">
                                            <button onClick={() => handleEdit(tech)} className="p-3 rounded-xl bg-white/5 text-slate-400 hover:text-emerald-400 hover:bg-emerald-500/10 border border-white/10 hover:border-emerald-500/20 transition-all">
                                                <Edit2 size={16} />
                                            </button>
                                            <button onClick={() => handleDelete(tech._id)} className="p-3 rounded-xl bg-white/5 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 border border-white/10 hover:border-rose-500/20 transition-all">
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal */}
            <AnimatePresence>
                {isModalOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl">
                        <MotionDiv
                            initial={{ opacity: 0, scale: 0.95, y: 30 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 30 }}
                            className="relative w-full max-w-xl bg-[#0f172a] border border-white/10 rounded-[3rem] p-8 shadow-2xl flex flex-col"
                        >
                            <div className="flex items-start justify-between gap-6 mb-8 shrink-0">
                                <div>
                                    <h3 className="text-3xl font-black text-white tracking-tight uppercase">
                                        {editingTech ? "Refine Node" : "Deploy Node"}
                                    </h3>
                                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mt-1">Component Logic Architecture</p>
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
                                        <div className={`w-32 h-32 rounded-3xl border-2 border-dashed flex items-center justify-center overflow-hidden transition-all relative ${imagePreview ? 'border-emerald-500/50 bg-white/5' : 'border-white/10 bg-white/5 hover:border-emerald-500/50'}`}>
                                            {imagePreview ? (
                                                <img src={imagePreview} alt="Preview" className="max-w-[70%] max-h-[70%] object-contain" />
                                            ) : (
                                                <ImageIcon size={32} className="text-slate-500 group-hover:text-emerald-400 transition-colors" strokeWidth={1.5} />
                                            )}
                                        </div>
                                        <div className="absolute -bottom-2 -right-2 p-3 bg-emerald-600 text-white rounded-xl shadow-xl group-hover:scale-110 transition-all z-20 border border-white/10">
                                            <Plus size={16} strokeWidth={3} />
                                        </div>
                                        <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
                                    </label>
                                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-4">Visual Component Source</p>
                                </div>

                                <div className="space-y-8">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Node Designation</label>
                                        <input
                                            required
                                            value={formData.name}
                                            onChange={e => setFormData({ ...formData, name: e.target.value })}
                                            className="w-full bg-white/5 border border-white/10 rounded-2xl p-6 text-white font-bold focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500/30 transition-all placeholder:text-slate-600"
                                            placeholder="e.g. NextJS Matrix"
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-8">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Execution Layer</label>
                                            <select
                                                value={formData.category}
                                                onChange={e => setFormData({ ...formData, category: e.target.value })}
                                                className="w-full bg-white/5 border border-white/10 rounded-2xl p-6 text-white font-bold focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500/30 transition-all appearance-none cursor-pointer"
                                            >
                                                <option value="frontend" className="bg-slate-900">Frontend</option>
                                                <option value="backend" className="bg-slate-900">Backend</option>
                                                <option value="database" className="bg-slate-900">Database</option>
                                                <option value="mobile" className="bg-slate-900">Mobile</option>
                                                <option value="devops" className="bg-slate-900">DevOps</option>
                                                <option value="other" className="bg-slate-900">General</option>
                                            </select>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Operational Rank</label>
                                            <input
                                                type="number"
                                                value={formData.order}
                                                onChange={e => setFormData({ ...formData, order: e.target.value })}
                                                className="w-full bg-white/5 border border-white/10 rounded-2xl p-6 text-white font-bold focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500/30 transition-all"
                                            />
                                        </div>
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
                                        <span>Deploy Node</span>
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

export default TechnologyManagement;
