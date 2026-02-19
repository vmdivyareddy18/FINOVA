let expenses = JSON.parse(localStorage.getItem("expenses")) || [];

function addExpense() {

    let amount = document.getElementById("amount").value;
    let category = document.getElementById("category").value;
    let date = document.getElementById("date").value;
    let note = document.getElementById("note").value;

    if (!amount || !category || !date) {
        alert("Please fill all required fields");
        return;
    }

    let expense = {
        id: Date.now(),
        amount: parseFloat(amount),
        category: category,
        date: date,
        note: note
    };

    expenses.unshift(expense);
    localStorage.setItem("expenses", JSON.stringify(expenses));

    renderExpenses();
    clearForm();
}

function renderExpenses() {

    let list = document.getElementById("expenseList");
    list.innerHTML = "";

    expenses.forEach(exp => {

        let item = document.createElement("div");
        item.className = "expense-item";

        item.innerHTML = `
            <div>
                <strong>₹${exp.amount} ${exp.category}</strong>
                <div class="expense-details">
                    ${exp.note || "No note"} • ${exp.date}
                </div>
            </div>
            <button class="delete-btn" onclick="deleteExpense(${exp.id})">Delete</button>
        `;

        list.appendChild(item);
    });
}

function deleteExpense(id) {
    expenses = expenses.filter(exp => exp.id !== id);
    localStorage.setItem("expenses", JSON.stringify(expenses));
    renderExpenses();
}

function clearForm() {
    document.getElementById("amount").value = "";
    document.getElementById("category").value = "";
    document.getElementById("date").value = "";
    document.getElementById("note").value = "";
}

renderExpenses();


// ======================================
// 🎤 ULTRA SMART VOICE AI SYSTEM
// ======================================

document.addEventListener("DOMContentLoaded", function () {

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
        alert("Use Google Chrome for voice feature.");
        return;
    }

    const recognition = new SpeechRecognition();
    const micBtn = document.getElementById("micBtn");

    recognition.lang = "en-IN"; // works for Hindi + English mix
    recognition.interimResults = false;
    recognition.continuous = false;

    micBtn.addEventListener("click", function () {
        recognition.start();
        micBtn.innerText = "🎙️ Listening...";
        micBtn.classList.add("listening");
    });

    recognition.onresult = function (event) {
        const transcript = event.results[0][0].transcript.toLowerCase();
        console.log("User said:", transcript);

        parseExpense(transcript);

        // AUTO SUBMIT AFTER 1 SECOND
        setTimeout(() => {
            addExpense();
        }, 1000);
    };

    recognition.onend = function () {
        micBtn.innerText = "🎤";
        micBtn.classList.remove("listening");
    };

    recognition.onerror = function (event) {
        alert("Voice error: " + event.error);
        micBtn.innerText = "🎤";
        micBtn.classList.remove("listening");
    };

});


// ======================================
// 🧠 ADVANCED PARSING LOGIC
// ======================================

function parseExpense(text) {

    // 🔹 Extract amount (supports 500, 500.50, 2,000)
    let amountMatch = text.match(/\d+[.,]?\d*/);

    if (amountMatch) {
        let cleanAmount = amountMatch[0].replace(",", "");
        document.getElementById("amount").value = cleanAmount;
    }

    // 🔹 Category detection (English + Hindi)
    let category = "";

    if (text.includes("food") || text.includes("grocery") || text.includes("restaurant") || text.includes("khana")) {
        category = "Food";
    }
    else if (text.includes("uber") || text.includes("bus") || text.includes("train") || text.includes("auto") || text.includes("transport")) {
        category = "Transport";
    }
    else if (text.includes("bill") || text.includes("electricity") || text.includes("water") || text.includes("bijli")) {
        category = "Bills";
    }
    else if (text.includes("shopping") || text.includes("clothes") || text.includes("kapde")) {
        category = "Shopping";
    }
    else if (text.includes("hospital") || text.includes("medicine") || text.includes("doctor")) {
        category = "Health";
    }
    else if (text.includes("movie") || text.includes("entertainment")) {
        category = "Entertainment";
    }

    if (category !== "") {
        document.getElementById("category").value = category;
    }

    // 🔹 Date detection
    let today = new Date();

    if (text.includes("today") || text.includes("aaj")) {
        setDate(today);
    }
    else if (text.includes("yesterday") || text.includes("kal")) {
        today.setDate(today.getDate() - 1);
        setDate(today);
    }
    else {
        // default to today
        setDate(today);
    }

    // 🔹 Set note
    document.getElementById("note").value = text;
}


// Helper to format date
function setDate(dateObj) {
    let year = dateObj.getFullYear();
    let month = String(dateObj.getMonth() + 1).padStart(2, '0');
    let day = String(dateObj.getDate()).padStart(2, '0');
    document.getElementById("date").value = `${year}-${month}-${day}`;
}
// Voice Recognition
const micBtn = document.getElementById("micBtn");

const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;

const recognition = new SpeechRecognition();

recognition.lang = "en-IN"; // Indian English
recognition.continuous = false;

micBtn.addEventListener("click", () => {
    recognition.start();
    micBtn.innerText = "🎙️ Listening...";
});

recognition.onresult = function (event) {
    const speech = event.results[0][0].transcript;

    micBtn.innerText = "🎤 Speak";

    processSpeech(speech);
};

recognition.onerror = function () {
    micBtn.innerText = "🎤 Speak";
    alert("Voice not recognized. Try again.");
};
function processSpeech(text) {
    text = text.toLowerCase();

    console.log("You said:", text);

    // Example: "I spent 600 on food"
    let amountMatch = text.match(/\d+/);
    let amount = amountMatch ? amountMatch[0] : "";

    let category = "Other";

    if (text.includes("food")) category = "Food";
    if (text.includes("travel")) category = "Travel";
    if (text.includes("shopping")) category = "Shopping";
    if (text.includes("movie")) category = "Entertainment";

    // Fill inputs
    if (amount) {
        document.getElementById("amount").value = amount;
    }

    document.getElementById("category").value = category;
    document.getElementById("note").value = text;
}
function addExpense() {
    let amount = document.getElementById("amount").value;
    let category = document.getElementById("category").value;
    let date = document.getElementById("date").value;
    let note = document.getElementById("note").value;

    // Auto Date if Empty
    if (date === "") {
        let today = new Date().toISOString().split("T")[0];
        date = today;
    }

    if (amount === "" || category === "") {
        alert("Please enter amount and category");
        return;
    }

    let expense = {
        amount,
        category,
        date,
        note
    };

    saveExpense(expense);
}
