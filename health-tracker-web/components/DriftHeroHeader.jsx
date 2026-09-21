'use client'
import { ArrowRight, Sparkles, LayoutGrid, Film } from 'lucide-react'
import Link from 'next/link'
import DriftWall from './DriftWall'

// Curated vitality, wellness, deep nature & athletics imagery
const VITALITY_ITEMS = [
  { image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=700&auto=format&fit=crop&q=80', title: 'Mindful Recovery' },
  { image: 'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=700&auto=format&fit=crop&q=80', title: 'Mountain Trail Run' },
  { image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=700&auto=format&fit=crop&q=80', title: 'Nutritious Fuel' },
  { image: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=700&auto=format&fit=crop&q=80', title: 'Restorative Movement' },
  { image: 'https://images.unsplash.com/photo-1511295742362-92c96b124e52?w=700&auto=format&fit=crop&q=80', title: 'Circadian Sleep' },
  { image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=700&auto=format&fit=crop&q=80', title: 'Functional Strength' },
  { image: 'https://images.unsplash.com/photo-1502082553048-f009c37129b9?w=700&auto=format&fit=crop&q=80', title: 'Wild Forest Sunlight' },
  { image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=700&auto=format&fit=crop&q=80', title: 'Deep Meditation' },
  { image: 'https://images.unsplash.com/photo-1483728642387-6c3bdd6c93e5?w=700&auto=format&fit=crop&q=80', title: 'Alpine Peak Energy' },
  { image: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=700&auto=format&fit=crop&q=80', title: 'Daily Discipline' },
  { image: 'https://images.unsplash.com/photo-1508215885820-4523e431397e?w=700&auto=format&fit=crop&q=80', title: 'Ocean Plunge Recovery' },
  { image: 'https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=700&auto=format&fit=crop&q=80', title: 'Vital Nutrition' },
  { image: 'https://images.unsplash.com/photo-1518495973542-4542c06a5843?w=700&auto=format&fit=crop&q=80', title: 'Golden Hour Cardio' },
  { image: 'https://images.unsplash.com/photo-1470246973918-29a93221c455?w=700&auto=format&fit=crop&q=80', title: 'Rest & Longevity' },
  { image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=700&auto=format&fit=crop&q=80', title: 'High Performance Habit' },
]

export default function DriftHeroHeader({ onOpenChat, onScrollToLog, onScrollToHistory }) {
  return (
    <section className="relative w-full max-w-[1400px] mx-auto pt-3 px-3 sm:px-6">
      {/* Top Floating Navigation Capsule */}
      <nav className="absolute top-7 left-1/2 -translate-x-1/2 z-30 flex items-center gap-5 sm:gap-7 px-6 py-2.5 rounded-full bg-black/60 backdrop-blur-xl border border-white/15 text-xs sm:text-sm font-medium text-[#D8C6AD] shadow-2xl">
        <Link
          href="/"
          className="hover:text-[#E8B978] transition-colors flex items-center gap-1.5 cursor-pointer text-[#C8B9A0]"
          title="Switch to Video Hero"
        >
          <Film size={13} />
          <span className="hidden xs:inline">Video Hero</span>
        </Link>
        <span className="w-px h-3.5 bg-white/20" />
        <button
          onClick={onScrollToLog}
          className="hover:text-[#E8B978] transition-colors cursor-pointer"
        >
          Log Today
        </button>
        <button
          onClick={onScrollToHistory}
          className="hover:text-[#E8B978] transition-colors cursor-pointer"
        >
          History
        </button>
        <button
          onClick={onOpenChat}
          className="hover:text-[#E8B978] transition-colors flex items-center gap-1.5 cursor-pointer"
        >
          <span>AI Coach</span>
          <span className="w-1.5 h-1.5 rounded-full bg-[#E8B978] animate-pulse"></span>
        </button>
      </nav>

      {/* 3D Drift Wall Hero Card Container */}
      <div className="relative w-full h-[74vh] min-h-[540px] max-h-[780px] rounded-[28px] sm:rounded-[36px] overflow-hidden border border-white/10 shadow-2xl bg-[#0B151C]">
        {/* Interactive 3D Drift Wall Background */}
        <div className="absolute inset-0 w-full h-full">
          <DriftWall
            items={VITALITY_ITEMS}
            columns={5}
            tileWidth={220}
            tileHeight={145}
            gap={18}
            tilt={16}
            turn={-14}
            perspective={1200}
            depth={120}
            speed={38}
            direction="up"
            variance={0.45}
            parallax={0.65}
            lift={64}
            fade={0.65}
            dim={0.5}
            overlayColor="#071219"
            radius={14}
            roll={0}
            pauseOnHover={false}
            grayscale={false}
          />
        </div>

        {/* Ambient Cinematic Overlay Gradients for Readability */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'linear-gradient(to top, rgba(11, 21, 28, 0.95) 0%, rgba(11, 21, 28, 0.55) 45%, rgba(11, 21, 28, 0.7) 100%)',
          }}
        />

        {/* Badge in top right showing 3D Drift Wall Active */}
        <div className="absolute top-6 right-6 z-20 hidden md:flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-black/40 backdrop-blur-md border border-white/10 text-xs font-semibold text-[#E8B978]">
          <LayoutGrid size={13} />
          <span>3D Drift Wall Active</span>
        </div>

        {/* Hero Bottom Content (Prisma + Editorial Style) */}
        <div className="relative z-20 h-full flex flex-col justify-end p-6 sm:p-10 md:p-14">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-end">
            {/* Left Side: Giant "Aiva*" Typography in Rich Warm Beige */}
            <div className="lg:col-span-6">
              <h1
                className="font-extrabold tracking-tight text-[#E8CDA6] leading-none select-none"
                style={{
                  fontSize: 'clamp(4rem, 11vw, 8.5rem)',
                  fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                  letterSpacing: '-0.04em',
                  textShadow: '0 4px 24px rgba(0,0,0,0.5)',
                }}
              >
                Aiva<span className="text-[#E8B978] font-normal inline-block transform -translate-y-4 sm:-translate-y-8 text-[0.6em]">*</span>
              </h1>
            </div>

            {/* Right Side: Editorial Description & Action Buttons */}
            <div className="lg:col-span-6 flex flex-col items-start lg:items-end justify-end space-y-5">
              <p
                className="text-[#E8DEC8]/95 text-sm sm:text-base leading-relaxed max-w-lg lg:text-left font-normal"
                style={{
                  textShadow: '0 2px 12px rgba(0,0,0,0.7)',
                }}
              >
                Aiva is an intelligent vitality companion designed to elevate human recovery, restorative circadian sleep, and daily movement through proactive AI guidance.
              </p>

              {/* Buttons Row */}
              <div className="flex flex-wrap items-center gap-3 sm:gap-4 pt-1">
                {/* Primary Button */}
                <button
                  onClick={onScrollToLog}
                  className="group flex items-center gap-3 px-6 py-3 rounded-full bg-[#E8B978] hover:bg-[#D89A6B] text-[#172832] font-bold text-sm sm:text-base shadow-lg transition-all duration-200 cursor-pointer"
                >
                  <span>Log today</span>
                  <div className="w-7 h-7 rounded-full bg-[#172832] text-[#E8B978] flex items-center justify-center group-hover:translate-x-0.5 transition-transform">
                    <ArrowRight size={14} />
                  </div>
                </button>

                {/* Secondary Outline Button */}
                <button
                  onClick={onOpenChat}
                  className="px-6 py-3 rounded-full bg-black/30 hover:bg-black/50 text-[#E8CDA6] border border-[#E8CDA6]/40 hover:border-[#E8B978] font-semibold text-sm sm:text-base backdrop-blur-md transition-all duration-200 flex items-center gap-2 cursor-pointer"
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
  )
}
