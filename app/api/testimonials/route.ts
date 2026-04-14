import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'
import { getSupabase } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const name = formData.get('name') as string
    const role = formData.get('role') as string
    const rating = formData.get('rating') as string
    const content = formData.get('content') as string
    const serviceUsed = formData.get('serviceUsed') as string
    const photoFile = formData.get('photo') as File | null

    if (!name || !role || !rating || !content) {
      return NextResponse.json({ error: 'Semua form berlabel bintang merah wajib diisi!' }, { status: 400 })
    }

    let photoUrl = ''

    if (photoFile && photoFile.size > 0) {
      // Create images/testimonials directory if it doesn't exist
      const dirPath = path.join(process.cwd(), 'public', 'images', 'testimonials')
      if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true })
      }

      // Save file locally with unique timestamp filename
      const ext = photoFile.name.split('.').pop() || 'jpg'
      const fileName = `client_${Date.now()}_${Math.floor(Math.random() * 1000)}.${ext}`
      const filePath = path.join(dirPath, fileName)

      const buffer = Buffer.from(await photoFile.arrayBuffer())
      fs.writeFileSync(filePath, buffer)
      photoUrl = `/images/testimonials/${fileName}`
    } else {
      // Use fallback local placeholder image
      photoUrl = `/images/testimonials/placeholder.png`
    }

    const parsedRating = parseInt(rating)

    const supabase = getSupabase()

    const newTestimonial: Record<string, any> = {
      name,
      role,
      photo: photoUrl,
      content,
      rating: isNaN(parsedRating) ? 5 : parsedRating,
    }

    if (serviceUsed) {
      newTestimonial.service_used = serviceUsed
    }

    const { data: inserted, error } = await supabase
      .from('testimonials')
      .insert(newTestimonial)
      .select()
      .single()

    if (error) {
      console.error('Supabase insert error:', error)
      return NextResponse.json({ error: 'Gagal menyimpan testimoni: ' + error.message }, { status: 500 })
    }

    // Map back to the format the frontend expects
    const responseTestimonial = {
      id: inserted.id.toString(),
      name: inserted.name,
      role: inserted.role,
      photo: inserted.photo,
      content: inserted.content,
      rating: inserted.rating,
      ...(inserted.service_used && { serviceUsed: inserted.service_used }),
    }

    return NextResponse.json({ success: true, testimonial: responseTestimonial })

  } catch (err: any) {
    console.error('Testimonial API Error:', err)
    return NextResponse.json({ error: 'Terjadi kesalahan pada internal server.' }, { status: 500 })
  }
}
