
// Script para o Google Apps Script
function doPost(e) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var data = JSON.parse(e.postData.contents);
  var action = data.action || "create";
  
  var rows = sheet.getDataRange().getValues();

  // Objeto de dados mapeado para as colunas
  const rowData = [
    data.id || sheet.getLastRow() + 1, // ID (A)
    data.cliente.name,                // Nome (B)
    data.cliente.cep,                 // CEP (C)
    data.cliente.rua,                 // Rua (D)
    data.cliente.num,                 // Número (E)
    data.cliente.bairro,              // Bairro (F)
    data.cliente.cidade,              // Cidade/UF (G)
    data.docTitle.subtitle,           // Subtítulo (H)
    data.docTitle.emissao,            // Emissão (I)
    data.docTitle.validade,           // Validade (J)
    data.docTitle.text,               // Título Doc (K)
    JSON.stringify(data.servicos)     // Serviços JSON (L)
  ];

  if (action === "update") {
    for (var i = 0; i < rows.length; i++) {
      if (rows[i][0] == data.id) {
        sheet.getRange(i + 1, 1, 1, rowData.length).setValues([rowData]);
        return ContentService.createTextOutput(JSON.stringify({"status": "updated"})).setMimeType(ContentService.MimeType.JSON);
      }
    }
  }

  // Para Create ou Duplicate
  sheet.appendRow(rowData);
  return ContentService.createTextOutput(JSON.stringify({"status": "success", "id": rowData[0]})).setMimeType(ContentService.MimeType.JSON);
}

function doGet(e) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var rows = sheet.getDataRange().getValues();
  var id = e.parameter.id;
  
  var result = rows.slice(1).map(row => ({
    id: row[0],
    cliente: { 
      name: row[1], 
      cep: row[2], 
      rua: row[3], 
      num: row[4], 
      bairro: row[5], 
      cidade: row[6] 
    },
    docTitle: { subtitle: row[7], emissao: row[8], validade: row[9], text: row[10] },
    servicos: JSON.parse(row[11])
  }));

  if (id) result = result.find(item => item.id == id);

  return ContentService.createTextOutput(JSON.stringify(result)).setMimeType(ContentService.MimeType.JSON);
}
