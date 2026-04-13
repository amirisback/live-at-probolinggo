'use client'

import { useTransition, useState, useEffect, useRef } from 'react'
import { addServiceAction } from './action'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import { isRedirectError } from 'next/dist/client/components/redirect-error'

const EmojiPicker = dynamic(() => import('emoji-picker-react'), { ssr: false })

export interface CategoryData {
  id: string
  name: string
  icon: string
  description: string
}

interface Props {
  existingCategories: CategoryData[]
}

export default function DaftarLayananClient({ existingCategories }: Props) {
  const [isPending, startTransition] = useTransition()
  const [errorVisible, setErrorVisible] = useState(false)
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('')

  // Fields state to handle auto-fill and new category mode
  const [categoryName, setCategoryName] = useState('')
  const [icon, setIcon] = useState('')
  const [description, setDescription] = useState('')
  const [address, setAddress] = useState('')

  // Emoji picker state
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const emojiPickerRef = useRef<HTMLDivElement>(null)

  const isNewCategory = selectedCategoryId === 'new_category'

  // Handle click outside for emoji picker
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target as Node)) {
        setShowEmojiPicker(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Auto-fill when existing category is selected
  useEffect(() => {
    if (selectedCategoryId && selectedCategoryId !== 'new_category') {
      const cat = existingCategories.find((c) => c.id === selectedCategoryId)
      if (cat) {
        setCategoryName(cat.name)
        setIcon(cat.icon)
        setDescription(cat.description)
      }
    } else if (selectedCategoryId === 'new_category') {
      setCategoryName('')
      setIcon('')
      setDescription('')
    }
  }, [selectedCategoryId, existingCategories])

  const handleSubmit = (formData: FormData) => {
    // If we're updating an existing category, we want to make sure the submitted variables mirror our state
    // Just in case existing fields are disabled or we want to force them. 
    // The server action just looks at formData. We'll append hidden info or let inputs handle it.
    // Also, handle the address state since we controlled it
    formData.set('address', address)

    setErrorVisible(false)
    startTransition(async () => {
      try {
        await addServiceAction(formData)
      } catch (err) {
        if (isRedirectError(err)) {
          throw err
        }
        setErrorVisible(true)
      }
    })
  }

  const handleGetLocation = () => {
    if (navigator.geolocation) {
      // Optional: you can show a loading state here if needed
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          setAddress(`https://maps.google.com/?q=${lat},${lng}`);
        },
        (error) => {
          alert('Gagal mendapatkan lokasi. Pastikan izin lokasi diaktifkan.');
        }
      );
    } else {
      alert('Browser Anda tidak mendukung fitur lokasi.');
    }
  }

  const handleEmojiClick = (emojiData: any) => {
    setIcon(emojiData.emoji)
    setShowEmojiPicker(false)
  }

  return (
    <div className="min-h-screen pt-28 pb-20 px-4 bg-background relative overflow-hidden flex justify-center items-center">
      {/* Background Ornaments */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute top-20 right-10 w-64 h-64 bg-gradient-start/10 rounded-full blur-[80px]" />
        <div className="absolute bottom-20 left-10 w-80 h-80 bg-gradient-end/10 rounded-full blur-[100px]" />
      </div>

      <div className="w-full max-w-3xl z-10 glass rounded-3xl p-6 sm:p-10 shadow-soft-lg border border-glass-border">
        <div className="mb-8 border-b border-border pb-6">
          <Link href="/#kontak" className="inline-flex items-center text-sm font-medium text-primary hover:text-primary-hover mb-6 transition-colors">
            <svg className="w-4 h-4 mr-2 text-current" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Kembali ke Beranda
          </Link>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-foreground mb-3">Daftarkan <span className="text-transparent bg-clip-text bg-gradient-to-r from-gradient-start to-gradient-end">Keahlianmu</span></h1>
          <p className="text-text-secondary text-base lg:text-lg">
            Bergabung dengan Live At Probolinggo. Biarkan warga Probolinggo yang membutuhkan jasamu dapat menemukanmu dengan mudah, 100% gratis.
          </p>
        </div>

        {errorVisible && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/30 rounded-xl text-red-600 dark:text-red-400 text-sm">
            Terdapat kesalahan pada saat mendaftarkan layanan. Pastikan semua bidang terisi dengan benar.
          </div>
        )}

        <form action={handleSubmit} className="space-y-8">
          <div>
            <h3 className="text-lg font-bold text-foreground mb-4 flex items-center">
              <span className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center mr-3 text-sm">1</span>
              Informasi Layanan
            </h3>
            <div className="space-y-5 p-5 bg-surface/50 rounded-2xl border border-border">

              <div className="space-y-2">
                <label className="text-sm font-semibold text-text-primary">Pilih Kategori Layanan <span className="text-red-500">*</span></label>
                <select
                  className="w-full bg-surface border border-border rounded-xl px-4 py-3 text-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all shadow-sm appearance-none"
                  value={selectedCategoryId}
                  onChange={(e) => setSelectedCategoryId(e.target.value)}
                  required
                >
                  <option value="" disabled>-- Pilih Kategori --</option>
                  {existingCategories.map((cat) => (
                    <option key={cat.id} value={cat.id}>{cat.icon} {cat.name}</option>
                  ))}
                  <option value="new_category">+ Tambah Kategori Baru...</option>
                </select>
              </div>

              {isNewCategory && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-4 p-4 border border-primary-light bg-primary/5 rounded-xl">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-text-primary">Nama Kategori Baru <span className="text-red-500">*</span></label>
                    <input
                      name="categoryName"
                      required={isNewCategory}
                      value={categoryName}
                      onChange={(e) => setCategoryName(e.target.value)}
                      placeholder="Contoh: Tukang Listrik"
                      className="w-full bg-surface border border-border rounded-xl px-4 py-3 text-foreground placeholder-text-tertiary focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all shadow-sm"
                    />
                  </div>

                  <div className="space-y-2 relative" ref={emojiPickerRef}>
                    <label className="text-sm font-semibold text-text-primary">Pilih Ikon Emoji <span className="text-red-500">*</span></label>
                    <div className="flex gap-2">
                      <input
                        type="hidden"
                        name="icon"
                        value={icon}
                      />
                      <button
                        type="button"
                        onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                        className="w-12 h-[50px] shrink-0 bg-surface border border-border rounded-xl flex items-center justify-center text-xl hover:bg-surface-hover transition-colors"
                      >
                        {icon || '😀'}
                      </button>
                      <input
                        readOnly
                        placeholder="Klik tombol emoji 👉"
                        value={icon ? `Emoji terpilih: ${icon}` : ''}
                        className="w-full bg-surface/50 border border-border rounded-xl px-4 py-3 text-foreground placeholder-text-tertiary focus:outline-none cursor-default shadow-sm"
                      />
                    </div>
                    {showEmojiPicker && (
                      <div className="absolute z-50 top-full mt-2 left-0 sm:right-0 shadow-xl rounded-xl custom-emoji-picker">
                        <EmojiPicker onEmojiClick={handleEmojiClick} theme={"auto" as any} />
                      </div>
                    )}
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <label className="text-sm font-semibold text-text-primary">Deskripsi Singkat <span className="text-red-500">*</span></label>
                    <input
                      name="description"
                      required={isNewCategory}
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Contoh: Ahli instalasi dan perbaikan korsleting listrik"
                      className="w-full bg-surface border border-border rounded-xl px-4 py-3 text-foreground placeholder-text-tertiary focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all shadow-sm"
                    />
                  </div>
                </div>
              )}

              {/* Always render hidden inputs so FormData always has these values */}
              {!isNewCategory && (
                <>
                  <input type="hidden" name="categoryName" value={categoryName} />
                  <input type="hidden" name="icon" value={icon} />
                  <input type="hidden" name="description" value={description} />
                </>
              )}

              {!isNewCategory && selectedCategoryId !== '' && (
                <div className="p-4 border border-border bg-surface rounded-xl">
                  <div className="flex gap-4 items-center">
                    <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center text-3xl">
                      {icon}
                    </div>
                    <div>
                      <h4 className="font-bold text-foreground text-lg">{categoryName}</h4>
                      <p className="text-sm text-text-secondary mt-1">{description}</p>
                    </div>
                  </div>
                </div>
              )}

            </div>
          </div>

          <div>
            <h3 className="text-lg font-bold text-foreground mb-4 flex items-center">
              <span className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center mr-3 text-sm">2</span>
              Detail Penyedia Jasa
            </h3>
            <div className="space-y-5 p-5 bg-surface/50 rounded-2xl border border-border">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-text-primary">Nama Lengkap <span className="text-red-500">*</span></label>
                  <input name="providerName" required placeholder="Nama Anda" className="w-full bg-surface border border-border rounded-xl px-4 py-3 text-foreground placeholder-text-tertiary focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all shadow-sm" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-text-primary">Nomor WhatsApp <span className="text-red-500">*</span></label>
                  <input name="phone" required placeholder="Contoh: 081234567890" className="w-full bg-surface border border-border rounded-xl px-4 py-3 text-foreground placeholder-text-tertiary focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all shadow-sm" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-text-primary">Alamat Operasional <span className="text-red-500">*</span></label>
                <textarea
                  name="address"
                  required
                  rows={3}
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Contoh: Jl. Pahlawan Karya No. 12, Panggung, Probolinggo"
                  className="w-full bg-surface border border-border rounded-xl px-4 py-3 text-foreground placeholder-text-tertiary focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all shadow-sm resize-none"
                ></textarea>
                <div className="flex flex-wrap gap-2 mt-2">
                  <button
                    type="button"
                    onClick={() => setAddress('Tidak ada alamat / tidak tahu')}
                    className="text-xs px-3 py-1.5 bg-surface border border-border hover:bg-surface-hover rounded-lg text-text-secondary transition-colors"
                  >
                    Tidak ada alamat / tidak tahu
                  </button>
                  <button
                    type="button"
                    onClick={handleGetLocation}
                    className="text-xs px-3 py-1.5 bg-primary/10 border border-primary/20 hover:bg-primary/20 text-primary rounded-lg transition-colors flex items-center gap-1"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.242-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    Get Location sekarang
                  </button>
                </div>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={isPending || selectedCategoryId === ''}
            className="w-full bg-gradient-to-r from-gradient-start to-gradient-end hover:shadow-lg hover:shadow-primary/30 text-white font-bold py-4 px-6 rounded-xl disabled:opacity-70 disabled:cursor-not-allowed transition-all hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center text-lg mt-6"
          >
            {isPending ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Menyimpan...
              </>
            ) : "Daftarkan Sekarang"}
          </button>
        </form>
      </div>
    </div>
  )
}
