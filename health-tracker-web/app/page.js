import { createClient } from '@/lib/supabase/server'
import HomePage from '@/components/HomePage'
import { TEMP_USER_ID } from '@/lib/constants'

export const metadata = {
  title: 'AIVA — Daily Health & Vitality Log',
  description: 'AI-assisted vitality tracking with restorative sleep, daily movement, and intelligent recovery coaching.',
}

export default async function Page() {
  let logs = []

  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('daily_logs')
      .select('*')
      .eq('user_id', TEMP_USER_ID)
      .order('date', { ascending: false })
      .limit(14)

    if (!error && data) {
      logs = data
    }
  } catch (err) {
    console.warn('Could not fetch logs from Supabase, using local defaults:', err.message)
  }

  return <HomePage initialLogs={logs} />
}