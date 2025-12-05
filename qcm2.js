document.addEventListener("DOMContentLoaded", () => {

    // Bonne réponse unique
    const bonneReponse = {
        q1: "A"
    };

    // Récupération des éléments
    const form = document.getElementById("qcm-form");
    const submitBtn = document.getElementById("qcm-submit");
    const resultBox = document.getElementById("qcm-result");
    const finishBtn = document.getElementById("finish-btn");

    // Empêche le formulaire de recharger la page
    form.addEventListener("submit", e => e.preventDefault());

    // Quand on clique sur "Valider le QCM"
    submitBtn.addEventListener("click", () => {

        let score = 0;

        // Reset des couleurs
        document.querySelectorAll(".q-option").forEach(opt => {
            opt.classList.remove("qcm-correct", "qcm-wrong");
        });

        // Vérification de q1 uniquement
        const selected = document.querySelector(`input[name="q1"]:checked`);

        if (selected) {
            const option = selected.closest(".q-option");

            if (selected.value === bonneReponse.q1) {
                option.classList.add("qcm-correct");
                score = 1;
            } else {
                option.classList.add("qcm-wrong");
            }
        }

        // Affichage du score
        resultBox.style.display = "block";
        resultBox.className = ""; // reset classes
        resultBox.innerHTML = `Score : <strong>${score}/1</strong>`;

        // Score parfait ?
        if (score === 1) {
            resultBox.classList.add("good");
            resultBox.innerHTML += "<br>Parfait ! Moustache t’applaudit ! 😺✨";

            finishBtn.disabled = false;
            finishBtn.classList.add("enabled");
            finishBtn.style.cursor = "pointer";

        } else {
            resultBox.classList.add("bad");
            resultBox.innerHTML += "<br>Ce n'est pas encore ça, réessaie ! 😿";

            finishBtn.disabled = true;
            finishBtn.classList.remove("enabled");
            finishBtn.style.cursor = "not-allowed";
        }
    });

    // Redirection sécurisée
    finishBtn.addEventListener("click", (e) => {
        e.preventDefault();

        if (!finishBtn.disabled) {
            window.location.href = "Quatrieme_Page.html";
        } else {
            // Animation "shake" si clic alors que désactivé
            finishBtn.animate([
                { transform: "translateX(0)" },
                { transform: "translateX(4px)" },
                { transform: "translateX(-4px)" },
                { transform: "translateX(0)" }
            ], { duration: 200 });
        }
    });

});
