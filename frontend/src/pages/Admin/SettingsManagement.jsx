import React, { useState, useEffect } from "react";
import { apiClient as api } from "../../utils/apiClient";
import {
    Save,
    Mail,
    Phone,
    MapPin,
    Globe,
    Instagram,
    Linkedin,
    Twitter,
    MessageCircle,
    TrendingUp,
    Users,
    Cpu,
    ShieldCheck,
    Settings,
    CheckCircle,
    Loader2,
    Facebook,
    Percent,
    Clock,
    Megaphone,
    Power
} from "lucide-react";
import { useToast } from "../../context/ToastContext";
import { motion } from "framer-motion";

const SettingsManagement = () => {
    const toast = useToast();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [formData, setFormData] = useState({
        email: "",
        phone: "",
        address: "MentriQ Technologies, 2nd floor, 34/501, Haldighati Marg E, Sanganer, Sector 3, Pratap Nagar, Jaipur, Rajasthan 302033",
        mapLink: "https://www.google.com/maps/place/MentriQ+Technologies/@26.8020093,75.4882598,10z/data=!4m22!1m15!4m14!1m6!1m2!1s0x396dcb31ccbce14d:0x9f153a03ffb8fdd0!2sMentriQ+Technologies,+2nd+floor,+34%2F501,+Haldighati+Marg+E,+Sanganer,+Sector+3,+Pratap+Nagar,+Jaipur,+Rajasthan+302033!2m2!1d75.8047414!2d26.8023101!1m6!1m2!1s0x396dcb31ccbce14d:0x9f153a03ffb8fdd0!2sMentriQ+Technologies,+2nd+floor,+34%2F501,+Haldighati+Marg+E,+Sanganer,+Sector+3,+Pratap+Nagar,+Jaipur,+Rajasthan+302033!2m2!1d75.8047414!2d26.8023101!3m5!1s0x396dcb31ccbce14d:0x9f153a03ffb8fdd0!8m2!3d26.8023101!4d75.8047414!16s%2Fg%2F11yy2ld3gd?entry=ttu&g_ep=EgoyMDI2MDMxOC4xIKXMDSoASAFQAw%3D%3D",
        socialLinks: {
            instagram: "",
            linkedin: "",
            twitter: "",
            whatsapp: "",
            facebook: ""
        },
        siteStats: {
            students: "",
            courses: "",
            placements: "",
            trainers: ""
        },
        promo: {
            isActive: false,
            discountPercentage: 0,
            endDate: "",
            title: "Special Discount!",
            appliesTo: { courses: true, internships: false }
        },
        internshipPromo: {
            isActive: false,
            discountPercentage: 0,
            endDate: "",
            title: "Internship Discount!"
        },
        ticker: {
            isActive: false,
            message: "",
            highlight: "",
            showOnAllPages: true
        }
    });

    useEffect(() => {
        fetchSettings();
        const interval = setInterval(fetchSettings, 15000);
        return () => clearInterval(interval);
    }, []);

    const fetchSettings = async () => {
        try {
            const [{ data: settingsData }, { data: statsData }] = await Promise.all([
                api.get("/settings"),
                api.get("/stats")
            ]);

            setFormData({
                email: settingsData.email || "",
                phone: settingsData.phone || "",
                address: settingsData.address || "",
                mapLink: settingsData.mapLink || "",
                socialLinks: {
                    instagram: settingsData.socialLinks?.instagram || "",
                    linkedin: settingsData.socialLinks?.linkedin || "",
                    twitter: settingsData.socialLinks?.twitter || "",
                    whatsapp: settingsData.socialLinks?.whatsapp || "",
                    facebook: settingsData.socialLinks?.facebook || ""
                },
                siteStats: {
                    students: statsData.students || "",
                    courses: statsData.courses || "",
                    placements: statsData.placements || "",
                    trainers: statsData.trainers || ""
                },
                promo: {
                    isActive: settingsData.promo?.isActive || false,
                    discountPercentage: settingsData.promo?.discountPercentage || 0,
                    endDate: settingsData.promo?.endDate ? new Date(settingsData.promo.endDate).toISOString().slice(0, 16) : "",
                    title: settingsData.promo?.title || "Special Discount!",
                    appliesTo: {
                        courses: settingsData.promo?.appliesTo?.courses !== false,
                        internships: settingsData.promo?.appliesTo?.internships || false
                    }
                },
                internshipPromo: {
                    isActive: settingsData.internshipPromo?.isActive || false,
                    discountPercentage: settingsData.internshipPromo?.discountPercentage || 0,
                    endDate: settingsData.internshipPromo?.endDate ? new Date(settingsData.internshipPromo.endDate).toISOString().slice(0, 16) : "",
                    title: settingsData.internshipPromo?.title || "Internship Discount!"
                },
                ticker: {
                    isActive: settingsData.ticker?.isActive || false,
                    message: settingsData.ticker?.message || "",
                    highlight: settingsData.ticker?.highlight || "",
                    showOnAllPages: settingsData.ticker?.showOnAllPages !== false
                }
            });
        } catch (error) {
            console.error("Failed to fetch settings/stats", error);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name.startsWith("social.")) {
            const socialKey = name.split(".")[1];
            setFormData(prev => ({
                ...prev,
                socialLinks: { ...prev.socialLinks, [socialKey]: value }
            }));
        } else if (name.startsWith("stat.")) {
            const statKey = name.split(".")[1];
            setFormData(prev => ({
                ...prev,
                siteStats: { ...prev.siteStats, [statKey]: value }
            }));
        } else if (name.startsWith("promo.")) {
            const promoKey = name.split(".")[1];
            if (promoKey === 'appliesTo') {
                const applyKey = name.split(".")[2];
                setFormData(prev => ({
                    ...prev,
                    promo: {
                        ...prev.promo,
                        appliesTo: { ...prev.promo.appliesTo, [applyKey]: e.target.checked }
                    }
                }));
            } else {
                setFormData(prev => ({
                    ...prev,
                    promo: { 
                        ...prev.promo, 
                        [promoKey]: e.target.type === 'checkbox' ? e.target.checked : value 
                    }
                }));
            }
        } else if (name.startsWith("ticker.")) {
            const tickerKey = name.split(".")[1];
            setFormData(prev => ({
                ...prev,
                ticker: {
                    ...prev.ticker,
                    [tickerKey]: e.target.type === "checkbox" ? e.target.checked : value
                }
            }));
        } else if (name.startsWith("internshipPromo.")) {
            const promoKey = name.split(".")[1];
            setFormData(prev => ({
                ...prev,
                internshipPromo: {
                    ...prev.internshipPromo,
                    [promoKey]: e.target.type === "checkbox" ? e.target.checked : value
                }
            }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            await api.put("/settings", {
                email: formData.email,
                phone: formData.phone,
                address: formData.address,
                mapLink: formData.mapLink,
                socialLinks: formData.socialLinks,
                promo: formData.promo,
                internshipPromo: formData.internshipPromo,
                ticker: formData.ticker
            });

            try {
                await api.put("/stats", formData.siteStats);
                toast.success("System parameters synchronized");
            } catch (statsError) {
                console.error("Stats update failed:", statsError);
                toast.success("Settings saved. Stats update failed.");
            }
        } catch (error) {
            console.error("Settings update failed:", error);
            toast.error(error?.response?.data?.message || "Failed to save settings");
        } finally {
            setSaving(false);
        }
    };

    const handleDisableAllFeatures = async () => {
        setSaving(true);
        try {
            const disabledPayload = {
                ...formData,
                promo: {
                    ...formData.promo,
                    isActive: false,
                    endDate: "",
                    discountPercentage: 0
                },
                internshipPromo: {
                    ...formData.internshipPromo,
                    isActive: false,
                    endDate: "",
                    discountPercentage: 0
                },
                ticker: {
                    ...formData.ticker,
                    isActive: false,
                    message: "",
                    highlight: ""
                }
            };

            await api.put("/settings", {
                email: disabledPayload.email,
                phone: disabledPayload.phone,
                address: disabledPayload.address,
                mapLink: disabledPayload.mapLink,
                socialLinks: disabledPayload.socialLinks,
                promo: disabledPayload.promo,
                internshipPromo: disabledPayload.internshipPromo,
                ticker: disabledPayload.ticker
            });

            setFormData(disabledPayload);
            toast.success("All discount and ticker features disabled");
        } catch (error) {
            console.error("Disable all features failed:", error);
            toast.error(error?.response?.data?.message || "Failed to disable all features");
        } finally {
            setSaving(false);
        }
    };

    if (loading) return (
        <div className="h-[60vh] flex items-center justify-center">
            <Loader2 className="w-12 h-12 text-emerald-500 animate-spin" />
        </div>
    );

    return (
        <div className="space-y-8 animate-in fade-in duration-500 max-w-7xl mx-auto">
            {/* Page Header */}
            <div className="bg-[#0b1120]/40 backdrop-blur-xl p-8 rounded-3xl border border-white/5 shadow-2xl relative overflow-hidden group">
                <div className="flex flex-col lg:flex-row gap-8 lg:items-center lg:justify-between relative z-10">
                    <div>
                        <div className="flex items-center gap-3 mb-1">
                            <Settings size={28} className="text-emerald-400" />
                            <h2 className="text-3xl font-extrabold text-white tracking-tight">Core Infrastructure</h2>
                        </div>
                        <p className="text-slate-400 font-medium text-sm">System-wide configurations and operational parameters.</p>
                    </div>

                    <button
                        form="settings-form"
                        type="submit"
                        disabled={saving}
                        className="bg-emerald-600 text-white hover:bg-emerald-500 px-10 py-4 rounded-xl font-bold flex items-center gap-3 transition-all active:scale-95 shadow-lg shadow-emerald-500/20 text-[10px] uppercase tracking-widest justify-center disabled:opacity-50"
                    >
                        {saving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                        <span>{saving ? "Synchronizing..." : "Synchronize System"}</span>
                    </button>
                </div>
            </div>

            <form id="settings-form" onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Contact & Physical Info */}
                <div className="space-y-8">
                    <div className="bg-[#0b1120]/40 backdrop-blur-xl p-10 rounded-[2.5rem] border border-white/5 shadow-xl">
                        <div className="flex items-center gap-4 mb-8">
                            <div className="p-3 bg-emerald-500/10 rounded-2xl border border-emerald-500/20">
                                <Globe size={24} className="text-emerald-400" />
                            </div>
                            <div>
                                <h3 className="text-xl font-extrabold text-white tracking-tight">Entity Identity</h3>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-0.5">Physical & Digital Vectors</p>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Digital Terminal (Email)</label>
                                <div className="relative group">
                                    <Mail className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-400 transition-colors" size={18} />
                                    <input
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        className="w-full bg-[#1e293b] border border-white/10 rounded-2xl p-5 pl-16 text-white font-bold focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500/30 transition-all"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Voice Uplink (Phone)</label>
                                <div className="relative group">
                                    <Phone className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-400 transition-colors" size={18} />
                                    <input
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        className="w-full bg-[#1e293b] border border-white/10 rounded-2xl p-5 pl-16 text-white font-bold focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500/30 transition-all"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">HQ Coordinates (Address)</label>
                                <div className="relative group">
                                    <MapPin className="absolute left-6 top-10 text-slate-400 group-focus-within:text-emerald-400 transition-colors" size={18} />
                                    <textarea
                                        name="address"
                                        value={formData.address}
                                        onChange={handleChange}
                                        rows={3}
                                        className="w-full bg-[#1e293b] border border-white/10 rounded-2xl p-5 pl-16 text-white font-bold focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500/30 transition-all resize-none"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Operational Stats */}
                    <div className="bg-[#0b1120]/40 backdrop-blur-xl p-10 rounded-[2.5rem] border border-white/5 shadow-xl">
                        <div className="flex items-center gap-4 mb-8">
                            <div className="p-3 bg-blue-500/10 rounded-2xl border border-blue-500/20">
                                <TrendingUp size={24} className="text-blue-400" />
                            </div>
                            <div>
                                <h3 className="text-xl font-extrabold text-white tracking-tight">Operational Metrics</h3>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-0.5">Platform Performance Logic</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-6">
                            {[
                                { key: "students", label: "Student Nodes", icon: Users },
                                { key: "courses", label: "Academic Modules", icon: ShieldCheck },
                                { key: "placements", label: "Career Success", icon: TrendingUp },
                                { key: "trainers", label: "Expert Core", icon: Cpu }
                            ].map((stat) => (
                                <div key={stat.key} className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">{stat.label}</label>
                                    <div className="relative group">
                                        <stat.icon className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-400 transition-colors" size={18} />
                                        <input
                                            name={`stat.${stat.key}`}
                                            value={formData.siteStats?.[stat.key]}
                                            onChange={handleChange}
                                            className="w-full bg-[#1e293b] border border-white/10 rounded-2xl p-5 pl-16 text-white font-bold focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500/30 transition-all"
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    
                    {/* Promo & Discount Control */}
                    <div className="bg-[#0b1120]/40 backdrop-blur-xl p-10 rounded-[2.5rem] border border-emerald-500/20 shadow-[0_0_30px_rgba(16,185,129,0.1)]">
                        <div className="flex items-center gap-4 mb-8">
                            <div className="p-3 bg-emerald-500/20 rounded-2xl border border-emerald-400/40">
                                <Percent size={24} className="text-emerald-400" />
                            </div>
                            <div>
                                <h3 className="text-xl font-extrabold text-white tracking-tight">Global Discount</h3>
                                <p className="text-[10px] font-black text-emerald-400/80 uppercase tracking-widest mt-0.5">Platform-wide Course Offers</p>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div className="flex items-center justify-between p-4 bg-[#1e293b] rounded-2xl border border-white/10">
                                <div>
                                    <h4 className="text-sm font-bold text-white">Activate Global Discount</h4>
                                    <p className="text-[10px] text-slate-400 uppercase tracking-widest mt-1">Apply to selected programs automatically</p>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input 
                                        type="checkbox" 
                                        name="promo.isActive" 
                                        checked={formData.promo.isActive} 
                                        onChange={handleChange} 
                                        className="sr-only peer" 
                                    />
                                    <div className="w-14 h-7 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-emerald-500"></div>
                                </label>
                            </div>

                            {/* Apply To Checklist */}
                            <div className={`p-4 bg-[#1e293b] rounded-2xl border border-white/10 transition-all duration-300 ${!formData.promo.isActive ? 'opacity-40 pointer-events-none' : ''}`}>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Apply Discount To</p>
                                <div className="grid grid-cols-2 gap-3">
                                    {[
                                        { key: 'courses', label: 'Courses', icon: '📚' },
                                        { key: 'internships', label: 'Internships', icon: '💼' }
                                    ].map(({ key, label, icon }) => (
                                        <label
                                            key={key}
                                            className={`flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition-all ${
                                                formData.promo.appliesTo?.[key]
                                                    ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-400'
                                                    : 'bg-[#0b1120] border-white/5 text-slate-400 hover:border-white/20'
                                            }`}
                                        >
                                            <input
                                                type="checkbox"
                                                name={`promo.appliesTo.${key}`}
                                                checked={formData.promo.appliesTo?.[key] || false}
                                                onChange={handleChange}
                                                className="w-4 h-4 rounded accent-emerald-500"
                                            />
                                            <span className="text-base">{icon}</span>
                                            <span className="text-xs font-black uppercase tracking-wider">{label}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            <div className={`grid grid-cols-1 md:grid-cols-2 gap-6 transition-all duration-300 ${!formData.promo.isActive ? 'opacity-50 pointer-events-none' : ''}`}>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Discount %</label>
                                    <div className="relative group">
                                        <Percent className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-400" size={16} />
                                        <input
                                            type="number"
                                            name="promo.discountPercentage"
                                            value={formData.promo.discountPercentage}
                                            onChange={handleChange}
                                            className="w-full bg-[#1e293b] border border-emerald-500/20 rounded-2xl p-4 pl-12 text-white font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                            min="0" max="100"
                                        />
                                    </div>
                                </div>
                                
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Time Limit (End Date)</label>
                                    <div className="relative group">
                                        <Clock className="absolute left-4 top-1/2 -translate-y-1/2 text-orange-400" size={16} />
                                        <input
                                            type="datetime-local"
                                            name="promo.endDate"
                                            value={formData.promo.endDate}
                                            onChange={handleChange}
                                            className="w-full bg-[#1e293b] border border-orange-500/20 rounded-2xl p-4 pl-12 text-white font-bold focus:outline-none focus:ring-2 focus:ring-orange-500 [color-scheme:dark]"
                                        />
                                    </div>
                                </div>
                            </div>
                            
                            <div className={`space-y-2 transition-all duration-300 ${!formData.promo.isActive ? 'opacity-50 pointer-events-none' : ''}`}>
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Banner Title</label>
                                <input
                                    name="promo.title"
                                    value={formData.promo.title}
                                    onChange={handleChange}
                                    className="w-full bg-[#1e293b] border border-emerald-500/20 rounded-2xl p-4 text-white font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                    placeholder="e.g. Navratri Special Offer!"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Website Ticker Control */}
                    <div className="bg-[#0b1120]/40 backdrop-blur-xl p-10 rounded-[2.5rem] border border-cyan-500/20 shadow-[0_0_30px_rgba(6,182,212,0.1)]">
                        <div className="flex items-center gap-4 mb-8">
                            <div className="p-3 bg-cyan-500/20 rounded-2xl border border-cyan-400/40">
                                <Megaphone size={24} className="text-cyan-300" />
                            </div>
                            <div>
                                <h3 className="text-xl font-extrabold text-white tracking-tight">Website Ticker</h3>
                                <p className="text-[10px] font-black text-cyan-300/80 uppercase tracking-widest mt-0.5">Global Announcement Bar</p>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div className="flex items-center justify-between p-4 bg-[#1e293b] rounded-2xl border border-white/10">
                                <div>
                                    <h4 className="text-sm font-bold text-white">Enable Ticker</h4>
                                    <p className="text-[10px] text-slate-400 uppercase tracking-widest mt-1">Show custom message on website</p>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        name="ticker.isActive"
                                        checked={formData.ticker.isActive}
                                        onChange={handleChange}
                                        className="sr-only peer"
                                    />
                                    <div className="w-14 h-7 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-cyan-500"></div>
                                </label>
                            </div>

                            <div className={`space-y-2 transition-all duration-300 ${!formData.ticker.isActive ? "opacity-50 pointer-events-none" : ""}`}>
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Message</label>
                                <input
                                    name="ticker.message"
                                    value={formData.ticker.message}
                                    onChange={handleChange}
                                    className="w-full bg-[#1e293b] border border-cyan-500/20 rounded-2xl p-4 text-white font-bold focus:outline-none focus:ring-2 focus:ring-cyan-500"
                                    placeholder="e.g. Admissions open for April batch"
                                />
                            </div>

                            <div className={`space-y-2 transition-all duration-300 ${!formData.ticker.isActive ? "opacity-50 pointer-events-none" : ""}`}>
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Highlight (Optional)</label>
                                <input
                                    name="ticker.highlight"
                                    value={formData.ticker.highlight}
                                    onChange={handleChange}
                                    className="w-full bg-[#1e293b] border border-cyan-500/20 rounded-2xl p-4 text-white font-bold focus:outline-none focus:ring-2 focus:ring-cyan-500"
                                    placeholder="e.g. Apply Now"
                                />
                            </div>

                            <label className={`flex items-center gap-3 p-4 rounded-xl border transition-all ${formData.ticker.isActive ? "bg-cyan-500/10 border-cyan-500/30 text-cyan-200" : "bg-[#1e293b] border-white/10 text-slate-400"}`}>
                                <input
                                    type="checkbox"
                                    name="ticker.showOnAllPages"
                                    checked={formData.ticker.showOnAllPages}
                                    onChange={handleChange}
                                    className="w-4 h-4 rounded accent-cyan-500"
                                />
                                <span className="text-xs font-black uppercase tracking-wider">Show on all pages (not only courses/internships)</span>
                            </label>
                        </div>
                    </div>
                </div>

                {/* Social & Maps */}
                <div className="space-y-8">
                    {/* Feature Controls */}
                    <div className="bg-[#0b1120]/40 backdrop-blur-xl p-10 rounded-[2.5rem] border border-rose-500/20 shadow-[0_0_30px_rgba(244,63,94,0.08)]">
                        <div className="flex items-center gap-4 mb-8">
                            <div className="p-3 bg-rose-500/20 rounded-2xl border border-rose-400/40">
                                <Power size={24} className="text-rose-300" />
                            </div>
                            <div>
                                <h3 className="text-xl font-extrabold text-white tracking-tight">Feature Controls</h3>
                                <p className="text-[10px] font-black text-rose-300/80 uppercase tracking-widest mt-0.5">Master control for ticker and all discounts</p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            {[
                                { label: "Course Global Discount", active: formData.promo.isActive, tone: "emerald" },
                                { label: "Internship Global Discount", active: formData.internshipPromo.isActive, tone: "amber" },
                                { label: "Website Ticker", active: formData.ticker.isActive, tone: "cyan" }
                            ].map((item) => (
                                <div key={item.label} className="flex items-center justify-between rounded-xl border border-white/10 bg-[#1e293b] px-4 py-3">
                                    <span className="text-xs font-black uppercase tracking-[0.15em] text-slate-200">{item.label}</span>
                                    <span
                                        className={`rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-wider ${
                                            item.active ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30" : "bg-slate-700 text-slate-300 border border-slate-600"
                                        }`}
                                    >
                                        {item.active ? "Active" : "Disabled"}
                                    </span>
                                </div>
                            ))}
                        </div>

                        <button
                            type="button"
                            onClick={handleDisableAllFeatures}
                            disabled={saving}
                            className="mt-6 w-full bg-rose-600 text-white hover:bg-rose-500 py-4 rounded-xl font-black text-[10px] uppercase tracking-[0.2em] disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                            {saving ? <Loader2 size={16} className="animate-spin" /> : <Power size={16} />}
                            <span>Disable Everything</span>
                        </button>
                    </div>

                    <div className="bg-[#0b1120]/40 backdrop-blur-xl p-10 rounded-[2.5rem] border border-white/5 shadow-xl">
                        <div className="flex items-center gap-4 mb-8">
                            <div className="p-3 bg-purple-500/10 rounded-2xl border border-purple-500/20">
                                <MessageCircle size={24} className="text-purple-400" />
                            </div>
                            <div>
                                <h3 className="text-xl font-extrabold text-white tracking-tight">Social Grid</h3>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-0.5">Network Communication Hub</p>
                            </div>
                        </div>

                        <div className="space-y-6">
                            {[
                                { key: "instagram", label: "Instagram Node", icon: Instagram },
                                { key: "linkedin", label: "LinkedIn Professional", icon: Linkedin },
                                { key: "twitter", label: "X-Network Terminal", icon: Twitter },
                                { key: "whatsapp", label: "WhatsApp Secure", icon: MessageCircle },
                                { key: "facebook", label: "Facebook Page", icon: Facebook }
                            ].map((social) => {
                                const Icon = social.icon;
                                return (
                                    <div key={social.key} className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">{social.label}</label>
                                        <div className="relative group">
                                            {typeof Icon === 'function' ? <div className="absolute left-6 top-1/2 -translate-y-1/2"><Icon /></div> : <Icon className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-400 transition-colors" size={18} />}
                                            <input
                                                name={`social.${social.key}`}
                                                value={formData.socialLinks?.[social.key]}
                                                onChange={handleChange}
                                                className="w-full bg-[#1e293b] border border-white/10 rounded-2xl p-5 pl-16 text-white font-bold focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500/30 transition-all"
                                                placeholder="https://..."
                                            />
                                        </div>
                                    </div>
                                );
                            })}

                            <div className="space-y-2 pt-4">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Geospatial Embed (Google Maps)</label>
                                <div className="relative group">
                                    <MapPin className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-400 transition-colors" size={18} />
                                    <input
                                        name="mapLink"
                                        value={formData.mapLink}
                                        onChange={handleChange}
                                        className="w-full bg-[#1e293b] border border-white/10 rounded-2xl p-5 pl-16 text-white font-bold focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500/30 transition-all"
                                        placeholder="Embed URL..."
                                    />
                                </div>
                                <p className="text-[10px] font-bold text-slate-400 mt-2 ml-2">Secure geospatial uplink for frontend data visualization.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default SettingsManagement;
