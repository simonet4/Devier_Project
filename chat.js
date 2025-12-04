// Ouvrir / fermer la box
let firstOpen = true;

document.getElementById("chat-icon").addEventListener("click", function () {
    let box = document.getElementById("chat-box");
    box.classList.toggle("open");

    // Message d’accueil au premier clic
    if (firstOpen) {
        let body = document.querySelector(".chat-body");
        body.innerHTML += `<p class="bot-msg"><strong>Bot:</strong> Bonjour ! Comment puis-je t’aider aujourd’hui ? 😊</p>`;
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
    body.innerHTML += `<p class="user-msg"><strong>Vous:</strong> ${message}</p>`;

    // Scroll auto en bas
    body.scrollTop = body.scrollHeight;

    // Envoi AJAX vers le PHP
    fetch("chatbot.php", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: "message=" + encodeURIComponent(message)
    })
    .then(res => res.text())
    .then(reply => {
        body.innerHTML += `<p class="bot-msg"><strong>Bot:</strong> ${reply}</p>`;
        body.scrollTop = body.scrollHeight;
    });

    // Reset champ
    input.value = "";
});
