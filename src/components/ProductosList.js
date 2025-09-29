import { LitElement, html } from "lit";
import "./ProductoItem.js";

// palabras para detectar oferta (por si vienen como tag o en el título)
const KWS = ["descuento", "oferta", "promo", "rebaja", "sale"];
const isDiscount = (p) => {
  const tags = Array.isArray(p?.tags) ? p.tags : [];
  const byTag = tags
    .map(t => (t?.title ?? "").toLowerCase())
    .some(t => KWS.some(k => t.includes(k)));
  const byTitle = String(p?.title ?? "").toLowerCase();
  return byTag || KWS.some(k => byTitle.includes(k));
};

class ProductosList extends LitElement {
  static properties = {
    apiUrl: { type: String, attribute: "api-url" },
    apiToken: { type: String, attribute: "api-token" },
    products: { type: Array, state: true },
    error: { type: Object, state: true },
    categoryId: { type: Number, state: true }, 
  };

  constructor() {
    super();
    this.products = [];                // trae todos los productos si no se toca categoria
    // estos dos son para filtrar segun categoria
    this.categoryId = null;
    this.producFiltrados = [];         // para guardar los productos filtrados 
  }
  handleAddToCart = (e) => {
    this.addToCart(e.detail.product);
  };

  connectedCallback() {
    super.connectedCallback();
    if (this.apiUrl && this.apiToken) {
      fetch(this.apiUrl, {
        headers: {
          accept: "application/json",
          Authorization: "Bearer " + this.apiToken,
        },
      })
        .then((res) => res.json())
        .then((products) => {
          this.products = products;
          this.producFiltrados = products; // al inicio muestra todo
        })
        .catch((err) => {
          this.error = err;
        });
    }
  }

  // funcion para filtrar
  setCategoryId(categoryId) {
    // normalizo a número por las dudas venga como string desde la URL
    const cid = Number(categoryId);
    this.categoryId = Number.isNaN(cid) ? null : cid;

    if (!this.categoryId && this.categoryId !== 0) {
      // si no hay categoria o es null, trae todo los productos
      this.producFiltrados = this.products;
    } else {
      // filtramos con category_id
      this.producFiltrados = this.products.filter((p) => Number(p.category_id) === this.categoryId);
    }
    this.requestUpdate(); // para que  reenderice y traigo los productos filtrados
  }

  createRenderRoot() {
    return this;
  }

  render() {
  if (this.error) {
    return this.renderError(this.error);
  }

  return html`
    ${this.producFiltrados.map((p) => html`
      <producto-item
        .id=${p.id}
        .title=${p.title}
        .description=${p.description}
        .picture=${(Array.isArray(p.pictures) && p.pictures.length > 0)
          ? `http://161.35.104.211:8000${p.pictures[0]}`
          : 'public/logoCenter.png'}
        .price=${p.price}
        .discount=${isDiscount(p)}
        @add-to-cart=${this.handleAddToCart}></producto-item>
    `)}
  `;
}


  addToCart(product){
    const cart = document.querySelector("cart-widget"); 
    if(cart){
      cart.addProduct(product);
    }
  }

  renderError(error) {
    return html`
      <div class="text-red-600 font-semibold">
        Error loading product: ${error.message}
      </div>
    `;
  }
}

customElements.define("productos-list", ProductosList);

