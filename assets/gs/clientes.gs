
// No seu arquivo .gs
function doPost(e) {
  const data = JSON.parse(e.postData.contents);
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Clientes");
  
  if (data.action === "save_client") {
    // Validação de segurança: Nome é obrigatório
    if (!data.name) return ContentService.createTextOutput("Erro: Nome obrigatório");
    
    // Verifica se já existe (Update) ou se é novo (Create)
    const rows = sheet.getDataRange().getValues();
    let rowIndex = -1;
    
    for (let i = 1; i < rows.length; i++) {
      if (rows[i][0] === data.id) { rowIndex = i + 1; break; }
    }

    const clientData = [data.id, data.name, data.cep, data.rua, data.num, data.bairro, data.cidade, new Date()];

    if (rowIndex > -1) {
      sheet.getRange(rowIndex, 1, 1, clientData.length).setValues([clientData]);
    } else {
      sheet.appendRow(clientData);
    }
    return ContentService.createTextOutput("Sucesso");
  }
}
