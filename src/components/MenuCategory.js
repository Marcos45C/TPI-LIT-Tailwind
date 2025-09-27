const API_BASE  = "http://161.35.104.211:8000";
const API_TOKEN = "div";
const API_CATS  = `${API_BASE}/categories/`;

// Por cada categoria genero un anchor, un item del menu
function renderCatItem(cat) {
  const name = (cat.title ?? cat.name ?? `Categoría ${cat.id}`).trim();
  return `
    <a href="#"
       data-id="${cat.id}"
       data-name="${name}"
       class="px-3 py-2 rounded-md hover:bg-gray-100 flex items-center justify-between">
      <span>${name}</span>
      <span class="text-gray-400" aria-hidden="true">›</span>
    </a>
  `;
}
// trae las categorias desde /categories
async function fetchCategories() {
  const r = await fetch(API_CATS, {
    headers: {
      accept: "application/json",
      Authorization: "Bearer " + API_TOKEN,
    },
  });
  if (!r.ok) throw new Error(`No se pudieron cargar las categorías (HTTP ${r.status})`);
  const cats = await r.json();
  // normalizamos y evitamos categorias sin id
  return cats
    .filter(c => c?.id != null)
    .map(c => ({
      id: c.id,
      title: (c.title ?? c.name ?? "").trim() || `Categoría ${c.id}`,
    }));
}
// engancha los clics del menú para invocar el filtro de <productos-list>
function wireClicks(list, panel) {
  const grid = document.querySelector("productos-list");
  const info = document.getElementById("info");

  list.addEventListener("click", (e) => {
    const a = e.target.closest('a[data-id]');
    if (!a) return;// click fuera de un item
    e.preventDefault();
    const id   = Number(a.dataset.id);
    const name = a.dataset.name || "";

    if (grid && !Number.isNaN(id)) {
      //filtro por category_id que hizo marcos
      grid.setCategoryId(id);
      if (info) info.textContent = name ? `Mostrando: ${name}` : `Mostrando categoría #${id}`;
      panel.classList.add("hidden"); // oculta panel
      grid.scrollIntoView({ behavior: "smooth", block: "start" }); //scroll
    }
  });
}
//inyecta categorias en el panel
async function mountCategoriesIntoPanel() {
  const root  = document.getElementById("cat-root");// wrapper del menú
  const panel = document.getElementById("panel-cats");// panel desplegable
  const list  = document.getElementById("cats-list");// contenedor de enlaces
  const btn   = document.getElementById("btn-cats");// botón que abre y cierra
  if (!root || !panel || !list || !btn) return;
  //logica del panel
  btn.addEventListener("click", (e) => {
    e.stopPropagation();
    panel.classList.toggle("hidden");
  });
  document.addEventListener("click", (e) => {
    if (!root.contains(e.target)) panel.classList.add("hidden");
  });

  //estado de carga
  list.innerHTML = `<span class="px-3 py-2 text-sm text-gray-500">Cargando categorías…</span>`;

  try {
    const cats = await fetchCategories();
    list.innerHTML = cats.length
      ? cats.map(renderCatItem).join("")
      : `<span class="px-3 py-2 text-sm text-gray-500">Sin categorías</span>`;

    wireClicks(list, panel);
  } catch (err) {
    console.error(err);
    list.innerHTML = `<span class="px-3 py-2 text-sm text-red-600">No se pudieron cargar las categorías</span>`;
  }
}

document.addEventListener("DOMContentLoaded", mountCategoriesIntoPanel);
