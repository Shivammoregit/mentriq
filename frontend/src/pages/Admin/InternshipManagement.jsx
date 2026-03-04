import React, { useEffect, useState } from "react";
import { apiClient as api } from "../../utils/apiClient";
import { Plus, Edit2, Trash2, Briefcase, FileText, Check, X, Calendar, ChevronDown, CheckCircle, Clock, MapPin, Building2, ExternalLink } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "../../context/ToastContext";

const InternshipManagement = () => {
    const [activeTab, setActiveTab] = useState("postings");
    const [internships, setInternships] = useState([]);
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingInternship, setEditingInternship] = useState(null);
    const toast = useToast();

    const initialFormState = {
        title: "",
        company: "MentriQ Technology",
        location: "Remote",
        type: "Full-time",
        description: "",
        requirements: "",
        questions: "",
        duration: ""
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const payload = {
                ...formData,
                requirements: typeof formData.requirements === 'string'
                    ? formData.requirements.split('\n').filter(r => r.trim())
                    : formData.requirements,
                questions: typeof formData.questions === 'string'
                    ? formData.questions.split('\n').filter(q => q.trim())
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
            fetchData();
        } catch (err) {
            toast.error("Transmission failed");
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
        } catch (err) {
            toast.error("Update failed");
        }
    };

    const openEditModal = (internship) => {
        setEditingInternship(internship);
        setFormData({
            ...internship,
            requirements: Array.isArray(internship.requirements) ? internship.requirements.join('\n') : internship.requirements,
            questions: Array.isArray(internship.questions) ? internship.questions.join('\n') : (internship.questions || "")
        });
        setIsModalOpen(true);
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* Page Header */}
            <div className="bg-[#0f172a]/40 backdrop-blur-xl p-6 rounded-3xl border border-white/5 shadow-2xl relative overflow-hidden group">
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
            <div className="flex gap-1.5 p-1 bg-white/5 border border-white/10 rounded-xl w-fit">
                <button
                    onClick={() => setActiveTab("postings")}
                    className={`px-4 py-2 rounded-lg font-bold text-[9px] uppercase tracking-widest transition-all ${activeTab === 'postings' ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/20' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
                >
                    Opportunity Grid
                </button>
                <button
                    onClick={() => setActiveTab("applications")}
                    className={`px-4 py-2 rounded-lg font-bold text-[9px] uppercase tracking-widest transition-all ${activeTab === 'applications' ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/20' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
                >
                    Candidate Stream
                </button>
            </div>

            {/* Content Area */}
            <div className="bg-[#0f172a]/40 backdrop-blur-xl border border-white/5 rounded-3xl overflow-hidden shadow-2xl">
                <div className="overflow-x-auto">
                    {activeTab === "postings" ? (
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-white/5 border-b border-white/10">
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
                                        className="hover:bg-white/5 transition-colors group"
                                    >
                                        <td className="px-8 py-4">
                                            <div className="flex flex-col gap-0.5">
                                                <div className="font-bold text-white text-[14px] tracking-tight">{job.title}</div>
                                                <div className="text-[9px] text-emerald-400 font-bold uppercase tracking-widest">{job.type}</div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-4">
                                            <div className="flex flex-col gap-0.5">
                                                <div className="text-white font-bold text-[11px] flex items-center gap-2">
                                                    <Building2 size={10} className="text-emerald-400" />
                                                    {job.company}
                                                </div>
                                                <div className="text-slate-500 text-[9px] uppercase font-bold tracking-widest flex items-center gap-1.5">
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
                                                <button onClick={() => openEditModal(job)} className="p-2.5 rounded-xl bg-white/5 text-slate-400 hover:text-emerald-400 hover:bg-emerald-500/10 border border-white/10 hover:border-emerald-500/20 transition-all">
                                                    <Edit2 size={14} />
                                                </button>
                                                <button onClick={() => handleDelete(job._id)} className="p-2.5 rounded-xl bg-white/5 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 border border-white/10 hover:border-rose-500/20 transition-all">
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
                                <tr className="bg-white/5 border-b border-white/10">
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
                                        className="hover:bg-white/5 transition-colors group"
                                    >
                                        <td className="px-8 py-4">
                                            <div className="flex flex-col gap-0.5">
                                                <div className="font-bold text-white text-[14px] tracking-tight">{app.fullName}</div>
                                                <div className="text-[9px] text-slate-500 font-bold uppercase tracking-widest">{app.email}</div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-4">
                                            <div className="text-white font-bold text-[11px] uppercase tracking-wider">{app.internshipId?.title || "Legacy Position"}</div>
                                        </td>
                                        <td className="px-8 py-4">
                                            <span className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border ${app.status === 'Accepted' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : app.status === 'Rejected' ? 'bg-rose-500/10 text-rose-400 border-rose-500/20' : 'bg-white/5 text-slate-400 border-white/10'}`}>
                                                {app.status}
                                            </span>
                                        </td>
                                        <td className="px-8 py-4 text-right">
                                            <div className="flex justify-end gap-2.5">
                                                <button onClick={() => handleApplicationStatus(app._id, 'Accepted')} className="p-2.5 rounded-xl bg-white/5 text-slate-400 hover:text-emerald-400 hover:bg-emerald-500/10 border border-white/10 hover:border-emerald-500/20 transition-all">
                                                    <CheckCircle size={14} />
                                                </button>
                                                <button onClick={() => handleApplicationStatus(app._id, 'Rejected')} className="p-2.5 rounded-xl bg-white/5 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 border border-white/10 hover:border-rose-500/20 transition-all">
                                                    <X size={14} />
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
                            className="relative w-full max-w-2xl bg-[#0f172a] border border-white/10 rounded-[2.5rem] p-6 sm:p-8 shadow-2xl flex flex-col max-h-[90vh]"
                        >
                            <div className="flex items-start justify-between gap-6 mb-8 shrink-0">
                                <div>
                                    <h3 className="text-2xl font-black text-white tracking-tight uppercase">
                                        {editingInternship ? "Refine Position" : "Engineer Posting"}
                                    </h3>
                                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mt-1">Opportunity Deployment Protocol</p>
                                </div>
                                <button
                                    onClick={() => setIsModalOpen(false)}
                                    className="p-3 rounded-2xl bg-white/5 hover:bg-white/10 text-slate-500 hover:text-white transition-all border border-white/10"
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto pr-4 -mr-4 space-y-6 custom-scrollbar">
                                <div className="space-y-6">
                                    <div className="grid grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Position Designation</label>
                                            <input
                                                required
                                                value={formData.title}
                                                onChange={e => setFormData({ ...formData, title: e.target.value })}
                                                className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white font-bold focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500/30 transition-all text-sm"
                                                placeholder="e.g. AI Research Intern"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Target Entity</label>
                                            <input
                                                required
                                                value={formData.company}
                                                onChange={e => setFormData({ ...formData, company: e.target.value })}
                                                className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white font-bold focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500/30 transition-all text-sm"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-3 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Operational Zone</label>
                                            <input
                                                value={formData.location}
                                                onChange={e => setFormData({ ...formData, location: e.target.value })}
                                                className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white font-bold focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500/30 transition-all text-sm"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Cycle Duration</label>
                                            <input
                                                value={formData.duration}
                                                onChange={e => setFormData({ ...formData, duration: e.target.value })}
                                                className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white font-bold focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500/30 transition-all text-sm"
                                                placeholder="e.g. 6 Months"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Shift Type</label>
                                            <select
                                                value={formData.type}
                                                onChange={e => setFormData({ ...formData, type: e.target.value })}
                                                className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white font-bold focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500/30 transition-all appearance-none cursor-pointer text-sm"
                                            >
                                                <option value="Remote" className="bg-slate-900">Remote</option>
                                                <option value="Hybrid" className="bg-slate-900">Hybrid</option>
                                                <option value="On-site" className="bg-slate-900">On-site</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Prerequisite Matrix (One per line)</label>
                                        <textarea
                                            rows={3}
                                            value={formData.requirements}
                                            onChange={e => setFormData({ ...formData, requirements: e.target.value })}
                                            className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-slate-300 font-medium focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500/30 transition-all placeholder:text-slate-600 resize-none text-xs"
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
                                            className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-slate-300 font-medium focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500/30 transition-all placeholder:text-slate-600 resize-none leading-relaxed text-xs"
                                        />
                                    </div>
                                </div>

                                <div className="p-6 border-t border-white/5 flex justify-end items-center gap-4 shrink-0 -mx-8 -mb-8 mt-6 bg-white/5">
                                    <button
                                        type="button"
                                        onClick={() => setIsModalOpen(false)}
                                        className="flex-1 py-3.5 rounded-2xl bg-white/5 text-slate-400 font-bold text-[10px] uppercase tracking-widest hover:text-white hover:bg-white/10 border border-white/10 transition-all"
                                    >
                                        Dismiss
                                    </button>
                                    <button
                                        type="submit"
                                        className="flex-2 py-3.5 rounded-2xl bg-emerald-600 text-white font-bold text-[10px] uppercase tracking-widest hover:bg-emerald-500 shadow-lg shadow-emerald-600/20 transition-all flex items-center justify-center gap-2 active:scale-95"
                                    >
                                        <CheckCircle size={16} strokeWidth={3} />
                                        <span>Deploy Post</span>
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

export default InternshipManagement;
