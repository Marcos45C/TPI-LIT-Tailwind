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

  connectedCallback(){
    super.connectedCallback();
    const params = new URLSearchParams(window.location.search);
    const productId = params.get("producto"); 

    if(this.apiUrl && productId){
      fetch(`${this.apiUrl}${productId}`, {
        headers: {
          accept: "application/json",
          Authorization : "Bearer " + this.apiToken
        },
      })
      .then((res) => res.json())
      .then((data) => {
        this.product = data;
      })
      .catch((err) => {
        this.error = err;
      });
    }
  }

  createRenderRoot(){
    return this;
  }

  addToCart(){
    const cart = document.querySelector("cart-widget");
    if (cart&& this.product) {
      cart.addProduct({
        id: this.product.id,
        title: this.product.title,
        price: this.product.price,
        picture: "http://161.35.104.211:8000" + this.product.pictures[0],
      });
    }
  }

  render() {
    if(this.error) {
      return html`<div class="text-red-600">Error: ${this.error.message}</div>`;
    }
    if(!this.product){
      return html`<p class="text-gray-500">Cargando producto...</p>`;
    }

    return html`
   <div class="bg-white shadow-lg rounded-lg overflow-hidden">
        <img 
          src="http://161.35.104.211:8000${this.product.pictures[0]}" 
          alt="${this.product.title}" 
          class="w-full h-64 object-contain p-4"
        />
        <div class="p-6">
          <h2 class="text-2xl font-bold mb-2">${this.product.title}</h2>
          <p class="text-gray-600 mb-4">${this.product.description}</p>
          <div class="text-3xl font-semibold text-green-600 mb-6">
            $${this.product.price}
          </div>
          <button 
            class="bg-white text-black px-4 py-2 rounded border hover:bg-red-600 hover:text-white transition duration-300"
            @click=${() => this.addToCart()}>
            Agregar al carrito
          </button>
        </div>
      </div>
    `;
  }
}


customElements.define("producto-ficha", ProductoFicha);
