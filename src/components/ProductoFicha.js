import { LitElement, html } from "lit"; //importamos las librerías

class ProductoFicha extends LitElement {
  //declara las propiedades de ProductoFicha
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
    const params = new URLSearchParams(window.location.search); //se encarga de leer los parametros de la url
    const productId = params.get("producto"); 

    if(this.apiUrl && productId){ //Si recibió un apiUrl y hay un producto con tal id en la url
      fetch(`${this.apiUrl}${productId}`, {  //Hace un fetch del producto id
        headers: {
          accept: "application/json",
          Authorization : "Bearer " + this.apiToken
        },
      })
      .then((res) => res.json())
      .then((data) => {
        this.product = data; //Guarda el producto en 'product'
      })
      .catch((err) => {
        this.error = err; //si falla guarda el valor de 'err' en this.error
      });
    }
  }

  createRenderRoot(){
    return this; //permite usar tailwindCSS
  }
  //Busca la etiqueta <cart-widget> en el documento html
  addToCart(){
    const cart = document.querySelector("cart-widget");
    if (cart&& this.product) { //si resulta que existe, lo agrega al carrito con sus datos
      cart.addProduct({
        id: this.product.id,
        title: this.product.title,
        price: this.product.price,
        picture: "http://161.35.104.211:8000" + this.product.pictures[0],
      });
    }
  }

  render() {
    if(this.error) { //Si hay algún error muestra un mensaje en rojo
      return html`<div class="text-red-600">Error: ${this.error.message}</div>`;
    }
    if(!this.product){ //muestra en pantalla 'cargando producto...' por si aún no encontro el producto
      return html`<p class="text-gray-500">Cargando producto...</p>`;
    }
   //En el caso de existir el producto lo muestra en ficha con sus atributos
    return html`
    <!--Es la plantilla del producto invocado, con sus estilos de tailwind css-->
   <div class="bg-white shadow-lg rounded-lg overflow-hidden">
        <img 
          src="http://161.35.104.211:8000${this.product.pictures[0]}" 
          alt="${this.product.title}" 
          class="w-full h-64 object-contain p-4"
        />
        <div class="p-6">
          <h2 class="text-2xl font-bold mb-2">${this.product.title}</h2>
          <p class="text-gray-600 mb-4">${this.product.description}</p> <!--descripción color gris además del margenes que va a tener-->
          <div class="text-3xl font-semibold text-green-600 mb-6"> <!--diseña el precio, su grosor y color. También su margin y bottom-->
            $${this.product.price}
          </div>
          <button 
          <!--el botón blanco con texto negro, redondeado, con la condición de que al pasar el ratón se vuelve rojo con texto blanco-->
            class="bg-white text-black px-4 py-2 rounded hover:bg-red-600 hover:text-white transition duration-300"
            @click=${() => this.addToCart()}> <!--botón para agregar al carrito-->
            Agregar al carrito
          </button>
        </div>
      </div>
    `;
  }
}

//permite usarlo como un elemento o etiqueta en el html registrado como 'producto-ficha'
customElements.define("producto-ficha", ProductoFicha);
