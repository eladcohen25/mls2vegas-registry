import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs'
import { join } from 'path'

const DATA_DIR = join(process.cwd(), 'data')
const REGISTRATIONS_FILE = join(DATA_DIR, 'registrations.json')
const CONTACTS_FILE = join(DATA_DIR, 'contacts.json')
const METRICS_FILE = join(DATA_DIR, 'metrics.json')

// Ensure data directory exists
function ensureDataDir() {
  if (!existsSync(DATA_DIR)) {
    mkdirSync(DATA_DIR, { recursive: true })
  }
}

// Registration types
export interface Registration {
  id: string
  fullName: string
  email: string
  zipCode: string
  role: string
  businessName?: string
  youthClub?: string
  interestedInTickets?: string
  interestedInPartnership?: string
  comment?: string
  createdAt: string
}

export interface Contact {
  id: string
  name: string
  email: string
  organization?: string
  interestType: string
  message: string
  createdAt: string
}

export interface Metrics {
  supporters: number
  youthPlayers: number
  businesses: number
  lastUpdated: string
}

// Read registrations
export function getRegistrations(): Registration[] {
  ensureDataDir()
  if (!existsSync(REGISTRATIONS_FILE)) {
    return []
  }
  try {
    const data = readFileSync(REGISTRATIONS_FILE, 'utf-8')
    return JSON.parse(data)
  } catch {
    return []
  }
}

// Save registration
export function saveRegistration(registration: Omit<Registration, 'id' | 'createdAt'>): Registration {
  ensureDataDir()
  const registrations = getRegistrations()
  
  const newRegistration: Registration = {
    ...registration,
    id: `reg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    createdAt: new Date().toISOString(),
  }
  
  registrations.push(newRegistration)
  writeFileSync(REGISTRATIONS_FILE, JSON.stringify(registrations, null, 2))
  
  // Update metrics
  updateMetricsFromRegistrations()
  
  return newRegistration
}

// Check if email already registered
export function isEmailRegistered(email: string): boolean {
  const registrations = getRegistrations()
  return registrations.some(r => r.email.toLowerCase() === email.toLowerCase())
}

// Read contacts
export function getContacts(): Contact[] {
  ensureDataDir()
  if (!existsSync(CONTACTS_FILE)) {
    return []
  }
  try {
    const data = readFileSync(CONTACTS_FILE, 'utf-8')
    return JSON.parse(data)
  } catch {
    return []
  }
}

// Save contact
export function saveContact(contact: Omit<Contact, 'id' | 'createdAt'>): Contact {
  ensureDataDir()
  const contacts = getContacts()
  
  const newContact: Contact = {
    ...contact,
    id: `con_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    createdAt: new Date().toISOString(),
  }
  
  contacts.push(newContact)
  writeFileSync(CONTACTS_FILE, JSON.stringify(contacts, null, 2))
  
  return newContact
}

// Get metrics
export function getMetrics(): Metrics {
  ensureDataDir()
  
  // If file doesn't exist, calculate from registrations
  if (!existsSync(METRICS_FILE)) {
    return updateMetricsFromRegistrations()
  }
  
  try {
    const data = readFileSync(METRICS_FILE, 'utf-8')
    return JSON.parse(data)
  } catch {
    return updateMetricsFromRegistrations()
  }
}

// Update metrics based on registrations
export function updateMetricsFromRegistrations(): Metrics {
  ensureDataDir()
  const registrations = getRegistrations()
  
  const metrics: Metrics = {
    supporters: registrations.length,
    youthPlayers: registrations.filter(r => 
      r.role === 'parent' || r.role === 'player' || r.role === 'coach'
    ).length,
    businesses: registrations.filter(r => 
      r.role === 'business_owner' || r.interestedInPartnership === 'yes'
    ).length,
    lastUpdated: new Date().toISOString(),
  }
  
  // Add baseline numbers for initial display
  if (registrations.length === 0) {
    metrics.supporters = 847
    metrics.youthPlayers = 312
    metrics.businesses = 43
  } else {
    // Add baseline to actual counts
    metrics.supporters += 847
    metrics.youthPlayers += 312
    metrics.businesses += 43
  }
  
  writeFileSync(METRICS_FILE, JSON.stringify(metrics, null, 2))
  
  return metrics
}

// Get quotes from registrations
export function getQuotes(): { text: string; role: string }[] {
  const registrations = getRegistrations()
  
  const roleLabels: Record<string, string> = {
    parent: 'Parent',
    player: 'Player',
    coach: 'Coach',
    fan: 'Fan',
    business_owner: 'Business Owner',
    other: 'Supporter',
  }
  
  return registrations
    .filter(r => r.comment && r.comment.trim().length > 10)
    .map(r => ({
      text: r.comment!,
      role: roleLabels[r.role] || 'Supporter',
    }))
    .slice(-20) // Last 20 quotes
}
