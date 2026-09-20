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

// Carica componenti visivi
loadComponent("header", "components/header.html");
loadComponent("footer", "components/footer.html");
loadComponent("form", "components/form.html");
