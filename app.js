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
 
const dailyQuests = [
  {
    indoor: {
      title: "Potion of Restoration – Hot tub ritual.", 
      description: "The High Alchemist insists that mana cannot regenerate without sacred water immersion.", 
      bonus: "Take the Kindle and read a chapter."
    },
    outdoor: {
      title: "Colour Hunt – Find 3 objects outside.",
      description: "The Chief Healer requires one blue item, one tiny item, and one oddly shaped item for her concoction.",
      bonus: "Take a photo of each item, and give it a fantasy name."
    }
  },
  {
    indoor: {
      title: "Drawer of Destiny – Clear one small drawer.",
      description: "Clutter spirits weaken resolve. Today you banish them.",
      bonus: "Take before and after photos, and then present them with dramatic music."
    },
    outdoor: {
      title: "Left-Turn Rule – Go for a drive and take one unexpected turn.", 
      description: "Heros do not always follow the well worn path.", 
      bonus: "Discover something unexpected... even if its just an unexpected fence!"
    }
  },
  {
    indoor: {
      title: "The Jar of Light – Write down 5 good things from yesterday, no matter how small, and keep them safe.", 
      description: "An old wizard once said: “Joy hoarded becomes resilience.” You are now the Keeper of Small Joys.", 
      bonus: "Decorate the Jar."
    },
    outdoor: {
      title: "Sky Ritual – Step outside for 5 minutes and look at the sky. That’s it...", 
      description: "The sky is the oldest spell in the world. It works even when you don’t believe in it.", 
      bonus: "Describe the shape of one cloud."
    }
  },
  {
    indoor: {
      title: "The Art of Whimsy – Create a ridiculous object, a silly hat, a tiny sign for a plant, a handwritten speel scroll...", 
      description: "The Realm thrives on unnecessary whimsy.", 
      bonus: "Wear or use it for at least 10 minutes."
    },
    outdoor: {
      title: "Purchase of Purpose – Go to a small local shop and buy one item purely to improve the house atmosphere (plant, candle, weird mug, flowers).", 
      description: "Every stronghold needs aesthetic upgrades.", 
      bonus: "Present it to you like unveiling a royal artefact."
    }
  },
  {
    indoor: {
      title: "The Bard – Learn a new song on the Ukelele", 
      description: "The King and Queen wish to be entertained with a song.", 
      bonus: "Perform the song as if at a grand ball."
    },
    outdoor: {
      title: "Scouting New Teritory – Drive or walk somewhere calm (not city centre). Sit for 5–10 minutes.", 
      description: "Scouts must observe new territory.",
      bonus: "Take time to be mindful and really listen, touch and see."
    }
  },
  {
    indoor: {
      title: "The Day of Indulgent Magic – One hour of guilt-free comfort activity. No productivity allowed.",
      description: "Rest is not laziness. It is spell recovery.",
      bonus: "Leave your phone in another room"
    },
    outdoor: {
      title: "Nature Offering – Place a small natural object somewhere pretty (a leaf balanced on a rock, etc.).",
      description: "You must leave signs to guide the woodland spirits.",
      bonus: "Whisper a ridiculous prophecy while doing it."
    }
  },
 {
  indoor: {
    title: "The Candle of Intent – Light a candle (or lamp) and set one small intention for today.",
    description: "The Guild believes even the smallest flame pushes back the dark. Today, you are Keeper of the Flame.",
    bonus: "Blow it out dramatically and whisper 'Quest Complete.'"
  },
  outdoor: {
    title: "The Three Relics – Collect one twig, one stone, and one leaf.",
    description: "Long ago, adventurers carried tokens of the wild to remind them the world is bigger than their worries.",
    bonus: "Name each relic before bringing them home."
  }
},
{
  indoor: {
    title: "Painting of the Hearth – Paint the view from the bedroom.",
    description: "'The image of bliss is that of the bedroom' The local prophet has foretold the images potency in times of darkness",
    bonus: "Include two forms of wildlife in the picture."
  },
  outdoor: {
    title: "The Hidden Sigil – Find a symbol or pattern in nature.",
    description: "The world leaves secret markings for those who look closely.",
    bonus: "Photograph your discovery."
  }
},
{
  indoor: {
    title: "Scroll of Order – Clear one small surface completely.",
    description: "Chaos retreats when faced with focused magic.",
    bonus: "Place one object back with ceremony."
  },
  outdoor: {
    title: "Potion Procurement – Visit a shop and buy one small item for the house.",
    description: "Every Guild needs supplies. Today you are Quartermaster.",
    bonus: "Choose something slightly indulgent."
  }
},
{
  indoor: {
    title: "The Memory Vault – Find one old photo and spend 5 minutes with it.",
    description: "Memories are archived spells. Some restore strength.",
    bonus: "Write one sentence about it."
  },
  outdoor: {
    title: "Bench of Reflection – Sit somewhere peaceful for 5 minutes.",
    description: "Not all progress requires movement.",
    bonus: "Notice three distinct sounds."
  }
},
{
  indoor: {
    title: "The Comfort Ritual – Take a long shower or hot tub soak.",
    description: "Even heroes must recharge their mana.",
    bonus: "Use your fanciest soap."
  },
  outdoor: {
    title: "Map the Micro-Quest – Walk a short route under 2 miles and spot something new.",
    description: "New paths awaken sleeping parts of the mind.",
    bonus: "Give the route a heroic name."
  }
},
{
  indoor: {
    title: "The Gratitude Scroll – Write a short thank-you note (you don’t have to send it).",
    description: "Kindness practiced still counts as magic.",
    bonus: "Seal it in an envelope anyway."
  },
  outdoor: {
    title: "The Window Hunt – Find the most interesting house window nearby.",
    description: "Every window holds a different story.",
    bonus: "Invent the story."
  }
},
{
  indoor: {
    title: "The Skill Spark – Watch a 10-minute tutorial on something new.",
    description: "Knowledge gained is XP earned.",
    bonus: "Try one tiny part of it."
  },
  outdoor: {
    title: "The Weather Report – Step outside and fully experience today’s weather.",
    description: "Rain, wind, sun — each is its own spell.",
    bonus: "Describe it in one poetic sentence."
  }
},
{
  indoor: {
    title: "Treasure Rearrangement – Rearrange one shelf or drawer.",
    description: "Shifting your environment shifts your energy.",
    bonus: "Add one decorative touch."
  },
  outdoor: {
    title: "The Color Quest – Find 5 different colours in nature.",
    description: "The realm is rarely grey unless we stop looking.",
    bonus: "Photograph your favourite."
  }
},
{
  indoor: {
    title: "The Letter to Future You – Write a note to open in one month.",
    description: "Time-travel via parchment is an advanced Guild skill.",
    bonus: "Hide it somewhere dramatic."
  },
  outdoor: {
    title: "Train Station Recon – Visit the train station and observe for 5 minutes.",
    description: "All great adventures begin near tracks.",
    bonus: "Check the board and imagine a destination."
  }
},
{
  indoor: {
    title: "Five-Minute Stretch Ritual – Do gentle stretches for 5 minutes.",
    description: "Flexibility is quiet strength.",
    bonus: "Put on epic background music."
  },
  outdoor: {
    title: "Tree Guardian Greeting – Touch the bark of a tree.",
    description: "Trees have outlived empires. Borrow some perspective.",
    bonus: "Thank it silently."
  }
},
{
  indoor: {
    title: "The Puzzle of Patience – Complete a small puzzle or brain teaser.",
    description: "Mental agility sharpens the blade.",
    bonus: "Time yourself."
  },
  outdoor: {
    title: "Cloud Cartography – Watch clouds for 5 minutes.",
    description: "The sky redraws itself constantly.",
    bonus: "Name one formation."
  }
},
{
  indoor: {
    title: "Digital Declutter – Delete 10 old photos or emails.",
    description: "Even digital realms gather dust.",
    bonus: "Save one favourite."
  },
  outdoor: {
    title: "The Sound Scout – Record one interesting outdoor sound.",
    description: "The realm hums if you listen.",
    bonus: "Play it back later."
  }
},
{
  indoor: {
    title: "The Cozy Corner – Improve one small area to make it cozier.",
    description: "Comfort is tactical.",
    bonus: "Add lighting."
  },
  outdoor: {
    title: "The Lost Detail – Find something you’ve walked past many times but never noticed.",
    description: "The extraordinary hides in repetition.",
    bonus: "Photograph it."
  }
},
{
  indoor: {
    title: "The Book of Beginnings – Read 5 pages of any book.",
    description: "Every quest starts somewhere.",
    bonus: "Read aloud one sentence."
  },
  outdoor: {
    title: "The Gentle Errand – Visit a local shop for a simple purpose.",
    description: "Small missions build confidence.",
    bonus: "Choose a different route home."
  }
},
{
  indoor: {
    title: "Mirror of Truth – Look in the mirror and say one kind thing to yourself.",
    description: "Self-compassion is rare magic.",
    bonus: "Say it twice."
  },
  outdoor: {
    title: "The Long View – Find a spot with distance (hill, field, horizon).",
    description: "Perspective reduces monsters to manageable size.",
    bonus: "Take one slow breath there."
  }
},
{
  indoor: {
    title: "The Creativity Spark – Draw or doodle for 10 minutes.",
    description: "Creation is rebellion against stagnation.",
    bonus: "Sign it like a famous artist."
  },
  outdoor: {
    title: "Leaf Census – Count 10 fallen leaves.",
    description: "Even fallen things are part of cycles.",
    bonus: "Find the most interesting shape."
  }
},
{
  indoor: {
    title: "The Archive – Organise one digital folder.",
    description: "Order builds momentum.",
    bonus: "Rename it something epic."
  },
  outdoor: {
    title: "The Five-Step Ritual – Step outside and take 20 deliberate steps.",
    description: "Movement, however small, is forward.",
    bonus: "Walk dramatically."
  }
},
{
  indoor: {
    title: "The Music Memory – Play a song that means something to you.",
    description: "Sound can transport across years.",
    bonus: "Sing one line."
  },
  outdoor: {
    title: "The Silent Minute – Stand outside silently for 60 seconds.",
    description: "Stillness is underrated power.",
    bonus: "Close your eyes."
  }
},
{
  indoor: {
    title: "The Drawer of Destiny – Open a random drawer and remove one unnecessary item.",
    description: "Decluttering is low-level boss slaying.",
    bonus: "Dispose of it immediately."
  },
  outdoor: {
    title: "Shadow Watch – Observe your shadow.",
    description: "Proof you exist in light.",
    bonus: "Strike a heroic pose."
  }
},
{
  indoor: {
    title: "The Tea Ceremony – Make a drink slowly and intentionally.",
    description: "Mindfulness disguised as hydration.",
    bonus: "Use your favourite mug."
  },
  outdoor: {
    title: "The Mini Expedition – Walk somewhere slightly unfamiliar but under 2 miles.",
    description: "Comfort zones expand gently.",
    bonus: "Mark it on a map."
  }
},
{
  indoor: {
    title: "The Memory Object – Find one item you forgot you owned.",
    description: "Past versions of you left treasures.",
    bonus: "Tell its story."
  },
  outdoor: {
    title: "The Doorway Observation – Notice three different door styles.",
    description: "Entrances matter.",
    bonus: "Choose which you’d enter."
  }
},
{
  indoor: {
    title: "The Five-Breath Reset – Sit and take 5 deep breaths.",
    description: "Breathing is free magic.",
    bonus: "Count backwards."
  },
  outdoor: {
    title: "The Sun Check – Stand in sunlight briefly.",
    description: "Solar mana recharge.",
    bonus: "Close your eyes safely."
  }
},
{
  indoor: {
    title: "The Kind Message – Send a supportive text to someone safe.",
    description: "You wield influence.",
    bonus: "Use a funny emoji."
  },
  outdoor: {
    title: "The Local Explorer – Visit one nearby place you rarely go.",
    description: "Exploration doesn’t require passports.",
    bonus: "Sit there for 2 minutes."
  }
},
{
  indoor: {
    title: "The Journal Page – Write half a page about today.",
    description: "Documentation equals reflection.",
    bonus: "Underline one insight."
  },
  outdoor: {
    title: "The Wind Test – Notice the wind direction.",
    description: "Even unseen forces move you.",
    bonus: "Turn your face into it."
  }
},
{
  indoor: {
    title: "The Sock Rebellion – Match all loose socks.",
    description: "Domestic chaos tamed.",
    bonus: "Fold them neatly."
  },
  outdoor: {
    title: "The Pavement Pattern – Find an interesting crack or pattern in pavement.",
    description: "Imperfections create art.",
    bonus: "Photograph it."
  }
},
{
  indoor: {
    title: "The Laugh Scroll – Watch something that makes you laugh.",
    description: "Laughter restores HP.",
    bonus: "Replay your favourite moment."
  },
  outdoor: {
    title: "The Short Pilgrimage – Walk to a meaningful nearby location.",
    description: "Places remember you.",
    bonus: "Pause there."
  }
},
{
  indoor: {
    title: "The Wardrobe Refresh – Create one outfit you haven’t tried before.",
    description: "Identity is adjustable.",
    bonus: "Wear it for 10 minutes."
  },
  outdoor: {
    title: "The Observation Post – Sit in the car or garden and people-watch quietly.",
    description: "Stories pass constantly.",
    bonus: "Invent one."
  }
},
{
  indoor: {
    title: "The Mini Cleanse – Tidy for exactly 5 minutes.",
    description: "Momentum beats perfection.",
    bonus: "Stop when timer ends."
  },
  outdoor: {
    title: "The Moon Check – Step outside at night and look at the moon.",
    description: "Ancient companion.",
    bonus: "Take a photo."
  }
},
{
  indoor: {
    title: "The Creative Rearrangement – Move one piece of furniture slightly.",
    description: "Subtle change shifts energy.",
    bonus: "Light a lamp nearby."
  },
  outdoor: {
    title: "The Quiet Corner – Find the calmest nearby spot.",
    description: "Every realm has sanctuary.",
    bonus: "Stand there 2 minutes."
  }
},
{
  indoor: {
    title: "The Skill Practice – Practice one small hobby skill for 10 minutes.",
    description: "XP compounds.",
    bonus: "Track your streak."
  },
  outdoor: {
    title: "The Boundary Push – Go slightly further than usual (still under 2 miles).",
    description: "Edges expand safely.",
    bonus: "Mark the furthest point."
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
// LOAD QUESTS
// =======================
async function loadQuests() {
  const now = new Date();
  const month = now.toISOString().slice(0, 7);

  console.log("Looking for month:", month);

  const q = query(
    collection(db, "months", month, "quests"),
    orderBy("day")
  );

  const snapshot = await getDocs(q);

  const quests = [];

  snapshot.forEach(doc => {
    quests.push(doc.data());
  });

  console.log("Loaded quests:", quests);

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
 
function loadDailyQuest() {
  const date = new Date();
  
  const today = dailyQuests[currentQuest];
 
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

loadQuests();
determineCurrentQuest();
loadMonthly();
checkIntro();
updateUI();
createEmbers()













































