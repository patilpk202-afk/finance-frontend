"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2, TrendingUp, Search, Activity } from "lucide-react";
import api from "../../services/api";

import StockChart from "../../components/StockChart";
import Footer from "../../components/Footer";

export default function StockMarket() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);
  const [symbolInput, setSymbolInput] = useState("");
  const [stockData, setStockData] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }
    setLoading(false);
    
    // Auto-load RELIANCE.NS as showcase display immediately
    fetchStockData("RELIANCE");
  }, [router]);

  const fetchStockData = async (ticker) => {
    if (!ticker) return;
    
    setSearching(true);
    setError("");
    setStockData(null);

    try {
      // Calls the Spring Boot proxy mapping explicitly to NSE
      const res = await api.get(`/finance/stocks?symbol=${ticker}`);
      const data = res.data;
      
      if (data && data.success) {
        
        // Parse the parallel arrays from Yahoo Finance back into Recharts {date, price} objects
        const chartData = [];
        if (data.timestamps && data.prices) {
          for (let i = 0; i < data.timestamps.length; i++) {
            if (data.prices[i] !== null) {
              const dateObj = new Date(data.timestamps[i] * 1000); // Unix is seconds, JS uses ms
              chartData.push({
                date: dateObj.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' }),
                fullDate: dateObj.toLocaleString(),
                price: Number(data.prices[i])
              });
            }
          }
        }
        
        setStockData({
          symbol: data.symbol,
          currentPrice: data.currentPrice,
          chartData: chartData
        });
      } else {
        setError(data.error || "Failed to locate stock ticker.");
      }
    } catch (err) {
      console.error(err);
      setError("Failed to fetch market data. Ensure backend is active.");
    } finally {
      setSearching(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchStockData(symbolInput);
  };

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Loader2 className="animate-spin" size={48} color="var(--color-primary)" />
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "var(--color-background)", display: "flex", flexDirection: "column" }}>

      <main className="container animate-fade-in" style={{ padding: "3rem 1rem", maxWidth: "900px", margin: "0 auto" }}>
        
        <div style={{ marginBottom: "2rem" }}>
          <h2 style={{ fontSize: "1.75rem", margin: 0, color: "var(--color-text-main)", display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <Activity color="var(--color-primary)" /> Indian Equities (NSE/BSE)
          </h2>
          <p style={{ color: "var(--color-text-muted)", marginTop: "0.5rem" }}>Track 1-Month historical price curves instantly.</p>
        </div>

        {/* Global Search Interface */}
        <form onSubmit={handleSearch} style={{ display: "flex", gap: "1rem", marginBottom: "2rem" }}>
          <div style={{ flex: 1, position: "relative" }}>
            <Search size={20} color="var(--color-text-muted)" style={{ position: "absolute", left: "1rem", top: "50%", transform: "translateY(-50%)" }} />
            <input 
              type="text" 
              placeholder="Enter Stock Ticker (e.g. RELIANCE, TCS, INFY)" 
              value={symbolInput}
              onChange={(e) => setSymbolInput(e.target.value)}
              required
              style={{
                width: "100%",
                padding: "1rem 1rem 1rem 3rem",
                fontSize: "1rem",
                fontWeight: "500",
                background: "var(--color-surface)",
                border: "1px solid var(--color-border)",
                borderRadius: "var(--radius-md)",
                color: "var(--color-text-main)",
                boxShadow: "var(--shadow-sm)"
              }}
            />
          </div>
          <button 
            type="submit" 
            className="btn-primary" 
            style={{ 
              padding: "0 2rem", 
              fontWeight: "600",
              display: "flex",
              alignItems: "center",
              gap: "0.5rem"
            }}
            disabled={searching}
          >
            {searching ? <Loader2 size={20} className="animate-spin" /> : "Search"}
          </button>
        </form>

        {error && (
          <div className="animate-fade-in" style={{ padding: "1rem", backgroundColor: "rgba(239, 68, 68, 0.1)", color: "var(--color-danger)", borderRadius: "var(--radius-md)", marginBottom: "1.5rem", textAlign: "center", border: "1px solid rgba(239, 68, 68, 0.2)" }}>
            {error}
          </div>
        )}

        {/* Dynamic Chart Target Layout */}
        {stockData && !searching && (
          <div className="card animate-fade-in" style={{ padding: "2rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              
              <div>
                <span style={{ 
                  background: "rgba(139, 92, 246, 0.1)", 
                  color: "var(--color-primary)", 
                  padding: "0.25rem 0.5rem", 
                  borderRadius: "var(--radius-sm)", 
                  fontSize: "0.75rem", 
                  fontWeight: "600",
                  textTransform: "uppercase"
                }}>
                  {stockData.symbol}
                </span>
                <h3 style={{ fontSize: "2rem", margin: "1rem 0 0.25rem 0", color: "var(--color-text-main)", letterSpacing: "-0.5px" }}>
                  ₹ {stockData.currentPrice?.toLocaleString("en-IN")}
                </h3>
                <p style={{ color: "var(--color-text-muted)", fontSize: "0.9rem", display: "flex", alignItems: "center", gap: "0.25rem", margin: 0 }}>
                  Current Market Price
                </p>
              </div>

              <div style={{ textAlign: "right" }}>
                <span style={{ 
                  color: "#22c55e", 
                  display: "flex",
                  alignItems: "center",
                  gap: "0.25rem",
                  fontSize: "0.85rem",
                  fontWeight: "600"
                }}>
                  <TrendingUp size={16} /> 1-Month Trend
                </span>
              </div>
              
            </div>

            <StockChart data={stockData.chartData} />
            
          </div>
        )}

      </main>
      
      <Footer />
    </div>
  );
}
