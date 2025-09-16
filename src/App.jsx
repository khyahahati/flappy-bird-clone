import { useState, useEffect } from 'react';
import Bird from './components/Bird';
import Pipes from './components/Pipes';
import './App.css';

function App() {
  // Game constants and state variables
  const [birdPosition, setBirdPosition] = useState(250);
  const [isGameOver, setIsGameOver] = useState(false);
  const birdSize = 40;
  const gravity = 3;
  const jumpStrength = 60;
  const gameHeight = 600;
  const gameWidth = 600;
  const ground = gameHeight - birdSize;
  const [pipesPosition, setPipesPosition] = useState(gameWidth);
  const pipesGap = 150;
  const pipesWidth = 50;
  const topPipeHeight = 200;

  /**
   * The main game loop.
   */
  useEffect(() => {
    let gameId;
    if (!isGameOver) {
      gameId = setInterval(() => {
        // Update bird's vertical position (gravity)
        setBirdPosition((birdPosition) => birdPosition + gravity);
        
        // Update pipes' horizontal position
        setPipesPosition((pipesPosition) => pipesPosition - 5);
        
        // Reset pipes when they go off-screen
        if (pipesPosition < -pipesWidth) {
          setPipesPosition(gameWidth);
        }

        // Game Over condition (bird hitting the ground)
        if (birdPosition >= ground) {
          setIsGameOver(true);
        }

        // --- NEW CODE: Full Collision Check ---
        const birdX = gameWidth / 2 - birdSize / 2;
        const birdY = birdPosition;
        
        // Check if the bird is horizontally aligned with the pipes AND
        // if its vertical position is outside the gap.
        if (
          birdX < pipesPosition + pipesWidth &&
          birdX + birdSize > pipesPosition &&
          (birdY < topPipeHeight || birdY + birdSize > topPipeHeight + pipesGap)
        ) {
          setIsGameOver(true);
        }
        // ---------------------------------------

      }, 24);
    }

    // Cleanup function to stop the interval
    return () => {
      clearInterval(gameId);
    };
  }, [birdPosition, isGameOver, ground, pipesPosition, gameWidth, pipesWidth, birdSize, topPipeHeight, pipesGap]);

  const jump = () => {
    if (!isGameOver) {
      setBirdPosition((birdPosition) => birdPosition - jumpStrength);
    }
  };

  return (
    <div className="game-container" onClick={jump}>
      <Bird top={birdPosition} size={birdSize} />

      <Pipes 
        x={pipesPosition} 
        topHeight={topPipeHeight} 
        gap={pipesGap} 
        pipeWidth={pipesWidth} 
        gameHeight={gameHeight} 
      />
    </div>
  );
}

export default App;