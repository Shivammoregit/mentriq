import React, { useEffect, useState, useCallback } from "react";
import { apiClient as api } from "../../utils/apiClient";
import { Plus, Edit2, Trash2, Search, X, User, Briefcase, Linkedin, Check, RefreshCw } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "../../context/ToastContext";
import { resolveImageUrl } from "../../utils/imageUtils";

const FALLBACK_MENTORS = [];

const MentorManagement = () => {
    const [mentors, setMentors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingMentor, setEditingMentor] = useState(null);
    const [imageFile, setImageFile] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [isSyncing, setIsSyncing] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const toast = useToast();

    const initialFormState = {
        name: "",
        role: "",
        company: "",
        description: "",
        image: "",
        linkedin: "",
        yearsExperience: "",
        projectsCompleted: ""
    };
    const [formData, setFormData] = useState(initialFormState);

    const fetchMentors = useCallback(async (silent = false) => {
        try {
            const { data } = await api.get("/mentors");
            setMentors(data);
        } catch (err) {
            if (!silent) toast.error("Failed to load mentors");
        } finally {
            setLoading(false);
        }
    }, [toast]);

    useEffect(() => {
        fetchMentors(false);
        const interval = setInterval(() => fetchMentors(true), 15000);
        return () => clearInterval(interval);
    }, [fetchMentors]);


    const handleImageUpload = async (file) => {
        const formData = new FormData();
        formData.append('image', file);
        try {
            const { data } = await api.post('/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            return typeof data === "string" ? data : data?.imageUrl || data?.imagePath || data?.path || "";
        } catch (error) {
            toast.error('Image upload failed');
            return null;
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            let finalImageUrl = formData.image;
            if (imageFile) {
                const uploadedPath = await handleImageUpload(imageFile);
                if (uploadedPath) finalImageUrl = uploadedPath;
            }

            const payload = {
                ...formData,
                image: finalImageUrl,
                stats: [
                    { value: formData.yearsExperience || "0+", label: "Years" },
                    { value: formData.projectsCompleted || "0+", label: "Projects" }
                ]
            };

            if (editingMentor) {
                await api.put(`/mentors/${editingMentor._id}`, payload);
                toast.success("Expert profile synchronized");
            } else {
                await api.post("/mentors", payload);
                toast.success("New expert deployed");
            }
            setIsModalOpen(false);
            setEditingMentor(null);
            setFormData(initialFormState);
            setImageFile(null);
            fetchMentors();
        } catch (err) {
            toast.error("Deployment failed");
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Terminate expert entry?")) return;
        try {
            await api.delete(`/mentors/${id}`);
            toast.success("Entry removed");
            setMentors(m => m.filter(item => item._id !== id));
        } catch (err) {
            toast.error("Deletion failed");
        }
    };

    const filteredMentors = mentors.filter(m =>
        (m.name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (m.role || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (m.company || "").toLowerCase().includes(searchTerm.toLowerCase())
    );

    const openEditModal = (mentor) => {
        setEditingMentor(mentor);
        setFormData({
            name: mentor.name || "",
            role: mentor.role || "",
            company: mentor.company || "",
            description: mentor.description || mentor.bio || "",
            image: mentor.image || mentor.imageUrl || "",
            linkedin: mentor.linkedin || mentor.linkedinUrl || "",
            yearsExperience: mentor.stats?.find(s => s.label === "Years")?.value || "",
            projectsCompleted: mentor.stats?.find(s => s.label === "Projects")?.value || ""
        });
        setIsModalOpen(true);
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* Page Header */}
            <div className="bg-[#0b1120]/40 backdrop-blur-xl p-6 rounded-3xl border border-white/5 shadow-2xl relative overflow-hidden group">
                <div className="flex flex-col lg:flex-row gap-6 lg:items-center lg:justify-between relative z-10">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <Briefcase size={24} className="text-emerald-400" />
                            <h2 className="text-2xl font-black text-white tracking-tighter uppercase">Expert Guild</h2>
                            <span className="ml-2 text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-lg border border-emerald-500/20 text-[10px] font-bold">
                                {mentors.length} Verified
                            </span>
                        </div>
                        <p className="text-slate-400 font-medium text-xs">Professional mentors and industry experts registry.</p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
                        <div className="bg-[#1e293b] border border-white/10 rounded-xl pr-6 flex items-center w-full lg:w-auto group focus-within:border-emerald-500/50 focus-within:ring-4 focus-within:ring-emerald-500/10 transition-all">
                            <Search className="text-slate-400 ml-4 group-focus-within:text-emerald-400 transition-colors" size={16} />
                            <input
                                type="text"
                                placeholder="Locate expert profile..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="bg-transparent text-white placeholder:text-slate-400 focus:outline-none py-3 px-4 w-full lg:w-64 font-bold text-sm tracking-tight"
                            />
                        </div>
                        <div className="flex gap-4">
                            <button
                                onClick={() => { setEditingMentor(null); setFormData(initialFormState); setIsModalOpen(true); }}
                                className="bg-emerald-600 text-white hover:bg-emerald-500 px-5 py-3 rounded-xl font-bold flex items-center gap-2 transition-all active:scale-95 shadow-lg shadow-emerald-500/20 text-[10px] uppercase tracking-widest flex-1 sm:flex-none justify-center whitespace-nowrap"
                            >
                                <Plus size={16} />
                                <span>Add Expert</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Mentors Table */}
            <div className="bg-[#0b1120]/40 backdrop-blur-xl border border-white/5 rounded-3xl overflow-hidden shadow-2xl">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-[#1e293b] border-b border-white/10">
                                <th className="px-8 py-4 text-[9px] font-bold uppercase tracking-[0.2em] text-slate-400">Expert Entity</th>
                                <th className="px-8 py-4 text-[9px] font-bold uppercase tracking-[0.2em] text-slate-400">Credentials</th>
                                <th className="px-8 py-4 text-[9px] font-bold uppercase tracking-[0.2em] text-slate-400">Bio Overview</th>
                                <th className="px-8 py-4 text-[9px] font-bold uppercase tracking-[0.2em] text-slate-400 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {filteredMentors.map((mentor) => (
                                <motion.tr
                                    key={mentor._id}
                                    initial={{ opacity: 0, y: 15 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="hover:bg-[#1e293b] transition-colors group"
                                >
                                    <td className="px-8 py-4">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-xl overflow-hidden bg-[#1e293b] border border-white/10 shrink-0 shadow-sm relative p-0.5 group-hover:border-emerald-500/50 transition-all">
                                                <img
                                                    src={resolveImageUrl(mentor.image, "/images/user.png")}
                                                    alt={mentor.name}
                                                    className="w-full h-full object-cover rounded-lg group-hover:scale-110 transition-transform duration-500"
                                                    onError={(e) => { e.target.src = "/images/user.png" }}
                                                />
                                            </div>
                                            <div>
                                                <div className="font-bold text-white text-[14px] tracking-tight">{mentor.name}</div>
                                                {mentor.linkedin && (
                                                    <a href={mentor.linkedin} target="_blank" rel="noopener noreferrer" className="text-[9px] text-emerald-400 hover:text-emerald-300 flex items-center gap-1.5 font-black uppercase tracking-widest mt-0.5">
                                                        <Linkedin size={9} /> Profile
                                                    </a>
                                                )}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-4">
                                        <div className="text-white font-bold text-[11px] uppercase tracking-wider">{mentor.role}</div>
                                        <div className="text-slate-400 text-[9px] uppercase font-black tracking-widest mt-1 flex items-center gap-2">
                                            <Briefcase size={10} className="text-emerald-400" />
                                            {mentor.company}
                                        </div>
                                    </td>
                                    <td className="px-8 py-4">
                                        <p className="text-slate-400 text-[11px] line-clamp-2 max-w-xs font-medium leading-relaxed">
                                            {mentor.description || "No synopsis available."}
                                        </p>
                                    </td>
                                    <td className="px-8 py-4 text-right">
                                        <div className="flex justify-end gap-2.5">
                                            <button
                                                onClick={() => openEditModal(mentor)}
                                                className="p-2.5 rounded-xl bg-[#1e293b] text-slate-400 hover:text-emerald-400 hover:bg-emerald-500/10 border border-white/10 hover:border-emerald-500/20 transition-all"
                                            >
                                                <Edit2 size={14} />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(mentor._id)}
                                                className="p-2.5 rounded-xl bg-[#1e293b] text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 border border-white/10 hover:border-rose-500/20 transition-all"
                                            >
                                                <Trash2 size={14} />
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
                            className="relative w-full max-w-2xl bg-[#0b1120] border border-white/10 rounded-[2.5rem] p-6 sm:p-8 shadow-2xl flex flex-col max-h-[90vh]"
                        >
                            <div className="flex items-start justify-between gap-6 mb-8 shrink-0">
                                <div>
                                    <h3 className="text-2xl font-black text-white tracking-tight uppercase">
                                        {editingMentor ? "Update Experience" : "Onboard Expert"}
                                    </h3>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mt-1">Registry Access Level: Global Mentor</p>
                                </div>
                                <button
                                    onClick={() => setIsModalOpen(false)}
                                    className="p-3 rounded-2xl bg-[#1e293b] hover:bg-white/10 text-slate-400 hover:text-white transition-all border border-white/10"
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            <div className="flex-1 overflow-y-auto pr-4 -mr-4 custom-scrollbar">
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div className="flex flex-col items-center justify-center">
                                        <div className="relative group">
                                            <div className="w-24 h-24 rounded-[2rem] overflow-hidden bg-[#1e293b] border-2 border-dashed border-white/10 flex items-center justify-center group-hover:border-emerald-500/50 transition-all">
                                                {imageFile ? (
                                                    <img src={URL.createObjectURL(imageFile)} alt="Preview" className="w-full h-full object-cover" />
                                                ) : formData.image ? (
                                                    <img
                                                        src={resolveImageUrl(formData.image, "/images/user.png")}
                                                        alt="Current"
                                                        className="w-full h-full object-cover"
                                                        onError={(e) => { e.target.src = "/images/user.png" }}
                                                    />
                                                ) : (
                                                    <div className="flex flex-col items-center gap-2 text-slate-400 group-hover:text-emerald-400 transition-colors">
                                                        <User size={24} strokeWidth={1.5} />
                                                        <span className="text-[8px] font-black uppercase tracking-widest">Init Avatar</span>
                                                    </div>
                                                )}
                                            </div>
                                            <label className="absolute bottom-[-5px] right-[-5px] bg-emerald-600 p-2.5 rounded-xl cursor-pointer hover:scale-110 transition-all shadow-xl hover:bg-emerald-500">
                                                <Plus size={14} strokeWidth={3} className="text-white" />
                                                <input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files[0])} className="hidden" />
                                            </label>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="col-span-2 space-y-2">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Full Name</label>
                                            <input required value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className="w-full bg-[#1e293b] border border-white/10 rounded-2xl p-4 text-white font-bold focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500/30 transition-all placeholder:text-slate-400 text-sm" placeholder="e.g. Satoshi Nakamoto" />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Professional Designation</label>
                                            <input required value={formData.role} onChange={e => setFormData({ ...formData, role: e.target.value })} className="w-full bg-[#1e293b] border border-white/10 rounded-2xl p-4 text-white font-bold focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500/30 transition-all placeholder:text-slate-400 text-sm" placeholder="e.g. Quantum Lead" />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Parent Organization</label>
                                            <input required value={formData.company} onChange={e => setFormData({ ...formData, company: e.target.value })} className="w-full bg-[#1e293b] border border-white/10 rounded-2xl p-4 text-white font-bold focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500/30 transition-all placeholder:text-slate-400 text-sm" placeholder="e.g. OpenAI" />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Knowledge Node (LinkedIn)</label>
                                            <input value={formData.linkedin} onChange={e => setFormData({ ...formData, linkedin: e.target.value })} className="w-full bg-[#1e293b] border border-white/10 rounded-2xl p-4 text-white font-bold focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500/30 transition-all placeholder:text-slate-400 text-sm" placeholder="https://linkedin.com/in/id" />
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Years Hub</label>
                                                <input value={formData.yearsExperience} onChange={e => setFormData({ ...formData, yearsExperience: e.target.value })} className="w-full bg-[#1e293b] border border-white/10 rounded-2xl p-4 text-white font-bold focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500/30 transition-all text-sm" placeholder="10+" />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Project Nodes</label>
                                                <input value={formData.projectsCompleted} onChange={e => setFormData({ ...formData, projectsCompleted: e.target.value })} className="w-full bg-[#1e293b] border border-white/10 rounded-2xl p-4 text-white font-bold focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500/30 transition-all text-sm" placeholder="50+" />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Expert Synopsis</label>
                                        <textarea required rows={3} value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} className="w-full bg-[#1e293b] border border-white/10 rounded-2xl p-4 text-slate-300 font-medium focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500/30 transition-all placeholder:text-slate-400 resize-none leading-relaxed text-xs" placeholder="Brief professional synopsis..." />
                                    </div>

                                    <div className="flex gap-4 pt-6 border-t border-white/5 -mx-8 px-8 -mb-8 bg-[#1e293b] mt-6">
                                        <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-3.5 rounded-2xl bg-[#1e293b] text-slate-400 font-bold text-[10px] uppercase tracking-widest hover:text-white hover:bg-white/10 border border-white/10 transition-all">
                                            Abort Deployment
                                        </button>
                                        <button type="submit" disabled={submitting} className="flex-2 py-3.5 rounded-2xl bg-emerald-600 text-white font-bold text-[10px] uppercase tracking-widest hover:bg-emerald-500 shadow-lg shadow-emerald-600/20 transition-all flex items-center justify-center gap-2 active:scale-95">
                                            {submitting ? <RefreshCw size={14} className="animate-spin" /> : <Check size={16} strokeWidth={3} />}
                                            <span className="text-[10px] font-black uppercase tracking-widest">{editingMentor ? "Commit Sync" : "Deploy Expert"}</span>
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default MentorManagement;
