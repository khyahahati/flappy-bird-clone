import { useState, useEffect, useCallback } from 'react';
import Bird from './components/Bird';
import Pipes from './components/Pipes';
import './App.css';

function App() {
  const [birdPosition, setBirdPosition] = useState(250);
  const [isGameOver, setIsGameOver] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [score, setScore] = useState(0);

  const birdSize = 60;
  const gravity = 3;
  const jumpStrength = 60;
  const gameHeight = 600;
  const gameWidth = 600;
  const ground = gameHeight - birdSize;

  const [pipes, setPipes] = useState([]);
  const pipesWidth = 50;
  const pipesGap = 200;
  const pipesSpeed = 5;

  const getNewPipeHeight = () => Math.random() * 200 + 100; 

  const startGame = () => {
    setGameStarted(true);
    setIsGameOver(false);
    setScore(0);
    setBirdPosition(250);
    // Give the bird an initial jump when the game starts to prevent it from falling immediately.
    setBirdPosition(pos => pos - jumpStrength); 
    setPipes([
      { x: gameWidth, topHeight: getNewPipeHeight(), passed: false }
    ]);
  };

  const playAgain = () => {
    startGame();
  };

  const jump = useCallback(() => {
    if (!gameStarted) {
      startGame();
      return;
    }
    if (!isGameOver) {
      setBirdPosition(pos => Math.max(0, pos - jumpStrength));
    }
  }, [gameStarted, isGameOver, jumpStrength]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.code === 'Space') {
        jump();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [jump]);

  useEffect(() => {
    let gameId;
    if (gameStarted && !isGameOver) {
      gameId = setInterval(() => {
        setBirdPosition(pos => pos + gravity);
        
        setPipes(currentPipes => {
          const newPipes = currentPipes.map(pipe => ({
            ...pipe,
            x: pipe.x - pipesSpeed
          }));
          
          newPipes.forEach(pipe => {
            if (pipe.x + pipesWidth < gameWidth / 2 - birdSize / 2 && !pipe.passed) {
              pipe.passed = true;
              setScore(score => score + 1);
            }
          });
          
          return newPipes.filter(pipe => pipe.x > -pipesWidth);
        });

        if (pipes.length > 0 && pipes[pipes.length - 1].x < gameWidth - 250) {
          setPipes(currentPipes => [
            ...currentPipes,
            { x: gameWidth, topHeight: getNewPipeHeight(), passed: false }
          ]);
        }
        
        if (birdPosition >= ground) {
          setIsGameOver(true);
        }

        const birdX = gameWidth / 2 - birdSize / 2;
        const birdY = birdPosition;
        
        pipes.forEach(pipe => {
          if (
            birdX < pipe.x + pipesWidth &&
            birdX + birdSize > pipe.x &&
            (birdY < pipe.topHeight || birdY + birdSize > pipe.topHeight + pipesGap)
          ) {
            setIsGameOver(true);
          }
        });
      }, 24);
    }

    return () => clearInterval(gameId);
  }, [birdPosition, isGameOver, gameStarted, pipes, ground, birdSize, gameWidth, pipesWidth, pipesGap]);

  return (
    <div className="game-container">
      <div className="game-box">
        {gameStarted && <Bird top={birdPosition} size={birdSize} />}
        {gameStarted && pipes.map((pipe, index) => (
          <Pipes
            key={index}
            x={pipe.x}
            topHeight={pipe.topHeight}
            gap={pipesGap}
            pipeWidth={pipesWidth}
            gameHeight={gameHeight}
          />
        ))}
        {gameStarted && !isGameOver && (
          <div className="score-display">
            Score: {score}
          </div>
        )}
        {!gameStarted && !isGameOver && (
          <div className="message-container">
            <h1>Flappy Bird</h1>
            <button className="start-button" onClick={startGame}>
              Play
            </button>
          </div>
        )}

        {isGameOver && (
          <div className="message-container game-over">
            <h1>Game Over</h1>
            <button className="start-button" onClick={playAgain}>
              Play Again
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;