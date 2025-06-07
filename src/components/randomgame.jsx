import React, { useState } from 'react';
import '../styles/randomgame.css';
import spinDB from '../jsonFiles/spinDB.json';
import { Link } from 'react-router-dom';

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

  // O'yinchi qo‘shish funksiyasi
  const handleAddPlayer = () => {
    const trimmed = newPlayer.trim();
    if (trimmed !== '' && !players.includes(trimmed)) {
      setPlayers([...players, trimmed]);
      setNewPlayer('');
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
      // Ishlatilmagan juftliklardan bittasini tanlaymiz
      const unusedPairs = allPairs.filter(
        pair => !usedPairs.some(
          used => used.word === pair.word && used.tense === pair.tense
        )
      );

      const randomPair = unusedPairs[Math.floor(Math.random() * unusedPairs.length)];

      // Oxirgi o‘yinchidan farqli player tanlaymiz
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
      {/* G‘ildirak */}
      <div
        className={`wheel ${spinning ? 'spinning' : ''}`}
        style={{ transform: `rotate(${rotateDegree}deg)` }}
      >
        <div className="center-icon">🎯</div>
      </div>

      {/* O‘yinchi qo‘shish */}
      <div className="add-player-section">
        <input
          type="text"
          placeholder="Enter player name"
          value={newPlayer}
          onChange={(e) => setNewPlayer(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleAddPlayer();
          }}
        />
        <button onClick={handleAddPlayer}>Add Player</button>
      </div>

      {/* O‘yinchilar ro‘yxati */}
      {players.length > 0 && (
        <div className="players-list">
          <p>Players:</p>
          <ul>
            {players.map((player, idx) => (
              <li key={idx}>{player}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Spin tugmasi */}
      <button onClick={spinWheel} disabled={spinning || players.length === 0} className="spin-button">
        {spinning ? 'Spinning...' : 'Spin Wheel'}
      </button>

      {/* Natija */}
      {currentPair && currentPlayer && !spinning && (
        <div className="result-section">
          <p><b>Player:</b> {currentPlayer}</p>
          <p><b>Word:</b> {currentPair.word}</p>
          <p><b>Tense:</b> {currentPair.tense}</p>
        </div>
      )}

      <Link to='/'>Home</Link>
    </div>
  );
}
