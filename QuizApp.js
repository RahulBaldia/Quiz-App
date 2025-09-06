let questionShow = document.getElementById("question");
let optionsShow = document.getElementById("options");
let scoreShow = document.getElementById("score");
let nextBtn = document.getElementById("nextBtn");
let resetBtn = document.getElementById("resetBtn");
let startBtn = document.getElementById("startBtn");
let resumeBtn = document.getElementById("resumeBtn");
let quizBox = document.getElementById("quizBox");
let startBox = document.getElementById("startBox");

const storageKey = "quizData";

// Default / Saved Data
let savedData = JSON.parse(localStorage.getItem(storageKey)) || {
  currentQuestionIndex: 0,
  score: 0,
  answered: false
};

let questionText = [
  { question: "What is the capital of India?", options: ["Delhi", "Mumbai", "Bangalore", "Kolkata"], answer: 0 },
  { question: "What is the capital of Australia?", options: ["Canberra", "Sydney", "Melbourne", "Perth"], answer: 0 },
  { question: "What is the capital of Germany?", options: ["Paris", "London", "Berlin", "Madrid"], answer: 2 },
  { question: "What is the capital of China?", options: ["Shanghai", "Guangzhou", "Shenzhen", "Beijing"], answer: 3 },
  { question: "What is the capital of Japan?", options: ["Tokyo", "Osaka", "Kyoto", "Fukuoka"], answer: 0 }
];

let currentQuestionIndex = savedData.currentQuestionIndex;
let score = savedData.score;
let answered = savedData.answered;

// ---- Save progress ----
function saveProgress() {
  localStorage.setItem(storageKey, JSON.stringify({
    currentQuestionIndex,
    score,
    answered
  }));
}

// ---- Render Question ----
function renderQuestion() {
  resetBtn.style.display = "none";
  nextBtn.style.display = "none";
  nextBtn.textContent = "Next";
  scoreShow.style.display = "block";
  scoreShow.textContent = "Score: " + score;

  let q = questionText[currentQuestionIndex];
  questionShow.textContent = q.question;
  optionsShow.innerHTML = "";

  for (let i = 0; i < q.options.length; i++) {
    const option = document.createElement("button");
    option.textContent = q.options[i];
    optionsShow.appendChild(option);

    option.addEventListener("click", function () {
      if (answered) return;
      answered = true;

      if (i === q.answer) {
        score++;
        scoreShow.textContent = "Score: " + score;
      }

      if (currentQuestionIndex === questionText.length - 1) {
        nextBtn.textContent = "Submit";
        resetBtn.style.display = "none";
        nextBtn.style.display = "block";
      } else {
        nextBtn.textContent = "Next";
        nextBtn.style.display = "block";
      }

      saveProgress();
    });
  }
}

// ---- Next Button ----
nextBtn.addEventListener("click", function () {
  if (currentQuestionIndex === questionText.length - 1) {
    questionShow.textContent = "Quiz Completed 🎉";
    optionsShow.innerHTML = "";
    nextBtn.style.display = "none";
    scoreShow.style.display = "block";
    scoreShow.textContent = `Final Score: ${score} / ${questionText.length}`;
    resetBtn.style.display = "block";
    localStorage.removeItem(storageKey); // clear after finish
  } else {
    currentQuestionIndex++;
    answered = false;
    renderQuestion();
    saveProgress();
  }
});

// ---- Reset Button ----
resetBtn.addEventListener("click", function () {
  currentQuestionIndex = 0;
  score = 0;
  answered = false;
  localStorage.removeItem(storageKey); // clear progress
  renderQuestion();
});

// ---- Start Quiz ----
startBtn.addEventListener("click", function () {
  localStorage.removeItem(storageKey); // fresh start
  currentQuestionIndex = 0;
  score = 0;
  answered = false;
  startBox.style.display = "none";
  quizBox.style.display = "block";
  renderQuestion();
});

// ---- Resume Quiz ----
resumeBtn.addEventListener("click", function () {
  let saved = JSON.parse(localStorage.getItem(storageKey));
  if (saved) {
    currentQuestionIndex = saved.currentQuestionIndex;
    score = saved.score;
    answered = saved.answered;
    startBox.style.display = "none";
    quizBox.style.display = "block";
    renderQuestion();
  }
});

// ---- Page Load ----
window.addEventListener("load", function () {
  if (localStorage.getItem(storageKey)) {
    resumeBtn.style.display = "block";
    startBtn.style.display = "block";
  } else {
    startBtn.style.display = "block";
  }

  // hide quiz box initially
  quizBox.style.display = "none";
});
