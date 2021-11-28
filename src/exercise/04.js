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

function Board({squares, handleSquaresChange, restart}) {
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
      <button className="restart" onClick={restart}>
        restart
      </button>
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
  const [historyIndex, setHistoryIndex] = React.useState(
    () => history.length - 1,
  )

  const addSquaresToHistory = squares => {
    setHistory([
      ...history.filter((_, index) => index <= historyIndex),
      squares,
    ])
    setHistoryIndex(historyIndex + 1)
  }

  function restart() {
    const squares = initializeSquares()
    setSquares(squares)
    addSquaresToHistory(squares)
  }

  return (
    <div className="game">
      <div className="game-board">
        <Board
          squares={squares}
          handleSquaresChange={squares => {
            setSquares(squares)
            addSquaresToHistory(squares)
          }}
          restart={restart}
        />
        <div>
          <button
            disabled={historyIndex < 1}
            onClick={() => {
              if (historyIndex >= 1) {
                let newHistoryIndex = historyIndex - 1
                setSquares(history[newHistoryIndex])
                setHistoryIndex(newHistoryIndex)
              }
            }}
          >
            back
          </button>
          <button
            disabled={historyIndex >= history.length - 1}
            onClick={() => {
              if (historyIndex < history.length - 1) {
                let newHistoryIndex = historyIndex + 1
                setSquares(history[newHistoryIndex])
                setHistoryIndex(newHistoryIndex)
              }
            }}
          >
            forward
          </button>
        </div>
      </div>
    </div>
  )
}

function App() {
  return <Game />
}

export default App
