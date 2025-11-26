import React, { useState } from 'react';
import './App.css'; 

function Square({ value, onSquareClick }) {
  return (
    <button className="square" onClick={onSquareClick} value={value}>
      {value}
    </button>
  );
}

function Board({ xIsNext, squares, onPlay }) {
  function calculateWinner(currentSquares) {
    const lines = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8],
      [0, 3, 6], [1, 4, 7], [2, 5, 8],
      [0, 4, 8], [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (currentSquares[a] && currentSquares[a] === currentSquares[b] && currentSquares[a] === currentSquares[c]) {
        return currentSquares[a];
      }
    }
    return null;
  }
  
  function handleClick(i) {
    const winner = calculateWinner(squares);
    if (squares[i] || winner) {
      return;
    }

    const nextSquares = squares.slice();

    nextSquares[i] = xIsNext ? 'X' : 'O';

    onPlay(nextSquares);
  }

  const winner = calculateWinner(squares);
  let status;
  let statusClass = 'status';
  
  if (winner) {
    status = 'Winner: ' + winner + '!';
    statusClass += ' winner';
  } else if (squares.every(s => s !== null)) {
    status = "It's a Draw!";
  } else {
    status = 'Next player: ' + (xIsNext ? 'X' : 'O');
  }

  const boardSize = 3;
  const boardRows = [];
  
  for (let row = 0; row < boardSize; row++) {
    const squaresInRow = [];
    for (let col = 0; col < boardSize; col++) {
      const i = row * boardSize + col;
      squaresInRow.push(
        <Square 
          key={i}
          value={squares[i]} 
          onSquareClick={() => handleClick(i)} 
        />
      );
    }
    boardRows.push(<div key={row} className="board-row">{squaresInRow}</div>);
  }

  return (
    <>
      <div className={statusClass}>{status}</div> 
      <div className="game-board-grid">
        {boardRows}
      </div>
    </>
  );
}

export default function App() {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);

  const currentSquares = history[currentMove];
  const xIsNext = currentMove % 2 === 0;

  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function handleRestart() {
    setHistory([Array(9).fill(null)]);
    setCurrentMove(0);
  }

  return (
    <div className="game">
      <h1>Tic-Tac-Toe</h1>
      <div className="game-board-controls">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
        <button className="restart-button" onClick={handleRestart}>
          Restart Game
        </button>
      </div>
      <div className="game-info"></div>
    </div>
  );
}