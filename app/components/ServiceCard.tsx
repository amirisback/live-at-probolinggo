interface ServiceCardProps {
  name: string
  phone: string
  address: string
}

export default function ServiceCard({ name, phone, address }: ServiceCardProps) {
  const waLink = `https://wa.me/62${phone.replace(/^0/, '')}?text=${encodeURIComponent(`Halo ${name}, saya menemukan kontak Anda di Live At Probolinggo.`)}`
  const mapsLink = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`

  return (
    <div className="group flex items-start gap-4 p-4 rounded-xl bg-background border border-border hover:border-primary/30 hover:shadow-soft transition-all duration-300">
      {/* Avatar placeholder */}
      <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center text-primary font-bold text-sm">
        {name.charAt(0)}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <h4 className="font-semibold text-text-primary text-sm group-hover:text-primary transition-colors duration-200">
          {name}
        </h4>
        <p className="text-xs text-text-tertiary mt-0.5 truncate">
          📍 {address}
        </p>
      </div>

      {/* Action buttons */}
      <div className="flex items-center gap-2 flex-shrink-0">
        {/* Maps */}
        <a
          href={mapsLink}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Lokasi ${name}`}
          className="w-9 h-9 rounded-lg bg-red-500/10 flex items-center justify-center text-red-500 hover:bg-red-500 hover:text-white transition-all duration-200"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.242-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </a>

        {/* Call */}
        <a
          href={`tel:${phone}`}
          aria-label={`Telepon ${name}`}
          className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-all duration-200"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
          </svg>
        </a>

        {/* WhatsApp */}
        <a
          href={waLink}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`WhatsApp ${name}`}
          className="w-9 h-9 rounded-lg bg-green-500/10 flex items-center justify-center text-green-600 hover:bg-green-500 hover:text-white transition-all duration-200"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
            <path d="M12 0C5.373 0 0 5.373 0 12c0 2.114.549 4.1 1.511 5.826L0 24l6.335-1.652A11.943 11.943 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818c-1.862 0-3.626-.502-5.146-1.383l-.369-.218-3.823.997 1.019-3.716-.24-.381A9.782 9.782 0 012.182 12c0-5.414 4.404-9.818 9.818-9.818S21.818 6.586 21.818 12s-4.404 9.818-9.818 9.818z" />
          </svg>
        </a>
      </div>
    </div>
  )
}
