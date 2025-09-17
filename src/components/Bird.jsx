import React from 'react';
import './Bird.css';
import birdImage from '../assets/flappy.png'; 

/**
 * The Bird component for the Flappy Bird game.
 * It renders the bird image and positions it dynamically.
 *
 * @param {object} props - The component's props.
 * @param {number} props.top - The vertical position of the bird from the top of the screen.
 * @param {number} props.size - The size (width and height) of the bird.
 * @returns {JSX.Element} The rendered Bird component.
 */
function Bird({ top, size }) {
  const birdStyle = {
    top: `${top}px`,
    width: `${size}px`,
    height: `${size}px`,
  };

  // We are now rendering an <img> tag instead of a <div>
  return <img className="bird" src={birdImage} style={birdStyle} alt="The Flappy Bird" />;
}

export default Bird;