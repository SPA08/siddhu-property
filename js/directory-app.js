document.addEventListener("DOMContentLoaded", () => {
    const searchInput = document.getElementById("searchInput");
    const resultsContainer = document.getElementById("resultsContainer");
    const detailModal = document.getElementById("detailModal");
    const detailContent = document.getElementById("detailContent");
    const filterBtns = document.querySelectorAll('.filter-btn');

    // Default to AREA since "ALL" is removed
    let currentFilter = 'AREA';
    let currentQuery = '';

    if(!searchInput) return;

    // Check query params
    const urlParams = new URLSearchParams(window.location.search);
    const q = urlParams.get('q');
    if (q) {
        searchInput.value = q;
        currentQuery = q.toLowerCase().trim();
        setTimeout(() => performSearch(), 100);
    } else {
        performSearch();
    }

    searchInput.addEventListener("input", (e) => {
        currentQuery = e.target.value.toLowerCase().trim();
        performSearch();
    });

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentFilter = btn.getAttribute('data-filter');
            performSearch();
        });
    });

    const TYPE_SORT = {
        "AREA": 1,
        "PROPERTY_RECORD": 2,
        "GOVERNMENT_OFFICE": 3,
        "PUBLIC_SERVICE": 4
    };

    const TYPE_LABELS = {
        "AREA": "AREA",
        "PROPERTY_RECORD": "PROPERTY & LAND RECORD",
        "GOVERNMENT_OFFICE": "GOVERNMENT OFFICE",
        "PUBLIC_SERVICE": "PUBLIC SERVICE"
    };

    function performSearch() {
        let results = DIRECTORY_DATA.filter(item => {
            // Apply filter (All is gone, so filter is always strict)
            if(item.type !== currentFilter) return false;
            if(!currentQuery) return true;

            if(item.name.toLowerCase().includes(currentQuery)) return true;
            if(item.aliases && item.aliases.some(a => a.includes(currentQuery))) return true;
            if(item.parentChak && item.parentChak.toLowerCase().includes(currentQuery)) return true;
            return false;
        });

        // Sort results
        results.sort((a, b) => {
            const typeA = TYPE_SORT[a.type] || 99;
            const typeB = TYPE_SORT[b.type] || 99;
            if (typeA !== typeB) return typeA - typeB;
            return a.name.localeCompare(b.name);
        });

        renderResults(results);
    }

    function renderResults(results) {
        if(results.length === 0) {
            resultsContainer.innerHTML = `<div style="text-align:center; color: var(--text-muted); padding: 40px;">No results found for the current filter/search.</div>`;
            return;
        }

        resultsContainer.innerHTML = results.map((item, index) => {
            const typeLabel = TYPE_LABELS[item.type] || item.type;
            const subtitle = item.parentChak || item.address || "Chichawatni";
            // Stagger animation based on index
            const animDelay = (index * 0.05).toFixed(2);

            return `
                <div class="result-card" onclick="openDetail('${item.id}')" style="animation-delay: ${animDelay}s">
                    <span class="result-type-label">${typeLabel}</span>
                    <h3 class="result-title">${item.name}</h3>
                    <span class="result-subtitle">${subtitle}</span>
                </div>
            `;
        }).join('');
    }

    window.openDetail = function(id) {
        const item = DIRECTORY_DATA.find(d => d.id === id);
        if(!item) return;

        const status = LEGAL_STATUS[item.legalStatus] || LEGAL_STATUS.STATUS_NOT_VERIFIED;
        const typeLabel = TYPE_LABELS[item.type] || item.type;

        let html = `
            <i class="fa-solid fa-xmark close-modal" onclick="closeDetail()"></i>
            <span class="result-type-label" style="display:block; margin-bottom: 4px;">${typeLabel}</span>
            <h2 class="section-title" style="margin-bottom: 5px;">${item.name}</h2>
            <p style="color: var(--text-muted); font-size: 14px; margin-bottom: 20px;">
                ${item.parentChak ? item.parentChak : ''}
                ${item.address ? ' â€¢ ' + item.address : ''}
            </p>
            
            <div style="background: var(--bg-surface); padding: 16px; border-radius: 8px; border-left: 4px solid var(--color-${status.color}); margin-bottom: 24px;">
                <strong>${item.legalStatus.replace(/_/g, ' ')}</strong><br>
                <span style="font-size: 13px; color: var(--text-muted);">${status.label}</span>
                ${item.legalSourceUrl ? `<div style="margin-top: 8px; font-size: 12px;">Source: ${item.legalSourceUrl}</div>` : ''}
                <div style="margin-top: 4px; font-size: 12px; color: var(--text-muted);">Last Verified: ${item.lastVerified}</div>
            </div>
        `;

        if (item.phone || item.officeHours || item.services) {
            html += `<div class="detail-section" style="margin-top: 0; padding-top: 0; border-top: none;">`;
            if (item.phone) html += `<p style="margin-bottom: 8px; font-size: 14px;"><i class="fa-solid fa-phone" style="color:var(--primary-accent); width:20px;"></i> ${item.phone}</p>`;
            if (item.officeHours) html += `<p style="margin-bottom: 8px; font-size: 14px;"><i class="fa-regular fa-clock" style="color:var(--primary-accent); width:20px;"></i> ${item.officeHours}</p>`;
            if (item.services) html += `<p style="margin-bottom: 8px; font-size: 14px;"><i class="fa-solid fa-list-check" style="color:var(--primary-accent); width:20px;"></i> ${item.services}</p>`;
            html += `</div>`;
        }

        if(item.roads && item.roads.length > 0) {
            html += `<div class="detail-section"><h4>Known Roads</h4><p>${item.roads.join(', ')}</p></div>`;
        }
        if(item.streets && item.streets.length > 0) {
            html += `<div class="detail-section"><h4>Known Streets</h4><p>${item.streets.join(', ')}</p></div>`;
        }

        if (item.type === 'AREA') {
            html += `
                <div class="detail-section">
                    <h4>SIDDHU Transactions</h4>
                    <p style="font-size: 14px; color: var(--text-light);">
                        ${item.legalStatus === 'UNAPPROVED_OFFICIAL' 
                            ? '<i class="fa-solid fa-ban" style="color: var(--color-muted-red)"></i> SIDDHU does not facilitate transactions in this locality while this status remains in force.' 
                            : '<i class="fa-solid fa-check-circle" style="color: var(--primary-accent)"></i> Standard verification process applies.'}
                    </p>
                </div>
            `;
        }

        // Map Section
        const mapQuery = encodeURIComponent(item.name + ' Chichawatni');
        html += `
            <div class="detail-section" style="border: none; padding-top: 10px;">
                <iframe 
                    width="100%" 
                    height="250" 
                    style="border:0; border-radius: 8px; background: #000;" 
                    loading="lazy" 
                    allowfullscreen 
                    src="https://maps.google.com/maps?q=${mapQuery}&t=&z=14&ie=UTF8&iwloc=&output=embed">
                </iframe>
            </div>
        `;

        detailContent.innerHTML = html;
        detailModal.style.display = 'flex';
    }

    window.closeDetail = function() {
        detailModal.style.display = 'none';
    }

    // Close on background click
    detailModal.addEventListener('click', (e) => {
        if(e.target === detailModal) closeDetail();
    });
});
