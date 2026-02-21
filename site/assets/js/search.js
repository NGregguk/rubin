const searchPage = document.querySelector("[data-enhance='search']");

if (searchPage) {
  const rootPath = (document.documentElement.dataset.siteRoot || ".").replace(/\/?$/, "/");
  const discoveriesBase = (document.body.dataset.discoveriesBase || "../discoveries/").replace(/\/?$/, "/");
  const input = document.querySelector("#search-query");
  const results = document.querySelector("#search-results");
  const status = document.querySelector("#search-status");
  const dataUrl = `${rootPath}assets/data/discoveries.json`;

  let discoveries = [];
  let debounceId;

  const formatDate = (value) =>
    new Date(value).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric"
    });

  const getHref = (item) =>
    item.hasDetailPage
      ? `${discoveriesBase}${item.slug}/index.html`
      : `${discoveriesBase}index.html?q=${encodeURIComponent(item.title)}`;

  const searchEntries = (query) => {
    const clean = query.trim().toLowerCase();
    if (!clean) {
      return [];
    }

    return discoveries.filter((item) => {
      const haystack = `${item.title} ${item.summary} ${item.type} ${item.tags.join(" ")}`.toLowerCase();
      return haystack.includes(clean);
    });
  };

  const render = (matches) => {
    results.innerHTML = "";

    if (!matches.length) {
      status.textContent = "No entries match your search.";
      return;
    }

    const list = document.createElement("div");
    list.className = "card-grid";

    matches.forEach((item) => {
      const card = document.createElement("article");
      card.className = "discovery-card";

      const badge = document.createElement("span");
      badge.className = "badge";
      badge.textContent = item.type;
      card.appendChild(badge);

      const heading = document.createElement("h3");
      const link = document.createElement("a");
      link.href = getHref(item);
      link.textContent = item.title;
      heading.appendChild(link);
      card.appendChild(heading);

      const meta = document.createElement("p");
      meta.className = "discovery-card__meta";
      meta.textContent = `Observed: ${formatDate(item.dateObserved)}`;
      card.appendChild(meta);

      const summary = document.createElement("p");
      summary.textContent = item.summary;
      card.appendChild(summary);

      list.appendChild(card);
    });

    status.textContent = `${matches.length} result${matches.length === 1 ? "" : "s"} found.`;
    results.appendChild(list);
  };

  const runSearch = () => {
    const query = input.value || "";
    if (!query.trim()) {
      results.innerHTML = "";
      status.textContent = "Type a keyword to search the sample catalogue.";
      return;
    }
    const matches = searchEntries(query);
    render(matches);
  };

  fetch(dataUrl)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Could not load catalogue.");
      }
      return response.json();
    })
    .then((items) => {
      discoveries = Array.isArray(items) ? items : [];
      const params = new URLSearchParams(window.location.search);
      if (params.has("q")) {
        input.value = params.get("q");
        runSearch();
      } else {
        status.textContent = "Type a keyword to search the sample catalogue.";
      }
    })
    .catch(() => {
      status.textContent = "Search enhancement unavailable. Use the browse links above.";
    });

  input?.addEventListener("input", () => {
    clearTimeout(debounceId);
    debounceId = window.setTimeout(runSearch, 150);
  });
}
