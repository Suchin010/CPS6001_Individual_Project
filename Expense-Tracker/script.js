if (localStorage.getItem("loggedIn") !== "true") {
  window.location.href = "login.html";
}

const form = document.getElementById("form");
const list = document.getElementById("list");
const monthFilter = document.getElementById("monthFilter");

let transactions = JSON.parse(localStorage.getItem("transactions")) || [];

// FORMAT MONEY
function formatMoney(amount) {
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP"
  }).format(amount);
}

// ADD TRANSACTION
form.addEventListener("submit", e => {
  e.preventDefault();

  const transaction = {
    id: Date.now(),
    text: text.value,
    amount: type.value === "expense" ? -amount.value : +amount.value,
    category: category.value,
    date: new Date().toISOString()
  };

  transactions.push(transaction);
  update();
});

// FILTER BY MONTH
function getFilteredTransactions() {
  if (monthFilter.value === "all") return transactions;

  return transactions.filter(t => {
    const d = new Date(t.date);
    return d.getMonth() == monthFilter.value;
  });
}

// UPDATE UI
function update() {
  localStorage.setItem("transactions", JSON.stringify(transactions));
  populateMonths();
  render();
}

// POPULATE MONTH DROPDOWN
function populateMonths() {
  monthFilter.innerHTML = `<option value="all">All Time</option>`;
  const months = [...new Set(transactions.map(t => new Date(t.date).getMonth()))];

  months.forEach(m => {
    monthFilter.innerHTML += `<option value="${m}">Month ${m+1}</option>`;
  });
}

// RENDER
function render() {
  list.innerHTML = "";

  const filtered = getFilteredTransactions();

  let total = 0, income = 0, expense = 0;
  let categories = {food:0, travel:0, necessities:0, unwanted:0};

  filtered.forEach(t => {
    total += +t.amount;
    t.amount > 0 ? income += +t.amount : expense += +t.amount;

    if (t.amount < 0) categories[t.category] += Math.abs(t.amount);

    const li = document.createElement("li");

    li.innerHTML = `
      ${t.text} (${t.category})
      <small>${new Date(t.date).toLocaleDateString()}</small>
      <span>${formatMoney(t.amount)}</span>
      <button onclick="deleteTransaction(${t.id})">X</button>
    `;

    list.appendChild(li);
  });

  balance.innerText = formatMoney(total);
  incomeEl.innerText = formatMoney(income);
  expenseEl.innerText = formatMoney(Math.abs(expense));

  drawCharts(income, Math.abs(expense), categories);
  generateInsight(categories, expense);
}

// DELETE
function deleteTransaction(id){
  transactions = transactions.filter(t => t.id !== id);
  update();
}

// CLEAR ALL
function clearAll(){
  if(confirm("Delete all data?")){
    transactions = [];
    update();
  }
}

// EXPORT CSV
function exportCSV(){
  let csv = "Text,Category,Amount,Date\n";

  transactions.forEach(t => {
    csv += `${t.text},${t.category},${t.amount},${t.date}\n`;
  });

  const blob = new Blob([csv], { type: "text/csv" });
  const link = document.createElement("a");

  link.href = URL.createObjectURL(blob);
  link.download = "expenses.csv";
  link.click();
}

// CHARTS
function drawCharts(income, expense, categories){

  if(window.chart1) chart1.destroy();
  if(window.chart2) chart2.destroy();

  chart1 = new Chart(document.getElementById("chart1"), {
    type: "doughnut",
    data: {
      labels:["Income","Expense"],
      datasets:[{data:[income,expense]}]
    }
  });

  chart2 = new Chart(document.getElementById("chart2"), {
    type: "bar",
    data: {
      labels:["Food","Travel","Necessities","Unwanted"],
      datasets:[{data:Object.values(categories)}]
    }
  });
}

// SMART INSIGHTS
function generateInsight(categories, expense){
  const max = Math.max(...Object.values(categories));
  const top = Object.keys(categories).find(k => categories[k] === max);

  if(expense === 0){
    insight.innerText = "No expenses yet.";
    return;
  }

  const percent = ((max / expense) * 100).toFixed(1);

  if(percent > 50){
    insight.innerText = `Warning: ${percent}% of your spending is on ${top}.`;
  } else {
    insight.innerText = `Top spending: ${top} (${percent}%).`;
  }
}

// EVENTS
monthFilter.addEventListener("change", render);

// LOGOUT
function logout(){
  localStorage.removeItem("loggedIn");
  window.location.href="login.html";
}

// INIT
update();