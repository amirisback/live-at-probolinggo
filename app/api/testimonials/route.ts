import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'
import { exec } from 'child_process'
import { promisify } from 'util'

const execAsync = promisify(exec)

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

    // Read current testimonials
    const jsonPath = path.join(process.cwd(), 'data', 'testimonials.json')
    let testimonials = []
    if (fs.existsSync(jsonPath)) {
      testimonials = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'))
    }

    const newTestimonial = {
      id: Date.now().toString(),
      name,
      role,
      photo: photoUrl,
      content,
      rating: parseInt(rating),
      serviceUsed: serviceUsed || undefined,
    }

    testimonials.unshift(newTestimonial) // Add newest to the top!

    // Save JSON
    fs.writeFileSync(jsonPath, JSON.stringify(testimonials, null, 2), 'utf-8')

    // Run Auto Git Commit (Fire process) only in production
    if (process.env.NODE_ENV !== 'development') {
      try {
        // Add all changes from testimonials component, new pictures and testimonials
        await execAsync(`git add data/testimonials.json public/images/testimonials/`)
        await execAsync(`git commit -m "Auto add testimonial: ${name}"`)

        // Try to push in case there's an upstream master branch
        await execAsync(`git push origin master`).catch(() => console.log('Notice: Push failed or no origin master. Local commit succeeded.'))
      } catch (gitErr) {
        console.error('Git auto-commit process failed/skipped:', gitErr)
        // Not throwing error to user since local save was successful
      }
    } else {
      console.log('Skipping auto git commit since running in development mode.')
    }

    return NextResponse.json({ success: true, testimonial: newTestimonial })

  } catch (err: any) {
    console.error('Testimonial API Error:', err)
    return NextResponse.json({ error: 'Terjadi kesalahan pada internal server.' }, { status: 500 })
  }
}
