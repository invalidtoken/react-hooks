// useEffect: HTTP requests
// http://localhost:3000/isolated/exercise/06.js

import * as React from 'react'
import {ErrorBoundary} from 'react-error-boundary'

import {
  fetchPokemon,
  PokemonDataView,
  PokemonForm,
  PokemonInfoFallback,
} from '../pokemon'

function FallbackUI({message, resetErrorBoundary}) {
  return (
    <div role="alert">
      There was an error:
      <pre style={{whiteSpace: 'normal'}}>{message}</pre>
      <button onClick={resetErrorBoundary}>Try again</button>
    </div>
  )
}

function PokemonInfo({pokemonName}) {
  const [{error, pokemonData, status}, setState] = React.useState({
    error: null,
    status: 'idle',
    pokemonData: null,
  })

  React.useEffect(() => {
    if (!pokemonName) {
      return
    }

    setState({status: 'pending', pokemonData: null, error: null})
    fetchPokemon(pokemonName).then(
      pokemonData => {
        setState({status: 'resolved', pokemonData: pokemonData, error: null})
      },
      error => {
        setState({status: 'rejected', pokemonData: null, error: error})
      },
    )
  }, [pokemonName])

  if (status === 'idle') return 'Submit a pokemon'
  else if (status === 'rejected') throw new Error(error.message)
  else if (status === 'pending') {
    return <PokemonInfoFallback name={pokemonName} />
  } else return <PokemonDataView pokemon={pokemonData} />
}

function App() {
  const [pokemonName, setPokemonName] = React.useState('pikachu')

  function handleSubmit(newPokemonName) {
    setPokemonName(newPokemonName)
  }

  function onReset() {
    setPokemonName('')
  }

  return (
    <div className="pokemon-info-app">
      <PokemonForm pokemonName={pokemonName} onSubmit={handleSubmit} />
      <hr />
      <div className="pokemon-info">
        <ErrorBoundary FallbackComponent={FallbackUI} onReset={onReset}>
          <PokemonInfo pokemonName={pokemonName} />
        </ErrorBoundary>
      </div>
    </div>
  )
}

export default App
