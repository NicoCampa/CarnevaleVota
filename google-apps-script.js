// =============================================================
// GOOGLE APPS SCRIPT — Carnevale di Cento 2026 Voting Backend
// =============================================================
//
// SETUP INSTRUCTIONS:
//
// 1. Go to https://sheets.google.com and create a new spreadsheet
// 2. Name it "Voti Carnevale 2026" (or whatever you like)
// 3. In Row 1, add these headers:
//      A1: Timestamp | B1: Nome | C1: Telefono | D1: Email | E1: Carro
// 4. Go to Extensions → Apps Script
// 5. Delete any existing code and paste this entire file
// 6. Click "Deploy" → "New deployment"
// 7. Select type: "Web app"
// 8. Set:
//      - Execute as: Me
//      - Who has access: Anyone
// 9. Click "Deploy" and authorize when prompted
// 10. Copy the Web App URL and paste it into index.html
//     (replace the GOOGLE_SCRIPT_URL variable)
//
// =============================================================

function doPost(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    var data = JSON.parse(e.postData.contents);

    sheet.appendRow([
      data.timestamp || new Date().toISOString(),
      data.nome || '',
      data.telefono || '',
      data.email || '',
      data.carro || ''
    ]);

    return ContentService
      .createTextOutput(JSON.stringify({ result: 'success' }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({ result: 'error', message: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    var data = sheet.getDataRange().getValues();
    var counts = {};

    // Skip header row (index 0), count votes per carro
    for (var i = 1; i < data.length; i++) {
      var carro = data[i][4]; // Column E = Carro
      if (carro) {
        counts[carro] = (counts[carro] || 0) + 1;
      }
    }

    return ContentService
      .createTextOutput(JSON.stringify({ result: 'success', counts: counts, total: data.length - 1 }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({ result: 'error', message: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
