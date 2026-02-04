import nodemailer from 'nodemailer'

interface EmailConfig {
  host: string
  port: number
  secure: boolean
  auth: {
    user: string
    pass: string
  }
}

interface EmailData {
  to: string
  subject: string
  text: string
  html?: string
}

function getTransporter() {
  const config: EmailConfig = {
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: false,
    auth: {
      user: process.env.SMTP_USER || '',
      pass: process.env.SMTP_PASSWORD || '',
    },
  }

  return nodemailer.createTransport(config)
}

export async function sendEmail(data: EmailData): Promise<boolean> {
  // Skip if no email config
  if (!process.env.SMTP_USER || !process.env.SMTP_PASSWORD) {
    console.log('[Email] Skipping email send - no SMTP config')
    console.log('[Email] Would send to:', data.to)
    console.log('[Email] Subject:', data.subject)
    return true
  }

  try {
    const transporter = getTransporter()
    
    await transporter.sendMail({
      from: process.env.SMTP_USER,
      to: data.to,
      subject: data.subject,
      text: data.text,
      html: data.html,
    })
    
    return true
  } catch (error) {
    console.error('[Email] Failed to send:', error)
    return false
  }
}

export async function sendRegistrationNotification(registration: {
  fullName: string
  email: string
  zipCode: string
  role: string
  businessName?: string
  youthClub?: string
  interestedInTickets?: string
  interestedInPartnership?: string
  comment?: string
}): Promise<boolean> {
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@mlstovegas.com'
  
  const text = `
New Registration - MLS to Vegas

Name: ${registration.fullName}
Email: ${registration.email}
Zip Code: ${registration.zipCode}
Role: ${registration.role}
Business Name: ${registration.businessName || 'N/A'}
Youth Club: ${registration.youthClub || 'N/A'}
Interested in Tickets: ${registration.interestedInTickets || 'N/A'}
Interested in Partnership: ${registration.interestedInPartnership || 'N/A'}

Comment:
${registration.comment || 'No comment provided'}

---
Submitted at: ${new Date().toISOString()}
  `.trim()

  const html = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: system-ui, sans-serif; line-height: 1.6; color: #1e293b; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    h1 { color: #0a1628; font-size: 24px; margin-bottom: 20px; }
    .field { margin-bottom: 12px; }
    .label { font-weight: 600; color: #64748b; }
    .value { color: #1e293b; }
    .comment { background: #f8fafc; padding: 16px; border-radius: 4px; margin-top: 16px; }
    .footer { margin-top: 24px; padding-top: 16px; border-top: 1px solid #e2e8f0; font-size: 12px; color: #94a3b8; }
  </style>
</head>
<body>
  <div class="container">
    <h1>New Registration - MLS to Vegas</h1>
    
    <div class="field">
      <span class="label">Name:</span>
      <span class="value">${registration.fullName}</span>
    </div>
    
    <div class="field">
      <span class="label">Email:</span>
      <span class="value">${registration.email}</span>
    </div>
    
    <div class="field">
      <span class="label">Zip Code:</span>
      <span class="value">${registration.zipCode}</span>
    </div>
    
    <div class="field">
      <span class="label">Role:</span>
      <span class="value">${registration.role}</span>
    </div>

    <div class="field">
      <span class="label">Business Name:</span>
      <span class="value">${registration.businessName || 'N/A'}</span>
    </div>
    
    <div class="field">
      <span class="label">Youth Club:</span>
      <span class="value">${registration.youthClub || 'N/A'}</span>
    </div>
    
    <div class="field">
      <span class="label">Interested in Tickets:</span>
      <span class="value">${registration.interestedInTickets || 'N/A'}</span>
    </div>
    
    <div class="field">
      <span class="label">Interested in Partnership:</span>
      <span class="value">${registration.interestedInPartnership || 'N/A'}</span>
    </div>
    
    ${registration.comment ? `
    <div class="comment">
      <div class="label">Comment:</div>
      <p class="value">${registration.comment}</p>
    </div>
    ` : ''}
    
    <div class="footer">
      Submitted at: ${new Date().toISOString()}
    </div>
  </div>
</body>
</html>
  `.trim()

  return sendEmail({
    to: adminEmail,
    subject: `[MLS to Vegas] New Registration: ${registration.fullName}`,
    text,
    html,
  })
}

export async function sendContactNotification(contact: {
  name: string
  email: string
  organization?: string
  interestType: string
  message: string
}): Promise<boolean> {
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@mlstovegas.com'
  
  const interestLabels: Record<string, string> = {
    investment: 'Investment',
    ownership: 'Ownership',
    partnership: 'Partnership',
    other: 'Other',
  }

  const text = `
New Partnership Inquiry - MLS to Vegas

Name: ${contact.name}
Email: ${contact.email}
Organization: ${contact.organization || 'N/A'}
Interest Type: ${interestLabels[contact.interestType] || contact.interestType}

Message:
${contact.message}

---
Submitted at: ${new Date().toISOString()}
  `.trim()

  const html = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: system-ui, sans-serif; line-height: 1.6; color: #1e293b; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    h1 { color: #0a1628; font-size: 24px; margin-bottom: 20px; }
    .priority { display: inline-block; background: #0a1628; color: white; padding: 4px 12px; border-radius: 4px; font-size: 12px; margin-bottom: 20px; }
    .field { margin-bottom: 12px; }
    .label { font-weight: 600; color: #64748b; }
    .value { color: #1e293b; }
    .message { background: #f8fafc; padding: 16px; border-radius: 4px; margin-top: 16px; }
    .footer { margin-top: 24px; padding-top: 16px; border-top: 1px solid #e2e8f0; font-size: 12px; color: #94a3b8; }
  </style>
</head>
<body>
  <div class="container">
    <h1>New Partnership Inquiry</h1>
    <span class="priority">${interestLabels[contact.interestType] || contact.interestType}</span>
    
    <div class="field">
      <span class="label">Name:</span>
      <span class="value">${contact.name}</span>
    </div>
    
    <div class="field">
      <span class="label">Email:</span>
      <span class="value">${contact.email}</span>
    </div>
    
    <div class="field">
      <span class="label">Organization:</span>
      <span class="value">${contact.organization || 'N/A'}</span>
    </div>
    
    <div class="message">
      <div class="label">Message:</div>
      <p class="value">${contact.message}</p>
    </div>
    
    <div class="footer">
      Submitted at: ${new Date().toISOString()}
    </div>
  </div>
</body>
</html>
  `.trim()

  return sendEmail({
    to: adminEmail,
    subject: `[MLS to Vegas] Partnership Inquiry: ${contact.name} - ${interestLabels[contact.interestType]}`,
    text,
    html,
  })
}
