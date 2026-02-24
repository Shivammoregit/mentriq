import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { apiClient as api } from '../../utils/apiClient';
import { resolveImageUrl } from '../../utils/imageUtils';

const MotionDiv = motion.div;

const FALLBACK_PARTNERS = [];

const PartnersSection = () => {
    const [partners, setPartners] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPartners = async () => {
            try {
                const { data } = await api.get('/partners');
                if (Array.isArray(data) && data.length > 0) {
                    setPartners(data);
                } else {
                    setPartners(FALLBACK_PARTNERS);
                }
            } catch (error) {
                console.error("Failed to fetch partners", error);
                setPartners(FALLBACK_PARTNERS);
            } finally {
                setLoading(false);
            }
        };

        fetchPartners();
    }, []);

    const displayPartners = partners.length > 0 ? partners : FALLBACK_PARTNERS;

    return (
        <section className="py-16 bg-[#0f172a] overflow-hidden relative">
            {/* Background Glows */}
            <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-12 relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="inline-block"
                >
                    <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-[10px] font-black uppercase tracking-[0.3em] mb-4 mx-auto w-fit">
                        <div className="w-1 h-1 rounded-full bg-indigo-400 animate-pulse" />
                        Trusted Network
                    </div>
                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-white mb-4 tracking-tight">
                        Our Hiring <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">Partners</span>
                    </h2>
                    <p className="text-gray-400 max-w-2xl mx-auto text-base leading-relaxed">
                        Empowering careers by connecting our talent with industry leaders worldwide.
                    </p>
                </motion.div>
            </div>

            <div className="relative w-full overflow-hidden flex flex-col gap-6">
                {/* Edge Blur Masks */}
                <div className="absolute inset-y-0 left-0 w-48 bg-gradient-to-r from-[#0f172a] via-[#0f172a]/80 to-transparent z-10 pointer-events-none" />
                <div className="absolute inset-y-0 right-0 w-48 bg-gradient-to-l from-[#0f172a] via-[#0f172a]/80 to-transparent z-10 pointer-events-none" />

                {/* Top Row: Scroll Left */}
                <div className="flex overflow-hidden py-8">
                    <MotionDiv
                        className="flex gap-10 px-5 w-max"
                        animate={{ x: ["0%", "-50%"] }}
                        transition={{
                            repeat: Infinity,
                            duration: 50,
                            ease: "linear",
                        }}
                    >
                        {[...displayPartners, ...displayPartners].map((partner, index) => (
                            <PartnerCard key={`top-${index}`} partner={partner} />
                        ))}
                    </MotionDiv>
                </div>

                {/* Bottom Row: Scroll Right */}
                <div className="flex overflow-hidden py-8">
                    <MotionDiv
                        className="flex gap-10 px-5 w-max"
                        animate={{ x: ["-50%", "0%"] }}
                        transition={{
                            repeat: Infinity,
                            duration: 55,
                            ease: "linear",
                        }}
                    >
                        {[...displayPartners, ...displayPartners].map((partner, index) => (
                            <PartnerCard key={`bottom-${index}`} partner={partner} />
                        ))}
                    </MotionDiv>
                </div>
            </div>
        </section>
    );
};

const PartnerCard = ({ partner }) => (
    <div
        className="group relative flex flex-col items-center justify-center min-w-[200px] aspect-[16/11] p-5 bg-white/[0.03] backdrop-blur-md border border-white/10 rounded-[1.5rem] hover:bg-white/[0.08] hover:border-indigo-500/40 transition-all duration-700 overflow-hidden shadow-2xl hover:shadow-indigo-500/10 cursor-pointer"
    >
        {/* Animated Reveal Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 via-transparent to-cyan-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

        {/* Card Content */}
        <div className="relative z-10 flex flex-col items-center gap-4">
            <div className="h-10 w-full flex items-center justify-center p-1">
                <img
                    src={resolveImageUrl(partner.logo)}
                    alt={partner.name}
                    className="max-h-full max-w-full object-contain filter grayscale opacity-40 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700 transform group-hover:scale-110"
                    onError={(e) => e.target.src = "https://via.placeholder.com/150?text=Logo"}
                />
            </div>

            {/* Divider */}
            <div className="w-12 h-[1px] bg-white/10 group-hover:w-20 group-hover:bg-indigo-500/30 transition-all duration-700" />

            <div className="flex flex-col items-center">
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] group-hover:text-white transition-colors">
                    {partner.name}
                </span>
                <span className="text-[8px] font-bold text-indigo-400/0 group-hover:text-indigo-400 transition-all duration-700 uppercase tracking-widest mt-1">
                    Verified Partner
                </span>
            </div>
        </div>

        {/* Shine Animation */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out" />
    </div>
);

export default PartnersSection;
