import React from 'react';
import './Pipes.css';

/**
 * The Pipes component. It represents a single pair of pipes (top and bottom)
 * that the bird must fly through.
 *
 * @param {object} props - The component's props.
 * @param {number} props.x - The horizontal position of the pipes.
 * @param {number} props.topHeight - The height of the top pipe.
 * @param {number} props.gap - The vertical space between the top and bottom pipes.
 * @param {number} props.pipeWidth - The width of the pipes.
 * @param {number} props.gameHeight - The height of the game area.
 * @returns {JSX.Element} The rendered Pipes component.
 */
function Pipes({ x, topHeight, gap, pipeWidth, gameHeight }) {
  // We calculate the bottom pipe's height based on the other props.
  const bottomHeight = gameHeight - topHeight - gap;

  return (
    <div className="pipes-container" style={{ left: `${x}px`, width: `${pipeWidth}px` }}>
      {/* Top Pipe */}
      <div className="pipe top-pipe" style={{ height: `${topHeight}px` }}></div>
      
      {/* Bottom Pipe */}
      <div className="pipe bottom-pipe" style={{ height: `${bottomHeight}px` }}></div>
    </div>
  );
}

export default Pipes;