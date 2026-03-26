import React, { useEffect, useRef, useState } from "react";
import { apiClient as api } from "../../utils/apiClient";
import { Award, Search, X, RotateCcw, Users, BookOpen, Trash2, CheckCircle, ShieldCheck, Eye, Download, Upload, FileText } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { QRCodeSVG } from "qrcode.react";
import html2canvas from "html2canvas";
import { useToast } from "../../context/ToastContext";
import { resolveImageUrl } from "../../utils/imageUtils";

const DEFAULT_FIELD_LAYOUT = {
    studentName: { enabled: true, x: 50, y: 36 },
    programName: { enabled: true, x: 50, y: 50 },
    issueDate: { enabled: true, x: 18, y: 78 },
    completionDate: { enabled: false, x: 38, y: 78 },
    grade: { enabled: false, x: 58, y: 78 },
    certificateId: { enabled: true, x: 50, y: 88 },
    qrCode: { enabled: true, x: 84, y: 78, size: 18 }
};

const FIELD_LABELS = {
    studentName: "Name",
    programName: "Program",
    issueDate: "Issue Date",
    completionDate: "Completion Date",
    grade: "Grade",
    certificateId: "Certificate ID",
    qrCode: "QR"
};

const CertificateManagement = () => {
    const [certificates, setCertificates] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState("issue");
    const [searchTerm, setSearchTerm] = useState("");
    const [viewingCert, setViewingCert] = useState(null);

    const [users, setUsers] = useState([]);
    const [courses, setCourses] = useState([]);
    const [internships, setInternships] = useState([]);
    const [formData, setFormData] = useState({
        userId: "",
        courseId: "",
        internshipId: "",
        type: "Course",
        customName: "",
        customProgramName: "",
        grade: "",
        completionDate: "",
        template: { url: "", fileName: "", mimeType: "" },
        fieldLayout: DEFAULT_FIELD_LAYOUT
    });
    const [uploadingTemplate, setUploadingTemplate] = useState(false);
    const [savingTemplateDefaults, setSavingTemplateDefaults] = useState(false);
    const [defaultTemplate, setDefaultTemplate] = useState({
        template: { url: "", fileName: "", mimeType: "" },
        fieldLayout: DEFAULT_FIELD_LAYOUT
    });
    const [dragField, setDragField] = useState(null);
    const templateCanvasRef = useRef(null);

    const toast = useToast();

    const fetchData = async () => {
        try {
            const [certRes, userRes, courseRes, internshipRes, settingsRes] = await Promise.all([
                api.get("/certificates"),
                api.get("/users"),
                api.get("/courses"),
                api.get("/internships"),
                api.get("/settings")
            ]);
            setCertificates(certRes.data || []);
            setUsers(userRes.data?.filter(u => u.role !== 'admin') || []);
            setCourses(courseRes.data || []);
            setInternships(internshipRes.data || []);

            const settingsTemplate = settingsRes.data?.certificateTemplate;
            if (settingsTemplate) {
                const mergedFieldLayout = {
                    ...DEFAULT_FIELD_LAYOUT,
                    ...(settingsTemplate.fieldLayout || {})
                };
                setDefaultTemplate({
                    template: {
                        url: settingsTemplate.template?.url || "",
                        fileName: settingsTemplate.template?.fileName || "",
                        mimeType: settingsTemplate.template?.mimeType || ""
                    },
                    fieldLayout: mergedFieldLayout
                });
            }
        } catch (err) {
            console.error("Certificate fetch error", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
        const interval = setInterval(fetchData, 15000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        if (!formData.userId) return;
        const selected = users.find((u) => u._id === formData.userId);
        if (!selected) return;
        if (!formData.customName) {
            setFormData((prev) => ({
                ...prev,
                customName: selected.name || selected.email || prev.customName
            }));
        }
    }, [formData.userId, users]);

    const openIssueModal = () => {
        setModalMode("issue");
        setFormData({
            userId: "",
            courseId: "",
            internshipId: "",
            type: "Course",
            customName: "",
            customProgramName: "",
            grade: "",
            completionDate: "",
            template: { ...defaultTemplate.template },
            fieldLayout: { ...defaultTemplate.fieldLayout }
        });
        setIsModalOpen(true);
    };

    const openTemplateModal = () => {
        setModalMode("template");
        setFormData((prev) => ({
            ...prev,
            template: { ...defaultTemplate.template },
            fieldLayout: { ...defaultTemplate.fieldLayout }
        }));
        setIsModalOpen(true);
    };

    const applyDefaultTemplateToForm = () => {
        setFormData((prev) => ({
            ...prev,
            template: { ...defaultTemplate.template },
            fieldLayout: { ...defaultTemplate.fieldLayout }
        }));
        toast.success("Default template applied");
    };

    const handleGenerate = async (e) => {
        e.preventDefault();
        try {
            await api.post("/certificates/generate", {
                userId: formData.userId || undefined,
                courseId: formData.type === "Course" ? (formData.courseId || undefined) : undefined,
                internshipId: formData.type === "Internship" ? (formData.internshipId || undefined) : undefined,
                type: formData.type,
                customName: formData.customName,
                customProgramName: formData.customProgramName,
                grade: formData.grade || undefined,
                completionDate: formData.completionDate || undefined,
                template: formData.template,
                fieldLayout: formData.fieldLayout
            });
            await saveTemplateDefaults({ showToast: false });
            toast.success("Credential generated successfully");
            setIsModalOpen(false);
            setFormData({
                userId: "",
                courseId: "",
                internshipId: "",
                type: "Course",
                customName: "",
                customProgramName: "",
                grade: "",
                completionDate: "",
                template: { ...formData.template },
                fieldLayout: { ...formData.fieldLayout }
            });
            fetchData();
        } catch (err) {
            toast.error(err.response?.data?.message || "Generation failed");
        }
    };

    const handleTemplateUpload = async (file) => {
        if (!file) return;
        setUploadingTemplate(true);
        try {
            const body = new FormData();
            body.append("file", file);
            const { data } = await api.post("/upload/template", body, {
                headers: { "Content-Type": "multipart/form-data" }
            });
            setFormData((prev) => ({
                ...prev,
                template: {
                    url: data.fileUrl || "",
                    fileName: data.fileName || file.name,
                    mimeType: data.mimeType || file.type
                }
            }));
            toast.success("Template uploaded");
        } catch (err) {
            toast.error(err.response?.data?.message || "Template upload failed");
        } finally {
            setUploadingTemplate(false);
        }
    };

    const saveTemplateDefaults = async ({ showToast = true } = {}) => {
        if (!formData.template?.url) {
            if (showToast) toast.error("Upload a template before saving defaults");
            return;
        }

        setSavingTemplateDefaults(true);
        try {
            await api.put("/settings", {
                certificateTemplate: {
                    template: formData.template,
                    fieldLayout: formData.fieldLayout
                }
            });
            setDefaultTemplate({
                template: { ...formData.template },
                fieldLayout: { ...formData.fieldLayout }
            });
            if (showToast) toast.success("Template saved for future certificates");
        } catch (err) {
            if (showToast) toast.error(err.response?.data?.message || "Failed to save template defaults");
        } finally {
            setSavingTemplateDefaults(false);
        }
    };

    const setLayoutValue = (key, prop, value) => {
        setFormData((prev) => ({
            ...prev,
            fieldLayout: {
                ...prev.fieldLayout,
                [key]: {
                    ...prev.fieldLayout[key],
                    [prop]: value
                }
            }
        }));
    };

    const updateFieldPosition = (fieldKey, clientX, clientY) => {
        const canvas = templateCanvasRef.current;
        if (!canvas) return;
        const rect = canvas.getBoundingClientRect();
        const rawX = ((clientX - rect.left) / rect.width) * 100;
        const rawY = ((clientY - rect.top) / rect.height) * 100;
        const x = Math.max(2, Math.min(98, Number(rawX.toFixed(2))));
        const y = Math.max(2, Math.min(98, Number(rawY.toFixed(2))));
        setLayoutValue(fieldKey, "x", x);
        setLayoutValue(fieldKey, "y", y);
    };

    const startDraggingField = (fieldKey, event) => {
        event.preventDefault();
        setDragField(fieldKey);
        updateFieldPosition(fieldKey, event.clientX, event.clientY);
    };

    useEffect(() => {
        if (!dragField) return undefined;

        const handleMove = (event) => {
            updateFieldPosition(dragField, event.clientX, event.clientY);
        };
        const stopDragging = () => setDragField(null);

        window.addEventListener("mousemove", handleMove);
        window.addEventListener("mouseup", stopDragging, { once: true });

        return () => {
            window.removeEventListener("mousemove", handleMove);
            window.removeEventListener("mouseup", stopDragging);
        };
    }, [dragField]);

    const handleRevoke = async (id) => {
        if (!window.confirm("Rescind this digital credential?")) return;
        try {
            await api.put(`/certificates/${id}/revoke`);
            toast.success("Credential revoked");
            setCertificates(certificates.map(c => c._id === id ? { ...c, status: 'Revoked' } : c));
        } catch {
            toast.error("Revocation failed");
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Purge certificate record?")) return;
        try {
            await api.delete(`/certificates/${id}`);
            toast.success("Registry entry removed");
            setCertificates((prev) => prev.filter((c) => c._id !== id));
        } catch (err) {
            toast.error("Deletion failed");
        }
    };

    const filteredCerts = certificates.filter(c =>
        c.studentName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.courseName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.certificateId?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleDownloadCert = async () => {
        const certElement = document.getElementById('certificate-node');
        if (!certElement) return;
        
        try {
            const canvas = await html2canvas(certElement, {
                scale: 2,
                backgroundColor: '#0b1120',
                logging: false
            });
            const image = canvas.toDataURL("image/png");
            const link = document.createElement('a');
            link.href = image;
            link.download = `MentriQ_Certificate_${viewingCert?.certificateId}.png`;
            link.click();
            toast.success("Certificate downloaded successfully!");
        } catch (err) {
            toast.error("Failed to download certificate image.");
        }
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* Page Header */}
            <div className="bg-[#0b1120]/40 backdrop-blur-xl p-8 rounded-3xl border border-white/5 shadow-2xl relative overflow-hidden group">
                <div className="flex flex-col lg:flex-row gap-8 lg:items-center lg:justify-between relative z-10">
                    <div>
                        <div className="flex items-center gap-3 mb-1">
                            <ShieldCheck size={28} className="text-emerald-400" />
                            <h2 className="text-3xl font-extrabold text-white tracking-tight">Credential Registry</h2>
                            <span className="ml-2 text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-lg border border-emerald-500/20 text-xs font-bold">
                                {certificates.length} Issued Tokens
                            </span>
                        </div>
                        <p className="text-slate-400 font-medium text-sm">Automated certification and academic credential management.</p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
                        <div className="bg-[#1e293b] border border-white/10 rounded-xl pr-6 flex items-center w-full lg:w-auto group focus-within:border-emerald-500/50 focus-within:ring-4 focus-within:ring-emerald-500/10 transition-all">
                            <Search className="text-slate-400 ml-4 group-focus-within:text-emerald-400 transition-colors" size={18} />
                            <input
                                type="text"
                                placeholder="Verify certificate ID..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="bg-transparent text-white placeholder:text-slate-400 focus:outline-none py-4 px-4 w-full lg:w-64 font-bold text-sm tracking-tight"
                            />
                        </div>
                        <button
                            onClick={openTemplateModal}
                            className="bg-[#1e293b] text-cyan-300 hover:bg-[#243449] px-8 py-4 rounded-xl font-bold flex items-center gap-3 transition-all active:scale-95 border border-cyan-500/30 text-[10px] uppercase tracking-widest justify-center"
                        >
                            <FileText size={18} />
                            <span>Template Setup</span>
                        </button>
                        <button
                            onClick={openIssueModal}
                            className="bg-emerald-600 text-white hover:bg-emerald-500 px-8 py-4 rounded-xl font-bold flex items-center gap-3 transition-all active:scale-95 shadow-lg shadow-emerald-500/20 text-[10px] uppercase tracking-widest justify-center"
                        >
                            <Award size={18} />
                            <span>Issue Credential</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Certificates Table */}
            <div className="bg-[#0b1120]/40 backdrop-blur-xl border border-white/5 rounded-[2.5rem] overflow-hidden shadow-2xl">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-[#1e293b] border-b border-white/10">
                                <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">Recipient Identity</th>
                                <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">Academic Domain</th>
                                <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">Credential Status</th>
                                <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 text-right">Registry Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {filteredCerts.map((cert) => (
                                <motion.tr
                                    key={cert._id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="hover:bg-[#1e293b] transition-colors group"
                                >
                                    <td className="px-8 py-6">
                                        <div className="flex flex-col gap-1">
                                            <div className="font-bold text-white text-sm tracking-tight">{cert.studentName}</div>
                                            <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest flex items-center gap-1.5">
                                                <Users size={12} className="text-emerald-400" />
                                                ID: {cert.certificateId}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex flex-col gap-1">
                                            <div className="font-bold text-white text-xs uppercase tracking-wider">{cert.courseName}</div>
                                            <div className="text-emerald-400 text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                                                <BookOpen size={12} />
                                                Grade: {cert.grade || 'N/A'}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <span className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest border ${cert.status === 'Revoked' ? 'bg-rose-500/10 text-rose-400 border-rose-500/20' : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'}`}>
                                            {cert.status || 'Active'}
                                        </span>
                                    </td>
                                    <td className="px-8 py-6 text-right">
                                        <div className="flex justify-end gap-3">
                                            {cert.status !== 'Revoked' && (
                                                <button
                                                    onClick={() => handleRevoke(cert._id)}
                                                    className="p-3 rounded-xl bg-[#1e293b] text-slate-400 hover:text-amber-400 hover:bg-amber-500/10 border border-white/10 hover:border-amber-500/20 transition-all"
                                                    title="Revoke Credential"
                                                >
                                                    <RotateCcw size={16} />
                                                </button>
                                            )}
                                            <button
                                                onClick={() => handleDelete(cert._id)}
                                                className="p-3 rounded-xl bg-[#1e293b] text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 border border-white/10 hover:border-rose-500/20 transition-all"
                                                title="Delete Record"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                            <button
                                                onClick={() => setViewingCert(cert)}
                                                className="p-3 rounded-xl bg-[#1e293b] text-slate-400 hover:text-blue-400 hover:bg-blue-500/10 border border-white/10 hover:border-blue-500/20 transition-all"
                                                title="View & Download Certificate"
                                            >
                                                <Eye size={16} />
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
                            className="relative w-full max-w-xl max-h-[92vh] bg-[#0b1120] border border-white/10 rounded-[3rem] p-10 shadow-2xl flex flex-col overflow-hidden"
                        >
                            <div className="flex items-start justify-between gap-6 mb-10 shrink-0">
                                <div>
                                    <h3 className="text-3xl font-black text-white tracking-tight uppercase">
                                        {modalMode === "template" ? "Template Studio" : "Credential Generation"}
                                    </h3>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mt-1">
                                        {modalMode === "template" ? "Configure Reusable Certificate Layout" : "Issue Digital Academic Token"}
                                    </p>
                                </div>
                                <button
                                    onClick={() => setIsModalOpen(false)}
                                    className="p-3.5 rounded-2xl bg-[#1e293b] hover:bg-white/10 text-slate-400 hover:text-white transition-all border border-white/10"
                                >
                                    <X size={24} />
                                </button>
                            </div>

                            <form
                                id="certificate-form"
                                onSubmit={modalMode === "issue" ? handleGenerate : (e) => e.preventDefault()}
                                className="flex-1 min-h-0 space-y-8 overflow-y-auto pr-4 -mr-4 custom-scrollbar"
                            >
                                {modalMode === "issue" && (
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Recipient Name (Mandatory)</label>
                                    <input
                                        required
                                        value={formData.customName}
                                        onChange={e => setFormData({ ...formData, customName: e.target.value })}
                                        className="w-full bg-[#1e293b] border border-white/10 rounded-2xl p-6 text-white font-bold focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500/30 transition-all placeholder:text-slate-400"
                                        placeholder="Enter recipient full name"
                                    />
                                </div>
                                )}

                                {modalMode === "issue" && (
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Linked User (Optional)</label>
                                    <select
                                        value={formData.userId}
                                        onChange={e => setFormData({ ...formData, userId: e.target.value })}
                                        className="w-full bg-[#1e293b] border border-white/10 rounded-2xl p-6 text-white font-bold focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500/30 transition-all appearance-none cursor-pointer"
                                    >
                                        <option value="" className="bg-[#1e293b]">No linked user</option>
                                        {users.map(u => (
                                            <option key={u._id} value={u._id} className="bg-[#1e293b]">{u.name || u.email}</option>
                                        ))}
                                    </select>
                                </div>
                                )}

                                {modalMode === "issue" && (
                                <div className="space-y-4">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Credential Type (Optional)</label>
                                    <div className="flex gap-4">
                                        <label className={`flex-1 flex items-center justify-center p-4 rounded-xl border cursor-pointer font-bold text-sm transition-all ${formData.type === 'Course' ? 'bg-emerald-500/10 border-emerald-500/50 text-emerald-400' : 'bg-[#1e293b] border-white/10 text-slate-400 opacity-60 hover:opacity-100'}`}>
                                            <input type="radio" name="type" className="hidden" value="Course" checked={formData.type === 'Course'} onChange={() => setFormData({ ...formData, type: 'Course', internshipId: '' })} />
                                            Course
                                        </label>
                                        <label className={`flex-1 flex items-center justify-center p-4 rounded-xl border cursor-pointer font-bold text-sm transition-all ${formData.type === 'Internship' ? 'bg-emerald-500/10 border-emerald-500/50 text-emerald-400' : 'bg-[#1e293b] border-white/10 text-slate-400 opacity-60 hover:opacity-100'}`}>
                                            <input type="radio" name="type" className="hidden" value="Internship" checked={formData.type === 'Internship'} onChange={() => setFormData({ ...formData, type: 'Internship', courseId: '' })} />
                                            Internship
                                        </label>
                                    </div>
                                </div>
                                )}

                                {modalMode === "issue" && (
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Program Name (Optional)</label>
                                    <input
                                        value={formData.customProgramName}
                                        onChange={e => setFormData({ ...formData, customProgramName: e.target.value })}
                                        className="w-full bg-[#1e293b] border border-white/10 rounded-2xl p-6 text-white font-bold focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500/30 transition-all placeholder:text-slate-400"
                                        placeholder="Course/Internship display name"
                                    />
                                </div>
                                )}

                                {modalMode === "issue" && (formData.type === 'Course' ? (
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Linked Course (Optional)</label>
                                        <select
                                            value={formData.courseId}
                                            onChange={e => setFormData({ ...formData, courseId: e.target.value })}
                                            className="w-full bg-[#1e293b] border border-white/10 rounded-2xl p-6 text-white font-bold focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500/30 transition-all appearance-none cursor-pointer"
                                        >
                                            <option value="" className="bg-[#1e293b]">No linked course</option>
                                            {courses.map(c => (
                                                <option key={c._id} value={c._id} className="bg-[#1e293b]">{c.title}</option>
                                            ))}
                                        </select>
                                    </div>
                                ) : (
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Linked Internship (Optional)</label>
                                        <select
                                            value={formData.internshipId}
                                            onChange={e => setFormData({ ...formData, internshipId: e.target.value })}
                                            className="w-full bg-[#1e293b] border border-white/10 rounded-2xl p-6 text-white font-bold focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500/30 transition-all appearance-none cursor-pointer"
                                        >
                                            <option value="" className="bg-[#1e293b]">No linked internship</option>
                                            {internships.map(i => (
                                                <option key={i._id} value={i._id} className="bg-[#1e293b]">{i.title}</option>
                                            ))}
                                        </select>
                                    </div>
                                ))}

                                {modalMode === "issue" && (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Grade (Optional)</label>
                                        <input
                                            value={formData.grade}
                                            onChange={e => setFormData({ ...formData, grade: e.target.value })}
                                            className="w-full bg-[#1e293b] border border-white/10 rounded-2xl p-4 text-white font-bold focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500/30 transition-all placeholder:text-slate-400"
                                            placeholder="A+, Pass, etc."
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Completion Date (Optional)</label>
                                        <input
                                            type="date"
                                            value={formData.completionDate}
                                            onChange={e => setFormData({ ...formData, completionDate: e.target.value })}
                                            className="w-full bg-[#1e293b] border border-white/10 rounded-2xl p-4 text-white font-bold focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500/30 transition-all"
                                        />
                                    </div>
                                </div>
                                )}

                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Template File (PDF / DOC / DOCX / Image)</label>
                                    <label className="flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-[#1e293b] p-4 cursor-pointer hover:border-emerald-500/40 transition-colors">
                                        <div className="flex items-center gap-3 min-w-0">
                                            <FileText size={18} className="text-emerald-400 shrink-0" />
                                            <span className="text-xs font-bold text-slate-300 truncate">
                                                {formData.template.fileName || "Upload template file"}
                                            </span>
                                        </div>
                                        <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400 flex items-center gap-2">
                                            {uploadingTemplate ? "Uploading..." : "Upload"}
                                            <Upload size={14} />
                                        </span>
                                        <input
                                            type="file"
                                            accept=".pdf,.doc,.docx,.png,.jpg,.jpeg,.webp"
                                            className="hidden"
                                            onChange={(e) => handleTemplateUpload(e.target.files?.[0])}
                                        />
                                    </label>
                                    <button
                                        type="button"
                                        onClick={() => saveTemplateDefaults({ showToast: true })}
                                        disabled={savingTemplateDefaults || !formData.template?.url}
                                        className="w-full rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-[10px] font-black uppercase tracking-[0.2em] text-emerald-300 disabled:opacity-50"
                                    >
                                        {savingTemplateDefaults ? "Saving template..." : "Save Template For Future Certificates"}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={applyDefaultTemplateToForm}
                                        disabled={!defaultTemplate.template?.url}
                                        className="w-full rounded-xl border border-cyan-500/30 bg-cyan-500/10 px-4 py-3 text-[10px] font-black uppercase tracking-[0.2em] text-cyan-300 disabled:opacity-50"
                                    >
                                        Use Default Template
                                    </button>
                                </div>

                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Drag & Drop Layout Designer</label>
                                    <div
                                        ref={templateCanvasRef}
                                        className="relative w-full min-h-[260px] rounded-2xl border border-white/10 bg-[#111827] overflow-hidden"
                                    >
                                        {formData.template?.url ? (
                                            formData.template.mimeType?.startsWith("image/") ? (
                                                <img
                                                    src={resolveImageUrl(formData.template.url)}
                                                    alt="Certificate Template"
                                                    className="absolute inset-0 w-full h-full object-cover opacity-70"
                                                />
                                            ) : (
                                                <div className="absolute inset-0 flex items-center justify-center px-6 text-center text-xs font-bold uppercase tracking-widest text-slate-300">
                                                    Document template attached. Drag preview works best with image templates.
                                                </div>
                                            )
                                        ) : (
                                            <div className="absolute inset-0 flex items-center justify-center px-6 text-center text-xs font-bold uppercase tracking-widest text-slate-400">
                                                Upload a template to start drag-and-drop placement.
                                            </div>
                                        )}
                                        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/35 pointer-events-none" />
                                        {Object.entries(formData.fieldLayout).map(([fieldKey, cfg]) => {
                                            if (!cfg?.enabled) return null;
                                            return (
                                                <button
                                                    key={fieldKey}
                                                    type="button"
                                                    onMouseDown={(e) => startDraggingField(fieldKey, e)}
                                                    className={`absolute -translate-x-1/2 -translate-y-1/2 rounded-md border px-2 py-1 text-[10px] font-black uppercase tracking-widest shadow-lg cursor-move ${fieldKey === "studentName" ? "bg-cyan-500/20 border-cyan-400/50 text-cyan-200" : "bg-emerald-500/20 border-emerald-400/40 text-emerald-200"}`}
                                                    style={{ left: `${cfg.x}%`, top: `${cfg.y}%` }}
                                                >
                                                    {FIELD_LABELS[fieldKey] || fieldKey}
                                                </button>
                                            );
                                        })}
                                    </div>
                                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">
                                        Drag labels to set exact positions on template. Name is always mandatory.
                                    </p>
                                </div>

                                <div className="space-y-4">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Field Placement (percent coordinates)</label>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                        {Object.entries(formData.fieldLayout).map(([key, config]) => (
                                            <div key={key} className="rounded-xl border border-white/10 bg-[#1e293b] p-3 space-y-3">
                                                <label className="flex items-center justify-between text-xs font-bold text-slate-200 uppercase tracking-wider">
                                                    <span>{key}</span>
                                                    <input
                                                        type="checkbox"
                                                        checked={!!config.enabled}
                                                        onChange={(e) => setLayoutValue(key, "enabled", e.target.checked)}
                                                        disabled={key === "studentName"}
                                                    />
                                                </label>
                                                <div className="grid grid-cols-2 gap-2">
                                                    <input
                                                        type="number"
                                                        min="0"
                                                        max="100"
                                                        step="0.01"
                                                        value={config.x}
                                                        onChange={(e) => setLayoutValue(key, "x", Number(e.target.value))}
                                                        className="bg-[#0f172a] border border-white/10 rounded-lg p-2 text-xs text-white"
                                                        placeholder="X%"
                                                    />
                                                    <input
                                                        type="number"
                                                        min="0"
                                                        max="100"
                                                        step="0.01"
                                                        value={config.y}
                                                        onChange={(e) => setLayoutValue(key, "y", Number(e.target.value))}
                                                        className="bg-[#0f172a] border border-white/10 rounded-lg p-2 text-xs text-white"
                                                        placeholder="Y%"
                                                    />
                                                </div>
                                                {key === "qrCode" && (
                                                    <input
                                                        type="number"
                                                        min="8"
                                                        max="30"
                                                        step="0.01"
                                                        value={config.size || 18}
                                                        onChange={(e) => setLayoutValue(key, "size", Number(e.target.value))}
                                                        className="w-full bg-[#0f172a] border border-white/10 rounded-lg p-2 text-xs text-white"
                                                        placeholder="QR size"
                                                    />
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </form>
                            <div className="p-10 border-t border-white/5 flex justify-end items-center gap-4 shrink-0 -mx-10 -mb-10 mt-10 bg-[#1e293b]">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="flex-1 py-4.5 rounded-2xl bg-[#1e293b] text-slate-400 font-bold text-[10px] uppercase tracking-widest hover:text-white hover:bg-white/10 border border-white/10 transition-all"
                                >
                                    Dismiss
                                </button>
                                {modalMode === "template" ? (
                                    <button
                                        type="button"
                                        onClick={() => saveTemplateDefaults({ showToast: true })}
                                        disabled={savingTemplateDefaults || !formData.template?.url}
                                        className="flex-2 py-4.5 rounded-2xl bg-cyan-600 text-white font-bold text-[10px] uppercase tracking-widest hover:bg-cyan-500 shadow-lg shadow-cyan-500/20 transition-all flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50"
                                    >
                                        <CheckCircle size={18} strokeWidth={3} />
                                        <span>{savingTemplateDefaults ? "Saving..." : "Save As Default Template"}</span>
                                    </button>
                                ) : (
                                    <button
                                        type="submit"
                                        form="certificate-form"
                                        className="flex-2 py-4.5 rounded-2xl bg-emerald-600 text-white font-bold text-[10px] uppercase tracking-widest hover:bg-emerald-500 shadow-lg shadow-emerald-500/20 transition-all flex items-center justify-center gap-2 active:scale-95"
                                    >
                                        <CheckCircle size={18} strokeWidth={3} />
                                        <span>Issue Credential</span>
                                    </button>
                                )}
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
            {/* Certificate Preview Modal */}
            <AnimatePresence>
                {viewingCert && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl">
                        <div className="absolute inset-0" onClick={() => setViewingCert(null)} />
                        
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 30 }}
                            className="relative w-full max-w-4xl flex flex-col gap-4"
                        >
                            <div className="flex justify-end gap-3 z-10 w-full mb-2">
                                <button
                                    onClick={handleDownloadCert}
                                    className="px-6 py-2.5 rounded-xl bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-500 transition-all shadow-lg flex items-center gap-2 uppercase tracking-widest"
                                >
                                    <Download size={16} />
                                    Download PNG
                                </button>
                                <button
                                    onClick={() => setViewingCert(null)}
                                    className="p-2.5 rounded-xl bg-slate-800 text-gray-400 hover:bg-slate-700 hover:text-white transition-all border border-slate-600"
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            <div 
                                id="certificate-node" 
                                className="relative bg-[#0b1120] border-2 border-slate-800 rounded-3xl p-10 md:p-14 shadow-2xl overflow-hidden self-center w-full max-w-3xl flex flex-col items-center text-center mx-auto"
                            >
                                {/* Background effects for the certificate image */}
                                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-600/10 rounded-full blur-[80px] pointer-events-none" />
                                <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-500/10 rounded-full blur-[80px] pointer-events-none" />
                                
                                <div className="relative z-10 w-full">
                                    <div className="relative w-full min-h-[560px] rounded-2xl border border-slate-700 bg-[#0f172a] overflow-hidden">
                                        {viewingCert?.template?.url && (
                                            <>
                                                {viewingCert.template.mimeType?.startsWith("image/") ? (
                                                    <img
                                                        src={resolveImageUrl(viewingCert.template.url)}
                                                        alt="Certificate Template"
                                                        className="absolute inset-0 w-full h-full object-cover opacity-60"
                                                    />
                                                ) : (
                                                    <div className="absolute inset-0 flex items-center justify-center bg-slate-900/70 text-slate-300 text-xs font-bold uppercase tracking-widest px-6 text-center">
                                                        Template file attached: {viewingCert.template.fileName || "Document"}
                                                    </div>
                                                )}
                                            </>
                                        )}
                                        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/40" />

                                        <div className="absolute top-6 left-1/2 -translate-x-1/2 text-center px-4">
                                            <h2 className="text-2xl md:text-3xl font-black uppercase tracking-widest text-white">MentriQ Certificate</h2>
                                        </div>

                                        {(() => {
                                            const layout = { ...DEFAULT_FIELD_LAYOUT, ...(viewingCert.fieldLayout || {}) };
                                            const issueDateText = new Date(viewingCert.createdAt || Date.now()).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
                                            const completionDateText = viewingCert.completionDate
                                                ? new Date(viewingCert.completionDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
                                                : '';

                                            const renderTextField = (key, text, className = "text-white") => {
                                                const cfg = layout[key];
                                                if (!cfg?.enabled || !text) return null;
                                                return (
                                                    <div
                                                        key={key}
                                                        className={`absolute -translate-x-1/2 -translate-y-1/2 text-center px-2 ${className}`}
                                                        style={{ left: `${cfg.x}%`, top: `${cfg.y}%` }}
                                                    >
                                                        {text}
                                                    </div>
                                                );
                                            };

                                            return (
                                                <>
                                                    {renderTextField("studentName", viewingCert.studentName, "text-2xl md:text-3xl font-black text-cyan-300")}
                                                    {renderTextField("programName", viewingCert.courseName, "text-lg md:text-xl font-bold text-white")}
                                                    {renderTextField("issueDate", `Issue: ${issueDateText}`, "text-xs font-bold uppercase tracking-widest text-slate-200")}
                                                    {renderTextField("completionDate", completionDateText ? `Completed: ${completionDateText}` : "", "text-xs font-bold uppercase tracking-widest text-slate-200")}
                                                    {renderTextField("grade", viewingCert.grade ? `Grade: ${viewingCert.grade}` : "", "text-xs font-black uppercase tracking-widest text-emerald-300")}
                                                    {renderTextField("certificateId", viewingCert.certificateId, "text-xs font-mono text-slate-200")}
                                                    {layout.qrCode?.enabled && (
                                                        <div
                                                            className="absolute -translate-x-1/2 -translate-y-1/2 p-2 bg-white rounded-lg"
                                                            style={{ left: `${layout.qrCode.x}%`, top: `${layout.qrCode.y}%` }}
                                                        >
                                                            <QRCodeSVG
                                                                value={`https://www.mentriqtechnologies.in/verify-certificate?id=${viewingCert.certificateId}`}
                                                                size={(layout.qrCode.size || 18) * 4}
                                                                level="H"
                                                                includeMargin={false}
                                                            />
                                                        </div>
                                                    )}
                                                </>
                                            );
                                        })()}
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default CertificateManagement;
