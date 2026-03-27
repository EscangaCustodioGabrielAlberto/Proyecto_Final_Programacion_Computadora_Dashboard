/* ===============================
   1. SELECCIONAR ELEMENTOS DEL DOM
   =============================== */

/*
JavaScript primero debe localizar los elementos
con los que va a trabajar dentro de la página.
*/

// Campo donde el usuario escribe la tarea
const input = document.getElementById("taskInput");

// Botón para agregar tarea
const button = document.getElementById("addTaskBtn");

// Contenedor donde aparecerán las tareas
const taskList = document.getElementById("taskList");

//Elementos de total de tareas
const totalTasks = document.getElementById("totalTasks");
const completedTasks = document.getElementById("completedTasks");
const pendingTasks = document.getElementById("pendingTasks");
const progressTasks = document.getElementById("progress");

//Boton para completar todas las tareas
const completeAllBtn = document.getElementById("completeAllBtn");

//Botones sort
const sortAZ = document.getElementById("sortAZ");
const sortZA = document.getElementById("sortZA");

//Modelo de datos
let tasks = [];

//Guardar en el Local Storage
function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

function loadTasks() {
    const saved = localStorage.getItem("tasks");

    if(saved) {
        tasks = JSON.parse(saved);
    }
}

/* ===============================
   2. ESCUCHAR EVENTO DEL BOTÓN
   =============================== */
//Boton de A->Z
sortAZ.addEventListener("click", function(){

    tasks.sort(function(a,b) {
        const textA = a.text;
        const textB = b.text;

        return textA.localeCompare(textB);
    });

    saveTasks();
    renderTasks();
})

sortZA.addEventListener("click", function(){
    

    tasks.sort(function(primerPalabra,segundaPalabra) {
        const textA = primerPalabra.text;
        const textB = segundaPalabra.text;

        return textB.localeCompare(textA);
    });

    saveTasks();
    renderTasks();

})

/*
addEventListener permite ejecutar código
cuando ocurre una acción del usuario.
*/

button.addEventListener("click", function() {
    createTask();
});

input.addEventListener("keypress", function(tecla) {
   if(tecla.key === "Enter") {
      createTask();
   }
});

function updateStats() {
   const tasks = document.querySelectorAll(".task-item");
   const completed = document.querySelectorAll(".task-item.completed");

   const total = tasks.length;
   const done = completed.length;

   totalTasks.textContent = total;
   completedTasks.textContent = done;
   pendingTasks.textContent = total - done;

    let porcentaje = 0
    if(total > 0) {
        const resultado = (done / total) * 100;
        porcentaje = Math.round(resultado);
    }

   progressTasks.textContent = porcentaje + "%"
}

function renderTasks() {

    taskList.innerHTML = "";

    tasks.forEach( function(task, index) {

    const fecha = document.createElement("small"); 
    fecha.textContent = ` (${new Date().toLocaleDateString()})`; 
    fecha.style.fontSize = "12px";
    fecha.style.color = "gray";
    fecha.style.marginLeft = "8px";

    //Crear elemento de tarea

    const taskItem = document.createElement("div");
    taskItem.classList.add("task-item");

    if (task.completed) {
    taskItem.classList.add("task-item-checked");
    } else {
    taskItem.classList.add("task-item");
    }

    const taskLeft = document.createElement("div");
    taskLeft.classList.add("task-left");

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = task.completed;

    const span = document.createElement("span");
    span.textContent = task.text;

    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Eliminar";
    deleteButton.classList.add("delete-btn");

    deleteButton.addEventListener("click", function() {
      tasks.splice(index, 1);

      saveTasks();
      renderTasks();
    });
    
    deleteButton.addEventListener("click", function() {
    const confirmar = confirm("¿Estas seguro de querer eliminar esta tarea?");

    if (confirmar) {
        taskItem.remove();
        updateStats();
    }
    });

    checkbox.addEventListener("change", function() {
      taskItem.classList.toggle("completed")
      tasks[index].completed = checkbox.checked;

      saveTasks();
      renderTasks();
    })

    //Estructura HTML de cada tarea
    taskLeft.appendChild(checkbox);
    taskLeft.appendChild(span);
    taskLeft.appendChild(fecha);
    taskItem.appendChild(taskLeft);
    taskItem.appendChild(deleteButton);
    

    //Insertar el texto dentro del elemento
    //taskItem.textContent = taskText;

    //Agregar la tarea al Dashboard
    taskList.appendChild(taskItem)
    });

    updateStats();

}

function createTask() {
   //Guardamos el texto que escribio el usuario
    const taskText = input.value;
    console.log(taskText);

    if (taskText === "" ) return;

    if (taskText.length < 5) {
        alert("La tarea debe tener al menos 5 caracteres. Intente de nuevo.");
        return;
    }

    const newTask = {
        text: taskText,
        completed: false
    }

    tasks.push(newTask);

    //Limpiar input
    input.value = "";

    saveTasks();
    renderTasks();
}

completeAllBtn.addEventListener("click", function() {
    tasks.forEach(task => {
        task.completed = true;
    });
    saveTasks();
    renderTasks();
});




//Inicializacion
loadTasks();
renderTasks();