import React from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, CheckCircle, TrendingUp, Users, Map as MapIcon, Share2, Download, Rocket } from 'lucide-react';

const ReportPage: React.FC = () => {
    const reportData = {
        uxScore: 7.2,
        summary: "The application has a strong core flow, but significant friction exists in the 'Payment' step where the 'Back' button is obscured by the UPI overlay.",
        rageQuitProb: 0.15,
        issues: [
            { id: 1, severity: 'critical', title: 'Overlay Obscuring Action', desc: 'UPI payment modal blocks the main navigation back button.', fix: 'Adjust z-index of the navbar or move modal to center.' },
            { id: 2, severity: 'medium', title: 'Dense Jargon', desc: 'Terms like "Asynchronous Webhook" are confusing for the Layman persona.', fix: 'Replace with "Real-time Update" or add tooltips.' },
        ],
        debate: [
            { persona: 'Layman', comment: "I couldn't find how to pay! The blue box covered everything." },
            { persona: 'Developer', comment: "The modal trigger is efficient, but the z-index collision is definitely a junior mistake." },
            { winner: 'AI Vote', resolution: "The z-index must be fixed; Layman's confusion is valid data." }
        ]
    };

    return (
        <div className="min-h-screen bg-[#0f172a] text-slate-200 p-8">
            <header className="max-w-6xl mx-auto flex justify-between items-center mb-12">
                <div>
                    <h1 className="text-4xl font-black gradient-text">UX Analysis Report</h1>
                    <p className="text-slate-500 italic">Session ID: #UX-78219 | Target: localhost:3000</p>
                </div>
                <div className="flex space-x-4">
                    <button className="glass-morphism px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-white/10 transition">
                        <Share2 size={18} />
                        <span>Share</span>
                    </button>
                    <button className="bg-indigo-600 px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-indigo-500 transition">
                        <Download size={18} />
                        <span>Export PDF</span>
                    </button>
                </div>
            </header>

            <main className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Metrics & Issues */}
                <div className="lg:col-span-2 space-y-8">
                    <section className="glass-morphism rounded-3xl p-8 flex items-center justify-between border-2 border-indigo-500/20">
                        <div>
                            <h2 className="text-lg font-bold text-slate-400 mb-1 tracking-wider uppercase">Portfolio UX Score</h2>
                            <div className="flex items-baseline space-x-2">
                                <span className="text-7xl font-black text-white">{reportData.uxScore}</span>
                                <span className="text-slate-500 font-bold">/ 10</span>
                            </div>
                        </div>
                        <div className="text-right">
                            <div className="text-emerald-400 flex items-center justify-end space-x-1 mb-1">
                                <TrendingUp size={20} />
                                <span className="font-bold">Showcase Ready</span>
                            </div>
                            <p className="text-xs text-slate-500 max-w-[200px]">Top 15% of tested portfolios this week.</p>
                        </div>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-bold flex items-center space-x-2">
                            <AlertTriangle className="text-pink-500" />
                            <span>Identified Issues</span>
                        </h2>
                        {reportData.issues.map(issue => (
                            <motion.div
                                key={issue.id}
                                whileHover={{ scale: 1.01 }}
                                className="glass-morphism rounded-2xl p-6 border-l-4 border-l-pink-500"
                            >
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="font-bold text-lg text-white">{issue.title}</h3>
                                    <span className={`px-2 py-1 rounded-md text-[10px] uppercase font-black ${issue.severity === 'critical' ? 'bg-pink-500/20 text-pink-400' : 'bg-orange-500/20 text-orange-400'}`}>
                                        {issue.severity}
                                    </span>
                                </div>
                                <p className="text-slate-400 text-sm mb-4">{issue.desc}</p>
                                <div className="bg-slate-900/50 p-4 rounded-xl border border-white/5">
                                    <h4 className="text-xs font-bold text-indigo-400 mb-2 uppercase flex items-center space-x-1">
                                        <CheckCircle size={12} />
                                        <span>Suggested Fix</span>
                                    </h4>
                                    <p className="text-xs font-mono text-slate-300">{issue.fix}</p>
                                </div>
                            </motion.div>
                        ))}
                    </section>
                </div>

                {/* Right Column: Persona Debate & Heatmap */}
                <div className="space-y-8">
                    <section className="glass-morphism rounded-3xl p-6">
                        <h2 className="text-xl font-bold mb-6 flex items-center space-x-2">
                            <Users className="text-indigo-400" />
                            <span>Persona Debate</span>
                        </h2>
                        <div className="space-y-4 relative">
                            <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-white/5"></div>
                            {reportData.debate.map((d, i) => (
                                <div key={i} className="relative pl-10">
                                    <div className="absolute left-2.5 top-1.5 w-3 h-3 rounded-full bg-indigo-500 border-2 border-slate-900 shadow-glow"></div>
                                    <span className="text-[10px] font-black uppercase text-indigo-400 tracking-widest">{d.persona || d.winner}</span>
                                    <p className="text-sm text-slate-300 mt-1 italic">"{d.comment || d.resolution}"</p>
                                </div>
                            ))}
                        </div>
                    </section>

                    <section className="glass-morphism rounded-3xl p-6 bg-gradient-to-br from-indigo-600/10 to-transparent">
                        <h2 className="text-xl font-bold mb-4 flex items-center space-x-2">
                            <MapIcon className="text-emerald-400" />
                            <span>Frustration Heatmap</span>
                        </h2>
                        <div className="aspect-square bg-slate-900 rounded-2xl relative overflow-hidden border border-white/5 group">
                            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1618401471353-b98aadebc248?q=80&w=400&auto=format&fit=crop')] bg-cover opacity-30 grayscale group-hover:opacity-50 transition-opacity"></div>
                            {/* Dummy Heatmap Spots */}
                            <div className="absolute top-1/4 left-1/3 w-20 h-20 bg-pink-500/40 rounded-full blur-2xl animate-pulse"></div>
                            <div className="absolute bottom-1/3 right-1/4 w-16 h-16 bg-orange-500/30 rounded-full blur-xl animate-pulse delay-700"></div>
                            <div className="absolute inset-0 flex items-center justify-center">
                                <span className="text-[10px] font-bold text-slate-500 bg-slate-900/80 px-2 py-1 rounded">Visual Matrix Active</span>
                            </div>
                        </div>
                        <div className="mt-4 flex items-center justify-between text-xs">
                            <span className="text-slate-500 font-medium">Rage Quit Prob.</span>
                            <span className="text-pink-400 font-black">15% - Low</span>
                        </div>
                    </section>

                    <button className="w-full bg-gradient-to-r from-indigo-600 to-indigo-500 p-4 rounded-2xl font-black text-white hover:scale-[1.02] transition-transform shadow-xl shadow-indigo-500/20 flex items-center justify-center space-x-2">
                        <Rocket size={20} />
                        <span>Create One-Click Fix PR</span>
                    </button>
                </div>
            </main>
        </div>
    );
};

export default ReportPage;
