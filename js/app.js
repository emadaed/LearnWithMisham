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

function makeHighlightId(surahNumber, ayahNumber, wordIndex) {
    return `surah-${surahNumber}-ayah-${ayahNumber}-word-${wordIndex}`;
}

function saveDifficultWordLocally(surahNumber, ayahNumber, wordIndex, word, isHighlighted) {
    const student = getActiveStudent();

    if (!student) return;

    const difficultWords =
        loadData(getDifficultWordsKey(), []);

    const highlightId =
        makeHighlightId(surahNumber, ayahNumber, wordIndex);

    const filteredWords =
        difficultWords.filter(item => item.highlightId !== highlightId);

    if (isHighlighted) {
        filteredWords.push({
            highlightId: highlightId,
            studentId: student.studentId,
            studentName: student.studentName || "",
            teacherName: student.teacherName || "",
            surah: Number(surahNumber),
            ayah: Number(ayahNumber),
            wordIndex: Number(wordIndex),
            word: word.trim(),
            addedAt: new Date().toISOString()
        });
    }

    saveData(
        getDifficultWordsKey(),
        filteredWords
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
                makeHighlightId(
                    surahNumber,
                    ayahNumber,
                    index
                );

            span.className = "word";

            span.innerText = word + " ";

            const savedHighlights =
                loadData(getHighlightsKey(), []);

            if (savedHighlights.includes(highlightId)) {
                span.classList.add("highlight");

                saveDifficultWordLocally(
                    surahNumber,
                    ayahNumber,
                    index,
                    word,
                    true
                );
            }

            span.onclick = () => {

                const wasHighlighted =
                    span.classList.contains("highlight");

                span.classList.toggle("highlight");

                const isHighlighted =
                    span.classList.contains("highlight");

                let highlights =
                    loadData(getHighlightsKey(), []);

                if (isHighlighted) {

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
                    getHighlightsKey(),
                    highlights
                );

                saveDifficultWordLocally(
                    surahNumber,
                    ayahNumber,
                    index,
                    word,
                    isHighlighted
                );

                if (typeof saveDifficultWordToCloud === "function" && wasHighlighted !== isHighlighted) {
                    saveDifficultWordToCloud(
                        surahNumber,
                        ayahNumber,
                        index,
                        word,
                        isHighlighted ? "added" : "removed"
                    );
                }

                if (typeof generateTeacherReport === "function") {
                    generateTeacherReport();
                }
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

            if (typeof generateTeacherReport === "function") {
                generateTeacherReport();
            }
        };

        buttons[1].onclick = () => {
            setAyahStatus(
                surahNumber,
                ayahNumber,
                "memorized"
            );

            status.innerText = "Status: memorized";

            if (typeof generateTeacherReport === "function") {
                generateTeacherReport();
            }
        };

        buttons[2].onclick = () => {
            setAyahStatus(
                surahNumber,
                ayahNumber,
                "revision"
            );

            status.innerText = "Status: revision";

            if (typeof generateTeacherReport === "function") {
                generateTeacherReport();
            }
        };

        card.appendChild(text);
        card.appendChild(controls);
        card.appendChild(status);

        container.appendChild(card);
    });

    updateDashboard();

    if (typeof generateTeacherReport === "function") {
        generateTeacherReport();
    }
}

window.onload = () => {
    loadProfile();
    loadSurah();
    updateDashboard();

    if (typeof generateTeacherReport === "function") {
        generateTeacherReport();
    }
};
