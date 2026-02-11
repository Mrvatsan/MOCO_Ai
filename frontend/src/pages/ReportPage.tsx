import React from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, CheckCircle, TrendingUp, Users, Map as MapIcon, Share2, Download, Rocket, ChevronRight, LayoutDashboard, Search } from 'lucide-react';

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
            { persona: 'Layman', comment: "I couldn't find how to pay! The blue box covered everything.", icon: '👨‍💼' },
            { persona: 'Developer', comment: "The modal trigger is efficient, but the z-index collision is definitely a junior mistake.", icon: '💻' },
            { winner: 'AI Vote', resolution: "The z-index must be fixed; Layman's confusion is valid data.", icon: '🤖' }
        ]
    };

    return (
        <div className="min-h-screen bg-[#030711] text-slate-100 p-6 md:p-12 mesh-gradient">
            {/* Header / Sidebar-like top nav */}
            <header className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center mb-16 gap-6">
                <div>
                    <div className="flex items-center gap-3 mb-2 text-violet-400 font-bold uppercase tracking-[0.2em] text-[10px]">
                        <LayoutDashboard size={14} />
                        <span>Analysis Result</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black gradient-text tracking-tighter">UX Audit Report</h1>
                    <div className="flex items-center gap-4 mt-4">
                        <span className="bg-white/5 border border-white/10 px-3 py-1 rounded-full text-xs font-mono text-slate-400">ID: #UX-78219</span>
                        <span className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                            <Search size={12} />
                            localhost:3000
                        </span>
                    </div>
                </div>
                <div className="flex items-center gap-4 w-full md:w-auto">
                    <button className="flex-1 md:flex-none glass-card px-5 py-2.5 rounded-xl flex items-center justify-center space-x-2 hover:bg-white/5 transition-colors font-bold text-sm">
                        <Share2 size={18} />
                        <span>Share</span>
                    </button>
                    <button className="flex-1 md:flex-none btn-primary px-5 py-2.5 rounded-xl flex items-center justify-center space-x-2 text-sm shadow-xl shadow-violet-500/10">
                        <Download size={18} />
                        <span>Export Result</span>
                    </button>
                </div>
            </header>

            <main className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10">
                {/* Left Column: Metrics & Issues (Span 8) */}
                <div className="lg:col-span-8 space-y-10">
                    <section className="glass-card rounded-[2.5rem] p-10 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-violet-600/10 rounded-full blur-[100px] -mr-32 -mt-32 transition-transform group-hover:scale-110 duration-700"></div>

                        <div className="relative flex flex-col md:flex-row items-center justify-between gap-10">
                            <div className="text-center md:text-left">
                                <h2 className="text-xs font-black text-slate-500 mb-2 tracking-[0.3em] uppercase">User Experience Health</h2>
                                <div className="flex items-baseline justify-center md:justify-start gap-3">
                                    <span className="text-8xl font-black text-white tracking-tighter">{reportData.uxScore}</span>
                                    <span className="text-2xl font-bold text-slate-600 tracking-tight">/ 10</span>
                                </div>
                                <div className="mt-6 flex items-center justify-center md:justify-start gap-2 bg-emerald-500/10 border border-emerald-500/20 px-4 py-2 rounded-2xl w-fit mx-auto md:mx-0">
                                    <TrendingUp size={20} className="text-emerald-400" />
                                    <span className="font-black text-emerald-400 text-sm tracking-tight uppercase">Performance: Optimal</span>
                                </div>
                            </div>

                            <div className="flex-1 md:max-w-md bg-white/[0.02] border border-white/[0.05] p-6 rounded-[2rem]">
                                <p className="text-slate-400 leading-relaxed font-medium italic">
                                    "{reportData.summary}"
                                </p>
                                <div className="mt-6 flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-violet-500/20 flex items-center justify-center text-violet-400">
                                        <TrendingUp size={20} />
                                    </div>
                                    <div className="text-[11px] text-slate-500 font-bold uppercase tracking-wider">
                                        Top 15% Analysis Tier
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    <section className="space-y-6">
                        <h2 className="text-2xl font-black flex items-center gap-3 tracking-tight">
                            <div className="w-10 h-10 rounded-xl bg-rose-500/20 flex items-center justify-center text-rose-500">
                                <AlertTriangle size={20} />
                            </div>
                            <span>Friction Elements</span>
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {reportData.issues.map(issue => (
                                <motion.div
                                    key={issue.id}
                                    whileHover={{ y: -5 }}
                                    className="glass-card rounded-[2rem] p-8 border-t-2 border-t-transparent hover:border-t-rose-500/50 transition-all duration-500"
                                >
                                    <div className="flex justify-between items-start mb-4">
                                        <h3 className="font-black text-xl text-white tracking-tight leading-tight">{issue.title}</h3>
                                        <span className={`px-2 py-0.5 rounded-lg text-[9px] uppercase font-black tracking-widest ${issue.severity === 'critical' ? 'bg-rose-500/20 text-rose-400' : 'bg-orange-500/20 text-orange-400'}`}>
                                            {issue.severity}
                                        </span>
                                    </div>
                                    <p className="text-slate-500 text-[15px] font-medium mb-8 leading-relaxed">{issue.desc}</p>

                                    <div className="bg-slate-900/40 p-5 rounded-2xl border border-white/[0.05] relative group/fix">
                                        <h4 className="text-[10px] font-black text-violet-400 mb-3 uppercase tracking-[0.2em] flex items-center gap-2">
                                            <CheckCircle size={14} />
                                            <span>Resolution strategy</span>
                                        </h4>
                                        <p className="text-xs font-mono text-slate-300 leading-relaxed">{issue.fix}</p>
                                        <div className="mt-4 flex items-center justify-end">
                                            <button className="text-[10px] font-black text-slate-500 hover:text-white flex items-center gap-1 uppercase tracking-widest transition-colors">
                                                Copy Snippet <ChevronRight size={12} />
                                            </button>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </section>
                </div>

                {/* Right Column (Span 4) */}
                <div className="lg:col-span-4 space-y-10">
                    <section className="glass-card rounded-[2.5rem] p-8">
                        <h2 className="text-xl font-black mb-10 flex items-center gap-3 tracking-tight">
                            <Users className="text-violet-400" />
                            <span>Persona Multi-Log</span>
                        </h2>
                        <div className="space-y-10 relative">
                            {/* Vertical Line */}
                            <div className="absolute left-6 top-2 bottom-2 w-[1px] bg-gradient-to-b from-violet-500/50 via-white/5 to-transparent"></div>

                            {reportData.debate.map((d: any, i) => (
                                <div key={i} className="relative pl-14 group">
                                    <div className="absolute left-1.5 top-0 w-9 h-9 rounded-xl bg-slate-900 border border-white/10 flex items-center justify-center text-lg shadow-xl group-hover:scale-110 transition-transform duration-300 z-10">
                                        {d.icon}
                                    </div>
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className="text-[10px] font-black uppercase text-violet-400 tracking-widest">{d.persona || d.winner}</span>
                                        <div className="h-[1px] flex-1 bg-white/5"></div>
                                    </div>
                                    <p className="text-sm text-slate-400 font-medium italic leading-relaxed">
                                        "{d.comment || d.resolution}"
                                    </p>
                                </div>
                            ))}
                        </div>
                    </section>

                    <section className="glass-card rounded-[2.5rem] p-8 bg-gradient-to-br from-violet-600/5 to-transparent relative overflow-hidden">
                        <h2 className="text-xl font-black mb-6 flex items-center gap-3 tracking-tight">
                            <MapIcon className="text-emerald-400" />
                            <span>Frustration Matrix</span>
                        </h2>
                        <div className="aspect-square bg-slate-950/50 rounded-3xl relative overflow-hidden border border-white/10 group cursor-crosshair">
                            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1618401471353-b98aadebc248?q=80&w=400&auto=format&fit=crop')] bg-cover opacity-20 grayscale-0 group-hover:opacity-40 transition-opacity duration-700"></div>

                            {/* Heatmap Spots */}
                            <div className="absolute top-[30%] left-[40%] w-24 h-24 bg-rose-600/30 rounded-full blur-3xl animate-pulse"></div>
                            <div className="absolute bottom-[20%] right-[15%] w-20 h-20 bg-orange-600/20 rounded-full blur-2xl animate-pulse delay-700"></div>

                            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <span className="text-[10px] font-black text-white bg-violet-600 px-3 py-1.5 rounded-full shadow-2xl uppercase tracking-widest">Identify Hotspots</span>
                            </div>
                        </div>

                        <div className="mt-8 flex flex-col gap-4">
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Abandonment Risk</span>
                                <span className="text-rose-400 font-black text-lg">{Math.round(reportData.rageQuitProb * 100)}%</span>
                            </div>
                            <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${reportData.rageQuitProb * 100}%` }}
                                    transition={{ duration: 1, ease: 'easeOut' }}
                                    className="h-full bg-gradient-to-r from-violet-500 to-rose-500"
                                />
                            </div>
                        </div>
                    </section>

                    <button className="w-full btn-primary !rounded-[2rem] py-6 flex flex-col items-center gap-1 group/rocket">
                        <div className="flex items-center gap-3">
                            <Rocket size={22} className="group-hover/rocket:-translate-y-1 group-hover/rocket:translate-x-1 transition-transform" />
                            <span className="text-lg">Deploy Optimization PR</span>
                        </div>
                        <span className="text-[10px] opacity-60 font-medium uppercase tracking-[0.2em]">One-click resolution</span>
                    </button>
                </div>
            </main>
        </div>
    );
};

export default ReportPage;
