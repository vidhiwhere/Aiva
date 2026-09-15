'use client'
import { Sparkles, Activity, ShieldCheck, Flame, MessageSquare } from 'lucide-react'

export default function Navbar({ onOpenChat, streakCount = 5, vitalityScore = 88 }) {
    const today = new Date().toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric'
    })

    return (
        <header className="sticky top-0 z-40 w-full border-b border-white/10 bg-slate-950/70 backdrop-blur-xl">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                {/* Logo & Title */}
                <div className="flex items-center gap-3">
                    <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 via-teal-400 to-emerald-400 shadow-lg shadow-cyan-500/20">
                        <Activity className="w-6 h-6 text-slate-950" />
                        <span className="absolute -top-1 -right-1 flex h-3 w-3">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                        </span>
                    </div>
                    <div>
                        <div className="flex items-center gap-2">
                            <span className="text-xl font-bold tracking-tight text-white">AIVA</span>
                            <span className="px-2 py-0.5 text-[10px] font-semibold tracking-wider uppercase rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                                AI + Vitality
                            </span>
                        </div>
                        <p className="text-xs text-slate-400 hidden sm:block">Intelligent Health & Recovery Engine</p>
                    </div>
                </div>

                {/* Status & Stats */}
                <div className="flex items-center gap-3 sm:gap-5">
                    <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900/80 border border-slate-800 text-xs text-slate-300">
                        <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                        <span>{today}</span>
                    </div>

                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs font-medium">
                        <Flame className="w-4 h-4 text-amber-400 fill-amber-400/30" />
                        <span>{streakCount} Day Streak</span>
                    </div>

                    {/* AI Coach Action Button */}
                    <button
                        onClick={onOpenChat}
                        className="relative group flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-cyan-500 to-teal-500 text-slate-950 text-xs sm:text-sm font-semibold shadow-md shadow-cyan-500/20 hover:shadow-cyan-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all"
                    >
                        <Sparkles className="w-4 h-4 animate-spin-slow" />
                        <span className="hidden sm:inline">Ask Aiva AI</span>
                        <span className="sm:hidden">AI</span>
                    </button>
                </div>
            </div>
        </header>
    )
}
