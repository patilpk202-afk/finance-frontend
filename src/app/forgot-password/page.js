"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { KeyRound, Mail, CheckCircle, Loader2, AlertCircle, ArrowLeft } from "lucide-react";
import api from "../../services/api";
import Link from "next/link";

export default function ForgotPasswordPage() {
  const router = useRouter();
  
  const [step, setStep] = useState(1); // 1: Email, 2: OTP, 3: New Password
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await api.post("/auth/send-otp", { email });
      setSuccess("OTP sent successfully to your email!");
      setTimeout(() => setSuccess(""), 4000);
      setStep(2);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to send OTP. Check if email exists.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await api.post("/auth/verify-otp", { email, otp });
      setSuccess("OTP Verified!");
      setTimeout(() => setSuccess(""), 2000);
      setStep(3);
    } catch (err) {
      setError(err.response?.data?.message || "Invalid or expired OTP.");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await api.post("/auth/reset-password", { email, newPassword });
      setSuccess("Password Reset Successfully!");
      setTimeout(() => {
        router.push("/login");
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to reset password. Try requesting a new OTP.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem" }}>
      <div className="card animate-fade-in" style={{ width: "100%", maxWidth: "400px" }}>
        
        <div style={{ position: "relative", textAlign: "center", marginBottom: "2rem" }}>
          
          {step === 1 && (
            <Link href="/login" style={{ position: "absolute", left: 0, top: 0, color: "var(--color-text-muted)", display: "flex", alignItems: "center", gap: "0.25rem", textDecoration: "none", fontSize: "0.85rem" }}>
              <ArrowLeft size={16} /> Back
            </Link>
          )}

          <div style={{ display: "inline-flex", padding: "1rem", backgroundColor: "rgba(79, 70, 229, 0.1)", borderRadius: "var(--radius-full)", marginBottom: "1rem" }}>
             {step === 1 && <Mail size={32} color="var(--color-primary)" />}
             {step === 2 && <CheckCircle size={32} color="var(--color-primary)" />}
             {step === 3 && <KeyRound size={32} color="var(--color-primary)" />}
          </div>
          <h1 style={{ fontSize: "1.5rem", fontWeight: "600", color: "var(--color-text-main)" }}>
            {step === 1 && "Forgot Password"}
            {step === 2 && "Enter OTP"}
            {step === 3 && "Secure Account"}
          </h1>
          <p style={{ color: "var(--color-text-muted)", marginTop: "0.5rem", fontSize: "0.9rem" }}>
            {step === 1 && "Enter your email to receive a recovery code."}
            {step === 2 && "Enter the 6-digit code sent to your email."}
            {step === 3 && "Create a new strong cryptographic password."}
          </p>
        </div>

        {error && (
          <div className="animate-fade-in" style={{ display: "flex", alignItems: "center", gap: "0.5rem", padding: "1rem", backgroundColor: "rgba(239, 68, 68, 0.1)", color: "var(--color-danger)", borderRadius: "var(--radius-md)", marginBottom: "1.5rem" }}>
            <AlertCircle size={20} />
            <span style={{ fontSize: "0.875rem" }}>{error}</span>
          </div>
        )}

        {success && (
          <div className="animate-fade-in" style={{ display: "flex", alignItems: "center", gap: "0.5rem", padding: "1rem", backgroundColor: "rgba(34, 197, 94, 0.1)", color: "var(--color-success)", borderRadius: "var(--radius-md)", marginBottom: "1.5rem" }}>
            <CheckCircle size={20} />
            <span style={{ fontSize: "0.875rem" }}>{success}</span>
          </div>
        )}

        {/* STEP 1 */}
        {step === 1 && (
          <form onSubmit={handleSendOtp}>
            <div className="form-group">
              <label className="form-label" htmlFor="email">Registered Email</label>
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
            <button type="submit" className="btn-primary" style={{ width: "100%", marginTop: "1rem" }} disabled={loading}>
              {loading ? <Loader2 className="animate-spin" size={20} /> : "Request Secure OTP"}
            </button>
          </form>
        )}

        {/* STEP 2 */}
        {step === 2 && (
          <form onSubmit={handleVerifyOtp}>
            <div className="form-group">
              <label className="form-label" htmlFor="otp">6-Digit Code</label>
              <input
                id="otp"
                type="text"
                className="input-field"
                placeholder="123456"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
                maxLength={6}
                style={{ letterSpacing: "4px", textAlign: "center", fontSize: "1.25rem" }}
              />
            </div>
            <button type="submit" className="btn-primary" style={{ width: "100%", marginTop: "1rem" }} disabled={loading}>
              {loading ? <Loader2 className="animate-spin" size={20} /> : "Verify Identity"}
            </button>
            <div style={{ textAlign: "center", marginTop: "1.5rem" }}>
               <button type="button" onClick={() => setStep(1)} style={{ color: "var(--color-primary)", fontSize: "0.85rem", fontWeight: "500" }}>Use a different email address</button>
            </div>
          </form>
        )}

        {/* STEP 3 */}
        {step === 3 && (
          <form onSubmit={handleResetPassword}>
            <div className="form-group">
              <label className="form-label" htmlFor="newPassword">New Password</label>
              <input
                id="newPassword"
                type="password"
                className="input-field"
                placeholder="••••••••"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                minLength={6}
              />
            </div>
            <button type="submit" className="btn-primary" style={{ width: "100%", marginTop: "1rem" }} disabled={loading}>
              {loading ? <Loader2 className="animate-spin" size={20} /> : "Lock New Password"}
            </button>
          </form>
        )}

      </div>
    </div>
  );
}
