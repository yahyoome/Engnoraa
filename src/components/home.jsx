import '../styles/home.css';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className='home-container'>
      <div className="home-card">
        <div className="home-card1">
          <h1 className='home-welcome'>Engnoraa English</h1>
          <div className="rooms-ul">
            <Link to="/irregular-verbs">Irregular Verbs</Link>
            <Link to="/random-game">Random Game</Link>
            <Link to="/prepare">404</Link>
            <Link to="/prepare">404</Link>
            <Link to="/prepare">404</Link>
          </div>
          <h3 className="working">Currently Building...</h3>
          <div className="room-length">
            <div className="round"></div>
            <h3>2 active rooms</h3>
          </div>
        </div>
        <div className="home-card2"></div>
      </div>
    </div>
  )
}

export default Home;
