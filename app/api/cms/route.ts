import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'
import { getSupabase } from '@/lib/supabase'

const FILE_BASED = ['site.json', 'cta.json', 'footer.json']
const SUPABASE_BASED = ['services.json', 'testimonials.json']
const ALLOWED_FILES = [...FILE_BASED, ...SUPABASE_BASED]

/**
 * Helper: fetch services from Supabase in the old JSON format
 */
async function getServicesFromSupabase() {
  const supabase = getSupabase()

  const { data: categories } = await supabase
    .from('service_categories')
    .select('id, category, icon, description')
    .order('created_at', { ascending: true })

  const { data: contacts } = await supabase
    .from('service_contacts')
    .select('id, category_id, name, phone, address')
    .order('created_at', { ascending: true })

  return (categories || []).map((cat: any) => ({
    id: cat.id,
    category: cat.category,
    icon: cat.icon,
    description: cat.description,
    contacts: (contacts || [])
      .filter((c: any) => c.category_id === cat.id)
      .map((c: any) => ({ name: c.name, phone: c.phone, address: c.address })),
  }))
}

/**
 * Helper: fetch testimonials from Supabase in the old JSON format
 */
async function getTestimonialsFromSupabase() {
  const supabase = getSupabase()

  const { data: testimonials } = await supabase
    .from('testimonials')
    .select('*')
    .order('created_at', { ascending: false })

  return (testimonials || []).map((t: any) => ({
    id: t.id.toString(),
    name: t.name,
    role: t.role,
    photo: t.photo,
    content: t.content,
    rating: t.rating,
    ...(t.service_used && { serviceUsed: t.service_used }),
  }))
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const file = searchParams.get('file')

  if (!file || !ALLOWED_FILES.includes(file)) {
    return NextResponse.json(
      { error: 'Invalid file. Allowed: ' + ALLOWED_FILES.join(', ') },
      { status: 400 }
    )
  }

  try {
    // Supabase-backed data
    if (file === 'services.json') {
      const services = await getServicesFromSupabase()
      return NextResponse.json(services)
    }

    if (file === 'testimonials.json') {
      const testimonials = await getTestimonialsFromSupabase()
      return NextResponse.json(testimonials)
    }

    // File-based data
    const filePath = path.join(process.cwd(), 'data', file)
    const content = fs.readFileSync(filePath, 'utf-8')
    return NextResponse.json(JSON.parse(content))
  } catch {
    return NextResponse.json({ error: 'Data not found' }, { status: 404 })
  }
}

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = request.cookies.get('admin_session')
    if (!session?.value) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    try {
      const decoded = JSON.parse(Buffer.from(session.value, 'base64').toString())
      const maxAge = 60 * 60 * 24 * 1000
      if (Date.now() - decoded.createdAt > maxAge) {
        return NextResponse.json({ error: 'Session expired' }, { status: 401 })
      }
    } catch {
      return NextResponse.json({ error: 'Invalid session' }, { status: 401 })
    }

    const body = await request.json()
    const { file, data } = body

    if (!file || !data) {
      return NextResponse.json(
        { error: 'Missing "file" or "data" in request body' },
        { status: 400 }
      )
    }

    if (!ALLOWED_FILES.includes(file)) {
      return NextResponse.json(
        { error: 'Invalid file. Allowed: ' + ALLOWED_FILES.join(', ') },
        { status: 400 }
      )
    }

    // Supabase-backed saves
    if (file === 'services.json') {
      await syncServicesToSupabase(data)
      return NextResponse.json({ success: true, file, message: 'Services saved to Supabase successfully' })
    }

    if (file === 'testimonials.json') {
      await syncTestimonialsToSupabase(data)
      return NextResponse.json({ success: true, file, message: 'Testimonials saved to Supabase successfully' })
    }

    // File-based saves
    const filePath = path.join(process.cwd(), 'data', file)
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8')

    return NextResponse.json({ success: true, file, message: `${file} saved successfully` })
  } catch (err: any) {
    console.error('CMS POST error:', err)
    return NextResponse.json({ error: 'Failed to save data: ' + (err?.message || '') }, { status: 500 })
  }
}

/**
 * Sync the full services array (old JSON format) to Supabase.
 * Strategy: delete all existing data and re-insert to match the admin's edits.
 */
async function syncServicesToSupabase(data: any[]) {
  const supabase = getSupabase()

  // Delete all contacts first (FK cascade), then categories
  await supabase.from('service_contacts').delete().neq('id', 0)
  await supabase.from('service_categories').delete().neq('id', '')

  for (const cat of data) {
    const categoryId = cat.id || cat.category.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-')

    await supabase.from('service_categories').insert({
      id: categoryId,
      category: cat.category,
      icon: cat.icon || '💼',
      description: cat.description || '',
    })

    if (Array.isArray(cat.contacts) && cat.contacts.length > 0) {
      const contactRows = cat.contacts.map((c: any) => ({
        category_id: categoryId,
        name: c.name,
        phone: c.phone,
        address: c.address,
      }))
      await supabase.from('service_contacts').insert(contactRows)
    }
  }
}

/**
 * Sync the full testimonials array (old JSON format) to Supabase.
 * Strategy: delete all existing data and re-insert.
 */
async function syncTestimonialsToSupabase(data: any[]) {
  const supabase = getSupabase()

  // Delete all existing testimonials
  await supabase.from('testimonials').delete().neq('id', 0)

  if (data.length > 0) {
    const rows = data.map((t: any) => ({
      name: t.name,
      role: t.role,
      photo: t.photo || '/images/testimonials/placeholder.png',
      content: t.content,
      rating: t.rating || 5,
      service_used: t.serviceUsed || t.service_used || null,
    }))
    await supabase.from('testimonials').insert(rows)
  }
}
