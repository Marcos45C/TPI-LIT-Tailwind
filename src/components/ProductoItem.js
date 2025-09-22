import { LitElement, html } from 'lit';

class ProductoItem extends LitElement {
    static properties = {
        id: { type: Number },
        title: { type: String },
        picture: { type: String },
        description: { type: String },
        price:{ type: Number },
    };

    constructor() {
        super();
        this.id = 0;
        this.title = 'Título del Producto';
        this.picture = '';
        this.description = 'Descripción del producto';
        this.price = 0;
    }

    // static styles = css`s
    //     @import '/style.css';
    // `;

    createRenderRoot() {
        return this;
    }

    addToCart(){
        const product = {
            id: this.id,
            title: this.title,
            picture: this.picture,
            price: this.price,
        };
        this.dispatchEvent(
            new CustomEvent("add-to-cart",{
                detail: { product },
                bubbles: true,
                composed: true
            })
        );
    }

 render() {
        return html`
      <div class="max-w-96 shadow-lg bg-gray-100 h-full flex flex-col">
        <img src="${this.picture}" alt="${this.title}" class="aspect-square w-full mix-blend-multiply brightness-110">
        <div class="flex-1 p-3 bg-white flex flex-col justify-between">
            <h2 class="text-xl font-bold mb-1">
             <a href="ficha.html?producto=${this.id}" 
             class="hover:text-red-600">${this.title}
            </a>
            </h2>
          <p class="text-gray-500 mb-2">${this.description}</p>
          <div class="text-2xl font-semibold text-green-600">$${this.price}</div>
          <button 
            class="mt-3 bg-white text-black px-3 py-2 rounded hover:bg-red-700 hover:text-white transition duration-300"
            @click=${() => this.addToCart()}>
            Agregar al carrito
          </button>
        </div>
      </div>      
     `;
 }

    renderError(error) {
        return html`
            <div class="text-red-600 font-semibold">Error loading product: ${error.message}</div>
        `;
    }
}

customElements.define('producto-item', ProductoItem);
