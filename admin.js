import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getFirestore, collection, doc, setDoc, getDocs, query, orderBy } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

// --- 1️⃣ Initialize Firebase ---
const firebaseConfig = {
  apiKey: "AIzaSyB3zNygolNpOsNWnPBVbAY8lIvNc_ZfL0w",
  authDomain: "heroquestmasteradmin.firebaseapp.com",
  projectId: "heroquestmasteradmin",
};
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// --- 2️⃣ Batch Import ---
document.getElementById("batch-import-btn").addEventListener("click", async () => {
  const fileInput = document.getElementById("batch-json");
  if (!fileInput.files[0]) return alert("Please select a JSON file");

  const monthId = document.getElementById("batch-month").value;
  const text = await fileInput.files[0].text();
  const questsArray = JSON.parse(text);

  const collectionRef = collection(db, "months", monthId, "quests");

  for (let i = 0; i < questsArray.length; i++) {
    const quest = questsArray[i];
    quest.day = i + 1; // auto-assign day
    const docRef = doc(collectionRef, `quest-${quest.day}`);
    await setDoc(docRef, quest);
  }

  alert(`Uploaded ${questsArray.length} quests to ${monthId}!`);
});

// --- 3️⃣ Add Single Quest ---
document.getElementById("single-quest-form").addEventListener("submit", async (e) => {
  e.preventDefault();

  const monthId = document.getElementById("single-month").value;
  const collectionRef = collection(db, "months", monthId, "quests");

  // Count current quests for day
  const snapshot = await getDocs(query(collectionRef, orderBy("day")));
  const day = snapshot.size + 1;

  const quest = {
    day,
    indoor: {
      title: document.getElementById("indoor-title").value,
      description: document.getElementById("indoor-desc").value,
      bonus: document.getElementById("indoor-bonus").value
    },
    outdoor: {
      title: document.getElementById("outdoor-title").value,
      description: document.getElementById("outdoor-desc").value,
      bonus: document.getElementById("outdoor-bonus").value
    }
  };

  await setDoc(doc(collectionRef, `quest-${day}`), quest);
  alert(`Added single quest as day ${day}!`);

  // Clear form
  e.target.reset();
});