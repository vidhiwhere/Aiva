import { createClient } from '@/lib/supabase/server'
import QuickEntryForm from '@/components/QuickEntryForm'
import DailyLogCard from '@/components/DailyLogCard'
import { TEMP_USER_ID } from '@/lib/constants'

export default async function Dashboard() {
  const supabase = await createClient()

  const { data: logs } = await supabase
    .from('daily_logs')
    .select('*')
    .eq('user_id', TEMP_USER_ID)
    .order('date', { ascending: false })
    .limit(14)

  return (
    <main style={{ padding: 24, maxWidth: 600, margin: '0 auto' }}>
      <h1>Today</h1>
      <QuickEntryForm />
      <h2 style={{ marginTop: 32 }}>Recent entries</h2>
      <div style={{ display: 'grid', gap: 8 }}>
        {logs?.map((log) => <DailyLogCard key={log.id} log={log} />)}
        {!logs?.length && <p>No entries yet.</p>}
      </div>
    </main>
  )
}