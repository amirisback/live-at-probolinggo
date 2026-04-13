import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'
import { exec } from 'child_process'
import { promisify } from 'util'

const execAsync = promisify(exec)

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

    const filePath = path.join(process.cwd(), 'data', file)
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8')

    if (process.env.NODE_ENV !== 'development') {
      try {
        await execAsync(`git add data/${file}`)
        await execAsync(`git commit -m "CMS Update: ${file}"`)
        await execAsync(`git push origin master`).catch(() => console.log('Notice: Push failed or no origin master. Local commit succeeded.'))
      } catch (gitErr) {
        console.error('Git auto-commit process failed/skipped:', gitErr)
      }
    }

    return NextResponse.json({ success: true, file, message: `${file} saved successfully` })
  } catch {
    return NextResponse.json({ error: 'Failed to save data' }, { status: 500 })
  }
}
