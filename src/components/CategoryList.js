import { LitElement, html } from "lit";

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


  //agregar para que cuando presione una categoria , muestre sus productos

  render() {
    if (this.error) {
      return this.renderError(this.error);
    }

    return html`
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        ${this.categories.map(
          (cat) => html`
            <div class="p-4 bg-gray-100 rounded-lg shadow text-center">
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
