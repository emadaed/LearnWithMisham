function getProgress() {

    return loadData(
        STORAGE_KEYS.PROGRESS,
        {}
    );
}

function saveProgress(progress) {

    saveData(
        STORAGE_KEYS.PROGRESS,
        progress
    );
}

function setAyahStatus(ayahNumber, status) {

    const progress =
        getProgress();

    progress[ayahNumber] = status;

    saveProgress(progress);

    updateDashboard();
}

function getAyahStatus(ayahNumber) {

    const progress =
        getProgress();

    return progress[ayahNumber] || "not-started";
}

function updateDashboard() {

    const progress =
        getProgress();

    const total =
        Object.keys(progress).length;

    let memorized = 0;
    let revision = 0;

    Object.values(progress)
        .forEach(status => {

            if (status === "memorized") {
                memorized++;
            }

            if (status === "revision") {
                revision++;
            }
        });

    const percent =
        total === 0
            ? 0
            : Math.round(
                (memorized / total) * 100
            );

    document.getElementById(
        "progressFill"
    ).style.width =
        percent + "%";

    document.getElementById(
        "progressText"
    ).innerText =
        percent + "% Complete";

    document.getElementById(
        "revisionCount"
    ).innerText =
        revision;
}