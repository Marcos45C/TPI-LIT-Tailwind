import { LitElement, html } from "lit";

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
    this.selectedCategoryId = null;
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
    return this; // pa que aplique Tailwind en el HTML
  }

  // funcion para mostrar la categoria apretada y mandarle a productos-list
  handleClick(cat) {
    // marco la card para el pulso un instante
    this.selectedCategoryId = cat?.id ?? null;

    // mando a listado y allA se filtra con grid.setCategoryId(...)
    window.location.href = `listado.html?categoria=${cat.id}`;
  }

  render() {
    if (this.error) {
      return this.renderError(this.error);
    }

    return html`
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        ${this.categories.map((cat) => html`
          <!-- Envolvemos cada tarjeta en <a> por accesibilidad y backup si falla JS -->
          <a href="listado.html?categoria=${cat.id}" class="block group"
             @click=${(e) => { e.preventDefault(); this.handleClick(cat); }}>
            <div
              class="p-0 bg-gray-100 rounded-lg shadow text-center transition hover:scale-105 cursor-pointer
              ${this.selectedCategoryId === cat.id ? "animate-pulse bg-green-50" : ""}">
              <div>
                <img
                  src="http://161.35.104.211:8000${cat.picture}"
                  alt="${cat.title}"
                  class="w-full h-48 object-cover mx-auto mix-blend-multiply brightness-110 mb-0 rounded"
                />
              </div>
              <h2 class="text-xl font-bold text-red-700">${cat.title}</h2>
            </div>
          </a>
        `)}
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
src/components/MenuCategory.js