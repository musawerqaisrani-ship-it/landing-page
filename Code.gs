/**
 * MOSAWER SHOPs — Order intake backend
 *
 * DEPLOYMENT INSTRUCTIONS:
 * 1. Open script.google.com -> New Project, paste this whole file in as Code.gs.
 * 2. Open the Google Sheet you want orders saved into (or create one).
 * 3. Make sure the first row of the sheet (tab named "Orders") has these headers,
 *    in this exact order:
 *    Timestamp | Product | Name | Phone | City | Address | Quantity | Price
 *    (If the "Orders" sheet/tab doesn't exist yet, this script creates it
 *    automatically on first run and adds the header row for you.)
 * 4. Click Deploy -> New deployment -> select type "Web app".
 *    - Execute as: Me
 *    - Who has access: Anyone
 *    (It MUST be "Anyone" — not "Anyone with Google account" — or the
 *    public fetch() call from your GitHub Pages site will fail.)
 * 5. Copy the generated /exec URL and put it in SCRIPT_URL in script.js.
 * 6. Every time you edit this file, you must create a NEW deployment
 *    (or use "Manage deployments" -> edit -> new version) for the
 *    changes to actually go live at the same URL.
 */

const SHEET_NAME = "Orders";

function doPost(e) {
  try {
    if (!e || !e.postData || !e.postData.contents) {
      return jsonResponse({ status: "error", message: "No data received." });
    }

    const data = JSON.parse(e.postData.contents);

    // Basic server-side validation — never trust the client alone
    const required = ["name", "phone", "city", "address"];
    for (const field of required) {
      if (!data[field] || String(data[field]).trim() === "") {
        return jsonResponse({ status: "error", message: "Missing field: " + field });
      }
    }

    const sheet = getOrCreateSheet();

    sheet.appendRow([
      data.timestamp || new Date().toISOString(),
      data.product || "",
      data.name,
      data.phone,
      data.city,
      data.address,
      data.quantity || 1,
      data.price || ""
    ]);

    return jsonResponse({ status: "success", message: "Order saved." });

  } catch (err) {
    return jsonResponse({ status: "error", message: "Server error: " + err.message });
  }
}

// Handy for testing the deployment URL directly in a browser tab
function doGet(e) {
  return jsonResponse({ status: "ok", message: "Order endpoint is live. Use POST to submit an order." });
}

function getOrCreateSheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(SHEET_NAME);

  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
    sheet.appendRow([
      "Timestamp", "Product", "Name", "Phone", "City", "Address", "Quantity", "Price"
    ]);
    sheet.setFrozenRows(1);
  }

  return sheet;
}

function jsonResponse(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
