'use client'

interface CTAData {
  heading: string
  description: string
  buttonText: string
  whatsappNumber: string
  whatsappMessage: string
}

interface CTAEditorProps {
  data: CTAData
  onChange: (data: CTAData) => void
}

export default function CTAEditor({ data, onChange }: CTAEditorProps) {
  const update = (field: keyof CTAData, value: string) => {
    onChange({ ...data, [field]: value })
  }

  return (
    <div className="space-y-5">
      <div>
        <label className="block text-sm font-medium text-text-primary mb-1.5">Heading</label>
        <input
          type="text"
          value={data.heading || ''}
          onChange={(e) => update('heading', e.target.value)}
          className="w-full px-4 py-2.5 bg-background border border-border rounded-xl text-text-primary text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-text-primary mb-1.5">Deskripsi</label>
        <textarea
          value={data.description || ''}
          onChange={(e) => update('description', e.target.value)}
          rows={2}
          className="w-full px-4 py-2.5 bg-background border border-border rounded-xl text-text-primary text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all resize-y"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-text-primary mb-1.5">Teks Tombol</label>
        <input
          type="text"
          value={data.buttonText || ''}
          onChange={(e) => update('buttonText', e.target.value)}
          className="w-full px-4 py-2.5 bg-background border border-border rounded-xl text-text-primary text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
        />
      </div>

      <div className="border-t border-border pt-5">
        <h3 className="text-sm font-semibold text-text-primary mb-4 flex items-center gap-2">
          <svg className="w-4 h-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
          </svg>
          WhatsApp Integration
        </h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-text-primary mb-1.5">Nomor WhatsApp</label>
            <input
              type="text"
              value={data.whatsappNumber || ''}
              onChange={(e) => update('whatsappNumber', e.target.value)}
              placeholder="6281234567890"
              className="w-full px-4 py-2.5 bg-background border border-border rounded-xl text-text-primary text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all placeholder:text-text-tertiary"
            />
            <p className="text-xs text-text-tertiary mt-1">Format: kode negara + nomor (tanpa + atau spasi)</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-text-primary mb-1.5">Pesan Default WhatsApp</label>
            <textarea
              value={data.whatsappMessage || ''}
              onChange={(e) => update('whatsappMessage', e.target.value)}
              rows={2}
              className="w-full px-4 py-2.5 bg-background border border-border rounded-xl text-text-primary text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all resize-y"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
