const GOOGLE_SCRIPT_URL =
    "https://script.google.com/macros/s/AKfycbxF8egf44FpEx-JgikBILPkZNxv2PoaS82aBwvbdBI76JPaNQwbSxPVho8hr-z3zY4ZQQ/exec";

function generateStudentId() {
    let profile =
        loadData(STORAGE_KEYS.PROFILE, {});

    if (!profile.studentId) {
        profile.studentId =
            "LWM-" + Date.now();

        saveData(
            STORAGE_KEYS.PROFILE,
            profile
        );
    }

    return profile.studentId;
}

async function saveProgressToCloud(surahNumber, ayahNumber, status) {
    const profile =
        loadData(STORAGE_KEYS.PROFILE, {});

    const payload = {
        studentId: profile.studentId || generateStudentId(),
        studentName: profile.studentName || "",
        teacherName: profile.teacherName || "",
        surah: surahNumber,
        ayah: ayahNumber,
        status: status
    };

    try {
        await fetch(GOOGLE_SCRIPT_URL, {
            method: "POST",
            mode: "no-cors",
            body: JSON.stringify(payload)
        });

        console.log(
            "Cloud save attempted",
            payload
        );

    } catch (error) {
        console.error(
            "Cloud save failed",
            error
        );
    }
}