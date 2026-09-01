import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { TEMP_USER_ID } from '@/lib/constants'

export async function POST(req) {
    const supabase = await createClient()

    const body = await req.json()
    const { date, sleep_hours, sleep_quality, steps, active_minutes, notes } = body

    const { data, error } = await supabase
        .from('daily_logs')
        .upsert(
            { user_id: TEMP_USER_ID, date, sleep_hours, sleep_quality, steps, active_minutes, notes },
            { onConflict: 'user_id,date' }
        )
        .select()
        .single()

    if (error) return NextResponse.json({ error: error.message }, { status: 400 })
    return NextResponse.json(data)
}

export async function GET() {
    const supabase = await createClient()

    const { data, error } = await supabase
        .from('daily_logs')
        .select('*')
        .eq('user_id', TEMP_USER_ID)
        .order('date', { ascending: false })
        .limit(30)

    if (error) return NextResponse.json({ error: error.message }, { status: 400 })
    return NextResponse.json(data)
}