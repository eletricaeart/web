
const SS = SpreadsheetApp.getActiveSpreadsheet();
const sheet = SS.getSheetByName("Notas");

function doPost(e) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var data = JSON.parse(e.postData.contents);
  var action = data.action;

  // Lógica para DELETAR
  if (action === "delete") {
    var rows = sheet.getDataRange().getValues();
    for (var i = 0; i < rows.length; i++) {
      if (rows[i][0] == data.id) {
        sheet.deleteRow(i + 1);
        break;
      }
    }
    return ContentService.createTextOutput(JSON.stringify({"status": "deleted"}))
      .setMimeType(ContentService.MimeType.JSON);
  }

  // Lógica para ATUALIZAR (Editar)
  if (action === "update") {
    var rows = sheet.getDataRange().getValues();
    for (var i = 0; i < rows.length; i++) {
      if (rows[i][0] == data.id) {
        sheet.getRange(i + 1, 3).setValue(data.content); // Atualiza coluna C (Content)
        break;
      }
    }
    return ContentService.createTextOutput(JSON.stringify({"status": "updated"}))
      .setMimeType(ContentService.MimeType.JSON);
  }

  // Lógica para SALVAR NOVA
  var id = "N" + new Date().getTime();
  var dataFormatada = new Date().toLocaleDateString("pt-BR");
  sheet.appendRow([id, dataFormatada, data.content]);
  
  return ContentService.createTextOutput(JSON.stringify({"status": "success", "id": id}))
    .setMimeType(ContentService.MimeType.JSON);
}

function doGet() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var rows = sheet.getDataRange().getValues();
  
  // Mapeamento manual igual ao que funcionou no orçamento
  var result = rows.slice(1).map(row => ({
    id: row[0],
    data: row[1],
    content: row[2]
  }));

  return ContentService.createTextOutput(JSON.stringify(result))
    .setMimeType(ContentService.MimeType.JSON);
}
