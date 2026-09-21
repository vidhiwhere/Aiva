import Link from 'next/link'
import { ArrowRight, Sparkles, Activity, LayoutGrid } from 'lucide-react'
import { theme as colors } from '@/lib/theme'

export default function HeroHeader({ onOpenChat, onScrollToLog, onScrollToHistory }) {
    return (
        <section className="relative w-full max-w-[1400px] mx-auto pt-3 px-3 sm:px-6">
            {/* Top Floating Navigation Capsule */}
            <nav className="absolute top-7 left-1/2 -translate-x-1/2 z-30 flex items-center gap-5 sm:gap-7 px-6 py-2.5 rounded-full bg-black/60 backdrop-blur-xl border border-white/15 text-xs sm:text-sm font-medium text-[#D8C6AD] shadow-2xl">
                <Link
                    href="/drift"
                    className="hover:text-[#E8B978] transition-colors flex items-center gap-1.5 cursor-pointer text-[#C8B9A0]"
                    title="Switch to 3D Drift Wall"
                >
                    <LayoutGrid size={13} />
                    <span className="hidden xs:inline">3D Drift Wall</span>
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

            {/* Cinematic Hero Card Container with Video */}
            <div className="relative w-full h-[72vh] min-h-[520px] max-h-[760px] rounded-[28px] sm:rounded-[36px] overflow-hidden border border-white/10 shadow-2xl bg-[#0D1B24]">
                {/* Background Video */}
                <video
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="absolute inset-0 w-full h-full object-cover"
                    src="/hero-video.mp4"
                />

                {/* Ambient Cinematic Overlay Gradients */}
                <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                        background:
                            'linear-gradient(to top, rgba(13, 27, 36, 0.92) 0%, rgba(13, 27, 36, 0.45) 45%, rgba(13, 27, 36, 0.6) 100%)',
                    }}
                />

                {/* Hero Bottom Content (Exact match to Prisma reference style) */}
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
                                    textShadow: '0 4px 20px rgba(0,0,0,0.4)',
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
