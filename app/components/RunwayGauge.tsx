'use client';

import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

interface RunwayGaugeProps {
  balance: number;
  monthlyOutflow: number;
}

export default function RunwayGauge({ balance, monthlyOutflow }: RunwayGaugeProps) {
  // Calculate runway in months
  const runwayMonths = monthlyOutflow > 0 ? balance / monthlyOutflow : 0;
  
  // Cap gauge at 24 months for visual scale
  const maxScale = 24;
  const currentScale = Math.min(runwayMonths, maxScale);
  const remainingScale = maxScale - currentScale;

  const data = [
    { name: 'Runway', value: currentScale },
    { name: 'Empty', value: remainingScale },
  ];

  // Color: Blue theme
  let fillColor = '#3b82f6'; // blue-500
  if (runwayMonths < 6) {
    fillColor = '#2563eb'; // blue-600
  } else if (runwayMonths < 12) {
    fillColor = '#60a5fa'; // blue-400
  }

  const COLORS = [fillColor, '#1e293b']; // Filled vs Empty track

  return (
    <div className="flex flex-col items-center justify-center relative w-full h-[200px]">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="100%"
            startAngle={180}
            endAngle={0}
            innerRadius={80}
            outerRadius={100}
            paddingAngle={0}
            dataKey="value"
            stroke="none"
          >
            {data.map((entry, index) => (
              <Cell key={"cell-" + index} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      
      {/* Absolute centered text for the gauge */}
      <div className="absolute bottom-0 left-0 w-full text-center pb-2">
        <p className="text-4xl font-bold text-slate-100 font-mono">
          {runwayMonths.toFixed(1)}
        </p>
        <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-1">
          Months Runway
        </p>
      </div>
    </div>
  );
}
