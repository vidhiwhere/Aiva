import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(req) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user)
        return NextResponse.json(
            { error: 'unauthorized' },
            { status: 401 }
        )
    const body = await req.json()
    const {
        date,
        sleep_hours,
        sleep_quality,
        steps,
        ctive_minutes,
        notes
    } = body
    const { data, error } = await supabase.from('daily_logs')
        .upsert(
            {
                user_id: user.id,
                date,
                sleep_hours,
                sleep_quality,
                steps,
                active_minutes,
                notes
            },
            { onConflict: 'user_id,date' }
        ).select().single()
    if (error)
        return NextResponse.json(
            { error: error.message },
            { status: 400 }
        )
    return NextResponse.json(data)


}
export async function GET() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user)
        return NextResponse.json(
            { error: 'unauthorized' },
            { status: 401 }
        )

    const { data, error } = await supabase
        .from('daily_logs')
        .select('*')
        .eq('user_id', user.id)
        .order('date', { ascending: false })
        .limit(30)
    if (error)
        return NextResponse.json(

            { error: error.message },
            { status: 400 }
        )
    return NextResponse.json(data)


}
