document.addEventListener("DOMContentLoaded", () => {

    const bonnesReponses = {
        q1: "A",
        q2: "A",
        q3: "A"
    };

    const submitBtn = document.getElementById("qcm-submit");
    const resultBox = document.getElementById("qcm-result");
    const finishBtn = document.getElementById("finish-btn");

    submitBtn.addEventListener("click", () => {

        let score = 0;

        // Réinitialiser visuel options
        document.querySelectorAll(".q-option").forEach(opt => {
            opt.classList.remove("qcm-correct", "qcm-wrong");
        });

        // Vérification
        for (let q in bonnesReponses) {
            let selected = document.querySelector(`input[name="${q}"]:checked`);
            if (!selected) continue;

            let option = selected.closest(".q-option");

            if (selected.value === bonnesReponses[q]) {
                option.classList.add("qcm-correct");
                score++;
            } else {
                option.classList.add("qcm-wrong");
            }
        }

        // Affichage résultat
        resultBox.style.display = "block";
        resultBox.innerHTML = `Score : <strong>${score}/3</strong>`;

        if (score === 3) {
            resultBox.className = "good";
            resultBox.innerHTML += "<br>Excellent ! Moustache est fier ! 😺";

            // On active le bouton
            finishBtn.disabled = false;
            finishBtn.classList.add("enabled");

        } else {
            resultBox.className = "bad";
            resultBox.innerHTML += "<br>On révise et on retente ! 😿";

            // On désactive le bouton
            finishBtn.disabled = true;
            finishBtn.classList.remove("enabled");
        }
    });
});

// Redirection sécurisée
finishBtn.addEventListener("click", () => {
    if (!finishBtn.disabled) {
        window.location.href = "TroisiemePage.html";
    }
});
