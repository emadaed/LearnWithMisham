const STORAGE_KEYS = {
    PROFILE: "lwm_profile",
    PROGRESS: "lwm_progress"
};

function saveData(key, data) {
    localStorage.setItem(
        key,
        JSON.stringify(data)
    );
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