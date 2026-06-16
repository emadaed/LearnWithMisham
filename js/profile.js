function generateStudentId() {
    return "LWM-" + Date.now();
}

function getStudents() {
    return loadData(STORAGE_KEYS.STUDENTS, []);
}

function saveStudents(students) {
    saveData(STORAGE_KEYS.STUDENTS, students);
}

function saveProfile() {
    const studentName =
        document.getElementById("studentName").value.trim();

    const teacherName =
        document.getElementById("teacherName").value.trim();

    if (!studentName) {
        alert("Please enter student name");
        return;
    }

    const students = getStudents();

    const student = {
        studentId: generateStudentId(),
        studentName: studentName,
        teacherName: teacherName,
        createdAt: new Date().toISOString()
    };
    const duplicateStudent = students.find(student =>
        student.studentName.toLowerCase() === studentName.toLowerCase() &&
        student.teacherName.toLowerCase() === teacherName.toLowerCase()
    );

    if (duplicateStudent) {
        setActiveStudentId(duplicateStudent.studentId);

        renderStudentDropdown();
        loadProfile();

        if (typeof loadTeacherNotesField === "function") {
            loadTeacherNotesField();
        }

        loadSurah();
        updateDashboard();

        alert(
            "This student already exists. Existing profile selected. Student ID: " +
            duplicateStudent.studentId
        );

        return;
    }

    students.push(student);

    saveStudents(students);
    setActiveStudentId(student.studentId);

    renderStudentDropdown();
    loadProfile();

    if (typeof loadTeacherNotesField === "function") {
        loadTeacherNotesField();
    }

    updateDashboard();
    loadSurah();

    alert(
        "Student Saved. Student ID: " +
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

function loadProfile() {
    renderStudentDropdown();

    const student = getActiveStudent();

    if (!student) {
        document.getElementById("studentName").value = "";
        document.getElementById("teacherName").value = "";
        return;
    }

    document.getElementById("studentName").value =
        student.studentName || "";

    document.getElementById("teacherName").value =
        student.teacherName || "";
}