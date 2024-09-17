console.log('JavaScript cargado correctamente.');
// Inicialización de Firebase
// Inicialización de Firebase
import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js';
import { getDatabase, ref, set, get, child, push, onValue, update, remove } from 'https://www.gstatic.com/firebasejs/9.23.0/firebase-database.js';
// Configuración de Firebase
const firebaseConfig = {
    apiKey: "AIzaSyBDaCqIpdXohqI07aGudrUePKQfExNHdDM",
    authDomain: "lifegame-35a54.firebaseapp.com",
    projectId: "lifegame-35a54",
    storageBucket: "lifegame-35a54.appspot.com",
    messagingSenderId: "1023721655807",
    appId: "1:1023721655807:web:e07fa5b3302c08be6e6bca",
    measurementId: "G-RCR50D8SS1"
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

// Variables para controlar las cuentas
let currentAccount = null;

// Selección de cuenta
document.getElementById('account1-btn').addEventListener('click', () => {
    console.log('Cuenta 1 seleccionada');
    loadAccount('account1');
});
document.getElementById('account2-btn').addEventListener('click', () => {
    console.log('Cuenta 2 seleccionada');
    loadAccount('account2');
});

// Días de la semana
const daysOfWeek = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];

window.loadAccount=function (accountName) {
    console.log(`Cargando las tareas de ${accountName}`);
    currentAccount = accountName;
    document.getElementById('account-name').innerText = accountName;
    document.getElementById('task-section').style.display = 'block';

    const taskContainer = document.getElementById('day-lists');
    taskContainer.innerHTML = ''; // Limpiar las listas de días

    daysOfWeek.forEach(day => {
        const dayDiv = document.createElement('div');
        dayDiv.classList.add('day-list');
        dayDiv.innerHTML = `
            <h3>${day}</h3>
            <div id="${day}-tasks"></div>
            <button onclick="addTask('${day}')">Agregar tarea</button>
        `;
        taskContainer.appendChild(dayDiv);

        const taskListRef = ref(database, `tasks/${accountName}/${day}`);
        onValue(taskListRef, (snapshot) => {
            const tasks = snapshot.val();
            console.log(`Tareas de ${day} para ${accountName}:`, tasks);
            renderTasks(day, tasks);
        });
    });
}

// Función para renderizar las tareas de un día específico
window.renderTasks = function(day, tasks) {
    const taskContainer = document.getElementById(`${day}-tasks`);
    taskContainer.innerHTML = ''; // Limpiar la lista de tareas del día

    if (tasks) {
        Object.keys(tasks).forEach(taskId => {
            const task = tasks[taskId];
            const taskElement = document.createElement('div');
            taskElement.classList.add('task-item');
            if (task.completed) {
                taskElement.classList.add('completed');
            }

            taskElement.innerHTML = `
                <span>${task.text}</span>
                <div class="task-buttons">
                    <button onclick="toggleTaskCompletion('${day}', '${taskId}')">Completar</button>
                    <button onclick="deleteTask('${day}', '${taskId}')">Eliminar</button>
                    <button onclick="editTask('${day}', '${taskId}', '${task.text}')">Editar</button>
                </div>
            `;

            taskContainer.appendChild(taskElement);
        });
    }
}

// Función para agregar tareas a un día específico
window.addTask = function(day) {
    // Obtener el contenedor de tareas para el día específico
    const taskList = document.getElementById(`${day}-tasks`);

    // Crear un nuevo elemento de tarea
    const newTaskText = prompt("Escribe la nueva tarea:");

    if (newTaskText) {
        // Crear un nuevo elemento de lista para la tarea
        const taskItem = document.createElement('div');
        taskItem.classList.add('task-item');
        taskItem.innerHTML = `
            <input type="checkbox">
            <span>${newTaskText}</span>
            <button onclick="removeTask(this)">Eliminar</button>
        `;
        
        // Añadir la nueva tarea a la lista del día
        taskList.appendChild(taskItem);
        
        // Guardar la tarea en Firebase
        const taskRef = ref(database, `tasks/${currentAccount}/${day}`);
        const newTaskRef = push(taskRef); // Obtener una nueva referencia con un ID único
        set(newTaskRef, { text: newTaskText, completed: false }) // Guardar la tarea con texto y estado
        .then(() => {
            console.log('Tarea agregada a Firebase.');
        })
        .catch((error) => {
            console.error('Error al agregar la tarea a Firebase:', error);
        });
    } else {
        alert("La tarea no puede estar vacía.");
    }
}

// Definir también la función para eliminar una tarea
window.removeTask = function(buttonElement) {
    const taskItem = buttonElement.parentElement;
    taskItem.remove(); // Eliminar la tarea de la UI
    
    // Aquí puedes agregar lógica para eliminar la tarea de Firebase si lo necesitas
}

// Función para completar una tarea
window.toggleTaskCompletion = function (day, taskId) {
    const taskRef = ref(database, `tasks/${currentAccount}/${day}/${taskId}`);
    get(taskRef).then((snapshot) => {
        const task = snapshot.val();
        update(taskRef, { completed: !task.completed });
    });
}

// Función para eliminar una tarea
window.deleteTask=function(day, taskId) {
    const taskRef = ref(database, `tasks/${currentAccount}/${day}/${taskId}`);
    remove(taskRef);
}

// Función para editar una tarea
window.editTask=function(day, taskId, oldText) {
    const newTaskText = prompt('Edita la tarea:', oldText);
    if (newTaskText) {
        const taskRef = ref(database, `tasks/${currentAccount}/${day}/${taskId}`);
        update(taskRef, { text: newTaskText });
    }
}