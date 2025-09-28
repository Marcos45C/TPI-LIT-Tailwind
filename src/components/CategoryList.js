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
        
          //aca agrege lo que pedia el enunciado, de entra a una categoria segun su id de categoria, e
        const params = new URLSearchParams(window.location.search);
        const categoriaId = params.get("categoria");
        if (categoriaId) {
          const catIdNumber = Number(categoriaId);
          this.selectedCategoryId = catIdNumber;
          const productosList = document.querySelector("productos-list");
          if (productosList) {
            productosList.setCategoryId(catIdNumber);
            
          }
        }
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
    
    //para aplicar el 'animate-pulse, guardo el id
     // este if es para cuando deselecionas la categoria, para que no quede la animacion activa 
  if (this.selectedCategoryId === cat.id) {
    this.selectedCategoryId = null;
  } else {
    // si presionaste otra categoria, le agrega la anmiacion 
    this.selectedCategoryId = cat.id;
  }
    //esta parte es para aplicar filtros, enviandole a la la funcion que esta en ProductList.js
    const productosList = document.querySelector("productos-list");
    if (productosList) {
      // al apretar de nuevo la misma categoria ,por id, se resetea todos los productos
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

    return html`
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        ${this.categories.map(
          (cat) => html`
            <div
              class="p-0 bg-gray-100 rounded-lg shadow text-center transition hover:scale-105 cursor-pointer
              ${this.selectedCategoryId === cat.id
                ? "animate-pulse bg-green-50"
                : ""}"
              @click=${() => this.handleClick(cat)}
            >
              <div>
                <img
                  src="http://161.35.104.211:8000${cat.picture}"
                  alt="${cat.title}"
                    class="w-full h-48 object-cover mx-auto mix-blend-multiply brightness-110 mb-0 rounded"
                />
              </div>
              <h2 class="text-xl font-bold text-red-700">${cat.title}</h2>
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
