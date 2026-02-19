document.getElementById('fileInput').addEventListener('change', function (e) {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onload = function (event) {
        const text = event.target.result;
        processCSV(text);
    };

    reader.readAsText(file);
});

function processCSV(data) {
    const rows = data.split("\n").slice(1);

    let income = 0;
    let expense = 0;

    rows.forEach(row => {
        const cols = row.split(",");
        const amount = parseFloat(cols[2]);

        if (!isNaN(amount)) {
            if (amount > 0) income += amount;
            else expense += Math.abs(amount);
        }
    });

    showChart(income, expense);
    calculateScore(income, expense);
}

function showChart(income, expense) {
    const ctx = document.getElementById('chart');

    new Chart(ctx, {
        type: 'pie',
        data: {
            labels: ['Income', 'Expense'],
            datasets: [{
                data: [income, expense]
            }]
        }
    });
}

async function calculateScore(income, expense) {

    let savingsRate = ((income - expense) / income) * 100;

    let score;

    if (savingsRate > 20) score = 90;
    else if (savingsRate > 10) score = 70;
    else score = 50;

    document.getElementById("score").innerText = score + "/100";

    const response = await fetch("/analyze", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            income,
            expense,
            savingsRate
        })
    });

    const data = await response.json();

    if (data.result)
        document.getElementById("insights").innerText = data.result;
    else
        document.getElementById("insights").innerText = "AI Error: " + data.error;
}