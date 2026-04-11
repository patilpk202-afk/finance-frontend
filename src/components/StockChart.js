"use client";

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

export default function StockChart({ data }) {
  if (!data || data.length === 0) {
    return (
      <div style={{ padding: "2rem", textAlign: "center", color: "var(--color-text-muted)" }}>
        No chart data available for this range.
      </div>
    );
  }

  // Custom rich tooltip matching the global dark glassmorphism
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div style={{ 
          background: "var(--color-surface-hover)", 
          border: "1px solid var(--color-border)", 
          padding: "1rem", 
          borderRadius: "var(--radius-md)", 
          boxShadow: "var(--shadow-lg)",
          backdropFilter: "blur(10px)"
        }}>
          <p style={{ margin: "0 0 0.5rem 0", color: "var(--color-text-muted)", fontSize: "0.85rem" }}>{label}</p>
          <div style={{ display: "flex", alignItems: "baseline", gap: "0.25rem" }}>
            <span style={{ fontSize: "1.25rem", fontWeight: "700", color: "var(--color-primary)" }}>₹ {payload[0].value.toFixed(2)}</span>
          </div>
        </div>
      );
    }
    return null;
  };

  // Find min and max for rigid Y-axis scaling to show actual price movements
  const prices = data.map(d => d.price).filter(p => typeof p === 'number');
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);
  const padding = (maxPrice - minPrice) * 0.1;

  return (
    <div style={{ width: "100%", height: 350, marginTop: "1.5rem" }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="var(--color-primary)" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="var(--color-primary)" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
          <XAxis 
            dataKey="date" 
            stroke="var(--color-text-muted)" 
            fontSize={12} 
            tickMargin={10}
            axisLine={false}
            tickLine={false}
            minTickGap={30}
          />
          <YAxis 
            domain={[minPrice - padding, maxPrice + padding]}
            stroke="var(--color-text-muted)" 
            fontSize={12} 
            tickFormatter={(value) => `₹${value.toFixed(0)}`}
            axisLine={false}
            tickLine={false}
            tickMargin={10}
          />
          <Tooltip content={<CustomTooltip />} />
          <Line 
            type="monotone" 
            dataKey="price" 
            stroke="var(--color-primary)" 
            strokeWidth={3}
            dot={false}
            activeDot={{ r: 6, fill: "var(--color-primary)", stroke: "var(--color-background)", strokeWidth: 2 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
