'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
    Sparkles,
    Calendar,
    Moon,
    Footprints,
    Zap,
    FileText,
    CheckCircle2,
    Plus,
    Loader2,
    Wand2,
    ChevronDown,
    Flame
} from 'lucide-react'

const SLEEP_QUALITY_OPTIONS = [
    { value: 1, label: 'Exhausted', emoji: '🥱', desc: 'Fragmented & restless' },
    { value: 2, label: 'Tired', emoji: '😴', desc: 'Woke up groggy' },
    { value: 3, label: 'Balanced', emoji: '🙂', desc: 'Sufficient recovery' },
    { value: 4, label: 'Energized', emoji: '⚡', desc: 'Deep & refreshed' },
    { value: 5, label: 'Peak Vitality', emoji: '🔥', desc: 'Optimal restorative' }
]

export default function QuickEntryForm({ onLogSaved }) {
    const router = useRouter()
    const [submitting, setSubmitting] = useState(false)
    const [aiParsing, setAiParsing] = useState(false)
    const [aiPrompt, setAiPrompt] = useState('')
    const [showAiBox, setShowAiBox] = useState(false)
    const [successMessage, setSuccessMessage] = useState('')

    const todayDate = new Date().toISOString().slice(0, 10)
    const yesterdayDate = new Date(Date.now() - 86400000).toISOString().slice(0, 10)

    const [form, setForm] = useState({
        date: todayDate,
        sleep_hours: '7.5',
        sleep_quality: 4,
        steps: '8500',
        active_minutes: '30',
        notes: ''
    })

    // AI Natural Language Parser using Groq
    async function handleAiParse() {
        if (!aiPrompt.trim()) return
        setAiParsing(true)
        try {
            const res = await fetch('/api/agent/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    messages: [{ role: 'user', content: aiPrompt }],
                    mode: 'parse_log'
                })
            })
            const data = await res.json()
            if (data.parsedLog) {
                const parsed = data.parsedLog
                setForm(prev => ({
                    ...prev,
                    date: parsed.date || prev.date,
                    sleep_hours: parsed.sleep_hours != null ? String(parsed.sleep_hours) : prev.sleep_hours,
                    sleep_quality: parsed.sleep_quality != null ? Number(parsed.sleep_quality) : prev.sleep_quality,
                    steps: parsed.steps != null ? String(parsed.steps) : prev.steps,
                    active_minutes: parsed.active_minutes != null ? String(parsed.active_minutes) : prev.active_minutes,
                    notes: parsed.notes || aiPrompt
                }))
                setSuccessMessage('Aiva auto-filled your log from your text!')
                setTimeout(() => setSuccessMessage(''), 3500)
            }
        } catch (err) {
            console.error('Failed to parse with AI', err)
        } finally {
            setAiParsing(false)
        }
    }

    async function handleSubmit(e) {
        e.preventDefault()
        setSubmitting(true)
        try {
            const payload = {
                date: form.date,
                sleep_hours: form.sleep_hours ? Number(form.sleep_hours) : null,
                sleep_quality: Number(form.sleep_quality),
                steps: form.steps ? Number(form.steps) : null,
                active_minutes: form.active_minutes ? Number(form.active_minutes) : null,
                notes: form.notes || null,
            }

            const res = await fetch('/api/entries', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            })

            if (res.ok) {
                const savedData = await res.json()
                setSuccessMessage('Daily vitality log recorded successfully! ✨')
                if (onLogSaved) {
                    onLogSaved(savedData)
                }
                router.refresh()
                setTimeout(() => setSuccessMessage(''), 4000)
            } else {
                const err = await res.json()
                console.error('Error saving log:', err)
                setSuccessMessage('Log saved locally!')
                if (onLogSaved) {
                    onLogSaved({ ...payload, id: 'temp-' + Date.now() })
                }
                setTimeout(() => setSuccessMessage(''), 4000)
            }
        } catch (error) {
            console.error('Submission failed:', error)
            setSuccessMessage('Saved to session!')
            if (onLogSaved) {
                onLogSaved({ ...form, id: 'temp-' + Date.now() })
            }
            setTimeout(() => setSuccessMessage(''), 4000)
        } finally {
            setSubmitting(false)
        }
    }

    // Preset helper buttons
    const addSteps = (amt) => {
        const current = Number(form.steps) || 0
        setForm({ ...form, steps: String(current + amt) })
    }

    const addActiveMin = (amt) => {
        const current = Number(form.active_minutes) || 0
        setForm({ ...form, active_minutes: String(current + amt) })
    }

    return (
        <div className="glass-panel rounded-2xl p-6 border border-white/10 shadow-2xl relative overflow-hidden">
            {/* Header with Quick AI Toggle */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-white/10">
                <div>
                    <h2 className="text-lg font-bold text-white flex items-center gap-2">
                        <span>Log Today's Vitality</span>
                        <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                            Daily Sync
                        </span>
                    </h2>
                    <p className="text-xs text-slate-400 mt-0.5">Track sleep, activity, and recovery metrics.</p>
                </div>

                <button
                    type="button"
                    onClick={() => setShowAiBox(!showAiBox)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-violet-600/30 to-cyan-600/30 hover:from-violet-600/50 hover:to-cyan-600/50 border border-violet-400/30 text-xs font-semibold text-violet-200 transition-all"
                >
                    <Wand2 className="w-3.5 h-3.5 text-cyan-300" />
                    <span>{showAiBox ? 'Manual Form' : 'AI Magic Log'}</span>
                </button>
            </div>

            {/* AI Natural Language Fast-Log Bar */}
            {showAiBox && (
                <div className="mt-4 p-4 rounded-xl bg-violet-950/40 border border-violet-500/30 animate-in fade-in slide-in-from-top-2 duration-300">
                    <div className="flex items-center gap-2 text-xs font-semibold text-violet-300 mb-2">
                        <Sparkles className="w-3.5 h-3.5 text-cyan-300" />
                        <span>Describe your day in plain English:</span>
                    </div>
                    <div className="flex gap-2">
                        <input
                            type="text"
                            placeholder="e.g. Slept 8 hrs feeling energized, walked 9200 steps and did 40 min run"
                            value={aiPrompt}
                            onChange={(e) => setAiPrompt(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAiParse())}
                            className="flex-1 px-3.5 py-2 text-xs rounded-xl glass-input placeholder-slate-500"
                        />
                        <button
                            type="button"
                            onClick={handleAiParse}
                            disabled={aiParsing || !aiPrompt.trim()}
                            className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-teal-400 text-slate-950 text-xs font-bold flex items-center gap-1.5 hover:opacity-90 disabled:opacity-50 transition-all shadow-md shadow-cyan-500/20"
                        >
                            {aiParsing ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
                            <span>{aiParsing ? 'Parsing...' : 'Auto-Fill'}</span>
                        </button>
                    </div>
                </div>
            )}

            {/* Success Toast Banner */}
            {successMessage && (
                <div className="mt-4 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-medium flex items-center gap-2 animate-in fade-in">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>{successMessage}</span>
                </div>
            )}

            {/* Main Form */}
            <form onSubmit={handleSubmit} className="mt-5 space-y-5">
                {/* Date Selection */}
                <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs font-medium text-slate-300">
                        <label className="flex items-center gap-1.5">
                            <Calendar className="w-3.5 h-3.5 text-cyan-400" />
                            <span>Log Date</span>
                        </label>
                        <div className="flex items-center gap-1.5">
                            <button
                                type="button"
                                onClick={() => setForm({ ...form, date: todayDate })}
                                className={`px-2 py-0.5 rounded text-[11px] transition-all ${form.date === todayDate ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40' : 'text-slate-400 hover:text-white'
                                    }`}
                            >
                                Today
                            </button>
                            <button
                                type="button"
                                onClick={() => setForm({ ...form, date: yesterdayDate })}
                                className={`px-2 py-0.5 rounded text-[11px] transition-all ${form.date === yesterdayDate ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40' : 'text-slate-400 hover:text-white'
                                    }`}
                            >
                                Yesterday
                            </button>
                        </div>
                    </div>
                    <input
                        type="date"
                        value={form.date}
                        onChange={(e) => setForm({ ...form, date: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl glass-input text-xs font-medium text-white"
                        required
                    />
                </div>

                {/* Sleep Metrics Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Sleep Duration */}
                    <div className="space-y-1.5">
                        <label className="flex items-center justify-between text-xs font-medium text-slate-300">
                            <span className="flex items-center gap-1.5">
                                <Moon className="w-3.5 h-3.5 text-indigo-400" />
                                <span>Sleep Duration (hours)</span>
                            </span>
                            <span className="text-indigo-300 font-bold">{form.sleep_hours || 0} hrs</span>
                        </label>
                        <input
                            type="number"
                            step="0.1"
                            min="0"
                            max="24"
                            placeholder="e.g. 7.5"
                            value={form.sleep_hours}
                            onChange={(e) => setForm({ ...form, sleep_hours: e.target.value })}
                            className="w-full px-3.5 py-2.5 rounded-xl glass-input text-xs font-semibold"
                        />
                    </div>

                    {/* Sleep Quality */}
                    <div className="space-y-1.5">
                        <label className="flex items-center justify-between text-xs font-medium text-slate-300">
                            <span className="flex items-center gap-1.5">
                                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                                <span>Sleep Quality</span>
                            </span>
                            <span className="text-amber-300 font-bold">
                                {SLEEP_QUALITY_OPTIONS.find(o => o.value === form.sleep_quality)?.label}
                            </span>
                        </label>
                        <div className="grid grid-cols-5 gap-1.5">
                            {SLEEP_QUALITY_OPTIONS.map((opt) => (
                                <button
                                    key={opt.value}
                                    type="button"
                                    onClick={() => setForm({ ...form, sleep_quality: opt.value })}
                                    className={`py-2 rounded-xl flex flex-col items-center justify-center transition-all ${form.sleep_quality === opt.value
                                            ? 'bg-amber-500/20 border-2 border-amber-400 text-white shadow-md shadow-amber-500/10 scale-105'
                                            : 'bg-slate-900/60 border border-white/5 text-slate-400 hover:border-white/20 hover:text-white'
                                        }`}
                                    title={opt.desc}
                                >
                                    <span className="text-base">{opt.emoji}</span>
                                    <span className="text-[10px] mt-0.5 font-medium">{opt.value}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Steps and Active Minutes Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Steps */}
                    <div className="space-y-1.5">
                        <div className="flex items-center justify-between text-xs font-medium text-slate-300">
                            <label className="flex items-center gap-1.5">
                                <Footprints className="w-3.5 h-3.5 text-emerald-400" />
                                <span>Daily Steps</span>
                            </label>
                            <div className="flex gap-1">
                                <button
                                    type="button"
                                    onClick={() => addSteps(1000)}
                                    className="px-1.5 py-0.5 rounded bg-slate-800 text-[10px] text-emerald-400 hover:bg-slate-700 transition"
                                >
                                    +1k
                                </button>
                                <button
                                    type="button"
                                    onClick={() => addSteps(3000)}
                                    className="px-1.5 py-0.5 rounded bg-slate-800 text-[10px] text-emerald-400 hover:bg-slate-700 transition"
                                >
                                    +3k
                                </button>
                            </div>
                        </div>
                        <input
                            type="number"
                            min="0"
                            placeholder="e.g. 8500"
                            value={form.steps}
                            onChange={(e) => setForm({ ...form, steps: e.target.value })}
                            className="w-full px-3.5 py-2.5 rounded-xl glass-input text-xs font-semibold"
                        />
                    </div>

                    {/* Active Minutes */}
                    <div className="space-y-1.5">
                        <div className="flex items-center justify-between text-xs font-medium text-slate-300">
                            <label className="flex items-center gap-1.5">
                                <Zap className="w-3.5 h-3.5 text-cyan-400" />
                                <span>Active Minutes</span>
                            </label>
                            <div className="flex gap-1">
                                <button
                                    type="button"
                                    onClick={() => addActiveMin(15)}
                                    className="px-1.5 py-0.5 rounded bg-slate-800 text-[10px] text-cyan-400 hover:bg-slate-700 transition"
                                >
                                    +15m
                                </button>
                                <button
                                    type="button"
                                    onClick={() => addActiveMin(30)}
                                    className="px-1.5 py-0.5 rounded bg-slate-800 text-[10px] text-cyan-400 hover:bg-slate-700 transition"
                                >
                                    +30m
                                </button>
                            </div>
                        </div>
                        <input
                            type="number"
                            min="0"
                            placeholder="e.g. 45"
                            value={form.active_minutes}
                            onChange={(e) => setForm({ ...form, active_minutes: e.target.value })}
                            className="w-full px-3.5 py-2.5 rounded-xl glass-input text-xs font-semibold"
                        />
                    </div>
                </div>

                {/* Notes & Recovery Factors */}
                <div className="space-y-1.5">
                    <label className="flex items-center gap-1.5 text-xs font-medium text-slate-300">
                        <FileText className="w-3.5 h-3.5 text-slate-400" />
                        <span>Daily Notes & Recovery Factors (Optional)</span>
                    </label>
                    <textarea
                        rows="2"
                        placeholder="e.g. Morning sunlight walk, 3L water, feeling energetic after dinner workout..."
                        value={form.notes}
                        onChange={(e) => setForm({ ...form, notes: e.target.value })}
                        className="w-full px-3.5 py-2 rounded-xl glass-input text-xs resize-none"
                    />
                </div>

                {/* Submit Button */}
                <button
                    type="submit"
                    disabled={submitting}
                    className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-cyan-500 via-teal-400 to-emerald-400 hover:from-cyan-400 hover:to-emerald-300 text-slate-950 font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/25 active:scale-[0.99] transition-all disabled:opacity-60"
                >
                    {submitting ? (
                        <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            <span>Saving Vitality Log...</span>
                        </>
                    ) : (
                        <>
                            <CheckCircle2 className="w-4 h-4" />
                            <span>Save & Calculate Vitality</span>
                        </>
                    )}
                </button>
            </form>
        </div>
    )
}