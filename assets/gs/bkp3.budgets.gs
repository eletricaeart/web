
// Script para o Google Apps Script
function doPost(e) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var data = JSON.parse(e.postData.contents);
  var action = data.action || "create"; // Padrão é criar
  
  var rows = sheet.getDataRange().getValues();

  // Lógica para DELETAR ou ATUALIZAR
  if (action === "delete" || action === "update") {
    for (var i = 0; i < rows.length; i++) {
      if (rows[i][0] == data.id) {
        if (action === "delete") {
          sheet.deleteRow(i + 1);
          return ContentService.createTextOutput(JSON.stringify({"status": "deleted"}))
            .setMimeType(ContentService.MimeType.JSON);
        } else {
          // Ação UPDATE: Substitui a linha existente
          sheet.getRange(i + 1, 1, 1, 8).setValues([[
            data.id,
            data.cliente.name,
            data.cliente.address,
            data.docTitle.subtitle,
            data.docTitle.emissao,
            data.docTitle.validade,
            data.docTitle.text,
            JSON.stringify(data.servicos)
          ]]);
          return ContentService.createTextOutput(JSON.stringify({"status": "updated"}))
            .setMimeType(ContentService.MimeType.JSON);
        }
      }
    }
  }

  // Lógica original para CRIAR (ou Duplicar)
  var id = action === "duplicate" ? "D" + Date.now() : sheet.getLastRow() + 1; 
  sheet.appendRow([
    id,
    data.cliente.name,
    data.cliente.address,
    data.docTitle.subtitle,
    data.docTitle.emissao,
    data.docTitle.validade,
    data.docTitle.text,
    JSON.stringify(data.servicos)
  ]);
  
  return ContentService.createTextOutput(JSON.stringify({"status": "success", "id": id}))
    .setMimeType(ContentService.MimeType.JSON);
}

function doGet(e) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var rows = sheet.getDataRange().getValues();
  var id = e.parameter.id;
  
  var result = rows.slice(1).map(row => ({
    id: row[0],
    cliente: { name: row[1], address: row[2] },
    docTitle: { subtitle: row[3], emissao: row[4], validade: row[5], text: row[6] },
    servicos: JSON.parse(row[7])
  }));

  if (id) {
    result = result.find(item => item.id == id);
  }

  // O SEGREDO ESTÁ AQUI: Retornar com JSON e permitir o acesso
  return ContentService.createTextOutput(JSON.stringify(result))
    .setMimeType(ContentService.MimeType.JSON);
}
