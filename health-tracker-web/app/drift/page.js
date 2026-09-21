import { createClient } from '@/lib/supabase/server'
import DriftHomePage from '@/components/DriftHomePage'
import { TEMP_USER_ID } from '@/lib/constants'

export const metadata = {
  title: 'AIVA — 3D Drift Wall Vitality Companion',
  description: 'Experience your AI-assisted health journey with an interactive 3D vitality drift wall, restorative sleep analytics, and habit tracking.',
}

export default async function DriftPage() {
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

  return <DriftHomePage initialLogs={logs} />
}
