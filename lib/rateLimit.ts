interface RateLimitStore {
  [key: string]: {
    count: number
    resetTime: number
  }
}

const store: RateLimitStore = {}

const WINDOW_MS = parseInt(process.env.RATE_LIMIT_WINDOW_MS || '60000') // 1 minute
const MAX_REQUESTS = parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '5')

export function rateLimit(identifier: string): { success: boolean; remaining: number; resetIn: number } {
  const now = Date.now()
  const record = store[identifier]

  // Clean up old records
  if (record && now > record.resetTime) {
    delete store[identifier]
  }

  // Check if identifier exists in store
  if (!store[identifier]) {
    store[identifier] = {
      count: 1,
      resetTime: now + WINDOW_MS,
    }
    return { success: true, remaining: MAX_REQUESTS - 1, resetIn: WINDOW_MS }
  }

  // Increment count
  store[identifier].count++

  if (store[identifier].count > MAX_REQUESTS) {
    const resetIn = store[identifier].resetTime - now
    return { success: false, remaining: 0, resetIn }
  }

  return {
    success: true,
    remaining: MAX_REQUESTS - store[identifier].count,
    resetIn: store[identifier].resetTime - now,
  }
}

export function getClientIdentifier(request: Request): string {
  // Try to get the real IP from various headers
  const forwardedFor = request.headers.get('x-forwarded-for')
  const realIp = request.headers.get('x-real-ip')
  
  if (forwardedFor) {
    return forwardedFor.split(',')[0].trim()
  }
  
  if (realIp) {
    return realIp
  }
  
  // Fallback to a hash of user-agent + some header info
  const userAgent = request.headers.get('user-agent') || 'unknown'
  const acceptLanguage = request.headers.get('accept-language') || 'unknown'
  
  return `${userAgent}-${acceptLanguage}`.slice(0, 100)
}
