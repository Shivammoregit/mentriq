import React, { useEffect, useState } from "react";
import { apiClient as api } from "../../utils/apiClient";
import { Plus, Edit2, Trash2, Briefcase, FileText, Check, X, Calendar, ChevronDown, CheckCircle, Clock, MapPin, Building2, ExternalLink, Eye, Tag, Percent, Loader2, Image as ImageIcon } from "lucide-react";
import { resolveImageUrl } from "../../utils/imageUtils";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "../../context/ToastContext";

const InternshipManagement = () => {
    const [activeTab, setActiveTab] = useState("postings");
    const [internships, setInternships] = useState([]);
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingInternship, setEditingInternship] = useState(null);
    const [viewingApp, setViewingApp] = useState(null);
    const [thumbnailFile, setThumbnailFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const toast = useToast();

    const [isDiscountModalOpen, setIsDiscountModalOpen] = useState(false);
    const [discountLoading, setDiscountLoading] = useState(false);
    const [discountData, setDiscountData] = useState({
        isActive: false,
        discountPercentage: 0,
        endDate: "",
        title: "Limited Time Offer"
    });

    const initialFormState = {
        title: "",
        company: "MentriQ Technology",
        location: "Remote",
        type: "Remote",
        description: "",
        requirements: "",
        questions: "",
        duration: "",
        price: "",
        discount: "",
        thumbnail: ""
    };
    const [formData, setFormData] = useState(initialFormState);

    const fetchData = async () => {
        setLoading(true);
        try {
            if (activeTab === "postings") {
                const { data } = await api.get("/internships");
                setInternships(data || []);
            } else {
                const { data } = await api.get("/internships/admin/applications");
                setApplications(data || []);
            }
        } catch (err) {
            console.error("Data fetch error:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
        const interval = setInterval(fetchData, 15000);
        return () => clearInterval(interval);
    }, [activeTab]);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setThumbnailFile(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            let finalThumbnailUrl = formData.thumbnail;

            // Upload image if a new file was selected
            if (thumbnailFile) {
                const uploadData = new FormData();
                uploadData.append("image", thumbnailFile);
                try {
                    const uploadRes = await api.post("/upload", uploadData, {
                        headers: { "Content-Type": "multipart/form-data" },
                    });
                    finalThumbnailUrl = uploadRes.data.imageUrl;
                } catch (uploadError) {
                    toast.error("Image upload failed");
                    return;
                }
            }

            const payload = {
                ...formData,
                thumbnail: finalThumbnailUrl,
                price: Number(formData.price) || 0,
                discount: Number(formData.discount) || 0,
                requirements: typeof formData.requirements === 'string'
                    ? formData.requirements.trim()
                    : formData.requirements,
                questions: typeof formData.questions === 'string'
                    ? formData.questions
                        .split('\n')
                        .map(q => q.trim())
                        .filter(Boolean)
                        .map((label, index) => ({
                            id: `question-${index + 1}`,
                            label,
                            type: 'text',
                            required: false
                        }))
                    : formData.questions || []
            };

            if (editingInternship) {
                await api.put(`/internships/${editingInternship._id}`, payload);
                toast.success("Opportunity logic updated");
            } else {
                await api.post("/internships", payload);
                toast.success("New opportunity deployed");
            }
            setIsModalOpen(false);
            setEditingInternship(null);
            setFormData(initialFormState);
            setThumbnailFile(null);
            setImagePreview(null);
            fetchData();
        } catch (err) {
            toast.error(err.response?.data?.message || "Transmission failed");
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Rescind this opportunity from the grid?")) return;
        try {
            await api.delete(`/internships/${id}`);
            toast.success("Post removed");
            fetchData();
        } catch (err) {
            toast.error("Deletion failed");
        }
    };

    const handleApplicationStatus = async (id, status) => {
        try {
            await api.put(`/internships/applications/${id}`, { status });
            toast.success(`Applicant status: ${status}`);
            setApplications(applications.map(app => app._id === id ? { ...app, status } : app));
            if (viewingApp && viewingApp._id === id) {
                setViewingApp({ ...viewingApp, status });
            }
        } catch (err) {
            toast.error("Update failed");
        }
    };

    const handleOpenDiscountModal = async () => {
        setIsDiscountModalOpen(true);
        try {
            const { data } = await api.get('/settings');
            if (data?.internshipPromo) {
                setDiscountData({
                   isActive: data.internshipPromo.isActive || false,
                   discountPercentage: data.internshipPromo.discountPercentage || 0,
                   endDate: data.internshipPromo.endDate ? data.internshipPromo.endDate.split('T')[0] : "",
                   title: data.internshipPromo.title || "Limited Time Offer"
                });
            }
        } catch (error) {
            console.error(error);
        }
    };

    const handleSaveDiscount = async (e) => {
        e.preventDefault();
        setDiscountLoading(true);
        try {
            await api.put('/settings', { internshipPromo: discountData });
            toast.success("Universal discount updated successfully!");
            setIsDiscountModalOpen(false);
            fetchData(); // refresh
        } catch(error) {
            toast.error("Failed to update discount");
        } finally {
            setDiscountLoading(false);
        }
    };

    const openEditModal = (internship) => {
        setEditingInternship(internship);
        setThumbnailFile(null);
        setFormData({
            ...internship,
            thumbnail: internship.thumbnail || "",
            requirements: Array.isArray(internship.requirements) ? internship.requirements.join('\n') : (internship.requirements || ""),
            questions: Array.isArray(internship.questions)
                ? internship.questions.map((q) => typeof q === 'string' ? q : q.label).filter(Boolean).join('\n')
                : (internship.questions || "")
        });
        setImagePreview(internship.thumbnail ? resolveImageUrl(internship.thumbnail, null) : null);
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
                            <h2 className="text-2xl font-black text-white tracking-tighter uppercase">Talent Pipeline</h2>
                            <span className="ml-2 text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-lg border border-emerald-500/20 text-[10px] font-bold">
                                {activeTab === "postings" ? internships.length : applications.length} {activeTab === "postings" ? "Nodes" : "Candidates"}
                            </span>
                        </div>
                        <p className="text-slate-400 font-medium text-xs">Professional internship development and candidate acquisition management.</p>
                    </div>

                    <div className="flex gap-4">
                        <button
                            onClick={handleOpenDiscountModal}
                            className="bg-emerald-600/20 text-emerald-400 hover:bg-emerald-500/30 border border-emerald-500/30 px-5 py-2.5 rounded-xl font-bold flex items-center justify-center gap-2 transition-all active:scale-95 text-[10px] uppercase tracking-widest whitespace-nowrap"
                        >
                            <Tag size={14} />
                            <span>Global Discount</span>
                        </button>
                        <button
                            onClick={() => { setEditingInternship(null); setFormData(initialFormState); setIsModalOpen(true); }}
                            className="bg-emerald-600 text-white hover:bg-emerald-500 px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-all active:scale-95 shadow-lg shadow-emerald-500/20 text-[10px] uppercase tracking-widest justify-center"
                        >
                            <Plus size={16} />
                            <span>Deploy Post</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-1.5 p-1 bg-[#1e293b] border border-white/10 rounded-xl w-fit">
                <button
                    onClick={() => setActiveTab("postings")}
                    className={`px-4 py-2 rounded-lg font-bold text-[9px] uppercase tracking-widest transition-all ${activeTab === 'postings' ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/20' : 'text-slate-400 hover:text-white hover:bg-[#1e293b]'}`}
                >
                    Opportunity Grid
                </button>
                <button
                    onClick={() => setActiveTab("applications")}
                    className={`px-4 py-2 rounded-lg font-bold text-[9px] uppercase tracking-widest transition-all ${activeTab === 'applications' ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/20' : 'text-slate-400 hover:text-white hover:bg-[#1e293b]'}`}
                >
                    Candidate Stream
                </button>
            </div>

            {/* Content Area */}
            <div className="bg-[#0b1120]/40 backdrop-blur-xl border border-white/5 rounded-3xl overflow-hidden shadow-2xl">
                <div className="overflow-x-auto">
                    {activeTab === "postings" ? (
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-[#1e293b] border-b border-white/10">
                                    <th className="px-8 py-4 text-[9px] font-bold uppercase tracking-[0.2em] text-slate-400">Position Path</th>
                                    <th className="px-8 py-4 text-[9px] font-bold uppercase tracking-[0.2em] text-slate-400">Operational Hub</th>
                                    <th className="px-8 py-4 text-[9px] font-bold uppercase tracking-[0.2em] text-slate-400">Duration</th>
                                    <th className="px-8 py-4 text-[9px] font-bold uppercase tracking-[0.2em] text-slate-400 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {internships.map((job) => (
                                    <motion.tr
                                        key={job._id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="hover:bg-[#1e293b] transition-colors group"
                                    >
                                        <td className="px-8 py-4">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 rounded-xl bg-[#1e293b] border border-white/10 flex items-center justify-center overflow-hidden shrink-0 shadow-sm group-hover:border-emerald-500/50 transition-all">
                                                    {job.thumbnail ? (
                                                        <img
                                                            src={resolveImageUrl(job.thumbnail, "/images/learning4.jpg")}
                                                            alt={job.title}
                                                            className="w-full h-full object-cover transition-transform group-hover:scale-110"
                                                            onError={(e) => { e.currentTarget.src = "/images/learning4.jpg"; }}
                                                        />
                                                    ) : (
                                                        <Briefcase size={20} className="text-emerald-400/50" />
                                                    )}
                                                </div>
                                                <div>
                                                    <div className="font-bold text-white text-[14px] tracking-tight">{job.title}</div>
                                                    <div className="text-[9px] text-emerald-400 font-bold uppercase tracking-widest">{job.type}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-4">
                                            <div className="flex flex-col gap-0.5">
                                                <div className="text-white font-bold text-[11px] flex items-center gap-2">
                                                    <Building2 size={10} className="text-emerald-400" />
                                                    {job.company}
                                                </div>
                                                <div className="text-slate-400 text-[9px] uppercase font-bold tracking-widest flex items-center gap-1.5">
                                                    <MapPin size={10} />
                                                    {job.location}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-4">
                                            <span className="text-slate-400 text-[9px] font-black uppercase tracking-widest flex items-center gap-2">
                                                <Clock size={10} className="text-emerald-400" />
                                                {job.duration || "Permanent"}
                                            </span>
                                        </td>
                                        <td className="px-8 py-4 text-right">
                                            <div className="flex justify-end gap-2.5">
                                                <button onClick={() => openEditModal(job)} className="p-2.5 rounded-xl bg-[#1e293b] text-slate-400 hover:text-emerald-400 hover:bg-emerald-500/10 border border-white/10 hover:border-emerald-500/20 transition-all">
                                                    <Edit2 size={14} />
                                                </button>
                                                <button onClick={() => handleDelete(job._id)} className="p-2.5 rounded-xl bg-[#1e293b] text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 border border-white/10 hover:border-rose-500/20 transition-all">
                                                    <Trash2 size={14} />
                                                </button>
                                            </div>
                                        </td>
                                    </motion.tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-[#1e293b] border-b border-white/10">
                                    <th className="px-8 py-4 text-[9px] font-bold uppercase tracking-[0.2em] text-slate-400">Candidate Identity</th>
                                    <th className="px-8 py-4 text-[9px] font-bold uppercase tracking-[0.2em] text-slate-400">Target Role</th>
                                    <th className="px-8 py-4 text-[9px] font-bold uppercase tracking-[0.2em] text-slate-400">System Status</th>
                                    <th className="px-8 py-4 text-[9px] font-bold uppercase tracking-[0.2em] text-slate-400 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {applications.map((app) => (
                                    <motion.tr
                                        key={app._id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="hover:bg-[#1e293b] transition-colors group cursor-pointer"
                                        onClick={() => setViewingApp(app)}
                                    >
                                        <td className="px-8 py-4">
                                            <div className="flex flex-col gap-0.5">
                                                <div className="font-bold text-white text-[14px] tracking-tight">{app.fullName}</div>
                                                <div className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">{app.email}</div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-4">
                                            <div className="text-white font-bold text-[11px] uppercase tracking-wider">{app.internshipId?.title || "Legacy Position"}</div>
                                        </td>
                                        <td className="px-8 py-4">
                                            <span className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border ${app.status === 'Accepted' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : app.status === 'Rejected' ? 'bg-rose-500/10 text-rose-400 border-rose-500/20' : 'bg-[#1e293b] text-slate-400 border-white/10'}`}>
                                                {app.status || 'Pending'}
                                            </span>
                                        </td>
                                        <td className="px-8 py-4 text-right">
                                            <div className="flex justify-end gap-2.5" onClick={e => e.stopPropagation()}>
                                                {app.status !== 'Accepted' && app.status !== 'Rejected' && (
                                                    <>
                                                        <button onClick={() => handleApplicationStatus(app._id, 'Accepted')} className="p-2.5 rounded-xl bg-[#1e293b] text-slate-400 hover:text-emerald-400 hover:bg-emerald-500/10 border border-white/10 hover:border-emerald-500/20 transition-all">
                                                            <CheckCircle size={14} />
                                                        </button>
                                                        <button onClick={() => handleApplicationStatus(app._id, 'Rejected')} className="p-2.5 rounded-xl bg-[#1e293b] text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 border border-white/10 hover:border-rose-500/20 transition-all">
                                                            <X size={14} />
                                                        </button>
                                                    </>
                                                )}
                                                <button onClick={() => setViewingApp(app)} className="p-2.5 rounded-xl bg-[#1e293b] text-slate-400 hover:text-blue-400 hover:bg-blue-500/10 border border-white/10 hover:border-blue-500/20 transition-all">
                                                    <Eye size={14} />
                                                </button>
                                            </div>
                                        </td>
                                    </motion.tr>
                                ))}
                            </tbody>
                        </table>
                    )}
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
                                        {editingInternship ? "Refine Position" : "Engineer Posting"}
                                    </h3>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mt-1">Opportunity Deployment Protocol</p>
                                </div>
                                <button
                                    onClick={() => setIsModalOpen(false)}
                                    className="p-3 rounded-2xl bg-[#1e293b] hover:bg-white/10 text-slate-400 hover:text-white transition-all border border-white/10"
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            <form id="internship-form" onSubmit={handleSubmit} className="flex-1 overflow-y-auto pr-4 -mr-4 space-y-6 custom-scrollbar">
                                <div className="space-y-6">
                                    {/* Thumbnail Image Upload */}
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Cover Image / Thumbnail</label>
                                        <div className="relative group w-full h-36 bg-[#1e293b] border-2 border-dashed border-white/10 rounded-2xl flex flex-col items-center justify-center gap-3 group-hover:border-emerald-400/50 transition-all overflow-hidden cursor-pointer">
                                            {imagePreview ? (
                                                <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                                            ) : formData.thumbnail ? (
                                                <img
                                                    src={resolveImageUrl(formData.thumbnail, "/images/learning4.jpg")}
                                                    alt="Current"
                                                    className="w-full h-full object-cover"
                                                    onError={(e) => { e.currentTarget.src = "/images/learning4.jpg"; }}
                                                />
                                            ) : (
                                                <>
                                                    <ImageIcon size={30} className="text-slate-400 group-hover:text-emerald-400 transition-colors" strokeWidth={1.5} />
                                                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest group-hover:text-emerald-400 transition-colors">Click to upload thumbnail</span>
                                                </>
                                            )}
                                            <input type="file" accept="image/*" onChange={handleImageChange} className="absolute inset-0 opacity-0 cursor-pointer" />
                                            {(imagePreview || formData.thumbnail) && (
                                                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                                    <ImageIcon size={20} className="text-white" />
                                                    <span className="text-white text-xs font-bold">Change Image</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Position Designation</label>
                                            <input
                                                required
                                                value={formData.title}
                                                onChange={e => setFormData({ ...formData, title: e.target.value })}
                                                className="w-full bg-[#1e293b] border border-white/10 rounded-2xl p-4 text-white font-bold focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500/30 transition-all text-sm"
                                                placeholder="e.g. AI Research Intern"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Target Entity</label>
                                            <input
                                                required
                                                value={formData.company}
                                                onChange={e => setFormData({ ...formData, company: e.target.value })}
                                                className="w-full bg-[#1e293b] border border-white/10 rounded-2xl p-4 text-white font-bold focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500/30 transition-all text-sm"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-6 lg:grid-cols-4">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Operational Zone</label>
                                            <input
                                                value={formData.location}
                                                onChange={e => setFormData({ ...formData, location: e.target.value })}
                                                className="w-full bg-[#1e293b] border border-white/10 rounded-2xl p-4 text-white font-bold focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500/30 transition-all text-sm"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Cycle Duration</label>
                                            <input
                                                value={formData.duration}
                                                onChange={e => setFormData({ ...formData, duration: e.target.value })}
                                                className="w-full bg-[#1e293b] border border-white/10 rounded-2xl p-4 text-white font-bold focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500/30 transition-all text-sm"
                                                placeholder="e.g. 6 Months"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Price (₹)</label>
                                            <input
                                                type="number"
                                                value={formData.price}
                                                onChange={e => setFormData({ ...formData, price: e.target.value })}
                                                className="w-full bg-[#1e293b] border border-white/10 rounded-2xl p-4 text-white font-bold focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500/30 transition-all text-sm"
                                                placeholder="e.g. 5000"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Discount (%)</label>
                                            <input
                                                type="number"
                                                value={formData.discount}
                                                onChange={e => setFormData({ ...formData, discount: e.target.value })}
                                                className="w-full bg-[#1e293b] border border-white/10 rounded-2xl p-4 text-white font-bold focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500/30 transition-all text-sm"
                                                placeholder="e.g. 10"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Shift Type</label>
                                            <select
                                                value={formData.type}
                                                onChange={e => setFormData({ ...formData, type: e.target.value })}
                                                className="w-full bg-[#1e293b] border border-white/10 rounded-2xl p-4 text-white font-bold focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500/30 transition-all appearance-none cursor-pointer text-sm"
                                            >
                                                <option value="Remote" className="bg-[#1e293b]">Remote</option>
                                                <option value="Hybrid" className="bg-[#1e293b]">Hybrid</option>
                                                <option value="On-site" className="bg-[#1e293b]">On-site</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Prerequisite Matrix (One per line)</label>
                                        <textarea
                                            rows={3}
                                            value={formData.requirements}
                                            onChange={e => setFormData({ ...formData, requirements: e.target.value })}
                                            className="w-full bg-[#1e293b] border border-white/10 rounded-2xl p-4 text-slate-300 font-medium focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500/30 transition-all placeholder:text-slate-400 resize-none text-xs"
                                            placeholder="React Expertise&#10;System Design Knowledge..."
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Mission Description</label>
                                        <textarea
                                            required
                                            rows={4}
                                            value={formData.description}
                                            onChange={e => setFormData({ ...formData, description: e.target.value })}
                                            className="w-full bg-[#1e293b] border border-white/10 rounded-2xl p-4 text-slate-300 font-medium focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500/30 transition-all placeholder:text-slate-400 resize-none leading-relaxed text-xs"
                                        />
                                    </div>
                                </div>
                            </form>
                            <div className="p-6 border-t border-white/5 flex justify-end items-center gap-4 shrink-0 -mx-8 -mb-8 mt-6 bg-[#1e293b]">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="flex-1 py-3.5 rounded-2xl bg-[#1e293b] text-slate-400 font-bold text-[10px] uppercase tracking-widest hover:text-white hover:bg-white/10 border border-white/10 transition-all"
                                >
                                    Dismiss
                                </button>
                                <button
                                    type="submit"
                                    form="internship-form"
                                    className="flex-2 py-3.5 rounded-2xl bg-emerald-600 text-white font-bold text-[10px] uppercase tracking-widest hover:bg-emerald-500 shadow-lg shadow-emerald-600/20 transition-all flex items-center justify-center gap-2 active:scale-95"
                                >
                                    <CheckCircle size={16} strokeWidth={3} />
                                    <span>Deploy Post</span>
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Candidate Details Modal */}
            <AnimatePresence>
                {viewingApp && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl" onClick={() => setViewingApp(null)}>
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 30 }}
                            onClick={e => e.stopPropagation()}
                            className="relative w-full max-w-3xl bg-[#0b1120] border border-white/10 rounded-[2.5rem] p-6 sm:p-8 shadow-2xl flex flex-col max-h-[90vh]"
                        >
                            <div className="flex items-start justify-between gap-6 mb-8 shrink-0">
                                <div>
                                    <h3 className="text-2xl font-black text-white tracking-tight uppercase">
                                        Candidate Review
                                    </h3>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mt-1">
                                        Evaluating Profile for: <span className="text-emerald-400">{viewingApp.internshipId?.title || "Legacy Position"}</span>
                                    </p>
                                </div>
                                <button
                                    onClick={() => setViewingApp(null)}
                                    className="p-3 rounded-2xl bg-[#1e293b] hover:bg-white/10 text-slate-400 hover:text-white transition-all border border-white/10"
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            <div className="flex-1 overflow-y-auto pr-4 -mr-4 space-y-8 custom-scrollbar">
                                <div className="space-y-6">
                                    {/* Personal Info */}
                                    <div className="bg-[#1e293b] rounded-2xl p-6 border border-white/5 space-y-4">
                                        <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 border-b border-white/10 pb-2">Profile Information</h4>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <p className="text-slate-500 text-[10px] font-bold uppercase tracking-wider mb-1">Full Name</p>
                                                <p className="text-white font-medium text-sm">{viewingApp.fullName}</p>
                                            </div>
                                            <div>
                                                <p className="text-slate-500 text-[10px] font-bold uppercase tracking-wider mb-1">Email Address</p>
                                                <p className="text-white font-medium text-sm">{viewingApp.email}</p>
                                            </div>
                                            <div>
                                                <p className="text-slate-500 text-[10px] font-bold uppercase tracking-wider mb-1">Phone Number</p>
                                                <p className="text-white font-medium text-sm">{viewingApp.phone || "N/A"}</p>
                                            </div>
                                            <div>
                                                <p className="text-slate-500 text-[10px] font-bold uppercase tracking-wider mb-1">Current Status</p>
                                                <span className={`inline-block mt-0.5 px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border ${viewingApp.status === 'Accepted' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : viewingApp.status === 'Rejected' ? 'bg-rose-500/10 text-rose-400 border-rose-500/20' : 'bg-[#1e293b] text-slate-400 border-white/10'}`}>
                                                    {viewingApp.status || 'Pending'}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Links & Attachments */}
                                    <div className="bg-[#1e293b] rounded-2xl p-6 border border-white/5 space-y-4">
                                        <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 border-b border-white/10 pb-2">Documents & Links</h4>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {viewingApp.resumeUrl && (
                                                <a href={viewingApp.resumeUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-3 rounded-xl bg-[#0b1120] border border-white/5 hover:border-emerald-500/30 transition-all group">
                                                    <FileText size={18} className="text-slate-400 group-hover:text-emerald-400" />
                                                    <span className="text-xs font-semibold text-slate-300 group-hover:text-white">View Resume / CV</span>
                                                    <ExternalLink size={14} className="ml-auto text-slate-500" />
                                                </a>
                                            )}
                                            {viewingApp.portfolioUrl && (
                                                <a href={viewingApp.portfolioUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-3 rounded-xl bg-[#0b1120] border border-white/5 hover:border-emerald-500/30 transition-all group">
                                                    <Briefcase size={18} className="text-slate-400 group-hover:text-emerald-400" />
                                                    <span className="text-xs font-semibold text-slate-300 group-hover:text-white">Portfolio / GitHub</span>
                                                    <ExternalLink size={14} className="ml-auto text-slate-500" />
                                                </a>
                                            )}
                                            {!viewingApp.resumeUrl && !viewingApp.portfolioUrl && (
                                                <p className="text-slate-500 text-sm italic">No external documents provided.</p>
                                            )}
                                        </div>
                                    </div>

                                    {/* Custom Answers */}
                                    {viewingApp.answers && Object.keys(viewingApp.answers).length > 0 && (
                                        <div className="bg-[#1e293b] rounded-2xl p-6 border border-white/5 space-y-4">
                                            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 border-b border-white/10 pb-2">Questionnaire Responses</h4>
                                            <div className="space-y-4">
                                                {Object.entries(viewingApp.answers).map(([key, answer], i) => {
                                                    // Find the full question text from the associated internship, if available
                                                    const internshipQuestions = viewingApp.internshipId?.questions || [];
                                                    const matchedQuestion = internshipQuestions.find(q => q.id === key);
                                                    const questionLabel = matchedQuestion ? matchedQuestion.label : key;

                                                    return (
                                                        <div key={key}>
                                                            <p className="text-slate-400 text-xs font-bold mb-1.5">{i + 1}. {questionLabel}</p>
                                                            <div className="bg-[#0b1120] p-4 rounded-xl border border-white/5 text-sm text-slate-300 whitespace-pre-wrap">
                                                                {answer || <span className="text-slate-500 italic">No answer provided</span>}
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    )}

                                    {/* Cover Letter */}
                                    {viewingApp.coverLetter && (
                                        <div className="bg-[#1e293b] rounded-2xl p-6 border border-white/5 space-y-4">
                                            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 border-b border-white/10 pb-2">Cover Letter / Additional Note</h4>
                                            <div className="bg-[#0b1120] p-4 rounded-xl border border-white/5 text-sm text-slate-300 whitespace-pre-wrap leading-relaxed">
                                                {viewingApp.coverLetter}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Actions Footer */}
                            {viewingApp.status !== 'Accepted' && viewingApp.status !== 'Rejected' && (
                                <div className="p-6 border-t border-white/5 flex justify-end items-center gap-4 shrink-0 -mx-8 -mb-8 mt-6 bg-[#1e293b]">
                                    <button
                                        onClick={() => handleApplicationStatus(viewingApp._id, 'Rejected')}
                                        className="flex-1 py-3.5 rounded-2xl bg-rose-500/10 text-rose-400 font-bold text-[10px] uppercase tracking-widest hover:text-white hover:bg-rose-500 shadow-lg shadow-rose-500/0 hover:shadow-rose-500/20 transition-all flex items-center justify-center gap-2 active:scale-95"
                                    >
                                        <X size={16} strokeWidth={3} />
                                        <span>Reject Candidate</span>
                                    </button>
                                    <button
                                        onClick={() => handleApplicationStatus(viewingApp._id, 'Accepted')}
                                        className="flex-2 py-3.5 rounded-2xl bg-emerald-600/10 text-emerald-400 font-bold text-[10px] uppercase tracking-widest hover:text-white hover:bg-emerald-600 shadow-lg shadow-emerald-500/0 hover:shadow-emerald-500/20 transition-all flex items-center justify-center gap-2 active:scale-95"
                                    >
                                        <CheckCircle size={16} strokeWidth={3} />
                                        <span>Accept Candidate</span>
                                    </button>
                                </div>
                            )}
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
            {/* Universal Discount Modal */}
            <AnimatePresence>
                {isDiscountModalOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl">
                        <div className="absolute inset-0" onClick={() => !discountLoading && setIsDiscountModalOpen(false)} />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 30 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 30 }}
                            className="relative w-full max-w-md bg-[#0b1120] border border-emerald-500/30 rounded-[2.5rem] p-8 shadow-2xl overflow-hidden"
                        >
                            <div className="absolute -top-[20%] -right-[20%] w-[50%] h-[50%] bg-emerald-500/10 blur-[60px] rounded-full pointer-events-none" />
                            
                            <div className="flex items-center justify-between gap-4 mb-8">
                                <div className="flex items-center gap-3 relative z-10">
                                    <div className="p-3 bg-emerald-500/10 rounded-2xl border border-emerald-500/20 text-emerald-400">
                                        <Tag size={24} />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-black text-white tracking-tight">Global Discount</h3>
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mt-1">Universal Price Override</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => !discountLoading && setIsDiscountModalOpen(false)}
                                    className="w-10 h-10 rounded-xl bg-[#1e293b] hover:bg-white/10 text-slate-400 transition-all flex items-center justify-center relative z-10"
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            <form onSubmit={handleSaveDiscount} className="space-y-6 relative z-10">
                                <div className="flex items-center gap-4 bg-[#1e293b] p-4 rounded-2xl border border-white/5">
                                    <input
                                        type="checkbox"
                                        id="isActive"
                                        checked={discountData.isActive}
                                        onChange={(e) => setDiscountData({ ...discountData, isActive: e.target.checked })}
                                        className="w-5 h-5 rounded border-slate-600 text-emerald-500 focus:ring-emerald-500/50 bg-[#0b1120]"
                                    />
                                    <label htmlFor="isActive" className="text-sm font-bold text-white tracking-tight cursor-pointer">
                                        Enable Platform-wide Discount
                                    </label>
                                </div>

                                {discountData.isActive && (
                                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="space-y-4">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Discount %</label>
                                            <div className="relative group">
                                                <Percent size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-400 transition-colors" />
                                                <input
                                                    type="number"
                                                    required
                                                    min="1"
                                                    max="100"
                                                    value={discountData.discountPercentage}
                                                    onChange={(e) => setDiscountData({ ...discountData, discountPercentage: parseInt(e.target.value) || 0 })}
                                                    className="w-full bg-[#1e293b] border border-white/10 rounded-xl p-4 pl-12 text-white font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all"
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">End Date</label>
                                            <div className="relative group">
                                                <Calendar size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-400 transition-colors" />
                                                <input
                                                    type="date"
                                                    required
                                                    min={new Date().toISOString().split('T')[0]}
                                                    value={discountData.endDate}
                                                    onChange={(e) => setDiscountData({ ...discountData, endDate: e.target.value })}
                                                    className="w-full bg-[#1e293b] border border-white/10 rounded-xl p-4 pl-12 text-white font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all [color-scheme:dark]"
                                                />
                                            </div>
                                        </div>
                                    </motion.div>
                                )}

                                <button
                                    type="submit"
                                    disabled={discountLoading}
                                    className="w-full py-4 rounded-xl bg-emerald-600 text-white font-bold text-[10px] uppercase tracking-widest hover:bg-emerald-500 shadow-lg shadow-emerald-500/20 transition-all flex items-center justify-center gap-2"
                                >
                                    {discountLoading ? <Loader2 size={16} className="animate-spin" /> : <Tag size={16} />}
                                    Save Discount Policy
                                </button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default InternshipManagement;
