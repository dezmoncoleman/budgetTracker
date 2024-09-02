import React, { useState, useMemo, useEffect } from 'react';
import AddTransaction from './AddTransaction';

const categories = ['All', 'Food', 'Transportation', 'Entertainment', 'Bills', 'Other'];

const BudgetTracker = () => {
  const [transactions, setTransactions] = useState(() => {
    const savedTransactions = localStorage.getItem('transactions');
    return savedTransactions ? JSON.parse(savedTransactions) : [];
  });
  const [filter, setFilter] = useState('All');

  useEffect(() => {
    localStorage.setItem('transactions', JSON.stringify(transactions));
  }, [transactions]);

  const { totalIncome, totalExpenses, balance } = useMemo(() => {
    return transactions.reduce((acc, transaction) => {
      if (transaction.type === 'income') {
        acc.totalIncome += transaction.amount;
      } else {
        acc.totalExpenses += transaction.amount;
      }
      acc.balance = acc.totalIncome - acc.totalExpenses;
      return acc;
    }, { totalIncome: 0, totalExpenses: 0, balance: 0 });
  }, [transactions]);

  const filteredTransactions = useMemo(() => {
    return filter === 'All'
      ? transactions
      : transactions.filter(t => t.category === filter);
  }, [transactions, filter]);

  const handleAddTransaction = (newTransaction) => {
    setTransactions(prevTransactions => [
      ...prevTransactions,
      { ...newTransaction, id: Date.now() }
    ]);
  };

  const handleDeleteTransaction = (id) => {
    setTransactions(prevTransactions => prevTransactions.filter(t => t.id !== id));
  };

  const handleEditTransaction = (id, updatedTransaction) => {
    setTransactions(prevTransactions => prevTransactions.map(t => 
      t.id === id ? { ...t, ...updatedTransaction } : t
    ));
  };

  return (
    <div className="budget-tracker">
      <h1>Personal Budget Tracker</h1>
      <div className="summary">
        <div>Income: ${totalIncome.toFixed(2)}</div>
        <div>Expenses: ${totalExpenses.toFixed(2)}</div>
        <div>Balance: ${balance.toFixed(2)}</div>
      </div>
      <AddTransaction onAddTransaction={handleAddTransaction} />
      <h2>Transactions</h2>
      <select value={filter} onChange={(e) => setFilter(e.target.value)}>
        {categories.map(cat => (
          <option key={cat} value={cat}>{cat}</option>
        ))}
      </select>
      <ul>
        {filteredTransactions.map(transaction => (
          <li key={transaction.id}>
            {transaction.description} - ${transaction.amount.toFixed(2)} 
            ({transaction.type}) - {transaction.category}
            <button onClick={() => handleDeleteTransaction(transaction.id)}>Delete</button>
            <button onClick={() => {
              // Here you would typically open a modal or form to edit the transaction
              // For simplicity, we'll just update the amount
              const newAmount = prompt('Enter new amount:', transaction.amount);
              if (newAmount) {
                handleEditTransaction(transaction.id, { amount: parseFloat(newAmount) });
              }
            }}>Edit</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default BudgetTracker;