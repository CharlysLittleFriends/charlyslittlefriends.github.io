// ID foglio Google Sheets
const sheetID = "1RrRTsOipfcbUtwS78FyqnTkNhcEdJ4DxMLwrXIQ38DI";
const url = `https://docs.google.com/spreadsheets/d/${sheetID}/gviz/tq?tqx=out:json`;

let allRows = [];

// Fetch e parsing robusto della risposta JSON di Google Visualization
fetch(url)
    .then(res => res.text())
    .then(text => {
        try {
            const start = text.indexOf('{');
            const end = text.lastIndexOf('}');
            if (start === -1 || end === -1) throw new Error('Formato risposta inatteso');

            const jsonText = text.slice(start, end + 1);
            const json = JSON.parse(jsonText);

            allRows = (json.table && json.table.rows) ? json.table.rows : [];

            // RENDO GLOBALI
            window.allRows = allRows;
            window.renderCards = renderCards;

            // EMETTO EVENTO PER I FILTRI
            window.dispatchEvent(new Event("googleDataReady"));

            // Render iniziale (senza filtri)
            renderCards(allRows);

        } catch (err) {
            console.error('Errore parsing JSON:', err);
            showLoadError('Errore durante il parsing dei dati.');
        }
    })
    .catch(err => {
        console.error('Errore caricamento sheet:', err);
        showLoadError('Impossibile caricare i dati al momento.');
    });

function showLoadError(message) {
    const container = document.getElementById('cards-container');
    container.innerHTML = '';
    const p = document.createElement('p');
    p.textContent = message;
    container.appendChild(p);
}

function renderCards(rows) {
    const container = document.getElementById("cards-container");
    container.innerHTML = "";

    if (!rows || rows.length === 0) {
        const p = document.createElement('p');
        p.textContent = "Nessun elemento da mostrare.";
        container.appendChild(p);
        return;
    }

    const grid = document.createElement('div');
    grid.className = 'cards-grid';
    container.appendChild(grid);

    rows.forEach(function (r, index) {

        const type = r && r.c && r.c[0] ? r.c[0].v : "";
        const dim = r && r.c && r.c[1] ? r.c[1].v : "";
        const colors = r && r.c && r.c[2] ? r.c[2].v : "";
        const price = r && r.c && r.c[3] ? r.c[3].v : "";
        const date = r && r.c && r.c[4] ? r.c[4].v : "";
        let img = r && r.c && r.c[5] ? r.c[5].v : "";
        const extra = r && r.c && r.c[6] ? r.c[6].v : "";

        img = "images/friends/" + img;

        const nome = `${dim === "Medio" ? "" : dim} ${type} ${colors}`.trim();
        const nomeFinale = nome !== "" ? nome : ("Amigurumi " + (index + 1));

        const card = document.createElement('article');
        card.className = 'friend-card';
        card.style.animationDelay = (index * 60) + "ms";

        // IMMAGINE
        const imgWrapper = document.createElement('div');
        imgWrapper.className = 'card-image';

        if (img) {
            const image = document.createElement('img');
            image.src = escapeAttr(img);
            image.alt = nomeFinale;
            imgWrapper.appendChild(image);
        } else {
            const placeholder = document.createElement('div');
            placeholder.className = 'card-image-placeholder';
            placeholder.textContent = 'No image';
            imgWrapper.appendChild(placeholder);
        }

        card.appendChild(imgWrapper);

        // CONTENUTO
        const content = document.createElement('div');
        content.className = 'card-content';

        // NOME CENTRATO
        const title = document.createElement('h3');
        title.className = 'card-title';
        title.textContent = nomeFinale;
        content.appendChild(title);

        // DATA DI NASCITA
        const birthCard = document.createElement('div');
        birthCard.className = 'card-info-box';

        var formattedDate = "-";

        var formattedDate = "-";

        if (date) {
            // Caso 1: oggetto Date vero (Google Visualization)
            if (typeof date === "object" && typeof date.getFullYear === "function") {
                var yyyy = date.getFullYear();
                var mm = String(date.getMonth() + 1).padStart(2, "0");
                var dd = String(date.getDate()).padStart(2, "0");
                formattedDate = yyyy + "/" + mm + "/" + dd;
            }
            // Caso 2: stringa tipo "2026-09-02"
            else if (typeof date === "string") {

                // Se è tipo "Date(2026,8,2)"
                if (date.indexOf("Date(") === 0) {
                    var match = date.match(/Date\((\d+),\s*(\d+),\s*(\d+)\)/);
                    if (match) {
                        var yyyy = match[1];
                        var mm = String(parseInt(match[2], 10) + 1).padStart(2, "0");
                        var dd = String(parseInt(match[3], 10)).padStart(2, "0");
                        formattedDate = dd + "/" + mm + "/" + yyyy;
                    }
                } else {
                    // classico "2026-09-02"
                    formattedDate = date.replace(/-/g, "/").slice(0, 10);
                }
            }
        }



        birthCard.innerHTML =
            '<p><strong>Data di nascita:</strong> ' + formattedDate + '</p>';

        content.appendChild(birthCard);

        // PREZZO
        const priceCard = document.createElement('div');
        priceCard.className = 'card-info-box';

        priceCard.innerHTML =
            '<p><strong>Adozione:</strong> ' + (price || '-') + '</p>';

        content.appendChild(priceCard);

        // LINK
        const actions = document.createElement('div');
        actions.className = 'card-actions';

        const params = new URLSearchParams({
            type: type,
            dim: dim,
            colors: colors,
            price: price,
            date: date,
            extra: extra,
            img: img
        });

        actions.innerHTML =
            '<a href="contattami.html?' + params.toString() + '" class="card-button">ADOTTAMI</a>';

        content.appendChild(actions);

        card.appendChild(content);
        grid.appendChild(card);
    });
}

function escapeAttr(url) {
    if (!url) return '';
    return String(url).replace(/"/g, '%22').replace(/'/g, '%27');
}
