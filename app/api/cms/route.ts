import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

const ALLOWED_FILES = ['site.json', 'services.json', 'testimonials.json', 'cta.json', 'footer.json']

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
    const filePath = path.join(process.cwd(), 'data', file)
    const content = fs.readFileSync(filePath, 'utf-8')
    return NextResponse.json(JSON.parse(content))
  } catch {
    return NextResponse.json({ error: 'File not found' }, { status: 404 })
  }
}

export async function POST(request: NextRequest) {
  try {
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

    const filePath = path.join(process.cwd(), 'data', file)
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8')

    return NextResponse.json({ success: true, file, message: `${file} saved successfully` })
  } catch {
    return NextResponse.json({ error: 'Failed to save data' }, { status: 500 })
  }
}
