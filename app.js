// Estado de la aplicación
let tasks = [];
let editingId = null;
let currentFilter = 'all';
let searchTerm = '';
let sortMode = 'date-newest';

// Referencias al DOM
const taskForm = document.getElementById('task-form');
const titleInput = document.getElementById('task-title');
const prioritySelect = document.getElementById('task-priority');
const submitBtn = document.getElementById('task-submit');
const cancelBtn = document.getElementById('task-cancel');
const formError = document.getElementById('form-error');
const taskList = document.getElementById('task-list');
const emptyMessage = document.getElementById('empty-message');
const statTotal = document.getElementById('stat-total');
const statPending = document.getElementById('stat-pending');
const statCompleted = document.getElementById('stat-completed');
const searchInput = document.getElementById('search-input');
const sortSelect = document.getElementById('sort-select');
const filterButtons = document.querySelectorAll('.filters__btn');

const PRIORITY_LABELS = { alta: 'Alta', media: 'Media', baja: 'Baja' };
const PRIORITY_WEIGHT = { alta: 3, media: 2, baja: 1 };
const STORAGE_KEY = 'taskmanager.tasks';
const API_URL = 'https://jsonplaceholder.typicode.com/todos?_limit=10';
const notification = document.getElementById('notification');

// Validación
function validateTask(title, priority) {
    if (title === '') {
        return 'El título de la tarea no puede estar vacío.';
    }
    if (!PRIORITY_LABELS[priority]) {
        return 'Selecciona una prioridad válida.';
    }
    return '';
}

function showFormError(message) {
    formError.textContent = message;
}

function clearFormError() {
    formError.textContent = '';
}

// CRUD
function createTask(title, priority) {
    const task = {
        id: Date.now(),
        title: title,
        priority: priority,
        completed: false,
        createdAt: new Date().toISOString()
    };
    tasks.unshift(task);
    saveTasks();
}

function updateTask(id, title, priority) {
    const task = tasks.find(t => t.id === id);
    if (task) {
        task.title = title;
        task.priority = priority;
        saveTasks();
    }
}

function deleteTask(id) {
    tasks = tasks.filter(t => t.id !== id);
    saveTasks();
}

function toggleTask(id) {
    const task = tasks.find(t => t.id === id);
    if (task) {
        task.completed = !task.completed;
        saveTasks();
    }
}

// Edición del formulario
function startEdit(id) {
    const task = tasks.find(t => t.id === id);
    if (!task) return;

    editingId = id;
    titleInput.value = task.title;
    prioritySelect.value = task.priority;
    submitBtn.textContent = 'Guardar cambios';
    cancelBtn.classList.remove('hidden');
    clearFormError();
    titleInput.focus();
}

function resetForm() {
    taskForm.reset();
    editingId = null;
    submitBtn.textContent = 'Agregar';
    cancelBtn.classList.add('hidden');
    clearFormError();
}

// Renderizado
function formatDate(isoDate) {
    return new Date(isoDate).toLocaleDateString('es-EC');
}

function createElement(tag, className, text) {
    const element = document.createElement(tag);
    if (className) element.className = className;
    if (text) element.textContent = text;
    return element;
}

function createTaskElement(task) {
    const li = createElement('li', 'task' + (task.completed ? ' task--completed' : ''));
    li.dataset.id = task.id;

    const check = createElement('input', 'task__check');
    check.type = 'checkbox';
    check.checked = task.completed;
    check.dataset.action = 'toggle';
    check.setAttribute('aria-label', 'Marcar como completada');

    const info = createElement('div', 'task__info');
    info.appendChild(createElement('span', 'task__title', task.title));
    info.appendChild(createElement('span', 'task__meta', 'Creada: ' + formatDate(task.createdAt)));

    const badge = createElement('span', 'badge badge--' + task.priority, PRIORITY_LABELS[task.priority]);

    const actions = createElement('div', 'task__actions');
    const editBtn = createElement('button', 'btn btn--small', 'Editar');
    editBtn.type = 'button';
    editBtn.dataset.action = 'edit';
    const deleteBtn = createElement('button', 'btn btn--small btn--danger', 'Eliminar');
    deleteBtn.type = 'button';
    deleteBtn.dataset.action = 'delete';
    actions.appendChild(editBtn);
    actions.appendChild(deleteBtn);

    li.appendChild(check);
    li.appendChild(info);
    li.appendChild(badge);
    li.appendChild(actions);
    return li;
}

function updateStats() {
    const total = tasks.length;
    const completed = tasks.filter(t => t.completed).length;
    statTotal.textContent = total;
    statCompleted.textContent = completed;
    statPending.textContent = total - completed;
}

// Filtros, búsqueda y orden
function sortTasks(list) {
    const byDate = (a, b) => new Date(a.createdAt) - new Date(b.createdAt);
    const byPriority = (a, b) => PRIORITY_WEIGHT[a.priority] - PRIORITY_WEIGHT[b.priority];

    switch (sortMode) {
        case 'date-oldest':
            return list.sort(byDate);
        case 'priority-high':
            return list.sort((a, b) => byPriority(b, a) || byDate(b, a));
        case 'priority-low':
            return list.sort((a, b) => byPriority(a, b) || byDate(b, a));
        default:
            return list.sort((a, b) => byDate(b, a));
    }
}

function getVisibleTasks() {
    const term = searchTerm.trim().toLowerCase();

    const filtered = tasks
        .filter(task => {
            if (currentFilter === 'pending') return !task.completed;
            if (currentFilter === 'completed') return task.completed;
            return true;
        })
        .filter(task => task.title.toLowerCase().includes(term));

    return sortTasks(filtered);
}

function renderTasks() {
    const visibleTasks = getVisibleTasks();

    taskList.innerHTML = '';
    visibleTasks.forEach(task => taskList.appendChild(createTaskElement(task)));

    emptyMessage.textContent = tasks.length === 0
        ? 'No hay tareas para mostrar.'
        : 'Ninguna tarea coincide con los filtros.';
    emptyMessage.classList.toggle('hidden', visibleTasks.length > 0);

    updateStats();
}

// Eventos
taskForm.addEventListener('submit', event => {
    event.preventDefault();

    const title = titleInput.value.trim();
    const priority = prioritySelect.value;
    const error = validateTask(title, priority);

    if (error) {
        showFormError(error);
        return;
    }

    if (editingId === null) {
        createTask(title, priority);
    } else {
        updateTask(editingId, title, priority);
    }

    resetForm();
    renderTasks();
});

titleInput.addEventListener('input', clearFormError);
cancelBtn.addEventListener('click', resetForm);

taskList.addEventListener('click', event => {
    const button = event.target.closest('button[data-action]');
    if (!button) return;

    const id = Number(button.closest('.task').dataset.id);

    if (button.dataset.action === 'edit') {
        startEdit(id);
    } else if (button.dataset.action === 'delete') {
        deleteTask(id);
        if (editingId === id) resetForm();
        renderTasks();
    }
});

taskList.addEventListener('change', event => {
    if (event.target.dataset.action === 'toggle') {
        const id = Number(event.target.closest('.task').dataset.id);
        toggleTask(id);
        renderTasks();
    }
});

searchInput.addEventListener('input', () => {
    searchTerm = searchInput.value;
    renderTasks();
});

sortSelect.addEventListener('change', () => {
    sortMode = sortSelect.value;
    renderTasks();
});

filterButtons.forEach(button => {
    button.addEventListener('click', () => {
        currentFilter = button.dataset.filter;
        filterButtons.forEach(btn => btn.classList.remove('filters__btn--active'));
        button.classList.add('filters__btn--active');
        renderTasks();
    });
});

// Notificaciones
let notificationTimer = null;

function showNotification(message, persistent = false) {
    notification.textContent = message;
    notification.classList.remove('hidden');
    clearTimeout(notificationTimer);
    if (!persistent) {
        notificationTimer = setTimeout(hideNotification, 10000);
    }
}

function hideNotification() {
    clearTimeout(notificationTimer);
    notification.classList.add('hidden');
}

// LocalStorage
function saveTasks() {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    } catch (error) {
        showNotification('No se pudieron guardar los cambios en el navegador.');
    }
}

function loadTasks() {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw === null) return null;
        const parsed = JSON.parse(raw);
        return Array.isArray(parsed) ? parsed : [];
    } catch (error) {
        showNotification('Los datos guardados estaban dañados y se reiniciaron.');
        return [];
    }
}

// Consumo de la API
async function fetchTasksFromApi() {
    const response = await fetch(API_URL);
    if (!response.ok) {
        throw new Error('Error del servidor: ' + response.status);
    }

    const todos = await response.json();
    const priorities = ['alta', 'media', 'baja'];
    const ONE_DAY = 24 * 60 * 60 * 1000;

    return todos.map((todo, index) => ({
        id: todo.id,
        title: todo.title,
        priority: priorities[index % 3],
        completed: todo.completed,
        createdAt: new Date(Date.now() - index * ONE_DAY).toISOString()
    }));
}

let apiLoadPending = false;

async function loadFromApi() {
    try {
        const apiTasks = await fetchTasksFromApi();
        tasks = tasks.concat(apiTasks);
        saveTasks();
        apiLoadPending = false;
        hideNotification();
    } catch (error) {
        apiLoadPending = true;
        showNotification(
            'No se pudieron cargar las tareas desde el servidor. ' +
            'Puedes trabajar sin conexión; se reintentará al recuperar la red.',
            true
        );
    }
    renderTasks();
}

async function init() {
    const stored = loadTasks();

    if (stored !== null) {
        tasks = stored;
        renderTasks();
        return;
    }

    renderTasks();
    await loadFromApi();
}

window.addEventListener('online', () => {
    if (apiLoadPending) {
        loadFromApi();
    }
});


// Inicio
init();