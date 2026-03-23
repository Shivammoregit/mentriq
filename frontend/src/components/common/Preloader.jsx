import React, { useState, useEffect, useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

const Preloader = () => {
    const [progress, setProgress] = useState(0);
    const frameRef = useRef(null);

    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const mouseXSpring = useSpring(x);
    const mouseYSpring = useSpring(y);

    const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ['20deg', '-20deg']);
    const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ['-20deg', '20deg']);

    useEffect(() => {
        const handleMouseMove = (e) => {
            if (frameRef.current) return;
            frameRef.current = window.requestAnimationFrame(() => {
                const width = window.innerWidth;
                const height = window.innerHeight;
                const mouseX = e.clientX;
                const mouseY = e.clientY;
                const xPct = (mouseX / width) - 0.5;
                const yPct = (mouseY / height) - 0.5;
                x.set(xPct);
                y.set(yPct);
                frameRef.current = null;
            });
        };

        window.addEventListener('mousemove', handleMouseMove, { passive: true });
        const interval = setInterval(() => {
            setProgress(prev => (prev < 100 ? prev + 2 : 100));
        }, 20);
        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            clearInterval(interval);
            if (frameRef.current) {
                window.cancelAnimationFrame(frameRef.current);
            }
        };
    }, [x, y]);

    return (
        <motion.div
            initial={{ opacity: 1 }}
            exit={{
                opacity: 0,
                scale: 1.1,
                filter: 'blur(20px)',
                transition: { duration: 0.8, ease: 'easeInOut' }
            }}
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-white overflow-hidden"
        >
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-indigo-500/5 rounded-full blur-[150px] animate-pulse" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-500/5 rounded-full blur-[120px] animate-pulse delay-700" />
            </div>

            <div className="relative flex flex-col items-center" style={{ perspective: '1500px' }}>
                <motion.div
                    style={{
                        rotateY,
                        rotateX,
                        transformStyle: 'preserve-3d'
                    }}
                    className="relative w-48 h-48 md:w-56 md:h-56 flex items-center justify-center"
                >
                    <motion.div
                        animate={{
                            rotateZ: [0, 360],
                        }}
                        transition={{
                            duration: 25,
                            repeat: Infinity,
                            ease: 'linear'
                        }}
                        className="absolute inset-0 rounded-[2.5rem] border border-slate-200/60 bg-white/40 backdrop-blur-2xl shadow-[0_20px_50px_rgba(0,0,0,0.05)] opacity-90"
                    />

                    <div style={{ transformStyle: 'preserve-3d' }} className="relative z-10 w-32 h-32 md:w-40 md:h-40">
                        <div
                            style={{
                                transform: 'translateZ(20px)',
                                filter: 'blur(15px)',
                                opacity: 0.1
                            }}
                            className="absolute inset-0 bg-slate-100 rounded-3xl"
                        />

                        <div
                            style={{
                                transform: 'translateZ(60px)',
                            }}
                            className="relative w-full h-full bg-white rounded-3xl p-1.5 shadow-[0_15px_35px_rgba(0,0,0,0.08)] border border-slate-100"
                        >
                            <img
                                src="/images/logo.jpg"
                                alt="MentriQ Core"
                                className="w-full h-full object-contain rounded-2xl"
                            />

                            <motion.div
                                animate={{
                                    top: ['-10%', '110%'],
                                    opacity: [0, 0.4, 0]
                                }}
                                transition={{
                                    duration: 2.5,
                                    repeat: Infinity,
                                    ease: 'easeInOut'
                                }}
                                className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-indigo-400 to-transparent blur-[1.5px] z-20"
                            />
                        </div>
                    </div>

                    {[...Array(6)].map((_, i) => (
                        <motion.div
                            key={i}
                            animate={{
                                rotateY: [0, 360],
                                rotateZ: [i * 60, i * 60 + 360],
                            }}
                            transition={{
                                duration: 10 + i,
                                repeat: Infinity,
                                ease: 'linear'
                            }}
                            style={{ transformStyle: 'preserve-3d' }}
                            className="absolute inset-0"
                        >
                            <div
                                style={{ transform: `translateZ(130px) rotateY(${i * 30}deg)` }}
                                className="w-1.5 h-1.5 bg-indigo-500 rounded-full opacity-40 shadow-[0_0_10px_rgba(79,70,229,0.3)]"
                            />
                        </motion.div>
                    ))}
                </motion.div>

                <div className="mt-16 text-center relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                    >
                        <h1 className="text-xl font-black text-slate-900 tracking-[0.5em] uppercase mb-4">
                            MentriQ
                        </h1>

                        <div className="w-64 h-1 bg-slate-100 rounded-full overflow-hidden border border-slate-200 relative">
                            <motion.div
                                className="absolute inset-y-0 left-0 bg-gradient-to-r from-indigo-500 to-cyan-500 shadow-[0_0_10px_rgba(99,102,241,0.2)]"
                                initial={{ width: '0%' }}
                                animate={{ width: `${progress}%` }}
                            />
                        </div>

                        <div className="mt-5 flex flex-col items-center gap-2">
                            <span className="text-[10px] font-bold text-slate-600 uppercase tracking-[0.3em]">
                                {progress}%
                            </span>

                            <div className="flex gap-2">
                                {[0, 1, 2].map(i => (
                                    <motion.div
                                        key={i}
                                        animate={{
                                            scale: [1, 1.4, 1],
                                            opacity: [0.2, 0.6, 0.2]
                                        }}
                                        transition={{
                                            duration: 1.5,
                                            repeat: Infinity,
                                            delay: i * 0.3
                                        }}
                                        className="w-1 h-1 bg-indigo-400 rounded-full"
                                    />
                                ))}
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </motion.div>
    );
};

export default Preloader;
