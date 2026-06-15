function makeAyahId(surahNumber, ayahNumber) {
    return `surah-${surahNumber}-ayah-${ayahNumber}`;
}

function getProgress() {
    const studentId = getActiveStudentId();

    if (!studentId) {
        return {};
    }

    return loadData(getProgressKey(), {});
}

function saveProgress(progress) {
    const studentId = getActiveStudentId();

    if (!studentId) {
        alert("Please add or select a student first");
        return;
    }

    saveData(getProgressKey(), progress);
}

function setAyahStatus(surahNumber, ayahNumber, status) {
    const student = getActiveStudent();

    if (!student) {
        alert("Please add or select a student first");
        return;
    }

    const progress = getProgress();

    const ayahId = makeAyahId(
        surahNumber,
        ayahNumber
    );

    progress[ayahId] = {
        surah: Number(surahNumber),
        ayah: Number(ayahNumber),
        status: status,
        updatedAt: new Date().toISOString()
    };

    saveProgress(progress);

    saveProgressToCloud(
        surahNumber,
        ayahNumber,
        status
    );

    updateDashboard();
}

function getAyahStatus(surahNumber, ayahNumber) {
    const progress = getProgress();

    const ayahId = makeAyahId(
        surahNumber,
        ayahNumber
    );

    if (!progress[ayahId]) {
        return "not-started";
    }

    return progress[ayahId].status;
}

function updateDashboard() {
    const progress = getProgress();

    const entries =
        Object.values(progress);

    const total =
        entries.length;

    let memorized = 0;
    let revision = 0;

    const revisionItems = [];

    entries.forEach(item => {
        if (item.status === "memorized") {
            memorized++;
        }

        if (item.status === "revision") {
            revision++;
            revisionItems.push(item);
        }
    });

    const percent =
        total === 0
            ? 0
            : Math.round((memorized / total) * 100);

    document.getElementById("progressFill").style.width =
        percent + "%";

    document.getElementById("progressText").innerText =
        percent + "% Complete";

    document.getElementById("revisionCount").innerText =
        revision;

    renderRevisionList(revisionItems);
}

function renderRevisionList(revisionItems) {
    const list =
        document.getElementById("revisionList");

    if (!list) return;

    list.innerHTML = "";

    if (revisionItems.length === 0) {
        list.innerHTML =
            "<li>No revision items 🎉</li>";
        return;
    }

    revisionItems.forEach(item => {
        const li =
            document.createElement("li");

        const surahName =
            SURAH_NAMES[item.surah] ||
            `Surah ${item.surah}`;

        li.innerText =
            `${surahName} - Ayah ${item.ayah}`;

        list.appendChild(li);
    });
}