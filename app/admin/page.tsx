'use client'

import { useState, useEffect } from 'react'
import SiteEditor from './components/SiteEditor'
import ServicesEditor from './components/ServicesEditor'
import TestimonialsEditor from './components/TestimonialsEditor'
import CTAEditor from './components/CTAEditor'
import FooterEditor from './components/FooterEditor'

const FILES = ['site.json', 'services.json', 'testimonials.json', 'cta.json', 'footer.json']

const TAB_LABELS: Record<string, { icon: string; label: string }> = {
  'site.json': { icon: '📱', label: 'Info Website' },
  'services.json': { icon: '🛠️', label: 'Layanan' },
  'testimonials.json': { icon: '💬', label: 'Testimoni' },
  'cta.json': { icon: '📞', label: 'Call to Action' },
  'footer.json': { icon: '🔽', label: 'Footer' },
}

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState('site.json')
  const [data, setData] = useState<Record<string, any>>({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState({ text: '', type: '' })
  const [viewMode, setViewMode] = useState<'form' | 'json'>('form')

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const fetchedData: Record<string, any> = {}
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

  const downloadTemplate = () => {
    const csvContent = "data:text/csv;charset=utf-8,Kategori,Icon,Deskripsi,Nama,WhatsApp,Alamat\nTukang Taman,🌿,Jasa merapikan taman dan potong rumput,Pak Joko,08123456789,Jl. Mawar No. 12\nTukang Taman,🌿,Jasa merapikan taman dan potong rumput,Pak Andi,08123456790,Jl. Melati No. 5"
    const encodedUri = encodeURI(csvContent)
    const link = document.createElement("a")
    link.setAttribute("href", encodedUri)
    link.setAttribute("download", "template_layanan.csv")
    document.body.appendChild(link)
    link.click()
    link.remove()
  }

  const parseCSVLine = (text: string, sep: string) => {
    let inQuotes = false
    let word = ''
    const row: string[] = []
    for (let i = 0; i < text.length; i++) {
      const char = text[i]
      if (char === '"') {
        inQuotes = !inQuotes
      } else if (char === sep && !inQuotes) {
        row.push(word.trim())
        word = ''
      } else {
        word += char
      }
    }
    row.push(word.trim())
    return row
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (event) => {
      const text = event.target?.result as string
      if (text) parseCSVAndMerge(text)
    }
    reader.readAsText(file)
    e.target.value = ''
  }

  const parseCSVAndMerge = (csvText: string) => {
    const lines = csvText.split('\n').map(l => l.trim()).filter(l => l)
    if (lines.length < 2) {
      setMessage({ text: 'CSV kosong atau tidak valid', type: 'error' })
      return
    }

    let sep = ','
    if (lines[0].includes(';')) sep = ';'

    const currentData = Array.isArray(data['services.json']) ? [...data['services.json']] : []
    let addedCount = 0

    for (let i = 1; i < lines.length; i++) {
      const row = parseCSVLine(lines[i], sep)
      if (row.length < 4) continue

      const cat = row[0].replace(/^"|"$/g, '')
      const icon = row[1]?.replace(/^"|"$/g, '') || '✨'
      const desc = row[2]?.replace(/^"|"$/g, '') || 'Layanan warga'
      const name = row[3]?.replace(/^"|"$/g, '')
      const phone = row[4]?.replace(/^"|"$/g, '') || ''
      const address = row[5]?.replace(/^"|"$/g, '') || 'Tidak ada alamat / tidak tahu'

      if (!cat || !name) continue

      let catIndex = currentData.findIndex((c: any) => c.category.toLowerCase() === cat.toLowerCase())
      if (catIndex === -1) {
        const newId = cat.toLowerCase().replace(/[^a-z0-9]+/g, '-')
        currentData.push({ id: newId, category: cat, icon, description: desc, contacts: [] })
        catIndex = currentData.length - 1
      }

      const exists = currentData[catIndex].contacts.find((c: any) => c.name === name && c.phone === phone)
      if (!exists) {
        currentData[catIndex].contacts.push({ name, phone, address })
        addedCount++
      }
    }

    setData(prev => ({ ...prev, 'services.json': currentData }))
    setMessage({ text: `Berhasil menggabungkan ${addedCount} data baru dari CSV! Periksa lalu Simpan.`, type: 'success' })
  }

  const updateData = (fileName: string, newVal: any) => {
    setData(prev => ({ ...prev, [fileName]: newVal }))
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
        {/* Header */}
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

        {/* Message */}
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
              {TAB_LABELS[file]?.icon} {TAB_LABELS[file]?.label}
            </button>
          ))}
        </div>

        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
          <div className="flex items-center gap-2">
            <p className="text-sm text-text-secondary bg-background/50 px-3 py-1.5 rounded-md border border-border inline-block">
              Mengedit: <strong className="font-mono text-primary">{TAB_LABELS[activeTab]?.label}</strong>
            </p>
            {/* Toggle Form/JSON */}
            <div className="flex bg-background border border-border rounded-lg overflow-hidden">
              <button
                onClick={() => setViewMode('form')}
                className={`px-3 py-1.5 text-xs font-medium transition-colors ${viewMode === 'form' ? 'bg-primary text-white' : 'text-text-secondary hover:text-text-primary'}`}
              >
                Form
              </button>
              <button
                onClick={() => setViewMode('json')}
                className={`px-3 py-1.5 text-xs font-medium transition-colors ${viewMode === 'json' ? 'bg-primary text-white' : 'text-text-secondary hover:text-text-primary'}`}
              >
                JSON
              </button>
            </div>
          </div>

          {activeTab === 'services.json' && (
            <div className="flex flex-wrap gap-2">
              <button
                onClick={downloadTemplate}
                className="text-sm px-4 py-2 border border-border text-text-secondary bg-surface hover:bg-surface-hover rounded-xl flex items-center gap-2 transition-all shadow-sm"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Template CSV
              </button>
              <label className="text-sm px-4 py-2 bg-green-500/10 hover:bg-green-500/20 text-green-600 dark:text-green-500 border border-green-500/20 rounded-xl flex items-center gap-2 cursor-pointer transition-all shadow-sm font-bold">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                </svg>
                Import CSV
                <input type="file" accept=".csv" className="hidden" onChange={handleFileUpload} />
              </label>
            </div>
          )}
        </div>

        {/* Editor Area */}
        <div className="animate-fade-in" key={`${activeTab}-${viewMode}`}>
          {viewMode === 'form' ? (
            <FormEditor
              activeTab={activeTab}
              data={data[activeTab]}
              onChange={(newVal) => updateData(activeTab, newVal)}
            />
          ) : (
            <JsonEditor
              initialValue={data[activeTab]}
              onSave={(newVal) => updateData(activeTab, newVal)}
            />
          )}
        </div>

        {/* Save Button */}
        <div className="flex flex-col sm:flex-row justify-between items-center mt-6 pt-4 border-t border-border gap-4">
          <p className="text-xs text-text-tertiary">
            {viewMode === 'json'
              ? '* Pastikan format JSON sudah benar sebelum menekan tombol simpan.'
              : '* Perubahan akan disimpan ke file JSON saat menekan tombol simpan.'}
          </p>
          <button
            onClick={() => handleSave(activeTab)}
            disabled={saving}
            className="w-full sm:w-auto px-8 py-3 bg-gradient-to-r from-gradient-start to-gradient-end text-white rounded-xl hover:opacity-95 disabled:opacity-50 font-bold shadow-lg shadow-primary/25 transition-all outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background"
          >
            {saving ? 'Menyimpan Data...' : 'Simpan Perubahan'}
          </button>
        </div>
      </div>
    </div>
  )
}

/* Form Editor - renders specific form UI based on active tab */
function FormEditor({ activeTab, data, onChange }: { activeTab: string; data: any; onChange: (val: any) => void }) {
  if (!data) {
    return <p className="text-center text-text-tertiary py-8">Data belum tersedia untuk tab ini.</p>
  }

  switch (activeTab) {
    case 'site.json':
      return <SiteEditor data={data} onChange={onChange} />
    case 'services.json':
      return <ServicesEditor data={data} onChange={onChange} />
    case 'testimonials.json':
      return <TestimonialsEditor data={data} onChange={onChange} />
    case 'cta.json':
      return <CTAEditor data={data} onChange={onChange} />
    case 'footer.json':
      return <FooterEditor data={data} onChange={onChange} />
    default:
      return <p className="text-center text-text-tertiary py-8">Editor belum tersedia untuk tab ini.</p>
  }
}

/* JSON Editor - raw JSON textarea as fallback */
function JsonEditor({ initialValue, onSave }: { initialValue: any; onSave: (val: any) => void }) {
  const [localStr, setLocalStr] = useState(() => JSON.stringify(initialValue, null, 2))
  const [error, setError] = useState('')

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
        className="w-full min-h-[500px] font-mono text-sm leading-relaxed p-5 bg-[#0d1117] text-[#c9d1d9] border border-border/80 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent focus:outline-none transition-all resize-y custom-scrollbar shadow-inner"
        spellCheck="false"
      />
      {error && (
        <div className="absolute top-4 right-4 px-4 py-2 bg-red-500/95 text-white text-sm font-medium rounded-lg shadow-lg border border-red-400 backdrop-blur-sm">
          Format Tidak Valid: {error}
        </div>
      )}
    </div>
  )
}
