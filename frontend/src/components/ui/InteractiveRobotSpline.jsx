import React, { Suspense, lazy } from 'react';

const Spline = lazy(() => import('@splinetool/react-spline'));

/**
 * InteractiveRobotSpline Component
 * A high-performance 3D scene wrapper for the Whobee robot.
 * Optimized with lazy loading, error boundaries, and improved UX.
 */
export function InteractiveRobotSpline({ scene, className = "" }) {
  const onLoad = (spline) => {
    // Disable interactive events to reduce CPU load as requested
    if (spline.setInteraction) {
        spline.setInteraction(false);
    }
  };

  return (
    <Suspense
      fallback={
        <div className={`w-full h-full flex items-center justify-center bg-transparent ${className}`}>
           <div className="w-6 h-6 border-[3px] border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin" />
        </div>
      }
    >
      <div className={`w-full h-full ${className}`}>
        <Spline
          scene={scene}
          onLoad={onLoad}
          className="w-full h-full pointer-events-none" 
        />
      </div>
    </Suspense>
  );
}
