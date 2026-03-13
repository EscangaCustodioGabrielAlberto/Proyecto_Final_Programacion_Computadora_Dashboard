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

/* ===============================
   2. ESCUCHAR EVENTO DEL BOTÓN
   =============================== */
//Boton de A->Z
sortAZ.addEventListener("click", function(){
    const tasks = Array.from( document.querySelectorAll(".task-item"));

    tasks.sort(function(a,b) {
        const textA = a.querySelector("span").textContent.toLowerCase();
        const textB = b.querySelector("span").textContent.toLowerCase();

        return textA.localeCompare(textB);
    });

    taskList.innerHTML = "";

    tasks.forEach(function(task) {
        taskList.appendChild(task);
    });
})

sortZA.addEventListener("click", function(){
    const tasks = Array.from( document.querySelectorAll(".task-item"));

    tasks.sort(function(primerPalabra,segundaPalabra) {
        const textA = primerPalabra.querySelector("span").textContent.toLowerCase();
        const textB = segundaPalabra.querySelector("span").textContent.toLowerCase();

        return textB.localeCompare(textA);
    });

    taskList.innerHTML = "";

    tasks.forEach(function(task) {
        taskList.appendChild(task);
    });
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

function createTask() {
   //Guardamos el texto que escribio el usuario
    const taskText = input.value;
    console.log(taskText);

    if (taskText === "" ) return;

    if (taskText.length < 5) {
        alert("La tarea debe tener al menos 5 caracteres. Intente de nuevo.");
        return;
    }

    const fecha = document.createElement("small"); 
    fecha.textContent = ` (${new Date().toLocaleDateString()})`; 
    fecha.style.fontSize = "12px";
    fecha.style.color = "gray";
    fecha.style.marginLeft = "8px";

    //Crear elemento de tarea
    const taskItem = document.createElement("div");
    taskItem.classList.add("task-item");

    const taskLeft = document.createElement("div");
    taskLeft.classList.add("task-left");

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";

    const span = document.createElement("span");
    span.textContent = taskText;

    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Eliminar";
    deleteButton.classList.add("delete-btn");

    deleteButton.addEventListener("click", function() {
      taskItem.remove();
      updateStats();
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

      if(checkbox.checked) {
        taskItem.classList.remove("task-item");
        taskItem.classList.add("task-item-checked");
        taskList.appendChild(taskItem);
      } else {
        taskItem.classList.remove("task-item-checked");
        taskItem.classList.add("task-item");
        taskList.prepend(taskItem);
      }

      updateStats();
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

    //Limpiar input
    input.value = "";

    updateStats();
}

completeAllBtn.addEventListener("click", function() {
    const checkboxes = document.querySelectorAll("input[type='checkbox']");

    checkboxes.forEach(function(checkbox) {
        checkbox.checked = true;
        const taskItem = checkbox.closest(".task-item");
        if (taskItem) {
            taskItem.classList.add("completed");
        }
    });

    updateStats();
});