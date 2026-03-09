//obtener elementos del html

const input = document.getElementById("taskInput");
const button = document.getElementById("addTaskBtn");
const taskList = document.getElementById("taskList");

//evento del boton Agregar
button.addEventListener("click", function() {
    const taskText = input.value;
    console.log(taskText);

    if(taskText === "") {
        return;
    }

    const taskItem = document.createElement("div");
    taskItem.classList.add("task-item");
    taskItem.textContent = taskText;
    
    const checkBox = document.createElement("input");
    checkBox.type = "checkbox";
    checkBox.classList.add("complete-btn");
    taskItem.appendChild(checkBox)

    taskList.appendChild(taskItem);

    input.value = "";
});