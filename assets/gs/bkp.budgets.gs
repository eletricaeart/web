
// Script para o Google Apps Script
function doPost(e) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var data = JSON.parse(e.postData.contents);
  
  // Gera um ID baseado na última linha
  var id = sheet.getLastRow(); 
  
  sheet.appendRow([
    id,
    data.cliente.name,
    data.cliente.address,
    data.docTitle.subtitle,
    data.docTitle.emissao,
    data.docTitle.validade,
    data.docTitle.text,
    JSON.stringify(data.servicos) // Salva o array complexo como texto
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

