// storage.js dosyası içeriği
let projects = [];
let employees = [];
let tasks = [];

document.addEventListener("DOMContentLoaded", function() {
    loadProjects();
    loadEmployees();
    loadTasks();
});

function loadProjects() {
    const storedProjects = JSON.parse(localStorage.getItem("projects"));
    if (storedProjects) {
        projects = storedProjects;
    }
}

function loadEmployees() {
    const storedEmployees = JSON.parse(localStorage.getItem("employees"));
    if (storedEmployees) {
        employees = storedEmployees;
    }
}

function loadTasks() {
    const storedTasks = JSON.parse(localStorage.getItem("tasks"));
    if (storedTasks) {
        tasks = storedTasks;
    }
}

function saveProjects() {
    localStorage.setItem("projects", JSON.stringify(projects));
}

function saveEmployees() {
    localStorage.setItem("employees", JSON.stringify(employees));
}

function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

function addProject(projectName, startDate, endDate) {
    let newProject = {
        name: projectName,
        start: startDate,
        end: endDate
    };

    projects.push(newProject);
    saveProjects();
}

function addEmployee(employeeName, employeeEmail, employeePhone) {
    let newEmployee = {
        name: employeeName,
        email: employeeEmail,
        phone: employeePhone
    };

    employees.push(newEmployee);
    saveEmployees();
}

function addTask(taskProject, taskName, taskAssignee, taskStartDate, taskDuration) {
    let newTask = {
        project: taskProject,
        name: taskName,
        assignee: taskAssignee,
        start: taskStartDate,
        duration: taskDuration
    };

    tasks.push(newTask);
    saveTasks();
}

function deleteEmployee(email) {
    employees = employees.filter(employee => employee.email !== email);
    saveEmployees();
}

function deleteTask(name) {
    tasks = tasks.filter(task => task.name !== name);
    saveTasks();
}

function getProjects() {
    return projects;
}

function getEmployees() {
    return employees;
}

function getTasks() {
    return tasks;
}
