import React from 'react';
import { PieChart, Pie, Cell } from 'recharts';

const COLORS = ['#059669', '#C62828']; 

export default function TaskChart({ todos }) {
  const completedCount = todos.filter(todo => todo.completed).length;
  const pendingCount = todos.length - completedCount;

  const pieData = [
    { name: 'Completed', value: completedCount },
    { name: 'Pending', value: pendingCount },
  ];

  return (
    <div className="mt-2 flex flex-col items-center">
      <h1 className="text-2xl font-semibold text-neutral-700 mb-0">
        {completedCount} of {todos.length} tasks completed
      </h1>
      <PieChart width={450} height={400} className='mt-0'>
        <Pie
          data={pieData}
          cx="50%"
          cy="50%"
          outerRadius={70}
          fill="#8884d8"
          dataKey="value"
          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
        >
          {pieData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        
      </PieChart>
    </div>
  );
}

