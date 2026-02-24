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
    Loader2
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
        address: "Mentriq Technologies, 2nd floor, 34/501, Haldighati Marg E, Sector 3, Pratap Nagar, Sanganer, Jaipur, 302033",
        mapLink: "",
        socialLinks: {
            instagram: "",
            linkedin: "",
            twitter: "",
            whatsapp: ""
        },
        siteStats: {
            students: "",
            courses: "",
            placements: "",
            trainers: ""
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
                    whatsapp: settingsData.socialLinks?.whatsapp || ""
                },
                siteStats: {
                    students: statsData.students || "",
                    courses: statsData.courses || "",
                    placements: statsData.placements || "",
                    trainers: statsData.trainers || ""
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
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            await Promise.all([
                api.put("/settings", {
                    email: formData.email,
                    phone: formData.phone,
                    address: formData.address,
                    mapLink: formData.mapLink,
                    socialLinks: formData.socialLinks
                }),
                api.put("/stats", formData.siteStats)
            ]);
            toast.success("System parameters synchronized");
        } catch {
            toast.error("Synchronization failure");
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
            <div className="bg-[#0f172a]/40 backdrop-blur-xl p-8 rounded-3xl border border-white/5 shadow-2xl relative overflow-hidden group">
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
                    <div className="bg-[#0f172a]/40 backdrop-blur-xl p-10 rounded-[2.5rem] border border-white/5 shadow-xl">
                        <div className="flex items-center gap-4 mb-8">
                            <div className="p-3 bg-emerald-500/10 rounded-2xl border border-emerald-500/20">
                                <Globe size={24} className="text-emerald-400" />
                            </div>
                            <div>
                                <h3 className="text-xl font-extrabold text-white tracking-tight">Entity Identity</h3>
                                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-0.5">Physical & Digital Vectors</p>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Digital Terminal (Email)</label>
                                <div className="relative group">
                                    <Mail className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-emerald-400 transition-colors" size={18} />
                                    <input
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        className="w-full bg-white/5 border border-white/10 rounded-2xl p-5 pl-16 text-white font-bold focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500/30 transition-all"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Voice Uplink (Phone)</label>
                                <div className="relative group">
                                    <Phone className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-emerald-400 transition-colors" size={18} />
                                    <input
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        className="w-full bg-white/5 border border-white/10 rounded-2xl p-5 pl-16 text-white font-bold focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500/30 transition-all"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">HQ Coordinates (Address)</label>
                                <div className="relative group">
                                    <MapPin className="absolute left-6 top-10 text-slate-500 group-focus-within:text-emerald-400 transition-colors" size={18} />
                                    <textarea
                                        name="address"
                                        value={formData.address}
                                        onChange={handleChange}
                                        rows={3}
                                        className="w-full bg-white/5 border border-white/10 rounded-2xl p-5 pl-16 text-white font-bold focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500/30 transition-all resize-none"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Operational Stats */}
                    <div className="bg-[#0f172a]/40 backdrop-blur-xl p-10 rounded-[2.5rem] border border-white/5 shadow-xl">
                        <div className="flex items-center gap-4 mb-8">
                            <div className="p-3 bg-blue-500/10 rounded-2xl border border-blue-500/20">
                                <TrendingUp size={24} className="text-blue-400" />
                            </div>
                            <div>
                                <h3 className="text-xl font-extrabold text-white tracking-tight">Operational Metrics</h3>
                                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-0.5">Platform Performance Logic</p>
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
                                        <stat.icon className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-emerald-400 transition-colors" size={18} />
                                        <input
                                            name={`stat.${stat.key}`}
                                            value={formData.siteStats?.[stat.key]}
                                            onChange={handleChange}
                                            className="w-full bg-white/5 border border-white/10 rounded-2xl p-5 pl-16 text-white font-bold focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500/30 transition-all"
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Social & Maps */}
                <div className="space-y-8">
                    <div className="bg-[#0f172a]/40 backdrop-blur-xl p-10 rounded-[2.5rem] border border-white/5 shadow-xl">
                        <div className="flex items-center gap-4 mb-8">
                            <div className="p-3 bg-purple-500/10 rounded-2xl border border-purple-500/20">
                                <MessageCircle size={24} className="text-purple-400" />
                            </div>
                            <div>
                                <h3 className="text-xl font-extrabold text-white tracking-tight">Social Grid</h3>
                                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-0.5">Network Communication Hub</p>
                            </div>
                        </div>

                        <div className="space-y-6">
                            {[
                                { key: "instagram", label: "Instagram Node", icon: Instagram },
                                { key: "linkedin", label: "LinkedIn Professional", icon: Linkedin },
                                { key: "twitter", label: "X-Network Terminal", icon: Twitter },
                                { key: "whatsapp", label: "WhatsApp Secure", icon: MessageCircle }
                            ].map((social) => (
                                <div key={social.key} className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">{social.label}</label>
                                    <div className="relative group">
                                        <social.icon className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-emerald-400 transition-colors" size={18} />
                                        <input
                                            name={`social.${social.key}`}
                                            value={formData.socialLinks?.[social.key]}
                                            onChange={handleChange}
                                            className="w-full bg-white/5 border border-white/10 rounded-2xl p-5 pl-16 text-white font-bold focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500/30 transition-all"
                                            placeholder="https://..."
                                        />
                                    </div>
                                </div>
                            ))}

                            <div className="space-y-2 pt-4">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Geospatial Embed (Google Maps)</label>
                                <div className="relative group">
                                    <MapPin className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-emerald-400 transition-colors" size={18} />
                                    <input
                                        name="mapLink"
                                        value={formData.mapLink}
                                        onChange={handleChange}
                                        className="w-full bg-white/5 border border-white/10 rounded-2xl p-5 pl-16 text-white font-bold focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500/30 transition-all"
                                        placeholder="Embed URL..."
                                    />
                                </div>
                                <p className="text-[10px] font-bold text-slate-600 mt-2 ml-2">Secure geospatial uplink for frontend data visualization.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default SettingsManagement;
