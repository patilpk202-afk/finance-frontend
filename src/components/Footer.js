import { ExternalLink } from "lucide-react";
import { FaYoutube, FaInstagram, FaLinkedin } from "react-icons/fa";

export default function Footer() {
  
  const socialLinks = [
    {
      name: "YouTube",
      icon: <FaYoutube size={22} />,
      url: "https://youtube.com/@mrunknown-cp9rv?si=Yw116uadFpmt7lC6",
      color: "#ff0000" // Classic Youtube Red
    },
    {
      name: "Instagram",
      icon: <FaInstagram size={22} />,
      url: "https://www.instagram.com/pankaj2682002?igsh=MWRzdXd0azJlbjltMA==",
      color: "#E1306C" // Instagram Pink
    },
    {
      name: "LinkedIn",
      icon: <FaLinkedin size={22} />,
      url: "https://www.linkedin.com/in/pankaj-k-patil?utm_source=share_via&utm_content=profile&utm_medium=member_android",
      color: "#0a66c2" // Linkedin Blue
    }
  ];

  return (
    <footer style={{
      background: "var(--color-surface)",
      borderTop: "1px solid var(--color-border)",
      color: "var(--color-text-muted)",
      padding: "1.5rem",
      marginTop: "auto",
      textAlign: "center",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      gap: "1rem",
      backdropFilter: "blur(20px)",
      zIndex: 10
    }}>
      
      <div style={{ display: "flex", alignItems: "center", gap: "2rem", flexWrap: "wrap", justifyContent: "center" }}>
        {socialLinks.map((social, index) => (
          <a 
            key={index}
            href={social.url}
            target="_blank"
            rel="noopener noreferrer"
            className="hover-effect"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              textDecoration: "none",
              color: "var(--color-text-main)",
              fontWeight: "600",
              fontSize: "0.95rem",
              padding: "0.5rem 1rem",
              borderRadius: "var(--radius-md)",
              transition: "all 0.2s ease-in-out",
              border: "1px solid var(--color-border)",
              backgroundColor: "rgba(255, 255, 255, 0.03)"
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = social.color;
              e.currentTarget.style.borderColor = social.color;
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.boxShadow = "var(--shadow-sm)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = "var(--color-text-main)";
              e.currentTarget.style.borderColor = "var(--color-border)";
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "none";
            }}
          >
            {social.icon}
            {social.name}
            <ExternalLink size={14} style={{ opacity: 0.5, marginLeft: "0.25rem" }} />
          </a>
        ))}
      </div>
      
    </footer>
  );
}
