const observerUniscribe = new MutationObserver(() => {
    const form = document.getElementById("unsubscribe-form");
    if (form) {
        attachUniscribeValidation(form);
        observerUniscribe.disconnect();
    }
});

observerUniscribe.observe(document.body, { childList: true, subtree: true });

function attachUniscribeValidation(form) {
    form.addEventListener("submit", (e) => {
        let valid = true;

        const email = document.getElementById("email");
        const reason = document.getElementById("reason");

        // Validazione email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email.value.trim())) {
            showError(email, "Inserisci una email valida");
            valid = false;
        } else {
            clearError(email);
        }

        // Messaggio NON obbligatorio → nessuna validazione
        clearError(reason);

        if (!valid) e.preventDefault();
    });
}