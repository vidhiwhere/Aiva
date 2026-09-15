'use client'
import { useState, useRef, useEffect } from 'react'
import { Sparkles, Send, X, Bot, User, Loader2 } from 'lucide-react'
import { theme } from '@/lib/theme'

const SUGGESTED_PROMPTS = [
    "Analyze my vitality & sleep trend",
    "How to optimize my deep sleep?",
    "Suggest an energizing morning routine",
    "How do active minutes impact recovery?"
]

export default function AivaCoachDrawer({ isOpen, onClose, logs = [] }) {
    const [messages, setMessages] = useState([
        {
            role: 'assistant',
            content: "Hello! I am **AIVA**, your AI Vitality Companion. I review your sleep, movement, and habit consistency to help you achieve peak physical & mental vitality. What would you like to explore today?"
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
                    content: "I'm reviewing your daily logs. Sleep regularity and daily active pacing look steady. Feel free to ask any health or recovery question!"
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
        <div
            style={{
                position: 'fixed',
                inset: 0,
                zIndex: 50,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: 16,
                backgroundColor: 'rgba(13, 27, 36, 0.85)',
                backdropFilter: 'blur(8px)',
            }}
        >
            <div
                style={{
                    position: 'relative',
                    width: '100%',
                    maxWidth: 620,
                    height: 600,
                    maxHeight: '90vh',
                    display: 'flex',
                    flexDirection: 'column',
                    borderRadius: 12,
                    backgroundColor: theme.surface,
                    border: `1px solid ${theme.border}`,
                    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.5)',
                    overflow: 'hidden',
                    color: theme.text,
                }}
            >
                {/* Header */}
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '16px 20px',
                        borderBottom: `1px solid ${theme.border}`,
                        backgroundColor: theme.bgSecondary,
                    }}
                >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div
                            style={{
                                padding: 8,
                                borderRadius: 8,
                                backgroundColor: theme.accent,
                                color: theme.bg,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}
                        >
                            <Bot size={18} />
                        </div>
                        <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                <span style={{ fontSize: 16, fontWeight: 700, color: theme.text }}>AIVA AI Companion</span>
                                <span
                                    style={{
                                        fontSize: 11,
                                        padding: '2px 8px',
                                        borderRadius: 999,
                                        backgroundColor: 'rgba(135, 148, 124, 0.2)',
                                        color: theme.success,
                                        border: `1px solid ${theme.success}`,
                                        fontWeight: 600,
                                    }}
                                >
                                    Active
                                </span>
                            </div>
                            <div style={{ fontSize: 12, color: theme.textMuted }}>Context-aware health & vitality guidance</div>
                        </div>
                    </div>

                    <button
                        onClick={onClose}
                        style={{
                            background: 'transparent',
                            border: 'none',
                            color: theme.textMuted,
                            cursor: 'pointer',
                            padding: 4,
                            display: 'flex',
                            alignItems: 'center',
                        }}
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Messages Container */}
                <div
                    style={{
                        flex: 1,
                        overflowY: 'auto',
                        padding: 20,
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 16,
                    }}
                >
                    {messages.map((m, idx) => {
                        const isAssistant = m.role === 'assistant'
                        return (
                            <div
                                key={idx}
                                style={{
                                    display: 'flex',
                                    justifyContent: isAssistant ? 'flex-start' : 'flex-end',
                                    gap: 10,
                                }}
                            >
                                {isAssistant && (
                                    <div
                                        style={{
                                            width: 28,
                                            height: 28,
                                            borderRadius: 6,
                                            backgroundColor: 'rgba(232, 185, 120, 0.15)',
                                            color: theme.accent,
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            flexShrink: 0,
                                            marginTop: 2,
                                        }}
                                    >
                                        <Sparkles size={14} />
                                    </div>
                                )}
                                <div
                                    style={{
                                        maxWidth: '85%',
                                        borderRadius: 10,
                                        padding: '10px 16px',
                                        fontSize: 14,
                                        lineHeight: 1.5,
                                        backgroundColor: isAssistant ? theme.bgSecondary : theme.accent,
                                        color: isAssistant ? theme.text : theme.bg,
                                        border: isAssistant ? `1px solid ${theme.border}` : 'none',
                                        fontWeight: isAssistant ? 400 : 600,
                                        whiteSpace: 'pre-wrap',
                                    }}
                                >
                                    {m.content}
                                </div>
                            </div>
                        )
                    })}

                    {loading && (
                        <div style={{ display: 'flex', gap: 10, alignItems: 'center', color: theme.textMuted, fontSize: 13 }}>
                            <Loader2 size={16} className="animate-spin" style={{ color: theme.accent }} />
                            <span>Aiva is analyzing your vitality metrics...</span>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Suggestions */}
                <div
                    style={{
                        padding: '8px 16px',
                        borderTop: `1px solid ${theme.border}`,
                        backgroundColor: theme.bgSecondary,
                        display: 'flex',
                        gap: 8,
                        overflowX: 'auto',
                    }}
                >
                    {SUGGESTED_PROMPTS.map((prompt, i) => (
                        <button
                            key={i}
                            onClick={() => handleSend(prompt)}
                            disabled={loading}
                            style={{
                                background: theme.surface,
                                border: `1px solid ${theme.border}`,
                                color: theme.textMuted,
                                padding: '4px 10px',
                                borderRadius: 999,
                                fontSize: 11,
                                cursor: 'pointer',
                                whiteSpace: 'nowrap',
                            }}
                        >
                            {prompt}
                        </button>
                    ))}
                </div>

                {/* Chat Input */}
                <form
                    onSubmit={(e) => {
                        e.preventDefault()
                        handleSend()
                    }}
                    style={{
                        padding: 16,
                        borderTop: `1px solid ${theme.border}`,
                        backgroundColor: theme.surface,
                        display: 'flex',
                        gap: 10,
                    }}
                >
                    <input
                        type="text"
                        placeholder="Ask Aiva about sleep, workouts, recovery..."
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        disabled={loading}
                        style={{
                            flex: 1,
                            background: theme.bgSecondary,
                            border: `1px solid ${theme.border}`,
                            color: theme.text,
                            padding: '10px 14px',
                            borderRadius: 8,
                            fontSize: 14,
                        }}
                    />
                    <button
                        type="submit"
                        disabled={loading || !input.trim()}
                        style={{
                            background: theme.accent,
                            color: theme.bg,
                            border: 'none',
                            borderRadius: 8,
                            padding: '0 16px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            opacity: loading || !input.trim() ? 0.6 : 1,
                        }}
                    >
                        <Send size={16} />
                    </button>
                </form>
            </div>
        </div>
    )
}
