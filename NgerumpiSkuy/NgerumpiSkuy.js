import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js";
import { 
    getFirestore, 
    collection, 
    addDoc, 
    onSnapshot, 
    query, 
    orderBy, 
    serverTimestamp,
    getDocs,
    deleteDoc,
    doc
} from "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyAGS_00EGf85mU36rN6_J_3JEAsxvMzn5g",
    authDomain: "universal-databases.firebaseapp.com",
    projectId: "universal-databases",
    storageBucket: "universal-databases.firebasestorage.app",
    messagingSenderId: "238780443230",
    appId: "1:238780443230:web:2286f232844108e53de2cf"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const messagesRef = collection(db, "messages");
const q = query(messagesRef, orderBy("timestamp", "asc"));
const messagesDiv = document.getElementById("messages");

/* REALTIME CHAT */
onSnapshot(q, snapshot => {
    messagesDiv.innerHTML = "";
    snapshot.forEach(docSnap => {
        const data = docSnap.data();
        const div = document.createElement("div");

        const myName = document.getElementById("nameInput").value.trim();
        div.className = `message ${data.name === myName ? "self" : "other"}`;

        div.innerHTML = `
            <div class="name">${data.name || "Anonim"}</div>
            ${data.text}
        `;
        messagesDiv.appendChild(div);
    });
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
});

/* SEND MESSAGE */
function sendMessage() {
    const name = document.getElementById("nameInput").value.trim() || "Anonim";
    const text = document.getElementById("messageInput").value.trim();
    if (!text) return;

    addDoc(messagesRef, {
        name,
        text,
        timestamp: serverTimestamp()
    });

    document.getElementById("messageInput").value = "";
}

document.getElementById("sendButton").onclick = sendMessage;
document.getElementById("messageInput").addEventListener("keypress", e => {
    if (e.key === "Enter") sendMessage();
});

/* CLEAR CHAT */
document.getElementById("clearBtn").onclick = async () => {
    const pass = prompt("Masukkan password untuk clear chat:");
    if (pass !== "yasaganteng") {
        alert("❌ Password salah!");
        return;
    }

    if (!confirm("⚠️ Yakin mau hapus SEMUA chat?")) return;

    const snapshot = await getDocs(messagesRef);
    snapshot.forEach(d => deleteDoc(doc(db, "messages", d.id)));

    alert("✅ Chat berhasil dihapus!");
};