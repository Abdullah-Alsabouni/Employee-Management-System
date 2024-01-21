// script.js dosyası içeriği
document.getElementById("addButton").addEventListener("click", function() {
    let projectName = document.getElementById("projectName").value;
    let startDate = document.getElementById("startDate").value;
    let endDate = document.getElementById("endDate").value;

    addProject(projectName, startDate, endDate);

    alert("Proje başarıyla eklendi: " + projectName);
    document.getElementById("projectForm").reset();

    displayProjects();
});

// Çalışan ekleme butonu olayı
document.getElementById("addEmployeeButton").addEventListener("click", function() {
    let employeeName = document.getElementById("employeeName").value;
    let employeeEmail = document.getElementById("employeeEmail").value;
    let employeePhone = document.getElementById("employeePhone").value;

    addEmployee(employeeName, employeeEmail, employeePhone);

    alert("Çalışan başarıyla eklendi: " + employeeName);
    document.getElementById("employeeForm").reset();

    displayEmployees();
});
// Çalışan silme fonksiyonu
function removeEmployee(email) {
    deleteEmployee(email);
    displayEmployees();
}

// Görev ekleme butonu olayı
document.getElementById("addTaskButton").addEventListener("click", function() {
    let taskProject = document.getElementById("taskProject").value;
    let taskName = document.getElementById("taskName").value;
    let taskAssignee = document.getElementById("taskAssignee").value;
    let taskStartDate = document.getElementById("taskStartDate").value;
    let taskDuration = document.getElementById("taskDuration").value;
    let taskStatus = document.getElementById("taskStatus").value; // Yeni eklenen satır

     // Gecikme kontrolü ve projenin bitiş tarihini güncelleme
     if (checkTaskCompletion(taskProject, taskStartDate, taskDuration)) {
        updateProjectEndDate(taskProject);
    }


    addTask(taskProject, taskName, taskAssignee, taskStartDate, taskDuration, taskStatus);

    alert("Görev başarıyla eklendi: " + taskName);
    document.getElementById("taskForm").reset();

    displayTasks();
    displayProjects();
});
// Görev detaylarını modal üzerinde gösterme fonksiyonu
function showTaskDetails(project, name, assignee) {
    const task = getTask(project, name, assignee);

    if (task) {
        document.getElementById("modalProjectName").innerText = task.project;
        document.getElementById("modalTaskName").innerText = task.name;
        document.getElementById("modalAssignee").innerText = task.assignee;
        document.getElementById("modalStartDate").innerText = task.start;
        document.getElementById("modalEndDate").innerText = task.end;
        document.getElementById("modalStatus").innerText = task.status;

        // Modalı göster
        const taskDetailModal = new bootstrap.Modal(document.getElementById("taskDetailModal"));
        taskDetailModal.show();
    }
}
function addTask(taskProject, taskName, taskAssignee, taskStartDate, taskDuration, taskStatus) {
    let newTask = {
        project: taskProject,
        name: taskName,
        assignee: taskAssignee,
        start: taskStartDate,
        duration: taskDuration,
        status: taskStatus // Yeni eklenen satır
    };

    tasks.push(newTask);
    saveTasks();
}



function displayProjects() {
    let projectsTableBody = document.getElementById("projectsTableBody");
    projectsTableBody.innerHTML = ""; // Projeleri her seferinde temizle

    let projects = getProjects();
    projects.forEach(project => {
        let row = document.createElement("tr");
        row.innerHTML = `<td>${project.name}</td><td>${project.start}</td><td>${project.end}</td>`;
        projectsTableBody.appendChild(row);
    });
}

function displayEmployees() {
    let employeesTableBody = document.getElementById("employeesTableBody");
    employeesTableBody.innerHTML = ""; // Çalışanları her seferinde temizle

    let employees = getEmployees();
    employees.forEach(employee => {
        let row = document.createElement("tr");
        row.innerHTML = `<td>${employee.name}</td><td>${employee.email}</td><td>${employee.phone}</td><td><button class="btn btn-danger" onclick="removeEmployee('${employee.email}')">Sil</button></td>`;
        employeesTableBody.appendChild(row);
    });
}

function displayTasks() {
    let tasksTableBody = document.getElementById("tasksTableBody");
    tasksTableBody.innerHTML = ""; // Görevleri her seferinde temizle

    let tasks = getTasks();
    tasks.forEach(task => {
        let row = document.createElement("tr");
        row.innerHTML = `<td>${task.project}</td><td>${task.name}</td><td>${task.assignee}</td>`;
        tasksTableBody.appendChild(row);

        // Görev tamamlandıysa durumu güncelle
        if (isTaskCompleted(task)) {
            row.classList.add("table-success"); // Özel bir sınıf ekleyerek stil uygulayabilirsiniz
        }
    });
}

// Görev silme fonksiyonu
function removeTask(name) {
    deleteTask(name);
    displayTasks();
}

// Görev tamamlandı mı kontrolü
function isTaskCompleted(task) {
    const currentDate = new Date();
    const startDate = new Date(task.start);
    const endDate = new Date(task.end);
    const durationInDays = parseInt(task.duration, 10);

    // Görevin bitiş tarihi geçmiş ve gün sayısı kadar gün geçmişse tamamlandı kabul et
    return currentDate > endDate && (currentDate - endDate) / (1000 * 60 * 60 * 24) >= durationInDays;
}

// Sayfa yüklendiğinde projeleri, çalışanları ve görevleri görüntüle
document.addEventListener("DOMContentLoaded", function() {
    displayProjects();
    displayEmployees();
    displayTasks();
});

// Görev eklemek için projeye tıklanınca olay dinleyici
document.getElementById("tasksTableBody").addEventListener("click", function(event) {
    const clickedElement = event.target;

    // Tıklanan elemanın bir buton olup olmadığını kontrol et
    if (clickedElement.tagName === "BUTTON" && clickedElement.classList.contains("addTaskButton")) {
        // Tıklanan düğmenin verilerini al
        const projectIndex = clickedElement.dataset.projectIndex;
        const projectName = projects[projectIndex].name;

        // Görev eklemek için modal veya başka bir yöntem kullanabilirsin
        // Örnek olarak bir prompt kullanalım
        const taskName = prompt(`Görev adını girin for ${projectName}:`);
        const taskAssignee = prompt(`Görevi yapacak kişiyi girin for ${projectName}:`);
        const taskStartDate = prompt(`Görev başlangıç tarihini girin for ${projectName}:`);
        const taskDuration = prompt(`Görev süresini (gün) girin for ${projectName}:`);

        // Görev eklemek için addTask fonksiyonunu çağır
        addTask(projectName, taskName, taskAssignee, taskStartDate, taskDuration);

        // Eklenen görevi görüntüle
        displayTasks();
    }
});

function checkTaskCompletion(projectName, taskStartDate, taskDuration) {
    let project = getProjectByName(projectName);
    let currentDate = new Date();
    let startDate = new Date(taskStartDate);
    let durationInDays = parseInt(taskDuration, 10);

    // Görevin bitiş tarihi geçmişse ve gün sayısı kadar gün geçmişse tamamlandı kabul et
    if (currentDate > startDate && (currentDate - startDate) / (1000 * 60 * 60 * 24) >= durationInDays) {
        return true;
    }

    return false;
}

function updateProjectEndDate(projectName) {
    let project = getProjectByName(projectName);
    let currentDate = new Date(project.end);
    let delayInDays = calculateDelay(projectName);

    // Projeyi geciktir
    currentDate.setDate(currentDate.getDate() + delayInDays);

    // Güncellenen bitiş tarihini kaydet
    project.end = currentDate.toISOString().split('T')[0];
    saveProjects();
}

function calculateDelay(projectName) {
    let tasksForProject = tasks.filter(task => task.project === projectName && task.status === "Tamamlandı");
    let delayInDays = 0;

    tasksForProject.forEach(task => {
        let endDate = new Date(task.start);
        endDate.setDate(endDate.getDate() + parseInt(task.duration, 10));

        if (endDate < new Date(task.end)) {
            // Görevin bitiş tarihi, projenin bitiş tarihinden önce tamamlandıysa gecikme hesapla
            delayInDays += (new Date(task.end) - endDate) / (1000 * 60 * 60 * 24);
        }
    });

    return Math.ceil(delayInDays); // Gecikme miktarını yuvarla ve gün cinsinden döndür
}

// Projeleri gösterme fonksiyonunu güncelle
function displayProjects() {
    let projectsTableBody = document.getElementById("projectsTableBody");
    projectsTableBody.innerHTML = ""; // Projeleri her seferinde temizle

    projects.forEach((project, index) => {
        let row = document.createElement("tr");
        row.innerHTML = `<td>${project.name}</td><td>${project.start}</td><td>${project.end}</td><td><button class="btn btn-info addTaskButton" data-project-index="${index}">Görev Ekle</button></td>`;
        projectsTableBody.appendChild(row);
    });
}

// Görev detaylarını modal üzerinde gösterme fonksiyonu
function showTaskDetails(project, name, assignee, startDate, duration) {
    document.getElementById("modalProjectName").innerText = project;
    document.getElementById("modalTaskName").innerText = name;
    document.getElementById("modalAssignee").innerText = assignee;
    document.getElementById("modalStartDate").innerText = startDate;
    document.getElementById("modalDuration").innerText = duration;
    

    // Modalı göster
    const taskDetailModal = new bootstrap.Modal(document.getElementById("taskDetailModal"));
    taskDetailModal.show();
}

// Görevleri gösterme fonksiyonunu güncelle
function displayTasks() {
    let tasksTableBody = document.getElementById("tasksTableBody");
    tasksTableBody.innerHTML = ""; // Görevleri her seferinde temizle

    let tasks = getTasks();
    tasks.forEach(task => {
        let row = document.createElement("tr");
        row.innerHTML = `<td>${task.project}</td><td>${task.name}</td><td>${task.assignee}</td><td>${task.status}</td><td><button class="btn btn-info" onclick="showTaskDetails('${task.project}', '${task.name}', '${task.assignee}', '${task.start}', '${task.duration}', '${task.status}')">Detay</button></td>`;
        tasksTableBody.appendChild(row);

        // Görev tamamlandıysa durumu güncelle
        if (isTaskCompleted(task)) {
            row.classList.add("table-success");
        }
    });
}

document.addEventListener("DOMContentLoaded", function() {
    // "Proje seç" alanını ve "Eklenen Projeler" listesini seçin
    let taskProjectSelect = document.getElementById("taskProject");
    let projectsTableBody = document.getElementById("projectsTableBody");

    // "Eklenen Projeler" listesinden projeleri al
    let projects = getProjects();

    // Projeleri "Proje seç" alanına dinamik olarak ekle
    projects.forEach(project => {
        let option = document.createElement("option");
        option.value = project.name;
        option.text = project.name;
        taskProjectSelect.appendChild(option);
    });
});

// Proje listesini getiren bir fonksiyon
function getProjects() {
    // Önceki kodla aynı şekilde projeleri alabilirsiniz
    // Örneğin, storage.js dosyasındaki getProjects fonksiyonunu kullanabilirsiniz
    return [
        { name: "Vtys", start: "2024-12-12", end: "2024-12-15" },
        { name: "Mobil", start: "2024-06-15", end: "2024-06-18" },
        { name: "Sistem programlama", start: "2024-04-13", end: "2024-06-18" },
        // Diğer projeler...
    ];
}

function getProjectByName(projectName) {
    return projects.find(project => project.name === projectName);
}

// Çalışanlara ait görevleri görüntülemek için yeni bir fonksiyon ekleyin
function showEmployeeTasks(email) {
    const employee = getEmployeeByEmail(email);
    
    // Çalışanın adını ve emailini modal üzerinde göster
    document.getElementById("modalEmployeeName").innerText = employee.name;
    document.getElementById("modalEmployeeEmail").innerText = employee.email;

    // Çalışanın görevlerini al
    const employeeTasks = getTasksByAssignee(employee.name);

    // Görevleri modal üzerinde göster
    const tasksList = document.getElementById("modalEmployeeTasks");
    tasksList.innerHTML = "";

    employeeTasks.forEach(task => {
        let taskStatus;
        if (isTaskCompleted(task)) {
            taskStatus = "Tamamlandı";
        } else if (isTaskInProgress(task)) {
            taskStatus = "Devam Ediyor";
        } else {
            taskStatus = "Başlayacak";
        }

        let row = document.createElement("tr");
        row.innerHTML = `<td>${task.project}</td><td>${task.name}</td><td>${taskStatus}</td>`;
        tasksList.appendChild(row);
    });

    // Modalı göster
    const employeeTasksModal = new bootstrap.Modal(document.getElementById("employeeTasksModal"));
    employeeTasksModal.show();
}

// Çalışanın zamanında tamamladığı ve tamamlayamadığı görev sayılarını göstermek için yeni bir fonksiyon ekleyin
function showEmployeeTaskStats(email) {
    const employee = getEmployeeByEmail(email);
    const employeeTasks = getTasksByAssignee(employee.name);

    let completedTasksCount = 0;
    let overdueTasksCount = 0;

    employeeTasks.forEach(task => {
        if (isTaskCompleted(task)) {
            completedTasksCount++;
        } else if (isTaskOverdue(task)) {
            overdueTasksCount++;
        }
    });

    alert(`Çalışanın Görev İstatistikleri:\nTamamlanan Görevler: ${completedTasksCount}\nTamamlanamayan Görevler: ${overdueTasksCount}`);
}

// Çalışanlar tablosundaki detay butonuna olay ekleyin
document.getElementById("employeesTableBody").addEventListener("click", function(event) {
    const clickedElement = event.target;

    if (clickedElement.tagName === "BUTTON" && clickedElement.classList.contains("employeeDetailButton")) {
        const employeeEmail = clickedElement.dataset.employeeEmail;
        showEmployeeTasks(employeeEmail);
    }
});

// Çalışanları listelemek için tabloyu güncelleyin
function displayEmployees() {
    let employeesTableBody = document.getElementById("employeesTableBody");
    employeesTableBody.innerHTML = "";

    let employees = getEmployees();
    employees.forEach(employee => {
        let row = document.createElement("tr");
        row.innerHTML = `<td>${employee.name}</td><td>${employee.email}</td><td>${employee.phone}</td>
                        <td><button class="btn btn-danger" onclick="removeEmployee('${employee.email}')">Sil</button></td>
                        <td><button class="btn btn-info employeeDetailButton" data-bs-toggle="modal" data-bs-target="#employeeDetailModal" onclick="showEmployeeTasks('${employee.email}')">Detay</button></td>`;
        employeesTableBody.appendChild(row);
    });
}
function showEmployeeTasks(email) {
    // Çalışanın email'ine göre bilgilerini getiren fonksiyon
    function getEmployeeByEmail(email) {
        let employees = getEmployees(); // Çalışan listesini almak için kullanılacak bir fonksiyonunuz olduğunu varsayalım
        return employees.find(employee => employee.email === email);
    }

    // Çalışanı al
    const employee = getEmployeeByEmail(email);

    // Çalışanın adını ve emailini modal üzerinde göster
    document.getElementById("modalEmployeeName").innerText = employee.name;
    document.getElementById("modalEmployeeEmail").innerText = employee.email;

    // Çalışanın görevlerini al
    const employeeTasks = getTasksByAssignee(employee.name);

    // Görevleri modal üzerinde göster
    const tasksList = document.getElementById("modalEmployeeTasks");
    tasksList.innerHTML = "";

    employeeTasks.forEach(task => {
        let taskStatus;
        if (isTaskCompleted(task)) {
            taskStatus = "Tamamlandı";
        } else if (isTaskInProgress(task)) {
            taskStatus = "Devam Ediyor";
        } else {
            taskStatus = "Başlayacak";
        }

        let row = document.createElement("tr");
        row.innerHTML = `<td>${task.project}</td><td>${task.name}</td><td>${taskStatus}</td>`;
        tasksList.appendChild(row);
    });
    
    // Eklenen kod: Görev tablosunu güncelle
    displayEmployeeTasks(employeeTasks);
}

// Çalışanın görevlerini modal üzerinde gösterme fonksiyonunu güncelleyin
function showEmployeeTasks(email) {
    // Çalışanın email'ine göre bilgilerini getiren fonksiyon
    function getEmployeeByEmail(email) {
        let employees = getEmployees(); // Çalışan listesini almak için kullanılacak bir fonksiyonunuz olduğunu varsayalım
        return employees.find(employee => employee.email === email);
    }

    // Çalışanı al
    const employee = getEmployeeByEmail(email);

    // Çalışanın adını ve emailini modal üzerinde göster
    document.getElementById("modalEmployeeName").innerText = employee.name;
    document.getElementById("modalEmployeeEmail").innerText = employee.email;

    // Çalışanın görevlerini al
    const employeeTasks = getTasksByAssignee(employee.name);

    // Görevleri modal üzerinde göster
    const tasksList = document.getElementById("modalEmployeeTasks");
    tasksList.innerHTML = "";

    employeeTasks.forEach(task => {
        let taskStatus;
        if (isTaskCompleted(task)) {
            taskStatus = "Tamamlandı";
        } else if (isTaskInProgress(task)) {
            taskStatus = "Devam Ediyor";
        } else {
            taskStatus = "Başlayacak";
        }

        let row = document.createElement("tr");
        row.innerHTML = `<td>${task.project}</td><td>${task.name}</td><td>${taskStatus}</td>`;
        tasksList.appendChild(row);
    });
    
    // Eklenen kod: Görev tablosunu güncelle
    displayEmployeeTasks(employeeTasks);
}
