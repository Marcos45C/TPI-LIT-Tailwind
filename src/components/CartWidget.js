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

  //Método público para otros componentes
  addProduct(product) {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    const index = cart.findIndex(p => p.id === product.id);
    if (index >= 0) {
      cart[index].quantity += 1;
    } else {
      cart.push({ ...product, quantity: 1 });
    }
    this.saveCart(cart);
  }

  render() {
  return html`
    <!-- contenedor carrito (viewport) -->
    <div class="fixed top-4 ${this.open ? 'sm:right-[24rem]' : 'right-4'} z-50 transition-all duration-300">
      <!-- botón circular (relative para el badge) -->
      <button
        class="group bg-white shadow-lg rounded-full p-3 cursor-pointer relative flex items-center justify-center"
        @click=${() => { this.open = !this.open }}> <!--abre y cierra el aside-->
        <svg xmlns="http://www.w3.org/2000/svg" 
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="w-7 h-7 text-gray-800 group-hover:text-red-600">
          <path stroke-linecap="round" stroke-linejoin="round"
                d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 
                  14.25h9.75m-9.75 0a3 3 0 01-3-3V6.75h16.5v4.5a3 3 
                  0 01-3 3m-9.75 0l-1.5 6h12.75l-1.5-6m-9.75 0h9.75"/>
        </svg>
        <!--badge contador -->
        ${this.count > 0 ? html`
         <span class="absolute -top-1 -right-1 bg-red-600 text-white text-xs font-bold rounded-full
               w-6 h-6 flex items-center justify-center">
           ${this.count}
         </span>
        ` : ''}
      </button>
    </div>

    <!--PANEL LATERAL-->
    ${this.open ? html`
      <div class="fixed top-0 right-0 w-[90vw] max-w-sm h-full bg-white shadow-lg p-4 overflow-y-auto z-40">
        <h2 class="text-lg font-bold mb-4 mt-10">Carrito</h2>
        ${this.renderCartItems()}
        <!--Muestra el total de los productos en el carrito-->
        <div class="mt-4 text-right text-xl font-bold text-gray-700">
          Total: $${this.totalSum()}
        </div>
        <!--Boton pagar, recarga la pagina-->
        <div class="mt-6 flex justify-center">
        <button 
          class="w-full max-w-xs mx-4 bg-red-700 text-white px-30 py-2 rounded hover:bg-red-600"
          @click=${() => location.reload()}> 
          Pagar
        </button>
      </div>
  ` : ''}
`;
}

//Carga los productos, muestra sus precios y cantidad además del titulo. 
renderCartItems() {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  if (cart.length === 0) {
    return html`<p class="text-gray-500">El carrito está vacío.</p>`;
  }
  return html`
    <ul class="space-y-4">
      ${cart.map(item => html`
        <li class="flex flex-row items-start justify-between gap-4 border-b pb-4">
         <!--IMG, TITULO, PRECIO UNIT, ELIMINAR--> 
         <div class= "flex items-center gap-4">
            <img src="${item.picture}" alt="${item.title}" class="w-16 h-16 object-contai rounded"/>
            <div>
             <div class="font-semibold text-gray-800">${item.title}</div>
             <div class="text-sm text-gray-500">$${item.price}</div>
             <!--boton para eliminar producto-->
             <button @click=${() => this.removeItem(item.id)} 
               class="text-gray-500 hover:text-red-600 mt-1" title="Eliminar">
               <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewbox="0 0 24 24"
                    stroke-width="2" stroke="currentColor" class="w-5 h-5">
                  <path stroke-linecap="round" stroke-linejoin="round"
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
               </svg>
             </button>
            </div>
          </div>

          <!--PRECIO TOTAL, BOTONES CANTIDAD-->
          <div class="flex flex-col items-end gap-2">
            <span class="font-bold text-green-600">$${item.price * item.quantity}</span>
            <div class="inline-flex items_center border border-gray-300 rounded-md overflow-hidden">
              <!--botón para remover de a uno-->
              <button @click=${() => this.removeOne(item.id)}
                class="bg-gray-300 text-gray-800 px-3 py-1 text-sm hover:bg-gray-200 ">-</button>
              <span class="px-4 py-1 text-sm text-gray-700 font-medium bg-white">${item.quantity}</span>
              <!--este es el botón de sumar-->
              <button @click=${() => this.addOne(item.id)}
               class="bg-gray-300 text-gray-800 px-3 py-1 text-sm hover:bg-gray-200">+</button>
            </div>
          </div>
        </li>
      `)}
    </ul>
  `;
}
removeOne(id){
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  const index = cart.findIndex(p => p.id === id);
  if(index >= 0){
    //Si la cantidad del producto es mayor a uno, entra en el if
    if(cart[index].quantity > 1){
      cart[index].quantity -=1; //Resta uno
    } else {cart.splice(index, 1); //Elimina el producto
      }
      this.saveCart(cart); //Actualiza el localStorage 
  }
}
addOne(id){
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  const index = cart.findIndex(p => p.id === id);
  if(index >= 0){
    cart[index].quantity += 1; //suma uno
    this.saveCart(cart); //actualiza
  }
}

removeItem(id){ //elimina producto
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  cart = cart.filter(item => item.id !=id);
  this.saveCart(cart);
}

totalSum(){
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  return cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
}
    
} 
customElements.define("cart-widget", CartWidget);