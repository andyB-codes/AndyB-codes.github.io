import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { 
  getFirestore, 
  collection, 
  getDocs, 
  query, 
  orderBy 
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyB3zNygolNpOsNWnPBVbAY8lIvNc_ZfL0w",
  authDomain: "heroquestmasteradmin.firebaseapp.com",
  projectId: "heroquestmasteradmin",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// =======================
// STATE
// =======================
 
let xp = parseInt(localStorage.getItem("xp")) || 0;
let streak = parseInt(localStorage.getItem("streak")) || 0;
let lastIndoorCompleted = localStorage.getItem("lastIndoorCompleted") || "";
let lastOutdoorCompleted = localStorage.getItem("lastOutdoorCompleted") || "";
let monthlyQuestCompleted = localStorage.getItem("MonthlyQuestCompletionDate") || "";
let playerName = localStorage.getItem("playerName") || "";
let indoorBonusClaimedDate = localStorage.getItem("indoorBonusClaimedDate") || "";
let outdoorBonusClaimedDate = localStorage.getItem("outdoorBonusClaimedDate") || "";
let currentQuest = localStorage.getItem("currentQuestNumber") || 0;
let lastCompletedQuest = localStorage.getItem("lastCompletedQuest") || 0;
let lastLoginDate = localStorage.getItem("lastLoginDate") || "";



// =======================
// MONTH DATA
// =======================

const monthNames = ["January","February","March","April","May","June","July","August","September","October","November","December"]
 
// =======================
// QUEST DATA
// =======================
const monthlyQuests = [
  {
    title: "The Station of New Beginnings",
    description: "Take the train one stop and return.",
    xp: 50
  },
];

// =======================
// LOAD QUESTS
// =======================
async function loadQuests() {
  const now = new Date();
  const month = now.toISOString().slice(0, 7);

  const q = query(
    collection(db, "months", month, "quests"),
    orderBy("day")
  );

  const snapshot = await getDocs(q);

  const quests = [];

  snapshot.forEach(doc => {
    quests.push(doc.data());
  });

  return quests;
}

 
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
  let capType = capitalizeFirstLetter(type);

  if (type === "indoor"){
   lastCompleted = lastIndoorCompleted;
  } else {
   lastCompleted = lastOutdoorCompleted;
  }
  if (lastCompleted === today) return;
 
  addXP(10);
 
  lastCompleted = today;
  localStorage.setItem("last" + capType + "Completed", today);

  lastCompletedQuest++;
  localStorage.setItem("lastCompletedQuest",lastCompletedQuest);

  
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
  let date = new Date();
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
  const nextLevelXP = Math.pow((level * 3), 2);
 
  document.getElementById("total-xp").innerText = xp;
  document.getElementById("level-number").innerText = level;
  document.getElementById("title").innerText = getTitle(level);
  document.getElementById("level-info").innerText =
    `Level ${level} – ${getTitle(level)}`;
  document.getElementById("streak-info").innerText =
    `Harmony Days: ${streak}`;
  document.getElementById("main-title").innerText = playerName + "'s Quest Log";
 
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

function determineCurrentQuest(){
  const date = new Date().toDateString();

  if (lastLoginDate === date){
  } else {
    if (lastCompletedQuest > currentQuest){
      currentQuest++;
      localStorage.setItem("currentQuest",currentQuest);
    }
  }


  localStorage.setItem("lastLoginDate",date);

  loadDailyQuest()
 
}
 
async function loadDailyQuest() {
  const date = new Date();
  const todayString = date.toDateString();

  // 1️⃣ Load quests from Firebase
  const month = date.toISOString().slice(0, 7); // "2026-02"
  const q = query(
    collection(db, "months", month, "quests"),
    orderBy("day")
  );
  const snapshot = await getDocs(q);

  const quests = [];
  snapshot.forEach(doc => quests.push(doc.data()));

  if (quests.length === 0) {
    console.warn("No quests found for this month!");
    return;
  }
 
  document.getElementById("indoor-quest").innerHTML = `<h3>${today.indoor.title}</h3> <h4>Bonus points: ${today.indoor.bonus}</h4> <p>${today.indoor.description}</p>`;
  document.getElementById("outdoor-quest").innerHTML = `<h3>${today.outdoor.title}</h3> <h4>Bonus points: ${today.outdoor.bonus}</h4> <p>${today.outdoor.description}</p>`;


  if (lastIndoorCompleted === date.toDateString()) {
    disableQuestButton("indoor");
  }
  if (lastOutdoorCompleted === date.toDateString()){
   disableQuestButton("outdoor");
  }
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
    document.getElementById("main-title").innerText = playerName + "'s Quest Log";
  }
 
  showNextLine();
}


function capitalizeFirstLetter(val) {
    return String(val).charAt(0).toUpperCase() + String(val).slice(1);
}

// Aesthetics - Embers

function createEmbers() {
  const container = document.querySelector(".embers");
  const emberCount = 25; // adjust density here

  for (let i = 0; i < emberCount; i++) {
    const ember = document.createElement("span");

    const size = Math.random() * 5 + 4;
    ember.style.width = size + "px";
    ember.style.height = size + "px";

    ember.style.left = Math.random() * 100 + "vw";

    const duration = Math.random() * 10 + 8;
    ember.style.animationDuration = duration + "s";

    ember.style.animationDelay = Math.random() * 10 + "s";

    container.appendChild(ember);
  }
}

determineCurrentQuest();
loadMonthly();
checkIntro();
updateUI();
createEmbers()
















































