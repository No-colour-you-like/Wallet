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
  balanceDown = document.querySelector('#balance-down'),
  cardsPrevBtn = document.querySelector('#cards-prev-btn'),
  cardsNextBtn = document.querySelector('#cards-next-btn'),
  cardsSlider = document.querySelector('#cards-slider');

let cards = cardsSlider.querySelectorAll('.card__wrapper');
let activeCard;
let myChart;
let transactionsDates;
let removeTransactionBtn;
let balanceAmounts = [];


function TransactionInfo(cardId, trName, type, card, date, amount) {
  this.cardId = cardId;
  this.trName = trName;
  this.type = type;
  this.card = card;
  this.date = date;
  this.amount = amount;
}

function CardSingleInfo(id, name, number, owner, balance) {
  this.id = id;
  this.name = name;
  this.number = `**** **** **** ${number}`;
  this.owner = owner;
  this.balance = `${balance} $`;
}

const transactionsArr = [
  new TransactionInfo('0', 'Зарплата', 'Пополнение', '**** 1234', '12.05.2021', 1000)
];

const cardsArr = [
  new CardSingleInfo('0', 'Персональная карта', '1234', 'Jack Jackson', 1000),
  new CardSingleInfo('1', 'Рабочая карта', '6789', 'Jack Jackson', 0)
];

const addNewCard = (id, name, number, owner, balance) => {
  const newCard = document.createElement('div');

  if (id == 0) {
    newCard.className = 'card__wrapper active-card';
  } else {
    newCard.className = 'card__wrapper';
  }

  newCard.setAttribute('id', `card-number-${id}`)
  newCard.innerHTML = `
    <div class="card">
      <div class="card__header">
        <h3 class="card__name">${name}</h3>
        <img src="img/visa.svg" alt="card-dev" class="card__dev-img">
      </div>
      <div class="card__middle">
        <img src="img/credit-card.svg" alt="card-chip" class="card__chip-img">
        <div id="card-number" class="card__number">${number}</div>
      </div>
      <div class="card__footer">
        <p class="card__owner">${owner}</p>
        <div class="card__balance">${balance}</div>
      </div>
    </div>
  `;

  cardsSlider.append(newCard);
  cards = cardsSlider.querySelectorAll('.card__wrapper');
};


const addAllCards = () => {
  cardsArr.forEach((card, i) => {
    addNewCard(cardsArr[i].id, cardsArr[i].name, cardsArr[i].number, cardsArr[i].owner, cardsArr[i].balance);
  });
};

addAllCards();


const createNewTransaction = () => {
  activeCard = document.querySelector('.active-card');

  const cardId = activeCard.getAttribute('id').slice(-1),
    transactionName = transactionNameInput.value,
    transactionType = transactionTypeInput.value,
    transactionDate = transactionDateInput.value,
    transactionAmount = +transactionAmountInput.value;

  const activeCardShortNumber = document.querySelector('.active-card').querySelector('#card-number').textContent.slice(-9);

  if (transactionName !== '' && transactionType !== '' && transactionDate !== '' && transactionAmount !== '') {
    const transaction = new TransactionInfo(cardId, transactionName, transactionType, activeCardShortNumber, transactionDate, transactionAmount);

    transactionsArr.unshift(transaction);
    changeBalances();
    addTransactionToList();
    updateTransactions();
  }

  balanceAmounts.unshift(calculateBalance(transactionsArr));

  transactionsDates = transactionsArr.map(transaction => {
    return transaction.date;
  });

  myChart.destroy();
  updateChart();

  // transactionNameInput.value = '';
  // transactionTypeInput.value = '';
  // transactionDateInput.value = '';
  // transactionAmountInput.value = '';

  activeCard.querySelector('.card__balance').textContent = calculateCardBalance(cardId) + ' $';
};

//Filter card by id and calculate balance
const calculateCardBalance = (id) => {
  const cardBalance = transactionsArr.filter(transaction => {
    return transaction.cardId == id;
  });

  const sumBalance = cardBalance.reduce(function (accumulator, currentValue) {
    return accumulator + currentValue.amount;
  }, 0);

  return sumBalance;
};


//Push transaction info to arr and HTML on click
transactionConfirmBtn.addEventListener('click', (e) => {
  e.preventDefault();
  createNewTransaction();
});


//Creacte transaction element and push in HTML
const addTransactionToList = () => {
  const lastTransaction = transactionsArr[0];

  const transaction = document.createElement('div');
  transaction.className = 'single-transaction';
  transaction.innerHTML = `
    <p class="single-transaction__info">${lastTransaction.trName}</p>
    <p class="single-transaction__info">${lastTransaction.type}</p>
    <p class="single-transaction__info">${lastTransaction.card}</p>
    <p class="single-transaction__info">${lastTransaction.date}</p>
    <p class="single-transaction__info single-transaction__amount">${lastTransaction.amount + ' $'}</p>
    <div class="single-transaction__close-btn">
      <img class="single-transaction__close-btn-img" src="img/close.svg" alt="close-btn">
    </div>
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
          beginAtZero: false
        },
        x: {
          grid: {
            display: true
          },
          reverse: true
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

//Change active card
const cardWidth = +getComputedStyle(cards[0]).width.slice(0, -2);
const cardsAmount = +cards.length - 1;

let offsetSlider = 0;
let cardPosition = 0;

const removeActiveCardClass = () => {
  cards.forEach(card => {
    card.classList.remove('active-card');
  });
};

cardsNextBtn.addEventListener('click', () => {
  removeActiveCardClass();

  if (offsetSlider >= 0 && offsetSlider !== +cardWidth * cardsAmount) {
    offsetSlider += cardWidth;
    cards[++cardPosition].classList.add('active-card');
  } else if (offsetSlider === +cardWidth * cardsAmount) {
    offsetSlider = 0;
    cardPosition = 0;
    cards[cardPosition].classList.add('active-card');
  }

  cardsSlider.style.transform = `translateX(-${offsetSlider}px)`;
});

cardsPrevBtn.addEventListener('click', () => {
  removeActiveCardClass();

  if (offsetSlider === 0) {
    offsetSlider = +cardWidth * cardsAmount;
    cardPosition = cards.length - 1;
    cards[cardPosition].classList.add('active-card');
  } else if (offsetSlider >= 0) {
    offsetSlider -= cardWidth;
    cards[--cardPosition].classList.add('active-card');
  }

  cardsSlider.style.transform = `translateX(-${offsetSlider}px)`;
});


updateChart();
createNewTransaction();
addTransactionToList();
changeBalances();


const updateTransactions = () => {
  removeTransactionBtn = document.querySelectorAll('.single-transaction__close-btn');

  removeTransactionBtn.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.currentTarget.parentElement.remove();

      const transactionIndex = Array.from(removeTransactionBtn).indexOf(e.target);
      console.log(Array.from(removeTransactionBtn).indexOf(e.target));
      if (transactionIndex !== -1) {
        
        for (let i = 0; i < balanceAmounts.length; i++) {
          if (i >= transactionIndex) {
            continue;
          }
          balanceAmounts[i] -= transactionsArr[transactionIndex].amount;
        }

        const cardId = transactionsArr[transactionIndex].cardId;
        const cardBalance = (id) => {
          document.querySelector(`#card-number-${id}`).querySelector('.card__balance').textContent = calculateCardBalance(id) + ' $';
        };

        transactionsArr.splice(transactionIndex, 1);
        balanceAmounts.splice(transactionIndex, 1);
        cardBalance(cardId);
        changeBalances();


        transactionsDates = transactionsArr.map(transaction => {
          return transaction.date;
        });

        myChart.destroy();
        updateChart();
      }

      removeTransactionBtn = document.querySelectorAll('.single-transaction__close-btn');
    });
  });
};

updateTransactions();