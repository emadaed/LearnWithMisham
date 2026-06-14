function makeAyahId(surahNumber, ayahNumber) {
    return `surah-${surahNumber}-ayah-${ayahNumber}`;
}

function getProgress() {
    return loadData(STORAGE_KEYS.PROGRESS, {});
}

function saveProgress(progress) {
    saveData(STORAGE_KEYS.PROGRESS, progress);
}

function setAyahStatus(surahNumber, ayahNumber, status) {
    const progress = getProgress();

    const ayahId = makeAyahId(surahNumber, ayahNumber);

    progress[ayahId] = {
        surah: Number(surahNumber),
        ayah: Number(ayahNumber),
        status: status,
        updatedAt: new Date().toISOString()
    };

    saveProgress(progress);

    updateDashboard();
}

function getAyahStatus(surahNumber, ayahNumber) {
    const progress = getProgress();

    const ayahId = makeAyahId(surahNumber, ayahNumber);

    if (!progress[ayahId]) {
        return "not-started";
    }

    return progress[ayahId].status;
}

function updateDashboard() {
    const progress = getProgress();

    const entries = Object.values(progress);

    const total = entries.length;

    let memorized = 0;
    let revision = 0;

    entries.forEach(item => {
        if (item.status === "memorized") {
            memorized++;
        }

        if (item.status === "revision") {
            revision++;
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
}