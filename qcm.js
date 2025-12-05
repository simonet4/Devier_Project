document.addEventListener("DOMContentLoaded", () => {

    // si tu changes le nombre de questions, mets à jour ce mapping
    const bonnesReponses = {
        q1: "A",
        q2: "A",
        q3: "A"
    };

    // éléments
    const form = document.getElementById("qcm-form");
    const submitBtn = document.getElementById("qcm-submit");
    const resultBox = document.getElementById("qcm-result");
    const finishBtn = document.getElementById("finish-btn");

    if (!form || !submitBtn || !resultBox || !finishBtn) {
        console.error("Élément manquant : vérifie que #qcm-form, #qcm-submit, #qcm-result et #finish-btn existent dans le HTML.");
        return;
    }

    // empêche le submit "classique" du formulaire (enter ou autre)
    form.addEventListener("submit", (e) => {
        e.preventDefault();
    });

    // handler du bouton Valider
    submitBtn.addEventListener("click", () => {
        let score = 0;

        // Reset visuel
        document.querySelectorAll(".q-option").forEach(opt => {
            opt.classList.remove("qcm-correct", "qcm-wrong");
        });

        // Vérification des réponses
        for (let q in bonnesReponses) {
            const selected = document.querySelector(`input[name="${q}"]:checked`);
            if (!selected) continue;
            const option = selected.closest(".q-option");
            if (!option) continue;

            if (selected.value === bonnesReponses[q]) {
                option.classList.add("qcm-correct");
                score++;
            } else {
                option.classList.add("qcm-wrong");
            }
        }

        // Affichage du score (sur N)
        const total = Object.keys(bonnesReponses).length;
        resultBox.style.display = "block";
        resultBox.className = ""; // reset classes
        resultBox.innerHTML = `Score : <strong>${score}/${total}</strong>`;

        if (score === total) {
            resultBox.classList.add("good");
            resultBox.innerHTML += "<br>Excellent ! Moustache est fier ! 😺";
            finishBtn.disabled = false;
            finishBtn.classList.add("enabled");
            finishBtn.style.cursor = "pointer";
        } else {
            resultBox.classList.add("bad");
            resultBox.innerHTML += "<br>On révise et on retente ! 😿";
            finishBtn.disabled = true;
            finishBtn.classList.remove("enabled");
            finishBtn.style.cursor = "not-allowed";
        }
    });

    // redirection sécurisée : le bouton doit être type="button" pour ne pas soumettre le form
    finishBtn.addEventListener("click", (e) => {
        // sécurité : empêche tout comportement par défaut
        e.preventDefault();
        if (!finishBtn.disabled) {
            // remplace "TroisiemePage.html" par la page de destination voulue
            window.location.href = "TroisiemePage.html";
        } else {
            // facultatif : petit feedback visuel
            finishBtn.animate([
                { transform: 'translateY(0)' },
                { transform: 'translateY(-4px)' },
                { transform: 'translateY(0)' }
            ], { duration: 200 });
        }
    });

});
