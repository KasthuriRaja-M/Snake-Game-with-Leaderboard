import React, { useState, useEffect } from 'react';
import './App.css';
import SnakeGame from './components/SnakeGame';
import Leaderboard from './components/Leaderboard';

function App() {
  const [leaderboard, setLeaderboard] = useState(() => {
    const saved = localStorage.getItem('snakeLeaderboard');
    return saved ? JSON.parse(saved) : [];
  });

  const [currentScore, setCurrentScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [showNameInput, setShowNameInput] = useState(false);

  useEffect(() => {
    localStorage.setItem('snakeLeaderboard', JSON.stringify(leaderboard));
  }, [leaderboard]);

  const handleGameOver = (score) => {
    setCurrentScore(score);
    setGameOver(true);
    setShowNameInput(true);
  };

  const handleNameSubmit = (playerName) => {
    const newEntry = {
      name: playerName,
      score: currentScore,
      date: new Date().toLocaleDateString(),
      time: new Date().toLocaleTimeString()
    };

    const updatedLeaderboard = [...leaderboard, newEntry]
      .sort((a, b) => b.score - a.score)
      .slice(0, 10); // Keep only top 10

    setLeaderboard(updatedLeaderboard);
    setShowNameInput(false);
    setGameOver(false);
  };

  const resetGame = () => {
    setGameOver(false);
    setShowNameInput(false);
    setCurrentScore(0);
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>🐍 Snake Game with Leaderboard</h1>
      </header>
      
      <div className="game-container">
        <div className="game-section">
          <SnakeGame 
            onGameOver={handleGameOver}
            gameOver={gameOver}
            resetGame={resetGame}
          />
        </div>
        
        <div className="leaderboard-section">
          <Leaderboard 
            leaderboard={leaderboard}
            currentScore={currentScore}
            gameOver={gameOver}
            showNameInput={showNameInput}
            onNameSubmit={handleNameSubmit}
            onReset={resetGame}
          />
        </div>
      </div>
    </div>
  );
}

export default App;
