function getProgressSummary() {
    const progress = getProgress();
    const entries = Object.values(progress);

    const summary = {
        total: entries.length,
        learning: 0,
        memorized: 0,
        revision: 0,
        notStarted: 0,
        revisionItems: []
    };

    entries.forEach(item => {
        if (item.status === "learning") {
            summary.learning++;
        } else if (item.status === "memorized") {
            summary.memorized++;
        } else if (item.status === "revision") {
            summary.revision++;
            summary.revisionItems.push(item);
        } else {
            summary.notStarted++;
        }
    });

    return summary;
}

function getDifficultWords() {
    const studentId = getActiveStudentId();

    if (!studentId) {
        return [];
    }

    return loadData(getDifficultWordsKey(), []);
}

function getTeacherNotes() {
    const studentId = getActiveStudentId();

    if (!studentId) {
        return "";
    }

    const notesData = loadData(getTeacherNotesKey(), {
        note: "",
        updatedAt: ""
    });

    return notesData.note || "";
}

function loadTeacherNotesField() {
    const notesBox = document.getElementById("teacherNotes");

    if (!notesBox) return;

    notesBox.value = getTeacherNotes();
}

function saveTeacherNotes() {
    const student = getActiveStudent();

    if (!student) {
        alert("Please add or select a student first.");
        return;
    }

    const notesBox = document.getElementById("teacherNotes");

    if (!notesBox) return;

    const note = notesBox.value.trim();

    saveData(getTeacherNotesKey(), {
        studentId: student.studentId,
        studentName: student.studentName || "",
        teacherName: student.teacherName || "",
        note: note,
        updatedAt: new Date().toISOString()
    });

    generateTeacherReport();
    alert("Teacher notes saved.");
}

function formatAyahReference(item) {
    const surahName =
        SURAH_NAMES[item.surah] || `Surah ${item.surah}`;

    return `${surahName} Ayah ${item.ayah}`;
}

function getUniqueAyahReferences(items) {
    const seen = {};

    items.forEach(item => {
        const key = `${item.surah}:${item.ayah}`;
        seen[key] = formatAyahReference(item);
    });

    return Object.values(seen);
}

function getUniqueDifficultWords(difficultWords) {
    const seen = {};

    difficultWords.forEach(item => {
        const word = (item.word || "").trim();

        if (word) {
            seen[word] = word;
        }
    });

    return Object.values(seen);
}

function buildTeacherReportText() {
    const student = getActiveStudent();

    if (!student) {
        return "Please add or select a student first.";
    }

    const summary = getProgressSummary();
    const difficultWords = getDifficultWords();
    const uniqueDifficultWords = getUniqueDifficultWords(difficultWords);
    const revisionRefs = getUniqueAyahReferences(summary.revisionItems);
    const difficultRefs = getUniqueAyahReferences(difficultWords);
    const teacherNote = getTeacherNotes();

    const progressText =
        summary.total === 0
            ? "No ayah progress marked yet."
            : `Memorized: ${summary.memorized}\nLearning: ${summary.learning}\nRevision: ${summary.revision}`;

    const revisionText =
        revisionRefs.length === 0
            ? "No revision items marked."
            : revisionRefs.slice(0, 5).join("\n");

    const difficultWordsText =
        uniqueDifficultWords.length === 0
            ? "No highlighted difficult words."
            : uniqueDifficultWords.slice(0, 10).join("\n");

    const focusText =
        difficultRefs.length > 0
            ? `Revise highlighted words in ${difficultRefs.slice(0, 3).join(", ")}.`
            : revisionRefs.length > 0
                ? `Revise ${revisionRefs.slice(0, 3).join(", ")}.`
                : "Continue steady recitation and revision.";

    const teacherNotesText =
        teacherNote
            ? teacherNote
            : "No teacher note added yet.";

    return `Learn With Misham — Student Report

Student: ${student.studentName || ""}
Teacher: ${student.teacherName || ""}

Progress:
${progressText}

Revision Needed:
${revisionText}

Difficult Words: ${uniqueDifficultWords.length}
${difficultWordsText}

Focus Next Class:
${focusText}

Teacher Notes:
${teacherNotesText}`;
}

function generateTeacherReport() {
    const reportBox =
        document.getElementById("teacherReportText");

    if (!reportBox) return;

    reportBox.value = buildTeacherReportText();
}

async function copyTeacherReport() {
    const reportBox =
        document.getElementById("teacherReportText");

    if (!reportBox) return;

    try {
        await navigator.clipboard.writeText(reportBox.value);
        alert("Teacher report copied. You can paste it in WhatsApp or email.");
    } catch (error) {
        reportBox.select();
        document.execCommand("copy");
        alert("Teacher report copied. You can paste it in WhatsApp or email.");
    }
}

function shareTeacherReportOnWhatsApp() {
    const reportText = buildTeacherReportText();
    const whatsappUrl =
        "https://wa.me/?text=" + encodeURIComponent(reportText);

    window.open(whatsappUrl, "_blank");
}
