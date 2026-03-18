import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

import { Mail, Key, ArrowRight, Loader2, Eye, EyeOff, UserRound, Trash2, ShieldAlert, CheckCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { useToast } from '../../context/ToastContext';

const MotionDiv = motion.div;
const BUCKET_KEY = 'mentriq_admin_credential_bucket';

const AdminLogin = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [credentialBucket, setCredentialBucket] = useState([]);
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const toast = useToast();

    const from = location.state?.from?.pathname || '/admin/dashboard';

    useEffect(() => {
        try {
            const raw = localStorage.getItem(BUCKET_KEY);
            if (!raw) return;
            const parsed = JSON.parse(raw);
            if (Array.isArray(parsed)) setCredentialBucket(parsed);
        } catch {
            // ignore broken local data
        }
    }, []);

    const persistBucket = (nextBucket) => {
        setCredentialBucket(nextBucket);
        localStorage.setItem(BUCKET_KEY, JSON.stringify(nextBucket));
    };

    const saveCredentialToBucket = (nextEmail, nextPassword) => {
        if (!nextEmail || !nextPassword) return;
        const now = Date.now();
        const label = nextEmail.split('@')[0] || 'staff';
        const next = [
            { id: `${nextEmail}-${now}`, label, email: nextEmail, password: nextPassword, savedAt: now },
            ...credentialBucket.filter((item) => item.email !== nextEmail)
        ].slice(0, 5);
        persistBucket(next);
    };

    const applyBucketCredential = (item) => {
        setEmail(item.email);
        setPassword(item.password);
        toast.success(`Encrypted credentials for ${item.email} loaded`);
    };

    const removeBucketCredential = (id) => {
        const next = credentialBucket.filter((item) => item.id !== id);
        persistBucket(next);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const sanitizedEmail = email.trim().toLowerCase();
            const result = await login(sanitizedEmail, password);
            if (result.success) {
                if (['admin', 'moderator', 'superadmin', 'subadmin'].includes(result.user.role)) {
                    saveCredentialToBucket(sanitizedEmail, password);
                    toast.success('Personnel authentication successful');
                    navigate(from, { replace: true });
                } else {
                    toast.error('Access Denied: High-level clearance required');
                }
            } else {
                toast.error(result.message || 'Authentication failed');
            }
        } catch (err) {
            console.error('Core Auth Failure:', err);
            const msg = err.response?.data?.message || err.message || 'System uplink failure';
            toast.error(`Auth Error: ${msg}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#020617] text-white flex items-center justify-center p-4 relative overflow-hidden font-inter">
            {/* Background elements */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] right-[-10%] w-[800px] h-[800px] bg-emerald-600/5 rounded-full blur-[120px] animate-pulse" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[800px] h-[800px] bg-blue-600/5 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '2s' }} />
                <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-[0.05]" />
            </div>

            <div className="w-full max-w-lg relative z-10 space-y-8">
                {/* Logo & Intro */}
                <div className="text-center space-y-4">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="inline-flex p-4 rounded-3xl bg-emerald-500/10 border border-emerald-500/20 shadow-2xl shadow-emerald-500/10"
                    >
                        <ShieldAlert size={48} className="text-emerald-400" />
                    </motion.div>
                    <div className="space-y-1">
                        <h1 className="text-4xl font-black tracking-tighter uppercase italic">Control Nexus</h1>
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em]">Restricted Administrative Entity Access</p>
                    </div>
                </div>

                {/* Main Card */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-[#0f172a]/40 backdrop-blur-2xl border border-white/5 rounded-[3rem] p-10 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)] relative overflow-hidden group"
                >
                    <div className="absolute inset-0 bg-gradient-to-br from-emerald-600/5 via-transparent to-blue-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />

                    <form onSubmit={handleSubmit} className="relative z-10 space-y-8">
                        <div className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Personnel Email</label>
                                <div className="relative group/input">
                                    <Mail className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within/input:text-emerald-400 transition-colors" size={18} />
                                    <input
                                        type="email"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full bg-white/5 border border-white/10 rounded-2xl p-6 pl-16 text-white font-bold focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500/30 transition-all placeholder:text-slate-600"
                                        placeholder="admin@mentriq.tech"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Access Cipher (Password)</label>
                                <div className="relative group/input">
                                    <Key className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within/input:text-emerald-400 transition-colors" size={18} />
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        required
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full bg-white/5 border border-white/10 rounded-2xl p-6 pl-16 text-white font-bold focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500/30 transition-all placeholder:text-slate-600"
                                        placeholder="••••••••"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors"
                                    >
                                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-emerald-600 text-white hover:bg-emerald-500 py-6 rounded-2xl font-black text-[12px] uppercase tracking-[0.2em] flex items-center justify-center gap-4 transition-all active:scale-95 shadow-2xl shadow-emerald-500/20 disabled:opacity-50 group/button"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="animate-spin" size={20} />
                                    <span>Authenticating Cyber-Core...</span>
                                </>
                            ) : (
                                <>
                                    <span>Establish Secure Link</span>
                                    <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </button>
                    </form>
                </motion.div>

                {/* Encrypted Vault (Bucket) */}
                <AnimatePresence>
                    {credentialBucket.length > 0 && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="space-y-4"
                        >
                            <div className="flex items-center justify-between px-2">
                                <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest flex items-center gap-2">
                                    <CheckCircle size={12} className="text-emerald-500" />
                                    Encrypted Portal Vault
                                </p>
                                <span className="text-[10px] font-bold text-slate-700">{credentialBucket.length}/5 Slots Used</span>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {credentialBucket.map((item) => (
                                    <motion.div
                                        key={item.id}
                                        layout
                                        className="bg-white/5 border border-white/5 rounded-2xl p-4 flex items-center justify-between hover:bg-white/10 hover:border-emerald-500/20 transition-all cursor-pointer group/bucket"
                                        onClick={() => applyBucketCredential(item)}
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/10 group-hover/bucket:bg-emerald-500/20 transition-all">
                                                <UserRound size={16} />
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-xs font-black text-white uppercase tracking-wider">{item.label}</span>
                                                <span className="text-[9px] text-slate-500 font-bold truncate max-w-[100px]">{item.email}</span>
                                            </div>
                                        </div>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                removeBucketCredential(item.id);
                                            }}
                                            className="p-2 text-slate-600 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-all opacity-0 group-hover/bucket:opacity-100"
                                        >
                                            <Trash2 size={14} />
                                        </button>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Footer Trace */}
                <div className="text-center">
                    <p className="text-[9px] font-bold text-slate-700 uppercase tracking-[0.2em]">
                        MentriQ Intelligence Systems &copy; {new Date().getFullYear()} / Authorized Personnel Only
                    </p>
                </div>
            </div>
        </div >
    );
};

export default AdminLogin;
