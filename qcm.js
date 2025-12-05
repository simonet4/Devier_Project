document.addEventListener("DOMContentLoaded", () => {

    const bonnesReponses = {
        q1: "A",
        q2: "A",
        q3: "A"
    };

    const submitBtn = document.getElementById("qcm-submit");
    const resultBox = document.getElementById("qcm-result");

    submitBtn.addEventListener("click", () => {

        let score = 0;

        /* 🔄 1 — RESET COMPLET DES COULEURS */
        document.querySelectorAll(".q-option").forEach(opt => {
            opt.classList.remove("qcm-correct", "qcm-wrong");
            opt.style.background = "";   // reset force
            opt.style.borderColor = "";
            opt.style.color = "";
        });

        /* 🔄 1bis — Cache la zone résultat à chaque nouveau clic */
        resultBox.style.display = "none";
        resultBox.classList.remove("good", "bad");


        /* 🟢🟣 2 — Vérification des réponses */
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

        /* 📊 3 — Affichage du score */
        resultBox.style.display = "block";
        resultBox.innerHTML = `Score : <strong>${score}/3</strong>`;

        if (score === 3) {
            resultBox.classList.add("good");
            resultBox.innerHTML += "<br>Excellent ! Moustache est fier ! 😺";
        } else if (score === 2) {
            resultBox.classList.add("good");
            resultBox.innerHTML += "<br>Bien joué ! Tu y es presque 😸";
        } else {
            resultBox.classList.add("bad");
            resultBox.innerHTML += "<br>On révise et on retente ! 😿";
        }
    });

});
