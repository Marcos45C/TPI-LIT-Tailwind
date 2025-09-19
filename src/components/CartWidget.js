import { LitElement, html, css } from "lit";

class CartWidget extends LitElement {
  static properties = {
    count: { type: Number },
    open: {type: Boolean }
  };

  constructor() {
    super();
    this.count = 0;
    this.open = false; 
    this.loadCart(); //lee localStorage
  }

  createRenderRoot() {
    return this; // para usar Tailwind
  }

  //Carga carrito desde localStorage
  loadCart() {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    this.count = cart.reduce((acc, item) => acc + item.quantity, 0);
  }

  //Guardar carrito en localStorage
  saveCart(cart) {
    localStorage.setItem("cart", JSON.stringify(cart));
    this.loadCart(); // refresca el contador
  }

  // 🔹 Método público para otros componentes
  addProduct(product) {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    const index = cart.findIndex((p) => p.id === product.id);

    if (index >= 0) {
      cart[index].quantity += 1;
    } else {
      cart.push({ ...product, quantity: 1 });
    }

    this.saveCart(cart);
  }

  render() {
  return html`
    <!-- contenedor fijo en la esquina (viewport) -->
    <div class="fixed top-4 ${this.open ? 'right-80' : 'right-4'} z-50 transition-all duration-300">
      <!-- botón circular (relative para el badge) -->
      <button
        class="bg-white shadow-lg rounded-full p-3 cursor-pointer relative flex items-center justify-center
               focus:outline-none"
        @click=${() => { this.open = !this.open }}>
        <svg xmlns="http://www.w3.org/2000/svg"
             fill="none"
             viewBox="0 0 24 24"
             stroke-width="1.5"
             stroke="currentColor"
             class="w-7 h-7 text-gray-800 hover:text-red-600">
          <path stroke-linecap="round" stroke-linejoin="round"
                d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 
                   14.25h9.75m-9.75 0a3 3 0 01-3-3V6.75h16.5v4.5a3 3 
                   0 01-3 3m-9.75 0l-1.5 6h12.75l-1.5-6m-9.75 0h9.75"/>
        </svg>

        <!-- badge contador -->
        <span
          class="absolute -top-1 -right-1 bg-red-600 text-white text-xs font-bold rounded-full
                 w-6 h-6 flex items-center justify-center">
          ${this.count}
        </span>
      </button>
    </div>
    ${this.open ? html`
  <div class="fixed top-0 right-0 w-80 h-full bg-white shadow-lg p-4 overflow-y-auto z-40">
    <h2 class="text-lg font-bold mb-4">Carrito</h2>
    ${this.renderCartItems()}
    <button 
      class="mt-4 bg-red-600 text-white px-3 py-2 rounded hover:bg-red-700"
      @click=${() => this.clearCart()}>
      Vaciar carrito
    </button>
  </div>
  ` : ''}

  `;
}
    renderCartItems() {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  if (cart.length === 0) {
    return html`<p class="text-gray-500">El carrito está vacío.</p>`;
  }
  return html`
    <ul>
      ${cart.map(item => html`
        <li class="flex justify-between items-center mb-2">
          <span>${item.title} (x${item.quantity})</span>
          <span class="font-bold text-green-600">$${item.price * item.quantity}</span>
        </li>
      `)}
    </ul>
  `;
}
    clearCart() {
  localStorage.setItem("cart", JSON.stringify([]));
  this.loadCart(); // refresca contador
}



}

customElements.define("cart-widget", CartWidget);