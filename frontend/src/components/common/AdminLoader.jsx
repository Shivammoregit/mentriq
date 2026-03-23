import React from 'react';
import { motion } from 'framer-motion';

const AdminLoader = ({ fullScreen = false, label = 'Loading admin panel' }) => {
    const containerClass = fullScreen
        ? 'min-h-screen bg-[#030712]'
        : 'min-h-[40vh]';

    return (
        <div className={`flex items-center justify-center ${containerClass}`}>
            <div className="flex flex-col items-center gap-6">
                <motion.div
                    initial={{ opacity: 0, scale: 0.96 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.25 }}
                    className="w-20 h-20 rounded-3xl border border-slate-200 bg-white/[0.04] shadow-[0_20px_50px_rgba(37,99,235,0.12)] backdrop-blur-md flex items-center justify-center p-3"
                >
                    <img
                        src="/images/logo.jpeg"
                        alt="MentriQ Logo"
                        className="w-full h-full object-contain"
                    />
                </motion.div>

                <div className="w-52">
                    <div className="h-1.5 overflow-hidden rounded-full border border-slate-200 bg-white/[0.05]">
                        <motion.div
                            className="h-full rounded-full bg-gradient-to-r from-indigo-500 via-blue-500 to-cyan-400"
                            initial={{ x: '-100%' }}
                            animate={{ x: '100%' }}
                            transition={{ duration: 1.1, repeat: Infinity, ease: 'easeInOut' }}
                        />
                    </div>
                    <p className="mt-3 text-center text-[10px] font-black uppercase tracking-[0.28em] text-slate-500">
                        {label}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default AdminLoader;
