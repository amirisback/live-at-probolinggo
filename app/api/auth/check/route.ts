import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const session = request.cookies.get('admin_session')

  if (!session?.value) {
    return NextResponse.json({ authenticated: false }, { status: 401 })
  }

  try {
    const decoded = JSON.parse(Buffer.from(session.value, 'base64').toString())

    // Cek apakah session sudah expired (24 jam)
    const maxAge = 60 * 60 * 24 * 1000
    if (Date.now() - decoded.createdAt > maxAge) {
      const response = NextResponse.json({ authenticated: false, error: 'Session expired' }, { status: 401 })
      response.cookies.set('admin_session', '', { maxAge: 0, path: '/' })
      return response
    }

    return NextResponse.json({
      authenticated: true,
      nama: decoded.nama,
      username: decoded.username,
    })
  } catch {
    return NextResponse.json({ authenticated: false }, { status: 401 })
  }
}
