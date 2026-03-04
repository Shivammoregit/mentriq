import React from 'react';

export function SplineScene({ scene, className }) {
    return (
        <div className={className}>
            {/* Spline rendering placeholder */}
            <div className="w-full h-full bg-slate-900/20 animate-pulse flex items-center justify-center">
                <span className="text-slate-500 text-[10px] uppercase tracking-widest">3D Asset Loading...</span>
            </div>
        </div>
    );
}
