import { LitElement, html } from "lit";
import "./ProductoItem.js";

// palabras para detectar oferta (por si vienen como tag o en el título) // no me se el tag jajaj
const KWS = ["descuento", "oferta", "promo", "rebaja", "sale"];

// detector de “está en oferta”
const isDiscount = (p) => {
  const tags = Array.isArray(p?.tags) ? p.tags : [];
  const byTag = tags
    .map(t => (t?.title ?? "").toLowerCase())
    .some(t => KWS.some(k => t.includes(k)));
  const byTitle = String(p?.title ?? "").toLowerCase();
  return byTag || KWS.some(k => byTitle.includes(k));
};

//descuento fijo del 10%
const FIXED_PERCENT = 10;
const applyFixedDiscount = (price) => {
  if (typeof price !== "number") return null;
  return Math.round(price * (1 - FIXED_PERCENT / 100) * 100) / 100;
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
    this.categoryId = null;            // para filtrar segun categoria
    this.producFiltrados = [];         // guardo los filtrados (ojo con el nombre como lo usabas)
  }

  // handler para el evento del hijo
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
    this.requestUpdate(); // para que re-renderice
  }

  createRenderRoot() {
    return this; // para que aplique Tailwind
  }

  render() {
    if (this.error) {
      return this.renderError(this.error);
    }

    return html`
      ${this.producFiltrados.map((product) => {
        const discountFlag = isDiscount(product);
        const salePrice = discountFlag ? applyFixedDiscount(product.price) : null;

        return html`
          <producto-item
            .id=${product.id}
            title="${product.title}"
            description="${product.description}"
            picture="${(Array.isArray(product.pictures) && product.pictures.length > 0)
              ? `http://161.35.104.211:8000${product.pictures[0]}`
              : 'public/logoCenter.png'}"
            .price=${product.price}
            .discount=${discountFlag}
            .salePrice=${salePrice}
            @add-to-cart=${this.handleAddToCart}
          ></producto-item>
        `;
      })}
    `;
  }

  addToCart(product) {
    const cart = document.querySelector("cart-widget");
    if (cart) {
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
