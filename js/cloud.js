const GOOGLE_SCRIPT_URL =
    "https://script.google.com/macros/s/AKfycbxF8egf44FpEx-JgikBILPkZNxv2PoaS82aBwvbdBI76JPaNQwbSxPVho8hr-z3zY4ZQQ/exec";

async function saveProgressToCloud(surahNumber, ayahNumber, status) {
    const student = getActiveStudent();

    if (!student) {
        console.warn("No active student. Cloud save skipped.");
        return;
    }

    const payload = {
        studentId: student.studentId,
        studentName: student.studentName || "",
        teacherName: student.teacherName || "",
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