import React, { useCallback, useEffect, useState } from "react";
import { apiClient as api } from "../../utils/apiClient";
import { Plus, Edit2, Trash2, Search, X, MapPin, Upload, Camera, Check, Eye, EyeOff, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "../../context/ToastContext";
import { resolveImageUrl } from "../../utils/imageUtils";

const MotionTr = motion.tr;
const MotionDiv = motion.div;

const CityManagement = () => {
    const [cities, setCities] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCity, setEditingCity] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const toast = useToast();

    const initialFormState = {
        name: "",
        image: "",
        description: "",
        order: 0,
        isActive: true
    };
    const [formData, setFormData] = useState(initialFormState);

    const fetchCities = useCallback(async () => {
        try {
            const { data } = await api.get("/cities/admin");
            setCities(Array.isArray(data) ? data : []);
        } catch {
            toast.error("Failed to load cities");
        } finally {
            setLoading(false);
        }
    }, [toast]);

    useEffect(() => {
        fetchCities();
        const interval = setInterval(fetchCities, 15000);
        return () => clearInterval(interval);
    }, [fetchCities]);

    const handleImageUpload = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (file.size > 2 * 1024 * 1024) {
            toast.error("Image too large (max 2MB)");
            return;
        }

        const uploadData = new FormData();
        uploadData.append('image', file);

        try {
            setUploading(true);
            const { data } = await api.post('/upload', uploadData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            setFormData((prev) => ({ ...prev, image: data.imageUrl || data.imagePath || data }));
            toast.success("Logistics asset uploaded");
        } catch {
            toast.error("Upload failed");
        } finally {
            setUploading(false);
        }
    };

    const handleEdit = (city) => {
        setEditingCity(city);
        setFormData({
            name: city.name || "",
            image: city.image || "",
            description: city.description || "",
            order: city.order || 0,
            isActive: city.isActive !== undefined ? city.isActive : true
        });
        setIsModalOpen(true);
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Terminate regional operations for this node?")) return;
        try {
            await api.delete(`/cities/${id}`);
            toast.success("Node removed from network");
            setCities((prev) => prev.filter((city) => city._id !== id));
        } catch {
            toast.error("Deletion failed");
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            if (editingCity) {
                await api.put(`/cities/${editingCity._id}`, formData);
                toast.success("Regional parameters updated");
            } else {
                await api.post("/cities", formData);
                toast.success("New operational node deployed");
            }
            setIsModalOpen(false);
            setEditingCity(null);
            setFormData(initialFormState);
            fetchCities();
        } catch {
            toast.error("Data transmission failed");
        } finally {
            setSubmitting(false);
        }
    };

    const filteredCities = cities.filter(c =>
        (c.name || "").toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* Page Header */}
            <div className="bg-[#0f172a]/40 backdrop-blur-xl p-8 rounded-3xl border border-white/5 shadow-2xl relative overflow-hidden group">
                <div className="flex flex-col lg:flex-row gap-8 lg:items-center lg:justify-between relative z-10">
                    <div>
                        <div className="flex items-center gap-3 mb-1">
                            <MapPin size={28} className="text-emerald-400" />
                            <h2 className="text-3xl font-extrabold text-white tracking-tight">Regional Network</h2>
                            <span className="ml-2 text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-lg border border-emerald-500/20 text-xs font-bold">
                                {cities.length} Active Nodes
                            </span>
                        </div>
                        <p className="text-slate-400 font-medium text-sm">Geographical operational centers and logistics management.</p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
                        <div className="bg-white/5 border border-white/10 rounded-xl pr-6 flex items-center w-full lg:w-auto group focus-within:border-emerald-500/50 focus-within:ring-4 focus-within:ring-emerald-500/10 transition-all">
                            <Search className="text-slate-500 ml-4 group-focus-within:text-emerald-400 transition-colors" size={18} />
                            <input
                                type="text"
                                placeholder="Locate regional node..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="bg-transparent text-white placeholder:text-slate-600 focus:outline-none py-4 px-4 w-full lg:w-64 font-bold text-sm tracking-tight"
                            />
                        </div>
                        <button
                            onClick={() => { setEditingCity(null); setFormData(initialFormState); setIsModalOpen(true); }}
                            className="bg-emerald-600 text-white hover:bg-emerald-500 px-8 py-4 rounded-xl font-bold flex items-center gap-3 transition-all active:scale-95 shadow-lg shadow-emerald-500/20 text-[10px] uppercase tracking-widest justify-center"
                        >
                            <Plus size={18} />
                            <span>Deploy Node</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Cities Table */}
            <div className="bg-[#0f172a]/40 backdrop-blur-xl border border-white/5 rounded-[2.5rem] overflow-hidden shadow-2xl">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-white/5 border-b border-white/10">
                                <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">Regional Identity</th>
                                <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">Operational Priority</th>
                                <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">System Status</th>
                                <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            <AnimatePresence mode="popLayout">
                                {filteredCities.map((city) => (
                                    <motion.tr
                                        key={city._id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0 }}
                                        className="hover:bg-white/5 transition-colors group"
                                    >
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-5">
                                                <div className="w-16 h-16 rounded-2xl overflow-hidden bg-white/5 border border-white/10 shrink-0 shadow-sm relative group-hover:border-emerald-500/50 transition-all">
                                                    <img
                                                        src={resolveImageUrl(city.image, "/images/city-placeholder.jpg")}
                                                        alt={city.name}
                                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                                    />
                                                </div>
                                                <div>
                                                    <div className="font-bold text-white text-[15px] tracking-tight">{city.name}</div>
                                                    <div className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">Industrial Terminal</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-2">
                                                <span className="text-emerald-400 text-xs font-black bg-emerald-500/10 px-3 py-1 rounded-lg border border-emerald-500/20">
                                                    RANK {city.order || 0}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <span className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest border ${city.isActive ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-slate-500/10 text-slate-400 border-white/10'}`}>
                                                {city.isActive ? 'Online' : 'Offline'}
                                            </span>
                                        </td>
                                        <td className="px-8 py-6 text-right">
                                            <div className="flex justify-end gap-3">
                                                <button
                                                    onClick={() => handleEdit(city)}
                                                    className="p-3 rounded-xl bg-white/5 text-slate-400 hover:text-emerald-400 hover:bg-emerald-500/10 border border-white/10 hover:border-emerald-500/20 transition-all"
                                                >
                                                    <Edit2 size={16} />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(city._id)}
                                                    className="p-3 rounded-xl bg-white/5 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 border border-white/10 hover:border-rose-500/20 transition-all"
                                                >
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
                                        {editingCity ? "Refine Terminal" : "Deploy Terminal"}
                                    </h3>
                                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mt-1">Geospatial Protocol v1.4</p>
                                </div>
                                <button
                                    onClick={() => setIsModalOpen(false)}
                                    className="p-3.5 rounded-2xl bg-white/5 hover:bg-white/10 text-slate-500 hover:text-white transition-all border border-white/10"
                                >
                                    <X size={24} />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto pr-4 -mr-4 space-y-10 custom-scrollbar">
                                <div className="flex flex-col items-center justify-center">
                                    <label className="relative group cursor-pointer">
                                        <div className={`w-48 h-48 rounded-[2.5rem] border-2 border-dashed flex items-center justify-center overflow-hidden transition-all relative ${formData.image ? 'border-emerald-500/50 bg-white/5' : 'border-white/10 bg-white/5 hover:border-emerald-500/50'}`}>
                                            {formData.image ? (
                                                <img src={resolveImageUrl(formData.image)} alt="Preview" className="w-full h-full object-cover relative z-10" />
                                            ) : (
                                                <div className="flex flex-col items-center gap-4 text-slate-500 group-hover:text-emerald-400 transition-colors relative z-10">
                                                    <Camera size={32} strokeWidth={1.5} />
                                                    <span className="text-[10px] font-black uppercase tracking-[0.3em]">Visual Uplink</span>
                                                </div>
                                            )}
                                            {uploading && (
                                                <div className="absolute inset-0 bg-black/60 flex items-center justify-center backdrop-blur-sm z-20">
                                                    <Loader2 className="w-10 h-10 text-emerald-500 animate-spin" />
                                                </div>
                                            )}
                                        </div>
                                        <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 px-6 py-3 bg-emerald-600 text-white rounded-2xl shadow-xl group-hover:-translate-y-1 transition-all flex items-center gap-3 text-xs font-black uppercase tracking-widest z-30 opacity-0 group-hover:opacity-100">
                                            <Upload size={14} strokeWidth={3} />
                                            <span>Inject Asset</span>
                                        </div>
                                        <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                                    </label>
                                </div>

                                <div className="space-y-8">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Terminal Designation</label>
                                        <input
                                            required
                                            value={formData.name}
                                            onChange={e => setFormData({ ...formData, name: e.target.value })}
                                            className="w-full bg-white/5 border border-white/10 rounded-2xl p-6 text-white font-bold focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500/30 transition-all placeholder:text-slate-600"
                                            placeholder="e.g. Neo Tokyo Sector"
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-8">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Network Priority</label>
                                            <input
                                                type="number"
                                                value={formData.order}
                                                onChange={e => setFormData({ ...formData, order: parseInt(e.target.value) })}
                                                className="w-full bg-white/5 border border-white/10 rounded-2xl p-6 text-white font-bold focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500/30 transition-all"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Connectivity</label>
                                            <button
                                                type="button"
                                                onClick={() => setFormData({ ...formData, isActive: !formData.isActive })}
                                                className={`w-full h-[74px] rounded-2xl border transition-all flex items-center justify-center gap-3 font-bold text-[10px] uppercase tracking-widest ${formData.isActive ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : 'bg-white/5 border-white/10 text-slate-500'}`}
                                            >
                                                {formData.isActive ? <Eye size={18} /> : <EyeOff size={18} />}
                                                {formData.isActive ? 'Active Node' : 'Suspended'}
                                            </button>
                                        </div>
                                    </div>
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
                                        disabled={uploading || submitting}
                                        className="flex-2 py-4.5 rounded-2xl bg-emerald-600 text-white font-bold text-[10px] uppercase tracking-widest hover:bg-emerald-500 shadow-lg shadow-emerald-500/20 transition-all flex items-center justify-center gap-2 active:scale-95"
                                    >
                                        <Check size={18} strokeWidth={3} />
                                        <span>{submitting ? "Processing..." : (editingCity ? "Update Logic" : "Deploy Node")}</span>
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

export default CityManagement;
