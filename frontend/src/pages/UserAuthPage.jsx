import React, { useState, useEffect } from 'react';
import { Mail, Lock, User, Eye, EyeOff, ArrowLeft, Shield, Sparkles, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useToast } from '../context/ToastContext';

const UserAuthPage = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: ''
    });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    const { login, register, isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const toast = useToast();

    // Get redirect path from query or state
    const from = location.state?.from?.pathname || '/';

    useEffect(() => {
        if (isAuthenticated) {
            navigate(from, { replace: true });
        }
    }, [isAuthenticated, navigate, from]);

    const validateForm = () => {
        const newErrors = {};
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!formData.email) newErrors.email = 'Email is required';
        else if (!regex.test(formData.email)) newErrors.email = 'Email is invalid';

        if (!formData.password) newErrors.password = 'Password is required';
        else if (formData.password.length < 6)
            newErrors.password = 'Password must be at least 6 characters';

        if (!isLogin && !formData.name) newErrors.name = 'Name is required';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        setLoading(true);
        setErrors({});

        try {
            let result;
            if (isLogin) {
                result = await login(formData.email, formData.password);
            } else {
                result = await register(formData.name, formData.email, formData.password);
            }

            if (result.success) {
                toast.success(isLogin ? "Welcome back!" : "Account created successfully!");
            } else {
                setErrors({ general: result.message });
                toast.error(result.message);
            }
        } catch (error) {
            const msg = error.response?.data?.message || 'Something went wrong';
            setErrors({ general: msg });
            toast.error(msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#020617] text-white flex items-center justify-center p-4 relative overflow-hidden font-sans">
            {/* Background decoration */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-indigo-600/10 rounded-full blur-[120px] animate-pulse" />
                <div className="absolute bottom-0 left-0 w-[800px] h-[800px] bg-cyan-600/10 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '1s' }} />
                <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-[0.03]" />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="relative w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 bg-[#0f172a]/80 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] shadow-2xl overflow-hidden shadow-indigo-500/10"
            >
                {/* Left Side: Branding & Info */}
                <div className="relative p-10 lg:p-14 hidden lg:flex flex-col justify-between overflow-hidden border-r border-white/5 bg-gradient-to-br from-indigo-600/5 to-transparent">
                    {/* Abstract Elements */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl -mr-16 -mt-16" />
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl -ml-16 -mb-16" />

                    <div className="relative z-10">
                        <Link to="/" className="flex items-center gap-3 mb-16 group">
                            <div className="w-12 h-12 rounded-3xl overflow-hidden bg-white flex items-center justify-center shadow-lg shadow-indigo-600/30 group-hover:scale-110 transition-all duration-500">
                                <img src="/images/logo1.jpg" alt="MentriQ" className="w-full h-full object-cover rounded-3xl" />
                            </div>
                            <div>
                                <span className="font-black text-2xl tracking-tighter text-white">MentriQ</span>
                                <p className="text-[10px] font-black uppercase tracking-[0.4em] text-indigo-400 leading-none mt-1">Ecosystem</p>
                            </div>
                        </Link>

                        <div className="space-y-12">
                            <div>
                                <h2 className="text-4xl font-black mb-4 leading-tight">
                                    Start Your Journey <br />
                                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">To Excellence.</span>
                                </h2>
                                <p className="text-gray-400 text-lg leading-relaxed max-w-sm">
                                    Join thousands of students and masters in a professional training environment designed for real-world impact.
                                </p>
                            </div>

                            <div className="space-y-6">
                                {[
                                    { icon: CheckCircle2, text: 'Industry-Lead Certifications', color: 'text-emerald-400' },
                                    { icon: Sparkles, text: 'Exclusive Learning Resources', color: 'text-indigo-400' },
                                    { icon: Shield, text: 'Global Placement Assistance', color: 'text-cyan-400' }
                                ].map((item, idx) => (
                                    <motion.div
                                        key={idx}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ duration: 0.5, delay: 0.5 + idx * 0.1 }}
                                        className="flex items-center gap-4 group"
                                    >
                                        <div className={`w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center ${item.color} group-hover:scale-110 transition-transform`}>
                                            <item.icon size={20} />
                                        </div>
                                        <span className="font-bold text-gray-300 group-hover:text-white transition-colors">{item.text}</span>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="relative z-10 pt-10 border-t border-white/5 flex items-center justify-between">
                        <p className="text-xs text-gray-500 font-bold uppercase tracking-widest">© 2026 MentriQ Tech</p>
                        <div className="flex gap-4">
                            <div className="w-2 h-2 rounded-full bg-indigo-600 animate-pulse" />
                            <div className="w-2 h-2 rounded-full bg-cyan-600 animate-pulse" style={{ animationDelay: '0.5s' }} />
                        </div>
                    </div>
                </div>

                {/* Right Side: Auth Form */}
                <div className="p-8 lg:p-14 flex flex-col justify-center relative">
                    <div className="lg:hidden mb-12 flex flex-col items-center text-center">
                        <div className="w-16 h-16 rounded-3xl overflow-hidden bg-white flex items-center justify-center shadow-2xl shadow-indigo-600/40 mb-6">
                            <img src="/images/logo1.jpg" alt="MentriQ" className="w-full h-full object-cover rounded-3xl" />
                        </div>
                        <h2 className="text-3xl font-black mb-2 text-white">{isLogin ? 'Welcome Back' : 'Create Account'}</h2>
                        <p className="text-gray-400 text-sm">Join the MentriQ Professional Ecosystem</p>
                    </div>

                    <div className="max-w-md mx-auto w-full">
                        <div className="hidden lg:block mb-10">
                            <h3 className="text-3xl font-black text-white mb-2 tracking-tighter">
                                {isLogin ? 'Authentication' : 'Registration'}
                            </h3>
                            <p className="text-gray-500 font-medium">{isLogin ? 'Signing back to your console' : 'Set up your learning identity'}</p>
                        </div>

                        <div className="flex p-1.5 bg-white/5 rounded-2xl border border-white/5 mb-10 backdrop-blur-md">
                            <button
                                onClick={() => setIsLogin(true)}
                                className={`flex-1 py-3.5 rounded-xl font-black text-[10px] uppercase tracking-[0.2em] transition-all duration-500 ${isLogin ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30' : 'text-gray-500 hover:text-gray-300'}`}
                            >
                                Login
                            </button>
                            <button
                                onClick={() => setIsLogin(false)}
                                className={`flex-1 py-3.5 rounded-xl font-black text-[10px] uppercase tracking-[0.2em] transition-all duration-500 ${!isLogin ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30' : 'text-gray-500 hover:text-gray-300'}`}
                            >
                                Register
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <AnimatePresence mode='wait'>
                                {!isLogin && (
                                    <motion.div
                                        key="register-name"
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        exit={{ opacity: 0, height: 0 }}
                                        className="space-y-2 overflow-hidden"
                                    >
                                        <label className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-400 ml-1">Account Holder Name</label>
                                        <div className="relative group">
                                            <User className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-indigo-600 transition-colors" size={20} />
                                            <input
                                                required
                                                type="text"
                                                placeholder="Enter your full name"
                                                value={formData.name}
                                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                                className="w-full pl-14 pr-6 py-4.5 bg-white/5 border border-white/10 rounded-2xl text-white placeholder:text-gray-600 focus:bg-white/10 focus:border-indigo-500 transition-all outline-none font-bold"
                                            />
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-400 ml-1">Email Connection</label>
                                <div className="relative group">
                                    <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-indigo-600 transition-colors" size={20} />
                                    <input
                                        required
                                        type="email"
                                        placeholder="name@domain.com"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        className="w-full pl-14 pr-6 py-4.5 bg-white/5 border border-white/10 rounded-2xl text-white placeholder:text-gray-600 focus:bg-white/10 focus:border-indigo-500 transition-all outline-none font-bold"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <div className="flex justify-between items-center ml-1">
                                    <label className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-400">Security Phrase</label>
                                    {isLogin && <button type="button" className="text-[10px] font-black uppercase tracking-widest text-indigo-500 hover:text-indigo-400">Forgot?</button>}
                                </div>
                                <div className="relative group">
                                    <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-indigo-600 transition-colors" size={20} />
                                    <input
                                        required
                                        type={showPassword ? 'text' : 'password'}
                                        placeholder="••••••••"
                                        value={formData.password}
                                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                        className="w-full pl-14 pr-12 py-4.5 bg-white/5 border border-white/10 rounded-2xl text-white placeholder:text-gray-600 focus:bg-white/10 focus:border-indigo-500 transition-all outline-none font-bold"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-indigo-400 transition-colors"
                                    >
                                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>
                            </div>

                            <div className="pt-4">
                                <button
                                    disabled={loading}
                                    className="w-full relative group overflow-hidden bg-indigo-600 text-white font-black py-5 rounded-2xl shadow-xl shadow-indigo-600/20 hover:bg-indigo-500 transition-all active:scale-95 disabled:opacity-50"
                                >
                                    <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                                    {loading ? (
                                        <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin mx-auto" />
                                    ) : (
                                        <span className="uppercase tracking-[0.3em] text-xs">
                                            {isLogin ? 'Initialize Session' : 'Create Identity'}
                                        </span>
                                    )}
                                </button>
                            </div>

                            <div className="text-center">
                                <p className="text-sm text-gray-500 font-bold">
                                    {isLogin ? "Don't have an account?" : "Already have an identity?"}{' '}
                                    <button
                                        type="button"
                                        onClick={() => setIsLogin(!isLogin)}
                                        className="text-indigo-400 hover:text-cyan-400 transition-colors"
                                    >
                                        {isLogin ? 'Join Ecosystem' : 'Sign In Now'}
                                    </button>
                                </p>
                            </div>
                        </form>

                        <div className="mt-12 flex items-center justify-between opacity-30">
                            <button onClick={() => navigate('/')} className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest hover:text-indigo-400 transition-colors">
                                <ArrowLeft size={14} /> Back to Hub
                            </button>
                            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest">
                                <Shield size={14} /> Encrypted
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default UserAuthPage;
