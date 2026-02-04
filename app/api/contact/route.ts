import { NextRequest, NextResponse } from 'next/server'
import { saveContact } from '@/lib/storage'
import { sendContactNotification } from '@/lib/email'
import { sendToGoogleSheets } from '@/lib/googleSheets'
import { rateLimit, getClientIdentifier } from '@/lib/rateLimit'

interface ContactBody {
  name: string
  email: string
  organization?: string
  interestType: string
  message: string
}

function validateEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

const VALID_INTEREST_TYPES = ['investment', 'ownership', 'partnership', 'other']

export async function POST(request: NextRequest) {
  try {
    // Rate limiting - stricter for contact form
    const clientId = getClientIdentifier(request)
    const rateLimitResult = rateLimit(`contact:${clientId}`)
    
    if (!rateLimitResult.success) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { 
          status: 429,
          headers: {
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': String(Math.ceil(rateLimitResult.resetIn / 1000)),
          }
        }
      )
    }

    const body: ContactBody = await request.json()

    // Validate required fields
    if (!body.name?.trim()) {
      return NextResponse.json(
        { error: 'Name is required' },
        { status: 400 }
      )
    }

    if (!body.email?.trim()) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      )
    }

    if (!validateEmail(body.email)) {
      return NextResponse.json(
        { error: 'Please provide a valid email address' },
        { status: 400 }
      )
    }

    if (!body.interestType || !VALID_INTEREST_TYPES.includes(body.interestType)) {
      return NextResponse.json(
        { error: 'Please select a valid interest type' },
        { status: 400 }
      )
    }

    if (!body.message?.trim()) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      )
    }

    if (body.message.trim().length < 20) {
      return NextResponse.json(
        { error: 'Please provide more detail in your message' },
        { status: 400 }
      )
    }

    // Save contact
    const contact = saveContact({
      name: body.name.trim(),
      email: body.email.trim().toLowerCase(),
      organization: body.organization?.trim(),
      interestType: body.interestType,
      message: body.message.trim(),
    })

    // Send to Google Sheets (non-blocking)
    sendToGoogleSheets({
      name: contact.name,
      email: contact.email,
      organization: contact.organization,
      interestType: contact.interestType,
      message: contact.message,
    }, 'contact').catch(console.error)

    // Send email notification (non-blocking)
    sendContactNotification(contact).catch(console.error)

    return NextResponse.json(
      { 
        success: true, 
        message: 'Inquiry submitted successfully',
        id: contact.id 
      },
      { 
        status: 201,
        headers: {
          'X-RateLimit-Remaining': String(rateLimitResult.remaining),
        }
      }
    )
  } catch (error) {
    console.error('Contact error:', error)
    return NextResponse.json(
      { error: 'An unexpected error occurred. Please try again.' },
      { status: 500 }
    )
  }
}
