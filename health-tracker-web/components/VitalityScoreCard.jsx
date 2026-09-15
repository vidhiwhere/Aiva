'use client'
import { Sparkles, HeartPulse, Zap, Moon, Footprints, ArrowUpRight } from 'lucide-react'

export function computeVitalityScore(log) {
    if (!log) return 72 // Default baseline score

    let score = 0
    let totalWeight = 0

    // 1. Sleep Duration (Target 7.5 - 8.5 hours)
    if (log.sleep_hours != null) {
        totalWeight += 35
        const hours = Number(log.sleep_hours)
        if (hours >= 7 && hours <= 9) score += 35
        else if (hours >= 6 && hours < 7) score += 26
        else if (hours > 9 && hours <= 10) score += 28
        else score += 15
    }

    // 2. Sleep Quality (1-5)
    if (log.sleep_quality != null) {
        totalWeight += 25
        score += (Number(log.sleep_quality) / 5) * 25
    }

    // 3. Steps (Target 10,000 steps)
    if (log.steps != null) {
        totalWeight += 25
        const stepsRatio = Math.min(Number(log.steps) / 10000, 1.2)
        score += Math.min(stepsRatio * 25, 25)
    }

    // 4. Active Minutes (Target 30-45 mins)
    if (log.active_minutes != null) {
        totalWeight += 15
        const activeRatio = Math.min(Number(log.active_minutes) / 35, 1.2)
        score += Math.min(activeRatio * 15, 15)
    }

    if (totalWeight === 0) return 75
    return Math.round((score / totalWeight) * 100)
}

export default function VitalityScoreCard({ latestLog, onOpenChat }) {
    const score = computeVitalityScore(latestLog)

    let statusText = 'Optimal Vitality'
    let statusColor = 'text-emerald-400'
    let ringColor = '#10b981'
    let advice = 'Circadian rhythm and activity are in top form.'

    if (score >= 85) {
        statusText = 'Peak Vitality'
        statusColor = 'text-emerald-400'
        ringColor = '#34d399'
        advice = 'Exceptional recovery & daily activity balance!'
    } else if (score >= 70) {
        statusText = 'Energized'
        statusColor = 'text-cyan-400'
        ringColor = '#06b6d4'
        advice = 'Strong momentum. Hydrate well and maintain step pacing.'
    } else if (score >= 50) {
        statusText = 'Moderate Balance'
        statusColor = 'text-amber-400'
        ringColor = '#f59e0b'
        advice = 'Prioritize 8+ hrs sleep tonight and light mobility stretches.'
    } else {
        statusText = 'Recovery Needed'
        statusColor = 'text-rose-400'
        ringColor = '#f43f5e'
        advice = 'Restorative rest and low intensity movement recommended.'
    }

    // SVG Circle calculations
    const radius = 48
    const circumference = 2 * Math.PI * radius
    const strokeDashoffset = circumference - (score / 100) * circumference

    return (
        <div className="relative overflow-hidden rounded-2xl p-6 glass-panel border border-cyan-500/20 shadow-xl shadow-cyan-950/30">
            {/* Background ambient glow */}
            <div className="absolute -right-12 -top-12 w-48 h-48 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -left-12 -bottom-12 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
                {/* Score Circular Gauge */}
                <div className="flex items-center gap-5">
                    <div className="relative flex items-center justify-center">
                        <svg className="w-28 h-28 transform -rotate-90">
                            <circle
                                cx="56"
                                cy="56"
                                r={radius}
                                stroke="rgba(255, 255, 255, 0.08)"
                                strokeWidth="8"
                                fill="transparent"
                            />
                            <circle
                                cx="56"
                                cy="56"
                                r={radius}
                                stroke={ringColor}
                                strokeWidth="8"
                                strokeDasharray={circumference}
                                strokeDashoffset={strokeDashoffset}
                                strokeLinecap="round"
                                fill="transparent"
                                className="transition-all duration-1000 ease-out"
                            />
                        </svg>
                        <div className="absolute flex flex-col items-center justify-center">
                            <span className="text-3xl font-extrabold text-white tracking-tight">{score}</span>
                            <span className="text-[10px] uppercase font-bold text-slate-400">Index</span>
                        </div>
                    </div>

                    <div>
                        <div className="flex items-center gap-2">
                            <span className={`text-lg font-bold ${statusColor}`}>{statusText}</span>
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-white/5 border border-white/10 text-slate-300">
                                Realtime
                            </span>
                        </div>
                        <p className="text-xs text-slate-300 mt-1 max-w-xs">{advice}</p>
                        <div className="flex items-center gap-3 mt-3 text-xs text-slate-400">
                            <span className="flex items-center gap-1"><Moon className="w-3.5 h-3.5 text-indigo-400" /> {latestLog?.sleep_hours ?? 7.5}h</span>
                            <span>•</span>
                            <span className="flex items-center gap-1"><Footprints className="w-3.5 h-3.5 text-emerald-400" /> {latestLog?.steps ? Number(latestLog.steps).toLocaleString() : '8,400'}</span>
                            <span>•</span>
                            <span className="flex items-center gap-1"><Zap className="w-3.5 h-3.5 text-amber-400" /> {latestLog?.active_minutes ?? 30}m</span>
                        </div>
                    </div>
                </div>

                {/* Quick AI Advisor Trigger */}
                <div className="flex flex-col sm:flex-row items-stretch md:items-center gap-2 w-full md:w-auto">
                    <button
                        onClick={onOpenChat}
                        className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-700/60 text-slate-200 text-xs font-semibold transition-all hover:border-cyan-500/40"
                    >
                        <Sparkles className="w-4 h-4 text-cyan-400" />
                        <span>AI Vitality Coach Advice</span>
                        <ArrowUpRight className="w-3.5 h-3.5 text-slate-400" />
                    </button>
                </div>
            </div>
        </div>
    )
}
