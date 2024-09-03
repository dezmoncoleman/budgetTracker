import React, { useState, useEffect, useMemo, useCallback } from 'react';
import AddTransaction from './AddTransaction';
import ExpensesChart from './ExpensesChart';

const BudgetTracker = () => {
  const [transactions, setTransactions] = useState(() => {
    const savedTransactions = localStorage.getItem('transactions');
    return savedTransactions ? JSON.parse(savedTransactions) : [];
  });
  const [monthlyBudget, setMonthlyBudget] = useState(() => {
    const savedBudget = localStorage.getItem('monthlyBudget');
    return savedBudget ? parseFloat(savedBudget) : 0;
  });
  const [viewType, setViewType] = useState('category'); // Default view type
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedType, setSelectedType] = useState('expense'); // Default to expense

  useEffect(() => {
    localStorage.setItem('transactions', JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem('monthlyBudget', monthlyBudget.toString());
  }, [monthlyBudget]);

  const handleAddTransaction = useCallback((newTransaction) => {
    setTransactions(prevTransactions => [
      ...prevTransactions,
      { ...newTransaction, id: Date.now() }
    ]);
  }, []);

  const handleCategoryChange = (e) => {
    const category = e.target.value;
    setSelectedCategory(category);
    
    // If "Income" is selected, clear the selected type
    if (category === 'Income') {
      setSelectedType(''); // Clear the type selection
    }
  };

  const handleViewTypeChange = (e) => {
    setViewType(e.target.value);
  };

  const handleDeleteTransaction = (id) => {
    setTransactions(prevTransactions => prevTransactions.filter(transaction => transaction.id !== id));
  };

  const filteredTransactions = useMemo(() => {
    return transactions.filter(t => {
      if (selectedCategory && selectedCategory !== 'Income') {
        return t.category === selectedCategory;
      }
      return true; // Show all if no specific category is selected
    });
  }, [transactions, selectedCategory]);

  // Today's transactions
  const todayTransactions = useMemo(() => {
    const today = new Date().toDateString();
    return transactions.filter(t => new Date(t.date).toDateString() === today);
  }, [transactions]);

  // Group remaining transactions by month
  const groupedTransactions = useMemo(() => {
    return transactions.reduce((acc, transaction) => {
      const date = new Date(transaction.date);
      const monthYear = date.toLocaleString('default', { month: 'long', year: 'numeric' });
      if (!acc[monthYear]) {
        acc[monthYear] = [];
      }
      acc[monthYear].push(transaction);
      return acc;
    }, {});
  }, [transactions]);

  // Sort months in descending order
  const sortedMonths = useMemo(() => {
    return Object.keys(groupedTransactions).sort((a, b) => {
      const dateA = new Date(a);
      const dateB = new Date(b);
      return dateB - dateA; // Sort from most recent to oldest
    });
  }, [groupedTransactions]);

  return (
    <div className="budget-tracker">
      <h1>Personal Budget Tracker</h1>
      <div className="summary">
        <div>Monthly Budget: $
          <input
            type="number"
            value={monthlyBudget}
            onChange={(e) => setMonthlyBudget(parseFloat(e.target.value) || 0)}
          />
        </div>
      </div>
      <AddTransaction onAddTransaction={handleAddTransaction} />
      <div>
        <select value={selectedCategory} onChange={handleCategoryChange}>
          <option value="">Select Category</option>
          <option value="Food">Food</option>
          <option value="Transportation">Transportation</option>
          <option value="Entertainment">Entertainment</option>
          <option value="Bills">Bills</option>
          <option value="Income">Income</option>
        </select>
        <select value={selectedType} onChange={(e) => setSelectedType(e.target.value)}>
          <option value="expense">Expense</option>
          <option value="income">Income</option>
        </select>
      </div>
      <div>
        <h2>View Chart By:</h2>
        <select value={viewType} onChange={handleViewTypeChange}>
          <option value="category">By Category</option>
          <option value="month">By Month</option>
        </select>
      </div>
      {filteredTransactions.length > 0 ? (
        <ExpensesChart 
          transactions={filteredTransactions} 
          viewType={viewType}
        />
      ) : (
        <p>No transactions to display.</p>
      )}
      
      {/* Today's Transactions Section */}
      <h2>Today's Transactions</h2>
      <div className="transactions-list today">
        {todayTransactions.length > 0 ? (
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Description</th>
                <th>Category</th>
                <th>Amount</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {todayTransactions.sort((a, b) => new Date(b.date) - new Date(a.date)).map(transaction => (
                <tr key={transaction.id}>
                  <td>{new Date(transaction.date).toLocaleDateString()}</td>
                  <td>{transaction.description}</td>
                  <td>{transaction.category}</td>
                  <td className={transaction.type === 'income' ? 'income' : 'expense'}>
                    ${transaction.amount.toFixed(2)}
                  </td>
                  <td>
                    <button className="edit-btn" onClick={() => {
                      const newAmount = prompt('Enter new amount:', transaction.amount);
                      if (newAmount) {
                        handleEditTransaction(transaction.id, { amount: parseFloat(newAmount) });
                      }
                    }}>Edit</button>
                    <button className="delete-btn" onClick={() => handleDeleteTransaction(transaction.id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No transactions for today.</p>
        )}
      </div>

      {/* Grouped Transactions Section */}
      <h2>Past Transactions</h2>
      <div className="transactions-list">
        {sortedMonths.map(monthYear => (
          <div key={monthYear}>
            <h3>{monthYear}</h3>
            <table>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Description</th>
                  <th>Category</th>
                  <th>Amount</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {groupedTransactions[monthYear].sort((a, b) => new Date(b.date) - new Date(a.date)).map(transaction => (
                  <tr key={transaction.id}>
                    <td>{new Date(transaction.date).toLocaleDateString()}</td>
                    <td>{transaction.description}</td>
                    <td>{transaction.category}</td>
                    <td className={transaction.type === 'income' ? 'income' : 'expense'}>
                      ${transaction.amount.toFixed(2)}
                    </td>
                    <td>
                      <button className="edit-btn" onClick={() => {
                        const newAmount = prompt('Enter new amount:', transaction.amount);
                        if (newAmount) {
                          handleEditTransaction(transaction.id, { amount: parseFloat(newAmount) });
                        }
                      }}>Edit</button>
                      <button className="delete-btn" onClick={() => handleDeleteTransaction(transaction.id)}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BudgetTracker;