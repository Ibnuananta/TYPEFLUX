const wordBank = [
  "neon", "future", "speed", "focus", "clean", "signal", "pixel", "logic", "motion", "typing",
  "flow", "dream", "window", "silent", "keyboard", "create", "system", "energy", "design", "github",
  "random", "minimal", "practice", "sharp", "orbit", "custom", "script", "browser", "launch", "typing",
  "rhythm", "cursor", "space", "result", "input", "display", "style", "modern", "project", "website",
  "coffee", "matrix", "cloud", "terminal", "engine", "static", "branch", "commit", "deploy", "pages"
];

const wordDisplay = document.getElementById("wordDisplay");
const input = document.getElementById("typingInput");
const timeLeftEl = document.getElementById("timeLeft");
const wpmEl = document.getElementById("wpm");
const accuracyEl = document.getElementById("accuracy");
const charsEl = document.getElementById("chars");
const restartBtn = document.getElementById("restartBtn");
const tryAgainBtn = document.getElementById("tryAgainBtn");
const resultModal = document.getElementById("resultModal");
const finalWpm = document.getElementById("finalWpm");
const finalAccuracy = document.getElementById("finalAccuracy");
const finalCorrect = document.getElementById("finalCorrect");
const themeToggle = document.getElementById("themeToggle");
const modeButtons = document.querySelectorAll(".mode");

let targetText = "";
let testTime = 30;
let timeLeft = testTime;
let timer = null;
let started = false;
let finished = false;

function shuffleWords(count = 90) {
  const words = [];
  for (let i = 0; i < count; i++) {
    words.push(wordBank[Math.floor(Math.random() * wordBank.length)]);
  }
  return words.join(" ");
}

function renderText() {
  wordDisplay.innerHTML = "";
  targetText.split("").forEach((char, index) => {
    const span = document.createElement("span");
    span.textContent = char;
    span.className = "char";
    span.dataset.index = index;
    wordDisplay.appendChild(span);
  });
}

function updateDisplay() {
  const typed = input.value;
  const chars = document.querySelectorAll(".char");
  let correct = 0;
  let wrong = 0;

  chars.forEach((span, index) => {
    span.classList.remove("correct", "wrong", "current");

    const typedChar = typed[index];
    if (typedChar == null) {
      return;
    }

    if (typedChar === targetText[index]) {
      span.classList.add("correct");
      correct++;
    } else {
      span.classList.add("wrong");
      wrong++;
    }
  });

  if (chars[typed.length]) {
    chars[typed.length].classList.add("current");
  }

  const elapsedMinutes = Math.max((testTime - timeLeft) / 60, 1 / 60);
  const wpm = Math.round((correct / 5) / elapsedMinutes);
  const accuracy = typed.length === 0 ? 100 : Math.round((correct / typed.length) * 100);

  wpmEl.textContent = String(wpm);
  accuracyEl.textContent = `${accuracy}%`;
  charsEl.textContent = `${correct}/${typed.length}`;

  return { correct, wrong, wpm, accuracy };
}

function startTimer() {
  timer = setInterval(() => {
    timeLeft--;
    timeLeftEl.textContent = String(timeLeft);
    updateDisplay();

    if (timeLeft <= 0) {
      endTest();
    }
  }, 1000);
}

function endTest() {
  if (finished) return;
  finished = true;
  clearInterval(timer);
  input.disabled = true;

  const result = updateDisplay();
  finalWpm.textContent = String(result.wpm);
  finalAccuracy.textContent = `${result.accuracy}%`;
  finalCorrect.textContent = String(result.correct);
  resultModal.classList.remove("hidden");
}

function resetTest() {
  targetText = shuffleWords();
  timeLeft = testTime;
  started = false;
  finished = false;
  clearInterval(timer);

  input.value = "";
  input.disabled = false;
  timeLeftEl.textContent = String(timeLeft);
  wpmEl.textContent = "0";
  accuracyEl.textContent = "100%";
  charsEl.textContent = "0/0";
  resultModal.classList.add("hidden");

  renderText();
  document.querySelector(".char")?.classList.add("current");
  input.focus();
}

input.addEventListener("input", () => {
  if (finished) return;

  if (!started) {
    started = true;
    startTimer();
  }

  updateDisplay();

  if (input.value.length >= targetText.length) {
    endTest();
  }
});

modeButtons.forEach((button) => {
  button.addEventListener("click", () => {
    modeButtons.forEach((btn) => btn.classList.remove("active"));
    button.classList.add("active");
    testTime = Number(button.dataset.time);
    resetTest();
  });
});

restartBtn.addEventListener("click", resetTest);
tryAgainBtn.addEventListener("click", resetTest);

themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("light");
  localStorage.setItem("typeflux-theme", document.body.classList.contains("light") ? "light" : "dark");
});

if (localStorage.getItem("typeflux-theme") === "light") {
  document.body.classList.add("light");
}

resetTest();
