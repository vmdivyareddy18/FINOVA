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
// 🎤 VOICE TO TEXT INTEGRATION
// ======================================

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

if (SpeechRecognition) {

    const recognition = new SpeechRecognition();
    const micBtn = document.getElementById("micBtn");
    const noteInput = document.getElementById("note");

    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = "en-IN";
    recognition.maxAlternatives = 1;

    micBtn.addEventListener("click", () => {
        recognition.start();
        micBtn.classList.add("listening");
        micBtn.innerText = "🎙️";
    });

    recognition.onresult = function (event) {
        const transcript = event.results[0][0].transcript;
        noteInput.value = transcript;
    };

    recognition.onend = function () {
        micBtn.classList.remove("listening");
        micBtn.innerText = "🎤";
    };

    recognition.onerror = function (event) {
        alert("Voice recognition error: " + event.error);
        micBtn.classList.remove("listening");
        micBtn.innerText = "🎤";
    };

} else {
    alert("Speech Recognition not supported in this browser. Please use Google Chrome.");
} s