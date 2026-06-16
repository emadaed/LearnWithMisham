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

function formatDateForReport(date) {
    return date.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric"
    });
}

function getCurrentWeekRange() {
    const now = new Date();
    const start = new Date(now);
    const day = start.getDay();
    const diffToMonday = day === 0 ? -6 : 1 - day;

    start.setDate(start.getDate() + diffToMonday);
    start.setHours(0, 0, 0, 0);

    const end = new Date(start);
    end.setDate(start.getDate() + 6);
    end.setHours(23, 59, 59, 999);

    return { start, end };
}

function isDateInRange(value, start, end) {
    if (!value) return false;

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return false;
    }

    return date >= start && date <= end;
}

function getWeeklyProgressSummary() {
    const { start, end } = getCurrentWeekRange();
    const progress = getProgress();
    const entries = Object.values(progress);

    const summary = {
        start,
        end,
        totalUpdated: 0,
        learning: 0,
        memorized: 0,
        revision: 0,
        learningItems: [],
        memorizedItems: [],
        revisionItems: []
    };

    entries.forEach(item => {
        if (!isDateInRange(item.updatedAt, start, end)) {
            return;
        }

        summary.totalUpdated++;

        if (item.status === "learning") {
            summary.learning++;
            summary.learningItems.push(item);
        }

        if (item.status === "memorized") {
            summary.memorized++;
            summary.memorizedItems.push(item);
        }

        if (item.status === "revision") {
            summary.revision++;
            summary.revisionItems.push(item);
        }
    });

    return summary;
}

function getWeeklyDifficultWords() {
    const { start, end } = getCurrentWeekRange();
    const difficultWords = getDifficultWords();

    return difficultWords.filter(item =>
        isDateInRange(item.addedAt, start, end)
    );
}

function getStudentContactLines(student) {
    const parentName = student.parentName || "Not added";
    const parentEmail = student.parentEmail || "Not added";
    const parentWhatsApp = student.parentWhatsApp || "Not added";

    return `Student: ${student.studentName || ""}\nTeacher: ${student.teacherName || ""}\nParent: ${parentName}\nEmail: ${parentEmail}\nWhatsApp: ${parentWhatsApp}`;
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

${getStudentContactLines(student)}

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

function buildWeeklyTeacherReportText() {
    const student = getActiveStudent();

    if (!student) {
        return "Please add or select a student first.";
    }

    const weeklySummary = getWeeklyProgressSummary();
    const weeklyDifficultWords = getWeeklyDifficultWords();
    const weeklyUniqueDifficultWords = getUniqueDifficultWords(weeklyDifficultWords);
    const weeklyRevisionRefs = getUniqueAyahReferences(weeklySummary.revisionItems);
    const weeklyMemorizedRefs = getUniqueAyahReferences(weeklySummary.memorizedItems);
    const teacherNote = getTeacherNotes();

    const weekText =
        `${formatDateForReport(weeklySummary.start)} to ${formatDateForReport(weeklySummary.end)}`;

    const weeklyProgressText =
        weeklySummary.totalUpdated === 0
            ? "No ayah status updates recorded this week."
            : `Ayahs Updated: ${weeklySummary.totalUpdated}\nMemorized This Week: ${weeklySummary.memorized}\nLearning This Week: ${weeklySummary.learning}\nRevision Marked This Week: ${weeklySummary.revision}`;

    const memorizedText =
        weeklyMemorizedRefs.length === 0
            ? "No new memorized ayahs marked this week."
            : weeklyMemorizedRefs.slice(0, 8).join("\n");

    const revisionText =
        weeklyRevisionRefs.length === 0
            ? "No revision items marked this week."
            : weeklyRevisionRefs.slice(0, 8).join("\n");

    const difficultWordsText =
        weeklyUniqueDifficultWords.length === 0
            ? "No difficult words highlighted this week."
            : weeklyUniqueDifficultWords.slice(0, 10).join("\n");

    const focusText =
        weeklyRevisionRefs.length > 0
            ? `Next week, revise ${weeklyRevisionRefs.slice(0, 3).join(", ")}.`
            : weeklyUniqueDifficultWords.length > 0
                ? "Next week, revise the difficult words highlighted above."
                : "Continue steady recitation, memorization, and revision.";

    const teacherNotesText =
        teacherNote
            ? teacherNote
            : "No teacher note added yet.";

    return `Learn With Misham — Weekly Student Report

Week: ${weekText}

${getStudentContactLines(student)}

Weekly Progress:
${weeklyProgressText}

Memorized This Week:
${memorizedText}

Revision Needed:
${revisionText}

Difficult Words This Week: ${weeklyUniqueDifficultWords.length}
${difficultWordsText}

Focus Next Week:
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

function generateWeeklyTeacherReport() {
    const reportBox =
        document.getElementById("teacherReportText");

    if (!reportBox) return;

    reportBox.value = buildWeeklyTeacherReportText();
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
    const reportBox =
        document.getElementById("teacherReportText");

    const reportText =
        reportBox && reportBox.value.trim()
            ? reportBox.value
            : buildTeacherReportText();

    const whatsappUrl =
        "https://wa.me/?text=" + encodeURIComponent(reportText);

    window.open(whatsappUrl, "_blank");
}
