export const processNotionText = (text) => {
  if (!text) return "";
  let lines = text.split("\n");
  let inTagC = false;
  let inUl = false;
  let htmlResult = [];

  lines.forEach((line) => {
    const tl = line.trim();

    // Lógica para Blocos de Destaque (> )
    if (tl.startsWith("> ")) {
      if (inUl) {
        htmlResult.push(`</ul>`);
        inUl = false;
      }
      if (!inTagC) {
        htmlResult.push(`<div class="tagc-block">`);
        inTagC = true;
      }
      htmlResult.push(`<div>${line.substring(2)}</div>`);
    }
    // Lógica para Listas (- ou *)
    else if (tl.startsWith("- ") || tl.startsWith("* ")) {
      if (inTagC) {
        htmlResult.push(`</div>`);
        inTagC = false;
      }
      if (!inUl) {
        htmlResult.push(`<ul>`);
        inUl = true;
      }
      htmlResult.push(`<li>${line.substring(2)}</li>`);
    }
    // Outros elementos (HR, Títulos, etc)
    else {
      if (inTagC) {
        htmlResult.push(`</div>`);
        inTagC = false;
      }
      if (inUl) {
        htmlResult.push(`</ul>`);
        inUl = false;
      }

      if (tl === "---") htmlResult.push(`<hr/>`);
      else if (tl.startsWith("# "))
        htmlResult.push(`<h2>${line.substring(2)}</h2>`);
      else htmlResult.push(`<p>${line || "&nbsp;"}</p>`);
    }
  });

  return htmlResult.join("");
};
