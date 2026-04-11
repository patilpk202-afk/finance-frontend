"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { LogIn, UserPlus, AlertCircle, Loader2 } from "lucide-react";
import api from "../../services/api";

export default function LoginPage() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!isLogin) {
      // Physical UI Registration Pre-validation bounds
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        setError("Please enter a valid email address format");
        return;
      }
      if (password.length < 6) {
        setError("Your password must be strictly at least 6 characters physically");
        return;
      }
    }

    setLoading(true);

    try {
      const endpoint = isLogin ? "/auth/login" : "/auth/register";
      const payload = isLogin ? { email, password } : { name, email, password };
      const response = await api.post(endpoint, payload);
      
      if (isLogin) {
        // Assume API returns { token, userId } or token in headers, adjust based on actual backend
        // Standard JWT backend returns token in response.data
        const data = response.data;
        if (data && data.token) {
          localStorage.setItem("token", data.token);
          if (data.userId || data.id) {
            localStorage.setItem("userId", data.userId || data.id);
          }
          router.push("/dashboard");
        } else {
          // If the backend returns it directly as a string or different format
          if (typeof data === "string") {
            localStorage.setItem("token", data);
            router.push("/dashboard");
          } else {
            setError("Login successful but no token received.");
          }
        }
      } else {
        // Registration successful
        setIsLogin(true);
        setError("");
        alert("Registration successful. Please login.");
      }
    } catch (err) {
      let serverError = err.response?.data?.message || err.response?.data || "An error occurred";
      if (typeof serverError === "object") {
        serverError = Object.values(serverError).join(", ");
      }
      setError(serverError);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem" }}>
      <div className="card animate-fade-in" style={{ width: "100%", maxWidth: "400px" }}>
        
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginBottom: "1rem" }}>
            <Image 
              src="/logo.png" 
              alt="Finance Manager Logo" 
              width={64} 
              height={64} 
              style={{ objectFit: "contain", borderRadius: "var(--radius-lg)" }}
            />
          </div>

          <h1 style={{ fontSize: "1.5rem", fontWeight: "600", color: "var(--color-text-main)" }}>
            {isLogin ? "Welcome Back" : "Create an Account"}
          </h1>
          <p style={{ color: "var(--color-text-muted)", marginTop: "0.5rem" }}>
            {isLogin ? "Enter your credentials to access your account." : "Fill in your details to get started."}
          </p>
        </div>

        {error && (
          <div key={error} className="animate-shake" style={{ display: "flex", alignItems: "center", gap: "0.5rem", padding: "1rem", backgroundColor: "rgba(239, 68, 68, 0.1)", color: "var(--color-danger)", borderRadius: "var(--radius-md)", marginBottom: "1.5rem" }}>
            <AlertCircle size={20} />
            <span style={{ fontSize: "0.875rem" }}>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <div className="form-group">
              <label className="form-label" htmlFor="name">Name</label>
              <input
                id="name"
                type="text"
                className="input-field"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required={!isLogin}
              />
            </div>
          )}
          
          <div className="form-group">
            <label className="form-label" htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              className="input-field"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          
          <div className="form-group">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "0.5rem" }}>
              <label className="form-label" htmlFor="password" style={{ marginBottom: 0 }}>Password</label>
              {isLogin && (
                <a 
                  href="/forgot-password" 
                  style={{ color: "var(--color-primary)", fontSize: "0.80rem", textDecoration: "none", fontWeight: "500" }}
                >
                  Forgot Password?
                </a>
              )}
            </div>
            <input
              id="password"
              type="password"
              className="input-field"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn-primary" style={{ width: "100%", marginTop: "1rem" }} disabled={loading}>
            {loading ? <Loader2 className="animate-spin" size={20} /> : (isLogin ? "Sign In" : "Sign Up")}
          </button>
        </form>

        <div style={{ marginTop: "1.5rem", textAlign: "center" }}>
          <button 
            type="button"
            onClick={() => { setIsLogin(!isLogin); setError(""); }}
            style={{ color: "var(--color-primary)", fontWeight: "500", fontSize: "0.875rem" }}
          >
            {isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
          </button>
        </div>

      </div>
    </div>
  );
}