const SS = SpreadsheetApp.getActiveSpreadsheet();

function doPost(e) {
  var sheet = SS.getSheetByName("Notas") || SS.getSheets()[0]; // Busca a aba Notas ou a primeira disponível
  var data = JSON.parse(e.postData.contents);
  var action = data.action;

  // Lógica para DELETAR
  if (action === "delete") {
    var rows = sheet.getDataRange().getValues();
    for (var i = 0; i < rows.length; i++) {
      if (String(rows[i][0]) === String(data.id)) {
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
      if (String(rows[i][0]) === String(data.id)) {
        // Atualiza Coluna C (Título) e Coluna D (Conteúdo)
        sheet.getRange(i + 1, 3).setValue(data.title || ""); 
        sheet.getRange(i + 1, 4).setValue(data.content);
        break;
      }
    }
    return ContentService.createTextOutput(JSON.stringify({"status": "updated"}))
      .setMimeType(ContentService.MimeType.JSON);
  }

  // Lógica para SALVAR NOVA
  var id = "N" + new Date().getTime();
  var dataFormatada = data.data || new Date().toLocaleDateString("pt-BR");
  
  // Ordem: ID, DATA, TITULO, CONTEUDO
  sheet.appendRow([id, dataFormatada, data.title || "", data.content]);
  
  return ContentService.createTextOutput(JSON.stringify({"status": "success", "id": id}))
    .setMimeType(ContentService.MimeType.JSON);
}

function doGet() {
  var sheet = SS.getSheetByName("Notas") || SS.getSheets()[0];
  var rows = sheet.getDataRange().getValues();
  
  // Se a planilha estiver vazia (apenas cabeçalho ou nada), retorna array vazio
  if (rows.length <= 1) {
     return ContentService.createTextOutput(JSON.stringify([]))
      .setMimeType(ContentService.MimeType.JSON);
  }

  // Mapeamento atualizado para incluir o título na Coluna C (índice 2)
  var result = rows.slice(1).map(row => ({
    id: row[0],
    data: row[1],
    title: row[2],   // Nova coluna de Título
    content: row[3]  // Conteúdo agora é a coluna 4 (índice 3)
  }));

  return ContentService.createTextOutput(JSON.stringify(result))
    .setMimeType(ContentService.MimeType.JSON);
}
