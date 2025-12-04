// Ouvrir / fermer la box
let firstOpen = true;

document.getElementById("chat-icon").addEventListener("click", function () {
    let box = document.getElementById("chat-box");
    box.classList.toggle("open");

    // Message d’accueil au premier clic
    if (firstOpen) {
        let body = document.querySelector(".chat-body");
        body.innerHTML += `<p class="bot-msg"><strong>Moustache : </strong> Salutations. Je suis Moustache, maître penseur félin. Expose-moi ton questionnement, mortel.</p>`;
        firstOpen = false;
    }
});

// Gestion du formulaire (AJAX)
document.getElementById("chat-form").addEventListener("submit", function(e) {
    e.preventDefault(); // pas de reload

    let input = document.getElementById("user-message");
    let message = input.value.trim();

    if (message === "") return;

    let body = document.querySelector(".chat-body");

    // Afficher le message utilisateur dans la box
    body.innerHTML += `<p class="user-msg"><strong>Vous : </strong> ${message}</p>`;

    // Scroll auto en bas
    body.scrollTop = body.scrollHeight;

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

        // Afficher la réponse brute
        body.innerHTML += `<p class="bot-msg"><strong>Moustache : </strong> ${reply}</p>`;
        body.scrollTop = body.scrollHeight;
    });

    // Reset champ
    input.value = "";
});
