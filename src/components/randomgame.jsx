import React, { useState, useEffect, useRef } from 'react';
import '../styles/randomgame.css';
import spinDB from '../jsonFiles/spinDB.json';
import { Link } from 'react-router-dom';
import { IoPerson } from "react-icons/io5";
import { FaRegTrashAlt } from "react-icons/fa";

const words = spinDB.words;
const tenses = spinDB.tenses;
const allPairs = [];
words.forEach(word => {
  tenses.forEach(tense => {
    allPairs.push({ word, tense });
  });
});

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
  const timerRef = useRef(null);

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
      const updated = [...players, { name: trimmed, xp: 0 }];
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
      let filteredPlayers = players;
      if (currentPlayer && players.length > 1) {
        filteredPlayers = players.filter(player => player.name !== currentPlayer.name);
      }
      const randomPlayer = filteredPlayers[Math.floor(Math.random() * filteredPlayers.length)];
      setCurrentPair(randomPair);
      setCurrentPlayer(randomPlayer);
      setUsedPairs([...usedPairs, randomPair]);
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
      handleAnswer(true); // penalize = true
      return;
    }

    timerRef.current = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);

    return () => clearInterval(timerRef.current);
  }, [timeLeft, showAnswerModal]);

  const handleAnswer = (penalize = false) => {
    const updated = players.map(player => {
      if (player.name === currentPlayer.name) {
        const xpChange = penalize ? -5 : 10;
        return { ...player, xp: player.xp + xpChange };
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
    setPlayers([]);
    localStorage.removeItem('spinGamePlayers');
    setShowQuestionLimitModal(true);
  };

  const handleQuestionLimitKeyDown = (e) => {
    if (e.key === 'Enter') {
      // Agar haqiqiy son kiritilgan bo'lsa, modalni yopamiz
      if (questionLimit && questionLimit > 0) {
        setShowQuestionLimitModal(false);
      }
    }
  };

  const winner = players.length ? players[0] : null;

  return (
    <div className="wheel-game-container">
      <div className="first-box">
        <div className={`wheel ${spinning ? 'spinning' : ''}`} style={{ transform: `rotate(${rotateDegree}deg)` }}></div>
        <div className="actions-container">
          <button onClick={() => setShowAddPlayerModal(true)} className="add-button">Add Player</button>
          <button onClick={spinWheel} disabled={spinning || players.length === 0 || showAnswerModal} className="spin-button">
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

      {showWinnerModal && (
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
        &copy; {new Date().getFullYear()} engnoraa | <Link to="/"> Go Back</Link>
      </footer>
    </div>
  );
}
