/**
 */
const appbar_template = `

`;
function Appbar(props) {
  document.querySelectorAll("appbar").forEach((tag) => {
    return (tag.outerHTML = appbar_template);
  });
}

Appbar();
