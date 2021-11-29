// useState: tic tac toe
// http://localhost:3000/isolated/exercise/04.js

import * as React from 'react'
import {useLocalStorageState} from '../utils'

function calculateStatus(winner, squares, nextValue) {
  if (winner) {
    return `Winner: ${winner}`
  } else if (squares.every(Boolean)) {
    return `Cats Game`
  }

  return `Next player: ${nextValue}`
}

function calculateNextValue(squares) {
  return squares.filter(Boolean).length % 2 === 0 ? 'X' : 'O'
}

function calculateWinner(squares) {
  let winner = null
  const winningPaths = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ]

  winningPaths.forEach(path => {
    if (path.every(index => squares[index] === 'X')) {
      winner = 'X'
    }

    if (path.every(index => squares[index] === 'O')) {
      winner = 'O'
    }
  })

  return winner
}

function Board({squares, handleSquaresChange}) {
  const nextValue = calculateNextValue(squares)
  const winner = calculateWinner(squares)

  function selectSquare(square) {
    if (!winner && !squares[square]) {
      const newSquares = [...squares]
      newSquares[square] = nextValue
      handleSquaresChange(newSquares)
    }
  }

  function renderSquare(i) {
    return (
      <button className="square" onClick={() => selectSquare(i)}>
        {squares[i]}
      </button>
    )
  }

  return (
    <div>
      <div className="status">
        {calculateStatus(winner, squares, nextValue)}
      </div>
      <div className="board-row">
        {renderSquare(0)}
        {renderSquare(1)}
        {renderSquare(2)}
      </div>
      <div className="board-row">
        {renderSquare(3)}
        {renderSquare(4)}
        {renderSquare(5)}
      </div>
      <div className="board-row">
        {renderSquare(6)}
        {renderSquare(7)}
        {renderSquare(8)}
      </div>
    </div>
  )
}

function Game() {
  const initializeSquares = () => Array(9).fill(null)
  const [squares, setSquares] = useLocalStorageState(
    'tic-tac-toe',
    initializeSquares,
  )
  const [history, setHistory] = React.useState(() => [squares])

  const addSquaresToHistory = squares => {
    setHistory([...history, squares])
  }

  function handleSquareChange(squares) {
    setSquares(squares)
    addSquaresToHistory(squares)
  }

  function reset() {
    const squares = initializeSquares()
    setSquares(squares)
    setHistory([squares])
  }

  return (
    <div className="game">
      <div className="game-board">
        <Board squares={squares} handleSquaresChange={handleSquareChange} />
        <div>
          <button className="restart" onClick={reset}>
            restart
          </button>
          <ol>
            {history.map((h, _) => {
              const getDisabled = () => {
                if (history.length === 1) return true
              }
              return (
                <li key={_}>
                  <button
                    onChange={() => {}}
                    disabled={_ === 0 || _ === history.length - 1}
                  >
                    go to {_ === 0 ? 'game start' : `move #${_}`}
                  </button>
                </li>
              )
            })}
          </ol>
        </div>
      </div>
    </div>
  )
}

function App() {
  return <Game />
}

export default App
