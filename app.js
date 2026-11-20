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
    if (books.length) {
      const p = document.createElement("p");
      p.className = "empty";
      p.textContent = "Nothing matches that search.";
      listEl.appendChild(p);
      return;
    }
    // Empty shelf: three dashed placeholders until the first audiobook is added.
    for (let i = 0; i < 3; i++) {
      const slot = document.createElement("div");
      slot.className = "slot";
      const t = document.createElement("p");
      t.textContent = i === 0 ? "Your first audiobook goes here" : "Coming soon";
      slot.appendChild(t);
      listEl.appendChild(slot);
    }
    return;
  }

  shown.forEach((b, i) => {
    const card = document.createElement("article");
    card.className = "book tone-" + (i % 5);

    const cover = document.createElement("div");
    cover.className = "cover";
    cover.setAttribute("aria-hidden", "true");
    cover.textContent = (b.title || "?").trim().charAt(0).toUpperCase();
    card.appendChild(cover);

    const body = document.createElement("div");
    body.className = "info";

    const h = document.createElement("h3");
    h.textContent = b.title;
    body.appendChild(h);

    if (b.author) {
      const a = document.createElement("p");
      a.className = "author";
      a.textContent = b.author;
      body.appendChild(a);
    }

    // Optional listening details: narrator, length, and licence.
    const facts = [];
    if (b.narrator) facts.push("Narrated by " + b.narrator);
    if (b.duration) facts.push(b.duration);
    if (b.license) facts.push(b.license);
    if (facts.length) {
      const meta = document.createElement("ul");
      meta.className = "meta";
      for (const f of facts) {
        const li = document.createElement("li");
        li.textContent = f;
        meta.appendChild(li);
      }
      body.appendChild(meta);
    }
    if (b.description) {
      const d = document.createElement("p");
      d.className = "desc";
      d.textContent = b.description;
      body.appendChild(d);
    }

    const audio = document.createElement("audio");
    audio.controls = true;
    audio.preload = "none";
    audio.src = b.file;
    body.appendChild(audio);

    const dl = document.createElement("a");
    dl.className = "download";
    dl.href = b.file;
    dl.setAttribute("download", "");
    dl.textContent = "Download";
    body.appendChild(dl);

    card.appendChild(body);
    listEl.appendChild(card);
  });
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
