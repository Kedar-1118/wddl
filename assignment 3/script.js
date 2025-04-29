document.addEventListener('DOMContentLoaded', () => {
    // Problem 1
    const changeButton = document.getElementById('changeButton');
    const heading = document.getElementById('changeHeading');
    changeButton.addEventListener('click', () => {
        heading.textContent = 'New Updated Heading!';
    });

    // Problem 2
    const message = document.getElementById('message');
    const charCount = document.getElementById('charCount');
    message.addEventListener('input', () => {
        charCount.textContent = message.value.length;
    });

    // Problem 3
    const addButton = document.getElementById('addButton');
    const itemList = document.getElementById('itemList');
    const newItem = document.getElementById('newItem');

    addButton.addEventListener('click', () => {
        if (newItem.value.trim()) {
            const li = document.createElement('li');
            li.textContent = newItem.value;

            const removeButton = document.createElement('button');
            removeButton.textContent = 'Remove';
            removeButton.addEventListener('click', () => {
                li.remove();
            });

            li.appendChild(removeButton);
            itemList.appendChild(li);
            newItem.value = '';
        }
    });

    // Problem 4
    document.querySelectorAll('.colorButton').forEach(button => {
        button.addEventListener('click', () => {
            document.body.style.backgroundColor = button.dataset.color;
        });
    });

    // Problem 5
    const darkModeToggle = document.getElementById('darkModeToggle');
    darkModeToggle.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
    });

    // Problem 6: Quiz Application
    const quizData = [
        {
            question: "What is the capital of France?",
            answers: ["London", "Paris", "Berlin", "Madrid"],
            correct: 1
        },
        {
            question: "Which planet is known as the Red Planet?",
            answers: ["Venus", "Mars", "Jupiter", "Saturn"],
            correct: 1
        },
        {
            question: "What is the largest mammal in the world?",
            answers: ["African Elephant", "Blue Whale", "Giraffe", "Polar Bear"],
            correct: 1
        },
        {
            question: "Who painted the Mona Lisa?",
            answers: ["Vincent van Gogh", "Pablo Picasso", "Leonardo da Vinci", "Michelangelo"],
            correct: 2
        },
        {
            question: "What is the chemical symbol for gold?",
            answers: ["Ag", "Fe", "Au", "Cu"],
            correct: 2
        },
        {
            question: "Which country invented tea?",
            answers: ["India", "China", "Japan", "England"],
            correct: 1
        },
        {
            question: "What is the fastest land animal?",
            answers: ["Lion", "Cheetah", "Leopard", "Gazelle"],
            correct: 1
        },
        {
            question: "Who wrote 'Romeo and Juliet'?",
            answers: ["Charles Dickens", "William Shakespeare", "Jane Austen", "Mark Twain"],
            correct: 1
        },
        {
            question: "What is the capital of Japan?",
            answers: ["Seoul", "Beijing", "Tokyo", "Bangkok"],
            correct: 2
        },
        {
            question: "Which element has the chemical symbol 'O'?",
            answers: ["Carbon", "Nitrogen", "Oxygen", "Hydrogen"],
            correct: 2
        }
    ];

    let currentQuestionIndex = 0;
    let score = 0;
    let quizCompleted = false;

    const questionText = document.getElementById('questionText');
    const answerButtons = document.getElementById('answerButtons');
    const quizResult = document.getElementById('quizResult');
    const nextQuestionBtn = document.getElementById('nextQuestion');
    const restartQuizBtn = document.getElementById('restartQuiz');
    const currentQuestionSpan = document.getElementById('currentQuestion');
    const quizSummary = document.querySelector('.quiz-summary');
    const finalScore = document.getElementById('finalScore');

    function displayQuestion() {
        const question = quizData[currentQuestionIndex];
        questionText.textContent = question.question;
        answerButtons.innerHTML = '';
        quizResult.textContent = '';
        nextQuestionBtn.style.display = 'none';

        question.answers.forEach((answer, index) => {
            const button = document.createElement('button');
            button.textContent = answer;
            button.addEventListener('click', () => selectAnswer(index));
            answerButtons.appendChild(button);
        });
    }

    function selectAnswer(selectedIndex) {
        const question = quizData[currentQuestionIndex];
        const buttons = answerButtons.querySelectorAll('button');

        buttons.forEach(button => button.disabled = true);

        if (selectedIndex === question.correct) {
            buttons[selectedIndex].classList.add('correct');
            quizResult.textContent = 'Correct!';
            score++;
        } else {
            buttons[selectedIndex].classList.add('incorrect');
            buttons[question.correct].classList.add('correct');
            quizResult.textContent = 'Incorrect!';
        }

        nextQuestionBtn.style.display = 'block';
    }

    function nextQuestion() {
        currentQuestionIndex++;
        if (currentQuestionIndex < quizData.length) {
            currentQuestionSpan.textContent = currentQuestionIndex + 1;
            displayQuestion();
        } else {
            showQuizSummary();
        }
    }

    function showQuizSummary() {
        document.querySelector('.quiz-content').style.display = 'none';
        document.querySelector('.quiz-controls').style.display = 'none';
        quizSummary.style.display = 'block';
        finalScore.textContent = score;
        quizCompleted = true;
    }

    function restartQuiz() {
        currentQuestionIndex = 0;
        score = 0;
        currentQuestionSpan.textContent = '1';
        document.querySelector('.quiz-content').style.display = 'block';
        document.querySelector('.quiz-controls').style.display = 'flex';
        quizSummary.style.display = 'none';
        displayQuestion();
        quizCompleted = false;
    }

    nextQuestionBtn.addEventListener('click', nextQuestion);
    restartQuizBtn.addEventListener('click', restartQuiz);

    // Initialize the quiz
    displayQuestion();

    // Image Carousel
    const imageCarousel = document.querySelector('.image-carousel');
    if (imageCarousel) {
        const container = imageCarousel.querySelector('.carousel-container');
        const prevBtn = imageCarousel.querySelector('.prev');
        const nextBtn = imageCarousel.querySelector('.next');
        const dotsContainer = imageCarousel.querySelector('.carousel-dots');
        const images = imageCarousel.querySelectorAll('.carousel-image');
        let currentSlide = 0;

        // Create dots
        images.forEach((_, index) => {
            const dot = document.createElement('div');
            dot.classList.add('dot');
            if (index === 0) dot.classList.add('active');
            dot.addEventListener('click', () => goToSlide(index));
            dotsContainer.appendChild(dot);
        });

        const dots = dotsContainer.querySelectorAll('.dot');

        function updateSlide() {
            container.style.transform = `translateX(-${currentSlide * 25}%)`;
            // Update dots
            dots.forEach((dot, index) => {
                dot.classList.toggle('active', index === currentSlide);
            });
        }

        function goToSlide(index) {
            currentSlide = index;
            updateSlide();
        }

        function nextSlide() {
            currentSlide = (currentSlide + 1) % images.length;
            updateSlide();
        }

        function prevSlide() {
            currentSlide = (currentSlide - 1 + images.length) % images.length;
            updateSlide();
        }

        // Event listeners
        prevBtn.addEventListener('click', prevSlide);
        nextBtn.addEventListener('click', nextSlide);

        // Auto slide
        let slideInterval = setInterval(nextSlide, 5000);

        // Pause on hover
        imageCarousel.addEventListener('mouseenter', () => {
            clearInterval(slideInterval);
        });

        imageCarousel.addEventListener('mouseleave', () => {
            slideInterval = setInterval(nextSlide, 5000);
        });
    }
});