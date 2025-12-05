document.addEventListener("DOMContentLoaded", () => {

    // Bonnes réponses
    const bonnesReponses = {
        q1: "B",
        q2: "C"
    };

    const submitBtn = document.getElementById("qcm-submit");
    const resultBox = document.getElementById("qcm-result");
    const finishBtn = document.getElementById("finish-btn");

    // Désactiver le bouton final au début
    finishBtn.disabled = true;

    submitBtn.addEventListener("click", () => {

        let score = 0;

        // Reset couleurs
        document.querySelectorAll(".q-option").forEach(opt => {
            opt.classList.remove("qcm-correct", "qcm-wrong");
        });

        // Vérification des réponses
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

        // Affichage score
        resultBox.style.display = "block";
        resultBox.className = "";
        resultBox.innerHTML = `Score : <strong>${score}/2</strong>`;

        if (score === 2) {
            resultBox.classList.add("good");
            resultBox.innerHTML += "<br>Excellent ! Moustache est fier ! 😺";

            finishBtn.disabled = false;
            finishBtn.classList.add("enabled");

        } else {
            resultBox.classList.add("bad");
            resultBox.innerHTML += "<br>On révise et on retente ! 😿";

            finishBtn.disabled = true;
            finishBtn.classList.remove("enabled");
        }
    });

    // Redirection si score parfait
    finishBtn.addEventListener("click", () => {
        window.location.href = "Quatrieme_Page.html";
    });

});
