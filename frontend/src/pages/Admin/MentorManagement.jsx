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

    const fetchMentors = useCallback(async () => {
        try {
            const { data } = await api.get("/mentors");
            setMentors(data);
        } catch (err) {
            toast.error("Failed to load mentors");
        } finally {
            setLoading(false);
        }
    }, [toast]);

    useEffect(() => {
        fetchMentors();
        const interval = setInterval(fetchMentors, 15000);
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
            <div className="bg-[#0f172a]/40 backdrop-blur-xl p-8 rounded-3xl border border-white/5 shadow-2xl relative overflow-hidden group">
                <div className="flex flex-col lg:flex-row gap-8 lg:items-center lg:justify-between relative z-10">
                    <div>
                        <div className="flex items-center gap-3 mb-1">
                            <Briefcase size={28} className="text-emerald-400" />
                            <h2 className="text-3xl font-extrabold text-white tracking-tight">Expert Guild</h2>
                            <span className="ml-2 text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-lg border border-emerald-500/20 text-xs font-bold">
                                {mentors.length} Verified
                            </span>
                        </div>
                        <p className="text-slate-400 font-medium text-sm">Professional mentors and industry experts registry.</p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
                        <div className="bg-white/5 border border-white/10 rounded-xl pr-6 flex items-center w-full lg:w-auto group focus-within:border-emerald-500/50 focus-within:ring-4 focus-within:ring-emerald-500/10 transition-all">
                            <Search className="text-slate-500 ml-4 group-focus-within:text-emerald-400 transition-colors" size={18} />
                            <input
                                type="text"
                                placeholder="Locate expert profile..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="bg-transparent text-white placeholder:text-slate-600 focus:outline-none py-4 px-4 w-full lg:w-64 font-bold text-sm tracking-tight"
                            />
                        </div>
                        <div className="flex gap-4">
                            <button
                                onClick={() => { setEditingMentor(null); setFormData(initialFormState); setIsModalOpen(true); }}
                                className="bg-emerald-600 text-white hover:bg-emerald-500 px-6 py-4 rounded-xl font-bold flex items-center gap-3 transition-all active:scale-95 shadow-lg shadow-emerald-500/20 text-[10px] uppercase tracking-widest flex-1 sm:flex-none justify-center whitespace-nowrap"
                            >
                                <Plus size={18} />
                                <span>Add Expert</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Mentors Table */}
            <div className="bg-[#0f172a]/40 backdrop-blur-xl border border-white/5 rounded-[2.5rem] overflow-hidden shadow-2xl">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-white/5 border-b border-white/10">
                                <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">Expert Entity</th>
                                <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">Credentials</th>
                                <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">Bio Overview</th>
                                <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {filteredMentors.map((mentor) => (
                                <motion.tr
                                    key={mentor._id}
                                    layout
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="hover:bg-white/5 transition-colors group"
                                >
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-5">
                                            <div className="w-16 h-16 rounded-2xl overflow-hidden bg-white/5 border border-white/10 shrink-0 shadow-sm relative p-1 group-hover:border-emerald-500/50 transition-all">
                                                <img
                                                    src={resolveImageUrl(mentor.image, "/images/user.png")}
                                                    alt={mentor.name}
                                                    className="w-full h-full object-cover rounded-xl group-hover:scale-110 transition-transform duration-500"
                                                    onError={(e) => { e.target.src = "/images/user.png" }}
                                                />
                                            </div>
                                            <div>
                                                <div className="font-bold text-white text-base tracking-tight">{mentor.name}</div>
                                                {mentor.linkedin && (
                                                    <a href={mentor.linkedin} target="_blank" rel="noopener noreferrer" className="text-[10px] text-emerald-400 hover:text-emerald-300 flex items-center gap-1.5 font-black uppercase tracking-widest mt-1">
                                                        <Linkedin size={10} /> Profile
                                                    </a>
                                                )}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="text-white font-bold text-xs uppercase tracking-wider">{mentor.role}</div>
                                        <div className="text-slate-500 text-[10px] uppercase font-black tracking-widest mt-1.5 flex items-center gap-2">
                                            <Briefcase size={12} className="text-emerald-400" />
                                            {mentor.company}
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <p className="text-slate-400 text-xs line-clamp-2 max-w-xs font-medium leading-relaxed">
                                            {mentor.description || "No synopsis available."}
                                        </p>
                                    </td>
                                    <td className="px-8 py-6 text-right">
                                        <div className="flex justify-end gap-3">
                                            <button
                                                onClick={() => openEditModal(mentor)}
                                                className="p-3 rounded-xl bg-white/5 text-slate-400 hover:text-emerald-400 hover:bg-emerald-500/10 border border-white/10 hover:border-emerald-500/20 transition-all"
                                            >
                                                <Edit2 size={16} />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(mentor._id)}
                                                className="p-3 rounded-xl bg-white/5 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 border border-white/10 hover:border-rose-500/20 transition-all"
                                            >
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
                            initial={{ opacity: 0, scale: 0.95, y: 30 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 30 }}
                            className="relative w-full max-w-2xl bg-[#0f172a] border border-white/10 rounded-[3rem] p-10 shadow-2xl flex flex-col max-h-[90vh]"
                        >
                            <div className="flex items-start justify-between gap-6 mb-10 shrink-0">
                                <div>
                                    <h3 className="text-3xl font-black text-white tracking-tight uppercase">
                                        {editingMentor ? "Update Experience" : "Onboard Expert"}
                                    </h3>
                                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mt-1">Registry Access Level: Global Mentor</p>
                                </div>
                                <button
                                    onClick={() => setIsModalOpen(false)}
                                    className="p-3.5 rounded-2xl bg-white/5 hover:bg-white/10 text-slate-500 hover:text-white transition-all border border-white/10"
                                >
                                    <X size={24} />
                                </button>
                            </div>

                            <div className="flex-1 overflow-y-auto pr-4 -mr-4 custom-scrollbar">
                                <form onSubmit={handleSubmit} className="space-y-10">
                                    <div className="flex flex-col items-center justify-center">
                                        <div className="relative group">
                                            <div className="w-32 h-32 rounded-[2.5rem] overflow-hidden bg-white/5 border-2 border-dashed border-white/10 flex items-center justify-center group-hover:border-emerald-500/50 transition-all">
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
                                                    <div className="flex flex-col items-center gap-2 text-slate-500 group-hover:text-emerald-400 transition-colors">
                                                        <User size={32} strokeWidth={1.5} />
                                                        <span className="text-[8px] font-black uppercase tracking-widest">Init Avatar</span>
                                                    </div>
                                                )}
                                            </div>
                                            <label className="absolute bottom-[-10px] right-[-10px] bg-emerald-600 p-3 rounded-2xl cursor-pointer hover:scale-110 transition-all shadow-xl hover:bg-emerald-500">
                                                <Plus size={16} strokeWidth={3} className="text-white" />
                                                <input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files[0])} className="hidden" />
                                            </label>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div className="col-span-2 space-y-2">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Full Name</label>
                                            <input required value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-2xl p-5 text-white font-bold focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500/30 transition-all placeholder:text-slate-600" placeholder="e.g. Satoshi Nakamoto" />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Professional Designation</label>
                                            <input required value={formData.role} onChange={e => setFormData({ ...formData, role: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-2xl p-5 text-white font-bold focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500/30 transition-all placeholder:text-slate-600" placeholder="e.g. Quantum Lead" />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Parent Organization</label>
                                            <input required value={formData.company} onChange={e => setFormData({ ...formData, company: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-2xl p-5 text-white font-bold focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500/30 transition-all placeholder:text-slate-600" placeholder="e.g. OpenAI" />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Knowledge Node (LinkedIn)</label>
                                            <input value={formData.linkedin} onChange={e => setFormData({ ...formData, linkedin: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-2xl p-5 text-white font-bold focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500/30 transition-all placeholder:text-slate-600" placeholder="https://linkedin.com/in/id" />
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Years Hub</label>
                                                <input value={formData.yearsExperience} onChange={e => setFormData({ ...formData, yearsExperience: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-2xl p-5 text-white font-bold focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500/30 transition-all" placeholder="10+" />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Project Nodes</label>
                                                <input value={formData.projectsCompleted} onChange={e => setFormData({ ...formData, projectsCompleted: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-2xl p-5 text-white font-bold focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500/30 transition-all" placeholder="50+" />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Expert Synopsis</label>
                                        <textarea required rows={4} value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-[2rem] p-6 text-slate-300 font-medium focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500/30 transition-all placeholder:text-slate-600 resize-none leading-relaxed" placeholder="Brief professional synopsis..." />
                                    </div>

                                    <div className="flex gap-4 pt-10 border-t border-white/5 -mx-10 px-10 -mb-10 bg-white/5 mt-10">
                                        <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-4.5 rounded-2xl bg-white/5 text-slate-400 font-bold text-[10px] uppercase tracking-widest hover:text-white hover:bg-white/10 border border-white/10 transition-all">
                                            Abort Deployment
                                        </button>
                                        <button type="submit" disabled={submitting} className="flex-2 py-4.5 rounded-2xl bg-emerald-600 text-white font-bold text-[10px] uppercase tracking-widest hover:bg-emerald-500 shadow-lg shadow-emerald-500/20 transition-all flex items-center justify-center gap-3 active:scale-95">
                                            {submitting ? <RefreshCw size={18} className="animate-spin" /> : <Check size={18} strokeWidth={3} />}
                                            <span>{editingMentor ? "Commit Sync" : "Deploy Expert"}</span>
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
