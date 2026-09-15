import { NextResponse } from 'next/server'

const PRIMARY_MODEL = 'openai/gpt-oss-120b'
const FALLBACK_MODELS = ['openai/gpt-oss-20b', 'qwen/qwen3.8-27b']

export async function POST(req) {
    try {
        const apiKey = process.env.GROQ_API_KEY
        const { messages, logs, mode } = await req.json()

        if (!apiKey) {
            return NextResponse.json({
                reply: "Aiva AI is running in offline mode. Please configure GROQ_API_KEY.",
                parsedLog: null
            })
        }

        const systemPrompt = `You are AIVA (AI + Vitality), an elite, compassionate, and highly intelligent personal health and vitality coach.
Your mission is to help the user achieve peak physical and mental vitality through optimal sleep, movement, habit consistency, and recovery.

User's Recent Health Data Context:
${logs && logs.length > 0 ? JSON.stringify(logs.slice(0, 7), null, 2) : "No previous logs recorded yet."}

Guidelines:
1. Always be supportive, scientifically grounded (referencing circadian rhythms, restorative sleep stages, recovery balance), motivating, and concise.
2. If mode is "parse_log", analyze the user's natural language input and extract structured log data in JSON format:
   {
     "date": "YYYY-MM-DD" (default to today ${new Date().toISOString().slice(0, 10)} if not specified),
     "sleep_hours": number or null,
     "sleep_quality": integer 1-5 or null (1=poor, 2=fair, 3=good, 4=great, 5=excellent),
     "steps": integer or null,
     "active_minutes": integer or null,
     "notes": string or null
   }
3. If mode is "insights", provide 2-3 bullet points of high-impact vitality insights and actionable recommendations based on recent metrics.
4. Keep answers clean, formatted with markdown (bullet points, bold text), and engaging. Avoid long robotic walls of text.`

        let promptMessages = [{ role: 'system', content: systemPrompt }]

        if (mode === 'parse_log') {
            promptMessages.push({
                role: 'user',
                content: `Extract health log data from this message: "${messages[messages.length - 1]?.content}". Return ONLY valid JSON with keys: date, sleep_hours, sleep_quality, steps, active_minutes, notes.`
            })
        } else if (mode === 'insights') {
            promptMessages.push({
                role: 'user',
                content: `Generate personalized vitality insights and 2 actionable tips based on my latest log history.`
            })
        } else {
            promptMessages = [
                { role: 'system', content: systemPrompt },
                ...messages.map(m => ({ role: m.role, content: m.content }))
            ]
        }

        const modelsToTry = [PRIMARY_MODEL, ...FALLBACK_MODELS]
        let lastError = null

        for (const model of modelsToTry) {
            try {
                const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${apiKey}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        model: model,
                        messages: promptMessages,
                        temperature: 0.6,
                        max_tokens: 800
                    })
                })

                if (res.ok) {
                    const data = await res.json()
                    const reply = data.choices?.[0]?.message?.content || "No response received."

                    if (mode === 'parse_log') {
                        try {
                            const cleaned = reply.replace(/```json/g, '').replace(/```/g, '').trim()
                            const parsed = JSON.parse(cleaned)
                            return NextResponse.json({ parsedLog: parsed, reply: "Log parsed successfully!" })
                        } catch {
                            return NextResponse.json({ parsedLog: null, reply })
                        }
                    }

                    return NextResponse.json({ reply })
                } else {
                    lastError = await res.text()
                    console.error(`Groq Model ${model} Error:`, lastError)
                }
            } catch (err) {
                lastError = err.message
                console.error(`Fetch error with ${model}:`, err)
            }
        }

        return NextResponse.json({
            reply: "I'm having a brief connection hiccup. Let's keep focusing on your vitality goals!",
            error: lastError
        }, { status: 200 })

    } catch (error) {
        console.error('Agent chat route error:', error)
        return NextResponse.json({ error: error.message, reply: "Vitality assistant is temporarily offline." }, { status: 500 })
    }
}
