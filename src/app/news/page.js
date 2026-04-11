"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Radio } from "lucide-react";

import NewsList from "../../components/NewsList";
import VideoSection from "../../components/VideoSection";
import Footer from "../../components/Footer";

export default function FinancialNews() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Standard dashboard authentication requirement bounds
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }
    setLoading(false);
  }, [router]);

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Loader2 className="animate-spin" size={48} color="var(--color-primary)" />
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "var(--color-background)", display: "flex", flexDirection: "column" }}>

      <main className="container animate-fade-in" style={{ padding: "3rem 1rem", maxWidth: "1200px", margin: "0 auto" }}>
        
        {/* Core Media Layout Title bounds */}
        <div style={{ marginBottom: "2.5rem" }}>
          <h2 style={{ fontSize: "2rem", margin: 0, color: "var(--color-text-main)", display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <Radio color="var(--color-primary)" /> Global Business Desk
          </h2>
          <p style={{ color: "var(--color-text-muted)", marginTop: "0.5rem", fontSize: "1.1rem" }}>Breaking coverage and market-shaping alerts updating continuously across Indian networks.</p>
        </div>

        {/* Global News Render Container */}
        <NewsList />

        <hr style={{ border: 0, borderBottom: "1px solid var(--color-border)", margin: "4rem 0" }} />

        {/* Media Block Embeds */}
        <VideoSection />

      </main>
      
      <Footer />
    </div>
  );
}
