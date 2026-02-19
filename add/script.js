let expenses = [];
let categoryTotals = {
    Food: 0,
    Shopping: 0,
    Bills: 0,
    Transport: 0,
    Health: 0,
    Entertainment: 0
};

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
                '#ef4444', '#8b5cf6', '#ec4899'
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

function addExpense() {
    let amount = parseFloat(document.getElementById("amount").value);
    let category = document.getElementById("category").value;

    if (isNaN(amount) || amount <= 0) {
        alert("Enter valid amount");
        return;
    }

    expenses.push(amount);
    categoryTotals[category] += amount;

    updateDashboard();
}

function updateDashboard() {

    let total = expenses.reduce((a, b) => a + b, 0);
    let transactions = expenses.length;
    let avg = transactions > 0 ? (total / transactions).toFixed(2) : 0;

    // Simple health score logic
    let score = total < 5000 ? 90 :
                total < 10000 ? 70 : 50;

    document.getElementById("totalSpent").innerText = "₹" + total;
    document.getElementById("totalTransactions").innerText = transactions;
    document.getElementById("avgTransaction").innerText = "₹" + avg;
    document.getElementById("healthScore").innerText = score;

    // Update charts
    pieChart.data.datasets[0].data = Object.values(categoryTotals);
    pieChart.update();

    barChart.data.datasets[0].data = [total];
    barChart.update();
}
