import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const categories = ['Food', 'Transportation', 'Entertainment', 'Bills', 'Other', 'Income'];

/**
 * @typedef {Object} Transaction
 * @property {number} amount
 * @property {string} description
 * @property {string} category
 * @property {'income' | 'expense'} type
 * @property {Date} date
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
  const [date, setDate] = useState(new Date());

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!amount || !description || !category) {
      alert('Please fill in all fields');
      return;
    }
    onAddTransaction({
      amount: parseFloat(amount),
      description,
      category,
      type,
      date: date.toISOString(),
    });
    // Reset form
    setAmount('');
    setDescription('');
    setCategory('');
    setType('expense');
    setDate(new Date());
  };

  return (
    <form onSubmit={handleSubmit} className="add-transaction-form">
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
        <option value="expense">Expense</option>
        <option value="income">Income</option>
      </select>
      <DatePicker
        selected={date}
        onChange={(date) => setDate(date)}
        dateFormat="MMMM d, yyyy"
      />
      <button type="submit">Add Transaction</button>
    </form>
  );
};

// Custom input component for the DatePicker
const CustomDatePickerInput = React.forwardRef(({ value, onClick }, ref) => (
  <button className="date-picker-button" onClick={onClick} ref={ref}>
    {value} 📅
  </button>
));

export default AddTransaction;
