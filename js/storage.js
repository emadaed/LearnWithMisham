const STORAGE_KEYS = {
    STUDENTS: "lwm_students_v1",
    ACTIVE_STUDENT_ID: "lwm_active_student_id",
    PROGRESS_PREFIX: "lwm_progress_v2_",
    HIGHLIGHTS_PREFIX: "lwm_highlights_v2_",
    DIFFICULT_WORDS_PREFIX: "lwm_difficult_words_v1_",
    TEACHER_NOTES_PREFIX: "lwm_teacher_notes_v1_"
};

function saveData(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
}

function loadData(key, defaultValue = null) {
    const data = localStorage.getItem(key);

    if (!data) {
        return defaultValue;
    }

    try {
        return JSON.parse(data);
    } catch {
        return defaultValue;
    }
}

function getActiveStudentId() {
    return localStorage.getItem(STORAGE_KEYS.ACTIVE_STUDENT_ID);
}

function setActiveStudentId(studentId) {
    localStorage.setItem(STORAGE_KEYS.ACTIVE_STUDENT_ID, studentId);
}

function getProgressKey() {
    return STORAGE_KEYS.PROGRESS_PREFIX + getActiveStudentId();
}

function getHighlightsKey() {
    return STORAGE_KEYS.HIGHLIGHTS_PREFIX + getActiveStudentId();
}

function getDifficultWordsKey() {
    return STORAGE_KEYS.DIFFICULT_WORDS_PREFIX + getActiveStudentId();
}

function getTeacherNotesKey() {
    return STORAGE_KEYS.TEACHER_NOTES_PREFIX + getActiveStudentId();
}
