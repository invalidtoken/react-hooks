// useEffect: HTTP requests
// http://localhost:3000/isolated/exercise/06.js

import * as React from 'react'

import {
  fetchPokemon,
  PokemonDataView,
  PokemonErrorBoundary,
  PokemonForm,
  PokemonInfoFallback,
} from '../pokemon'

function PokemonInfo({pokemonName}) {
  const [pokemonData, setPokemonData] = React.useState(null)
  const [error, setError] = React.useState(null)

  React.useEffect(() => {
    if (!pokemonName) {
      return
    }

    setError(null)
    setPokemonData(null)
    fetchPokemon(pokemonName).then(
      pokemonData => {
        setError('sahil')
        setPokemonData(pokemonData)
      },
      error => setError(error),
    )
  }, [pokemonName])

  console.log('pokemon data', pokemonData)
  console.log('error ', error)

  if (!pokemonName) return 'Submit a pokemon'
  if (error)
    return (
      <div role="alert">
        There was an error:
        <pre style={{whiteSpace: 'normal'}}>{error.message}</pre>
      </div>
    )

  if (pokemonData) {
    return <PokemonDataView pokemon={pokemonData} />
  } else {
    return <PokemonInfoFallback name={pokemonName} />
  }
}

function App() {
  const [pokemonName, setPokemonName] = React.useState('')

  function handleSubmit(newPokemonName) {
    setPokemonName(newPokemonName)
  }

  return (
    <div className="pokemon-info-app">
      <PokemonForm pokemonName={pokemonName} onSubmit={handleSubmit} />
      <hr />
      <div className="pokemon-info">
        <PokemonInfo pokemonName={pokemonName} />
      </div>
    </div>
  )
}

export default App
