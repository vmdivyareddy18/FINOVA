// ==========================
// FINOVA ADVANCED SCRIPT
// ==========================

let expenses = [];
let descriptions = [];

let categoryTotals = {
    Food: 0,
    Shopping: 0,
    Bills: 0,
    Transport: 0,
    Health: 0,
    Entertainment: 0,
    Others: 0
};

// ==========================
// CHART INITIALIZATION
// ==========================

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
                '#ef4444', '#8b5cf6', '#ec4899', '#6b7280'
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

// ==========================
// ABNORMAL DETECTION
// ==========================

function detectAbnormal(amount) {

    let avg = expenses.length > 0 ?
        expenses.reduce((a, b) => a + b, 0) / expenses.length
        : 0;

    if (amount > avg * 2 && avg !== 0) {
        return "⚠️ This expense is unusually high compared to your average spending.";
    }

    if (amount > 10000) {
        return "🚨 High value transaction detected.";
    }

    return null;
}

// ==========================
// CATEGORY SUGGESTION
// ==========================

function suggestCategory(description) {

    description = description.toLowerCase();

    if (description.includes("pizza") || description.includes("food") || description.includes("restaurant"))
        return "Food";

    if (description.includes("amazon") || description.includes("shopping") || description.includes("clothes"))
        return "Shopping";

    if (description.includes("electricity") || description.includes("bill") || description.includes("rent"))
        return "Bills";

    if (description.includes("uber") || description.includes("bus") || description.includes("fuel"))
        return "Transport";

    if (description.includes("doctor") || description.includes("medicine"))
        return "Health";

    if (description.includes("movie") || description.includes("netflix"))
        return "Entertainment";

    return "Others";
}

// ==========================
// UPDATE DASHBOARD
// ==========================

function updateDashboard() {

    let total = expenses.reduce((a, b) => a + b, 0);
    let transactions = expenses.length;
    let avg = transactions > 0 ? (total / transactions).toFixed(2) : 0;

    let score;
    let summaryText;
    let color;

    if (total === 0) {
        score = 100;
        summaryText = "No expenses recorded yet.";
        color = "#22c55e";
    }
    else if (total < 5000) {
        score = 90;
        summaryText = "Excellent financial control.";
        color = "#22c55e";
    }
    else if (total < 10000) {
        score = 75;
        summaryText = "Good financial condition.";
        color = "#3b82f6";
    }
    else if (total < 20000) {
        score = 60;
        summaryText = "Spending is increasing.";
        color = "#f59e0b";
    }
    else {
        score = 40;
        summaryText = "High spending detected.";
        color = "#ef4444";
    }

    // SMART INSIGHTS
    if (score >= 85)
        summaryText += " 🌟 Consider investing your savings.";
    else if (score >= 60)
        summaryText += " 📊 Try optimizing recurring expenses.";
    else
        summaryText += " 🚨 Strict budgeting recommended.";

    document.getElementById("totalSpent").innerText = "₹" + total;
    document.getElementById("totalTransactions").innerText = transactions;
    document.getElementById("avgTransaction").innerText = "₹" + avg;
    document.getElementById("healthScore").innerText = score;

    const progressBar = document.getElementById("healthProgressBar");
    progressBar.style.width = score + "%";
    progressBar.style.backgroundColor = color;
    progressBar.innerText = score + "%";

    document.getElementById("healthSummaryText").innerText = summaryText;

    pieChart.data.datasets[0].data = Object.values(categoryTotals);
    pieChart.update();

    barChart.data.datasets[0].data = [total];
    barChart.update();
}

// ==========================
// CHATBOT
// ==========================

function toggleChat() {
    const chatbot = document.getElementById("chatbot");
    chatbot.style.display = chatbot.style.display === "flex" ? "none" : "flex";
    chatbot.style.flexDirection = "column";
}

function addMessage(message, className) {
    const chatBody = document.getElementById("chatBody");
    const msgDiv = document.createElement("div");
    msgDiv.className = className;
    msgDiv.innerText = message;
    chatBody.appendChild(msgDiv);
    chatBody.scrollTop = chatBody.scrollHeight;
}

function sendMessage() {

    const input = document.getElementById("userInput");
    const originalMessage = input.value;
    const message = originalMessage.toLowerCase();

    if (!message) return;

    addMessage(originalMessage, "user-message");
    input.value = "";

    setTimeout(() => {

        let total = parseFloat(document.getElementById("totalSpent").innerText.replace("₹", ""));
        let transactions = parseInt(document.getElementById("totalTransactions").innerText);
        let score = parseInt(document.getElementById("healthScore").innerText);

        let reply = "I am here to help you manage your finances better.";

        if (message.includes("health")) {
            reply = `Your health score is ${score}%. `;
            if (score >= 85)
                reply += "Excellent control over finances!";
            else if (score >= 60)
                reply += "Stable but needs improvement.";
            else
                reply += "High risk spending detected.";
        }
        else if (message.includes("spending") || message.includes("expense")) {
            reply = `Total spending is ₹${total}.`;
        }
        else if (message.includes("transaction")) {
            reply = `You have ${transactions} transactions.`;
        }
        else if (message.includes("save")) {
            reply = "Follow 50-30-20 rule and avoid impulse purchases.";
        }
        else if (message.includes("budget")) {
            reply = "Create monthly budget and track daily expenses.";
        }

        let abnormal = detectAbnormal(total);
        if (abnormal)
            reply += "\n\n" + abnormal;

        addMessage(reply, "bot-message");

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