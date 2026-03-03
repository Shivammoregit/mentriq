import React, { useState, useEffect, useRef } from 'react';

import { Users } from 'lucide-react';
import { apiClient as api } from '../../utils/apiClient';
import { resolveImageUrl } from '../../utils/imageUtils';

const FALLBACK_MENTORS = [];

const MotionDiv = motion.div;
const MotionH3 = motion.h3;

const MentorCard = ({ item, scrollX, index, totalItems }) => {
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

    // Sharper scaling for center focus
    const rawScale = useTransform(x, [-600, -250, 0, 250, 600], [0.6, 0.7, 1.05, 0.7, 0.6]);
    const scale = useSpring(rawScale, springConfig);

    const rawOpacity = useTransform(x, [-1000, -600, 0, 600, 1000], [0, 0.2, 1, 0.2, 0]);
    const opacity = useSpring(rawOpacity, springConfig);

    const rawBrightness = useTransform(x, [-400, 0, 400], [0.8, 1, 0.8]);
    const brightness = useSpring(rawBrightness, springConfig);

    // DYNAMIC FOCUS: Grayscale to Color transition based on center proximity
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
                rotateY: 15,
                rotateX: -8,
                zIndex: 100,
                transition: { duration: 0.5, ease: [0.23, 1, 0.32, 1] }
            }}
            className="absolute bg-white/70 backdrop-blur-3xl rounded-[2.5rem] p-7 border border-white/40 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.06)] w-[280px] flex-shrink-0 group perspective-2000 overflow-hidden"
        >
            {/* Glassmorphism V2: High-Glow Inner Border */}
            <div className="absolute inset-px rounded-[2.5rem] border border-white/60 pointer-events-none z-20" />

            {/* Ambient Base Glow (Triggers near center) */}
            <div
                style={{
                    opacity: useTransform(x, [-200, 0, 200], [0, 1, 0])
                }}
                className="absolute inset-0 bg-gradient-to-tr from-indigo-500/5 via-transparent to-cyan-500/5 pointer-events-none"
            />

            {/* Technical Scanline Overlay */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.02)_50%),linear-gradient(90deg,rgba(255,0,0,0.01),rgba(0,255,0,0.01),rgba(0,0,255,0.01))] bg-[length:100%_2px,3px_100%] pointer-events-none opacity-20" />

            {/* Animated Top Highlight Line */}
            <div
                className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-indigo-500 to-transparent"
                }
                }
                }
            />

            <div className="flex flex-col items-center justify-center relative z-10">
                <div className="relative mb-7">
                    {/* Multi-layered Avatar Glow */}
                    <div className="absolute -inset-6 bg-indigo-500/10 blur-[40px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
                    <div className="absolute -inset-2 bg-gradient-to-tr from-indigo-500/20 to-cyan-500/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

                    <div
                        }
                        className="relative overflow-hidden rounded-[2rem] border-4 border-white shadow-2xl group-hover:border-indigo-100 transition-all duration-500"
                    >
                        <img
                            src={resolveImageUrl(item.image || item.imageUrl, "/images/user.png")}
                            alt={item.name}
                            className="w-24 h-24 object-cover transition-all duration-1000 scale-110 group-hover:scale-100"
                            onError={(e) => { e.target.src = "/images/user.png" }}
                        />
                    </div>

                    {/* Elite Badge */}
                    <div
                        }
                        }
                        className="absolute -bottom-2 -right-2 bg-gradient-to-br from-indigo-600 to-indigo-800 text-white p-1.5 rounded-xl shadow-lg border-2 border-white z-20"
                    >
                        <Users className="w-3 h-3" />
                    </div>
                </div>

                <div className="text-center w-full">
                    <h3 className="text-2xl font-black text-slate-900 mb-1.5 tracking-tighter uppercase font-display group-hover:text-indigo-600 transition-colors duration-300">
                        {item.name}
                    </h3>

                    <div className="inline-flex items-center gap-2 px-3.5 py-1 bg-indigo-50/50 rounded-full border border-indigo-100/50 mb-5">
                        <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
                        <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest font-display">
                            {item.role || "Expert Mentor"}
                        </span>
                    </div>

                    <p className="text-[13px] text-slate-500 leading-relaxed line-clamp-2 px-3 font-medium italic opacity-70 group-hover:opacity-100 transition-opacity duration-500">
                        "{item.description || "Architecting the digital future through mastery."}"
                    </p>
                </div>

                <div
                    }
                    className="flex justify-center gap-7 pt-6 mt-6 border-t border-slate-100/80 w-full"
                >
                    {(item.stats || [{ value: "5+", label: "EXP" }, { value: "15+", label: "WP" }]).map((stat, i) => (
                        <div key={i} className="text-center group/stat">
                            <p className="text-xl font-black text-slate-900 tracking-tighter group-hover/stat:text-indigo-600 transition-colors font-display">
                                {stat.value}
                            </p>
                            <p className="text-[8px] text-slate-400 font-black uppercase tracking-[0.3em] mt-0.5 opacity-60 group-hover/stat:opacity-100">
                                {stat.label}
                            </p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Ambient Base Glow */}
            <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-indigo-500/5 rounded-full blur-[80px] pointer-events-none group-hover:bg-indigo-500/10 transition-colors duration-1000" />
        </div>
    );
};

const MentorsSection = () => {
    const [mentors, setMentors] = useState(FALLBACK_MENTORS);

    const rawScrollX = useMotionValue(0);
    const scrollX = useSpring(rawScrollX, { damping: 50, stiffness: 400, mass: 0.5 });

    useEffect(() => {
        const fetchMentors = async () => {
            try {
                const { data } = await api.get('/mentors');
                if (Array.isArray(data) && data.length > 0) {
                    console.log("MentorsSection: Fetched mentors from API", data);
                    setMentors(data);
                } else {
                    console.log("MentorsSection: No mentors found in API, using fallback");
                }
            } catch (error) {
                console.error("MentorsSection: Failed to fetch mentors, using fallback", error);
            }
        };
        fetchMentors();
    }, []);

    useAnimationFrame((t, d) => {
        const moveBy = -1.2 * (d / 16);
        rawScrollX.set(rawScrollX.get() + moveBy);
    });

    const displayMentors = mentors;
    const extendedMentors = [...displayMentors, ...displayMentors];

    return (
        <section className="py-8 bg-white overflow-hidden relative min-h-[500px]">
            {/* Advanced Section Background: Subtle Technical Grid */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute inset-0 opacity-[0.03]" style={{
                    backgroundImage: `linear-gradient(#4f46e5 1px, transparent 1px), linear-gradient(90deg, #4f46e5 1px, transparent 1px)`,
                    backgroundSize: '40px 40px'
                }} />
                {/* Dynamic Glows */}
                <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-indigo-500/5 rounded-full blur-[120px] animate-pulse" />
                <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-cyan-500/5 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '1s' }} />
            </div>

            <div className="max-w-7xl mx-auto px-6 mb-12 relative z-10 text-center">
                <MotionDiv
                    }
                    }
                    }
                >
                    <div className="inline-flex items-center space-x-2 py-1.5 px-4 rounded-full bg-indigo-50 border border-indigo-100 mb-3 shadow-sm">
                        <Users className="w-3.5 h-3.5 text-indigo-500" />
                        <span className="text-indigo-600 text-[10px] font-black tracking-widest uppercase">Elite Mentorship Corps</span>
                    </div>
                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 mb-3 tracking-tighter uppercase font-display leading-[0.9]">
                        LEARN FROM THE <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-600">BEST IN CLASS.</span>
                    </h2>
                </MotionDiv>
            </div>

            <div
                className="relative h-[480px] flex items-center justify-center overflow-visible select-none cursor-grab active:cursor-grabbing"
                style={{
                    maskImage: 'linear-gradient(to right, transparent, black 12%, black 88%, transparent)',
                    WebkitMaskImage: 'linear-gradient(to right, transparent, black 12%, black 88%, transparent)'
                }}
            >
                <div className="relative w-full max-w-7xl flex items-center justify-center">
                    {extendedMentors.map((item, index) => (
                        <MentorCard
                            key={`${item.name}-${index}`}
                            item={item}
                            scrollX={scrollX}
                            index={index}
                            totalItems={extendedMentors.length}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default MentorsSection;
