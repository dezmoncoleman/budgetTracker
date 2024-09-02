import React, { useState } from 'react';

const categories = ['Food', 'Transportation', 'Entertainment', 'Bills', 'Other'];

/**
 * @typedef {Object} Transaction
 * @property {number} amount
 * @property {string} description
 * @property {string} category
 * @property {'income' | 'expense'} type
 */

/**
 * @param {Object} props
 * @param {(transaction: Transaction) => void} props.onAddTransaction
 */
const AddTransaction = ({ onAddTransaction }) => {
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [type, setType] = useState('expense');

  const handleSubmit = (e) => {
    e.preventDefault();
    onAddTransaction({
      amount: parseFloat(amount),
      description,
      category,
      type,
    });
    // Reset form
    setAmount('');
    setDescription('');
    setCategory('');
    setType('expense');
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="number"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        placeholder="Amount"
        required
      />
      <input
        type="text"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Description"
        required
      />
      <select
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        required
      >
        <option value="">Select Category</option>
        {categories.map(cat => (
          <option key={cat} value={cat}>{cat}</option>
        ))}
      </select>
      <select value={type} onChange={(e) => setType(e.target.value)}>
        <option value="income">Income</option>
        <option value="expense">Expense</option>
      </select>
      <button type="submit">Add Transaction</button>
    </form>
  );
};

export default AddTransaction;
