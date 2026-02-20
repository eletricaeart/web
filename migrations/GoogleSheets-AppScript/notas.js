/**
 * GAS Notas Técnicas - Modelo Padronizado EASync
 */
function doPost(e) {  
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Notas");
  
  // O motor EASync envia os dados dentro do parâmetro 'data'
  var data = JSON.parse(e.parameter.data);
  var action = data.action || "create";
  var rows = sheet.getDataRange().getValues();
  var id = String(data.id || "").trim();

  // 🔥 GERA ID DEFINITIVO SE FOR TEMP (Seguindo o padrão NT-XXXX-Timestamp)
  if (action === "create" && id.startsWith("TEMP_")) {
    id = `NT-${Math.floor(Math.random() * 10000)}-${Date.now()}`;
  }

  // Mapeamento das colunas (ID, Data, Título, Conteúdo, ClienteID, ClienteNome)
  const rowData = [
    id,
    data.date,
    data.title,
    data.content,
    data.clienteId,
    data.clienteNome
  ];

  let rowIndex = -1;
  // Procura o ID na primeira coluna
  for (var i = 1; i < rows.length; i++) {
    if (String(rows[i][0]).trim() === id) {
      rowIndex = i + 1;
      break;
    }
  }

  // AÇÃO: CREATE
  if (action === "create") {
    if (rowIndex !== -1) {
      return ContentService
        .createTextOutput(JSON.stringify({ status: "error", message: "ID já existe" }))
        .setMimeType(ContentService.MimeType.JSON);
    }
    sheet.appendRow(rowData);
    return ContentService
      .createTextOutput(JSON.stringify({ status: "created", id: id }))
      .setMimeType(ContentService.MimeType.JSON);
  }

  // AÇÃO: UPDATE
  if (action === "update") {
    if (rowIndex === -1) {
      return ContentService
        .createTextOutput(JSON.stringify({ status: "error", message: "ID não encontrado" }))
        .setMimeType(ContentService.MimeType.JSON);
    }
    sheet.getRange(rowIndex, 1, 1, rowData.length).setValues([rowData]);
    return ContentService
      .createTextOutput(JSON.stringify({ status: "updated", id: id }))
      .setMimeType(ContentService.MimeType.JSON);
  }

  // AÇÃO: DELETE (via POST, embora o EASync priorize GET para deletar)
  if (action === "delete") {
    if (rowIndex === -1) {
      return ContentService
        .createTextOutput(JSON.stringify({ status: "error", message: "ID não encontrado" }))
        .setMimeType(ContentService.MimeType.JSON);
    }
    sheet.deleteRow(rowIndex);
    return ContentService
      .createTextOutput(JSON.stringify({ status: "deleted", id: id }))
      .setMimeType(ContentService.MimeType.JSON);
  }

  return ContentService
    .createTextOutput(JSON.stringify({ status: "error", message: "Ação inválida" }))
    .setMimeType(ContentService.MimeType.JSON);
}

function doGet(e) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Notas");
  var rows = sheet.getDataRange().getValues();
  var action = e.parameter.action;
  var id = String(e.parameter.id || "").trim();

  // 🔥 DELETE VIA GET (Modelo Validado Anti-CORS)
  if (action === "delete" && id) {
    for (let i = 1; i < rows.length; i++) {
      if (String(rows[i][0]).trim() === id) {
        sheet.deleteRow(i + 1);
        return ContentService
          .createTextOutput(JSON.stringify({ status: "deleted", id: id }))
          .setMimeType(ContentService.MimeType.JSON);
      }
    }
    return ContentService
      .createTextOutput(JSON.stringify({ status: "not_found", id: id }))
      .setMimeType(ContentService.MimeType.JSON);
  }

  // LISTAGEM E BUSCA POR ID
  const result = rows.slice(1).map(row => ({
    id: row[0],
    date: row[1],
    title: row[2],
    content: row[3],
    clienteId: row[4],
    clienteNome: row[5]
  }));

  if (id && action !== "delete") {
    const found = result.find(r => String(r.id).trim() === id);
    return ContentService
      .createTextOutput(JSON.stringify(found || { status: "not_found" }))
      .setMimeType(ContentService.MimeType.JSON);
  }

  return ContentService
    .createTextOutput(JSON.stringify(result))
    .setMimeType(ContentService.MimeType.JSON);
}
