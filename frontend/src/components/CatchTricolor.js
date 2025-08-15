import { useEffect, useRef, useState } from 'react';
import styles from '../styles/Game.module.css';

const GAME_DURATION = 60; // seconds
const BALLOON_SPAWN_RATE = 700; // ms
const BALLOON_MOVE_INTERVAL = 50; // ms
const PLAYER_MOVE_SPEED = 4; // percentage

// Create particles for background effect
const createParticles = () => {
  const particles = [];
  for (let i = 0; i < 50; i++) {
    particles.push({
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 4 + 2,
      speed: Math.random() * 4 + 4
    });
  }
  return particles;
};

const CatchTricolor = () => {
  const [playerPosition, setPlayerPosition] = useState(50);
  const [isInitialized, setIsInitialized] = useState(false);
  const canvasRef = useRef(null);
  const [gameStarted, setGameStarted] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION);
  const [gameOver, setGameOver] = useState(false);
  
  const gameLoopRef = useRef(null);
  const spawnIntervalRef = useRef(null);
  const timerIntervalRef = useRef(null);
  const basketRef = useRef({
    x: 0,
    width: 80,
    height: 40
  });
  const balloonsRef = useRef([]);

  const createBalloon = () => {
    const type = Math.random() > 0.3 ? 'tricolor' : 'black';
    const canvas = canvasRef.current;
    return {
      x: Math.random() * (canvas.width - 30),
      y: -40,
      width: 30,
      height: 40,
      speed: Math.random() * 3 + 4, // Random speed between 4-7
      type
    };
  };

  const createScoreEffect = (value, color) => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    ctx.save();
    ctx.fillStyle = color;
    ctx.font = 'bold 28px Poppins';
    ctx.textAlign = 'center';
    ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
    ctx.shadowBlur = 10;
    
    const text = value > 0 ? `+${value}` : value.toString();
    const x = basketRef.current.x + basketRef.current.width / 2;
    let y = canvas.height - basketRef.current.height - 20;
    
    const animate = (startTime) => {
      const elapsed = Date.now() - startTime;
      const duration = 1000; // 1 second animation
      
      if (elapsed < duration) {
        ctx.clearRect(x - 50, y - 30, 100, 60); // Clear previous text
        const progress = elapsed / duration;
        y -= 50 * progress; // Move up
        const alpha = 1 - progress; // Fade out
        ctx.globalAlpha = alpha;
        ctx.fillText(text, x, y);
        requestAnimationFrame(() => animate(startTime));
      }
      ctx.restore();
    };
    
    animate(Date.now());
  };

  const drawBalloon = (ctx, balloon) => {
    ctx.save();
    
    // Add balloon shadow
    ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
    ctx.shadowBlur = 10;
    ctx.shadowOffsetY = 5;
    
    // Draw balloon string
    ctx.beginPath();
    ctx.strokeStyle = '#666';
    ctx.lineWidth = 2;
    ctx.moveTo(balloon.x + balloon.width/2, balloon.y + balloon.height);
    ctx.lineTo(balloon.x + balloon.width/2, balloon.y + balloon.height + 15);
    ctx.stroke();

    if (balloon.type === 'tricolor') {
      // Draw tricolor balloon with rounded top
      const colors = ['#FF9933', '#FFFFFF', '#138808'];
      colors.forEach((color, i) => {
        ctx.fillStyle = color;
        ctx.beginPath();
        if (i === 0) {
          // Top section with rounded top
          ctx.moveTo(balloon.x, balloon.y + balloon.height/3);
          ctx.quadraticCurveTo(
            balloon.x + balloon.width/2, balloon.y - 10,
            balloon.x + balloon.width, balloon.y + balloon.height/3
          );
          ctx.lineTo(balloon.x + balloon.width, balloon.y + balloon.height/3);
          ctx.lineTo(balloon.x, balloon.y + balloon.height/3);
        } else {
          // Middle and bottom sections
          ctx.fillRect(
            balloon.x,
            balloon.y + (i * balloon.height/3),
            balloon.width,
            balloon.height/3
          );
        }
        ctx.fill();
      });
      
      // Add shine effect
      ctx.beginPath();
      ctx.fillStyle = 'rgba(255,255,255,0.2)';
      ctx.ellipse(
        balloon.x + balloon.width*0.7,
        balloon.y + balloon.height*0.3,
        4, 8, Math.PI/4, 0, 2*Math.PI
      );
      ctx.fill();
    } else {
      // Draw black balloon
      ctx.fillStyle = '#000';
      ctx.beginPath();
      ctx.moveTo(balloon.x, balloon.y + balloon.height);
      ctx.quadraticCurveTo(
        balloon.x + balloon.width/2, balloon.y - 10,
        balloon.x + balloon.width, balloon.y + balloon.height
      );
      ctx.fill();
    }
    ctx.restore();
  };

  const drawBasket = (ctx) => {
    const basket = basketRef.current;
    const y = canvasRef.current.height - basket.height;

    // Add shadow
    ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
    ctx.shadowBlur = 15;
    ctx.shadowOffsetY = 5;

    // Draw basket body
    const gradient = ctx.createLinearGradient(basket.x, y, basket.x, y + basket.height);
    gradient.addColorStop(0, '#8B4513');
    gradient.addColorStop(1, '#654321');
    
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.moveTo(basket.x, y);
    ctx.lineTo(basket.x + basket.width, y);
    ctx.lineTo(basket.x + basket.width - 10, y + basket.height);
    ctx.lineTo(basket.x + 10, y + basket.height);
    ctx.closePath();
    ctx.fill();

    // Draw basket weave pattern
    ctx.strokeStyle = '#703600';
    ctx.lineWidth = 2;
    for (let i = 1; i < 4; i++) {
      ctx.beginPath();
      ctx.moveTo(basket.x, y + (basket.height * i/4));
      ctx.lineTo(basket.x + basket.width, y + (basket.height * i/4));
      ctx.stroke();
    }

    // Add highlight
    ctx.strokeStyle = 'rgba(255,255,255,0.3)';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(basket.x + 10, y + 5);
    ctx.lineTo(basket.x + basket.width - 10, y + 5);
    ctx.stroke();
  };

  const [keyPressed, setKeyPressed] = useState({ left: false, right: false });

  const handleKeyDown = (e) => {
    if (!gameStarted || gameOver) return;
    
    if (e.key === 'ArrowLeft') {
      setKeyPressed(prev => ({ ...prev, left: true }));
    } else if (e.key === 'ArrowRight') {
      setKeyPressed(prev => ({ ...prev, right: true }));
    }
  };

  const handleKeyUp = (e) => {
    if (e.key === 'ArrowLeft') {
      setKeyPressed(prev => ({ ...prev, left: false }));
    } else if (e.key === 'ArrowRight') {
      setKeyPressed(prev => ({ ...prev, right: false }));
    }
  };

  const checkCollision = (balloon) => {
    const basket = basketRef.current;
    return (
      balloon.y + balloon.height > canvasRef.current.height - basket.height &&
      balloon.x + balloon.width > basket.x &&
      balloon.x < basket.x + basket.width
    );
  };

  const gameLoop = () => {
    if (!canvasRef.current || !gameStarted || gameOver) return;

    const ctx = canvasRef.current.getContext('2d');
    const canvas = canvasRef.current;
    const basket = basketRef.current;

    // Update basket position based on player position
    basket.x = (canvas.width * playerPosition / 100) - (basket.width / 2);

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Update and draw balloons
    const now = Date.now();
    balloonsRef.current.forEach((balloon, index) => {
      const elapsed = (now - balloon.startTime) / 1000;
      balloon.y = -40 + (elapsed * (canvas.height + 80) / balloon.speed);

      // Check collision with basket
      if (checkCollision(balloon)) {
        if (balloon.type === 'tricolor') {
          setScore(prev => prev + 10);
          createScoreEffect(10, '#138808');
        } else {
          setScore(prev => Math.max(0, prev - 5));
          createScoreEffect(-5, '#ff0000');
        }
        balloonsRef.current.splice(index, 1);
      }
      // Remove balloons that are off screen
      else if (balloon.y > canvas.height) {
        balloonsRef.current.splice(index, 1);
      }
      else {
        drawBalloon(ctx, balloon);
      }
    });

    // Draw basket
    drawBasket(ctx);

    gameLoopRef.current = requestAnimationFrame(gameLoop);
  };

  const startGame = () => {
    if (gameStarted) return;

    // Clear any existing intervals and animation frames
    clearInterval(spawnIntervalRef.current);
    clearInterval(timerIntervalRef.current);
    cancelAnimationFrame(gameLoopRef.current);

    setGameStarted(true);
    setGameOver(false);
    setScore(0);
    setTimeLeft(GAME_DURATION);
    balloonsRef.current = [];
    basketRef.current.x = (canvasRef.current.width - basketRef.current.width) / 2;

    // Start balloon spawning
    spawnIntervalRef.current = setInterval(() => {
      if (balloonsRef.current.length < 10) {
        const balloon = createBalloon();
        balloon.startTime = Date.now();
        balloonsRef.current.push(balloon);
      }
    }, BALLOON_SPAWN_RATE);

    // Start game loop
    gameLoopRef.current = requestAnimationFrame(gameLoop);

    // Start timer
    timerIntervalRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(spawnIntervalRef.current);
          clearInterval(timerIntervalRef.current);
          cancelAnimationFrame(gameLoopRef.current);
          setGameOver(true);
          setGameStarted(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  useEffect(() => {
    if (!canvasRef.current) return;

    // Cleanup function to clear all intervals and animations
    const cleanup = () => {
      clearInterval(spawnIntervalRef.current);
      clearInterval(timerIntervalRef.current);
      cancelAnimationFrame(gameLoopRef.current);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      window.removeEventListener('resize', updateCanvasSize);
      setGameStarted(false);
      setGameOver(false);
      setKeyPressed({ left: false, right: false });
    };

    const updateCanvasSize = () => {
      const canvas = canvasRef.current;
      const container = canvas.parentElement;
      canvas.width = container.offsetWidth;
      canvas.height = container.offsetHeight;
      
      // Reset basket position when canvas is resized
      if (basketRef.current) {
        basketRef.current.x = (canvas.width - basketRef.current.width) / 2;
      }
    };

    // Initial size setup
    updateCanvasSize();

    // Set up event listeners
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    window.addEventListener('resize', updateCanvasSize);

    // Draw initial basket
    const ctx = canvasRef.current.getContext('2d');
    drawBasket(ctx);
    
    // Start game loop if game is started
    if (gameStarted) {
      gameLoopRef.current = requestAnimationFrame(gameLoop);
    }

    return cleanup;
  }, [gameStarted]);

  return (
    <div className={styles.gameSection}>
      <div className={styles.gameContainer}>
        <div className={styles.gameHeader}>
          <div className={styles.indiaText}>IN</div>
          <h1 className={styles.gameTitle}>Catch the Tricolor</h1>
          
          <div className={styles.gameInstructions}>
            Use ← → arrow keys to move the person<br />
            Catch tricolor balloons (+10 points) and avoid black ones (-5 points)!<br />
            <div className={styles.independenceText}>Happy Independence Day! Jai Hind!</div>
          </div>
        </div>

        <div className={styles.scoreSection}>
          <div className={styles.scoreText}>Score</div>
          <div className={styles.scoreText}>{score}</div>
        </div>

        <div className={styles.timeSection}>
          <div className={styles.timeText}>Time Left</div>
          <div className={styles.timeText}>{timeLeft}s</div>
        </div>

        <canvas 
          ref={canvasRef}
          className={styles.gameCanvas}
        />
        
        {!gameStarted && !gameOver && (
          <button 
            className={styles.gameButton}
            onClick={startGame}
          >
            🚀 Start Game
          </button>
        )}

        {gameOver && (
          <div className={styles.gameOver}>
            <div className={styles.flagEmoji}>🇮🇳</div>
            <h2>Game Over!</h2>
            <div className={styles.finalScore}>Score: {score}</div>
            <div className={styles.independenceMsg}>
              🎉 Amazing Performance! 🎉<br />
              <strong>Happy Independence Day!</strong><br />
              Jai Hind! 🇮🇳
            </div>
            <button 
              className={styles.gameButton}
              onClick={startGame}
            >
              🔄 Play Again
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CatchTricolor;
