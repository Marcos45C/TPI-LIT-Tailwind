import { LitElement, html } from "lit";

class ScrollSubida extends LitElement {
  static properties = {
    show: { type: Boolean, state: true },
  };

  constructor() {
    super();
    this.show = false;
    this._onScroll = this._onScroll.bind(this);
  }

  createRenderRoot() {
    return this; 
  }

  connectedCallback() {
    super.connectedCallback();
    window.addEventListener("scroll", this._onScroll);
  }

  disconnectedCallback() {
    window.removeEventListener("scroll", this._onScroll);
    super.disconnectedCallback();
  }

  _onScroll() {
    //aca se agrega la canti de pixeles que tiene que superar para que se detecte 
    this.show = window.scrollY > 750;
    this.requestUpdate();
  }

  //aca es para que suba despacio y no de una
  _scrollTop() {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  render() {
    return html`
      <button
        class="fixed bottom-6 right-6 z-50 p-3 rounded-full shadow-lg text-white bg-red-900 hover:bg-red-600 transition 
        ${this.show ? 'block' : 'hidden'}"
        @click=${this._scrollTop}
        title="subir"
      >
        ↑
      </button>
    `;
  }
}

customElements.define("scroll-subida", ScrollSubida);
