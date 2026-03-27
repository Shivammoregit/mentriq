import React from 'react';

const LampAnimation = ({ className }) => {
    return (
        <div className={`relative w-full h-full flex items-center justify-center ${className}`}>
            <svg 
                viewBox="0 0 500 400" 
                preserveAspectRatio="xMidYMid meet"
                className="w-full h-full max-h-[80vh]"
                xmlns="http://www.w3.org/2000/svg"
            >
                <defs>
                    <style>{`
                        /* SWING ANIMATIONS */
                        .upper-arm {
                            transform-origin: 165px 240px;
                            animation: upperSwing 5s cubic-bezier(0.45, 0, 0.55, 1) 0.8s infinite;
                        }

                        .cone-g {
                            transform-origin: 165px 240px;
                            animation: coneSwing 5s cubic-bezier(0.45, 0, 0.55, 1) 0.8s infinite;
                        }

                        .floor-patch {
                            animation: patchSlide 5s cubic-bezier(0.45, 0, 0.55, 1) 0.8s infinite;
                        }

                        @keyframes upperSwing {
                            0%   { transform: rotate(0deg);   }
                            28%  { transform: rotate(22deg);  }
                            62%  { transform: rotate(-26deg); }
                            100% { transform: rotate(0deg);   }
                        }

                        @keyframes coneSwing {
                            0%   { transform: rotate(0deg);   opacity: 0.12; }
                            28%  { transform: rotate(22deg);  opacity: 0.20; }
                            62%  { transform: rotate(-26deg); opacity: 0.16; }
                            100% { transform: rotate(0deg);   opacity: 0.12; }
                        }

                        @keyframes patchSlide {
                            0%   { transform: translateX(0px);   }
                            28%  { transform: translateX(48px);  }
                            62%  { transform: translateX(-52px); }
                            100% { transform: translateX(0px);   }
                        }

                        /* ENTRANCE ANIMATIONS */
                        @keyframes fadeUp {
                            0%   { opacity: 0; transform: translateY(18px); }
                            100% { opacity: 1; transform: translateY(0);    }
                        }

                        @keyframes fadeIn {
                            0%   { opacity: 0; }
                            100% { opacity: 1; }
                        }

                        @keyframes slideDown {
                            0%   { opacity: 0; transform: translateY(-12px); }
                            100% { opacity: 1; transform: translateY(0);     }
                        }

                        .shelf-top { animation: slideDown 0.5s ease-in-out 0.1s both; }
                        .monitor-g { animation: fadeUp   0.8s ease-in-out 0.1s  both; }
                        .speaker-l { animation: fadeUp   0.65s ease-in-out 0.25s both; }
                        .speaker-r { animation: fadeUp   0.65s ease-in-out 0.30s both; }
                        .mug-g     { animation: fadeUp   0.6s ease-in-out 0.35s  both; }
                        .books-r   { animation: fadeUp   0.6s ease-in-out 0.40s  both; }
                        .desk-g    { animation: fadeIn   0.5s ease-in-out 0s      both; }
                        .lamp-scene { animation: fadeIn   1.2s ease-in-out 0.2s     both; }
                    `}</style>
                </defs>

                <g className="lamp-scene">
                    

                    {/* Desk Surface */}
                    <g className="desk-g">
                        <rect x="30" y="320" width="440" height="12" rx="6" fill="#1e293b" />
                        <rect x="50" y="332" width="10" height="40" rx="2" fill="#0f172a" />
                        <rect x="440" y="332" width="10" height="40" rx="2" fill="#0f172a" />
                    </g>

                    {/* Monitor */}
                    <g className="monitor-g">
                        <rect x="120" y="140" width="260" height="160" rx="12" fill="#0f172a" stroke="#1e293b" strokeWidth="2"/>
                        <rect x="130" y="150" width="240" height="140" rx="4" fill="#020617" />
                        <rect x="235" y="300" width="30" height="20" fill="#1e293b" />
                        <rect x="210" y="315" width="80" height="5" rx="2.5" fill="#1e293b" />
                        {/* Simple Code Lines */}
                        <rect x="145" y="165" width="40" height="4" rx="2" fill="#4f46e5" opacity="0.4" />
                        <rect x="145" y="175" width="90" height="4" rx="2" fill="#6366f1" opacity="0.3" />
                        <rect x="145" y="185" width="60" height="4" rx="2" fill="#06b6d4" opacity="0.3" />
                    </g>

                    {/* Speakers */}
                    <g className="speaker-l">
                         <rect x="65" y="240" width="35" height="70" rx="6" fill="#1e293b" />
                         <circle cx="82.5" cy="265" r="8" fill="#0f172a" />
                         <circle cx="82.5" cy="290" r="12" fill="#0f172a" />
                    </g>
                    <g className="speaker-r">
                         <rect x="400" y="240" width="35" height="70" rx="6" fill="#1e293b" />
                         <circle cx="417.5" cy="265" r="8" fill="#0f172a" />
                         <circle cx="417.5" cy="290" r="12" fill="#0f172a" />
                    </g>

                    {/* Mug */}
                    <g className="mug-g">
                        <rect x="330" y="285" width="20" height="35" rx="4" fill="#6366f1" />
                        <path d="M350 295 Q360 302 350 310" stroke="#6366f1" strokeWidth="4" fill="none" rx="2" />
                    </g>

                    {/* Books */}
                    <g className="books-r">
                        <rect x="360" y="260" width="12" height="60" rx="2" fill="#4f46e5" />
                        <rect x="375" y="250" width="12" height="70" rx="2" fill="#06b6d4" />
                        <rect x="390" y="270" width="12" height="50" rx="2" fill="#818cf8" />
                    </g>

                    {/* Lamp Scene - Pivot at 165, 240 relative to 500x400 viewbox */}
                    <g transform="translate(10, 20)">
                        <ellipse cx="155" cy="299" rx="28" ry="5" fill="#e2e8f0" opacity="0.8"/>
                        <rect x="148" y="276" width="14" height="26" rx="3" fill="#4f46e5" /> {/* Indigo base */}
                        <line x1="155" y1="276" x2="165" y2="240" stroke="#94a3b8" strokeWidth="8" strokeLinecap="round"/>
                        <circle cx="165" cy="240" r="5" fill="#64748b"/> 

                        <g className="upper-arm">
                            <line x1="165" y1="240" x2="196" y2="198" stroke="#94a3b8" strokeWidth="7" strokeLinecap="round"/>
                            <circle cx="196" cy="198" r="4" fill="#64748b"/>
                            <g transform="rotate(-35, 196, 198)">
                                <ellipse cx="196" cy="198" rx="22" ry="12" fill="#6366f1"/> {/* Primary Lamp Color */}
                                <path d="M176 201 Q196 225 216 201 Z" fill="#4338ca"/> {/* Inner Shade */}
                            </g>
                        </g>

                        <g className="cone-g">
                            <path d="M196 210 L100 340 L292 340 Z" fill="#818cf8" opacity="0.1"/>
                        </g>

                        <ellipse className="floor-patch" cx="196" cy="340" rx="70" ry="12" fill="#818cf8" opacity="0.12"/>
                    </g>
                </g>
            </svg>
        </div>
    );
};

export default LampAnimation;
