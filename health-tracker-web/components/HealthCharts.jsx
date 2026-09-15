'use client'
import { useState } from 'react'
import { BarChart3, TrendingUp, Moon, Footprints, Zap, Sparkles } from 'lucide-react'

export default function HealthCharts({ logs = [] }) {
    const [activeMetric, setActiveMetric] = useState('vitality') // 'vitality' | 'steps' | 'sleep' | 'active'

    // Sort logs chronologically for chart display (oldest to newest)
    const sortedLogs = [...logs]
        .slice(0, 7)
        .reverse()

    // If no logs or sparse logs, generate sensible demo trends for a rich UI
    const defaultData = [
        { date: 'Mon', fullDate: '2026-09-08', sleep_hours: 7.2, sleep_quality: 4, steps: 8200, active_minutes: 35, score: 82 },
        { date: 'Tue', fullDate: '2026-09-09', sleep_hours: 6.8, sleep_quality: 3, steps: 9400, active_minutes: 40, score: 79 },
        { date: 'Wed', fullDate: '2026-09-10', sleep_hours: 8.0, sleep_quality: 5, steps: 11200, active_minutes: 55, score: 95 },
        { date: 'Thu', fullDate: '2026-09-11', sleep_hours: 7.5, sleep_quality: 4, steps: 7800, active_minutes: 25, score: 78 },
        { date: 'Fri', fullDate: '2026-09-12', sleep_hours: 7.0, sleep_quality: 4, steps: 10500, active_minutes: 50, score: 88 },
        { date: 'Sat', fullDate: '2026-09-13', sleep_hours: 8.4, sleep_quality: 5, steps: 12400, active_minutes: 60, score: 98 },
        { date: 'Sun', fullDate: '2026-09-14', sleep_hours: 7.8, sleep_quality: 4, steps: 9100, active_minutes: 35, score: 86 },
    ]

    const chartData = sortedLogs.length >= 3
        ? sortedLogs.map(l => {
            const d = new Date(l.date)
            const dayName = isNaN(d) ? l.date : d.toLocaleDateString('en-US', { weekday: 'short' })
            return {
                date: dayName,
                fullDate: l.date,
                sleep_hours: Number(l.sleep_hours || 7),
                sleep_quality: Number(l.sleep_quality || 3),
                steps: Number(l.steps || 7500),
                active_minutes: Number(l.active_minutes || 30),
                score: Math.min(Math.round(((l.sleep_hours || 7) / 8) * 35 + ((l.sleep_quality || 3) / 5) * 25 + Math.min((l.steps || 7000) / 10000, 1) * 25 + Math.min((l.active_minutes || 30) / 45, 1) * 15), 100)
            }
        })
        : defaultData

    const metricsConfig = {
        vitality: {
            label: 'Vitality Index',
            unit: 'pts',
            color: 'from-emerald-400 to-cyan-400',
            barColor: '#34d399',
            max: 100,
            getValue: (d) => d.score,
            format: (v) => `${v}/100`
        },
        steps: {
            label: 'Step Count',
            unit: 'steps',
            color: 'from-teal-400 to-emerald-500',
            barColor: '#10b981',
            max: 14000,
            getValue: (d) => d.steps,
            format: (v) => `${Number(v).toLocaleString()} steps`
        },
        sleep: {
            label: 'Sleep Hours',
            unit: 'hrs',
            color: 'from-indigo-400 to-purple-400',
            barColor: '#818cf8',
            max: 10,
            getValue: (d) => d.sleep_hours,
            format: (v) => `${v} hrs`
        },
        active: {
            label: 'Active Minutes',
            unit: 'min',
            color: 'from-cyan-400 to-blue-500',
            barColor: '#06b6d4',
            max: 75,
            getValue: (d) => d.active_minutes,
            format: (v) => `${v} min`
        }
    }

    const currentConfig = metricsConfig[activeMetric]
    const values = chartData.map(d => currentConfig.getValue(d))
    const average = Math.round((values.reduce((a, b) => a + b, 0) / values.length) * 10) / 10

    return (
        <div className="glass-panel rounded-2xl p-6 border border-white/10 shadow-2xl">
            {/* Chart Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-white/10">
                <div>
                    <div className="flex items-center gap-2">
                        <BarChart3 className="w-5 h-5 text-cyan-400" />
                        <h2 className="text-lg font-bold text-white">7-Day Vitality Trends</h2>
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5">
                        Weekly average: <span className="font-semibold text-cyan-300">{currentConfig.format(average)}</span>
                    </p>
                </div>

                {/* Metric Selector Tabs */}
                <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-900/90 border border-white/5 overflow-x-auto">
                    {[
                        { id: 'vitality', label: 'Vitality', icon: Sparkles },
                        { id: 'steps', label: 'Steps', icon: Footprints },
                        { id: 'sleep', label: 'Sleep', icon: Moon },
                        { id: 'active', label: 'Active', icon: Zap },
                    ].map((tab) => {
                        const Icon = tab.icon
                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveMetric(tab.id)}
                                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${activeMetric === tab.id
                                        ? 'bg-gradient-to-r from-cyan-500/20 to-teal-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                                        : 'text-slate-400 hover:text-white hover:bg-white/5'
                                    }`}
                            >
                                <Icon className="w-3.5 h-3.5" />
                                <span>{tab.label}</span>
                            </button>
                        )
                    })}
                </div>
            </div>

            {/* Interactive Bar Chart Visualization */}
            <div className="mt-6 pt-2">
                <div className="h-52 flex items-end justify-between gap-2 sm:gap-4 px-2">
                    {chartData.map((item, idx) => {
                        const val = currentConfig.getValue(item)
                        const heightPct = Math.max(Math.min(Math.round((val / currentConfig.max) * 100), 100), 8)

                        return (
                            <div key={idx} className="flex-1 flex flex-col items-center group h-full justify-end">
                                {/* Value tooltip on hover */}
                                <div className="opacity-0 group-hover:opacity-100 transition-all duration-200 mb-2 transform -translate-y-1 bg-slate-900 px-2.5 py-1 rounded-md text-[11px] font-bold text-white border border-white/10 shadow-lg pointer-events-none whitespace-nowrap z-20">
                                    {currentConfig.format(val)}
                                </div>

                                {/* Bar Element */}
                                <div className="w-full max-w-[42px] bg-slate-800/80 rounded-t-xl overflow-hidden p-0.5 flex flex-col justify-end group-hover:bg-slate-700/80 transition-all">
                                    <div
                                        className={`w-full rounded-t-lg bg-gradient-to-t ${currentConfig.color} shadow-lg transition-all duration-700 ease-out group-hover:brightness-110`}
                                        style={{ height: `${heightPct}%` }}
                                    />
                                </div>

                                {/* Date label */}
                                <div className="mt-3 text-center">
                                    <span className="text-xs font-semibold text-slate-300 group-hover:text-cyan-300 transition-colors">
                                        {item.date}
                                    </span>
                                </div>
                            </div>
                        )
                    })}
                </div>

                {/* Legend & Baseline Info */}
                <div className="mt-6 pt-4 border-t border-white/5 flex flex-wrap items-center justify-between text-xs text-slate-400">
                    <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: currentConfig.barColor }} />
                        <span>{currentConfig.label} daily progress</span>
                    </div>
                    <span className="text-[11px] text-slate-500">Target baseline: 80%+ consistency</span>
                </div>
            </div>
        </div>
    )
}
