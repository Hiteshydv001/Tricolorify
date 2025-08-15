import React, { useState, useEffect, useCallback } from 'react';
import styles from '../styles/NewGame.module.css';

const GAME_DURATION = 60; // seconds

export default function NewGame() {
    const [gameStarted, setGameStarted] = useState(false);
    const [score, setScore] = useState(0);
    const [timeLeft, setTimeLeft] = useState(GAME_DURATION);
    const [playerPosition, setPlayerPosition] = useState(50);
    const [balloons, setBalloons] = useState([]);
    const [gameOver, setGameOver] = useState(false);

    const generateBalloon = useCallback(() => {
        const colors = ['tricolor', 'tricolor', 'tricolor', 'black']; // 75% chance of tricolor
        const color = colors[Math.floor(Math.random() * colors.length)];
        const position = Math.random() * 90 + 5; // Keep balloons 5% away from edges
        const speed = Math.random() * 2 + 3; // Random speed between 3-5s
        return {
            id: Math.random().toString(36).substring(7),
            position,
            color,
            fallDuration: speed,
            progress: 0, // Track falling progress
            caught: false // Track if balloon is caught
        };
    }, []);

    const spawnBalloon = useCallback(() => {
        if (gameStarted && !gameOver) {
            setBalloons(prev => [...prev, generateBalloon()]);
        }
    }, [gameStarted, gameOver, generateBalloon]);

    const handleBalloonClick = useCallback((balloon) => {
        setBalloons(prev => prev.filter(b => b.id !== balloon.id));
        if (balloon.color === 'tricolor') {
            setScore(prev => prev + 10);
        } else {
            setScore(prev => Math.max(0, prev - 5));
        }
    }, []);

    const handleMouseMove = useCallback((e) => {
        if (!gameStarted || gameOver) return;
        
        const gameArea = e.currentTarget.getBoundingClientRect();
        const relativeX = e.clientX - gameArea.left;
        const newPosition = (relativeX / gameArea.width) * 100;
        setPlayerPosition(Math.max(10, Math.min(90, newPosition)));
    }, [gameStarted, gameOver]);

    const startGame = useCallback(() => {
        setGameStarted(true);
        setGameOver(false);
        setScore(0);
        setTimeLeft(GAME_DURATION);
        setBalloons([]);
    }, []);

    const updateBalloons = useCallback(() => {
        setBalloons(prevBalloons => {
            const updatedBalloons = prevBalloons.map(balloon => {
                if (balloon.caught) return balloon;

                // Update balloon progress
                const newProgress = balloon.progress + (1 / (balloon.fallDuration * 60));
                const balloonY = newProgress * 100; // Convert progress to percentage

                // Check collision with basket
                if (balloonY >= 85 && !balloon.caught) { // 85% is basket position
                    const basketLeft = playerPosition - 10;
                    const basketRight = playerPosition + 10;

                    if (balloon.position >= basketLeft && balloon.position <= basketRight) {
                        // Balloon is caught
                        if (balloon.color === 'tricolor') {
                            setScore(prev => prev + 10);
                        } else {
                            setScore(prev => Math.max(0, prev - 5));
                        }
                        return { ...balloon, caught: true };
                    }
                }

                return { ...balloon, progress: newProgress };
            });

            // Remove balloons that are out of view or caught
            return updatedBalloons.filter(balloon => 
                balloon.progress < 1.2 && !balloon.caught
            );
        });
    }, [playerPosition]);

    useEffect(() => {
        if (!gameStarted) return;

        const spawnInterval = setInterval(spawnBalloon, 1000);
        const updateInterval = setInterval(updateBalloons, 1000 / 60); // 60 FPS updates
        const timer = setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 1) {
                    setGameStarted(false);
                    setGameOver(true);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => {
            clearInterval(spawnInterval);
            clearInterval(updateInterval);
            clearInterval(timer);
        };
    }, [gameStarted, spawnBalloon, updateBalloons]);

    return (
        <div className={styles.wrapper}>
            <div className={styles.gameContainer}>
                <h1 className={styles.title}>Independence Day Game</h1>
                <div className={styles.flagEmoji}>🇮🇳</div>
                
                <div className={styles.instructions}>
                    Catch the tricolor balloons to score points! Avoid the black ones.
                </div>

                <div className={styles.gameStats}>
                    <div className={styles.score}>Score: {score}</div>
                    <div className={styles.time}>Time: {timeLeft}s</div>
                </div>

                <div 
                    className={styles.gameArea}
                    onMouseMove={handleMouseMove}
                >
                    {balloons.map(balloon => (
                        <div
                            key={balloon.id}
                            className={`${styles.balloon} ${styles[balloon.color]}`}
                            style={{
                                left: `${balloon.position}%`,
                                top: `${balloon.progress * 100}%`,
                                transition: 'top 16.67ms linear',
                                opacity: balloon.caught ? 0 : 1
                            }}
                        />
                    ))}
                    <div 
                        className={styles.player}
                        style={{ left: `${playerPosition}%` }}
                    >
                        🧺
                    </div>
                </div>

                {!gameStarted && (
                    <button 
                        className={styles.startBtn}
                        onClick={startGame}
                    >
                        {gameOver ? 'Play Again' : 'Start Game'}
                    </button>
                )}

                {gameOver && (
                    <div className={styles.gameOver}>
                        <h2>Game Over!</h2>
                        <div className={styles.finalScore}>Final Score: {score}</div>
                        <div className={styles.independenceMsg}>
                            Jai Hind! 🇮🇳<br />
                            Happy Independence Day!
                        </div>
                        <button 
                            className={styles.startBtn}
                            onClick={startGame}
                        >
                            Play Again
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
