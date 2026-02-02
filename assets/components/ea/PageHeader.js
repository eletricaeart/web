/**
 * == [ page-header template ]
 * == == == == == == == == == */
class PageHeader extends HTMLElement {
  constructor() {
    super();
    let style = `
      <style> 
        header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        /* margin-bottom: 25px;
        border-bottom: 2px solid #ffcc00;
        padding-bottom: 10px; */
        padding: 2rem 1rem;
        }
      </style>
    `;

    const Template = `
      ${style}
      <header class="page-header">
      </header>
    `;
    const rootCSS = `
      display: flex;
      width: 100%;
    `;
    const setTitle = (p) => `
      <ea-text
        color="var(--sv-sombra-azul)"
        shadow="#9fabb555"
        size="1.5rem"
      >${p.title}</ea-text>
    `;

    let pageHeader = document.createElement("template");
    pageHeader.innerHTML = Template;

    this.attachShadow({ mode: "open" });
    this.shadowRoot.append(pageHeader.content.cloneNode(true));

    this.style.cssText = rootCSS;
    this.tag = this.shadowRoot.querySelector(".page-header");
    this.title = this.shadowRoot.querySelector("ea-text");

    // text
    this.tag.innerHTML = setTitle({ title: this.innerHTML });

    this.getAttribute("center")
      ? (this.title.style.justifyContent = "center")
      : "";

    this.getAttribute("shadow")
      ? this.shadowRoot
          .querySelector("ea-text")
          .setAttribute("shadow", this.getAttribute("shadow"))
      : "";
  }
  connectedCallback() {
    this.render();
  }
  render() {}
}
window.customElements.define("page-header", PageHeader);
/* --- end page-header --- */
