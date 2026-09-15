import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { TEMP_USER_ID } from '@/lib/constants'

export async function POST(req) {
    const supabase = await createClient()

    let body = {}
    const contentType = req.headers.get('content-type') || ''

    if (contentType.includes('application/json')) {
        body = await req.json()
    } else if (contentType.includes('form')) {
        const formData = await req.formData()
        body = Object.fromEntries(formData.entries())
    }

    const { date, sleep_hours, sleep_quality, steps, active_minutes, notes } = body

    const payload = {
        user_id: TEMP_USER_ID,
        date: date || new Date().toISOString().slice(0, 10),
        sleep_hours: sleep_hours ? Number(sleep_hours) : null,
        sleep_quality: sleep_quality ? Number(sleep_quality) : null,
        steps: steps ? Number(steps) : null,
        active_minutes: active_minutes ? Number(active_minutes) : null,
        notes: notes || null,
    }

    try {
        const { data, error } = await supabase
            .from('daily_logs')
            .upsert(payload, { onConflict: 'user_id,date' })
            .select()
            .single()

        if (contentType.includes('form') && !contentType.includes('json')) {
            return NextResponse.redirect(new URL('/', req.url), { status: 303 })
        }

        if (error) {
            return NextResponse.json({ error: error.message, fallback: payload }, { status: 200 })
        }
        return NextResponse.json(data)
    } catch (err) {
        return NextResponse.json({ fallback: payload, message: err.message }, { status: 200 })
    }
}

export async function GET() {
    const supabase = await createClient()

    try {
        const { data, error } = await supabase
            .from('daily_logs')
            .select('*')
            .eq('user_id', TEMP_USER_ID)
            .order('date', { ascending: false })
            .limit(30)

        if (error) return NextResponse.json({ error: error.message }, { status: 400 })
        return NextResponse.json(data || [])
    } catch (err) {
        return NextResponse.json({ error: err.message }, { status: 500 })
    }
}