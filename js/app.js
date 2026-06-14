async function loadSurah() {

    const surah =
        document.getElementById(
            "surahSelect"
        ).value;

    const response =
        await fetch(
            `https://api.alquran.cloud/v1/surah/${surah}`
        );

    const data =
        await response.json();

    displayAyahs(
        data.data.ayahs
    );
}

function displayAyahs(ayahs) {

    const container =
        document.getElementById("quranContainer");

    container.innerHTML = "";

    ayahs.forEach(ayah => {

        const card =
            document.createElement("div");

        card.className = "ayah-card";

        const text =
            document.createElement("div");

        text.className = "ayah";

        const words =
            ayah.text.split(" ");

        words.forEach((word, index) => {

            const span =
                document.createElement("span");

            const highlightId =
                `highlight-${ayah.number}-${index}`;

            span.className = "word";

            span.innerText = word + " ";

            const savedHighlights =
                JSON.parse(
                    localStorage.getItem("lwm_highlights")
                ) || [];

            if (savedHighlights.includes(highlightId)) {
                span.classList.add("highlight");
            }

            span.onclick = () => {

                span.classList.toggle("highlight");

                let highlights =
                    JSON.parse(
                        localStorage.getItem("lwm_highlights")
                    ) || [];

                if (span.classList.contains("highlight")) {

                    if (!highlights.includes(highlightId)) {
                        highlights.push(highlightId);
                    }

                } else {

                    highlights =
                        highlights.filter(
                            id => id !== highlightId
                        );
                }

                localStorage.setItem(
                    "lwm_highlights",
                    JSON.stringify(highlights)
                );
            };

            text.appendChild(span);
        });

        const controls =
            document.createElement("div");

        controls.className = "status-buttons";

        controls.innerHTML = `
            <button onclick="setAyahStatus(${ayah.number}, 'learning')">
                Learning
            </button>

            <button onclick="setAyahStatus(${ayah.number}, 'memorized')">
                Memorized
            </button>

            <button onclick="setAyahStatus(${ayah.number}, 'revision')">
                Revision
            </button>
        `;

        const status =
            document.createElement("p");

        status.innerText =
            "Status: " + getAyahStatus(ayah.number);

        card.appendChild(text);
        card.appendChild(controls);
        card.appendChild(status);

        container.appendChild(card);
    });

    updateDashboard();
}

window.onload = () => {

    loadProfile();

    loadSurah();

    updateDashboard();
};