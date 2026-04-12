'use client'

interface FooterData {
  description: string
  apologyText: string
  address: string
  email: string
  socialUrls: {
    instagram: string
    facebook: string
    github: string
  }
  bottomText: string
  madeWithText: string
  adminWa: Record<string, string>
}

interface FooterEditorProps {
  data: FooterData
  onChange: (data: FooterData) => void
}

export default function FooterEditor({ data, onChange }: FooterEditorProps) {
  const update = (field: keyof FooterData, value: string) => {
    onChange({ ...data, [field]: value })
  }

  const updateSocial = (field: string, value: string) => {
    onChange({ ...data, socialUrls: { ...data.socialUrls, [field]: value } })
  }

  const adminWaEntries = Object.entries(data.adminWa || {})

  const updateAdminWa = (oldKey: string, newKey: string, value: string) => {
    const updated = { ...data.adminWa }
    if (oldKey !== newKey) {
      delete updated[oldKey]
    }
    updated[newKey] = value
    onChange({ ...data, adminWa: updated })
  }

  const addAdminWa = () => {
    onChange({ ...data, adminWa: { ...data.adminWa, 'Nama Baru': '62' } })
  }

  const deleteAdminWa = (key: string) => {
    const updated = { ...data.adminWa }
    delete updated[key]
    onChange({ ...data, adminWa: updated })
  }

  return (
    <div className="space-y-5">
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
        <label className="block text-sm font-medium text-text-primary mb-1.5">Teks Permintaan Maaf</label>
        <textarea
          value={data.apologyText || ''}
          onChange={(e) => update('apologyText', e.target.value)}
          rows={2}
          className="w-full px-4 py-2.5 bg-background border border-border rounded-xl text-text-primary text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all resize-y"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-text-primary mb-1.5">Alamat</label>
          <input
            type="text"
            value={data.address || ''}
            onChange={(e) => update('address', e.target.value)}
            className="w-full px-4 py-2.5 bg-background border border-border rounded-xl text-text-primary text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-text-primary mb-1.5">Email</label>
          <input
            type="text"
            value={data.email || ''}
            onChange={(e) => update('email', e.target.value)}
            className="w-full px-4 py-2.5 bg-background border border-border rounded-xl text-text-primary text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
          />
        </div>
      </div>

      {/* Social URLs */}
      <div className="border-t border-border pt-5">
        <h3 className="text-sm font-semibold text-text-primary mb-4">Sosial Media</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-medium text-text-secondary mb-1">Instagram</label>
            <input
              type="text"
              value={data.socialUrls?.instagram || ''}
              onChange={(e) => updateSocial('instagram', e.target.value)}
              placeholder="https://instagram.com/..."
              className="w-full px-3 py-2 bg-background border border-border rounded-lg text-text-primary text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none placeholder:text-text-tertiary"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-text-secondary mb-1">Facebook</label>
            <input
              type="text"
              value={data.socialUrls?.facebook || ''}
              onChange={(e) => updateSocial('facebook', e.target.value)}
              placeholder="https://facebook.com/..."
              className="w-full px-3 py-2 bg-background border border-border rounded-lg text-text-primary text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none placeholder:text-text-tertiary"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-text-secondary mb-1">GitHub</label>
            <input
              type="text"
              value={data.socialUrls?.github || ''}
              onChange={(e) => updateSocial('github', e.target.value)}
              placeholder="https://github.com/..."
              className="w-full px-3 py-2 bg-background border border-border rounded-lg text-text-primary text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none placeholder:text-text-tertiary"
            />
          </div>
        </div>
      </div>

      {/* Bottom Texts */}
      <div className="border-t border-border pt-5">
        <h3 className="text-sm font-semibold text-text-primary mb-4">Teks Bawah</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-text-secondary mb-1">Teks Bottom</label>
            <input
              type="text"
              value={data.bottomText || ''}
              onChange={(e) => update('bottomText', e.target.value)}
              className="w-full px-3 py-2 bg-background border border-border rounded-lg text-text-primary text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-text-secondary mb-1">Made With Text</label>
            <input
              type="text"
              value={data.madeWithText || ''}
              onChange={(e) => update('madeWithText', e.target.value)}
              className="w-full px-3 py-2 bg-background border border-border rounded-lg text-text-primary text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
            />
          </div>
        </div>
      </div>

      {/* Admin WhatsApp */}
      <div className="border-t border-border pt-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-text-primary">Admin WhatsApp</h3>
          <button
            onClick={addAdminWa}
            className="px-3 py-1.5 bg-primary/10 text-primary border border-primary/20 rounded-lg text-xs font-semibold hover:bg-primary/20 transition-colors flex items-center gap-1"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            Tambah
          </button>
        </div>
        <div className="space-y-2">
          {adminWaEntries.map(([key, value]) => (
            <div key={key} className="flex gap-2 items-center">
              <input
                type="text"
                defaultValue={key}
                onBlur={(e) => updateAdminWa(key, e.target.value, value)}
                placeholder="Nama"
                className="flex-1 px-3 py-2 bg-background border border-border rounded-lg text-text-primary text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
              />
              <input
                type="text"
                value={value}
                onChange={(e) => updateAdminWa(key, key, e.target.value)}
                placeholder="6281234567890"
                className="flex-1 px-3 py-2 bg-background border border-border rounded-lg text-text-primary text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
              />
              <button
                onClick={() => deleteAdminWa(key)}
                className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg transition-colors shrink-0"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
