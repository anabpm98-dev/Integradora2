// Estado de la aplicación
let tasks = [];
let editingId = null;

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

const PRIORITY_LABELS = { alta: 'Alta', media: 'Media', baja: 'Baja' };

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
}

function updateTask(id, title, priority) {
    const task = tasks.find(t => t.id === id);
    if (task) {
        task.title = title;
        task.priority = priority;
    }
}

function deleteTask(id) {
    tasks = tasks.filter(t => t.id !== id);
}

function toggleTask(id) {
    const task = tasks.find(t => t.id === id);
    if (task) {
        task.completed = !task.completed;
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

function renderTasks() {
    taskList.innerHTML = '';
    tasks.forEach(task => taskList.appendChild(createTaskElement(task)));
    emptyMessage.classList.toggle('hidden', tasks.length > 0);
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

// Inicio
renderTasks();