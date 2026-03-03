import React, { useEffect, useState } from "react";
import { apiClient as api } from "../../utils/apiClient";
import { Plus, Edit2, Trash2, BookOpen, Search, X, Check, DollarSign, Clock, BarChart, Image as ImageIcon, Loader2, ChevronDown, Users } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "../../context/ToastContext";
import { resolveImageUrl } from "../../utils/imageUtils";

const CourseManagement = () => {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCourse, setEditingCourse] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const toast = useToast();

    const initialFormState = {
        title: "",
        slug: "",
        description: "",
        category: "",
        level: "Beginner",
        price: "",
        discount: 0,
        duration: "",
        mode: "Online",
        modules: [],
        instructor: "MentriQ Team",
        syllabusUrl: "",
        brochureUrl: "",
        thumbnailUrl: "",
        thumbnailFile: null
    };
    const [formData, setFormData] = useState(initialFormState);
    const [imagePreview, setImagePreview] = useState(null);

    const fetchCourses = async () => {
        try {
            const { data } = await api.get("/courses");
            setCourses(data);
        } catch (err) {
            toast.error("Failed to load courses");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCourses();

        // Auto-refresh every 15 seconds
        const interval = setInterval(() => {
            fetchCourses();
        }, 15000);

        return () => clearInterval(interval);
    }, []);

    const handleDelete = async (id) => {
        if (!window.confirm("Delete this course permanently?")) return;
        try {
            await api.delete(`/courses/${id}`);
            toast.success("Course deleted");
            setCourses(courses.filter(c => c._id !== id));
        } catch (err) {
            toast.error("Delete failed");
        }
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData({ ...formData, thumbnailFile: file });
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            let finalThumbnailUrl = formData.thumbnailUrl;

            // Upload Image if selected
            if (formData.thumbnailFile) {
                const uploadData = new FormData();
                uploadData.append("image", formData.thumbnailFile);

                try {
                    const uploadRes = await api.post("/upload", uploadData, {
                        headers: { "Content-Type": "multipart/form-data" },
                    });
                    finalThumbnailUrl = uploadRes.data.imageUrl;
                } catch (uploadError) {
                    console.error("Upload failed", uploadError);
                    toast.error("Image upload failed");
                    setSubmitting(false);
                    return;
                }
            }

            const payload = {
                ...formData,
                price: Number(formData.price),
                discount: Number(formData.discount),
                thumbnailUrl: finalThumbnailUrl,
                modules: typeof formData.modules === 'string'
                    ? formData.modules.split('\n').filter(m => m.trim())
                    : formData.modules || []
            };
            delete payload.thumbnailFile; // Don't send file object to API

            if (editingCourse) {
                await api.put(`/courses/${editingCourse._id}`, payload);
                toast.success("Course updated");
            } else {
                await api.post("/courses", payload);
                toast.success("Course created");
            }
            closeModal();
            fetchCourses();
        } catch (err) {
            const msg = err.response?.data?.message || "Operation failed";
            toast.error(msg);
        } finally {
            setSubmitting(false);
        }
    };

    const openEditModal = (course) => {
        setEditingCourse(course);
        setFormData({
            title: course.title,
            slug: course.slug || "",
            description: course.description,
            category: course.category,
            level: course.level,
            price: course.price,
            discount: course.discount || 0,
            duration: course.duration,
            mode: course.mode || "Online",
            modules: course.modules?.join('\n') || "",
            instructor: course.instructor || "MentriQ Team",
            syllabusUrl: course.syllabusUrl || "",
            brochureUrl: course.brochureUrl || "",
            thumbnailUrl: course.thumbnailUrl || "",
            thumbnailFile: null
        });
        setImagePreview(resolveImageUrl(course.thumbnailUrl));
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingCourse(null);
        setFormData(initialFormState);
        setImagePreview(null);
    };

    const filteredCourses = courses.filter(c =>
        c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.category.toLowerCase().includes(searchTerm.toLowerCase())
    );
    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
            {/* Page Header */}
            <div className="bg-[#0f172a]/40 backdrop-blur-xl p-8 rounded-3xl border border-white/5 shadow-2xl relative overflow-hidden group">
                <div className="flex flex-col lg:flex-row gap-8 lg:items-center lg:justify-between relative z-10">
                    <div>
                        <div className="flex items-center gap-3 mb-1">
                            <BookOpen size={28} className="text-blue-400" />
                            <h2 className="text-3xl font-extrabold text-white tracking-tight">Curriculum Hub</h2>
                            <span className="ml-2 text-blue-400 bg-blue-500/10 px-3 py-1 rounded-lg border border-blue-500/20 text-xs font-bold">
                                {courses.length} Active Modules
                            </span>
                        </div>
                        <p className="text-slate-400 font-medium text-sm">Educational programs and certification roadmap management.</p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto mt-4 sm:mt-0">
                        <div className="bg-white/5 border border-white/10 rounded-xl flex items-center w-full lg:w-auto group focus-within:border-blue-500/50 focus-within:ring-4 focus-within:ring-blue-500/10 transition-all">
                            <Search className="text-slate-500 ml-4 group-focus-within:text-blue-400 transition-colors shrink-0" size={16} />
                            <input
                                type="text"
                                placeholder="Filter curriculum..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="bg-transparent text-white placeholder:text-slate-600 focus:outline-none py-3 px-4 w-full lg:w-64 font-bold text-xs tracking-tight"
                            />
                        </div>
                        <button
                            onClick={() => { setEditingCourse(null); setFormData(initialFormState); setIsModalOpen(true); setImagePreview(null); }}
                            className="bg-blue-600 text-white hover:bg-blue-500 px-6 py-3 rounded-xl font-bold shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2 transition-all active:scale-95 text-[10px] uppercase tracking-widest whitespace-nowrap"
                        >
                            <Plus size={16} />
                            <span>New Course</span>
                        </button>
                    </div>
                </div>
            </div>

            {loading ? (
                <div className="p-8 space-y-4">
                    {[1, 2, 3, 4].map(i => (
                        <div key={i} className="h-16 bg-white/5 border border-white/10 rounded-xl animate-pulse" />
                    ))}
                </div>
            ) : filteredCourses.length === 0 ? (
                <div className="bg-[#0f172a]/40 backdrop-blur-xl border border-white/5 rounded-[2.5rem] p-32 text-center group shadow-2xl">
                    <div className="w-24 h-24 bg-blue-500/10 rounded-[2rem] flex items-center justify-center mx-auto mb-6 border border-blue-500/10 text-blue-400 shadow-sm">
                        <BookOpen size={48} />
                    </div>
                    <h3 className="text-3xl font-extrabold text-white mb-3 tracking-tight">No Courses Protocol</h3>
                    <p className="text-slate-500 mb-10 max-w-sm mx-auto font-medium text-sm leading-relaxed">The curriculum registry is currently offline. Manual deployment required.</p>
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="bg-blue-600 text-white px-10 py-4 rounded-xl font-semibold flex items-center gap-3 justify-center hover:bg-blue-700 transition-all shadow-md shadow-blue-600/10 active:scale-95 mx-auto"
                    >
                        <Plus size={20} />
                        Initialize Curriculum
                    </button>
                </div>
            ) : (
                <div className="bg-[#0f172a]/40 backdrop-blur-xl border border-white/5 rounded-[2.5rem] overflow-hidden shadow-2xl animate-in slide-in-from-bottom-4 duration-700">
                    <div className="overflow-x-auto custom-scrollbar">
                        <table className="w-full text-left border-collapse min-w-[800px]">
                            <thead>
                                <tr className="bg-white/5 border-b border-white/10">
                                    <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">Course Entity</th>
                                    <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">Valuation & Data</th>
                                    <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">Syllabus / Brochure</th>
                                    <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                <AnimatePresence mode="popLayout">
                                    {filteredCourses.map((course) => (
                                        <motion.tr
                                            key={course._id}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0 }}
                                            className="hover:bg-white/5 transition-colors group"
                                        >
                                            <td className="px-8 py-6">
                                                <div className="flex items-center gap-5">
                                                    <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center overflow-hidden shrink-0 shadow-sm p-1 group-hover:border-blue-500/50 transition-all">
                                                        <img
                                                            src={resolveImageUrl(course.thumbnailUrl)}
                                                            alt={course.title}
                                                            className="w-full h-full object-cover rounded-xl transition-transform group-hover:scale-110"
                                                            onError={(e) => e.target.src = "https://via.placeholder.com/64?text=Course"}
                                                        />
                                                    </div>
                                                    <div>
                                                        <div className="font-bold text-white text-[15px] tracking-tight">{course.title}</div>
                                                        <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-1 flex items-center gap-2">
                                                            <BarChart size={12} className="text-blue-400" />
                                                            {course.category} • {course.level}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <div className="flex flex-col gap-2">
                                                    <div className="text-white font-bold text-xs flex items-center gap-2">
                                                        <DollarSign size={14} className="text-blue-400" />
                                                        ₹{course.price}
                                                        {course.discount > 0 && <span className="text-[10px] text-rose-400 ml-1">-{course.discount}%</span>}
                                                    </div>
                                                    <div className="text-slate-500 text-[10px] uppercase font-black tracking-widest flex items-center gap-2">
                                                        <Clock size={12} />
                                                        {course.duration}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <div className="flex gap-2">
                                                    {course.syllabusUrl && (
                                                        <span className="px-3 py-1 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20 text-[9px] font-black uppercase tracking-widest">Syllabus</span>
                                                    )}
                                                    {course.brochureUrl && (
                                                        <span className="px-3 py-1 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20 text-[9px] font-black uppercase tracking-widest">Brochure</span>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-8 py-6 text-right">
                                                <div className="flex justify-end gap-3">
                                                    <button
                                                        onClick={() => openEditModal(course)}
                                                        className="p-3.5 sm:p-4 rounded-xl bg-white/5 text-slate-400 hover:text-blue-400 hover:bg-blue-500/10 border border-white/10 hover:border-blue-500/20 transition-all active:scale-95"
                                                    >
                                                        <Edit2 size={18} className="sm:size-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(course._id)}
                                                        className="p-3.5 sm:p-4 rounded-xl bg-white/5 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 border border-white/10 hover:border-rose-500/20 transition-all active:scale-95"
                                                    >
                                                        <Trash2 size={18} className="sm:size-4" />
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
            )}

            {/* Modal */}
            <AnimatePresence>
                {isModalOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 30 }}
                            className="relative w-full max-w-2xl bg-[#0f172a] border border-white/10 rounded-[2.5rem] sm:rounded-[3rem] p-6 sm:p-10 shadow-2xl flex flex-col max-h-[90vh] overflow-hidden"
                        >
                            <div className="flex items-start justify-between gap-6 mb-10 shrink-0">
                                <div>
                                    <h3 className="text-3xl font-black text-white tracking-tight uppercase">
                                        {editingCourse ? "Synthesize Curriculum" : "Materialize Course"}
                                    </h3>
                                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mt-1">Status: Educational Architect Mode</p>
                                </div>
                                <button
                                    onClick={() => setIsModalOpen(false)}
                                    className="p-3.5 rounded-2xl bg-white/5 hover:bg-white/10 text-slate-500 hover:text-white transition-all border border-white/10"
                                >
                                    <X size={24} />
                                </button>
                            </div>

                            <div className="flex-1 overflow-y-auto pr-4 -mr-4 custom-scrollbar">
                                <form onSubmit={handleSubmit} className="space-y-10 pb-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div className="md:col-span-2 space-y-3">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Identity Title</label>
                                            <input required value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-2xl p-6 text-white font-bold focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500/30 transition-all placeholder:text-slate-600" placeholder="e.g. Masterclass in Quantum Engineering" />
                                        </div>

                                        <div className="md:col-span-2 space-y-3">
                                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Asset Identity (Card Background)</label>
                                            <div className="relative group">
                                                <div className="w-full h-40 bg-white/5 border-2 border-dashed border-white/10 rounded-[2.5rem] flex flex-col items-center justify-center gap-4 group-hover:border-blue-400 transition-all overflow-hidden relative">
                                                    {imagePreview ? (
                                                        <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                                                    ) : formData.thumbnailUrl ? (
                                                        <img src={resolveImageUrl(formData.thumbnailUrl)} alt="Current" className="w-full h-full object-cover" />
                                                    ) : (
                                                        <>
                                                            <ImageIcon size={40} className="text-slate-500 group-hover:text-blue-400 transition-colors" strokeWidth={1.5} />
                                                            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Inject Visual Asset</span>
                                                        </>
                                                    )}
                                                    <input type="file" accept="image/*" onChange={handleImageChange} className="absolute inset-0 opacity-0 cursor-pointer" />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="md:col-span-2 space-y-3">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Curriculum Synopsys</label>
                                            <textarea required rows={4} value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-[2rem] p-6 text-slate-300 font-medium focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500/30 transition-all placeholder:text-slate-600 resize-none leading-relaxed" placeholder="Detailed syllabus or overview..." />
                                        </div>

                                        <div className="md:col-span-2 space-y-3">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Learning Nodes (One per line)</label>
                                            <textarea rows={5} value={formData.modules} onChange={e => setFormData({ ...formData, modules: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-[2.5rem] p-8 text-slate-300 font-medium focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500/30 transition-all placeholder:text-slate-600 resize-none leading-relaxed" placeholder="Module 1: Introduction&#10;Module 2: Advanced Concepts" />
                                        </div>

                                        <div className="space-y-3">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Lead Instructor</label>
                                            <div className="relative group">
                                                <Users size={18} className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-400 transition-colors" />
                                                <input value={formData.instructor} onChange={e => setFormData({ ...formData, instructor: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-2xl p-6 pl-14 text-white font-bold focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500/30 transition-all placeholder:text-slate-600" placeholder="Lead Instructor Name" />
                                            </div>
                                        </div>

                                        <div className="space-y-3">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Program Domain</label>
                                            <div className="relative group">
                                                <BarChart size={18} className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-400 transition-colors" />
                                                <input required value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-2xl p-6 pl-14 text-white font-bold focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500/30 transition-all placeholder:text-slate-600" placeholder="e.g. Technology" />
                                            </div>
                                        </div>

                                        <div className="space-y-3">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Aptitude Level</label>
                                            <div className="relative group">
                                                <select required value={formData.level} onChange={e => setFormData({ ...formData, level: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-2xl p-6 pl-8 text-white font-bold focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500/30 transition-all appearance-none cursor-pointer">
                                                    <option value="Beginner" className="bg-slate-900">Beginner Tier</option>
                                                    <option value="Intermediate" className="bg-slate-900">Intermediate Tier</option>
                                                    <option value="Advanced" className="bg-slate-900">Elite Tier</option>
                                                </select>
                                                <ChevronDown size={18} className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none group-focus-within:text-blue-400" />
                                            </div>
                                        </div>

                                        <div className="space-y-3">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Temporal Duration</label>
                                            <div className="relative group">
                                                <Clock size={18} className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-400 transition-colors" />
                                                <input required value={formData.duration} onChange={e => setFormData({ ...formData, duration: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-2xl p-6 pl-14 text-white font-bold focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500/30 transition-all placeholder:text-slate-600" placeholder="e.g. 12 Weeks" />
                                            </div>
                                        </div>

                                        <div className="space-y-3">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Economic Value (₹)</label>
                                            <div className="relative group">
                                                <DollarSign size={18} className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-400 transition-colors" />
                                                <input type="number" required value={formData.price} onChange={e => setFormData({ ...formData, price: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-2xl p-6 pl-14 text-white font-bold focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500/30 transition-all placeholder:text-slate-600" placeholder="0.00" />
                                            </div>
                                        </div>

                                        <div className="space-y-3">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Strike Price (Ref)</label>
                                            <div className="relative group">
                                                <X size={18} className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-400 transition-colors" />
                                                <input type="number" value={formData.oldPrice} onChange={e => setFormData({ ...formData, oldPrice: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-2xl p-6 pl-14 text-white font-bold focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500/30 transition-all placeholder:text-slate-600" placeholder="Original price..." />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex gap-4 pt-10 border-t border-white/5 -mx-10 px-10 -mb-10 bg-white/5 mt-10">
                                        <button type="button" onClick={closeModal} className="flex-1 py-4.5 rounded-2xl bg-white/5 text-slate-400 font-bold text-[10px] uppercase tracking-widest hover:text-white hover:bg-white/10 border border-white/10 transition-all">
                                            Abort Operation
                                        </button>
                                        <button type="submit" disabled={submitting} className="flex-2 py-4.5 rounded-2xl bg-blue-600 text-white font-bold text-xs uppercase tracking-widest hover:bg-blue-500 shadow-lg shadow-blue-600/20 transition-all flex items-center justify-center gap-2">
                                            {submitting ? <Loader2 size={16} className="animate-spin" /> : <Check size={16} />}
                                            {editingCourse ? "Update Module" : "Confirm Manifestation"}
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

export default CourseManagement;
