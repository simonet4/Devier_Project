// Empêcher plusieurs requêtes en même temps
let isSending = false;

// Ouvrir / fermer la box
let firstOpen = true;

document.getElementById("chat-icon").addEventListener("click", function () {
    let box = document.getElementById("chat-box");
    box.classList.toggle("open");

    // Message d’accueil au premier clic
    if (firstOpen) {
        let body = document.querySelector(".chat-body");
        body.innerHTML += `
        <div class="bot-line">
            <img src="chatbot.png" class="bot-avatar" alt="Moustache">
            <div class="bot-bubble">
                <strong>Moustache : </strong> Salutations. Je suis Moustache, maître penseur félin. Expose-moi ton questionnement, mortel.
            </div>
        </div>`;
        firstOpen = false;
    }
});

// Gestion du formulaire (AJAX)
document.getElementById("chat-form").addEventListener("submit", function(e) {
    e.preventDefault(); // pas de reload

    // Si une requête est déjà en cours, on bloque !
    if (isSending) return;

    let input = document.getElementById("user-message");
    let message = input.value.trim();

    if (message === "") return;

    let body = document.querySelector(".chat-body");

    // Afficher le message utilisateur dans la box
    body.innerHTML += `<p class="user-msg"><strong>Vous : </strong> ${message}</p>`;
    body.scrollTop = body.scrollHeight;

    // 🔒 Verrouiller l'envoi
    isSending = true;

    // Ajouter l'indicateur "bot en train d'écrire"
    let typingIndicator = `
        <div id="typing-indicator" class="bot-msg typing">
            <div class="dot"></div>
            <div class="dot"></div>
            <div class="dot"></div>
        </div>`;
    body.innerHTML += typingIndicator;
    body.scrollTop = body.scrollHeight;

    // Envoi AJAX vers le PHP
    fetch("chatbot.php", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: "message=" + encodeURIComponent(message)
    })
    .then(res => res.text())
    .then(reply => {
        // Retirer l’indicateur de chargement
        let typing = document.getElementById("typing-indicator");
        if (typing) typing.remove();

        // Afficher la réponse du bot
        body.innerHTML += `
            <div class="bot-line">
                <img src="chatbot.png" class="bot-avatar" alt="Moustache">
                <div class="bot-bubble">
                    <strong>Moustache : </strong> ${reply}
                </div>
            </div>`;
        body.scrollTop = body.scrollHeight;
    })
    .catch(err => {
        console.error("Erreur : ", err);

        // Retirer le loader si erreur
        let typing = document.getElementById("typing-indicator");
        if (typing) typing.remove();

        body.innerHTML += `<p class="bot-msg error"><strong>Moustache : </strong> Hmpf… une erreur a perturbé ma méditation. Réessaie.</p>`;
    })
    .finally(() => {
        // 🔓 Déverrouiller l'envoi
        isSending = false;
    });

    // Reset champ
    input.value = "";
});
