import React, { useEffect, useState } from "react";
import { apiClient as api } from "../../utils/apiClient";
import { Plus, Edit2, Trash2, BookOpen, Search, X, Check, DollarSign, Clock, BarChart, Image as ImageIcon, Loader2, ChevronDown, Users, Tag, Percent, Calendar, Save, UserX, CheckCircle, XCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "../../context/ToastContext";
import { resolveImageUrl } from "../../utils/imageUtils";

const COURSE_FALLBACK_IMAGE = "/images/learning4.jpg";

const CourseManagement = () => {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCourse, setEditingCourse] = useState(null);
    const [viewingRoster, setViewingRoster] = useState(null);
    const [courseEnrollments, setCourseEnrollments] = useState([]);
    const [loadingRoster, setLoadingRoster] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [submitting, setSubmitting] = useState(false);
    
    // Discount Feature State
    const [isDiscountModalOpen, setIsDiscountModalOpen] = useState(false);
    const [discountData, setDiscountData] = useState({
        isActive: false,
        discountPercentage: 0,
        endDate: "",
        title: "Limited Time Offer"
    });
    const [discountLoading, setDiscountLoading] = useState(false);
    
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

    const fetchCourses = async (silent = false) => {
        try {
            const { data } = await api.get("/courses");
            setCourses(data);
        } catch (err) {
            if (!silent) toast.error("Failed to load courses");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCourses(false);

        // Auto-refresh every 15 seconds
        const interval = setInterval(() => {
            fetchCourses(true);
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

    const handleOpenDiscountModal = async () => {
        setIsDiscountModalOpen(true);
        try {
            const { data } = await api.get('/settings');
            if (data?.promo) {
                setDiscountData({
                   isActive: data.promo.isActive || false,
                   discountPercentage: data.promo.discountPercentage || 0,
                   endDate: data.promo.endDate ? data.promo.endDate.split('T')[0] : "",
                   title: data.promo.title || "Limited Time Offer"
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
            await api.put('/settings', { promo: discountData });
            toast.success("Universal discount updated successfully!");
            setIsDiscountModalOpen(false);
            fetchCourses(); // refresh prices
        } catch(error) {
            toast.error("Failed to update discount");
        } finally {
            setDiscountLoading(false);
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

    const handleViewRoster = async (course) => {
        setViewingRoster(course);
        setLoadingRoster(true);
        try {
            // Fetch all enrollments and filter for this course
            const { data } = await api.get("/enrollments");
            const roster = (data || []).filter(e => e.course?._id === course._id);
            setCourseEnrollments(roster);
        } catch (err) {
            toast.error("Failed to load course roster");
            setCourseEnrollments([]);
        } finally {
            setLoadingRoster(false);
        }
    };

    const handleUpdateEnrollmentStatus = async (enrollmentId, newStatus) => {
        try {
            const { data } = await api.put(`/enrollments/${enrollmentId}`, { status: newStatus });
            if (data?.success) {
                toast.success(`Enrollment marked as ${newStatus}`);
                setCourseEnrollments(prev => 
                    prev.map(enr => enr._id === enrollmentId ? { ...enr, status: newStatus } : enr)
                );
            }
        } catch (error) {
            toast.error("Failed to update status");
        }
    };

    const handleKickUser = async (enrollmentId) => {
        if (!window.confirm("Are you sure you want to kick this user? This removes their enrollment completely.")) return;
        try {
            const { data } = await api.delete(`/enrollments/${enrollmentId}`);
            if (data?.success) {
                toast.success("User permanently removed from course");
                setCourseEnrollments(prev => prev.filter(enr => enr._id !== enrollmentId));
            }
        } catch (error) {
            toast.error("Failed to kick user");
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
        setImagePreview(resolveImageUrl(course.thumbnailUrl, COURSE_FALLBACK_IMAGE));
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
            <div className="bg-[#0b1120]/40 backdrop-blur-xl p-6 rounded-3xl border border-white/5 shadow-2xl relative overflow-hidden group">
                <div className="flex flex-col lg:flex-row gap-6 lg:items-center lg:justify-between relative z-10">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <BookOpen size={24} className="text-blue-400" />
                            <h2 className="text-2xl font-black text-white tracking-tighter uppercase uppercase">Curriculum Hub</h2>
                            <span className="ml-2 text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded-lg border border-blue-500/20 text-[10px] font-bold">
                                {courses.length} Node Entities
                            </span>
                        </div>
                        <p className="text-slate-400 font-medium text-xs">Educational programs and certification roadmap management.</p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
                        <div className="bg-[#1e293b] border border-white/10 rounded-xl flex items-center w-full lg:w-auto group focus-within:border-blue-500/50 focus-within:ring-4 focus-within:ring-blue-500/10 transition-all">
                            <Search className="text-slate-400 ml-4 group-focus-within:text-blue-400 transition-colors shrink-0" size={14} />
                            <input
                                type="text"
                                placeholder="Filter curriculum..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="bg-transparent text-white placeholder:text-slate-400 focus:outline-none py-2.5 px-4 w-full lg:w-48 font-bold text-xs tracking-tight"
                            />
                        </div>
                        <button
                            onClick={handleOpenDiscountModal}
                            className="bg-emerald-600/20 text-emerald-400 hover:bg-emerald-500/30 border border-emerald-500/30 px-5 py-2.5 rounded-xl font-bold flex items-center justify-center gap-2 transition-all active:scale-95 text-[10px] uppercase tracking-widest whitespace-nowrap"
                        >
                            <Tag size={14} />
                            <span>Global Discount</span>
                        </button>
                        <button
                            onClick={() => { setEditingCourse(null); setFormData(initialFormState); setIsModalOpen(true); setImagePreview(null); }}
                            className="bg-blue-600 text-white hover:bg-blue-500 px-6 py-2.5 rounded-xl font-bold shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2 transition-all active:scale-95 text-[10px] uppercase tracking-widest whitespace-nowrap"
                        >
                            <Plus size={14} />
                            <span>New Course</span>
                        </button>
                    </div>
                </div>
            </div>

            {loading ? (
                <div className="p-8 space-y-4">
                    {[1, 2, 3, 4].map(i => (
                        <div key={i} className="h-16 bg-[#1e293b] border border-white/10 rounded-xl animate-pulse" />
                    ))}
                </div>
            ) : filteredCourses.length === 0 ? (
                <div className="bg-[#0b1120]/40 backdrop-blur-xl border border-white/5 rounded-[2.5rem] p-32 text-center group shadow-2xl">
                    <div className="w-24 h-24 bg-blue-500/10 rounded-[2rem] flex items-center justify-center mx-auto mb-6 border border-blue-500/10 text-blue-400 shadow-sm">
                        <BookOpen size={48} />
                    </div>
                    <h3 className="text-2xl font-black text-white mb-3 tracking-tight">No Courses Protocol</h3>
                    <p className="text-slate-400 mb-10 max-w-sm mx-auto font-medium text-xs leading-relaxed">The curriculum registry is currently offline. Manual deployment required.</p>
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="bg-blue-600 text-white px-10 py-4 rounded-xl font-semibold flex items-center gap-3 justify-center hover:bg-blue-700 transition-all shadow-md shadow-blue-600/10 active:scale-95 mx-auto"
                    >
                        <Plus size={20} />
                        Initialize Curriculum
                    </button>
                </div>
            ) : (
                <div className="bg-[#0b1120]/40 backdrop-blur-xl border border-white/5 rounded-3xl overflow-hidden shadow-2xl animate-in slide-in-from-bottom-4 duration-700">
                    <div className="overflow-x-auto custom-scrollbar">
                        <table className="w-full text-left border-collapse min-w-[800px]">
                            <thead>
                                <tr className="bg-[#1e293b] border-b border-white/10">
                                    <th className="px-8 py-4 text-[9px] font-bold uppercase tracking-[0.2em] text-slate-400">Course Entity</th>
                                    <th className="px-8 py-4 text-[9px] font-bold uppercase tracking-[0.2em] text-slate-400">Valuation & Data</th>
                                    <th className="px-8 py-4 text-[9px] font-bold uppercase tracking-[0.2em] text-slate-400">Resource Links</th>
                                    <th className="px-8 py-4 text-[9px] font-bold uppercase tracking-[0.2em] text-slate-400 text-right">Actions</th>
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
                                            className="hover:bg-[#1e293b] transition-colors group"
                                        >
                                            <td className="px-8 py-4">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-12 h-12 rounded-xl bg-[#1e293b] border border-white/10 flex items-center justify-center overflow-hidden shrink-0 shadow-sm group-hover:border-blue-500/50 transition-all">
                                                        <img
                                                            src={resolveImageUrl(course.thumbnailUrl, COURSE_FALLBACK_IMAGE)}
                                                            alt={course.title}
                                                            className="w-full h-full object-cover transition-transform group-hover:scale-110"
                                                            onError={(e) => {
                                                                e.currentTarget.src = COURSE_FALLBACK_IMAGE;
                                                            }}
                                                        />
                                                    </div>
                                                    <div>
                                                        <div className="font-bold text-white text-[14px] tracking-tight">{course.title}</div>
                                                        <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-1 flex items-center gap-2">
                                                            {course.category} • {course.level}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-8 py-4">
                                                <div className="flex flex-col gap-1">
                                                    <div className="text-white font-bold text-xs flex items-center gap-2">
                                                        <DollarSign size={12} className="text-blue-400" />
                                                        ₹{course.price}
                                                        {course.discount > 0 && <span className="text-[10px] text-rose-400 ml-1">-{course.discount}%</span>}
                                                    </div>
                                                    <div className="text-slate-400 text-[9px] uppercase font-black tracking-widest flex items-center gap-2">
                                                        <Clock size={10} />
                                                        {course.duration}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-8 py-4">
                                                <div className="flex gap-2">
                                                    {course.syllabusUrl && (
                                                        <span className="px-2 py-0.5 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20 text-[8px] font-black uppercase tracking-widest">Syllabus</span>
                                                    )}
                                                    {course.brochureUrl && (
                                                        <span className="px-2 py-0.5 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20 text-[8px] font-black uppercase tracking-widest">Brochure</span>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-8 py-4 text-right">
                                                <div className="flex justify-end gap-2.5">
                                                    <button
                                                        onClick={() => openEditModal(course)}
                                                        className="p-2.5 rounded-xl bg-[#1e293b] text-slate-400 hover:text-blue-400 hover:bg-blue-500/10 border border-white/10 hover:border-blue-500/20 transition-all active:scale-95"
                                                    >
                                                        <Edit2 size={14} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(course._id)}
                                                        className="p-2.5 rounded-xl bg-[#1e293b] text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 border border-white/10 hover:border-rose-500/20 transition-all active:scale-95"
                                                        title="Delete Course"
                                                    >
                                                        <Trash2 size={14} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleViewRoster(course)}
                                                        className="p-2.5 rounded-xl bg-[#1e293b] text-slate-400 hover:text-emerald-400 hover:bg-emerald-500/10 border border-white/10 hover:border-emerald-500/20 transition-all active:scale-95"
                                                        title="View Enrolled Students"
                                                    >
                                                        <Users size={14} />
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
                            className="relative w-full max-w-2xl bg-[#0b1120] border border-white/10 rounded-[2.5rem] p-6 sm:p-8 shadow-2xl flex flex-col max-h-[90vh] overflow-hidden"
                        >
                            <div className="flex items-start justify-between gap-6 mb-8 shrink-0">
                                <div>
                                    <h3 className="text-2xl font-black text-white tracking-tight uppercase">
                                        {editingCourse ? "Synthesize Curriculum" : "Materialize Course"}
                                    </h3>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mt-1">Classification: Educational Architect Mode</p>
                                </div>
                                <button
                                    onClick={() => setIsModalOpen(false)}
                                    className="p-3 rounded-2xl bg-[#1e293b] hover:bg-white/10 text-slate-400 hover:text-white transition-all border border-white/10"
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            <div className="flex-1 overflow-y-auto pr-4 -mr-4 custom-scrollbar">
                                <form id="course-form" onSubmit={handleSubmit} className="space-y-6 pb-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="md:col-span-2 space-y-2">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Identity Title</label>
                                            <input required value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} className="w-full bg-[#1e293b] border border-white/10 rounded-2xl p-4 text-white font-bold focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500/30 transition-all placeholder:text-slate-400 text-sm" placeholder="e.g. Masterclass in Quantum Engineering" />
                                        </div>

                                        <div className="md:col-span-2 space-y-2">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Asset Identity (Card Background)</label>
                                            <div className="relative group">
                                                <div className="w-full h-32 bg-[#1e293b] border-2 border-dashed border-white/10 rounded-3xl flex flex-col items-center justify-center gap-3 group-hover:border-blue-400 transition-all overflow-hidden relative">
                                                    {imagePreview ? (
                                                        <img
                                                            src={imagePreview}
                                                            alt="Preview"
                                                            className="w-full h-full object-cover"
                                                            onError={(e) => {
                                                                e.currentTarget.src = COURSE_FALLBACK_IMAGE;
                                                            }}
                                                        />
                                                    ) : formData.thumbnailUrl ? (
                                                        <img
                                                            src={resolveImageUrl(formData.thumbnailUrl, COURSE_FALLBACK_IMAGE)}
                                                            alt="Current"
                                                            className="w-full h-full object-cover"
                                                            onError={(e) => {
                                                                e.currentTarget.src = COURSE_FALLBACK_IMAGE;
                                                            }}
                                                        />
                                                    ) : (
                                                        <>
                                                            <ImageIcon size={32} className="text-slate-400 group-hover:text-blue-400 transition-colors" strokeWidth={1.5} />
                                                            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Inject Visual Asset</span>
                                                        </>
                                                    )}
                                                    <input type="file" accept="image/*" onChange={handleImageChange} className="absolute inset-0 opacity-0 cursor-pointer" />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="md:col-span-2 space-y-2">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Curriculum Synopsys</label>
                                            <textarea required rows={3} value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} className="w-full bg-[#1e293b] border border-white/10 rounded-2xl p-4 text-slate-300 font-medium focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500/30 transition-all placeholder:text-slate-400 resize-none leading-relaxed text-xs" placeholder="Detailed syllabus or overview..." />
                                        </div>

                                        <div className="md:col-span-2 space-y-2">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Learning Nodes (One per line)</label>
                                            <textarea rows={4} value={formData.modules} onChange={e => setFormData({ ...formData, modules: e.target.value })} className="w-full bg-[#1e293b] border border-white/10 rounded-3xl p-6 text-slate-300 font-medium focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500/30 transition-all placeholder:text-slate-400 resize-none leading-relaxed text-xs" placeholder="Module 1: Introduction&#10;Module 2: Advanced Concepts" />
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Lead Instructor</label>
                                            <div className="relative group">
                                                <Users size={16} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-400 transition-colors" />
                                                <input value={formData.instructor} onChange={e => setFormData({ ...formData, instructor: e.target.value })} className="w-full bg-[#1e293b] border border-white/10 rounded-2xl p-4 pl-12 text-white font-bold focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500/30 transition-all placeholder:text-slate-400 text-sm" placeholder="Lead Instructor Name" />
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Program Domain</label>
                                            <div className="relative group">
                                                <BarChart size={16} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-400 transition-colors" />
                                                <input required value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })} className="w-full bg-[#1e293b] border border-white/10 rounded-2xl p-4 pl-12 text-white font-bold focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500/30 transition-all placeholder:text-slate-400 text-sm" placeholder="e.g. Technology" />
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Aptitude Level</label>
                                            <div className="relative group">
                                                <select required value={formData.level} onChange={e => setFormData({ ...formData, level: e.target.value })} className="w-full bg-[#1e293b] border border-white/10 rounded-2xl p-4 pl-6 text-white font-bold focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500/30 transition-all appearance-none cursor-pointer text-sm">
                                                    <option value="Beginner" className="bg-[#1e293b]">Beginner Tier</option>
                                                    <option value="Intermediate" className="bg-[#1e293b]">Intermediate Tier</option>
                                                    <option value="Advanced" className="bg-[#1e293b]">Elite Tier</option>
                                                </select>
                                                <ChevronDown size={16} className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none group-focus-within:text-blue-400" />
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Temporal Duration</label>
                                            <div className="relative group">
                                                <Clock size={16} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-400 transition-colors" />
                                                <input required value={formData.duration} onChange={e => setFormData({ ...formData, duration: e.target.value })} className="w-full bg-[#1e293b] border border-white/10 rounded-2xl p-4 pl-12 text-white font-bold focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500/30 transition-all placeholder:text-slate-400 text-sm" placeholder="e.g. 12 Weeks" />
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Value (₹)</label>
                                            <div className="relative group">
                                                <DollarSign size={16} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-400 transition-colors" />
                                                <input type="number" required value={formData.price} onChange={e => setFormData({ ...formData, price: e.target.value })} className="w-full bg-[#1e293b] border border-white/10 rounded-2xl p-4 pl-12 text-white font-bold focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500/30 transition-all placeholder:text-slate-400 text-sm" placeholder="0.00" />
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Discount (%)</label>
                                            <div className="relative group">
                                                <X size={16} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-400 transition-colors" />
                                                <input type="number" value={formData.discount} onChange={e => setFormData({ ...formData, discount: e.target.value })} className="w-full bg-[#1e293b] border border-white/10 rounded-2xl p-4 pl-12 text-white font-bold focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500/30 transition-all placeholder:text-slate-400 text-sm" placeholder="0" />
                                            </div>
                                        </div>
                                    </div>
                                </form>
                            </div>
                            <div className="flex gap-4 pt-6 mt-6 border-t border-white/5 shrink-0">
                                <button type="button" onClick={closeModal} className="flex-1 py-3.5 rounded-2xl bg-[#1e293b] text-slate-400 font-bold text-[10px] uppercase tracking-widest hover:text-white hover:bg-white/10 border border-white/10 transition-all">
                                    Abort
                                </button>
                                <button type="submit" form="course-form" disabled={submitting} className="flex-2 py-3.5 rounded-2xl bg-blue-600 text-white font-bold text-[10px] uppercase tracking-widest hover:bg-blue-500 shadow-lg shadow-blue-600/20 transition-all flex items-center justify-center gap-2">
                                    {submitting ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />}
                                    {editingCourse ? "Update" : "Confirm"}
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Roster Modal */}
            <AnimatePresence>
                {viewingRoster && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl" onClick={() => setViewingRoster(null)}>
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 30 }}
                            onClick={e => e.stopPropagation()}
                            className="relative w-full max-w-3xl bg-[#0b1120] border border-white/10 rounded-[2.5rem] p-6 sm:p-8 shadow-2xl flex flex-col max-h-[90vh] overflow-hidden"
                        >
                            <div className="flex items-start justify-between gap-6 mb-8 shrink-0">
                                <div>
                                    <h3 className="text-2xl font-black text-white tracking-tight uppercase">
                                        Course Roster
                                    </h3>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mt-1">
                                        Enrolled Students for: <span className="text-emerald-400">{viewingRoster.title}</span>
                                    </p>
                                </div>
                                <button
                                    onClick={() => setViewingRoster(null)}
                                    className="p-3 rounded-2xl bg-[#1e293b] hover:bg-white/10 text-slate-400 hover:text-white transition-all border border-white/10"
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            <div className="flex-1 overflow-y-auto pr-4 -mr-4 custom-scrollbar">
                                {loadingRoster ? (
                                    <div className="flex flex-col items-center justify-center p-10 h-64 gap-4">
                                        <Loader2 size={32} className="text-emerald-400 animate-spin" />
                                        <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Compiling Records...</p>
                                    </div>
                                ) : courseEnrollments.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center p-10 h-64 bg-[#1e293b]/50 rounded-2xl border border-white/5">
                                        <Users size={32} className="text-slate-500 mb-4" />
                                        <h4 className="text-white font-bold mb-2">No active enrollments</h4>
                                        <p className="text-slate-400 text-xs text-center">There are currently no students registered for this curriculum node.</p>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        <div className="grid grid-cols-4 gap-4 pb-4 border-b border-white/10 px-4">
                                            <div className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] col-span-2 sm:col-span-1">Student Identity</div>
                                            <div className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] hidden sm:block">Date</div>
                                            <div className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] text-center">Status</div>
                                            <div className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] text-right">Actions</div>
                                        </div>
                                        {courseEnrollments.map((enr, i) => (
                                            <motion.div 
                                                key={enr._id}
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: i * 0.05 }}
                                                className="grid grid-cols-4 gap-4 items-center bg-[#1e293b] p-4 rounded-2xl border border-white/5 hover:border-emerald-500/30 transition-colors"
                                            >
                                                <div className="col-span-2 sm:col-span-1">
                                                    <div className="text-white font-bold text-sm tracking-tight">{enr.user?.name || "Anonymous User"}</div>
                                                    <div className="text-slate-400 text-[10px] tracking-widest uppercase mt-0.5 max-w-full truncate">{enr.user?.email}</div>
                                                </div>
                                                <div className="text-slate-300 text-xs font-medium hidden sm:block">
                                                    {new Date(enr.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                                                </div>
                                                <div className="text-center">
                                                    <span className={`inline-block px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border ${enr.status === 'completed' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : enr.status === 'cancelled' ? 'bg-rose-500/10 text-rose-400 border-rose-500/20' : 'bg-blue-500/10 text-blue-400 border-blue-500/20'}`}>
                                                        {enr.status || 'Active'}
                                                    </span>
                                                </div>
                                                <div className="flex items-center justify-end gap-2">
                                                    {/* Approve (completed) */}
                                                    {enr.status !== 'completed' && (
                                                        <button 
                                                            title="Complete / Approve"
                                                            onClick={() => handleUpdateEnrollmentStatus(enr._id, 'completed')}
                                                            className="p-2 bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500 hover:text-white rounded-lg transition-colors border border-emerald-500/20"
                                                        >
                                                            <CheckCircle size={14} />
                                                        </button>
                                                    )}
                                                    {/* Reject (cancelled) */}
                                                    {enr.status !== 'cancelled' && (
                                                        <button 
                                                            title="Cancel / Reject"
                                                            onClick={() => handleUpdateEnrollmentStatus(enr._id, 'cancelled')}
                                                            className="p-2 bg-amber-500/10 text-amber-500 hover:bg-amber-500 hover:text-white rounded-lg transition-colors border border-amber-500/20"
                                                        >
                                                            <XCircle size={14} />
                                                        </button>
                                                    )}
                                                    {/* Kick (Delete) */}
                                                    <button 
                                                        title="Kick User (Delete Enrollment)"
                                                        onClick={() => handleKickUser(enr._id)}
                                                        className="p-2 bg-rose-500/10 text-rose-500 hover:bg-rose-500 hover:text-white rounded-lg transition-colors border border-rose-500/20"
                                                    >
                                                        <UserX size={14} />
                                                    </button>
                                                </div>
                                            </motion.div>
                                        ))}
                                    </div>
                                )}
                            </div>
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

                                <div className="pt-4 flex justify-end gap-3">
                                    <button
                                        type="button"
                                        onClick={() => !discountLoading && setIsDiscountModalOpen(false)}
                                        className="px-6 py-3 rounded-xl bg-[#1e293b] text-slate-400 font-bold text-xs uppercase tracking-widest hover:bg-white/10 transition-all"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={discountLoading}
                                        className="px-6 py-3 rounded-xl bg-emerald-600 text-white font-bold text-xs uppercase tracking-widest hover:bg-emerald-500 shadow-lg shadow-emerald-500/20 transition-all flex justify-center items-center gap-2 min-w-[140px]"
                                    >
                                        {discountLoading ? <Loader2 size={16} className="animate-spin" /> : <><Save size={16} /><span>Apply Change</span></>}
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

export default CourseManagement;
