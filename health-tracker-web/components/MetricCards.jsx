'use client'
import { Moon, Footprints, Zap, Flame, Star, Sparkles, TrendingUp, Heart } from 'lucide-react'

export default function MetricCards({ latestLog }) {
    const sleepHours = latestLog?.sleep_hours != null ? Number(latestLog.sleep_hours) : 7.2
    const sleepQuality = latestLog?.sleep_quality != null ? Number(latestLog.sleep_quality) : 4
    const steps = latestLog?.steps != null ? Number(latestLog.steps) : 8420
    const activeMin = latestLog?.active_minutes != null ? Number(latestLog.active_minutes) : 42

    const stepsGoal = 10000
    const stepsPercent = Math.min(Math.round((steps / stepsGoal) * 100), 100)
    const caloriesBurned = Math.round(steps * 0.04 + activeMin * 5.5)

    const sleepGoal = 8.0
    const sleepPercent = Math.min(Math.round((sleepHours / sleepGoal) * 100), 100)

    const activeGoal = 45
    const activePercent = Math.min(Math.round((activeMin / activeGoal) * 100), 100)

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* 1. Sleep Duration & Quality */}
            <div className="glass-panel-interactive rounded-2xl p-5 border border-indigo-500/20 relative overflow-hidden group">
                <div className="flex items-center justify-between">
                    <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                        <Moon className="w-5 h-5" />
                    </div>
                    <div className="flex items-center gap-1 bg-indigo-950/60 px-2 py-0.5 rounded-md border border-indigo-500/30 text-[11px] text-indigo-300">
                        <span>Quality: {sleepQuality}/5</span>
                    </div>
                </div>

                <div className="mt-4">
                    <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Sleep & Rest</span>
                    <div className="flex items-baseline gap-1.5 mt-1">
                        <span className="text-2xl font-black text-white">{sleepHours}</span>
                        <span className="text-xs text-slate-400">hrs</span>
                    </div>
                </div>

                {/* Progress bar */}
                <div className="mt-3">
                    <div className="flex justify-between text-[11px] text-slate-400 mb-1">
                        <span>Goal: 8.0h</span>
                        <span>{sleepPercent}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-gradient-to-r from-indigo-500 to-cyan-400 rounded-full transition-all duration-700"
                            style={{ width: `${sleepPercent}%` }}
                        />
                    </div>
                </div>

                {/* Star rating icons */}
                <div className="flex items-center gap-1 mt-3">
                    {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                            key={star}
                            className={`w-3.5 h-3.5 ${star <= sleepQuality ? 'text-amber-400 fill-amber-400' : 'text-slate-700'
                                }`}
                        />
                    ))}
                </div>
            </div>

            {/* 2. Steps Metric */}
            <div className="glass-panel-interactive rounded-2xl p-5 border border-emerald-500/20 relative overflow-hidden group">
                <div className="flex items-center justify-between">
                    <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        <Footprints className="w-5 h-5" />
                    </div>
                    <div className="flex items-center gap-1 bg-emerald-950/60 px-2 py-0.5 rounded-md border border-emerald-500/30 text-[11px] text-emerald-300">
                        <Flame className="w-3 h-3 text-orange-400 fill-orange-400" />
                        <span>~{caloriesBurned} kcal</span>
                    </div>
                </div>

                <div className="mt-4">
                    <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Daily Steps</span>
                    <div className="flex items-baseline gap-1.5 mt-1">
                        <span className="text-2xl font-black text-white">{steps.toLocaleString()}</span>
                        <span className="text-xs text-slate-400">/ 10k</span>
                    </div>
                </div>

                {/* Progress bar */}
                <div className="mt-3">
                    <div className="flex justify-between text-[11px] text-slate-400 mb-1">
                        <span>Pace</span>
                        <span>{stepsPercent}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-gradient-to-r from-emerald-500 to-teal-300 rounded-full transition-all duration-700"
                            style={{ width: `${stepsPercent}%` }}
                        />
                    </div>
                </div>

                <p className="text-[11px] text-slate-400 mt-3 flex items-center gap-1">
                    <TrendingUp className="w-3 h-3 text-emerald-400" />
                    {steps >= 10000 ? 'Daily goal crushed!' : `${(10000 - steps).toLocaleString()} steps to target`}
                </p>
            </div>

            {/* 3. Active Minutes */}
            <div className="glass-panel-interactive rounded-2xl p-5 border border-cyan-500/20 relative overflow-hidden group">
                <div className="flex items-center justify-between">
                    <div className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                        <Zap className="w-5 h-5" />
                    </div>
                    <div className="flex items-center gap-1 bg-cyan-950/60 px-2 py-0.5 rounded-md border border-cyan-500/30 text-[11px] text-cyan-300">
                        <span>Cardio & Movement</span>
                    </div>
                </div>

                <div className="mt-4">
                    <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Active Minutes</span>
                    <div className="flex items-baseline gap-1.5 mt-1">
                        <span className="text-2xl font-black text-white">{activeMin}</span>
                        <span className="text-xs text-slate-400">min</span>
                    </div>
                </div>

                {/* Progress bar */}
                <div className="mt-3">
                    <div className="flex justify-between text-[11px] text-slate-400 mb-1">
                        <span>Goal: 45 min</span>
                        <span>{activePercent}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full transition-all duration-700"
                            style={{ width: `${activePercent}%` }}
                        />
                    </div>
                </div>

                <p className="text-[11px] text-slate-400 mt-3 flex items-center gap-1">
                    <Heart className="w-3 h-3 text-rose-400 fill-rose-400/40" />
                    Zone 2 & active heart recovery
                </p>
            </div>

            {/* 4. Daily Recovery & Insights Badge */}
            <div className="glass-panel-interactive rounded-2xl p-5 border border-purple-500/20 relative overflow-hidden group">
                <div className="flex items-center justify-between">
                    <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
                        <Sparkles className="w-5 h-5" />
                    </div>
                    <span className="px-2 py-0.5 rounded-md bg-purple-500/10 text-purple-300 border border-purple-500/20 text-[10px] font-medium">
                        Smart Coach
                    </span>
                </div>

                <div className="mt-4">
                    <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Recovery Status</span>
                    <div className="flex items-baseline gap-1.5 mt-1">
                        <span className="text-lg font-bold text-white">
                            {sleepQuality >= 4 && activeMin >= 30 ? 'Fully Primed' : 'Normal Adaptation'}
                        </span>
                    </div>
                </div>

                <p className="text-xs text-slate-300 mt-2 line-clamp-2">
                    {latestLog?.notes || 'Regular hydration and evening screen dimming will boost deep sleep cycles.'}
                </p>

                <div className="mt-3 pt-2 border-t border-white/5 flex items-center justify-between text-[11px] text-slate-400">
                    <span>Logged date</span>
                    <span className="text-slate-300 font-mono">{latestLog?.date || 'Today'}</span>
                </div>
            </div>
        </div>
    )
}
