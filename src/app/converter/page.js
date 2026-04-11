"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2, ArrowRightLeft, DollarSign } from "lucide-react";
import api from "../../services/api";

import Footer from "../../components/Footer";

export default function CurrencyConverter() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [calculating, setCalculating] = useState(false);
  const [amount, setAmount] = useState(1);
  const [fromCurrency, setFromCurrency] = useState("USD");
  const [toCurrency, setToCurrency] = useState("INR");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }
    setLoading(false);
  }, [router]);

  const handleConvert = async (e) => {
    e.preventDefault();
    if (!amount || amount <= 0) return;

    setCalculating(true);
    setError("");
    setResult(null);

    try {
      const res = await api.get(`/finance/convert?from=${fromCurrency}&to=${toCurrency}&amount=${amount}`);
      if (res.data && res.data.success) {
        setResult(res.data.result);
      } else {
        setError("Conversion failed to return a valid result.");
      }
    } catch (err) {
      console.error(err);
      setError("Failed to reach conversion API. Please try again later.");
    } finally {
      setCalculating(false);
    }
  };

  const swapCurrencies = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
    setResult(null);
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

      <main className="container animate-fade-in" style={{ padding: "3rem 1rem", maxWidth: "600px", margin: "0 auto" }}>
        <div className="card" style={{ padding: "2.5rem" }}>
          
          <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
            <div style={{ 
              display: "inline-flex", 
              alignItems: "center", 
              justifyContent: "center", 
              background: "rgba(139, 92, 246, 0.1)", 
              color: "var(--color-primary)", 
              width: "64px", 
              height: "64px", 
              borderRadius: "50%", 
              marginBottom: "1rem" 
            }}>
              <DollarSign size={32} />
            </div>
            <h2 style={{ fontSize: "1.75rem", margin: 0, color: "var(--color-text-main)" }}>Live Exchange</h2>
            <p style={{ color: "var(--color-text-muted)", marginTop: "0.5rem" }}>Real-time foreign exchange market rates</p>
          </div>

          {error && (
            <div style={{ padding: "1rem", backgroundColor: "rgba(239, 68, 68, 0.1)", color: "var(--color-danger)", borderRadius: "var(--radius-md)", marginBottom: "1.5rem", textAlign: "center" }}>
              {error}
            </div>
          )}

          <form onSubmit={handleConvert} style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            
            <div>
              <label style={{ display: "block", marginBottom: "0.5rem", color: "var(--color-text-muted)", fontSize: "0.9rem" }}>Amount</label>
              <input 
                type="number" 
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                min="0.01"
                step="any"
                required
                style={{
                  width: "100%",
                  padding: "0.875rem 1rem",
                  fontSize: "1.25rem",
                  fontWeight: "600",
                  background: "var(--color-background)",
                  border: "1px solid var(--color-border)",
                  borderRadius: "var(--radius-md)",
                  color: "var(--color-text-main)"
                }}
              />
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "1rem", position: "relative" }}>
              <div style={{ flex: 1 }}>
                <label style={{ display: "block", marginBottom: "0.5rem", color: "var(--color-text-muted)", fontSize: "0.9rem" }}>From</label>
                <select 
                  value={fromCurrency}
                  onChange={(e) => setFromCurrency(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "0.875rem 1rem",
                    fontSize: "1.1rem",
                    background: "var(--color-background)",
                    border: "1px solid var(--color-border)",
                    borderRadius: "var(--radius-md)",
                    color: "var(--color-text-main)"
                  }}
                >
                  <option value="USD">USD - US Dollar</option>
                  <option value="INR">INR - Indian Rupee</option>
                  <option value="EUR">EUR - Euro</option>
                  <option value="GBP">GBP - British Pound</option>
                  <option value="AUD">AUD - Australian Dollar</option>
                  <option value="CAD">CAD - Canadian Dollar</option>
                  <option value="SGD">SGD - Singapore Dollar</option>
                  <option value="AED">AED - UAE Dirham</option>
                </select>
              </div>

              <button 
                type="button"
                onClick={swapCurrencies}
                style={{
                  background: "var(--color-surface-hover)",
                  border: "1px solid var(--color-border)",
                  color: "var(--color-primary)",
                  width: "48px",
                  height: "48px",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  marginTop: "1.5rem", // offset for label height
                  transition: "all 0.2s"
                }}
                onMouseEnter={(e) => e.currentTarget.style.transform = "rotate(180deg)"}
                onMouseLeave={(e) => e.currentTarget.style.transform = "rotate(0deg)"}
              >
                <ArrowRightLeft size={20} />
              </button>

              <div style={{ flex: 1 }}>
                <label style={{ display: "block", marginBottom: "0.5rem", color: "var(--color-text-muted)", fontSize: "0.9rem" }}>To</label>
                <select 
                  value={toCurrency}
                  onChange={(e) => setToCurrency(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "0.875rem 1rem",
                    fontSize: "1.1rem",
                    background: "var(--color-background)",
                    border: "1px solid var(--color-border)",
                    borderRadius: "var(--radius-md)",
                    color: "var(--color-text-main)"
                  }}
                >
                  <option value="USD">USD - US Dollar</option>
                  <option value="INR">INR - Indian Rupee</option>
                  <option value="EUR">EUR - Euro</option>
                  <option value="GBP">GBP - British Pound</option>
                  <option value="AUD">AUD - Australian Dollar</option>
                  <option value="CAD">CAD - Canadian Dollar</option>
                  <option value="SGD">SGD - Singapore Dollar</option>
                  <option value="AED">AED - UAE Dirham</option>
                </select>
              </div>
            </div>

            <button 
              type="submit" 
              className="btn-primary" 
              style={{ width: "100%", padding: "1rem", fontSize: "1.1rem", fontWeight: "600", marginTop: "1rem", display: "flex", justifyContent: "center", gap: "0.5rem" }}
              disabled={calculating}
            >
              {calculating ? <><Loader2 size={24} className="animate-spin" /> Fetching Market...</> : "Convert Currency"}
            </button>
          </form>

          {result !== null && (
            <div className="animate-fade-in" style={{ 
              marginTop: "2.5rem", 
              padding: "1.5rem", 
              background: "rgba(34, 197, 94, 0.1)", 
              border: "1px solid rgba(34, 197, 94, 0.2)",
              borderRadius: "var(--radius-md)",
              textAlign: "center" 
            }}>
              <span style={{ display: "block", color: "var(--color-text-muted)", marginBottom: "0.5rem", fontSize: "0.9rem" }}>Conversion Result</span>
              <div style={{ fontSize: "1.5rem", fontWeight: "700", color: "var(--color-text-main)" }}>
                {amount} {fromCurrency} = <span style={{ color: "#22c55e", fontSize: "2rem" }}>{result} {toCurrency}</span>
              </div>
            </div>
          )}

        </div>
      </main>
      
      <Footer />
    </div>
  );
}
