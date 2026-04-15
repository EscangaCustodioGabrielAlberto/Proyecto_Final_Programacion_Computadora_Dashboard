/* ===============================
   1. SELECCIONAR ELEMENTOS DEL DOM
   =============================== */

/*
JavaScript primero debe localizar los elementos
con los que va a trabajar dentro de la página.
*/

// Campo donde el usuario escribe la tarea
const input = document.getElementById("taskInput");

//Campo donde se elige el nivel de prioridad
const prioritySelect = document.getElementById("prioritySelect");

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
const deleteAllBtn = document.getElementById("deleteAllBtn");
const deleteCompletedBtn = document.getElementById("deleteCompletedBtn");
const dismarkAllBtn = document.getElementById("dismarkAllBtn");

//Botones sort
const sortAZ = document.getElementById("sortAZ");
const sortZA = document.getElementById("sortZA");

const sortPriority = document.getElementById("sortPriority");
sortPriority.addEventListener("click", sortByPriority);

//Valores de prioridad
const prioridadValor = {
    Alta: 3,
    Media: 2,
    Baja: 1
};

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

function sortByPriority() {
    tasks.sort((a, b) => {
        return prioridadValor[b.priority] - prioridadValor[a.priority];
    });

    saveTasks();
    renderTasks();
}

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
   const stats = getStats();

   totalTasks.textContent = stats.total;
   completedTasks.textContent = stats.done;
   pendingTasks.textContent = stats.pending;
   progressTasks.textContent = stats.percentage + "%";
}

function getStats() {
    const total = tasks.length;
    const done = tasks.filter(tarea => tarea.completed).length;

    return{
        total,
        done,
        pending: total - done,
        percentage: total > 0 ? Math.round((done / total) * 100) : 0
    }
}

function renderTasks() {

    taskList.style.fontFamily = '"Jersey 10", sans-serif';

    taskList.innerHTML = "";

    if (tasks.length === 0) {
        const contenedor = document.createElement("div");

        const img = document.createElement("img");
        img.src = "img/yoshi_mimir.png";
        img.style.width = "300px"; 

        const mensaje = document.createElement("p");
        mensaje.textContent = "Aun no hay tareas";

        contenedor.style.display = "flex";
        contenedor.style.flexDirection = "column";
        contenedor.style.alignItems = "center";    
        contenedor.style.justifyContent = "center";

        mensaje.style.color = "white";
        mensaje.style.textAlign = "center";
        mensaje.style.fontSize = "34px";
        mensaje.style.fontFamily = '"Jersey 10", sans-serif';

        contenedor.appendChild(img);
        contenedor.appendChild(mensaje);

        taskList.appendChild(contenedor);

        updateStats();
        return;
    }

    tasks.forEach( function(task, index) {

    //Mostrar fecha
    const fecha = document.createElement("small"); 
    fecha.textContent = ` (${task.date})`;
    fecha.style.fontSize = "12px";
    fecha.style.color = "gray";
    fecha.style.marginLeft = "8px";

    //Mostrar prioridad
    const prioridad = document.createElement("span");
    prioridad.textContent = ` [${task.priority}]`;
    prioridad.style.marginLeft = "10px";
    prioridad.style.fontWeight = "normal";
    prioridad.style.fontSize = "18px";

    //Crear elemento de tarea

    const taskItem = document.createElement("div");
    taskItem.classList.add("task-item");
    taskItem.classList.add("task-enter");

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
    const confirmar = confirm("¿Estas seguro de querer eliminar esta tarea?");

    if (confirmar) {
        const item = taskItem; 

        item.classList.add("task-exit");

        setTimeout(() => {
            tasks.splice(index, 1);
            saveTasks();
            renderTasks();
        }, 300);
    }

    });

    checkbox.addEventListener("change", function() {
      toggleTask(index);
    })

    //Estructura HTML de cada tarea
    taskLeft.appendChild(checkbox);
    taskLeft.appendChild(span);
    taskLeft.appendChild(fecha);
    span.appendChild(prioridad);
    taskItem.appendChild(taskLeft);
    taskItem.appendChild(deleteButton);
    

    //Insertar el texto dentro del elemento
    //taskItem.textContent = taskText;

    //Agregar la tarea al Dashboard
    taskList.appendChild(taskItem)

    requestAnimationFrame(() => {
    taskItem.classList.remove("task-enter");
    });

    });

    

    updateStats();

}

function toggleTask(index) {
    tasks[index].completed = !tasks[index].completed;

    saveTasks();
    renderTasks();
}



function addTask(taskText) {
    //Guardamos el texto que escribio el usuario

    if (taskText === "" ) return;

    if (taskText.length < 5) {
        alert("La tarea debe tener al menos 5 caracteres. Intente de nuevo.");
        return;
    }

    //Para verificar que la tarea no exista ya
    const duplicado = tasks.some(task => task.text.toLowerCase().trim() === taskText.toLowerCase().trim());

    if (duplicado) {
        alert("Esta tarea ya existe en el Dashboard.");
        return;
    }

    const newTask = {
        text: taskText,
        completed: false,
        date: new Date().toLocaleDateString(),
        priority: prioritySelect.value
    }

    tasks.push(newTask);

    saveTasks();
    renderTasks();
}

function createTask() {
   addTask(input.value);
   input.value = "";
}

completeAllBtn.addEventListener("click", function() {
    tasks.forEach(task => {
        task.completed = true;
    });
    saveTasks();
    renderTasks();
});

deleteAllBtn.addEventListener("click", function() {
    const confirmar = confirm("Esta opcion eliminará TODAS las tareas. Deseas continuar?");

    if (confirmar) {
        const items = document.querySelectorAll(".task-item, .task-item-checked");

        items.forEach(item => {
            item.classList.add("task-exit");
        });

        setTimeout(() => {
            tasks = [];
            saveTasks();
            renderTasks();
        }, 300);
    }
});

deleteCompletedBtn.addEventListener("click", function() {

    const hayCompletadas = tasks.some(task => task.completed);

    if (!hayCompletadas) {
        alert("No hay tareas completadas aun");
        return;
    }

    const confirmar = confirm("Esta opcion eliminará las tareas COMPLETADAS. Deseas continuar?");

    if (confirmar) {
        const items = document.querySelectorAll(".task-item-checked");

        items.forEach(item => {
            item.classList.add("task-exit");
        });

        setTimeout(() => {
            tasks = tasks.filter(task => !task.completed);
            saveTasks();
            renderTasks();
        }, 300);
    }
});

dismarkAllBtn.addEventListener("click", function() {

    const hayCompletadas = tasks.some(task => task.completed);

    if (!hayCompletadas) {
        alert("No hay tareas completadas aun");
        return;
    }

    tasks.forEach(task => {
        if (task.completed) {
            task.completed = false;
        }
    });

    saveTasks();
    renderTasks();
    
});



//Inicializacion
loadTasks();
renderTasks();