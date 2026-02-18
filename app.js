// ===== QUEST DATA =====
// Add more days easily by extending this array

Const dailyQuests = [
  {
    Indoor: “Potion of Restoration – Hot tub ritual with music.”,
    Outdoor: “Colour Hunt – Find one red, one tiny, one oddly shaped thing.”
  },
  {
    Indoor: “Drawer of Destiny – Clear one small drawer.”,
    Outdoor: “Left-Turn Rule – Take one unexpected path.”
  },
  {
    Indoor: “Skill Fragment – 15 minutes of ukulele or sketching.”,
    Outdoor: “Sit Somewhere New – 10 minutes observing.”
  }
];

// ===== PLAYER NAME VAR =====
let playerName = localStorage.getItem("playerName") || ""

// ===== STATE =====

Let xp = parseInt(localStorage.getItem(“xp”)) || 0;

// ===== XP SYSTEM =====

Function getLevel(xp) {
  Return Math.floor(Math.sqrt(xp) / 2) + 1;
}

Function getTitle(level) {
  If (level >= 20) return “Archmage of Becoming”;
  If (level >= 12) return “Wayfarer of Quiet Courage”;
  If (level >= 8) return “Gentle Pathfinder”;
  If (level >= 5) return “Hearth Guardian”;
  If (level >= 3) return “Keeper of Small Joys”;
  Return “Resting Adventurer”;
}

Function addXP(amount) {
  Xp += amount;
  localStorage.setItem(“xp”, xp);
  updateUI();
}

Function completeQuest(type) {
  addXP(10);
}

Function addBonus() {
  addXP(5);
}

// ===== UI =====

Function updateUI() {
  Const level = getLevel(xp);
  Const nextLevelXP = Math.pow((level * 2), 2);

  Document.getElementById(“total-xp”).innerText = xp;
  Document.getElementById(“level-number”).innerText = level;
  Document.getElementById(“title”).innerText = getTitle(level);
  Document.getElementById(“level-info”).innerText =
    `Level ${level} – ${getTitle(level)}`;

  Const percent = (xp / nextLevelXP) * 100;
  Document.getElementById(“xp-fill”).style.width = percent + “%”;
}

// ===== SCREEN SWITCH =====

Function showScreen(screen) {
  Document.getElementById(“home-screen”).classList.add(“hidden”);
  Document.getElementById(“character-screen”).classList.add(“hidden”);

  If (screen === “home”) {
    Document.getElementById(“home-screen”).classList.remove(“hidden”);
  } else {
    Document.getElementById(“character-screen”).classList.remove(“hidden”);
  }
}

// ===== LOAD TODAY’S QUEST =====

Function loadDailyQuest() {
  Const todayIndex = new Date().getDate() % dailyQuests.length;
  Const today = dailyQuests[todayIndex];

  Document.getElementById(“indoor-quest”).innerText = today.indoor;
  Document.getElementById(“outdoor-quest”).innerText = today.outdoor;
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


