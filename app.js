// =======================
// STATE
// =======================
 
let xp = parseInt(localStorage.getItem("xp")) || 0;
let streak = parseInt(localStorage.getItem("streak")) || 0;
let lastIndoorCompleted = localStorage.getItem("lastIndoorCompleted") || "";
let lastOutdoorCompleted = localStorage.getItem("lastIndoorCompleted") || "";
let monthlyQuestCompleted = localStorage.getItem("MonthlyQuestCompletionDate") || "";
let playerName = localStorage.getItem("playerName") || "";
let indoorBonusClaimedDate = localStorage.getItem("indoorBonusClaimedDate") || "";
let outdoorBonusClaimedDate = localStorage.getItem("outdoorBonusClaimedDate") || "";


// =======================
// MONTH DATA
// =======================

const monthNames = ["January","February","March","April","May","June","July","August","September","October","November","December"]
 
// =======================
// QUEST DATA
// =======================
 
const dailyQuests = [
  {
    indoor: {
      title: "Potion of Restoration – Hot tub ritual.", description: "The High Alchemist insists that mana cannot regenerate without sacred water immersion.", bonus: "Take the Kindle and read a chapter."
    },
    outdoor: {
      title: "Colour Hunt – Find 3 colours outside.", description: "The world hides enchantments in plain sight.", bonus: "Take a photo of each item, and give it a fantasy name."
    }
  },
  {
    indoor: {
      title: "Drawer of Destiny – Clear one small drawer.", description: "Clutter spirits weaken resolve. Today you banish them.", bonus: "Take before and after photos, and then present them with dramatic music."
    },
    outdoor: {
      title: "Left-Turn Rule – Take one unexpected turn.", decription: "Heros do not always follow the well worn path.", bonus: "Discover something unexpected... even if its just an unexpected fence!"
    }
  }
];
 
const monthlyQuests = [
  {
    title: "The Station of New Beginnings",
    description: "Take the train one stop and return.",
    xp: 50
  },
];
 
// =======================
// XP + LEVEL
// =======================
 
function getLevel(xp) {
  return Math.floor(Math.sqrt(xp) / 3) + 1;
}
 
function getTitle(level) {
  if (level >= 160) return "Archmage of Becoming";
  if (level >= 80) return "Wayfarer of Quiet Courage";
  if (level >= 40) return "Gentle Pathfinder";
  if (level >= 20) return "Hearth Guardian";
  if (level >= 10) return "Keeper of Small Joys";
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

  var lastCompleted = "";

  if (type === "indoor"){
   lastCompleted = lastIndoorCompleted;
  } else {
   lastCompleted = lastOutdoorCompleted;
  }
  if (lastCompleted === today) return;
 
  addXP(10);
 
  lastCompleted = today;
  localStorage.setItem("lastCompleted", today);

  
  if (lastIndoorCompleted === today || lastOutdoorCompleted === today){
  } else {
    streak++;
    localStorage.setItem("streak", streak);
  }

  disableQuestButton(type);
 
  updateUI();
}
 
function addBonus(type) {
  const today = new Date().toDateString();
  var bonusClaimedDate = "";

  if (type === "indoor"){
   bonusClaimedDate = indoorBonusClaimedDate;
  } else {
   bonusClaimedDate = outdoorBonusClaimedDate;
  }
 
  if (bonusClaimedDate === today){
    return;
  }
 
  addXP(5);

  bonusClaimedDate = today;
  localStorage.setItem(type + "BonusClaimedDate",today);

  disableBonusButton(type);
 
}

function disableQuestButton(type){
  const btn = document.getElementById(type + "-btn");
  if(!btn) return;
 
  btn.disabled = true;
  btn.innerText = "Completed ✨";
}

function disableBonusButton(type){
  const btn = document.getElementById(type + "-bonus-btn");
  if(!btn) return;
 
  btn.disabled = true;
  btn.innerText = "Bonus Claimed ✨";
}
 
// =======================
// MONTHLY
// =======================
 
function loadMonthly() {
  let date = new Date().toDateString();
  let month = monthNames[date.getMonth()];
  const container = document.getElementById("monthly-container");
  container.innerHTML = "";
 
  monthlyQuests.forEach((quest, index) => {
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <h3>${quest.title}</h3>
      <p>${quest.description}</p>
      <button id="monthlyQuest-btn" onclick="completeMonthly(${index})">
        Complete (+${quest.xp} XP)
      </button>
    `;
    container.appendChild(card);
  });
  if (month === monthlyQuestCompleted){
   disableQuestButton("monthlyQuest");
  }
}
 
function completeMonthly(index) {
  let date = new Date();
  let month = monthNames[date.getMonth()];

  if (month === monthlyQuestCompleted) return;
 
  addXP(monthlyQuests[index].xp);

  monthlyQuestCompleted = month;
  localStorage.setItem("MonthlyQuestCompletionDate", monthlyQuestCompleted);
  disableQuestButton("monthlyQuest");
 
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
  const date = new Date();
  const todayIndex = date % dailyQuests.length;
  const today = dailyQuests[todayIndex];
 
  document.getElementById("indoor-quest").innerHTML = `<h3>${today.indoor.title}</h3> <h4>Bonus points: ${today.indoor.bonus}</h4> <p>${today.indoor.description}</p>`;
  document.getElementById("outdoor-quest").innerHTML = `<h3>${today.outdoor.title}</h3> <h4>Bonus points: ${today.outdoor.bonus}</h4> <p>${today.outdoor.description}</p>`;

  if (indoorBonusClaimedDate === date.toDateString()) {
    disableBonusButton("indoor");
  }
  if (outdoorBonusClaimedDate === date.toDateString()){
   disableBonusButton("outdoor");
  }
 
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






















