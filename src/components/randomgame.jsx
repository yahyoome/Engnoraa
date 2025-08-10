import React, { useState, useEffect, useRef } from 'react';
import '../styles/randomgame.css';
import spinDB from '../jsonFiles/spinDB.json';
import irregularVerbs from '../jsonFiles/irregularVerbs.json';
import { Link, useNavigate } from 'react-router-dom';
import { IoPerson } from "react-icons/io5";
import { FaRegTrashAlt } from "react-icons/fa";

const words = irregularVerbs.map(verb => verb.infinitive);
const tenses = spinDB.tenses;
const allPairs = [];
words.forEach(word => {
  tenses.forEach(tense => {
    allPairs.push({ word, tense });
  });
});

const shuffleArray = (array) => {
  const copy = [...array];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
};

export default function RandomGame() {
  const [rotateDegree, setRotateDegree] = useState(0);
  const [spinning, setSpinning] = useState(false);
  const [currentPair, setCurrentPair] = useState(null);
  const [usedPairs, setUsedPairs] = useState([]);
  const [players, setPlayers] = useState([]);
  const [newPlayer, setNewPlayer] = useState('');
  const [currentPlayer, setCurrentPlayer] = useState(null);
  const [showAddPlayerModal, setShowAddPlayerModal] = useState(false);
  const [showAnswerModal, setShowAnswerModal] = useState(false);
  const [showWinnerModal, setShowWinnerModal] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);
  const [questionLimit, setQuestionLimit] = useState(null);
  const [questionCount, setQuestionCount] = useState(0);
  const [showQuestionLimitModal, setShowQuestionLimitModal] = useState(true);
  const [playerQueue, setPlayerQueue] = useState([]);
  const timerRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "Engnoraa | Random Game";    
  }, []);

  useEffect(() => {
    const savedPlayers = JSON.parse(localStorage.getItem('spinGamePlayers'));
    if (savedPlayers && Array.isArray(savedPlayers)) {
      setPlayers(savedPlayers);
    }
  }, []);

  const updateLocalStorage = (updatedPlayers) => {
    localStorage.setItem('spinGamePlayers', JSON.stringify(updatedPlayers));
  };

  const handleAddPlayer = () => {
    const trimmed = newPlayer.trim();
    if (trimmed !== '' && !players.some(p => p.name === trimmed)) {
      const updated = [...players, { name: trimmed, xp: 0, responseTimes: [] }];
      setPlayers(updated);
      updateLocalStorage(updated);
      setNewPlayer('');
      setShowAddPlayerModal(false);
    }
  };

  const handleDeletePlayer = (name) => {
    const updated = players.filter(player => player.name !== name);
    setPlayers(updated);
    updateLocalStorage(updated);
    if (currentPlayer && currentPlayer.name === name) {
      setCurrentPlayer(null);
    }
  };

  const spinWheel = () => {
    if (spinning || players.length === 0 || questionCount >= questionLimit) return;

    if (usedPairs.length === allPairs.length) {
      alert("Savollar tugadi!");
      return;
    }

    let queue = playerQueue;
    if (queue.length === 0) {
      queue = shuffleArray(players);
    }

    const nextPlayer = queue[0];
    const remainingQueue = queue.slice(1);

    setPlayerQueue(remainingQueue);
    setSpinning(true);
    const extraSpin = 360 * (3 + Math.floor(Math.random() * 3));
    const randomDegree = Math.floor(Math.random() * 360);
    const finalDegree = rotateDegree + extraSpin + randomDegree;
    setRotateDegree(finalDegree);

    setTimeout(() => {
      const unusedPairs = allPairs.filter(
        pair => !usedPairs.some(used => used.word === pair.word && used.tense === pair.tense)
      );
      const randomPair = unusedPairs[Math.floor(Math.random() * unusedPairs.length)];

      setCurrentPair(randomPair);
      setCurrentPlayer(nextPlayer);
      setUsedPairs(prev => [...prev, randomPair]);
      setTimeLeft(60);
      setShowAnswerModal(true);
      setSpinning(false);
    }, 2500);
  };

  useEffect(() => {
    if (!showAnswerModal) {
      clearInterval(timerRef.current);
      return;
    }

    if (timeLeft <= 0) {
      clearInterval(timerRef.current);
      handleAnswer(true);
      return;
    }

    timerRef.current = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);

    return () => clearInterval(timerRef.current);
  }, [timeLeft, showAnswerModal]);

  const handleAnswer = (penalize = false) => {
    const answeredIn = 60 - timeLeft;
    const updated = players.map(player => {
      if (player.name === currentPlayer.name) {
        const xpChange = penalize ? -5 : 10;
        const responseTimes = player.responseTimes || [];
        return {
          ...player,
          xp: player.xp + xpChange,
          responseTimes: penalize ? responseTimes : [...responseTimes, answeredIn]
        };
      }
      return player;
    });

    const sorted = [...updated].sort((a, b) => b.xp - a.xp);
    setPlayers(sorted);
    updateLocalStorage(sorted);
    setCurrentPair(null);
    setCurrentPlayer(null);
    setShowAnswerModal(false);
    const newCount = questionCount + 1;
    setQuestionCount(newCount);
    if (newCount >= questionLimit) {
      setShowWinnerModal(true);
    }
  };

  const handleResetGame = () => {
    const resetXP = players.map(p => ({ ...p, xp: 0, responseTimes: [] }));
    setPlayers(resetXP);
    updateLocalStorage(resetXP);
    setRotateDegree(0);
    setSpinning(false);
    setCurrentPair(null);
    setUsedPairs([]);
    setCurrentPlayer(null);
    setShowAddPlayerModal(false);
    setShowAnswerModal(false);
    setTimeLeft(60);
    setQuestionLimit(null);
    setQuestionCount(0);
    setShowWinnerModal(false);
    setShowQuestionLimitModal(true);
    setPlayerQueue([]);
  };

  const handleQuestionLimitKeyDown = (e) => {
    if (e.key === 'Enter') {
      if (questionLimit && questionLimit > 0) {
        setShowQuestionLimitModal(false);
      }
    }
  };

  const getWinner = () => {
    if (players.length === 0) return null;

    const maxXP = Math.max(...players.map(p => p.xp));
    const topPlayers = players.filter(p => p.xp === maxXP);

    if (topPlayers.length === 1) return topPlayers[0];

    return topPlayers.reduce((best, current) => {
      const avgBest = (best.responseTimes || []).reduce((a, b) => a + b, 0) / (best.responseTimes || []).length || Infinity;
      const avgCurrent = (current.responseTimes || []).reduce((a, b) => a + b, 0) / (current.responseTimes || []).length || Infinity;
      return avgCurrent < avgBest ? current : best;
    });
  };

  const winner = getWinner();

  return (
    <div className="wheel-game-container">
      <div className="first-box">
        <h3 className="questions">QS: {questionLimit}/{questionCount}</h3>
        <div className={`wheel ${spinning ? 'spinning' : ''}`} style={{ transform: `rotate(${rotateDegree}deg)` }}></div>
        <div className="actions-container">
          <button onClick={() => setShowAddPlayerModal(true)} className="add-button">Add Player</button>
          <button onClick={spinWheel} disabled={spinning || players.length === 0 || showAnswerModal || !questionLimit} className="spin-button">
            {spinning ? 'Spinning...' : 'Spin Wheel'}
          </button>
        </div>
      </div>

      {showQuestionLimitModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Enter question limit</h3>
            <input
              type="number"
              min={1}
              placeholder="e.g. 10"
              onChange={e => setQuestionLimit(parseInt(e.target.value))}
              onKeyDown={handleQuestionLimitKeyDown}
              autoFocus
            />
            <button
              onClick={() => {
                if (questionLimit && questionLimit > 0) setShowQuestionLimitModal(false);
              }}
            >
              Start Game
            </button>
            <button
              onClick={() => navigate('/')} className="cancel-button"
            >
              Quit Game
            </button>
          </div>
        </div>
      )}

      {showAddPlayerModal && (
        <div className="modal-overlay" onClick={() => setShowAddPlayerModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3>Add New Player</h3>
            <input
              type="text"
              placeholder="Enter player name"
              value={newPlayer}
              onChange={(e) => setNewPlayer(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAddPlayer()}
              autoFocus
            />
            <button onClick={handleAddPlayer}>Add</button>
          </div>
        </div>
      )}

      {showAnswerModal && (
        <div className="modal-overlay">
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3>Let's try</h3>
            <p><b>Player:</b> {currentPlayer.name}</p>
            <p><b>Word:</b> {currentPair.word}</p>
            <p><b>Tense:</b> {currentPair.tense}</p>
            <p className='timer'>00:{timeLeft.toString().padStart(2, '0')}</p>
            <button className="ok-button" onClick={() => handleAnswer(false)}>OK</button>
          </div>
        </div>
      )}

      {showWinnerModal && winner && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Game Over!</h3>
            <p><b>Winner:</b> {winner.name} ⭐ {winner.xp} XP</p>
            <div className="modal-buttons">
              <button onClick={handleResetGame}>Reset Game</button>
              <Link to="/" onClick={handleResetGame} className="home-button">Go Back to Home</Link>
            </div>
          </div>
        </div>
      )}

      <div className="second-box">
        {players.length > 0 && (
          <div className="players-list">
            <p>Players: {players.length}</p>
            <ul>
              {players.map((player, idx) => (
                <li key={idx}>
                  <div className='player-item'>
                    <IoPerson className='player-icon' /> {player.name} <span className="xp"><b style={{ marginLeft: '10px' }}>{player.xp}⭐</b></span>
                  </div>
                  <FaRegTrashAlt className='trash' onClick={() => handleDeletePlayer(player.name)} />
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <footer className="footer">
        &copy; {new Date().getFullYear()} engnoraa | <Link to="/" onClick={handleResetGame}> Go Back</Link>
      </footer>
    </div>
  );
}
