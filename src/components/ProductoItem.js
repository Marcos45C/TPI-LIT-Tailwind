import { LitElement, html } from "lit";

class ProductoItem extends LitElement {
  static properties = {
    id: { type: Number },
    title: { type: String },
    picture: { type: String },
    description: { type: String },
    price: { type: Number },
    discount: { type: Boolean }, //me dice si muestro el badge
    salePrice: { type: Number },  //precio con 10% menos
  };

  constructor() {
    super();
    this.id = 0;
    this.title = "Título del Producto";
    this.picture = "";
    this.description = "Descripción del producto";
    this.price = 0;
    this.discount = false;
    this.salePrice = null;
  }

  // static styles = css`s
  //     @import '/style.css';
  // `;

  createRenderRoot() {
    return this;
  }

  addToCart() {
    const product = {
      id: this.id,
      title: this.title,
      picture: this.picture,
      price: this.price, // en el carrito dejamos el precio base
    };
    this.dispatchEvent(
      new CustomEvent("add-to-cart", {
        detail: { product },
        bubbles: true,
        composed: true,
      })
    );
  }

  render() {
    // helper formato simple
    const fmt = (n) => (Number.isFinite(n) ? (n % 1 === 0 ? String(n) : n.toFixed(2)) : "");

    return html`
      <div class="max-w-96 shadow-lg bg-gray-100 h-full flex flex-col">
        <div class="relative">
          <img
            src="${this.picture}"
            alt="${this.title}"
            class="aspect-square w-full mix-blend-multiply brightness-110"
          />
          ${this.discount ? html`
            <span class="absolute top-2 left-2 text-[10px] px-2 py-1 bg-yellow-300 rounded font-semibold">
              -10%
            </span>` : ''}
        </div>

        <div class="flex-1 p-3 bg-white flex flex-col justify-between">
          <h2 class="text-xl font-bold mb-1">
            <a href="ficha.html?producto=${this.id}" class="hover:text-red-600">
              ${this.title}
            </a>
          </h2>

          <p class="text-gray-500 mb-2">${this.description}</p>
          ${
            (this.salePrice != null)
              ? html`
                <div class="flex items-baseline gap-2">
                  <span class="text-gray-500 line-through text-sm">$${fmt(this.price)}</span>
                  <span class="text-emerald-600 font-bold text-2xl">$${fmt(this.salePrice)}</span>
                </div>
              `
              : html`<div class="text-2xl font-semibold text-green-600">$${fmt(this.price)}</div>`
          }

          <button
            class="mt-3 bg-white text-black px-3 py-2 rounded border hover:bg-red-700 hover:text-white transition duration-300"

          //<div class="text-2xl font-semibold text-green-600">$${this.price}</div>
          //<button 
            //class="mt-3 bg-gray-200 text-black px-3 py-2 rounded border-1 border-stone-300 hover:bg-red-700 hover:text-white hover:border-0 transition duration-300"
            
            @click=${() => this.addToCart()}>
            Agregar al carrito
          </button>
        </div>
      </div>
    `;
  }

  renderError(error) {
    return html`
      <div class="text-red-600 font-semibold">
        Error loading product: ${error.message}
      </div>
    `;
  }
}

customElements.define("producto-item", ProductoItem);
