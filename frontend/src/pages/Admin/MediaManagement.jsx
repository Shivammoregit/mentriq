import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Save, Image as ImageIcon, Loader2, Upload } from 'lucide-react';
import { apiClient as api } from '../../utils/apiClient';
import { useToast } from '../../context/ToastContext';
import { resolveImageUrl } from '../../utils/imageUtils';

const MediaManagement = () => {
    const toast = useToast();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    
    // Store original fetched URLs
    const [originalImages, setOriginalImages] = useState({
        hero: '',
        about: '',
        mission: ''
    });

    // Store File objects representing new uploads
    const [imageFiles, setImageFiles] = useState({
        hero: null,
        about: null,
        mission: null
    });

    // Store Preview Object URLs for unsaved files
    const [previews, setPreviews] = useState({
        hero: null,
        about: null,
        mission: null
    });

    useEffect(() => {
        const fetchImages = async () => {
            try {
                const { data } = await api.get('/settings');
                if (data && data.siteImages) {
                    setOriginalImages({
                        hero: data.siteImages.hero || '',
                        about: data.siteImages.about || '',
                        mission: data.siteImages.mission || ''
                    });
                }
            } catch (error) {
                toast.error("Failed to load global media settings");
            } finally {
                setLoading(false);
            }
        };
        fetchImages();
    }, []);

    const handleFileChange = (key, file) => {
        if (!file) return;
        setImageFiles(prev => ({ ...prev, [key]: file }));
        setPreviews(prev => ({ ...prev, [key]: URL.createObjectURL(file) }));
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            const finalUrls = { ...originalImages };

            // Upload any changed files
            for (const key of ['hero', 'about', 'mission']) {
                if (imageFiles[key]) {
                    const formData = new FormData();
                    formData.append('image', imageFiles[key]);
                    const { data } = await api.post('/upload', formData, {
                        headers: { "Content-Type": "multipart/form-data" }
                    });
                    finalUrls[key] = data.imageUrl;
                }
            }

            // Update settings
            await api.put('/settings', { siteImages: finalUrls });
            
            toast.success("Site Media Updated Successfully");
            setOriginalImages(finalUrls);
            setImageFiles({ hero: null, about: null, mission: null });
            
            // Cleanup object URLs
            Object.values(previews).forEach(url => { if (url) URL.revokeObjectURL(url); });
            setPreviews({ hero: null, about: null, mission: null });

        } catch (error) {
            toast.error("Failed to update media");
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="h-[60vh] flex flex-col items-center justify-center">
                <Loader2 className="w-12 h-12 text-emerald-500 animate-spin mb-4" />
                <p className="text-slate-400 font-black uppercase tracking-widest text-xs">Loading Assets...</p>
            </div>
        );
    }

    const sections = [
        { id: 'hero', title: 'Hero Background/Mascot', desc: 'Main image displayed at the very top of the homepage.' },
        { id: 'about', title: 'About Us Feature', desc: 'Image shown in the About section on the homepage and about page.' },
        { id: 'mission', title: 'Mission & Vision', desc: 'Visual representation shown near the Mission & Impact highlights.' }
    ];

    return (
        <div className="space-y-8 animate-in fade-in duration-500 max-w-7xl mx-auto">
            <div className="bg-[#0b1120]/40 backdrop-blur-xl p-8 rounded-3xl border border-white/5 shadow-2xl relative overflow-hidden flex flex-col md:flex-row gap-6 justify-between items-center">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <ImageIcon size={28} className="text-emerald-400" />
                        <h2 className="text-3xl font-extrabold text-white tracking-tight">Media Management</h2>
                    </div>
                    <p className="text-slate-400 font-medium text-sm">Upload and manage placeholders and static website imagery.</p>
                </div>
                <button
                    onClick={handleSave}
                    disabled={saving}
                    className="bg-emerald-600 text-white hover:bg-emerald-500 px-8 py-4 rounded-xl font-bold flex items-center gap-3 transition-all active:scale-95 shadow-lg shadow-emerald-500/20 text-xs uppercase tracking-widest disabled:opacity-50 whitespace-nowrap"
                >
                    {saving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                    {saving ? "Saving Media..." : "Save All Media"}
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {sections.map(sec => {
                    const currentImg = previews[sec.id] || resolveImageUrl(originalImages[sec.id]);
                    const hasImage = currentImg && currentImg !== 'https://api.null.com/null'; // Simple valid check
                    
                    return (
                        <div key={sec.id} className="bg-[#0b1120]/40 backdrop-blur-xl border border-white/5 rounded-[2rem] p-6 shadow-xl flex flex-col">
                            <h3 className="text-lg font-bold text-white mb-1">{sec.title}</h3>
                            <p className="text-[10px] text-slate-400 uppercase tracking-wider mb-6 leading-relaxed font-bold h-8">{sec.desc}</p>
                            
                            <div className="relative group w-full aspect-video bg-[#1e293b] rounded-2xl border-2 border-dashed border-white/10 overflow-hidden flex flex-col items-center justify-center hover:border-emerald-500/50 transition-all cursor-pointer mt-auto">
                                {hasImage ? (
                                    <img 
                                        src={currentImg} 
                                        alt={sec.title}
                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                        onError={(e) => { e.currentTarget.src = "/images/learning4.jpg"; }}
                                    />
                                ) : (
                                    <div className="flex flex-col items-center text-slate-500 group-hover:text-emerald-400 transition-colors">
                                        <Upload size={32} className="mb-3" />
                                        <span className="text-[10px] uppercase tracking-widest font-black">Click to Upload</span>
                                    </div>
                                )}
                                
                                <label className="absolute inset-0 cursor-pointer w-full h-full opacity-0">
                                    <input 
                                        type="file" 
                                        accept="image/*" 
                                        className="hidden" 
                                        onChange={(e) => handleFileChange(sec.id, e.target.files[0])} 
                                    />
                                </label>

                                {hasImage && (
                                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                                        <div className="flex items-center gap-2 text-white font-bold bg-emerald-500 px-4 py-2 rounded-xl text-xs uppercase tracking-wider">
                                            <Upload size={16} /> Update Image
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default MediaManagement;
