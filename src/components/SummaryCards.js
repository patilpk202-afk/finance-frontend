import { ArrowUpRight, ArrowDownRight, DollarSign } from "lucide-react";

export default function SummaryCards({ summary }) {
  const formatCurrency = (value) => 
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value || 0);

  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "1.5rem", marginBottom: "2rem" }}>
      
      <div className="card" style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", borderTop: "4px solid var(--color-primary)" }}>
        <div>
          <p style={{ color: "var(--color-text-muted)", fontSize: "0.95rem", fontWeight: "600", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "0.5rem" }}>Total Balance</p>
          <h2 style={{ fontSize: "2.25rem", fontWeight: "800", color: "var(--color-text-main)", letterSpacing: "-1px" }}>
            {formatCurrency(summary.balance)}
          </h2>
        </div>
        <div style={{ padding: "0.875rem", background: "linear-gradient(135deg, rgba(139, 92, 246, 0.2) 0%, rgba(139, 92, 246, 0.05) 100%)", borderRadius: "1rem", boxShadow: "inset 0 0 0 1px rgba(139, 92, 246, 0.3)" }}>
          <DollarSign size={28} color="var(--color-primary)" />
        </div>
      </div>

      <div className="card" style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", borderTop: "4px solid var(--color-success)" }}>
        <div>
          <p style={{ color: "var(--color-text-muted)", fontSize: "0.95rem", fontWeight: "600", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "0.5rem" }}>Total Income</p>
          <h2 style={{ fontSize: "2.25rem", fontWeight: "800", color: "var(--color-text-main)", letterSpacing: "-1px" }}>
            {formatCurrency(summary.totalIncome)}
          </h2>
        </div>
        <div style={{ padding: "0.875rem", background: "linear-gradient(135deg, rgba(16, 185, 129, 0.2) 0%, rgba(16, 185, 129, 0.05) 100%)", borderRadius: "1rem", boxShadow: "inset 0 0 0 1px rgba(16, 185, 129, 0.3)" }}>
          <ArrowUpRight size={28} color="var(--color-success)" />
        </div>
      </div>

      <div className="card" style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", borderTop: "4px solid var(--color-danger)" }}>
        <div>
          <p style={{ color: "var(--color-text-muted)", fontSize: "0.95rem", fontWeight: "600", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "0.5rem" }}>Total Expense</p>
          <h2 style={{ fontSize: "2.25rem", fontWeight: "800", color: "var(--color-text-main)", letterSpacing: "-1px" }}>
            {formatCurrency(summary.totalExpense)}
          </h2>
        </div>
        <div style={{ padding: "0.875rem", background: "linear-gradient(135deg, rgba(244, 63, 94, 0.2) 0%, rgba(244, 63, 94, 0.05) 100%)", borderRadius: "1rem", boxShadow: "inset 0 0 0 1px rgba(244, 63, 94, 0.3)" }}>
          <ArrowDownRight size={28} color="var(--color-danger)" />
        </div>
      </div>

    </div>
  );
}
