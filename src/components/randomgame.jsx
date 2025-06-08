import React, { useState, useEffect } from 'react';
import '../styles/randomgame.css';
import spinDB from '../jsonFiles/spinDB.json';
import { Link } from 'react-router-dom';
import { IoPerson } from "react-icons/io5";
import { FaRegTrashAlt } from "react-icons/fa";

const words = spinDB.words;
const tenses = spinDB.tenses;

// Barcha mumkin bo‘lgan juftliklar
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
  const [showModal, setShowModal] = useState(false);

  // ⬇️ LocalStorage dan boshlang‘ich o‘yinchilarni olish
  useEffect(() => {
    const savedPlayers = JSON.parse(localStorage.getItem('spinGamePlayers'));
    if (savedPlayers && Array.isArray(savedPlayers)) {
      setPlayers(savedPlayers);
    }
  }, []);

  // ⬇️ LocalStorage ga saqlash funksiyasi
  const updateLocalStorage = (updatedPlayers) => {
    localStorage.setItem('spinGamePlayers', JSON.stringify(updatedPlayers));
  };

  // O'yinchi qo‘shish funksiyasi
  const handleAddPlayer = () => {
    const trimmed = newPlayer.trim();
    if (trimmed !== '' && !players.includes(trimmed)) {
      const updated = [...players, trimmed];
      setPlayers(updated);
      updateLocalStorage(updated);
      setNewPlayer('');
      setShowModal(false);
    }
  };

  // ⬇️ O‘yinchini o‘chirish funksiyasi
  const handleDeletePlayer = (name) => {
    const updated = players.filter(player => player !== name);
    setPlayers(updated);
    updateLocalStorage(updated);
    if (currentPlayer === name) {
      setCurrentPlayer(null);
    }
  };

  const spinWheel = () => {
    if (spinning || players.length === 0) return;

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
        pair => !usedPairs.some(
          used => used.word === pair.word && used.tense === pair.tense
        )
      );

      const randomPair = unusedPairs[Math.floor(Math.random() * unusedPairs.length)];

      let filteredPlayers = players;
      if (currentPlayer && players.length > 1) {
        filteredPlayers = players.filter(player => player !== currentPlayer);
      }

      const randomPlayer = filteredPlayers[Math.floor(Math.random() * filteredPlayers.length)];

      setCurrentPair(randomPair);
      setCurrentPlayer(randomPlayer);
      setUsedPairs([...usedPairs, randomPair]);
      setSpinning(false);
    }, 2500);
  };

  return (
    <div className="wheel-game-container">
      <div className="first-box">
        {/* G‘ildirak */}
        <div
          className={`wheel ${spinning ? 'spinning' : ''}`}
          style={{ transform: `rotate(${rotateDegree}deg)` }}
        >
        </div>

        {/* Tugmalar */}
        <div className="actions-container">
          <button onClick={() => setShowModal(true)} className="add-button">
            Add Player
          </button>
          <button onClick={spinWheel} disabled={spinning || players.length === 0} className="spin-button">
            {spinning ? 'Spinning...' : 'Spin Wheel'}
          </button>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3>Add New Player</h3>
            <input
              type="text"
              placeholder="Enter player name"
              value={newPlayer}
              onChange={(e) => setNewPlayer(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleAddPlayer();
              }}
            />
            <button onClick={handleAddPlayer}>Add</button>
          </div>
        </div>
      )}

      <div className="second-box">
        {/* O‘yinchilar ro‘yxati */}
        {players.length > 0 && (
          <div className="players-list">
            <p>Players: {players.length}</p>
            <ul>
              {players.map((player, idx) => (
                <li key={idx}>
                  <div className='player-item'>
                    <IoPerson className='player-icon' /> {player}
                  </div>
                  <FaRegTrashAlt className='trash' onClick={() => handleDeletePlayer(player)} />
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Natija */}
        {currentPair && currentPlayer && !spinning && (
          <div className="result-section">
            <p><b>Player:</b> {currentPlayer}</p>
            <p><b>Word:</b> {currentPair.word}</p>
            <p><b>Tense:</b> {currentPair.tense}</p>
          </div>
        )}
      </div>

      <footer className="footer">
        &copy; {new Date().getFullYear()} engnoraa |
        <Link to="/"> Go Back</Link>
      </footer>
    </div>
  );
}
