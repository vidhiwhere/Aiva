'use client'
import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Sparkles, Wand2, Loader2 } from 'lucide-react'
import { theme as colors } from '@/lib/theme'
import HeroHeader from '@/components/HeroHeader'
import AivaCoachDrawer from '@/components/AivaCoachDrawer'

function greeting() {
    const h = new Date().getHours()
    if (h < 12) return 'Good morning'
    if (h < 18) return 'Good afternoon'
    return 'Good evening'
}

export default function HomePage({ initialLogs = [] }) {
    const router = useRouter()
    const [logs, setLogs] = useState(initialLogs)
    const [submitting, setSubmitting] = useState(false)
    const [aiParsing, setAiParsing] = useState(false)
    const [showAiBar, setShowAiBar] = useState(false)
    const [aiPrompt, setAiPrompt] = useState('')
    const [isChatOpen, setIsChatOpen] = useState(false)
    const [statusMessage, setStatusMessage] = useState('')

    const logSectionRef = useRef(null)
    const historySectionRef = useRef(null)

    const [form, setForm] = useState({
        date: new Date().toISOString().slice(0, 10),
        sleep_hours: '',
        sleep_quality: '3',
        steps: '',
        active_minutes: '',
        notes: '',
    })

    const today = new Date().toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
    })

    const scrollToLog = () => {
        logSectionRef.current?.scrollIntoView({ behavior: 'smooth' })
    }

    const scrollToHistory = () => {
        historySectionRef.current?.scrollIntoView({ behavior: 'smooth' })
    }

    // AI Fast-Log Parser
    async function handleAiParse() {
        if (!aiPrompt.trim() || aiParsing) return
        setAiParsing(true)
        try {
            const res = await fetch('/api/agent/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    messages: [{ role: 'user', content: aiPrompt }],
                    mode: 'parse_log',
                }),
            })
            const data = await res.json()
            if (data.parsedLog) {
                const p = data.parsedLog
                setForm({
                    date: p.date || form.date,
                    sleep_hours: p.sleep_hours != null ? String(p.sleep_hours) : form.sleep_hours,
                    sleep_quality: p.sleep_quality != null ? String(p.sleep_quality) : form.sleep_quality,
                    steps: p.steps != null ? String(p.steps) : form.steps,
                    active_minutes: p.active_minutes != null ? String(p.active_minutes) : form.active_minutes,
                    notes: p.notes || aiPrompt,
                })
                setStatusMessage('Auto-filled with Aiva AI!')
                setTimeout(() => setStatusMessage(''), 3000)
            }
        } catch (err) {
            console.error('AI Parse error:', err)
        } finally {
            setAiParsing(false)
        }
    }

    // Form Submit
    async function handleSubmit(e) {
        e.preventDefault()
        setSubmitting(true)
        const payload = {
            date: form.date,
            sleep_hours: form.sleep_hours ? Number(form.sleep_hours) : null,
            sleep_quality: form.sleep_quality ? Number(form.sleep_quality) : null,
            steps: form.steps ? Number(form.steps) : null,
            active_minutes: form.active_minutes ? Number(form.active_minutes) : null,
            notes: form.notes || null,
        }

        try {
            const res = await fetch('/api/entries', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            })

            const savedLog = res.ok ? await res.json() : { ...payload, id: 'temp-' + Date.now() }

            setLogs((prev) => {
                const idx = prev.findIndex((l) => l.date === savedLog.date)
                if (idx >= 0) {
                    const updated = [...prev]
                    updated[idx] = { ...updated[idx], ...savedLog }
                    return updated
                }
                return [savedLog, ...prev]
            })

            setForm({
                date: new Date().toISOString().slice(0, 10),
                sleep_hours: '',
                sleep_quality: '3',
                steps: '',
                active_minutes: '',
                notes: '',
            })

            setStatusMessage('Entry recorded ✨')
            setTimeout(() => setStatusMessage(''), 3500)
            router.refresh()
        } catch (err) {
            console.error('Submit error:', err)
            setStatusMessage('Entry saved locally.')
            setTimeout(() => setStatusMessage(''), 3500)
        } finally {
            setSubmitting(false)
        }
    }

    return (
        <main
            style={{
                background: colors.bg,
                color: colors.text,
                minHeight: '100vh',
                fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                paddingBottom: 96,
            }}
        >
            {/* 1. Centered Hero with Background Video (Prisma Reference Style) */}
            <HeroHeader
                onOpenChat={() => setIsChatOpen(true)}
                onScrollToLog={scrollToLog}
                onScrollToHistory={scrollToHistory}
            />

            {/* 2. Daily Health Tracker Content */}
            <div
                ref={logSectionRef}
                style={{
                    maxWidth: 620,
                    margin: '64px auto 0',
                    padding: '0 20px',
                }}
            >
                {/* Greeting & Date */}
                <h2 style={{ fontSize: 32, fontWeight: 700, margin: 0, letterSpacing: '-0.5px', color: colors.text }}>
                    {greeting()}
                </h2>
                <p style={{ color: colors.textMuted, marginTop: 4, marginBottom: 28, fontSize: 15 }}>
                    {today}
                </p>

                {/* AI Assistant Quick-Fill Bar */}
                {showAiBar && (
                    <div
                        style={{
                            background: colors.bgSecondary,
                            border: `1px solid ${colors.border}`,
                            borderRadius: 10,
                            padding: 14,
                            marginBottom: 16,
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 10,
                        }}
                    >
                        <div style={{ fontSize: 12, color: colors.textMuted, display: 'flex', alignItems: 'center', gap: 6 }}>
                            <Wand2 size={13} style={{ color: '#9B6D36' }} />
                            <span>Describe your day (e.g. "Slept 8 hrs, 9500 steps, 40 min run, felt great"):</span>
                        </div>
                        <div style={{ display: 'flex', gap: 8 }}>
                            <input
                                type="text"
                                placeholder="Type or paste your daily notes..."
                                value={aiPrompt}
                                onChange={(e) => setAiPrompt(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAiParse())}
                                style={{
                                    flex: 1,
                                    background: colors.bg,
                                    border: `1px solid ${colors.border}`,
                                    color: colors.text,
                                    padding: '8px 12px',
                                    borderRadius: 6,
                                    fontSize: 13,
                                }}
                            />
                            <button
                                type="button"
                                onClick={handleAiParse}
                                disabled={aiParsing || !aiPrompt.trim()}
                                style={{
                                    background: colors.accent,
                                    color: colors.text,
                                    border: 'none',
                                    borderRadius: 6,
                                    padding: '0 14px',
                                    fontWeight: 700,
                                    fontSize: 13,
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 6,
                                    opacity: aiParsing || !aiPrompt.trim() ? 0.6 : 1,
                                }}
                            >
                                {aiParsing ? <Loader2 size={14} className="animate-spin" /> : <Sparkles size={14} />}
                                <span>Auto-Fill</span>
                            </button>
                        </div>
                    </div>
                )}

                {/* Status toast */}
                {statusMessage && (
                    <div
                        style={{
                            padding: '8px 14px',
                            background: 'rgba(91, 122, 88, 0.15)',
                            border: `1px solid ${colors.success}`,
                            color: colors.success,
                            borderRadius: 6,
                            fontSize: 13,
                            marginBottom: 16,
                            fontWeight: 600,
                        }}
                    >
                        {statusMessage}
                    </div>
                )}

                {/* Quick Entry Form (Editorial Warm Beige Journal Card) */}
                <form
                    onSubmit={handleSubmit}
                    style={{
                        background: colors.surface,
                        borderTop: `1px solid ${colors.border}`,
                        borderRight: `1px solid ${colors.border}`,
                        borderBottom: `1px solid ${colors.border}`,
                        borderLeft: `4px solid ${colors.accent}`,
                        borderRadius: 12,
                        padding: 24,
                        display: 'grid',
                        gridTemplateColumns: '1fr 1fr',
                        gap: 16,
                        boxShadow: '0 8px 24px rgba(23, 40, 50, 0.05)',
                        color: colors.text,
                    }}
                >
                    {/* Header bar of form with AI auto-fill trigger */}
                    <div
                        style={{
                            gridColumn: '1 / -1',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            marginBottom: 4,
                        }}
                    >
                        <span style={{ fontSize: 13, fontWeight: 700, color: colors.text, letterSpacing: '0.5px', textTransform: 'uppercase' }}>
                            Daily Log
                        </span>
                        <button
                            type="button"
                            onClick={() => setShowAiBar(!showAiBar)}
                            style={{
                                background: 'transparent',
                                border: 'none',
                                color: '#9B6D36',
                                fontSize: 12,
                                fontWeight: 600,
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: 4,
                                padding: 0,
                            }}
                        >
                            <Wand2 size={12} />
                            <span>{showAiBar ? 'Hide AI Auto-Fill' : 'AI Auto-Fill'}</span>
                        </button>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                        <label style={{ fontSize: 13, fontWeight: 600, color: colors.textMuted }}>Date</label>
                        <input
                            type="date"
                            name="date"
                            value={form.date}
                            onChange={(e) => setForm({ ...form, date: e.target.value })}
                            style={{
                                background: colors.bg,
                                border: `1px solid ${colors.border}`,
                                borderRadius: 6,
                                color: colors.text,
                                padding: '8px 12px',
                                fontSize: 14,
                            }}
                        />
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                        <label style={{ fontSize: 13, fontWeight: 600, color: colors.textMuted }}>Sleep hours</label>
                        <input
                            type="number"
                            step="0.1"
                            name="sleep_hours"
                            placeholder="7.5"
                            value={form.sleep_hours}
                            onChange={(e) => setForm({ ...form, sleep_hours: e.target.value })}
                            style={{
                                background: colors.bg,
                                border: `1px solid ${colors.border}`,
                                borderRadius: 6,
                                color: colors.text,
                                padding: '8px 12px',
                                fontSize: 14,
                            }}
                        />
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                        <label style={{ fontSize: 13, fontWeight: 600, color: colors.textMuted }}>Sleep quality (1–5)</label>
                        <input
                            type="number"
                            min="1"
                            max="5"
                            name="sleep_quality"
                            placeholder="3"
                            value={form.sleep_quality}
                            onChange={(e) => setForm({ ...form, sleep_quality: e.target.value })}
                            style={{
                                background: colors.bg,
                                border: `1px solid ${colors.border}`,
                                borderRadius: 6,
                                color: colors.text,
                                padding: '8px 12px',
                                fontSize: 14,
                            }}
                        />
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                        <label style={{ fontSize: 13, fontWeight: 600, color: colors.textMuted }}>Steps</label>
                        <input
                            type="number"
                            name="steps"
                            placeholder="8000"
                            value={form.steps}
                            onChange={(e) => setForm({ ...form, steps: e.target.value })}
                            style={{
                                background: colors.bg,
                                border: `1px solid ${colors.border}`,
                                borderRadius: 6,
                                color: colors.text,
                                padding: '8px 12px',
                                fontSize: 14,
                            }}
                        />
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                        <label style={{ fontSize: 13, fontWeight: 600, color: colors.textMuted }}>Active minutes</label>
                        <input
                            type="number"
                            name="active_minutes"
                            placeholder="30"
                            value={form.active_minutes}
                            onChange={(e) => setForm({ ...form, active_minutes: e.target.value })}
                            style={{
                                background: colors.bg,
                                border: `1px solid ${colors.border}`,
                                borderRadius: 6,
                                color: colors.text,
                                padding: '8px 12px',
                                fontSize: 14,
                            }}
                        />
                    </div>

                    <div style={{ gridColumn: '1 / -1', display: 'flex', flexDirection: 'column', gap: 6 }}>
                        <label style={{ fontSize: 13, fontWeight: 600, color: colors.textMuted }}>Notes</label>
                        <input
                            type="text"
                            name="notes"
                            placeholder="How the day felt"
                            value={form.notes}
                            onChange={(e) => setForm({ ...form, notes: e.target.value })}
                            style={{
                                background: colors.bg,
                                border: `1px solid ${colors.border}`,
                                borderRadius: 6,
                                color: colors.text,
                                padding: '8px 12px',
                                fontSize: 14,
                            }}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={submitting}
                        style={{
                            gridColumn: '1 / -1',
                            marginTop: 8,
                            background: colors.accent,
                            color: colors.text,
                            border: 'none',
                            borderRadius: 999,
                            padding: '10px 22px',
                            fontSize: 15,
                            fontWeight: 700,
                            cursor: 'pointer',
                            width: 'fit-content',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 8,
                            opacity: submitting ? 0.7 : 1,
                            transition: 'opacity 0.2s ease',
                        }}
                    >
                        {submitting ? <Loader2 size={16} className="animate-spin" /> : null}
                        <span>{submitting ? 'Saving...' : 'Log today'}</span>
                    </button>
                </form>

                {/* History Timeline on Beige Canvas */}
                <div ref={historySectionRef}>
                    <h2 style={{ fontSize: 20, fontWeight: 700, margin: '48px 0 4px', letterSpacing: '-0.3px', color: colors.text }}>
                        History
                    </h2>
                    <div style={{ marginTop: 12 }}>
                        {logs?.map((log) => {
                            const d = new Date(log.date + 'T00:00:00')
                            const weekday = isNaN(d) ? '' : d.toLocaleDateString('en-US', { weekday: 'short' })
                            const dayNum = isNaN(d) ? log.date : d.getDate()

                            return (
                                <div
                                    key={log.id || log.date}
                                    style={{
                                        display: 'grid',
                                        gridTemplateColumns: '56px 1fr',
                                        gap: 16,
                                        padding: '16px 0',
                                        borderLeft: `1px solid ${colors.border}`,
                                        paddingLeft: 20,
                                        marginLeft: 6,
                                        position: 'relative',
                                    }}
                                >
                                    {/* Left Date badge */}
                                    <div style={{ textAlign: 'center' }}>
                                        <div style={{ fontSize: 12, color: colors.textMuted, textTransform: 'uppercase', fontWeight: 600 }}>
                                            {weekday}
                                        </div>
                                        <div style={{ fontSize: 20, fontWeight: 700, color: colors.text, lineHeight: 1.2 }}>
                                            {dayNum}
                                        </div>
                                    </div>

                                    {/* Right Metric Content */}
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                                        <div style={{ fontSize: 14, color: colors.textMuted }}>
                                            <span style={{ color: colors.text, fontWeight: 600 }}>{log.sleep_hours ?? '–'}h</span> sleep · quality{' '}
                                            <span style={{ color: '#A06D35', fontWeight: 700 }}>{log.sleep_quality ?? '–'}</span>/5
                                        </div>
                                        <div style={{ fontSize: 14, color: colors.textMuted }}>
                                            <span style={{ color: colors.text, fontWeight: 600 }}>{log.steps ? Number(log.steps).toLocaleString() : '–'}</span> steps ·{' '}
                                            <span style={{ color: colors.text, fontWeight: 600 }}>{log.active_minutes ?? '–'}</span> active min
                                        </div>
                                        {log.notes && (
                                            <div style={{ fontSize: 13, color: colors.textMuted, fontStyle: 'italic', marginTop: 2 }}>
                                                "{log.notes}"
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )
                        })}

                        {(!logs || logs.length === 0) && (
                            <p style={{ color: colors.textMuted, paddingLeft: 26, fontSize: 14 }}>No entries yet.</p>
                        )}
                    </div>
                </div>
            </div>

            {/* AIVA AI Companion Modal */}
            <AivaCoachDrawer
                isOpen={isChatOpen}
                onClose={() => setIsChatOpen(false)}
                logs={logs}
            />
        </main>
    )
}
