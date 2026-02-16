// ReportPage Component - Interactive Analysis Dashboard
// Displays AI-generated UX audit results with visualizations
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AlertTriangle, CheckCircle, TrendingUp, TrendingDown, Users, Map as MapIcon, Share2, Download, Rocket, ChevronRight, LayoutDashboard, Search, ArrowLeft, Loader2 } from 'lucide-react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

interface Issue {
    id: string;
    severity: string;
    title: string;
    description: string;
    fixCode: string | null;
}

interface DebateEntry {
    persona?: string;
    winner?: string;
    comment?: string;
    resolution?: string;
    icon: string;
}

interface SessionData {
    id: string;
    url: string;
    persona: string;
    status: string;
    progress: number;
    report?: {
        uxScore: number;
        summary: string;
        frustrationData: { rageQuitProb: number } | null;
        personaDebate: DebateEntry[] | null;
        issues: Issue[];
    };
}

const ReportPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [session, setSession] = useState<SessionData | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!id) return;

        const fetchSession = async () => {
            try {
                const response = await axios.get(`${API_URL}/api/sessions/${id}`);
                setSession(response.data);

                // If not completed, poll again
                if (response.data.status !== 'completed' && response.data.status !== 'failed') {
                    setTimeout(fetchSession, 2000);
                }
            } catch (err: any) {
                setError(err.response?.data?.error || 'Failed to load session');
            }
        };

        fetchSession();
    }, [id]);

    // --- Loading State ---
    if (!session) {
        if (error) {
            return (
                <div className="min-h-screen bg-[#030711] text-slate-100 flex items-center justify-center mesh-gradient">
                    <div className="text-center space-y-6">
                        <div className="text-6xl">?</div>
                        <h1 className="text-2xl font-black text-rose-400">{error}</h1>
                        <button onClick={() => navigate('/')} className="btn-primary px-6 py-3 rounded-xl">
                            <ArrowLeft size={18} className="inline mr-2" /> Go Back
                        </button>
                    </div>
                </div>
            );
        }
        return (
            <div className="min-h-screen bg-[#030711] text-slate-100 flex items-center justify-center mesh-gradient">
                <div className="text-center space-y-6">
                    <Loader2 size={48} className="animate-spin text-violet-400 mx-auto" />
                    <h1 className="text-2xl font-black text-white">Loading Analysis...</h1>
                </div>
            </div>
        );
    }

    // --- In-Progress State ---
    if (session.status !== 'completed' && session.status !== 'failed') {
        const statusMessages: Record<string, string> = {
            pending: '?? Preparing analysis engine...',
            exploring: '?? Fetching and exploring the page...',
            generating: '?? AI is analyzing the UX...',
        };

        return (
            <div className="min-h-screen bg-[#030711] text-slate-100 flex items-center justify-center mesh-gradient">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center space-y-8 max-w-md"
                >
                    <div className="relative">
                        <Loader2 size={64} className="animate-spin text-violet-400 mx-auto" />
                        <div className="absolute inset-0 w-16 h-16 mx-auto bg-violet-500/20 rounded-full blur-2xl animate-pulse" />
                    </div>
                    <h1 className="text-3xl font-black text-white tracking-tight">Analyzing UX</h1>
                    <p className="text-slate-400 font-medium text-lg">
                        {statusMessages[session.status] || 'Processing...'}
                    </p>
                    <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${session.progress}%` }}
                            transition={{ duration: 0.5, ease: 'easeOut' }}
                            className="h-full bg-gradient-to-r from-violet-500 to-emerald-500 rounded-full"
                        />
                    </div>
                    <p className="text-xs text-slate-600 font-mono">{session.progress}% — {session.url}</p>
                </motion.div>
            </div>
        );
    }

    // --- Failed State ---
    if (session.status === 'failed') {
        return (
            <div className="min-h-screen bg-[#030711] text-slate-100 flex items-center justify-center mesh-gradient">
                <div className="text-center space-y-6 max-w-md">
                    <div className="text-6xl">??</div>
                    <h1 className="text-2xl font-black text-rose-400">Analysis Failed</h1>
                    <p className="text-slate-400">Could not complete the analysis for this URL. Please try again.</p>
                    <button onClick={() => navigate('/')} className="btn-primary px-6 py-3 rounded-xl">
                        <ArrowLeft size={18} className="inline mr-2" /> Try Again
                    </button>
                </div>
            </div>
        );
    }

    // --- Completed: Show Report ---
    const report = session.report;
    if (!report) {
        return (
            <div className="min-h-screen bg-[#030711] text-slate-100 flex items-center justify-center mesh-gradient">
                <div className="text-center space-y-6">
                    <h1 className="text-2xl font-black text-rose-400">No report data found</h1>
                    <button onClick={() => navigate('/')} className="btn-primary px-6 py-3 rounded-xl">
                        <ArrowLeft size={18} className="inline mr-2" /> Go Back
                    </button>
                </div>
            </div>
        );
    }

    const rageQuitProb = report.frustrationData?.rageQuitProb ?? 0;
    const debate = report.personaDebate ?? [];
    const scoreColor = report.uxScore >= 7 ? 'text-emerald-400' : report.uxScore >= 4 ? 'text-amber-400' : 'text-rose-400';
    const perfLabel = report.uxScore >= 7 ? 'Optimal' : report.uxScore >= 4 ? 'Needs Work' : 'Critical';
    const perfIcon = report.uxScore >= 7 ? TrendingUp : TrendingDown;
    const PerfIcon = perfIcon;

    return (
        <div className="min-h-screen bg-[#030711] text-slate-100 p-6 md:p-12 mesh-gradient">
            {/* Header */}
            <header className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center mb-16 gap-6">
                <div>
                    <button onClick={() => navigate('/')} className="flex items-center gap-2 text-slate-500 hover:text-white transition-colors mb-4 text-sm font-bold">
                        <ArrowLeft size={16} /> Back to Home
                    </button>
                    <div className="flex items-center gap-3 mb-2 text-violet-400 font-bold uppercase tracking-[0.2em] text-[10px]">
                        <LayoutDashboard size={14} />
                        <span>Analysis Result</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black gradient-text tracking-tighter">UX Audit Report</h1>
                    <div className="flex items-center gap-4 mt-4 flex-wrap">
                        <span className="bg-white/5 border border-white/10 px-3 py-1 rounded-full text-xs font-mono text-slate-400">ID: #{session.id.slice(0, 8)}</span>
                        <span className="bg-white/5 border border-white/10 px-3 py-1 rounded-full text-xs font-mono text-slate-400">Persona: {session.persona}</span>
                        <span className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                            <Search size={12} />
                            {session.url}
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
                {/* Left Column: Metrics & Issues */}
                <div className="lg:col-span-8 space-y-10">
                    <motion.section
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="glass-card rounded-[2.5rem] p-10 relative overflow-hidden group"
                    >
                        <div className="absolute top-0 right-0 w-64 h-64 bg-violet-600/10 rounded-full blur-[100px] -mr-32 -mt-32 transition-transform group-hover:scale-110 duration-700"></div>

                        <div className="relative flex flex-col md:flex-row items-center justify-between gap-10">
                            <div className="text-center md:text-left">
                                <h2 className="text-xs font-black text-slate-500 mb-2 tracking-[0.3em] uppercase">User Experience Health</h2>
                                <div className="flex items-baseline justify-center md:justify-start gap-3">
                                    <span className={`text-8xl font-black tracking-tighter ${scoreColor}`}>{report.uxScore}</span>
                                    <span className="text-2xl font-bold text-slate-600 tracking-tight">/ 10</span>
                                </div>
                                <div className={`mt-6 flex items-center justify-center md:justify-start gap-2 ${report.uxScore >= 7 ? 'bg-emerald-500/10 border-emerald-500/20' : report.uxScore >= 4 ? 'bg-amber-500/10 border-amber-500/20' : 'bg-rose-500/10 border-rose-500/20'} border px-4 py-2 rounded-2xl w-fit mx-auto md:mx-0`}>
                                    <PerfIcon size={20} className={scoreColor} />
                                    <span className={`font-black text-sm tracking-tight uppercase ${scoreColor}`}>Performance: {perfLabel}</span>
                                </div>
                            </div>

                            <div className="flex-1 md:max-w-md bg-white/[0.02] border border-white/[0.05] p-6 rounded-[2rem]">
                                <p className="text-slate-400 leading-relaxed font-medium italic">
                                    "{report.summary}"
                                </p>
                            </div>
                        </div>
                    </motion.section>

                    <section className="space-y-6">
                        <h2 className="text-2xl font-black flex items-center gap-3 tracking-tight">
                            <div className="w-10 h-10 rounded-xl bg-rose-500/20 flex items-center justify-center text-rose-500">
                                <AlertTriangle size={20} />
                            </div>
                            <span>Friction Elements ({report.issues.length})</span>
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {report.issues.map((issue, idx) => (
                                <motion.div
                                    key={issue.id || idx}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: idx * 0.1 }}
                                    whileHover={{ y: -5 }}
                                    className="glass-card rounded-[2rem] p-8 border-t-2 border-t-transparent hover:border-t-rose-500/50 transition-all duration-500"
                                >
                                    <div className="flex justify-between items-start mb-4">
                                        <h3 className="font-black text-xl text-white tracking-tight leading-tight">{issue.title}</h3>
                                        <span className={`px-2 py-0.5 rounded-lg text-[9px] uppercase font-black tracking-widest shrink-0 ml-2 ${issue.severity === 'critical' ? 'bg-rose-500/20 text-rose-400' : issue.severity === 'medium' ? 'bg-orange-500/20 text-orange-400' : 'bg-emerald-500/20 text-emerald-400'}`}>
                                            {issue.severity}
                                        </span>
                                    </div>
                                    <p className="text-slate-500 text-[15px] font-medium mb-8 leading-relaxed">{issue.description}</p>

                                    {issue.fixCode && (
                                        <div className="bg-slate-900/40 p-5 rounded-2xl border border-white/[0.05]">
                                            <h4 className="text-[10px] font-black text-violet-400 mb-3 uppercase tracking-[0.2em] flex items-center gap-2">
                                                <CheckCircle size={14} />
                                                <span>Resolution strategy</span>
                                            </h4>
                                            <p className="text-xs font-mono text-slate-300 leading-relaxed">{issue.fixCode}</p>
                                        </div>
                                    )}
                                </motion.div>
                            ))}
                        </div>
                    </section>
                </div>

                {/* Right Column */}
                <div className="lg:col-span-4 space-y-10">
                    {debate.length > 0 && (
                        <section className="glass-card rounded-[2.5rem] p-8">
                            <h2 className="text-xl font-black mb-10 flex items-center gap-3 tracking-tight">
                                <Users className="text-violet-400" />
                                <span>Persona Multi-Log</span>
                            </h2>
                            <div className="space-y-10 relative">
                                <div className="absolute left-6 top-2 bottom-2 w-[1px] bg-gradient-to-b from-violet-500/50 via-white/5 to-transparent"></div>

                                {debate.map((d: any, i: number) => (
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
                    )}

                    <section className="glass-card rounded-[2.5rem] p-8 bg-gradient-to-br from-violet-600/5 to-transparent relative overflow-hidden">
                        <h2 className="text-xl font-black mb-6 flex items-center gap-3 tracking-tight">
                            <MapIcon className="text-emerald-400" />
                            <span>Frustration Matrix</span>
                        </h2>

                        <div className="flex flex-col gap-4">
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Abandonment Risk</span>
                                <span className={`font-black text-lg ${rageQuitProb > 0.5 ? 'text-rose-400' : rageQuitProb > 0.25 ? 'text-amber-400' : 'text-emerald-400'}`}>
                                    {Math.round(rageQuitProb * 100)}%
                                </span>
                            </div>
                            <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${rageQuitProb * 100}%` }}
                                    transition={{ duration: 1, ease: 'easeOut' }}
                                    className="h-full bg-gradient-to-r from-violet-500 to-rose-500"
                                />
                            </div>
                        </div>
                    </section>

                    <button onClick={() => navigate('/')} className="w-full btn-primary !rounded-[2rem] py-6 flex flex-col items-center gap-1 group/rocket">
                        <div className="flex items-center gap-3">
                            <Rocket size={22} className="group-hover/rocket:-translate-y-1 group-hover/rocket:translate-x-1 transition-transform" />
                            <span className="text-lg">Run Another Audit</span>
                        </div>
                        <span className="text-[10px] opacity-60 font-medium uppercase tracking-[0.2em]">Analyze a new URL</span>
                    </button>
                </div>
            </main>
        </div>
    );
};

export default ReportPage;
