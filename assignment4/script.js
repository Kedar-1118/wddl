// Stopwatch Application
let timerInterval;
let totalTime = 0;
const timerDisplay = document.getElementById('timer-display');

function updateTimerDisplay() {
    const minutes = String(Math.floor(totalTime / 60)).padStart(2, '0');
    const seconds = String(totalTime % 60).padStart(2, '0');
    timerDisplay.textContent = `${minutes}:${seconds}`;
}

function startTimer() {
    if (!timerInterval) {
        timerInterval = setInterval(() => {
            totalTime++;
            updateTimerDisplay();
        }, 1000);
    }
}

function stopTimer() {
    clearInterval(timerInterval);
    timerInterval = null;
}

function resetTimer() {
    stopTimer();
    totalTime = 0;
    updateTimerDisplay();
}

document.getElementById('start-button').addEventListener('click', startTimer);
document.getElementById('stop-button').addEventListener('click', stopTimer);
document.getElementById('reset-button').addEventListener('click', resetTimer);

// Image Carousel
const images = ['images (1).jpg', 'images (2).jpg', 'images (3).jpg', 'images.jpg', 'images1.jpg'];
let currentIndex = 0;
const carouselImage = document.getElementById('carousel-image');
const carouselDots = document.getElementById('carousel-dots');

function updateCarousel() {
    carouselImage.src = images[currentIndex];
    // document.querySelectorAll('.dot').forEach((dot, index) => {
    //     dot.classList.toggle('active-dot', index === currentIndex);
    // });
}

// function createDots() {
//     // images.forEach(() => {
//     //     const dot = document.createElement('button');
//     //     dot.className = 'dot';
//     //     carouselDots.appendChild(dot);
//     // });
// }

function nextImage() {
    currentIndex = (currentIndex + 1) % images.length;
    updateCarousel();
}

function prevImage() {
    currentIndex = (currentIndex - 1 + images.length) % images.length;
    updateCarousel();
}

// createDots();
updateCarousel();

setInterval(nextImage, 10000);

document.getElementById('next-button').addEventListener('click', nextImage);
document.getElementById('prev-button').addEventListener('click', prevImage);

// Form Validation
const form = document.getElementById('registration-form');
const formMessage = document.getElementById('form-message');

form.addEventListener('submit', (event) => {
    event.preventDefault();
    const name = form.name.value.trim();
    const email = form.email.value.trim();
    const password = form.password.value;
    const confirmPassword = form['confirm-password'].value;

    if (name.length < 3) {
        formMessage.textContent = 'Name must be at least 3 characters.';
        return;
    }
    if (!email.includes('@') || !email.includes('.')) {
        formMessage.textContent = 'Invalid email format.';
        return;
    }
    if (password.length < 6) {
        formMessage.textContent = 'Password must be at least 6 characters.';
        return;
    }
    if (password !== confirmPassword) {
        formMessage.textContent = 'Passwords do not match.';
        return;
    }

    formMessage.textContent = 'Registration successful!';
    formMessage.style.color = 'green';
});

// To-Do List
const taskInput = document.getElementById('new-task');
const taskList = document.getElementById('task-list');
const clearTasksButton = document.getElementById('clear-tasks-button');

function loadTasks() {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.forEach(addTaskToList);
}

function saveTasks() {
    const tasks = Array.from(taskList.children).map(li => ({
        text: li.textContent,
        completed: li.classList.contains('completed'),
    }));
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function addTaskToList(task) {
    const li = document.createElement('li');
    li.textContent = task.text;
    if (task.completed) li.classList.add('completed');
    li.addEventListener('click', () => {
        li.classList.toggle('completed');
        saveTasks();
    });
    taskList.appendChild(li);
}

document.getElementById('add-task-button').addEventListener('click', () => {
    if (taskInput.value.trim() !== '') {
        addTaskToList({ text: taskInput.value.trim(), completed: false });
        taskInput.value = '';
        saveTasks();
    }
});

clearTasksButton.addEventListener('click', () => {
    taskList.innerHTML = '';
    saveTasks();
});

loadTasks();

// Drag and Drop File Uploader
const fileDropArea = document.getElementById('file-drop-area');
const fileInput = document.getElementById('file-input');
const filePreview = document.getElementById('file-preview');
const removeFileButton = document.getElementById('remove-file-button');

function handleFile(file) {
    if (!['application/pdf', 'application/msword', 'image/jpeg'].includes(file.type)) {
        alert('Invalid file format! Only PDF, DOC/DOCX, JPG/JPEG are allowed.');
        return;
    }

    filePreview.innerHTML = file.type.startsWith('image/') ? `<img src="${URL.createObjectURL(file)}" alt="Uploaded Image">` : file.name;
    removeFileButton.hidden = false;
}

fileDropArea.addEventListener('click', () => fileInput.click());

fileInput.addEventListener('change', () => {
    const file = fileInput.files[0];
    if (file) handleFile(file);
});

fileDropArea.addEventListener('dragover', (event) => {
    event.preventDefault();
    fileDropArea.classList.add('highlight');
});

fileDropArea.addEventListener('dragleave', () => fileDropArea.classList.remove('highlight'));

fileDropArea.addEventListener('drop', (event) => {
    event.preventDefault();
    fileDropArea.classList.remove('highlight');
    const file = event.dataTransfer.files[0];
    if (file) handleFile(file);
});

removeFileButton.addEventListener('click', () => {
    filePreview.innerHTML = '';
    fileInput.value = '';
    removeFileButton.hidden = true;
});
