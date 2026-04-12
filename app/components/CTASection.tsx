import Link from 'next/link'

interface CTASectionProps {
  heading: string
  description: string
  buttonText: string
}

export default function CTASection({
  heading,
  description,
  buttonText,
}: CTASectionProps) {

  return (
    <section id="kontak" className="section-padding relative overflow-hidden">
      {/* Gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-gradient-start via-blue-600 to-gradient-end" />

      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-full">
        <div className="absolute top-10 left-10 w-40 h-40 bg-white/5 rounded-full blur-2xl" />
        <div className="absolute bottom-10 right-10 w-60 h-60 bg-white/5 rounded-full blur-2xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-white/3 rounded-full blur-3xl" />
      </div>

      {/* Grid pattern overlay */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
          backgroundSize: '40px 40px',
        }}
      />

      <div className="relative z-10 max-w-3xl mx-auto text-center">
        <span className="inline-block px-4 py-1.5 rounded-full bg-white/15 text-white/90 text-sm font-medium mb-6">
          💼 Bergabung Bersama Kami
        </span>

        <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white leading-tight">
          {heading}
        </h2>

        <p className="mt-4 text-lg text-white/80 max-w-xl mx-auto">
          {description}
        </p>

        <div className="mt-8">
          <Link
            href="/add-layanan"
            id="cta-register-button"
            className="inline-flex items-center gap-3 px-8 py-4 rounded-xl bg-white text-blue-600 font-bold text-base
                       shadow-xl shadow-black/15 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300
                       animate-pulse-glow"
          >
            {/* Action icon */}
            <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            {buttonText}
          </Link>
        </div>

        <p className="mt-6 text-white/50 text-sm">
          Gratis • Tanpa biaya pendaftaran • Langsung terhubung
        </p>
      </div>
    </section>
  )
}
