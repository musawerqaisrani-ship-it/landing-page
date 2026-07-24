const SHEET_NAME = "Orders";
const SPREADSHEET_ID = "16QJPVM6xloE0QrfkAACuWFfct1xijidm4UOQWk4n8L8";

function doPost(e) {

  try {

    const data = JSON.parse(e.postData.contents);

    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);

    let sheet = ss.getSheetByName(Orders);

    if (!sheet) {

      sheet = ss.insertSheet(Orders);

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

    }

    sheet.appendRow([

      new Date(),

      data.product,

      data.name,

      data.phone,

      data.city,

      data.address,

      data.quantity,

      data.price

    ]);

    return ContentService
      .createTextOutput(JSON.stringify({
        status:"success"
      }))
      .setMimeType(ContentService.MimeType.JSON);

  }

  catch(err){

    return ContentService
      .createTextOutput(JSON.stringify({

        status:"error",

        message:err.toString()

      }))
      .setMimeType(ContentService.MimeType.JSON);

  }

}

function doGet(){

  return ContentService
    .createTextOutput("MOSAWER SHOP API Running");

}