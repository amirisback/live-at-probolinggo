'use client'

interface SiteData {
  siteName: string
  tagline: string
  heroYoutubeId: string
  heroOverlayOpacity: number
  heroSubtitle: string
  seoDescription: string
  seoKeywords: string
}

interface SiteEditorProps {
  data: SiteData
  onChange: (data: SiteData) => void
}

export default function SiteEditor({ data, onChange }: SiteEditorProps) {
  const update = (field: keyof SiteData, value: string | number) => {
    onChange({ ...data, [field]: value })
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label className="block text-sm font-medium text-text-primary mb-1.5">Nama Website</label>
          <input
            type="text"
            value={data.siteName || ''}
            onChange={(e) => update('siteName', e.target.value)}
            className="w-full px-4 py-2.5 bg-background border border-border rounded-xl text-text-primary text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-text-primary mb-1.5">Tagline</label>
          <input
            type="text"
            value={data.tagline || ''}
            onChange={(e) => update('tagline', e.target.value)}
            className="w-full px-4 py-2.5 bg-background border border-border rounded-xl text-text-primary text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-text-primary mb-1.5">Subtitle Hero</label>
        <textarea
          value={data.heroSubtitle || ''}
          onChange={(e) => update('heroSubtitle', e.target.value)}
          rows={2}
          className="w-full px-4 py-2.5 bg-background border border-border rounded-xl text-text-primary text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all resize-y"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label className="block text-sm font-medium text-text-primary mb-1.5">YouTube Video ID</label>
          <input
            type="text"
            value={data.heroYoutubeId || ''}
            onChange={(e) => update('heroYoutubeId', e.target.value)}
            placeholder="contoh: w2JOG9mbCiI"
            className="w-full px-4 py-2.5 bg-background border border-border rounded-xl text-text-primary text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all placeholder:text-text-tertiary"
          />
          <p className="text-xs text-text-tertiary mt-1">ID dari URL YouTube (bagian setelah v=)</p>
        </div>
        <div>
          <label className="block text-sm font-medium text-text-primary mb-1.5">
            Opacity Overlay: <span className="text-primary font-bold">{data.heroOverlayOpacity ?? 0.65}</span>
          </label>
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={data.heroOverlayOpacity ?? 0.65}
            onChange={(e) => update('heroOverlayOpacity', parseFloat(e.target.value))}
            className="w-full mt-2 accent-primary"
          />
          <div className="flex justify-between text-xs text-text-tertiary mt-1">
            <span>Terang (0)</span>
            <span>Gelap (1)</span>
          </div>
        </div>
      </div>

      <div className="border-t border-border pt-5">
        <h3 className="text-sm font-semibold text-text-primary mb-4 flex items-center gap-2">
          <svg className="w-4 h-4 text-text-tertiary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          SEO (Search Engine Optimization)
        </h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-text-primary mb-1.5">Deskripsi SEO</label>
            <textarea
              value={data.seoDescription || ''}
              onChange={(e) => update('seoDescription', e.target.value)}
              rows={2}
              className="w-full px-4 py-2.5 bg-background border border-border rounded-xl text-text-primary text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all resize-y"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-text-primary mb-1.5">Keywords SEO</label>
            <input
              type="text"
              value={data.seoKeywords || ''}
              onChange={(e) => update('seoKeywords', e.target.value)}
              placeholder="pisahkan dengan koma"
              className="w-full px-4 py-2.5 bg-background border border-border rounded-xl text-text-primary text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all placeholder:text-text-tertiary"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
