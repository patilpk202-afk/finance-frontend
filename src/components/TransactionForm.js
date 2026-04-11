import { useState, useEffect } from "react";
import { PlusCircle, Edit2, Loader2, X } from "lucide-react";
import api from "../services/api";

export default function TransactionForm({ refreshData, editingTransaction, setEditingTransaction }) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    amount: "",
    type: "EXPENSE",
    category: "",
    description: ""
  });

  useEffect(() => {
    if (editingTransaction) {
      setFormData({
        amount: editingTransaction.amount || "",
        type: editingTransaction.type || "EXPENSE",
        category: editingTransaction.category || "",
        description: editingTransaction.description || ""
      });
    } else {
      setFormData({ amount: "", type: "EXPENSE", category: "", description: "" });
    }
  }, [editingTransaction]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        ...formData,
        amount: parseFloat(formData.amount),
        userId: localStorage.getItem("userId") || "1", // Pass userId if required by backend
        date: new Date().toISOString() // Pass date in case the backend requires a mandatory timestamp
      };

      if (editingTransaction) {
        await api.put(`/transactions/${editingTransaction.id}`, payload);
        alert("Transaction updated successfully");
      } else {
        await api.post("/transactions", payload);
        alert("Transaction added successfully");
      }
      
      setFormData({ amount: "", type: "EXPENSE", category: "", description: "" });
      setEditingTransaction(null);
      refreshData();
    } catch (error) {
      console.error(error);
      const serverMsg = error.response?.data?.message || JSON.stringify(error.response?.data) || "Unknown error";
      alert(`Failed to save transaction: ${serverMsg}`);
    } finally {
      setLoading(false);
    }
  };

  const cancelEdit = () => {
    setEditingTransaction(null);
    setFormData({ amount: "", type: "EXPENSE", category: "", description: "" });
  };

  return (
    <div className="card">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
        <h3 style={{ fontSize: "1.25rem", fontWeight: "600" }}>
          {editingTransaction ? "Edit Transaction" : "New Transaction"}
        </h3>
        {editingTransaction && (
          <button onClick={cancelEdit} style={{ color: "var(--color-text-muted)", padding: "0.25rem" }}>
            <X size={20} />
          </button>
        )}
      </div>

      <form onSubmit={handleSubmit}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1rem" }}>
          <div>
            <label className="form-label" htmlFor="type">Type</label>
            <select
              id="type"
              name="type"
              className="input-field"
              value={formData.type}
              onChange={handleChange}
              required
            >
              <option value="EXPENSE">Expense</option>
              <option value="INCOME">Income</option>
            </select>
          </div>
          
          <div>
            <label className="form-label" htmlFor="amount">Amount</label>
            <input
              id="amount"
              name="amount"
              type="number"
              step="0.01"
              min="0"
              className="input-field"
              placeholder="0.00"
              value={formData.amount}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="category">Category</label>
          <input
            id="category"
            name="category"
            type="text"
            className="input-field"
            placeholder="e.g. Groceries, Salary, Rent"
            value={formData.category}
            onChange={handleChange}
            required
            list="category-suggestions"
          />
          <datalist id="category-suggestions">
            {formData.type === "EXPENSE" ? (
              <>
                <option value="Groceries" />
                <option value="Dining Out" />
                <option value="Transport" />
                <option value="Utilities" />
                <option value="Entertainment" />
                <option value="Shopping" />
                <option value="Healthcare" />
              </>
            ) : (
              <>
                <option value="Salary" />
                <option value="Freelance" />
                <option value="Investments" />
                <option value="Gift" />
              </>
            )}
          </datalist>
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="description">Description (Optional)</label>
          <input
            id="description"
            name="description"
            type="text"
            className="input-field"
            placeholder="Details about this transaction"
            value={formData.description}
            onChange={handleChange}
          />
        </div>

        <button type="submit" className="btn-primary" style={{ width: "100%" }} disabled={loading}>
          {loading ? <Loader2 className="animate-spin" size={20} /> : (
            editingTransaction ? <><Edit2 size={20} /> Update Transaction</> : <><PlusCircle size={20} /> Add Transaction</>
          )}
        </button>
      </form>
    </div>
  );
}
