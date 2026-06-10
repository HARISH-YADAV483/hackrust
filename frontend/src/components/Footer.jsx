const Footer = () => {
  return (
    <footer style={{
      textAlign: "center",
      padding: "1.25rem",
      color: "#b0b0b0",
      fontSize: "0.85rem",
      borderTop: "1px solid rgba(242, 236, 236, 0.15)",
      background: "rgba(8, 2, 2, 0.5)",
      backdropFilter: "blur(10px)",
    }}>
      Developed with Passion by{" "}
      <strong style={{ color: "#ff6b6b" }}>Harish</strong> &amp;{" "}
      <strong style={{ color: "#ff6b6b" }}>Komal</strong>{" "}
      <span style={{ color: "#6b6b6b" }}>(Adhyetarah)</span>
    </footer>
  );
};

export default Footer;

