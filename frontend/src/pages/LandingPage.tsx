// MOCO_AI Landing Page - Autonomous UX Auditor Entry Point
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Globe, User, GraduationCap, Code2, ArrowRight, ShieldCheck, Zap, Sparkles } from 'lucide-react';

const LandingPage: React.FC = () => {
    const [url, setUrl] = useState('');
    const [persona, setPersona] = useState('Layman');

    const personas = [
        { id: 'Layman', icon: User, label: 'Layman', desc: 'Clicks slowly, wants simplicity, easily confused by jargon.', color: 'from-emerald-400 to-cyan-400' },
        { id: 'Student', icon: GraduationCap, label: 'Student', desc: 'Mobile-first, looks for tutorials, knows basics.', color: 'from-violet-400 to-fuchsia-400' },
        { id: 'Developer', icon: Code2, label: 'Developer', desc: 'Focuses on API docs, shortcuts, and performance.', color: 'from-rose-400 to-orange-400' },
    ];

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Testing', url, 'as', persona);
    };

    return (
        <div className="min-h-screen relative overflow-hidden flex flex-col items-center justify-center px-4 mesh-gradient">
            {/* Background Glows */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-violet-600/20 rounded-full blur-[120px] animate-pulse"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-emerald-600/10 rounded-full blur-[120px] animate-pulse delay-1000"></div>

            <main className="max-w-5xl w-full text-center py-20 relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                >
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.2 }}
                        className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 mb-10 backdrop-blur-md shadow-inner shadow-white/5"
                    >
                        <Sparkles size={14} className="text-cyan-400 animate-pulse" />
                        <span className="text-[10px] font-bold text-slate-400 tracking-[0.2em] uppercase">Autonomous UX Auditor</span>
                    </motion.div>

                    <h1 className="text-7xl md:text-9xl font-black mb-8 tracking-tighter leading-tight">
                        <span className="gradient-text">MOCO_AI</span>
                    </h1>

                    <p className="text-lg md:text-xl text-slate-400 mb-16 max-w-2xl mx-auto leading-relaxed font-medium">
                        Deploy autonomous AI agents to stress-test your UI. Surface frustration, friction, and confusion <span className="text-cyan-400">before</span> your users do.
                    </p>

                    <form onSubmit={handleSubmit} className="space-y-12">
                        <div className="relative group max-w-3xl mx-auto">
                            {/* Animated Border */}
                            <div className="absolute -inset-[1px] bg-gradient-to-r from-cyan-500 via-indigo-500 to-amber-500 rounded-3xl blur-[2px] opacity-20 group-focus-within:opacity-100 transition duration-700"></div>

                            <div className="relative glass-card rounded-[1.5rem] p-2 flex items-center gap-2">
                                <div className="pl-5 pr-1 text-slate-500">
                                    <Globe size={22} strokeWidth={1.5} />
                                </div>
                                <input
                                    type="text"
                                    value={url}
                                    onChange={(e) => setUrl(e.target.value)}
                                    placeholder="Paste GitHub repository or local URL..."
                                    className="bg-transparent border-none focus:ring-0 text-white w-full py-5 text-lg placeholder:text-slate-600 font-medium"
                                    required
                                />
                                <button
                                    type="submit"
                                    className="btn-primary group/btn flex items-center gap-2 whitespace-nowrap min-w-[160px] justify-center"
                                >
                                    <span>Initiate Audit</span>
                                    <ArrowRight size={20} className="group-hover/btn:translate-x-1 transition-transform" />
                                </button>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
                            {personas.map((p) => (
                                <motion.button
                                    key={p.id}
                                    type="button"
                                    onClick={() => setPersona(p.id)}
                                    whileHover={{ y: -4, scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    className={`relative p-8 rounded-[2rem] text-left transition-all duration-500 glass-card group border-2 ${persona === p.id
                                        ? 'border-violet-500/50 bg-violet-500/5'
                                        : 'border-transparent'
                                        }`}
                                >
                                    <div className={`p-4 rounded-2xl w-fit mb-6 transition-all duration-500 shadow-xl ${persona === p.id
                                        ? `bg-gradient-to-br ${p.color} text-slate-950 scale-110`
                                        : 'bg-slate-800/50 text-slate-400 group-hover:bg-slate-800 group-hover:text-slate-200'
                                        }`}>
                                        <p.icon size={26} strokeWidth={2} />
                                    </div>
                                    <h3 className={`font-black text-xl mb-3 tracking-tight ${persona === p.id ? 'text-white' : 'text-slate-300'}`}>{p.label}</h3>
                                    <p className="text-sm text-slate-500 leading-relaxed font-medium">{p.desc}</p>

                                    {/* Selection Glow */}
                                    <AnimatePresence>
                                        {persona === p.id && (
                                            <motion.div
                                                layoutId="active-glow"
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                exit={{ opacity: 0 }}
                                                className={`absolute inset-0 rounded-[2rem] -z-10 bg-gradient-to-br ${p.color} opacity-[0.03] blur-2xl`}
                                            />
                                        )}
                                    </AnimatePresence>
                                </motion.button>
                            ))}
                        </div>
                    </form>
                </motion.div>
            </main>

            <footer className="w-full max-w-5xl border-t border-white/[0.05] py-16 flex flex-col md:flex-row justify-between items-center text-slate-500 text-[13px] font-medium font-mono uppercase tracking-widest">
                <div className="flex items-center space-x-8 mb-8 md:mb-0">
                    <div className="flex items-center space-x-2.5">
                        <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.5)] animate-pulse" />
                        <span>Core Engine: Ready</span>
                    </div>
                    <div className="flex items-center space-x-2.5">
                        <ShieldCheck size={16} className="text-violet-500" />
                        <span>Analysis Secure</span>
                    </div>
                </div>
                <div className="flex items-center gap-1.5 opacity-60">
                    <span>Powering</span>
                    <Zap size={14} className="fill-violet-500 text-violet-500" />
                    <span>User Intelligence</span>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;

