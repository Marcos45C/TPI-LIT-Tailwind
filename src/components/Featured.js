const API = "http://161.35.104.211:8000";
const TOKEN = "div";
const MAX_DISCOUNTS = 12;

const box = document.getElementById("ofertas");
const title = document.getElementById("h-ofertas");
if (box) box.innerHTML = `<p class="text-sm text-gray-500">Cargando ofertas…</p>`;

// no me se el tag de descuento jajajaj
const KWS = ["descuento", "oferta", "promo", "rebaja", "sale"];

// pregunta si trae tag de descuento
const isDiscount = (p) => {
  const tags = Array.isArray(p?.tags) ? p.tags : [];
  const byTag = tags
    .map(t => (t?.title ?? "").toLowerCase())
    .some(t => KWS.some(k => t.includes(k)));
  const byTitle = String(p?.title ?? "").toLowerCase();
  return byTag || KWS.some(k => byTitle.includes(k));
};

//descuento fijo de 10%
const FIXED_PERCENT = 10;
const applyFixedDiscount = (price) => {
  if (typeof price !== "number") return null;
  const newPrice = Math.round((price * (1 - FIXED_PERCENT / 100)) * 100) / 100;
  return newPrice;
};

// formato cortito por si tiene decimales muestra 2, sino entero
const fmt = (n) => (Number.isFinite(n) ? (n % 1 === 0 ? String(n) : n.toFixed(2)) : "");

// Convierte un producto "crudo" en un view model
const toCard = (p) => {
  const raw = p?.pictures?.[0];
  const img = raw
    ? (raw.startsWith("http") ? raw : API + raw)
    : "https://via.placeholder.com/400x300?text=Sin+imagen";

  // aplico siempre 10% en el apartado ofertas
  const newPrice = applyFixedDiscount(p?.price);

  return {
    id: p.id,
    title: p.title || "Producto",
    price: p.price,
    img,
    newPrice
  };
};

fetch(`${API}/products/`, {
  headers: { accept: "application/json", Authorization: "Bearer " + TOKEN },
})
  .then(r => { if (!r.ok) throw new Error(`HTTP ${r.status}`); return r.json(); })
  .then(products => {
    const list = Array.isArray(products) ? products : [];
    //detector de ofertas
    const ofertas = list.filter(isDiscount).slice(0, MAX_DISCOUNTS).map(toCard);

    if (!ofertas.length) {
      if (title) title.classList.remove("hidden");
      box.innerHTML = `<p class="text-sm text-gray-500">No hay productos en descuento.</p>`;
      return;
    }

    // HTML
    box.innerHTML = ofertas.map(p => `
      <article
        class="bg-white rounded-xl shadow p-3 hover:shadow-md transition cursor-pointer"
        onclick="location.href='ficha.html?producto=${p.id}'"
        role="link" tabindex="0"
        onkeydown="if(event.key==='Enter'){location.href='ficha.html?producto=${p.id}'}">

        <div class="relative">
          <img src="${p.img}" alt="${p.title}" class="w-full h-40 object-contain mb-2" />
          <span class="absolute top-2 left-2 text-[10px] px-2 py-1 bg-yellow-300 rounded font-semibold">
            -${FIXED_PERCENT}%
          </span>
        </div>

        <h3 class="font-semibold text-gray-800">${p.title}</h3>

        ${
          (p.newPrice != null && p.price != null)
            ? `
              <div class="mt-1 flex items-baseline gap-2">
                <span class="text-gray-500 line-through text-sm">$${fmt(p.price)}</span>
                <span class="text-emerald-600 font-bold">$${fmt(p.newPrice)}</span>
              </div>
            `
            : (p.price != null ? `<p class="text-emerald-600 font-bold">$${fmt(p.price)}</p>` : ``)
        }

        <a class="text-sm text-blue-600 hover:underline mt-1 inline-block" href="ficha.html?producto=${p.id}">
          Ir a ficha
        </a>
      </article>
    `).join("");

  })
  .catch(err => {
    console.error(err);
    box.innerHTML = `<p class="text-sm text-red-600">No se pudieron cargar las ofertas.</p>`;
  });

