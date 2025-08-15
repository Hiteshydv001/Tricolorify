import { useEffect, useRef, useState } from 'react';
import styles from '../styles/NewGame.module.css';

function NewCatchTricolor() {
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [gameRunning, setGameRunning] = useState(false);
  const [showGameOver, setShowGameOver] = useState(false);
  const gameAreaRef = useRef(null);
  const playerRef = useRef(null);
  const [playerPosition, setPlayerPosition] = useState(50);

  const balloons = useRef([]);
  const gameTimer = useRef(null);
  const spawnTimer = useRef(null);
  const moveTimer = useRef(null);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!gameRunning) return;
      
      if (e.key === 'ArrowLeft' && playerPosition > 5) {
        setPlayerPosition(prev => Math.max(5, prev - 3));
      } else if (e.key === 'ArrowRight' && playerPosition < 95) {
        setPlayerPosition(prev => Math.min(95, prev + 3));
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [gameRunning, playerPosition]);

  const createScoreEffect = (text, color) => {
    if (!gameAreaRef.current) return;
    
    const effect = document.createElement('div');
    effect.textContent = text;
    effect.style.position = 'absolute';
    effect.style.left = playerPosition + '%';
    effect.style.bottom = '100px';
    effect.style.color = color;
    effect.style.fontSize = '24px';
    effect.style.fontWeight = 'bold';
    effect.style.pointerEvents = 'none';
    effect.style.zIndex = '10';
    effect.style.animation = 'scoreFloat 1s ease-out forwards';
    
    gameAreaRef.current.appendChild(effect);
    setTimeout(() => effect.remove(), 1000);
  };

  const spawnBalloon = () => {
    if (!gameRunning || !gameAreaRef.current) return;
    
    const balloon = document.createElement('div');
    balloon.className = `${styles.balloon}`;
    
    const isTricolor = Math.random() > 0.3;
    if (isTricolor) {
      balloon.classList.add(styles.tricolor);
    } else {
      balloon.classList.add(styles.black);
    }
    balloon.dataset.type = isTricolor ? 'tricolor' : 'black';
    
    balloon.style.left = Math.random() * 90 + 5 + '%';
    
    const fallDuration = Math.random() * 2 + 3; // 3-5 seconds
    balloon.style.animationDuration = `${fallDuration}s`;
    
    gameAreaRef.current.appendChild(balloon);
    balloons.current.push({
      element: balloon,
      type: isTricolor ? 'tricolor' : 'black'
    });
  };

  const checkCollisions = () => {
    if (!playerRef.current) return;
    const playerRect = playerRef.current.getBoundingClientRect();
    
    balloons.current.forEach((balloon, index) => {
      const balloonRect = balloon.element.getBoundingClientRect();
      
      if (balloonRect.bottom >= playerRect.top &&
          balloonRect.top <= playerRect.bottom &&
          balloonRect.right >= playerRect.left &&
          balloonRect.left <= playerRect.right) {
        
        if (balloon.type === 'tricolor') {
          setScore(prev => prev + 10);
          createScoreEffect('+10', '#138808');
        } else {
          setScore(prev => prev - 5);
          createScoreEffect('-5', '#ff0000');
        }
        
        balloon.element.remove();
        balloons.current.splice(index, 1);
      }
    });
  };

  const moveBalloons = () => {
    if (!gameAreaRef.current) return;
    const gameAreaRect = gameAreaRef.current.getBoundingClientRect();
    
    // Use a reverse loop to safely remove items
    for (let i = balloons.current.length - 1; i >= 0; i--) {
      const balloon = balloons.current[i];
      const rect = balloon.element.getBoundingClientRect();
      
      if (rect.top > gameAreaRect.bottom) {
        balloon.element.remove();
        balloons.current.splice(i, 1);
      }
    }
  };

  const startGame = () => {
    setGameRunning(true);
    setScore(0);
    setTimeLeft(60);
    setPlayerPosition(50);
    setShowGameOver(false);
    balloons.current = [];

    document.querySelectorAll(`.${styles.balloon}`).forEach(balloon => balloon.remove());
    
    gameTimer.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          endGame();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    spawnTimer.current = setInterval(spawnBalloon, 800); // Spawn slightly faster for more engaging gameplay
    moveTimer.current = setInterval(() => {
      moveBalloons();
      checkCollisions();
    }, 16); // ~60fps for smooth collision detection
  };

  const endGame = () => {
    setGameRunning(false);
    clearInterval(gameTimer.current);
    clearInterval(spawnTimer.current);
    clearInterval(moveTimer.current);
    setShowGameOver(true);
    
    document.querySelectorAll(`.${styles.balloon}`).forEach(balloon => balloon.remove());
    balloons.current = [];
  };

  const resetGame = () => {
    setShowGameOver(false);
    startGame(); // Start a new game immediately when resetting
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.gameContainer}>
        <div className={styles.flagEmoji}>🇮🇳</div>
        <h1 className={styles.title}>Catch the Tricolor</h1>
        
        <div className={styles.instructions}>
          Use ← → arrow keys to move the person<br />
          Catch tricolor balloons (+10 points) and avoid black ones (-5 points)!
        </div>

        <div className={styles.gameStats}>
          <div className={styles.score}>Score: {score}</div>
          <div className={styles.time}>Time: {timeLeft}s</div>
        </div>

        <div className={styles.gameArea} ref={gameAreaRef}>
          <div 
            className={styles.player} 
            ref={playerRef}
            style={{ left: `${playerPosition}%` }}
          >
            🏃‍♂️
          </div>
        </div>

        <div className={styles.controls}>Use arrow keys ← → to move the person</div>
        
        {!gameRunning && !showGameOver && (
          <button className={styles.startBtn} onClick={startGame}>
            Start Game
          </button>
        )}

        {showGameOver && (
          <div className={styles.gameOver}>
            <div className={styles.flagEmoji}>🇮🇳</div>
            <h2>Game Over!</h2>
            <div className={styles.finalScore}>Score: {score}</div>
            <div className={styles.independenceMsg}>
              Happy Independence Day!<br />
              Jai Hind! 🇮🇳
            </div>
            <button className={styles.startBtn} onClick={resetGame}>
              Play Again
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default NewCatchTricolor;
