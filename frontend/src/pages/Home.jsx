import { Link } from "react-router-dom";
import "./Home.css";

const Home = () => {
  const cards = [
    {
      title: "Report & Analyze",
      description: "Submit a potential scam for deep AI analysis and security checks.",
      link: "/report",
      icon: "📢",
      color: "linear-gradient(135deg, #dc2626, #7f1d1d)",
    },
    {
      title: "Search Scams",
      description: "Search our database of verified scams to stay protected.",
      link: "/search",
      icon: "🔍",
      color: "linear-gradient(135deg, #dc2626, #7f1d1d)",
    },
    {
      title: "Phishing Simulator",
      description: "Test your skills and learn how to identify phishing attempts.",
      link: "/simulator",
      icon: "🎯",
      color: "linear-gradient(135deg, #dc2626, #7f1d1d)",
    },
    {
      title: "Hall of Heroes",
      description: "See how you rank against the community in our security leaderboard.",
      link: "/leaderboard",
      icon: "🏆",
      color: "linear-gradient(135deg, #dc2626, #7f1d1d)",
    },
    {
      title: "Blogs",
      description: "Read and share security insights from the community.",
      link: "/blogs",
      icon: "✍️",
      color: "linear-gradient(135deg, #dc2626, #7f1d1d)",
    },
    {
      title: "Security Tools",
      description: "Check password strength and generate memorable strong passwords.",
      link: "/tools",
      icon: "🔐",
      color: "linear-gradient(135deg, #dc2626, #7f1d1d)",
    },
  ];

  return (
    <div className="home-container">
      <header className="home-hero">
        <img src="/log2o.png" alt="ScamShield" className="home-logo" />
        <p>Your ultimate protection against digital scams, powered by AI.</p>
      </header>

      <div className="card-grid">
        {cards.map((card, index) => (
          <Link to={card.link} key={index} className="feature-card">
            <div className="card-icon" style={{ background: card.color }}>
              {card.icon}
            </div>
            <div className="card-content">
              <h3>{card.title}</h3>
              <p>{card.description}</p>
              <div className="explore-button">
                <span>Explore More</span>
                <span className="arrow">→</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Home;
