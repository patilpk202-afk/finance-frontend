"use client";

import { PlayCircle } from "lucide-react";

export default function VideoSection() {
  
  // Popular generic structural IDs representing the user requested categories
  const videos = [
    {
      id: "mLgcrostWkc",
      title: "Stock Market Basics - India",
      source: "Investing Basics"
    },
    {
      id: "t-scyf-Fur0",
      title: "Complete Guide to Indian Markets",
      source: "Finance Guide"
    },
    {
      id: "jpodHSU2TQM",
      title: "How to Invest in Stocks - Overview",
      source: "Market Updates"
    }
  ];

  return (
    <div style={{ marginTop: "3rem", padding: "0 1rem" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1.5rem" }}>
        <PlayCircle size={28} color="var(--color-primary)" />
        <h2 style={{ fontSize: "1.75rem", margin: 0, color: "var(--color-text-main)" }}>Finance Videos</h2>
      </div>
      
      <p style={{ color: "var(--color-text-muted)", marginBottom: "2rem" }}>Curated masterclasses explicitly covering the Indian equity constraints.</p>

      <div style={{ 
        display: "grid", 
        gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", 
        gap: "2rem" 
      }}>
        {videos.map((vid, idx) => (
          <div key={idx} className="card" style={{ padding: "1rem", overflow: "hidden", display: "flex", flexDirection: "column" }}>
            <div style={{ position: "relative", width: "100%", paddingTop: "56.25%", borderRadius: "var(--radius-md)", overflow: "hidden" }}>
              <iframe 
                src={`https://www.youtube.com/embed/${vid.id}?rel=0`}
                title={vid.title}
                frameBorder="0" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                allowFullScreen
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%"
                }}
              />
            </div>
            <div style={{ padding: "1rem 0.5rem 0 0.5rem" }}>
              <h3 style={{ fontSize: "1.1rem", margin: "0 0 0.5rem 0", color: "var(--color-text-main)", lineHeight: "1.4" }}>{vid.title}</h3>
              <p style={{ margin: 0, color: "var(--color-text-muted)", fontSize: "0.9rem" }}>{vid.source}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
