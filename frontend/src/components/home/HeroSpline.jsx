import React from 'react';
import { SplineScene } from "@/components/ui/SplineScene";
import { Card } from "@/components/ui/Card"
import { Spotlight } from "@/components/ui/Spotlight"
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

export function HeroSpline() {
    const navigate = useNavigate();

    return (
        <Card className="w-full min-h-[600px] bg-black relative overflow-hidden border-0 rounded-none">
            <Spotlight
                className="-top-40 left-0 md:left-60 md:-top-20"
                fill="white"
            />

            <div className="flex flex-col lg:flex-row h-full">
                {/* Left content */}
                <div className="flex-1 p-8 relative z-10 flex flex-col justify-center lg:pl-20 pt-20">
                    <div className="inline-flex items-center space-x-2 mb-4 w-fit px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 backdrop-blur-sm shadow-sm">
                        <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-300">The Future of Intelligence</span>
                    </div>

                    <h1 className="text-4xl md:text-5xl xl:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400 mb-6 font-display leading-[1.1]">
                        REWIRE YOUR <br />
                        POTENTIAL.
                    </h1>
                    <p className="mt-4 text-neutral-300 max-w-lg text-lg leading-relaxed mb-8">
                        MentriQ is where precision meets innovation. Master the core of modern technology with industry-first curriculums and elite mentorship.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4">
                        <button
                            onClick={() => navigate("/courses")}
                            className="group px-8 py-4 rounded-xl bg-indigo-600 text-white font-bold shadow-lg shadow-indigo-500/25 hover:bg-indigo-700 transition-all duration-300 flex items-center justify-center gap-2 uppercase tracking-widest text-xs"
                        >
                            Start Learning
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </button>

                        <button
                            onClick={() => navigate("/contact")}
                            className="px-8 py-4 rounded-xl bg-slate-100 border border-slate-200 text-slate-900 font-bold hover:bg-slate-200 transition-all duration-300 uppercase tracking-widest text-xs"
                        >
                            Get a Consultation
                        </button>
                    </div>
                </div>

                {/* Right content */}
                <div className="flex-1 relative min-h-[400px] lg:min-h-auto">
                    <SplineScene
                        scene="https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode"
                        className="w-full h-full"
                    />
                </div>
            </div>
        </Card>
    )
}
