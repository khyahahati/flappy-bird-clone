import { useState, useEffect, useCallback, useRef } from 'react';
import Bird from './components/Bird';
import Pipes from './components/Pipes';
import './App.css';

function App() {
  // ===========================================
  // GAME STATE MANAGEMENT
  // ===========================================
  const [bird, setBird] = useState({ position: 250, velocity: 0 });
  const [isGameOver, setIsGameOver] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [score, setScore] = useState(0);

  // ===========================================
  // GAME CONSTANTS & PHYSICS PARAMETERS
  // ===========================================
  const birdSize = 60;
  const gravity = 0.4;
  const jumpStrength = -8;
  const terminalVelocity = 8;
  const gameHeight = 600;
  const gameWidth = 600;
  const ground = gameHeight - birdSize;
  const ceiling = 0;

  // Pipe configuration
  const pipesWidth = 50;
  const pipesGap = 200;
  const pipesSpeed = 2;
  const pipeSpacing = 180; // Reduced spacing for earlier pipe arrival

  // ===========================================
  // REFS FOR PERFORMANCE OPTIMIZATION
  // ===========================================
  const pipesRef = useRef([]);
  const gameLoopRef = useRef(null);
  const pipeIdRef = useRef(0); // Unique ID generator for pipes

  // ===========================================
  // UTILITY FUNCTIONS
  // ===========================================
  const getNewPipeHeight = () => {
    const minHeight = 50;
    const maxHeight = gameHeight - pipesGap - 100;
    return Math.random() * (maxHeight - minHeight) + minHeight;
  };

  const resetGameState = () => {
    setBird({ position: 250, velocity: 0 });
    setScore(0);
    pipesRef.current = [];
    pipeIdRef.current = 0;

    // Spawn initial pipe closer to the visible area for earlier arrival
    pipesRef.current = [
      { id: pipeIdRef.current++, x: gameWidth + 50, topHeight: getNewPipeHeight(), passed: false }
    ];
  };

  // ===========================================
  // GAME CONTROL FUNCTIONS
  // ===========================================
  const startGame = () => {
    setGameStarted(true);
    setIsGameOver(false);
    resetGameState();
    setBird({ position: 250, velocity: jumpStrength });
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
      setBird(prev => ({ ...prev, velocity: jumpStrength }));
    }
  }, [gameStarted, isGameOver, jumpStrength]);

  // ===========================================
  // INPUT HANDLING - stable handler, added once
  // ===========================================
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.code === 'Space') {
        e.preventDefault();
        jump();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [jump]);

  // ===========================================
  // COLLISION DETECTION SYSTEM
  // ===========================================
  const checkPipeCollision = (birdY, pipes) => {
    const birdX = gameWidth / 2 - birdSize / 2;
    const birdRight = birdX + birdSize;
    const birdBottom = birdY + birdSize;
    const collisionTolerance = 3;

    for (let pipe of pipes) {
      const pipeLeft = pipe.x;
      const pipeRight = pipe.x + pipesWidth;
      const topPipeBottom = pipe.topHeight;
      const bottomPipeTop = pipe.topHeight + pipesGap;

      const horizontalOverlap = (birdRight > pipeLeft + 10) && (birdX < pipeRight - 10);

      // Uncomment to debug horizontal overlap
      // console.log('Horizontal Overlap Check:', {
      //   birdX,
      //   birdRight,
      //   pipeLeft,
      //   pipeRight,
      //   horizontalOverlap
      // });

      if (horizontalOverlap) {
        const hitTopPipe = birdY < (topPipeBottom - collisionTolerance);
        const hitBottomPipe = birdBottom > (bottomPipeTop + collisionTolerance);

        if (hitTopPipe || hitBottomPipe) {
          console.log('REAL COLLISION:', {
            birdY: Math.round(birdY),
            birdBottom: Math.round(birdBottom),
            topPipeBottom: Math.round(topPipeBottom),
            bottomPipeTop: Math.round(bottomPipeTop),
            gapSize: Math.round(bottomPipeTop - topPipeBottom),
            birdInGap: birdY > topPipeBottom && birdBottom < bottomPipeTop
          });
          return true;
        }
      }
    }
    return false;
  };

  const checkBoundaryCollision = (birdY) => {
    const hitCeiling = birdY < -5;
    const hitGround = birdY >= ground;

    if (hitCeiling || hitGround) {
      console.log('BOUNDARY COLLISION:', {
        birdY: Math.round(birdY), ceiling, ground, hitCeiling, hitGround
      });
    }

    return hitCeiling || hitGround;
  };

  // ===========================================
  // MAIN GAME LOOP
  // ===========================================
  const [renderPipes, setRenderPipes] = useState([]);

  useEffect(() => {
    if (!gameStarted || isGameOver) return;

    const gameLoop = () => {
      setBird(prevBird => {
        const newVelocity = Math.min(prevBird.velocity + gravity, terminalVelocity);
        const newPosition = prevBird.position + newVelocity;

        const hitBoundary = checkBoundaryCollision(newPosition);
        const hitPipe = checkPipeCollision(newPosition, pipesRef.current);

        if (hitBoundary || hitPipe) {
          setIsGameOver(true);
          console.log('Game Over triggered:', { hitBoundary, hitPipe, newPosition: Math.round(newPosition) });
          return prevBird;
        }

        console.log('Bird:', { position: Math.round(newPosition), velocity: newVelocity.toFixed(2) });

        return { position: newPosition, velocity: newVelocity };
      });

      pipesRef.current = pipesRef.current.map(pipe => ({
        ...pipe,
        x: pipe.x - pipesSpeed
      }));

      const birdX = gameWidth / 2;
      pipesRef.current.forEach(pipe => {
        if (pipe.x + pipesWidth < birdX && !pipe.passed) {
          pipe.passed = true;
          setScore(prevScore => {
            console.log('Score increased:', prevScore + 1);
            return prevScore + 1;
          });
        }
      });

      pipesRef.current = pipesRef.current.filter(pipe => pipe.x > -pipesWidth);

      const lastPipe = pipesRef.current[pipesRef.current.length - 1];
      if (!lastPipe || lastPipe.x < gameWidth - pipeSpacing) {
        pipesRef.current.push({
          id: pipeIdRef.current++,
          x: gameWidth,
          topHeight: getNewPipeHeight(),
          passed: false
        });
      }

      setRenderPipes([...pipesRef.current]);

      if (!isGameOver) {
        gameLoopRef.current = requestAnimationFrame(gameLoop);
      }
    };

    gameLoopRef.current = requestAnimationFrame(gameLoop);

    return () => {
      if (gameLoopRef.current) {
        cancelAnimationFrame(gameLoopRef.current);
      }
    };
  }, [gameStarted, isGameOver]);

  // ===========================================
  // RENDER COMPONENT (unchanged)
  // ===========================================
  return (
    <div className="game-container">
      <div className="game-box">
        {gameStarted && <Bird top={bird.position} size={birdSize} />}
        {gameStarted && renderPipes.map((pipe) => (
          <Pipes
            key={pipe.id}
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