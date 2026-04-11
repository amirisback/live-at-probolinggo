interface CTASectionProps {
  heading: string
  description: string
  buttonText: string
  whatsappNumber: string
  whatsappMessage: string
}

export default function CTASection({
  heading,
  description,
  buttonText,
  whatsappNumber,
  whatsappMessage,
}: CTASectionProps) {
  const waLink = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`

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
          <a
            href={waLink}
            target="_blank"
            rel="noopener noreferrer"
            id="cta-whatsapp-button"
            className="inline-flex items-center gap-3 px-8 py-4 rounded-xl bg-white text-blue-600 font-bold text-base
                       shadow-xl shadow-black/15 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300
                       animate-pulse-glow"
          >
            {/* WhatsApp icon */}
            <svg className="w-5 h-5 text-green-500" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
              <path d="M12 0C5.373 0 0 5.373 0 12c0 2.114.549 4.1 1.511 5.826L0 24l6.335-1.652A11.943 11.943 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818c-1.862 0-3.626-.502-5.146-1.383l-.369-.218-3.823.997 1.019-3.716-.24-.381A9.782 9.782 0 012.182 12c0-5.414 4.404-9.818 9.818-9.818S21.818 6.586 21.818 12s-4.404 9.818-9.818 9.818z" />
            </svg>
            {buttonText}
          </a>
        </div>

        <p className="mt-6 text-white/50 text-sm">
          Gratis • Tanpa biaya pendaftaran • Langsung terhubung
        </p>
      </div>
    </section>
  )
}
