function saveProfile() {

    const profile = {
        studentName:
            document.getElementById("studentName").value,

        teacherName:
            document.getElementById("teacherName").value,

        currentSurah:
            document.getElementById("surahSelect").value
    };

    saveData(
        STORAGE_KEYS.PROFILE,
        profile
    );

    alert("Profile Saved");
}

function loadProfile() {

    const profile = loadData(
        STORAGE_KEYS.PROFILE,
        {}
    );

    if (!profile) return;

    document.getElementById("studentName").value =
        profile.studentName || "";

    document.getElementById("teacherName").value =
        profile.teacherName || "";
}