import { LitElement, html } from "lit";

class ProductoFicha extends LitElement {
  static properties = {
    apiUrl: { type: String, attribute: "api-url" },
    apiToken: { type: String, attribute: "api-token" },
    product: { type: Object, state: true },
    error: { type: Object, state: true }
  };

  constructor() {
    super();
    this.product = null;
    this.error = null;
  }

  createRenderRoot() {
    return this; // para que funcione con Tailwind
  }

  connectedCallback() {
    super.connectedCallback();
    const params = new URLSearchParams(window.location.search);
    const productId = params.get("product");
    if (productId) {
      this.loadProduct(productId);
    }
  }

  // Cargar producto por ID
  loadProduct(id) {
    fetch(`${this.apiUrl}${id}`, {
      headers: {
        "accept": "application/json",
        "Authorization": "Bearer " + this.apiToken
      }
    })
      .then(res => res.json())
      .then(product => {
        this.product = product;
      })
      .catch(err => {
        this.error = err;
      });
  }

  addToCart(product) {
    const cartWidget = document.querySelector("cart-widget");
    if (cartWidget) {
      cartWidget.addProduct({
        id: product.id,
        title: product.title,
        price: product.price,
        picture: product.pictures?.[0] 
          ? `http://161.35.104.211:8000${product.pictures[0]}`
          : ""
      });
    }
  }

  render() {
    if (this.error) {
      return html`<p class="text-red-600">Error: ${this.error.message}</p>`;
    }
    if (!this.product) {
      return html`<p class="text-gray-500">Cargando producto...</p>`;
    }

    const product = this.product;

    return html`
      <div class="bg-white shadow-lg rounded-lg overflow-hidden">
        <img src="${product.pictures && product.pictures.length > 0 
            ? `http://161.35.104.211:8000${product.pictures[0]}` 
            : 'https://via.placeholder.com/300?text=Sin+Imagen'}" 
             alt="${product.title}" 
             class="w-full h-64 object-contain bg-gray-100">

        <div class="p-6">
          <h2 class="text-2xl font-bold mb-2">${product.title}</h2>
          <p class="text-gray-600 mb-4">${product.description}</p>
          <div class="text-3xl font-semibold text-green-600 mb-4">
            $${product.price}
          </div>
          <button 
          {/* el botón blanco con texto negro, redondeado, con la condición de que al pasar el ratón se vuelve rojo con texto blanco */}
            class="bg-gray-200 text-black px-4 py-2 rounded border-2 border-stone-300 hover:bg-red-600 hover:text-white transition duration-300"
            @click=${() => this.addToCart()}> <!--botón para agregar al carrito-->
            Agregar al carrito
          </button>
        </div>
      </div>
    `;
  }
}

customElements.define("producto-ficha", ProductoFicha);
