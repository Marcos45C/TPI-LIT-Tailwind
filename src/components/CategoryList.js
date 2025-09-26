import { LitElement, html } from "lit";
import './ProductosList'

class CategoryList extends LitElement {
  static properties = {
    apiUrl: { type: String, attribute: "api-url" },
    apiToken: { type: String, attribute: "api-token" },
    categories: { type: Array, state: true },
    error: { type: Object, state: true },
  };

  constructor() {
    super();
    this.categories = [];
    this.error = null;
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
        .then((categories) => {
          this.categories = categories;
        })
        .catch((err) => {
          this.error = err;
        });
    }
  }
  
  createRenderRoot() {
    return this; // pa que aplique Tailwind
  }
  // funcion para mostrar la categoria apretada y mandarle a productos-list
  handleClick(cat) {
  console.log('toque la categoria',cat);
  const productosList = document.querySelector("productos-list");
  if (productosList) {
    productosList.setCategoryId(cat.id);
  }
}

  render() {
    if (this.error) {
      return this.renderError(this.error);
    }
    

    return html`
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        ${this.categories.map(
          (cat) => html`
            <div class="p-4 bg-gray-100 rounded-lg shadow text-center transition hover:scale-102" @click=${() => this.handleClick(cat)}> 
              <div>
              <h2 class="text-xl font-bold text-gray-700">${cat.title}</h2>
              </div>
          `
        )}
      </div>
    `;
  }

  renderError(error) {
    return html`
      <div class="text-red-600 font-semibold">
        Error loading categories: ${error.message}
      </div>
    `;
  }
}

customElements.define("category-list", CategoryList);
