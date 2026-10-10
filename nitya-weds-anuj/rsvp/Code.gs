/**
 * Nitya & Anuj wedding invitation: RSVP endpoint.
 *
 * Paste this into the Apps Script editor of the "AN" Google Sheet
 * (Extensions > Apps Script), run setup() once, then deploy as a Web app
 * (Execute as: Me, Who has access: Anyone). The invitation page POSTs each
 * RSVP here and the script appends it as a row in Sheet1.
 */

var SPREADSHEET_ID = '1-pMkm6SDgFlIYxMSSK5PFArqzYKJlC6PLvmZzfKHVek';
var HEADERS = ['Received', 'Name', 'Attending', 'Guests', 'Events', 'Note', 'Submitted (guest device time)'];

function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    var p = parseBody_(e);
    var sheet = getSheet_();
    sheet.appendRow([
      new Date(),
      String(p.name || '').trim(),
      String(p.attending || ''),
      Number(p.guests) || 0,
      String(p.events || ''),
      String(p.note || ''),
      String(p.submittedAt || '')
    ]);
    return json_({ ok: true });
  } catch (err) {
    return json_({ ok: false, error: String(err) });
  } finally {
    lock.releaseLock();
  }
}

// Opening the web app URL in a browser shows this, which confirms the deployment is live.
function doGet() {
  return ContentService.createTextOutput('RSVP endpoint is live').setMimeType(ContentService.MimeType.TEXT);
}

// Run this once from the editor. It writes the header row and triggers the one-time permission prompt.
function setup() {
  var sheet = getSheet_();
  Logger.log('Ready: ' + sheet.getParent().getName() + ' / ' + sheet.getName());
}

function parseBody_(e) {
  // The page posts application/x-www-form-urlencoded; a JSON body is accepted too.
  if (e && e.parameter && Object.keys(e.parameter).length) return e.parameter;
  if (e && e.postData && e.postData.contents) {
    try { return JSON.parse(e.postData.contents); } catch (ignore) {}
  }
  return {};
}

function getSheet_() {
  var ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  var sheet = ss.getSheets()[0];
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(HEADERS);
    sheet.getRange(1, 1, 1, HEADERS.length).setFontWeight('bold');
    sheet.setFrozenRows(1);
    sheet.getRange('A:A').setNumberFormat('dd mmm yyyy hh:mm');
  }
  return sheet;
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
