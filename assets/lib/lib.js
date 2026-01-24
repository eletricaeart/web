const webComp = {
  createComponent: (tagName, renderFn) => {
    const Klazz = class extends HTMLElement {
      constructor() {
        super();
        this.attachShadow({ mode: "open" });
      }

      // Sempre que o componente entra no DOM, ele renderiza
      connectedCallback() {
        this.update();
      }

      update(props = {}) {
        this.shadowRoot.innerHTML = renderFn(props);
      }
    };

    customElements.define(tagName, Klazz);
    return Klazz;
  },
};

/**
// 1. Define o componente
webComp.createComponent(
  "app-drawer",
  (props) => `
  <style>
    .menu-block { display: block; padding: 10px; color: #333; }
    #drawer_menu { border: 1px solid #ccc; background: white; }
  </style>
  
  <div id="drawer_menu">
    ${(props.links || []).map((l) => `<a href="${l.url}" class="menu-block">${l.name}</a>`).join("")}
    <button id="closeMenu">FECHAR</button>
  </div>
`,
);

// 2. Instancia e usa
const drawer = document.createElement("app-drawer");
document.body.appendChild(drawer);

// 3. Passa os dados (usando o método update que criamos)
drawer.update({
  links: [
    { name: "Início", url: "/" },
    { name: "Configurações", url: "/settings" },
  ],
});

// use in html
<app-drawer></app-drawer>;
*/
