// ===============================
// LOAD FROM STORAGE
// ===============================

let expenses = JSON.parse(localStorage.getItem("expenses")) || [];

let categoryTotals = {
    Food: 0,
    Shopping: 0,
    Bills: 0,
    Transport: 0,
    Health: 0,
    Entertainment: 0,
    Others: 0
};


// ===============================
// PREPARE DATA
// ===============================

expenses.forEach(e => {

    let cat = e.category;

    if (categoryTotals[cat] !== undefined) {
        categoryTotals[cat] += Number(e.amount);
    } else {
        categoryTotals.Others += Number(e.amount);
    }

});


// ===============================
// CHART SETUP
// ===============================

const pieCtx = document.getElementById('pieChart').getContext('2d');

const barCtx = document.getElementById('barChart').getContext('2d');


let pieChart = new Chart(pieCtx, {

    type: 'pie',

    data: {
        labels: Object.keys(categoryTotals),

        datasets: [{
            data: Object.values(categoryTotals),

            backgroundColor: [
                '#3b82f6', '#10b981', '#f59e0b',
                '#ef4444', '#8b5cf6', '#ec4899',
                '#6b7280'
            ]
        }]
    }
});


let barChart = new Chart(barCtx, {

    type: 'bar',

    data: {
        labels: ['Total'],

        datasets: [{
            label: 'Monthly Spending',

            data: [0],

            backgroundColor: '#3b82f6'
        }]
    }
});


// ===============================
// UPDATE DASHBOARD
// ===============================

function updateDashboard() {

    let total = 0;

    expenses.forEach(e => {
        total += Number(e.amount);
    });

    let transactions = expenses.length;

    let avg = transactions ? (total / transactions).toFixed(2) : 0;

    // Health score
    let score = total < 5000 ? 90 :
        total < 10000 ? 70 : 50;


    document.getElementById("totalSpent").innerText = "₹" + total;

    document.getElementById("totalTransactions").innerText = transactions;

    document.getElementById("avgTransaction").innerText = "₹" + avg;

    document.getElementById("healthScore").innerText = score;


    // Update charts
    pieChart.data.datasets[0].data =
        Object.values(categoryTotals);

    pieChart.update();


    barChart.data.datasets[0].data = [total];

    barChart.update();
}


// ===============================
// INIT
// ===============================

updateDashboard();
localStorage.setItem("expenses", JSON.stringify(expenses));
// ==========================
// MODERN CHAT + VOICE + AI LOGIC
// ==========================

const chatBtn = document.getElementById("chatbot-btn");
const chatBox = document.getElementById("chatbox");
const closeBtn = document.getElementById("close-chat");

if (chatBtn && chatBox && closeBtn) {
    chatBtn.onclick = () => chatBox.style.display = "flex";
    closeBtn.onclick = () => chatBox.style.display = "none";
}

// Add message function
function addMessage(message, className) {
    const chatBody = document.getElementById("chat-body");
    const msgDiv = document.createElement("div");
    msgDiv.className = className;
    msgDiv.innerText = message;
    chatBody.appendChild(msgDiv);
    chatBody.scrollTop = chatBody.scrollHeight;
}

// Send Message
function sendMsg() {

    const input = document.getElementById("userInput");
    const originalMessage = input.value.trim();
    const message = originalMessage.toLowerCase();

    if (!message) return;

    addMessage(originalMessage, "user-msg");
    input.value = "";

    setTimeout(() => {

        let total = expenses.reduce((sum, e) => sum + Number(e.amount), 0);
        let transactions = expenses.length;
        let score = parseInt(document.getElementById("healthScore").innerText);

        let reply = "I am here to help you manage your finances better.";

        if (message.includes("health")) {
            reply = `Your health score is ${score}%. `;
            if (score >= 85)
                reply += "Excellent control over finances! 🎉";
            else if (score >= 60)
                reply += "Stable but needs improvement.";
            else
                reply += "High risk spending detected.";
        }
        else if (message.includes("spend") || message.includes("expense")) {
            reply = `Your total spending is ₹${total}.`;
        }
        else if (message.includes("transaction")) {
            reply = `You have ${transactions} transactions.`;
        }
        else if (message.includes("save")) {
            reply = "Follow 50-30-20 rule and avoid impulse purchases 💰.";
        }
        else if (message.includes("budget")) {
            reply = "Create a monthly budget and track daily expenses 📅.";
        }

        let abnormal = detectAbnormal(total);
        if (abnormal)
            reply += "\n\n" + abnormal;

        addMessage(reply, "bot-msg");

    }, 500);
}

// ==========================
// VOICE INPUT
// ==========================

function startVoice() {

    if (!('webkitSpeechRecognition' in window)) {
        alert("Use Google Chrome for voice support.");
        return;
    }

    const recognition = new webkitSpeechRecognition();
    recognition.lang = "en-IN";
    recognition.start();

    recognition.onresult = function (event) {
        const transcript = event.results[0][0].transcript;
        document.getElementById("userInput").value = transcript;
    };
}

// ==========================
// ABNORMAL DETECTION
// ==========================

function detectAbnormal(totalAmount) {

    let avg = expenses.length > 0 ?
        expenses.reduce((a, b) => a + Number(b.amount), 0) / expenses.length
        : 0;

    if (totalAmount > avg * 2 && avg !== 0) {
        return "⚠️ Your total spending is unusually high compared to your average.";
    }

    if (totalAmount > 10000) {
        return "🚨 High value spending detected this month.";
    }

    return null;
}
// ==========================
// CHAT OPEN / CLOSE FIX
// ==========================

document.addEventListener("DOMContentLoaded", function () {

    const chatBtn = document.getElementById("chatbot-btn");
    const chatBox = document.getElementById("chatbox");
    const closeBtn = document.getElementById("close-chat");

    if (!chatBtn || !chatBox || !closeBtn) {
        console.error("Chat elements not found!");
        return;
    }

    // Open chat
    chatBtn.addEventListener("click", function () {
        chatBox.style.display = "flex";
    });

    // Close chat
    closeBtn.addEventListener("click", function () {
        chatBox.style.display = "none";
    });

});