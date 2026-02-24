import React, { useEffect, useState } from "react";
import { apiClient as api } from "../../utils/apiClient";
import * as Icons from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "../../context/ToastContext";
import { resolveImageUrl } from "../../utils/imageUtils";

const FALLBACK_SERVICES = [];

const ServiceManagement = () => {
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingService, setEditingService] = useState(null);
    const [submitting, setSubmitting] = useState(false);
    const [isSyncing, setIsSyncing] = useState(false);
    const toast = useToast();

    const initialFormState = {
        title: "",
        description: "",
        icon: "Box",
        iconType: "icon",
        iconFile: null,
        features: "",
        color: "from-blue-500 to-cyan-500"
    };
    const [formData, setFormData] = useState(initialFormState);
    const [imagePreview, setImagePreview] = useState(null);

    const fetchServices = async () => {
        try {
            const { data } = await api.get("/services/admin");
            setServices(data);
        } catch (err) {
            toast.error("Failed to load services");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchServices();
        const interval = setInterval(fetchServices, 15000);
        return () => clearInterval(interval);
    }, []);

    const handleDelete = async (id) => {
        if (!window.confirm("Terminate service provision?")) return;
        try {
            await api.delete(`/services/${id}`);
            toast.success("Service decommissioned");
            setServices(services.filter(s => s._id !== id));
        } catch (err) {
            toast.error("Decommission failed");
        }
    };


    const handleEdit = (service) => {
        setEditingService(service);
        setFormData({
            title: service.title || "",
            description: service.description || "",
            icon: service.icon || "Box",
            iconType: service.iconType || "icon",
            features: Array.isArray(service.features) ? service.features.join(", ") : (service.features || ""),
            color: service.color || "from-blue-500 to-cyan-500"
        });
        setImagePreview(service.iconType === 'image' ? resolveImageUrl(service.icon) : null);
        setIsModalOpen(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            let finalIcon = formData.icon;
            if (formData.iconType === 'image' && formData.iconFile) {
                const uploadData = new FormData();
                uploadData.append('image', formData.iconFile);
                const { data } = await api.post('/upload', uploadData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
                finalIcon = data.imageUrl || data.imagePath || data;
            }

            const payload = {
                ...formData,
                icon: finalIcon,
                features: formData.features.split(",").map(f => f.trim()).filter(f => f)
            };

            if (editingService) {
                await api.put(`/services/${editingService._id}`, payload);
                toast.success("Service logic updated");
            } else {
                await api.post("/services", payload);
                toast.success("New service deployed");
            }
            setIsModalOpen(false);
            setEditingService(null);
            setFormData(initialFormState);
            fetchServices();
        } catch {
            toast.error("Deployment failed");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* Page Header */}
            <div className="bg-[#0f172a]/40 backdrop-blur-xl p-8 rounded-3xl border border-white/5 shadow-2xl relative overflow-hidden group">
                <div className="flex flex-col lg:flex-row gap-8 lg:items-center lg:justify-between relative z-10">
                    <div>
                        <div className="flex items-center gap-3 mb-1">
                            <Icons.Zap size={28} className="text-emerald-400" />
                            <h2 className="text-3xl font-extrabold text-white tracking-tight">Capabilities Matrix</h2>
                            <span className="ml-2 text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-lg border border-emerald-500/20 text-xs font-bold">
                                {services.length} Solutions
                            </span>
                        </div>
                        <p className="text-slate-400 font-medium text-sm">Professional services and commercial capability management.</p>
                    </div>

                    <div className="flex gap-4">
                        <button
                            onClick={() => { setEditingService(null); setFormData(initialFormState); setIsModalOpen(true); }}
                            className="bg-emerald-600 text-white hover:bg-emerald-500 px-6 py-4 rounded-xl font-bold flex items-center gap-3 transition-all active:scale-95 shadow-lg shadow-emerald-500/20 text-[10px] uppercase tracking-widest flex-1 sm:flex-none justify-center whitespace-nowrap"
                        >
                            <Icons.Plus size={18} />
                            <span>New Service</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Services Table */}
            <div className="bg-[#0f172a]/40 backdrop-blur-xl border border-white/5 rounded-[2.5rem] overflow-hidden shadow-2xl animate-in slide-in-from-bottom-4 duration-700">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-white/5 border-b border-white/10">
                                <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">Service Identifier</th>
                                <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">Capability Overview</th>
                                <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {services.map((service) => {
                                const IconComponent = Icons[service.icon] || Icons.Box;
                                return (
                                    <tr key={service._id} className="hover:bg-white/5 transition-colors group">
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-5">
                                                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${service.color || 'from-emerald-500 to-teal-500'} p-3.5 shadow-lg relative group-hover:scale-110 transition-transform duration-500`}>
                                                    <IconComponent className="w-full h-full text-white" />
                                                </div>
                                                <div>
                                                    <div className="font-bold text-white text-[15px] tracking-tight">{service.title}</div>
                                                    <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-1">Active Portfolio</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6 max-w-md">
                                            <p className="text-slate-400 text-xs line-clamp-2 leading-relaxed font-medium">
                                                {service.description}
                                            </p>
                                        </td>
                                        <td className="px-8 py-6 text-right">
                                            <div className="flex justify-end gap-3">
                                                <button
                                                    onClick={() => handleEdit(service)}
                                                    className="p-3 rounded-xl bg-white/5 text-slate-400 hover:text-emerald-400 hover:bg-emerald-500/10 border border-white/10 hover:border-emerald-500/20 transition-all"
                                                >
                                                    <Icons.Edit2 size={16} />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(service._id)}
                                                    className="p-3 rounded-xl bg-white/5 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 border border-white/10 hover:border-rose-500/20 transition-all"
                                                >
                                                    <Icons.Trash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal */}
            <AnimatePresence>
                {isModalOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 30 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 30 }}
                            className="relative w-full max-w-2xl bg-[#0f172a] border border-white/10 rounded-[3rem] p-10 shadow-2xl flex flex-col max-h-[90vh]"
                        >
                            <div className="flex items-start justify-between gap-6 mb-10 shrink-0">
                                <div>
                                    <h3 className="text-3xl font-black text-white tracking-tight uppercase">
                                        {editingService ? "Update Solution" : "Initialize Service"}
                                    </h3>
                                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mt-1">Portfolio Expansion Protocol</p>
                                </div>
                                <button
                                    onClick={() => setIsModalOpen(false)}
                                    className="p-3.5 rounded-2xl bg-white/5 hover:bg-white/10 text-slate-500 hover:text-white transition-all border border-white/10"
                                >
                                    <Icons.X size={24} />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto pr-4 -mr-4 space-y-10 custom-scrollbar">
                                <div className="space-y-8">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Commercial Title</label>
                                        <input
                                            required
                                            value={formData.title}
                                            onChange={e => setFormData({ ...formData, title: e.target.value })}
                                            className="w-full bg-white/5 border border-white/10 rounded-2xl p-6 text-white font-bold focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500/30 transition-all placeholder:text-slate-600"
                                            placeholder="e.g. Neural Architecture Design"
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-8">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Icon Identifier (Lucide)</label>
                                            <input
                                                value={formData.icon}
                                                onChange={e => setFormData({ ...formData, icon: e.target.value })}
                                                className="w-full bg-white/5 border border-white/10 rounded-2xl p-6 text-white font-bold focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500/30 transition-all placeholder:text-slate-600"
                                                placeholder="e.g. Brain, Zap, Codesandbox"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Color Aesthetics (CSS Gradient)</label>
                                            <input
                                                value={formData.color}
                                                onChange={e => setFormData({ ...formData, color: e.target.value })}
                                                className="w-full bg-white/5 border border-white/10 rounded-2xl p-6 text-white font-bold focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500/30 transition-all placeholder:text-slate-600"
                                                placeholder="from-blue-500 to-cyan-500"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Service Synopsis</label>
                                        <textarea
                                            required
                                            rows={4}
                                            value={formData.description}
                                            onChange={e => setFormData({ ...formData, description: e.target.value })}
                                            className="w-full bg-white/5 border border-white/10 rounded-[2rem] p-6 text-slate-300 font-medium focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500/30 transition-all placeholder:text-slate-600 resize-none leading-relaxed"
                                            placeholder="Define technical scope and business impact..."
                                        />
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
                                        disabled={submitting}
                                        className="flex-2 py-4.5 rounded-2xl bg-emerald-600 text-white font-bold text-[10px] uppercase tracking-widest hover:bg-emerald-500 shadow-lg shadow-emerald-500/20 transition-all flex items-center justify-center gap-2 active:scale-95"
                                    >
                                        <Icons.Check size={18} strokeWidth={3} />
                                        <span>{submitting ? "Processing..." : (editingService ? "Sync Logic" : "Deploy Solution")}</span>
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

export default ServiceManagement;
