
// dom.js — Mini biblioteca DOM moderna com suporte a Shadow DOM e animações

// --- [ Dom ] ---
const dom = new Proxy(document, {
  get(target, prop, receiver) {
    return Reflect.get(target, prop, receiver);
  },
  set(target, prop, value, receiver) {
    // Se for título, usa a API nativa
    if (prop === "title") {
      document.title = value;
      return true;
    }
    return Reflect.set(target, prop, value, receiver);
  }
});

// --- [ domClone ] --- 
const domClone = document.cloneNode(true);

// --- Função global $ ---
const $ = (selector, all = false, root = document) => {
  const scope = root.shadowRoot || root;
  return all
    ? scope.querySelectorAll(selector)
    : scope.querySelector(selector);
};

// --- Atalho global $$ ---
const $$ = (selector, root = document) => $(selector, true, root);

// --- Função auxiliar de transição ---
function setTransition(el, prop = 'all', duration = 300, easing = 'ease') {
  el.style.transition = `${prop} ${duration}ms ${easing}`;
}

// --- [ HTMLElement.prototype ] ---
HTMLElement.prototype.setAttributes = function( attributes ) {
  attributes.forEach( item => {
    this.setAttribute( item[0], item[1] );
  } );
};

// --- Métodos para Element ---
Object.assign(Element.prototype, {
  // Seletores internos
  $(selector, all = false) {
    const scope = this.shadowRoot || this;
    return all ? scope.querySelectorAll(selector) : scope.querySelector(selector);
  },
  $$(selector) {
    return this.$(selector, true);
  },

  // Eventos
  on(event, handler, options) {
    this.addEventListener(event, handler, options);
    return this;
  },

  // Estilos
  css(property, value) {
    if(typeof property === 'object') {
      for (const [prop, val] of Object.entries(property)) {
        this.style[prop] = val;
      }
      return this;
    }
    if(value !== undefined) {
      this.style[property] = value;
      return this;
    }
    return getComputedStyle(this)[property];
  },

  // Atributos
  attr(name, value) {
    if(value === undefined) return this.getAttribute(name);
    this.setAttribute(name, value);
    return this;
  },

  // Conteúdo
  html(content) {
    if(content === undefined) return this.innerHTML;
    this.innerHTML = content;
    return this;
  },
  text(content) {
    if(content === undefined) return this.textContent;
    this.textContent = content;
    return this;
  },
  append(content) {
    if(content instanceof Element) {
      this.appendChild(content);
    } else if(typeof content === 'string') {
      this.insertAdjacentHTML('beforeend', content);
    } else if(content instanceof NodeList || Array.isArray(content)) {
      content.forEach(el => this.append(el));
    }
    return this;
  },
  prepend(content) {
    if(content instanceof Element) {
      this.insertBefore(content, this.firstChild);
    } else if(typeof content === 'string') {
      this.insertAdjacentHTML('afterbegin', content);
    } else if(content instanceof NodeList || Array.isArray(content)) {
      [...content].reverse().forEach(el => this.prepend(el));
    }
    return this;
  },
  remove() {
    this.parentNode?.removeChild(this);
    return this;
  },
  empty() {
    this.innerHTML = '';
    return this;
  },

  // --- ✨ Animações ---
  fadeIn(duration = 300, display = 'block') {
    this.style.opacity = 0;
    this.style.display = display;
    setTransition(this, 'opacity', duration);
    requestAnimationFrame(() => (this.style.opacity = 1));
    setTimeout(() => (this.style.transition = ''), duration);
    return this;
  },
  fadeOut(duration = 300) {
    setTransition(this, 'opacity', duration);
    this.style.opacity = 1;
    requestAnimationFrame(() => (this.style.opacity = 0));
    setTimeout(() => {
      this.style.display = 'none';
      this.style.transition = '';
    }, duration);
    return this;
  },
  fadeToggle(duration = 300, display = 'block') {
    const isHidden = getComputedStyle(this).display === 'none';
    return isHidden ? this.fadeIn(duration, display) : this.fadeOut(duration);
  },
  slideUp(duration = 300) {
    const height = this.scrollHeight;
    setTransition(this, 'height, opacity', duration);
    this.style.overflow = 'hidden';
    this.style.height = `${height}px`;
    this.style.opacity = 1;
    requestAnimationFrame(() => {
      this.style.height = 0;
      this.style.opacity = 0;
    });
    setTimeout(() => {
      this.style.display = 'none';
      this.style.transition = '';
      this.style.height = '';
      this.style.overflow = '';
    }, duration);
    return this;
  },
  slideDown(duration = 300, display = 'block') {
    this.style.display = display;
    const height = this.scrollHeight;
    this.style.overflow = 'hidden';
    this.style.height = 0;
    this.style.opacity = 0;
    setTransition(this, 'height, opacity', duration);
    requestAnimationFrame(() => {
      this.style.height = `${height}px`;
      this.style.opacity = 1;
    });
    setTimeout(() => {
      this.style.transition = '';
      this.style.height = '';
      this.style.overflow = '';
    }, duration);
    return this;
  },
  slideToggle(duration = 300, display = 'block') {
    const isHidden = getComputedStyle(this).display === 'none';
    return isHidden ? this.slideDown(duration, display) : this.slideUp(duration);
  },
});

// --- Métodos para NodeList (aplicação em grupo) ---
Object.assign(NodeList.prototype, {
  on(event, handler, options) {
    this.forEach(el => el.on(event, handler, options));
    return this;
  },
  css(property, value) {
    this.forEach(el => el.css(property, value));
    return this;
  },
  attr(name, value) {
    this.forEach(el => el.attr(name, value));
    return this;
  },
  html(content) {
    this.forEach(el => el.html(content));
    return this;
  },
  text(content) {
    this.forEach(el => el.text(content));
    return this;
  },
  append(content) {
    this.forEach(el => el.append(content));
    return this;
  },
  prepend(content) {
    this.forEach(el => el.prepend(content));
    return this;
  },
  remove() {
    this.forEach(el => el.remove());
    return this;
  },
  empty() {
    this.forEach(el => el.empty());
    return this;
  },
  fadeIn(duration, display) {
    this.forEach(el => el.fadeIn(duration, display));
    return this;
  },
  fadeOut(duration) {
    this.forEach(el => el.fadeOut(duration));
    return this;
  },
  fadeToggle(duration, display) {
    this.forEach(el => el.fadeToggle(duration, display));
    return this;
  },
  slideUp(duration) {
    this.forEach(el => el.slideUp(duration));
    return this;
  },
  slideDown(duration, display) {
    this.forEach(el => el.slideDown(duration, display));
    return this;
  },
  slideToggle(duration, display) {
    this.forEach(el => el.slideToggle(duration, display));
    return this;
  },
});

