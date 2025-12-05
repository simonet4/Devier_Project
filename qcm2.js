document.addEventListener("DOMContentLoaded", () => {

    // Uniquement UNE bonne réponse
    const bonneReponse = {
        q1: "A"
    };

    const submitBtn = document.getElementById("qcm-submit");
    const resultBox = document.getElementById("qcm-result");
    const finishBtn = document.getElementById("finish-btn");

    submitBtn.addEventListener("click", () => {

        let score = 0;

        // Réinitialiser les couleurs
        document.querySelectorAll(".q-option").forEach(opt => {
            opt.classList.remove("qcm-correct", "qcm-wrong");
        });

        // On vérifie UNIQUEMENT la question q1
        let selected = document.querySelector(`input[name="q1"]:checked`);

        if (selected) {
            let option = selected.closest(".q-option");

            if (selected.value === bonneReponse.q1) {
                option.classList.add("qcm-correct");
                score = 1;
            } else {
                option.classList.add("qcm-wrong");
            }
        }

        // Affichage résultat
        resultBox.style.display = "block";

        resultBox.innerHTML = `Score : <strong>${score}/1</strong>`;

        if (score === 1) {
            resultBox.className = "good";
            resultBox.innerHTML += "<br>Parfait ! Moustache t’applaudit ! 😺✨";

            // Activer bouton
            finishBtn.disabled = false;
            finishBtn.classList.add("enabled");

        } else {
            resultBox.className = "bad";
            resultBox.innerHTML += "<br>Ce n'est pas encore ça, réessaie ! 😿";

            // Désactiver bouton
            finishBtn.disabled = true;
            finishBtn.classList.remove("enabled");
        }
    });
});
