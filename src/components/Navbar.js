"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { RefreshCw, Moon, Sun } from "lucide-react";

import Sidebar from "./Sidebar";
import ProfileMenu from "./ProfileMenu";

export default function Navbar() {
  const pathname = usePathname();
  const [theme, setTheme] = useState("light");
  const [refreshing, setRefreshing] = useState(false);
  
  // Scroll mapping logic
  const [showNavbar, setShowNavbar] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    // Sync active theme safely onto Next DOM renders natively
    const currentTheme = document.documentElement.getAttribute("data-theme") || 
                        (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
    setTheme(currentTheme);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > lastScrollY && window.scrollY > 80) {
        setShowNavbar(false); // scrolling down past initial view
      } else {
        setShowNavbar(true); // scrolling up
      }
      setLastScrollY(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

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

  const fireGlobalRefresh = () => {
    setRefreshing(true);
    window.dispatchEvent(new Event("globalRefresh"));
    // Add brief artificial loading state explicitly mapping UX parameters universally
    setTimeout(() => setRefreshing(false), 800);
  };

  // ❌ Supress Global Layouts covering Auth / Forgot Password bounds seamlessly!
  if (pathname === "/login" || pathname === "/forgot-password") {
    return null;
  }

  return (
    <header style={{ 
      background: lastScrollY > 10 ? "var(--color-surface)" : "transparent", 
      backdropFilter: "blur(20px)",
      WebkitBackdropFilter: "blur(20px)",
      borderBottom: lastScrollY > 10 ? "1px solid var(--color-border)" : "1px solid transparent", 
      padding: "1rem 0", 
      position: "fixed", 
      top: 0,
      left: 0,
      width: "100%",
      zIndex: 50,
      boxShadow: lastScrollY > 10 ? "var(--shadow-sm)" : "none",
      transform: showNavbar ? "translateY(0)" : "translateY(-100%)",
      transition: "transform 0.3s ease-in-out, background 0.2s ease-in-out, box-shadow 0.2s ease-in-out"
    }}>
      <div className="container" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", margin: "0 auto", padding: "0 1rem" }}>
        
        {/* Left Side Mapping - Sidebar and System Brands */}
        <div style={{ display: "flex", alignItems: "center", gap: "1rem", position: "relative", zIndex: 1100 }}>
          <Sidebar />
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }} className="mobile-hidden">
            <Image src="/logo.png" alt="Logo" width={32} height={32} style={{ objectFit: "contain" }} />
            <span style={{ fontWeight: "700", fontSize: "1.1rem", letterSpacing: "-0.5px", color: "var(--color-text-main)" }}>FinanceManager</span>
          </div>
          <div style={{ display: "none" }} className="mobile-hidden"></div>
        </div>
        
        {/* Right Side Settings and User Avatars */}
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <button 
            onClick={toggleTheme}
            style={{ color: "var(--color-text-main)", display: "flex", alignItems: "center", padding: "0.5rem", borderRadius: "var(--radius-full)", transition: "all 0.2s", background: "transparent", border: "none", cursor: "pointer" }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.05)'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
          >
            {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          
          <button 
            onClick={fireGlobalRefresh}
            style={{ color: "var(--color-text-main)", display: "flex", alignItems: "center", gap: "0.25rem", padding: "0.5rem", borderRadius: "var(--radius-full)", transition: "all 0.2s", background: "transparent", border: "none", cursor: "pointer" }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.05)'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
          >
            <RefreshCw size={20} className={refreshing ? "animate-spin" : ""} />
          </button>
          
          <div style={{ height: "24px", width: "1px", background: "var(--color-border)", margin: "0 0.5rem" }}></div>
          <ProfileMenu />
        </div>

      </div>
    </header>
  );
}
