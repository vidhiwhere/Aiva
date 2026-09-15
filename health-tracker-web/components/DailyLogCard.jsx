'use client'
import { useState } from 'react'
import { Moon, Footprints, Zap, Star, ChevronDown, ChevronUp, Calendar, FileText, Sparkles } from 'lucide-react'

const QUALITY_TAGS = {
    1: { label: 'Exhausted', color: 'bg-rose-500/10 text-rose-400 border-rose-500/20' },
    2: { label: 'Tired', color: 'bg-orange-500/10 text-orange-400 border-orange-500/20' },
    3: { label: 'Balanced', color: 'bg-blue-500/10 text-blue-400 border-blue-500/20' },
    4: { label: 'Energized', color: 'bg-teal-500/10 text-teal-400 border-teal-500/20' },
    5: { label: 'Peak Vitality', color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' }
}

export default function DailyLogCard({ log }) {
    const [expanded, setExpanded] = useState(false)

    // Formatted date
    const dateObj = new Date(log.date)
    const formattedDate = !isNaN(dateObj)
        ? dateObj.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
        : log.date

    const quality = log.sleep_quality ? QUALITY_TAGS[log.sleep_quality] : null

    return (
        <div className="glass-panel-interactive rounded-xl p-4 border border-white/5 transition-all">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                {/* Date & Quality badge */}
                <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-slate-900 border border-white/5 text-cyan-400">
                        <Calendar className="w-4 h-4" />
                    </div>
                    <div>
                        <div className="flex items-center gap-2">
                            <span className="font-bold text-sm text-white">{formattedDate}</span>
                            {quality && (
                                <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${quality.color}`}>
                                    {quality.label}
                                </span>
                            )}
                        </div>
                        <div className="flex items-center gap-1 mt-0.5">
                            {[1, 2, 3, 4, 5].map((s) => (
                                <Star
                                    key={s}
                                    className={`w-3 h-3 ${s <= (log.sleep_quality || 0) ? 'text-amber-400 fill-amber-400' : 'text-slate-800'
                                        }`}
                                />
                            ))}
                        </div>
                    </div>
                </div>

                {/* Metrics Pills */}
                <div className="flex flex-wrap items-center gap-2 text-xs">
                    {/* Sleep */}
                    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-indigo-950/40 border border-indigo-500/20 text-indigo-300">
                        <Moon className="w-3.5 h-3.5 text-indigo-400" />
                        <span className="font-semibold">{log.sleep_hours ?? '–'}h</span>
                    </div>

                    {/* Steps */}
                    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-950/40 border border-emerald-500/20 text-emerald-300">
                        <Footprints className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="font-semibold">{log.steps ? Number(log.steps).toLocaleString() : '–'}</span>
                    </div>

                    {/* Active */}
                    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-cyan-950/40 border border-cyan-500/20 text-cyan-300">
                        <Zap className="w-3.5 h-3.5 text-cyan-400" />
                        <span className="font-semibold">{log.active_minutes ?? '–'}m</span>
                    </div>

                    {/* Expand Notes toggle */}
                    {log.notes && (
                        <button
                            onClick={() => setExpanded(!expanded)}
                            className="p-1.5 rounded-lg bg-slate-900 border border-white/5 text-slate-400 hover:text-white transition-all ml-1"
                            title="Toggle Notes"
                        >
                            {expanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                        </button>
                    )}
                </div>
            </div>

            {/* Expanded Notes Section */}
            {expanded && log.notes && (
                <div className="mt-3 pt-3 border-t border-white/5 flex items-start gap-2 text-xs text-slate-300 animate-in fade-in duration-200">
                    <FileText className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                    <p className="leading-relaxed bg-slate-900/50 p-2.5 rounded-lg w-full border border-white/5">
                        {log.notes}
                    </p>
                </div>
            )}
        </div>
    )
}