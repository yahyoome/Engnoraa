import "../styles/404.css";
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="notfound-wrapper">
      <div className="notfound-card">
        <h1 className="notfound-title">4004</h1>
        <p className="notfound-subtitle">Oops! Sahifa topilmadi.</p>
        <Link to="/" className="notfound-btn">Bosh sahifaga qaytish</Link>
      </div>
    </div>
  );
};

export default NotFound;
