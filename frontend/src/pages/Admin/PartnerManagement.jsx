import React, { useCallback, useEffect, useState } from "react";
import { apiClient as api } from "../../utils/apiClient";
import { Plus, Edit2, Trash2, Search, X, Globe, Building2, Upload, Camera, Check, Handshake, RefreshCw, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "../../context/ToastContext";
import { resolveImageUrl } from "../../utils/imageUtils";

const MotionTr = motion.tr;
const MotionDiv = motion.div;

const getSafeWebsiteHost = (website) => {
    if (!website) return "";
    try {
        const url = /^https?:\/\//i.test(website) ? website : `https://${website}`;
        return new URL(url).hostname;
    } catch {
        return website;
    }
};

const PartnerManagement = () => {
    const [partners, setPartners] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingPartner, setEditingPartner] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const toast = useToast();

    const initialFormState = {
        name: "",
        logo: "",
        website: ""
    };
    const [formData, setFormData] = useState(initialFormState);

    const fetchPartners = useCallback(async () => {
        try {
            const { data } = await api.get("/partners");
            setPartners(Array.isArray(data) ? data : []);
        } catch {
            toast.error("Failed to load partners");
        } finally {
            setLoading(false);
        }
    }, [toast]);

    useEffect(() => {
        fetchPartners();
        const interval = setInterval(fetchPartners, 15000);
        return () => clearInterval(interval);
    }, [fetchPartners]);

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
            setFormData((prev) => ({ ...prev, logo: data.imageUrl || data.imagePath || data }));
            toast.success("Logo uploaded to storage");
        } catch {
            toast.error("Logo upload failed");
        } finally {
            setUploading(false);
        }
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            if (editingPartner) {
                await api.put(`/partners/${editingPartner._id}`, formData);
                toast.success("Alliance record updated");
            } else {
                await api.post("/partners", formData);
                toast.success("New alliance deployed");
            }
            setIsModalOpen(false);
            setEditingPartner(null);
            setFormData(initialFormState);
            fetchPartners();
        } catch {
            toast.error("Transmission failed");
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Terminate alliance entry?")) return;
        try {
            await api.delete(`/partners/${id}`);
            toast.success("Entry removed");
            setPartners(p => p.filter(item => item._id !== id));
        } catch {
            toast.error("Deletion failed");
        }
    };

    const filteredPartners = partners.filter(p =>
        (p.name || "").toLowerCase().includes(searchTerm.toLowerCase())
    );

    const openEditModal = (partner) => {
        setEditingPartner(partner);
        setFormData({
            name: partner.name || "",
            logo: partner.logo || "",
            website: partner.website || ""
        });
        setIsModalOpen(true);
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* Page Header */}
            <div className="bg-[#0f172a]/40 backdrop-blur-xl p-6 rounded-3xl border border-white/5 shadow-2xl relative overflow-hidden group">
                <div className="flex flex-col lg:flex-row gap-8 lg:items-center lg:justify-between relative z-10">
                    <div>
                        <div className="flex items-center gap-3 mb-1">
                            <Handshake size={28} className="text-emerald-400" />
                            <h2 className="text-3xl font-extrabold text-white tracking-tight">Alliance Network</h2>
                            <span className="ml-2 text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-lg border border-emerald-500/20 text-xs font-bold">
                                {partners.length} Strategic Partners
                            </span>
                        </div>
                        <p className="text-slate-400 font-medium text-sm">Corporate partnerships and ecosystem alliance management.</p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
                        <div className="bg-white/5 border border-white/10 rounded-xl pr-6 flex items-center w-full lg:w-auto group focus-within:border-emerald-500/50 focus-within:ring-4 focus-within:ring-emerald-500/10 transition-all">
                            <Search className="text-slate-500 ml-4 group-focus-within:text-emerald-400 transition-colors" size={18} />
                            <input
                                type="text"
                                placeholder="Filter alliances..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="bg-transparent text-white placeholder:text-slate-600 focus:outline-none py-3 px-4 w-full lg:w-64 font-bold text-sm tracking-tight"
                            />
                        </div>
                        <button
                            onClick={() => { setEditingPartner(null); setFormData(initialFormState); setIsModalOpen(true); }}
                            className="bg-emerald-600 text-white hover:bg-emerald-500 px-6 py-3 rounded-xl font-bold flex items-center gap-3 transition-all active:scale-95 shadow-lg shadow-emerald-500/20 text-[10px] uppercase tracking-widest flex-1 sm:flex-none justify-center whitespace-nowrap"
                        >
                            <Plus size={18} />
                            <span>New Alliance</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Partners Table */}
            <div className="bg-[#0f172a]/40 backdrop-blur-xl border border-white/5 rounded-[2.5rem] overflow-hidden shadow-2xl animate-in slide-in-from-bottom-4 duration-700">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-white/5 border-b border-white/10">
                                <th className="px-8 py-4 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">Alliance Entity</th>
                                <th className="px-8 py-4 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">Operational Hub</th>
                                <th className="px-8 py-4 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            <AnimatePresence mode="popLayout">
                                {filteredPartners.map((partner) => (
                                    <MotionTr
                                        key={partner._id}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        className="hover:bg-white/5 transition-colors group"
                                    >
                                        <td className="px-8 py-4">
                                            <div className="flex items-center gap-5">
                                                <div className="w-16 h-16 rounded-2xl overflow-hidden bg-white/5 border border-white/10 shrink-0 shadow-sm relative p-2 group-hover:border-emerald-500/50 transition-all">
                                                    <img
                                                        src={resolveImageUrl(partner.logo, "/images/partner-placeholder.png")}
                                                        alt={partner.name}
                                                        className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500"
                                                        onError={(e) => { e.target.src = "/images/partner-placeholder.png" }}
                                                    />
                                                </div>
                                                <div className="font-bold text-white text-[15px] tracking-tight">{partner.name}</div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-4">
                                            {partner.website ? (
                                                <a
                                                    href={partner.website}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="inline-flex items-center gap-2 group/link"
                                                >
                                                    <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 group-hover/link:bg-emerald-500/20 group-hover/link:border-emerald-500/30 transition-all">
                                                        <Globe size={14} />
                                                    </div>
                                                    <span className="text-xs font-bold text-slate-400 group-hover/link:text-emerald-400 transition-colors uppercase tracking-widest">
                                                        {getSafeWebsiteHost(partner.website)}
                                                    </span>
                                                </a>
                                            ) : (
                                                <span className="text-[10px] font-black uppercase tracking-widest text-slate-600">No URL defined</span>
                                            )}
                                        </td>
                                        <td className="px-8 py-6 text-right">
                                            <div className="flex justify-end gap-3">
                                                <button
                                                    onClick={() => openEditModal(partner)}
                                                    className="p-3 rounded-xl bg-white/5 text-slate-400 hover:text-emerald-400 hover:bg-emerald-500/10 border border-white/10 hover:border-emerald-500/20 transition-all"
                                                >
                                                    <Edit2 size={16} />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(partner._id)}
                                                    className="p-3 rounded-xl bg-white/5 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 border border-white/10 hover:border-rose-500/20 transition-all"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </MotionTr>
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
                        <MotionDiv
                            initial={{ opacity: 0, scale: 0.95, y: 30 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 30 }}
                            className="relative w-full max-w-xl bg-[#0f172a] border border-white/10 rounded-[3rem] p-8 shadow-2xl flex flex-col"
                        >
                            <div className="flex items-start justify-between gap-6 mb-10 shrink-0">
                                <div>
                                    <h3 className="text-3xl font-black text-white tracking-tight uppercase">
                                        {editingPartner ? "Refine Entity" : "Global Onboarding"}
                                    </h3>
                                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mt-1">Partner Identity Protocol</p>
                                </div>
                                <button
                                    onClick={() => setIsModalOpen(false)}
                                    className="p-3.5 rounded-2xl bg-white/5 hover:bg-white/10 text-slate-500 hover:text-white transition-all border border-white/10"
                                >
                                    <X size={24} />
                                </button>
                            </div>

                            <form id="partnerForm" onSubmit={handleSubmit} className="flex-1 overflow-y-auto pr-4 -mr-4 space-y-6 custom-scrollbar">
                                <div className="flex flex-col items-center justify-center">
                                    <label className="relative group cursor-pointer">
                                        <div className={`w-48 h-48 rounded-[2.5rem] border-2 border-dashed flex items-center justify-center overflow-hidden transition-all relative ${formData.logo ? 'border-emerald-500/50 bg-white/5' : 'border-white/10 bg-white/5 hover:border-emerald-500/50'}`}>
                                            {formData.logo ? (
                                                <img src={resolveImageUrl(formData.logo)} alt="Preview" className="w-full h-full object-contain p-6 relative z-10" />
                                            ) : (
                                                <div className="flex flex-col items-center gap-4 text-slate-500 group-hover:text-emerald-400 transition-colors relative z-10">
                                                    <Camera size={32} strokeWidth={1.5} />
                                                    <span className="text-[10px] font-black uppercase tracking-[0.3em]">Initialize Logo</span>
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
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Entity Designation</label>
                                        <div className="relative group">
                                            <Building2 size={20} className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-emerald-400 transition-colors" />
                                            <input
                                                required
                                                value={formData.name}
                                                onChange={e => setFormData({ ...formData, name: e.target.value })}
                                                className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 pl-16 text-white font-bold focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500/30 transition-all placeholder:text-slate-600"
                                                placeholder="e.g. Aether Dynamics"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Digital Domain</label>
                                        <div className="relative group">
                                            <Globe size={20} className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-emerald-400 transition-colors" />
                                            <input
                                                value={formData.website}
                                                onChange={e => setFormData({ ...formData, website: e.target.value })}
                                                className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 pl-16 text-white font-bold focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500/30 transition-all placeholder:text-slate-600"
                                                placeholder="https://aether.network"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </form>

                            <div className="p-10 border-t border-white/5 flex justify-end items-center gap-4 shrink-0 -mx-10 -mb-10 mt-10 bg-white/5">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="flex-1 py-4.5 rounded-2xl bg-white/5 text-slate-400 font-bold text-[10px] uppercase tracking-widest hover:text-white hover:bg-white/10 border border-white/10 transition-all"
                                >
                                    Dismiss
                                </button>
                                <button
                                    form="partnerForm"
                                    type="submit"
                                    disabled={uploading || submitting}
                                    className="flex-2 py-4.5 rounded-2xl bg-emerald-600 text-white font-bold text-[10px] uppercase tracking-widest hover:bg-emerald-500 shadow-lg shadow-emerald-500/20 transition-all flex items-center justify-center gap-2 active:scale-95"
                                >
                                    <Check size={18} strokeWidth={3} />
                                    <span>{submitting ? "Processing..." : (editingPartner ? "Sync Changes" : "Deploy Entity")}</span>
                                </button>
                            </div>
                        </MotionDiv>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default PartnerManagement;
