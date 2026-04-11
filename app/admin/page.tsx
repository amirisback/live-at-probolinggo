'use client'

import { useState, useEffect } from 'react'

const FILES = ['site.json', 'services.json', 'testimonials.json', 'cta.json']

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState('site.json')
  const [data, setData] = useState<{ [key: string]: any }>({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState({ text: '', type: '' })

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const fetchedData: any = {}
        for (const file of FILES) {
          const res = await fetch(`/api/cms?file=${file}`)
          if (res.ok) {
            fetchedData[file] = await res.json()
          }
        }
        setData(fetchedData)
      } catch (e) {
        console.error('Failed to fetch', e)
        setMessage({ text: 'Gagal memuat data.', type: 'error' })
      } finally {
        setLoading(false)
      }
    }
    fetchAllData()
  }, [])

  const handleSave = async (fileName: string) => {
    setSaving(true)
    setMessage({ text: '', type: '' })
    try {
      const res = await fetch('/api/cms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ file: fileName, data: data[fileName] }),
      })
      if (res.ok) {
        setMessage({ text: `${fileName} berhasil disimpan!`, type: 'success' })
      } else {
        setMessage({ text: `Gagal menyimpan ${fileName}`, type: 'error' })
      }
    } catch (e) {
      console.error(e)
      setMessage({ text: `Terjadi kesalahan saat menyimpan ${fileName}`, type: 'error' })
    } finally {
      setSaving(false)
      setTimeout(() => setMessage({ text: '', type: '' }), 3000)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-text-secondary font-medium">Memuat Dashboard CMS...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background text-foreground p-4 sm:p-8">
      <div className="max-w-5xl mx-auto bg-surface shadow-soft-lg rounded-2xl p-6 border border-border">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <h1 className="text-2xl sm:text-3xl font-bold flex items-center gap-3">
            <span className="p-2 bg-primary/10 text-primary rounded-lg text-xl sm:text-2xl">⚙️</span> 
            Dashboard Admin
          </h1>
          <a href="/" target="_blank" className="px-5 py-2.5 bg-background border border-border rounded-xl hover:bg-border/50 text-text-primary font-medium transition-all text-sm flex items-center gap-2 shadow-sm">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
            Lihat Website
          </a>
        </div>

        {message.text && (
          <div className={`p-4 mb-6 rounded-xl font-medium animate-fade-in ${message.type === 'success' ? 'bg-green-500/10 text-emerald-600 dark:text-emerald-400 border border-green-500/20' : 'bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20'}`}>
            <span className="mr-2">{message.type === 'success' ? '✅' : '❌'}</span>
            {message.text}
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-2 overflow-x-auto border-b border-border/50 mb-6 custom-scrollbar pb-1">
          {FILES.map((file) => (
            <button
              key={file}
              onClick={() => setActiveTab(file)}
              className={`px-5 py-3 font-medium transition-all border-b-2 whitespace-nowrap text-sm ${
                activeTab === file
                  ? 'border-primary text-primary bg-primary/5 rounded-t-lg'
                  : 'border-transparent text-text-secondary hover:text-text-primary hover:bg-surface-hover rounded-t-lg'
              }`}
            >
              {file === 'site.json' && '📱 Info Website'}
              {file === 'services.json' && '🛠️ Layanan'}
              {file === 'testimonials.json' && '💬 Testimoni'}
              {file === 'cta.json' && '📞 Call to Action'}
            </button>
          ))}
        </div>

        {/* Editor Area */}
        <div className="space-y-4 animate-fade-in" key={activeTab}>
          <div className="flex justify-between items-center mb-2">
            <p className="text-sm text-text-secondary bg-background/50 px-3 py-1.5 rounded-md border border-border inline-block">
              Mengedit file: <strong className="font-mono text-primary">{activeTab}</strong>
            </p>
          </div>
          
          <JsonEditor 
            file={activeTab} 
            initialValue={data[activeTab]} 
            onSave={(newVal) => {
               setData(prev => ({ ...prev, [activeTab]: newVal }))
            }} 
          />
          
          <div className="flex flex-col sm:flex-row justify-between items-center mt-6 pt-4 border-t border-border gap-4">
            <p className="text-xs text-text-tertiary">
              * Pastikan format JSON sudah benar (tidak ada pesan error merah) sebelum menekan tombol simpan.
            </p>
            <button
              onClick={() => handleSave(activeTab)}
              disabled={saving}
              className="w-full sm:w-auto px-8 py-3 bg-gradient-to-r from-gradient-start to-gradient-end text-white rounded-xl hover:opacity-95 disabled:opacity-50 font-bold shadow-lg shadow-primary/25 transition-all outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background active:-translate-y-0"
            >
              {saving ? 'Menyimpan Data...' : 'Simpan Perubahan'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

function JsonEditor({ file, initialValue, onSave }: { file: string, initialValue: any, onSave: (val: any) => void }) {
  const [localStr, setLocalStr] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    setLocalStr(JSON.stringify(initialValue, null, 2))
    setError('')
  }, [initialValue])

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value
    setLocalStr(val)
    try {
      const parsed = JSON.parse(val)
      setError('')
      onSave(parsed)
    } catch (err: any) {
      setError(err.message)
    }
  }

  return (
    <div className="flex flex-col gap-2 relative">
      <textarea
        value={localStr}
        onChange={handleChange}
        className="w-full min-h-[500px] font-mono text-sm leading-relaxed p-5 bg-[#0d1117] dark:bg-[#0d1117] text-[#c9d1d9] border border-border/80 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent focus:outline-none transition-all resize-y custom-scrollbar shadow-inner"
        spellCheck="false"
      />
      {error && (
        <div className="absolute top-4 right-4 px-4 py-2 bg-red-500/95 text-white text-sm font-medium rounded-lg shadow-lg border border-red-400 backdrop-blur-sm animate-pulse-subtle">
          ⚠️ Format Tidak Valid: {error}
        </div>
      )}
    </div>
  )
}
