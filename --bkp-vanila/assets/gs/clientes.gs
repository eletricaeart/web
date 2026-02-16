function doPost(e) {
  // 👉 IMPORTANTE: Se o script não estiver dentro da planilha de clientes, 
  // troque a linha abaixo por: var sheet = SpreadsheetApp.openById("ID_DA_PLANILHA").getSheetByName("Clientes");
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Clientes");
  var data = JSON.parse(e.postData.contents);
  var action = data.action || "save_client";
  var rows = sheet.getDataRange().getValues();

  var id = String(data.id);

  // Mapeamento das colunas conforme o formulário de cliente.html
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
    new Date() // Data de atualização
  ];

  let rowIndex = -1;

  // Procura o ID na primeira coluna
  for (var i = 1; i < rows.length; i++) {
    if (String(rows[i][0]) === id) {
      rowIndex = i + 1;
      break;
    }
  }

  // LÓGICA DE SALVAMENTO (UPSERT: Update or Insert)
  if (action === "save_client") {
    if (rowIndex !== -1) {
      // Se achou o ID, atualiza a linha existente
      sheet.getRange(rowIndex, 1, 1, rowData.length).setValues([rowData]);
      return ContentService
        .createTextOutput(JSON.stringify({ status: "updated", id }))
        .setMimeType(ContentService.MimeType.JSON);
    } else {
      // Se não achou, adiciona nova linha
      sheet.appendRow(rowData);
      return ContentService
        .createTextOutput(JSON.stringify({ status: "created", id }))
        .setMimeType(ContentService.MimeType.JSON);
    }
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
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Clientes");
  var rows = sheet.getDataRange().getValues();
  var id = e.parameter.id;

  // Transforma as linhas da planilha em objetos JSON
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
    const found = result.find(r => r.id == id);
    return ContentService
      .createTextOutput(JSON.stringify(found || { status: "not_found" }))
      .setMimeType(ContentService.MimeType.JSON);
  }

  // Retorna a lista completa de clientes
  return ContentService
    .createTextOutput(JSON.stringify(result))
    .setMimeType(ContentService.MimeType.JSON);
}
