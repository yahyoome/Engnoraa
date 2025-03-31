import { Link } from "react-router-dom";
import "../styles/home.css";

const Home = () => {
  return (
    <div className="home-container">
      <header className="home-logo">english.<span>go</span></header>
      <div className="cards-container">
        <Link to="/irregular-verbs" className="home-card">
          <span className="emoji">📖</span>
          <h3>Irregular Verbs</h3>
        </Link>
      </div>
    </div>
  );
};

export default Home;
