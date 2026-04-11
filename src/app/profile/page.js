"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { ArrowLeft, User, Upload, CheckCircle, Loader2, AlertCircle } from "lucide-react";
import api from "../../services/api";
import Link from "next/link";
export default function ProfilePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState({ name: "", email: "", profileImage: "" });
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get("/user/profile");
        setProfile(res.data);
        if (res.data.profileImage) {
          setPreview(res.data.profileImage);
        }
      } catch (err) {
        if (err.response?.status === 401) {
          router.push("/login");
        }
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [router]);

  const handleFileChange = (e) => {
    setError("");
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        setError("File must be smaller than 2MB");
        return;
      }
      setSelectedFile(file);
      const objectUrl = URL.createObjectURL(file);
      setPreview(objectUrl);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;
    setSaving(true);
    setError("");
    setSuccess("");

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      const res = await api.post("/user/upload-profile-pic", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      setSuccess("Profile Picture updated successfully!");
      setProfile((prev) => ({ ...prev, profileImage: res.data.profileImage }));
      // Dispatch a custom event to notify Sidebar/ProfileMenu to refresh!
      window.dispatchEvent(new Event("profileImageUpdated"));
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to upload image securely.");
    } finally {
      setSaving(false);
    }
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

      <main className="container animate-fade-in" style={{ padding: "2rem 1rem", flex: 1 }}>
        <div style={{ marginBottom: "2rem" }}>
          <Link href="/dashboard" style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", color: "var(--color-text-muted)", textDecoration: "none", fontWeight: "500", fontSize: "0.9rem" }}>
            <ArrowLeft size={16} /> Back to Dashboard
          </Link>
          <h1 style={{ marginTop: "1rem", fontSize: "2rem", fontWeight: "700", color: "var(--color-text-main)" }}>My Profile</h1>
          <p style={{ color: "var(--color-text-muted)" }}>Manage your account settings and preferences.</p>
        </div>

        <div className="card" style={{ maxWidth: "600px" }}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "1.5rem" }}>
            
            {/* Avatar Group */}
            <div style={{ position: "relative", width: "120px", height: "120px", borderRadius: "50%", background: "var(--color-background)", border: "2px dashed var(--color-border)", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
              {preview ? (
                <img src={preview} alt="Profile" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              ) : (
                <User size={48} color="var(--color-text-muted)" />
              )}

              {/* Hover overlay explicitly triggering upload implicitly */}
              <label 
                style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.5)", color: "white", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", opacity: 0, cursor: "pointer", transition: "opacity 0.2s" }}
                onMouseEnter={(e) => e.currentTarget.style.opacity = 1}
                onMouseLeave={(e) => e.currentTarget.style.opacity = 0}
              >
                <Upload size={24} style={{ marginBottom: "0.25rem" }} />
                <span style={{ fontSize: "0.75rem", fontWeight: "600" }}>Change</span>
                <input type="file" accept="image/png, image/jpeg" style={{ display: "none" }} onChange={handleFileChange} />
              </label>
            </div>

            <div style={{ textAlign: "center", width: "100%" }}>
              <h2 style={{ fontSize: "1.25rem", fontWeight: "600", margin: "0 0 0.25rem 0", color: "var(--color-text-main)" }}>{profile.name || "User Name"}</h2>
              <p style={{ margin: 0, color: "var(--color-text-muted)", fontSize: "0.9rem" }}>{profile.email}</p>
            </div>

            <div style={{ width: "100%" }}>
              {error && (
                <div className="animate-fade-in" style={{ display: "flex", alignItems: "center", gap: "0.5rem", padding: "0.75rem", backgroundColor: "rgba(239, 68, 68, 0.1)", color: "var(--color-danger)", borderRadius: "var(--radius-md)", marginBottom: "1rem" }}>
                  <AlertCircle size={16} />
                  <span style={{ fontSize: "0.85rem" }}>{error}</span>
                </div>
              )}
              {success && (
                <div className="animate-fade-in" style={{ display: "flex", alignItems: "center", gap: "0.5rem", padding: "0.75rem", backgroundColor: "rgba(34, 197, 94, 0.1)", color: "var(--color-success)", borderRadius: "var(--radius-md)", marginBottom: "1rem" }}>
                  <CheckCircle size={16} />
                  <span style={{ fontSize: "0.85rem" }}>{success}</span>
                </div>
              )}

              <button 
                className="btn-primary" 
                onClick={handleUpload} 
                disabled={!selectedFile || saving}
                style={{ width: "100%", opacity: (!selectedFile || saving) ? 0.5 : 1, transition: "opacity 0.2s" }}
              >
                {saving ? (
                  <><Loader2 className="animate-spin" size={18} /> Uploading Sync Blob...</>
                ) : (
                  <><Upload size={18} /> Save New Avatar</>
                )}
              </button>
            </div>
            
          </div>
        </div>
      </main>
    </div>
  );
}
