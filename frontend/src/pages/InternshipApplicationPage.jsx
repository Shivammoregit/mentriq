import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { apiClient as api } from '../utils/apiClient';
import { useAuth } from '../context/AuthContext';
import { CheckCircle, Shield, ArrowLeft, Briefcase, Clock, MapPin, Building2, Send, XCircle } from 'lucide-react';
import { useToast } from '../context/ToastContext';

const InternshipApplicationPage = () => {
    const { internshipId } = useParams();
    const { user } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const toast = useToast();

    const [internship, setInternship] = useState(null);
    const [responses, setResponses] = useState({});
    const [formData, setFormData] = useState({
        contact: user?.phone || '',
    });
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        const fetchInternship = async () => {
            try {
                const response = await api.get(`/internships/${internshipId}`);
                const data = response.data;
                if (!data) throw new Error("No data received");

                const normalizedQuestions = (data.questions || []).map((q, i) => {
                    if (typeof q === 'string') {
                        return {
                            id: `q_${i}`,
                            label: q,
                            type: 'textarea',
                            required: true
                        };
                    }
                    return q;
                });

                setInternship({ ...data, questions: normalizedQuestions });

                const initialResponses = {};
                normalizedQuestions.forEach(q => {
                    if (q && q.id) initialResponses[q.id] = "";
                });
                setResponses(initialResponses);
            } catch (err) {
                console.error("Fetch Internship Error:", err);
                toast.error("Failed to load internship details");
                navigate('/training');
            } finally {
                setLoading(false);
            }
        };
        fetchInternship();
    }, [internshipId, navigate, toast]);

    const handleResponseChange = (questionId, value) => {
        setResponses(prev => ({ ...prev, [questionId]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!user) {
            toast.error("Please login to apply");
            return;
        }

        setSubmitting(true);
        try {
            const formattedResponses = internship.questions.map(q => ({
                questionId: q.id,
                label: q.label,
                value: responses[q.id]
            }));

            await api.post('/internships/apply', {
                internshipId,
                contact: formData.contact,
                responses: formattedResponses
            });

            navigate('/enrollment-success', { state: { title: internship.title, isInternship: true } });
        } catch (err) {
            toast.error(err.response?.data?.message || "Application submission failed");
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return (
        <div className="min-h-[70vh] flex items-center justify-center bg-white">
            <div className="animate-spin h-12 w-12 border-4 border-indigo-600 border-t-transparent rounded-full"></div>
        </div>
    );

    if (!internship) return (
        <div className="min-h-[70vh] flex flex-col items-center justify-center bg-white text-slate-900 p-10">
            <div className="w-20 h-20 bg-red-500/10 rounded-3xl flex items-center justify-center text-red-500 mb-6 border border-red-500/20">
                <XCircle size={40} />
            </div>
            <h2 className="text-3xl font-black uppercase tracking-tight mb-4 text-center">Internship Not Found</h2>
            <p className="text-gray-400 text-center max-w-md mb-8">The internship program you're looking for might have been removed or is no longer accepting applications.</p>
            <button
                onClick={() => navigate('/training')}
                className="bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-900 px-8 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all"
            >
                Return to Directory
            </button>
        </div>
    );

    return (
        <section className="min-h-screen pb-14 px-4 flex items-center justify-center bg-[#020617] mt-16">
            {/* Background decoration */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[120px]" />
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-cyan-600/10 rounded-full blur-[120px]" />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="relative bg-slate-900/60 backdrop-blur-2xl border border-slate-800 rounded-[2rem] shadow-2xl overflow-hidden max-w-6xl w-full flex flex-col md:flex-row"
            >
                {/* Left Side: Internship Info */}
                <div className="md:w-[40%] bg-slate-800/80 backdrop-blur-md text-white p-8 flex flex-col justify-between relative overflow-hidden border-r border-slate-700">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/20 rounded-full blur-3xl -mr-16 -mt-16" />
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-cyan-600/20 rounded-full blur-3xl -ml-16 -mb-16" />

                    <div className="relative z-10">
                        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-400 hover:text-white transition mb-8 group">
                            <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                            <span className="text-[10px] font-black uppercase tracking-widest">Back to Directory</span>
                        </button>

                        <div className="mb-6">
                            <div className="w-12 h-12 rounded-2xl bg-indigo-600/20 flex items-center justify-center text-indigo-400 mb-4 border border-indigo-500/20">
                                <Building2 size={24} />
                            </div>
                            <h2 className="text-3xl font-black mb-2 leading-tight tracking-tight uppercase">{internship.title}</h2>
                            <p className="text-indigo-400 font-bold tracking-wider uppercase text-xs">{internship.company}</p>
                        </div>

                        <div className="space-y-4 text-gray-300">
                            <div className="flex items-center gap-3 bg-slate-900 p-3 rounded-2xl border border-slate-700">
                                <Clock className="text-cyan-400" size={18} />
                                <span className="text-sm font-medium text-white">{internship.duration} Duration</span>
                            </div>
                            <div className="flex items-center gap-3 bg-slate-900 p-3 rounded-2xl border border-slate-700">
                                <MapPin className="text-emerald-400" size={18} />
                                <span className="text-sm font-medium text-white">{internship.location}</span>
                            </div>
                            <div className="flex items-center gap-3 bg-slate-900 p-3 rounded-2xl border border-slate-700">
                                <Briefcase className="text-purple-400" size={18} />
                                <span className="text-sm font-medium text-white">{internship.type} Role</span>
                            </div>
                        </div>
                    </div>

                    <div className="mt-8 relative z-10">
                        <div className="flex items-center gap-3 mb-2">
                            <Shield className="text-emerald-400" size={20} />
                            <span className="font-bold text-xs text-gray-300 uppercase tracking-widest">Admissions Active</span>
                        </div>
                        <p className="text-[10px] text-gray-500 leading-relaxed uppercase font-bold tracking-tighter">
                            Applications are reviewed on a rolling basis. Ensure all details are accurate.
                        </p>
                    </div>
                </div>

                {/* Right Side: Form */}
                <div className="md:w-[60%] p-8 md:p-10">
                    <div className="mb-12">
                        <h3 className="text-2xl font-black text-white mb-2 tracking-tight uppercase flex items-center gap-3">
                            Internship Admission Form
                            <div className="h-1 w-12 bg-indigo-600 rounded-full" />
                        </h3>
                        <p className="text-gray-400 text-sm">Join the MentriQ ecosystem. Complete your profile and answering the questionnaire below.</p>
                    </div>

                    <div className="mb-8">
                        <button
                            onClick={() => navigate('/verify-certificate')}
                            className="w-full px-8 py-4 rounded-2xl bg-emerald-600/20 border border-emerald-500/30 text-emerald-300 font-bold hover:bg-emerald-600/30 transition flex items-center justify-center gap-3 shadow-lg shadow-emerald-500/10 group"
                        >
                            <svg className="w-6 h-6 group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                            </svg>
                            <span>Verify Certificate Authenticity</span>
                            <Shield className="w-5 h-5" />
                        </button>
                    </div>

                    {!user ? (
                        <div className="bg-slate-800 border border-slate-700 rounded-3xl p-10 text-center space-y-6">
                            <div className="w-16 h-16 bg-yellow-500/10 rounded-2xl flex items-center justify-center text-yellow-400 mx-auto border border-yellow-500/20">
                                <Shield size={32} />
                            </div>
                            <div>
                                <h4 className="text-xl font-black text-white mb-2">Authentication Required</h4>
                                <p className="text-gray-400 text-sm max-w-xs mx-auto">You must be signed in to submit an internship application. This helps us track your progress.</p>
                            </div>
                            <button
                                onClick={() => navigate('/login', { state: { from: location } })}
                                className="bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all"
                            >
                                Sign In to Apply
                            </button>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2 opacity-50">
                                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Full Name</label>
                                    <input value={user?.name || ""} disabled className="w-full p-4 bg-slate-800/50 rounded-2xl border border-slate-700 text-white cursor-not-allowed" />
                                </div>
                                <div className="space-y-2 opacity-50">
                                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Email</label>
                                    <input value={user?.email || ""} disabled className="w-full p-4 bg-slate-800/50 rounded-2xl border border-slate-700 text-white cursor-not-allowed" />
                                </div>
                                <div className="space-y-2 md:col-span-2">
                                    <label className="text-[10px] font-black text-indigo-400 uppercase tracking-widest ml-1">Contact Number</label>
                                    <input
                                        required
                                        type="tel"
                                        placeholder="+91 00000 00000"
                                        value={formData.contact}
                                        onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                                        className="w-full p-4 bg-slate-800/50 rounded-2xl border border-slate-700 text-white focus:bg-slate-800 focus:border-indigo-500/50 outline-none transition-all placeholder:text-slate-500"
                                    />
                                </div>
                            </div>

                            {internship.questions?.length > 0 && (
                                <div className="space-y-6 pt-8 border-t border-slate-100">
                                    <h4 className="text-[10px] font-black text-cyan-400 uppercase tracking-[0.2em] mb-4">Specific Requirements</h4>
                                    {internship.questions.map((q) => (
                                        <div key={q.id} className="space-y-2">
                                            <label className="flex items-center gap-2 text-[10px] font-black text-gray-300 uppercase tracking-widest ml-1">
                                                {q.label}
                                                {q.required && <span className="text-red-500 text-lg">*</span>}
                                            </label>

                                            {q.type === 'textarea' ? (
                                                <textarea
                                                    required={q.required}
                                                    value={responses[q.id] || ""}
                                                    onChange={(e) => handleResponseChange(q.id, e.target.value)}
                                                    className="w-full p-4 bg-slate-800/50 rounded-2xl border border-slate-700 text-white focus:bg-slate-800 focus:border-cyan-500/50 outline-none transition-all min-h-[120px] text-sm placeholder:text-slate-500"
                                                    placeholder="Type your response here..."
                                                />
                                            ) : q.type === 'select' ? (
                                                <select
                                                    required={q.required}
                                                    value={responses[q.id] || ""}
                                                    onChange={(e) => handleResponseChange(q.id, e.target.value)}
                                                    className="w-full p-4 bg-slate-800/50 rounded-2xl border border-slate-700 text-white focus:bg-slate-800 focus:border-cyan-500/50 outline-none transition-all text-sm appearance-none"
                                                >
                                                    <option value="" className="text-slate-500">Select an option</option>
                                                    {q.options?.map((opt, i) => (
                                                        <option key={i} value={opt} className="bg-slate-800 text-white">{opt}</option>
                                                    ))}
                                                </select>
                                            ) : (
                                                <input
                                                    type={q.type === 'number' ? 'number' : 'text'}
                                                    required={q.required}
                                                    value={responses[q.id] || ""}
                                                    onChange={(e) => handleResponseChange(q.id, e.target.value)}
                                                    className="w-full p-4 bg-slate-800/50 rounded-2xl border border-slate-700 text-white focus:bg-slate-800 focus:border-cyan-500/50 outline-none transition-all text-sm placeholder:text-slate-500"
                                                    placeholder={q.type === 'number' ? 'Enter a number...' : 'Short response...'}
                                                />
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}

                            <div className="pt-6">
                                <button
                                    disabled={submitting}
                                    className="w-full relative group overflow-hidden bg-gradient-to-r from-indigo-600 to-indigo-700 text-white font-black py-5 rounded-[1.5rem] transition-all duration-500 flex items-center justify-center gap-3 disabled:opacity-50 disabled:grayscale"
                                >
                                    <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                                    {submitting ? (
                                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    ) : (
                                        <>
                                            <Send size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                                            <span className="uppercase tracking-[0.2em] text-sm">Post Application</span>
                                        </>
                                    )}
                                </button>
                                <p className="text-center text-[10px] text-gray-500 mt-6 uppercase tracking-widest opacity-50">Secure Submission Process Active</p>
                            </div>
                        </form>
                    )}
                </div>
            </motion.div>
        </section>
    );
};

export default InternshipApplicationPage;
