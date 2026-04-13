'use client'

import { useState } from 'react'

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

interface ServicesEditorProps {
  data: ServiceCategory[]
  onChange: (data: ServiceCategory[]) => void
}

export default function ServicesEditor({ data, onChange }: ServicesEditorProps) {
  const [expandedCat, setExpandedCat] = useState<string | null>(null)
  const [editingContact, setEditingContact] = useState<{ catIdx: number; contactIdx: number } | null>(null)

  const categories = Array.isArray(data) ? data : []

  const updateCategory = (idx: number, field: keyof ServiceCategory, value: string) => {
    const updated = [...categories]
    updated[idx] = { ...updated[idx], [field]: value }
    if (field === 'category') {
      updated[idx].id = value.toLowerCase().replace(/[^a-z0-9]+/g, '-')
    }
    onChange(updated)
  }

  const addCategory = () => {
    const uniqueId = `kategori-baru-${Date.now()}`
    const newCat: ServiceCategory = {
      id: uniqueId,
      category: 'Kategori Baru',
      icon: '✨',
      description: 'Deskripsi kategori',
      contacts: [],
    }
    onChange([...categories, newCat])
    setExpandedCat(uniqueId)
  }

  const deleteCategory = (idx: number) => {
    const updated = categories.filter((_, i) => i !== idx)
    onChange(updated)
    setExpandedCat(null)
  }

  const addContact = (catIdx: number) => {
    const updated = [...categories]
    updated[catIdx] = {
      ...updated[catIdx],
      contacts: [...updated[catIdx].contacts, { name: '', phone: '', address: '' }],
    }
    onChange(updated)
    setEditingContact({ catIdx, contactIdx: updated[catIdx].contacts.length - 1 })
  }

  const updateContact = (catIdx: number, contactIdx: number, field: keyof Contact, value: string) => {
    const updated = [...categories]
    const contacts = [...updated[catIdx].contacts]
    contacts[contactIdx] = { ...contacts[contactIdx], [field]: value }
    updated[catIdx] = { ...updated[catIdx], contacts }
    onChange(updated)
  }

  const deleteContact = (catIdx: number, contactIdx: number) => {
    const updated = [...categories]
    updated[catIdx] = {
      ...updated[catIdx],
      contacts: updated[catIdx].contacts.filter((_, i) => i !== contactIdx),
    }
    onChange(updated)
    setEditingContact(null)
  }

  return (
    <div className="space-y-4">
      {/* Stats */}
      <div className="flex items-center gap-4 text-sm text-text-secondary bg-background/50 px-4 py-3 rounded-xl border border-border">
        <span><strong className="text-text-primary">{categories.length}</strong> kategori</span>
        <span className="text-border">|</span>
        <span><strong className="text-text-primary">{categories.reduce((s, c) => s + c.contacts.length, 0)}</strong> kontak</span>
      </div>

      {/* Category List */}
      {categories.map((cat, catIdx) => (
        <div key={cat.id + catIdx} className="rounded-xl border border-border bg-surface overflow-hidden">
          {/* Category Header */}
          <div
            className="flex items-center justify-between p-4 cursor-pointer hover:bg-surface-hover transition-colors"
            onClick={() => setExpandedCat(expandedCat === cat.id ? null : cat.id)}
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl">{cat.icon}</span>
              <div>
                <h4 className="font-semibold text-text-primary text-sm">{cat.category}</h4>
                <p className="text-xs text-text-tertiary">{cat.description} — {cat.contacts.length} kontak</p>
              </div>
            </div>
            <svg
              className={`w-5 h-5 text-text-tertiary transition-transform duration-200 ${expandedCat === cat.id ? 'rotate-180' : ''}`}
              fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </div>

          {/* Expanded Content */}
          {expandedCat === cat.id && (
            <div className="border-t border-border p-4 space-y-4">
              {/* Edit Category Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                <div>
                  <label className="block text-xs font-medium text-text-secondary mb-1">Icon</label>
                  <input
                    type="text"
                    value={cat.icon}
                    onChange={(e) => updateCategory(catIdx, 'icon', e.target.value)}
                    className="w-full px-3 py-2 bg-background border border-border rounded-lg text-text-primary text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-medium text-text-secondary mb-1">Nama Kategori</label>
                  <input
                    type="text"
                    value={cat.category}
                    onChange={(e) => updateCategory(catIdx, 'category', e.target.value)}
                    className="w-full px-3 py-2 bg-background border border-border rounded-lg text-text-primary text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                  />
                </div>
                <div className="flex items-end">
                  <button
                    onClick={() => deleteCategory(catIdx)}
                    className="w-full px-3 py-2 bg-red-500/10 text-red-500 border border-red-500/20 rounded-lg text-sm font-medium hover:bg-red-500/20 transition-colors"
                  >
                    Hapus Kategori
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-text-secondary mb-1">Deskripsi</label>
                <input
                  type="text"
                  value={cat.description}
                  onChange={(e) => updateCategory(catIdx, 'description', e.target.value)}
                  className="w-full px-3 py-2 bg-background border border-border rounded-lg text-text-primary text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                />
              </div>

              {/* Contacts */}
              <div className="border-t border-border/50 pt-4">
                <div className="flex items-center justify-between mb-3">
                  <h5 className="text-sm font-semibold text-text-primary">Daftar Kontak ({cat.contacts.length})</h5>
                  <button
                    onClick={() => addContact(catIdx)}
                    className="px-3 py-1.5 bg-primary/10 text-primary border border-primary/20 rounded-lg text-xs font-semibold hover:bg-primary/20 transition-colors flex items-center gap-1"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                    </svg>
                    Tambah Kontak
                  </button>
                </div>

                {cat.contacts.length === 0 && (
                  <p className="text-sm text-text-tertiary text-center py-4">Belum ada kontak di kategori ini.</p>
                )}

                <div className="space-y-2">
                  {cat.contacts.map((contact, contactIdx) => {
                    const isEditing = editingContact?.catIdx === catIdx && editingContact?.contactIdx === contactIdx
                    return (
                      <div key={contactIdx} className="rounded-lg border border-border/50 bg-background/50 p-3">
                        {isEditing ? (
                          <div className="space-y-2">
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                              <input
                                type="text"
                                value={contact.name}
                                onChange={(e) => updateContact(catIdx, contactIdx, 'name', e.target.value)}
                                placeholder="Nama"
                                className="px-3 py-2 bg-background border border-border rounded-lg text-text-primary text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                              />
                              <input
                                type="text"
                                value={contact.phone}
                                onChange={(e) => updateContact(catIdx, contactIdx, 'phone', e.target.value)}
                                placeholder="Nomor WhatsApp"
                                className="px-3 py-2 bg-background border border-border rounded-lg text-text-primary text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                              />
                              <input
                                type="text"
                                value={contact.address}
                                onChange={(e) => updateContact(catIdx, contactIdx, 'address', e.target.value)}
                                placeholder="Alamat"
                                className="px-3 py-2 bg-background border border-border rounded-lg text-text-primary text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                              />
                            </div>
                            <div className="flex gap-2 justify-end">
                              <button
                                onClick={() => deleteContact(catIdx, contactIdx)}
                                className="px-3 py-1.5 text-red-500 text-xs font-medium hover:bg-red-500/10 rounded-lg transition-colors"
                              >
                                Hapus
                              </button>
                              <button
                                onClick={() => setEditingContact(null)}
                                className="px-3 py-1.5 bg-primary/10 text-primary text-xs font-semibold rounded-lg hover:bg-primary/20 transition-colors"
                              >
                                Selesai
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div
                            className="flex items-center justify-between cursor-pointer"
                            onClick={() => setEditingContact({ catIdx, contactIdx })}
                          >
                            <div className="flex items-center gap-3 min-w-0">
                              <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold shrink-0">
                                {contact.name?.charAt(0)?.toUpperCase() || '?'}
                              </div>
                              <div className="min-w-0">
                                <p className="text-sm font-medium text-text-primary truncate">{contact.name || 'Tanpa nama'}</p>
                                <p className="text-xs text-text-tertiary truncate">{contact.phone || 'Tanpa nomor'} — {contact.address || 'Tanpa alamat'}</p>
                              </div>
                            </div>
                            <svg className="w-4 h-4 text-text-tertiary shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                            </svg>
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          )}
        </div>
      ))}

      {/* Add Category Button */}
      <button
        onClick={addCategory}
        className="w-full py-3 border-2 border-dashed border-border rounded-xl text-text-secondary text-sm font-medium hover:border-primary hover:text-primary hover:bg-primary/5 transition-all flex items-center justify-center gap-2"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
        </svg>
        Tambah Kategori Baru
      </button>
    </div>
  )
}
