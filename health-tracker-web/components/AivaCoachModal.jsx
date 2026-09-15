'use client'
import { useState, useRef, useEffect } from 'react'
import { Sparkles, Send, X, Bot, User, Loader2, ArrowRight, Lightbulb, RefreshCw, Zap } from 'lucide-react'

const SUGGESTED_PROMPTS = [
    "Analyze my weekly vitality & sleep trend",
    "How can I optimize my deep sleep stages?",
    "Suggest a high-energy morning routine",
    "How do active minutes impact metabolic health?"
]

export default function AivaCoachModal({ isOpen, onClose, logs = [] }) {
    const [messages, setMessages] = useState([
        {
            role: 'assistant',
            content: "Hello! I am **AIVA**, your AI Vitality Companion. I continuously monitor your sleep, movement, and recovery balance. How can I help boost your physical and mental energy today?"
        }
    ])
    const [input, setInput] = useState('')
    const [loading, setLoading] = useState(false)
    const messagesEndRef = useRef(null)

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }

    useEffect(() => {
        if (isOpen) {
            scrollToBottom()
        }
    }, [messages, isOpen])

    async function handleSend(queryText) {
        const textToSend = queryText || input
        if (!textToSend.trim() || loading) return

        const newMessages = [...messages, { role: 'user', content: textToSend }]
        setMessages(newMessages)
        setInput('')
        setLoading(true)

        try {
            const res = await fetch('/api/agent/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    messages: newMessages,
                    logs: logs
                })
            })
            const data = await res.json()
            if (data.reply) {
                setMessages([...newMessages, { role: 'assistant', content: data.reply }])
            } else {
                setMessages([...newMessages, {
                    role: 'assistant',
                    content: "I'm focusing on your stats. Sleep duration and active movement look steady. Feel free to ask about specific recovery protocols!"
                }])
            }
        } catch (error) {
            console.error('Chat error:', error)
            setMessages([...newMessages, {
                role: 'assistant',
                content: "Temporary connection error. Maintaining daily habit consistency is key—keep up the great work!"
            }])
        } finally {
            setLoading(false)
        }
    }

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
            <div className="relative w-full max-w-2xl h-[650px] max-h-[90vh] flex flex-col rounded-2xl glass-panel border border-cyan-500/30 shadow-2xl shadow-cyan-950/50 overflow-hidden">
                {/* Modal Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-slate-900/80">
                    <div className="flex items-center gap-3">
                        <div className="relative p-2.5 rounded-xl bg-gradient-to-tr from-cyan-500 to-emerald-400 text-slate-950 shadow-md shadow-cyan-500/20">
                            <Bot className="w-5 h-5" />
                            <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-400 border-2 border-slate-950 rounded-full"></span>
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <h3 className="text-base font-bold text-white">AIVA AI Vitality Coach</h3>
                                <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 text-[10px] font-semibold">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                                    AI Active
                                </span>
                            </div>
                            <p className="text-xs text-slate-400">Context-aware health & recovery guidance</p>
                        </div>
                    </div>

                    <button
                        onClick={onClose}
                        className="p-2 rounded-xl bg-slate-800/80 text-slate-400 hover:text-white hover:bg-slate-700 transition"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Messages Container */}
                <div className="flex-1 overflow-y-auto p-6 space-y-4">
                    {messages.map((m, idx) => {
                        const isAssistant = m.role === 'assistant'
                        return (
                            <div
                                key={idx}
                                className={`flex gap-3 ${isAssistant ? 'justify-start' : 'justify-end'}`}
                            >
                                {isAssistant && (
                                    <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 shrink-0 mt-0.5">
                                        <Sparkles className="w-4 h-4" />
                                    </div>
                                )}
                                <div
                                    className={`max-w-[85%] rounded-2xl px-4 py-3 text-xs sm:text-sm leading-relaxed ${isAssistant
                                            ? 'bg-slate-900/90 border border-white/10 text-slate-200'
                                            : 'bg-gradient-to-r from-cyan-600 to-teal-600 text-white font-medium shadow-md shadow-cyan-600/20'
                                        }`}
                                >
                                    <p className="whitespace-pre-wrap">{m.content}</p>
                                </div>
                                {!isAssistant && (
                                    <div className="w-8 h-8 rounded-lg bg-slate-800 border border-white/10 flex items-center justify-center text-slate-300 shrink-0 mt-0.5">
                                        <User className="w-4 h-4" />
                                    </div>
                                )}
                            </div>
                        )
                    })}

                    {loading && (
                        <div className="flex gap-3 justify-start">
                            <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 shrink-0">
                                <Sparkles className="w-4 h-4 animate-spin" />
                            </div>
                            <div className="bg-slate-900/90 border border-white/10 rounded-2xl px-4 py-3 text-xs text-slate-400 flex items-center gap-2">
                                <Loader2 className="w-4 h-4 animate-spin text-cyan-400" />
                                <span>Aiva is synthesizing your vitality data...</span>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Suggested Prompt Chips */}
                <div className="px-6 py-2 border-t border-white/5 bg-slate-950/40 flex items-center gap-2 overflow-x-auto">
                    <span className="text-[10px] text-slate-500 uppercase tracking-wider shrink-0">Suggestions:</span>
                    {SUGGESTED_PROMPTS.map((prompt, i) => (
                        <button
                            key={i}
                            onClick={() => handleSend(prompt)}
                            disabled={loading}
                            className="px-2.5 py-1 rounded-full bg-slate-900 hover:bg-slate-800 border border-white/10 text-[11px] text-slate-300 whitespace-nowrap hover:border-cyan-500/40 hover:text-cyan-300 transition shrink-0"
                        >
                            {prompt}
                        </button>
                    ))}
                </div>

                {/* Chat Input Bar */}
                <div className="p-4 border-t border-white/10 bg-slate-900/90">
                    <form
                        onSubmit={(e) => {
                            e.preventDefault()
                            handleSend()
                        }}
                        className="flex gap-2"
                    >
                        <input
                            type="text"
                            placeholder="Ask Aiva anything about your health, recovery, or habits..."
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            disabled={loading}
                            className="flex-1 px-4 py-2.5 rounded-xl glass-input text-xs sm:text-sm text-white placeholder-slate-500"
                        />
                        <button
                            type="submit"
                            disabled={loading || !input.trim()}
                            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-teal-400 text-slate-950 font-bold hover:opacity-90 disabled:opacity-50 transition shadow-md shadow-cyan-500/20"
                        >
                            <Send className="w-4 h-4" />
                        </button>
                    </form>
                </div>
            </div>
        </div>
    )
}
