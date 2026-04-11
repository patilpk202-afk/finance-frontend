import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';

export default function DashboardCharts({ monthlyData, categoryData }) {
  const COLORS = ['#10B981', '#3B82F6', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#64748B'];

  // Helper to safely convert varied backend responses into an array
  const safeArray = (data) => {
    if (!data) return [];
    if (Array.isArray(data)) return data;
    // If it's an object with an array inside (e.g. { content: [...] })
    if (data.content && Array.isArray(data.content)) return data.content;
    if (data.data && Array.isArray(data.data)) return data.data;
    // If it's a key-value map from Spring Boot (e.g. { "Jan": 100 })
    if (typeof data === "object") {
      return Object.entries(data).map(([key, value]) => ({
        name: key,
        value: typeof value === 'number' ? value : (value.amount || value.value || 0),
        Income: value.Income ?? value.income ?? value.incomes ?? (typeof value === 'number' && value > 0 ? value : 0),
        Expense: value.Expense ?? value.expense ?? value.expenses ?? (typeof value === 'number' && value < 0 ? Math.abs(value) : 0),
      }));
    }
    return [];
  };

  const formattedMonthly = safeArray(monthlyData).map(item => ({
    name: item.month || item.name || 'Unknown',
    Income: typeof item.Income !== 'undefined' ? item.Income : (item.income ?? item.incomes ?? 0),
    Expense: typeof item.Expense !== 'undefined' ? item.Expense : (item.expense ?? item.expenses ?? 0),
  }));

  const formattedCategory = safeArray(categoryData).map(item => ({
    name: item.category || item.name || 'Unknown',
    value: typeof item.value !== 'undefined' ? item.value : (item.amount || 0),
  }));

  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "1.5rem", marginBottom: "2rem" }}>
      
      <div className="card">
        <h3 style={{ fontSize: "1.125rem", fontWeight: "600", marginBottom: "1.5rem", color: "var(--color-text-main)" }}>
          Income vs Expense
        </h3>
        <div style={{ height: "300px", width: "100%" }}>
          {formattedMonthly.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={formattedMonthly} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-border)" />
                <XAxis dataKey="name" stroke="var(--color-text-muted)" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="var(--color-text-muted)" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val) => `$${val}`} />
                <RechartsTooltip 
                  cursor={{ fill: 'var(--color-background)' }} 
                  contentStyle={{ backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)' }} 
                />
                <Legend iconType="circle" />
                <Bar dataKey="Income" fill="var(--color-success)" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Expense" fill="var(--color-danger)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div style={{ display: "flex", height: "100%", alignItems: "center", justifyContent: "center", color: "var(--color-text-muted)" }}>
              No monthly data available
            </div>
          )}
        </div>
      </div>

      <div className="card">
        <h3 style={{ fontSize: "1.125rem", fontWeight: "600", marginBottom: "1.5rem", color: "var(--color-text-main)" }}>
          Expenses by Category
        </h3>
        <div style={{ height: "300px", width: "100%" }}>
          {formattedCategory.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={formattedCategory}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {formattedCategory.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <RechartsTooltip 
                  contentStyle={{ backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)' }} 
                  formatter={(value) => `$${value}`}
                />
                <Legend iconType="circle" layout="vertical" verticalAlign="middle" align="right" />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div style={{ display: "flex", height: "100%", alignItems: "center", justifyContent: "center", color: "var(--color-text-muted)" }}>
              No category data available
            </div>
          )}
        </div>
      </div>

    </div>
  );
}
