import "../styles/404.css";

const NotFound = () => {
  return (
    <div className="notfound-wrapper">
      <div className="notfound-card">
        <h1 className="notfound-title">404</h1>
        <p className="notfound-subtitle">Oops! Sahifa topilmadi.</p>
        <a href="/" className="notfound-btn">Bosh sahifaga qaytish</a>
      </div>
    </div>
  );
};

export default NotFound;
