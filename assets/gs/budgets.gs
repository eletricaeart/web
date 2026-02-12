// Script para o Google Apps Script
function doPost(e) {  
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var data = JSON.parse(e.postData.contents);
  var action = data.action || "create";
  var rows = sheet.getDataRange().getValues();

  var id = String(data.id);

  // LÓGICA DE ID DEFINITIVO: Se for criação e o ID for TEMP, gera um EA-Timestamp
  if (action === "create" && id.startsWith("TEMP_")) {
    // id = "EA-" + new Date().getTime(); 
    id = `EA-${ Math.floor( Math.random() * 1000 ) + 9999 }-${ Math.floor( Math.random() * 1000 ) + 9999 }-${ Math.floor( Math.random() * 1000 ) + 9999 }-${ Math.floor( Math.random() * 1000 ) + 9999 }`;
  }

  const rowData = [
    id,
    data.cliente.name,
    data.cliente.cep,
    data.cliente.rua,
    data.cliente.num,
    data.cliente.bairro,
    data.cliente.cidade,
    data.docTitle.subtitle,
    data.docTitle.emissao,
    data.docTitle.validade,
    data.docTitle.text,
    JSON.stringify(data.servicos)
  ];

  let rowIndex = -1;

  // Procura o ID
  for (var i = 1; i < rows.length; i++) {
    if (String(rows[i][0]) === id) {
      rowIndex = i + 1; // índice real da planilha
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
  // --- Trecho para o doPost no Google Apps Script ---
if (action === "delete") {
  var idParaDeletar = String(data.id || "").trim(); // Garante que o ID recebido seja string e sem espaços
  
  // Percorre as linhas para encontrar o ID real na planilha
  for (var i = 1; i < rows.length; i++) {
    var idNaPlanilha = String(rows[i][0]).trim(); // Limpa o ID da célula para comparação
    
    if (idNaPlanilha === idParaDeletar) {
      sheet.deleteRow(i + 1); // Deleta a linha encontrada (i+1 porque rows começa em 0 e planilhas em 1)
      return ContentService
        .createTextOutput(JSON.stringify({ status: "deleted", id: idParaDeletar }))
        .setMimeType(ContentService.MimeType.JSON);
    }
  }

  // Se percorreu tudo e não achou
  return ContentService
    .createTextOutput(JSON.stringify({ status: "error", message: "ID não encontrado: " + idParaDeletar }))
    .setMimeType(ContentService.MimeType.JSON);
}

  return ContentService
    .createTextOutput(JSON.stringify({ status: "error", message: "Ação inválida" }))
    .setMimeType(ContentService.MimeType.JSON);
}

function doGet(e) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  const rows = sheet.getDataRange().getValues();

  const action = e.parameter.action;
  const id = String(e.parameter.id || "").trim();

  // 👉 DELETE VIA GET (ROBUSTO)
  // --- Trecho para o doGet no Google Apps Script ---
if (action === "delete" && id) {
  var idLimpo = String(id).trim(); // Limpa o ID vindo pela URL

  for (let i = 1; i < rows.length; i++) {
    var idLinha = String(rows[i][0]).trim();
    
    if (idLinha === idLimpo) {
      sheet.deleteRow(i + 1);
      return ContentService
        .createTextOutput(JSON.stringify({ status: "deleted", id: idLimpo }))
        .setMimeType(ContentService.MimeType.JSON);
    }
  }

  return ContentService
    .createTextOutput(JSON.stringify({ status: "not_found", id: idLimpo }))
    .setMimeType(ContentService.MimeType.JSON);
}

  // 👉 LISTAGEM NORMAL
  const result = rows.slice(1).map(row => ({
    id: row[0],
    cliente: {
      name: row[1],
      cep: row[2],
      rua: row[3],
      num: row[4],
      bairro: row[5],
      cidade: row[6]
    },
    docTitle: {
      subtitle: row[7],
      emissao: row[8],
      validade: row[9],
      text: row[10]
    },
    servicos: JSON.parse(row[11])
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

