# MLS to Vegas

A minimalist, high-credibility landing platform for mlstovegas.com that functions as a market validation and community registry system to support an MLS NEXT Pro–aligned development pathway in Las Vegas.

## Overview

This site is designed to:
- Convert visitors into verified supporters
- Generate transparent, exportable proof of community demand
- Encourage sharing and community momentum through public metrics

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Styling:** Tailwind CSS
- **Language:** TypeScript
- **Email:** Nodemailer (optional)
- **Data:** Google Sheets integration (optional)

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/your-org/mls-to-vegas.git
cd mls-to-vegas
```

2. Install dependencies:
```bash
npm install
```

3. Create environment file:
```bash
cp .env.example .env.local
```

4. Configure environment variables (see Environment Variables section below)

5. Run the development server:
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000)

## Environment Variables

Create a `.env.local` file with the following variables:

```env
# Google Sheets Integration (Optional)
GOOGLE_SHEETS_WEBHOOK_URL=your_google_apps_script_webhook_url

# Email Configuration (Optional - uses Nodemailer)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASSWORD=your_app_password
ADMIN_EMAIL=admin@mlstovegas.com

# Rate Limiting
RATE_LIMIT_WINDOW_MS=60000
RATE_LIMIT_MAX_REQUESTS=5

# Site URL (for share links)
NEXT_PUBLIC_SITE_URL=https://mlstovegas.com
```

### Google Sheets Setup

1. Create a new Google Spreadsheet
2. Go to Extensions > Apps Script
3. Create a web app with the following code:

```javascript
function doPost(e) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const data = JSON.parse(e.postData.contents);
  
  let sheetName = data.sheetType === 'contact' ? 'Contacts' : 'Registrations';
  let sheet = ss.getSheetByName(sheetName);
  
  if (!sheet) {
    sheet = ss.insertSheet(sheetName);
    if (data.sheetType === 'contact') {
      sheet.appendRow(['Timestamp', 'Name', 'Email', 'Organization', 'Interest Type', 'Message']);
    } else {
      sheet.appendRow(['Timestamp', 'Full Name', 'Email', 'Zip Code', 'Role', 'Youth Club', 'Tickets', 'Partnership', 'Comment']);
    }
  }
  
  if (data.sheetType === 'contact') {
    sheet.appendRow([data.timestamp, data.name, data.email, data.organization || '', data.interestType, data.message]);
  } else {
    sheet.appendRow([data.timestamp, data.fullName, data.email, data.zipCode, data.role, data.youthClub || '', data.interestedInTickets || '', data.interestedInPartnership || '', data.comment || '']);
  }
  
  return ContentService.createTextOutput(JSON.stringify({ success: true }))
    .setMimeType(ContentService.MimeType.JSON);
}
```

4. Deploy as a web app (Execute as: Me, Who has access: Anyone)
5. Copy the web app URL to `GOOGLE_SHEETS_WEBHOOK_URL`

### Email Setup (Gmail)

1. Enable 2-factor authentication on your Gmail account
2. Generate an App Password at https://myaccount.google.com/apppasswords
3. Use the app password as `SMTP_PASSWORD`

## Project Structure

```
├── app/
│   ├── api/
│   │   ├── contact/route.ts    # Contact form endpoint
│   │   ├── metrics/route.ts    # Live metrics endpoint
│   │   ├── quotes/route.ts     # Community quotes endpoint
│   │   └── register/route.ts   # Registration endpoint
│   ├── contact/page.tsx        # Partnership inquiries
│   ├── privacy/page.tsx        # Privacy policy
│   ├── share/page.tsx          # Thank you + sharing
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx                # Homepage
├── components/
│   ├── CommunityQuotes.tsx
│   ├── ContactForm.tsx
│   ├── Footer.tsx
│   ├── Hero.tsx
│   ├── Metrics.tsx
│   ├── MobileStickyCTA.tsx
│   ├── RegistryForm.tsx
│   └── ShareButtons.tsx
├── lib/
│   ├── email.ts                # Email utilities
│   ├── googleSheets.ts         # Google Sheets integration
│   ├── rateLimit.ts            # Rate limiting
│   └── storage.ts              # Local data storage
├── public/
│   ├── images/
│   └── videos/
│       └── placeholder.mp4     # Hero background video
└── data/                       # Local JSON storage
```

## Features

### Homepage
- Full-screen hero video with mute/unmute control
- Live metrics dashboard with animated counters
- Registry form with validation and spam protection

### Registry Form
- Client + server validation
- Honeypot spam protection
- Rate limiting (5 requests per minute)
- Duplicate email detection

### Share Page
- Thank you confirmation
- Live metrics display
- Community quotes feed
- Social sharing (X, Facebook, copy link)

### Contact Page
- Partnership/investment inquiry form
- Interest type categorization
- Email notifications

## Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy

```bash
vercel
```

### Build for Production

```bash
npm run build
npm start
```

## Adding Content

### Hero Video
Add your hero video to `/public/videos/placeholder.mp4`

Recommended specs:
- Format: MP4 (H.264)
- Resolution: 1920x1080
- Duration: 10-30 seconds
- Size: Under 10MB for fast loading

### Social Images
Add Open Graph image to `/public/images/og-image.jpg`

Recommended specs:
- Size: 1200x630px
- Format: JPG or PNG

## API Endpoints

### POST /api/register
Register a new supporter.

### POST /api/contact
Submit a partnership inquiry.

### GET /api/metrics
Get current community metrics.

### GET /api/quotes
Get community quotes for display.

## License

Private - All rights reserved.

## Contact

For questions about this initiative, contact info@mlstovegas.com
