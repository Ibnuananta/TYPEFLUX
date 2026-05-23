const wordBank = [
  "neon", "future", "speed", "focus", "clean", "signal", "pixel", "logic", "motion", "typing",
  "flow", "dream", "window", "silent", "keyboard", "create", "system", "energy", "design", "github",
  "random", "minimal", "practice", "sharp", "orbit", "custom", "script", "browser", "launch", "typing",
  "rhythm", "cursor", "space", "result", "input", "display", "style", "modern", "project", "website",
  "coffee", "matrix", "cloud", "terminal", "engine", "static", "branch", "commit", "deploy", "pages"
];

const wordDisplay = document.getElementById("wordDisplay");
const typingCard = document.getElementById("typingCard");
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
let typedText = "";
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
  const chars = document.querySelectorAll(".char");
  let correct = 0;
  let wrong = 0;

  chars.forEach((span, index) => {
    span.classList.remove("correct", "wrong", "current");

    const typedChar = typedText[index];
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

  if (chars[typedText.length]) {
    chars[typedText.length].classList.add("current");
  }

  const elapsedMinutes = Math.max((testTime - timeLeft) / 60, 1 / 60);
  const wpm = Math.round((correct / 5) / elapsedMinutes);
  const accuracy = typedText.length === 0 ? 100 : Math.round((correct / typedText.length) * 100);

  wpmEl.textContent = String(wpm);
  accuracyEl.textContent = `${accuracy}%`;
  charsEl.textContent = `${correct}/${typedText.length}`;

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

  const result = updateDisplay();
  finalWpm.textContent = String(result.wpm);
  finalAccuracy.textContent = `${result.accuracy}%`;
  finalCorrect.textContent = String(result.correct);
  resultModal.classList.remove("hidden");
}

function resetTest() {
  targetText = shuffleWords();
  typedText = "";
  timeLeft = testTime;
  started = false;
  finished = false;
  clearInterval(timer);

  timeLeftEl.textContent = String(timeLeft);
  wpmEl.textContent = "0";
  accuracyEl.textContent = "100%";
  charsEl.textContent = "0/0";
  resultModal.classList.add("hidden");

  renderText();
  document.querySelector(".char")?.classList.add("current");
  typingCard?.focus();
}

function handleTyping(event) {
  if (finished) return;
  if (event.ctrlKey || event.metaKey || event.altKey) return;

  if (event.key === "Backspace") {
    event.preventDefault();
    typedText = typedText.slice(0, -1);
    updateDisplay();
    return;
  }

  if (event.key.length !== 1) return;

  event.preventDefault();

  if (!started) {
    started = true;
    startTimer();
  }

  if (typedText.length < targetText.length) {
    typedText += event.key;
  }

  updateDisplay();

  if (typedText.length >= targetText.length) {
    endTest();
  }
}

document.addEventListener("keydown", handleTyping);
typingCard?.addEventListener("click", () => typingCard.focus());

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
