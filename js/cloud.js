const GOOGLE_SCRIPT_URL =
    "https://script.google.com/macros/s/AKfycbxF8egf44FpEx-JgikBILPkZNxv2PoaS82aBwvbdBI76JPaNQwbSxPVho8hr-z3zY4ZQQ/exec";

async function postToCloud(payload) {
    try {
        await fetch(GOOGLE_SCRIPT_URL, {
            method: "POST",
            mode: "no-cors",
            body: JSON.stringify(payload)
        });

        console.log("Cloud save attempted", payload);

    } catch (error) {
        console.error("Cloud save failed", error);
    }
}

async function saveProgressToCloud(surahNumber, ayahNumber, status) {
    const student = getActiveStudent();

    if (!student) {
        console.warn("No active student. Cloud progress save skipped.");
        return;
    }

    const payload = {
        type: "progress",
        studentId: student.studentId,
        studentName: student.studentName || "",
        teacherName: student.teacherName || "",
        surah: Number(surahNumber),
        ayah: Number(ayahNumber),
        status: status
    };

    await postToCloud(payload);
}

async function saveDifficultWordToCloud(surahNumber, ayahNumber, wordIndex, word, difficultyStatus) {
    const student = getActiveStudent();

    if (!student) {
        console.warn("No active student. Difficult word cloud save skipped.");
        return;
    }

    const payload = {
        type: "difficultWord",
        studentId: student.studentId,
        studentName: student.studentName || "",
        teacherName: student.teacherName || "",
        surah: Number(surahNumber),
        ayah: Number(ayahNumber),
        wordIndex: Number(wordIndex),
        word: word.trim(),
        difficultyStatus: difficultyStatus
    };

    await postToCloud(payload);
}


function getTeacherNotesForCloud() {
    const notesField = document.getElementById("teacherNotes");

    if (notesField) {
        return notesField.value.trim();
    }

    if (
        typeof getTeacherNotesKey === "function" &&
        typeof loadData === "function"
    ) {
        return loadData(getTeacherNotesKey(), "");
    }

    return "";
}

async function saveStudentProfileToCloud(student) {
    if (!student) {
        console.warn("No student profile. Cloud student sync skipped.");
        return;
    }

    const payload = {
        type: "studentProfile",
        studentId: student.studentId || "",
        studentName: student.studentName || "",
        teacherName: student.teacherName || "",
        parentName: student.parentName || "",
        parentEmail: student.parentEmail || "",
        parentWhatsApp: student.parentWhatsApp || "",
        teacherNotes: getTeacherNotesForCloud(),
        createdAt: student.createdAt || "",
        updatedAt: student.updatedAt || new Date().toISOString()
    };

    await postToCloud(payload);
}
