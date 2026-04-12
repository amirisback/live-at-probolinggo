'use client'

interface CTAData {
  heading: string
  description: string
  buttonText: string
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
    </div>
  )
}
