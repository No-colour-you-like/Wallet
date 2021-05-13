'use strict';

const transactionNameInput = document.querySelector('#transaction-descr-input'),
  transactionTypeInput = document.querySelector('#transaction-type-input'),
  transactionDateInput = document.querySelector('#transaction-date-input'),
  transactionAmountInput = document.querySelector('#transaction-amount-input'),
  transactionConfirmBtn = document.querySelector('#transaction-confirm-btn'),
  cardNumber = document.querySelector('#card-number'),
  transactionHistory = document.querySelector('#transaction-history');

const transactionsArr = [];
const transactionInfo = {};

//Push transaction info to arr and HTML on click
transactionConfirmBtn.addEventListener('click', (e) => {
  e.preventDefault();

  const transactionName = transactionNameInput.value,
    transactionType = transactionTypeInput.value,
    transactionDate = transactionDateInput.value,
    transactionAmount = transactionAmountInput.value;

  if (transactionName !== '' && transactionType !== '' && transactionDate !== '' && transactionAmount !== '') {
    transactionInfo.name = transactionName;
    transactionInfo.type = transactionType;
    transactionInfo.date = transactionDate;
    transactionInfo.amount = transactionAmount;

    transactionInfo.card = `···· ${cardNumber.textContent.slice(15)}`;

    transactionsArr.push(transactionInfo);
    addTransactionToList();
  }

  // transactionNameInput.value = '';
  // transactionTypeInput.value = '';
  // transactionDateInput.value = '';
  // transactionAmountInput.value = '';
});

//Creacte transaction e;ement and push in HTML
const addTransactionToList = () => {
  const transaction = document.createElement('div');
  transaction.className = 'single-transaction';
  transaction.innerHTML = `
    <p class="single-transaction__info">${transactionsArr[transactionsArr.length - 1].name}</p>
    <p class="single-transaction__info">${transactionsArr[transactionsArr.length - 1].type}</p>
    <p class="single-transaction__info">${transactionsArr[transactionsArr.length - 1].card}</p>
    <p class="single-transaction__info">${transactionsArr[transactionsArr.length - 1].date}</p>
    <p class="single-transaction__info">${'$' + transactionsArr[transactionsArr.length - 1].amount}</p>
  `;

  transactionHistory.prepend(transaction);
};