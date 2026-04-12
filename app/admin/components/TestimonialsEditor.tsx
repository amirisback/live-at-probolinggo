'use client'

interface Testimonial {
  name: string
  role: string
  text: string
  rating: number
}

interface TestimonialsEditorProps {
  data: Testimonial[]
  onChange: (data: Testimonial[]) => void
}

export default function TestimonialsEditor({ data, onChange }: TestimonialsEditorProps) {
  const testimonials = Array.isArray(data) ? data : []

  const addTestimonial = () => {
    onChange([...testimonials, { name: '', role: '', text: '', rating: 5 }])
  }

  const updateTestimonial = (idx: number, field: keyof Testimonial, value: string | number) => {
    const updated = [...testimonials]
    updated[idx] = { ...updated[idx], [field]: value }
    onChange(updated)
  }

  const deleteTestimonial = (idx: number) => {
    onChange(testimonials.filter((_, i) => i !== idx))
  }

  return (
    <div className="space-y-4">
      <div className="text-sm text-text-secondary bg-background/50 px-4 py-3 rounded-xl border border-border">
        <strong className="text-text-primary">{testimonials.length}</strong> testimoni terdaftar
      </div>

      {testimonials.length === 0 && (
        <div className="text-center py-8 text-text-tertiary">
          <p className="text-lg mb-1">Belum ada testimoni</p>
          <p className="text-sm">Klik tombol di bawah untuk menambahkan testimoni pertama.</p>
        </div>
      )}

      {testimonials.map((item, idx) => (
        <div key={idx} className="rounded-xl border border-border bg-surface p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-text-primary">Testimoni #{idx + 1}</span>
            <button
              onClick={() => deleteTestimonial(idx)}
              className="px-3 py-1 text-red-500 text-xs font-medium hover:bg-red-500/10 rounded-lg transition-colors"
            >
              Hapus
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-text-secondary mb-1">Nama</label>
              <input
                type="text"
                value={item.name}
                onChange={(e) => updateTestimonial(idx, 'name', e.target.value)}
                placeholder="Nama pemberi testimoni"
                className="w-full px-3 py-2 bg-background border border-border rounded-lg text-text-primary text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-text-secondary mb-1">Peran / Keterangan</label>
              <input
                type="text"
                value={item.role}
                onChange={(e) => updateTestimonial(idx, 'role', e.target.value)}
                placeholder="Contoh: Warga Mayangan"
                className="w-full px-3 py-2 bg-background border border-border rounded-lg text-text-primary text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-text-secondary mb-1">Isi Testimoni</label>
            <textarea
              value={item.text}
              onChange={(e) => updateTestimonial(idx, 'text', e.target.value)}
              rows={2}
              placeholder="Tulis testimoni di sini..."
              className="w-full px-3 py-2 bg-background border border-border rounded-lg text-text-primary text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none resize-y"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-text-secondary mb-1">
              Rating: <span className="text-primary font-bold">{'★'.repeat(item.rating)}{'☆'.repeat(5 - item.rating)}</span>
            </label>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => updateTestimonial(idx, 'rating', star)}
                  className={`text-xl transition-colors ${star <= item.rating ? 'text-yellow-400' : 'text-border hover:text-yellow-300'}`}
                >
                  ★
                </button>
              ))}
            </div>
          </div>
        </div>
      ))}

      <button
        onClick={addTestimonial}
        className="w-full py-3 border-2 border-dashed border-border rounded-xl text-text-secondary text-sm font-medium hover:border-primary hover:text-primary hover:bg-primary/5 transition-all flex items-center justify-center gap-2"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
        </svg>
        Tambah Testimoni
      </button>
    </div>
  )
}
