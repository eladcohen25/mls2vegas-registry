import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  const adminPassword = process.env.ADMIN_PASSWORD
  if (!adminPassword) {
    return NextResponse.json({ error: 'Server misconfigured' }, { status: 500 })
  }

  let password = ''
  const contentType = request.headers.get('content-type') || ''

  if (contentType.includes('application/json')) {
    const body = (await request.json()) as { password?: string }
    password = body.password || ''
  } else {
    const form = await request.formData()
    password = String(form.get('password') || '')
  }

  if (password !== adminPassword) {
    return NextResponse.json({ error: 'Invalid password' }, { status: 401 })
  }

  const response = contentType.includes('application/json')
    ? NextResponse.json({ success: true })
    : NextResponse.redirect(new URL('/admin/submissions', request.url))

  response.cookies.set('admin_auth', '1', {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
  })

  return response
}

