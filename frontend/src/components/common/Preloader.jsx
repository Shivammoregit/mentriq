import React from 'react';
import { motion } from 'framer-motion';

const Preloader = () => {
    return (
        <motion.div
            initial={{ opacity: 1 }}
            exit={{
                opacity: 0,
                transition: { duration: 0.4, ease: 'easeInOut' }
            }}
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-white"
        >
            <div className="flex flex-col items-center gap-6">
                {/* Logo */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.92 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3 }}
                    className="w-20 h-20 rounded-3xl border border-slate-200 bg-white shadow-[0_20px_50px_rgba(99,102,241,0.10)] flex items-center justify-center p-3"
                >
                    <img
                        src="/images/logo.jpg"
                        alt="MentriQ Logo"
                        className="w-full h-full object-contain rounded-2xl"
                    />
                </motion.div>

                {/* Loading bar */}
                <div className="w-52">
                    <div className="h-1.5 overflow-hidden rounded-full bg-slate-100 border border-slate-200">
                        <motion.div
                            className="h-full rounded-full bg-gradient-to-r from-indigo-500 via-blue-500 to-cyan-400"
                            initial={{ x: '-100%' }}
                            animate={{ x: '100%' }}
                            transition={{ duration: 1.1, repeat: Infinity, ease: 'easeInOut' }}
                        />
                    </div>
                    <p className="mt-3 text-center text-[10px] font-black uppercase tracking-[0.28em] text-slate-400">
                        Loading
                    </p>
                </div>
            </div>
        </motion.div>
    );
};

export default Preloader;
