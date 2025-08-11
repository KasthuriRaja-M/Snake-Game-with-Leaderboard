import React, { useState, useEffect, useRef, useCallback } from 'react';
import './SnakeGame.css';

const GRID_SIZE = 20;
const GAME_SPEED = 150;

const SnakeGame = ({ onGameOver, gameOver, resetGame }) => {
  const [snake, setSnake] = useState([[10, 10]]);
  const [food, setFood] = useState([15, 15]);
  const [direction, setDirection] = useState([0, 1]);
  const [score, setScore] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [gamePaused, setGamePaused] = useState(false);
  const canvasRef = useRef(null);
  const gameLoopRef = useRef(null);

  const generateFood = useCallback(() => {
    const newFood = [
      Math.floor(Math.random() * GRID_SIZE),
      Math.floor(Math.random() * GRID_SIZE)
    ];
    return newFood;
  }, []);

  const checkCollision = useCallback((head) => {
    // Wall collision
    if (head[0] < 0 || head[0] >= GRID_SIZE || head[1] < 0 || head[1] >= GRID_SIZE) {
      return true;
    }
    
    // Self collision
    for (let i = 1; i < snake.length; i++) {
      if (head[0] === snake[i][0] && head[1] === snake[i][1]) {
        return true;
      }
    }
    
    return false;
  }, [snake]);

  const moveSnake = useCallback(() => {
    if (gameOver || gamePaused) return;

    setSnake(prevSnake => {
      const newSnake = [...prevSnake];
      const head = [...newSnake[0]];
      
      // Move head
      head[0] += direction[0];
      head[1] += direction[1];
      
      // Check collision
      if (checkCollision(head)) {
        onGameOver(score);
        return prevSnake;
      }
      
      newSnake.unshift(head);
      
      // Check if food is eaten
      if (head[0] === food[0] && head[1] === food[1]) {
        setScore(prev => prev + 10);
        setFood(generateFood());
      } else {
        newSnake.pop();
      }
      
      return newSnake;
    });
  }, [direction, food, gameOver, gamePaused, checkCollision, onGameOver, score, generateFood]);

  const handleKeyPress = useCallback((e) => {
    if (!gameStarted) {
      setGameStarted(true);
      return;
    }

    if (e.key === ' ') {
      e.preventDefault();
      setGamePaused(prev => !prev);
      return;
    }

    if (gamePaused) return;

    switch (e.key) {
      case 'ArrowUp':
        e.preventDefault();
        if (direction[1] !== 1) setDirection([0, -1]);
        break;
      case 'ArrowDown':
        e.preventDefault();
        if (direction[1] !== -1) setDirection([0, 1]);
        break;
      case 'ArrowLeft':
        e.preventDefault();
        if (direction[0] !== 1) setDirection([-1, 0]);
        break;
      case 'ArrowRight':
        e.preventDefault();
        if (direction[0] !== -1) setDirection([1, 0]);
        break;
      default:
        break;
    }
  }, [direction, gameStarted, gamePaused]);

  const drawGame = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const cellSize = canvas.width / GRID_SIZE;

    // Clear canvas
    ctx.fillStyle = '#2c3e50';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw grid
    ctx.strokeStyle = '#34495e';
    ctx.lineWidth = 1;
    for (let i = 0; i <= GRID_SIZE; i++) {
      ctx.beginPath();
      ctx.moveTo(i * cellSize, 0);
      ctx.lineTo(i * cellSize, canvas.height);
      ctx.stroke();
      
      ctx.beginPath();
      ctx.moveTo(0, i * cellSize);
      ctx.lineTo(canvas.width, i * cellSize);
      ctx.stroke();
    }

    // Draw snake
    snake.forEach((segment, index) => {
      ctx.fillStyle = index === 0 ? '#e74c3c' : '#27ae60';
      ctx.fillRect(
        segment[0] * cellSize + 1,
        segment[1] * cellSize + 1,
        cellSize - 2,
        cellSize - 2
      );
    });

    // Draw food
    ctx.fillStyle = '#f39c12';
    ctx.beginPath();
    ctx.arc(
      food[0] * cellSize + cellSize / 2,
      food[1] * cellSize + cellSize / 2,
      cellSize / 2 - 2,
      0,
      2 * Math.PI
    );
    ctx.fill();
  }, [snake, food]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [handleKeyPress]);

  useEffect(() => {
    if (gameStarted && !gameOver && !gamePaused) {
      gameLoopRef.current = setInterval(moveSnake, GAME_SPEED);
    } else {
      clearInterval(gameLoopRef.current);
    }

    return () => clearInterval(gameLoopRef.current);
  }, [gameStarted, gameOver, gamePaused, moveSnake]);

  useEffect(() => {
    drawGame();
  }, [drawGame]);

  const startNewGame = () => {
    setSnake([[10, 10]]);
    setFood([15, 15]);
    setDirection([0, 1]);
    setScore(0);
    setGameStarted(false);
    setGamePaused(false);
    resetGame();
  };

  return (
    <div className="snake-game">
      <div className="game-info">
        <div className="score">Score: {score}</div>
        <div className="controls">
          {!gameStarted && <div className="start-prompt">Press any key to start</div>}
          {gamePaused && <div className="pause-indicator">PAUSED</div>}
          {gameOver && <div className="game-over">GAME OVER</div>}
        </div>
      </div>
      
      <div className="game-board">
        <canvas
          ref={canvasRef}
          width={400}
          height={400}
          className="game-canvas"
        />
        
        {gameOver && (
          <div className="game-overlay">
            <div className="game-over-content">
              <h2>Game Over!</h2>
              <p>Final Score: {score}</p>
              <button onClick={startNewGame} className="restart-btn">
                Play Again
              </button>
            </div>
          </div>
        )}
      </div>
      
      <div className="instructions">
        <h3>Controls:</h3>
        <p>🔼 Arrow Keys: Move Snake</p>
        <p>⏸️ Spacebar: Pause/Resume</p>
        <p>🎯 Eat the orange food to grow and score points!</p>
      </div>
    </div>
  );
};

export default SnakeGame;
