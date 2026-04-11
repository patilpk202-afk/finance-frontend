"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { LogOut, Trash2, User, ChevronDown } from "lucide-react";
import api from "../services/api";

export default function ProfileMenu() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [profileImage, setProfileImage] = useState("");
  const dropdownRef = useRef(null);

  const fetchProfileData = async () => {
    try {
      const res = await api.get("/user/profile");
      if (res.data.profileImage) {
        setProfileImage(res.data.profileImage);
      }
      if (res.data.name) setName(res.data.name);
      if (res.data.email) setEmail(res.data.email);
    } catch (e) {
      console.warn("Failed to natively extract profile configurations");
    }
  };

  useEffect(() => {
    // Extract user email natively from JWT token
    try {
      const token = localStorage.getItem("token");
      if (token && token.includes(".")) {
        const base64Url = token.split(".")[1];
        const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
        const jsonPayload = decodeURIComponent(
          atob(base64)
            .split("")
            .map(function (c) {
              return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
            })
            .join("")
        );
        const parsed = JSON.parse(jsonPayload);
        if (parsed.sub) {
          setEmail(parsed.sub);
        }
        if (parsed.name) {
          setName(parsed.name);
        }
      }
    } catch (e) {
      console.warn("Failed to decode token", e);
    }

    fetchProfileData();
    window.addEventListener("profileImageUpdated", fetchProfileData);
    
    // Close dropdown on outside click
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("profileImageUpdated", fetchProfileData);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    router.push("/login");
  };

  const handleDeleteAccount = async () => {
    const confirmed = window.confirm("Are you sure? This will delete all your data permanently. This action cannot be undone.");
    if (!confirmed) return;
    
    try {
      await api.delete("/auth/delete-account");
      localStorage.removeItem("token");
      localStorage.removeItem("userId");
      router.push("/login");
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete account. Try again later.");
    }
  };

  const initials = name ? name.substring(0, 2).toUpperCase() : (email ? email.substring(0, 2).toUpperCase() : "U");

  return (
    <div style={{ position: "relative" }} ref={dropdownRef}>
      
      {/* Profile Toggle Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "0.75rem",
          padding: "0.5rem 0.75rem 0.5rem 0.5rem",
          background: "rgba(255, 255, 255, 0.05)",
          border: "1px solid var(--color-border)",
          borderRadius: "var(--radius-full)",
          transition: "all 0.2s",
          cursor: "pointer"
        }}
        onMouseEnter={(e) => e.currentTarget.style.background = "rgba(255, 255, 255, 0.1)"}
        onMouseLeave={(e) => e.currentTarget.style.background = "rgba(255, 255, 255, 0.05)"}
      >
        <div style={{
          width: "36px",
          height: "36px",
          borderRadius: "50%",
          background: "linear-gradient(135deg, var(--color-primary) 0%, var(--color-secondary) 100%)",
          color: "white",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontWeight: "700",
          fontSize: "0.95rem",
          letterSpacing: "1px",
          overflow: "hidden"
        }}>
          {profileImage ? (
            <img src={profileImage} alt="Avatar" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          ) : (
            initials
          )}
        </div>
        
        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", marginRight: "0.25rem", textAlign: "left" }}>
          <span style={{ fontSize: "0.85rem", color: "var(--color-text-main)", fontWeight: "600", maxWidth: "120px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {name || "User Profile"}
          </span>
          <span style={{ fontSize: "0.7rem", color: "var(--color-text-muted)", fontWeight: "500", maxWidth: "120px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {email || "Loading..."}
          </span>
        </div>
        
        <ChevronDown size={16} color="var(--color-text-muted)" style={{ transform: isOpen ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s" }} />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div style={{
          position: "absolute",
          top: "calc(100% + 0.5rem)",
          right: 0,
          width: "220px",
          background: "var(--color-surface)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          border: "1px solid var(--color-border)",
          borderRadius: "var(--radius-md)",
          boxShadow: "var(--shadow-lg)",
          padding: "0.5rem",
          zIndex: 50,
          animation: "fadeInUp 0.2s ease-out forwards"
        }}>
          
          <button 
            onClick={() => { setIsOpen(false); router.push("/profile"); }}
            style={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              gap: "0.75rem",
              padding: "0.6rem 0.75rem",
              borderRadius: "var(--radius-sm)",
              color: "var(--color-text-main)",
              transition: "all 0.15s",
              fontSize: "0.9rem",
              fontWeight: "500",
              border: "none",
              background: "transparent",
              cursor: "pointer"
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "var(--color-background)";
              e.currentTarget.style.color = "var(--color-primary)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "transparent";
              e.currentTarget.style.color = "var(--color-text-main)";
            }}
          >
            <User size={16} /> My Settings
          </button>
          
          <button 
            onClick={handleLogout}
            style={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              gap: "0.75rem",
              padding: "0.6rem 0.75rem",
              borderRadius: "var(--radius-sm)",
              color: "var(--color-text-main)",
              transition: "all 0.15s",
              fontSize: "0.9rem",
              fontWeight: "500"
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "var(--color-background)";
              e.currentTarget.style.color = "var(--color-primary)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "transparent";
              e.currentTarget.style.color = "var(--color-text-main)";
            }}
          >
            <LogOut size={16} /> Logout
          </button>

          <div style={{ height: "1px", background: "var(--color-border)", margin: "0.5rem 0" }}></div>

          <button 
            onClick={handleDeleteAccount}
            style={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              gap: "0.75rem",
              padding: "0.6rem 0.75rem",
              borderRadius: "var(--radius-sm)",
              color: "var(--color-danger)",
              transition: "all 0.15s",
              fontSize: "0.9rem",
              fontWeight: "500",
              background: "rgba(244, 63, 94, 0.05)"
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = "rgba(244, 63, 94, 0.15)"}
            onMouseLeave={(e) => e.currentTarget.style.background = "rgba(244, 63, 94, 0.05)"}
          >
            <Trash2 size={16} /> Delete Account
          </button>
        </div>
      )}
    </div>
  );
}
