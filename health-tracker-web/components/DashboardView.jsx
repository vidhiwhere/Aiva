'use client'
import { useState, useMemo } from 'react'
import Navbar from '@/components/Navbar'
import VitalityScoreCard from '@/components/VitalityScoreCard'
import MetricCards from '@/components/MetricCards'
import QuickEntryForm from '@/components/QuickEntryForm'
import HealthCharts from '@/components/HealthCharts'
import DailyLogCard from '@/components/DailyLogCard'
import AivaCoachModal from '@/components/AivaCoachModal'
import { Sparkles, Plus, History, Flame, RefreshCw, Layers, ShieldCheck, HeartPulse } from 'lucide-react'

// Rich sample fallback dataset if no entries in Supabase
const INITIAL_SAMPLE_LOGS = [
    {
        id: 'sample-1',
        date: new Date().toISOString().slice(0, 10),
        sleep_hours: 7.8,
        sleep_quality: 4,
        steps: 9240,
        active_minutes: 45,
        notes: 'Morning zone-2 run, great energy throughout the afternoon. Drank 3L water.'
    },
    {
        id: 'sample-2',
        date: new Date(Date.now() - 86400000).toISOString().slice(0, 10),
        sleep_hours: 8.2,
        sleep_quality: 5,
        steps: 11400,
        active_minutes: 55,
        notes: 'Full body strength session and evening sauna. Peak restorative recovery.'
    },
    {
        id: 'sample-3',
        date: new Date(Date.now() - 86400000 * 2).toISOString().slice(0, 10),
        sleep_hours: 7.0,
        sleep_quality: 3,
        steps: 8100,
        active_minutes: 30,
        notes: 'Late dinner pushed sleep slightly, but hit daily step quota.'
    },
    {
        id: 'sample-4',
        date: new Date(Date.now() - 86400000 * 3).toISOString().slice(0, 10),
        sleep_hours: 7.5,
        sleep_quality: 4,
        steps: 10200,
        active_minutes: 40,
        notes: 'Brisk outdoor walk in morning sunlight. Focus was top tier.'
    },
    {
        id: 'sample-5',
        date: new Date(Date.now() - 86400000 * 4).toISOString().slice(0, 10),
        sleep_hours: 6.8,
        sleep_quality: 3,
        steps: 7600,
        active_minutes: 25,
        notes: 'Moderate workday movement.'
    }
]

export default function DashboardView({ initialLogs = [] }) {
    const [logs, setLogs] = useState(
        initialLogs && initialLogs.length > 0 ? initialLogs : INITIAL_SAMPLE_LOGS
    )
    const [isChatOpen, setIsChatOpen] = useState(false)
    const [filterCategory, setFilterCategory] = useState('all') // 'all' | 'high-vitality' | 'notes'

    // Sort logs descending by date
    const sortedLogs = useMemo(() => {
        return [...logs].sort((a, b) => new Date(b.date) - new Date(a.date))
    }, [logs])

    const latestLog = sortedLogs[0] || null

    // Compute streak
    const streakCount = useMemo(() => {
        if (!sortedLogs.length) return 0
        return Math.min(sortedLogs.length, 7)
    }, [sortedLogs])

    // Handler when new log is saved from form
    const handleLogSaved = (newLog) => {
        setLogs(prev => {
            const existingIndex = prev.findIndex(l => l.date === newLog.date)
            if (existingIndex >= 0) {
                const updated = [...prev]
                updated[existingIndex] = { ...updated[existingIndex], ...newLog }
                return updated
            }
            return [newLog, ...prev]
        })
    }

    const filteredLogs = useMemo(() => {
        if (filterCategory === 'high-vitality') {
            return sortedLogs.filter(l => (l.sleep_quality || 0) >= 4 || (l.steps || 0) >= 10000)
        }
        if (filterCategory === 'notes') {
            return sortedLogs.filter(l => Boolean(l.notes))
        }
        return sortedLogs
    }, [sortedLogs, filterCategory])

    return (
        <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 selection:bg-cyan-500 selection:text-slate-950">
            {/* Top Navigation */}
            <Navbar
                onOpenChat={() => setIsChatOpen(true)}
                streakCount={streakCount}
            />

            {/* Main Content Area */}
            <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
                {/* Hero / Vitality Score Section */}
                <section>
                    <VitalityScoreCard
                        latestLog={latestLog}
                        onOpenChat={() => setIsChatOpen(true)}
                    />
                </section>

                {/* KPI Metrics Row */}
                <section>
                    <MetricCards latestLog={latestLog} />
                </section>

                {/* Interactive Grid: Quick Logger (Left) & 7-Day Chart (Right) */}
                <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    {/* Log Entry Form (5 cols on lg) */}
                    <div className="lg:col-span-5 w-full">
                        <QuickEntryForm onLogSaved={handleLogSaved} />
                    </div>

                    {/* Health Trends Visualizer (7 cols on lg) */}
                    <div className="lg:col-span-7 w-full">
                        <HealthCharts logs={sortedLogs} />
                    </div>
                </section>

                {/* History & Daily Logs Explorer */}
                <section className="glass-panel rounded-2xl p-6 border border-white/10 shadow-2xl">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-white/10">
                        <div>
                            <div className="flex items-center gap-2">
                                <History className="w-5 h-5 text-cyan-400" />
                                <h2 className="text-lg font-bold text-white">Vitality Log History</h2>
                            </div>
                            <p className="text-xs text-slate-400 mt-0.5">
                                Showing {filteredLogs.length} logged records
                            </p>
                        </div>

                        {/* Filter pills */}
                        <div className="flex items-center gap-2">
                            {[
                                { id: 'all', label: 'All Records' },
                                { id: 'high-vitality', label: 'Peak Days 🔥' },
                                { id: 'notes', label: 'With Notes 📝' },
                            ].map((f) => (
                                <button
                                    key={f.id}
                                    onClick={() => setFilterCategory(f.id)}
                                    className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${filterCategory === f.id
                                            ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                                            : 'bg-slate-900/60 text-slate-400 hover:text-white border border-white/5'
                                        }`}
                                >
                                    {f.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Logs Grid */}
                    <div className="mt-5 space-y-3">
                        {filteredLogs.map((log) => (
                            <DailyLogCard key={log.id || log.date} log={log} />
                        ))}

                        {filteredLogs.length === 0 && (
                            <div className="text-center py-12 text-slate-500">
                                <History className="w-8 h-8 mx-auto mb-2 opacity-40" />
                                <p className="text-sm font-medium">No records match this filter.</p>
                            </div>
                        )}
                    </div>
                </section>
            </main>

            {/* AI Coach Dialog / Drawer */}
            <AivaCoachModal
                isOpen={isChatOpen}
                onClose={() => setIsChatOpen(false)}
                logs={sortedLogs}
            />

            {/* Footer */}
            <footer className="border-t border-white/5 py-6 text-center text-xs text-slate-500">
                <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-400">AIVA</span>
                        <span>•</span>
                        <span>AI + Vitality Health Companion</span>
                    </div>
                    <p>Designed for peak daily performance, restorative sleep & longevity.</p>
                </div>
            </footer>
        </div>
    )
}
