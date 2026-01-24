/**
 * Componente de Texto Customizado (God of Thunder)
 * @param {Object} props
 * @param {string} props.text - O texto a ser exibido
 * @param {string} props.tag - A tag HTML (h1, h2, t, span) - Padrão: h1
 * @param {string} props.size - Tamanho (ex: '2rem', '24px')
 * @param {string} props.color - Cor do preenchimento - Padrão: white
 * @param {string} props.weight - Espessura (Padrão: normal)
 * @param {string} props.strokeColor - Cor da borda (opcional)
 * @param {string} props.strokeWidth - Largura da borda (ex: '1px')
 * @param {string} props.target - Seletor onde o texto será injetado
 * @param {string} props.dropShadow
 */
function createThunderText({
  text = "",
  tag = "h1",
  size = "2rem",
  color = "white",
  weight = "normal",
  strokeColor = "transparent",
  strokeWidth = "1px",
  target = null,
  dropShadow = null,
}) {
  const style = `
        font-family: 'GodOfThunder', sans-serif;
        font-size: ${size};
        color: ${color};
        font-weight: ${weight};
        text-transform: uppercase;
        -webkit-text-stroke: ${strokeWidth} ${strokeColor};
        margin: 0;
        line-height: 1.2;
        filter: ${dropShadow};
    `;

  const html = `<${tag} style="${style}">${text}</${tag}>`;

  if (target) {
    const el = document.querySelector(target);
    if (el) el.innerHTML = html;
  }

  return html; // Retorna a string caso queira usar dentro de templates como a AppBar
}
