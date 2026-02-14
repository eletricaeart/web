class BackButton extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <button class="back-button">
        <style>
        back-button {
          display: grid;
          place-items: center;
          margin: 0;
          padding: 0;
          height: 100%;
          background: #ffab0000;
          width: 100%;
          height: 100%;
          aspect-ratio: 1;
        }
        button.back-button {
          /* font-size: 2.5rem; */
          display: grid;
          place-items: center;
          margin: 0;
          padding: 0;
          text-align: center;
          width: 100%;
          height: 100%;
          /* transform: scale(1.5); */
        }
        text#back-btn-text {
          background: #fff;
          display: grid;
          height: 100%;
          aspect-ratio: 1;
          place-items: center;
          /* transform: scale(1.5); */
        }
        svg.arrow-back {
          font-size: 1rem;
          width: 40%;
          aspect-ratio: 1;
          fill: #ffab00;
        }
        </style>
        <svg class="arrow-back" viewBox="0 0 24 24">
          <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"></path>
        </svg>
      </button>
    `;

    this.querySelector("button").addEventListener("click", () => {
      this.goBack();
    });

    this.registerNavigation();
  }

  // 🔹 Registra a página atual na pilha
  registerNavigation() {
    const currentPage = window.location.pathname.split("/").pop();

    let stack = JSON.parse(localStorage.getItem("nav_stack")) || [];

    // Evita duplicar a mesma página consecutivamente
    if (stack[stack.length - 1] !== currentPage) {
      stack.push(currentPage);
      localStorage.setItem("nav_stack", JSON.stringify(stack));
    }
  }

  // 🔹 Controla o retorno manual
  goBack() {
    let stack = JSON.parse(localStorage.getItem("nav_stack")) || [];

    // Remove página atual
    stack.pop();

    // Remove possíveis duplicatas consecutivas
    while (
      stack.length > 0 &&
      stack[stack.length - 1] === window.location.pathname.split("/").pop()
    ) {
      stack.pop();
    }

    const previousPage = stack.pop();

    localStorage.setItem("nav_stack", JSON.stringify(stack));

    if (previousPage) {
      window.location.href = previousPage;
    } else {
      // fallback seguro
      window.location.href = "dashboard.html";
    }
  }
}

customElements.define("back-button", BackButton);
