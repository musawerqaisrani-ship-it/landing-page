/**
 * ============================================================
 * MOSAWER SHOPs — Google Apps Script Order Intake Backend
 * ============================================================
 * 
 * SPREADSHEET ID: 16QJPVM6xloE0QrfkAACuWFfct1xijidm4UOQWk4n8L8
 * SHEET NAME: Orders
 * 
 * DEPLOYMENT INSTRUCTIONS:
 * 1. Open script.google.com -> select or create project, paste this code into Code.gs.
 * 2. Click "Deploy" -> "New deployment".
 * 3. Select type: "Web app".
 * 4. Execute as: "Me"
 * 5. Who has access: "Anyone" (MUST be "Anyone", NOT "Anyone with Google account").
 * 6. Copy the Web App URL (/exec) and update SCRIPT_URL in script.js if needed.
 */

const SPREADSHEET_ID = "16QJPVM6xloE0QrfkAACuWFfct1xijidm4UOQWk4n8L8";
const SHEET_NAME = "Orders";

function doPost(e) {
  const lock = LockService.getScriptLock();
  const success = lock.tryLock(10000);

  if (!success) {
    return createJsonResponse({
      status: "error",
      message: "Server is busy. Please try again in a few seconds."
    });
  }

  try {
    if (!e || (!e.postData && !e.parameter)) {
      return createJsonResponse({
        status: "error",
        message: "No order data received."
      });
    }

    let data = {};

    if (e.postData && e.postData.contents) {
      try {
        data = JSON.parse(e.postData.contents);
      } catch (jsonErr) {
        data = e.parameter || {};
      }
    } else if (e.parameter) {
      data = e.parameter;
    }

    const name = data.name ? String(data.name).trim() : "";
    const phone = data.phone ? String(data.phone).trim() : "";
    const city = data.city ? String(data.city).trim() : "";
    const address = data.address ? String(data.address).trim() : "";
    const product = data.product ? String(data.product).trim() : "MOSAWER SHOP Product";
    const quantity = data.quantity ? String(data.quantity).trim() : "1";
    const price = data.price ? String(data.price).trim() : "Rs.1999";
    const timestamp = data.timestamp ? String(data.timestamp).trim() : new Date().toLocaleString("en-US", { timeZone: "Asia/Karachi" });

    if (!name || !phone || !city || !address) {
      return createJsonResponse({
        status: "error",
        message: "Missing required fields (Name, Phone, City, Address)."
      });
    }

    // Always use openById with the explicit Spreadsheet ID
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    let sheet = ss.getSheetByName(SHEET_NAME);

    // Create the "Orders" sheet automatically if it does not exist
    if (!sheet) {
      sheet = ss.insertSheet(SHEET_NAME);
      sheet.appendRow([
        "Timestamp",
        "Product",
        "Name",
        "Phone",
        "City",
        "Address",
        "Quantity",
        "Price"
      ]);
      sheet.setFrozenRows(1);
    }

    // Append the order row to the spreadsheet
    sheet.appendRow([
      timestamp,
      product,
      name,
      phone,
      city,
      address,
      quantity,
      price
    ]);

    return createJsonResponse({
      status: "success",
      message: "Order placed successfully!"
    });

  } catch (err) {
    return createJsonResponse({
      status: "error",
      message: "Server Error: " + err.toString()
    });
  } finally {
    lock.releaseLock();
  }
}

function doGet(e) {
  return createJsonResponse({
    status: "ok",
    message: "MOSAWER SHOPs Order API is active."
  });
}

function createJsonResponse(dataObject) {
  return ContentService
    .createTextOutput(JSON.stringify(dataObject))
    .setMimeType(ContentService.MimeType.JSON);
}