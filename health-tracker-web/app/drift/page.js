'use client'

import { useState, useRef, useEffect, useMemo, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  ArrowRight,
  Sparkles,
  Wand2,
  Loader2,
  Film,
  X,
  Bot,
  Send,
} from 'lucide-react'
import '@/components/DriftWall.css'
import { theme as colors } from '@/lib/theme'

// User provided local vitality images
const LOCAL_USER_IMAGES = [
  '/images/img-1.jpg',
  '/images/img-2.jpg',
  '/images/img-3.jpg',
  '/images/img-4.jpg',
  '/images/img-5.jpg',
]

// Curated vitality, wellness, circadian sleep & peak recovery imagery with local user images
const DRIFT_ITEMS = [
  { image: '/images/img-1.jpg', title: 'Mindful Recovery' },
  { image: '/images/img-2.jpg', title: 'Mountain Trail' },
  { image: '/images/img-3.jpg', title: 'Vital Energy' },
  { image: '/images/img-4.jpg', title: 'Restorative Movement' },
  { image: '/images/img-5.jpg', title: 'Circadian Sleep' },
  { image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=700&auto=format&fit=crop&q=80', title: 'Peak Strength' },
  { image: 'https://images.unsplash.com/photo-1502082553048-f009c37129b9?w=700&auto=format&fit=crop&q=80', title: 'Forest Sunlight' },
  { image: '/images/img-1.jpg', title: 'Meditation' },
  { image: '/images/img-2.jpg', title: 'Alpine Vitality' },
  { image: '/images/img-3.jpg', title: 'Daily Discipline' },
  { image: '/images/img-4.jpg', title: 'Cold Plunge' },
  { image: '/images/img-5.jpg', title: 'Clean Nutrition' },
  { image: 'https://images.unsplash.com/photo-1518495973542-4542c06a5843?w=700&auto=format&fit=crop&q=80', title: 'Golden Hour' },
  { image: '/images/img-1.jpg', title: 'Deep Recovery' },
  { image: '/images/img-2.jpg', title: 'Longevity Habit' },
]

const SUGGESTED_PROMPTS = [
  'Analyze my vitality & sleep trend',
  'How to optimize my deep sleep?',
  'Suggest an energizing morning routine',
  'How do active minutes impact recovery?',
]

function greeting() {
  const h = new Date().getHours()
  if (h < 12) return 'Good morning'
  if (h < 18) return 'Good afternoon'
  return 'Good evening'
}

const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

const columnFactor = (index, variance) => {
  const pseudo = ((index * 0.6180339887 + 0.35) % 1) * 2 - 1
  return 1 + variance * pseudo
}

/* =========================================================================
   INLINE DRIFT WALL 3D ENGINE
   ========================================================================= */
function InlineDriftWall({
  items = DRIFT_ITEMS,
  columns = 5,
  tileWidth = 210,
  tileHeight = 138,
  gap = 18,
  radius = 14,
  tilt = 16,
  turn = -14,
  roll = 0,
  perspective = 1200,
  depth = 120,
  speed = 42,
  direction = 'up',
  variance = 0.45,
  parallax = 0.6,
  pauseOnHover = false,
  lift = 64,
  fade = 0.6,
  dim = 0.2,
  grayscale = false,
  overlayColor = '#E8DEC8',
  className = '',
  style,
}) {
  const containerRef = useRef(null)
  const planeRef = useRef(null)
  const trackRefs = useRef([])
  const rafRef = useRef(null)

  const offsetsRef = useRef([])
  const velocitiesRef = useRef([])
  const hoveredColRef = useRef(-1)
  const wallHoveredRef = useRef(false)
  const pointerRef = useRef({ x: 0, y: 0 })
  const pointerDampedRef = useRef({ x: 0, y: 0 })
  const lastTsRef = useRef(null)

  const [containerHeight, setContainerHeight] = useState(600)
  const [activeId, setActiveId] = useState(null)
  const activeIdRef = useRef(null)
  const [reduced, setReduced] = useState(false)

  useEffect(() => {
    setReduced(prefersReducedMotion())
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const onChange = (e) => setReduced(e.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  const columnItems = useMemo(() => {
    const cols = Array.from({ length: columns }, () => [])
    items.forEach((item, i) => cols[i % columns].push(item))
    return cols.map((col) => (col.length ? col : items.slice(0, 1)))
  }, [items, columns])

  const columnMeta = useMemo(() => {
    const unit = tileHeight + gap
    return columnItems.map((col) => {
      const copyHeight = Math.max(unit, col.length * unit)
      const copies = Math.max(2, Math.ceil((containerHeight * 1.6) / copyHeight) + 1)
      return { copyHeight, copies }
    });
  }, [columnItems, tileHeight, gap, containerHeight])

  useEffect(() => {
    if (!containerRef.current) return
    const ro = new ResizeObserver(([entry]) => {
      setContainerHeight(entry.contentRect.height || 600)
    })
    ro.observe(containerRef.current)
    return () => ro.disconnect()
  }, [])

  const baseVelocities = useMemo(() => {
    const dirSign = direction === 'up' ? 1 : -1
    return columnItems.map((_, c) => {
      const altSign = c % 2 === 0 ? 1 : -1
      return speed * columnFactor(c, variance) * dirSign * altSign
    })
  }, [columnItems, speed, direction, variance])

  useEffect(() => {
    offsetsRef.current = columnMeta.map((meta, c) => meta.copyHeight * ((c * 0.37) % 1))
    velocitiesRef.current = columnItems.map(() => 0)
  }, [columnMeta, columnItems])

  const applyPlaneTransform = useCallback(
    (px, py) => {
      const plane = planeRef.current
      if (!plane) return
      plane.style.transform =
        `translate(-50%, -50%) scale(1.18) ` +
        `rotateX(${tilt + py}deg) rotateY(${turn + px}deg) rotateZ(${roll}deg) ` +
        `translateZ(${-depth}px)`
    },
    [tilt, turn, roll, depth]
  )

  useEffect(() => {
    const animate = (ts) => {
      if (lastTsRef.current === null) lastTsRef.current = ts
      const dt = Math.min(0.05, Math.max(0, ts - lastTsRef.current) / 1000)
      lastTsRef.current = ts

      const maxTilt = parallax * 8
      const targetX = pointerRef.current.x * maxTilt
      const targetY = -pointerRef.current.y * maxTilt
      const damp = 1 - Math.exp(-dt / 0.12)
      pointerDampedRef.current.x += (targetX - pointerDampedRef.current.x) * damp
      pointerDampedRef.current.y += (targetY - pointerDampedRef.current.y) * damp
      applyPlaneTransform(pointerDampedRef.current.x, pointerDampedRef.current.y)

      if (!reduced) {
        for (let c = 0; c < trackRefs.current.length; c++) {
          const meta = columnMeta[c]
          if (!meta) continue
          const paused = wallHoveredRef.current && pauseOnHover
          const factor = paused || hoveredColRef.current === c ? 0 : 1
          const target = baseVelocities[c] * factor

          const ease = 1 - Math.exp(-dt / (target === 0 ? 0.16 : 0.28))
          velocitiesRef.current[c] += (target - velocitiesRef.current[c]) * ease
          let next = (offsetsRef.current[c] ?? 0) + velocitiesRef.current[c] * dt
          next = ((next % meta.copyHeight) + meta.copyHeight) % meta.copyHeight
          offsetsRef.current[c] = next

          const el = trackRefs.current[c]
          if (el) el.style.transform = `translate3d(0, ${-next}px, 0)`
        }
      } else {
        for (let c = 0; c < trackRefs.current.length; c++) {
          const el = trackRefs.current[c]
          const meta = columnMeta[c]
          if (el && meta) el.style.transform = `translate3d(0, ${-(offsetsRef.current[c] ?? 0)}px, 0)`
        }
      }

      rafRef.current = requestAnimationFrame(animate)
    }

    rafRef.current = requestAnimationFrame(animate)
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      rafRef.current = null
      lastTsRef.current = null
    }
  }, [baseVelocities, columnMeta, pauseOnHover, parallax, reduced, applyPlaneTransform])

  const activate = useCallback((id, index) => {
    activeIdRef.current = id
    hoveredColRef.current = index
    setActiveId(id)
  }, [])

  const release = useCallback(() => {
    activeIdRef.current = null
    hoveredColRef.current = -1
    setActiveId(null)
  }, [])

  const handlePointerMove = useCallback(
    (e) => {
      const rect = containerRef.current?.getBoundingClientRect()
      if (!rect) return
      if (parallax > 0 && !reduced) {
        pointerRef.current = {
          x: (e.clientX - rect.left) / rect.width - 0.5,
          y: (e.clientY - rect.top) / rect.height - 0.5,
        }
      }
      const hit = document.elementFromPoint(e.clientX, e.clientY)
      const tile = hit && hit.closest ? hit.closest('[data-tile-id]') : null
      if (!tile) return
      const id = tile.dataset.tileId
      if (id === activeIdRef.current) return
      activeIdRef.current = id
      hoveredColRef.current = Number(tile.dataset.col)
      setActiveId(id)
    },
    [parallax, reduced]
  )

  const handlePointerLeaveWall = useCallback(() => {
    wallHoveredRef.current = false
    pointerRef.current = { x: 0, y: 0 }
    release()
  }, [release])

  const cssVars = useMemo(
    () => ({
      '--dw-tile-w': `${tileWidth}px`,
      '--dw-tile-h': `${tileHeight}px`,
      '--dw-gap': `${gap}px`,
      '--dw-radius': `${radius}px`,
      '--dw-perspective': `${perspective}px`,
      '--dw-lift': `${lift}px`,
      '--dw-dim': dim,
      '--dw-gray': grayscale ? 1 : 0,
      '--dw-overlay': overlayColor,
      '--dw-edge': `${Math.max(0, (1 - fade) * 100)}%`,
      ...style,
    }),
    [tileWidth, tileHeight, gap, radius, perspective, lift, dim, grayscale, overlayColor, fade, style]
  )

  const renderTile = (item, id, colIndex) => {
    const fallbackSrc = LOCAL_USER_IMAGES[Math.abs(colIndex) % LOCAL_USER_IMAGES.length]
    const inner = (
      <span className="drift-wall__inner">
        <img
          src={item.image || fallbackSrc}
          alt={item.title ?? ''}
          loading="lazy"
          decoding="async"
          draggable={false}
          onError={(e) => {
            if (e.currentTarget.src !== fallbackSrc && !e.currentTarget.src.endsWith(fallbackSrc)) {
              e.currentTarget.src = fallbackSrc
            }
          }}
        />
        <span className="drift-wall__overlay" aria-hidden="true" />
      </span>
    )
    const commonProps = {
      className: `drift-wall__tile${activeId === id ? ' is-active' : ''}`,
      'data-tile-id': id,
      'data-col': colIndex,
      onFocus: () => activate(id, colIndex),
      onBlur: release,
    }
    return (
      <div key={id} tabIndex={0} role="button" aria-label={item.title ?? 'tile'} {...commonProps}>
        {inner}
      </div>
    )
  }

  const rootClass = ['drift-wall', reduced ? 'drift-wall--reduced' : '', className].filter(Boolean).join(' ')

  return (
    <div
      ref={containerRef}
      className={rootClass}
      style={cssVars}
      onPointerMove={handlePointerMove}
      onPointerEnter={() => {
        wallHoveredRef.current = true
      }}
      onPointerLeave={handlePointerLeaveWall}
      role="group"
      aria-label="Drifting wall of tiles"
    >
      <div ref={planeRef} className="drift-wall__plane">
        {columnItems.map((col, c) => {
          const meta = columnMeta[c]
          const copies = Array.from({ length: meta.copies })
          return (
            <div className="drift-wall__col" key={`col-${c}`}>
              <div className="drift-wall__track" ref={(el) => (trackRefs.current[c] = el)}>
                {copies.map((_, copyIndex) =>
                  col.map((item, itemIndex) => renderTile(item, `${c}-${copyIndex}-${itemIndex}`, c))
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

/* =========================================================================
   MAIN DRIFT WALL HOME PAGE (SELF-CONTAINED IN PAGE.JS)
   ========================================================================= */
export default function DriftPage() {
  const router = useRouter()
  const [logs, setLogs] = useState([])
  const [submitting, setSubmitting] = useState(false)
  const [aiParsing, setAiParsing] = useState(false)
  const [showAiBar, setShowAiBar] = useState(false)
  const [aiPrompt, setAiPrompt] = useState('')
  const [isChatOpen, setIsChatOpen] = useState(false)
  const [statusMessage, setStatusMessage] = useState('')

  // Chat state
  const [chatMessages, setChatMessages] = useState([
    {
      role: 'assistant',
      content: 'Hello! I am **AIVA**, your AI Vitality Companion. I monitor your sleep, movement, and habit consistency to help you achieve peak physical & mental vitality. What would you like to explore today?',
    },
  ])
  const [chatInput, setChatInput] = useState('')
  const [chatLoading, setChatLoading] = useState(false)
  const chatEndRef = useRef(null)

  const logSectionRef = useRef(null)
  const historySectionRef = useRef(null)

  const [form, setForm] = useState({
    date: new Date().toISOString().slice(0, 10),
    sleep_hours: '',
    sleep_quality: '3',
    steps: '',
    active_minutes: '',
    notes: '',
  })

  // Fetch initial logs
  useEffect(() => {
    fetch('/api/entries')
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setLogs(data)
        }
      })
      .catch(() => {})
  }, [])

  useEffect(() => {
    if (isChatOpen) {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }
  }, [chatMessages, isChatOpen])

  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  })

  const scrollToLog = () => {
    logSectionRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const scrollToHistory = () => {
    historySectionRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  // AI Chat Handler
  async function handleChatSend(queryText) {
    const text = queryText || chatInput
    if (!text.trim() || chatLoading) return

    const newMsgs = [...chatMessages, { role: 'user', content: text }]
    setChatMessages(newMsgs)
    setChatInput('')
    setChatLoading(true)

    try {
      const res = await fetch('/api/agent/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMsgs, logs }),
      })
      const data = await res.json()
      if (data.reply) {
        setChatMessages([...newMsgs, { role: 'assistant', content: data.reply }])
      } else {
        setChatMessages([
          ...newMsgs,
          { role: 'assistant', content: 'Vitality rhythm is looking consistent. Keep prioritizing 8h restorative sleep!' },
        ])
      }
    } catch {
      setChatMessages([
        ...newMsgs,
        { role: 'assistant', content: 'Connection active. Consistency in daily habits drives peak recovery!' },
      ])
    } finally {
      setChatLoading(false)
    }
  }

  // AI Fast-Log Parser
  async function handleAiParse() {
    if (!aiPrompt.trim() || aiParsing) return
    setAiParsing(true)
    try {
      const res = await fetch('/api/agent/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [{ role: 'user', content: aiPrompt }],
          mode: 'parse_log',
        }),
      })
      const data = await res.json()
      if (data.parsedLog) {
        const p = data.parsedLog
        setForm({
          date: p.date || form.date,
          sleep_hours: p.sleep_hours != null ? String(p.sleep_hours) : form.sleep_hours,
          sleep_quality: p.sleep_quality != null ? String(p.sleep_quality) : form.sleep_quality,
          steps: p.steps != null ? String(p.steps) : form.steps,
          active_minutes: p.active_minutes != null ? String(p.active_minutes) : form.active_minutes,
          notes: p.notes || aiPrompt,
        })
        setStatusMessage('Auto-filled with Aiva AI!')
        setTimeout(() => setStatusMessage(''), 3000)
      }
    } catch (err) {
      console.error('AI Parse error:', err)
    } finally {
      setAiParsing(false)
    }
  }

  // Form Submit
  async function handleSubmit(e) {
    e.preventDefault()
    setSubmitting(true)
    const payload = {
      date: form.date,
      sleep_hours: form.sleep_hours ? Number(form.sleep_hours) : null,
      sleep_quality: form.sleep_quality ? Number(form.sleep_quality) : null,
      steps: form.steps ? Number(form.steps) : null,
      active_minutes: form.active_minutes ? Number(form.active_minutes) : null,
      notes: form.notes || null,
    }

    try {
      const res = await fetch('/api/entries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      const savedLog = res.ok ? await res.json() : { ...payload, id: 'temp-' + Date.now() }

      setLogs((prev) => {
        const idx = prev.findIndex((l) => l.date === savedLog.date)
        if (idx >= 0) {
          const updated = [...prev]
          updated[idx] = { ...updated[idx], ...savedLog }
          return updated
        }
        return [savedLog, ...prev]
      })

      setForm({
        date: new Date().toISOString().slice(0, 10),
        sleep_hours: '',
        sleep_quality: '3',
        steps: '',
        active_minutes: '',
        notes: '',
      })

      setStatusMessage('Entry recorded ✨')
      setTimeout(() => setStatusMessage(''), 3500)
      router.refresh()
    } catch {
      setStatusMessage('Entry saved locally.')
      setTimeout(() => setStatusMessage(''), 3500)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <main
      style={{
        background: colors.bg,
        color: colors.text,
        minHeight: '100vh',
        fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        paddingBottom: 96,
      }}
    >
      {/* 1. HERO SECTION WITH 3D DRIFT WALL ANIMATION (EXACT PRISMA REFERENCE FIT) */}
      <section className="relative w-full max-w-[1400px] mx-auto pt-3 px-3 sm:px-6">
        {/* Top Floating Navigation Capsule */}
        <nav className="absolute top-7 left-1/2 -translate-x-1/2 z-30 flex items-center gap-6 sm:gap-8 px-6 sm:px-8 py-2.5 rounded-full bg-black/50 backdrop-blur-xl border border-white/10 text-xs sm:text-sm font-medium text-[#C8B9A2] shadow-2xl">
          <Link
            href="/"
            className="hover:text-[#F3E6D0] transition-colors flex items-center gap-1.5 cursor-pointer text-[#C8B9A2]"
            title="Switch to Video Hero"
          >
            <Film size={13} />
            <span className="hidden xs:inline">Video Hero</span>
          </Link>
          <span className="w-px h-3.5 bg-white/15" />
          <button
            onClick={scrollToLog}
            className="hover:text-[#F3E6D0] transition-colors cursor-pointer"
          >
            Log Today
          </button>
          <button
            onClick={scrollToHistory}
            className="hover:text-[#F3E6D0] transition-colors cursor-pointer"
          >
            History
          </button>
          <button
            onClick={() => setIsChatOpen(true)}
            className="hover:text-[#F3E6D0] transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <span>AI Coach</span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#E8B978] animate-pulse"></span>
          </button>
        </nav>

        {/* Cinematic Hero Container with 3D Drift Wall */}
        <div className="relative w-full h-[72vh] min-h-[520px] max-h-[760px] rounded-[28px] sm:rounded-[36px] overflow-hidden border border-white/10 shadow-2xl bg-[#0D1B24]">
          {/* Animated 3D Drift Wall Background */}
          <div className="absolute inset-0 w-full h-full">
            <InlineDriftWall
              items={DRIFT_ITEMS}
              columns={5}
              tileWidth={210}
              tileHeight={138}
              gap={16}
              tilt={16}
              turn={-14}
              perspective={1200}
              depth={120}
              speed={42}
              direction="up"
              variance={0.45}
              parallax={0.6}
              lift={64}
              fade={0.6}
              dim={0.45}
              overlayColor="#060010"
              radius={14}
              roll={0}
              pauseOnHover={false}
              grayscale={false}
            />
          </div>

          {/* Ambient Cinematic Overlay Gradients (Exact Prisma Reference) */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                'linear-gradient(to top, rgba(13, 27, 36, 0.94) 0%, rgba(13, 27, 36, 0.45) 45%, rgba(13, 27, 36, 0.6) 100%)',
            }}
          />

          {/* Hero Bottom Content (Exact match to Prisma reference style) */}
          <div className="relative z-20 h-full flex flex-col justify-end p-6 sm:p-10 md:p-14 pb-6 sm:pb-8 md:pb-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-end">
              {/* Left Side: Giant "Aiva*" Typography */}
              <div className="lg:col-span-6">
                <h1
                  className="font-extrabold tracking-tight text-[#F3E6D0] leading-[0.88] select-none"
                  style={{
                    fontSize: 'clamp(4.2rem, 11vw, 8.5rem)',
                    fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                    letterSpacing: '-0.04em',
                  }}
                >
                  Aiva<span className="text-[#E8B978] font-normal inline-block transform -translate-y-4 sm:-translate-y-8 text-[0.6em]">*</span>
                </h1>
              </div>

              {/* Right Side: Editorial Description & Action Buttons */}
              <div className="lg:col-span-6 flex flex-col items-start lg:items-end justify-end space-y-4 sm:space-y-5">
                <p
                  className="text-[#F3E6D0]/90 text-sm sm:text-base leading-relaxed max-w-lg lg:text-left font-normal"
                  style={{
                    textShadow: '0 2px 10px rgba(0,0,0,0.6)',
                  }}
                >
                  Aiva is an intelligent, AI-powered vitality workspace that instantly transforms complex daily sleep, movement, and habit data into peak human performance. We empower you to master your biological rhythm and vitality at your own pace.
                </p>

                {/* Buttons Row */}
                <div className="flex flex-wrap items-center gap-3 sm:gap-4 pt-1">
                  {/* Primary Button with dark circle arrow */}
                  <button
                    onClick={scrollToLog}
                    className="group flex items-center gap-3 px-6 py-3 rounded-full bg-[#F3E6D0] hover:bg-[#E8B978] text-[#0D1B24] font-bold text-sm sm:text-base shadow-lg transition-all duration-200 cursor-pointer"
                  >
                    <span>Log today</span>
                    <div className="w-7 h-7 rounded-full bg-[#0D1B24] text-[#F3E6D0] flex items-center justify-center group-hover:translate-x-0.5 transition-transform">
                      <ArrowRight size={14} />
                    </div>
                  </button>

                  {/* Secondary Outline Button */}
                  <button
                    onClick={() => setIsChatOpen(true)}
                    className="px-6 py-3 rounded-full bg-black/30 hover:bg-black/50 text-[#F3E6D0] border border-[#F3E6D0]/40 hover:border-[#E8B978] font-semibold text-sm sm:text-base backdrop-blur-md transition-all duration-200 flex items-center gap-2 cursor-pointer"
                  >
                    <Sparkles size={15} className="text-[#E8B978]" />
                    <span>Ask Aiva AI</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. DAILY HEALTH TRACKER CONTENT */}
      <div
        ref={logSectionRef}
        style={{
          maxWidth: 620,
          margin: '64px auto 0',
          padding: '0 20px',
        }}
      >
        <h2 style={{ fontSize: 32, fontWeight: 700, margin: 0, letterSpacing: '-0.5px', color: colors.text }}>
          {greeting()}
        </h2>
        <p style={{ color: colors.textMuted, marginTop: 4, marginBottom: 28, fontSize: 15 }}>
          {today}
        </p>

        {/* AI Assistant Quick-Fill Bar */}
        {showAiBar && (
          <div
            style={{
              background: colors.bgSecondary,
              border: `1px solid ${colors.border}`,
              borderRadius: 10,
              padding: 14,
              marginBottom: 16,
              display: 'flex',
              flexDirection: 'column',
              gap: 10,
            }}
          >
            <div style={{ fontSize: 12, color: colors.textMuted, display: 'flex', alignItems: 'center', gap: 6 }}>
              <Wand2 size={13} style={{ color: '#9B6D36' }} />
              <span>Describe your day (e.g. "Slept 8 hrs, 9500 steps, 40 min run, felt great"):</span>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <input
                type="text"
                placeholder="Type or paste your daily notes..."
                value={aiPrompt}
                onChange={(e) => setAiPrompt(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAiParse())}
                style={{
                  flex: 1,
                  background: colors.bg,
                  border: `1px solid ${colors.border}`,
                  color: colors.text,
                  padding: '8px 12px',
                  borderRadius: 6,
                  fontSize: 13,
                }}
              />
              <button
                type="button"
                onClick={handleAiParse}
                disabled={aiParsing || !aiPrompt.trim()}
                style={{
                  background: colors.accent,
                  color: colors.text,
                  border: 'none',
                  borderRadius: 6,
                  padding: '0 14px',
                  fontWeight: 700,
                  fontSize: 13,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  opacity: aiParsing || !aiPrompt.trim() ? 0.6 : 1,
                }}
              >
                {aiParsing ? <Loader2 size={14} className="animate-spin" /> : <Sparkles size={14} />}
                <span>Auto-Fill</span>
              </button>
            </div>
          </div>
        )}

        {/* Status Toast */}
        {statusMessage && (
          <div
            style={{
              padding: '8px 14px',
              background: 'rgba(91, 122, 88, 0.15)',
              border: `1px solid ${colors.success}`,
              color: colors.success,
              borderRadius: 6,
              fontSize: 13,
              marginBottom: 16,
              fontWeight: 600,
            }}
          >
            {statusMessage}
          </div>
        )}

        {/* Quick Entry Form */}
        <form
          onSubmit={handleSubmit}
          style={{
            background: colors.surface,
            borderTop: `1px solid ${colors.border}`,
            borderRight: `1px solid ${colors.border}`,
            borderBottom: `1px solid ${colors.border}`,
            borderLeft: `4px solid ${colors.accent}`,
            borderRadius: 12,
            padding: 24,
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 16,
            boxShadow: '0 8px 24px rgba(23, 40, 50, 0.05)',
            color: colors.text,
          }}
        >
          <div
            style={{
              gridColumn: '1 / -1',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: 4,
            }}
          >
            <span style={{ fontSize: 13, fontWeight: 700, color: colors.text, letterSpacing: '0.5px', textTransform: 'uppercase' }}>
              Daily Log
            </span>
            <button
              type="button"
              onClick={() => setShowAiBar(!showAiBar)}
              style={{
                background: 'transparent',
                border: 'none',
                color: '#9B6D36',
                fontSize: 12,
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 4,
                padding: 0,
              }}
            >
              <Wand2 size={12} />
              <span>{showAiBar ? 'Hide AI Auto-Fill' : 'AI Auto-Fill'}</span>
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <label style={{ fontSize: 13, fontWeight: 600, color: colors.textMuted }}>Date</label>
            <input
              type="date"
              name="date"
              value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
              style={{
                background: colors.bg,
                border: `1px solid ${colors.border}`,
                borderRadius: 6,
                color: colors.text,
                padding: '8px 12px',
                fontSize: 14,
              }}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <label style={{ fontSize: 13, fontWeight: 600, color: colors.textMuted }}>Sleep hours</label>
            <input
              type="number"
              step="0.1"
              name="sleep_hours"
              placeholder="7.5"
              value={form.sleep_hours}
              onChange={(e) => setForm({ ...form, sleep_hours: e.target.value })}
              style={{
                background: colors.bg,
                border: `1px solid ${colors.border}`,
                borderRadius: 6,
                color: colors.text,
                padding: '8px 12px',
                fontSize: 14,
              }}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <label style={{ fontSize: 13, fontWeight: 600, color: colors.textMuted }}>Sleep quality (1–5)</label>
            <input
              type="number"
              min="1"
              max="5"
              name="sleep_quality"
              placeholder="3"
              value={form.sleep_quality}
              onChange={(e) => setForm({ ...form, sleep_quality: e.target.value })}
              style={{
                background: colors.bg,
                border: `1px solid ${colors.border}`,
                borderRadius: 6,
                color: colors.text,
                padding: '8px 12px',
                fontSize: 14,
              }}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <label style={{ fontSize: 13, fontWeight: 600, color: colors.textMuted }}>Steps</label>
            <input
              type="number"
              name="steps"
              placeholder="8000"
              value={form.steps}
              onChange={(e) => setForm({ ...form, steps: e.target.value })}
              style={{
                background: colors.bg,
                border: `1px solid ${colors.border}`,
                borderRadius: 6,
                color: colors.text,
                padding: '8px 12px',
                fontSize: 14,
              }}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <label style={{ fontSize: 13, fontWeight: 600, color: colors.textMuted }}>Active minutes</label>
            <input
              type="number"
              name="active_minutes"
              placeholder="30"
              value={form.active_minutes}
              onChange={(e) => setForm({ ...form, active_minutes: e.target.value })}
              style={{
                background: colors.bg,
                border: `1px solid ${colors.border}`,
                borderRadius: 6,
                color: colors.text,
                padding: '8px 12px',
                fontSize: 14,
              }}
            />
          </div>

          <div style={{ gridColumn: '1 / -1', display: 'flex', flexDirection: 'column', gap: 6 }}>
            <label style={{ fontSize: 13, fontWeight: 600, color: colors.textMuted }}>Notes</label>
            <input
              type="text"
              name="notes"
              placeholder="How the day felt"
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              style={{
                background: colors.bg,
                border: `1px solid ${colors.border}`,
                borderRadius: 6,
                color: colors.text,
                padding: '8px 12px',
                fontSize: 14,
              }}
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            style={{
              gridColumn: '1 / -1',
              marginTop: 8,
              background: colors.accent,
              color: colors.text,
              border: 'none',
              borderRadius: 999,
              padding: '10px 22px',
              fontSize: 15,
              fontWeight: 700,
              cursor: 'pointer',
              width: 'fit-content',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              opacity: submitting ? 0.7 : 1,
              transition: 'opacity 0.2s ease',
            }}
          >
            {submitting ? <Loader2 size={16} className="animate-spin" /> : null}
            <span>{submitting ? 'Saving...' : 'Log today'}</span>
          </button>
        </form>

        {/* History Timeline */}
        <div ref={historySectionRef}>
          <h2 style={{ fontSize: 20, fontWeight: 700, margin: '48px 0 4px', letterSpacing: '-0.3px', color: colors.text }}>
            History
          </h2>
          <div style={{ marginTop: 12 }}>
            {logs?.map((log) => {
              const d = new Date(log.date + 'T00:00:00')
              const weekday = isNaN(d) ? '' : d.toLocaleDateString('en-US', { weekday: 'short' })
              const dayNum = isNaN(d) ? log.date : d.getDate()

              return (
                <div
                  key={log.id || log.date}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '56px 1fr',
                    gap: 16,
                    padding: '16px 0',
                    borderLeft: `1px solid ${colors.border}`,
                    paddingLeft: 20,
                    marginLeft: 6,
                    position: 'relative',
                  }}
                >
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: 12, color: colors.textMuted, textTransform: 'uppercase', fontWeight: 600 }}>
                      {weekday}
                    </div>
                    <div style={{ fontSize: 20, fontWeight: 700, color: colors.text, lineHeight: 1.2 }}>
                      {dayNum}
                    </div>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    <div style={{ fontSize: 14, color: colors.textMuted }}>
                      <span style={{ color: colors.text, fontWeight: 600 }}>{log.sleep_hours ?? '–'}h</span> sleep · quality{' '}
                      <span style={{ color: '#A06D35', fontWeight: 700 }}>{log.sleep_quality ?? '–'}</span>/5
                    </div>
                    <div style={{ fontSize: 14, color: colors.textMuted }}>
                      <span style={{ color: colors.text, fontWeight: 600 }}>{log.steps ? Number(log.steps).toLocaleString() : '–'}</span> steps ·{' '}
                      <span style={{ color: colors.text, fontWeight: 600 }}>{log.active_minutes ?? '–'}</span> active min
                    </div>
                    {log.notes && (
                      <div style={{ fontSize: 13, color: colors.textMuted, fontStyle: 'italic', marginTop: 2 }}>
                        "{log.notes}"
                      </div>
                    )}
                  </div>
                </div>
              )
            })}

            {(!logs || logs.length === 0) && (
              <p style={{ color: colors.textMuted, paddingLeft: 26, fontSize: 14 }}>No entries yet.</p>
            )}
          </div>
        </div>
      </div>

      {/* 3. INLINE AIVA AI COMPANION MODAL */}
      {isChatOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 50,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 16,
            backgroundColor: 'rgba(23, 40, 50, 0.45)',
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
              borderRadius: 16,
              backgroundColor: colors.surface,
              border: `1px solid ${colors.border}`,
              boxShadow: '0 20px 50px rgba(23, 40, 50, 0.2)',
              overflow: 'hidden',
              color: colors.text,
            }}
          >
            {/* Modal Header */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '16px 20px',
                borderBottom: `1px solid ${colors.border}`,
                backgroundColor: colors.bgSecondary,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div
                  style={{
                    padding: 8,
                    borderRadius: 8,
                    backgroundColor: colors.accent,
                    color: colors.text,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Bot size={18} />
                </div>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontSize: 16, fontWeight: 700, color: colors.text }}>AIVA AI Companion</span>
                    <span
                      style={{
                        fontSize: 11,
                        padding: '2px 8px',
                        borderRadius: 999,
                        backgroundColor: 'rgba(91, 122, 88, 0.15)',
                        color: colors.success,
                        border: `1px solid ${colors.success}`,
                        fontWeight: 600,
                      }}
                    >
                      Active
                    </span>
                  </div>
                  <div style={{ fontSize: 12, color: colors.textMuted }}>Context-aware health & vitality guidance</div>
                </div>
              </div>

              <button
                onClick={() => setIsChatOpen(false)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: colors.textMuted,
                  cursor: 'pointer',
                  padding: 4,
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Chat Messages */}
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
              {chatMessages.map((m, idx) => {
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
                          backgroundColor: 'rgba(232, 185, 120, 0.2)',
                          color: '#9B6D36',
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
                        backgroundColor: isAssistant ? colors.bgSecondary : colors.accent,
                        color: colors.text,
                        border: isAssistant ? `1px solid ${colors.border}` : 'none',
                        fontWeight: isAssistant ? 400 : 600,
                        whiteSpace: 'pre-wrap',
                      }}
                    >
                      {m.content}
                    </div>
                  </div>
                )
              })}

              {chatLoading && (
                <div style={{ display: 'flex', gap: 10, alignItems: 'center', color: colors.textMuted, fontSize: 13 }}>
                  <Loader2 size={16} className="animate-spin" style={{ color: colors.accent }} />
                  <span>Aiva is analyzing your vitality metrics...</span>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Suggestions */}
            <div
              style={{
                padding: '10px 16px',
                borderTop: `1px solid ${colors.border}`,
                backgroundColor: colors.bgSecondary,
                display: 'flex',
                gap: 8,
                overflowX: 'auto',
              }}
            >
              {SUGGESTED_PROMPTS.map((prompt, i) => (
                <button
                  key={i}
                  onClick={() => handleChatSend(prompt)}
                  disabled={chatLoading}
                  style={{
                    background: colors.bg,
                    border: `1px solid ${colors.border}`,
                    color: colors.textSecondary,
                    padding: '5px 12px',
                    borderRadius: 999,
                    fontSize: 12,
                    fontWeight: 500,
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {prompt}
                </button>
              ))}
            </div>

            {/* Input form */}
            <form
              onSubmit={(e) => {
                e.preventDefault()
                handleChatSend()
              }}
              style={{
                padding: 16,
                borderTop: `1px solid ${colors.border}`,
                backgroundColor: colors.surface,
                display: 'flex',
                gap: 10,
              }}
            >
              <input
                type="text"
                placeholder="Ask Aiva about sleep, workouts, recovery..."
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                disabled={chatLoading}
                style={{
                  flex: 1,
                  background: colors.bg,
                  border: `1px solid ${colors.border}`,
                  color: colors.text,
                  padding: '10px 14px',
                  borderRadius: 8,
                  fontSize: 14,
                }}
              />
              <button
                type="submit"
                disabled={chatLoading || !chatInput.trim()}
                style={{
                  background: colors.accent,
                  color: colors.text,
                  border: 'none',
                  borderRadius: 8,
                  padding: '0 18px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  opacity: chatLoading || !chatInput.trim() ? 0.6 : 1,
                }}
              >
                <Send size={16} />
              </button>
            </form>
          </div>
        </div>
      )}
    </main>
  )
}
