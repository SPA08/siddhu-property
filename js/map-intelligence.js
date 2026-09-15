/**
 * SIDDHU Property Advisor - Interactive Local Area Intelligence Map
 * Powered by Leaflet & High-Contrast Clean Map Tiles
 */

document.addEventListener("DOMContentLoaded", () => {
    const mapContainer = document.getElementById("chichawatniMap");
    if (!mapContainer) return;

    const mapSection = document.getElementById("areas");
    let mapInitialized = false;
    let map = null;
    let markersLayer = null;
    const markerRegistry = {};
    let currentFilter = "all";

    // --- MARKER ICONS (Restrained Editorial Theme) ---
    const localityIcon = L.divIcon({
        className: 'custom-div-icon',
        html: `<div class="marker-pin marker-pin-teal"><i class="fa-solid fa-location-dot"></i></div>`,
        iconSize: [26, 26], iconAnchor: [13, 26], popupAnchor: [0, -26]
    });

    const propIcon = L.divIcon({
        className: 'custom-div-icon',
        html: `<div class="marker-pin marker-pin-gold"><i class="fa-solid fa-house"></i></div>`,
        iconSize: [28, 28], iconAnchor: [14, 28], popupAnchor: [0, -28]
    });

    const propRecordIcon = L.divIcon({
        className: 'custom-div-icon',
        html: `<div class="marker-pin marker-pin-gold"><i class="fa-solid fa-file-signature"></i></div>`,
        iconSize: [24, 24], iconAnchor: [12, 24], popupAnchor: [0, -24]
    });

    const govOfficeIcon = L.divIcon({
        className: 'custom-div-icon',
        html: `<div class="marker-pin marker-pin-slate"><i class="fa-solid fa-building-columns"></i></div>`,
        iconSize: [24, 24], iconAnchor: [12, 24], popupAnchor: [0, -24]
    });

    const serviceIcon = L.divIcon({
        className: 'custom-div-icon',
        html: `<div class="marker-pin marker-pin-slate"><i class="fa-solid fa-shield-heart"></i></div>`,
        iconSize: [24, 24], iconAnchor: [12, 24], popupAnchor: [0, -24]
    });

    const cityCenterIcon = L.divIcon({
        className: 'custom-div-icon',
        html: `<div class="marker-pin marker-pin-teal marker-center"><i class="fa-solid fa-city"></i></div>`,
        iconSize: [30, 30], iconAnchor: [15, 30], popupAnchor: [0, -30]
    });

    function initMap() {
        if (mapInitialized) return;
        mapInitialized = true;

        const cityCenter = [30.5354804, 72.6903375];
        map = L.map('chichawatniMap', {
            center: cityCenter,
            zoom: 14,
            zoomControl: false,
            scrollWheelZoom: false
        });

        L.control.zoom({ position: 'bottomright' }).addTo(map);

        L.tileLayer('https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}', {
            attribution: '&copy; Google Maps',
            maxZoom: 19
        }).addTo(map);

        markersLayer = L.layerGroup().addTo(map);

        const overlay = document.getElementById("mapLoadingOverlay");
        if (overlay) {
            overlay.style.opacity = "0";
            setTimeout(() => { if (overlay) overlay.remove(); }, 400);
        }

        renderIntelligenceData();
        setupSearchAndFilters();
        setupScrollArrows();
    }

    // Lazy load map on intersection or immediately if requested
    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !mapInitialized) {
                initMap();
                obs.disconnect();
            }
        });
    }, { rootMargin: "250px 0px" });

    if (mapSection) {
        observer.observe(mapSection);
    }

    function animateMarkerPulse(marker) {
        if (!marker) return;
        const el = marker.getElement();
        if (el) {
            el.classList.remove('marker-soft-pulse');
            void el.offsetWidth; // trigger reflow
            el.classList.add('marker-soft-pulse');
            setTimeout(() => {
                el.classList.remove('marker-soft-pulse');
            }, 3000);
        }
    }

    function renderIntelligenceData(searchQuery = "") {
        if (!map) return;
        
        markersLayer.clearLayers();
        Object.keys(markerRegistry).forEach(k => delete markerRegistry[k]);
        
        const listContainer = document.getElementById("localityList");
        if (!listContainer) return;
        listContainer.innerHTML = "";

        const query = searchQuery.toLowerCase().trim();
        let displayCount = 0;

        if (typeof DIRECTORY_DATA === 'undefined') return;

        DIRECTORY_DATA.forEach(item => {
            let itemCategory = item.type;
            if (["PROPERTY_DEALER", "REAL_ESTATE_AGENCY"].includes(item.type)) itemCategory = "REAL_ESTATE";
            if (["HOUSE_BUILDER", "CONSTRUCTION_COMPANY", "BUILDING_MATERIAL"].includes(item.type)) itemCategory = "BUILDERS";
            if (["SCHOOL", "MOSQUE", "LANDMARK"].includes(item.type)) itemCategory = "LANDMARKS";
            if (item.type === "CITY_CENTER") itemCategory = "AREA";
            if (item.type === "PROPERTY" || item.type === "PROPERTY_REFERENCE") itemCategory = "PROPERTY";

            if (currentFilter !== "all" && itemCategory !== currentFilter) return;
            
            let matchesSearch = false;
            if (!query) {
                matchesSearch = true;
            } else {
                if (item.name.toLowerCase().includes(query)) matchesSearch = true;
                if (item.aliases && item.aliases.some(alias => alias.includes(query))) matchesSearch = true;
                if (item.parentChak && item.parentChak.toLowerCase().includes(query)) matchesSearch = true;
                if (item.address && item.address.toLowerCase().includes(query)) matchesSearch = true;
                if (item.services && item.services.toLowerCase().includes(query)) matchesSearch = true;
            }

            if (!matchesSearch) return;

            let markerObj = null;
            if (item.latitude && item.longitude) {
                let iconToUse = localityIcon;
                if (item.type === "CITY_CENTER") iconToUse = cityCenterIcon;
                else if (item.type === "PROPERTY" || item.type === "PROPERTY_REFERENCE") iconToUse = propIcon;
                else if (item.type === "PROPERTY_RECORD") iconToUse = propRecordIcon;
                else if (item.type === "GOVERNMENT_OFFICE") iconToUse = govOfficeIcon;
                else if (item.type === "PUBLIC_SERVICE") iconToUse = serviceIcon;

                const marker = L.marker([item.latitude, item.longitude], { icon: iconToUse });
                
                let legalTag = "";
                if (item.legalStatus && typeof LEGAL_STATUS !== 'undefined' && LEGAL_STATUS[item.legalStatus]) {
                    const isVerified = item.legalStatus === "APPROVED_VERIFIED";
                    legalTag = `<div class="popup-status ${isVerified ? 'verified' : 'unverified'}">
                                    <i class="fa-solid ${isVerified ? 'fa-circle-check' : 'fa-circle-info'}"></i>
                                    ${isVerified ? 'Verified' : 'Reference'}
                                </div>`;
                }

                let extraDetails = "";
                if (item.services) extraDetails += `<p class="popup-subtext">${item.services}</p>`;
                if (item.address && item.address !== "Chichawatni") extraDetails += `<p class="popup-location"><i class="fa-solid fa-location-dot"></i> ${item.address}</p>`;
                if (item.phone) extraDetails += `<p class="popup-phone"><i class="fa-solid fa-phone"></i> ${item.phone}</p>`;
                
                let typeLabel = (item.type || "").replace(/_/g, ' ');

                const popupContent = `
                    <div class="custom-map-popup">
                        <div class="popup-type-tag">${typeLabel}</div>
                        <h4 class="popup-title">${item.name}</h4>
                        ${legalTag}
                        ${extraDetails}
                    </div>
                `;

                marker.bindPopup(popupContent);
                markersLayer.addLayer(marker);
                markerObj = marker;
                markerRegistry[item.id] = marker;
                markerRegistry[item.name.toLowerCase()] = marker;
            }

            // Sidebar Row
            let iconClass = "fa-house-chimney";
            let typeLabel = item.type.replace(/_/g, ' ');
            if (item.type === "CITY_CENTER") { iconClass = "fa-city"; }
            else if (item.type === "PROPERTY") { iconClass = "fa-house"; }
            else if (item.type === "PROPERTY_RECORD") { iconClass = "fa-file-signature"; }
            else if (item.type === "GOVERNMENT_OFFICE") { iconClass = "fa-building-columns"; }
            else if (item.type === "PUBLIC_SERVICE") { iconClass = "fa-shield-heart"; }
            else if (itemCategory === "REAL_ESTATE") { iconClass = "fa-user-tie"; }
            else if (itemCategory === "BUILDERS") { iconClass = "fa-hammer"; }
            else if (itemCategory === "LANDMARKS") { iconClass = "fa-landmark"; }
            else if (item.type === "LOCAL_BUSINESS") { iconClass = "fa-store"; }
            else if (item.type === "STREET") { iconClass = "fa-road"; }
            
            const row = document.createElement("div");
            row.className = "locality-row";
            row.setAttribute("data-id", item.id);
            
            let shortNote = item.address || item.parentChak || item.services || "Chichawatni";

            row.innerHTML = `
                <div class="locality-icon">
                    <i class="fa-solid ${iconClass}"></i>
                </div>
                <div class="locality-info">
                    <div class="locality-type-badge">${typeLabel}</div>
                    <div class="locality-name">${item.name}</div>
                    <div class="locality-desc">${shortNote}</div>
                </div>
                <div class="locality-arrow">
                    <i class="fa-solid fa-chevron-right"></i>
                </div>
            `;

            row.addEventListener("click", () => {
                document.querySelectorAll(".locality-row").forEach(el => el.classList.remove("active"));
                row.classList.add("active");

                if (markerObj && map) {
                    map.setView([item.latitude, item.longitude], 16, { animate: true, duration: 0.8 });
                    markerObj.openPopup();
                    animateMarkerPulse(markerObj);
                } else if (item.latitude && item.longitude && map) {
                    map.setView([item.latitude, item.longitude], 16, { animate: true, duration: 0.8 });
                }
            });

            if (markerObj) {
                markerObj.on('click', () => {
                    document.querySelectorAll(".locality-row").forEach(el => el.classList.remove("active"));
                    row.classList.add("active");
                    row.scrollIntoView({ behavior: "smooth", block: "nearest" });
                    animateMarkerPulse(markerObj);
                });
            }

            listContainer.appendChild(row);
            displayCount++;
        });
        
        if (listContainer.innerHTML === "") {
            listContainer.innerHTML = `<div style="padding: 24px; text-align: center; color: var(--color-muted); font-size: 0.9rem;">No matching records found.</div>`;
        }
    }

    function setupSearchAndFilters() {
        const searchInput = document.getElementById("mapSearchInput");
        const filterBtns = document.querySelectorAll(".map-filter-btn");

        if (searchInput) {
            searchInput.addEventListener("input", (e) => {
                renderIntelligenceData(e.target.value);
            });
        }

        filterBtns.forEach(btn => {
            btn.addEventListener("click", () => {
                filterBtns.forEach(b => b.classList.remove("active"));
                btn.classList.add("active");
                currentFilter = btn.getAttribute("data-filter");
                
                if (searchInput) {
                    renderIntelligenceData(searchInput.value);
                } else {
                    renderIntelligenceData();
                }
            });
        });
    }

    function setupScrollArrows() {
        const wrapper = document.querySelector('.filter-scroll-wrapper');
        const container = document.querySelector('.map-filter-tags');
        const leftArrow = document.querySelector('.left-arrow');
        const rightArrow = document.querySelector('.right-arrow');

        if (!wrapper || !container || !leftArrow || !rightArrow) return;

        const updateArrows = () => {
            const maxScroll = container.scrollWidth - container.clientWidth;
            if (container.scrollLeft > 0) {
                wrapper.classList.add('can-scroll-left');
            } else {
                wrapper.classList.remove('can-scroll-left');
            }
            if (container.scrollLeft < maxScroll - 1) {
                wrapper.classList.add('can-scroll-right');
            } else {
                wrapper.classList.remove('can-scroll-right');
            }
        };

        leftArrow.addEventListener('click', () => {
            container.scrollBy({ left: -150, behavior: 'smooth' });
        });

        rightArrow.addEventListener('click', () => {
            container.scrollBy({ left: 150, behavior: 'smooth' });
        });

        container.addEventListener('scroll', updateArrows);
        window.addEventListener('resize', updateArrows);
        setTimeout(updateArrows, 100);
    }

    // Global synchronization helper accessible by Search and quick filters
    window.syncMapToItem = function(targetKey) {
        if (!mapInitialized) {
            initMap();
        }

        if (typeof DIRECTORY_DATA === 'undefined') return;

        const targetLower = String(targetKey).toLowerCase().trim();
        const item = DIRECTORY_DATA.find(d => 
            d.id === targetKey || 
            d.name.toLowerCase() === targetLower ||
            (d.aliases && d.aliases.some(a => a.toLowerCase() === targetLower))
        );

        if (!item) return;

        // Reset filter to 'all' so target is rendered
        if (currentFilter !== "all") {
            currentFilter = "all";
            document.querySelectorAll(".map-filter-btn").forEach(b => {
                if (b.getAttribute("data-filter") === "all") b.classList.add("active");
                else b.classList.remove("active");
            });
            renderIntelligenceData();
        }

        const marker = markerRegistry[item.id] || (item.name ? markerRegistry[item.name.toLowerCase()] : null);
        if (marker && map) {
            map.setView([item.latitude, item.longitude], 16, { animate: true, duration: 1.0 });
            marker.openPopup();
            animateMarkerPulse(marker);
        } else if (item.latitude && item.longitude && map) {
            map.setView([item.latitude, item.longitude], 16, { animate: true, duration: 1.0 });
        }

        const row = document.querySelector(`.locality-row[data-id="${item.id}"]`);
        if (row) {
            document.querySelectorAll(".locality-row").forEach(el => el.classList.remove("active"));
            row.classList.add("active");
            row.scrollIntoView({ behavior: "smooth", block: "nearest" });
        }
    };
});
