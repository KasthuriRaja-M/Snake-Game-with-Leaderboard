import React, { useState, useEffect, useRef, useCallback } from 'react';
import './SnakeGame.css';

const GRID_SIZE = 20;
const GAME_SPEED = 150;

// Power-up types
const POWER_UPS = {
  SPEED_BOOST: { type: 'speed', color: '#00ff00', symbol: '⚡', duration: 5000, effect: 'Speed Boost!' },
  DOUBLE_POINTS: { type: 'points', color: '#ff00ff', symbol: '💎', duration: 8000, effect: 'Double Points!' },
  INVINCIBILITY: { type: 'invincible', color: '#ffff00', symbol: '🛡️', duration: 6000, effect: 'Invincible!' },
  SHRINK: { type: 'shrink', color: '#ff8800', symbol: '🔶', duration: 4000, effect: 'Snake Shrinks!' }
};

const SnakeGame = ({ onGameOver, gameOver, resetGame }) => {
  const [snake, setSnake] = useState([[10, 10]]);
  const [food, setFood] = useState([15, 15]);
  const [powerUp, setPowerUp] = useState(null);
  const [direction, setDirection] = useState([0, 1]);
  const [score, setScore] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [gamePaused, setGamePaused] = useState(false);
  const [activeEffects, setActiveEffects] = useState({});
  const [gameSpeed, setGameSpeed] = useState(GAME_SPEED);
  const [pointMultiplier, setPointMultiplier] = useState(1);
  const [isInvincible, setIsInvincible] = useState(false);
  const canvasRef = useRef(null);
  const gameLoopRef = useRef(null);
  const powerUpTimerRef = useRef(null);

  const generateFood = useCallback(() => {
    const newFood = [
      Math.floor(Math.random() * GRID_SIZE),
      Math.floor(Math.random() * GRID_SIZE)
    ];
    return newFood;
  }, []);

  const generatePowerUp = useCallback(() => {
    // 20% chance to spawn a power-up
    if (Math.random() < 0.2) {
      const powerUpTypes = Object.keys(POWER_UPS);
      const randomType = powerUpTypes[Math.floor(Math.random() * powerUpTypes.length)];
      const newPowerUp = {
        ...POWER_UPS[randomType],
        position: [
          Math.floor(Math.random() * GRID_SIZE),
          Math.floor(Math.random() * GRID_SIZE)
        ]
      };
      return newPowerUp;
    }
    return null;
  }, []);

  const activatePowerUp = useCallback((powerUpType) => {
    const effect = POWER_UPS[powerUpType.type];
    
    setActiveEffects(prev => ({
      ...prev,
      [powerUpType.type]: {
        ...effect,
        startTime: Date.now()
      }
    }));

    // Apply power-up effects
    switch (powerUpType.type) {
      case 'speed':
        setGameSpeed(GAME_SPEED / 2); // Double speed
        break;
      case 'points':
        setPointMultiplier(2);
        break;
      case 'invincible':
        setIsInvincible(true);
        break;
      case 'shrink':
        setSnake(prev => prev.slice(0, Math.max(1, prev.length - 2))); // Remove 2 segments
        break;
      default:
        break;
    }

    // Clear power-up after duration
    setTimeout(() => {
      setActiveEffects(prev => {
        const newEffects = { ...prev };
        delete newEffects[powerUpType.type];
        return newEffects;
      });

      // Reset effects
      switch (powerUpType.type) {
        case 'speed':
          setGameSpeed(GAME_SPEED);
          break;
        case 'points':
          setPointMultiplier(1);
          break;
        case 'invincible':
          setIsInvincible(false);
          break;
        default:
          break;
      }
    }, effect.duration);
  }, []);

  const checkCollision = useCallback((head) => {
    // Skip collision check if invincible
    if (isInvincible) return false;
    
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
  }, [snake, isInvincible]);

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
        setScore(prev => prev + (10 * pointMultiplier));
        setFood(generateFood());
        
        // Chance to spawn power-up after eating food
        const newPowerUp = generatePowerUp();
        if (newPowerUp) {
          setPowerUp(newPowerUp);
          // Power-up disappears after 5 seconds if not collected
          setTimeout(() => {
            setPowerUp(null);
          }, 5000);
        }
      } else {
        newSnake.pop();
      }

      // Check if power-up is collected
      if (powerUp && head[0] === powerUp.position[0] && head[1] === powerUp.position[1]) {
        activatePowerUp(powerUp);
        setPowerUp(null);
      }
      
      return newSnake;
    });
  }, [direction, food, gameOver, gamePaused, checkCollision, onGameOver, score, generateFood, generatePowerUp, powerUp, activatePowerUp, pointMultiplier]);

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

    // Draw snake with invincibility effect
    snake.forEach((segment, index) => {
      if (isInvincible) {
        // Rainbow effect for invincibility
        const hue = (Date.now() / 10 + index * 30) % 360;
        ctx.fillStyle = `hsl(${hue}, 70%, 60%)`;
      } else {
        ctx.fillStyle = index === 0 ? '#e74c3c' : '#27ae60';
      }
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

    // Draw power-up
    if (powerUp) {
      ctx.fillStyle = powerUp.color;
      ctx.beginPath();
      ctx.arc(
        powerUp.position[0] * cellSize + cellSize / 2,
        powerUp.position[1] * cellSize + cellSize / 2,
        cellSize / 2 - 1,
        0,
        2 * Math.PI
      );
      ctx.fill();

      // Draw power-up symbol
      ctx.fillStyle = 'white';
      ctx.font = `${cellSize * 0.6}px Arial`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(
        powerUp.symbol,
        powerUp.position[0] * cellSize + cellSize / 2,
        powerUp.position[1] * cellSize + cellSize / 2
      );
    }
  }, [snake, food, powerUp, isInvincible]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [handleKeyPress]);

  useEffect(() => {
    if (gameStarted && !gameOver && !gamePaused) {
      gameLoopRef.current = setInterval(moveSnake, gameSpeed);
    } else {
      clearInterval(gameLoopRef.current);
    }

    return () => clearInterval(gameLoopRef.current);
  }, [gameStarted, gameOver, gamePaused, moveSnake, gameSpeed]);

  useEffect(() => {
    drawGame();
  }, [drawGame]);

  const startNewGame = () => {
    setSnake([[10, 10]]);
    setFood([15, 15]);
    setPowerUp(null);
    setDirection([0, 1]);
    setScore(0);
    setGameStarted(false);
    setGamePaused(false);
    setActiveEffects({});
    setGameSpeed(GAME_SPEED);
    setPointMultiplier(1);
    setIsInvincible(false);
    resetGame();
  };

  const getActiveEffectsText = () => {
    return Object.values(activeEffects).map(effect => effect.effect).join(', ');
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

      {/* Active Effects Display */}
      {Object.keys(activeEffects).length > 0 && (
        <div className="active-effects">
          <div className="effects-title">Active Effects:</div>
          <div className="effects-list">
            {Object.entries(activeEffects).map(([type, effect]) => {
              const remainingTime = Math.max(0, Math.ceil((effect.duration - (Date.now() - effect.startTime)) / 1000));
              return (
                <div key={type} className={`effect-item ${type}`}>
                  <span className="effect-symbol">{POWER_UPS[type].symbol}</span>
                  <span className="effect-name">{effect.effect}</span>
                  <span className="effect-timer">{remainingTime}s</span>
                </div>
              );
            })}
          </div>
        </div>
      )}
      
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
        <div className="power-up-info">
          <h4>Power-ups:</h4>
          <p>⚡ Green: Speed Boost</p>
          <p>💎 Pink: Double Points</p>
          <p>🛡️ Yellow: Invincibility</p>
          <p>🔶 Orange: Snake Shrinks</p>
        </div>
      </div>
    </div>
  );
};

export default SnakeGame;
