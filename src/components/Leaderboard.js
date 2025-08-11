import React, { useState } from 'react';
import './Leaderboard.css';

const Leaderboard = ({ 
  leaderboard, 
  currentScore, 
  gameOver, 
  showNameInput, 
  onNameSubmit, 
  onReset 
}) => {
  const [playerName, setPlayerName] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (playerName.trim()) {
      onNameSubmit(playerName.trim());
      setPlayerName('');
    }
  };

  const handleSkip = () => {
    onNameSubmit('Anonymous');
    setPlayerName('');
  };

  return (
    <div className="leaderboard">
      <h2>🏆 Leaderboard</h2>
      
      {showNameInput && (
        <div className="name-input-section">
          <div className="score-display">
            <h3>Great Game!</h3>
            <p>Your Score: <span className="highlight">{currentScore}</span></p>
          </div>
          
          <form onSubmit={handleSubmit} className="name-form">
            <label htmlFor="playerName">Enter your name:</label>
            <input
              type="text"
              id="playerName"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              placeholder="Your name"
              maxLength={20}
              autoFocus
              required
            />
            <div className="form-buttons">
              <button type="submit" className="submit-btn">
                Save Score
              </button>
              <button type="button" onClick={handleSkip} className="skip-btn">
                Skip
              </button>
            </div>
          </form>
        </div>
      )}

      {gameOver && !showNameInput && (
        <div className="game-over-section">
          <div className="final-score">
            <h3>Final Score</h3>
            <p className="score-number">{currentScore}</p>
          </div>
          <button onClick={onReset} className="new-game-btn">
            New Game
          </button>
        </div>
      )}

      <div className="leaderboard-list">
        <div className="leaderboard-header">
          <span>Rank</span>
          <span>Name</span>
          <span>Score</span>
          <span>Date</span>
        </div>
        
        {leaderboard.length === 0 ? (
          <div className="no-scores">
            <p>No scores yet!</p>
            <p>Play a game to get on the leaderboard!</p>
          </div>
        ) : (
          <div className="scores-list">
            {leaderboard.map((entry, index) => (
              <div 
                key={`${entry.name}-${entry.score}-${entry.date}-${index}`} 
                className={`score-entry ${index < 3 ? `top-${index + 1}` : ''}`}
              >
                <span className="rank">#{index + 1}</span>
                <span className="name">{entry.name}</span>
                <span className="score">{entry.score}</span>
                <span className="date">{entry.date}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="leaderboard-info">
        <p>🏅 Top 3 players get special highlighting!</p>
        <p>💾 Scores are saved locally in your browser</p>
      </div>
    </div>
  );
};

export default Leaderboard;
