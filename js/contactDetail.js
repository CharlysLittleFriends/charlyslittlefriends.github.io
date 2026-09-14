export async function initItemSummary() {

    function imageExists(url) {
        return new Promise(resolve => {
            const img = new Image();
            img.onload = () => resolve(true);
            img.onerror = () => resolve(false);
            img.src = url;
        });
    }

    async function loadDynamicImages(mainImg) {
        if (!mainImg) return [];

        // es: balena.png → baseName = balena, ext = png
        const ext = mainImg.split(".").pop();
        const baseName = mainImg.replace(/\.[^/.]+$/, "");

        const results = [];

        // aggiungi l'immagine principale
        const mainUrl = `${baseName}.${ext}`;
        results.push(mainUrl);

        // prova a caricare balena1.png, balena2.png, ...
        for (let i = 1; i < 20; i++) { // limite di sicurezza
            const url = `${baseName}${i}.${ext}`;
            const exists = await imageExists(url);
            if (!exists) break;
            results.push(url);
        }

        return results;
    }

    const params = new URLSearchParams(window.location.search);

    const type = params.get("type");
    const dim = params.get("dim");
    const colors = params.get("colors");
    const date = params.get("date");
    const img = params.get("img");

    const images = await loadDynamicImages(img);

    const summaryText = document.getElementById("summary-text");
    if (!summaryText) return;

    // Nome amigurumi
    const nome = `${dim === "Medio" ? "" : dim} ${type} ${colors}`.trim();

    function parseDate(d) {
        if (!d) return null;

        // Caso 1: oggetto Date
        if (typeof d === "object" && typeof d.getFullYear === "function") {
            return d;
        }

        // Caso 2: formato "Date(2026,8,2)"
        if (typeof d === "string" && d.startsWith("Date(")) {
            const match = d.match(/Date\((\d+),\s*(\d+),\s*(\d+)\)/);
            if (match) {
                const yyyy = parseInt(match[1], 10);
                const mm = parseInt(match[2], 10) + 1; // Google usa mesi 0-based
                const dd = parseInt(match[3], 10);
                return new Date(`${yyyy}/${mm}/${dd}`);
            }
        }

        // Caso 3: formato "2026-09-02" o "2026/09/02"
        if (typeof d === "string") {
            return new Date(d.replace(/-/g, "/"));
        }

        return null;
    }


    // --- Calcolo età ---
    let giorni = "-";
    const nascita = parseDate(date);

    if (nascita) {
        const oggi = new Date();
        const diffMs = oggi - nascita;
        giorni = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    }


    // --- HTML della card ---
    summaryText.innerHTML = `
        <h2>${nome}</h2>

        ${images.length > 0 ? `
            <div class="detail-carousel">
                <div class="detail-track">
                    ${images.map(src => `
                        <div class="detail-slide">
                            <img src="${src}" alt="${nome}">
                        </div>
                    `).join("")}
                </div>

                <button class="detail-btn prev">‹</button>
                <button class="detail-btn next">›</button>
            </div>
        ` : ""}

        <p class="summary-desc">
            Ho <strong>${giorni}</strong> giorni e aspetto di essere adottato 💜
        </p>
    `;

    const msg = document.getElementById("message");
    if (msg) {
        msg.value =
        `Ciao Charly,

    vorrei chiederti di adottare ${nome}. Sono ancora in tempo?
    ...

    Grazie!`;
    }

    // --- CAROUSEL LOGIC ---
    const track = document.querySelector(".detail-track");
    const slides = document.querySelectorAll(".detail-slide");
    const prev = document.querySelector(".detail-btn.prev");
    const next = document.querySelector(".detail-btn.next");

    if (track && slides.length > 0 && prev && next) {
        let index = 0;

        function update() {
            track.style.transform = `translateX(-${index * 100}%)`;
        }

        prev.addEventListener("click", () => {
            index = (index - 1 + slides.length) % slides.length;
            update();
        });

        next.addEventListener("click", () => {
            index = (index + 1) % slides.length;
            update();
        });
    }


}
