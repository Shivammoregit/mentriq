import React, { Suspense, lazy } from 'react';

const Spline = lazy(() => import('@splinetool/react-spline'));

export function InteractiveRobotSpline({ scene, className }) {
    return (
        <Suspense
            fallback={
                <div className={`w-full h-full flex items-center justify-center text-indigo-500 ${className || ''}`}>
                    <svg className="animate-spin h-5 w-5 mr-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l2-2.647z"></path>
                    </svg>
                </div>
            }
        >
            <div className="relative w-full h-full spline-container flex items-center justify-center">
                {/* 
                   To fully remove the internal baked Spline background without losing robot shading:
                   Use CSS mix-blend-mode screen on a black Spline background, or mask out the dark purple 
                   via CSS filter, but doing a physical CSS mask is safest. 
                   We will use a soft radial gradient mask to drop off the hard background edge.
                */}
                <div 
                    className="w-[600px] h-[600px] overflow-hidden rounded-full flex items-center justify-center transform scale-110" 
                    style={{ 
                        maskImage: 'radial-gradient(ellipse at center, black 50%, transparent 75%)', 
                        WebkitMaskImage: 'radial-gradient(ellipse at center, black 50%, transparent 75%)' 
                    }}
                >
                    <Spline
                        scene={scene}
                        className={className}
                        style={{ width: '100%', height: '100%', background: 'transparent', transform: 'scale(1.1)' }}
                    />
                </div>
                
                {/* Force-hide logo link globally via CSS */}
                <style>{`
                    .spline-container canvas + div,
                    .spline-container a, 
                    #spline-watermark {
                        display: none !important;
                        opacity: 0 !important;
                        pointer-events: none !important;
                        visibility: hidden !important;
                    }
                `}</style>
                
                {/* Physical white mask over where the logo usually sits as a failsafe */}
                <div className="absolute bottom-0 right-0 w-48 h-16 z-[60] pointer-events-none" />
            </div>
        </Suspense>
    );
}
