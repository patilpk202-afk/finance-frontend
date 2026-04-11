"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Coins, TrendingUp } from "lucide-react";
import api from "../../services/api";

import Footer from "../../components/Footer";

export default function MetalsRates() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [rates, setRates] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [error, setError] = useState("");

  const fetchRates = useCallback(async (isAuto = false) => {
    try {
      if (!isAuto) setRefreshing(true);
      setError("");
      
      const res = await api.get('/finance/metals');
      if (res.data) {
        setRates(res.data);
        const now = new Date();
        setLastUpdated(now.toLocaleTimeString());
      }
    } catch (err) {
      console.error(err);
      setError("Failed to fetch live market rates. Check your connection.");
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
    
    // Initial fetch
    fetchRates();
    
    // Auto refresh every 30 seconds
    const interval = setInterval(() => {
      fetchRates(true);
    }, 30000);
    
    return () => clearInterval(interval);
  }, [router, fetchRates]);

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Loader2 className="animate-spin" size={48} color="var(--color-primary)" />
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "var(--color-background)", display: "flex", flexDirection: "column" }}>

      <main className="container animate-fade-in" style={{ padding: "3rem 1rem", maxWidth: "800px", margin: "0 auto" }}>
        
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "2rem" }}>
          <div>
            <h2 style={{ fontSize: "1.75rem", margin: 0, color: "var(--color-text-main)", display: "flex", alignItems: "center", gap: "0.75rem" }}>
              <Coins color="var(--color-primary)" /> Gold & Silver Live
            </h2>
            <p style={{ color: "var(--color-text-muted)", marginTop: "0.5rem" }}>Prices updated in real-time based on India (INR) Per Gram</p>
          </div>
          
          <div style={{ textAlign: "right" }}>
            <span style={{ display: "block", fontSize: "0.85rem", color: "var(--color-text-muted)", marginBottom: "0.25rem" }}>Last Updated</span>
            <div style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", background: "rgba(255,255,255,0.05)", padding: "0.4rem 0.75rem", borderRadius: "1rem", fontSize: "0.85rem", color: "var(--color-text-main)" }}>
               {refreshing ? <Loader2 size={14} className="animate-spin" /> : <div style={{ width: "8px", height: "8px", background: "#22c55e", borderRadius: "50%", boxShadow: "0 0 8px #22c55e" }} /> }
               {lastUpdated || "--:--:--"}
            </div>
          </div>
        </div>

        {error && (
          <div style={{ padding: "1rem", backgroundColor: "rgba(239, 68, 68, 0.1)", color: "var(--color-danger)", borderRadius: "var(--radius-md)", marginBottom: "1.5rem", textAlign: "center" }}>
            {error}
          </div>
        )}

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "1.5rem" }}>
          
          {/* Gold Card */}
          <div className="card" style={{ padding: "2rem", position: "relative", overflow: "hidden", borderTop: "4px solid #F59E0B" }}>
            <div style={{ position: "absolute", top: "-20px", right: "-20px", opacity: 0.05 }}>
              <Coins size={120} />
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1rem" }}>
              <h3 style={{ fontSize: "1.25rem", margin: 0, color: "var(--color-text-main)" }}>24K Gold</h3>
              <span style={{ 
                background: "rgba(34, 197, 94, 0.1)", 
                color: "#22c55e", 
                padding: "0.25rem 0.5rem", 
                borderRadius: "var(--radius-sm)", 
                fontSize: "0.75rem", 
                fontWeight: "600",
                display: "flex",
                alignItems: "center",
                gap: "0.25rem"
              }}>
                <TrendingUp size={12} /> Live
              </span>
            </div>
            <p style={{ color: "var(--color-text-muted)", fontSize: "0.9rem", marginBottom: "1.5rem" }}>Price per 1 gram (INR)</p>
            <div style={{ fontSize: "2.5rem", fontWeight: "800", color: "#F59E0B", letterSpacing: "-1px" }}>
              ₹ {rates?.gold ? rates.gold.toLocaleString("en-IN") : "---"}
            </div>
          </div>

          {/* Silver Card */}
          <div className="card" style={{ padding: "2rem", position: "relative", overflow: "hidden", borderTop: "4px solid #94A3B8" }}>
            <div style={{ position: "absolute", top: "-20px", right: "-20px", opacity: 0.05 }}>
              <Coins size={120} />
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1rem" }}>
              <h3 style={{ fontSize: "1.25rem", margin: 0, color: "var(--color-text-main)" }}>Pure Silver</h3>
              <span style={{ 
                background: "rgba(34, 197, 94, 0.1)", 
                color: "#22c55e", 
                padding: "0.25rem 0.5rem", 
                borderRadius: "var(--radius-sm)", 
                fontSize: "0.75rem", 
                fontWeight: "600",
                display: "flex",
                alignItems: "center",
                gap: "0.25rem"
              }}>
                <TrendingUp size={12} /> Live
              </span>
            </div>
            <p style={{ color: "var(--color-text-muted)", fontSize: "0.9rem", marginBottom: "1.5rem" }}>Price per 1 gram (INR)</p>
            <div style={{ fontSize: "2.5rem", fontWeight: "800", color: "#E2E8F0", letterSpacing: "-1px" }}>
              ₹ {rates?.silver ? rates.silver.toLocaleString("en-IN") : "---"}
            </div>
          </div>

        </div>
        
        {rates && rates.isMocked && (
          <div style={{ marginTop: "2rem", textAlign: "center", fontSize: "0.85rem", color: "var(--color-text-muted)", background: "rgba(255,255,255,0.03)", padding: "1rem", borderRadius: "1rem" }}>
            <strong>Note:</strong> Due to TLS failures with the target API endpoints, you are currently seeing gracefully mocked Fallback Market data directly tailored to India (INR).
          </div>
        )}

      </main>
      
      <Footer />
    </div>
  );
}
