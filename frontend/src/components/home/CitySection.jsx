import React, { useEffect, useState, useMemo } from 'react';

import { MapPin, Navigation, Sparkles, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { apiClient } from '../../utils/apiClient';
import { resolveImageUrl } from '../../utils/imageUtils';

const CityHubCard = ({ city, scrollX, index, totalItems }) => {
    const navigate = useNavigate();
    const CARD_WIDTH = 280;
    const GAP = 30;
    const FULL_STEP = CARD_WIDTH + GAP;

    const x = useTransform(scrollX, (v) => {
        let cardBaseX = index * FULL_STEP;
        let position = (v + cardBaseX) % (totalItems * FULL_STEP);
        if (position < 0) position += (totalItems * FULL_STEP);
        return position - (totalItems * FULL_STEP) / 2;
    });

    const springConfig = { damping: 45, stiffness: 350, mass: 0.5 };

    const rawScale = useTransform(x, [-600, -250, 0, 250, 600], [0.6, 0.7, 1.05, 0.7, 0.6]);
    const scale = useSpring(rawScale, springConfig);

    const rawOpacity = useTransform(x, [-1000, -600, 0, 600, 1000], [0, 0.2, 1, 0.2, 0]);
    const opacity = useSpring(rawOpacity, springConfig);

    const rawBrightness = useTransform(x, [-400, 0, 400], [0.8, 1, 0.8]);
    const brightness = useSpring(rawBrightness, springConfig);

    const grayscale = useTransform(x, [-300, -150, 0, 150, 300], [100, 40, 0, 40, 100]);
    const filterStyle = useTransform([brightness, grayscale], ([b, g]) => `brightness(${b}) grayscale(${g}%)`);

    const zIndex = useTransform(x, [-200, 0, 200], [10, 60, 10]);

    return (
        <div
            style={{
                x,
                scale,
                opacity,
                zIndex,
                filter: filterStyle,
                willChange: "transform, opacity, filter"
            }}
            whileHover={{
                scale: 1.05,
                rotateY: 12,
                rotateX: -5,
                zIndex: 100,
                transition: { duration: 0.5, ease: [0.23, 1, 0.32, 1] }
            }}
            onClick={() => navigate('/contact')}
            className="absolute h-[380px] w-[280px] rounded-[2.5rem] overflow-hidden group bg-[#070b14] border border-white/10 shadow-[0_30px_70px_-15px_rgba(0,0,0,0.6)] cursor-pointer perspective-2000"
        >
            {/* Full-Bleed Background Image */}
            <div className="absolute inset-0 z-0">
                <img
                    src={resolveImageUrl(city.image)}
                    alt={city.name}
                    className="w-full h-full object-cover transition-all duration-[1.5s] group-hover:scale-110 opacity-60 group-hover:opacity-100"
                    onError={(e) => { e.currentTarget.src = "https://via.placeholder.com/400x600?text=Centre"; }}
                />
                {/* Dark Gradient Scrim for Legibility */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#070b14] via-[#070b14]/40 to-transparent opacity-80" />
            </div>

            {/* Inner High-Glow Border */}
            <div className="absolute inset-px rounded-[2.5rem] border border-white/10 group-hover:border-indigo-500/30 transition-colors z-20 pointer-events-none" />

            {/* Hub Status Badge */}
            <div className="absolute top-6 left-6 z-20">
                <div className="px-3 py-1.5 bg-[#070b14]/80 backdrop-blur-md rounded-xl border border-white/10 flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
                    <span className="text-[8px] font-black text-white uppercase tracking-[0.2em] font-display">Admission Open</span>
                </div>
            </div>

            {/* Content Container */}
            <div className="absolute inset-x-0 bottom-0 p-8 z-20 text-center">
                <div
                    }
                    }
                    className="flex flex-col items-center"
                >
                    <div className="inline-flex items-center gap-2 mb-3 text-indigo-400">
                        <MapPin size={12} strokeWidth={3} />
                        <span className="text-[9px] font-black uppercase tracking-[0.3em] font-display">Regional Centre</span>
                    </div>

                    <h3 className="text-3xl font-black text-white mb-3 tracking-tighter uppercase font-display group-hover:text-indigo-400 transition-colors leading-none">
                        {city.name}
                    </h3>

                    <p className="text-[13px] text-slate-300 leading-relaxed line-clamp-2 px-2 font-medium italic opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-500">
                        "{city.description || "Architecting digital excellence through state-of-the-art technical nodes."}"
                    </p>

                    <div
                        className="mt-6 flex items-center gap-2 px-5 py-2.5 bg-indigo-600/90 rounded-2xl text-white text-[10px] font-black uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-all duration-700 pointer-events-none"
                    >
                        <span>Explore</span>
                        <ArrowRight size={14} strokeWidth={3} />
                    </div>
                </div>
            </div>

            {/* Technical HUD Scanline */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%)] bg-[length:100%_4px] pointer-events-none opacity-[0.05] z-10" />

            {/* Animated Highlight Line */}
            <div
                className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent z-30"
                }
                }
                }
            />
        </div>
    );
};

const CitySection = () => {
    const [cities, setCities] = useState([]);
    const [loading, setLoading] = useState(true);

    const rawScrollX = useMotionValue(0);
    const scrollX = useSpring(rawScrollX, { damping: 50, stiffness: 400, mass: 0.5 });

    useEffect(() => {
        const fetchCities = async () => {
            try {
                const { data } = await apiClient.get('/cities');
                if (Array.isArray(data) && data.length > 0) {
                    setCities(data);
                }
            } catch (error) {
                console.error('Failed to fetch cities:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchCities();
    }, []);

    useAnimationFrame((t, d) => {
        const moveBy = -1.2 * (d / 16);
        rawScrollX.set(rawScrollX.get() + moveBy);
    });

    const displayCities = cities;
    const extendedCities = useMemo(() => {
        if (!displayCities.length) return [];
        return [...displayCities, ...displayCities];
    }, [displayCities]);

    if (loading) {
        return (
            <div className="py-20 bg-[#070b14] flex flex-col items-center justify-center gap-4">
                <div className="w-10 h-10 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin" />
                <span className="text-indigo-400 font-black uppercase tracking-[0.4em] text-[9px]">Mapping Infrastructure...</span>
            </div>
        );
    }

    return (
        <section className="py-16 bg-[#070b14] relative overflow-hidden group/section">
            {/* Advanced Atmospheric Background */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <div className="absolute -top-[10%] left-1/4 w-[600px] h-[600px] bg-indigo-600/10 rounded-full blur-[160px] animate-pulse" />
                <div className="absolute -bottom-[10%] right-1/4 w-[600px] h-[600px] bg-cyan-600/10 rounded-full blur-[160px]" style={{ animationDelay: '2s' }} />

                {/* High-Contrast Technical Grid */}
                <div className="absolute inset-0 opacity-[0.05]" style={{
                    backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
                    backgroundSize: '80px 80px'
                }} />
            </div>

            <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
                <div
                    }
                    }
                    }
                    className="mb-16"
                >
                    <h2 className="text-5xl md:text-7xl font-black text-white tracking-tighter leading-[0.85] mb-6 uppercase font-display">
                        GLOBAL <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-cyan-400">DEPLOYMENT AREA.</span>
                    </h2>

                    <p className="text-slate-400 text-lg font-medium leading-relaxed max-w-2xl mx-auto opacity-90">
                        Bridging the gap between theory and <span className="text-white italic underline decoration-indigo-500/50 decoration-4">real-world execution</span> through high-performance hubs across India.
                    </p>
                </div>

                {/* SCROLLER AREA WITH CENTER FOCUS */}
                <div
                    className="relative h-[480px] flex items-center justify-center overflow-visible select-none"
                    style={{
                        maskImage: 'linear-gradient(to right, transparent, black 15%, black 85%, transparent)',
                        WebkitMaskImage: 'linear-gradient(to right, transparent, black 15%, black 85%, transparent)'
                    }}
                >
                    <div className="relative w-full max-w-7xl flex items-center justify-center">
                        {extendedCities.map((city, index) => (
                            <CityHubCard
                                key={`${city._id}-${index}`}
                                city={city}
                                scrollX={scrollX}
                                index={index}
                                totalItems={extendedCities.length}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default CitySection;
