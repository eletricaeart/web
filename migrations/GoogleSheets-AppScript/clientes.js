function doPost(e) {  
  var sheet = SpreadsheetApp
    .getActiveSpreadsheet()
    .getSheetByName("Clientes");

  var data = JSON.parse(e.parameter.data);
  var action = data.action || "create";
  var rows = sheet.getDataRange().getValues();

  var id = String(data.id);

  // GERA ID DEFINITIVO SE FOR TEMP
  if (action === "create" && id.startsWith("TEMP_")) {
    id = `CL-${Math.floor(Math.random()*10000)}-${Date.now()}`;
  }

  const rowData = [
    id,
    data.name,
    data.gender,
    data.doc,
    data.whatsapp,
    data.email,
    data.cep,
    data.rua,
    data.num,
    data.bairro,
    data.cidade,
    new Date()
  ];

  let rowIndex = -1;

  // PROCURA ID
  for (var i = 1; i < rows.length; i++) {
    if (String(rows[i][0]).trim() === id.trim()) {
      rowIndex = i + 1;
      break;
    }
  }

  // CREATE
  if (action === "create") {

    if (rowIndex !== -1) {
      return ContentService
        .createTextOutput(JSON.stringify({ status: "error", message: "ID já existe" }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    sheet.appendRow(rowData);

    return ContentService
      .createTextOutput(JSON.stringify({ status: "created", id }))
      .setMimeType(ContentService.MimeType.JSON);
  }

  // UPDATE
  if (action === "update") {

    if (rowIndex === -1) {
      return ContentService
        .createTextOutput(JSON.stringify({ status: "error", message: "ID não encontrado" }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    sheet.getRange(rowIndex, 1, 1, rowData.length).setValues([rowData]);

    return ContentService
      .createTextOutput(JSON.stringify({ status: "updated" }))
      .setMimeType(ContentService.MimeType.JSON);
  }

  // DELETE
  if (action === "delete") {

    if (rowIndex === -1) {
      return ContentService
        .createTextOutput(JSON.stringify({ status: "error", message: "ID não encontrado" }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    sheet.deleteRow(rowIndex);

    return ContentService
      .createTextOutput(JSON.stringify({ status: "deleted", id }))
      .setMimeType(ContentService.MimeType.JSON);
  }

  return ContentService
    .createTextOutput(JSON.stringify({ status: "error", message: "Ação inválida" }))
    .setMimeType(ContentService.MimeType.JSON);
}


function doGet(e) {

  var sheet = SpreadsheetApp
    .getActiveSpreadsheet()
    .getSheetByName("Clientes");

  var rows = sheet.getDataRange().getValues();

  const action = e.parameter.action;
  const id = String(e.parameter.id || "").trim();

  // DELETE VIA GET (MESMO PADRÃO DOS ORÇAMENTOS)
  if (action === "delete" && id) {

    for (let i = 1; i < rows.length; i++) {
      if (String(rows[i][0]).trim() === id) {
        sheet.deleteRow(i + 1);

        return ContentService
          .createTextOutput(JSON.stringify({ status: "deleted", id }))
          .setMimeType(ContentService.MimeType.JSON);
      }
    }

    return ContentService
      .createTextOutput(JSON.stringify({ status: "not_found", id }))
      .setMimeType(ContentService.MimeType.JSON);
  }

  // LISTAGEM
  const result = rows.slice(1).map(row => ({
    id: row[0],
    name: row[1],
    gender: row[2],
    doc: row[3],
    whatsapp: row[4],
    email: row[5],
    cep: row[6],
    rua: row[7],
    num: row[8],
    bairro: row[9],
    cidade: row[10],
    updatedAt: row[11]
  }));

  if (id) {
    return ContentService
      .createTextOutput(JSON.stringify(result.find(r => r.id == id)))
      .setMimeType(ContentService.MimeType.JSON);
  }

  return ContentService
    .createTextOutput(JSON.stringify(result))
    .setMimeType(ContentService.MimeType.JSON);
}
