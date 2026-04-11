'use client'

import { useState, useMemo } from 'react'
import ServiceCard from './ServiceCard'

interface Contact {
  name: string
  phone: string
  address: string
}

interface ServiceCategory {
  id: string
  category: string
  icon: string
  description: string
  contacts: Contact[]
}

interface DataSectionProps {
  services: ServiceCategory[]
}

export default function DataSection({ services }: DataSectionProps) {
  const [activeCategory, setActiveCategory] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set(services.map(s => s.id)))

  const filteredServices = useMemo(() => {
    let result = services

    if (activeCategory !== 'all') {
      result = result.filter((s) => s.id === activeCategory)
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      result = result
        .map((cat) => ({
          ...cat,
          contacts: cat.contacts.filter(
            (c) =>
              c.name.toLowerCase().includes(q) ||
              c.address.toLowerCase().includes(q) ||
              c.phone.includes(q)
          ),
        }))
        .filter((cat) => cat.contacts.length > 0)
    }

    return result
  }, [services, activeCategory, searchQuery])

  const toggleCategory = (id: string) => {
    setExpandedCategories(prev => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }

  const totalContacts = services.reduce((sum, s) => sum + s.contacts.length, 0)

  return (
    <section id="layanan" className="section-padding bg-background">
      <div className="max-w-5xl mx-auto">
        {/* Section header */}
        <div className="text-center mb-10">
          <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold uppercase tracking-wider mb-3">
            Direktori Layanan
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-text-primary">
            Temukan Jasa yang Anda{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-gradient-start to-gradient-end">
              Butuhkan
            </span>
          </h2>
          <p className="mt-3 text-text-secondary max-w-xl mx-auto">
            {totalContacts}+ penyedia layanan terpercaya dari seluruh Probolinggo siap membantu Anda.
          </p>
        </div>

        {/* Search */}
        <div className="relative max-w-md mx-auto mb-8">
          <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-tertiary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            id="service-search"
            type="text"
            placeholder="Cari nama, alamat, atau nomor..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-xl bg-surface border border-border text-text-primary 
                       placeholder:text-text-tertiary focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary
                       transition-all duration-200 text-sm"
          />
        </div>

        {/* Category filter tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          <button
            onClick={() => setActiveCategory('all')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer ${
              activeCategory === 'all'
                ? 'bg-primary text-white shadow-md shadow-primary/25'
                : 'bg-surface border border-border text-text-secondary hover:border-primary/30 hover:text-primary'
            }`}
          >
            Semua
          </button>
          {services.map((s) => (
            <button
              key={s.id}
              onClick={() => setActiveCategory(s.id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer ${
                activeCategory === s.id
                  ? 'bg-primary text-white shadow-md shadow-primary/25'
                  : 'bg-surface border border-border text-text-secondary hover:border-primary/30 hover:text-primary'
              }`}
            >
              {s.icon} {s.category}
            </button>
          ))}
        </div>

        {/* Service list */}
        <div className="space-y-4">
          {filteredServices.map((cat) => (
            <div key={cat.id} className="rounded-2xl bg-surface border border-border shadow-soft overflow-hidden transition-all duration-300">
              {/* Category header (accordion) */}
              <button
                onClick={() => toggleCategory(cat.id)}
                className="w-full flex items-center justify-between p-5 hover:bg-surface-hover transition-colors duration-200 cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{cat.icon}</span>
                  <div className="text-left">
                    <h3 className="font-bold text-text-primary text-base">{cat.category}</h3>
                    <p className="text-xs text-text-tertiary">{cat.description} • {cat.contacts.length} kontak</p>
                  </div>
                </div>
                <svg
                  className={`w-5 h-5 text-text-tertiary transition-transform duration-300 ${
                    expandedCategories.has(cat.id) ? 'rotate-180' : ''
                  }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* Contacts list */}
              {expandedCategories.has(cat.id) && (
                <div className="px-5 pb-5 space-y-2">
                  {cat.contacts.map((contact, i) => (
                    <ServiceCard key={i} {...contact} />
                  ))}
                </div>
              )}
            </div>
          ))}

          {filteredServices.length === 0 && (
            <div className="text-center py-12">
              <p className="text-text-tertiary text-lg">Tidak ditemukan layanan yang cocok.</p>
              <button
                onClick={() => { setSearchQuery(''); setActiveCategory('all'); }}
                className="mt-3 text-primary font-medium hover:underline cursor-pointer"
              >
                Reset pencarian
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
