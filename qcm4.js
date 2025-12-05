document.addEventListener("DOMContentLoaded", () => {

    // mapping des bonnes réponses
    const bonnesReponses = {
        q1: "B",
        q2: "A"
    };

    // éléments DOM
    const form = document.getElementById("qcm-form");
    const submitBtn = document.getElementById("qcm-submit");
    const resultBox = document.getElementById("qcm-result");
    const finishBtn = document.getElementById("finish-btn");

    // sanity checks
    if (!form) return console.error("qcm: #qcm-form introuvable");
    if (!submitBtn) return console.error("qcm: #qcm-submit introuvable");
    if (!resultBox) return console.error("qcm: #qcm-result introuvable");
    if (!finishBtn) return console.error("qcm: #finish-btn introuvable");

    // Empêche le submit "classique" (enter, etc.)
    form.addEventListener("submit", (e) => {
        e.preventDefault();
        console.log("qcm: form submit prevented");
    });

    // s'assurer que le bouton est bien de type "button" (ne déclenche pas submit)
    finishBtn.type = "button";

    // Désactiver le bouton par défaut
    finishBtn.disabled = true;
    finishBtn.classList.remove("enabled");

    // Handler du bouton Valider
    submitBtn.addEventListener("click", () => {
        let score = 0;

        // Reset visuel
        document.querySelectorAll(".q-option").forEach(opt => {
            opt.classList.remove("qcm-correct", "qcm-wrong");
        });

        // Comptage des réponses correctes
        for (let q in bonnesReponses) {
            const selected = document.querySelector(`input[name="${q}"]:checked`);
            if (!selected) {
                // aucune réponse pour cette question
                continue;
            }
            const option = selected.closest(".q-option");
            if (!option) continue;

            if (selected.value === bonnesReponses[q]) {
                option.classList.add("qcm-correct");
                score++;
            } else {
                option.classList.add("qcm-wrong");
            }
        }

        // Affichage
        const total = Object.keys(bonnesReponses).length;
        resultBox.style.display = "block";
        resultBox.className = "";
        resultBox.innerHTML = `Score : <strong>${score}/${total}</strong>`;

        if (score === total) {
            resultBox.classList.add("good");
            resultBox.innerHTML += "<br>Excellent ! Moustache est fier ! 😺";
            finishBtn.disabled = false;
            finishBtn.classList.add("enabled");
            finishBtn.style.cursor = "pointer";
            console.log("qcm: score parfait -> bouton activé");
        } else {
            resultBox.classList.add("bad");
            resultBox.innerHTML += "<br>On révise et on retente ! 😿";
            finishBtn.disabled = true;
            finishBtn.classList.remove("enabled");
            finishBtn.style.cursor = "not-allowed";
            console.log(`qcm: score ${score}/${total} -> bouton désactivé`);
        }
    });

    // Handler safe pour la redirection
    finishBtn.addEventListener("click", (e) => {
        e.preventDefault();

        // sécurité : vérifie encore l'état
        if (finishBtn.disabled) {
            // petit feedback visuel si on clique alors que désactivé
            finishBtn.animate([
                { transform: "translateX(0)" },
                { transform: "translateX(6px)" },
                { transform: "translateX(-6px)" },
                { transform: "translateX(0)" }
            ], { duration: 200 });
            console.log("qcm: finish click ignored (disabled)");
            return;
        }

        // debug: confirme qu'on redirige
        console.log("qcm: redirection vers point_culminant.html");
        // utilise assign (équivalent) ; utilise chemin relatif
        location.assign("point_culminant.html");
    });

});
