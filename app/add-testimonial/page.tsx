'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function AddTestimonial() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')
  const [rating, setRating] = useState(5)
  const [file, setFile] = useState<File | null>(null)
  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    
    try {
      const formData = new FormData(e.currentTarget)
      formData.set('rating', rating.toString())
      if (file) {
        formData.set('photo', file)
      }

      const res = await fetch('/api/testimonials', {
        method: 'POST',
        body: formData,
      })
      
      const data = await res.json()
      
      if (!res.ok) {
        throw new Error(data.error || 'Gagal mengirim testimoni')
      }
      
      setSuccess(true)
      setTimeout(() => {
        router.push('/#testimoni')
      }, 3000)
      
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background pt-24 pb-12 px-4 sm:px-6 lg:px-8 flex flex-col items-center">
      <Link href="/#testimoni" className="self-start md:absolute md:top-24 md:left-8 flex items-center gap-2 text-text-secondary hover:text-primary transition-colors text-sm font-medium mb-6">
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Kembali
      </Link>
      
      <div className="w-full max-w-2xl bg-surface border border-border shadow-soft-lg rounded-2xl p-6 sm:p-10 relative overflow-hidden">
        {/* Decor */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-start/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />
        
        <div className="text-center mb-8 relative z-10">
          <span className="inline-block px-4 py-1.5 rounded-full bg-accent/10 border border-accent/20 text-accent text-xs font-bold uppercase tracking-widest mb-4">
            Testimoni Baru
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-text-primary">
            Bagikan <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-amber-600">Cerita Anda</span>
          </h1>
          <p className="mt-3 text-text-secondary text-sm sm:text-base">
            Pengalaman Anda sangat berharga bagi warga Probolinggo lainnya.
          </p>
        </div>

        {success ? (
          <div className="text-center py-12 animate-fade-in">
            <div className="w-20 h-20 bg-green-500/10 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-text-primary mb-2">Terima Kasih!</h3>
            <p className="text-text-secondary">Testimoni Anda telah berhasil ditambahkan dan disimpan secara otomatis.</p>
            <p className="text-text-tertiary text-sm mt-4">Mengalihkan halaman dalam 3 detik...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6 relative z-10 animate-fade-in">
            {error && (
              <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-500 text-sm font-medium rounded-xl">
                {error}
              </div>
            )}
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label htmlFor="name" className="block text-sm font-semibold text-text-primary">
                  Nama Lengkap <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  placeholder="Misal: Budi Santoso"
                  className="w-full bg-background border border-border text-text-primary rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-transparent transition-all placeholder:text-text-tertiary"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="role" className="block text-sm font-semibold text-text-primary">
                  Pekerjaan / Peran <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="role"
                  name="role"
                  required
                  placeholder="Misal: Warga RW 02 / Wiraswasta"
                  className="w-full bg-background border border-border text-text-primary rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-transparent transition-all placeholder:text-text-tertiary"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="photo" className="block text-sm font-semibold text-text-primary">
                Foto Profil <span className="text-text-tertiary font-normal">(Opsional)</span>
              </label>
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <input
                    type="file"
                    id="photo"
                    accept="image/*"
                    onChange={(e) => setFile(e.target.files?.[0] || null)}
                    className="w-full bg-background border border-border text-text-secondary rounded-xl px-4 py-2.5 file:mr-4 file:py-1 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20 transition-all cursor-pointer outline-none"
                  />
                </div>
              </div>
              <p className="text-xs text-text-tertiary">Format JPG, PNG, atau WEBP. Jika dikosongkan, avatar unik otomatis dibuatkan berdasar nama Anda.</p>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-semibold text-text-primary mb-1">
                Penilaian Layanan <span className="text-red-500">*</span>
              </label>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className="focus:outline-none transition-transform hover:scale-110"
                    aria-label={`Beri nilai ${star} bintang`}
                  >
                    <svg
                      className={`w-8 h-8 ${star <= rating ? 'text-amber-400' : 'text-gray-300 dark:text-gray-700'}`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  </button>
                ))}
                <span className="ml-2 text-sm font-medium text-text-secondary">{rating} dari 5 bintang</span>
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="content" className="block text-sm font-semibold text-text-primary">
                Review / Pengalaman Anda <span className="text-red-500">*</span>
              </label>
              <textarea
                id="content"
                name="content"
                required
                rows={4}
                placeholder="Ceritakan pengalaman Anda menggunakan portal Live At Probolinggo..."
                className="w-full bg-background border border-border text-text-primary rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-transparent transition-all placeholder:text-text-tertiary resize-y"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 mt-2 rounded-xl bg-gradient-to-r from-gradient-start to-gradient-end text-white font-bold text-lg shadow-lg shadow-primary/25 hover:shadow-primary/40 hover:opacity-95 disabled:opacity-50 transition-all focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background active:-translate-y-0"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                  Menyimpan & Mempublikasikan...
                </span>
              ) : (
                'Kirim Testimoni'
              )}
            </button>
            <p className="text-center text-xs text-text-tertiary mt-4">
              Dengan mengirim testimoni, Anda menyetujui pengalaman Anda ditampilkan secara publik dan tersimpan di database.
            </p>
          </form>
        )}
      </div>
    </div>
  )
}
