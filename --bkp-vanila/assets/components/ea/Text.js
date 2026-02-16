/**
 * == [ ea-text template ]
 * == == == == == == == == == */
class Text extends HTMLElement {
  constructor() {
    super();
    let style = `
      <style ea-text_style>
        .ea-text {
          --shadow-color: #fff;
          --shadow-stroke: 10px;
          --shadow-text-color: #212329;
          --text-color: #ffab00;
        }
        .ea-text_shadow {
          position: relative;
          display: grid;
          color: var(--text-color, #fff);
          /*font-family: Baloo Da;*/
          font-size: 2.5rem;
          font-weight: bold;
          z-index: 1;
        }

        .ea-text_shadow::before {
          content: attr(data-text);
          position: absolute;
          top: 0; left: 0;
          color: var(--shadow-text-color, #00f);
          -webkit-text-stroke: 10px var( --shadow-color, #29f );
          -webkit-text-stroke-width: var( --shadow-stroke, 10px );
          -webkit-text-stroke-color: var( --shadow-color, #29f );
          filter: drop-shadow(0px 4px #0005);
          /*font-family: Baloo Da;*/
          z-index: -1; 
        }
      </style>
    `;

    const Template = `
      ${style}
      <div class="ea-text">
        <text class="ea-text_shadow" data-text=""></text>
      </div>
    `;

    let text = document.createElement("template");
    text.innerHTML = Template;

    this.attachShadow({ mode: "open" });
    this.shadowRoot.append(text.content.cloneNode(true));

    // this.style.cssText = innerCSS;
    this.Tag = this.shadowRoot.querySelector(".ea-text");
    this.text = this.shadowRoot.querySelector("text.ea-text_shadow");
    this.style = this.shadowRoot.querySelector("style[ea-text_style]");

    // shadow attributes
    this.text.style.setProperty("--shadow-color", this.getAttribute("shadow"));
    this.text.style.fontFamily = this.getAttribute("font");
    this.text.style.setProperty(
      "--shadow-stroke",
      this.getAttribute("shadow-stroke"),
    );
    this.text.style.setProperty(
      "--shadow-text-color",
      this.getAttribute("shadow-text-color"),
    );

    // text
    this.text.innerHTML = this.innerHTML;
    this.text.setAttribute("data-text", this.text.textContent);

    this.text.style.fontSize = this.getAttribute("size");

    this.text.style.margin = this.getAttribute("margin");

    this.text.style.color = this.getAttribute("color");
  }
  connectedCallback() {
    this.render();
  }
  render() {}
}
window.customElements.define("ea-text", Text);
/* --- end ea-text --- */
