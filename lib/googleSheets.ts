interface SheetData {
  [key: string]: string | number | boolean | undefined
}

export async function sendToGoogleSheets(data: SheetData, sheetType: 'registration' | 'contact'): Promise<boolean> {
  const webhookUrl = process.env.GOOGLE_SHEETS_WEBHOOK_URL

  if (!webhookUrl) {
    console.log('[Google Sheets] Skipping - no webhook URL configured')
    console.log('[Google Sheets] Would send:', { sheetType, data })
    return true
  }

  try {
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        sheetType,
        timestamp: new Date().toISOString(),
        ...data,
      }),
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    return true
  } catch (error) {
    console.error('[Google Sheets] Failed to send data:', error)
    return false
  }
}

/**
 * Google Apps Script webhook example:
 * 
 * Deploy this as a web app in Google Apps Script:
 * 
 * function doPost(e) {
 *   const ss = SpreadsheetApp.getActiveSpreadsheet();
 *   const data = JSON.parse(e.postData.contents);
 *   
 *   // Determine which sheet to use
 *   let sheetName = data.sheetType === 'contact' ? 'Contacts' : 'Registrations';
 *   let sheet = ss.getSheetByName(sheetName);
 *   
 *   if (!sheet) {
 *     sheet = ss.insertSheet(sheetName);
 *     // Add headers
 *     if (data.sheetType === 'contact') {
 *       sheet.appendRow(['Timestamp', 'Name', 'Email', 'Organization', 'Interest Type', 'Message']);
 *     } else {
 *       sheet.appendRow(['Timestamp', 'Full Name', 'Email', 'Zip Code', 'Role', 'Business Name', 'Youth Club', 'Tickets', 'Partnership', 'Comment']);
 *     }
 *   }
 *   
 *   // Append data row
 *   if (data.sheetType === 'contact') {
 *     sheet.appendRow([
 *       data.timestamp,
 *       data.name,
 *       data.email,
 *       data.organization || '',
 *       data.interestType,
 *       data.message
 *     ]);
 *   } else {
 *     sheet.appendRow([
 *       data.timestamp,
 *       data.fullName,
 *       data.email,
 *       data.zipCode,
 *       data.role,
 *       data.businessName || '',
 *       data.youthClub || '',
 *       data.interestedInTickets || '',
 *       data.interestedInPartnership || '',
 *       data.comment || ''
 *     ]);
 *   }
 *   
 *   return ContentService.createTextOutput(JSON.stringify({ success: true }))
 *     .setMimeType(ContentService.MimeType.JSON);
 * }
 */
