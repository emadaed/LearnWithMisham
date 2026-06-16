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

function buildTeacherReportText() {
    const student = getActiveStudent();

    if (!student) {
        return "Please add or select a student first.";
    }

    const summary = getProgressSummary();
    const difficultWords = getDifficultWords();
    const revisionRefs = getUniqueAyahReferences(summary.revisionItems);
    const difficultWordList = difficultWords.map(item => item.word);
    const difficultRefs = getUniqueAyahReferences(difficultWords);

    const progressLine =
        summary.total === 0
            ? "No ayah progress marked yet."
            : `Memorized: ${summary.memorized} | Learning: ${summary.learning} | Revision: ${summary.revision}`;

    const revisionLine =
        revisionRefs.length === 0
            ? "No revision items marked."
            : revisionRefs.slice(0, 5).join(", ");

    const difficultWordsLine =
        difficultWordList.length === 0
            ? "No highlighted difficult words."
            : difficultWordList.slice(0, 10).join("، ");

    const focusLine =
        difficultRefs.length > 0
            ? `Focus next class: revise highlighted words in ${difficultRefs.slice(0, 3).join(", ")}.`
            : revisionRefs.length > 0
                ? `Focus next class: revise ${revisionRefs.slice(0, 3).join(", ")}.`
                : "Focus next class: continue steady recitation and revision.";

    return ` Learn With Misham — Student Report

Student: ${student.studentName || ""}
Teacher: ${student.teacherName || ""}

 Progress: ${progressLine}
 Revision: ${revisionLine}
 Difficult Words: ${difficultWordList.length}
${difficultWordsLine}

${focusLine}`;
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
