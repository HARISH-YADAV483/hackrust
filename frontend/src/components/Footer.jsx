const Footer = () => {
  return (
    <footer style={{
      textAlign: "center",
      padding: "1.25rem",
      color: "#94a3b8",
      fontSize: "0.85rem",
      borderTop: "1px solid rgba(255,255,255,0.08)",
      background: "rgba(15, 23, 42, 0.6)",
      backdropFilter: "blur(10px)",
    }}>
      Developed with Passion by{" "}
      <strong style={{ color: "#ef4444" }}>Harish</strong> &amp;{" "}
      <strong style={{ color: "#ef4444" }}>Raman</strong>{" "}
      <span style={{ color: "#64748b" }}>(Adhyetarah)</span>
    </footer>
  );
};

export default Footer;
