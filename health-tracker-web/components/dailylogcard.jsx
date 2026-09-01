export default function DailyLogCard({ log }) {
    return (
        <div style={{ border: '1px solid #ddd', borderRadius: 6, padding: 10, display: 'flex', justifyContent: 'space-between', fontSize: 14 }}>
            <strong>{log.date}</strong>
            <span>
                {log.sleep_hours ?? '–'}h sleep · quality {log.sleep_quality ?? '–'}/5 ·{' '}
                {log.steps ?? '–'} steps · {log.active_minutes ?? '–'} active min
            </span>
        </div>
    )
}