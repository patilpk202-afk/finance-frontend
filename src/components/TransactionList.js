import { Edit2, Trash2 } from "lucide-react";
import api from "../services/api";

export default function TransactionList({ transactions, refreshData, setEditingTransaction }) {
  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this transaction?")) return;
    
    try {
      await api.delete(`/transactions/${id}`);
      refreshData();
    } catch (error) {
      console.error("Failed to delete", error);
      alert("Failed to delete transaction");
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const formatCurrency = (value) => 
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value || 0);

  if (!transactions || transactions.length === 0) {
    return (
      <div className="card" style={{ textAlign: "center", padding: "3rem 1rem" }}>
        <p style={{ color: "var(--color-text-muted)" }}>No transactions found. Add one to get started.</p>
      </div>
    );
  }

  return (
    <div className="card" style={{ overflowX: "auto" }}>
      <h3 style={{ fontSize: "1.25rem", fontWeight: "600", marginBottom: "1.5rem" }}>Recent Transactions</h3>
      
      <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
        <thead>
          <tr style={{ borderBottom: "1px solid var(--color-border)", color: "var(--color-text-muted)", fontSize: "0.875rem" }}>
            <th style={{ padding: "0.75rem" }}>Date</th>
            <th style={{ padding: "0.75rem" }}>Description</th>
            <th style={{ padding: "0.75rem" }}>Category</th>
            <th style={{ padding: "0.75rem", textAlign: "right" }}>Amount</th>
            <th style={{ padding: "0.75rem", textAlign: "center" }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((tx) => {
            const txId = tx._id || tx.id;
            return (
              <tr key={txId} style={{ borderBottom: "1px solid var(--color-border)", transition: "background-color var(--transition-fast)" }} className="hover-row">
                <td style={{ padding: "1rem 0.75rem", fontSize: "0.875rem" }}>
                  {formatDate(tx.createdAt || tx.date)}
                </td>
                <td style={{ padding: "1rem 0.75rem", fontWeight: "500" }}>
                  {tx.description || "-"}
                </td>
                <td style={{ padding: "1rem 0.75rem" }}>
                  <span style={{ 
                    padding: "0.25rem 0.5rem", 
                    backgroundColor: "var(--color-background)", 
                    borderRadius: "var(--radius-full)",
                    fontSize: "0.75rem",
                    color: "var(--color-text-muted)"
                  }}>
                    {tx.category}
                  </span>
                </td>
                <td style={{ 
                  padding: "1rem 0.75rem", 
                  textAlign: "right", 
                  fontWeight: "600",
                  color: tx.type === "INCOME" ? "var(--color-success)" : "var(--color-text-main)"
                }}>
                  {tx.type === "INCOME" ? "+" : "-"}{formatCurrency(tx.amount)}
                </td>
                <td style={{ padding: "1rem 0.75rem", textAlign: "center" }}>
                  <div style={{ display: "flex", justifyContent: "center", gap: "0.5rem" }}>
                    <button 
                      onClick={() => setEditingTransaction({ ...tx, id: txId })}
                      style={{ color: "var(--color-text-muted)", padding: "0.25rem", borderRadius: "var(--radius-sm)" }}
                    >
                      <Edit2 size={16} />
                    </button>
                    <button 
                      onClick={() => handleDelete(txId)}
                      className="btn-danger"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <style jsx>{`
        .hover-row:hover {
          background-color: var(--color-background);
        }
      `}</style>
    </div>
  );
}
