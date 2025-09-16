import React from 'react';
import './Bird.css';

/**
 * The Bird component for the Flappy Bird game.
 * It represents the player-controlled character.
 *
 * @param {object} props - The component's props.
 * @param {number} props.top - The vertical position of the bird from the top of the screen.
 * @param {number} props.size - The size (width and height) of the bird.
 * @returns {JSX.Element} The rendered Bird component.
 */
function Bird({ top, size }) {
  // We'll use inline styles to dynamically change the bird's position.
  const birdStyle = {
    top: `${top}px`,
    width: `${size}px`,
    height: `${size}px`,
  };

  return <div className="bird" style={birdStyle}></div>;
}

export default Bird;