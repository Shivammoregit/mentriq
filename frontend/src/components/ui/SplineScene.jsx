import React, { Suspense, lazy } from 'react';

const Spline = lazy(() => import('@splinetool/react-spline'));

export function SplineScene({ scene, className }) {
    return (
        <div className={className}>
            <Suspense fallback={
                <div className="w-full h-full flex items-center justify-center bg-slate-100/10 backdrop-blur-sm rounded-[3rem]">
                    <div className="flex flex-col items-center gap-3">
                        <div className="w-8 h-8 border-2 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin" />
                        <span className="text-slate-500 text-[10px] font-black uppercase tracking-widest">Constructing 3D Scene...</span>
                    </div>
                </div>
            }>
                <Spline scene={scene} />
            </Suspense>
        </div>
    );
}
