'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function QuickEntryForm() {
    const router = useRouter()
    const [submitting, setSubmitting] = useState(false)
    const [form, setForm] = useState({
        date: new Date().toISOString().slice(0, 10),
        sleep_hours: '',
        sleep_quality: '3',
        steps: '',
        active_minutes: '',
        notes: '',
    })

    async function handleSubmit(e) {
        e.preventDefault()
        setSubmitting(true)
        const res = await fetch('/api/entries', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                date: form.date,
                sleep_hours: form.sleep_hours ? Number(form.sleep_hours) : null,
                sleep_quality: Number(form.sleep_quality),
                steps: form.steps ? Number(form.steps) : null,
                active_minutes: form.active_minutes ? Number(form.active_minutes) : null,
                notes: form.notes || null,
            }),
        })
        setSubmitting(false)
        if (res.ok) {
            router.refresh()
            setForm((f) => ({ ...f, sleep_hours: '', steps: '', active_minutes: '', notes: '' }))
        }
    }

    return (
        <form onSubmit={handleSubmit} style={{ display: 'grid', gap: 8, maxWidth: 320 }}>
            <input type="date" value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })} />
            <input type="number" step="0.1" placeholder="Sleep hours"
                value={form.sleep_hours}
                onChange={(e) => setForm({ ...form, sleep_hours: e.target.value })} />
            <select value={form.sleep_quality}
                onChange={(e) => setForm({ ...form, sleep_quality: e.target.value })}>
                {[1, 2, 3, 4, 5].map((n) => <option key={n} value={n}>Sleep quality: {n}</option>)}
            </select>
            <input type="number" placeholder="Steps"
                value={form.steps}
                onChange={(e) => setForm({ ...form, steps: e.target.value })} />
            <input type="number" placeholder="Active minutes"
                value={form.active_minutes}
                onChange={(e) => setForm({ ...form, active_minutes: e.target.value })} />
            <textarea placeholder="Notes (optional)"
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })} />
            <button type="submit" disabled={submitting}>
                {submitting ? 'Saving...' : 'Log today'}
            </button>
        </form>
    )
}