// Carica un componente HTML dentro un elemento con ID specifico
async function loadComponent(id, file) {
    const el = document.getElementById(id);
    if (!el) return; // niente warning: è normale che alcune pagine non abbiano certi componenti

    try {
        const html = await fetch(file).then(res => res.text());
        el.innerHTML = html;
    } catch (err) {
        console.error(`Errore nel caricamento di ${file}`, err);
    }
}

// Carica head comune (Google Analytics, favicon, CSS, ecc.)
fetch("components/head-common.html")
    .then(res => res.text())
    .then(html => {
        document.head.insertAdjacentHTML("beforeend", html);
    })
    .catch(err => console.error("Errore nel caricamento di head-common.html", err));

// Carica componenti visivi
loadComponent("header", "components/header.html");
loadComponent("footer", "components/footer.html");
loadComponent("form", "components/form.html");
