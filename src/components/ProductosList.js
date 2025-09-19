import { LitElement, html, css } from 'lit';
import './ProductoItem.js';

class ProductosList extends LitElement {
    static properties = {
        apiUrl: { type: String, attribute: 'api-url' },
        apiToken: { type: String, attribute: 'api-token' },
        products: { type: Array, state: true },
        error: { type: Object, state: true }
    };

    constructor() {
        super();
        this.products = [];
        this.error = null;
    }

    connectedCallback() {
        super.connectedCallback();
        this.loadProducts();
    }

    createRenderRoot() {
        return this;
    }

    //método para cargar productos
    loadProducts(url = this.apiUrl) {
        if(!this.apiUrl || !this.apiToken) return; 
        fetch(url, {
            headers: {
                'accept': 'application/json',
                'Authorization':'Bearer ' + this.apiToken
            }
        })
        .then(res => res.json())
        .then(products => {
            console.log(products)
            this.products = products;
        })
        .catch(err => {
            this.error = err;
        });
    }
    //Método para cargar por categoría
    loadByCategory(categoryId){
        const url = `${this.apiUrl}?category=${categoryId}`;
        this.loadProducts(url);
    }

    render() {
    if (this.error) {
        return this.renderError(this.error);
    }

    return html`
        ${this.products.map(product => {
            return html`
                <producto-item 
                    id="${product.id}"
                    title="${product.title}" 
                    picture="${product.pictures && product.pictures.length > 0 
                        ? `http://161.35.104.211:8000${product.pictures[0]}` 
                        : 'https://via.placeholder.com/150?text=Sin+Imagen'}" 
                    description="${product.description}" 
                    price="${product.price}">
                </producto-item>
            `;
        })}
    `;
}

    renderError(error) {
        return html`
            <div class="text-red-600 font-semibold">Error loading product: ${error.message}</div>
        `;
    }
}

customElements.define('productos-list', ProductosList);
