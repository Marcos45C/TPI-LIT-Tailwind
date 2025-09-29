import { LitElement, html } from "lit";
import "./ProductosList";

class CategoryList extends LitElement {
  static properties = {
    apiUrl: { type: String, attribute: "api-url" },
    apiToken: { type: String, attribute: "api-token" },
    categories: { type: Array, state: true },
    error: { type: Object, state: true },
    selectedCategoryId: { type: Number, state: true },
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
    console.log("toque la categoria", cat);
    //para aplicar el 'animate-flash, guardo el id
    this.selectedCategoryId = cat.id;

    //esta parte es para aplicar filtros, enviandole a la la funcion que esta en ProductList.js
    const productosList = document.querySelector("productos-list");
    if (productosList) {
      // al apretar de nuevo la misma categoria (por id) se resetea todos los productos
      if (productosList.categoryId === cat.id) {
        productosList.setCategoryId(null); 
      } else {
        productosList.setCategoryId(cat.id); // para filtrar por id en setCategoryId que esta en ProductList.js
      }
    }
  }

  render() {
    if (this.error) {
      return this.renderError(this.error);
    }

    // animate-ping
    // animate-bounce
    // animate-pulse
    // animate-spin
    return html`
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        ${this.categories.map(
          (cat) => html`
            <div
              class="p-4 bg-gray-100 rounded-lg shadow text-center transition hover:scale-102 cursor-pointer
              ${this.selectedCategoryId === cat.id
                ? "animate-pulse bg-green-50"
                : ""}"
              @click=${() => this.handleClick(cat)}
            >
              <div>
                <h2 class="text-xl font-bold text-gray-700">${cat.title}</h2>
                <img
                  src="http://161.35.104.211:8000${cat.picture}"
                  alt="${cat.title}"
                  class="w-1/2 object-contain mx-auto mix-blend-multiply brightness-110 mb-2"
                />
              </div>
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
