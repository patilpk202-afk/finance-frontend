"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { LayoutDashboard, Loader2, RefreshCw, Moon, Sun } from "lucide-react";
import api from "../../services/api";

import Footer from "../../components/Footer";

import SummaryCards from "../../components/SummaryCards";
import TransactionForm from "../../components/TransactionForm";
import TransactionList from "../../components/TransactionList";
import DashboardCharts from "../../components/DashboardCharts";

export default function DashboardPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  
  const [summary, setSummary] = useState({ totalIncome: 0, totalExpense: 0, balance: 0 });
  const [transactions, setTransactions] = useState([]);
  const [monthlyData, setMonthlyData] = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [theme, setTheme] = useState("light");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [downloadingReport, setDownloadingReport] = useState(false);

  const fetchDashboardData = useCallback(async (isRefresh = false) => {
    try {
      if (isRefresh) setRefreshing(true);
      setError("");

      const userId = localStorage.getItem("userId") || "1"; // Fallback if backend doesn't explicitly return but still needs it

      const [summaryRes, transRes, monthlyRes, catRes] = await Promise.allSettled([
        api.get(`/dashboard/summary`),
        api.get(`/transactions/all`),
        api.get(`/dashboard/monthly`),
        api.get(`/dashboard/category`)
      ]);

      if (summaryRes.status === "fulfilled") setSummary(summaryRes.value.data);
      if (transRes.status === "fulfilled") setTransactions(transRes.value.data);
      if (monthlyRes.status === "fulfilled") setMonthlyData(monthlyRes.value.data);
      if (catRes.status === "fulfilled") setCategoryData(catRes.value.data);

    } catch (err) {
      console.error(err);
      setError("Failed to fetch some dashboard data. Check your connection.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }
    fetchDashboardData();
    
    // Sync theme on mount
    const currentTheme = document.documentElement.getAttribute("data-theme") || 
                        (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
    setTheme(currentTheme);

    const handleRefresh = () => fetchDashboardData(true);
    window.addEventListener("globalRefresh", handleRefresh);
    
    return () => {
      window.removeEventListener("globalRefresh", handleRefresh);
    };
    
  }, [router, fetchDashboardData]);

  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    if (newTheme === "dark") {
      document.documentElement.setAttribute('data-theme', 'dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.removeAttribute('data-theme');
      localStorage.setItem('theme', 'light');
    }
  };

  const handleDownloadReport = async () => {
    if (!fromDate || !toDate) {
      setError("Please select both From and To dates for the statement.");
      return;
    }
    try {
      setDownloadingReport(true);
      setError("");
      
      const res = await api.get("/transactions/report", {
        params: { from: fromDate, to: toDate },
        responseType: "blob"
      });
      
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "statement.pdf");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
    } catch (err) {
      console.error(err);
      setError("Failed to download report. Please check the dates.");
    } finally {
      setDownloadingReport(false);
    }
  };

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ textAlign: "center" }}>
          <Loader2 className="animate-spin" size={48} color="var(--color-primary)" style={{ margin: "0 auto", marginBottom: "1rem" }} />
          <p style={{ color: "var(--color-text-muted)" }}>Loading dashboard...</p>
        </div>
      </div>
    );
  }



  return (
    <div style={{ minHeight: "100vh", backgroundColor: "var(--color-background)", display: "flex", flexDirection: "column" }}>

      {/* Main Content */}
      <main className="container animate-fade-in" style={{ padding: "2rem 1rem" }}>
        
        {error && (
          <div style={{ padding: "1rem", backgroundColor: "rgba(239, 68, 68, 0.1)", color: "var(--color-danger)", borderRadius: "var(--radius-md)", marginBottom: "1.5rem" }}>
            {error}
          </div>
        )}

        <SummaryCards summary={summary} />
        
        <DashboardCharts monthlyData={monthlyData} categoryData={categoryData} />

        <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "1.5rem", alignItems: "start" }}>
          {/* Use CSS media queries to stack this properly. We'll simulate it with style for simplicity but relying on flexwrap is fine */}
          <div style={{ display: "flex", flexDirection: "row", flexWrap: "wrap", gap: "1.5rem" }}>
            <div style={{ flex: "1 1 300px" }}>
              <TransactionForm 
                refreshData={() => fetchDashboardData(true)} 
                editingTransaction={editingTransaction}
                setEditingTransaction={setEditingTransaction}
              />
            </div>
            <div style={{ flex: "2 1 600px" }}>
              <div style={{
                background: "var(--color-surface)",
                padding: "1.5rem",
                borderRadius: "var(--radius-lg)",
                border: "1px solid var(--color-border)",
                marginBottom: "1.5rem",
                display: "flex",
                flexWrap: "wrap",
                gap: "1rem",
                alignItems: "flex-end"
              }}>
                <div style={{ flex: 1, minWidth: "150px" }}>
                  <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "0.85rem", color: "var(--color-text-muted)" }}>From Date (Statement Report)</label>
                  <input type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} style={{ width: "100%", padding: "0.75rem", borderRadius: "var(--radius-md)", border: "1px solid var(--color-border)", background: "rgba(255, 255, 255, 0.03)", color: "var(--color-text-main)" }} />
                </div>
                <div style={{ flex: 1, minWidth: "150px" }}>
                  <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "0.85rem", color: "var(--color-text-muted)" }}>To Date (Statement Report)</label>
                  <input type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} style={{ width: "100%", padding: "0.75rem", borderRadius: "var(--radius-md)", border: "1px solid var(--color-border)", background: "rgba(255, 255, 255, 0.03)", color: "var(--color-text-main)" }} />
                </div>
                <div>
                  <button onClick={handleDownloadReport} disabled={downloadingReport} style={{ background: "var(--color-primary)", color: "white", padding: "0.75rem 1.5rem", borderRadius: "var(--radius-md)", fontWeight: "500", cursor: downloadingReport ? "not-allowed" : "pointer", opacity: downloadingReport ? 0.7 : 1 }}>
                    {downloadingReport ? "Generating..." : "Download Report"}
                  </button>
                </div>
              </div>
              
              <TransactionList 
                transactions={transactions} 
                refreshData={() => fetchDashboardData(true)}
                setEditingTransaction={setEditingTransaction}
              />

            </div>
          </div>
        </div>

      </main>
      
      <Footer />
    </div>
  );
}