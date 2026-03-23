import React from 'react';

const GlobeElement = () => {
    // Permanent colors, slightly darker as requested
    const baseColor = '#4338ca'; // Deeper Indigo
    const highlightColor = '#06b6d4'; // Deeper Cyan

    return (
        <div className="relative w-full h-full flex items-center justify-center p-8 cursor-crosshair">
            <div className="relative w-[450px] h-[450px]">
                
                {/* Abstract orbital rings */}
                <div className="absolute inset-0 rounded-full border border-dashed border-indigo-500/30 blur-[1px] animate-[spin_20s_linear_infinite_reverse]" />
                <div className="absolute inset-4 rounded-full border border-dotted border-cyan-500/40 animate-[spin_30s_linear_infinite]" />
                <div className="absolute inset-8 rounded-full border border-indigo-500/15 animate-[spin_40s_linear_infinite]" />
                
                <svg viewBox="0 0 500 500" className="w-full h-full animate-[spin_45s_linear_infinite] drop-shadow-2xl overflow-visible">
                    <defs>
                        <radialGradient id="globeGlow" cx="50%" cy="50%" r="50%">
                            <stop offset="0%" stopColor={highlightColor} stopOpacity="0.15" />
                            <stop offset="70%" stopColor={baseColor} stopOpacity="0.05" />
                            <stop offset="100%" stopColor={baseColor} stopOpacity="0" />
                        </radialGradient>
                        <filter id="neonGlobeGlow">
                            <feGaussianBlur stdDeviation="3.5" result="coloredBlur"/>
                            <feMerge>
                                <feMergeNode in="coloredBlur"/>
                                <feMergeNode in="SourceGraphic"/>
                            </feMerge>
                        </filter>
                    </defs>
                    
                    {/* Core Atmospheric Glow */}
                    <circle cx="250" cy="250" r="230" fill="url(#globeGlow)" />
                    <circle cx="250" cy="250" r="220" fill="none" stroke={baseColor} strokeWidth="1" strokeOpacity="0.3" />

                    {/* Longitudes (Vertical Ellipses) */}
                    <ellipse cx="250" cy="250" rx="35" ry="220" fill="none" stroke={baseColor} strokeWidth="1.2" strokeOpacity="0.3" />
                    <ellipse cx="250" cy="250" rx="95" ry="220" fill="none" stroke={baseColor} strokeWidth="1.2" strokeOpacity="0.25" />
                    <ellipse cx="250" cy="250" rx="155" ry="220" fill="none" stroke={baseColor} strokeWidth="1.2" strokeOpacity="0.2" />

                    {/* Latitudes (Horizontal Ellipses) */}
                    <ellipse cx="250" cy="250" rx="220" ry="35" fill="none" stroke={baseColor} strokeWidth="1.2" strokeOpacity="0.3" />
                    <ellipse cx="250" cy="250" rx="220" ry="95" fill="none" stroke={baseColor} strokeWidth="1.2" strokeOpacity="0.25" />
                    <ellipse cx="250" cy="250" rx="220" ry="155" fill="none" stroke={baseColor} strokeWidth="1.2" strokeOpacity="0.2" />

                    {/* Nodes (Dots) - Placed across the globe intersections */}
                    <g filter="url(#neonGlobeGlow)">
                        {/* Major Nodes */}
                        <circle cx="155" cy="155" r="5" fill={highlightColor} />
                        <circle cx="345" cy="155" r="6" fill={highlightColor} />
                        <circle cx="155" cy="345" r="4" fill={baseColor} className="animate-pulse" />
                        <circle cx="345" cy="345" r="5" fill={highlightColor} />
                        
                        {/* Minor Nodes */}
                        <circle cx="250" cy="30" r="4.5" fill={baseColor} />
                        <circle cx="250" cy="470" r="4.5" fill={baseColor} />
                        <circle cx="30" cy="250" r="4.5" fill={baseColor} className="animate-[ping_4s_infinite]" />
                        <circle cx="470" cy="250" r="4.5" fill={baseColor} />
                        
                        {/* Core Data Node */}
                        <circle cx="220" cy="200" r="7" fill={highlightColor} className="animate-pulse" />
                        <circle cx="310" cy="290" r="6" fill={baseColor} />
                    </g>

                    {/* Data Connections (Arcs between dots forming a network) */}
                    {/* Top connection */}
                    <path d="M 155 155 Q 250 110 345 155" fill="none" stroke={highlightColor} strokeWidth="1.5" strokeDasharray="4 4" className="opacity-70" />
                    {/* Bottom connection */}
                    <path d="M 155 345 Q 250 390 345 345" fill="none" stroke={baseColor} strokeWidth="1.5" strokeDasharray="3 3" className="opacity-60" />
                    {/* Left connection */}
                    <path d="M 155 155 Q 110 250 155 345" fill="none" stroke={highlightColor} strokeWidth="2" strokeOpacity="0.5" />
                    {/* Right connection */}
                    <path d="M 345 155 Q 390 250 345 345" fill="none" stroke={baseColor} strokeWidth="2" strokeOpacity="0.4" />
                    
                    {/* Core internal network streams */}
                    <path d="M 155 155 L 220 200 L 310 290 L 345 345" fill="none" stroke={highlightColor} strokeWidth="2" strokeOpacity="0.8" />
                    <path d="M 345 155 L 220 200" fill="none" stroke={baseColor} strokeWidth="1.5" strokeDasharray="3 6" strokeOpacity="0.9" />
                </svg>

                {/* Floating satellite/packet animations on top of the SVG */}
                <div className="absolute top-[18%] right-[18%] w-2 h-2 rounded-full bg-cyan-500 shadow-[0_0_12px_currentColor] animate-[ping_2s_ease-out_infinite]" style={{ animationDelay: '0.5s' }} />
                <div className="absolute bottom-[22%] left-[22%] w-2 h-2 rounded-full bg-indigo-500 shadow-[0_0_12px_currentColor] animate-[ping_3s_ease-out_infinite]" style={{ animationDelay: '1.5s' }} />

            </div>
        </div>
    );
};

export default GlobeElement;
