'use client'

import { useRef, useEffect, useState } from 'react'
import Link from 'next/link'
import TestimonialCard from './TestimonialCard'

interface Testimonial {
  id: string
  name: string
  role: string
  photo: string
  content: string
  rating: number
}

interface TestimonialSectionProps {
  testimonials: Testimonial[]
}

export default function TestimonialSection({ testimonials }: TestimonialSectionProps) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [isPaused, setIsPaused] = useState(false)

  useEffect(() => {
    const container = scrollRef.current
    if (!container) return

    let animationId: number
    const speed = 0.5 // px per frame

    const scroll = () => {
      if (!isPaused && container) {
        container.scrollLeft += speed
        // Loop back to start
        if (container.scrollLeft >= container.scrollWidth - container.clientWidth) {
          container.scrollLeft = 0
        }
      }
      animationId = requestAnimationFrame(scroll)
    }

    animationId = requestAnimationFrame(scroll)
    return () => cancelAnimationFrame(animationId)
  }, [isPaused])

  return (
    <section id="testimoni" className="section-padding bg-surface">
      <div className="max-w-7xl mx-auto">
        {/* Section header */}
        <div className="text-center mb-10">
          <span className="inline-block px-3 py-1 rounded-full bg-accent/10 text-accent text-xs font-semibold uppercase tracking-wider mb-3">
            Testimoni
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-text-primary">
            Apa Kata{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-amber-600">
              Warga Kami
            </span>
          </h2>
          <p className="mt-3 text-text-secondary max-w-xl mx-auto">
            Pengalaman nyata dari warga Probolinggo yang telah menggunakan layanan kami.
          </p>
        </div>

        {/* Scrollable testimonial cards */}
        <div
          ref={scrollRef}
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onTouchStart={() => setIsPaused(true)}
          onTouchEnd={() => setIsPaused(false)}
          className="flex gap-5 overflow-x-auto pb-4 scrollbar-hide"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {/* Duplicate testimonials for seamless loop */}
          {[...testimonials, ...testimonials].map((t, i) => (
            <TestimonialCard key={`${t.id}-${i}`} {...t} />
          ))}
        </div>

        {/* Scroll hint for mobile */}
        <p className="text-center text-text-tertiary text-xs mt-4 sm:hidden">
          ← Geser untuk lihat lebih banyak →
        </p>

        {/* Tambah Testimoni Button */}
        <div className="mt-10 flex justify-center animate-fade-in relative z-10" style={{ animationDelay: '0.4s', animationFillMode: 'both' }}>
          <Link
            href="/add-testimonial"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-surface border border-border/60 text-text-secondary hover:text-primary hover:bg-primary/5 hover:border-primary/30 transition-all shadow-sm group"
          >
            <span className="text-xl group-hover:scale-110 transition-transform">✍️</span>
            <span className="font-semibold text-sm">Tulis Pengalaman Anda</span>
          </Link>
        </div>
      </div>
    </section>
  )
}
