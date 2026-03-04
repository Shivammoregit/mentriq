import React, { useEffect, useState } from 'react';
import { apiClient as api } from '../../utils/apiClient';
import {
    Mail,
    Phone,
    User,
    MessageSquare,
    Calendar,
    Trash2,
    CheckCircle,
    Clock,
    Filter,
    Search,
    ChevronRight,
    ChevronDown,
    ExternalLink,
    Briefcase,
    Building2,
    Check,
    X,
    Inbox
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useToast } from '../../context/ToastContext';

const MotionDiv = motion.div;

const EnquiryManagement = () => {
    const [activeTab, setActiveTab] = useState('contact');
    const [inquiries, setInquiries] = useState([]);
    const [enquiries, setEnquiries] = useState([]); // Recruit enquiries
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filter, setFilter] = useState('all');
    const [selectedRecruitEnquiry, setSelectedRecruitEnquiry] = useState(null);
    const toast = useToast();

    const fetchData = async () => {
        setLoading(true);
        try {
            const [contactRes, recruitRes] = await Promise.all([
                api.get('/contact'),
                api.get("/recruit")
            ]);
            setInquiries(contactRes.data || []);
            setEnquiries(recruitRes.data.data || []);
        } catch (error) {
            console.error("Failed to fetch data:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
        const interval = setInterval(fetchData, 30000);
        return () => clearInterval(interval);
    }, []);

    const handleMarkAsRead = async (id) => {
        try {
            await api.put(`/contact/${id}/read`);
            setInquiries(inquiries.map(inq => inq._id === id ? { ...inq, isRead: true } : inq));
            toast.success("Marked as read");
        } catch (error) {
            toast.error("Failed to mark as read");
        }
    };

    const handleDeleteContact = async (id) => {
        if (!window.confirm("Terminate inquiry entry?")) return;
        try {
            await api.delete(`/contact/${id}`);
            setInquiries(inquiries.filter(inq => inq._id !== id));
            toast.success("Inquiry removed");
        } catch (error) {
            toast.error("Deletion failed");
        }
    };

    const handleDeleteRecruit = async (id) => {
        if (!window.confirm("Terminate recruitment entry?")) return;
        try {
            await api.delete(`/recruit/${id}`);
            setEnquiries((prev) => prev.filter((e) => e._id !== id));
            toast.success("Entry removed");
            if (selectedRecruitEnquiry?._id === id) setSelectedRecruitEnquiry(null);
        } catch (err) {
            toast.error("Deletion failed");
        }
    };

    const filteredContact = inquiries.filter(inq =>
        (inq.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            inq.email?.toLowerCase().includes(searchTerm.toLowerCase())) &&
        (filter === 'all' ? true : filter === 'read' ? inq.isRead : !inq.isRead)
    );

    const filteredRecruit = enquiries.filter(enq =>
        enq.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        enq.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* Page Header */}
            <div className="bg-[#0f172a]/40 backdrop-blur-xl p-6 rounded-3xl border border-white/5 shadow-2xl relative overflow-hidden group">
                <div className="flex flex-col lg:flex-row gap-6 lg:items-center lg:justify-between relative z-10">
                    <div>
                        <div className="flex items-center gap-3 mb-1">
                            <Inbox size={24} className="text-emerald-400" />
                            <h2 className="text-2xl font-black text-white tracking-tighter uppercase">Communications Hub</h2>
                            <span className="ml-2 text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-lg border border-emerald-500/20 text-[10px] font-bold">
                                {activeTab === 'contact' ? inquiries.length : enquiries.length} Incoming Signals
                            </span>
                        </div>
                        <p className="text-slate-400 font-medium text-xs">Centralized inquiry and recruitment signal processing.</p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
                        <div className="bg-white/5 border border-white/10 rounded-xl pr-4 flex items-center w-full lg:w-auto group focus-within:border-emerald-500/50 focus-within:ring-4 focus-within:ring-emerald-500/10 transition-all">
                            <Search className="text-slate-500 ml-4 group-focus-within:text-emerald-400 transition-colors" size={14} />
                            <input
                                type="text"
                                placeholder="Search channels..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="bg-transparent text-white placeholder:text-slate-600 focus:outline-none py-3 px-4 w-full lg:w-64 font-bold text-xs tracking-tight"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 p-1 bg-white/5 border border-white/10 rounded-2xl w-fit">
                <button
                    onClick={() => setActiveTab('contact')}
                    className={`px-5 py-2.5 rounded-xl font-bold text-[9px] uppercase tracking-widest transition-all ${activeTab === 'contact' ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/20' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
                >
                    Contact Inquiries
                </button>
                <button
                    onClick={() => setActiveTab('recruit')}
                    className={`px-5 py-2.5 rounded-xl font-bold text-[9px] uppercase tracking-widest transition-all ${activeTab === 'recruit' ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/20' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
                >
                    Recruitment Signal
                </button>
            </div>

            {/* Content Area */}
            <div className="bg-[#0f172a]/40 backdrop-blur-xl border border-white/5 rounded-3xl overflow-hidden shadow-2xl">
                <div className="overflow-x-auto">
                    {activeTab === 'contact' ? (
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-white/5 border-b border-white/10">
                                    <th className="px-8 py-4 text-[9px] font-bold uppercase tracking-[0.2em] text-slate-400">Sender Identity</th>
                                    <th className="px-8 py-4 text-[9px] font-bold uppercase tracking-[0.2em] text-slate-400">Message Content</th>
                                    <th className="px-8 py-4 text-[9px] font-bold uppercase tracking-[0.2em] text-slate-400">Timestamp</th>
                                    <th className="px-8 py-4 text-[9px] font-bold uppercase tracking-[0.2em] text-slate-400 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {filteredContact.map((inq) => (
                                    <tr key={inq._id} className={`hover:bg-white/5 transition-colors group ${!inq.isRead ? 'bg-emerald-500/5' : ''}`}>
                                        <td className="px-8 py-4">
                                            <div className="flex flex-col gap-0.5">
                                                <div className="font-bold text-white text-[14px] tracking-tight flex items-center gap-2">
                                                    {inq.name}
                                                    {!inq.isRead && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />}
                                                </div>
                                                <div className="text-[9px] text-slate-500 font-bold uppercase tracking-widest flex items-center gap-1.5">
                                                    <Mail size={10} className="text-emerald-400" />
                                                    {inq.email}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-4 max-w-sm">
                                            <p className="text-slate-400 text-[11px] line-clamp-1 leading-relaxed font-medium">{inq.message}</p>
                                        </td>
                                        <td className="px-8 py-4">
                                            <div className="text-slate-500 text-[9px] uppercase font-bold tracking-widest flex items-center gap-2">
                                                <Clock size={10} />
                                                {new Date(inq.createdAt).toLocaleDateString()}
                                            </div>
                                        </td>
                                        <td className="px-8 py-4 text-right">
                                            <div className="flex justify-end gap-2">
                                                {!inq.isRead && (
                                                    <button onClick={() => handleMarkAsRead(inq._id)} className="p-2 rounded-xl bg-white/5 text-slate-400 hover:text-emerald-400 hover:bg-emerald-500/10 border border-white/10 hover:border-emerald-500/20 transition-all">
                                                        <CheckCircle size={14} />
                                                    </button>
                                                )}
                                                <button onClick={() => handleDeleteContact(inq._id)} className="p-2 rounded-xl bg-white/5 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 border border-white/10 hover:border-rose-500/20 transition-all">
                                                    <Trash2 size={14} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-white/5 border-b border-white/10">
                                    <th className="px-8 py-4 text-[9px] font-bold uppercase tracking-[0.2em] text-slate-400">Applicant Node</th>
                                    <th className="px-8 py-4 text-[9px] font-bold uppercase tracking-[0.2em] text-slate-400">Professional Path</th>
                                    <th className="px-8 py-4 text-[9px] font-bold uppercase tracking-[0.2em] text-slate-400">Timestamp</th>
                                    <th className="px-8 py-4 text-[9px] font-bold uppercase tracking-[0.2em] text-slate-400 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {filteredRecruit.map((enq) => (
                                    <tr key={enq._id} className="hover:bg-white/5 transition-colors group">
                                        <td className="px-8 py-4">
                                            <div className="flex flex-col gap-0.5">
                                                <div className="font-bold text-white text-[14px] tracking-tight">{enq.fullName}</div>
                                                <div className="text-[9px] text-slate-500 font-bold uppercase tracking-widest flex items-center gap-1.5">
                                                    <Mail size={10} className="text-emerald-400" />
                                                    {enq.email}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-4">
                                            <div className="flex flex-col gap-0.5">
                                                <div className="text-white font-bold text-[11px] uppercase tracking-wider">{enq.interest}</div>
                                                <div className="text-slate-500 text-[9px] uppercase font-bold tracking-widest flex items-center gap-2">
                                                    <Building2 size={10} className="text-emerald-400" />
                                                    {enq.company || 'Private Entity'}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-4">
                                            <div className="text-slate-500 text-[9px] uppercase font-bold tracking-widest flex items-center gap-2">
                                                <Clock size={10} />
                                                {new Date(enq.createdAt).toLocaleDateString()}
                                            </div>
                                        </td>
                                        <td className="px-8 py-4 text-right">
                                            <div className="flex justify-end gap-2">
                                                <button onClick={() => setSelectedRecruitEnquiry(enq)} className="p-2 rounded-xl bg-white/5 text-slate-400 hover:text-emerald-400 hover:bg-emerald-500/10 border border-white/10 hover:border-emerald-500/20 transition-all">
                                                    <ExternalLink size={14} />
                                                </button>
                                                <button onClick={() => handleDeleteRecruit(enq._id)} className="p-2 rounded-xl bg-white/5 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 border border-white/10 hover:border-rose-500/20 transition-all">
                                                    <Trash2 size={14} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>

            {/* Recuit Detail Modal */}
            <AnimatePresence>
                {selectedRecruitEnquiry && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl">
                        <MotionDiv
                            initial={{ opacity: 0, scale: 0.95, y: 30 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 30 }}
                            className="relative w-full max-w-2xl bg-[#0f172a] border border-white/10 rounded-[2.5rem] p-8 shadow-2xl flex flex-col max-h-[90vh]"
                        >
                            <div className="flex items-start justify-between gap-6 mb-8 shrink-0">
                                <div>
                                    <h3 className="text-2xl font-black text-white tracking-tight uppercase">Applicant Intel</h3>
                                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mt-1">Classification: Recruitment Protocol</p>
                                </div>
                                <button
                                    onClick={() => setSelectedRecruitEnquiry(null)}
                                    className="p-3 rounded-2xl bg-white/5 hover:bg-white/10 text-slate-500 hover:text-white transition-all border border-white/10"
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            <div className="flex-1 overflow-y-auto pr-4 -mr-4 space-y-8 custom-scrollbar text-white">
                                <div className="grid grid-cols-2 gap-6">
                                    <div>
                                        <p className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em] mb-1">Subject Name</p>
                                        <p className="text-lg font-bold">{selectedRecruitEnquiry.fullName}</p>
                                    </div>
                                    <div>
                                        <p className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em] mb-1">Interest Node</p>
                                        <p className="text-lg font-bold text-emerald-400">{selectedRecruitEnquiry.interest}</p>
                                    </div>
                                    <div>
                                        <p className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em] mb-1">Communication Link</p>
                                        <p className="font-bold text-sm flex items-center gap-2"><Mail size={14} /> {selectedRecruitEnquiry.email}</p>
                                        <p className="font-bold text-sm flex items-center gap-2 mt-1"><Phone size={14} /> {selectedRecruitEnquiry.phone}</p>
                                    </div>
                                    <div>
                                        <p className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em] mb-1">Organization</p>
                                        <p className="font-bold text-sm flex items-center gap-2"><Building2 size={14} /> {selectedRecruitEnquiry.company || 'N/A'}</p>
                                    </div>
                                </div>
                                <div>
                                    <p className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em] mb-3">Transmission Context</p>
                                    <div className="p-5 bg-white/5 rounded-2xl border border-white/5 leading-relaxed text-slate-300 text-sm">
                                        {selectedRecruitEnquiry.message}
                                    </div>
                                </div>
                            </div>

                            <div className="p-8 border-t border-white/5 flex justify-end items-center gap-4 shrink-0 -mx-8 -mb-8 mt-8 bg-white/5">
                                <button
                                    onClick={() => setSelectedRecruitEnquiry(null)}
                                    className="flex-1 py-3.5 rounded-2xl bg-emerald-600 text-white font-bold text-[10px] uppercase tracking-widest hover:bg-emerald-500 shadow-lg shadow-emerald-500/20 transition-all font-display"
                                >
                                    Acknowledge Signal
                                </button>
                            </div>
                        </MotionDiv>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default EnquiryManagement;
