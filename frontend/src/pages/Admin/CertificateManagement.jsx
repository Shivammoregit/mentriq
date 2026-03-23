import React, { useEffect, useState } from "react";
import { apiClient as api } from "../../utils/apiClient";
import { Award, Search, X, RotateCcw, Users, BookOpen, Trash2, ChevronDown, CheckCircle, ShieldCheck, Eye, Download } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { QRCodeSVG } from "qrcode.react";
import html2canvas from "html2canvas";
import { useToast } from "../../context/ToastContext";

const CertificateManagement = () => {
    const MotionDiv = motion.div;
    const [certificates, setCertificates] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [viewingCert, setViewingCert] = useState(null);

    // Data for generation form
    const [users, setUsers] = useState([]);
    const [courses, setCourses] = useState([]);
    const [formData, setFormData] = useState({ userId: "", courseId: "", grade: "A+" });

    const toast = useToast();

    const fetchData = async () => {
        try {
            const [certRes, userRes, courseRes] = await Promise.all([
                api.get("/certificates"),
                api.get("/users"),
                api.get("/courses")
            ]);
            setCertificates(certRes.data || []);
            setUsers(userRes.data?.filter(u => u.role !== 'admin') || []);
            setCourses(courseRes.data || []);
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

    const handleGenerate = async (e) => {
        e.preventDefault();
        try {
            await api.post("/certificates/generate", formData);
            toast.success("Credential generated successfully");
            setIsModalOpen(false);
            setFormData({ userId: "", courseId: "", grade: "A+" });
            fetchData();
        } catch (err) {
            toast.error(err.response?.data?.message || "Generation failed");
        }
    };

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
                            onClick={() => setIsModalOpen(true)}
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
                            className="relative w-full max-w-xl bg-[#0b1120] border border-white/10 rounded-[3rem] p-10 shadow-2xl flex flex-col"
                        >
                            <div className="flex items-start justify-between gap-6 mb-10 shrink-0">
                                <div>
                                    <h3 className="text-3xl font-black text-white tracking-tight uppercase">Credential Generation</h3>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mt-1">Issue Digital Academic Token</p>
                                </div>
                                <button
                                    onClick={() => setIsModalOpen(false)}
                                    className="p-3.5 rounded-2xl bg-[#1e293b] hover:bg-white/10 text-slate-400 hover:text-white transition-all border border-white/10"
                                >
                                    <X size={24} />
                                </button>
                            </div>

                            <form onSubmit={handleGenerate} className="flex-1 space-y-8">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Academic Subject (Student)</label>
                                    <select
                                        required
                                        value={formData.userId}
                                        onChange={e => setFormData({ ...formData, userId: e.target.value })}
                                        className="w-full bg-[#1e293b] border border-white/10 rounded-2xl p-6 text-white font-bold focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500/30 transition-all appearance-none cursor-pointer"
                                    >
                                        <option value="" className="bg-[#1e293b]">Select Recipient...</option>
                                        {users.map(u => (
                                            <option key={u._id} value={u._id} className="bg-[#1e293b]">{u.name || u.email}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Educational Program</label>
                                    <select
                                        required
                                        value={formData.courseId}
                                        onChange={e => setFormData({ ...formData, courseId: e.target.value })}
                                        className="w-full bg-[#1e293b] border border-white/10 rounded-2xl p-6 text-white font-bold focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500/30 transition-all appearance-none cursor-pointer"
                                    >
                                        <option value="" className="bg-[#1e293b]">Select Course...</option>
                                        {courses.map(c => (
                                            <option key={c._id} value={c._id} className="bg-[#1e293b]">{c.title}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Grade Classification</label>
                                    <input
                                        required
                                        value={formData.grade}
                                        onChange={e => setFormData({ ...formData, grade: e.target.value })}
                                        className="w-full bg-[#1e293b] border border-white/10 rounded-2xl p-6 text-white font-bold focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500/30 transition-all placeholder:text-slate-400"
                                        placeholder="e.g. A+"
                                    />
                                </div>

                                <div className="p-10 border-t border-white/5 flex justify-end items-center gap-4 shrink-0 -mx-10 -mb-10 mt-10 bg-[#1e293b]">
                                    <button
                                        type="button"
                                        onClick={() => setIsModalOpen(false)}
                                        className="flex-1 py-4.5 rounded-2xl bg-[#1e293b] text-slate-400 font-bold text-[10px] uppercase tracking-widest hover:text-white hover:bg-white/10 border border-white/10 transition-all"
                                    >
                                        Dismiss
                                    </button>
                                    <button
                                        type="submit"
                                        className="flex-2 py-4.5 rounded-2xl bg-emerald-600 text-white font-bold text-[10px] uppercase tracking-widest hover:bg-emerald-500 shadow-lg shadow-emerald-500/20 transition-all flex items-center justify-center gap-2 active:scale-95"
                                    >
                                        <CheckCircle size={18} strokeWidth={3} />
                                        <span>Issue Credential</span>
                                    </button>
                                </div>
                            </form>
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
                                
                                <div className="relative z-10 w-full flex flex-col items-center">
                                    <div className="inline-flex items-center justify-center w-20 h-20 bg-emerald-500/10 rounded-2xl border border-emerald-500/20 mb-6">
                                        <Award className="w-10 h-10 text-emerald-400" />
                                    </div>
                                    
                                    <h1 className="text-4xl md:text-5xl font-black text-white mb-2 uppercase tracking-widest">
                                        MentriQ <span className="text-emerald-400">Certified</span>
                                    </h1>
                                    <p className="text-slate-400 text-xs font-bold uppercase tracking-[0.3em] mb-12">
                                        Certificate of Successful Completion
                                    </p>

                                    <div className="mb-4">
                                        <p className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-2">This is to certify that</p>
                                        <h2 className="text-3xl md:text-4xl font-extrabold text-blue-400 underline decoration-blue-500/30 underline-offset-8 decoration-2 capitalize">
                                            {viewingCert.studentName}
                                        </h2>
                                    </div>

                                    <div className="mb-12 mt-8">
                                        <p className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-2">Has successfully completed the program</p>
                                        <h3 className="text-2xl font-bold text-white uppercase tracking-wider bg-slate-800/50 py-3 px-8 rounded-2xl border border-slate-700 mt-4">
                                            {viewingCert.courseName}
                                        </h3>
                                    </div>

                                    <div className="w-full grid grid-cols-2 md:grid-cols-4 gap-4 bg-slate-900/50 backdrop-blur-sm p-6 rounded-2xl border border-slate-800 text-left mb-10">
                                        <div>
                                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-1">Issue Date</p>
                                            <p className="text-white font-bold text-sm">
                                                {new Date(viewingCert.createdAt || Date.now()).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-1">Achievement</p>
                                            <p className="text-emerald-400 font-black text-sm">{viewingCert.grade || 'A+'}</p>
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-1">Status</p>
                                            <p className="text-white font-bold text-sm">{viewingCert.status || 'Active'}</p>
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-1">Credential ID</p>
                                            <p className="text-white font-mono text-xs truncate" title={viewingCert.certificateId}>{viewingCert.certificateId}</p>
                                        </div>
                                    </div>

                                    <div className="flex flex-col items-center">
                                        <div className="p-3 bg-white rounded-xl mb-3">
                                            <QRCodeSVG 
                                                value={`https://www.mentriqtechnologies.in/verify-certificate?id=${viewingCert.certificateId}`}
                                                size={100}
                                                level="H"
                                                includeMargin={true}
                                            />
                                        </div>
                                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest text-center max-w-[250px]">
                                            Scan QR to verify authenticity or visit MentriQ verification portal
                                        </p>
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
