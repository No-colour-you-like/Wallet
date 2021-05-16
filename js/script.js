'use strict';

const transactionNameInput = document.querySelector('#transaction-descr-input'),
  transactionTypeInput = document.querySelector('#transaction-type-input'),
  transactionDateInput = document.querySelector('#transaction-date-input'),
  transactionAmountInput = document.querySelector('#transaction-amount-input'),
  transactionConfirmBtn = document.querySelector('#transaction-confirm-btn'),
  cardNumber = document.querySelector('#card-number'),
  transactionHistory = document.querySelector('#transaction-history'),
  balanceCurrent = document.querySelector('#balance-current'),
  balanceUp = document.querySelector('#balance-up'),
  balanceDown = document.querySelector('#balance-down');


function TransactionInfo(trName, type, card, date, amount) {
  this.trName = trName;
  this.type = type;
  this.card = card;
  this.date = date;
  this.amount = amount;
}

const transactionsArr = [
  new TransactionInfo('Зарплата', 'Поплнение', 1234, '12.05.2021', 1000)
];

let myChart;
let transactionsDates;

const createNewTransaction = () => {
  const transactionName = transactionNameInput.value,
    transactionType = transactionTypeInput.value,
    transactionDate = transactionDateInput.value,
    transactionAmount = +transactionAmountInput.value;

  if (transactionName !== '' && transactionType !== '' && transactionDate !== '' && transactionAmount !== '') {
    const cardNumberShort = `···· ${cardNumber.textContent.slice(-4)}`;

    const transaction = new TransactionInfo(transactionName, transactionType, cardNumberShort, transactionDate, transactionAmount);

    transactionsArr.push(transaction);
    addTransactionToList();
    changeBalances();
  }

  transactionsDates = transactionsArr.map(transaction => {
    return transaction.date;
  });

  myChart.destroy();
  updateChart();

  // transactionNameInput.value = '';
  // transactionTypeInput.value = '';
  // transactionDateInput.value = '';
  // transactionAmountInput.value = '';
};


//Push transaction info to arr and HTML on click
transactionConfirmBtn.addEventListener('click', (e) => {
  e.preventDefault();
  createNewTransaction();
});


//Creacte transaction element and push in HTML
const addTransactionToList = () => {
  const lastTransaction = transactionsArr[transactionsArr.length - 1];

  const transaction = document.createElement('div');
  transaction.className = 'single-transaction';
  transaction.innerHTML = `
    <p class="single-transaction__info">${lastTransaction.trName}</p>
    <p class="single-transaction__info">${lastTransaction.type}</p>
    <p class="single-transaction__info">${lastTransaction.card}</p>
    <p class="single-transaction__info">${lastTransaction.date}</p>
    <p class="single-transaction__info single-transaction__amount">${lastTransaction.amount + ' $'}</p>
  `;

  const transactionAmount = transaction.querySelector('.single-transaction__amount');

  if (lastTransaction.amount >= 0) {
    transactionAmount.classList.add('positive-amount-color');
  } else {
    transactionAmount.classList.add('negative-amount-color');
  }

  transactionHistory.prepend(transaction);
};

//Change balances
const balanceAmounts = [];

const calculateBalance = (transactions) => {
  const sumBalances = transactions.reduce(function (accumulator, currentValue) {
    return accumulator + currentValue.amount;
  }, 0);

  return sumBalances;
};

// Change balance and chart
const changeBalances = () => {
  const negativeTransactionsArr = transactionsArr.filter(transaction => {
    return transaction.amount <= 0;
  });

  const positiveTransactionsArr = transactionsArr.filter(transaction => {
    return transaction.amount >= 0;
  });

  balanceCurrent.textContent = calculateBalance(transactionsArr) + ' $';
  balanceUp.textContent = calculateBalance(positiveTransactionsArr) + ' $';
  balanceDown.textContent = calculateBalance(negativeTransactionsArr) + ' $';

  balanceAmounts.push(calculateBalance(transactionsArr));
};


//Chart
const ctx = document.querySelector('#myChart').getContext('2d');
const updateChart = () => {
  myChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: transactionsDates,
      datasets: [{
        label: '',
        data: balanceAmounts,
        fill: true,
        backgroundColor: [
          'rgba(237, 241, 250, 0.6)',
        ],
        borderColor: [
          'rgba(74, 110, 201, 1)',
        ],
        borderWidth: 1.5,
        pointBackgroundColor: 'rgba(74, 110, 201, 1)',
        pointRadius: 4
      }]
    },
    options: {
      scales: {
        y: {
          beginAtZero: true
        },
        x: {
          grid: {
            display: false
          }
        }
      },
      plugins: {
        legend: {
          display: false
        },
        tooltip: {
          backgroundColor: 'rgba(74, 110, 200, 1)',
          displayColors: false
        }
      }
    }
  });
};

updateChart();
createNewTransaction();
addTransactionToList();
changeBalances();

