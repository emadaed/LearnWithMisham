function generateStudentId() {
    return "LWM-" + Date.now();
}

function getStudents() {
    return loadData(STORAGE_KEYS.STUDENTS, []);
}

function saveStudents(students) {
    saveData(STORAGE_KEYS.STUDENTS, students);
}


function syncStudentProfileToCloud(student) {
    if (
        typeof saveStudentProfileToCloud === "function" &&
        student
    ) {
        saveStudentProfileToCloud(student);
    }
}


function getProfileFormValues() {
    return {
        studentName: document.getElementById("studentName").value.trim(),
        teacherName: document.getElementById("teacherName").value.trim(),
        parentName: document.getElementById("parentName").value.trim(),
        parentEmail: document.getElementById("parentEmail").value.trim(),
        parentWhatsApp: document.getElementById("parentWhatsApp").value.trim()
    };
}

function applyStudentUpdates(student, values) {
    student.studentName = values.studentName;
    student.teacherName = values.teacherName;
    student.parentName = values.parentName;
    student.parentEmail = values.parentEmail;
    student.parentWhatsApp = values.parentWhatsApp;
    student.updatedAt = new Date().toISOString();

    return student;
}

function saveProfile() {
    const values = getProfileFormValues();

    if (!values.studentName) {
        alert("Please enter student name");
        return;
    }

    const students = getStudents();
    const activeStudentId = getActiveStudentId();

    const activeIndex = students.findIndex(student =>
        student.studentId === activeStudentId
    );

    if (activeIndex !== -1) {
        applyStudentUpdates(students[activeIndex], values);
        saveStudents(students);
        setActiveStudentId(students[activeIndex].studentId);
        syncStudentProfileToCloud(students[activeIndex]);

        renderStudentDropdown();
        loadProfile();

        if (typeof loadTeacherNotesField === "function") {
            loadTeacherNotesField();
        }

        if (typeof generateTeacherReport === "function") {
            generateTeacherReport();
        }

        loadSurah();
        updateDashboard();

        alert(
            "Student profile updated. Student ID: " +
            students[activeIndex].studentId
        );

        return;
    }

    const duplicateIndex = students.findIndex(student =>
        student.studentName.toLowerCase() === values.studentName.toLowerCase() &&
        (student.teacherName || "").toLowerCase() === values.teacherName.toLowerCase()
    );

    if (duplicateIndex !== -1) {
        applyStudentUpdates(students[duplicateIndex], values);
        saveStudents(students);
        setActiveStudentId(students[duplicateIndex].studentId);
        syncStudentProfileToCloud(students[duplicateIndex]);

        renderStudentDropdown();
        loadProfile();

        if (typeof loadTeacherNotesField === "function") {
            loadTeacherNotesField();
        }

        if (typeof generateTeacherReport === "function") {
            generateTeacherReport();
        }

        loadSurah();
        updateDashboard();

        alert(
            "This student already exists. Existing profile updated and selected. Student ID: " +
            students[duplicateIndex].studentId
        );

        return;
    }

    const student = {
        studentId: generateStudentId(),
        studentName: values.studentName,
        teacherName: values.teacherName,
        parentName: values.parentName,
        parentEmail: values.parentEmail,
        parentWhatsApp: values.parentWhatsApp,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    };

    students.push(student);

    saveStudents(students);
    setActiveStudentId(student.studentId);
    syncStudentProfileToCloud(student);

    renderStudentDropdown();
    loadProfile();

    if (typeof loadTeacherNotesField === "function") {
        loadTeacherNotesField();
    }

    if (typeof generateTeacherReport === "function") {
        generateTeacherReport();
    }

    updateDashboard();
    loadSurah();

    alert(
        "Student saved. Student ID: " +
        student.studentId
    );
}

function renderStudentDropdown() {
    const select =
        document.getElementById("studentSelect");

    if (!select) return;

    const students = getStudents();
    const activeStudentId = getActiveStudentId();

    select.innerHTML = "";

    if (students.length === 0) {
        const option =
            document.createElement("option");

        option.value = "";
        option.innerText = "No student added yet";

        select.appendChild(option);
        return;
    }

    students.forEach(student => {
        const option =
            document.createElement("option");

        option.value = student.studentId;
        option.innerText =
            `${student.studentName} - ${student.teacherName || "No Teacher"}`;

        if (student.studentId === activeStudentId) {
            option.selected = true;
        }

        select.appendChild(option);
    });
}

function switchStudent() {
    const studentId =
        document.getElementById("studentSelect").value;

    if (!studentId) return;

    setActiveStudentId(studentId);

    loadProfile();

    if (typeof loadTeacherNotesField === "function") {
        loadTeacherNotesField();
    }

    if (typeof generateTeacherReport === "function") {
        generateTeacherReport();
    }

    loadSurah();
    updateDashboard();
}

function getActiveStudent() {
    const students = getStudents();
    const activeStudentId = getActiveStudentId();

    return students.find(
        student => student.studentId === activeStudentId
    ) || null;
}

function setInputValue(id, value) {
    const input = document.getElementById(id);

    if (!input) return;

    input.value = value || "";
}

function loadProfile() {
    renderStudentDropdown();

    const student = getActiveStudent();

    if (!student) {
        setInputValue("studentName", "");
        setInputValue("teacherName", "");
        setInputValue("parentName", "");
        setInputValue("parentEmail", "");
        setInputValue("parentWhatsApp", "");
        return;
    }

    setInputValue("studentName", student.studentName || "");
    setInputValue("teacherName", student.teacherName || "");
    setInputValue("parentName", student.parentName || "");
    setInputValue("parentEmail", student.parentEmail || "");
    setInputValue("parentWhatsApp", student.parentWhatsApp || "");
}
