'use client'
import { ArrowRight, Sparkles, Film, Compass, Zap } from 'lucide-react'
import Link from 'next/link'
import DriftWall from './DriftWall'
import { theme as colors } from '@/lib/theme'

const ITEMS = [
  { image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=700&auto=format&fit=crop&q=80', title: 'Mindful Recovery' },
  { image: 'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=700&auto=format&fit=crop&q=80', title: 'Mountain Trail' },
  { image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=700&auto=format&fit=crop&q=80', title: 'Vital Energy' },
  { image: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=700&auto=format&fit=crop&q=80', title: 'Restorative Movement' },
  { image: 'https://images.unsplash.com/photo-1511295742362-92c96b124e52?w=700&auto=format&fit=crop&q=80', title: 'Circadian Sleep' },
  { image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=700&auto=format&fit=crop&q=80', title: 'Peak Strength' },
  { image: 'https://images.unsplash.com/photo-1502082553048-f009c37129b9?w=700&auto=format&fit=crop&q=80', title: 'Forest Sunlight' },
  { image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=700&auto=format&fit=crop&q=80', title: 'Meditation' },
  { image: 'https://images.unsplash.com/photo-1483728642387-6c3bdd6c93e5?w=700&auto=format&fit=crop&q=80', title: 'Alpine Vitality' },
  { image: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=700&auto=format&fit=crop&q=80', title: 'Daily Discipline' },
  { image: 'https://images.unsplash.com/photo-1508215885820-4523e431397e?w=700&auto=format&fit=crop&q=80', title: 'Cold Plunge' },
  { image: 'https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=700&auto=format&fit=crop&q=80', title: 'Clean Nutrition' },
  { image: 'https://images.unsplash.com/photo-1518495973542-4542c06a5843?w=700&auto=format&fit=crop&q=80', title: 'Golden Hour' },
  { image: 'https://images.unsplash.com/photo-1470246973918-29a93221c455?w=700&auto=format&fit=crop&q=80', title: 'Deep Recovery' },
  { image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=700&auto=format&fit=crop&q=80', title: 'Longevity Habit' },
]

export default function DriftHeroHeader({ onOpenChat, onScrollToLog, onScrollToHistory }) {
  return (
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
          onClick={onScrollToLog}
          className="hover:text-[#F3E6D0] transition-colors cursor-pointer"
        >
          Log Today
        </button>
        <button
          onClick={onScrollToHistory}
          className="hover:text-[#F3E6D0] transition-colors cursor-pointer"
        >
          History
        </button>
        <button
          onClick={onOpenChat}
          className="hover:text-[#F3E6D0] transition-colors flex items-center gap-1.5 cursor-pointer"
        >
          <span>AI Coach</span>
          <span className="w-1.5 h-1.5 rounded-full bg-[#E8B978] animate-pulse"></span>
        </button>
      </nav>

      {/* Cinematic Hero Container with 3D Drift Wall */}
      <div className="relative w-full h-[72vh] min-h-[520px] max-h-[760px] rounded-[28px] sm:rounded-[36px] overflow-hidden border border-white/10 shadow-2xl bg-[#0D1B24]">
        {/* Animated 3D Drift Wall Layer */}
        <div className="absolute inset-0 w-full h-full">
          <DriftWall
            items={ITEMS}
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
                  onClick={onScrollToLog}
                  className="group flex items-center gap-3 px-6 py-3 rounded-full bg-[#F3E6D0] hover:bg-[#E8B978] text-[#0D1B24] font-bold text-sm sm:text-base shadow-lg transition-all duration-200 cursor-pointer"
                >
                  <span>Log today</span>
                  <div className="w-7 h-7 rounded-full bg-[#0D1B24] text-[#F3E6D0] flex items-center justify-center group-hover:translate-x-0.5 transition-transform">
                    <ArrowRight size={14} />
                  </div>
                </button>

                {/* Secondary Outline Button */}
                <button
                  onClick={onOpenChat}
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
  )
}
