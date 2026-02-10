import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Globe, User, GraduationCap, Code2, ArrowRight, ShieldCheck, Zap, Activity } from 'lucide-react';

const LandingPage: React.FC = () => {
    const [url, setUrl] = useState('');
    const [persona, setPersona] = useState('Layman');

    const personas = [
        { id: 'Layman', icon: User, label: 'Layman', desc: 'Clicks slowly, wants simplicity, easily confused by jargon.' },
        { id: 'Student', icon: GraduationCap, label: 'Student', desc: 'Mobile-first, looks for tutorials, knows basics.' },
        { id: 'Developer', icon: Code2, label: 'Developer', desc: 'Focuses on API docs, shortcuts, and performance.' },
    ];

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Testing', url, 'as', persona);
        // Navigation logic will go here
    };

    return (
        <div className="min-h-screen relative overflow-hidden flex flex-col items-center justify-center px-4">
            {/* Background Animations */}
            <div className="absolute top-0 left-0 w-full h-full -z-10 bg-grid-slate-900/[0.04] bg-[bottom_1px_center]"></div>
            <div className="absolute top-1/4 -left-20 w-80 h-80 bg-indigo-600/20 rounded-full blur-[120px] animate-pulse"></div>
            <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-pink-600/20 rounded-full blur-[120px] animate-pulse delay-1000"></div>

            <main className="max-w-4xl w-full text-center py-20 relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 mb-8 backdrop-blur-sm">
                        <Zap size={14} className="text-pink-400" />
                        <span className="text-xs font-medium text-slate-400 tracking-wide uppercase italic">The Future of AI UX Testing</span>
                    </div>

                    <h1 className="text-6xl md:text-8xl font-black mb-6 tracking-tight">
                        <span className="gradient-text">UXTestAI</span>
                    </h1>

                    <p className="text-xl text-slate-400 mb-12 max-w-2xl mx-auto leading-relaxed">
                        The ultimate autonomous platform. Deploy an AI persona to explore your software and surface frustration before your users do.
                    </p>

                    <form onSubmit={handleSubmit} className="space-y-10">
                        <div className="relative group max-w-2xl mx-auto">
                            <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-pink-500 rounded-2xl blur opacity-25 group-focus-within:opacity-50 transition duration-500"></div>
                            <div className="relative glass-morphism rounded-2xl p-2 flex items-center">
                                <div className="pl-4 pr-2 text-slate-500">
                                    <Globe size={20} />
                                </div>
                                <input
                                    type="text"
                                    value={url}
                                    onChange={(e) => setUrl(e.target.value)}
                                    placeholder="Enter GitHub Repo or Localhost URL..."
                                    className="bg-transparent border-none focus:ring-0 text-white w-full py-4 text-lg placeholder:text-slate-600"
                                    required
                                />
                                <button
                                    type="submit"
                                    className="bg-indigo-600 hover:bg-indigo-500 text-white p-4 rounded-xl transition-all duration-300 flex items-center space-x-2 group-hover:scale-[1.02] shadow-lg shadow-indigo-500/20"
                                >
                                    <span className="font-bold px-2">Analyze UI</span>
                                    <ArrowRight size={20} />
                                </button>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
                            {personas.map((p) => (
                                <button
                                    key={p.id}
                                    type="button"
                                    onClick={() => setPersona(p.id)}
                                    className={`relative p-6 rounded-2xl transition-all duration-500 group border-2 ${persona === p.id
                                        ? 'border-indigo-500 bg-indigo-500/10'
                                        : 'border-white/5 bg-white/5 hover:border-white/20'
                                        }`}
                                >
                                    <div className={`p-4 rounded-xl w-fit mx-auto mb-4 transition-colors duration-500 ${persona === p.id ? 'bg-indigo-500 text-white' : 'bg-slate-800 text-slate-400 group-hover:text-slate-200'
                                        }`}>
                                        <p.icon size={28} />
                                    </div>
                                    <h3 className={`font-bold text-lg mb-2 ${persona === p.id ? 'text-white' : 'text-slate-300'}`}>{p.label}</h3>
                                    <p className="text-xs text-slate-500 leading-relaxed font-medium">{p.desc}</p>

                                    {persona === p.id && (
                                        <motion.div
                                            layoutId="persona-active"
                                            className="absolute -top-2 -right-2 bg-indigo-500 text-white p-1 rounded-full shadow-lg"
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                        >
                                            <ShieldCheck size={16} />
                                        </motion.div>
                                    )}
                                </button>
                            ))}
                        </div>
                    </form>
                </motion.div>
            </main>

            <footer className="w-full max-w-4xl border-t border-white/5 py-12 flex flex-col md:flex-row justify-between items-center text-slate-500 text-sm italic">
                <div className="flex items-center space-x-6 mb-4 md:mb-0">
                    <div className="flex items-center space-x-2">
                        <Activity size={16} className="text-emerald-500" />
                        <span>System: Optimal</span>
                    </div>
                    <div className="flex items-center space-x-2">
                        <ShieldCheck size={16} className="text-indigo-500" />
                        <span>Sandbox Enabled</span>
                    </div>
                </div>
                <div>Built with Gemini 1.5 Pro & Playwright</div>
            </footer>
        </div>
    );
};

export default LandingPage;
