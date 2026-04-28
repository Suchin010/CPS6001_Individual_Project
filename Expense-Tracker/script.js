if (localStorage.getItem("loggedIn") !== "true") {
  window.location.href = "login.html";
}

const form = document.getElementById("form");
const list = document.getElementById("list");

let transactions = JSON.parse(localStorage.getItem("transactions")) || [];

let chart1, chart2;

function formatMoney(amount) {
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP"
  }).format(amount);
}

function showTab(tab) {
  document.querySelectorAll(".tab").forEach(t => t.classList.remove("active"));
  document.querySelectorAll(".tabs button").forEach(b => b.classList.remove("active"));

  document.getElementById(tab).classList.add("active");
  event.target.classList.add("active");
}

function toggleCategory() {
  const type = document.getElementById("type").value;
  document.getElementById("category").style.display =
    type === "income" ? "none" : "block";
}

form.addEventListener("submit", function(e) {
  e.preventDefault();

  const textInput = document.getElementById("text");
  const amountInput = document.getElementById("amount");
  const type = document.getElementById("type").value;
  const category = document.getElementById("category").value;

  const transaction = {
    id: Date.now(),
    text: textInput.value,
    amount: type === "expense" ? -amountInput.value : +amountInput.value,
    category: type === "income" ? "income" : category
  };

  transactions.push(transaction);
  localStorage.setItem("transactions", JSON.stringify(transactions));

  textInput.value = "";
  amountInput.value = "";

  render();
});

function render() {
  list.innerHTML = "";

  let income = 0, expense = 0;
  let categories = {food:0, travel:0, necessities:0, unwanted:0};

  transactions.forEach(t => {
    if (t.amount > 0) income += t.amount;
    else {
      expense += t.amount;
      categories[t.category] += Math.abs(t.amount);
    }

    const li = document.createElement("li");

    li.innerHTML = `
      <div class="transaction-left">
        <strong>${t.text}</strong>
        <small>${t.category}</small>
      </div>

      <div class="transaction-right">
        <span class="${t.amount > 0 ? 'green' : 'red'}">
          ${formatMoney(t.amount)}
        </span>
        <button onclick="deleteTransaction(${t.id})">✕</button>
      </div>
    `;

    list.appendChild(li);
  });

  document.getElementById("income").innerText = formatMoney(income);
  document.getElementById("expense").innerText = formatMoney(Math.abs(expense));
  document.getElementById("balance").innerText = formatMoney(income + expense);

  drawCharts(income, Math.abs(expense), categories);
  generateInsights(categories, Math.abs(expense));
}

function deleteTransaction(id) {
  transactions = transactions.filter(t => t.id !== id);
  localStorage.setItem("transactions", JSON.stringify(transactions));
  render();
}

function drawCharts(income, expense, categories) {
  if (chart1) chart1.destroy();
  if (chart2) chart2.destroy();

  chart1 = new Chart(document.getElementById("chart1"), {
    type: "doughnut",
    data: {
      labels: ["Income", "Expense"],
      datasets: [{ data: [income, expense] }]
    }
  });

  chart2 = new Chart(document.getElementById("chart2"), {
    type: "bar",
    data: {
      labels: ["Food","Travel","Necessities","Unwanted"],
      datasets: [{ data: Object.values(categories) }]
    }
  });
}

function generateInsights(categories, expense) {
  if (expense === 0) return;

  const max = Math.max(...Object.values(categories));
  const top = Object.keys(categories).find(k => categories[k] === max);

  const monthly = (max * 0.2).toFixed(2);
  const yearly = (monthly * 12).toFixed(2);
  const daily = (expense / 30).toFixed(2);

  document.getElementById("topCategory").innerHTML =
    `<h3>Top Spending</h3><p>${top}</p>`;

  document.getElementById("savingTip").innerHTML =
    `<h3>Savings Potential</h3><p>£${monthly}/month (£${yearly}/year)</p>`;

  document.getElementById("dailyTip").innerHTML =
    `<h3>Daily Habit</h3><p>Save £${daily}/day</p>`;
}

function logout() {
  localStorage.removeItem("loggedIn");
  window.location.href = "login.html";
}

render();
toggleCategory();