import { createClient } from '@/lib/supabase/server'
import DashboardView from '@/components/DashboardView'
import { TEMP_USER_ID } from '@/lib/constants'

export const metadata = {
  title: 'AIVA - AI + Vitality Health & Recovery Engine',
  description: 'Intelligent daily health, sleep, movement, and vitality tracker with Groq AI coaching.',
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
      .limit(30)

    if (!error && data) {
      logs = data
    }
  } catch (err) {
    console.warn('Could not fetch initial logs from Supabase, using local defaults:', err.message)
  }

  return <DashboardView initialLogs={logs} />
}