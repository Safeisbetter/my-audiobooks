"use strict";

const listEl = document.getElementById("list");
const searchEl = document.getElementById("search");
let books = [];

function render(filter = "") {
  const q = filter.trim().toLowerCase();
  const shown = books.filter(b =>
    !q || b.title.toLowerCase().includes(q) || (b.author || "").toLowerCase().includes(q)
  );

  listEl.textContent = "";
  if (!shown.length) {
    const p = document.createElement("p");
    p.className = "empty";
    p.textContent = "No audiobooks found.";
    listEl.appendChild(p);
    return;
  }

  for (const b of shown) {
    const card = document.createElement("article");
    card.className = "book";

    const h = document.createElement("h3");
    h.textContent = b.title;
    card.appendChild(h);

    if (b.author) {
      const a = document.createElement("p");
      a.className = "author";
      a.textContent = b.author;
      card.appendChild(a);
    }
    if (b.description) {
      const d = document.createElement("p");
      d.className = "desc";
      d.textContent = b.description;
      card.appendChild(d);
    }

    const audio = document.createElement("audio");
    audio.controls = true;
    audio.preload = "none";
    audio.src = b.file;
    card.appendChild(audio);

    const dl = document.createElement("a");
    dl.className = "download";
    dl.href = b.file;
    dl.setAttribute("download", "");
    dl.textContent = "Download";
    card.appendChild(dl);

    listEl.appendChild(card);
  }
}

searchEl.addEventListener("input", () => render(searchEl.value));

fetch("books.json", { credentials: "omit", cache: "no-cache" })
  .then(r => {
    if (!r.ok) throw new Error("HTTP " + r.status);
    return r.json();
  })
  .then(data => {
    if (!Array.isArray(data)) throw new Error("books.json must be a list");
    books = data;
    render();
  })
  .catch(() => {
    const p = document.createElement("p");
    p.className = "error";
    p.textContent = "Could not load the audiobook list.";
    listEl.appendChild(p);
  });
