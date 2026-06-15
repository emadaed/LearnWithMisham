function saveProfile() {

    const existingProfile =
        loadData(STORAGE_KEYS.PROFILE, {});

    const profile = {
        studentId:
            existingProfile.studentId || generateStudentId(),

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

    alert(
        "Profile Saved. Student ID: " +
        profile.studentId
    );
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