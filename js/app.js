async function loadSurah() {

    const surah =
        document.getElementById("surahSelect").value;

    const response =
        await fetch(
            `https://api.alquran.cloud/v1/surah/${surah}`
        );

    const data =
        await response.json();

    displayAyahs(
        surah,
        data.data.ayahs
    );
}

function displayAyahs(surahNumber, ayahs) {

    const container =
        document.getElementById("quranContainer");

    container.innerHTML = "";

    ayahs.forEach(ayah => {

        const ayahNumber =
            ayah.numberInSurah;

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
                `surah-${surahNumber}-ayah-${ayahNumber}-word-${index}`;

            span.className = "word";

            span.innerText = word + " ";

            const savedHighlights =
                loadData(STORAGE_KEYS.HIGHLIGHTS, []);

            if (savedHighlights.includes(highlightId)) {
                span.classList.add("highlight");
            }

            span.onclick = () => {

                span.classList.toggle("highlight");

                let highlights =
                    loadData(STORAGE_KEYS.HIGHLIGHTS, []);

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

                saveData(
                    STORAGE_KEYS.HIGHLIGHTS,
                    highlights
                );
            };

            text.appendChild(span);
        });

        const controls =
            document.createElement("div");

        controls.className = "status-buttons";

        const status =
            document.createElement("p");

        status.innerText =
            "Status: " +
            getAyahStatus(
                surahNumber,
                ayahNumber
            );

        controls.innerHTML = `
            <button>
                Learning
            </button>

            <button>
                Memorized
            </button>

            <button>
                Revision
            </button>
        `;

        const buttons =
            controls.querySelectorAll("button");

        buttons[0].onclick = () => {
            setAyahStatus(
                surahNumber,
                ayahNumber,
                "learning"
            );

            status.innerText = "Status: learning";
        };

        buttons[1].onclick = () => {
            setAyahStatus(
                surahNumber,
                ayahNumber,
                "memorized"
            );

            status.innerText = "Status: memorized";
        };

        buttons[2].onclick = () => {
            setAyahStatus(
                surahNumber,
                ayahNumber,
                "revision"
            );

            status.innerText = "Status: revision";
        };

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