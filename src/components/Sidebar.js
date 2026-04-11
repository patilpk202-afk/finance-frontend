"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Menu, X, LayoutDashboard, Coins, CircleDollarSign, LogOut, TrendingUp, Newspaper } from "lucide-react";
import api from "../services/api";

export default function Sidebar() {
  const [open, setOpen] = useState(false);
  const sidebarRef = useRef(null);
  const router = useRouter();

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      // If the sidebar is open and the click is outside the sidebar entirely
      if (open && sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        // Also don't close if they clicked the hamburger button which isn't inside sidebarRef
        // (Wait, I'll put the hamburger button OUTSIDE the ref or strictly manage the overlay click)
      }
    };
    
    if (open) {
      document.body.style.overflow = "hidden"; // Prevent scrolling when open
    } else {
      document.body.style.overflow = "";
    }
    
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  const handleLogout = async () => {
    setOpen(false);
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    router.push("/login");
  };

  return (
    <>
      {/* Hamburger Button - Stays permanently on the layout */}
      <button 
        onClick={() => setOpen(true)}
        style={{
          background: "transparent",
          border: "none",
          color: "var(--color-text-main)",
          cursor: "pointer",
          padding: "0.5rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: "var(--radius-md)",
          transition: "background 0.2s"
        }}
        onMouseEnter={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.05)"}
        onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
      >
        <Menu size={28} />
      </button>

      {/* Overlay Backdrop */}
      {open && (
        <div 
          onClick={() => setOpen(false)}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100vh",
            background: "rgba(0, 0, 0, 0.5)",
            backdropFilter: "blur(4px)",
            zIndex: 999,
            animation: "fadeIn 0.3s ease-out forwards"
          }}
        />
      )}

      {/* Sliding Sidebar Panel */}
      <div 
        ref={sidebarRef}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "280px",
          height: "100vh",
          background: "var(--color-surface)",
          borderRight: "1px solid var(--color-border)",
          boxShadow: "var(--shadow-xl)",
          zIndex: 1000,
          transform: open ? "translateX(0)" : "translateX(-100%)",
          transition: "transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          display: "flex",
          flexDirection: "column"
        }}
      >
        {/* Sidebar Header */}
        <div style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "1.5rem",
          borderBottom: "1px solid var(--color-border)"
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <Image src="/logo.png" width={32} height={32} alt="PFM Logo" style={{ objectFit: "contain" }} />
            <h2 className="text-gradient" style={{ margin: 0, fontSize: "1.25rem", fontWeight: "800", letterSpacing: "-0.5px" }}>FinanceManager</h2>
          </div>
          <button 
            onClick={() => setOpen(false)}
            style={{
              background: "rgba(255,255,255,0.05)",
              border: "1px solid var(--color-border)",
              color: "var(--color-text-muted)",
              cursor: "pointer",
              padding: "0.4rem",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "all 0.2s"
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "rgba(255,255,255,0.1)";
              e.currentTarget.style.color = "var(--color-text-main)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "rgba(255,255,255,0.05)";
              e.currentTarget.style.color = "var(--color-text-muted)";
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation Links */}
        <nav style={{ padding: "1.5rem 1rem", flex: 1, display: "flex", flexDirection: "column", gap: "0.5rem" }}>
          <SidebarLink href="/dashboard" icon={<LayoutDashboard size={20} />} text="Dashboard" onClick={() => setOpen(false)} />
          <SidebarLink href="/stocks" icon={<TrendingUp size={20} />} text="Indian Stocks" onClick={() => setOpen(false)} />
          <SidebarLink href="/news" icon={<Newspaper size={20} />} text="Financial News" onClick={() => setOpen(false)} />
          <SidebarLink href="/converter" icon={<CircleDollarSign size={20} />} text="Currency Converter" onClick={() => setOpen(false)} />
          <SidebarLink href="/rates" icon={<Coins size={20} />} text="Gold & Silver Rates" onClick={() => setOpen(false)} />
        </nav>

        {/* Footer Area */}
        <div style={{ padding: "1.5rem 1rem", borderTop: "1px solid var(--color-border)" }}>
          <button 
            onClick={handleLogout}
            style={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              gap: "1rem",
              padding: "0.875rem 1rem",
              background: "rgba(244, 63, 94, 0.05)",
              border: "1px solid rgba(244, 63, 94, 0.1)",
              borderRadius: "var(--radius-md)",
              color: "var(--color-danger)",
              fontSize: "1rem",
              fontWeight: "600",
              cursor: "pointer",
              transition: "all 0.2s"
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = "rgba(244, 63, 94, 0.15)"}
            onMouseLeave={(e) => e.currentTarget.style.background = "rgba(244, 63, 94, 0.05)"}
          >
            <LogOut size={20} /> Logout
          </button>
        </div>
      </div>
    </>
  );
}

// Internal standard link helper component
function SidebarLink({ href, icon, text, onClick }) {
  return (
    <Link 
      href={href} 
      onClick={onClick}
      style={{
        display: "flex",
        alignItems: "center",
        gap: "1rem",
        padding: "0.875rem 1rem",
        borderRadius: "var(--radius-md)",
        color: "var(--color-text-main)",
        textDecoration: "none",
        fontWeight: "500",
        transition: "all 0.2s",
        border: "1px solid transparent"
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = "rgba(255,255,255,0.03)";
        e.currentTarget.style.borderColor = "var(--color-border)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = "transparent";
        e.currentTarget.style.borderColor = "transparent";
      }}
    >
      <div style={{ color: "var(--color-primary)" }}>{icon}</div>
      {text}
    </Link>
  );
}
