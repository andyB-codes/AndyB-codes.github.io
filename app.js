// =======================
// STATE
// =======================
 
let xp = parseInt(localStorage.getItem("xp")) || 0;
let streak = parseInt(localStorage.getItem("streak")) || 0;
let lastCompleted = localStorage.getItem("lastCompleted") || "";
let playerName = localStorage.getItem("playerName") || "";
 
// =======================
// QUEST DATA
// =======================
 
const dailyQuests = [
  {
    indoor: "Potion of Restoration – Hot tub ritual.",
    outdoor: "Colour Hunt – Find 3 colours outside."
  },
  {
    indoor: "Drawer of Destiny – Clear one small drawer.",
    outdoor: "Left-Turn Rule – Take one unexpected turn."
  }
];
 
const monthlyQuests = [
  {
    title: "The Station of New Beginnings",
    description: "Take the train one stop and return.",
    xp: 50
  }
];
 
// =======================
// XP + LEVEL
// =======================
 
function getLevel(xp) {
  return Math.floor(Math.sqrt(xp) / 2) + 1;
}
 
function getTitle(level) {
  if (level >= 20) return "Archmage of Becoming";
  if (level >= 12) return "Wayfarer of Quiet Courage";
  if (level >= 8) return "Gentle Pathfinder";
  if (level >= 5) return "Hearth Guardian";
  if (level >= 3) return "Keeper of Small Joys";
  return "Resting Adventurer";
}
 
function addXP(amount) {
  const oldLevel = getLevel(xp);
  xp += amount;
  localStorage.setItem("xp", xp);
  updateUI();
 
  const newLevel = getLevel(xp);
  if (newLevel > oldLevel) triggerLevelUp(newLevel);
}
 
function triggerLevelUp(level) {
  document.getElementById("levelup-text").innerText =
    `You are now Level ${level} – ${getTitle(level)}`;
 
  document.getElementById("levelup-overlay").classList.remove("hidden");
 
  const sound = document.getElementById("levelup-sound");
  if (sound) sound.play();
 
  setTimeout(() => {
    document.getElementById("levelup-overlay").classList.add("hidden");
  }, 2500);
}
 
// =======================
// DAILY LOCK + STREAK
// =======================
 
function completeQuest(type) {
  const today = new Date().toDateString();
 
  if (lastCompleted === today) return;
 
  addXP(10);
  document.getElementById(type + "-btn").disabled = true;
 
  lastCompleted = today;
  localStorage.setItem("lastCompleted", today);
 
  streak++;
  localStorage.setItem("streak", streak);
 
  updateUI();
}
 
function addBonus() {
  addXP(5);
}
 
// =======================
// MONTHLY
// =======================
 
function loadMonthly() {
  const container = document.getElementById("monthly-container");
  container.innerHTML = "";
 
  monthlyQuests.forEach((quest, index) => {
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <h3>${quest.title}</h3>
      <p>${quest.description}</p>
      <button onclick="completeMonthly(${index})">
        Complete (+${quest.xp} XP)
      </button>
    `;
    container.appendChild(card);
  });
}
 
function completeMonthly(index) {
  addXP(monthlyQuests[index].xp);
}
 
// =======================
// UI
// =======================
 
function updateUI() {
  const level = getLevel(xp);
  const nextLevelXP = Math.pow((level * 2), 2);
 
  document.getElementById("total-xp").innerText = xp;
  document.getElementById("level-number").innerText = level;
  document.getElementById("title").innerText = getTitle(level);
  document.getElementById("level-info").innerText =
    `Level ${level} – ${getTitle(level)}`;
  document.getElementById("streak-info").innerText =
    `Harmony Days: ${streak}`;
 
  const percent = (xp / nextLevelXP) * 100;
  document.getElementById("xp-fill").style.width = percent + "%";
 
  if (level >= 5) {
    document.body.classList.add("forest-theme");
  }
}
 
// =======================
// NAVIGATION
// =======================
 
function showScreen(screen) {
  document.getElementById("home-screen").classList.add("hidden");
  document.getElementById("monthly-screen").classList.add("hidden");
  document.getElementById("character-screen").classList.add("hidden");
 
  document.getElementById(screen + "-screen").classList.remove("hidden");
}
 
// =======================
// LOAD
// =======================
 
function loadDailyQuest() {
  const todayIndex = new Date().getDate() % dailyQuests.length;
  const today = dailyQuests[todayIndex];
 
  document.getElementById("indoor-quest").innerText = today.indoor;
  document.getElementById("outdoor-quest").innerText = today.outdoor;
}

// =======================
// INTRO SEQUENCE
// =======================
 
function checkIntro() {
  if (!playerName) {
    document.getElementById("intro-screen").classList.remove("hidden");
  }
}
 
function startIntro() {
  const input = document.getElementById("name-input").value.trim();
  if (!input) return;
 
  playerName = input;
  localStorage.setItem("playerName", playerName);
 
  document.getElementById("name-entry").classList.add("hidden");
  document.getElementById("intro-text").classList.remove("hidden");
 
  runIntroSequence();
}
 
function runIntroSequence() {
  const lines = [
    `Welcome, ${playerName}.`,
    "The Realm has been waiting.",
    "Your quiet strength has not gone unnoticed.",
    "Your Quest Log is now active."
  ];
 
  let index = 0;
  const introLine = document.getElementById("intro-line");
 
  function showNextLine() {
    if (index >= lines.length) {
      setTimeout(() => {
        document.getElementById("intro-screen").classList.add("hidden");
      }, 1500);
      return;
    }
 
    introLine.classList.remove("fade-in");
    void introLine.offsetWidth; // reset animation
 
    introLine.innerText = lines[index];
    introLine.classList.add("fade-in");
 
    index++;
    setTimeout(showNextLine, 2500);
  }
 
  showNextLine();
}

loadDailyQuest();
loadMonthly();
updateUI();
checkIntro();




