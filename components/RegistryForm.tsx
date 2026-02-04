'use client'

import { useEffect, useMemo, useState, FormEvent } from 'react'

const PUBLIC_SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || '').replace(/\/+$/, '')

interface FormData {
  fullName: string
  email: string
  zipCode: string
  role: string
  businessName: string
  youthClub: string
  interestedInTickets: string
  interestedInPartnership: string
  comment: string
  // Honeypot field
  website: string
}

interface FormErrors {
  fullName?: string
  email?: string
  zipCode?: string
  role?: string
  businessName?: string
}

const ROLES = [
  { value: '', label: 'Select your role' },
  { value: 'parent', label: 'Parent' },
  { value: 'player', label: 'Player' },
  { value: 'coach', label: 'Coach' },
  { value: 'fan', label: 'Fan' },
  { value: 'business_owner', label: 'Business Owner' },
  { value: 'other', label: 'Other' },
]

export default function RegistryForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [currentUrl, setCurrentUrl] = useState('')
  const [copied, setCopied] = useState(false)
  const [shareSupported, setShareSupported] = useState(false)
  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    email: '',
    zipCode: '',
    role: '',
    businessName: '',
    youthClub: '',
    interestedInTickets: '',
    interestedInPartnership: '',
    comment: '',
    website: '', // Honeypot
  })
  const [errors, setErrors] = useState<FormErrors>({})

  useEffect(() => {
    setShareSupported(typeof navigator !== 'undefined' && typeof navigator.share === 'function')
    // Prefer canonical public URL when configured (e.g. https://mlstovegas.com)
    if (PUBLIC_SITE_URL) {
      setCurrentUrl(`${PUBLIC_SITE_URL}/`)
      return
    }
    setCurrentUrl(typeof window !== 'undefined' ? window.location.href : '')
  }, [])

  const shareText = useMemo(() => {
    const url = currentUrl || (typeof window !== 'undefined' ? window.location.href : '')
    return `Help bring MLS to Vegas — add your name to the registry here: ${url}`
  }, [currentUrl])

  const smsHref = useMemo(() => `sms:?&body=${encodeURIComponent(shareText)}`, [shareText])
  const whatsappHref = useMemo(
    () => `https://wa.me/?text=${encodeURIComponent(shareText)}`,
    [shareText]
  )
  const twitterHref = useMemo(
    () => `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`,
    [shareText]
  )
  const facebookHref = useMemo(() => {
    const url = currentUrl || (typeof window !== 'undefined' ? window.location.href : '')
    return `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`
  }, [currentUrl])

  const handleCopyLink = async () => {
    const url = currentUrl || (typeof window !== 'undefined' ? window.location.href : '')
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // no-op
    }
  }

  const handleNativeShare = async () => {
    if (!shareSupported) return
    const url = currentUrl || (typeof window !== 'undefined' ? window.location.href : '')
    try {
      await navigator.share({ text: shareText, url })
    } catch {
      // user canceled or share failed; no-op
    }
  }

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required'
    } else if (formData.fullName.trim().length < 2) {
      newErrors.fullName = 'Please enter a valid name'
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address'
    }

    if (!formData.zipCode.trim()) {
      newErrors.zipCode = 'Zip code is required'
    } else if (!/^\d{5}(-\d{4})?$/.test(formData.zipCode)) {
      newErrors.zipCode = 'Please enter a valid zip code'
    }

    if (!formData.role) {
      newErrors.role = 'Please select a role'
    }

    if (formData.role === 'business_owner' && !formData.businessName.trim()) {
      newErrors.businessName = 'Business name is required'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    // Clear error when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }))
    }
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setSubmitError(null)
    setIsSubmitted(false)

    // Honeypot check - if website field is filled, it's a bot
    if (formData.website) {
      // Silently succeed
      setIsSubmitted(true)
      return
    }

    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)

    try {
      const response = await fetch('/api/registrations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          full_name: formData.fullName,
          email: formData.email,
          zip_code: formData.zipCode,
          role: formData.role,
          business_name: formData.businessName,
          youth_club: formData.youthClub,
          interested_in_tickets: formData.interestedInTickets,
          interested_in_partnership: formData.interestedInPartnership,
          comment: formData.comment,
          support_reason: formData.comment,
          submission_type: 'community_registry',
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Something went wrong')
      }

      setIsSubmitted(true)
      if (typeof window !== 'undefined') {
        window.dispatchEvent(
          new CustomEvent('mls2vegas:registrations:updated', {
            detail: { role: formData.role, submission_type: 'community_registry' },
          })
        )
      }
      // Keep the share URL stable/canonical when env is present
      setCurrentUrl(PUBLIC_SITE_URL ? `${PUBLIC_SITE_URL}/` : (typeof window !== 'undefined' ? window.location.href : currentUrl))
      setFormData({
        fullName: '',
        email: '',
        zipCode: '',
        role: '',
        businessName: '',
        youthClub: '',
        interestedInTickets: '',
        interestedInPartnership: '',
        comment: '',
        website: '',
      })
      setErrors({})
    } catch (error) {
      setSubmitError(
        error instanceof Error ? error.message : 'Failed to submit. Please try again.'
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section id="registry-form" className="py-24 md:py-32">
      <div className="container-narrow">
        <div className="text-center">
          <h2 className="section-title">Join the MLS Pathway Registry</h2>
          <p className="section-subtitle mx-auto mt-4">
            Add your name to the official community record supporting MLS-aligned development in Las Vegas.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-12 space-y-6">
          {/* Honeypot field - hidden from real users */}
          <div className="absolute -left-[9999px]" aria-hidden="true">
            <label htmlFor="website">Website</label>
            <input
              type="text"
              id="website"
              name="website"
              value={formData.website}
              onChange={handleChange}
              tabIndex={-1}
              autoComplete="off"
            />
          </div>

          {/* Required Fields */}
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <label htmlFor="fullName" className="label">
                Full Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                className={`input-field ${errors.fullName ? 'border-red-500' : ''}`}
                placeholder="John Smith"
                aria-describedby={errors.fullName ? 'fullName-error' : undefined}
              />
              {errors.fullName && (
                <p id="fullName-error" className="mt-1 text-sm text-red-500">
                  {errors.fullName}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="email" className="label">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`input-field ${errors.email ? 'border-red-500' : ''}`}
                placeholder="john@example.com"
                aria-describedby={errors.email ? 'email-error' : undefined}
              />
              {errors.email && (
                <p id="email-error" className="mt-1 text-sm text-red-500">
                  {errors.email}
                </p>
              )}
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <label htmlFor="zipCode" className="label">
                Zip Code <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="zipCode"
                name="zipCode"
                value={formData.zipCode}
                onChange={handleChange}
                className={`input-field ${errors.zipCode ? 'border-red-500' : ''}`}
                placeholder="89101"
                maxLength={10}
                aria-describedby={errors.zipCode ? 'zipCode-error' : undefined}
              />
              {errors.zipCode && (
                <p id="zipCode-error" className="mt-1 text-sm text-red-500">
                  {errors.zipCode}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="role" className="label">
                Role <span className="text-red-500">*</span>
              </label>
              <select
                id="role"
                name="role"
                value={formData.role}
                onChange={handleChange}
                className={`select-field ${errors.role ? 'border-red-500' : ''}`}
                aria-describedby={errors.role ? 'role-error' : undefined}
              >
                {ROLES.map((role) => (
                  <option key={role.value} value={role.value}>
                    {role.label}
                  </option>
                ))}
              </select>
              {errors.role && (
                <p id="role-error" className="mt-1 text-sm text-red-500">
                  {errors.role}
                </p>
              )}
            </div>
          </div>

          {/* Conditional Field: Business Name */}
          {formData.role === 'business_owner' && (
            <div>
              <label htmlFor="businessName" className="label">
                Business Name
              </label>
              <input
                type="text"
                id="businessName"
                name="businessName"
                value={formData.businessName}
                onChange={handleChange}
                className={`input-field ${errors.businessName ? 'border-red-500' : ''}`}
                placeholder="Enter your business name"
                aria-describedby={errors.businessName ? 'businessName-error' : undefined}
              />
              {errors.businessName && (
                <p id="businessName-error" className="mt-1 text-sm text-red-500">
                  {errors.businessName}
                </p>
              )}
            </div>
          )}

          {/* Optional Fields */}
          <div className="border-t border-primary-100 pt-6">
            <p className="mb-4 text-sm text-primary-500">Optional Information</p>

            <div className="space-y-6">
              <div>
                <label htmlFor="youthClub" className="label">
                  Youth Club / Program
                </label>
                <input
                  type="text"
                  id="youthClub"
                  name="youthClub"
                  value={formData.youthClub}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="Las Vegas Soccer Academy"
                />
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <label htmlFor="interestedInTickets" className="label">
                    Interested in season tickets?
                  </label>
                  <select
                    id="interestedInTickets"
                    name="interestedInTickets"
                    value={formData.interestedInTickets}
                    onChange={handleChange}
                    className="select-field"
                  >
                    <option value="">Select</option>
                    <option value="yes">Yes</option>
                    <option value="no">No</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="interestedInPartnership" className="label">
                    Interested in business partnership?
                  </label>
                  <select
                    id="interestedInPartnership"
                    name="interestedInPartnership"
                    value={formData.interestedInPartnership}
                    onChange={handleChange}
                    className="select-field"
                  >
                    <option value="">Select</option>
                    <option value="yes">Yes</option>
                    <option value="no">No</option>
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="comment" className="label">
                  Why do you support this initiative? (Optional)
                </label>
                <textarea
                  id="comment"
                  name="comment"
                  value={formData.comment}
                  onChange={handleChange}
                  rows={3}
                  className="input-field resize-none"
                  placeholder="Share your thoughts..."
                />
              </div>
            </div>
          </div>

          {isSubmitted && (
            <div className="rounded-sm border border-green-200 bg-green-50 p-6 text-green-900">
              <div className="flex items-start gap-3">
                <div className="mt-0.5 flex h-8 w-8 items-center justify-center rounded-full bg-green-100">
                  <svg
                    className="h-5 w-5 text-green-700"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold">Thank you.</p>
                  <p className="mt-1 text-sm text-green-800">
                    Your support has been recorded. Help grow the registry by sharing this link.
                  </p>
                </div>
              </div>

              {/* Instagram CTA */}
              <div className="mt-5">
                <a
                  href="https://www.instagram.com/mls2vegas"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-secondary w-full text-center"
                >
                  Follow @mls2vegas on Instagram
                </a>
              </div>

              {/* Share link */}
              <div className="mt-6">
                <p className="text-xs font-medium text-green-900">Share this with a friend</p>
                <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center">
                  <input
                    className="input-field text-sm"
                    value={currentUrl || (typeof window !== 'undefined' ? window.location.href : '')}
                    readOnly
                    aria-label="Public registry link"
                  />
                  <button
                    type="button"
                    onClick={handleCopyLink}
                    className="btn-secondary whitespace-nowrap"
                  >
                    {copied ? 'Copied!' : 'Copy link'}
                  </button>
                </div>
              </div>

              {/* Share actions */}
              <div className="mt-6">
                <p className="text-xs font-medium text-green-900">One-tap share</p>

                {shareSupported && (
                  <div className="mt-3">
                    <button type="button" onClick={handleNativeShare} className="btn-secondary w-full">
                      Share
                    </button>
                  </div>
                )}

                <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <a href={smsHref} className="btn-secondary text-center" aria-label="Share via SMS">
                    SMS
                  </a>
                  <a
                    href={whatsappHref}
                    className="btn-secondary text-center"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Share via WhatsApp"
                  >
                    WhatsApp
                  </a>
                  <a
                    href={twitterHref}
                    className="btn-secondary text-center"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Share on X"
                  >
                    X / Twitter
                  </a>
                  <a
                    href={facebookHref}
                    className="btn-secondary text-center"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Share on Facebook"
                  >
                    Facebook
                  </a>
                </div>
              </div>
            </div>
          )}

          {/* Submit Error */}
          {submitError && (
            <div className="rounded-sm bg-red-50 p-4 text-sm text-red-600">
              {submitError}
            </div>
          )}

          {/* Submit Button */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-primary w-full disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <svg className="h-5 w-5 animate-spin" viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Submitting...
                </span>
              ) : (
                'Submit My Support'
              )}
            </button>
            
            <p className="mt-3 text-center text-xs text-primary-400">
              By submitting, you acknowledge this initiative does not guarantee league approval or franchise placement.
            </p>
          </div>

          <p className="text-center text-xs text-primary-400">
            Your information is used solely for market validation and will not be shared with third parties.
          </p>
        </form>
      </div>
    </section>
  )
}
