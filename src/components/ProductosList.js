import { LitElement, html } from "lit";
import "./ProductoItem.js";

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
    this.products = []; //trae todos los productos si no se toca categoria
    //estos dos son para filtrar segun categoria
    this.categoryId = null;
    this.producFiltrados = [];// para guardar los productos filtrados 
}

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

  ///para filtrar
  // funcion para filtrar
setCategoryId(categoryId) {
    this.categoryId = categoryId;
    if (!categoryId) {
      // si no hay categoria , trae todo los productos
      this.producFiltrados = this.products;
    } else {
      // filtramos con category_id
      this.producFiltrados = this.products.filter((p) => p.category_id === categoryId);
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
      ${this.producFiltrados.map(
        (product) => html`
          <producto-item
            .id="${product.id}"
            title="${product.title}"
            picture="${product.pictures && product.pictures.length > 0 
                        ? `http://161.35.104.211:8000${product.pictures[0]}` 
                        : 'public/logoCenter.png'}" 
            price="${product.price}"
            @add-to-cart=${(e) => this.addToCart(e.detail.product)}
          >
          </producto-item>
        `
      )}
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
