import { useEffect, useRef, useState } from 'react';
import styles from '../styles/Home.module.css';

const CANVAS_WIDTH = 600;
const CANVAS_HEIGHT = 400;
const BASKET_WIDTH = 80;
const BASKET_HEIGHT = 60;
const BALLOON_SIZE = 40;
const GAME_DURATION = 60; // seconds

class Balloon {
  constructor(x, color) {
    this.x = x;
    this.y = 0;
    this.color = color;
    this.speed = 2 + Math.random() * 2;
  }
}

export default function TricolorGame() {
  const canvasRef = useRef(null);
  const [gameStarted, setGameStarted] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION);
  const [basketX, setBasketX] = useState(CANVAS_WIDTH / 2 - BASKET_WIDTH / 2);
  
  const gameLoop = useRef(null);
  const balloons = useRef([]);
  const animationFrame = useRef(null);

  const drawBalloon = (ctx, balloon) => {
    ctx.beginPath();
    ctx.fillStyle = balloon.color;
    ctx.arc(balloon.x, balloon.y, BALLOON_SIZE/2, 0, Math.PI * 2);
    ctx.fill();
    ctx.closePath();

    // Draw balloon string
    ctx.beginPath();
    ctx.strokeStyle = '#666';
    ctx.moveTo(balloon.x, balloon.y + BALLOON_SIZE/2);
    ctx.lineTo(balloon.x, balloon.y + BALLOON_SIZE);
    ctx.stroke();
    ctx.closePath();
  };

  const drawBasket = (ctx) => {
    ctx.fillStyle = '#8B4513';
    ctx.fillRect(basketX, CANVAS_HEIGHT - BASKET_HEIGHT, BASKET_WIDTH, BASKET_HEIGHT);
  };

  const updateGame = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    // Clear canvas
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // Update and draw balloons
    balloons.current.forEach((balloon, index) => {
      balloon.y += balloon.speed;

      // Check if balloon is caught
      if (balloon.y + BALLOON_SIZE >= CANVAS_HEIGHT - BASKET_HEIGHT &&
          balloon.x >= basketX && 
          balloon.x <= basketX + BASKET_WIDTH) {
        if (balloon.color !== '#000') {
          setScore(prev => prev + 10);
        } else {
          setScore(prev => Math.max(0, prev - 5));
        }
        balloons.current.splice(index, 1);
      }
      // Remove balloons that go off screen
      else if (balloon.y > CANVAS_HEIGHT) {
        balloons.current.splice(index, 1);
      }
      else {
        drawBalloon(ctx, balloon);
      }
    });

    // Draw basket
    drawBasket(ctx);

    // Random balloon spawn
    if (Math.random() < 0.02) {
      const colors = ['#FF9933', '#FFFFFF', '#138808', '#000'];
      const color = colors[Math.floor(Math.random() * colors.length)];
      const x = Math.random() * (CANVAS_WIDTH - BALLOON_SIZE) + BALLOON_SIZE/2;
      balloons.current.push(new Balloon(x, color));
    }

    animationFrame.current = requestAnimationFrame(updateGame);
  };

  const handleMouseMove = (e) => {
    if (!gameStarted) return;
    
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    
    // Keep basket within canvas bounds
    setBasketX(Math.max(0, Math.min(x - BASKET_WIDTH/2, CANVAS_WIDTH - BASKET_WIDTH)));
  };

  const startGame = () => {
    setGameStarted(true);
    setScore(0);
    setTimeLeft(GAME_DURATION);
    balloons.current = [];

    // Start game timer
    gameLoop.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          endGame();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    // Start game animation
    updateGame();
  };

  const endGame = () => {
    setGameStarted(false);
    clearInterval(gameLoop.current);
    cancelAnimationFrame(animationFrame.current);
    balloons.current = [];
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    drawBasket(ctx);
  };

  useEffect(() => {
    return () => {
      clearInterval(gameLoop.current);
      cancelAnimationFrame(animationFrame.current);
    };
  }, []);

  return (
    <div className={styles.gameSection}>
      <h2 className={styles.gameTitle}>🎮 Catch the Tricolor</h2>
      <p className={styles.gameDescription}>
        Catch the falling tricolor balloons (saffron, white, green) to score points! 
        Avoid the black balloons or lose points. Use your mouse to move the basket.
      </p>
      
      <canvas
        ref={canvasRef}
        width={CANVAS_WIDTH}
        height={CANVAS_HEIGHT}
        className={styles.gameCanvas}
        onMouseMove={handleMouseMove}
      />
      
      <div className={styles.gameControls}>
        <div className={styles.gameScore}>Score: {score}</div>
        <div className={styles.gameTimer}>Time: {timeLeft}s</div>
      </div>
      
      <button 
        className={styles.gameButton}
        onClick={startGame}
        disabled={gameStarted}
      >
        {timeLeft === GAME_DURATION ? 'Start Game' : 'Play Again'}
      </button>
    </div>
  );
}
