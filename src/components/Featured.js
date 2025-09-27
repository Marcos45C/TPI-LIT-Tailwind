const API   = "http://161.35.104.211:8000";
const TOKEN = "div";

// aca hay q poner los id de los item a destacar
const FEATURED_IDS = [];
const MAX = 8; //limite de cuantos puedo mostrar

const box = document.getElementById("destacados");
if (!box) return;

box.innerHTML = `<p class="text-sm text-gray-500">Cargando destacados…</p>`;
//pido productos a la api
fetch(`${API}/products/`, {
  headers: {
    accept: "application/json",
    Authorization: "Bearer " + TOKEN,
  },
})
  .then(r => {
    if (!r.ok) throw new Error(`HTTP ${r.status}`);
    return r.json();
  })
  .then(products => {
    //filtro los id que les di FEATURED_ID
    const destacados = (products || [])
      .filter(p => FEATURED_IDS.includes(p?.id))
      .slice(0, MAX);

    if (!destacados.length) { //si no hay nada muestra en pantalla
      box.innerHTML = `<p class="text-sm text-gray-500">No hay productos destacados configurados.</p>`;
      return;
    }

    box.innerHTML = destacados.map(p => { //armo html de cada producto
      const title = p?.title ?? "Producto";
      const price = (p?.price != null) ? `$${p.price}` : "";
      const img = (Array.isArray(p?.pictures) && p.pictures.length)
        ? `${API}${p.pictures[0]}`
        : "https://via.placeholder.com/400x300?text=Sin+imagen";
      const fichaHref = `ficha.html?producto=${p.id}`; //url lleva a ficha
            //devuelo con tailwind para el estilo
      return `
        <article class="bg-white rounded-xl shadow p-3 hover:shadow-md transition">
          <div class="relative">
            <img src="${img}" alt="${title}" class="w-full h-40 object-contain mb-2" />
            <span class="absolute top-2 left-2 text-[10px] px-2 py-1 bg-yellow-300 rounded font-semibold">Destacado</span>
          </div>
          <h3 class="font-semibold text-gray-800">${title}</h3>
          <p class="text-emerald-600 font-bold">${price}</p>
          <a class="text-sm text-blue-600 hover:underline" href="${fichaHref}">Ir a ficha</a>
        </article>
      `;
    }).join(""); //uno en un solo string
  })
  .catch(err => {
    console.error(err);
    box.innerHTML = `<p class="text-sm text-red-600">No se pudieron cargar los destacados.</p>`; //por si algo falla
  });
