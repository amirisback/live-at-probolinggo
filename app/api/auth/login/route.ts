import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'
import crypto from 'crypto'

interface Admin {
  id: string
  username: string
  password: string
  nama: string
}

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json()

    if (!username || !password) {
      return NextResponse.json(
        { error: 'Username dan password wajib diisi' },
        { status: 400 }
      )
    }

    const filePath = path.join(process.cwd(), 'data', 'admins.json')
    const content = fs.readFileSync(filePath, 'utf-8')
    const admins: Admin[] = JSON.parse(content)

    const hashedPassword = crypto.createHash('sha256').update(password).digest('hex')

    const admin = admins.find(
      (a) => a.username === username && a.password === hashedPassword
    )

    if (!admin) {
      return NextResponse.json(
        { error: 'Username atau password salah' },
        { status: 401 }
      )
    }

    // Buat session token sederhana
    const sessionToken = crypto.randomBytes(32).toString('hex')
    const sessionData = JSON.stringify({
      id: admin.id,
      username: admin.username,
      nama: admin.nama,
      token: sessionToken,
      createdAt: Date.now(),
    })

    const encodedSession = Buffer.from(sessionData).toString('base64')

    const response = NextResponse.json({
      success: true,
      nama: admin.nama,
    })

    response.cookies.set('admin_session', encodedSession, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24, // 24 jam
    })

    return response
  } catch {
    return NextResponse.json(
      { error: 'Terjadi kesalahan server' },
      { status: 500 }
    )
  }
}
