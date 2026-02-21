const discoveryPage = document.querySelector("[data-enhance='discoveries']");

if (discoveryPage) {
  const rootPath = (document.documentElement.dataset.siteRoot || ".").replace(/\/?$/, "/");
  const discoveriesBase = (document.body.dataset.discoveriesBase || "./").replace(/\/?$/, "/");
  const form = document.querySelector("#discovery-filters");
  const typeField = document.querySelector("#filter-type");
  const textField = document.querySelector("#filter-text");
  const sortField = document.querySelector("#filter-sort");
  const baseline = document.querySelector("#discoveries-baseline");
  const results = document.querySelector("#discoveries-results");
  const status = document.querySelector("#filter-status");
  const dataUrl = `${rootPath}assets/data/discoveries.json`;

  let allItems = [];

  const formatDate = (value) =>
    new Date(value).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric"
    });

  const hasDetailPage = (item) => Boolean(item.hasDetailPage);

  const createTitle = (item) => {
    if (!hasDetailPage(item)) {
      const plain = document.createElement("span");
      plain.textContent = item.title;
      return plain;
    }

    const link = document.createElement("a");
    link.href = `${discoveriesBase}${item.slug}/index.html`;
    link.textContent = item.title;
    return link;
  };

  const renderCards = (items) => {
    results.innerHTML = "";
    const grid = document.createElement("div");
    grid.className = "card-grid";

    items.forEach((item) => {
      const article = document.createElement("article");
      article.className = "discovery-card";

      const badge = document.createElement("span");
      badge.className = "badge";
      badge.textContent = item.type;
      article.appendChild(badge);

      const title = document.createElement("h3");
      title.appendChild(createTitle(item));
      article.appendChild(title);

      const meta = document.createElement("p");
      meta.className = "discovery-card__meta";
      meta.textContent = `Observed: ${formatDate(item.dateObserved)}`;
      article.appendChild(meta);

      const summary = document.createElement("p");
      summary.textContent = item.summary;
      article.appendChild(summary);

      const why = document.createElement("p");
      const whyStrong = document.createElement("strong");
      whyStrong.textContent = "Why it matters: ";
      why.appendChild(whyStrong);
      why.append(item.whyItMatters);
      article.appendChild(why);

      if (!hasDetailPage(item)) {
        const note = document.createElement("p");
        note.className = "status-line";
        note.textContent = "Detail page pending. This is a catalogue placeholder entry.";
        article.appendChild(note);
      }

      grid.appendChild(article);
    });

    results.appendChild(grid);
    results.hidden = false;
  };

  const readState = () => {
    const search = (textField?.value || "").trim().toLowerCase();
    const type = typeField?.value || "all";
    const sort = sortField?.value || "newest";
    return { search, type, sort };
  };

  const sortItems = (items, sort) => {
    const sorted = [...items];
    if (sort === "oldest") {
      sorted.sort((a, b) => new Date(a.dateObserved) - new Date(b.dateObserved));
      return sorted;
    }

    if (sort === "title") {
      sorted.sort((a, b) => a.title.localeCompare(b.title));
      return sorted;
    }

    sorted.sort((a, b) => new Date(b.dateObserved) - new Date(a.dateObserved));
    return sorted;
  };

  const applyFilters = () => {
    const { search, type, sort } = readState();
    const filtered = allItems.filter((item) => {
      const typeMatches = type === "all" || item.type === type;
      const textMatches =
        search.length === 0 ||
        item.title.toLowerCase().includes(search) ||
        item.summary.toLowerCase().includes(search) ||
        item.tags.join(" ").toLowerCase().includes(search);
      return typeMatches && textMatches;
    });

    const finalItems = sortItems(filtered, sort);
    renderCards(finalItems);
    status.textContent = `${finalItems.length} discovery entries shown.`;
  };

  const syncFromQuery = () => {
    const params = new URLSearchParams(window.location.search);
    if (typeField && params.has("type")) {
      typeField.value = params.get("type");
    }
    if (textField && params.has("q")) {
      textField.value = params.get("q");
    }
    if (sortField && params.has("sort")) {
      sortField.value = params.get("sort");
    }
  };

  fetch(dataUrl)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Could not load discoveries data.");
      }
      return response.json();
    })
    .then((items) => {
      allItems = Array.isArray(items) ? items : [];
      if (baseline) {
        baseline.hidden = true;
      }
      syncFromQuery();
      applyFilters();
      form?.addEventListener("input", applyFilters);
      form?.addEventListener("change", applyFilters);
    })
    .catch(() => {
      status.textContent = "Enhanced filtering unavailable. Browse the categories below.";
      if (results) {
        results.hidden = true;
      }
      if (baseline) {
        baseline.hidden = false;
      }
    });
}
