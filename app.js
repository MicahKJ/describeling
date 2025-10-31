// Describeling (placeholder for now)

// ====== ELEMENTS ======
const welcomeModal = document.getElementById("welcome-modal");
const startBtn = document.getElementById("start-btn");
const popupInterfaceLang = document.getElementById("popup-interface-lang");
const popupTargetLang = document.getElementById("popup-target-lang");

const imgEl = document.getElementById("daily-image");
const promptEl = document.getElementById("prompt-text");
const textareaEl = document.getElementById("user-input");
const submitBtn = document.getElementById("submit");
const feedbackEl = document.getElementById("feedback");
const interfaceSelector = document.getElementById("interface-language");
const targetSelector = document.getElementById("target-language");
const streakEl = document.getElementById("streak");
const footerEl = document.getElementById("footer-text");

// ====== DEFAULT SETTINGS ======
let interfaceLang = "en";
let targetLang = "fr";

// ====== INTERFACE TEXT ======
const interfaceText = {
  en: {
    prompt: (targetName) => `Describe this scene in <strong>${targetName}</strong>:`,
    checkButton: "Check",
    streakLabel: "🔥 Current Streak:",
    userPlaceholder: "Write your description...",
    alertEmpty: "Please write your description!",
    footer: "Made by Micah Joseph © 2025",
  },
  fr: {
    prompt: (targetName) => `Décrivez cette scène en <strong>${targetName}</strong> :`,
    checkButton: "Vérifier",
    streakLabel: "🔥 Séries actuelles :",
    userPlaceholder: "Écrivez votre description...",
    alertEmpty: "Veuillez écrire votre description !",
    footer: "Made by Micah Joseph © 2025",
  },
};

// ====== LANGUAGE NAMES (for prompt substitution) ======
const languageNames = {
  en: { en: "English", fr: "French" },
  fr: { en: "anglais", fr: "français" },
};

// ====== DAILY CHALLENGES ======
const challenges = {
  fr: [
    { url: "images/cafe.jpg", sample: "Sur la photo, il y a un café tranquille." },
    { url: "images/park.jpg", sample: "Il y a un parc plein d'arbres." },
    { url: "images/market.jpg", sample: "Il y a un marché avec des fruits, des légumes et beaucoup de gens qui achètent." }
  ],
  en: [
    { url: "images/cafe.jpg", sample: "In the photo, there is a quiet café." },
    { url: "images/park.jpg", sample: "There is a park full of trees." },
    { url: "images/market.jpg", sample: "There is a market with fruits, vegetables, and many people shopping." }
  ]
};

// ====== WELCOME MODAL BEHAVIOUR ======
startBtn.addEventListener("click", () => {
  interfaceLang = popupInterfaceLang.value;
  targetLang = popupTargetLang.value;

  // Sync dropdowns in header
  interfaceSelector.value = interfaceLang;
  targetSelector.value = targetLang;

  // Close modal
  welcomeModal.style.display = "none";

  // Load main challenge
  loadChallenge();
});

// ====== LANGUAGE SELECTOR LISTENERS ======
interfaceSelector.addEventListener("change", () => {
  interfaceLang = interfaceSelector.value;
  loadChallenge();
});

targetSelector.addEventListener("change", () => {
  targetLang = targetSelector.value;
  loadChallenge();
});

// ====== LOAD CHALLENGE ======
function loadChallenge() {
  const today = new Date();
  const index = today.getDate() % challenges[targetLang].length;
  const challenge = challenges[targetLang][index];

  // Update UI elements
  imgEl.src = challenge.url;

  const targetName = languageNames[interfaceLang][targetLang];
  promptEl.innerHTML = interfaceText[interfaceLang].prompt(targetName);

  textareaEl.placeholder = interfaceText[interfaceLang].userPlaceholder;
  submitBtn.textContent = interfaceText[interfaceLang].checkButton;
  footerEl.textContent = interfaceText[interfaceLang].footer;

  // Attach handler
  submitBtn.onclick = () => checkAnswer(challenge, today);

  updateStreak(today);
}

// ====== CHECK ANSWER ======
function checkAnswer(challenge, today) {
  const userText = textareaEl.value.trim();
  if (!userText) {
    alert(interfaceText[interfaceLang].alertEmpty);
    return;
  }

  const key = `challenge-${today.toDateString()}`;
  localStorage.setItem(key, userText);

  feedbackEl.innerHTML = `
    <h3>${interfaceLang === "fr" ? "Réponse Exemple" : "Sample Answer"}</h3>
    <p><em>${challenge.sample}</em></p>
    <hr>
    <p><strong>${interfaceLang === "fr" ? "Votre réponse:" : "Your answer:"}</strong><br>${userText}</p>
  `;
}

// ====== STREAK TRACKING ======
function updateStreak(today) {
  const lastDate = localStorage.getItem("lastCompleted");
  const currentDate = today.toDateString();
  let streak = parseInt(localStorage.getItem("streak") || "0");

  // If already completed today, don't reset
  if (lastDate === currentDate) {
    showStreak(streak);
    return;
  }

  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);

  if (lastDate === yesterday.toDateString()) {
    streak++;
  } else {
    streak = 1;
  }

  localStorage.setItem("lastCompleted", currentDate);
  localStorage.setItem("streak", streak);

  showStreak(streak);
}

function showStreak(streak) {
  streakEl.textContent = `${interfaceText[interfaceLang].streakLabel} ${streak} ${streak !== 1 ? (interfaceLang === "fr" ? "jours" : "days") : ""}`;
}

// ====== INITIAL STATE ======
// Show modal on load
window.addEventListener("load", () => {
  welcomeModal.style.display = "flex";
});

