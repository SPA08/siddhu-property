/**
 * SIDDHU Property Advisor - Categorized Product Search & Map Synchronization
 */

document.addEventListener("DOMContentLoaded", () => {
  const searchTrigger = document.getElementById("headerSearchBarTrigger");
  const searchOverlay = document.getElementById("searchOverlay");
  const searchInput = document.getElementById("searchModalInput");
  const closeBtn = document.getElementById("closeSearchBtn");
  const resultsContainer = document.getElementById("searchResults");

  if (!searchTrigger || !searchOverlay || !searchInput || !resultsContainer) return;

  // Build the unified search index
  function buildSearchIndex() {
    const index = [];

    // 1. Guides & Informational Pages
    const guideItems = [
      { category: "GUIDE", title: "Property Buying Guide (5-Step Due Diligence)", url: "property-buying-guide.html", desc: "Step-by-step verification, registry checks, and legal safeguards." },
      { category: "GUIDE", title: "Chichawatni City Guide & Overview", url: "chichawatni-city-guide.html", desc: "Local residential neighborhoods, road networks, and master planning." },
      { category: "GUIDE", title: "PLRA Land Records & Fard Guide", url: "chichawatni-land-records-plra-guide.html", desc: "How to obtain computerised Fard and verify khewat/khasra numbers." },
      { category: "GUIDE", title: "FBR Property Valuation Table", url: "fbr-property-valuation-chichawatni.html", desc: "Official residential and commercial valuation rates in Chichawatni." },
      { category: "GUIDE", title: "Commercial Property Guide", url: "chichawatni-commercial-property-guide.html", desc: "Bazaars, commercial shops, and high-yield investment locations." },
      { category: "GUIDE", title: "Hospitals & Healthcare Directory", url: "chichawatni-hospitals-guide.html", desc: "THQ Hospital, emergency clinics, and medical centers." },
      { category: "GUIDE", title: "Schools & Colleges Directory", url: "chichawatni-schools-guide.html", desc: "Educational institutes, colleges, and training academies." },
      { category: "GUIDE", title: "Roads & Highways Guide", url: "chichawatni-roads-guide.html", desc: "N-5 National Highway, Burewala Road, and bypass connectivity." },
      { category: "GUIDE", title: "History & 1913 Irrigated Forest Heritage", url: "chichawatni-history-heritage.html", desc: "Historic foundation, sub-division heritage, and regional timeline." },
      { category: "GUIDE", title: "Chichawatni City Facts & Encyclopedia", url: "chichawatni-city-facts.html", desc: "Key facts, demographics, and public services." }
    ];
    guideItems.forEach(g => index.push({ ...g, id: g.title, isGuide: true }));

    // 2. Verified Directory Data
    if (typeof DIRECTORY_DATA !== 'undefined' && Array.isArray(DIRECTORY_DATA)) {
      DIRECTORY_DATA.forEach(item => {
        let category = "AREA";
        if (item.type === "PROPERTY" || item.type === "PROPERTY_REFERENCE") {
          category = "PROPERTY";
        } else if (item.type === "PROPERTY_RECORD") {
          category = "PROPERTY & LAND RECORDS";
        } else if (item.type === "PUBLIC_SERVICE") {
          category = "PUBLIC SERVICE";
        } else if (item.type === "GOVERNMENT_OFFICE") {
          category = "GOVERNMENT OFFICE";
        } else if (item.type === "PROPERTY_DEALER" || item.type === "REAL_ESTATE_AGENCY") {
          category = "PROPERTY ADVISOR";
        } else if (["HOUSE_BUILDER", "CONSTRUCTION_COMPANY", "BUILDING_MATERIAL"].includes(item.type)) {
          category = "BUILDER & CONTRACTOR";
        } else if (["SCHOOL", "MOSQUE", "LANDMARK"].includes(item.type)) {
          category = "EDUCATION & LANDMARKS";
        } else if (item.type === "STREET") {
          category = "STREET";
        }

        let desc = item.services || item.address || item.parentChak || "Chichawatni";
        if (item.legalStatus === "APPROVED_VERIFIED") {
          desc += " Ã¢â‚¬Â¢ Verified Record";
        }

        index.push({
          id: item.id,
          name: item.name,
          category: category,
          title: item.name,
          desc: desc,
          phone: item.phone,
          address: item.address,
          hasMap: !!(item.latitude && item.longitude),
          aliases: item.aliases || [],
          raw: item
        });
      });
    }

    return index;
  }

  const searchIndex = buildSearchIndex();

  function openSearch() {
    searchOverlay.classList.add("active");
    setTimeout(() => searchInput.focus(), 80);
    renderResults("");
  }

  function closeSearch() {
    searchOverlay.classList.remove("active");
    searchInput.value = "";
  }

  searchTrigger.addEventListener("click", openSearch);
  closeBtn.addEventListener("click", closeSearch);
  
  searchOverlay.addEventListener("click", (e) => {
    if (e.target === searchOverlay) closeSearch();
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && searchOverlay.classList.contains("active")) {
      closeSearch();
    }
    if ((e.metaKey || e.ctrlKey) && e.key === "k") {
      e.preventDefault();
      openSearch();
    }
  });

  function renderResults(query) {
    const q = query.toLowerCase().trim();

    if (!q) {
      resultsContainer.innerHTML = `
        <div class="search-empty-state">
          <i class="fa-solid fa-compass" style="font-size: 2rem; color: var(--primary-accent); margin-bottom: 12px; display: block;"></i>
          <p style="font-weight: 600; color: var(--color-text);">Search Chichawatni Local Data & Properties</p>
          <p style="font-size: 0.85rem; color: var(--color-muted); margin-top: 4px;">Type an area (e.g., <em>Hayat Abad</em>, <em>Model Town</em>), property size (<em>5 Marla</em>, <em>10 Marla</em>), public office (<em>Arazi Record Center</em>, <em>Rescue 1122</em>), or advisor.</p>
        </div>
      `;
      return;
    }

    const matched = searchIndex.filter(item => {
      if (item.title.toLowerCase().includes(q)) return true;
      if (item.desc && item.desc.toLowerCase().includes(q)) return true;
      if (item.category.toLowerCase().includes(q)) return true;
      if (item.phone && item.phone.includes(q)) return true;
      if (item.address && item.address.toLowerCase().includes(q)) return true;
      if (item.aliases && item.aliases.some(a => a.includes(q))) return true;
      return false;
    });

    if (matched.length === 0) {
      resultsContainer.innerHTML = `
        <div class="search-empty-state">
          <p style="font-weight: 600; color: var(--color-text);">No matching records found for "${query}"</p>
          <p style="font-size: 0.85rem; color: var(--color-muted); margin-top: 6px;">Try searching for "Hayat Abad", "Model Town", "Arazi Record", "THQ", or "5 Marla".</p>
        </div>
      `;
      return;
    }

    // Group matched results by Category
    const categoryOrder = [
      "AREA",
      "PROPERTY",
      "PROPERTY & LAND RECORDS",
      "PUBLIC SERVICE",
      "GOVERNMENT OFFICE",
      "PROPERTY ADVISOR",
      "BUILDER & CONTRACTOR",
      "EDUCATION & LANDMARKS",
      "STREET",
      "GUIDE"
    ];

    const grouped = {};
    matched.forEach(item => {
      const cat = item.category;
      if (!grouped[cat]) grouped[cat] = [];
      grouped[cat].push(item);
    });

    let html = "";
    categoryOrder.forEach(cat => {
      if (!grouped[cat] || grouped[cat].length === 0) return;
      
      html += `<div class="search-category-group">`;
      html += `<div class="search-category-header"><span class="search-category-title">${cat}</span> <span class="search-category-count">${grouped[cat].length}</span></div>`;
      html += `<div class="search-category-items">`;
      
      grouped[cat].slice(0, 6).forEach(item => {
        let actionIcon = item.hasMap ? '<i class="fa-solid fa-map-location-dot highlight-accent" title="View on map"></i>' : (item.isGuide ? '<i class="fa-solid fa-arrow-right highlight-deep"></i>' : '<i class="fa-solid fa-chevron-right"></i>');
        
        html += `
          <div class="search-result-item" data-id="${item.id || ''}" data-url="${item.url || ''}" data-hasmap="${item.hasMap ? '1' : '0'}">
            <div class="search-item-main">
              <div class="search-item-title">${item.title}</div>
              <div class="search-item-desc">${item.desc}</div>
            </div>
            <div class="search-item-action">${actionIcon}</div>
          </div>
        `;
      });

      html += `</div></div>`;
    });

    resultsContainer.innerHTML = html;

    // Attach click handlers to search items
    resultsContainer.querySelectorAll(".search-result-item").forEach(el => {
      el.addEventListener("click", () => {
        const id = el.getAttribute("data-id");
        const url = el.getAttribute("data-url");
        const hasMap = el.getAttribute("data-hasmap") === "1";

        closeSearch();

        if (url) {
          window.location.href = url;
          return;
        }

        // Map Sync
        if (id && typeof window.syncMapToItem === "function") {
          const mapSection = document.getElementById("areas");
          if (mapSection) {
            mapSection.scrollIntoView({ behavior: "smooth", block: "start" });
            setTimeout(() => {
              window.syncMapToItem(id);
            }, 500);
          }
        }
      });
    });
  }

  searchInput.addEventListener("input", (e) => {
    renderResults(e.target.value);
  });

  // Hero Quick Search integration
  const heroSearchLocation = document.getElementById("searchLocation");
  const heroSearchType = document.getElementById("searchType");
  const heroSearchBtn = document.getElementById("heroSearchBtn");

  if (heroSearchBtn) {
    heroSearchBtn.addEventListener("click", (e) => {
      e.preventDefault();
      const loc = heroSearchLocation ? heroSearchLocation.value : "all";
      const type = heroSearchType ? heroSearchType.value : "all";

      if (loc !== "all") {
        const mapSection = document.getElementById("areas");
        if (mapSection) {
          mapSection.scrollIntoView({ behavior: "smooth", block: "start" });
          setTimeout(() => {
            if (typeof window.syncMapToItem === "function") {
              window.syncMapToItem(loc);
            }
          }, 500);
        }
      } else {
        const propSection = document.getElementById("properties");
        if (propSection) {
          propSection.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }
    });
  }
});
