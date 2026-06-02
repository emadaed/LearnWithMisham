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
        document.getElementById(
            "quranContainer"
        );

    container.innerHTML = "";

    ayahs.forEach(ayah => {

        const card =
            document.createElement("div");

        card.className =
            "ayah-card";

        const text =
            document.createElement("div");

        text.className =
            "ayah";

        text.innerText =
            ayah.text;

        const controls =
            document.createElement("div");

        controls.className =
            "status-buttons";

        controls.innerHTML = `
            <button onclick="setAyahStatus(${ayah.number},'learning')">
                Learning
            </button>

            <button onclick="setAyahStatus(${ayah.number},'memorized')">
                Memorized
            </button>

            <button onclick="setAyahStatus(${ayah.number},'revision')">
                Revision
            </button>
        `;

        const status =
            document.createElement("p");

        status.innerText =
            "Status: " +
            getAyahStatus(
                ayah.number
            );

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