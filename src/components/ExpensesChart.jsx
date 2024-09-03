import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, LabelList } from 'recharts';

const ExpensesChart = ({ transactions, viewType }) => {
  const groupTransactions = (trans) => {
    return trans.reduce((acc, t) => {
      const key = viewType === 'category' ? t.category : new Date(t.date).toLocaleString('default', { month: 'long', year: 'numeric' });
      if (!acc[key]) {
        acc[key] = { income: 0, expense: 0 };
      }
      if (t.type === 'income') {
        acc[key].income += t.amount;
      } else {
        acc[key].expense += t.amount;
      }
      return acc;
    }, {});
  };

  const groupedData = groupTransactions(transactions);
  const data = Object.entries(groupedData).map(([key, value]) => ({
    name: key,
    income: value.income,
    expense: value.expense,
  }));

  return (
    <BarChart width={800} height={400} data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="name" />
      <YAxis />
      <Tooltip formatter={(value) => `$${value.toFixed(2)}`} />
      <Legend />
      <Bar dataKey="income" fill="#4CAF50" name="Income">
        <LabelList dataKey="income" position="top" formatter={(value) => `$${value.toFixed(2)}`} />
      </Bar>
      <Bar dataKey="expense" fill="#FF5722" name="Expense">
        <LabelList dataKey="expense" position="top" formatter={(value) => `$${value.toFixed(2)}`} />
      </Bar>
    </BarChart>
  );
};

export default ExpensesChart;
