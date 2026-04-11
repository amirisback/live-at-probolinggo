'use client'

interface HeroSectionProps {
  siteName: string
  tagline: string
  subtitle: string
  youtubeId: string
  overlayOpacity: number
}

export default function HeroSection({
  siteName,
  tagline,
  subtitle,
  youtubeId,
  overlayOpacity,
}: HeroSectionProps) {
  return (
    <section id="home" className="relative w-full h-screen min-h-[600px] overflow-hidden flex items-center justify-center">
      {/* YouTube Background Video */}
      <div className="absolute inset-0 w-full h-full pointer-events-none">
        <iframe
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[180%] h-[180%] min-w-full min-h-full"
          src={`https://www.youtube.com/embed/${youtubeId}?autoplay=1&mute=1&loop=1&playlist=${youtubeId}&controls=0&showinfo=0&rel=0&modestbranding=1&playsinline=1`}
          title="Background video"
          allow="autoplay; encrypted-media"
          allowFullScreen
          style={{ border: 'none' }}
        />
      </div>

      {/* Dark Gradient Overlay */}
      <div
        className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/50 to-black/80"
        style={{ opacity: overlayOpacity }}
      />

      {/* Decorative gradient orbs */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-start/20 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-gradient-end/15 rounded-full blur-3xl" />

      {/* Content */}
      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        <div className="animate-fade-in" style={{ animationDelay: '0.2s', animationFillMode: 'both' }}>
          <span className="inline-block px-4 py-1.5 rounded-full bg-white/10 border border-white/20 text-white/90 text-sm font-medium mb-6 backdrop-blur-sm">
            🏙️ Portal Layanan Warga
          </span>
        </div>

        <h1
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-white leading-tight tracking-tight animate-fade-in"
          style={{ animationDelay: '0.4s', animationFillMode: 'both' }}
        >
          {siteName.split(' ').map((word, i) => (
            <span key={i}>
              {i === 1 ? (
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
                  {word}
                </span>
              ) : (
                word
              )}{' '}
            </span>
          ))}
        </h1>

        <p
          className="mt-4 text-xl sm:text-2xl md:text-3xl font-semibold text-white/90 animate-fade-in"
          style={{ animationDelay: '0.6s', animationFillMode: 'both' }}
        >
          {tagline}
        </p>

        <p
          className="mt-4 text-base sm:text-lg text-white/70 max-w-2xl mx-auto animate-fade-in"
          style={{ animationDelay: '0.8s', animationFillMode: 'both' }}
        >
          {subtitle}
        </p>

        <div
          className="mt-8 flex flex-col sm:flex-row gap-4 justify-center animate-fade-in"
          style={{ animationDelay: '1s', animationFillMode: 'both' }}
        >
          <a
            href="#layanan"
            className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-gradient-start to-gradient-end text-white font-semibold text-base
                       shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0"
          >
            Jelajahi Layanan
          </a>
          <a
            href="#kontak"
            className="px-8 py-3.5 rounded-xl bg-white/10 border border-white/25 text-white font-semibold text-base
                       backdrop-blur-sm hover:bg-white/20 transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0"
          >
            Daftar Sekarang
          </a>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce-subtle">
        <svg className="w-6 h-6 text-white/60" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </div>
    </section>
  )
}
